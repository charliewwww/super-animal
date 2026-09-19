import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useRef, useState } from "react";
import { goBackOrHome } from "../src/nav";
import { colors, spacing, typography, radius, shadows } from "../src/theme";
import { CompanionAvatar, TalkingFox } from "../src/components/TalkingFox";
import { converse, playReply, type VoiceEngine } from "../src/voice/client";
import { canUseBrowserSpeech, createHoldToTalk, stopSpeaking } from "../src/voice/webSpeech";

type Message = {
  id: string;
  text: string;
  fromUser: boolean;
};

const QUICK_REPLIES = ["I'm sad", "I'm tired", "I'm happy", "我好攰"];

const INITIAL_MESSAGES: Message[] = [
  {
    id: "init-1",
    text: "Hi. I'm here with you. Hold the mic to talk, or type — I'll answer out loud.",
    fromUser: false,
  },
];

const ENGINE_LABEL: Record<VoiceEngine, string> = {
  "home-gpu": "Home GPU voice",
  browser: "Browser voice",
  text: "Text reply",
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [talking, setTalking] = useState(false);
  const [listening, setListening] = useState(false);
  const [engine, setEngine] = useState<VoiceEngine>(canUseBrowserSpeech() ? "browser" : "text");
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const holdRef = useRef<ReturnType<typeof createHoldToTalk> | null>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 80);
  }, [messages, isTyping, talking]);

  useEffect(() => {
    return () => {
      stopSpeaking();
      holdRef.current = null;
    };
  }, []);

  async function sendMessage(text?: string) {
    const content = (text ?? input).trim();
    if (!content || isTyping || talking) return;

    const userMsg: Message = { id: `u-${Date.now()}`, text: content, fromUser: true };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setError(null);
    setIsTyping(true);

    try {
      const result = await converse(content);
      setEngine(result.engine);
      const reply: Message = {
        id: `a-${Date.now()}`,
        text: result.reply,
        fromUser: false,
      };
      setMessages((prev) => [...prev, reply]);
      setIsTyping(false);
      setTalking(true);
      await playReply(result);
    } catch {
      setError("I couldn't reply just now. Try again.");
      setIsTyping(false);
    } finally {
      setTalking(false);
    }
  }

  async function beginHold() {
    if (isTyping || talking) return;
    if (!canUseBrowserSpeech()) {
      Alert.alert(
        "Mic needs Chrome",
        "Hold-to-talk uses the browser speech API. Open this page in Chrome, allow the microphone, or type instead."
      );
      return;
    }
    try {
      holdRef.current = createHoldToTalk();
      holdRef.current.start();
      setListening(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start the microphone.");
    }
  }

  async function endHold() {
    if (!holdRef.current) return;
    const handle = holdRef.current;
    holdRef.current = null;
    setListening(false);
    const transcript = (await handle.stop()).trim();
    if (transcript) {
      await sendMessage(transcript);
    } else {
      setError("I didn't catch that. Hold the mic a little longer, or type.");
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <Pressable onPress={goBackOrHome} style={styles.backButton}>
            <Text style={styles.backArrow}>‹</Text>
          </Pressable>
          <View style={styles.headerInfo}>
            <View>
              <Text style={styles.headerName}>Your animal</Text>
              <Text style={styles.headerStatus}>
                {listening ? "listening..." : talking ? "talking..." : isTyping ? "thinking..." : "always here for you"}
              </Text>
            </View>
          </View>
          <View style={styles.enginePill}>
            <Text style={styles.engineText}>{ENGINE_LABEL[engine]}</Text>
          </View>
        </View>

        <View style={styles.stage}>
          <TalkingFox talking={talking || listening} size={210} />
          <Text style={styles.stageCaption}>
            {listening ? "I'm listening" : talking ? "I'm talking" : "Hold the orange mic to speak"}
          </Text>
        </View>

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
                <CompanionAvatar size={28} />
              )}
              <View style={[styles.bubble, msg.fromUser ? styles.bubbleUser : styles.bubbleAnimal]}>
                <Text style={[styles.bubbleText, msg.fromUser ? styles.bubbleTextUser : styles.bubbleTextAnimal]}>
                  {msg.text}
                </Text>
              </View>
            </View>
          ))}

          {isTyping && (
            <View style={[styles.bubbleRow, styles.bubbleRowAnimal]}>
              <CompanionAvatar size={28} />
              <View style={[styles.bubble, styles.bubbleAnimal, styles.typingBubble]}>
                <View style={styles.typingDots}>
                  <View style={[styles.dot, styles.dot1]} />
                  <View style={[styles.dot, styles.dot2]} />
                  <View style={[styles.dot, styles.dot3]} />
                </View>
              </View>
            </View>
          )}

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

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
          <Pressable
            onPressIn={beginHold}
            onPressOut={endHold}
            style={({ pressed }) => [
              styles.micButton,
              (pressed || listening) && styles.micButtonActive,
            ]}
          >
            <Text style={styles.micIcon}>{listening ? "●" : "🎤"}</Text>
          </Pressable>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="Type, or hold the mic..."
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
            disabled={!input.trim() || isTyping || talking}
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
  headerName: {
    ...typography.h3,
    color: colors.text,
  },
  headerStatus: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 1,
  },
  enginePill: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  engineText: {
    ...typography.caption,
    color: colors.primaryDark,
  },
  stage: {
    alignItems: "center",
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  stageCaption: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  messagesContainer: { flex: 1 },
  messagesContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
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
  quickReplies: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingLeft: 40,
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
  errorText: {
    ...typography.caption,
    color: colors.danger,
    textAlign: "center",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xs,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  micButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  micButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  micIcon: {
    fontSize: 18,
    color: "#FFFFFF",
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
