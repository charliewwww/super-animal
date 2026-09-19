import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { colors } from "../src/theme";

/**
 * _layout.tsx — THE ROOT
 *
 * 2026 fixes:
 *  - White flash fixed: animation uses "fade" + background matches the page bg
 *  - Cleaner header: minimal back button, no chunky header bar
 *  - Status bar matches bg so the OS bar blends with the app
 */

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor={colors.bg} />
      <Stack
        screenOptions={{
          // ---- THE FLASH FIX ----
          // Animation: gentle slide + crossfade. The contentStyle bg
          // is set to the SAME color as every page's background, so when
          // one page slides out, the empty area matches and there's no
          // jarring white flash.
          animation: "slide_from_right",
          animationDuration: 250,
          contentStyle: {
            backgroundColor: colors.bg,   // Soft warm off-white
          },

          // ---- MODERN HEADER ----
          headerStyle: {
            backgroundColor: colors.bg,
          },
          headerShadowVisible: false,    // No chunky header line
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: "600",
            fontSize: 17,
            color: colors.text,
          },
          headerBackTitle: "",           // No "Back" text, just arrow
          headerTitleAlign: "center",
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "",
            headerShown: false,         // Home has its own big greeting
          }}
        />
        <Stack.Screen
          name="chat"
          options={{
            headerShown: false,         // Custom header inside page only
          }}
        />
        <Stack.Screen
          name="explore"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="profile"
          options={{
            headerShown: true,
            title: "Profile",
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
