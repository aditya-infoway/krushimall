import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Globe,
  Home,
  Store,
  Briefcase,
} from "lucide-react";
import { showSuccessToast, showErrorToast } from "../utils/toast";
import { Combobox } from "@headlessui/react";
import { Country, State, City } from "country-state-city";
import apiHelper from "../utils/apiHelper";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading, logout, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // Get user type from localStorage or props (default to "user").
  // This flips to "vendor" once the user completes the "Become a
  // Vendor" flow — see /become-vendor.
  const [userType, setUserType] = useState("user"); // "user" or "vendor"
  const [loading, setLoading] = useState(true);

  // Dynamic dropdown states
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // District dropdown state
  const [districts, setDistricts] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    country: "",
    state: "",
    district: "",
    city: "",
    pincode: "",
    avatar: "",
  });

  useEffect(() => {
    if (!selectedCountry) {
      setStates([]);
      return;
    }

    const stateList = State.getStatesOfCountry(selectedCountry.isoCode);

    setStates(stateList);
  }, [selectedCountry]);

  useEffect(() => {
    if (!selectedCountry || !selectedState) {
      setCities([]);
      return;
    }

    const cityList = City.getCitiesOfState(
      selectedCountry.isoCode,
      selectedState.isoCode,
    );

    setCities(cityList);
  }, [selectedCountry, selectedState]);

  const districtOptions = cities;

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

  const tabs =
    userType === "vendor"
      ? [
          { id: "profile", label: "Profile", icon: User },
          { id: "business", label: "Business Info", icon: Store },
          { id: "settings", label: "Settings", icon: Settings },
        ]
      : [
          { id: "profile", label: "Profile", icon: User },
          { id: "orders", label: "Orders", icon: Package },
          { id: "wishlist", label: "Wishlist", icon: Heart },
          { id: "settings", label: "Settings", icon: Settings },
        ];

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  // Load countries on mount
  const loadProfile = async () => {
    try {
      setLoading(true);

      const response = await apiHelper.get("/webauth/me");

      const user = response.user;

      setUserData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        country: user.country || "",
        state: user.state || "",
        district: user.district || "",
        city: user.city || "",
        pincode: user.pincode || "",
        avatar: user.avatar ? apiHelper.getImageUrl(user.avatar) : "",
      }));

      const country = Country.getAllCountries().find(
        (c) => c.name === user.country,
      );

      if (country) {
        setSelectedCountry(country);

        const stateList = State.getStatesOfCountry(country.isoCode);
        setStates(stateList);

        const state = stateList.find((s) => s.name === user.state);

        if (state) {
          setSelectedState(state);

          const cityList = City.getCitiesOfState(
            country.isoCode,
            state.isoCode,
          );

          setCities(cityList);

          const city = cityList.find((c) => c.name === user.city);

          if (city) {
            setSelectedCity(city);
          }

          const district = cityList.find((c) => c.name === user.district);

          if (district) {
            setSelectedDistrict(district);
          }
        }
      }
    } catch (err) {
      console.log(err);
      showErrorToast("Unable to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const removeFromWishlist = (id) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();

      formData.append("name", userData.name);
      formData.append("email", userData.email);
      formData.append("phone", userData.phone);
      formData.append("address", userData.address);
      formData.append("country", userData.country);
      formData.append("state", userData.state);
      formData.append("district", userData.district);
      formData.append("city", userData.city);
      formData.append("pincode", userData.pincode);

      // Upload image if selected
      if (selectedImage) {
        formData.append("avatar", selectedImage);
      }

      await apiHelper.put("/webauth/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      showSuccessToast("Profile updated");

      setSelectedImage(null);
      setIsEditing(false);

      await loadProfile();
    } catch (err) {
      console.error(err);
      showErrorToast("Unable to update profile");
    }
  };

  const handleCountryChange = (value) => {
    setSelectedCountry(value);

    setSelectedState(null);
    setSelectedCity(null);
    setSelectedDistrict(null);

    setUserData((prev) => ({
      ...prev,
      country: value?.name || "",
      state: "",
      city: "",
      district: "",
    }));
  };

  const handleStateChange = (value) => {
    setSelectedState(value);

    setSelectedCity(null);
    setSelectedDistrict(null);

    setUserData((prev) => ({
      ...prev,
      state: value?.name || "",
      city: "",
      district: "",
    }));
  };

  const handleCityChange = (value) => {
    setSelectedCity(value);

    setUserData((prev) => ({
      ...prev,
      city: value?.name || "",
    }));
  };

  const handleDistrictChange = (value) => {
    setSelectedDistrict(value);

    setUserData((prev) => ({
      ...prev,
      district: value?.name || "",
    }));
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

  // Vendor stats
  const vendorStats = [
    {
      label: "Total Products",
      value: "48",
      icon: Package,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Total Orders",
      value: "156",
      icon: ShoppingBag,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Revenue",
      value: "₹4.2L",
      icon: TrendingUp,
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      label: "Rating",
      value: "4.8 ★",
      icon: Star,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  // User stats
  const userStats = [
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

  // Combobox wrapper for profile
  const ComboboxWrapper = ({
    label,
    value,
    onChange,
    options,
    placeholder,
    error,
    icon: Icon,
    disabled = false,
    getLabel = (o) => (typeof o === "string" ? o : o?.name),
  }) => {
    const [query, setQuery] = useState("");
    const buttonRef = useRef(null);

    const filtered =
      query === ""
        ? options
        : options.filter((option) =>
            getLabel(option).toLowerCase().includes(query.toLowerCase()),
          );

    return (
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
          {label} <span className="text-red-500">*</span>
        </label>
        <Combobox
          value={value}
          onChange={onChange}
          onClose={() => setQuery("")}
          disabled={disabled || !isEditing}
        >
          <div className="relative">
            {Icon && (
              <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
            )}
            <Combobox.Input
              className={`w-full pl-10 pr-10 py-3 text-sm border rounded-xl bg-white disabled:bg-gray-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none transition-all ${
                error ? "border-red-300 bg-red-50" : "border-gray-200"
              }`}
              displayValue={(val) => (val ? getLabel(val) : "")}
              onChange={(e) => setQuery(e.target.value)}
              onClick={() => buttonRef.current?.click()}
              placeholder={placeholder}
              disabled={disabled || !isEditing}
            />
            <Combobox.Button
              ref={buttonRef}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <svg
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Combobox.Button>

            <Combobox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filtered.length === 0 ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-500">
                  No matches found
                </div>
              ) : (
                filtered.map((option, idx) => (
                  <Combobox.Option
                    key={idx}
                    value={option}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-green-100 text-green-900" : "text-gray-900"
                      }`
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${selected ? "font-medium" : "font-normal"}`}
                        >
                          {getLabel(option)}
                        </span>
                        {selected && (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                          </span>
                        )}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </div>
        </Combobox>
        {error && (
          <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
            {error}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white lg:mt-4">
      {/* Success Toast */}
      {showSaveSuccess && (
        <div className="fixed top-4 right-4 left-4 sm:left-auto z-50 animate-slideDown bg-green-600 text-white px-4 sm:px-6 py-3 rounded-xl shadow-lg flex items-center gap-2">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span className="font-medium text-sm sm:text-base">Profile updated successfully!</span>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="bg-white">
        <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pt-6 sm:pt-12 md:pt-16 lg:pt-20">
          <nav className="flex items-center gap-2 text-xs sm:text-sm overflow-x-auto whitespace-nowrap">
            <Link
              to="/"
              className="text-gray-500 hover:text-green-600 transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-gray-400 shrink-0" />
            <span className="text-gray-900 font-medium">
              {userType === "vendor" ? "Vendor Dashboard" : "My Account"}
            </span>
          </nav>
        </div>
      </div>

      <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-16 sm:h-20 bg-gradient-to-r from-green-600 to-green-700"></div>
              <div className="relative z-10">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-3">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white bg-green-100 flex items-center justify-center overflow-hidden shadow-md">
                    {userData.avatar ? (
                      <img
                        src={userData.avatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-10 w-10 sm:h-12 sm:w-12 text-green-600" />
                    )}
                  </div>
                 <input
  ref={fileInputRef}
  type="file"
  accept="image/*"
  hidden
  disabled={!isEditing}
  onChange={(e) => {
    if (!isEditing) return;

    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImage(file);

    setUserData((prev) => ({
      ...prev,
      avatar: URL.createObjectURL(file),
    }));
  }}
/>
                <button
  type="button"
  disabled={!isEditing}
  onClick={() => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  }}
  className={`absolute bottom-0 right-0 p-1.5 rounded-full shadow-lg transition-all
    ${
      isEditing
        ? "bg-green-600 text-white hover:bg-green-700 hover:scale-110 cursor-pointer"
        : "bg-gray-300 text-gray-500 cursor-not-allowed"
    }`}
>
  <Camera className="h-3.5 w-3.5" />
</button>
                </div>
                <h3 className="font-bold text-gray-900 text-base sm:text-lg truncate px-2">
                  {userData.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 truncate px-2">{userData.email}</p>
                <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full border border-green-200">
                  <Shield className="h-3 w-3" />
                  {userType === "vendor" ? "Vendor" : "Verified Buyer"}
                </div>
              </div>
            </div>

            {/* Become a Vendor CTA — only shown to regular users.
                Once they complete /become-vendor, userType flips to
                "vendor" and this card is replaced by vendor tabs/stats. */}
            {userType !== "vendor" && (
              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-4 sm:p-5 text-center">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Store className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">
                  Sell on KrushiMall
                </h4>
                <p className="text-xs text-gray-600 mb-4">
                  Register as a vendor and start reaching thousands of
                  customers.
                </p>
                <Link
                  to="/become-vendor"
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-all shadow-sm hover:shadow-md"
                >
                  Become a Vendor <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}

            {/* Navigation Tabs */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-2 lg:p-0">
              <div className="grid grid-cols-2 gap-2 lg:block lg:gap-0">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col lg:flex-row items-center justify-center lg:justify-start text-center lg:text-left gap-1.5 lg:gap-3 px-2 lg:px-5 py-3 lg:py-3.5 rounded-xl lg:rounded-none text-xs lg:text-sm font-medium transition-all border lg:border-0 lg:border-l-2 lg:w-full ${
                      activeTab === tab.id
                        ? "bg-green-50 text-green-700 border-green-200 lg:border-green-600"
                        : "text-gray-600 hover:bg-gray-50 border-gray-200 lg:border-transparent"
                    }`}
                  >
                    <tab.icon className="h-4 w-4 shrink-0" />
                    <span className="leading-tight">{tab.label}</span>
                  </button>
                ))}
                <button
                  onClick={() => {
                    if (typeof logout === "function") logout();
                  }}
                  className="flex flex-col lg:flex-row items-center justify-center lg:justify-start text-center lg:text-left gap-1.5 lg:gap-3 col-span-2 lg:col-auto cursor-pointer px-2 lg:px-5 py-3 lg:py-3.5 rounded-xl lg:rounded-none text-xs lg:text-sm font-medium text-red-600 hover:bg-red-50 transition-colors border border-red-100 lg:border-0 lg:border-t lg:border-gray-100 lg:w-full"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-3 min-w-0">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-4 sm:space-y-6">
                {/* Quick Stats - Vendor or User */}
                {/* <div className="grid grid-cols-2 gap-3">
                  {(userType === "vendor" ? vendorStats : userStats).map(
                    (stat, idx) => (
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
                    ),
                  )}
                </div> */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 lg:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                        Personal Information
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        Update your personal details here
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        if (isEditing) handleSave();
                        else setIsEditing(true);
                      }}
                      className={`flex items-center justify-center whitespace-nowrap gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all w-full sm:w-auto ${
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Full Name <span className="text-red-500">*</span>
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

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Email Address <span className="text-red-500">*</span>
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

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Phone Number <span className="text-red-500">*</span>
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

                    {/* Address */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <textarea
                          value={userData.address}
                          disabled={!isEditing}
                          onChange={(e) =>
                            setUserData({
                              ...userData,
                              address: e.target.value,
                            })
                          }
                          rows="1"
                          className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-white disabled:bg-gray-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none transition-all resize-none"
                          placeholder="123, Main Street"
                        />
                      </div>
                    </div>

                    {/* Country - Dynamic Dropdown */}
                    <ComboboxWrapper
                      label="Country"
                      value={selectedCountry}
                      onChange={handleCountryChange}
                      options={countries}
                      placeholder="Select a country"
                      icon={Globe}
                      disabled={!isEditing}
                    />

                    {/* State - Dynamic Dropdown */}
                    <ComboboxWrapper
                      label="State"
                      value={selectedState}
                      onChange={handleStateChange}
                      options={states}
                      placeholder={
                        selectedCountry
                          ? "Select a state"
                          : "Select a country first"
                      }
                      icon={MapPin}
                      disabled={!isEditing || !selectedCountry}
                    />

                    {/* District - Dynamic Dropdown */}
                    <ComboboxWrapper
                      label="District"
                      value={selectedDistrict}
                      onChange={handleDistrictChange}
                      options={districtOptions}
                      placeholder={
                        selectedState
                          ? "Select a district"
                          : "Select a state first"
                      }
                      icon={MapPin}
                      disabled={!isEditing || !selectedState}
                    />

                    {/* City - Dynamic Dropdown */}
                    <ComboboxWrapper
                      label="City"
                      value={selectedCity}
                      onChange={handleCityChange}
                      options={cities}
                      placeholder={
                        selectedState ? "Select a city" : "Select a state first"
                      }
                      icon={Home}
                      disabled={!isEditing || !selectedState}
                    />

                    {/* Pincode */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Pincode <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          value={userData.pincode}
                          disabled={!isEditing}
                          onChange={(e) =>
                            setUserData({
                              ...userData,
                              pincode: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-white disabled:bg-gray-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none transition-all"
                          placeholder="400001"
                        />
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleSave}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-md w-full sm:w-auto"
                      >
                        <Save className="h-4 w-4" />
                        Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm w-full sm:w-auto"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {/* Account Security */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 lg:p-8">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">
                    Account Security
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3 p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3 min-w-0">
                        <Shield className="h-5 w-5 text-green-600 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900">
                            Password
                          </p>
                          <p className="text-xs text-gray-500">
                            Last changed 3 months ago
                          </p>
                        </div>
                      </div>
                      <button className="text-sm font-semibold text-green-600 hover:text-green-700 shrink-0">
                        Change
                      </button>
                    </div>
                    <div className="flex items-center justify-between gap-3 p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3 min-w-0">
                        <Phone className="h-5 w-5 text-green-600 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900">
                            Two-Factor Auth
                          </p>
                          <p className="text-xs text-gray-500">
                            Add extra security layer
                          </p>
                        </div>
                      </div>
                      <button className="text-sm font-semibold text-green-600 hover:text-green-700 shrink-0">
                        Enable
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Business Info Tab - Vendor Only */}
            {activeTab === "business" && userType === "vendor" && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                      Business Information
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Manage your business details
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (isEditing) handleSave();
                      else setIsEditing(true);
                    }}
                    className={`flex items-center justify-center whitespace-nowrap gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all w-full sm:w-auto ${
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
                        <Edit3 className="h-4 w-4" /> Edit Business
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Business Name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Business Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={userData.businessName || ""}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            businessName: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-white disabled:bg-gray-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none transition-all"
                        placeholder="Your Business Name"
                      />
                    </div>
                  </div>

                  {/* GST Number */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      GST Number
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={userData.gstNumber || ""}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            gstNumber: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-white disabled:bg-gray-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none transition-all"
                        placeholder="22ABCDE1234F1Z5"
                      />
                    </div>
                  </div>

                  {/* PAN Number */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      PAN Number
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={userData.panNumber || ""}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            panNumber: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-white disabled:bg-gray-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none transition-all"
                        placeholder="ABCDE1234F"
                      />
                    </div>
                  </div>

                  {/* Establishment Year */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Establishment Year
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={userData.establishmentYear || ""}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            establishmentYear: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-white disabled:bg-gray-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none transition-all"
                        placeholder="2015"
                      />
                    </div>
                  </div>

                  {/* Business Address */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Business Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <textarea
                        value={userData.businessAddress || ""}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            businessAddress: e.target.value,
                          })
                        }
                        rows="2"
                        className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-white disabled:bg-gray-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none transition-all resize-none"
                        placeholder="456, Industrial Area, Phase 2"
                      />
                    </div>
                  </div>

                  {/* Vendor Type - Display Only */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Vendor Type
                    </label>
                    <div className="relative">
                      <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={
                          userData.vendorType === "vehicle"
                            ? "Vehicle"
                            : userData.vendorType === "spare-parts"
                              ? "Spare Parts"
                              : "Service"
                        }
                        disabled
                        className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Vehicle Type - Display Only */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Vehicle Type
                    </label>
                    <div className="relative">
                      <Truck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={userData.vehicleType === "new" ? "New" : "Used"}
                        disabled
                        className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleSave}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-md w-full sm:w-auto"
                    >
                      <Save className="h-4 w-4" />
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm w-full sm:w-auto"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab - User Only */}
            {activeTab === "orders" && userType !== "vendor" && (
              <div className="space-y-4">
                {orders.map((order) => {
                  const StatusIcon = getStatusIcon(order.status);
                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5 lg:p-6 hover:shadow-md transition-all group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                            <img
                              src={order.image}
                              alt={order.items}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs text-gray-500 font-medium mb-1">
                              {order.id}
                            </p>
                            <h4 className="font-semibold text-gray-900 text-sm mb-1 truncate">
                              {order.items}
                            </h4>
                            <p className="text-xs text-gray-400">
                              Qty: {order.quantity}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                              <Calendar className="h-3 w-3 shrink-0" />
                              {order.date}
                            </div>
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border shrink-0 self-start ${getStatusColor(order.status)}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {order.status}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-gray-100">
                        <div>
                          <p className="text-xs text-gray-500">Total Amount</p>
                          <p className="text-lg font-bold text-gray-900">
                            {order.total}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button className="flex-1 sm:flex-none text-sm font-semibold text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                            Track Order
                          </button>
                          <Link
                            to={`/orders/${order.id}`}
                            className="flex-1 sm:flex-none justify-center text-sm font-semibold text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-4 py-2 rounded-lg transition-colors flex items-center gap-1"
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

            {/* Wishlist Tab - User Only */}
            {activeTab === "wishlist" && userType !== "vendor" && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <p className="text-sm text-gray-500">
                    {wishlistItems.length} items in your wishlist
                  </p>
                  <button className="text-sm font-semibold text-green-600 hover:text-green-700 text-left sm:text-right">
                    Add All to Cart
                  </button>
                </div>
                {wishlistItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5 hover:shadow-md transition-all group"
                  >
                    <div className="flex gap-4 sm:gap-5">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-xs text-green-600 font-semibold uppercase tracking-wider mb-1">
                              {item.brand}
                            </p>
                            <h4 className="font-bold text-gray-900 text-sm mb-1 truncate">
                              {item.name}
                            </h4>
                            <p className="text-base sm:text-lg font-black text-green-700 mb-3">
                              {item.price}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromWishlist(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1 shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                          {item.inStock ? (
                            <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                              <CheckCircle className="h-3.5 w-3.5" /> In Stock
                            </span>
                          ) : (
                            <span className="text-xs text-red-500 font-medium">
                              Out of Stock
                            </span>
                          )}
                          <button className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-4 sm:px-5 py-2.5 rounded-lg transition-all shadow-sm hover:shadow-md flex items-center gap-1.5">
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
                  <div className="p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl bg-green-50 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Bell className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm">
                          Notifications
                        </h4>
                        <p className="text-xs text-gray-500 truncate">
                          Manage email, SMS, and push notification preferences
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 shrink-0 group-hover:translate-x-1 transition-transform" />
                  </div>

                  <div className="p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl bg-green-50 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Shield className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm">
                          Privacy & Security
                        </h4>
                        <p className="text-xs text-gray-500 truncate">
                          Manage password, 2FA, and security settings
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 shrink-0 group-hover:translate-x-1 transition-transform" />
                  </div>

                  <div className="p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl bg-green-50 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <CreditCard className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm">
                          Payment Methods
                        </h4>
                        <p className="text-xs text-gray-500 truncate">
                          Add, remove, or update your payment methods
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-gray-400 hidden sm:inline">2 cards</span>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl bg-green-50 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <MapPin className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm">
                          Addresses
                        </h4>
                        <p className="text-xs text-gray-500 truncate">
                          Manage your shipping and billing addresses
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-gray-400 hidden sm:inline">2 addresses</span>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl bg-green-50 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <HelpCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm">
                          Help & Support
                        </h4>
                        <p className="text-xs text-gray-500 truncate">
                          FAQs, contact support, and documentation
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 shrink-0 group-hover:translate-x-1 transition-transform" />
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