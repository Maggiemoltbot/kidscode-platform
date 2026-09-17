export const CONCEPT_TYPES = ["function", "if_else", "for_loop", "variable"] as const;
export type ConceptType = typeof CONCEPT_TYPES[number];
export function isConceptType(value: unknown): value is ConceptType {
  return CONCEPT_TYPES.some((type) => type === value);
}
export const conceptTypeByLesson: Record<string, ConceptType> = {
  "lesson-python-variablen": "variable",
  "lesson-python-if": "if_else",
  "lesson-intermediate-schleifen": "for_loop",
  "lesson-intermediate-funktionen": "function",
};
