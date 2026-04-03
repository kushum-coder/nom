import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, increaseQty, decreaseQty, getTotal } = useCart();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>My Cart</Text>
      </View>

      <FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>Rs. {item.price}</Text>
            </View>

            <View style={styles.controls}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => decreaseQty(item.id)}
              >
                <Text style={styles.qtyText}>-</Text>
              </TouchableOpacity>

              <Text style={styles.qty}>{item.quantity}</Text>

              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => increaseQty(item.id)}
              >
                <Text style={styles.qtyText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <View style={styles.bottom}>
        <Text style={styles.total}>Total Rs {getTotal()}</Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.addMore}
            onPress={() => router.push("/home")}
          >
            <Text>Add More</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.payBtn}>
            <Text style={styles.payText}>Payment</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fff",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 10,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 15,
  },

  itemCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 15,
    backgroundColor: "#F5F5F5",
    marginVertical: 8,
  },

  name: {
    fontWeight: "bold",
    fontSize: 14,
  },

  price: {
    color: "#FF4800",
    marginTop: 4,
  },

  controls: {
    flexDirection: "row",
    alignItems: "center",
  },

  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#FF4800",
    alignItems: "center",
    justifyContent: "center",
  },

  qtyText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  qty: {
    marginHorizontal: 12,
    fontWeight: "bold",
  },

  bottom: {
    marginTop: "auto",
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingTop: 15,
  },

  total: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 12,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  addMore: {
    borderWidth: 1,
    borderColor: "#FF4800",
    padding: 12,
    borderRadius: 10,
  },

  payBtn: {
    backgroundColor: "#FF4800",
    padding: 12,
    borderRadius: 10,
  },

  payText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
