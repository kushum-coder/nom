const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  logoutUser,
  checkAuth,
} = require("../controllers/userController");
const {
  requestPasswordResetOtp,
  verifyPasswordResetOtp,
  resetPasswordAfterOtpVerified,
} = require("../controllers/passwordResetController");

const verifyToken = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/forgot-password", requestPasswordResetOtp);
router.post("/verify-reset-otp", verifyPasswordResetOtp);
router.post("/reset-password", resetPasswordAfterOtpVerified);

// PROTECTED ROUTE
router.get("/check", verifyToken, checkAuth);

module.exports = router;