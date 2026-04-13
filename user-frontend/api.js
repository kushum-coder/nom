export const BASE_URL = "http://192.168.1.66:5000"; // Update if your IP changes

// ---------------- HELPER TO HANDLE JSON OR NON-JSON RESPONSES ----------------
const safeFetchJson = async (url, options) => {
  try {
    const res = await fetch(url, options);
    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("Non-JSON response:", text);
      throw new Error("Server did not return JSON. Check backend route.");
    }

    if (!res.ok) {
      const message = data?.message || "Request failed";
      throw new Error(message);
    }

    return data;
  } catch (err) {
    console.error("Fetch error:", err);
    throw new Error(err.message || "Network error.");
  }
};

// ---------------- LOGIN ----------------
export const loginUser = async (email, password) => {
  return safeFetchJson(`${BASE_URL}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
};

// ---------------- SIGNUP ----------------
export const signupUser = async ({ name, email, phone, password, confirm }) => {
  return safeFetchJson(`${BASE_URL}/api/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      email,
      phone,
      password,
      confirmPassword: confirm,
    }),
  });
};

// ---------------- FETCH FOODS (FIXED) ----------------
export const fetchFoods = async ({ search = "", category = "" } = {}) => {
  let url = `${BASE_URL}/api/foods`;

  // CATEGORY (IMPORTANT FIX - matches backend route)
  if (category && category.trim().length > 0) {
    url = `${BASE_URL}/api/foods/category/${encodeURIComponent(category.trim())}`;
  }

  // SEARCH (only if no category selected)
  else if (search && search.trim().length > 0) {
    url = `${BASE_URL}/api/foods?search=${encodeURIComponent(search.trim())}`;
  }

  return safeFetchJson(url);
};

// ---------------- ORDER APIs ----------------
export const placeOrder = async (items, token) => {
  return safeFetchJson(`${BASE_URL}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ items }),
  });
};

export const getMyOrders = async (token) => {
  return safeFetchJson(`${BASE_URL}/api/orders/my`, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};

// ---------------- FORGOT PASSWORD FLOW ----------------
export const sendOtp = async (email) => {
  return safeFetchJson(`${BASE_URL}/api/users/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
};

export const verifyOtp = async (email, otp) => {
  return safeFetchJson(`${BASE_URL}/api/users/verify-reset-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });
};

export const resetPassword = async (email, password, confirmPassword) => {
  return safeFetchJson(`${BASE_URL}/api/users/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, confirmPassword }),
  });
};
