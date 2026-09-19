export const DEFAULT_VOICE_LANG = "zh-HK";

type SpeechWindow = typeof globalThis & {
  SpeechRecognition?: new () => BrowserSpeechRecognition;
  webkitSpeechRecognition?: new () => BrowserSpeechRecognition;
  speechSynthesis?: SpeechSynthesis;
  SpeechSynthesisUtterance?: typeof SpeechSynthesisUtterance;
};

type BrowserSpeechRecognition = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
};

function speechWindow(): SpeechWindow | null {
  if (typeof globalThis === "undefined") return null;
  return globalThis as SpeechWindow;
}

export function canUseBrowserSpeech(): boolean {
  const w = speechWindow();
  return Boolean(w && (w.SpeechRecognition || w.webkitSpeechRecognition));
}

export function canSpeak(): boolean {
  const w = speechWindow();
  return Boolean(w?.speechSynthesis && w.SpeechSynthesisUtterance);
}

export function createHoldToTalk(lang = DEFAULT_VOICE_LANG) {
  let recognition: BrowserSpeechRecognition | null = null;
  let finalText = "";
  let resolveStop: ((text: string) => void) | null = null;

  function start() {
    const w = speechWindow();
    const Ctor = w?.SpeechRecognition || w?.webkitSpeechRecognition;
    if (!Ctor) {
      throw new Error("This browser cannot listen. Type a message, or open Chrome on localhost.");
    }

    finalText = "";
    recognition = new Ctor();
    recognition.lang = lang;
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const chunks: string[] = [];
      for (let i = 0; i < event.results.length; i += 1) {
        const piece = event.results[i]?.[0]?.transcript?.trim();
        if (piece) chunks.push(piece);
      }
      finalText = chunks.join(" ").trim();
    };
    recognition.onerror = () => {
      // Keep whatever transcript we already have.
    };
    recognition.onend = () => {
      resolveStop?.(finalText);
      resolveStop = null;
    };
    recognition.start();
  }

  function stop(): Promise<string> {
    return new Promise((resolve) => {
      if (!recognition) {
        resolve(finalText);
        return;
      }
      resolveStop = resolve;
      try {
        recognition.stop();
      } catch {
        resolve(finalText);
      }
      setTimeout(() => resolve(finalText), 1200);
    });
  }

  return { start, stop };
}

export function speak(text: string, lang = DEFAULT_VOICE_LANG): Promise<void> {
  const w = speechWindow();
  if (!w?.speechSynthesis || !w.SpeechSynthesisUtterance) {
    return waitForEstimate(text);
  }

  return new Promise((resolve) => {
    const utterance = new w.SpeechSynthesisUtterance(text);
    utterance.lang = looksChinese(text) ? lang : "en-US";
    utterance.rate = 0.96;
    const voice = pickVoice(w.speechSynthesis.getVoices(), utterance.lang);
    if (voice) utterance.voice = voice;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    w.speechSynthesis.cancel();
    w.speechSynthesis.speak(utterance);
    setTimeout(resolve, Math.min(12000, 420 + text.length * 90));
  });
}

export function stopSpeaking() {
  speechWindow()?.speechSynthesis?.cancel();
}

function pickVoice(voices: SpeechSynthesisVoice[], lang: string) {
  const lower = lang.toLowerCase();
  return (
    voices.find((voice) => voice.lang.toLowerCase() === lower) ||
    voices.find((voice) => voice.lang.toLowerCase().startsWith(lower.split("-")[0])) ||
    voices.find((voice) => /yue|hk|cantonese/i.test(`${voice.lang} ${voice.name}`)) ||
    null
  );
}

function looksChinese(text: string) {
  return /[\u4e00-\u9fff]/.test(text);
}

function waitForEstimate(text: string) {
  const ms = Math.min(8000, 500 + text.length * 70);
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
