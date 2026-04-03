import { useEffect, useState } from "react";
import API from "../services/api";

const Dashboard = () => {
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
    <div style={styles.page}>
      <div style={styles.topBar}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        <button style={styles.logoutButton} onClick={handleLogout}>Logout</button>
      </div>

      <section style={styles.card}>
        <h2>{editingId ? "Edit Item" : "Add Item"}</h2>
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
          {form.imageUrl && (
            <img
              src={form.imageUrl}
              alt="preview"
              style={styles.imagePreview}
              onError={(e) => {
                e.target.src = "";
                e.target.alt = "Invalid URL";
              }}
            />
          )}
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

      <section style={styles.card}>
        <h2>Items List ({items.length})</h2>
        {items.length === 0 ? (
          <p style={styles.emptyText}>No items yet. Add an item above.</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableCell}>Image</th>
                  <th style={styles.tableCell}>Name</th>
                  <th style={styles.tableCell}>Category</th>
                  <th style={styles.tableCell}>Price</th>
                  <th style={styles.tableCell}>Availability</th>
                  <th style={styles.tableCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id}>
                    <td style={styles.tableCell}>
                      {item.image ? (
                        <img src={item.image} alt={item.name} style={styles.thumb} />
                      ) : (
                        <span style={styles.noImage}>No image</span>
                      )}
                    </td>
                    <td style={styles.tableCell}>{item.name}</td>
                    <td style={styles.tableCell}>{item.category}</td>
                    <td style={styles.tableCell}>Rs {item.price.toFixed(2)}</td>
                    <td style={styles.tableCell}>{item.availability ? "Available" : "Unavailable"}</td>
                    <td style={styles.tableCell}>
                      <button style={styles.actionButton} onClick={() => editItem(item)}>Edit</button>
                      <button style={styles.secondaryButton} onClick={() => toggleAvailability(item)}>
                        {item.availability ? "Set Unavailable" : "Set Available"}
                      </button>
                      <button style={styles.deleteButton} onClick={() => deleteItem(item._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

const styles = {
  page: {
    maxWidth: "1100px",
    margin: "24px auto",
    padding: "0 16px 40px",
    color: "#1a2141",
    fontFamily: "system-ui, sans-serif",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px",
  },
  title: {
    fontSize: "2rem",
    margin: 0,
  },
  logoutButton: {
    backgroundColor: "#ff4d00",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "10px 16px",
    cursor: "pointer",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #edf0f7",
    boxShadow: "0 12px 24px rgba(16, 35, 69, 0.08)",
    padding: "20px",
    marginBottom: "20px",
  },
  form: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
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
    backgroundColor: "#ff5200",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "10px 14px",
    cursor: "pointer",
  },
  secondaryButton: {
    backgroundColor: "#f0f4ff",
    color: "#334a7e",
    border: "1px solid #cfd7e4",
    borderRadius: "10px",
    padding: "10px 14px",
    cursor: "pointer",
  },
  emptyText: {
    color: "#707f9a",
    margin: "12px 0 0",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "12px",
  },
  tableCell: {
    padding: "12px 14px",
    textAlign: "left",
    verticalAlign: "middle",
    borderBottom: "1px solid #eef2f7",
  },
  actionButton: {
    marginRight: "8px",
    backgroundColor: "#2d76ff",
    color: "#fff",
    border: "none",
    borderRadius: "7px",
    padding: "6px 10px",
    cursor: "pointer",
  },
  deleteButton: {
    backgroundColor: "#f35959",
    color: "#fff",
    border: "none",
    borderRadius: "7px",
    padding: "6px 10px",
    cursor: "pointer",
  },
  imagePreview: {
    width: "96px",
    height: "66px",
    objectFit: "cover",
    borderRadius: "8px",
    border: "1px solid #cfd7e4",
  },
  thumb: {
    width: "56px",
    height: "40px",
    objectFit: "cover",
    borderRadius: "6px",
  },
  noImage: {
    fontSize: "0.74rem",
    color: "#9aa3b0",
  },
};

export default Dashboard;