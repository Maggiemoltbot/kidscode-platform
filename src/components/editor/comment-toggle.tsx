"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/components/i18n/language-provider";

const seenKey = "kidscode-comment-explanation-seen";
const labels = {
  de: { show: "Kommentare einblenden", hide: "Kommentare ausblenden", title: "💬 Was sind Kommentare?", text: "Kommentare werden vom Computer nicht ausgeführt — sie sind nur Notizen für Menschen, die den Code lesen.", syntax: "So erkennst du Kommentare:", note: "Die eingeblendeten Lernnotizen kannst du nicht bearbeiten. Eigene Kommentare bleiben Teil deines Codes." },
  en: { show: "Show comments", hide: "Hide comments", title: "💬 What are comments?", text: "Comments are not executed by the computer — they are notes for people reading the code.", syntax: "You can recognize comments by:", note: "The learning notes cannot be edited. Your own comments remain part of your code." },
  fr: { show: "Afficher les commentaires", hide: "Masquer les commentaires", title: "💬 Que sont les commentaires ?", text: "Les commentaires ne sont pas exécutés par l’ordinateur : ce sont des notes pour les personnes qui lisent le code.", syntax: "Voici comment reconnaître les commentaires :", note: "Les notes pédagogiques ne sont pas modifiables. Tes propres commentaires restent dans ton code." },
};

export function useCommentToggle() {
  const [showComments, setShowComments] = useState(false);
  const [explain, setExplain] = useState(false);
  function toggle() {
    if (!showComments) {
      try {
        setExplain(localStorage.getItem(seenKey) !== "true");
        localStorage.setItem(seenKey, "true");
      } catch { setExplain(true); }
    } else setExplain(false);
    setShowComments(!showComments);
  }
  return { showComments, explain, toggle };
}

export function CommentToggle({ showComments, explain, toggle, language, editor = false }: ReturnType<typeof useCommentToggle> & { language: string; editor?: boolean }) {
  const t = labels[useLanguage()];
  const reducedMotion = useReducedMotion();
  const syntax = language.toLowerCase() === "html" ? "HTML: <!-- … --> · CSS/JavaScript: /* … */" : language.toLowerCase() === "c" ? "C: /* … */" : "Python: #";
  return <div className="space-y-2">
    <button type="button" onClick={toggle} aria-pressed={showComments} className="flex min-h-11 items-center gap-2 text-sm font-medium text-[#007AFF]">
      <span aria-hidden="true">💬</span>{showComments ? t.hide : t.show}
    </button>
    <AnimatePresence initial={false}>
      {showComments && explain && <motion.div role="note" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: reducedMotion ? 0 : 0.2 }} className="overflow-hidden">
        <div className="mb-3 rounded-[13px] border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-800">{t.title}</p>
          <p className="mt-1 text-sm text-amber-700">{t.text}</p>
          <p className="mt-1 text-sm text-amber-700">{t.syntax} <code>{syntax}</code></p>
          {editor && <p className="mt-1 text-sm text-amber-700">{t.note}</p>}
        </div>
      </motion.div>}
    </AnimatePresence>
  </div>;
}
