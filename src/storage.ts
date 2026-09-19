import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * storage.ts — THE SHARED MEMORY
 *
 * This file is the only place that talks to AsyncStorage.
 * Every other page calls these functions instead of touching storage directly.
 *
 * WHY?
 *  - One source of truth (easier to maintain)
 *  - If we switch from AsyncStorage to a database later, only this file changes
 *  - Type safety — we know exactly what data shape is stored
 *
 * Data is stored as JSON strings. AsyncStorage only stores strings natively.
 */

const STORAGE_KEYS = {
  USER_PROFILE: "user_profile",
  USER_SETTINGS: "user_settings",
} as const;

// ---- TYPES ----
export type UserProfile = {
  nickname: string;
  age: string;            // string for now (TextInput returns string)
  pronouns: string;       // e.g. "she/her", "they/them", "he/him"
};

export type UserSettings = {
  darkMode: boolean;
  soundEffects: boolean;
  notifications: boolean;
  voice: string;          // "female" | "male" | "neutral"
};

const DEFAULT_PROFILE: UserProfile = {
  nickname: "",
  age: "",
  pronouns: "",
};

const DEFAULT_SETTINGS: UserSettings = {
  darkMode: false,
  soundEffects: true,
  notifications: true,
  voice: "female",
};

// ---- PROFILE ----
export async function getProfile(): Promise<UserProfile> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (!json) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(json) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
}

// ---- SETTINGS ----
export async function getSettings(): Promise<UserSettings> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
    if (!json) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(json) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: UserSettings): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(settings));
}
