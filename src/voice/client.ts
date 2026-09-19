import { pickComfortReply } from "./replies";
import { canSpeak, speak } from "./webSpeech";

export const DEFAULT_VOICE_SERVER = process.env.EXPO_PUBLIC_VOICE_URL ?? "http://127.0.0.1:8765";

export type VoiceEngine = "home-gpu" | "browser" | "text";

export type ConversationResult = {
  reply: string;
  engine: VoiceEngine;
  audioUrl?: string;
};

export async function checkVoiceServer(baseUrl = DEFAULT_VOICE_SERVER): Promise<boolean> {
  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/health`, {
      method: "GET",
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function converse(text: string, baseUrl = DEFAULT_VOICE_SERVER): Promise<ConversationResult> {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error("Empty message");
  }

  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/v1/converse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: trimmed }),
    });
    if (response.ok) {
      const data = (await response.json()) as { reply?: string; audio_base64?: string };
      if (data.reply) {
        return {
          reply: data.reply,
          engine: "home-gpu",
          audioUrl: data.audio_base64 ? `data:audio/wav;base64,${data.audio_base64}` : undefined,
        };
      }
    }
  } catch {
    // Fall through to the on-device demo path.
  }

  return {
    reply: pickComfortReply(trimmed),
    engine: canSpeak() ? "browser" : "text",
  };
}

export async function playReply(result: ConversationResult): Promise<void> {
  if (result.audioUrl && typeof Audio !== "undefined") {
    await playAudioUrl(result.audioUrl);
    return;
  }
  await speak(result.reply);
}

function playAudioUrl(url: string) {
  return new Promise<void>((resolve) => {
    const audio = new Audio(url);
    audio.onended = () => resolve();
    audio.onerror = () => resolve();
    audio.play().catch(() => resolve());
    setTimeout(resolve, 10000);
  });
}
