import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Image,
  Keyboard,
  Platform,
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
  const { cart, addToCart, increaseQty, decreaseQty } = useCart();

  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState(""); // ✅ NEW

  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.08,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      getFoods();
    }, 300);

    return () => clearTimeout(delay);
  }, [search]);

  const getFoods = async () => {
    try {
      setLoading(true);

      const data = await fetchFoods({
        search: search || "",
      });

      setFoods(Array.isArray(data) ? data : []);
      setSelectedCategory(""); // ✅ reset highlight on search
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getFoodsByCategory = async (category) => {
    try {
      setLoading(true);

      const data = await fetchFoods({
        category: category || "",
      });

      setFoods(Array.isArray(data) ? data : []);
      setSelectedCategory(category); // ✅ highlight

      Keyboard.dismiss();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getCartId = (item) => item._id || item.id;

  const getQty = (id) => {
    const item = cart.find((i) => getCartId(i) === id);
    return item?.quantity || 0;
  };

  const totalItems = cart.reduce((sum, i) => sum + Number(i.quantity || 0), 0);

  const isSearchActive = search?.trim()?.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoWrapper}>
            <Animated.Image
              source={require("../assets/nom1.png")} // ✅ CHANGED
              style={[styles.logo, { transform: [{ scale: scaleAnim }] }]}
              resizeMode="cover"
            />
          </View>

          <Text style={styles.appName}>NomNomGo</Text>
        </View>

        <TouchableOpacity
          style={styles.cartIcon}
          onPress={() => router.push("/cart")}
        >
          <Ionicons name="cart" size={18} color="#fff" />

          {totalItems > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {totalItems > 99 ? "99+" : String(totalItems)}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* SEARCH */}
      <View style={styles.search}>
        <Ionicons name="search" size={18} color="#FF4800" />
        <TextInput
          placeholder="Search for food or groceries"
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
          style={styles.searchInput}
        />
      </View>

      {/* PROMO */}
      <View style={styles.bannerWrapper}>
        <View style={styles.promoCard}>
          <View style={styles.promoTextBox}>
            <Text style={styles.promoDiscount}>30% DISCOUNT</Text>
            <Text style={styles.promoTitle}>CHICKEN PIZZA</Text>
          </View>

          <View style={styles.imageBox}>
            <Image
              source={require("../assets/images/banner.jpg")}
              style={styles.promoImage}
            />
          </View>
        </View>
      </View>

      {/* CATEGORY */}
      <Text style={styles.categoryTitle}>Categories</Text>
      <View style={styles.categories}>
        {["Fast Food", "Grocery", "Desserts", "Drinks"].map((c) => {
          const isActive = selectedCategory === c;

          return (
            <TouchableOpacity
              key={c}
              style={[
                styles.categoryChip,
                isActive && styles.activeCategory, // ✅ highlight
              ]}
              onPress={() => getFoodsByCategory(c)}
            >
              <Text
                style={[
                  styles.categoryText,
                  isActive && styles.activeCategoryText, // ✅ highlight text
                ]}
              >
                {c}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {!loading && foods.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>
            {isSearchActive
              ? "🔍 No results found for your search"
              : "😋 Nothing here yet, try another category"}
          </Text>
        </View>
      ) : loading ? (
        <View style={{ marginTop: 10 }}>
          {[1, 2, 3, 4].map((_, i) => (
            <View key={i} style={styles.skeletonCard} />
          ))}
        </View>
      ) : (
        <FlatList
          data={foods}
          numColumns={2}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => {
            const qty = getQty(item._id);

            return (
              <View style={styles.card}>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/foodDetail",
                      params: {
                        id: item._id,
                        name: item.name,
                        description: item.description,
                        price: item.price,
                        image: item.image,
                      },
                    })
                  }
                >
                  <Image
                    source={
                      item.image
                        ? { uri: item.image }
                        : require("../assets/images/food-placeholder.jpg")
                    }
                    style={styles.image}
                  />

                  <Text style={styles.name} numberOfLines={2}>
                    {item.name}
                  </Text>

                  <Text style={styles.price}>Rs {item.price}</Text>
                </TouchableOpacity>

                {qty === 0 ? (
                  <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => addToCart(item)}
                  >
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>+</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.qtyBox}>
                    <TouchableOpacity onPress={() => decreaseQty(item._id)}>
                      <Text style={styles.qtyBtn}>-</Text>
                    </TouchableOpacity>

                    <Text style={styles.qty}>{qty}</Text>

                    <TouchableOpacity onPress={() => increaseQty(item._id)}>
                      <Text style={styles.qtyBtn}>+</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  logoContainer: { flexDirection: "row", alignItems: "center" },
  logoWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: { width: "100%", height: "100%" },
  appName: {
    fontSize: 20,
    fontWeight: "900",
    color: "#FF4800",
    marginLeft: 8,
    letterSpacing: 0.5,
  },

  /* ✅ NEW styles */
  activeCategory: {
    backgroundColor: "#FF4800",
  },
  activeCategoryText: {
    color: "#fff",
  },

  cartIcon: {
    backgroundColor: "#FF4800",
    padding: 10,
    borderRadius: 20,
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#fff",
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    fontSize: 10,
    color: "#FF4800",
    fontWeight: "bold",
  },
  search: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FF4800",
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 10 : 6,
    marginBottom: 10,
  },
  searchInput: { marginLeft: 8, flex: 1, color: "#000" },
  bannerWrapper: { marginBottom: 10 },
  promoCard: {
    flexDirection: "row",
    backgroundColor: "#FF4800",
    borderRadius: 22,
    overflow: "hidden",
  },
  promoTextBox: { flex: 1, padding: 15 },
  promoDiscount: { color: "#fff", fontWeight: "800", fontSize: 14 },
  promoTitle: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 18,
    marginTop: 5,
  },
  imageBox: {
    backgroundColor: "#fff",
    padding: 4,
    borderTopLeftRadius: 80,
    borderBottomLeftRadius: 80,
  },
  promoImage: {
    width: 140,
    height: 100,
    resizeMode: "cover",
    borderTopLeftRadius: 80,
    borderBottomLeftRadius: 80,
  },
  categoryTitle: {
    fontWeight: "bold",
    marginVertical: 10,
    fontSize: 16,
  },
  categories: { flexDirection: "row", marginBottom: 10 },
  categoryChip: {
    borderWidth: 1.5,
    borderColor: "#FF4800",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginRight: 8,
  },
  categoryText: {
    color: "#FF4800",
    fontSize: 12,
    fontWeight: "600",
  },
  card: {
    flex: 1,
    margin: 6,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 10,
    borderWidth: 1.5,
    borderColor: "#FF4800",
    elevation: 3,
    minHeight: 190,
  },
  image: { width: "100%", height: 100, borderRadius: 10 },
  name: {
    fontWeight: "bold",
    marginTop: 5,
    paddingRight: 30,
  },
  price: { color: "#FF4800", marginTop: 2 },
  addBtn: {
    position: "absolute",
    right: 10,
    bottom: 10,
    backgroundColor: "#FF4800",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  qtyBox: {
    position: "absolute",
    right: 10,
    bottom: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 6,
  },
  qtyBtn: {
    fontSize: 16,
    color: "#FF4800",
    paddingHorizontal: 5,
  },
  qty: { fontWeight: "bold" },
  emptyBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
  },
  emptyText: {
    fontSize: 14,
    color: "#888",
    fontWeight: "500",
  },
});
