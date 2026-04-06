import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, usePathname, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { CartProvider, useCart } from "../context/CartContext";
import Splash from "./splash";

function LayoutContent({ showSplash, setShowSplash }) {
  const [loadingToken, setLoadingToken] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { saveToken } = useCart();

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

  if (loadingToken) return null;

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
    height: 70,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.35)",
    borderRadius: 35,
    borderWidth: 1.5,
    borderColor: "#FF4800",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 12,
    marginHorizontal: 15,
    position: "absolute",
    bottom: 15,
    left: 0,
    right: 0,
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
