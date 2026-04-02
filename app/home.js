import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
import { foods } from "../constants/data";
import { useCart } from "../context/CartContext";

export default function Home() {
  const router = useRouter();
  const { addToCart, cart } = useCart();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <Text style={styles.location}>Home - Kathmandu</Text>
        <Ionicons name="heart-outline" size={24} color="#FF4800" />
      </View>

      {/* SEARCH */}
      <TextInput
        placeholder="Search for food or groceries"
        placeholderTextColor="#666"
        style={styles.search}
      />

      {/* BANNER */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>30% DISCOUNT{"\n"}CHICKEN PIZZA</Text>
      </View>

      {/* CATEGORY */}
      <Text style={styles.section}>Categories</Text>

      <View style={styles.categories}>
        {["Fast Food", "Grocery", "Desserts", "Drinks"].map((cat) => (
          <View key={cat} style={styles.chip}>
            <Text style={{ color: "#FF4800" }}>{cat}</Text>
          </View>
        ))}
      </View>

      {/* FOOD LIST */}
      <FlatList
        data={foods}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.imagePlaceholder}>
              {item.image && <Image source={item.image} style={styles.image} />}
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

      {/* FLOATING CART */}
      <TouchableOpacity
        style={styles.cartBtn}
        onPress={() => router.push("/cart")}
      >
        <Ionicons name="cart" size={22} color="#fff" />
        <Text style={styles.cartText}>{totalItems}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#F5F5F5",
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  location: {
    fontWeight: "bold",
  },

  search: {
    borderWidth: 1,
    borderColor: "#FF4800",
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },

  banner: {
    backgroundColor: "#FF4800",
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
  },

  bannerText: {
    color: "#fff",
    fontWeight: "bold",
  },

  section: {
    fontWeight: "bold",
    marginVertical: 10,
  },

  categories: {
    flexDirection: "row",
    marginBottom: 10,
  },

  chip: {
    borderWidth: 1,
    borderColor: "#FF4800",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginRight: 10,
  },

  card: {
    width: "47%",
    backgroundColor: "#fff",
    margin: "1.5%",
    borderRadius: 15,
    padding: 12,
    alignItems: "center",
    elevation: 4,
  },

  imagePlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 10,
    backgroundColor: "#eee",
    marginBottom: 8,
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },

  name: {
    fontWeight: "bold",
    marginTop: 5,
  },

  price: {
    color: "#FF4800",
    marginTop: 2,
  },

  addBtn: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#FF4800",
    borderRadius: 20,
    padding: 6,
  },

  cartBtn: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    flexDirection: "row",
    backgroundColor: "#FF4800",
    padding: 15,
    borderRadius: 30,
  },

  cartText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
});
