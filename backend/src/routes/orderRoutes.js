const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const {
  createOrder,
  getMyOrders,
  getMyOrderById,
  getAllOrdersForAdmin,
  updateOrderStatus,
} = require("../controllers/orderController");

// User-side order read routes (mobile app)
router.post("/", verifyToken, createOrder);
router.get("/my", verifyToken, getMyOrders);
router.get("/my/:id", verifyToken, getMyOrderById);

// Admin-side order management routes
router.get("/", verifyToken, adminOnly, getAllOrdersForAdmin);
router.patch("/:id/status", verifyToken, adminOnly, updateOrderStatus);

module.exports = router;
