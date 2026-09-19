/**
 * theme.ts — THE 2026 DESIGN SYSTEM
 *
 * One place for all design decisions. Every page imports from here.
 * This is how real design systems work (Material, Apple's HIG, etc.)
 *
 * Why this matters:
 *  - Change a color once → updates everywhere
 *  - Designers and devs speak the same "language"
 *  - Easier to maintain consistency
 *  - Easy to swap to dark mode later (just add a second set of values)
 *
 * 2026 aesthetic:
 *  - Soft, warm neutrals
 *  - Subtle pastel accents
 *  - Generous spacing
 *  - Soft shadows (never harsh)
 *  - Large rounded corners
 */

// ---- COLOR PALETTE ----
export const colors = {
  // Backgrounds — warm off-white, never pure white
  bg:           "#FBF7F4",   // The "page" — like paper
  surface:      "#FFFFFF",   // Cards, elevated surfaces
  surfaceAlt:   "#F5EFEA",   // Slight contrast areas

  // Primary brand — warm coral, calm not loud
  primary:      "#E07856",   // Action color (save button, accents)
  primarySoft:  "#FFE8E0",   // Backgrounds tinted with brand
  primaryDark:  "#C45D3C",   // Pressed states

  // Text
  text:         "#2A2421",   // Primary text — warm black
  textMuted:    "#8A7F77",   // Secondary text
  textSubtle:   "#B8AFA6",   // Tertiary, hints, placeholders

  // Borders
  border:       "#EEE6DF",   // Subtle dividers
  borderStrong: "#E0D6CC",

  // Status / semantic
  success:      "#6B9B7A",
  successSoft:  "#E8F2EB",
  warning:      "#D4A574",
  danger:       "#C45D3C",
  dangerSoft:   "#FCEAEA",

  // Accent moods (for animal moods, chat bubbles)
  happy:        "#F5C26B",
  calm:         "#9BB5A6",
  sad:          "#8FAEC4",
  love:         "#E89B9B",
};

// ---- SPACING (multiples of 4 for visual rhythm) ----
export const spacing = {
  xs:   4,
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  xxl:  24,
  xxxl: 32,
};

// ---- TYPOGRAPHY ----
export const typography = {
  // Page titles — big, light, tight
  display: {
    fontSize: 32,
    fontWeight: "300" as const,    // Light feels modern, not bold
    letterSpacing: -1.2,
  },
  // Section headers — medium
  h2: {
    fontSize: 22,
    fontWeight: "600" as const,
    letterSpacing: -0.5,
  },
  // Card titles
  h3: {
    fontSize: 17,
    fontWeight: "600" as const,
    letterSpacing: -0.2,
  },
  // Body
  body: {
    fontSize: 15,
    fontWeight: "400" as const,
    lineHeight: 22,
  },
  // Small body
  bodySmall: {
    fontSize: 13,
    fontWeight: "400" as const,
    lineHeight: 19,
  },
  // Labels (over inputs, section labels)
  label: {
    fontSize: 12,
    fontWeight: "600" as const,
    letterSpacing: 0.3,
    textTransform: "uppercase" as const,
  },
  // Tiny hints
  caption: {
    fontSize: 11,
    fontWeight: "500" as const,
  },
};

// ---- RADIUS (rounded corners) ----
export const radius = {
  sm:  8,
  md:  14,
  lg:  20,
  xl:  28,
  pill: 999,
};

// ---- SHADOWS (subtle, layered) ----
export const shadows = {
  // Tiny — for chips and small buttons
  sm: {
    shadowColor: "#2A2421",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  // Card — soft drop shadow
  md: {
    shadowColor: "#2A2421",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  // Elevated — for primary buttons
  lg: {
    shadowColor: "#E07856",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  // Glow — for the animal stage
  glow: {
    shadowColor: "#E07856",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 6,
  },
};
