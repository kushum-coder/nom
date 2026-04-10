import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { placeOrder } from "../api";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, increaseQty, decreaseQty, getTotal } = useCart();

  const router = useRouter();
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);

  const total = getTotal();

  const handleOrder = async () => {
    try {
      if (!cart || cart.length === 0) {
        alert("Your cart is empty");
        return;
      }

      setLoading(true);

      const items = cart.map((i) => ({
        food: i._id || i.id,
        quantity: i.quantity,
      }));

      await placeOrder(items, null);

      alert("Order placed successfully");
      router.push("/orders");
    } catch (err) {
      console.log(err);
      alert("Something went wrong while placing order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* TOP */}
      <View style={styles.top}>
        <TouchableOpacity onPress={() => router.push("/home")}>
          <Ionicons name="arrow-back" size={28} color="#FF4800" />
        </TouchableOpacity>
      </View>

      {/* LIST */}
      <FlatList
        data={cart}
        keyExtractor={(item, index) => (item._id || item.id) + index}
        contentContainerStyle={{ paddingBottom: 200 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>Rs {item.price}</Text>
            </View>

            <View style={styles.row}>
              <TouchableOpacity
                onPress={() => decreaseQty(item._id || item.id)}
              >
                <Ionicons name="remove-circle" size={24} color="#FF4800" />
              </TouchableOpacity>

              <Text style={styles.qty}>{item.quantity}</Text>

              <TouchableOpacity
                onPress={() => increaseQty(item._id || item.id)}
              >
                <Ionicons name="add-circle" size={24} color="#FF4800" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* 🔥 FIXED TOTAL (ALWAYS ABOVE BUTTONS) */}
      <View style={styles.totalWrap}>
        <Text style={styles.total}>Total Rs {total}</Text>
      </View>

      {/* BOTTOM BAR */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => router.push("/home")}
        >
          <Text style={styles.secondaryText}>Add More</Text>
        </TouchableOpacity>

        {!showPayment ? (
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => setShowPayment(true)}
          >
            <Text style={styles.primaryText}>Payment</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.primaryBtn}
            disabled={loading}
            onPress={handleOrder}
          >
            <Text style={styles.primaryText}>
              {loading ? "Placing..." : "Place Order"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

/* ---------------- ONLY FIXED PART ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  top: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },

  name: { fontWeight: "600" },
  price: { color: "#666" },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  qty: {
    fontWeight: "bold",
    minWidth: 20,
    textAlign: "center",
  },

  /* ✅ THIS IS THE ONLY IMPORTANT FIX */
  totalWrap: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 95 : 90,
    left: 0,
    right: 0,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 8,
  },

  total: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
  },

  bottomBar: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 25 : 15,
    left: 15,
    right: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 16,
    elevation: 6,
  },

  primaryBtn: {
    backgroundColor: "#FF4800",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },

  secondaryBtn: {
    borderWidth: 1.5,
    borderColor: "#FF4800",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },

  primaryText: { color: "#fff", fontWeight: "600" },
  secondaryText: { color: "#FF4800", fontWeight: "600" },
});
