import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { resetPassword } from "../../api";

export default function NewPassword() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params?.email;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password || !confirmPassword)
      return alert("All fields are required");
    if (password !== confirmPassword) return alert("Passwords do not match");

    try {
      const res = await resetPassword(email, password, confirmPassword);
      alert(res.message || "Password reset successful");
      router.replace("/");
    } catch (err) {
      alert(err.message || "Failed to reset password");
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

      <Text style={styles.title}>New Password</Text>

      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Enter New Password"
          placeholderTextColor="#999"
          secureTextEntry={!showPassword}
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
        <Ionicons
          name={showPassword ? "eye-off" : "eye"}
          size={22}
          color="#999"
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIcon}
        />
      </View>

      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor="#999"
          secureTextEntry={!showConfirm}
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <Ionicons
          name={showConfirm ? "eye-off" : "eye"}
          size={22}
          color="#999"
          onPress={() => setShowConfirm(!showConfirm)}
          style={styles.eyeIcon}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
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
    marginBottom: 30,
  },
  inputWrapper: { position: "relative", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ff5a00",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#fff",
  },
  eyeIcon: { position: "absolute", right: 12, top: 12 },
  button: {
    backgroundColor: "#ff5a00",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
