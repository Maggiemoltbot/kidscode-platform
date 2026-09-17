import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server";
import { POST } from "../src/app/api/tts/route";

test("TTS lehnt ungültige Requests ab und degradiert ohne API-Schlüssel", async () => {
  const request = (body: string, origin?: string) => new NextRequest("http://localhost/api/tts", {
    method: "POST", headers: { "Content-Type": "application/json", ...(origin ? { origin } : {}) }, body,
  });
  assert.equal((await POST(request("{"))).status, 400);
  assert.equal((await POST(request(JSON.stringify({ text: "Hallo", language: "es" })))).status, 400);
  assert.equal((await POST(request("{}", "https://foreign.example"))).status, 403);
  assert.equal((await POST(request("x".repeat(16001)))).status, 413);
  for (const speed of ["1", 0.6, 1.6, 1.01]) {
    assert.equal((await POST(request(JSON.stringify({ text: "Hallo", language: "de", speed })))).status, 400);
  }
  assert.equal((await POST(request(JSON.stringify({ text: "Hallo", language: "de", voice: "invalid" })))).status, 400);
  const previous = process.env.ELEVENLABS_API_KEY;
  delete process.env.ELEVENLABS_API_KEY;
  try {
    const response = await POST(request(JSON.stringify({ text: `Ungecachter Test ${Date.now()}`, language: "de" })));
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), { error: "unavailable" });
  } finally {
    if (previous !== undefined) process.env.ELEVENLABS_API_KEY = previous;
  }
});

test("TTS sendet Tags, Stimme und Tempo; Cache trennt Einstellungen", async () => {
  const previousFetch = global.fetch;
  const previousKey = process.env.ELEVENLABS_API_KEY;
  process.env.ELEVENLABS_API_KEY = "test-only";
  const calls: { url: string; body: Record<string, unknown> }[] = [];
  global.fetch = async (url, init) => {
    calls.push({ url: String(url), body: JSON.parse(String(init?.body)) });
    return Response.json({ audio_base64: "dGVzdA==" });
  };
  try {
    const text = `Teste if ${crypto.randomUUID()}`;
    const invoke = (speed: number, voice = "jessica") => POST(new NextRequest("http://localhost/api/tts", {
      method: "POST", body: JSON.stringify({ text, language: "de", speed, voice }),
    }));
    assert.equal((await invoke(1)).status, 200);
    assert.equal((await invoke(1)).status, 200);
    assert.equal(calls.length, 1);
    const fast = await invoke(1.5);
    assert.equal((await fast.json()).playback_rate, 1.25);
    assert.equal((await invoke(1, "laura")).status, 200);
    assert.equal(calls.length, 3);
    assert.match(calls[0].url, /cgSgspJ2msm6clMCkdW9/);
    assert.match(String(calls[0].body.text), /<lang xml:lang="en-US">if<\/lang>/);
    assert.deepEqual(calls[1].body.voice_settings, { stability: 0.5, similarity_boost: 0.8, speed: 1.2 });
  } finally {
    global.fetch = previousFetch;
    if (previousKey === undefined) delete process.env.ELEVENLABS_API_KEY;
    else process.env.ELEVENLABS_API_KEY = previousKey;
  }
});
