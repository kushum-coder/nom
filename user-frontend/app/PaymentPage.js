import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BASE_URL } from "../api";

import { useCart } from "../context/CartContext";

const PaymentPage = () => {
  const router = useRouter();
  const { clearCart } = useCart();

  const { cart, total, city, street, landmark } = useLocalSearchParams();

  const [selectedMethod, setSelectedMethod] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const esewaLogo = require("../assets/esewa.png");
  const khaltiLogo = require("../assets/khalti.png");

  const items = cart ? JSON.parse(cart) : [];

  const handleConfirm = async () => {
    if (!selectedMethod) {
      Alert.alert("Error", "Please select a payment method");
      return;
    }

    if (!items || items.length === 0) {
      Alert.alert("Error", "Cart is empty");
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: items.map((i) => ({
            food: i._id || i.id,
            quantity: i.quantity || 1,
          })),
          city,
          street,
          landmark,
          paymentMethod: selectedMethod,
        }),
      });

      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error("Server error");
      }

      if (!res.ok) {
        Alert.alert("Error", data.message || "Order failed");
        return;
      }

      clearCart();
      setShowSuccess(true);
    } catch (err) {
      Alert.alert("Error", err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleOkay = () => {
    router.replace("/orders");
  };

  if (showSuccess) {
    return (
      <View style={styles.pageShell}>
        <View style={styles.frame}>
          {/* FIXED: LOWER HEADER + CLEAN WHITE BACKGROUND */}
          <View style={[styles.header, { marginTop: 70 }]}>
            <TouchableOpacity
              style={[styles.backButton, { marginTop: 15 }]}
              onPress={() => router.replace("/orders")}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            <Text style={[styles.headerTitle, { marginTop: 15 }]}>
              Payment Confirmation
            </Text>
          </View>

          {/* FIXED: REMOVE BOX LOOK COMPLETELY */}
          <View style={[styles.successContainer, { backgroundColor: "#fff" }]}>
            <Ionicons name="checkmark-circle" size={75} color="green" />

            <Text style={styles.successText}>
              Your Order was{"\n"}successful.
            </Text>

            <TouchableOpacity style={styles.okButton} onPress={handleOkay}>
              <Text style={styles.okText}>Go to Orders</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.pageShell}>
      <View style={styles.frame}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Payment</Text>
        </View>

        <ScrollView>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Billings</Text>

            {items.map((item, index) => (
              <View key={index}>
                <View style={styles.row}>
                  <View>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemPrice}>Rs {item.price}</Text>
                  </View>

                  <Text style={styles.itemTotal}>
                    Rs {(item.price || 0) * (item.quantity || 1)}
                  </Text>
                </View>

                {index !== items.length - 1 && <View style={styles.divider} />}
              </View>
            ))}

            <View style={styles.totalRow}>
              <Text>Total</Text>
              <Text>Rs {total}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Payment Method</Text>

            <TouchableOpacity
              style={[
                styles.methodBox,
                selectedMethod === "cod" && styles.selectedBox,
              ]}
              onPress={() => setSelectedMethod("cod")}
            >
              <View style={styles.radioBox}>
                {selectedMethod === "cod" && <View style={styles.radioInner} />}
              </View>

              <Text style={styles.methodText}>Cash On Delivery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.methodBox,
                selectedMethod === "esewa" && styles.selectedBox,
              ]}
              onPress={() => setSelectedMethod("esewa")}
            >
              <View style={styles.radioBox}>
                {selectedMethod === "esewa" && (
                  <View style={styles.radioInner} />
                )}
              </View>

              <Image source={esewaLogo} style={styles.logo} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.methodBox,
                selectedMethod === "khalti" && styles.selectedBox,
              ]}
              onPress={() => setSelectedMethod("khalti")}
            >
              <View style={styles.radioBox}>
                {selectedMethod === "khalti" && (
                  <View style={styles.radioInner} />
                )}
              </View>

              <Image source={khaltiLogo} style={styles.logo} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={handleConfirm}
              disabled={loading}
            >
              <Text style={styles.confirmText}>
                {loading ? "Placing Order..." : "Confirm"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default PaymentPage;

const styles = StyleSheet.create({
  pageShell: {
    flex: 1,
    backgroundColor: "#fff", // FIXED: removed grey background
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },

  frame: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff", // FIXED: removed box feel
    padding: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  backButton: {
    padding: 10,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ff5a00",
    flex: 1,
    textAlign: "center",
  },

  card: {
    backgroundColor: "#f7f7f7",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },

  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },

  itemName: { fontSize: 16, fontWeight: "500" },
  itemPrice: { fontSize: 14, color: "#555" },
  itemTotal: { fontSize: 15, fontWeight: "500" },

  divider: { height: 1, backgroundColor: "#ccc", marginVertical: 5 },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  methodBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#fff",
    height: 60,
  },

  selectedBox: { borderColor: "#ff5a00" },

  radioBox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ff5a00",
  },

  methodText: { fontSize: 16 },

  logo: {
    width: 45,
    height: 45,
    resizeMode: "contain",
  },

  confirmBtn: {
    backgroundColor: "#ff5a00",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },

  confirmText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },

  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  successText: {
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold",
    marginVertical: 20,
  },

  okButton: {
    backgroundColor: "#ff5a00",
    padding: 15,
    borderRadius: 10,
    width: "100%",
  },

  okText: { color: "#fff", textAlign: "center", fontSize: 18 },
});
