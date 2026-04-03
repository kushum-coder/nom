import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

export default function Splash({ onFinish }) {
  const translateY = useRef(new Animated.Value(-120)).current;
  const scale = useRef(new Animated.Value(0.85)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const shadowOpacity = useRef(new Animated.Value(0)).current;

  // Light sweep
  const shineTranslate = useRef(new Animated.Value(-180)).current;
  const shineOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Step 1: Entrance – slide + scale + fade + subtle shadow
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 1200, // slower entrance
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 1200, // slower scale
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 1000, // slower fade
        useNativeDriver: true,
      }),
      Animated.timing(shadowOpacity, {
        toValue: 0.25,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Step 2: Subtle settle with tiny bounce
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 0.97,
          duration: 200, // slower bounce
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Step 3: Cinematic soft light sweep
        Animated.sequence([
          Animated.timing(shineOpacity, {
            toValue: 0.15,
            duration: 200, // slower fade in
            useNativeDriver: true,
          }),
          Animated.timing(shineTranslate, {
            toValue: 220,
            duration: 900, // slower sweep
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(shineOpacity, {
            toValue: 0,
            duration: 200, // slower fade out
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (onFinish) onFinish(); // Navigate to login
        });
      });
    });
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          transform: [{ translateY }, { scale }],
          opacity,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: shadowOpacity,
          shadowRadius: 25,
          elevation: 12,
        }}
      >
        <View
          style={{
            overflow: "hidden",
            borderRadius: 0 /* keep original logo shape */,
          }}
        >
          <Animated.Image
            source={require("../assets/images/logo.png")}
            style={{
              width: 220,
              height: 220,
            }}
            resizeMode="contain"
          />
          {/* Subtle cinematic light sweep */}
          <Animated.View
            style={{
              position: "absolute",
              width: 80,
              height: 220,
              backgroundColor: "white",
              opacity: shineOpacity,
              borderRadius: 50,
              transform: [{ translateX: shineTranslate }, { rotate: "25deg" }],
            }}
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFBD31",
    justifyContent: "center",
    alignItems: "center",
  },
});
