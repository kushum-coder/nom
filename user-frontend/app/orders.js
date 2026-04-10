import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getMyOrders } from "../api";

export default function Orders() {
  const [tab, setTab] = useState("ongoing");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const data = await getMyOrders(null);
    setOrders(data);
  };

  const getStep = (status) => {
    if (status === "preparing") return 1;
    if (status === "out_for_delivery") return 2;
    return 3;
  };

  const getImage = (status) => {
    if (status === "delivered") return require("../assets/delivered.jpg");
    if (status === "out_for_delivery")
      return require("../assets/readytodeliver.jpg");
    return require("../assets/preparing.png");
  };

  const filtered =
    tab === "ongoing"
      ? orders.filter((o) => o.status !== "delivered")
      : orders.filter((o) => o.status === "delivered");

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Orders</Text>

      {/* TABS */}
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setTab("ongoing")}>
          <Text style={tab === "ongoing" ? styles.active : styles.inactive}>
            Ongoing
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setTab("history")}>
          <Text style={tab === "history" ? styles.active : styles.inactive}>
            History
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          const step = getStep(item.status);

          return (
            <View style={styles.card}>
              <Image source={getImage(item.status)} style={styles.image} />

              {/* PROGRESS */}
              <View style={styles.progress}>
                {[1, 2, 3].map((i) => (
                  <View
                    key={i}
                    style={[styles.circle, i <= step && styles.activeCircle]}
                  />
                ))}
              </View>

              <Text style={styles.price}>Rs {item.totalPrice}</Text>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#fff" },

  header: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#FF4800",
    marginBottom: 10,
  },

  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },

  active: {
    color: "#FF4800",
    fontWeight: "bold",
  },

  inactive: {
    color: "#999",
  },

  card: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 15,
    marginBottom: 10,
  },

  image: {
    width: "100%",
    height: 120,
    borderRadius: 10,
  },

  progress: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },

  circle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#ccc",
  },

  activeCircle: {
    backgroundColor: "#FF4800",
  },

  price: {
    textAlign: "right",
    color: "#FF4800",
    fontWeight: "bold",
  },
});
