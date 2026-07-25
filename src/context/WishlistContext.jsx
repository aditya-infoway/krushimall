import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import apiHelper from "../utils/apiHelper";

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within a WishlistProvider");
  return context;
};

const mapVariant = (item) => ({
  id: item.variant.id,
  name: item.variant.productName,
  brand: item.variant.brand?.brandName || "Unknown",
  price: item.variant.exShowroomPrice || 0,
  image: apiHelper.image(item.variant.frontView),
});

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [showWishlistToast, setShowWishlistToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const notify = (msg) => {
    setToastMessage(msg);
    setShowWishlistToast(true);
    setTimeout(() => setShowWishlistToast(false), 3000);
  };

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlistItems([]);
      setWishlistIds(new Set());
      return;
    }
    try {
      const res = await apiHelper.get("/wishlist");
      const items = (res?.data || res || []).map(mapVariant);
      setWishlistItems(items);
      setWishlistIds(new Set(items.map((i) => i.id)));
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleWishlist = async (product) => {
    if (!isAuthenticated) return;
    const currentlyIn = wishlistIds.has(product.id);

    // optimistic UI update
    setWishlistIds((prev) => {
      const next = new Set(prev);
      currentlyIn ? next.delete(product.id) : next.add(product.id);
      return next;
    });
    setWishlistItems((prev) =>
      currentlyIn ? prev.filter((i) => i.id !== product.id) : [...prev, product]
    );
    notify(currentlyIn ? `${product.name} removed from wishlist!` : `${product.name} added to wishlist!`);

    try {
      await apiHelper.post("/wishlist/toggle", { variantId: product.id });
    } catch (error) {
      console.error("Failed to toggle wishlist:", error);
      fetchWishlist(); // revert to server truth on failure
    }
  };

  const addToWishlist = (product) => {
    if (!wishlistIds.has(product.id)) toggleWishlist(product);
  };

  const removeFromWishlist = (productId) => {
    const product = wishlistItems.find((i) => i.id === productId);
    if (product) toggleWishlist(product);
  };

  const isInWishlist = (productId) => wishlistIds.has(productId);

  const clearWishlist = async () => {
    setWishlistItems([]);
    setWishlistIds(new Set());
    try {
      await apiHelper.delete("/wishlist");
    } catch (error) {
      console.error("Failed to clear wishlist:", error);
      fetchWishlist();
    }
  };

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    clearWishlist,
    wishlistCount: wishlistItems.length,
    showWishlistToast,
    toastMessage,
    setShowWishlistToast,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};