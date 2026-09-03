import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useCallback } from "react";
import {
  Trash2,
  Minus,
  Plus,
  ShoppingCart,
  ArrowRight,
  Shield,
  Truck,
  Receipt,
  Ticket,
  X,
  CheckCircle,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { showErrorToast } from "../utils/toast";
import apiHelper from "../utils/apiHelper";

const Cart = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cgst,
    sgst,
    shippingCharge,
    discountAmount,
    appliedCoupon,
    total,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [applyingCode, setApplyingCode] = useState(""); // tracks which coupon card is mid-apply

  // ---------- Available Coupons (storefront offers list) ----------
  const [showCoupons, setShowCoupons] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);

  const getMaxOrderQuantity = (item) => {
    const maxQty = Number(item?.maxOrderQuantity);
    return maxQty > 0 ? maxQty : Infinity;
  };

  const subtotal = cartTotal;

  // ---------- fetch coupons eligible/visible for this cart ----------
  const fetchAvailableCoupons = useCallback(async () => {
    if (!cart.length) {
      setAvailableCoupons([]);
      return;
    }
    try {
      setLoadingCoupons(true);
      const data = await apiHelper.post("/web/coupons/available", {
        cartItems: cart.map((item) => ({ productId: item.id })),
        subtotal,
      });
      if (data.success) {
        setAvailableCoupons(data.data || []);
      }
    } catch (err) {
      console.error("fetchAvailableCoupons error:", err);
    } finally {
      setLoadingCoupons(false);
    }
  }, [cart, subtotal]);

  useEffect(() => {
    fetchAvailableCoupons();
  }, [fetchAvailableCoupons]);

  // Clear a stale error (e.g. "minimum order value" from a previous,
  // smaller cart) once the cart total changes — otherwise an old failed
  // attempt keeps showing even after the cart now qualifies.
  useEffect(() => {
    if (!appliedCoupon) {
      setCouponError("");
    }
  }, [subtotal, appliedCoupon]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }
    setApplyingCoupon(true);
    const result = await applyCoupon(couponCode);
    setApplyingCoupon(false);

    if (!result?.success) {
      setCouponError(result?.message || "Invalid coupon code");
      return;
    }
    setCouponError("");
    setCouponCode("");
  };

  // Apply directly from the Available Coupons list card
  const handleApplyFromList = async (code) => {
    setApplyingCode(code);
    setCouponError("");
    const result = await applyCoupon(code);
    setApplyingCode("");

    if (!result?.success) {
      setCouponError(result?.message || "Invalid coupon code");
    }
  };

  const handleRemoveCoupon = async () => {
    await removeCoupon();
    setCouponError("");
  };

  const handleRemoveItem = (id) => {
    removeFromCart(id);
  };

  const formatDiscount = (coupon) =>
    coupon.type === "PERCENTAGE"
      ? `${coupon.discountValue}% OFF${
          coupon.maxDiscountAmount
            ? ` up to ₹${coupon.maxDiscountAmount.toLocaleString("en-IN")}`
            : ""
        }`
      : `₹${coupon.discountValue} OFF`;

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center bg-white p-6 sm:p-8 rounded-2xl shadow-sm max-w-md w-full">
          <ShoppingCart className="h-14 w-14 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Please Login First</h2>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            You need to login to view your cart
          </p>
          <Link
            to="/login?redirect=/cart"
            className="bg-green-700 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-green-800 inline-block w-full sm:w-auto"
          >
            Login to Continue
          </Link>
        </div>
      </div>
    );
  }

  // Empty Cart
  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center bg-white p-6 sm:p-8 rounded-2xl shadow-sm max-w-md w-full">
          <ShoppingCart className="h-14 w-14 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6 text-sm sm:text-base">
            Looks like you haven't added any parts yet.
          </p>
          <Link
            to="/products"
            className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 inline-block w-full sm:w-auto"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8 pt-12 md:pt-16 lg:pt-20">
      <div className="w-full xl:max-w-400 2xl:max-w-430 mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-1 sm:mb-1 overflow-x-auto">
          <Link to="/" className="hover:text-green-600">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Shopping Cart</span>
        </nav>
        <div className="flex justify-end mb-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:border-green-400 hover:bg-green-50 hover:text-green-600 hover:shadow-sm transition-all duration-200 cursor-pointer"
            aria-label="Go back"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
              <h1 className="text-lg sm:text-xl font-bold mb-5 sm:mb-6 wrap-break-word">
                Shopping Cart ({cart.length} items)
              </h1>

              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-100 rounded-xl hover:border-gray-300 transition-colors"
                  >
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gray-100 rounded-lg shrink-0 overflow-hidden mx-auto sm:mx-0">
                      <img
                        src={apiHelper.getImageUrl(item.image)}
                        alt={item.name}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${item.id}`}
                        className="font-medium text-gray-900 hover:text-green-600 text-sm sm:text-base wrap-break-word line-clamp-2"
                      >
                        {item.name}
                      </Link>

                      <p className="text-xs text-gray-500 mt-1 break-all">
                        Part #: {item.partNumber}
                      </p>

                      {item.stock === "OUT_OF_STOCK" && (
                        <p className="text-xs text-red-600 font-medium mt-1">
                          Out of stock
                        </p>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-3 mt-4">
                        {/* Quantity */}
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => {
                              if (item.quantity <= 1) {
                                handleRemoveItem(item.id);
                              } else {
                                updateQuantity(item.id, item.quantity - 1);
                              }
                            }}
                            className="p-2 cursor-pointer hover:bg-gray-50"
                          >
                            <Minus className="h-3 w-3" />
                          </button>

                          <span className="w-10 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => {
                              const maxQty = getMaxOrderQuantity(item);

                              if (item.quantity >= maxQty) {
                                showErrorToast(
                                  `Maximum order quantity is ${maxQty}. You cannot order more than ${maxQty} item${
                                    maxQty > 1 ? "s" : ""
                                  }.`,
                                );
                                return;
                              }

                              updateQuantity(item.id, item.quantity + 1);
                            }}
                            className="p-2 cursor-pointer hover:bg-gray-50"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Remove */}
                        <div className="border border-red-600 rounded-lg ">
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="cursor-pointer text-red-600 hover:text-red-700 text-sm flex px-1 py-1 items-center gap-1"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-left sm:text-right shrink-0">
                      <p className="font-bold text-gray-900 text-base sm:text-lg">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs text-gray-400">
                        ₹{item.price.toLocaleString("en-IN")} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Coupons */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 mt-5">
              <button
                type="button"
                onClick={() => setShowCoupons((v) => !v)}
                className="w-full flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-2 font-semibold text-gray-900 text-sm sm:text-base">
                  <Ticket className="h-5 w-5 text-green-600" />
                  Available Offers
                  {availableCoupons.length > 0 && (
                    <span className="bg-green-50 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
                      {availableCoupons.length}
                    </span>
                  )}
                </span>
                {showCoupons ? (
                  <ChevronUp className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                )}
              </button>

              {showCoupons && (
                <div className="mt-4 space-y-3">
                  {loadingCoupons ? (
                    <p className="text-sm text-gray-500">
                      Loading offers...
                    </p>
                  ) : availableCoupons.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No offers available right now.
                    </p>
                  ) : (
                    availableCoupons.map((coupon) => {
                      const isApplied = appliedCoupon?.code === coupon.code;
                      return (
                        <div
                          key={coupon.code}
                          className={`rounded-xl border p-3 sm:p-4 ${
                            isApplied
                              ? "border-green-300 bg-green-50"
                              : coupon.isEligible
                                ? "border-dashed border-green-300"
                                : "border-gray-200 bg-gray-50"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 text-sm">
                                {coupon.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="inline-block bg-gray-100 text-gray-700 text-xs font-mono font-semibold px-2 py-0.5 rounded">
                                  {coupon.code}
                                </span>
                                <span className="text-xs font-medium text-green-700">
                                  {formatDiscount(coupon)}
                                </span>
                              </div>
                              {coupon.minOrderValue > 0 && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Min order ₹
                                  {coupon.minOrderValue.toLocaleString(
                                    "en-IN",
                                  )}
                                </p>
                              )}
                              {coupon.displayMessage && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {coupon.displayMessage}
                                </p>
                              )}
                              {!coupon.isEligible && coupon.reason && (
                                <p className="text-xs text-red-500 mt-1">
                                  {coupon.reason}
                                </p>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleApplyFromList(coupon.code)}
                              disabled={
                                isApplied ||
                                !coupon.isEligible ||
                                applyingCode === coupon.code
                              }
                              className={`shrink-0 text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                                isApplied
                                  ? "bg-green-600 text-white cursor-default"
                                  : coupon.isEligible
                                    ? "border border-green-600 text-green-700 hover:bg-green-50 cursor-pointer"
                                    : "border border-gray-200 text-gray-400 cursor-not-allowed"
                              }`}
                            >
                              {isApplied
                                ? "Applied"
                                : applyingCode === coupon.code
                                  ? "Applying..."
                                  : "Apply"}
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 lg:sticky lg:top-24">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Receipt className="h-5 w-5 text-gray-400" />
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">
                    Subtotal ({cart.length} items)
                  </span>
                  <span className="font-medium shrink-0">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Coupon Section */}
                <div className="pt-2">
                  {!appliedCoupon ? (
                    <div>
                      <div className="flex gap-2">
                        <div className="flex-1 relative">
                          <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Coupon code"
                            value={couponCode}
                            onChange={(e) => {
                              setCouponCode(e.target.value);
                              setCouponError("");
                            }}
                            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none"
                          />
                        </div>
                        <button
                          onClick={handleApplyCoupon}
                          disabled={applyingCoupon}
                          className="px-4 py-2 cursor-pointer bg-green-700 text-white text-sm font-medium rounded-lg hover:bg-green-800 transition-colors disabled:opacity-60"
                        >
                          {applyingCoupon ? "Applying..." : "Apply"}
                        </button>
                      </div>
                      {couponError && (
                        <p className="text-xs text-red-600 mt-1">
                          {couponError}
                        </p>
                      )}
                      {availableCoupons.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setShowCoupons(true)}
                          className="text-xs text-green-600 hover:text-green-700 font-medium mt-2 cursor-pointer"
                        >
                          View available offers ({availableCoupons.length})
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-700">
                            {appliedCoupon.code} applied!
                          </span>
                        </div>
                        <button
                          onClick={handleRemoveCoupon}
                          className="text-green-600 hover:text-green-700"
                        >
                          <X className="h-4 w-4 cursor-pointer" />
                        </button>
                      </div>
                      <p className="text-xs text-green-600 mt-1">
                        {appliedCoupon.type === "PERCENTAGE"
                          ? `${appliedCoupon.discount}% discount applied`
                          : `₹${appliedCoupon.discount} discount applied`}
                      </p>
                    </div>
                  )}
                </div>

                {/* Discount Row */}
                {discountAmount > 0 && (
                  <div className="flex justify-between gap-4 text-green-600">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span className="font-medium">
                      -₹{discountAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">CGST (9%)</span>
                  <span className="font-medium shrink-0">
                    ₹{cgst.toFixed(0).toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">SGST (9%)</span>
                  <span className="font-medium shrink-0">
                    ₹{sgst.toFixed(0).toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Shipping</span>
                  {shippingCharge === 0 ? (
                    <span className="text-green-600 font-medium shrink-0">
                      FREE
                    </span>
                  ) : (
                    <span className="font-medium shrink-0">
                      ₹{shippingCharge}
                    </span>
                  )}
                </div>

                {shippingCharge > 0 && (
                  <p className="text-xs text-gray-400">
                    Free shipping on orders above ₹999
                  </p>
                )}
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="flex justify-between items-center gap-4 text-lg font-bold">
                  <span>Total</span>
                  <span className="shrink-0 text-green-700">
                    ₹{total.toFixed(0).toLocaleString("en-IN")}
                  </span>
                </div>

                <p className="text-xs text-gray-400 mt-1">
                  Inclusive of all taxes
                </p>

                {discountAmount > 0 && (
                  <p className="text-xs text-green-600 mt-1">
                    You saved ₹{discountAmount.toLocaleString("en-IN")}!
                  </p>
                )}
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => navigate("/checkout")}
                className="w-full cursor-pointer bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-xl mt-5 flex items-center justify-center gap-2 transition-colors"
              >
                Proceed to Checkout
                <ArrowRight className="h-5 w-5" />
              </button>

              {/* Continue Shopping */}
              <Link
                to="/products"
                className="block cursor-pointer text-center text-sm text-green-600 hover:text-green-700 font-medium mt-3"
              >
                Continue Shopping
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Shield className="h-4 w-4 text-green-600 shrink-0" />
                  <span>Secure checkout with SSL encryption</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Truck className="h-4 w-4 text-green-600 shrink-0" />
                  <span>Free shipping above ₹999</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;