"use client";

import { useEffect, useRef } from "react";
import { html } from "@codemirror/lang-html";
import { python } from "@codemirror/lang-python";
import { basicSetup, EditorView } from "codemirror";
import { learningComments, showLearningComments } from "@/lib/editor-comments";
import { CommentToggle, useCommentToggle } from "./comment-toggle";

type CodeEditorProps = {
  language: "python" | "html";
  value: string;
  annotatedCode?: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
};

const editorTheme = EditorView.theme({
  "&": {
    minHeight: "18rem",
    backgroundColor: "transparent",
    color: "var(--foreground)",
    fontSize: "14px",
  },
  ".cm-scroller": {
    minHeight: "18rem",
    fontFamily: "var(--font-kidscode-mono)",
  },
  ".cm-content": {
    padding: "16px",
  },
  ".cm-gutters": {
    backgroundColor: "color-mix(in oklab, var(--muted) 68%, transparent)",
    color: "var(--muted-foreground)",
    border: "none",
  },
  ".cm-activeLine": {
    backgroundColor: "color-mix(in oklab, var(--primary) 8%, transparent)",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "color-mix(in oklab, var(--primary) 10%, transparent)",
  },
  "&.cm-focused": {
    outline: "none",
  },
  ".cm-learning-comment": {
    color: "var(--muted-foreground)",
    padding: "2px 0",
    whiteSpace: "pre-wrap",
    fontStyle: "italic",
    fontSize: "13px",
  },
});

export function CodeEditor({ language, value, annotatedCode = "", onChange, readOnly = false }: CodeEditorProps) {
  const comments = useCommentToggle();
  const commentsShown = useRef(comments.showComments);
  commentsShown.current = comments.showComments;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  const valueRef = useRef(value);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const editor = new EditorView({
      doc: valueRef.current,
      extensions: [
        basicSetup,
        language === "html" ? html() : python(),
        EditorView.lineWrapping,
        EditorView.editable.of(!readOnly),
        editorTheme,
        learningComments(annotatedCode, language, commentsShown.current),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChangeRef.current(update.state.doc.toString());
          }
        }),
      ],
      parent: containerRef.current,
    });

    editorRef.current = editor;

    return () => {
      editor.destroy();
      editorRef.current = null;
    };
  }, [language, readOnly, annotatedCode]);

  useEffect(() => {
    editorRef.current?.dispatch({ effects: showLearningComments.of(comments.showComments) });
  }, [comments.showComments]);

  useEffect(() => {
    const editor = editorRef.current;

    if (!editor) {
      return;
    }

    const currentValue = editor.state.doc.toString();

    if (currentValue !== value) {
      editor.dispatch({
        changes: {
          from: 0,
          to: currentValue.length,
          insert: value,
        },
      });
    }
  }, [value]);

  return (
    <div className="space-y-2">
      <CommentToggle {...comments} language={language} editor />
      <div
        ref={containerRef}
        className="overflow-hidden rounded-lg border border-border bg-background shadow-inner"
      />
    </div>
  );
}
