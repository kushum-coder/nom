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

/* STYLES (ONLY BACKGROUND FIXED) */
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#fff", // ✅ FIXED
    alignItems: "center",
    justifyContent: "center",
  },

  container: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff", // ✅ FIXED
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
    backgroundColor: "#fff", // ✅ FIXED
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
});
