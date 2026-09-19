import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Switch, Alert } from "react-native";
import { useState, useEffect } from "react";
import { getProfile, saveProfile, getSettings, saveSettings, type UserProfile, type UserSettings } from "../src/storage";
import { goBackOrHome } from "../src/nav";
import { colors, spacing, typography, radius, shadows } from "../src/theme";

/**
 * profile.tsx — 2026 modern
 *
 * What changed:
 *  - Native header with back button (handled by layout)
 *  - Hero profile section with large avatar + name
 *  - Form inputs with floating labels style
 *  - Settings as iOS-style rows with icons
 *  - Sticky save button at bottom
 */

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile>({ nickname: "", age: "", pronouns: "" });
  const [settings, setSettings] = useState<UserSettings>({
    darkMode: false,
    soundEffects: true,
    notifications: true,
    voice: "female",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const p = await getProfile();
      const s = await getSettings();
      setProfile(p);
      setSettings(s);
    })();
  }, []);

  async function handleSave() {
    setIsSaving(true);
    try {
      await saveProfile(profile);
      await saveSettings(settings);
      Alert.alert("All saved 💕", "Your profile and settings are updated.", [
        { text: "OK", onPress: goBackOrHome },
      ]);
    } catch {
      Alert.alert("Oops!", "Could not save. Try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <View style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ---- HERO PROFILE ---- */}
        <View style={styles.heroSection}>
          <View style={styles.bigAvatar}>
            <Text style={styles.bigAvatarText}>
              {profile.nickname ? profile.nickname[0].toUpperCase() : "🐾"}
            </Text>
          </View>
          <Text style={styles.heroName}>{profile.nickname || "Your name"}</Text>
          <Text style={styles.heroSubtitle}>
            {profile.age ? `${profile.age} years old` : "Add your info to personalize"}
          </Text>
        </View>

        {/* ---- ABOUT YOU ---- */}
        <Text style={styles.sectionLabel}>About you</Text>
        <View style={styles.card}>
          <Field
            label="Nickname"
            value={profile.nickname}
            onChange={(v) => setProfile({ ...profile, nickname: v })}
            placeholder="What should we call you?"
          />
          <View style={styles.cardDivider} />
          <Field
            label="Age"
            value={profile.age}
            onChange={(v) => setProfile({ ...profile, age: v.replace(/[^0-9]/g, "") })}
            placeholder="25"
            keyboardType="number-pad"
            maxLength={3}
          />
        </View>

        {/* ---- SETTINGS ---- */}
        <Text style={styles.sectionLabel}>Settings</Text>
        <View style={styles.card}>
          <SettingRow
            icon="🔊"
            label="Sound effects"
            desc="Cute sounds on interactions"
            value={settings.soundEffects}
            onChange={(v) => setSettings({ ...settings, soundEffects: v })}
          />
          <View style={styles.cardDivider} />
          <SettingRow
            icon="🔔"
            label="Daily check-in"
            desc="Gentle reminders to chat"
            value={settings.notifications}
            onChange={(v) => setSettings({ ...settings, notifications: v })}
          />
          <View style={styles.cardDivider} />
          <SettingRow
            icon="🌙"
            label="Dark mode"
            desc="Coming soon ✨"
            value={settings.darkMode}
            onChange={() => Alert.alert("Coming soon!", "Dark mode is on the roadmap.")}
            disabled
          />
        </View>

        {/* ---- ABOUT ---- */}
        <Text style={styles.sectionLabel}>About</Text>
        <View style={styles.card}>
          <LinkRow icon="🔒" label="Privacy policy" onPress={() => Alert.alert("Privacy Policy", "Coming soon!")} />
          <View style={styles.cardDivider} />
          <LinkRow icon="❓" label="Help & support" onPress={() => Alert.alert("Help", "Email us: hello@superanimal.app")} />
          <View style={styles.cardDivider} />
          <LinkRow icon="💖" label="About this app" onPress={() => Alert.alert("Super Animal", "Version 1.0.0\nMade with 💖")} />
        </View>

        {/* ---- SAVE BUTTON ---- */}
        <Pressable
          style={({ pressed }) => [
            styles.saveButton,
            isSaving && { opacity: 0.6 },
            pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
          ]}
          onPress={handleSave}
          disabled={isSaving}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? "Saving..." : "Save changes"}
          </Text>
        </Pressable>

        <Text style={styles.footer}>Your data stays on your device. Always. 🐾</Text>
      </ScrollView>
    </View>
  );
}

// ---- SUB-COMPONENTS ----
function Field({
  label,
  value,
  onChange,
  placeholder,
  keyboardType,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "number-pad";
  maxLength?: number;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.textSubtle}
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
        maxLength={maxLength}
      />
    </View>
  );
}

function SettingRow({
  icon,
  label,
  desc,
  value,
  onChange,
  disabled,
}: {
  icon: string;
  label: string;
  desc: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <Pressable 
      style={styles.settingRow}
      onPress={() => {
        if (!disabled) {
          onChange(!value);
        } else {
          onChange(value); // This will trigger the alert if it's the disabled mock
        }
      }}
    >
      <View style={styles.settingIcon}>
        <Text style={styles.settingEmoji}>{icon}</Text>
      </View>
      <View style={styles.settingText}>
        <Text style={styles.settingLabel}>{label}</Text>
        <Text style={styles.settingDesc}>{desc}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.border, true: colors.primarySoft }}
        thumbColor={value ? colors.primary : "#FFFFFF"}
        disabled={disabled}
      />
    </Pressable>
  );
}

function LinkRow({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.linkRow, pressed && { opacity: 0.6 }]}
      onPress={onPress}
    >
      <View style={styles.settingIcon}>
        <Text style={styles.settingEmoji}>{icon}</Text>
      </View>
      <Text style={styles.linkText}>{label}</Text>
      <Text style={styles.linkArrow}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1 },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: 40,
  },

  // ---- HEADER ----
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: {
    fontSize: 32,
    color: colors.text,
    lineHeight: 32,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text,
  },

  // ---- HERO ----
  heroSection: {
    alignItems: "center",
    paddingVertical: spacing.lg,
  },
  bigAvatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.surface,
    ...shadows.md,
  },
  bigAvatarText: {
    fontSize: 36,
    fontWeight: "300",
    color: colors.primary,
  },
  heroName: {
    ...typography.h2,
    color: colors.text,
  },
  heroSubtitle: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginTop: 2,
  },

  // ---- SECTIONS ----
  sectionLabel: {
    ...typography.label,
    color: colors.textMuted,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  cardDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: spacing.xxl,
  },

  // ---- FIELDS ----
  field: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  fieldLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: 4,
  },
  input: {
    ...typography.body,
    color: colors.text,
    paddingVertical: 4,
  },

  // ---- SEGMENTED ----
  segmented: {
    flexDirection: "row",
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    padding: 3,
    marginTop: spacing.sm,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: radius.sm,
  },
  segmentActive: {
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  segmentText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  segmentTextActive: {
    color: colors.text,
    fontWeight: "600",
  },

  // ---- SETTINGS ROW ----
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  settingEmoji: { fontSize: 16 },
  settingText: { flex: 1 },
  settingLabel: {
    ...typography.body,
    color: colors.text,
    fontWeight: "500",
  },
  settingDesc: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 1,
  },

  // ---- LINK ROW ----
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  linkText: {
    flex: 1,
    ...typography.body,
    color: colors.text,
  },
  linkArrow: {
    fontSize: 20,
    color: colors.textSubtle,
  },

  // ---- SAVE BUTTON ----
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: spacing.xxl,
    ...shadows.lg,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  // ---- FOOTER ----
  footer: {
    textAlign: "center",
    fontSize: 12,
    color: colors.textSubtle,
    marginTop: spacing.lg,
  },
});
