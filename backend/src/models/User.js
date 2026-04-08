const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true  //required: true = must be filled
  },
  email: {
    type: String,
    required: true,
    unique: true //No Duplicates
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["user", "admin"], //Only can two of them.
    default: "user"
  },
  phone: {
    type: String,
    required: true
  },
  location: String,

  passwordResetOtpHash: {
    type: String,
    default: null,
  },
  passwordResetOtpExpires: {
    type: Date,
    default: null,
  },
  // After OTP is verified on its own screen; user may set password until this time.
  passwordResetAllowedUntil: {
    type: Date,
    default: null,
  },
}, { timestamps: true }); // Auto adds Created at and Added at.

module.exports = mongoose.model("User", userSchema);