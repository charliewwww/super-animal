import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { colors, spacing, typography, radius, shadows } from "../src/theme";

/**
 * explore.tsx — 2026 modern
 *
 * What changed:
 *  - Big page header with title (matches home greeting style)
 *  - Featured banner (gradient-feel with brand color)
 *  - Categories filter row
 *  - Calm spots as elegant cards
 *  - Activities as 2x2 grid with clean icons
 *  - Map preview as actual-looking tile (not "coming soon")
 */

const SPOTS = [
  { id: "1", emoji: "🌳", name: "Central Park",   desc: "Trees, fresh air, squirrels", distance: "0.8 km", mood: "calm" },
  { id: "2", emoji: "☕", name: "Quiet Café",     desc: "Cozy corner, low music",      distance: "0.3 km", mood: "cozy" },
  { id: "3", emoji: "🌊", name: "Riverside Walk", desc: "Watch the water, breathe",    distance: "1.2 km", mood: "calm" },
  { id: "4", emoji: "📚", name: "Library Garden", desc: "Read, sit, watch people",     distance: "0.5 km", mood: "quiet" },
];

const ACTIVITIES = [
  { id: "a1", emoji: "🌅", title: "Morning walk",   sub: "Start your day" },
  { id: "a2", emoji: "🎨", title: "Mood doodle",    sub: "5 min expression" },
  { id: "a3", emoji: "🌸", title: "Gratitude",      sub: "3 small wins" },
  { id: "a4", emoji: "🎵", title: "Calm sounds",    sub: "Soothing audio" },
];

const CATEGORIES = ["All", "Parks", "Cafés", "Walks", "Quiet"];

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* ---- HEADER ---- */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backArrow}>‹</Text>
        </Pressable>
        <View style={styles.headerText}>
          <Text style={styles.headerSubtitle}>Find calm</Text>
          <Text style={styles.headerTitle}>Explore</Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ---- FEATURED BANNER ---- */}
        <View style={styles.featured}>
          <View style={styles.featuredContent}>
            <Text style={styles.featuredTag}>✨ Today's gentle activity</Text>
            <Text style={styles.featuredTitle}>Notice three things</Text>
            <Text style={styles.featuredBody}>
              Step outside for 5 minutes. Find 3 things you see, 2 you hear, 1 you can touch.
            </Text>
          </View>
          <View style={styles.featuredIcon}>
            <Text style={styles.featuredEmoji}>🌿</Text>
          </View>
        </View>

        {/* ---- CATEGORIES ---- */}
        <Text style={styles.sectionLabel}>Browse</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesRow}
        >
          {CATEGORIES.map((cat, i) => (
            <Pressable
              key={cat}
              style={[styles.categoryChip, i === 0 && styles.categoryChipActive]}
            >
              <Text style={[styles.categoryText, i === 0 && styles.categoryTextActive]}>
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* ---- CALM SPOTS ---- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Calm spots near you</Text>
          <Text style={styles.sectionAction}>See all</Text>
        </View>

        <View style={styles.spotsList}>
          {SPOTS.map((spot) => (
            <Pressable
              key={spot.id}
              style={({ pressed }) => [styles.spotCard, pressed && { opacity: 0.7 }]}
            >
              <View style={styles.spotIcon}>
                <Text style={styles.spotEmoji}>{spot.emoji}</Text>
              </View>
              <View style={styles.spotText}>
                <Text style={styles.spotName}>{spot.name}</Text>
                <Text style={styles.spotDesc}>{spot.desc}</Text>
              </View>
              <View style={styles.spotMeta}>
                <Text style={styles.spotDistance}>{spot.distance}</Text>
                <Text style={styles.spotArrow}>›</Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* ---- ACTIVITIES ---- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Quick activities</Text>
          <Text style={styles.sectionAction}>More</Text>
        </View>

        <View style={styles.activityGrid}>
          {ACTIVITIES.map((act) => (
            <Pressable
              key={act.id}
              style={({ pressed }) => [styles.activityCard, pressed && { opacity: 0.75, transform: [{ scale: 0.98 }] }]}
            >
              <Text style={styles.activityEmoji}>{act.emoji}</Text>
              <Text style={styles.activityTitle}>{act.title}</Text>
              <Text style={styles.activitySub}>{act.sub}</Text>
            </Pressable>
          ))}
        </View>

        {/* ---- MAP TILE ---- */}
        <Text style={styles.sectionLabel}>Around you</Text>
        <View style={styles.mapTile}>
          <View style={styles.mapBackdrop}>
            {/* Faux "map" with circles */}
            <View style={[styles.mapBlob, styles.mapBlob1]} />
            <View style={[styles.mapBlob, styles.mapBlob2]} />
            <View style={[styles.mapBlob, styles.mapBlob3]} />
            <View style={styles.mapPin}>
              <Text style={styles.mapPinEmoji}>📍</Text>
            </View>
          </View>
          <View style={styles.mapInfo}>
            <Text style={styles.mapTitle}>Live map</Text>
            <Text style={styles.mapSubtitle}>Find animals wandering nearby</Text>
          </View>
        </View>

        <Text style={styles.footer}>Take it slow. There's no rush. 🐾</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1 },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
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
  headerText: {
    flex: 1,
    alignItems: "center",
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.text,
  },

  // ---- FEATURED ----
  featured: {
    flexDirection: "row",
    backgroundColor: colors.primarySoft,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F5C9B5",
  },
  featuredContent: { flex: 1 },
  featuredTag: {
    ...typography.caption,
    color: colors.primary,
  },
  featuredTitle: {
    ...typography.h3,
    color: colors.text,
    marginTop: 2,
  },
  featuredBody: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginTop: 4,
    lineHeight: 18,
  },
  featuredIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: spacing.md,
  },
  featuredEmoji: { fontSize: 30 },

  // ---- SECTIONS ----
  sectionLabel: {
    ...typography.label,
    color: colors.textMuted,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: spacing.lg,
  },
  sectionAction: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: "500",
    marginBottom: spacing.sm,
  },

  // ---- CATEGORIES ----
  categoriesRow: {
    gap: spacing.sm,
    paddingRight: spacing.xl,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipActive: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  categoryText: {
    ...typography.bodySmall,
    color: colors.text,
  },
  categoryTextActive: {
    color: colors.surface,
    fontWeight: "600",
  },

  // ---- SPOTS ----
  spotsList: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  spotCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  spotIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  spotEmoji: { fontSize: 20 },
  spotText: { flex: 1 },
  spotName: {
    ...typography.body,
    color: colors.text,
    fontWeight: "600",
  },
  spotDesc: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 1,
  },
  spotMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  spotDistance: {
    ...typography.caption,
    color: colors.textMuted,
  },
  spotArrow: {
    fontSize: 18,
    color: colors.textSubtle,
  },

  // ---- ACTIVITIES ----
  activityGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  activityCard: {
    width: "48.5%",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  activityEmoji: {
    fontSize: 28,
    marginBottom: spacing.md,
  },
  activityTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: "600",
  },
  activitySub: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 1,
  },

  // ---- MAP TILE ----
  mapTile: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    ...shadows.sm,
  },
  mapBackdrop: {
    height: 140,
    backgroundColor: "#E8F2EB",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  mapBlob: {
    position: "absolute",
    backgroundColor: "#C8DDD0",
    borderRadius: 999,
    opacity: 0.6,
  },
  mapBlob1: { width: 100, height: 100, top: 20, left: 30 },
  mapBlob2: { width: 70, height: 70, top: 60, right: 50 },
  mapBlob3: { width: 50, height: 50, bottom: 20, left: 80 },
  mapPin: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.md,
  },
  mapPinEmoji: { fontSize: 22 },
  mapInfo: {
    padding: spacing.lg,
  },
  mapTitle: {
    ...typography.h3,
    color: colors.text,
  },
  mapSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },

  // ---- FOOTER ----
  footer: {
    textAlign: "center",
    fontSize: 12,
    color: colors.textSubtle,
    marginTop: spacing.xl,
  },
});
