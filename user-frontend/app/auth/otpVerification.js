import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { sendOtp, verifyOtp } from "../../api";

export default function OTPVerification() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email ?? "";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const inputs = useRef([]);

  const handleChange = (text, index) => {
    let newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 5) inputs.current[index + 1].focus();
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (!email) return alert("Email not found. Go back and start again.");
    if (code.length < 6) return alert("Enter complete OTP");

    try {
      const res = await verifyOtp(email, code);
      alert(res.message || "OTP verified successfully");
      router.push({ pathname: "/auth/newPassword", params: { email } });
    } catch (err) {
      alert(err.message || "Failed to verify OTP");
    }
  };

  const handleResend = async () => {
    try {
      const res = await sendOtp(email);
      alert(res.message || "OTP resent successfully");
    } catch (err) {
      alert("Failed to resend OTP");
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid
      keyboardShouldPersistTaps="handled"
    >
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={22} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Verification</Text>
      <Text style={styles.subtitle}>Enter Your OTP Code</Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputs.current[index] = ref)}
            style={styles.otpBox}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
          />
        ))}
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        <Text>If you didn’t receive a code? </Text>
        <TouchableOpacity onPress={handleResend}>
          <Text style={{ color: "#ff5a00", fontWeight: "bold" }}>Resend</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
    justifyContent: "center",
  },
  backBtn: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 20,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ff5a00",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: { textAlign: "center", marginBottom: 20, color: "#333" },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  otpBox: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: "#ff5a00",
    borderRadius: 25,
    textAlign: "center",
    fontSize: 18,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#ff5a00",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
