import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { loginUser } from "../api";
import { useCart } from "../context/CartContext";

export default function Login() {
  const router = useRouter();
  const { saveToken } = useCart();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser(email.trim(), password.trim());

      if (!data.token) {
        alert(data.message || "Login failed");
        return;
      }

      if (saveToken) await saveToken(data.token);

      router.replace("/home");
    } catch (err) {
      alert("Network or backend error. Check your connection and backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={{ flex: 1 }} // ✅ FIX: prevents white gap
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>WELCOME</Text>
          <Text style={styles.subtitle}>Sign In</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} style={styles.icon} />
            <TextInput
              placeholder="Enter Your Email"
              placeholderTextColor="#999"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.passwordContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              style={styles.icon}
            />
            <TextInput
              placeholder="Enter Password"
              placeholderTextColor="#999"
              secureTextEntry={secure}
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setSecure(!secure)}>
              <Ionicons name={secure ? "eye-off" : "eye"} size={22} />
            </TouchableOpacity>
          </View>

          <View style={styles.rowBetween}>
            <TouchableOpacity
              onPress={() => router.push("/auth/forgotPassword")}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Signing In..." : "Sign In"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.bottomText}>
            Don't have an account?{" "}
            <Text style={styles.link} onPress={() => router.push("/signup")}>
              Sign Up!
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFBD31",
    alignItems: "center",
    justifyContent: "space-between", // ✅ FIX: removes bottom white space
    padding: 20,
    paddingBottom: 40, // ✅ extra safety for bottom spacing
  },

  card: {
    width: "100%",
    maxWidth: 400,
    minHeight: 450,
    paddingVertical: 40,
    alignItems: "center",
  },

  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#FF4800",
  },

  subtitle: { marginBottom: 30, textAlign: "center" },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "orange",
    marginBottom: 15,
    paddingHorizontal: 15,
  },

  icon: { marginRight: 10 },

  input: { flex: 1, paddingVertical: 15 },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "orange",
    paddingHorizontal: 15,
    marginBottom: 15,
  },

  passwordInput: { flex: 1, paddingVertical: 15 },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },

  button: {
    width: "100%",
    backgroundColor: "#FF4800",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
  },

  buttonText: { color: "#fff", fontWeight: "bold" },

  bottomText: { marginTop: 20, textAlign: "center" },

  link: { fontWeight: "bold" },

  forgotText: {
    color: "#FF4800",
    fontWeight: "bold",
  },
});
