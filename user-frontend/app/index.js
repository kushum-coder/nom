import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
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
  const [remember, setRemember] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser(email.trim(), password.trim()); // trimmed

      if (!data.token) {
        alert(data.message || "Login failed");
        return;
      }

      if (remember) await AsyncStorage.setItem("token", data.token);
      if (saveToken) await saveToken(data.token);

      router.replace("/home");
    } catch (err) {
      alert("Network or backend error. Check your connection and backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.logo}>Logo</Text>
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
          <Ionicons name="lock-closed-outline" size={20} style={styles.icon} />
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

        <TouchableOpacity
          style={styles.rememberContainer}
          onPress={() => setRemember(!remember)}
        >
          <View style={styles.tickBox}>
            {remember && <Text style={styles.checkMark}>✓</Text>}
          </View>
          <Text style={styles.rememberText}>Remember Me</Text>
        </TouchableOpacity>

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

        <TouchableOpacity onPress={() => alert("Reset password flow")}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFBD31",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: { width: "100%", maxWidth: 400, minHeight: 450, paddingVertical: 40 },
  logo: { position: "absolute", top: -40, left: 0, fontSize: 18 },
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
    marginTop: 10,
    textAlign: "center",
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  tickBox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  checkMark: { fontSize: 12, color: "#000" },
  rememberText: { marginLeft: 8 },
});
