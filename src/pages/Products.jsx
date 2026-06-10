import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Listbox, RadioGroup } from "@headlessui/react";
import {
  Search,
  ShoppingCart,
  Heart,
  Star,
  Filter,
  ChevronDown,
  Grid,
  List,
  Truck,
  Shield,
  RotateCcw,
  ChevronRight,
  X,
  SlidersHorizontal,
  Check,
  Minus,
  Plus,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import {
  showCartAddedToast,
  showWishlistAddedToast,
  showWishlistRemovedToast,
  showLoginRequiredToast,
} from "../utils/toast.jsx";

const Products = () => {
  const { addToCart, cart, updateQuantity } = useCart();
  const { isAuthenticated } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  const { category, maker } = useParams();
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState(category || "all");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);
  const [showVehicleSearch, setShowVehicleSearch] = useState(false);
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);

  const [appliedCategory, setAppliedCategory] = useState("all");
  const [appliedBrands, setAppliedBrands] = useState([]);
  const [appliedPriceRange, setAppliedPriceRange] = useState([0, 50000]);

  useEffect(() => {
    if (showFilters) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [showFilters]);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showLoginRequiredToast();
      navigate("/login?redirect=/products");
      return;
    }
    addToCart(product, 1);
  };

  const toggleBrand = (brandId) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId)
        ? prev.filter((b) => b !== brandId)
        : [...prev, brandId],
    );
  };

  const applyFilters = () => {
    setAppliedCategory(selectedCategory);
    setAppliedBrands(selectedBrands);
    setAppliedPriceRange(priceRange);
    setShowFilters(false);
  };

  const clearAllFilters = () => {
    setSelectedCategory("all");
    setSelectedBrands([]);
    setPriceRange([0, 50000]);
    setInStockOnly(false);
    setAppliedCategory("all");
    setAppliedBrands([]);
    setAppliedPriceRange([0, 50000]);
  };

  const getCartQuantity = (productId) => {
    const cartItem = cart.find((item) => item.id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleIncreaseQuantity = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleDecreaseQuantity = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    const currentQty = getCartQuantity(product.id);
    if (currentQty <= 1) {
      // Remove from cart
      cart.filter((item) => item.id !== product.id);
    } else {
      updateQuantity(product.id, currentQty - 1);
    }
  };

  const categories = [
    { id: "all", name: "All Parts", count: 2456 },
    { id: "engine", name: "Engine Parts", count: 856 },
    { id: "brakes", name: "Brakes & Suspension", count: 432 },
    { id: "electrical", name: "Electrical & Lighting", count: 567 },
    { id: "filters", name: "Filters", count: 321 },
    { id: "transmission", name: "Transmission", count: 234 },
    { id: "body", name: "Body Parts", count: 445 },
    { id: "interior", name: "Interior Accessories", count: 298 },
  ];

  const brands = [
    { id: "all", name: "All Brands" },
    { id: "bosch", name: "Bosch" },
    { id: "brembo", name: "Brembo" },
    { id: "ngk", name: "NGK" },
    { id: "kyb", name: "KYB" },
    { id: "valeo", name: "Valeo" },
    { id: "mann", name: "Mann-Filter" },
    { id: "denso", name: "Denso" },
  ];

  const products = [
    {
      id: 1,
      name: "Bosch Engine Oil Filter - F002H21088",
      brand: "Bosch",
      category: "Filters",
      price: 1499,
      oldPrice: 2499,
      discount: 40,
      rating: 4.8,
      reviews: 234,
      stock: 15,
      image:
        "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=400&fit=crop&auto=format",
      partNumber: "F002H21088",
      compatibility: "Honda City, Jazz, Amaze",
      warranty: "6 Months",
      shipping: "Free",
      inStock: true,
    },
    {
      id: 2,
      name: "Brembo Front Brake Pads Set - P85139N",
      brand: "Brembo",
      category: "Brakes",
      price: 3899,
      oldPrice: 5999,
      discount: 35,
      rating: 4.9,
      reviews: 567,
      stock: 8,
      image:
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=400&fit=crop&auto=format",
      partNumber: "P85139N",
      compatibility: "Maruti Swift, Baleno, Dzire",
      warranty: "1 Year",
      shipping: "Free",
      inStock: true,
    },
    {
      id: 3,
      name: "NGK Iridium Spark Plugs - BKR6EIX-4 (Pack of 4)",
      brand: "NGK",
      category: "Electrical",
      price: 999,
      oldPrice: 1999,
      discount: 50,
      rating: 4.7,
      reviews: 890,
      stock: 22,
      image:
        "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=400&h=400&fit=crop&auto=format",
      partNumber: "BKR6EIX-4",
      compatibility: "Hyundai i20, Creta, Verna",
      warranty: "3 Months",
      shipping: "Free",
      inStock: true,
    },
    {
      id: 4,
      name: "KYB Excel-G Shock Absorber Front - 3348016",
      brand: "KYB",
      category: "Suspension",
      price: 4499,
      oldPrice: 5999,
      discount: 25,
      rating: 4.6,
      reviews: 156,
      stock: 5,
      image:
        "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=400&h=400&fit=crop&auto=format",
      partNumber: "3348016",
      compatibility: "Toyota Innova, Fortuner",
      warranty: "1 Year",
      shipping: "Free",
      inStock: true,
    },
    {
      id: 5,
      name: "Valeo Complete Clutch Kit - 835046",
      brand: "Valeo",
      category: "Transmission",
      price: 6299,
      oldPrice: 8999,
      discount: 30,
      rating: 4.8,
      reviews: 423,
      stock: 12,
      image:
        "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=400&fit=crop&auto=format",
      partNumber: "835046",
      compatibility: "Maruti Swift, Dzire, Ertiga",
      warranty: "1 Year",
      shipping: "Free",
      inStock: true,
    },
    {
      id: 6,
      name: "Mann-Filter Air Filter Element - C30110",
      brand: "Mann-Filter",
      category: "Filters",
      price: 749,
      oldPrice: 1349,
      discount: 45,
      rating: 4.5,
      reviews: 678,
      stock: 30,
      image:
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=400&fit=crop&auto=format",
      partNumber: "C30110",
      compatibility: "Volkswagen Polo, Vento, Rapid",
      warranty: "6 Months",
      shipping: "Free",
      inStock: true,
    },
    {
      id: 7,
      name: "Denso AC Compressor - 447200-9771",
      brand: "Denso",
      category: "Electrical",
      price: 8999,
      oldPrice: 12499,
      discount: 28,
      rating: 4.7,
      reviews: 189,
      stock: 7,
      image:
        "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=400&h=400&fit=crop&auto=format",
      partNumber: "447200-9771",
      compatibility: "Honda City 2014-2020",
      warranty: "6 Months",
      shipping: "Free",
      inStock: true,
    },
    {
      id: 8,
      name: "Brembo Rear Brake Disc Rotor - 09.9772.10",
      brand: "Brembo",
      category: "Brakes",
      price: 5499,
      oldPrice: 7999,
      discount: 31,
      rating: 4.8,
      reviews: 312,
      stock: 18,
      image:
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=400&fit=crop&auto=format",
      partNumber: "09.9772.10",
      compatibility: "BMW 3 Series, 5 Series",
      warranty: "1 Year",
      shipping: "Free",
      inStock: false,
    },
    {
      id: 9,
      name: "Bosch Wiper Blades Set - AeroTwin A863S",
      brand: "Bosch",
      category: "Body Parts",
      price: 899,
      oldPrice: 1299,
      discount: 31,
      rating: 4.4,
      reviews: 445,
      stock: 50,
      image:
        "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=400&fit=crop&auto=format",
      partNumber: "A863S",
      compatibility: "Universal Fit",
      warranty: "3 Months",
      shipping: "Free",
      inStock: true,
    },
    {
      id: 10,
      name: "NGK Oxygen Sensor - OZA660-EE2",
      brand: "NGK",
      category: "Engine Parts",
      price: 2499,
      oldPrice: 3599,
      discount: 31,
      rating: 4.6,
      reviews: 267,
      stock: 14,
      image:
        "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=400&h=400&fit=crop&auto=format",
      partNumber: "OZA660-EE2",
      compatibility: "Maruti Suzuki Swift, Baleno",
      warranty: "6 Months",
      shipping: "Free",
      inStock: true,
    },
    {
      id: 11,
      name: "Valeo Alternator - 439524",
      brand: "Valeo",
      category: "Electrical",
      price: 7599,
      oldPrice: 10999,
      discount: 31,
      rating: 4.5,
      reviews: 134,
      stock: 6,
      image:
        "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=400&fit=crop&auto=format",
      partNumber: "439524",
      compatibility: "Toyota Corolla, Camry",
      warranty: "1 Year",
      shipping: "Free",
      inStock: true,
    },
    {
      id: 12,
      name: "Mann-Filter Cabin Filter - CUK26010",
      brand: "Mann-Filter",
      category: "Filters",
      price: 649,
      oldPrice: 999,
      discount: 35,
      rating: 4.3,
      reviews: 523,
      stock: 40,
      image:
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=400&fit=crop&auto=format",
      partNumber: "CUK26010",
      compatibility: "Hyundai Creta, Verna, i20",
      warranty: "3 Months",
      shipping: "Free",
      inStock: true,
    },
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const trustBadges = [
    { icon: Truck, title: "Free Shipping", desc: "Orders above ₹999" },
    { icon: Shield, title: "100% Genuine", desc: "Verified sellers" },
    { icon: RotateCcw, title: "10-Day Returns", desc: "Easy replacement" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 lg:mt-4">
      {/* Top Trust Bar */}
      <div className="hidden md:block bg-white border-b">
        <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46">
          <div className="flex items-center justify-between py-2 text-sm">
            {trustBadges.map((badge, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-gray-600"
              >
                <badge.icon className="h-4 w-4 text-gray-400" />
                <span className="font-medium">{badge.title}</span>
                <span className="text-gray-400">• {badge.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Header with Vehicle Search */}
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4 flex-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight hidden sm:block">
                All{" "}
                <span className="text-transparent bg-clip-text bg-green-600">
                  {" "}
                  Products{" "}
                </span>
              </h1>
              <button
                onClick={() => setShowVehicleSearch(!showVehicleSearch)}
                className="flex items-center cursor-pointer gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Search by Vehicle</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${showVehicleSearch ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <Listbox value={sortBy} onChange={setSortBy}>
                <div className="relative">
                  <Listbox.Button className="cursor-pointer border border-gray-300 rounded-lg px-3 py-2 text-sm text-left focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white min-w-[160px] flex items-center justify-between gap-2">
                    <span>
                      {sortBy === "popular"
                        ? "Most Popular"
                        : sortBy === "price-low"
                          ? "Price: Low to High"
                          : sortBy === "price-high"
                            ? "Price: High to Low"
                            : sortBy === "discount"
                              ? "Biggest Discount"
                              : "Highest Rated"}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </Listbox.Button>
                  <Listbox.Options className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1 text-sm">
                    {[
                      { value: "popular", label: "Most Popular" },
                      { value: "price-low", label: "Price: Low to High" },
                      { value: "price-high", label: "Price: High to Low" },
                      { value: "discount", label: "Biggest Discount" },
                      { value: "rating", label: "Highest Rated" },
                    ].map((option) => (
                      <Listbox.Option
                        key={option.value}
                        value={option.value}
                        className={({ active, selected }) =>
                          `cursor-pointer select-none px-3 py-2 ${active ? "bg-green-50 text-green-600" : "text-gray-700"} ${selected ? "bg-green-100 font-medium" : ""}`
                        }
                      >
                        {option.label}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>

              <div className="hidden sm:flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 cursor-pointer ${viewMode === "grid" ? "bg-gray-900 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 cursor-pointer ${viewMode === "list" ? "bg-gray-900 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {showVehicleSearch && (
            <div className="border-t py-4">
              <div className="grid sm:grid-cols-4 gap-4">
                <Listbox value={selectedMake} onChange={setSelectedMake}>
                  <div className="relative">
                    <Listbox.Button className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-left focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white flex items-center justify-between">
                      <span
                        className={
                          selectedMake ? "text-gray-900" : "text-gray-400"
                        }
                      >
                        {selectedMake || "Select Make"}
                      </span>
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </Listbox.Button>
                    <Listbox.Options className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto py-1 text-sm">
                      {[
                        "Maruti Suzuki",
                        "Hyundai",
                        "Tata",
                        "Mahindra",
                        "Honda",
                        "Toyota",
                      ].map((make) => (
                        <Listbox.Option
                          key={make}
                          value={make}
                          className={({ active, selected }) =>
                            `cursor-pointer select-none px-4 py-2.5 ${active ? "bg-green-50 text-green-600" : "text-gray-700"} ${selected ? "bg-green-100 font-medium" : ""}`
                          }
                        >
                          {make}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                </Listbox>
                <Listbox value={selectedModel} onChange={setSelectedModel}>
                  <div className="relative">
                    <Listbox.Button className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-left focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white flex items-center justify-between">
                      <span
                        className={
                          selectedModel ? "text-gray-900" : "text-gray-400"
                        }
                      >
                        {selectedModel || "Select Model"}
                      </span>
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </Listbox.Button>
                    <Listbox.Options className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1 text-sm">
                      {["Swift", "Baleno", "Dzire"].map((model) => (
                        <Listbox.Option
                          key={model}
                          value={model}
                          className={({ active, selected }) =>
                            `cursor-pointer select-none px-4 py-2.5 ${active ? "bg-green-50 text-green-600" : "text-gray-700"} ${selected ? "bg-green-100 font-medium" : ""}`
                          }
                        >
                          {model}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                </Listbox>
                <Listbox value={selectedYear} onChange={setSelectedYear}>
                  <div className="relative">
                    <Listbox.Button className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-left focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white flex items-center justify-between">
                      <span
                        className={
                          selectedYear ? "text-gray-900" : "text-gray-400"
                        }
                      >
                        {selectedYear || "Select Year"}
                      </span>
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </Listbox.Button>
                    <Listbox.Options className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1 text-sm">
                      {["2023", "2022", "2021", "2020"].map((year) => (
                        <Listbox.Option
                          key={year}
                          value={year}
                          className={({ active, selected }) =>
                            `cursor-pointer select-none px-4 py-2.5 ${active ? "bg-green-50 text-green-600" : "text-gray-700"} ${selected ? "bg-green-100 font-medium" : ""}`
                          }
                        >
                          {year}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                </Listbox>
                <button className="cursor-pointer bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors text-sm">
                  Find Parts
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 py-6">
        <div className="flex gap-8 items-start">
          {/* Desktop Sidebar Filters */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-28 bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-6">
              {/* Categories */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-lg text-sm transition-colors border ${
                        selectedCategory === cat.id
                          ? "bg-green-50 text-green-600 font-medium border-green-200"
                          : "text-gray-600 hover:bg-gray-50 border-transparent"
                      }`}
                    >
                      {cat.name}
                      <span className="text-xs text-gray-400">
                        ({cat.count})
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Brands</h3>
                <div className="space-y-1">
                  {brands.map((brand) => (
                    <button
                      key={brand.id}
                      onClick={() => toggleBrand(brand.id)}
                      className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-sm transition-colors border ${
                        selectedBrands.includes(brand.id)
                          ? "bg-green-50 text-green-600 font-medium border-green-200"
                          : "text-gray-600 hover:bg-gray-50 border-transparent"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                          selectedBrands.includes(brand.id)
                            ? "bg-green-600 border-green-600"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedBrands.includes(brand.id) && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      {brand.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Price Range
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([Number(e.target.value), priceRange[1]])
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], Number(e.target.value)])
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <button
                    onClick={applyFilters}
                    className="w-full cursor-pointer bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 rounded-lg transition-all"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Availability */}
              {/* Availability - Headless UI styled checkbox */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Availability
                </h3>
                <label
                  onClick={() => setInStockOnly(!inStockOnly)}
                  className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer"
                >
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                      inStockOnly
                        ? "bg-green-600 border-green-600"
                        : "border-gray-300"
                    }`}
                  >
                    {inStockOnly && <Check className="h-3 w-3 text-white" />}
                  </div>
                  In Stock Only
                </label>
              </div>

              {/* Clear Filters */}
              <button
                onClick={clearAllFilters}
                className="text-sm cursor-pointer text-green-600 hover:text-green-700 font-medium"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Products Grid - COMPACT VERSION */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">12</span>{" "}
                of <span className="font-semibold text-gray-900">2,456</span>{" "}
                products
              </p>
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium shadow-sm"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filter</span>
              </button>
            </div>

            {/* Compact Grid with reduced gaps */}
            {/* PHONE VIEW - 2 cards per row */}
            <div className="sm:hidden grid grid-cols-2 gap-3">
              {products.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all group flex flex-col"
                >
                  {/* Product Image - Compact */}
                  <div className="relative bg-gray-100 overflow-hidden flex-shrink-0 aspect-[4/3] rounded-t-lg w-full">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-1.5 left-1.5 bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      -{product.discount}%
                    </span>
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="bg-white text-gray-900 font-semibold px-2 py-1 rounded-md text-[10px]">
                          Out of Stock
                        </span>
                      </div>
                    )}
                    <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!isAuthenticated) {
                            showLoginRequiredToast();
                            navigate("/login?redirect=/products");
                            return;
                          }
                          toggleWishlist(product);
                          if (isInWishlist(product.id)) {
                            showWishlistRemovedToast(product.name);
                          } else {
                            showWishlistAddedToast(product.name);
                          }
                        }}
                        className={`p-1 rounded-md shadow-md transition-colors ${isInWishlist(product.id) ? "bg-green-50 hover:bg-green-100" : "bg-white hover:bg-gray-50"}`}
                      >
                        <Heart
                          className={`h-3 w-3 cursor-pointer transition-colors ${isInWishlist(product.id) ? "text-green-500 fill-green-500" : "text-gray-600"}`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Product Info - Compact */}
                  <div className="flex flex-col flex-1 p-2">
                    <span className="text-[10px] font-medium text-gray-500 truncate mb-0.5">
                      {product.brand}
                    </span>

                    <h3 className="text-[11px] font-medium text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2 leading-tight mb-1 flex-1">
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-1 mb-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-[10px] text-gray-500">
                        {product.rating}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1.5 mb-1">
                      <span className="text-sm font-bold text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-[10px] text-gray-400 line-through">
                        {formatPrice(product.oldPrice)}
                      </span>
                    </div>

                    {/* Stock Status */}
                    <div className="flex items-center gap-1 text-[10px] mb-2">
                      <span
                        className={
                          product.inStock
                            ? "text-green-600 font-medium"
                            : "text-red-500 font-medium"
                        }
                      >
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-400 flex items-center gap-0.5">
                        <Truck className="h-2.5 w-2.5" />
                        Free
                      </span>
                    </div>

                    {/* Add to Cart Button - Below stock */}
                    {getCartQuantity(product.id) > 0 ? (
                      <div className="flex items-center justify-between border border-green-600 rounded-md w-full">
                        <button
                          onClick={(e) => handleDecreaseQuantity(e, product)}
                          className="p-1.5 hover:bg-green-50 text-green-600 cursor-pointer"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-xs font-bold text-green-600">
                          {getCartQuantity(product.id)}
                        </span>
                        <button
                          onClick={(e) => handleIncreaseQuantity(e, product)}
                          className="p-1.5 hover:bg-green-50 text-green-600 cursor-pointer"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={!product.inStock}
                        className={`cursor-pointer flex items-center justify-center gap-1.5 text-[11px] font-medium py-1.5 rounded-md transition-all w-full ${
                          product.inStock
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        <ShoppingCart className="h-3.5 w-3.5" />
                        {product.inStock ? "Add" : "Sold Out"}
                      </button>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* DESKTOP VIEW - Original grid unchanged */}
            <div
              className={`hidden sm:grid gap-3 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}
            >
              {products.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className={`bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all group ${
                    viewMode === "list"
                      ? "flex flex-row gap-3 p-3"
                      : "flex flex-col"
                  }`}
                >
                  {/* Product Image - Compact */}
                  <div
                    className={`relative bg-gray-100 overflow-hidden flex-shrink-0 ${
                      viewMode === "list"
                        ? "w-32 h-32 sm:w-36 sm:h-36 rounded-lg"
                        : "aspect-[4/3] rounded-t-lg w-full"
                    }`}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-1.5 left-1.5 bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      -{product.discount}%
                    </span>
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="bg-white text-gray-900 font-semibold px-3 py-1 rounded-md text-xs">
                          Out of Stock
                        </span>
                      </div>
                    )}
                    <div
                      className={`absolute top-1.5 right-1.5 transition-all duration-300 ${viewMode === "list" ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                    >
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!isAuthenticated) {
                            showLoginRequiredToast();
                            navigate("/login?redirect=/products");
                            return;
                          }
                          toggleWishlist(product);
                          if (isInWishlist(product.id)) {
                            showWishlistRemovedToast(product.name);
                          } else {
                            showWishlistAddedToast(product.name);
                          }
                        }}
                        className={`p-1.5 rounded-md shadow-md transition-colors ${isInWishlist(product.id) ? "bg-green-50 hover:bg-green-100" : "bg-white hover:bg-gray-50"}`}
                      >
                        <Heart
                          className={`h-3.5 w-3.5 cursor-pointer transition-colors ${isInWishlist(product.id) ? "text-green-500 fill-green-500" : "text-gray-600"}`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Product Info - Ultra Compact */}
                  <div
                    className={`flex flex-col flex-1 ${viewMode === "list" ? "justify-between min-w-0" : "p-2.5"}`}
                  >
                    {/* Brand & Rating Row */}
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="text-[11px] font-medium text-gray-500 truncate">
                        {product.brand}
                      </span>
                      <div className="flex items-center gap-0.5 flex-shrink-0">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-[11px] text-gray-500">
                          {product.rating}
                        </span>
                      </div>
                    </div>

                    {/* Product Name */}
                    <h3 className="text-[13px] font-medium text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2 leading-tight mb-1">
                      {product.name}
                    </h3>

                    {/* Spacer */}
                    <div className="flex-1"></div>

                    {/* Price, Stock & Cart */}
                    <div className={viewMode === "list" ? "mt-1.5" : "mt-2"}>
                      {getCartQuantity(product.id) > 0 ? (
                        viewMode === "list" ? (
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-baseline gap-1.5 mb-0.5">
                                <span className="text-base font-bold text-gray-900">
                                  {formatPrice(product.price)}
                                </span>
                                <span className="text-[11px] text-gray-400 line-through">
                                  {formatPrice(product.oldPrice)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-[11px] text-gray-500">
                                <span
                                  className={
                                    product.inStock
                                      ? "text-green-600 font-medium"
                                      : "text-red-500 font-medium"
                                  }
                                >
                                  {product.inStock ? "In Stock" : "Out"}
                                </span>
                                <span className="text-gray-400 flex items-center gap-0.5">
                                  <Truck className="h-2.5 w-2.5" />
                                  Free
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 border border-green-600 rounded-md ml-auto">
                              <button
                                onClick={(e) =>
                                  handleDecreaseQuantity(e, product)
                                }
                                className="p-1.5 hover:bg-green-50 text-green-600 cursor-pointer"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="text-xs font-bold text-green-600 px-2">
                                {getCartQuantity(product.id)}
                              </span>
                              <button
                                onClick={(e) =>
                                  handleIncreaseQuantity(e, product)
                                }
                                className="p-1.5 hover:bg-green-50 text-green-600 cursor-pointer"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-base font-bold text-gray-900">
                                  {formatPrice(product.price)}
                                </span>
                                <span className="text-[11px] text-gray-400 line-through">
                                  {formatPrice(product.oldPrice)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-[11px]">
                                <span
                                  className={
                                    product.inStock
                                      ? "text-green-600 font-medium"
                                      : "text-red-500 font-medium"
                                  }
                                >
                                  {product.inStock ? "In Stock" : "Out"}
                                </span>
                                <span className="text-gray-400 flex items-center gap-0.5">
                                  <Truck className="h-2.5 w-2.5" />
                                  Free
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between border border-green-600 rounded-md w-full mt-4">
                              <button
                                onClick={(e) =>
                                  handleDecreaseQuantity(e, product)
                                }
                                className="p-1.5 hover:bg-green-50 text-green-600 cursor-pointer"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="text-xs font-bold text-green-600">
                                {getCartQuantity(product.id)}
                              </span>
                              <button
                                onClick={(e) =>
                                  handleIncreaseQuantity(e, product)
                                }
                                className="p-1.5 hover:bg-green-50 text-green-600 cursor-pointer"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </>
                        )
                                           ) : (
                        <>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-base font-bold text-gray-900">{formatPrice(product.price)}</span>
                              <span className="text-[11px] text-gray-400 line-through">{formatPrice(product.oldPrice)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[11px]">
                              <span className={product.inStock ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
                                {product.inStock ? "In Stock" : "Out"}
                              </span>
                              <span className="text-gray-400 flex items-center gap-0.5">
                                <Truck className="h-2.5 w-2.5" />Free
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={(e) => handleAddToCart(e, product)}
                            disabled={!product.inStock}
                            className={`cursor-pointer flex items-center justify-center gap-1.5 text-xs font-medium py-1.5 rounded-md transition-all ${
                              viewMode === "list"
                                ? "px-4 w-auto ml-auto"
                                : "w-full mt-4"
                            } ${
                              product.inStock
                                ? "bg-green-600 hover:bg-green-700 text-white"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            <ShoppingCart className="h-3.5 w-3.5" />
                            {product.inStock ? "Add to Cart" : "Sold Out"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-6 text-center">
              <button className="bg-white border border-gray-300 hover:border-gray-400 text-gray-700 cursor-pointer font-medium px-6 py-2 rounded-lg transition-colors text-sm">
                Load More Products
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Sidebar */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-white/30 backdrop-blur-sm transition-opacity"
            onClick={() => setShowFilters(false)}
          />
          <div className="absolute inset-y-0 left-0 max-w-xs w-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col animate-slide-in">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">
                  Categories
                </h3>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex items-center justify-between w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors border ${selectedCategory === cat.id ? "bg-green-50 text-green-600 font-medium border-green-200" : "text-gray-600 hover:bg-gray-50 border-transparent"}`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-xs text-gray-400">
                        ({cat.count})
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">
                  Brands
                </h3>
                <div className="space-y-1">
                  {brands.map((brand) => (
                    <button
                      key={brand.id}
                      onClick={() => toggleBrand(brand.id)}
                      className={`flex items-center gap-2 w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors border ${selectedBrands.includes(brand.id) ? "bg-green-50 text-green-600 font-medium border-green-200" : "text-gray-600 hover:bg-gray-50 border-transparent"}`}
                    >
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${selectedBrands.includes(brand.id) ? "bg-green-600 border-green-600" : "border-gray-300"}`}
                      >
                        {selectedBrands.includes(brand.id) && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      {brand.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">
                  Price Range
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 mb-1 block">
                        Min Price
                      </label>
                      <input
                        type="number"
                        placeholder="₹0"
                        value={priceRange[0]}
                        onChange={(e) =>
                          setPriceRange([Number(e.target.value), priceRange[1]])
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 mb-1 block">
                        Max Price
                      </label>
                      <input
                        type="number"
                        placeholder="₹50,000"
                        value={priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([priceRange[0], Number(e.target.value)])
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Mobile - Availability */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">
                  Availability
                </h3>
                <label
                  onClick={() => setInStockOnly(!inStockOnly)}
                  className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                      inStockOnly
                        ? "bg-green-600 border-green-600"
                        : "border-gray-300"
                    }`}
                  >
                    {inStockOnly && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <span>In Stock Only</span>
                </label>
              </div>
            </div>
            <div className="border-t p-4 space-y-3">
              <button
                onClick={applyFilters}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Apply Filters
              </button>
              <button
                onClick={clearAllFilters}
                className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-lg transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
