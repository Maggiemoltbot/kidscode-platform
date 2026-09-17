import assert from "node:assert/strict";
import test from "node:test";
import { preprocessTTSText } from "../src/lib/tts-preprocessor";
import { isTTSSpeed, isTTSVoice, ttsPlaybackSettings } from "../src/lib/tts-settings";
import { withoutLanguageTags, wordsFromAlignment } from "../src/lib/tts";

test("SSML-Zeitdaten markieren weiterhin das sichtbare Keyword", () => {
  const characters = [...preprocessTTSText("Nutze if jetzt", "de")];
  const alignment = withoutLanguageTags({ characters, character_start_times_seconds: characters.map((_, i) => i), character_end_times_seconds: characters.map((_, i) => i + 1) });
  assert.deepEqual(wordsFromAlignment("Nutze if jetzt", alignment).map((word) => word.word), ["Nutze", "if", "jetzt"]);
});

test("Sprach-Tags erfassen ganze Keywords ohne Verschachtelung", () => {
  assert.equal(preprocessTTSText("if elif gift if_name für", "de"), '<lang xml:lang="en-US">if</lang> <lang xml:lang="en-US">elif</lang> gift if_name für');
  assert.equal(preprocessTTSText('Nutze `if print("Hi")`!', "de"), 'Nutze <lang xml:lang="en-US">if print("Hi")</lang>!');
  assert.equal(preprocessTTSText("```python\nfor i in range(3):\n    print(i)```", "de"), '<lang xml:lang="en-US">for i in range(3):\n    print(i)</lang>');
  assert.equal(preprocessTTSText("if `print`", "en"), "if `print`");
  assert.equal(preprocessTTSText("`x < 3 && y > 1`", "fr"), '<lang xml:lang="en-US">x &lt; 3 &amp;&amp; y &gt; 1</lang>');
  assert.equal(preprocessTTSText('<break time="3s"/>', "de"), '&lt;<lang xml:lang="en-US">break</lang> time="3s"/&gt;');
});

test("Tempo und Stimme sind begrenzt; 1,5× überfordert die Synthese nicht", () => {
  for (const speed of [0.7, 1, 1.2, 1.5]) assert.equal(isTTSSpeed(speed), true);
  for (const speed of [null, "1", NaN, Infinity, 0.6, 1.6, 1.05]) assert.equal(isTTSSpeed(speed), false);
  assert.equal(isTTSVoice("jessica"), true);
  assert.equal(isTTSVoice("toString"), false);
  assert.deepEqual(ttsPlaybackSettings(1.5), { synthesisSpeed: 1.2, playbackRate: 1.25 });
  assert.deepEqual(ttsPlaybackSettings(0.7), { synthesisSpeed: 0.7, playbackRate: 1 });
});
