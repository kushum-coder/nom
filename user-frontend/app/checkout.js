import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView, // ✅ ADDED
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function Checkout() {
  const router = useRouter();
  const { cart, total } = useLocalSearchParams();

  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [landmark, setLandmark] = useState("");

  const items = useMemo(() => {
    try {
      return cart ? JSON.parse(cart) : [];
    } catch {
      return [];
    }
  }, [cart]);

  const handlePlaceOrder = () => {
    if (!city.trim() || !street.trim() || !landmark.trim()) {
      alert("Please fill all delivery details.");
      return;
    }

    console.log("Placing order...", { items, total, city, street, landmark });

    alert("Order placed successfully!");

    router.push({
      pathname: "/PaymentPage",
      params: {
        cart: JSON.stringify(items),
        total,
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {/* ✅ SCROLLVIEW ADDED */}
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backBtn}
              >
                <Ionicons name="arrow-back" size={28} color="#FF4800" />
              </TouchableOpacity>

              <Text style={styles.title}>Your Cart Food</Text>
            </View>

            {/* ✅ DISABLED INTERNAL SCROLL */}
            <FlatList
              data={items}
              scrollEnabled={false} // 👈 IMPORTANT FIX
              keyExtractor={(item, index) => (item._id || item.id) + index}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Image source={{ uri: item.image }} style={styles.image} />

                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.price}>Rs {item.price}</Text>
                  </View>

                  <Text style={styles.qty}>x{item.quantity}</Text>
                </View>
              )}
            />

            <View style={styles.totalBox}>
              <Text style={styles.totalText}>Total</Text>
              <Text style={styles.totalValue}>Rs {total}</Text>
            </View>

            <View style={styles.deliveryBox}>
              <Text style={styles.deliveryTitle}>Delivery Details</Text>

              <TextInput
                style={styles.input}
                placeholder="City"
                placeholderTextColor="#888"
                value={city}
                onChangeText={setCity}
              />
              <TextInput
                style={styles.input}
                placeholder="Street"
                placeholderTextColor="#888"
                value={street}
                onChangeText={setStreet}
              />
              <TextInput
                style={styles.input}
                placeholder="Notable Landmark"
                placeholderTextColor="#888"
                value={landmark}
                onChangeText={setLandmark}
              />
            </View>

            <TouchableOpacity
              style={styles.placeBtn}
              onPress={handlePlaceOrder}
            >
              <Text style={styles.placeText}>Place Order</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => router.replace("/home")}
            >
              <Text style={styles.cancelText}>Cancel Order</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

/* styles unchanged */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
    marginBottom: 20,
    position: "relative",
  },
  backBtn: {
    position: "absolute",
    left: 0,
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FF4800",
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 10,
  },
  name: { fontWeight: "700" },
  price: { color: "#666" },
  qty: { fontWeight: "bold", color: "#FF4800" },
  totalBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginVertical: 10,
  },
  totalText: { fontSize: 16, fontWeight: "700" },
  totalValue: { fontSize: 16, fontWeight: "900", color: "#FF4800" },
  deliveryBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
  },
  deliveryTitle: { fontWeight: "800", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    color: "#000",
  },
  placeBtn: {
    backgroundColor: "#FF4800",
    padding: 15,
    borderRadius: 12,
    marginTop: 15,
    alignItems: "center",
  },
  placeText: { color: "#fff", fontWeight: "900" },
  cancelBtn: {
    marginTop: 10,
    borderWidth: 1.5,
    borderColor: "#FF4800",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelText: { color: "#FF4800", fontWeight: "800" },
});
