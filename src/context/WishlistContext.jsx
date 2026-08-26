import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import apiHelper from "../utils/apiHelper";

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within a WishlistProvider");
  return context;
};

// ✅ composite key — id collision se bachne ke liye (Product id=4 aur Variant id=4 alag hain)
const makeKey = (id, type) => `${type}:${id}`;

const mapVariant = (item) => ({
  wishlistId: item.id,               // Wishlist row ka id (delete ke liye kabhi zaroorat pad sakti hai)
  id: item.variant.id,
  type: "variant",
  name: item.variant.productName,
  brand: item.variant.brand?.brandName || "Unknown",
  price: item.variant.exShowroomPrice || 0,
  image: apiHelper.image(item.variant.frontView),
});

const mapProduct = (item) => ({
  wishlistId: item.id,
  id: item.product.id,
  type: "product",
  name: item.product.productName,
  brand: item.product.brand?.brandName || "Unknown",
  price: Number(item.product.sellingPrice) || 0,
  oldPrice: Number(item.product.mrp) || 0,
  image: apiHelper.image(item.product.mainImage),
});

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());   // ✅ ab composite keys store honge
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
      const raw = res?.data || res || [];

      // ✅ har entry ke andar hai to variant hoga ya product — jo bhi ho, sahi mapper use karo
      const items = raw
        .map((entry) => {
          if (entry.variant) return mapVariant(entry);
          if (entry.product) return mapProduct(entry);
          return null;
        })
        .filter(Boolean);

      setWishlistItems(items);
      setWishlistIds(new Set(items.map((i) => makeKey(i.id, i.type))));
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // ✅ ab type zaroori hai: "product" ya "variant". Default "product" rakha
  // hai taaki spare-parts pages (jahan zyada calls honge) bina change ke chal jayein.
  const toggleWishlist = async (product, type = "product") => {
    if (!isAuthenticated) return;

    const key = makeKey(product.id, type);
    const currentlyIn = wishlistIds.has(key);

    // optimistic UI update
    setWishlistIds((prev) => {
      const next = new Set(prev);
      currentlyIn ? next.delete(key) : next.add(key);
      return next;
    });
    setWishlistItems((prev) =>
      currentlyIn
        ? prev.filter((i) => !(i.id === product.id && i.type === type))
        : [...prev, { ...product, type }]
    );
    notify(
      currentlyIn
        ? `${product.name} removed from wishlist!`
        : `${product.name} added to wishlist!`
    );

    try {
      const payload = type === "variant"
        ? { variantId: product.id }
        : { productId: product.id };

      await apiHelper.post("/wishlist/toggle", payload);
    } catch (error) {
      console.error("Failed to toggle wishlist:", error);
      fetchWishlist(); // revert to server truth on failure
    }
  };

  const addToWishlist = (product, type = "product") => {
    if (!wishlistIds.has(makeKey(product.id, type))) toggleWishlist(product, type);
  };

  const removeFromWishlist = (productId, type = "product") => {
    const item = wishlistItems.find((i) => i.id === productId && i.type === type);
    if (item) toggleWishlist(item, type);
  };

  const isInWishlist = (productId, type = "product") =>
    wishlistIds.has(makeKey(productId, type));

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