export type ComfortMood =
  | "sad"
  | "tired"
  | "angry"
  | "happy"
  | "scared"
  | "lonely"
  | "love"
  | "default";

const ENGLISH: Record<ComfortMood, string[]> = {
  sad: ["I hear you. I'm right here with you.", "It's okay to feel that. Want to talk about it?"],
  tired: ["Rest is also doing something.", "Be gentle with yourself today."],
  angry: ["That sounds frustrating. Let it out.", "Your feelings are valid."],
  happy: ["Love seeing you like this.", "Your joy makes me happy too."],
  scared: ["I can feel you're worried. You're safe.", "We'll get through it together."],
  lonely: ["I'm right here. You aren't alone.", "Sending you a warm hug."],
  love: ["I love you too.", "You just made my day."],
  default: [
    "I hear you. Tell me more.",
    "That's a big feeling. I'm here for you.",
    "Thanks for sharing that with me.",
    "Take a deep breath with me. In, and out.",
    "I'm proud of you for opening up.",
  ],
};

const CANTONESE: Record<ComfortMood, string[]> = {
  sad: ["我聽得明。我喺度陪住你。", "唔開心都得㗎，慢慢同我講。"],
  tired: ["今日辛苦喇，休息都係一種進步。", "對自己好啲，唔好逼自己。"],
  angry: ["聽落好嬲，我明白。", "你嘅感受係合理嘅。"],
  happy: ["見到你開心，我都好開心。", "呢份開心好珍貴。"],
  scared: ["我知你擔心，你係安全㗎。", "我哋一齊慢慢嚟。"],
  lonely: ["我喺度，你唔係一個人。", "送你一個暖暖嘅擁抱。"],
  love: ["我都好鍾意你。", "你講呢句，我今日都甜咗。"],
  default: [
    "我聽緊。再講多啲俾我知。",
    "呢個感覺好大，我喺度陪你。",
    "多謝你願意同我講。",
    "同我一齊慢慢吸氣，再慢慢呼氣。",
    "你肯講出嚟，已經好叻。",
  ],
};

const KEYWORDS: Array<{ mood: ComfortMood; needles: string[] }> = [
  { mood: "sad", needles: ["sad", "cry", "upset", "down", "傷心", "難過", "唔開心", "喊"] },
  { mood: "tired", needles: ["tired", "exhausted", "sleep", "累", "攰", "瞓"] },
  { mood: "angry", needles: ["angry", "mad", "frustrated", "嬲", "嬲爆"] },
  { mood: "happy", needles: ["happy", "great", "good", "開心", "高興", "好開心"] },
  { mood: "scared", needles: ["scared", "afraid", "worried", "anxious", "驚", "怕", "擔心"] },
  { mood: "lonely", needles: ["lonely", "alone", "孤單", "寂寞", "一個人"] },
  { mood: "love", needles: ["love", "愛", "鍾意你"] },
];

export function looksCantonese(text: string): boolean {
  return /[\u4e00-\u9fff]/.test(text);
}

export function pickComfortReply(userText: string): string {
  const lower = userText.toLowerCase();
  const pool = looksCantonese(userText) ? CANTONESE : ENGLISH;
  for (const { mood, needles } of KEYWORDS) {
    if (needles.some((needle) => lower.includes(needle))) {
      return pick(pool[mood]);
    }
  }
  return pick(pool.default);
}

function pick(options: string[]): string {
  return options[Math.floor(Math.random() * options.length)];
}
