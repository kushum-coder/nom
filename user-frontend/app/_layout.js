import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, usePathname, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { CartProvider, useCart } from "../context/CartContext";
import Splash from "./splash";

// Inner component that safely uses CartContext
function LayoutContent({ showSplash, setShowSplash }) {
  const [loadingToken, setLoadingToken] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const { saveToken } = useCart();

  // Check for stored token
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token && saveToken) {
          saveToken(token);
        }
      } catch (err) {
        console.log("Error reading token:", err);
      } finally {
        setLoadingToken(false);
      }
    };
    checkToken();
  }, []);

  const showNavbar =
    pathname === "/home" || pathname === "/orders" || pathname === "/profile";

  if (loadingToken) return null; // wait until AsyncStorage loads

  return (
    <>
      {showSplash ? (
        <Splash onFinish={() => setShowSplash(false)} />
      ) : (
        <>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="signup" />
            <Stack.Screen name="home" />
            <Stack.Screen name="cart" />
            <Stack.Screen name="orders" />
            <Stack.Screen name="profile" />
          </Stack>

          {showNavbar && (
            <View style={styles.navbarContainer}>
              {["/home", "/orders", "/profile"].map((route, index) => {
                const icons = ["home", "receipt", "person"];
                const isActive = pathname === route;
                return (
                  <TouchableOpacity
                    key={route}
                    onPress={() => router.replace(route)}
                    style={styles.navButton}
                  >
                    <Ionicons
                      name={icons[index]}
                      size={28}
                      color={isActive ? "#FF6A00" : "#888"}
                    />
                    {isActive && <View style={styles.activeDot} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </>
      )}
    </>
  );
}

export default function Layout() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <CartProvider>
      <LayoutContent showSplash={showSplash} setShowSplash={setShowSplash} />
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  navbarContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    height: 70,
    borderRadius: 35,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#1F1F1F",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 15,
  },
  navButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FF6A00",
    marginTop: 4,
  },
});
