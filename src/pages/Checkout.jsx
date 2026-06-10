import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import {
  ArrowLeft,
  Truck,
  Shield,
  CreditCard,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  ShoppingCart,
  ChevronDown,
} from "lucide-react";
import { Listbox } from "@headlessui/react";
import { showOrderPlacedToast, showSuccessToast } from "../utils/toast";

const Checkout = () => {
  const indianStates = [
    "Maharashtra",
    "Delhi",
    "Karnataka",
    "Tamil Nadu",
    "Gujarat",
    "Rajasthan",
    "Uttar Pradesh",
    "West Bengal",
    "Andhra Pradesh",
    "Bihar",
    "Haryana",
    "Kerala",
    "Madhya Pradesh",
    "Odisha",
    "Punjab",
    "Telangana",
  ];

  const { cart, cartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  // Get coupon from navigation state
  const appliedCouponFromCart = location.state?.appliedCoupon || null;
  const discountAmountFromCart = location.state?.discountAmount || 0;

  const [appliedCoupon, setAppliedCoupon] = useState(appliedCouponFromCart);
  const [discountAmount, setDiscountAmount] = useState(discountAmountFromCart);

  const [step, setStep] = useState(1);

  const [orderPlaced, setOrderPlaced] = useState(false);

  const [orderId, setOrderId] = useState("");

  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");

  // GST Calculation
  const gstRate = 0.18;
  const subtotal = cartTotal;
  const gstAmount = subtotal * gstRate;
  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;
  const shippingCharge = subtotal > 999 ? 0 : 99;
  const discountedSubtotal = subtotal - discountAmount;
  const total = discountedSubtotal + gstAmount + shippingCharge;

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    showSuccessToast("Shipping details saved");
    setStep(2);
  };

  const handlePlaceOrder = () => {
    const newOrderId = "ORD-" + Date.now().toString(36).toUpperCase();

    showOrderPlacedToast(newOrderId);

    setOrderId(newOrderId);

    setOrderPlaced(true);

    clearCart();
  };

  // Login Required
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center bg-white p-6 sm:p-8 rounded-2xl shadow-sm max-w-md w-full">
          <ShoppingCart className="h-14 w-14 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />

          <h2 className="text-xl font-bold mb-2">Please Login First</h2>

          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            You need to login to place an order
          </p>

          <Link
            to="/login?redirect=/checkout"
            className="bg-green-600 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-green-700 inline-block w-full sm:w-auto"
          >
            Login to Continue
          </Link>
        </div>
      </div>
    );
  }

  // Empty Cart
  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center bg-white p-6 sm:p-8 rounded-2xl shadow-sm max-w-md w-full">
          <ShoppingCart className="h-14 w-14 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />

          <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>

          <p className="text-gray-500 mb-6 text-sm sm:text-base">
            Add some products to your cart first.
          </p>

          <Link
            to="/products"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 inline-block w-full sm:w-auto"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  // Order Success
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center lg:py-8 sm:py-12 px-4 lg:mt-16">
        <div className="max-w-lg w-full bg-white rounded-2xl p-5 sm:p-8 text-center border border-gray-300">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order Placed Successfully!
          </h1>

          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            Thank you for your purchase. Your order has been confirmed.
          </p>

          <div className="bg-gray-50 rounded-xl p-4 sm:p-6 mb-6 text-left">
            <div className="flex justify-between gap-4 mb-2">
              <span className="text-gray-600">Order ID:</span>

              <span className="font-semibold break-all text-right">
                {orderId}
              </span>
            </div>

            <div className="flex justify-between gap-4 mb-2">
              <span className="text-gray-600">Total Amount:</span>

              <span className="font-bold flex-shrink-0">
                ₹{total.toFixed(0).toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-gray-600">Payment Method:</span>

              <span className="text-right">
                {paymentMethod === "cod"
                  ? "Cash on Delivery"
                  : "Online Payment"}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              to="/"
              className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Back to Home
            </Link>

            <Link
              to="/products"
              className="block w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8  md:pt-20 lg:pt-28">
      <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4 sm:mb-6 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-green-600">
            Home
          </Link>

          <ChevronRight className="h-4 w-4 flex-shrink-0" />

          <Link to="/cart" className="hover:text-green-600">
            Cart
          </Link>

          <ChevronRight className="h-4 w-4 flex-shrink-0" />

          <span className="text-gray-900 font-medium">Checkout</span>
        </nav>

        {/* Steps */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-6 sm:mb-8 overflow-x-auto pb-2">
          {/* Step 1 */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= 1
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              {step > 1 ? "✓" : "1"}
            </div>

            <span
              className={`text-sm font-medium ${
                step >= 1 ? "text-gray-900" : "text-gray-400"
              }`}
            >
              Shipping
            </span>
          </div>

          <div className="w-10 sm:w-16 h-0.5 bg-gray-200 flex-shrink-0"></div>

          {/* Step 2 */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= 2
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              2
            </div>

            <span
              className={`text-sm font-medium ${
                step >= 2 ? "text-gray-900" : "text-gray-400"
              }`}
            >
              Payment
            </span>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-8">
          {/* Left Side */}
          <div className="lg:col-span-2">
            {/* Shipping */}
            {step === 1 && (
              <div className="bg-white rounded-2xl border border-gray-300 p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold mb-6 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-600 flex-shrink-0" />
                  Shipping Address
                </h2>

                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  {/* Name + Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>

                      <input
                        type="text"
                        required
                        value={shippingInfo.fullName}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            fullName: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>

                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

                        <input
                          type="tel"
                          required
                          value={shippingInfo.phone}
                          onChange={(e) =>
                            setShippingInfo({
                              ...shippingInfo,
                              phone: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>

                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

                      <input
                        type="email"
                        required
                        value={shippingInfo.email}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            email: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address *
                    </label>

                    <textarea
                      required
                      rows={3}
                      value={shippingInfo.address}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          address: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                      placeholder="House No., Street, Area"
                    />
                  </div>

                  {/* City + State */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State *
                      </label>

                      <Listbox
                        value={shippingInfo.state}
                        onChange={(value) =>
                          setShippingInfo({
                            ...shippingInfo,
                            state: value,
                          })
                        }
                      >
                        <div className="relative">
                          <Listbox.Button className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-left focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white flex items-center justify-between">
                            <span
                              className={
                                shippingInfo.state
                                  ? "text-gray-900"
                                  : "text-gray-400"
                              }
                            >
                              {shippingInfo.state || "Select State"}
                            </span>
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                          </Listbox.Button>
                          <Listbox.Options className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto py-1 text-sm">
                            {indianStates.map((state) => (
                              <Listbox.Option
                                key={state}
                                value={state}
                                className={({ active, selected }) =>
                                  `cursor-pointer select-none px-4 py-2.5 ${
                                    active
                                      ? "bg-green-50 text-green-600"
                                      : "text-gray-700"
                                  } ${selected ? "bg-green-100 font-medium" : ""}`
                                }
                              >
                                {state}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </div>
                      </Listbox>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>

                      <input
                        type="text"
                        required
                        value={shippingInfo.city}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            city: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                        placeholder="Mumbai"
                      />
                    </div>
                  </div>

                  {/* Pincode + Landmark */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pincode *
                      </label>

                      <input
                        type="text"
                        required
                        pattern="[0-9]{6}"
                        value={shippingInfo.pincode}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            pincode: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                        placeholder="400001"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Landmark
                      </label>

                      <input
                        type="text"
                        value={shippingInfo.landmark}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            landmark: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                        placeholder="Nearby landmark"
                      />
                    </div>
                  </div>

                  {/* Continue */}
                  <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    Continue to Payment
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </form>
              </div>
            )}

            {/* Payment */}
            {step === 2 && (
              <div className="bg-white rounded-2xl border border-gray-300 p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold mb-6 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-green-600" />
                  Payment Method
                </h2>

                {/* Payment Options */}
                <div className="space-y-3">
                  {/* COD */}
                  <label
                    className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${
                      paymentMethod === "cod"
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-green-600 focus:ring-green-500 mt-1"
                    />

                    <div className="min-w-0">
                      <p className="font-medium text-gray-900">
                        Cash on Delivery
                      </p>

                      <p className="text-sm text-gray-500 wrap-break-word">
                        Pay when you receive the product
                      </p>
                    </div>
                  </label>

                  {/* Online */}
                  <label
                    className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${
                      paymentMethod === "online"
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="online"
                      checked={paymentMethod === "online"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-green-600 focus:ring-green-500 mt-1"
                    />

                    <div className="min-w-0">
                      <p className="font-medium text-gray-900">
                        Online Payment
                      </p>

                      <p className="text-sm text-gray-500 wrap-break-word">
                        Pay via UPI, Credit/Debit Card, or Net Banking
                      </p>
                    </div>
                  </label>
                </div>

                {/* Address Summary */}
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    Shipping To:
                  </h3>

                  <div className="space-y-1 text-sm text-gray-600 wrap-break-word">
                    <p>{shippingInfo.fullName}</p>

                    <p>
                      {shippingInfo.address}, {shippingInfo.city}
                    </p>

                    <p>
                      {shippingInfo.state} - {shippingInfo.pincode}
                    </p>

                    <p>{shippingInfo.phone}</p>
                  </div>

                  <button
                    onClick={() => setStep(1)}
                    className="text-sm text-green-600 hover:text-green-700 font-medium mt-3"
                  >
                    Edit Address
                  </button>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>

                  <button
                    onClick={handlePlaceOrder}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-colors"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-300 p-4 sm:p-6 lg:sticky lg:top-24">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>

              {/* Cart Items */}
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 text-sm min-w-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 sm:w-14 sm:h-14 object-contain bg-gray-100 rounded-lg flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0 overflow-hidden">
                      <p className="text-gray-900 text-sm wrap-break-word line-clamp-2">
                        {item.name}
                      </p>

                      <p className="text-gray-500 text-xs sm:text-sm">
                        Qty: {item.quantity} × ₹
                        {item.price.toLocaleString("en-IN")}
                      </p>
                    </div>

                    <p className="font-medium flex-shrink-0 text-sm">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Subtotal</span>

                  <span className="flex-shrink-0">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">CGST (9%)</span>

                  <span className="flex-shrink-0">
                    ₹{cgst.toFixed(0).toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">SGST (9%)</span>

                  <span className="flex-shrink-0">
                    ₹{sgst.toFixed(0).toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Shipping</span>

                  <span
                    className={`flex-shrink-0 ${
                      shippingCharge === 0 ? "text-green-600" : ""
                    }`}
                  >
                    {shippingCharge === 0 ? "FREE" : `₹${shippingCharge}`}
                  </span>
                </div>
              </div>

              {/* Discount Row */}
              {discountAmount > 0 && appliedCoupon && (
                <div className="flex justify-between gap-4 text-green-600">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span className="font-medium flex-shrink-0">
                    -₹{discountAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              )}

              {/* Total */}

              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between text-lg font-bold gap-4">
                  <span>Total</span>
                  <span className="flex-shrink-0 text-green-600">
                    ₹{total.toFixed(0).toLocaleString("en-IN")}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <p className="text-xs text-green-600 mt-1">
                    You saved ₹{discountAmount.toLocaleString("en-IN")} with
                    coupon!
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  Inclusive of all taxes
                </p>
              </div>

              {/* Extra Info */}
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Truck className="h-4 w-4 flex-shrink-0" />

                  <span>Estimated delivery: 3-5 business days</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Shield className="h-4 w-4 flex-shrink-0" />
                  <span>10-Day easy returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
