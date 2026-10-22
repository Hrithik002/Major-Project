const Category = require("../models/Category");

// @desc    Get categories for buyer-facing marketplace
// @route   GET /api/admin/categories/public
// @access  Public
const getPublicCategories = async (req, res) => {
  try {
    const categories = await Category.find({}, { items: 1, name: 1, description: 1, icon: 1 });

    res.status(200).json({
      success: true,
      message: "Public categories retrieved successfully",
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch public categories",
      error: error.message,
    });
  }
};

// @desc    Get all categories with items
// @route   GET /api/admin/categories
// @access  Private - Admin only
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    // Initialize default categories if they don't exist
    if (categories.length === 0) {
      const defaultCategories = [
        { name: "Vegetables", description: "Fresh vegetables", icon: "🥬" },
        { name: "Fruits", description: "Fresh fruits", icon: "🍎" },
        { name: "Flowers", description: "Beautiful flowers", icon: "🌸" },
      ];

      const created = await Category.insertMany(defaultCategories);
      return res.status(200).json({
        success: true,
        message: "Categories initialized",
        categories: created,
      });
    }

    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

// @desc    Get single category with items
// @route   GET /api/admin/categories/:categoryName
// @access  Private - Admin only
const getCategoryByName = async (req, res) => {
  try {
    const { categoryName } = req.params;

    const category = await Category.findOne({ name: categoryName });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: `Category '${categoryName}' not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Category retrieved successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch category",
      error: error.message,
    });
  }
};

// @desc    Add item to category
// @route   POST /api/admin/categories/:categoryName/items
// @access  Private - Admin only
const addItemToCategory = async (req, res) => {
  try {
    const { categoryName } = req.params;
    const { name, description, price, quantity, image, specifications } =
      req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Item name is required",
      });
    }

    const category = await Category.findOne({ name: categoryName });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: `Category '${categoryName}' not found`,
      });
    }

    // Check if item already exists
    const existingItem = category.items.find(
      (item) => item.name.toLowerCase() === name.toLowerCase()
    );

    if (existingItem) {
      return res.status(409).json({
        success: false,
        message: "Item with this name already exists in this category",
      });
    }

    const newItem = {
      name,
      description: description || "",
      price: price || 0,
      quantity: quantity || 0,
      image: image || null,
      specifications: specifications || {},
    };

    category.items.push(newItem);
    await category.save();

    res.status(201).json({
      success: true,
      message: "Item added successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add item",
      error: error.message,
    });
  }
};

// @desc    Update item in category
// @route   PUT /api/admin/categories/:categoryName/items/:itemId
// @access  Private - Admin only
const updateItemInCategory = async (req, res) => {
  try {
    const { categoryName, itemId } = req.params;
    const { name, description, price, quantity, image, specifications } =
      req.body;

    const category = await Category.findOne({ name: categoryName });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: `Category '${categoryName}' not found`,
      });
    }

    const item = category.items.id(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found in this category",
      });
    }

    // Update fields
    if (name !== undefined) item.name = name;
    if (description !== undefined) item.description = description;
    if (price !== undefined) item.price = price;
    if (quantity !== undefined) item.quantity = quantity;
    if (image !== undefined) item.image = image;
    if (specifications !== undefined) item.specifications = specifications;

    await category.save();

    res.status(200).json({
      success: true,
      message: "Item updated successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update item",
      error: error.message,
    });
  }
};

// @desc    Delete item from category
// @route   DELETE /api/admin/categories/:categoryName/items/:itemId
// @access  Private - Admin only
const deleteItemFromCategory = async (req, res) => {
  try {
    const { categoryName, itemId } = req.params;

    const category = await Category.findOne({ name: categoryName });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: `Category '${categoryName}' not found`,
      });
    }

    const item = category.items.id(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found in this category",
      });
    }

    category.items.pull(itemId);
    await category.save();

    res.status(200).json({
      success: true,
      message: "Item deleted successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete item",
      error: error.message,
    });
  }
};

module.exports = {
  getPublicCategories,
  getAllCategories,
  getCategoryByName,
  addItemToCategory,
  updateItemInCategory,
  deleteItemFromCategory,
};
