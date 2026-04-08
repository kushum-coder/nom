const Order = require("../models/Order");
const Food = require("../models/Food");

const allowedStatuses = [
  "pending",
  "preparing",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

// ================= USER: PLACE ORDER =================
exports.createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order items are required" });
    }

    const normalizedItems = [];
    let totalPrice = 0;

    for (const row of items) {
      const foodId = row?.food;
      const quantity = Number(row?.quantity);

      if (!foodId || Number.isNaN(quantity) || quantity <= 0) {
        return res.status(400).json({ message: "Each item must have valid food and quantity" });
      }

      const food = await Food.findById(foodId);
      if (!food) {
        return res.status(404).json({ message: `Food not found: ${foodId}` });
      }
      if (food.availability === false) {
        return res.status(400).json({ message: `${food.name} is currently unavailable` });
      }

      normalizedItems.push({
        food: food._id,
        quantity,
      });

      totalPrice += Number(food.price) * quantity;
    }

    const order = await Order.create({
      user: req.user.id,
      items: normalizedItems,
      totalPrice,
      status: "pending",
    });

    const populatedOrder = await Order.findById(order._id)
      .populate("user", "name email phone location")
      .populate("items.food", "name price image category");

    res.status(201).json({
      message: "Order placed successfully",
      order: populatedOrder,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to place order" });
  }
};

// ================= USER: GET MY ORDERS =================
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.food", "name price image category")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch your orders" });
  }
};

// ================= USER: GET MY ORDER DETAILS =================
exports.getMyOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate("items.food", "name price image category");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (String(order.user) !== String(req.user.id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order details" });
  }
};

// ================= ADMIN: GET ALL ORDERS =================
exports.getAllOrdersForAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email phone location")
      .populate("items.food", "name price image category")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// ================= ADMIN: UPDATE ORDER STATUS =================
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate("user", "name email phone location")
      .populate("items.food", "name price image category");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status" });
  }
};
