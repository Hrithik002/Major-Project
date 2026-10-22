import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaCheck,
  FaLeaf,
  FaSignOutAlt,
} from "react-icons/fa";

const AdminDashboard = () => {
  const [activeCategory, setActiveCategory] = useState("Vegetables");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    image: "",
    imageFile: null,
    imagePreview: null,
  });
  const navigate = useNavigate();

  // Category icons
  const categoryIcons = {
    Vegetables: "🥬",
    Fruits: "🍎",
    Flowers: "🌸",
  };

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/categories");
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Item name is required");
      return;
    }

    try {
      let imageData = formData.image.trim() || null;

      // If image file is selected, use it; otherwise use URL
      if (formData.imageFile) {
        imageData = formData.imagePreview; // Base64 data URL
      }

      const response = await api.post(
        `/admin/categories/${activeCategory}/items`,
        {
          name: formData.name.trim(),
          description: formData.description.trim(),
          price: parseFloat(formData.price) || 0,
          quantity: parseInt(formData.quantity) || 0,
          image: imageData,
        }
      );

      if (response.data.success) {
        setCategories(
          categories.map((cat) =>
            cat.name === activeCategory ? response.data.category : cat
          )
        );
        resetForm();
        toast.success("Item added successfully!");
      }
    } catch (error) {
      console.error("Error adding item:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to add item";
      toast.error(errorMessage);
    }
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Item name is required");
      return;
    }

    try {
      let imageData = formData.image.trim() || editingItem.image;

      // If new image file is selected, use it; otherwise use existing or URL
      if (formData.imageFile) {
        imageData = formData.imagePreview; // Base64 data URL
      }

      const response = await api.put(
        `/admin/categories/${activeCategory}/items/${editingItem._id}`,
        {
          name: formData.name.trim(),
          description: formData.description.trim(),
          price: parseFloat(formData.price) || 0,
          quantity: parseInt(formData.quantity) || 0,
          image: imageData,
        }
      );

      if (response.data.success) {
        setCategories(
          categories.map((cat) =>
            cat.name === activeCategory ? response.data.category : cat
          )
        );
        resetForm();
        toast.success("Item updated successfully!");
      }
    } catch (error) {
      console.error("Error updating item:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update item";
      toast.error(errorMessage);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const response = await api.delete(
          `/admin/categories/${activeCategory}/items/${itemId}`
        );

        if (response.data.success) {
          setCategories(
            categories.map((cat) =>
              cat.name === activeCategory ? response.data.category : cat
            )
          );
          toast.success("Item deleted successfully!");
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        const errorMessage =
          error.response?.data?.message || "Failed to delete item";
        toast.error(errorMessage);
      }
    }
  };

  const startEditItem = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || "",
      price: item.price || "",
      quantity: item.quantity || "",
      image: item.image || "",
      imageFile: null,
      imagePreview: item.image || null,
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      quantity: "",
      image: "",
      imageFile: null,
      imagePreview: null,
    });
    setEditingItem(null);
    setShowAddForm(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          imageFile: file,
          imagePreview: reader.result,
          image: "", // Clear URL if file is selected
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getCurrentCategory = () => {
    return categories.find((cat) => cat.name === activeCategory);
  };

  const currentCategory = getCurrentCategory();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-teal-500/20">
              <FaLeaf className="h-6 w-6 text-teal-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-sm text-slate-400">Manage products & inventory</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors duration-300"
          >
            <FaSignOutAlt className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Category Navigation */}
          <div className="lg:col-span-1">
            <div className="rounded-xl bg-slate-800 border border-slate-700 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-white mb-4">
                Categories
              </h2>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => {
                      setActiveCategory(cat.name);
                      resetForm();
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center justify-between ${
                      activeCategory === cat.name
                        ? "bg-teal-600 text-white"
                        : "text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="bg-slate-600/50 px-2 py-1 rounded text-xs font-semibold">
                      {cat.items?.length || 0}
                    </span>
                  </button>
                ))}
              </div>

              {/* Add New Item Button */}
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/50"
              >
                <FaPlus className="h-4 w-4" />
                Add New Item
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Category Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <span className="text-4xl">{categoryIcons[activeCategory]}</span>
                {activeCategory}
              </h2>
              <p className="text-slate-400">
                {currentCategory?.description ||
                  `Manage your ${activeCategory.toLowerCase()} inventory`}
              </p>
            </div>

            {/* Items Grid */}
            {currentCategory?.items && currentCategory.items.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {currentCategory.items.map((item) => (
                  <div
                    key={item._id}
                    className="rounded-xl bg-slate-800 border border-slate-700 overflow-hidden hover:border-teal-500 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/20"
                  >
                    {/* Item Image Container */}
                    <div className="relative w-full h-48 bg-gradient-to-br from-slate-700 to-slate-600 overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl">
                          {categoryIcons[activeCategory]}
                        </div>
                      )}
                    </div>

                    {/* Item Content */}
                    <div className="p-6">
                      {/* Item Details */}
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {item.name}
                      </h3>
                      {item.description && (
                        <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                          {item.description}
                        </p>
                      )}

                      {/* Item Stats */}
                      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                        <div className="bg-slate-700/50 rounded p-2">
                          <span className="text-slate-400">Price</span>
                          <p className="text-lg font-semibold text-teal-400">
                            ${item.price || "0.00"}
                          </p>
                        </div>
                        <div className="bg-slate-700/50 rounded p-2">
                          <span className="text-slate-400">Qty</span>
                          <p className="text-lg font-semibold text-amber-400">
                            {item.quantity || "0"}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditItem(item)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white transition-all duration-300 font-medium"
                        >
                          <FaEdit className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item._id)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white transition-all duration-300 font-medium"
                        >
                          <FaTrash className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl bg-slate-800/50 border border-dashed border-slate-600 p-12 text-center">
                <p className="text-slate-400 text-lg">
                  No items in this category yet.
                </p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium transition-colors duration-300"
                >
                  <FaPlus className="h-4 w-4" />
                  Add First Item
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="rounded-2xl bg-slate-800 border border-slate-700 max-w-md w-full p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">
              {editingItem ? "Edit Item" : "Add New Item"}
            </h3>

            <form
              onSubmit={editingItem ? handleUpdateItem : handleAddItem}
              className="space-y-4"
            >
              {/* Item Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Item Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-lg bg-slate-700 border border-slate-600 text-white px-4 py-2 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                  placeholder="e.g., Fresh Tomatoes"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full rounded-lg bg-slate-700 border border-slate-600 text-white px-4 py-2 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all resize-none"
                  placeholder="Enter item description"
                  rows="3"
                />
              </div>

              {/* Price and Quantity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full rounded-lg bg-slate-700 border border-slate-600 text-white px-4 py-2 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                    className="w-full rounded-lg bg-slate-700 border border-slate-600 text-white px-4 py-2 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Product Image
                </label>
                <div className="space-y-3">
                  {/* Image Preview */}
                  {formData.imagePreview && (
                    <div className="relative w-full h-32 rounded-lg overflow-hidden border border-slate-600">
                      <img
                        src={formData.imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            imagePreview: null,
                            imageFile: null,
                          })
                        }
                        className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 rounded text-white"
                      >
                        <FaTimes className="h-3 w-3" />
                      </button>
                    </div>
                  )}

                  {/* File Upload */}
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full rounded-lg bg-slate-700 border border-slate-600 text-white px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-teal-600 file:text-white hover:file:bg-teal-700 cursor-pointer"
                    />
                  </div>

                  {/* Or Text Separator */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-slate-800 text-slate-400">or</span>
                    </div>
                  </div>

                  {/* Image URL */}
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    className="w-full rounded-lg bg-slate-700 border border-slate-600 text-white px-4 py-2 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all text-sm"
                    placeholder="https://example.com/image.jpg"
                    disabled={!!formData.imageFile}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors duration-300"
                >
                  <FaTimes className="h-4 w-4" />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium transition-colors duration-300"
                >
                  <FaCheck className="h-4 w-4" />
                  {editingItem ? "Update" : "Add"} Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
