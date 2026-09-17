import assert from "node:assert/strict";
import test from "node:test";
import { EditorState } from "@codemirror/state";
import { history, undo } from "@codemirror/commands";
import { annotateCode, filterComments, parseCodeComments } from "../src/lib/code-comments";
import { getAnnotatedSampleCode, getAnnotatedStarterCode } from "../src/lib/lesson-code";
import { learningComments, showLearningComments } from "../src/lib/editor-comments";

test("Lernnotizen verändern weder Code noch eigene Kommentare und Einrückung", () => {
  const code = '# Meine Notiz\nname = "##COMMENT## bleibt Text"\nif True:\n    print(name)\n';
  const annotated = annotateCode(code, "python");
  assert.equal(filterComments(annotated, false), code);
  assert.ok(filterComments(annotated, true).includes("# Schreibe den Wert"));
  assert.equal(parseCodeComments(annotated).notes.length, 4);
  assert.equal(filterComments(annotateCode("", "python"), false), "");
});

test("HTML-, CSS-, JavaScript- und C-Kommentare nutzen gültige Syntax", () => {
  const html = "<style>\n h1 { color: purple; }\n</style>\n<script>\nlet score = 0;\n</script>\n<h1>Hallo</h1>";
  const shown = filterComments(annotateCode(html, "html"), true, "html");
  assert.match(shown, /<!-- Hier beginnen/);
  assert.match(shown, /\/\* Lege die Textfarbe/);
  assert.match(shown, /<script>\n\/\*/);
  assert.equal(filterComments(annotateCode(html, "html"), false), html);
  const c = getAnnotatedSampleCode("lesson-expert-c-intro", "c");
  assert.match(filterComments(c, false), /^#include <stdio.h>/);
  assert.match(filterComments(c, true, "c"), /^\/\* Lade/);
});

test("Lücken bleiben ungelöst, leere freie Aufgaben erhalten nur eine Notiz", () => {
  const gap = getAnnotatedStarterCode("exercise-intermediate-schleifen-gap-1", "CODE_GAP", "python");
  assert.equal(filterComments(gap, false), 'for i in range(____):\n    print("Rakete startet!")');
  assert.match(gap, /Ergänze die Lücke/);
  assert.equal(filterComments(getAnnotatedStarterCode("unknown", "FREE_CODE", "python"), false), "");
  assert.equal(getAnnotatedStarterCode("unknown", "MULTIPLE_CHOICE", "python"), "");
});

test("Editor-Toggle erhält Änderungen, Positionen und Undo-Verlauf", () => {
  const source = annotateCode('name = "Mia"\nprint(name)', "python");
  const field = learningComments(source, "python");
  let state = EditorState.create({ doc: filterComments(source, false), extensions: [field, history()] });
  state = state.update({ changes: { from: 0, insert: "# Selbst geschrieben\n" } }).state;
  const edited = state.doc.toString();
  state = state.update({ effects: showLearningComments.of(true) }).state;
  assert.equal(state.doc.toString(), edited);
  assert.equal(state.field(field).decorations.size, 2);
  assert.equal(state.field(field).notes[0].pos, state.doc.line(2).from);
  state = state.update({ effects: showLearningComments.of(false) }).state;
  assert.equal(state.field(field).decorations.size, 0);
  assert.equal(state.doc.toString(), edited);
  assert.equal(undo({ state, dispatch: (transaction) => { state = transaction.state; } }), true);
  assert.equal(state.doc.toString(), filterComments(source, false));
});
