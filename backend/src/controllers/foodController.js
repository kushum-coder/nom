const Food = require("../models/Food");

// GET /api/foods
const getFoods = async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = {};

    if (search?.trim()) {
      const keyword = search.trim();
      filter.name = { $regex: keyword, $options: "i" };
    }

    if (category?.trim()) {
      // Case-insensitive exact match
      filter.category = { $regex: new RegExp(`^${category.trim()}$`, "i") };
    }

    const foods = await Food.find(filter).sort({ createdAt: -1 });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: "Failed to get foods" });
  }
};

// GET /api/foods/category/:categoryName
const getFoodsByCategory = async (req, res) => {
  try {
    const { categoryName } = req.params;
    // Case-insensitive exact match
    const filter = { category: { $regex: new RegExp(`^${categoryName.trim()}$`, "i") } };
    
    const foods = await Food.find(filter).sort({ createdAt: -1 });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: "Failed to get foods by category" });
  }
};


// POST /api/foods
const addFood = async (req, res) => {
  const { name, price, category, image, description, availability } = req.body;

  if (!name || !price || !category || !image) {
    return res.status(400).json({ message: "name, price, category and image are required" });
  }

  try {
    const food = await Food.create({
      name,
      price,
      category,
      image,
      description: description || "",
      availability: availability !== false,
    });

    res.status(201).json(food);
  } catch (error) {
    res.status(500).json({ message: "Failed to create food item" });
  }
};

// PUT /api/foods/:id
const updateFood = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const food = await Food.findByIdAndUpdate(id, updates, { returnDocument: 'after' });
    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
    }
    res.json(food);
  } catch (error) {
    res.status(500).json({ message: "Failed to update food item" });
  }
};

// DELETE /api/foods/:id
const deleteFood = async (req, res) => {
  const { id } = req.params;

  try {
    const food = await Food.findByIdAndDelete(id);
    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
    }
    res.json({ message: "Food item deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete food item" });
  }
};

module.exports = { getFoods, getFoodsByCategory, addFood, updateFood, deleteFood };