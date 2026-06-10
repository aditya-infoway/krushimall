import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
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
} from "lucide-react";
import { showCartRemovedToast, showSuccessToast } from "../utils/toast";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");

  // Available coupons
  const coupons = {
    SAVE10: { discount: 10, type: "percentage", minAmount: 500 },
    SAVE20: { discount: 20, type: "percentage", minAmount: 1000 },
    FLAT100: { discount: 100, type: "fixed", minAmount: 599 },
    WELCOME50: { discount: 50, type: "fixed", minAmount: 0 },
  };

  // Calculate GST (18% - split into CGST 9% + SGST 9%)
  const gstRate = 0.18;
  const subtotal = cartTotal;
  const gstAmount = subtotal * gstRate;
  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;
  const shippingCharge = subtotal > 999 ? 0 : 99;

  // Calculate discount
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === "percentage") {
      discountAmount = (subtotal * appliedCoupon.discount) / 100;
    } else if (appliedCoupon.type === "fixed") {
      discountAmount = appliedCoupon.discount;
    }
    discountAmount = Math.min(discountAmount, subtotal);
  }

  const total = subtotal + gstAmount + shippingCharge - discountAmount;

  const handleApplyCoupon = (codeToApply = couponCode) => {
    if (!codeToApply.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    const coupon = coupons[codeToApply.toUpperCase()];

    if (!coupon) {
      setCouponError("Invalid coupon code");
      return;
    }

    if (subtotal < coupon.minAmount) {
      setCouponError(
        `Minimum order of ₹${coupon.minAmount} required for this coupon`,
      );
      return;
    }

    setAppliedCoupon({
      code: codeToApply.toUpperCase(),
      discount: coupon.discount,
      type: coupon.type,
    });
    setCouponError("");
    setCouponCode("");
    showSuccessToast(
      `Coupon "${codeToApply.toUpperCase()}" applied successfully!`,
    );
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
    showSuccessToast("Coupon removed");
  };

  const handleRemoveItem = (id, name) => {
    removeFromCart(id);
    
  };
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
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8 pt-4 md:pt-8 lg:pt-10">
      <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4 sm:mb-6 overflow-x-auto">
          <Link to="/" className="hover:text-green-600">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Shopping Cart</span>
        </nav>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
              <h1 className="text-lg sm:text-xl font-bold mb-5 sm:mb-6 break-words">
                Shopping Cart ({cart.length} items)
              </h1>

              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-100 rounded-xl hover:border-gray-300 transition-colors"
                  >
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden mx-auto sm:mx-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${item.id}`}
                        className="font-medium text-gray-900 hover:text-green-600 text-sm sm:text-base break-words line-clamp-2"
                      >
                        {item.name}
                      </Link>

                      <p className="text-xs text-gray-500 mt-1 break-all">
                        Part #: {item.partNumber}
                      </p>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-3 mt-4">
                        {/* Quantity */}
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="p-2 cursor-pointer hover:bg-gray-50"
                          >
                            <Minus className="h-3 w-3" />
                          </button>

                          <span className="w-10 text-center text-sm font-medium">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-2 cursor-pointer hover:bg-gray-50"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                       
                        {/* Remove */}
                        <div className="border border-red-600 rounded-lg ">

                        <button
                          onClick={() => handleRemoveItem(item.id, item.name)}
                          className="cursor-pointer text-red-600 hover:text-red-700 text-sm flex px-2 items-center gap-1"
                          >
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove
                        </button>
                          </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-left sm:text-right flex-shrink-0">
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
                  <span className="font-medium flex-shrink-0">
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
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none"
                          />
                        </div>
                        <button
                          onClick={handleApplyCoupon}
                          className="px-4 py-2 cursor-pointer bg-green-700 text-white text-sm font-medium rounded-lg hover:bg-green-800 transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                      {couponError && (
                        <p className="text-xs text-green-600 mt-1">
                          {couponError}
                        </p>
                      )}
                      <div className="mt-2 flex flex-wrap gap-2">
                        {Object.keys(coupons).map((code) => (
                          <button
                            key={code}
                            onClick={() => handleApplyCoupon(code)}
                            className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 cursor-pointer"
                          >
                            {code}
                          </button>
                        ))}
                      </div>
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
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-xs text-green-600 mt-1">
                        {appliedCoupon.type === "percentage"
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
                  <span className="font-medium flex-shrink-0">
                    ₹{cgst.toFixed(0).toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">SGST (9%)</span>
                  <span className="font-medium flex-shrink-0">
                    ₹{sgst.toFixed(0).toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Shipping</span>
                  {shippingCharge === 0 ? (
                    <span className="text-green-600 font-medium flex-shrink-0">
                      FREE
                    </span>
                  ) : (
                    <span className="font-medium flex-shrink-0">
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
                  <span className="flex-shrink-0 text-green-700">
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
                onClick={() =>
                  navigate("/checkout", {
                    state: {
                      appliedCoupon: appliedCoupon,
                      discountAmount: discountAmount,
                    },
                  })
                }
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
                  <Shield className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span>Secure checkout with SSL encryption</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Truck className="h-4 w-4 text-green-600 flex-shrink-0" />
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
