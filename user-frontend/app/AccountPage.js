import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function AccountPage() {
  const [newMenu, setNewMenu] = useState(true);
  const [pickupReminder, setPickupReminder] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(false);

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Account</Text>
        </View>

        {/* PROFILE */}
        <View style={styles.profile}>
          <Ionicons name="person-outline" size={42} />
          <Text style={styles.name}>Username</Text>
          <Text style={styles.email}>Username@gmail.com</Text>
        </View>

        {/* SETTINGS */}
        <View style={styles.card}>
          <Text style={styles.groupTitle}>Preferences</Text>

          <Row
            icon="notifications-outline"
            text="Notify When New Menu is Uploaded"
            value={newMenu}
            setValue={setNewMenu}
          />

          <Text style={styles.groupTitle}>Notifications</Text>

          <Row
            icon="notifications-outline"
            text="Order Pickup Reminder"
            value={pickupReminder}
            setValue={setPickupReminder}
          />

          <Row
            icon="notifications-outline"
            text="Daily Special Reminders"
            value={dailyReminder}
            setValue={setDailyReminder}
          />

          {/* SECURITY */}
          <Text style={styles.groupTitle}>Security</Text>

          <TouchableOpacity style={styles.securityBtn}>
            <Ionicons name="lock-closed-outline" size={16} />
            <Text style={styles.rowText}>Change Password</Text>
            <Ionicons name="chevron-forward-outline" size={16} />
          </TouchableOpacity>

          {/* LOGOUT */}
          <TouchableOpacity style={styles.logoutBtn}>
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* BOTTOM NAV */}
        <View style={styles.bottomNav}>
          <Ionicons name="home-outline" size={20} color="#fff" />
          <Ionicons name="camera-outline" size={20} color="#fff" />
          <Ionicons name="person-outline" size={20} color="#fff" />
        </View>
      </View>
    </View>
  );
}

/* REUSABLE ROW */
function Row({ icon, text, value, setValue }) {
  return (
    <View style={styles.row}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Ionicons name={icon} size={14} />
        <Text style={styles.rowText}>{text}</Text>
      </View>

      <TouchableOpacity onPress={() => setValue(!value)}>
        <Ionicons
          name={value ? "toggle" : "toggle-outline"}
          size={28}
          color={value ? "#ff5a00" : "#999"}
        />
      </TouchableOpacity>
    </View>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },

  container: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#ddd",
    padding: 20,
    borderRadius: 20,
  },

  header: {
    alignItems: "center",
    marginBottom: 15,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
  },

  profile: {
    alignItems: "center",
    marginBottom: 20,
  },

  name: {
    fontWeight: "bold",
    marginTop: 5,
  },

  email: {
    fontSize: 12,
    color: "#555",
  },

  card: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 20,
  },

  groupTitle: {
    textAlign: "center",
    fontWeight: "bold",
    marginVertical: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  rowText: {
    fontSize: 12,
  },

  securityBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },

  logoutBtn: {
    marginTop: 10,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  bottomNav: {
    marginTop: 20,
    backgroundColor: "#ff5a00",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    borderRadius: 15,
  },
});
