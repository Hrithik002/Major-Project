const express = require("express");
const {
  getPublicCategories,
  getAllCategories,
  getCategoryByName,
  addItemToCategory,
  updateItemInCategory,
  deleteItemFromCategory,
} = require("../controllers/adminController");
const { auth, roleBasedAccess } = require("../middleware/authMiddleware");

const router = express.Router();

// Public buyer-facing route
router.get("/categories/public", getPublicCategories);

// All routes require authentication and admin role
router.use(auth);
router.use(roleBasedAccess(["admin"]));

// Category routes
router.get("/categories", getAllCategories);
router.get("/categories/:categoryName", getCategoryByName);

// Item routes within categories
router.post("/categories/:categoryName/items", addItemToCategory);
router.put("/categories/:categoryName/items/:itemId", updateItemInCategory);
router.delete("/categories/:categoryName/items/:itemId", deleteItemFromCategory);

module.exports = router;
