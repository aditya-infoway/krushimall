import { useParams, Link } from "react-router-dom";
import {
  ChevronRight,
  Home,
  Star,
  Filter,
  Heart,
  ShoppingCart,
  Check,
  X,
  SlidersHorizontal,
  Truck,
  Shield,
  Minus,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useNavigate } from "react-router-dom";
import { Listbox, RadioGroup } from "@headlessui/react";
import {
  showCartAddedToast,
  showWishlistAddedToast,
  showWishlistRemovedToast,
} from "../utils/toast";

const SubCategoryPage = () => {
  const { categoryName, subCategoryName } = useParams();
  const { addToCart, cart, updateQuantity } = useCart();
  const { isAuthenticated } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [appliedBrands, setAppliedBrands] = useState([]);
  const [appliedPriceRanges, setAppliedPriceRanges] = useState([]);
  const [appliedInStockOnly, setAppliedInStockOnly] = useState(false);

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
      updateQuantity(product.id, 0);
    } else {
      updateQuantity(product.id, currentQty - 1);
    }
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login?redirect=/products");
      return;
    }
    addToCart(product, 1);
  };

  const handleToggleWishlist = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate("/login?redirect=/products");
      return;
    }

    // Check wishlist status before toggling to fire the correct notification
    if (isInWishlist(product.id)) {
      toggleWishlist(product);
      showWishlistRemovedToast(product.name); // <-- Triggers wishlist removed toast
    } else {
      toggleWishlist(product);
      showWishlistAddedToast(product.name); // <-- Triggers wishlist added toast
    }
  };

  // Sample products matching the structure from Products page
  const products = [
    {
      id: 1,
      name: "Premium Ceramic Brake Pad Set - Front Axle",
      brand: "Brembo",
      category: "Brakes",
      price: 2499,
      oldPrice: 3499,
      discount: 30,
      rating: 4.8,
      reviews: 245,
      stock: 15,
      image:
        "https://images.unsplash.com/photo-1600712242805-5f78671b24da?w=400&h=400&fit=crop&auto=format",
      partNumber: "BRE-0986478943",
      compatibility: "Maruti Swift, Dzire, Baleno (2018-2023)",
      warranty: "1 Year Warranty",
      shipping: "Free",
      inStock: true,
    },
    {
      id: 2,
      name: "OE Quality Brake Pads - Ceramic Compound",
      brand: "Bosch",
      category: "Brakes",
      price: 1899,
      oldPrice: 2499,
      discount: 24,
      rating: 4.6,
      reviews: 189,
      stock: 22,
      image:
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=400&fit=crop&auto=format",
      partNumber: "BOS-0986478944",
      compatibility: "Hyundai i20, Verna, Creta (2019-2024)",
      warranty: "6 Months Warranty",
      shipping: "Free",
      inStock: true,
    },
    {
      id: 3,
      name: "Performance Sport Brake Pads - Track Ready",
      brand: "TRW",
      category: "Brakes",
      price: 2199,
      oldPrice: 2799,
      discount: 21,
      rating: 4.7,
      reviews: 156,
      stock: 8,
      image:
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=400&fit=crop&auto=format",
      partNumber: "TRW-1234567890",
      compatibility: "Honda City, Civic, Jazz (2020-2024)",
      warranty: "2 Years Warranty",
      shipping: "Free",
      inStock: true,
    },
    {
      id: 4,
      name: "Eco-Friendly Low Dust Brake Pads Set",
      brand: "Brembo",
      category: "Brakes",
      price: 2999,
      oldPrice: 3999,
      discount: 25,
      rating: 4.9,
      reviews: 312,
      stock: 5,
      image:
        "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=400&h=400&fit=crop&auto=format",
      partNumber: "BRE-0986478945",
      compatibility: "Tata Nexon, Harrier, Safari (2021-2024)",
      warranty: "1 Year Warranty",
      shipping: "Free",
      inStock: false,
    },
    {
      id: 5,
      name: "Heavy Duty Commercial Brake Pads",
      brand: "Bosch",
      category: "Brakes",
      price: 3299,
      oldPrice: 4599,
      discount: 28,
      rating: 4.5,
      reviews: 98,
      stock: 12,
      image:
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=400&fit=crop&auto=format",
      partNumber: "BOS-0986478946",
      compatibility: "Mahindra Scorpio, XUV500, Thar (2019-2023)",
      warranty: "18 Months Warranty",
      shipping: "Free",
      inStock: true,
    },
    {
      id: 6,
      name: "Racing Series Semi-Metallic Brake Pads",
      brand: "TRW",
      category: "Brakes",
      price: 4599,
      oldPrice: 5399,
      discount: 15,
      rating: 4.8,
      reviews: 67,
      stock: 18,
      image:
        "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=400&h=400&fit=crop&auto=format",
      partNumber: "TRW-0987654321",
      compatibility: "Volkswagen Polo, Vento, Rapid (2020-2024)",
      warranty: "2 Years Warranty",
      shipping: "Free",
      inStock: true,
    },
  ];

  const brands = ["Brembo", "Bosch", "TRW"];

  const priceRanges = [
    { label: "Under ₹1,000", min: 0, max: 1000 },
    { label: "₹1,000 - ₹2,000", min: 1000, max: 2000 },
    { label: "₹2,000 - ₹3,000", min: 2000, max: 3000 },
    { label: "₹3,000 - ₹5,000", min: 3000, max: 5000 },
    { label: "Above ₹5,000", min: 5000, max: Infinity },
  ];

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  let filteredProducts = products;

  if (appliedBrands.length > 0) {
    filteredProducts = filteredProducts.filter((p) =>
      appliedBrands.includes(p.brand),
    );
  }

  if (appliedPriceRanges.length > 0) {
    filteredProducts = filteredProducts.filter((product) => {
      return appliedPriceRanges.some((range) => {
        const [min, max] = range;
        return product.price >= min && product.price <= max;
      });
    });
  }

  if (appliedInStockOnly) {
    filteredProducts = filteredProducts.filter((p) => p.inStock);
  }

  const applyFilters = () => {
    setAppliedBrands([...selectedBrands]);
    setAppliedPriceRanges([...selectedPriceRanges]);
    setAppliedInStockOnly(inStockOnly);
  };

  if (sortBy === "price-low") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => b.rating - a.rating,
    );
  }

  const title = subCategoryName
    ?.replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  const categoryTitle = categoryName
    ?.replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  const hasActiveFilters =
    selectedBrands.length > 0 || selectedPriceRanges.length > 0 || inStockOnly;

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="lg:hidden flex items-center justify-between pb-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5" />
          Filters
        </h2>
        <button
          onClick={() => setMobileFilterOpen(false)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Brand Checkboxes - Headless UI styled */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Filter className="h-4 w-4 text-green-600" />
          Brand
        </h3>
        <div className="space-y-1">
          {brands.map((brand) => (
            <label
              key={brand}
              onClick={() => toggleBrand(brand)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                selectedBrands.includes(brand)
                  ? "bg-green-50 text-green-600 border border-green-200"
                  : "hover:bg-gray-50 text-gray-700 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                    selectedBrands.includes(brand)
                      ? "bg-green-600 border-green-600"
                      : "border-gray-300"
                  }`}
                >
                  {selectedBrands.includes(brand) && (
                    <Check className="h-3 w-3 text-white" />
                  )}
                </div>
                <span className="text-sm font-medium">{brand}</span>
              </div>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                {products.filter((p) => p.brand === brand).length}
              </span>
            </label>
          ))}
        </div>

        <div className="mt-2 flex gap-2">
          <button
            onClick={() => setSelectedBrands([...brands])}
            className="text-xs cursor-pointer text-green-600 hover:text-green-700 underline"
          >
            Select All
          </button>
          <button
            onClick={() => setSelectedBrands([])}
            className="text-xs cursor-pointer text-green-500 hover:text-green-700 underline"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Price Range Checkboxes - Headless UI styled */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
        <div className="space-y-1">
          {priceRanges.map((range) => (
            <label
              key={range.label}
              onClick={() => {
                if (
                  selectedPriceRanges.some(
                    (r) => r[0] === range.min && r[1] === range.max,
                  )
                ) {
                  setSelectedPriceRanges(
                    selectedPriceRanges.filter(
                      (r) => !(r[0] === range.min && r[1] === range.max),
                    ),
                  );
                } else {
                  setSelectedPriceRanges([
                    ...selectedPriceRanges,
                    [range.min, range.max],
                  ]);
                }
              }}
              className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              <div
                className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                  selectedPriceRanges.some(
                    (r) => r[0] === range.min && r[1] === range.max,
                  )
                    ? "bg-green-600 border-green-600"
                    : "border-gray-300"
                }`}
              >
                {selectedPriceRanges.some(
                  (r) => r[0] === range.min && r[1] === range.max,
                ) && <Check className="h-3 w-3 text-white" />}
              </div>
              <span className="text-sm text-gray-700">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability Checkbox - Headless UI styled */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Availability</h3>
        <label
          onClick={() => setInStockOnly(!inStockOnly)}
          className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-lg cursor-pointer"
        >
          <div
            className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
              inStockOnly ? "bg-green-600 border-green-600" : "border-gray-300"
            }`}
          >
            {inStockOnly && <Check className="h-3 w-3 text-white" />}
          </div>
          <span className="text-sm text-gray-700">In Stock Only</span>
        </label>
      </div>

      <button
        onClick={() => {
          applyFilters();
          setMobileFilterOpen(false);
        }}
        className="w-full py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
      >
        Apply Filters
      </button>

      {hasActiveFilters && (
        <button
          onClick={() => {
            setSelectedBrands([]);
            setSelectedPriceRanges([]);
            setInStockOnly(false);
            setAppliedBrands([]);
            setAppliedPriceRanges([]);
            setAppliedInStockOnly(false);
          }}
          className="w-full py-2.5 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
  return (
    <div className="bg-gray-50 min-h-screen lg:mt-4">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500 overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-green-600 transition-colors">
              <Home className="h-4 w-4" />
            </Link>
            <ChevronRight className="h-3 w-3 flex-shrink-0" />
            <Link
              to="/spare-parts"
              className="hover:text-green-600 transition-colors"
            >
              Spare Parts
            </Link>
            <ChevronRight className="h-3 w-3 flex-shrink-0" />
            <Link
              to={`/category/${categoryName}`}
              className="hover:text-green-600 transition-colors"
            >
              {categoryTitle}
            </Link>
            <ChevronRight className="h-3 w-3 flex-shrink-0" />
            <span className="text-gray-900 font-medium truncate">{title}</span>
          </div>
        </div>
      </div>

      <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 py-2 lg:py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Sidebar Filters */}
          <div className="hidden lg:block lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-lg border sticky top-24 p-4">
              <h2 className="font-semibold text-gray-900 text-lg mb-1">
                {title}
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                {products.length} Products found
              </p>
              <FilterContent />
            </div>
          </div>

          {/* Mobile Filter Overlay */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black/50 bg-opacity-50"
                onClick={() => setMobileFilterOpen(false)}
              />
              <div className="absolute right-0 top-0 h-full w-80 max-w-full bg-white shadow-xl overflow-y-auto">
                <div className="p-4">
                  <FilterContent />
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort and View Controls */}
            <div className="bg-white rounded-lg border p-3 lg:p-4 mb-4">
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {hasActiveFilters && (
                    <span className="bg-green-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {selectedBrands.length +
                        selectedPriceRanges.length +
                        (inStockOnly ? 1 : 0)}
                    </span>
                  )}
                </button>

                {/* Sort - Headless UI RadioGroup */}
                {/* Sort - Headless UI RadioGroup */}
                <RadioGroup value={sortBy} onChange={setSortBy}>
                  <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                    {[
                      { label: "Popular", value: "popular" },
                      { label: "Price Low", value: "price-low" },
                      { label: "Price High", value: "price-high" },
                      { label: "Rating", value: "rating" },
                    ].map((option) => (
                      <RadioGroup.Option
                        key={option.value}
                        value={option.value}
                      >
                        {({ checked }) => (
                          <div
                            className={`px-2.5 py-1.5 text-[11px] sm:text-sm rounded whitespace-nowrap transition-colors cursor-pointer flex-shrink-0 ${
                              checked
                                ? "bg-green-600 text-white shadow-sm"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {option.label}
                          </div>
                        )}
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>

                {/* View Mode - Headless UI RadioGroup */}
                <RadioGroup value={viewMode} onChange={setViewMode}>
                  <div className="hidden sm:flex items-center gap-2">
                    <span className="text-sm text-gray-600">View:</span>
                    <RadioGroup.Option value="grid">
                      {({ checked }) => (
                        <div
                          className={`p-2 rounded transition-colors cursor-pointer ${checked ? "bg-green-50 text-green-600" : "text-gray-600 hover:bg-gray-100"}`}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                          </svg>
                        </div>
                      )}
                    </RadioGroup.Option>
                    <RadioGroup.Option value="list">
                      {({ checked }) => (
                        <div
                          className={`p-2 rounded transition-colors cursor-pointer ${checked ? "bg-green-50 text-green-600" : "text-gray-600 hover:bg-gray-100"}`}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </RadioGroup.Option>
                  </div>
                </RadioGroup>
              </div>

              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t">
                  {selectedBrands.map((brand) => (
                    <span
                      key={brand}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-green-600 text-xs rounded-full"
                    >
                      {brand}
                      <button
                        onClick={() => {
                          const newBrands = selectedBrands.filter(
                            (b) => b !== brand,
                          );
                          setSelectedBrands(newBrands);
                          setAppliedBrands(newBrands);
                        }}
                        className="hover:bg-red-100 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {selectedPriceRanges.map((range, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-green-600 text-xs rounded-full"
                    >
                      {
                        priceRanges.find(
                          (r) => r.min === range[0] && r.max === range[1],
                        )?.label
                      }
                      <button
                        onClick={() => {
                          const newRanges = selectedPriceRanges.filter(
                            (_, i) => i !== idx,
                          );
                          setSelectedPriceRanges(newRanges);
                          setAppliedPriceRanges(newRanges);
                        }}
                        className="hover:bg-red-100 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {inStockOnly && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-green-600 text-xs rounded-full">
                      In Stock Only
                      <button
                        onClick={() => {
                          setInStockOnly(false);
                          setAppliedInStockOnly(false);
                        }}
                        className="hover:bg-red-100 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setSelectedBrands([]);
                      setSelectedPriceRanges([]);
                      setInStockOnly(false);
                      setAppliedBrands([]);
                      setAppliedPriceRanges([]);
                      setAppliedInStockOnly(false);
                    }}
                    className="text-xs text-gray-500 hover:text-gray-700 underline ml-2"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Showing{" "}
              <span className="font-medium">{filteredProducts.length}</span> of{" "}
              {products.length} products
            </p>

            {/* Products Grid - EXACT same pattern as Products page */}
            {/* PHONE VIEW - 2 cards per row */}
            <div className="sm:hidden grid grid-cols-2 gap-3">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all group flex flex-col"
                >
                  <div className="relative bg-gray-100 overflow-hidden aspect-square rounded-t-lg">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.discount > 0 && (
                      <span className="absolute top-2 left-2 bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        -{product.discount}%
                      </span>
                    )}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="bg-white text-gray-900 font-semibold px-2 py-1 rounded-md text-[10px]">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-2 flex flex-col flex-1">
                    <span className="text-[10px] text-gray-500 mb-0.5">
                      {product.brand}
                    </span>
                    <h3 className="text-[11px] font-medium text-gray-900 line-clamp-2 leading-tight mb-1 flex-1">
                      {product.name}
                    </h3>
                    <div className="flex items-baseline gap-1.5 mb-1">
                      <span className="text-sm font-bold text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-[10px] text-gray-400 line-through">
                        {formatPrice(product.oldPrice)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] mb-2">
                      <span
                        className={
                          product.inStock
                            ? "text-green-600 font-medium"
                            : "text-red-500 font-medium"
                        }
                      >
                        {product.inStock ? "In Stock" : "Out"}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-400 flex items-center gap-0.5">
                        <Truck className="h-2.5 w-2.5" />
                        Free
                      </span>
                    </div>{" "}
                    {getCartQuantity(product.id) > 0 ? (
                      <div className="flex items-center justify-between border border-green-600 rounded-md w-full">
                        <button
                          onClick={(e) => handleDecreaseQuantity(e, product)}
                          className="p-1.5 hover:bg-green-50 text-green-600 cursor-pointer"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="text-xs font-bold text-green-600">
                          {getCartQuantity(product.id)}
                        </span>
                        <button
                          onClick={(e) => handleIncreaseQuantity(e, product)}
                          className="p-1.5 hover:bg-green-50 text-green-600 cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={!product.inStock}
                        className={`w-full flex items-center justify-center gap-2 font-medium py-2.5 rounded-lg transition-all ${
                          product.inStock
                            ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        {product.inStock ? "Add to Cart" : "Sold Out"}
                      </button>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* DESKTOP VIEW - Original grid/list */}
            <div className="hidden sm:block">
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
                    : "space-y-4"
                }
              >
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className={`bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all group ${
                      viewMode === "list" ? "flex gap-6 p-4" : ""
                    }`}
                  >
                    <div
                      className={`relative bg-gray-100 overflow-hidden ${
                        viewMode === "list"
                          ? "w-48 h-48 flex-shrink-0 rounded-lg"
                          : "aspect-square rounded-t-lg"
                      }`}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {product.discount > 0 && (
                        <span className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                          -{product.discount}%
                        </span>
                      )}
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="bg-white text-gray-900 font-semibold px-4 py-2 rounded-lg text-sm">
                            Out of Stock
                          </span>
                        </div>
                      )}
                      <div
                        className={`absolute top-2 right-2 flex flex-col gap-2 transition-all duration-300 ${
                          viewMode === "list" || isInWishlist(product.id)
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100"
                        }`}
                      >
                        <button
                          onClick={(e) => handleToggleWishlist(e, product)}
                          className={`p-2 rounded-lg shadow-md transition-colors ${isInWishlist(product.id) ? "bg-red-50 hover:bg-red-100" : "bg-white hover:bg-gray-50"}`}
                        >
                          <Heart
                            className={`h-4 w-4 transition-colors ${isInWishlist(product.id) ? "text-green-500 fill-green-500" : "text-gray-600"}`}
                          />
                        </button>
                      </div>
                    </div>
                    <div
                      className={`${viewMode === "list" ? "flex-1 flex flex-col justify-between" : "p-4 flex flex-col"}`}
                    >
                      <div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                          <span>{product.brand}</span>
                          <span>•</span>
                          <span>{product.partNumber}</span>
                        </div>
                        <h3 className="font-medium text-gray-900 group-hover:text-green-600 transition-colors mb-2 line-clamp-2 min-h-[48px]">
                          {product.name}
                        </h3>
                      </div>
                      <div>
                        {/* Grid view: Price left, Stock right in same line */}
                        {viewMode === "grid" ? (
                          <>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-end gap-2">
                                <span className="text-lg font-bold text-gray-900">
                                  {formatPrice(product.price)}
                                </span>
                                <span className="text-sm text-gray-400 line-through">
                                  {formatPrice(product.oldPrice)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs">
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
                                  <Truck className="h-3 w-3" />
                                  {product.shipping}
                                </span>
                              </div>
                            </div>
                            {getCartQuantity(product.id) > 0 ? (
                              <div className="flex items-center justify-between border border-green-600 rounded-md w-full">
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
                            ) : (
                              <button
                                onClick={(e) => handleAddToCart(e, product)}
                                disabled={!product.inStock}
                                className={`w-full flex items-center justify-center gap-2 font-medium py-2.5 rounded-lg transition-all ${
                                  product.inStock
                                    ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg"
                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                }`}
                              >
                                <ShoppingCart className="h-4 w-4" />
                                {product.inStock ? "Add to Cart" : "Sold Out"}
                              </button>
                            )}
                          </>
                        ) : (
                          /* List view: stock left, cart right */
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-end gap-2 mb-1">
                                <span className="text-lg font-bold text-gray-900">
                                  {formatPrice(product.price)}
                                </span>
                                <span className="text-sm text-gray-400 line-through">
                                  {formatPrice(product.oldPrice)}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span
                                  className={
                                    product.inStock
                                      ? "text-green-600 font-medium"
                                      : "text-red-500 font-medium"
                                  }
                                >
                                  {product.inStock ? "In Stock" : "Out"}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Truck className="h-3 w-3" />
                                  {product.shipping}
                                </span>
                              </div>
                            </div>
                            {getCartQuantity(product.id) > 0 ? (
                              <div className="flex items-center gap-1 border border-green-600 rounded-md ml-auto">
                                <button
                                  onClick={(e) =>
                                    handleDecreaseQuantity(e, product)
                                  }
                                  className="p-1.5 hover:bg-green-50 text-green-600 cursor-pointer"
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </button>
                                <span className="text-sm font-bold text-green-600 px-2">
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
                            ) : (
                              <button
                                onClick={(e) => handleAddToCart(e, product)}
                                disabled={!product.inStock}
                                className={`flex items-center justify-center gap-2 font-medium py-2.5 px-6 rounded-lg transition-all ml-auto ${
                                  product.inStock
                                    ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                }`}
                              >
                                <ShoppingCart className="h-4 w-4" />
                                {product.inStock ? "Add to Cart" : "Sold Out"}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            {filteredProducts.length === 0 && (
              <div className="text-center py-16 bg-white rounded-lg border">
                <p className="text-gray-500 text-lg">
                  No products found matching your filters
                </p>
                <button
                  onClick={() => {
                    setSelectedBrands([]);
                    setSelectedPriceRanges([]);
                    setInStockOnly(false);
                  }}
                  className="mt-4 text-green-600 hover:text-green-700 font-medium underline"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubCategoryPage;
