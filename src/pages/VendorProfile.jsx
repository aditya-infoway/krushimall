import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Store,
  Package,
  Truck,
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Edit3,
  Save,
  X,
  Settings,
  LogOut,
  ShoppingBag,
  Clock,
  CheckCircle,
  ChevronRight,
  Star,
  TrendingUp,
  Globe,
  Home,
  Building,
  Hash,
  Briefcase,
  Calendar,
  CreditCard,
  Shield,
  HelpCircle,
  Bell,
  Eye,
  Trash2,
  Plus,
  Wrench,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import { showSuccessToast, showErrorToast } from "../utils/toast";
import { Combobox } from "@headlessui/react";
import { Country, State, City } from "country-state-city";
import apiHelper from "../utils/apiHelper";
import { useAuth } from "../context/AuthContext";

// Combobox wrapper component
const ComboboxWrapper = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  icon: Icon,
  disabled = false,
  required = false,
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
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Combobox
        value={value}
        onChange={onChange}
        onClose={() => setQuery("")}
        disabled={disabled}
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
            disabled={disabled}
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
            {filtered.length === 0 && query !== "" ? (
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
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  );
};

const VendorProfile = () => {
  const navigate = useNavigate();
  const { user, logout, refreshUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "profile",
  );
  // Vendor data from become-vendor
  const [vendorData, setVendorData] = useState({
    // Personal Info
    name: "",
    email: "",
    phone: "",

    // Vendor Type
    vendorType: "vehicle", // 'vehicle', 'spare-parts', 'service'
    vehicleType: "new", // 'new', 'used'

    // Address
    country: "",
    state: "",
    district: "",
    city: "",
    address: "",
    pincode: "",

    // Business Info
    businessName: "",
    gstNumber: "",
    panNumber: "",
    establishmentYear: "",
    businessAddress: "",

    // Stats
    totalProducts: 0,
    totalOrders: 0,
    revenue: 0,
    rating: 0,
  });

  // Dynamic dropdown states
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  const [errors, setErrors] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [products.length]);

  // Load countries on mount
  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);
  }, []);

  // Load vendor data
  const loadVendorData = async () => {
    try {
      setLoading(true);

      // First check if we have data from become-vendor
      const storedVendorData = localStorage.getItem("vendorData");

      if (storedVendorData) {
        const parsedData = JSON.parse(storedVendorData);

        setVendorData((prev) => ({
          ...prev,
          ...parsedData,
          name: parsedData.businessName || user?.name || "",
          email: user?.email || "",
          phone: user?.phone || "",
        }));
      }

      // Fetch from API
      const response = await apiHelper.get("/vendor/me");
      const userData = response.vendor;

      setVendorData((prev) => ({
        ...prev,
        name: userData.name || prev.name,
        email: userData.email || prev.email,
        phone: userData.phone || prev.phone,
        address: userData.address || prev.address,
        country: userData.country || prev.country,
        state: userData.state || prev.state,
        district: userData.district || prev.district,
        city: userData.city || prev.city,
        pincode: userData.pincode || prev.pincode,
      }));

      const country = Country.getAllCountries().find(
        (c) => c.name === userData.country,
      );

      if (country) {
        setSelectedCountry(country);

        const state = State.getStatesOfCountry(country.isoCode).find(
          (s) => s.name === userData.state,
        );

        if (state) {
          setSelectedState(state);

          const cityList = City.getCitiesOfState(
            country.isoCode,
            state.isoCode,
          );

          setCities(cityList);
          setDistricts(cityList);

          const city = cityList.find((c) => c.name === userData.city);
          if (city) setSelectedCity(city);

          const district = cityList.find((c) => c.name === userData.district);
          if (district) setSelectedDistrict(district);
        }
      }
    } catch (err) {
      console.log(err);
      showErrorToast("Unable to load vendor profile");
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      setLoadingProducts(true);

      const res = await apiHelper.get("/vendor-web/website-variant");

      setProducts(res.data || []);
    } catch (err) {
      console.log(err);
      showErrorToast("Unable to load products");
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    loadVendorData();
    loadProducts();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await apiHelper.delete(`/vendor-web/website-variant/${id}`);
      showSuccessToast("Product deleted");
      loadProducts();
    } catch (err) {
      showErrorToast("Unable to delete");
    }
  };

  // Vendor Stats
  const vendorStats = [
    {
      label: "Total Products",
      value: vendorData.totalProducts || "0",
      icon: Package,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Total Orders",
      value: vendorData.totalOrders || "0",
      icon: ShoppingBag,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Revenue",
      value: `₹${vendorData.revenue || "0"}`,
      icon: TrendingUp,
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      label: "Rating",
      value: `${vendorData.rating || "0"} ★`,
      icon: Star,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  // Tabs for vendor
  const tabs = [
    { id: "profile", label: "Profile", icon: User },

    { id: "products", label: "Products", icon: Package },

     { id: "enquiries", label: "Enquiries", icon: MessageSquare },
  ];

  const handleSave = async () => {
    try {
      setLoading(true);
      // Save vendor data
      const updatedData = {
        ...vendorData,
        country: selectedCountry?.name || vendorData.country,
        state: selectedState?.name || vendorData.state,
        city: selectedCity?.name || vendorData.city,
        district: selectedDistrict?.name || vendorData.district,
      };

      // API call to update vendor profile
      await apiHelper.put("/vendor/update", updatedData);

      // Update local storage
      localStorage.setItem("vendorData", JSON.stringify(updatedData));

      setIsEditing(false);
      setShowSaveSuccess(true);
      showSuccessToast("Vendor profile updated successfully!");
      setTimeout(() => setShowSaveSuccess(false), 3000);

      // Refresh user data
      await refreshUser();
    } catch (error) {
      showErrorToast("Failed to update vendor profile");
    } finally {
      setLoading(false);
    }
  };

  // VendorProfile.jsx
  const handleVendorLogout = () => {
    localStorage.removeItem("vendorToken");
    localStorage.removeItem("vendorData");
    localStorage.removeItem("isVendorLoggedIn");
    window.dispatchEvent(new Event("vendorAuthChanged")); // add this

    navigate("/vendor-login", { replace: true });
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset dropdown selections
    // You may want to reload original data here
  };

  const handleCountryChange = (country) => {
    setSelectedCountry(country);

    const stateList = State.getStatesOfCountry(country.isoCode);
    setStates(stateList);

    setCities([]);
    setDistricts([]);

    setSelectedState(null);
    setSelectedCity(null);
    setSelectedDistrict(null);

    setVendorData((prev) => ({
      ...prev,
      country: country.name,
      state: "",
      city: "",
      district: "",
    }));
  };

  const handleStateChange = (state) => {
    setSelectedState(state);

    const cityList = City.getCitiesOfState(
      selectedCountry.isoCode,
      state.isoCode,
    );

    setCities(cityList);
    setDistricts(cityList);

    setSelectedCity(null);
    setSelectedDistrict(null);

    setVendorData((prev) => ({
      ...prev,
      state: state.name,
      city: "",
      district: "",
    }));
  };

  const handleCityChange = (value) => {
    setSelectedCity(value);
    setVendorData((prev) => ({ ...prev, city: value?.name || "" }));
  };

  const handleDistrictChange = (value) => {
    setSelectedDistrict(value);

    setVendorData((prev) => ({
      ...prev,
      district: value?.name || "",
    }));
  };

  const getVendorTypeLabel = (type) => {
    switch (type) {
      case "vehicle":
        return "Vehicle";
      case "spare-parts":
        return "Spare Parts";
      case "service":
        return "Service";
      default:
        return "Vehicle";
    }
  };

  const getVehicleTypeLabel = (type) => {
    switch (type) {
      case "new":
        return "New";
      case "used":
        return "Used";
      default:
        return "New";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading vendor profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white lg:mt-4">
      {/* Success Toast */}
      {showSaveSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-slideDown bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          <span className="font-medium">Profile updated successfully!</span>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="bg-white">
        <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pt-12 md:pt-16 lg:pt-20">
          <nav className="flex items-center gap-2 text-sm">
            <Link
              to="/"
              className="text-gray-500 hover:text-green-600 transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-gray-400" />
            <span className="text-gray-900 font-medium">Vendor Dashboard</span>
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
                    <Store className="h-12 w-12 text-green-600" />
                  </div>
                  <button className="absolute bottom-0 right-0 bg-green-600 text-white p-1.5 rounded-full shadow-lg hover:bg-green-700 transition-all hover:scale-110">
                    <Camera className="h-3.5 w-3.5" />
                  </button>
                </div>
                <h3 className="font-bold text-gray-900 text-lg">
                  {vendorData.businessName || vendorData.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2">{vendorData.email}</p>
                <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full border border-green-200">
                  <Store className="h-3 w-3" />
                  Vendor
                </div>
                <div className="mt-2 inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200">
                  {getVendorTypeLabel(vendorData.vendorType)}
                  {vendorData.vendorType === "vehicle" &&
                    ` • ${getVehicleTypeLabel(vendorData.vehicleType)}`}
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-5 py-3.5 text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-green-50 text-green-700 border-l-2 border-green-600"
                      : "text-gray-600 hover:bg-gray-50 border-l-2 border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </div>
                </button>
              ))}
              <button
                onClick={handleVendorLogout}
                className="w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
              >
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
                {/* Vendor Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {vendorStats.map((stat, idx) => (
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

                {/* Personal Information */}
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
                    {/* Business Name */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Business Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          value={vendorData.businessName || vendorData.name}
                          disabled={!isEditing}
                          onChange={(e) =>
                            setVendorData({
                              ...vendorData,
                              businessName: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-white disabled:bg-gray-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none transition-all"
                          placeholder="Your Business Name"
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
                          value={vendorData.email}
                          disabled
                          className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed"
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
                          value={vendorData.phone}
                          disabled={!isEditing}
                          onChange={(e) =>
                            setVendorData({
                              ...vendorData,
                              phone: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-white disabled:bg-gray-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none transition-all"
                          placeholder="9876543210"
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
                          value={vendorData.address}
                          disabled={!isEditing}
                          onChange={(e) =>
                            setVendorData({
                              ...vendorData,
                              address: e.target.value,
                            })
                          }
                          rows="2"
                          className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-white disabled:bg-gray-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none transition-all resize-none"
                          placeholder="123, Main Street"
                        />
                      </div>
                    </div>

                    {/* Country */}
                    <ComboboxWrapper
                      label="Country"
                      value={selectedCountry}
                      onChange={handleCountryChange}
                      options={countries}
                      placeholder="Select a country"
                      icon={Globe}
                      disabled={!isEditing}
                    />

                    {/* State */}
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
                      icon={Building}
                      disabled={!isEditing || !selectedCountry}
                    />

                    {/* District */}
                    <ComboboxWrapper
                      label="District"
                      value={selectedDistrict}
                      onChange={handleDistrictChange}
                      options={districts}
                      placeholder="Select district"
                      icon={MapPin}
                      disabled={!isEditing || !selectedState}
                      getLabel={(option) => option?.name || ""}
                    />

                    {/* City */}
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
                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          value={vendorData.pincode}
                          disabled={!isEditing}
                          onChange={(e) =>
                            setVendorData({
                              ...vendorData,
                              pincode: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-white disabled:bg-gray-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none transition-all"
                          placeholder="302001"
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
                          value={getVendorTypeLabel(vendorData.vendorType)}
                          disabled
                          className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed"
                        />
                      </div>
                    </div>

                    {/* Vehicle Type - Display Only */}
                    {vendorData.vendorType === "vehicle" && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Vehicle Type
                        </label>
                        <div className="relative">
                          <Truck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            value={getVehicleTypeLabel(vendorData.vehicleType)}
                            disabled
                            className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed"
                          />
                        </div>
                      </div>
                    )}
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
                        onClick={handleCancel}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-all flex items-center gap-2 text-sm"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Business Info Tab */}
            {activeTab === "business" && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Business Information
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Manage your business details
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
                        <Edit3 className="h-4 w-4" /> Edit Business
                      </>
                    )}
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Business Name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Business Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={vendorData.businessName || vendorData.name}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setVendorData({
                            ...vendorData,
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
                        value={vendorData.gstNumber || ""}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setVendorData({
                            ...vendorData,
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
                        value={vendorData.panNumber || ""}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setVendorData({
                            ...vendorData,
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
                        value={vendorData.establishmentYear || ""}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setVendorData({
                            ...vendorData,
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
                        value={vendorData.businessAddress || ""}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setVendorData({
                            ...vendorData,
                            businessAddress: e.target.value,
                          })
                        }
                        rows="3"
                        className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-white disabled:bg-gray-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none transition-all resize-none"
                        placeholder="456, Industrial Area, Phase 2"
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
                      onClick={handleCancel}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-all flex items-center gap-2 text-sm"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Products Tab */}
            {activeTab === "products" && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Your Products{" "}
                      {products.length > 0 && `(${products.length})`}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Manage your product listings
                    </p>
                  </div>

                  <button
                    onClick={() => navigate("/vendor/add-product")}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold"
                  >
                    <Plus className="h-4 w-4" />
                    Add Product
                  </button>
                </div>

                {loadingProducts ? (
                  <div className="text-center py-10">Loading...</div>
                ) : products.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Products Listed
                    </h3>

                    <p className="text-sm text-gray-500 mb-6">
                      Start selling by adding your first product
                    </p>

                   
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200 rounded-xl">
                      <thead className="bg-gray-50 whitespace-nowrap">
                        <tr>
                          <th className="px-4 py-3 text-left">Sr. No.</th>
                          <th className="px-4 py-3 text-left">Product</th>
                          <th className="px-4 py-3 text-left">Brand</th>
                          <th className="px-4 py-3 text-left">Price</th>
                          <th className="px-4 py-3 text-left">Status</th>
                          <th className="px-4 py-3 text-center">Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {paginatedProducts.map((item, index) => (
                          <tr key={item.id} className="border-t whitespace-nowrap ">
                            <td className="px-4 py-3 text-gray-500">
                              {(currentPage - 1) * itemsPerPage + index + 1}
                            </td>
                            <td className="px-4 py-3">{item.productName}</td>
                            <td className="px-4 py-3">
                              {item.brand?.brandName}
                            </td>
                            <td className="px-4 py-3">
                              ₹ {item.exShowroomPrice}
                            </td>
                            <td className="px-4 py-3">{item.status}</td>
                            <td className="px-4 py-3">
                              <div className="flex justify-center gap-2">
                                <button
                                  onClick={() =>
                                    navigate(`/vendor/edit-product/${item.id}`)
                                  }
                                  className="px-3 py-1 bg-blue-500 text-white rounded-lg"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(item.id)}
                                  className="px-3 py-1 bg-red-500 text-white rounded-lg"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Pagination controls */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between mt-4 px-1">
                        <p className="text-xs text-gray-500">
                          Showing {(currentPage - 1) * itemsPerPage + 1}–
                          {Math.min(
                            currentPage * itemsPerPage,
                            products.length,
                          )}{" "}
                          of {products.length} products
                        </p>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              setCurrentPage((p) => Math.max(1, p - 1))
                            }
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            Previous
                          </button>

                          {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1,
                          ).map((page) => (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`w-8 h-8 text-sm rounded-lg transition-colors ${
                                currentPage === page
                                  ? "bg-green-600 text-white font-medium"
                                  : "text-gray-600 hover:bg-gray-50 border border-gray-200"
                              }`}
                            >
                              {page}
                            </button>
                          ))}

                          <button
                            onClick={() =>
                              setCurrentPage((p) => Math.min(totalPages, p + 1))
                            }
                            disabled={currentPage === totalPages}
                            className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Orders</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      View and manage customer orders
                    </p>
                  </div>
                </div>

                <div className="text-center py-12">
                  <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Orders Yet
                  </h3>
                  <p className="text-sm text-gray-500">
                    When customers start ordering, you'll see them here
                  </p>
                </div>
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
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
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

export default VendorProfile;
