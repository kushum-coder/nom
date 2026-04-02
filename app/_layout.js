import { Stack } from "expo-router";
import { useState } from "react";
import { CartProvider } from "../context/CartContext";
import Splash from "./splash";

export default function Layout() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <CartProvider>
      {showSplash ? (
        <Splash onFinish={() => setShowSplash(false)} />
      ) : (
        <Stack screenOptions={{ headerShown: false }} />
      )}
    </CartProvider>
  );
}
