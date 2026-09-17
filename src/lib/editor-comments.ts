import { StateEffect, StateField } from "@codemirror/state";
import { Decoration, EditorView, WidgetType, type DecorationSet } from "@codemirror/view";
import { parseCodeComments } from "./code-comments";

export const showLearningComments = StateEffect.define<boolean>();

class CommentWidget extends WidgetType {
  constructor(readonly text: string) { super(); }
  eq(other: CommentWidget) { return this.text === other.text; }
  toDOM() {
    const element = document.createElement("div");
    element.className = "cm-learning-comment";
    element.textContent = this.text;
    return element;
  }
  ignoreEvent() { return true; }
}

/** Lernnotizen sind Dekorationen, keine Änderungen am Dokument oder Undo-Verlauf. */
export function learningComments(source: string, language: string, shown = false) {
  const parsed = parseCodeComments(source, language);
  type NotesState = { shown: boolean; notes: { pos: number; text: string }[]; decorations: DecorationSet };
  return StateField.define<NotesState>({
    create(state) {
      const notes = parsed.notes.map((note) => ({
        pos: note.line < state.doc.lines ? state.doc.line(note.line + 1).from : state.doc.length,
        text: note.text,
      }));
      return { shown, notes, decorations: decorate(notes, shown) };
    },
    update(value, transaction) {
      let visible = value.shown;
      for (const effect of transaction.effects) if (effect.is(showLearningComments)) visible = effect.value;
      if (!transaction.docChanged && visible === value.shown) return value;
      const notes = value.notes.map((note) => ({ ...note,
        pos: transaction.state.doc.lineAt(transaction.changes.mapPos(note.pos, 1)).from,
      }));
      return { shown: visible, notes, decorations: decorate(notes, visible) };
    },
    provide: (field) => EditorView.decorations.from(field, (value) => value.decorations),
  });
}

function decorate(notes: { pos: number; text: string }[], shown: boolean) {
  return shown ? Decoration.set(notes.map((note) => Decoration.widget({
    widget: new CommentWidget(note.text), side: -1, block: true,
  }).range(note.pos)), true) : Decoration.none;
}
