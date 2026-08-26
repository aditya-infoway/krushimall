import { createContext, useContext, useState, useEffect, useCallback } from "react";
import apiHelper from "../utils/apiHelper";
import { useAuth } from "./AuthContext";
import {
  showCartRemovedToast,
  showCartAddedToast,
  showSuccessToast,
  showErrorToast,
} from "../utils/toast";

const CartContext = createContext();

const EMPTY_CART = {
  items: [],
  subtotal: 0,
  cgst: 0,
  sgst: 0,
  shippingCharge: 0,
  discountAmount: 0,
  appliedCoupon: null,
  total: 0,
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [cartData, setCartData] = useState(EMPTY_CART);
  const [loading, setLoading] = useState(false);

  // ---------- fetch cart from backend ----------
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const data = await apiHelper.get("/web/cart");
      if (data.success) setCartData(data.cart);
    } catch (err) {
      console.error("fetchCart error:", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCartData(EMPTY_CART); // logout par local state clear
    }
  }, [isAuthenticated, fetchCart]);

  // ---------- actions ----------
  const addToCart = async (product, quantity = 1) => {
    try {
      const data = await apiHelper.post("/web/cart/add", {
        productId: product.id,
        quantity,
      });
      if (data.success) {
        setCartData(data.cart);
        showCartAddedToast(product.name);
      }
    } catch (err) {
      showErrorToast(err.response?.data?.message || "Failed to add item");
    }
  };

  const removeFromCart = async (productId) => {
    const product = cartData.items.find((item) => item.id === productId);
    try {
      const data = await apiHelper.delete(`/web/cart/remove/${productId}`);
      if (data.success) {
        setCartData(data.cart);
        if (product) showCartRemovedToast(product.name);
      }
    } catch (err) {
      showErrorToast(err.response?.data?.message || "Failed to remove item");
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      const data = await apiHelper.patch("/web/cart/update", { productId, quantity });
      if (data.success) setCartData(data.cart);
    } catch (err) {
      showErrorToast(err.response?.data?.message || "Failed to update quantity");
    }
  };

  const clearCart = async () => {
    try {
      await apiHelper.delete("/cart/clear");
      setCartData(EMPTY_CART);
    } catch (err) {
      console.error("clearCart error:", err);
    }
  };

  const applyCoupon = async (code) => {
    try {
      const data = await apiHelper.post("/web/cart/coupon/apply", { code });
      if (data.success) {
        setCartData(data.cart);
        showSuccessToast(`Coupon "${code.toUpperCase()}" applied successfully!`);
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Invalid coupon code",
      };
    }
  };

  const removeCoupon = async () => {
    try {
      const data = await apiHelper.delete("/web/cart/coupon/remove");
      if (data.success) {
        setCartData(data.cart);
        showSuccessToast("Coupon removed");
      }
    } catch (err) {
      showErrorToast("Failed to remove coupon");
    }
  };

  // ---------- backward-compatible derived values ----------
  const cart = cartData.items;
  const cartTotal = cartData.subtotal;
  const cartCount = cartData.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartTotal,
        cartCount,
        loading,
        cgst: cartData.cgst,
        sgst: cartData.sgst,
        shippingCharge: cartData.shippingCharge,
        discountAmount: cartData.discountAmount,
        appliedCoupon: cartData.appliedCoupon,
        total: cartData.total,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};