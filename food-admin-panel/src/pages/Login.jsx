import { useState } from "react";
import InputField from "../components/InputField";
import Button from "../components/button";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Login function
  const handleLogin = async () => {
    setError("");
     
    // Validations
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      const response = await API.post(
        "/users/login",
        { email, password },
        { withCredentials: true } // 🔥 VERY IMPORTANT
      );

      const { user } = response.data;

      // 🔐 Admin check
      if (user.role !== "admin") {
        setError("Access denied. Admins only.");
        return;
      }

      // Redirect
      navigate("/dashboard");

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  // Submit on Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div style={styles.page}>
      <div style={styles.leftPane} />
      <div style={styles.rightPane}>
        <div style={styles.loginCard}>
          <img src="/logo.png" alt="Logo" style={styles.logo} />
          <h1 style={styles.heading}>LOGIN</h1>

          <div style={styles.formArea}>
            <InputField
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <InputField
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button text="Log In" onClick={handleLogin} />
            <button style={styles.forgotButton} onClick={() => alert('Forgot password flow not set')}>Forgot Password?</button>
            {error && <p style={styles.errorText}>{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f1e4",
    overflow: "hidden",
  },
  leftPane: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "58%",
    height: "100%",
    backgroundImage: "url('/admin-bg-img.png')",
    backgroundSize: "cover",
    backgroundPosition: "center right",
    clipPath: "ellipse(70% 100% at 0 50%)",
    zIndex: 1,
  },
  rightPane: {
    position: "relative",
    width: "33%",
    maxWidth: "460px",
    minWidth: "340px",
    height: "86vh",
    marginLeft: "calc(18% + 280px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  loginCard: {
    width: "92%",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.85)",
    boxShadow: "0 18px 36px rgba(36,55,87,0.18)",
    backdropFilter: "blur(6px)",
    padding: "32px 30px",
    textAlign: "center",
    marginLeft: "0",
  },
  logo: {
    width: "74px",
    marginBottom: "12px",
  },
  heading: {
    margin: "0 0 16px",
    fontSize: "2rem",
    fontWeight: 700,
    color: "#1c1c1c",
    letterSpacing: "1px",
  },
  formArea: {
    width: "100%",
  },
  forgotButton: {
    marginTop: "12px",
    border: "none",
    background: "none",
    color: "#0a58b2",
    textDecoration: "underline",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  errorText: {
    marginTop: "10px",
    color: "#d32f2f",
    fontSize: "0.9rem",
  },
};

export default Login;