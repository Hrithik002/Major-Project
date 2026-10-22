import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../utils/api";
import { useCart } from "../contexts/CartContext";

const fallbackImage =
  "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80";

const supportedCategories = ["Vegetables", "Fruits", "Flowers"];

const BuyerPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartCount,
    cartTotal,
  } = useCart();

  useEffect(() => {
    const fetchAdminItems = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/admin/categories/public");
        const categories = response?.data?.categories || [];

        const flattenedItems = categories
          .filter((category) => supportedCategories.includes(category.name))
          .flatMap((category) =>
            (category.items || []).map((item) => ({
              id: item._id,
              name: item.name,
              description: item.description || "No description available",
              price: Number(item.price || 0),
              image: item.image,
              quantity: Number(item.quantity || 0),
              category: category.name,
            }))
          );

        setItems(flattenedItems);
      } catch (fetchError) {
        console.error("Error fetching admin items:", fetchError);
        setError(
          fetchError.response?.data?.message ||
            "Failed to fetch admin items. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAdminItems();
  }, []);

  const hasItems = items.length > 0;

  const groupedCart = useMemo(() => {
    return cartItems.map((item) => ({
      ...item,
      lineTotal: Number(item.price || 0) * item.cartQuantity,
    }));
  }, [cartItems]);

  const handleAddToCart = (item) => {
    if (item.quantity <= 0) {
      toast.error("This item is currently out of stock");
      return;
    }

    addToCart(item);
    toast.success(`${item.name} added to cart`);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    toast.success("Purchase simulated successfully. Thank you for shopping!");
    clearCart();
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-strong)] p-5">
        <h1 className="text-2xl font-bold text-[var(--app-text)]">Buyer Marketplace</h1>
        <p className="mt-1 text-sm text-[var(--app-text-soft)]">
          Browse all admin-added vegetables, fruits, and flowers.
        </p>
      </div>

      {loading && (
        <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 text-sm text-[var(--app-text-soft)]">
          Loading items...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-6 text-sm text-red-200">
          {error}
        </div>
      )}

      {!loading && !error && !hasItems && (
        <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 text-sm text-[var(--app-text-soft)]">
          No items are available yet.
        </div>
      )}

      {!loading && !error && hasItems && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section className="lg:col-span-2">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)]"
                >
                  <img
                    src={item.image || fallbackImage}
                    alt={item.name}
                    className="h-44 w-full object-cover"
                  />
                  <div className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-base font-semibold text-[var(--app-text)]">
                        {item.name}
                      </h2>
                      <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs font-medium text-emerald-300">
                        {item.category}
                      </span>
                    </div>
                    <p className="min-h-[40px] text-sm text-[var(--app-text-soft)]">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-teal-300">₹{item.price.toFixed(2)}</p>
                      <button
                        type="button"
                        onClick={() => handleAddToCart(item)}
                        className="rounded-xl bg-teal-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="h-fit rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-strong)] p-4">
            <div className="mb-4 border-b border-[var(--app-border)] pb-3">
              <h3 className="text-lg font-semibold text-[var(--app-text)]">Shopping Cart</h3>
              <p className="text-sm text-[var(--app-text-soft)]">{cartCount} item(s)</p>
            </div>

            {groupedCart.length === 0 ? (
              <p className="text-sm text-[var(--app-text-soft)]">Cart is empty.</p>
            ) : (
              <div className="space-y-3">
                {groupedCart.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-3"
                  >
                    <p className="font-medium text-[var(--app-text)]">{item.name}</p>
                    <p className="text-xs text-[var(--app-text-soft)]">₹{item.price.toFixed(2)} each</p>

                    <div className="mt-2 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQuantity(item.id, item.cartQuantity - 1)
                          }
                          className="h-7 w-7 rounded-lg border border-[var(--app-border)] text-[var(--app-text)]"
                        >
                          -
                        </button>
                        <span className="min-w-5 text-center text-sm text-[var(--app-text)]">
                          {item.cartQuantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQuantity(item.id, item.cartQuantity + 1)
                          }
                          className="h-7 w-7 rounded-lg border border-[var(--app-border)] text-[var(--app-text)]"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-xs text-red-300 hover:text-red-200"
                      >
                        Remove
                      </button>
                    </div>

                    <p className="mt-2 text-sm font-semibold text-teal-300">
                      Line total: ₹{item.lineTotal.toFixed(2)}
                    </p>
                  </div>
                ))}

                <div className="mt-4 border-t border-[var(--app-border)] pt-3">
                  <p className="mb-3 text-base font-bold text-[var(--app-text)]">
                    Total: ₹{cartTotal.toFixed(2)}
                  </p>
                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="w-full rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
};

export default BuyerPage;
