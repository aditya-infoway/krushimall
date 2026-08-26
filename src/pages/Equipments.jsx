import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Listbox, RadioGroup } from "@headlessui/react";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Star,
  MapPin,
  Check,
  X,
  ShoppingBag,
  Package,
  Sparkles,
  Phone,
  BadgeCheck,
  Shield,
  Clock,
} from "lucide-react";
import Select from "react-select";
import { State, City } from "country-state-city";

// ===== SAMPLE DATA =====
const EQUIPMENTS = [
  {
    id: "1",
    name: "Multicrop Thresher",
    brand: "Shree Nath Trade Link",
    category: "Thresher",
    model: "Multicrop Hopper Model",
    price: 85000,
    image:
      "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400&auto=format&fit=crop&q=80",
    rating: 4.5,
    location: "Punjab, India",
    year: "2024",
    hp: "25 HP",
  },
  {
    id: "2",
    name: "Chaff Cutter",
    brand: "New Vishwakarma Cutter",
    category: "Cutter",
    model: "Tokri Thresher",
    price: 45000,
    image:
      "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400&auto=format&fit=crop&q=80",
    rating: 4.2,
    location: "Haryana, India",
    year: "2024",
    hp: "15 HP",
  },
  {
    id: "3",
    name: "Maize Sheller",
    brand: "SB Marketing",
    category: "Sheller",
    model: "P-885 Reinforce Punjab",
    price: 65000,
    image:
      "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400&auto=format&fit=crop&q=80",
    rating: 4.7,
    location: "Punjab, India",
    year: "2024",
    hp: "20 HP",
  },
  {
    id: "4",
    name: "Peanut Thresher",
    brand: "Reinforce P940 Ground Nut",
    category: "Thresher",
    model: "Back Tokri Thresher Machine",
    price: 72000,
    image:
      "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400&auto=format&fit=crop&q=80",
    rating: 4.3,
    location: "Gujarat, India",
    year: "2024",
    hp: "22 HP",
  },
  {
    id: "5",
    name: "Paddy Thresher",
    brand: "SB Marketing",
    category: "Thresher",
    model: "P-80 Reinforce Punjab Paddy",
    price: 98000,
    image:
      "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400&auto=format&fit=crop&q=80",
    rating: 4.8,
    location: "Punjab, India",
    year: "2024",
    hp: "30 HP",
  },
  {
    id: "6",
    name: "Seed Drill",
    brand: "SB Marketing",
    category: "Drill",
    model: "Multi Crop Hopper Model",
    price: 55000,
    image:
      "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400&auto=format&fit=crop&q=80",
    rating: 4.4,
    location: "Uttar Pradesh, India",
    year: "2024",
    hp: "18 HP",
  },
  {
    id: "7",
    name: "Farming Implements",
    brand: "Shree Nath Trade Link",
    category: "Implements",
    model: "Complete Farming Kit",
    price: 120000,
    image:
      "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400&auto=format&fit=crop&q=80",
    rating: 4.6,
    location: "Rajasthan, India",
    year: "2024",
    hp: "35 HP",
  },
  {
    id: "8",
    name: "Ground Nut Thresher",
    brand: "Reinforce P940",
    category: "Thresher",
    model: "Ground Nut Back Tokri",
    price: 78000,
    image:
      "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400&auto=format&fit=crop&q=80",
    rating: 4.1,
    location: "Gujarat, India",
    year: "2024",
    hp: "24 HP",
  },
];

// ===== CATEGORY OPTIONS =====
const CATEGORIES = [
  "All Categories",
  "Thresher",
  "Cutter",
  "Sheller",
  "Drill",
  "Implements",
];

const BRANDS = [
  "All Brands",
  "Shree Nath Trade Link",
  "New Vishwakarma Cutter",
  "SB Marketing",
  "Reinforce P940 Ground Nut",
  "Reinforce P940",
];

const HP_OPTIONS = [
  "All HP",
  "15 HP",
  "18 HP",
  "20 HP",
  "22 HP",
  "24 HP",
  "25 HP",
  "30 HP",
  "35 HP",
];

// ===== INDIA STATES (static, computed once) =====
const INDIA_STATES = State.getStatesOfCountry("IN").map((s) => ({
  value: s.isoCode,
  label: s.name,
}));

// ===== react-select styling to match the form =====
const selectStyles = {
  control: (base, state) => ({
    ...base,
    borderRadius: "0.75rem",
    borderColor: state.isFocused ? "#15803d" : "#e5e7eb",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(21,128,61,0.4)" : "none",
    backgroundColor: "#f9fafb",
    minHeight: "42px",
    "&:hover": { backgroundColor: "#fff" },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#dcfce7"
      : state.isFocused
      ? "#f0fdf4"
      : "#fff",
    color: "#374151",
    cursor: "pointer",
  }),
  menu: (base) => ({ ...base, zIndex: 9999 }),
};

// ===== MAIN COMPONENT =====
const Equipments = () => {
  // ===== STATE =====
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedBrand, setSelectedBrand] = useState("All Brands");
  const [selectedHp, setSelectedHp] = useState("All HP");
  const [priceRange, setPriceRange] = useState([0, 150000]);
  const [sortBy, setSortBy] = useState("popular");
  const [wishlist, setWishlist] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [enquiryProduct, setEnquiryProduct] = useState(null);
  const [enquiryForm, setEnquiryForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    state: null,
    city: null,
    address: "",
    pincode: "",
  });

  // Filtered and sorted products
  const [filteredProducts, setFilteredProducts] = useState(EQUIPMENTS);

  // Max price for slider
  const maxPrice = 150000;

  // ===== FILTER LOGIC =====
  useEffect(() => {
    let result = [...EQUIPMENTS];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.brand.toLowerCase().includes(query) ||
          item.model.toLowerCase().includes(query),
      );
    }

    // Category filter
    if (selectedCategory !== "All Categories") {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // Brand filter
    if (selectedBrand !== "All Brands") {
      result = result.filter((item) => item.brand === selectedBrand);
    }

    // HP filter
    if (selectedHp !== "All HP") {
      result = result.filter((item) => item.hp === selectedHp);
    }

    // Price filter
    result = result.filter(
      (item) => item.price >= priceRange[0] && item.price <= priceRange[1],
    );

    // Sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "popular":
      default:
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    setFilteredProducts(result);
  }, [
    searchQuery,
    selectedCategory,
    selectedBrand,
    selectedHp,
    priceRange,
    sortBy,
  ]);

  // ===== WISHLIST TOGGLE =====
  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // ===== CLEAR FILTERS =====
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All Categories");
    setSelectedBrand("All Brands");
    setSelectedHp("All HP");
    setPriceRange([0, maxPrice]);
    setSortBy("popular");
  };

  // ===== ENQUIRY MODAL HANDLERS =====
  const handleEnquiryChange = (field, value) => {
    setEnquiryForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "state") next.city = null;
      return next;
    });
  };

  const closeEnquiryModal = () => {
    setEnquiryProduct(null);
    setEnquiryForm({
      fullName: "",
      email: "",
      mobile: "",
      state: null,
      city: null,
      address: "",
      pincode: "",
    });
  };

  const submitEnquiry = (e) => {
    e.preventDefault();
    if (!enquiryForm.state || !enquiryForm.city) {
      alert("Please select both state and city.");
      return;
    }
    console.log("Enquiry submitted:", {
      product: enquiryProduct?.id,
      ...enquiryForm,
      state: enquiryForm.state.label,
      city: enquiryForm.city.label,
    });
    closeEnquiryModal();
  };

  // Cities for the currently selected state (recomputes only when state changes)
  const cityOptions = enquiryForm.state
    ? City.getCitiesOfState("IN", enquiryForm.state.value).map((c) => ({
        value: c.name,
        label: c.name,
      }))
    : [];

  // ===== PRODUCT CARD COMPONENT =====
  const EquipmentCard = ({ equipment }) => {
    const isWishlisted = wishlist.includes(equipment.id);

    return (
      <div className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
        {/* Image */}
        <Link
          to={`/equipment/${equipment.id}`}
          className="relative  h-32 sm:h-48 overflow-hidden bg-gray-100 block"
        >
          <img
            src={equipment.image}
            alt={equipment.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(equipment.id);
            }}
            className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow hover:bg-gray-100 cursor-pointer transition-transform hover:scale-110"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                isWishlisted
                  ? "text-red-500 fill-red-500"
                  : "text-gray-500 hover:text-red-500"
              }`}
            />
          </button>
        </Link>

        {/* Content */}
        <div className="p-3 sm:p-4  flex flex-col flex-1">
          <div className="flex items-center justify-between mb-1">
            <Link
              to={`/equipment/${equipment.id}`}
              className="text-xs font-semibold text-green-700 hover:text-green-800 transition-colors"
            >
              {equipment.brand}
            </Link>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{equipment.location}</span>
            </div>
          </div>

          <Link
            to={`/equipment/${equipment.id}`}
            className="text-sm font-bold text-gray-900 mb-1 line-clamp-1 hover:text-green-700 transition-colors"
          >
            {equipment.name}
          </Link>

          <p className="text-xs text-gray-500 mb-2 line-clamp-1">
            {equipment.model}
          </p>

          {/* Enquiry Button - Always Visible */}
          <div className="pt-2 border-t border-gray-100">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setEnquiryProduct(equipment);
              }}
              className="w-full bg-green-700 hover:bg-green-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              Enquiry Now
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ===== RENDER =====
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ===== HERO SECTION ===== */}
      <div className="relative text-white min-h-[400px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1920&auto=format&fit=crop&q=90"
            alt="Farming Equipment"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 via-gray-900/40 to-gray-900/20" />
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20 py-12 relative z-10 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-full mb-4 shadow-lg">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-semibold">
                Premium Agricultural Equipment
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 leading-tight drop-shadow-lg">
              Find Your Perfect{" "}
              <span className="text-green-300">Farm Equipment</span>
            </h1>
            <p className="text-white/90 text-base md:text-lg mb-6 max-w-xl drop-shadow-md">
              Explore top-quality threshers, cutters, shellers, and more from
              trusted brands across India.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#products"
                className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm shadow-lg hover:shadow-xl"
              >
                <ShoppingBag className="h-4 w-4" /> Browse Products
              </a>
              <a
                href="tel:+911234567890"
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm border border-white/30"
              >
                <Phone className="h-4 w-4" /> Call Expert
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ===== FILTER & PRODUCTS SECTION ===== */}
      <div
        id="products"
        className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20 py-8 lg:py-12"
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* ===== LEFT SIDE - FILTERS ===== */}
          {/* ===== LEFT SIDE - FILTERS ===== */}
          <div className="lg:col-span-1">
            {/* Mobile Filter Trigger Button */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden w-full flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold px-4 py-3 rounded-xl mb-4 shadow-lg transition-colors cursor-pointer"
            >
              <Filter className="h-5 w-5" />
              Filters
            </button>

            {/* Mobile Backdrop */}
            {mobileFiltersOpen && (
              <div
                className="lg:hidden fixed inset-0 bg-black/50 z-[9998]"
                onClick={() => setMobileFiltersOpen(false)}
              />
            )}

            {/* Filter Panel — drawer on mobile, static sidebar on desktop */}
            <div
              className={`bg-white shadow-lg border border-gray-100 overflow-y-auto
      fixed top-0 left-0 h-full w-[85%] max-w-xs z-[9999] transition-transform duration-300 ease-in-out
      ${mobileFiltersOpen ? "translate-x-0" : "-translate-x-full"}
      lg:static lg:translate-x-0 lg:h-auto lg:w-auto lg:max-w-none lg:z-auto lg:rounded-2xl lg:sticky lg:top-24`}
            >
              {/* Filter Header */}
              <div className="bg-green-700 px-5 py-4 lg:rounded-t-2xl flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-white" />
                  <h3 className="font-bold text-white text-base">Filters</h3>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={clearFilters}
                    className="text-white/80 hover:text-white text-xs font-medium hover:underline cursor-pointer"
                  >
                    Clear all
                  </button>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="lg:hidden text-white hover:text-white/80 cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Filter Body — unchanged content below */}
              <div className="p-5 space-y-4">
                {/* Search */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search equipment..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none transition-all bg-gray-50 hover:bg-white"
                    />
                  </div>
                </div>

                {/* Category - Headless UI Listbox */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Category
                  </label>
                  <Listbox
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                  >
                    <div className="relative">
                      <Listbox.Button className="w-full pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm text-left focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none bg-gray-50 hover:bg-white cursor-pointer">
                        <span
                          className={
                            selectedCategory !== "All Categories"
                              ? "text-gray-900"
                              : "text-gray-400"
                          }
                        >
                          {selectedCategory}
                        </span>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </Listbox.Button>
                      <Listbox.Options className="absolute z-[9999] mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto py-1 text-sm">
                        {CATEGORIES.map((category) => (
                          <Listbox.Option
                            key={category}
                            value={category}
                            className={({ active, selected }) =>
                              `cursor-pointer px-4 py-2.5 flex items-center justify-between ${
                                active
                                  ? "bg-green-50 text-green-700"
                                  : "text-gray-700"
                              } ${selected ? "bg-green-100 font-medium" : ""}`
                            }
                          >
                            {({ selected }) => (
                              <>
                                <span>{category}</span>
                                {selected && (
                                  <Check className="h-4 w-4 text-green-600" />
                                )}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </div>
                  </Listbox>
                </div>

                {/* Brand - Headless UI Listbox */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Brand
                  </label>
                  <Listbox value={selectedBrand} onChange={setSelectedBrand}>
                    <div className="relative">
                      <Listbox.Button className="w-full pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm text-left focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none bg-gray-50 hover:bg-white cursor-pointer">
                        <span
                          className={
                            selectedBrand !== "All Brands"
                              ? "text-gray-900"
                              : "text-gray-400"
                          }
                        >
                          {selectedBrand}
                        </span>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </Listbox.Button>
                      <Listbox.Options className="absolute z-[9999] mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto py-1 text-sm">
                        {BRANDS.map((brand) => (
                          <Listbox.Option
                            key={brand}
                            value={brand}
                            className={({ active, selected }) =>
                              `cursor-pointer px-4 py-2.5 flex items-center justify-between ${
                                active
                                  ? "bg-green-50 text-green-700"
                                  : "text-gray-700"
                              } ${selected ? "bg-green-100 font-medium" : ""}`
                            }
                          >
                            {({ selected }) => (
                              <>
                                <span>{brand}</span>
                                {selected && (
                                  <Check className="h-4 w-4 text-green-600" />
                                )}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </div>
                  </Listbox>
                </div>

                {/* HP - Headless UI Listbox */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Horse Power
                  </label>
                  <Listbox value={selectedHp} onChange={setSelectedHp}>
                    <div className="relative">
                      <Listbox.Button className="w-full pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm text-left focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none bg-gray-50 hover:bg-white cursor-pointer">
                        <span
                          className={
                            selectedHp !== "All HP"
                              ? "text-gray-900"
                              : "text-gray-400"
                          }
                        >
                          {selectedHp}
                        </span>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </Listbox.Button>
                      <Listbox.Options className="absolute z-[9999] mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto py-1 text-sm">
                        {HP_OPTIONS.map((hp) => (
                          <Listbox.Option
                            key={hp}
                            value={hp}
                            className={({ active, selected }) =>
                              `cursor-pointer px-4 py-2.5 flex items-center justify-between ${
                                active
                                  ? "bg-green-50 text-green-700"
                                  : "text-gray-700"
                              } ${selected ? "bg-green-100 font-medium" : ""}`
                            }
                          >
                            {({ selected }) => (
                              <>
                                <span>{hp}</span>
                                {selected && (
                                  <Check className="h-4 w-4 text-green-600" />
                                )}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </div>
                  </Listbox>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Price Range (₹)
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max={maxPrice}
                      step="10000"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-700"
                    />
                    <div className="flex justify-between gap-2">
                      <div className="flex-1 bg-gray-50 rounded-lg px-3 py-1.5 text-center border border-gray-200">
                        <p className="text-[10px] text-gray-500">Min</p>
                        <p className="text-xs font-semibold text-gray-900">
                          ₹{priceRange[0].toLocaleString()}
                        </p>
                      </div>
                      <div className="flex-1 bg-gray-50 rounded-lg px-3 py-1.5 text-center border border-gray-200">
                        <p className="text-[10px] text-gray-500">Max</p>
                        <p className="text-xs font-semibold text-gray-900">
                          ₹{priceRange[1].toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Results Count */}
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    Showing{" "}
                    <span className="font-bold text-green-700">
                      {filteredProducts.length}
                    </span>{" "}
                    products
                  </p>
                </div>

                {/* Mobile Apply Button */}
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="lg:hidden w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-xl transition-colors cursor-pointer"
                >
                  Show {filteredProducts.length} Results
                </button>
              </div>
            </div>
          </div>

          {/* ===== RIGHT SIDE - PRODUCT GRID ===== */}
          <div className="lg:col-span-3">
            {/* Sort Bar */}
            <div className="flex items-center justify-between flex-wrap gap-3 mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-green-700" />
                <span className="text-sm font-semibold text-gray-700">
                  {filteredProducts.length} Products Found
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-600">
                  Sort:
                </span>
                <Listbox value={sortBy} onChange={setSortBy}>
                  <div className="relative">
                    <Listbox.Button className="px-4 py-2 border border-gray-200 bg-white text-gray-700 rounded-xl text-sm text-left focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none cursor-pointer font-medium flex items-center justify-between gap-2 min-w-[160px]">
                      <span>
                        {sortBy === "popular"
                          ? "Most Popular"
                          : sortBy === "price-low"
                          ? "Price: Low to High"
                          : sortBy === "price-high"
                          ? "Price: High to Low"
                          : "Highest Rated"}
                      </span>
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </Listbox.Button>
                    <Listbox.Options className="absolute z-[9999] mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg py-1 text-sm">
                      {[
                        { value: "popular", label: "Most Popular" },
                        { value: "price-low", label: "Price: Low to High" },
                        { value: "price-high", label: "Price: High to Low" },
                        { value: "rating", label: "Highest Rated" },
                      ].map((option) => (
                        <Listbox.Option
                          key={option.value}
                          value={option.value}
                          className={({ active, selected }) =>
                            `cursor-pointer px-4 py-2.5 flex items-center justify-between ${
                              active
                                ? "bg-green-50 text-green-700"
                                : "text-gray-700"
                            } ${selected ? "bg-green-100 font-medium" : ""}`
                          }
                        >
                          {({ selected }) => (
                            <>
                              <span>{option.label}</span>
                              {selected && (
                                <Check className="h-4 w-4 text-green-600" />
                              )}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                </Listbox>
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                {filteredProducts.map((equipment) => (
                  <EquipmentCard key={equipment.id} equipment={equipment} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== TRUST BADGES ===== */}
      <div className="bg-white border-t border-gray-100">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20 py-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                icon: BadgeCheck,
                title: "100% Genuine",
                desc: "Authorized Dealers",
              },
              { icon: Shield, title: "Full Warranty", desc: "Up to 5 Years" },
              { icon: Clock, title: "Fast Delivery", desc: "Within 7 Days" },
              {
                icon: Sparkles,
                title: "Best Price",
                desc: "Price Match Guarantee",
              },
            ].map((badge, idx) => (
              <div
                key={idx}
                className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-600 to-green-700"></div>
                <div className="p-5 text-center">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-green-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <badge.icon className="h-7 w-7 text-green-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-base mb-1">
                    {badge.title}
                  </h3>
                  <p className="text-xs text-gray-500">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== ENQUIRY MODAL ===== */}
      {enquiryProduct && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
          onClick={closeEnquiryModal}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 bg-green-600 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-white">Enquiry Form</h3>
                <p className="text-xs text-white mt-0.5">
                  {enquiryProduct.name}
                </p>
              </div>
              <button
                onClick={closeEnquiryModal}
                className="p-1.5 rounded-full hover:bg-white text-white hover:text-green-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={submitEnquiry} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={enquiryForm.fullName}
                  onChange={(e) =>
                    handleEnquiryChange("fullName", e.target.value)
                  }
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 bg-gray-50 hover:bg-white"
                  placeholder="Enter full name"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Email <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={enquiryForm.email}
                    onChange={(e) =>
                      handleEnquiryChange("email", e.target.value)
                    }
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 bg-gray-50 hover:bg-white"
                    placeholder="Enter email"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Mobile Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    value={enquiryForm.mobile}
                    onChange={(e) =>
                      handleEnquiryChange("mobile", e.target.value)
                    }
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 bg-gray-50 hover:bg-white"
                    placeholder="Mobile number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    State <span className="text-red-600">*</span>
                  </label>
                  <Select
                    options={INDIA_STATES}
                    value={enquiryForm.state}
                    onChange={(option) => handleEnquiryChange("state", option)}
                    placeholder="Select state..."
                    isSearchable
                    classNamePrefix="rs"
                    styles={selectStyles}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    City <span className="text-red-600">*</span>
                  </label>
                  <Select
                    options={cityOptions}
                    value={enquiryForm.city}
                    onChange={(option) => handleEnquiryChange("city", option)}
                    placeholder="Select city..."
                    isSearchable
                    isDisabled={!enquiryForm.state}
                    classNamePrefix="rs"
                    styles={selectStyles}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Address
                </label>
                <input
                  type="text"
                  value={enquiryForm.address}
                  onChange={(e) =>
                    handleEnquiryChange("address", e.target.value)
                  }
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 bg-gray-50 hover:bg-white"
                  placeholder="Address "
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Pincode
                </label>
                <input
                  type="text"
                  pattern="[0-9]{6}"
                  value={enquiryForm.pincode}
                  onChange={(e) =>
                    handleEnquiryChange("pincode", e.target.value)
                  }
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 bg-gray-50 hover:bg-white"
                  placeholder="Enter Pincode "
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeEnquiryModal}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-green-700 hover:bg-green-800 cursor-pointer"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Equipments;
