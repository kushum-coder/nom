const express = require("express");
const router = express.Router();

const { getFoods, addFood, updateFood, deleteFood } = require("../controllers/foodController");
const verifyToken = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

router.get("/", getFoods); // public
router.post("/", verifyToken, adminOnly, addFood);
router.put("/:id", verifyToken, adminOnly, updateFood);
router.delete("/:id", verifyToken, adminOnly, deleteFood);

module.exports = router;
