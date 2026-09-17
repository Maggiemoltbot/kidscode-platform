import { test } from "node:test";
import assert from "node:assert/strict";
import { shuffleArray, isOfferedOption } from "../src/lib/shuffle";

test("Shuffle erhält jedes Element und verändert die Eingabe nicht", () => {
  const input = Object.freeze(["a", "b", "c", "d"]);
  assert.deepEqual(shuffleArray(input, () => 0), ["b", "c", "d", "a"]);
  assert.deepEqual(input, ["a", "b", "c", "d"]);
  assert.deepEqual(shuffleArray([], () => 0), []);
  assert.deepEqual(shuffleArray(["a"], () => 0), ["a"]);
});

test("Richtige Antwort kann an jeder Position stehen, Sprachbeschriftungen bleiben verbunden", () => {
  const input = [
    { value: "Ja", en: "Yes", fr: "Oui" },
    { value: "Nein", en: "No", fr: "Non" },
    { value: "Vielleicht", en: "Maybe", fr: "Peut-être" },
  ];
  const positions = new Set<number>();
  for (const first of [0, 0.4, 0.9]) for (const second of [0, 0.9]) {
    const random = [first, second];
    const shuffled = shuffleArray(input, () => random.shift()!);
    positions.add(shuffled.findIndex((option) => option.value === "Ja"));
    for (const option of shuffled) assert.equal(option, input.find((item) => item.value === option.value));
    assert.equal(shuffled.find((option) => option.value === "Ja")?.fr, "Oui");
  }
  assert.deepEqual([...positions].sort(), [0, 1, 2]);
});

test("Antwortprüfung akzeptiert nur angebotene kanonische Werte, keine Indizes oder Übersetzungen", () => {
  assert.ok(isOfferedOption(["Nein", "Ja"], "Ja"));
  assert.ok(isOfferedOption(["Ja", "Nein"], "Ja"));
  for (const invalid of ["0", "1", "Yes", "Oui", " Ja ", ""]) assert.equal(isOfferedOption(["Ja", "Nein"], invalid), false);
  assert.equal(isOfferedOption(null, "Ja"), false);
});
