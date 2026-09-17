import type { Language } from "./tts";

export const CODE_KEYWORDS = [
  "if", "then", "else", "elif", "for", "while", "in", "not", "and", "or", "True", "False", "None",
  "print", "input", "return", "def", "class", "import", "from", "range", "len", "type",
  "int", "str", "float", "bool", "list", "dict", "set", "var", "let", "const", "function",
  "console", "log", "html", "css", "div", "span", "head", "body", "href", "src",
  "loop", "break", "continue", "pass", "lambda", "yield", "with", "try", "except",
  "finally", "raise", "assert", "global", "nonlocal", "del", "is",
] as const;

function escapeXML(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function preprocessTTSText(text: string, language: Language): string {
  if (language === "en") return text;
  // Ein Durchlauf verhindert verschachtelte Tags innerhalb von Code-Blöcken.
  const tokens = new RegExp("```(?:[a-z]+\\n)?([\\s\\S]*?)```|`([^`\\n]+)`|(?<![\\p{L}\\p{N}_])(?:" + CODE_KEYWORDS.join("|") + ")(?![\\p{L}\\p{N}_])", "gu");
  let result = "";
  let cursor = 0;
  for (const match of text.matchAll(tokens)) {
    const index = match.index!;
    result += escapeXML(text.slice(cursor, index));
    result += `<lang xml:lang="en-US">${escapeXML(match[1] ?? match[2] ?? match[0])}</lang>`;
    cursor = index + match[0].length;
  }
  return result + escapeXML(text.slice(cursor));
}
