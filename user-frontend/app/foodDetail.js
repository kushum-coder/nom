import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useCart } from "../context/CartContext";

export default function FoodDetail() {
  const router = useRouter();
  const { addToCart } = useCart();

  const { id, name, description, price, image } = useLocalSearchParams();

  const handleAdd = () => {
    addToCart({
      _id: String(id),
      name: name,
      price: Number(price), // ✅ FIX: ensure number
      image: image,
    });
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
          <Text style={styles.name}>{name}</Text>

          <Text style={styles.desc}>
            {description || "Delicious food prepared freshly."}
          </Text>

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
