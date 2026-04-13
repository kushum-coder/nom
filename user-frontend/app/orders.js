import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getMyOrders } from "../api";

export default function Orders() {
  const [tab, setTab] = useState("ongoing");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        setOrders([]);
        return;
      }

      const data = await getMyOrders(token);
      setOrders(data || []);
    } catch (err) {
      console.log("Order fetch error:", err.message);
      setOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
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
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" />

      <Text style={styles.header}>
        {tab === "ongoing" ? "Order" : "History"}
      </Text>

      <View style={styles.toggleWrapper}>
        <TouchableOpacity
          style={[styles.toggleBtn, tab === "ongoing" && styles.activeToggle]}
          onPress={() => setTab("ongoing")}
        >
          <Text
            style={[styles.toggleText, tab === "ongoing" && styles.activeText]}
          >
            Ongoing
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleBtn, tab === "history" && styles.activeToggle]}
          onPress={() => setTab("history")}
        >
          <Text
            style={[styles.toggleText, tab === "history" && styles.activeText]}
          >
            History
          </Text>
        </TouchableOpacity>
      </View>

      {!loading && filtered.length === 0 && (
        <Text style={styles.emptyText}>No orders yet</Text>
      )}

      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          loadOrders();
        }}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => {
          const step = getStep(item.status);

          return (
            <View style={styles.card}>
              {/* ONGOING */}
              {tab === "ongoing" && (
                <>
                  <View style={styles.stepsRow}>
                    {[1, 2, 3].map((i) => (
                      <View key={i} style={styles.stepItem}>
                        <View
                          style={[
                            styles.circle,
                            i <= step && styles.activeCircle,
                          ]}
                        >
                          <Image
                            source={
                              i === 1
                                ? require("../assets/preparing.png")
                                : i === 2
                                  ? require("../assets/readytodeliver.jpg")
                                  : require("../assets/delivered.jpg")
                            }
                            style={styles.circleImage}
                          />
                        </View>

                        <Text style={styles.stepText}>
                          {i === 1
                            ? "Preparing"
                            : i === 2
                              ? "Ready To Deliver"
                              : "Delivered"}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* 🔥 FIXED PART BELOW */}
                  {item.items?.map((itemRow, index) => {
                    const food = itemRow.food; // ✅ IMPORTANT FIX

                    return (
                      <View key={index} style={styles.itemRow}>
                        {food?.image ? (
                          <Image
                            source={{ uri: food.image }}
                            style={styles.foodImage}
                          />
                        ) : null}

                        <View style={{ flex: 1 }}>
                          <Text style={styles.foodName}>{food?.name}</Text>
                        </View>

                        <Text style={styles.qty}>x{itemRow.quantity}</Text>
                      </View>
                    );
                  })}

                  <View style={styles.totalRow}>
                    <Text style={styles.totalText}>Total</Text>
                    <Text style={styles.totalAmount}>Rs {item.totalPrice}</Text>
                  </View>
                </>
              )}

              {/* HISTORY */}
              {tab === "history" && (
                <View style={styles.historyRow}>
                  <Image
                    source={getImage(item.status)}
                    style={styles.historyImage}
                  />

                  <View style={{ flex: 1 }}>
                    <Text style={styles.foodName}>
                      {item.items?.[0]?.food?.name}
                    </Text>
                    <Text style={styles.timeText}>12:01</Text>
                  </View>

                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={styles.priceRight}>Rs {item.totalPrice}</Text>

                    <View style={styles.completedBtn}>
                      <Text style={styles.completedText}>Completed</Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

/* STYLES (UNCHANGED) */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  header: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF4800",
    marginBottom: 15,
  },
  toggleWrapper: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#FF4800",
    borderRadius: 25,
    overflow: "hidden",
    marginBottom: 15,
  },
  toggleBtn: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },
  activeToggle: {
    backgroundColor: "#FF4800",
  },
  toggleText: {
    color: "#333",
    fontWeight: "600",
  },
  activeText: {
    color: "#fff",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    color: "#777",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 12,
    marginBottom: 15,
    elevation: 3,
  },
  stepsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  stepItem: {
    alignItems: "center",
    flex: 1,
  },
  circle: {
    width: 55,
    height: 55,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  activeCircle: {
    borderColor: "#FF4800",
  },
  circleImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  stepText: {
    fontSize: 11,
    marginTop: 5,
    textAlign: "center",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  foodImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 10,
  },
  foodName: {
    fontWeight: "bold",
    color: "#FF4800",
  },
  qty: {
    fontWeight: "bold",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    marginTop: 10,
    paddingTop: 10,
  },
  totalText: {
    fontWeight: "bold",
  },
  totalAmount: {
    fontWeight: "bold",
  },
  historyRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  historyImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },
  timeText: {
    fontSize: 12,
    color: "#777",
  },
  priceRight: {
    color: "#FF4800",
    fontWeight: "bold",
  },
  completedBtn: {
    backgroundColor: "#FF4800",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginTop: 5,
  },
  completedText: {
    color: "#fff",
    fontSize: 12,
  },
});
