const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  logoutUser,
  checkAuth,
} = require("../controllers/userController");

const verifyToken = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// 🔒 PROTECTED ROUTE
router.get("/check", verifyToken, checkAuth);

module.exports = router;