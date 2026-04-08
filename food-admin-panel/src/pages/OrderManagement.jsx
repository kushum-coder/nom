import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "preparing", label: "Preparing" },
  { value: "out_for_delivery", label: "Out for delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const OrderManagement = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await API.get("/orders");
        setOrders(res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const counts = useMemo(() => {
    const pending = orders.filter((o) => o.status === "pending").length;
    const outForDelivery = orders.filter((o) => o.status === "out_for_delivery").length;
    const delivered = orders.filter((o) => o.status === "delivered").length;
    return {
      total: orders.length,
      pending,
      outForDelivery,
      delivered,
    };
  }, [orders]);

  const updateOrderStatus = async (orderId, nextStatus) => {
    try {
      setUpdatingOrderId(orderId);
      const res = await API.patch(`/orders/${orderId}/status`, {
        status: nextStatus,
      });
      const updatedOrder = res.data?.order;
      if (updatedOrder) {
        setOrders((prev) => prev.map((o) => (o._id === orderId ? updatedOrder : o)));
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingOrderId("");
    }
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

        <button style={styles.navButton} onClick={() => navigate("/dashboard")}>
          Menu Management
        </button>
        <button style={styles.navButtonActive}>Order Management</button>
      </aside>

      <main style={styles.main}>
        <h1 style={styles.heading}>Order Management</h1>
        <p style={styles.subheading}>Monitor and Manage Orders</p>

        <div style={styles.statsGrid}>
          <StatCard label="Total Orders" value={counts.total} />
          <StatCard label="Pending" value={counts.pending} />
          <StatCard label="Out for Delivery" value={counts.outForDelivery} />
          <StatCard label="Delivered Today" value={counts.delivered} />
        </div>

        <div style={styles.ordersList}>
          {loading && <p style={styles.metaLine}>Loading orders...</p>}
          {!loading && error && <p style={styles.errorText}>{error}</p>}
          {!loading && !error && orders.length === 0 && (
            <p style={styles.metaLine}>No orders yet.</p>
          )}

          {!loading && !error && orders.map((order) => (
            <article key={order._id} style={styles.orderCard}>
              <div style={styles.orderHeader}>
                <div style={styles.orderTitleWrap}>
                  <h2 style={styles.orderId}>{formatOrderId(order._id)}</h2>
                  <span style={styles.statusPill}>{prettyStatus(order.status)}</span>
                </div>
                <h3 style={styles.orderTotal}>Rs. {Number(order.totalPrice || 0).toFixed(0)}</h3>
              </div>

              <div style={styles.orderBody}>
                <div>
                  <p style={styles.metaLine}>Ordered at {formatTime(order.createdAt)}</p>
                  <p style={styles.metaTitle}>Customer Information</p>
                  <p style={styles.metaLine}>{order.user?.name || "Unknown user"}</p>
                  <p style={styles.metaLine}>{order.user?.phone || "-"}</p>
                  <p style={styles.metaLine}>{order.user?.location || "-"}</p>
                </div>
                <div>
                  <p style={styles.metaTitle}>Order Items</p>
                  {(order.items || []).map((item, idx) => (
                    <p key={`${order._id}-${idx}`} style={styles.metaLine}>
                      {item.food?.name || "Food"} x{item.quantity}
                    </p>
                  ))}
                </div>
              </div>

              <div style={styles.statusActions}>
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    style={option.value === order.status ? styles.statusButtonActive : styles.statusButton}
                    onClick={() => updateOrderStatus(order._id, option.value)}
                    disabled={updatingOrderId === order._id}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
};

function StatCard({ label, value }) {
  return (
    <div style={styles.statCard}>
      <p style={styles.statLabel}>{label}</p>
      <p style={styles.statValue}>{value}</p>
    </div>
  );
}

function prettyStatus(value) {
  return value.replaceAll("_", " ");
}

function formatOrderId(id) {
  return `ORD-${String(id || "").slice(-4).toUpperCase()}`;
}

function formatTime(dateValue) {
  if (!dateValue) return "-";
  const date = new Date(dateValue);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

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
  heading: {
    margin: "0 0 2px",
    color: "#111",
    fontSize: "2.1rem",
  },
  subheading: {
    margin: 0,
    color: "#777",
    fontSize: "0.9rem",
  },
  statsGrid: {
    marginTop: 12,
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(120px, 1fr))",
    gap: 10,
  },
  statCard: {
    backgroundColor: "#f8f8f8",
    border: "1px solid #d7d7d7",
    borderRadius: 10,
    padding: "8px 12px",
  },
  statLabel: {
    margin: "0 0 4px",
    color: "#555",
    fontSize: "0.95rem",
  },
  statValue: {
    margin: 0,
    color: "#111",
    fontSize: "2rem",
    fontWeight: 700,
    lineHeight: 1.05,
  },
  ordersList: {
    marginTop: 12,
    display: "grid",
    gap: 14,
  },
  orderCard: {
    backgroundColor: "#f9f9f9",
    border: "1px solid #ddd",
    borderRadius: 12,
    padding: 14,
  },
  orderHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderTitleWrap: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  orderId: {
    margin: 0,
    color: "#111",
    fontSize: "1.9rem",
  },
  statusPill: {
    background: "#d8f8a8",
    color: "#d14300",
    borderRadius: 10,
    padding: "2px 8px",
    fontSize: "0.8rem",
    textTransform: "capitalize",
  },
  orderTotal: {
    margin: 0,
    color: "#111",
    fontSize: "1.8rem",
  },
  orderBody: {
    marginTop: 8,
    paddingTop: 8,
    borderTop: "1px solid #ddd",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
  },
  metaTitle: {
    margin: "0 0 3px",
    color: "#333",
    fontWeight: 600,
    fontSize: "0.95rem",
  },
  metaLine: {
    margin: "0 0 3px",
    color: "#555",
    fontSize: "0.88rem",
  },
  statusActions: {
    marginTop: 10,
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    borderTop: "1px solid #ddd",
    paddingTop: 8,
  },
  statusButton: {
    border: "1px solid #cfcfcf",
    background: "#eee",
    borderRadius: 8,
    padding: "6px 10px",
    cursor: "pointer",
  },
  statusButtonActive: {
    border: "1px solid #7bbdff",
    background: "#dff0ff",
    color: "#0a64b4",
    borderRadius: 8,
    padding: "6px 10px",
    cursor: "pointer",
  },
  errorText: {
    color: "#d32f2f",
    margin: 0,
  },
};

export default OrderManagement;
