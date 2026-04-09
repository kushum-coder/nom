import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", category: "", imageUrl: "", availability: true });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const resetForm = () => setForm({ name: "", price: "", category: "", imageUrl: "", availability: true });

  useEffect(() => {
    const fetchFoods = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await API.get("/foods");
        setItems(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load items");
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, []);

  const addOrUpdateItem = async (e) => {
    e.preventDefault();
    const newItem = {
      name: form.name.trim(),
      price: Number(form.price),
      category: form.category.trim(),
      image: form.imageUrl.trim(),
      availability: form.availability,
    };

    if (!newItem.name || !newItem.category || !newItem.image || isNaN(newItem.price) || newItem.price <= 0) {
      alert("Please enter valid name, category, price, and image URL.");
      return;
    }

    try {
      if (editingId) {
        const res = await API.put(`/foods/${editingId}`, newItem);
        setItems((prev) => prev.map((item) => (item._id === editingId ? res.data : item)));
        setEditingId(null);
      } else {
        const res = await API.post("/foods", newItem);
        setItems((prev) => [res.data, ...prev]);
      }
      resetForm();
    } catch (err) {
      alert(err.response?.data?.message || "Item save failed");
    }
  };

  const editItem = (item) => {
    setEditingId(item._id);
    setForm({ 
      name: item.name,
      price: String(item.price),
      category: item.category,
      imageUrl: item.image || "",
      availability: item.availability ?? true,
    });
  };

  const deleteItem = async (id) => {
    if (window.confirm("Delete this item?")) {
      try {
        await API.delete(`/foods/${id}`);
        setItems((prev) => prev.filter((item) => item._id !== id));
        if (editingId === id) {
          setEditingId(null);
          resetForm();
        }
      } catch (err) {
        alert(err.response?.data?.message || "Delete failed");
      }
    }
  };

  const toggleAvailability = async (item) => {
    try {
      const updated = await API.put(`/foods/${item._id}`, { availability: !item.availability });
      setItems((prev) => prev.map((f) => (f._id === item._id ? updated.data : f)));
      if (editingId === item._id) {
        setForm((f) => ({ ...f, availability: !item.availability }));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update availability');
    }
  };

  const handleLogout = async () => {
    await API.post("/users/logout");
    window.location.href = "/";
  };

  return (
    <div style={styles.layout}>
      <aside style={styles.sidebar}>
        <div style={styles.brandWrap}>
          <img src="/logo.png" alt="Logo" style={styles.logo} />
          <div>
            <p style={styles.brandTitle}>NomNomGo</p>
            <p style={styles.brandSubtitle}>Admin Panel</p>
          </div>
        </div>

        <button style={styles.navButtonActive}>Menu Management</button>
        <button style={styles.navButton} onClick={() => navigate("/orders")}>
          Order Management
        </button>
        <button style={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main style={styles.main}>
        <div style={styles.topBar}>
          <h1 style={styles.title}>Menu Management</h1>
        </div>

        {loading && <p style={styles.emptyText}>Loading menu...</p>}
        {error && <p style={styles.errorText}>{error}</p>}

        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>{editingId ? "Edit Menu Item" : "Add Menu Item"}</h2>
          <form style={styles.form} onSubmit={addOrUpdateItem}>
            <input
              placeholder="Item Name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              style={styles.input}
            />
            <input
              placeholder="Category"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              style={styles.input}
            />
            <input
              placeholder="Price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              style={styles.input}
            />
            <input
              placeholder="Image URL"
              type="url"
              value={form.imageUrl}
              onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
              style={styles.input}
            />
            <label style={styles.availabilityLabel}>
              <input
                type="checkbox"
                checked={form.availability}
                onChange={(e) => setForm((f) => ({ ...f, availability: e.target.checked }))}
                style={styles.checkbox}
              />
              Available
            </label>
            <button type="submit" style={styles.primaryButton}>
              {editingId ? "Save Changes" : "Add Item"}
            </button>
            {editingId && (
              <button
                type="button"
                style={styles.secondaryButton}
                onClick={() => {
                  setEditingId(null);
                  resetForm();
                }}
              >
                Cancel
              </button>
            )}
          </form>
        </section>

        <h2 style={styles.sectionTitle}>Fast Food</h2>
        <section style={styles.grid}>
          {items.length === 0 ? (
            <p style={styles.emptyText}>No menu items yet.</p>
          ) : (
            items.map((item) => (
              <article key={item._id} style={styles.menuCard}>
                <img
                  src={item.image || "https://via.placeholder.com/320x200?text=No+Image"}
                  alt={item.name}
                  style={styles.cardImage}
                />
                <h3 style={styles.cardTitle}>{item.name}</h3>
                <p style={styles.cardDescription}>{item.description || "Fresh and tasty menu item."}</p>
                <div style={styles.cardFooter}>
                  <strong>Rs. {Number(item.price).toFixed(0)}</strong>
                  <span style={item.availability ? styles.tagAvailable : styles.tagUnavailable}>
                    {item.availability ? "Available" : "Unavailable"}
                  </span>
                </div>
                <div style={styles.cardActions}>
                  <button style={styles.editBtn} onClick={() => editItem(item)}>
                    Edit
                  </button>
                  <button style={styles.toggleBtn} onClick={() => toggleAvailability(item)}>
                    {item.availability ? "Mark Unavailable" : "Mark Available"}
                  </button>
                  <button style={styles.deleteButton} onClick={() => deleteItem(item._id)}>
                    Delete
                  </button>
                </div>
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  );
};

const styles = {
  layout: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "250px 1fr",
    backgroundColor: "#efefef",
    color: "#1a2141",
    fontFamily: "system-ui, sans-serif",
  },
  sidebar: {
    backgroundColor: "#f5f5f5",
    borderRight: "1px solid #ddd",
    padding: "16px 14px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  brandWrap: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "12px",
  },
  logo: {
    width: 34,
    height: 34,
    objectFit: "contain",
  },
  brandTitle: {
    margin: 0,
    fontWeight: 700,
    fontSize: "1.2rem",
    color: "#111",
  },
  brandSubtitle: {
    margin: 0,
    fontSize: "0.75rem",
    color: "#666",
  },
  navButton: {
    textAlign: "left",
    border: "none",
    background: "transparent",
    padding: "10px 8px",
    borderRadius: 8,
    cursor: "pointer",
    color: "#333",
    fontSize: "1rem",
  },
  navButtonActive: {
    textAlign: "left",
    border: "none",
    background: "#ffffff",
    padding: "10px 8px",
    borderRadius: 8,
    color: "#111",
    fontSize: "1rem",
    fontWeight: 600,
  },
  main: {
    padding: "14px 20px 26px",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "14px",
  },
  title: {
    fontSize: "2.1rem",
    margin: 0,
    color: "#111",
  },
  logoutButton: {
    backgroundColor: "#111",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "10px 12px",
    cursor: "pointer",
    marginTop: "auto",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "14px",
    border: "1px solid #e6e6e6",
    boxShadow: "0 6px 16px rgba(0,0,0,0.05)",
    padding: "20px",
    marginBottom: "20px",
  },
  sectionTitle: {
    marginTop: 0,
    color: "#111",
  },
  form: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "12px",
    alignItems: "center",
  },
  input: {
    border: "1px solid #cfd7e4",
    borderRadius: "8px",
    padding: "10px 12px",
    fontSize: "0.95rem",
  },
  primaryButton: {
    backgroundColor: "#ff5a0a",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "10px 14px",
    cursor: "pointer",
  },
  secondaryButton: {
    backgroundColor: "#f0f0f0",
    color: "#333",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "10px 14px",
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
    gap: "18px",
  },
  menuCard: {
    background: "#fff",
    borderRadius: 14,
    border: "1px solid #ddd",
    padding: 14,
    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
  },
  cardImage: {
    width: "100%",
    height: 170,
    objectFit: "contain",
    borderRadius: 12,
    background: "#fafafa",
  },
  cardTitle: {
    margin: "10px 0 6px",
    fontSize: "1.6rem",
    color: "#111",
  },
  cardDescription: {
    margin: 0,
    minHeight: 34,
    color: "#555",
    fontSize: "0.9rem",
  },
  cardFooter: {
    marginTop: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tagAvailable: {
    background: "#c7efad",
    color: "#235c17",
    borderRadius: 8,
    fontSize: "0.75rem",
    padding: "4px 8px",
  },
  tagUnavailable: {
    background: "#ffd4d4",
    color: "#8c1d1d",
    borderRadius: 8,
    fontSize: "0.75rem",
    padding: "4px 8px",
  },
  cardActions: {
    display: "flex",
    gap: 8,
    marginTop: 10,
    flexWrap: "wrap",
  },
  editBtn: {
    backgroundColor: "#4a5cff",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "6px 10px",
    cursor: "pointer",
  },
  toggleBtn: {
    backgroundColor: "#f0f0f0",
    color: "#333",
    border: "1px solid #ddd",
    borderRadius: 8,
    padding: "6px 10px",
    cursor: "pointer",
  },
  emptyText: {
    color: "#707f9a",
    margin: "12px 0 0",
  },
  deleteButton: {
    backgroundColor: "#f35959",
    color: "#fff",
    border: "none",
    borderRadius: "7px",
    padding: "6px 10px",
    cursor: "pointer",
  },
  errorText: {
    color: "#c62828",
    margin: "8px 0 12px",
  },
};

export default Dashboard;