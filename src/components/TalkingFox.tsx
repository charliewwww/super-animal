import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

type TalkingFoxProps = {
  talking?: boolean;
  size?: number;
};

/**
 * Layered fox face. The mouth scales open/closed while `talking` is true
 * so the companion looks like it is speaking.
 */
export function TalkingFox({ talking = false, size = 168 }: TalkingFoxProps) {
  const mouth = useRef(new Animated.Value(0)).current;
  const bob = useRef(new Animated.Value(0)).current;
  const blink = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const idle = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(bob, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    idle.start();
    return () => idle.stop();
  }, [bob]);

  useEffect(() => {
    let cancelled = false;
    const scheduleBlink = () => {
      const wait = 2200 + Math.random() * 2800;
      const timer = setTimeout(() => {
        if (cancelled) return;
        Animated.sequence([
          Animated.timing(blink, { toValue: 0.08, duration: 80, useNativeDriver: true }),
          Animated.timing(blink, { toValue: 1, duration: 90, useNativeDriver: true }),
        ]).start(() => {
          if (!cancelled) scheduleBlink();
        });
      }, wait);
      return timer;
    };
    const timer = scheduleBlink();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [blink]);

  useEffect(() => {
    if (!talking) {
      Animated.timing(mouth, {
        toValue: 0,
        duration: 160,
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
          toValue: 0.22,
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
    outputRange: [size * 0.028, size * 0.16],
  });
  const mouthWidth = mouth.interpolate({
    inputRange: [0, 1],
    outputRange: [size * 0.18, size * 0.28],
  });
  const translateY = bob.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -size * 0.03],
  });

  const ear = size * 0.22;
  const eye = size * 0.16;

  return (
    <Animated.View style={[styles.stage, { width: size, height: size * 1.08, transform: [{ translateY }] }]}>
      <View style={[styles.ear, styles.earLeft, { width: ear, height: ear * 1.15, borderRadius: ear / 2 }]} />
      <View style={[styles.ear, styles.earRight, { width: ear, height: ear * 1.15, borderRadius: ear / 2 }]} />
      <View style={[styles.earInner, styles.earInnerLeft, { width: ear * 0.48, height: ear * 0.55 }]} />
      <View style={[styles.earInner, styles.earInnerRight, { width: ear * 0.48, height: ear * 0.55 }]} />

      <View style={[styles.head, { width: size * 0.92, height: size * 0.88, borderRadius: size * 0.46 }]}>
        <View style={[styles.cheek, styles.cheekLeft, { width: size * 0.16, height: size * 0.1 }]} />
        <View style={[styles.cheek, styles.cheekRight, { width: size * 0.16, height: size * 0.1 }]} />

        <View style={styles.eyes}>
          <View style={[styles.eye, { width: eye, height: eye, borderRadius: eye / 2 }]}>
            <Animated.View style={[styles.lid, { transform: [{ scaleY: blink }] }]}>
              <View style={[styles.pupil, { width: eye * 0.42, height: eye * 0.5 }]} />
              <View style={[styles.glint, { width: eye * 0.18, height: eye * 0.18 }]} />
            </Animated.View>
          </View>
          <View style={[styles.eye, { width: eye, height: eye, borderRadius: eye / 2 }]}>
            <Animated.View style={[styles.lid, { transform: [{ scaleY: blink }] }]}>
              <View style={[styles.pupil, { width: eye * 0.42, height: eye * 0.5 }]} />
              <View style={[styles.glint, { width: eye * 0.18, height: eye * 0.18 }]} />
            </Animated.View>
          </View>
        </View>

        <View style={[styles.nose, { width: size * 0.1, height: size * 0.07 }]} />

        <Animated.View
          style={[
            styles.mouth,
            {
              width: mouthWidth,
              height: mouthHeight,
              borderRadius: size,
            },
          ]}
        >
          <View style={[styles.tongue, { width: "62%", height: "48%" }]} />
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  stage: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  ear: {
    position: "absolute",
    top: "4%",
    backgroundColor: "#E8874A",
    borderWidth: 2,
    borderColor: "#C46A32",
  },
  earLeft: { left: "10%", transform: [{ rotate: "-18deg" }] },
  earRight: { right: "10%", transform: [{ rotate: "18deg" }] },
  earInner: {
    position: "absolute",
    top: "10%",
    backgroundColor: "#F6B8A0",
    borderRadius: 20,
  },
  earInnerLeft: { left: "16%", transform: [{ rotate: "-18deg" }] },
  earInnerRight: { right: "16%", transform: [{ rotate: "18deg" }] },
  head: {
    backgroundColor: "#F29A5A",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#D9783F",
  },
  cheek: {
    position: "absolute",
    top: "52%",
    backgroundColor: "#F6B8A0",
    borderRadius: 20,
    opacity: 0.85,
  },
  cheekLeft: { left: "10%" },
  cheekRight: { right: "10%" },
  eyes: {
    flexDirection: "row",
    gap: 22,
    marginTop: 8,
  },
  eye: {
    backgroundColor: "#FFFDF8",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  lid: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  pupil: {
    backgroundColor: "#2A2421",
    borderRadius: 20,
    marginTop: 4,
  },
  glint: {
    position: "absolute",
    top: "18%",
    right: "18%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
  },
  nose: {
    backgroundColor: "#3A2418",
    borderRadius: 8,
    marginTop: 8,
    transform: [{ rotate: "0deg" }],
  },
  mouth: {
    marginTop: 6,
    backgroundColor: "#5A2A22",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  tongue: {
    backgroundColor: "#E07856",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
});
