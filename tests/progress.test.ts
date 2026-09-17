import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdtempSync, readdirSync, unlinkSync, rmdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

test("Fortschritts-API prüft Werte statt Positionen und vergibt XP nur einmal", async () => {
  // Nur die Tabellenstruktur übernehmen, niemals Profile oder Fortschritte kopieren.
  const Database = createRequire(import.meta.url)("better-sqlite3");
  const directory = mkdtempSync(join(tmpdir(), "kidscode-progress-test-"));
  const file = join(directory, "test.db");
  const source = new Database("dev.db", { readonly: true });
  const schema = source.prepare("SELECT sql FROM sqlite_master WHERE sql IS NOT NULL AND name NOT LIKE 'sqlite_%' ORDER BY type = 'index'").all() as { sql: string }[];
  source.close();
  const target = new Database(file);
  for (const entry of schema) target.exec(entry.sql);
  target.close();
  process.env.DATABASE_URL = `file:${file}`;
  const { prisma } = await import("../src/lib/prisma");
  const { POST } = await import("../src/app/api/progress/route");
  try {
    const user = await prisma.user.create({ data: { username: "API-Test", avatar: "🤖" } });
    const course = await prisma.course.create({ data: {
      title: "Test", description: "Test", level: "BEGINNER", order: 0,
      lessons: { create: { title: "Test", theory: "Test", language: "python", order: 0,
        exercises: { create: { type: "MULTIPLE_CHOICE", question: "Wähle Grün", hint: "Grün",
          options: ["Rot", "Blau", "Grün"], options_en: ["Red", "Blue", "Green"],
          correctAnswer: "Grün", xpReward: 10 } } } },
    }, include: { lessons: { include: { exercises: true } } } });
    const exerciseId = course.lessons[0].exercises[0].id;
    const submit = (answer: string) => POST(new Request("http://localhost/api/progress", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, exerciseId, answer }),
    }));
    for (const invalid of ["2", "Green", "Nicht angeboten"]) {
      assert.equal((await submit(invalid)).status, 400);
    }
    assert.equal(await prisma.progress.count(), 0);
    const wrong = await (await submit("Rot")).json();
    assert.equal(wrong.correct, false);
    assert.equal(wrong.xpEarned, 0);
    const correct = await (await submit("Grün")).json();
    assert.equal(correct.correct, true);
    assert.equal(correct.xpEarned, 10);
    assert.equal(correct.attempts, 2);
    const repeated = await (await submit("Grün")).json();
    assert.equal(repeated.xpEarned, 0);
    assert.equal(repeated.totalXp, 10);
    assert.equal(repeated.alreadyCompleted, true);
  } finally {
    await prisma.$disconnect();
    // Ausschließlich die selbst erzeugten temporären Testdateien entfernen.
    for (const name of readdirSync(directory)) unlinkSync(join(directory, name));
    rmdirSync(directory);
  }
});
