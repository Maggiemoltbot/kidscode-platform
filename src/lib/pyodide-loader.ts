"use client";

type PyodideRuntime = {
  runPythonAsync: (code: string) => Promise<unknown>;
  setStdout: (options: { batched: (value: string) => void }) => void;
  setStderr: (options: { batched: (value: string) => void }) => void;
};

declare global {
  interface Window {
    loadPyodide?: (options: { indexURL: string }) => Promise<PyodideRuntime>;
    __kidscodePyodidePromise?: Promise<PyodideRuntime>;
  }
}

const PYODIDE_BASE_URL = "https://cdn.jsdelivr.net/pyodide/v0.28.3/full/";

function loadPyodideScript() {
  if (window.loadPyodide) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>("script[data-kidscode-pyodide]");

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Pyodide konnte nicht geladen werden.")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = `${PYODIDE_BASE_URL}pyodide.js`;
    script.async = true;
    script.dataset.kidscodePyodide = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Pyodide konnte nicht geladen werden."));
    document.head.appendChild(script);
  });
}

async function getPyodide() {
  if (!window.__kidscodePyodidePromise) {
    window.__kidscodePyodidePromise = loadPyodideScript().then(async () => {
      if (!window.loadPyodide) {
        throw new Error("Pyodide ist noch nicht bereit.");
      }

      return window.loadPyodide({
        indexURL: PYODIDE_BASE_URL,
      });
    });
  }

  return window.__kidscodePyodidePromise;
}

function getFriendlyPythonError(error: unknown) {
  const rawMessage = error instanceof Error ? error.message : String(error);
  const lastLine = rawMessage
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .at(-1);

  if (/unterminated string|string literal|EOL while scanning/i.test(rawMessage)) {
    return `Hmm, da fehlt noch ein Anfuehrungszeichen 🤔${lastLine ? `\n${lastLine}` : ""}`;
  }

  if (/SyntaxError/i.test(rawMessage)) {
    return `Der Code ist fast richtig, aber Python stolpert noch ueber ein Zeichen.${lastLine ? `\n${lastLine}` : ""}`;
  }

  if (/NameError/i.test(rawMessage)) {
    return `Python kennt einen Namen noch nicht. Schau, ob du ihn vorher gesetzt hast.${lastLine ? `\n${lastLine}` : ""}`;
  }

  return `Da ist noch ein kleiner Fehler im Code.${lastLine ? `\n${lastLine}` : ""}`;
}

export async function runPythonCode(code: string) {
  const output: string[] = [];
  const errors: string[] = [];
  const pyodide = await getPyodide();

  pyodide.setStdout({
    batched: (value) => {
      output.push(value);
    },
  });
  pyodide.setStderr({
    batched: (value) => {
      errors.push(value);
    },
  });

  try {
    const result = await pyodide.runPythonAsync(code);

    if (result !== undefined && result !== null) {
      output.push(String(result));
    }

    return {
      output: output.join("\n").trim(),
      error: errors.join("\n").trim() || null,
    };
  } catch (error) {
    return {
      output: output.join("\n").trim(),
      error: getFriendlyPythonError(error),
    };
  }
}
