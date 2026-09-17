import { annotateCode } from "./code-comments";

const sampleCodeByLesson: Record<string, string> = {
  "lesson-python-hallo-welt": 'print("Hallo!")',
  "lesson-python-variablen": 'name = "Mia"\nprint("Hallo " + name)',
  "lesson-python-rechnen": "alter = 6\nprint(alter + 1)",
  "lesson-python-if":
    'name = "Max"\nif name == "Max":\n    print("Hallo Max")\nelse:\n    print("Hallo Freund")',
  "lesson-python-fehler-finden": 'print("Fertig")',
  "lesson-html-bausteine": "<h1>Hallo Welt</h1>\n<p>Das ist meine erste Webseite.</p>",
  "lesson-html-text-und-links":
    '<p>Ich mag Roboter.</p>\n<a href="https://example.com">Mein Link</a>',
  "lesson-html-listen": "<ul>\n  <li>Apfel</li>\n  <li>Banane</li>\n</ul>",
  "lesson-intermediate-schleifen": 'for i in range(4):\n    print("Rakete startet!")',
  "lesson-intermediate-funktionen":
    'def begruessen(name):\n    print("Hallo " + name)\n\nbegruessen("Byte")',
  "lesson-intermediate-listen": 'farben = ["rot", "blau", "grün"]\nprint(farben[2])',
  "lesson-intermediate-css":
    "<style>\n  h1 { color: purple; }\n  .karte { background: orange; padding: 16px; }\n</style>\n<h1>Meine Seite</h1>\n<div class=\"karte\">Hallo!</div>",
  "lesson-intermediate-js-intro":
    "<button onclick=\"document.getElementById('text').textContent='Hallo Button'\">Klick</button>\n<p id=\"text\">Warte...</p>",
  "lesson-expert-c-intro": '#include <stdio.h>\n\nint main() {\n  printf("Hallo C!");\n  return 0;\n}',
  "lesson-expert-python-oop":
    'class Figur:\n    def __init__(self, name):\n        self.name = name\n\nfigur = Figur("Byte")\nprint(figur.name)',
  "lesson-expert-mini-projekt":
    "<h1>Punkte-Spiel</h1>\n<button onclick=\"score = score + 1; document.getElementById('score').textContent = score\">Punkt</button>\n<p id=\"score\">0</p>\n<script>let score = 0;</script>",
};

const starterCodeByExercise: Record<string, string> = {
  "exercise-python-hallo-gap-1": 'print("____")',
  "exercise-python-variablen-gap-1": 'name = "____"\nprint("Hallo " + name)',
  "exercise-python-rechnen-free-1": "alter = 6\nprint(alter + 1)",
  "exercise-python-if-gap-1":
    'name = "____"\nif name == "Max":\n    print("Hallo Max")\nelse:\n    print("Hallo Freund")',
  "exercise-python-fehler-gap-1": 'print("____")',
  "exercise-html-bausteine-gap-1": "<h1>____</h1>\n<p>Meine erste Webseite</p>",
  "exercise-html-links-free-1": "<p>Mein Lieblingstier ist ...</p>",
  "exercise-html-listen-gap-1": "<ul>\n  ____Apfel</li>\n</ul>",
  "exercise-intermediate-schleifen-gap-1": 'for i in range(____):\n    print("Rakete startet!")',
  "exercise-intermediate-schleifen-free-1": 'for i in range(3):\n    print("Stern")',
  "exercise-intermediate-funktionen-gap-1":
    'def begruessen(name):\n    print("Hallo " + name)\n\nbegruessen("____")',
  "exercise-intermediate-funktionen-free-1": "def zeige_zahl():\n    print(3 + 3)\n\nzeige_zahl()",
  "exercise-intermediate-listen-gap-1": 'farben = ["rot", "blau", "grün"]\nprint(farben[____])',
  "exercise-intermediate-listen-free-1": 'tiere = ["Katze", "Hund", "Fisch"]\nprint(tiere[1])',
  "exercise-intermediate-css-gap-1":
    "<style>\n  h1 { color: ____; }\n</style>\n<h1>Meine Seite</h1>",
  "exercise-intermediate-css-free-1":
    "<style>\n  .karte {\n    background: orange;\n    padding: 16px;\n  }\n</style>\n<div class=\"karte\">\n  <h1>Meine Karte</h1>\n</div>",
  "exercise-intermediate-js-gap-1":
    "<button onclick=\"document.getElementById('text').textContent='____'\">Klick</button>\n<p id=\"text\">Warte...</p>",
  "exercise-intermediate-js-free-1":
    "<button onclick=\"document.getElementById('text').textContent='Geschafft!'\">Klick</button>\n<p id=\"text\">Warte...</p>",
  "exercise-expert-oop-gap-1":
    "class Figur:\n    def __init__(self, name):\n        self.name = name\n\nfigur = Figur(\"____\")\nprint(figur.name)",
  "exercise-expert-oop-free-1":
    'class Nachricht:\n    def sagen(self):\n        print("Hallo Klasse")\n\nnachricht = Nachricht()\nnachricht.sagen()',
  "exercise-expert-projekt-gap-1":
    "<h1>Punkte-Spiel</h1>\n<button onclick=\"____; document.getElementById('score').textContent = score\">Punkt</button>\n<p id=\"score\">0</p>\n<script>let score = 0;</script>",
  "exercise-expert-projekt-free-1":
    "<h1>Mein Mini-Projekt</h1>\n<button onclick=\"document.getElementById('status').textContent='Fertig!'\">Start</button>\n<p id=\"status\">Noch nicht gestartet</p>",
};

function getDefaultSample(language: string) {
  if (language.toLowerCase() === "html") {
    return "<h1>Meine Idee</h1>\n<p>Hier steht dein Text.</p>";
  }

  if (language.toLowerCase() === "c") {
    return '#include <stdio.h>\n\nint main() {\n  printf("Meine Idee");\n  return 0;\n}';
  }

  return 'print("Meine Idee")';
}

function getStarterCode(exerciseId: string, exerciseType: string, language: string) {
  const starterCode = starterCodeByExercise[exerciseId];

  if (starterCode !== undefined) {
    return starterCode;
  }

  if (exerciseType === "FREE_CODE") {
    return "";
  }

  if (language.toLowerCase() === "html") {
    return "<h1>____</h1>\n<p>Hier steht dein Text.</p>";
  }

  return 'print("____")';
}


export function getAnnotatedSampleCode(id: string, language: string) {
  return annotateCode(sampleCodeByLesson[id] ?? getDefaultSample(language), language);
}

export function getAnnotatedStarterCode(id: string, type: string, language: string) {
  return type === "MULTIPLE_CHOICE" ? "" : annotateCode(getStarterCode(id, type, language), language);
}

