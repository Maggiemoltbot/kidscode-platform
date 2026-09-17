export const COMMENT_MARKER = "##COMMENT##";

export type CodeNote = { line: number; text: string };

/** Trennt Lernnotizen vom ausführbaren Code. Eigene Kommentare bleiben unverändert. */
export function parseCodeComments(source: string, language = "python") {
  const lines: string[] = [];
  const notes: CodeNote[] = [];
  let context = language.toLowerCase();
  for (const line of source.split("\n")) {
    if (line.trimStart().startsWith(COMMENT_MARKER)) {
      const message = line.trimStart().slice(COMMENT_MARKER.length).trim();
      const indent = line.slice(0, line.length - line.trimStart().length);
      const text = context === "html" ? `<!-- ${message} -->` :
        context === "css" || context === "javascript" || context === "c" ? `/* ${message} */` : `# ${message}`;
      notes.push({ line: lines.length, text: indent + text });
    } else {
      lines.push(line);
      if (language.toLowerCase() === "html") {
        if (/<style\b/i.test(line)) context = "css";
        if (/<script\b/i.test(line)) context = "javascript";
        if (/<\/(style|script)>/i.test(line)) context = "html";
      }
    }
  }
  return { code: lines.join("\n"), notes };
}

export function filterComments(source: string, showComments: boolean, language = "python") {
  const { code, notes } = parseCodeComments(source, language);
  if (!showComments) return code;
  const lines = code.split("\n");
  return Array.from({ length: lines.length + 1 }, (_, index) => [
    ...notes.filter((note) => note.line === index).map((note) => note.text),
    ...(index < lines.length ? [lines[index]] : []),
  ].join("\n")).filter((_, index) => index < lines.length || notes.some((note) => note.line === index)).join("\n");
}

function explainLine(line: string, language: string) {
  const code = line.trim();
  if (code.includes("____")) return "Ergänze die Lücke passend zur Aufgabe.";
  if (language.toLowerCase() === "html") {
    if (code.startsWith("</")) return "Hier endet dieser Bereich der Webseite.";
    if (code.startsWith("<style")) return "Hier beginnen die Gestaltungsregeln für die Seite.";
    if (code.startsWith("<script")) return "JavaScript merkt sich hier den Anfangswert des Punktestands.";
    if (code.startsWith("<button")) return "Dieser Knopf führt beim Anklicken die angegebene Aktion aus.";
    if (code.startsWith("<h1")) return "Zeige eine große Überschrift.";
    if (code.startsWith("<p")) return "Zeige einen Textabsatz.";
    if (code.startsWith("<a ")) return "Ein Klick auf diesen Link öffnet die angegebene Adresse.";
    if (code.startsWith("<ul")) return "Beginne eine Liste mit Aufzählungspunkten.";
    if (code.startsWith("<li")) return "Füge einen Eintrag zur Liste hinzu.";
    if (code.startsWith("<div")) return "Fasse die folgenden Inhalte in einem Bereich zusammen.";
    if (code.includes("background")) return "Lege die Hintergrundfarbe fest.";
    if (code.includes("padding")) return "Schaffe Platz zwischen Inhalt und Rand.";
    if (code.includes("color")) return "Lege die Textfarbe fest.";
    if (code === "}") return "Beende diese Gestaltungsregel.";
    return "Wähle die Elemente aus, die du gestalten möchtest.";
  }
  if (code.startsWith("#include")) return "Lade die Bibliothek für die Bildschirmausgabe.";
  if (code.startsWith("int main")) return "Hier startet das C-Programm.";
  if (code.startsWith("return")) return "Gib einen Wert an die aufrufende Stelle zurück.";
  if (code === "}") return "Hier endet der Funktionsblock.";
  if (code.startsWith("print")) return "Schreibe den Wert in den Klammern auf den Bildschirm.";
  if (code.startsWith("for ")) return "Wiederhole den eingerückten Code für jeden Wert der Folge.";
  if (code.startsWith("if ")) return "Prüfe die Bedingung. Wenn sie stimmt, folgt der eingerückte Code.";
  if (code === "else:") return "Sonst geht es mit diesem eingerückten Code weiter.";
  if (code.startsWith("class ")) return "Erstelle einen Bauplan für eigene Objekte.";
  if (code.startsWith("def __init__")) return "Diese Funktion bereitet ein neues Objekt vor.";
  if (code.startsWith("def ")) return "Definiere eine Funktion. Ihr Code läuft erst beim Aufrufen.";
  if (code.startsWith("self.")) return "Speichere diesen Wert im aktuellen Objekt.";
  if (/=\s*\[/.test(code)) return "Speichere mehrere Werte gemeinsam in einer Liste.";
  if (code.includes("=")) return "Speichere den Wert rechts unter dem Namen links.";
  return "Rufe die Funktion auf und führe ihren Code aus.";
}

/** Die bisherigen Beispiele bleiben unverändert; jede Codezeile erhält eine Lernnotiz. */
export function annotateCode(code: string, language: string) {
  if (!code) return `${COMMENT_MARKER} Schreibe hier deinen eigenen Code.\n`;
  return code.split("\n").map((line) => line.trim() ?
    `${line.match(/^\s*/)?.[0] ?? ""}${COMMENT_MARKER} ${explainLine(line, language)}\n${line}` : line).join("\n");
}
