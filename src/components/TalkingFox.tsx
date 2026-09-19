import { useEffect, useRef } from "react";
import { Animated, Easing, Image, StyleSheet, View } from "react-native";
import { companionFaceImage, companionImage } from "../companionImage";

type TalkingFoxProps = {
  talking?: boolean;
  size?: number;
};

const PHOTO_ASPECT = 820 / 990;

/**
 * The companion photo, with a mouth overlay that opens and closes while talking.
 */
export function TalkingFox({ talking = false, size = 220 }: TalkingFoxProps) {
  const mouth = useRef(new Animated.Value(0)).current;
  const bob = useRef(new Animated.Value(0)).current;
  const height = size / PHOTO_ASPECT;

  useEffect(() => {
    const idle = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(bob, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    idle.start();
    return () => idle.stop();
  }, [bob]);

  useEffect(() => {
    if (!talking) {
      Animated.timing(mouth, {
        toValue: 0,
        duration: 140,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }).start();
      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(mouth, {
          toValue: 1,
          duration: 130,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(mouth, {
          toValue: 0.2,
          duration: 110,
          easing: Easing.in(Easing.quad),
          useNativeDriver: false,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [talking, mouth]);

  const mouthHeight = mouth.interpolate({
    inputRange: [0, 1],
    outputRange: [2, Math.max(10, height * 0.042)],
  });
  const mouthWidth = mouth.interpolate({
    inputRange: [0, 1],
    outputRange: [size * 0.055, size * 0.11],
  });
  const translateY = bob.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -size * 0.018],
  });

  return (
    <Animated.View style={[styles.stage, { width: size, height, transform: [{ translateY }] }]}>
      <Image source={companionImage} style={styles.photo} resizeMode="contain" />
      <View pointerEvents="none" style={[styles.mouthSlot, { top: height * 0.486 }]}>
        <Animated.View
          style={[
            styles.mouth,
            {
              width: mouthWidth,
              height: mouthHeight,
              opacity: talking ? 1 : 0,
            },
          ]}
        >
          <View style={styles.tongue} />
        </Animated.View>
      </View>
    </Animated.View>
  );
}

export function CompanionAvatar({ size = 28 }: { size?: number }) {
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      <Image source={companionFaceImage} style={{ width: size, height: size }} resizeMode="cover" />
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    alignItems: "center",
    justifyContent: "center",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  mouthSlot: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  mouth: {
    backgroundColor: "#4A2C22",
    borderRadius: 20,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  tongue: {
    width: "70%",
    height: "45%",
    backgroundColor: "#E89B8C",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  avatar: {
    overflow: "hidden",
    backgroundColor: "#F3E6D4",
  },
});
