import { test } from "node:test";
import assert from "node:assert/strict";
import { wordsFromAlignment, isLanguage, feedback } from "../src/lib/tts";

test("Wortzeiten erhalten Umlaute, Satzzeichen und Leerraum", () => {
  const text = "Grüße!  Ça va?";
  const characters = Array.from(text);
  const result = wordsFromAlignment(text, { characters, character_start_times_seconds: characters.map((_, i) => i / 10), character_end_times_seconds: characters.map((_, i) => (i + 1) / 10) });
  assert.deepEqual(result.map((word) => word.word), ["Grüße!", "Ça", "va?"]);
  assert.equal(result[1].start, 0.8);
  assert.equal(result[2].end, 1.4);
});
test("Abweichende Normalisierung und defekte Zeitdaten liefern kein falsches Highlight", () => {
  assert.deepEqual(wordsFromAlignment("12", { characters: ["z", "w"], character_start_times_seconds: [0, 1], character_end_times_seconds: [1, 2] }), []);
  assert.deepEqual(wordsFromAlignment("x", { characters: ["x"], character_start_times_seconds: [NaN], character_end_times_seconds: [1] }), []);
  assert.deepEqual(wordsFromAlignment("Text"), []);
});
test("Drei Sprachen und vier Feedbackvarianten je Ergebnis", () => {
  for (const language of ["de", "en", "fr"] as const) {
    assert.ok(isLanguage(language));
    assert.equal(feedback[language].correct.length, 4);
    assert.equal(feedback[language].incorrect.length, 4);
  }
  assert.equal(isLanguage("es"), false);
});
