export const BASE_URL = "http://192.168.1.67:5000"; // your backend IP

// ---------------- LOGIN ----------------
export const loginUser = async (email, password) => {
  try {
    const res = await fetch(`${BASE_URL}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Login failed");

    return data; // returns user + token
  } catch (err) {
    console.error("Login error:", err);
    throw err;
  }
};

// ---------------- SIGNUP ----------------
export const signupUser = async ({ name, email, phone, password, confirm }) => {
  try {
    const res = await fetch(`${BASE_URL}/api/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        phone,
        password,
        confirmPassword: confirm, // matches backend
      }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Signup failed");

    return data; // returns user + token
  } catch (err) {
    console.error("Signup error:", err);
    throw err;
  }
};

// ---------------- FETCH FOODS ----------------
export const fetchFoods = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/foods`);
    if (!res.ok) throw new Error("Failed to fetch foods");

    const data = await res.json();
    return data; // returns foods array
  } catch (err) {
    console.error("Error fetching foods:", err);
    throw err;
  }
};
