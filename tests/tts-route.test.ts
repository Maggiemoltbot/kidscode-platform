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
