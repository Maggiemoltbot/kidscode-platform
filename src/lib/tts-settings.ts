export const TTS_VOICES = {
  jessica: { id: "cgSgspJ2msm6clMCkdW9", name: "Jessica" },
  laura: { id: "FGY2WhTYpPnrIDTdsKH5", name: "Laura" },
  charlotte: { id: "XB0fDUnXU5powFXDhCwa", name: "Charlotte" },
} as const;
export type TTSVoice = keyof typeof TTS_VOICES;
export function isTTSVoice(value: unknown): value is TTSVoice {
  return typeof value === "string" && Object.hasOwn(TTS_VOICES, value);
}
export function isTTSSpeed(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0.7 && value <= 1.5 && Math.abs(value * 10 - Math.round(value * 10)) < 0.00001;
}
export function ttsPlaybackSettings(speed: number) {
  // ElevenLabs unterstützt 0,7–1,2; den Rest übernimmt der Browser.
  const synthesisSpeed = Math.min(speed, 1.2);
  return { synthesisSpeed, playbackRate: speed / synthesisSpeed };
}
