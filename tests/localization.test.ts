import { test } from "node:test";
import assert from "node:assert/strict";
import { createTranslator } from "next-intl";
import { prisma } from "../src/lib/prisma";
import de from "../messages/de.json";
import en from "../messages/en.json";
import fr from "../messages/fr.json";
import { localize, translatedFields } from "../src/lib/localization";

test("Alle UI-Schlüssel sind in drei Sprachen vorhanden und formatierbar", () => {
  for (const [locale, messages] of Object.entries({ de, en, fr })) {
    assert.deepEqual(Object.keys(messages.ui).sort(), Object.keys(de.ui).sort());
    const errors: unknown[] = [];
    const t = createTranslator({ locale, messages, onError: (error) => errors.push(error) });
    for (const key of Object.keys(messages.ui) as (keyof typeof de.ui)[]) {
      assert.ok(t(`ui.${key}`, { count: 3, avatar: "🤖" }).length > 0);
    }
    assert.deepEqual(errors, [], locale);
  }
});

test("Sprachwechsel übersetzt verschachtelte Inhalte, aber keine Lösungswerte oder Code", () => {
  const source = { title: "Grüße", title_en: "Hello", title_fr: "Bonjour", options: ["Ja", "Nein"], options_en: ["Yes", "No"], starterCode: 'print("Grüße")', lesson: { theory: "Text", theory_fr: "Explication" } };
  const result = localize(source, "fr");
  assert.equal(result.title, "Bonjour");
  assert.equal(result.lesson.theory, "Explication");
  assert.deepEqual(result.options, source.options);
  assert.equal(result.starterCode, source.starterCode);
  assert.equal(source.title, "Grüße");
  assert.equal(localize(source, "de"), source);
  const privateData = { title_en: "Hello", correctAnswer: "secret", options: ["secret"] };
  assert.deepEqual(translatedFields(privateData), { title_en: "Hello" });
});

test("Seed enthält 4 Kurse, 16 Lektionen und 64 vollständig übersetzte Übungen", async () => {
  // Nur lesen: vorhandene Profile und Fortschritte werden nicht verändert.
  try {
    const courses = await prisma.course.findMany({ select: { title_en: true, title_fr: true, description_en: true, description_fr: true } });
    const lessons = await prisma.lesson.findMany({ select: { title_en: true, title_fr: true, theory_en: true, theory_fr: true } });
    const exercises = await prisma.exercise.findMany();
    assert.equal(courses.length, 4);
    assert.equal(lessons.length, 16);
    assert.equal(exercises.length, 64);
    for (const row of [...courses, ...lessons]) for (const value of Object.values(row)) assert.ok(value?.trim());
    for (const row of exercises) {
      for (const key of ["question_en", "question_fr", "hint_en", "hint_fr"] as const) assert.ok(row[key]?.trim(), `${row.id}: ${key}`);
      if (row.type !== "MULTIPLE_CHOICE") continue;
      const options = row.options as string[];
      assert.ok(options.includes(row.correctAnswer), row.id);
      for (const language of ["en", "fr"] as const) {
        const translated = row[`options_${language}`] as string[];
        assert.equal(translated.length, options.length, row.id);
        assert.ok(translated.every((value) => typeof value === "string" && value.length > 0), row.id);
      }
    }
  } finally { await prisma.$disconnect(); }
});
