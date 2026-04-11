import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useCart } from "../context/CartContext";

export default function FoodDetail() {
  const router = useRouter();
  const { addToCart } = useCart();

  const { id, name, description, price, image } = useLocalSearchParams();

  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    addToCart({
      _id: String(id),
      name: name,
      price: Number(price),
      image: image,
    });
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
    addToCart({
      _id: String(id),
      name: name,
      price: Number(price),
      image: image,
    });
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      // Optional: only UI decrease (since no removeFromCart provided)
    }
  };

  return (
    <View style={styles.overlay}>
      {/* CLOSE BUTTON */}
      <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
        <Ionicons name="close" size={22} color="#000" />
      </TouchableOpacity>

      {/* MODAL CARD */}
      <View style={styles.card}>
        {/* IMAGE */}
        <Image
          source={
            image
              ? { uri: image }
              : require("../assets/images/food-placeholder.jpg")
          }
          style={styles.image}
        />

        {/* CONTENT */}
        <View style={styles.content}>
          {/* NAME + QUANTITY */}
          <View style={styles.nameRow}>
            <Text style={styles.name}>{name}</Text>

            <View style={styles.qtyContainer}>
              <TouchableOpacity onPress={handleDecrease} style={styles.qtyBtn}>
                <Text style={styles.qtyText}>-</Text>
              </TouchableOpacity>

              <Text style={styles.qtyNumber}>{quantity}</Text>

              <TouchableOpacity onPress={handleIncrease} style={styles.qtyBtn}>
                <Text style={styles.qtyText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.desc}>
            {description || "Delicious food prepared freshly."}
          </Text>

          {/* ONLY PRICE (NO TOTAL) */}
          <Text style={styles.price}>Rs. {price}</Text>

          {/* BUTTON */}
          <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
            <Text style={styles.addText}>Add to Basket</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },

  closeBtn: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 20,
    zIndex: 10,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 25,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: 220,
  },

  content: {
    padding: 20,
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
  },

  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  qtyBtn: {
    backgroundColor: "#eee",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },

  qtyText: {
    fontSize: 16,
    fontWeight: "bold",
  },

  qtyNumber: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: "bold",
  },

  desc: {
    color: "#777",
    marginVertical: 10,
  },

  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF4800",
    marginBottom: 15,
  },

  addBtn: {
    backgroundColor: "#FF4800",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
  },

  addText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
