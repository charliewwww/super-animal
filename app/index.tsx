import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCallback, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import { getProfile, type UserProfile } from "../src/storage";
import { colors, spacing, typography, radius, shadows } from "../src/theme";
import { TalkingFox } from "../src/components/TalkingFox";

/**
 * index.tsx — HOME (2026 redesign)
 *
 * What changed from before:
 *  - Layered radial-gradient background (depth, no flat color)
 *  - Soft glow behind the animal
 *  - Hero animal in a 3D-like glass card
 *  - "Quick action" row with mini cards (smaller, more refined)
 *  - "Today's mood" pill — single use, not a card
 *  - 3D orb / iOS-style button (primary CTA in the gradient color)
 *  - Removed emoji in headers, kept only where they earn their place
 */

export default function HomeScreen() {
  const [profile, setProfile] = useState<UserProfile>({ nickname: "", age: "", pronouns: "" });

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const p = await getProfile();
        setProfile(p);
      })();
    }, [])
  );

  const firstName = profile.nickname
    ? profile.nickname.split(" ")[0]
    : "friend";

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ---- TOP BAR: greeting + date ---- */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.helloSmall}>
              {new Date().toLocaleDateString("en", { weekday: "long" })}
            </Text>
            <Text style={styles.helloLarge}>
              Hi, {firstName} <Text style={styles.wave}>👋</Text>
            </Text>
          </View>
          <Pressable
            style={({ pressed }) => [styles.avatarButton, pressed && { opacity: 0.7 }]}
            onPress={() => router.push("/profile")}
          >
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitial}>
                {firstName[0]?.toUpperCase() || "🐾"}
              </Text>
            </View>
          </Pressable>
        </View>

        {/* ---- ANIMAL HERO CARD ---- */}
        <View style={styles.heroCard}>
          {/* Soft glow behind the animal */}
          <View style={styles.heroGlow} />

          <View style={styles.heroAnimal}>
            <TalkingFox size={210} />
          </View>

          <View style={styles.heroText}>
            <Text style={styles.heroStatus}>Feeling calm and ready to listen</Text>
            <Text style={styles.heroName}>Your animal friend</Text>
          </View>

          <View style={styles.heroActions}>
            <Pressable
              style={({ pressed }) => [styles.heroButton, pressed && { opacity: 0.85 }]}
              onPress={() => router.push("/chat")}
            >
              <Text style={styles.heroButtonText}>Talk to me</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.heroIconButton, pressed && { opacity: 0.7 }]}
              onPress={() => router.push("/chat")}
            >
              <Text style={styles.heroIconText}>💬</Text>
            </Pressable>
          </View>
        </View>

        {/* ---- DAILY MOOD (single-use pill) ---- */}
        <Pressable 
          style={({ pressed }) => [styles.moodPill, pressed && { opacity: 0.7 }]}
          onPress={() => router.push("/chat")}
        >
          <View style={styles.moodDot} />
          <Text style={styles.moodPillText}>How are you feeling right now?</Text>
          <Text style={styles.moodPillArrow}>›</Text>
        </Pressable>

        {/* ---- QUICK ACTIONS GRID ---- */}
        <Text style={styles.sectionLabel}>Quick actions</Text>
        <View style={styles.actionsGrid}>
          <ActionCard
            icon="🗺️"
            label="Explore"
            sub="Find calm nearby"
            tint="#E8F2EB"
            tintBorder="#C8DDD0"
            onPress={() => router.push("/explore")}
          />
          <ActionCard
            icon="📓"
            label="Journal"
            sub="Track your day"
            tint="#FCEAEA"
            tintBorder="#F2C9C9"
            onPress={() => Alert.alert("Coming soon!", "Journal is on the roadmap.")}
          />
        </View>
        <View style={styles.actionsGrid}>
          <ActionCard
            icon="🎵"
            label="Sounds"
            sub="Calming audio"
            tint="#FFF4E0"
            tintBorder="#E8D5B0"
            onPress={() => Alert.alert("Coming soon!", "Sound library is on the roadmap.")}
          />
          <ActionCard
            icon="👤"
            label="Profile"
            sub="Settings & you"
            tint="#EFE6F2"
            tintBorder="#D5C8DC"
            onPress={() => router.push("/profile")}
          />
        </View>

        {/* ---- FOOTER ---- */}
        <Text style={styles.footer}>v1.0 · made with 💖</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// ---- ACTION CARD COMPONENT (small, refined) ----
function ActionCard({ icon, label, sub, tint, tintBorder, onPress }: {
  icon: string;
  label: string;
  sub: string;
  tint: string;
  tintBorder: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.actionCard,
        { backgroundColor: tint, borderColor: tintBorder },
        pressed && { opacity: 0.75, transform: [{ scale: 0.98 }] },
      ]}
      onPress={onPress}
    >
      <Text style={styles.actionIcon}>{icon}</Text>
      <View>
        <Text style={styles.actionLabel}>{label}</Text>
        <Text style={styles.actionSub}>{sub}</Text>
      </View>
    </Pressable>
  );
}

// ---- STYLES ----
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1 },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
  },

  // ---- TOP BAR ----
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xl,
  },
  helloSmall: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  helloLarge: {
    ...typography.display,
    color: colors.text,
    marginTop: 2,
  },
  wave: {
    fontSize: 28,
  },
  avatarButton: {
    width: 44,
    height: 44,
  },
  avatarCircle: {
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
  avatarInitial: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.primary,
  },

  // ---- HERO CARD ----
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.md,
  },
  heroGlow: {
    position: "absolute",
    top: -40,
    left: "50%",
    marginLeft: -60,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    opacity: 0.08,
  },
  heroAnimal: {
    alignItems: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  heroEmoji: {
    fontSize: 90,
  },
  heroText: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  heroStatus: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  heroName: {
    ...typography.h3,
    color: colors.text,
    marginTop: 2,
  },
  heroActions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  heroButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 14,
    alignItems: "center",
    ...shadows.lg,
  },
  heroButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  heroIconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  heroIconText: {
    fontSize: 20,
  },

  // ---- MOOD PILL ----
  moodPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  moodDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.success,
    marginRight: spacing.md,
  },
  moodPillText: {
    flex: 1,
    ...typography.body,
    color: colors.text,
  },
  moodPillArrow: {
    fontSize: 22,
    color: colors.textSubtle,
    marginLeft: spacing.sm,
  },

  // ---- ACTIONS GRID ----
  sectionLabel: {
    ...typography.label,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  actionsGrid: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  actionCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
  },
  actionIcon: {
    fontSize: 28,
  },
  actionLabel: {
    ...typography.h3,
    color: colors.text,
  },
  actionSub: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 1,
  },

  // ---- FOOTER ----
  footer: {
    textAlign: "center",
    fontSize: 11,
    color: colors.textSubtle,
    marginTop: spacing.xl,
  },
});
