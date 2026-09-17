import assert from "node:assert/strict";
import test from "node:test";
import { conceptTypeByLesson, isConceptType } from "../src/lib/concepts";

test("Vier passende Lektionen erhalten ausschließlich bekannte Konzepte", () => {
  assert.equal(Object.keys(conceptTypeByLesson).length, 4);
  assert.equal(conceptTypeByLesson["lesson-python-variablen"], "variable");
  assert.equal(conceptTypeByLesson["lesson-python-if"], "if_else");
  assert.equal(conceptTypeByLesson["lesson-intermediate-schleifen"], "for_loop");
  assert.equal(conceptTypeByLesson["lesson-intermediate-funktionen"], "function");
  for (const value of Object.values(conceptTypeByLesson)) assert.equal(isConceptType(value), true);
  for (const value of [null, undefined, "unknown", "toString"]) assert.equal(isConceptType(value), false);
});
