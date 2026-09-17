"use client";

import { useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/components/i18n/language-provider";
import { isConceptType, type ConceptType } from "@/lib/concepts";

const labels = {
  de: { show: "Konzept zeigen 🔍", hide: "Konzept ausblenden", name: "Probiere einen Namen aus", count: "Anzahl der Durchläufe", next: "Nächster Durchlauf", reset: "Noch einmal", input: "EINGABE", output: "AUSGABE", yes: "✓ JA", no: "✗ NEIN", box: "Schachtel mit Label: name", printed: "print zeigt Text auf dem Bildschirm; es gibt keinen Wert mit return zurück.", function: "Eine Funktion verarbeitet eine Eingabe.", if_else: "Eine Bedingung wählt genau einen Weg.", for_loop: "Die Schleife wiederholt denselben Befehl.", variable: "Eine Variable bewahrt einen Wert unter einem Namen auf." },
  en: { show: "Show concept 🔍", hide: "Hide concept", name: "Try a name", count: "Number of repetitions", next: "Next repetition", reset: "Start again", input: "INPUT", output: "OUTPUT", yes: "✓ YES", no: "✗ NO", box: "Box with label: name", printed: "print displays text on screen; it does not return a value with return.", function: "A function processes an input.", if_else: "A condition selects exactly one path.", for_loop: "The loop repeats the same instruction.", variable: "A variable stores a value under a name." },
  fr: { show: "Voir le concept 🔍", hide: "Masquer le concept", name: "Essaie un prénom", count: "Nombre de répétitions", next: "Répétition suivante", reset: "Recommencer", input: "ENTRÉE", output: "SORTIE", yes: "✓ OUI", no: "✗ NON", box: "Boîte avec étiquette : name", printed: "print affiche du texte à l’écran ; il ne renvoie pas de valeur avec return.", function: "Une fonction traite une entrée.", if_else: "Une condition choisit un seul chemin.", for_loop: "La boucle répète la même instruction.", variable: "Une variable conserve une valeur sous un nom." },
};

function Node({ x = 60, y, width = 320, lines, active = true }: { x?: number; y: number; width?: number; lines: string[]; active?: boolean }) {
  return <g opacity={active ? 1 : 0.4}>
    <rect x={x} y={y} width={width} height={70} rx={16} fill={active ? "#f5f3ff" : "#f8fafc"} stroke={active ? "#8b5cf6" : "#cbd5e1"} strokeWidth={2} />
    {lines.map((line, index) => <text key={index} x={x + width / 2} y={y + (lines.length === 1 ? 41 : 29 + index * 24)} textAnchor="middle" fill="#312e81" fontSize={16} fontFamily="ui-monospace, monospace">{line}</text>)}
  </g>;
}

export function ConceptVisual({ type, data = {} }: { type: ConceptType; data?: { name?: string; count?: number } }) {
  const language = useLanguage();
  const t = labels[language];
  const reducedMotion = useReducedMotion();
  const id = useId().replace(/:/g, "");
  const [name, setName] = useState(data.name ?? (type === "variable" ? "Mia" : type === "function" ? "Byte" : "Max"));
  const [count, setCount] = useState(Number.isInteger(data.count) ? Math.max(1, Math.min(5, data.count!)) : 4);
  const [step, setStep] = useState(0);
  const yes = name === "Max";
  const output = type === "if_else" ? (yes ? "Hallo Max" : "Hallo Freund") : type === "for_loop" ? "🚀".repeat(step) : type === "variable" ? name : `Hallo ${name}`;
  const arrow = (path: string, active = true, delay = 0) => <motion.path key={`${path}-${name}-${count}-${step}`} d={path} fill="none" stroke={active ? "#7c3aed" : "#cbd5e1"} strokeWidth={3} markerEnd={`url(#${id}-arrow)`}
    initial={reducedMotion ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: reducedMotion ? 0 : 0.45, delay: reducedMotion ? 0 : delay }} />;

  return <div className="space-y-4">
    <p className="text-sm text-muted-foreground">{t[type]}</p>
    {type === "for_loop" ? <div className="flex flex-wrap items-center gap-3">
      <label htmlFor={`${id}-count`} className="text-sm font-medium">{t.count}</label>
      <select id={`${id}-count`} value={count} onChange={(event) => { setCount(Number(event.target.value)); setStep(0); }} className="min-h-11 rounded-lg border bg-background px-3">
        {[1, 2, 3, 4, 5].map((value) => <option key={value}>{value}</option>)}
      </select>
      <button type="button" onClick={() => setStep(step >= count ? 0 : step + 1)} className="min-h-11 rounded-full bg-primary/10 px-4 text-sm font-semibold text-primary">{step >= count ? t.reset : t.next}</button>
    </div> : <div className="flex flex-wrap items-center gap-3">
      <label htmlFor={`${id}-name`} className="text-sm font-medium">{t.name}</label>
      <input id={`${id}-name`} value={name} maxLength={16} onChange={(event) => setName(event.target.value)} className="min-h-11 w-44 rounded-lg border bg-background px-3" />
    </div>}
    <svg viewBox={`0 0 440 ${type === "for_loop" ? 135 + count * 65 : 330}`} className="w-full rounded-[20px] bg-white" role="img" aria-labelledby={`${id}-title ${id}-description`}>
      <title id={`${id}-title`}>{t[type]}</title>
      <desc id={`${id}-description`}>{t.input}: {type === "for_loop" ? `range(${count})` : name}. {t.output}: {output || "—"}</desc>
      <defs><marker id={`${id}-arrow`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8" fill="#7c3aed" /></marker></defs>
      {type === "function" && <>
        <Node y={15} lines={[`${t.input}: name`, JSON.stringify(name)]} />
        {arrow("M220 85 V119")}
        <Node y={125} lines={["def begruessen(name):", 'print("Hallo " + name)']} />
        {arrow("M220 195 V229", true, 0.2)}
        <Node y={235} lines={[t.output, JSON.stringify(output)]} />
      </>}
      {type === "if_else" && <>
        <Node y={15} lines={[`name = ${JSON.stringify(name)}`]} />
        {arrow("M220 85 V119")}
        <path d="M220 115 L360 165 L220 215 L80 165 Z" fill="#eff6ff" stroke="#3b82f6" strokeWidth={2} />
        <text x={220} y={171} textAnchor="middle" fontSize={18} fill="#1e3a8a">name == "Max"</text>
        {arrow("M150 190 L110 239", yes, 0.2)}{arrow("M290 190 L330 239", !yes, 0.2)}
        <text x={78} y={220} textAnchor="middle" fill="#166534" fontSize={14}>{t.yes}</text>
        <text x={364} y={220} textAnchor="middle" fill="#991b1b" fontSize={14}>{t.no}</text>
        <Node x={10} y={245} width={200} lines={['"Hallo Max"']} active={yes} />
        <Node x={230} y={245} width={200} lines={['"Hallo Freund"']} active={!yes} />
      </>}
      {type === "variable" && <>
        <Node y={25} lines={[`name = ${JSON.stringify(name)}`]} />
        {arrow("M220 95 V144")}
        <rect x={95} y={155} width={250} height={130} rx={18} fill="#eff6ff" stroke="#3b82f6" strokeWidth={2} />
        <text x={220} y={190} textAnchor="middle" fontSize={16} fill="#1e3a8a">{t.box}</text>
        <text x={220} y={245} textAnchor="middle" fontSize={24} fill="#6d28d9">{JSON.stringify(name)}</text>
      </>}
      {type === "for_loop" && <>
        <Node y={15} lines={[`range(${count}) → [${Array.from({ length: count }, (_, i) => i).join(", ")}]`, 'print("Rakete startet!")']} />
        {Array.from({ length: count }, (_, i) => <g key={i} opacity={step > i ? 1 : 0.4}>
          {arrow(`M50 85 V${120 + i * 65} H85`, step > i, i * 0.1)}
          <rect x={95} y={98 + i * 65} width={315} height={48} rx={13} fill="#f5f3ff" stroke="#8b5cf6" />
          <text x={112} y={128 + i * 65} fontSize={16} fill="#312e81">{`i=${i} → Rakete startet! ${step > i ? "🚀" : ""}`}</text>
        </g>)}
      </>}
    </svg>
    <p role="status" className="rounded-[13px] bg-primary/5 px-4 py-3 text-sm"><span className="font-semibold">{t.output}: </span>{output || "—"}{type === "for_loop" && ` (${step}/${count})`}</p>
    {type === "function" && <p className="text-xs text-muted-foreground">{t.printed}</p>}
  </div>;
}

export function ConceptSection({ type }: { type: string | null }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const language = useLanguage();
  if (!isConceptType(type)) return null;
  return <section className="space-y-4 rounded-apple-xl bg-card p-6 shadow-sm">
    <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls={id} className="min-h-11 text-sm font-semibold text-primary">{open ? labels[language].hide : labels[language].show}</button>
    <div id={id} hidden={!open}>{open && <ConceptVisual type={type} />}</div>
  </section>;
}
