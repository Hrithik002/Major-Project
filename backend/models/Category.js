const mongoose = require("mongoose");

const categoryItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      default: null,
    },
    specifications: {
      type: Map,
      of: String,
      default: new Map(),
    },
  },
  { timestamps: true }
);

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: ["Vegetables", "Fruits", "Flowers"],
      required: [true, "Category name is required"],
      unique: true,
    },
    description: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "📦",
    },
    items: [categoryItemSchema],
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
