import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchFoods } from "../api";
import { useCart } from "../context/CartContext";

export default function Home() {
  const router = useRouter();
  const { addToCart, cart } = useCart();
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    const getFoods = async () => {
      try {
        const foodsData = await fetchFoods();
        if (Array.isArray(foodsData)) setFoods(foodsData);
        else setFoods([]);
      } catch (err) {
        console.log("Error fetching foods:", err);
        alert("Could not load foods. Check backend or network.");
      }
    };
    getFoods();
  }, []);

  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        {/* DELIVER TO STACK */}
        <View style={styles.deliverContainer}>
          <Text style={styles.deliver}>Deliver to</Text>
          <View style={styles.locationRow}>
            <Ionicons
              name="location-sharp"
              size={16}
              color="#FF4800"
              style={{ marginRight: 4 }}
            />
            <Text style={styles.location}>Home - Kathmandu</Text>
            <Ionicons name="chevron-down" size={16} color="#000" />
          </View>
        </View>

        <TouchableOpacity
          style={styles.cartCircle}
          onPress={() => router.push("/cart")}
        >
          <Ionicons name="cart-outline" size={20} color="#fff" />
          {totalItems > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{totalItems}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#666" />
        <TextInput
          placeholder="Search for food or groceries"
          placeholderTextColor="#666"
          style={styles.searchInput}
        />
      </View>

      <View style={styles.banner}>
        <Image
          source={require("../assets/images/banner.jpg")}
          style={styles.bannerImage}
        />
        <View style={styles.bannerOverlay}>
          <Text style={styles.bannerText}>30% DISCOUNT{"\n"}CHICKEN PIZZA</Text>
        </View>
      </View>

      <Text style={styles.section}>Categories</Text>
      <View style={styles.categories}>
        {["Fast Food", "Grocery", "Desserts", "Drinks"].map((cat) => (
          <View key={cat} style={styles.chip}>
            <Text style={{ color: "#FF4800" }}>{cat}</Text>
          </View>
        ))}
      </View>

      <FlatList
        data={foods}
        numColumns={2}
        keyExtractor={(item) => (item.id || item._id)?.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.imagePlaceholder}>
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.image} />
              ) : null}
            </View>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>Rs. {item.price}</Text>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => addToCart(item)}
            >
              <Ionicons name="add" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 15 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  deliverContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
  },
  deliver: { fontSize: 12, color: "#666" },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2, // spacing between Deliver to and Home-Kathmandu
  },
  location: { fontWeight: "bold", marginRight: 4 },
  cartCircle: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: "#FF4800",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#fff",
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { fontSize: 10, fontWeight: "bold", color: "#FF4800" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    paddingHorizontal: 10,
    borderRadius: 20,
    marginBottom: 15,
  },
  searchInput: { flex: 1, paddingVertical: 8, marginLeft: 5 },
  banner: {
    height: 150,
    borderRadius: 20,
    marginBottom: 15,
    overflow: "hidden",
    position: "relative",
  },
  bannerImage: { width: "100%", height: "100%" },
  bannerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,77,0,0.3)",
    justifyContent: "center",
    alignItems: "center", // center the banner text
  },
  bannerText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  section: { fontWeight: "bold", fontSize: 16, marginBottom: 10 },
  categories: { flexDirection: "row", flexWrap: "wrap", marginBottom: 15 },
  chip: {
    borderWidth: 1,
    borderColor: "#FF4800",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginRight: 10,
    marginBottom: 10,
  },
  card: {
    flex: 1,
    margin: 5,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 10,
    borderWidth: 1.5,
    borderColor: "#FF4800",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    position: "relative",
  },
  imagePlaceholder: {
    width: "100%",
    height: 100,
    borderRadius: 10,
    backgroundColor: "#eee",
    marginBottom: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  image: { width: "100%", height: "100%", borderRadius: 10 },
  name: { fontWeight: "bold", fontSize: 14 },
  price: { fontSize: 12, color: "#666" },
  addBtn: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#FF4800",
    borderRadius: 20,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
});
