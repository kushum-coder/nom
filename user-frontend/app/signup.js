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
import { signupUser } from "../api";
import { useCart } from "../context/CartContext";

export default function Signup() {
  const router = useRouter();
  const { saveToken } = useCart();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [secure1, setSecure1] = useState(true);
  const [secure2, setSecure2] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    const trimmedEmail = email.trim();
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirm = confirm.trim();

    if (
      !trimmedEmail ||
      !trimmedName ||
      !trimmedPhone ||
      !trimmedPassword ||
      !trimmedConfirm
    ) {
      alert("Please fill all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(trimmedEmail)) {
      alert("Please enter a valid email address");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(trimmedPhone)) {
      alert("Phone number must be 10 digits");
      return;
    }

    if (trimmedPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (trimmedPassword !== trimmedConfirm) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const data = await signupUser({
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
        password: trimmedPassword,
        confirm: trimmedConfirm,
      });

      // Handle backend error messages gracefully
      if (data?.message && !data?.token) {
        alert(data.message); // shows "User already exists" or other backend messages
        return;
      }

      if (!data?.token) {
        alert("Signup failed. Check backend.");
        return;
      }

      if (saveToken) await saveToken(data.token);

      router.replace("/");
    } catch (err) {
      // Handle non-JSON or network errors
      console.error("Signup error:", err);
      if (err?.message) {
        alert(err.message);
      } else {
        alert("Something went wrong. Check your network or backend.");
      }
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
          <Text style={styles.subtitle}>Sign Up</Text>

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

          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} style={styles.icon} />
            <TextInput
              placeholder="Enter Your Full Name"
              placeholderTextColor="#999"
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={20} style={styles.icon} />
            <TextInput
              placeholder="Enter Your Phone Number"
              placeholderTextColor="#999"
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="numeric"
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
              secureTextEntry={secure1}
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setSecure1(!secure1)}>
              <Ionicons name={secure1 ? "eye-off" : "eye"} size={22} />
            </TouchableOpacity>
          </View>

          <View style={styles.passwordContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              style={styles.icon}
            />
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="#999"
              secureTextEntry={secure2}
              style={styles.passwordInput}
              value={confirm}
              onChangeText={setConfirm}
            />
            <TouchableOpacity onPress={() => setSecure2(!secure2)}>
              <Ionicons name={secure2 ? "eye-off" : "eye"} size={22} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleSignup}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Signing Up..." : "Sign Up"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.bottomText}>
            Already have an account?{" "}
            <Text style={styles.link} onPress={() => router.push("/")}>
              Sign In!
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
    justifyContent: "center",
    padding: 20,
  },

  card: {
    width: "100%",
    maxWidth: 400,
    minHeight: 500,
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
});
