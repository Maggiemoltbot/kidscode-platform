import assert from "node:assert/strict";
import test from "node:test";
import { prisma } from "../src/lib/prisma";
import { parseCodeComments } from "../src/lib/code-comments";

test("Alle 16 Beispiele und 22 Code-Aufgaben enthalten gespeicherte Lernnotizen", async () => {
  try {
    const lessons = await prisma.lesson.findMany({ select: { sampleCode: true, language: true } });
    const exercises = await prisma.exercise.findMany({ where: { type: { in: ["CODE_GAP", "FREE_CODE"] } }, select: { starterCode: true } });
    assert.equal(lessons.length, 16);
    assert.equal(exercises.length, 22);
    for (const lesson of lessons) {
      assert.ok(lesson.sampleCode);
      const { code, notes } = parseCodeComments(lesson.sampleCode, lesson.language);
      assert.equal(notes.length, code.split("\n").filter((line) => line.trim()).length);
      assert.equal(code.includes("##COMMENT##"), false);
    }
    for (const exercise of exercises) {
      assert.ok(exercise.starterCode);
      const { code, notes } = parseCodeComments(exercise.starterCode);
      assert.ok(notes.length > 0);
      assert.equal(code.includes("##COMMENT##"), false);
    }
  } finally { await prisma.$disconnect(); }
});
