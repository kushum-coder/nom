const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: { // Number for calculation.
    type: Number,
    required: true
  },
  category: String,
  image: String, // Stores url.
  availability: { // Available or not
    type: Boolean,
    default: true
  },
  description: String
}, { timestamps: true });

module.exports = mongoose.model("Food", foodSchema);