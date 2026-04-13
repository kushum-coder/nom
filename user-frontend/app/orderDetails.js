import { useLocalSearchParams, useRouter } from "expo-router";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function OrderDetails() {
  const router = useRouter();
  const { order } = useLocalSearchParams();

  const data = order ? JSON.parse(order) : null;

  if (!data) return null;

  return (
    <ScrollView style={styles.container}>
      {/* BACK BUTTON */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Text style={{ fontSize: 22 }}>←</Text>
      </TouchableOpacity>

      {/* CARD */}
      <View style={styles.card}>
        {/* TITLE */}
        <Text style={styles.title}>Order Information</Text>

        {/* TIME + DATE */}
        <View style={styles.rowSpace}>
          <Text style={styles.label}>Order time</Text>
          <Text style={styles.value}>12:01 PM</Text>
          <Text style={styles.value}>July 11</Text>
        </View>

        {/* ITEMS */}
        {data.items?.map((item, index) => {
          const food = item.food;

          return (
            <View key={index} style={styles.itemRow}>
              <Image source={{ uri: food?.image }} style={styles.img} />

              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.foodName}>
                  {food?.name} x{item.quantity}
                </Text>
              </View>

              <Text style={styles.price}>Rs {food?.price * item.quantity}</Text>
            </View>
          );
        })}

        {/* TOTAL */}
        <View style={styles.totalRow}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalPrice}>Rs {data.totalPrice}</Text>
        </View>

        {/* STATUS */}
        <View style={styles.status}>
          <Text style={styles.statusText}>
            {data.status === "delivered" ? "Completed" : data.status}
          </Text>
        </View>
      </View>

      {/* RE ORDER BUTTON */}
      <TouchableOpacity style={styles.reorderBtn}>
        <Text style={styles.reorderText}>Re-Order</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
  },

  backBtn: {
    marginBottom: 10,
  },

  card: {
    borderWidth: 1,
    borderColor: "#FF4800",
    borderRadius: 15,
    padding: 15,
  },

  title: {
    textAlign: "center",
    color: "#FF4800",
    fontWeight: "bold",
    marginBottom: 15,
  },

  rowSpace: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  label: {
    fontWeight: "bold",
  },

  value: {
    color: "#555",
  },

  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  img: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },

  foodName: {
    fontWeight: "bold",
  },

  price: {
    fontWeight: "bold",
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    borderTopWidth: 1,
    paddingTop: 10,
  },

  totalText: {
    fontSize: 16,
    fontWeight: "bold",
  },

  totalPrice: {
    fontSize: 16,
    fontWeight: "bold",
  },

  status: {
    marginTop: 10,
    alignSelf: "flex-start",
    backgroundColor: "#FF4800",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },

  statusText: {
    color: "#fff",
    fontWeight: "bold",
  },

  reorderBtn: {
    marginTop: 20,
    backgroundColor: "#FF4800",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
  },

  reorderText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
