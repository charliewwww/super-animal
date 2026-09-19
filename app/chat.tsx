import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useRef, useEffect } from "react";
import { router } from "expo-router";
import { colors, spacing, typography, radius, shadows } from "../src/theme";

/**
 * chat.tsx — 2026 modern chat
 *
 * What changed:
 *  - 2026 iMessage-style bubbles (more rounded, gradient user bubble)
 *  - Custom header with animal name + online status
 *  - Quick-reply chips (tap instead of typing)
 *  - Subtle typing indicator
 *  - Cleaner input bar (pill-shaped)
 */

type Message = {
  id: string;
  text: string;
  fromUser: boolean;
};

const KEYWORD_REPLIES: Record<string, string[]> = {
  sad:    ["I hear you 💙 I'm right here with you.", "It's okay to feel that. Want to talk about it?"],
  tired:  ["Rest is also doing something 💤", "Be gentle with yourself today."],
  angry:  ["That sounds frustrating. Let it out 💢", "Your feelings are valid."],
  happy:  ["Love seeing you like this! 🎉", "Your joy makes me happy too 🥰"],
  scared: ["I can feel you're worried. You're safe 🤍", "We'll get through it together."],
  lonely: ["I'm right here. You aren't alone 🐾", "Sending you a warm hug 🤗"],
  love:   ["Aww, I love you too 💕", "You just made my day 🥰"],
  default: [
    "I hear you 💕 Tell me more.",
    "That's a big feeling. I'm here for you.",
    "Thanks for sharing that with me.",
    "Take a deep breath with me... in... and out 🌸",
    "I'm proud of you for opening up.",
  ],
};

function getMockReply(userText: string): string {
  const lower = userText.toLowerCase();
  for (const keyword of Object.keys(KEYWORD_REPLIES)) {
    if (keyword !== "default" && lower.includes(keyword)) {
      const pool = KEYWORD_REPLIES[keyword];
      return pool[Math.floor(Math.random() * pool.length)];
    }
  }
  return KEYWORD_REPLIES.default[Math.floor(Math.random() * KEYWORD_REPLIES.default.length)];
}

const QUICK_REPLIES = ["I'm sad 💙", "I'm tired 💤", "I'm happy ✨", "Tell me a joke 🌸"];

const INITIAL_MESSAGES: Message[] = [
  { id: "init-1", text: "Hi! I'm so happy you're here 💕\nHow are you feeling today?", fromUser: false },
];

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 80);
  }, [messages, isTyping]);

  function sendMessage(text?: string) {
    const content = (text ?? input).trim();
    if (!content) return;

    const userMsg: Message = { id: `u-${Date.now()}`, text: content, fromUser: true };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setIsTyping(true);
    setTimeout(() => {
      const reply: Message = {
        id: `a-${Date.now()}`,
        text: getMockReply(content),
        fromUser: false,
      };
      setMessages((prev) => [...prev, reply]);
      setIsTyping(false);
    }, 900 + Math.random() * 700);
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* ---- CUSTOM HEADER ---- */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backArrow}>‹</Text>
          </Pressable>
          <View style={styles.headerInfo}>
            <View style={styles.headerAvatar}>
              <Text style={styles.headerEmoji}>🦊</Text>
              <View style={styles.onlineDot} />
            </View>
            <View>
              <Text style={styles.headerName}>Your animal</Text>
              <Text style={styles.headerStatus}>
                {isTyping ? "typing..." : "always here for you"}
              </Text>
            </View>
          </View>
          <View style={{ width: 32 }} />
        </View>

        {/* ---- MESSAGES ---- */}
        <ScrollView
          ref={scrollRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.bubbleRow,
                msg.fromUser ? styles.bubbleRowUser : styles.bubbleRowAnimal,
              ]}
            >
              {!msg.fromUser && (
                <View style={styles.bubbleAvatar}>
                  <Text style={styles.bubbleAvatarText}>🦊</Text>
                </View>
              )}
              <View
                style={[
                  styles.bubble,
                  msg.fromUser ? styles.bubbleUser : styles.bubbleAnimal,
                ]}
              >
                <Text
                  style={[
                    styles.bubbleText,
                    msg.fromUser ? styles.bubbleTextUser : styles.bubbleTextAnimal,
                  ]}
                >
                  {msg.text}
                </Text>
              </View>
            </View>
          ))}

          {isTyping && (
            <View style={[styles.bubbleRow, styles.bubbleRowAnimal]}>
              <View style={styles.bubbleAvatar}>
                <Text style={styles.bubbleAvatarText}>🦊</Text>
              </View>
              <View style={[styles.bubble, styles.bubbleAnimal, styles.typingBubble]}>
                <View style={styles.typingDots}>
                  <View style={[styles.dot, styles.dot1]} />
                  <View style={[styles.dot, styles.dot2]} />
                  <View style={[styles.dot, styles.dot3]} />
                </View>
              </View>
            </View>
          )}

          {/* Quick replies — only show at start */}
          {messages.length === 1 && (
            <View style={styles.quickReplies}>
              {QUICK_REPLIES.map((reply) => (
                <Pressable
                  key={reply}
                  style={({ pressed }) => [styles.quickChip, pressed && { opacity: 0.7 }]}
                  onPress={() => sendMessage(reply)}
                >
                  <Text style={styles.quickChipText}>{reply}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </ScrollView>

        {/* ---- INPUT BAR ---- */}
        <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="Message your animal..."
              placeholderTextColor={colors.textSubtle}
              value={input}
              onChangeText={setInput}
              onSubmitEditing={() => sendMessage()}
              returnKeyType="send"
              multiline
              maxLength={500}
            />
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.sendButton,
              !input.trim() && styles.sendButtonDisabled,
              pressed && { opacity: 0.7, transform: [{ scale: 0.92 }] },
            ]}
            onPress={() => sendMessage()}
            disabled={!input.trim()}
          >
            <Text style={styles.sendIcon}>↑</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },

  // ---- HEADER ----
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  backArrow: {
    fontSize: 32,
    color: colors.text,
    lineHeight: 32,
  },
  headerInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  headerEmoji: { fontSize: 20 },
  onlineDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.bg,
  },
  headerName: {
    ...typography.h3,
    color: colors.text,
  },
  headerStatus: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 1,
  },

  // ---- MESSAGES ----
  messagesContainer: { flex: 1 },
  messagesContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  bubbleRow: {
    flexDirection: "row",
    marginBottom: spacing.sm,
    alignItems: "flex-end",
    gap: spacing.sm,
  },
  bubbleRowUser: {
    justifyContent: "flex-end",
  },
  bubbleRowAnimal: {
    justifyContent: "flex-start",
  },
  bubbleAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  bubbleAvatarText: { fontSize: 16 },
  bubble: {
    maxWidth: "78%",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  bubbleAnimal: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  bubbleUser: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 6,
    ...shadows.sm,
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 21,
  },
  bubbleTextAnimal: {
    color: colors.text,
  },
  bubbleTextUser: {
    color: "#FFFFFF",
  },

  // ---- TYPING ----
  typingBubble: {
    paddingVertical: 16,
  },
  typingDots: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.textSubtle,
  },
  dot1: { opacity: 0.3 },
  dot2: { opacity: 0.6 },
  dot3: { opacity: 1 },

  // ---- QUICK REPLIES ----
  quickReplies: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingLeft: 40,    // Align with animal bubbles
  },
  quickChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickChipText: {
    ...typography.bodySmall,
    color: colors.text,
  },

  // ---- INPUT BAR ----
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  inputWrap: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 24,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  input: {
    fontSize: 15,
    color: colors.text,
    paddingVertical: 12,
    maxHeight: 100,
    minHeight: 44,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.lg,
  },
  sendButtonDisabled: {
    backgroundColor: colors.borderStrong,
    shadowOpacity: 0,
  },
  sendIcon: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    marginTop: -2,
  },
});
