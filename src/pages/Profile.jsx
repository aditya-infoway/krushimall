import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Edit3,
  Save,
  X,
  Package,
  Heart,
  Settings,
  LogOut,
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  ChevronRight,
  Star,
  Calendar,
  CreditCard,
  Bell,
  Shield,
  HelpCircle,
  Award,
  TrendingUp,
  Eye,
  Trash2,
  Plus,
} from "lucide-react";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [userData, setUserData] = useState({
    name: "Rajesh Kumar",
    email: "rajesh.kumar@email.com",
    phone: "+91 98765 43210",
    location: "Jaipur, Rajasthan",
    avatar: null,
  });

  const [orders] = useState([
    {
      id: "ORD-2024-001",
      date: "15 Jan 2024",
      status: "Delivered",
      total: "₹1,499",
      items: "Bosch Engine Oil Filter",
      image:
        "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=100&h=100&fit=crop&auto=format",
      quantity: 1,
    },
    {
      id: "ORD-2024-002",
      date: "10 Jan 2024",
      status: "Shipped",
      total: "₹3,899",
      items: "Brembo Brake Pads Set",
      image:
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=100&h=100&fit=crop&auto=format",
      quantity: 1,
    },
    {
      id: "ORD-2024-003",
      date: "05 Jan 2024",
      status: "Processing",
      total: "₹999",
      items: "NGK Spark Plugs (4 Pack)",
      image:
        "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=100&h=100&fit=crop&auto=format",
      quantity: 4,
    },
  ]);

  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: "KYB Shock Absorber",
      brand: "KYB",
      price: "₹4,499",
      image:
        "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=200&h=200&fit=crop&auto=format",
      inStock: true,
    },
    {
      id: 2,
      name: "Mann Air Filter",
      brand: "Mann Filter",
      price: "₹749",
      image:
        "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=200&h=200&fit=crop&auto=format",
      inStock: true,
    },
    {
      id: 3,
      name: "Castrol EDGE 5W-30",
      brand: "Castrol",
      price: "₹3,299",
      image:
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=200&h=200&fit=crop&auto=format",
      inStock: false,
    },
  ]);

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    {
      id: "orders",
      label: "My Orders",
      icon: Package,
      link: "/orders",
      count: orders.length,
    },
    {
      id: "wishlist",
      label: "Wishlist",
      icon: Heart,
      link: "/wishlist",
      count: wishlistItems.length,
    },

    {
      id: "Booked Services",
      label: "Booked Services",
      icon: Heart,
      link: "/booking-history",
    },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const removeFromWishlist = (id) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSave = () => {
    setIsEditing(false);
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "Shipped":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Processing":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return CheckCircle;
      case "Shipped":
        return Truck;
      case "Processing":
        return Clock;
      default:
        return Clock;
    }
  };

  // Stats for profile
  const stats = [
    {
      label: "Total Orders",
      value: "12",
      icon: Package,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Wishlist",
      value: wishlistItems.length.toString(),
      icon: Heart,
      color: "bg-red-50 text-red-500",
    },
    {
      label: "Reviews",
      value: "5",
      icon: Star,
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      label: "Points",
      value: "1,250",
      icon: Award,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 lg:mt-4">
      {/* Success Toast */}
      {showSaveSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-slideDown bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          <span className="font-medium">Profile updated successfully!</span>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pt-2">
          <nav className="flex items-center gap-2 text-sm">
            <Link
              to="/"
              className="text-gray-500 hover:text-green-600 transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-gray-400" />
            <span className="text-gray-900 font-medium">My Account</span>
          </nav>
        </div>
      </div>

      <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 py-6">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-r from-green-600 to-green-700"></div>
              <div className="relative z-10">
                <div className="relative w-24 h-24 mx-auto mb-3">
                  <div className="w-24 h-24 rounded-full border-4 border-white bg-green-100 flex items-center justify-center overflow-hidden shadow-md">
                    {userData.avatar ? (
                      <img
                        src={userData.avatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-12 w-12 text-green-600" />
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-green-600 text-white p-1.5 rounded-full shadow-lg hover:bg-green-700 transition-all hover:scale-110">
                    <Camera className="h-3.5 w-3.5" />
                  </button>
                </div>
                <h3 className="font-bold text-gray-900 text-lg">
                  {userData.name}
                </h3>
                <p className="text-sm text-gray-500 mb-4">{userData.email}</p>
                <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full border border-green-200">
                  <Shield className="h-3 w-3" />
                  Verified Buyer
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-gray-200 p-3 text-center shadow-sm hover:shadow-md transition-all"
                >
                  <div
                    className={`w-9 h-9 ${stat.color} rounded-lg flex items-center justify-center mx-auto mb-2`}
                  >
                    <stat.icon className="h-4 w-4" />
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {tabs.map((tab) => (
                <Link
                  key={tab.id}
                  to={tab.link}
                  className={`w-full flex items-center justify-between px-5 py-3.5 text-sm font-medium transition-all border-l-2`}
                >
                  <div className="flex items-center gap-3">
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </div>
                  {tab.count !== undefined && (
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        activeTab === tab.id
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </Link>
              ))}
              <button className="w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100">
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Personal Information
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Update your personal details here
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        if (isEditing) handleSave();
                        else setIsEditing(true);
                      }}
                      className={`flex items-center whitespace-nowrap gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        isEditing
                          ? "bg-green-600 text-white hover:bg-green-700 shadow-md"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {isEditing ? (
                        <>
                          <Save className="h-4 w-4" /> Save Changes
                        </>
                      ) : (
                        <>
                          <Edit3 className="h-4 w-4" /> Edit Profile
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          value={userData.name}
                          disabled={!isEditing}
                          onChange={(e) =>
                            setUserData({ ...userData, name: e.target.value })
                          }
                          className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-white disabled:bg-gray-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="email"
                          value={userData.email}
                          disabled={!isEditing}
                          onChange={(e) =>
                            setUserData({ ...userData, email: e.target.value })
                          }
                          className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-white disabled:bg-gray-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="tel"
                          value={userData.phone}
                          disabled={!isEditing}
                          onChange={(e) =>
                            setUserData({ ...userData, phone: e.target.value })
                          }
                          className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-white disabled:bg-gray-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          value={userData.location}
                          disabled={!isEditing}
                          onChange={(e) =>
                            setUserData({
                              ...userData,
                              location: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-white disabled:bg-gray-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="mt-6 pt-6 border-t border-gray-100 flex gap-3">
                      <button
                        onClick={handleSave}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-all flex items-center gap-2 text-sm shadow-md"
                      >
                        <Save className="h-4 w-4" />
                        Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-all flex items-center gap-2 text-sm"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {/* Account Security */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Account Security
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            Password
                          </p>
                          <p className="text-xs text-gray-500">
                            Last changed 3 months ago
                          </p>
                        </div>
                      </div>
                      <button className="text-sm font-semibold text-green-600 hover:text-green-700">
                        Change
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            Two-Factor Auth
                          </p>
                          <p className="text-xs text-gray-500">
                            Add extra security layer
                          </p>
                        </div>
                      </div>
                      <button className="text-sm font-semibold text-green-600 hover:text-green-700">
                        Enable
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="space-y-4">
                {orders.map((order) => {
                  const StatusIcon = getStatusIcon(order.status);
                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 lg:p-6 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                            <img
                              src={order.image}
                              alt={order.items}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium mb-1">
                              {order.id}
                            </p>
                            <h4 className="font-semibold text-gray-900 text-sm mb-1">
                              {order.items}
                            </h4>
                            <p className="text-xs text-gray-400">
                              Qty: {order.quantity}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                              <Calendar className="h-3 w-3" />
                              {order.date}
                            </div>
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${getStatusColor(order.status)}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div>
                          <p className="text-xs text-gray-500">Total Amount</p>
                          <p className="text-lg font-bold text-gray-900">
                            {order.total}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button className="text-sm font-semibold text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                            Track Order
                          </button>
                          <Link
                            to={`/orders/${order.id}`}
                            className="text-sm font-semibold text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-4 py-2 rounded-lg transition-colors flex items-center gap-1"
                          >
                            View Details <ChevronRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === "wishlist" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-500">
                    {wishlistItems.length} items in your wishlist
                  </p>
                  <button className="text-sm font-semibold text-green-600 hover:text-green-700">
                    Add All to Cart
                  </button>
                </div>
                {wishlistItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-all group"
                  >
                    <div className="flex gap-5">
                      <div className="w-24 h-24 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs text-green-600 font-semibold uppercase tracking-wider mb-1">
                              {item.brand}
                            </p>
                            <h4 className="font-bold text-gray-900 text-sm mb-1">
                              {item.name}
                            </h4>
                            <p className="text-lg font-black text-green-700 mb-3">
                              {item.price}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromWishlist(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          {item.inStock ? (
                            <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                              <CheckCircle className="h-3.5 w-3.5" /> In Stock
                            </span>
                          ) : (
                            <span className="text-xs text-red-500 font-medium">
                              Out of Stock
                            </span>
                          )}
                          <button className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-all shadow-sm hover:shadow-md flex items-center gap-1.5">
                            <ShoppingBag className="h-3.5 w-3.5" />
                            Add to Cart
                          </button>
                          <button className="text-xs font-semibold text-gray-500 hover:text-green-600 transition-colors flex items-center gap-1">
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm divide-y divide-gray-100">
                  <div className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Bell className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">
                          Notifications
                        </h4>
                        <p className="text-xs text-gray-500">
                          Manage email, SMS, and push notification preferences
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </div>

                  <div className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Shield className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">
                          Privacy & Security
                        </h4>
                        <p className="text-xs text-gray-500">
                          Manage password, 2FA, and security settings
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </div>

                  <div className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <CreditCard className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">
                          Payment Methods
                        </h4>
                        <p className="text-xs text-gray-500">
                          Add, remove, or update your payment methods
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">2 cards</span>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  <div className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <MapPin className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">
                          Addresses
                        </h4>
                        <p className="text-xs text-gray-500">
                          Manage your shipping and billing addresses
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">2 addresses</span>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  <div className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <HelpCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">
                          Help & Support
                        </h4>
                        <p className="text-xs text-gray-500">
                          FAQs, contact support, and documentation
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Profile;
