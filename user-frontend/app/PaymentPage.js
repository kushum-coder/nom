import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const PaymentPage = () => {
  const [selectedMethod, setSelectedMethod] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const esewaLogo = require("../assets/esewa.png");
  const khaltiLogo = require("../assets/khalti.png");

  const billingItems = [
    {
      name: "Chicken Burger x1",
      unitPrice: "Rs 220",
      total: "Rs 220",
    },
    {
      name: "Noodles x3",
      unitPrice: "Rs. 180",
      total: "Rs 540",
    },
  ];

  const paymentMethods = [
    { id: "cod", label: "Cash On Delivery" },
    { id: "esewa", label: "eSewa", logo: esewaLogo },
    { id: "khalti", label: "Khalti", logo: khaltiLogo },
  ];

  const handleConfirm = () => {
    if (!selectedMethod) {
      Alert.alert("Error", "Please select a payment method");
      return;
    }
    setShowSuccess(true);
  };

  const handleOkay = () => {
    Alert.alert("Success", "Payment successful");
  };

  if (showSuccess) {
    return (
      <View style={styles.pageShell}>
        <View style={styles.frame}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setShowSuccess(false)}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Payment Confirmation</Text>
          </View>

          <View style={styles.successPanel}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark-circle" size={64} color="green" />
            </View>

            <Text style={styles.successText}>
              Your Payment was{"\n"}successful.
            </Text>

            <TouchableOpacity style={styles.okButton} onPress={handleOkay}>
              <Text style={styles.okText}>Okay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.pageShell}>
      <View style={styles.frame}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Payment</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* BILLING */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Billings</Text>

            {billingItems.map((item, index) => (
              <View key={index}>
                <View style={styles.row}>
                  <View>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemPrice}>{item.unitPrice}</Text>
                  </View>

                  <Text style={styles.itemTotal}>{item.total}</Text>
                </View>

                {index !== billingItems.length - 1 && (
                  <View style={styles.divider} />
                )}
              </View>
            ))}

            <View style={styles.totalRow}>
              <Text>Total</Text>
              <Text>Rs 760</Text>
            </View>
          </View>

          {/* PAYMENT METHODS */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Payment Method</Text>

            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.methodBox,
                  selectedMethod === method.id && styles.selectedBox,
                ]}
                onPress={() => setSelectedMethod(method.id)}
              >
                <View style={styles.radioBox}>
                  {selectedMethod === method.id && (
                    <View style={styles.radioInner} />
                  )}
                </View>

                {method.logo ? (
                  <View style={styles.methodRow}>
                    <Image source={method.logo} style={styles.logo} />
                    <Text style={styles.methodText}>{method.label}</Text>
                  </View>
                ) : (
                  <Text style={styles.methodText}>{method.label}</Text>
                )}
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
              <Text style={styles.confirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default PaymentPage;

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  pageShell: {
    flex: 1,
    backgroundColor: "#efefef",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },

  frame: {
    flex: 1,
    width: "100%",
    backgroundColor: "#dddddd",
    padding: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  backButton: {
    padding: 10,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ff5a00",
    flex: 1,
    textAlign: "center",
  },

  card: {
    backgroundColor: "#f7f7f7",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },

  itemName: {
    fontSize: 16,
    fontWeight: "500",
  },

  itemPrice: {
    fontSize: 14,
    color: "#555",
  },

  itemTotal: {
    fontSize: 15,
    fontWeight: "500",
  },

  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 5,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    fontWeight: "bold",
  },

  methodBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#fff",
  },

  selectedBox: {
    borderColor: "#ff5a00",
  },

  radioBox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ff5a00",
  },

  methodRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    marginRight: 10,
  },

  methodText: {
    fontSize: 16,
  },

  confirmBtn: {
    backgroundColor: "#ff5a00",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },

  confirmText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },

  successPanel: {
    alignItems: "center",
    marginTop: 50,
  },

  successIcon: {
    marginBottom: 20,
  },

  successText: {
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 20,
  },

  okButton: {
    backgroundColor: "#ff5a00",
    padding: 15,
    borderRadius: 10,
    width: "100%",
  },

  okText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
  },
});
