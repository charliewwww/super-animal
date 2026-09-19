/**
 * comingSoon.ts — Friendly "not built yet" feedback
 *
 * Instead of just an alert, we now show an inline banner at the top of the
 * screen saying "🚧 Coming soon". This way the user gets clear visual
 * feedback that the button is alive, the feature just isn't built yet.
 *
 * Usage: Just call `showComingSoon(setBanner, 'Sounds')` from a Pressable.
 */

import { type Dispatch, type SetStateAction } from "react";

export type ComingSoonBanner = {
  visible: boolean;
  feature: string;
};

export function showComingSoon(
  setBanner: Dispatch<SetStateAction<ComingSoonBanner>>
) {
  return (featureName: string) => {
    setBanner({ visible: true, feature: featureName });
    // Auto-hide after 2.5 seconds
    setTimeout(() => {
      setBanner((prev) => ({ ...prev, visible: false }));
    }, 2500);
  };
}
