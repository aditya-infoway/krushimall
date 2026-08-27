import { useState, useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
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
  ChevronLeft,
  Plus,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import apiHelper from "../utils/apiHelper";
import {
  showCartAddedToast,
  showWishlistAddedToast,
  showWishlistRemovedToast,
  showLoginRequiredToast,
    showErrorToast,   
} from "../utils/toast.jsx";

const Products = () => {
  const { addToCart, cart, updateQuantity, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  const { category, maker } = useParams();
  const [searchParams] = useSearchParams();

  const subSubCategoryId = searchParams.get("subSubCategoryId");
  const subCategoryId = searchParams.get("subCategoryId");
  const categoryId = searchParams.get("categoryId");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState(
    categoryId || category || "all",
  );
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);
  const [showVehicleSearch, setShowVehicleSearch] = useState(false);
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);

  const [appliedCategory, setAppliedCategory] = useState(categoryId || "all");
  const [appliedBrands, setAppliedBrands] = useState([]);
  const [appliedPriceRange, setAppliedPriceRange] = useState([0, 50000]);

  // ---- products from backend ----
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Dynamic filter data
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loadingFilters, setLoadingFilters] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [categoryId, subCategoryId, subSubCategoryId]);

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const params = new URLSearchParams();

      if (categoryId) params.append("categoryId", categoryId);
      if (subCategoryId) params.append("subCategoryId", subCategoryId);
      if (subSubCategoryId) params.append("subSubCategoryId", subSubCategoryId);

      const response = await apiHelper.get(
        `/web/product${params.toString() ? `?${params.toString()}` : ""}`,
      );

      const responseData = response?.data ?? response;
      const data = Array.isArray(responseData)
        ? responseData
        : Array.isArray(responseData?.data)
        ? responseData.data
        : [];

      const mappedProducts = data
        .filter(
          (item) =>
            item?.verificationStatus === "APPROVED" ||
            !item?.verificationStatus,
        )
        .map((item) => {
         const mrp = Number(item.mrp) || 0;
const sellingPrice = Number(item.sellingPrice) || 0;
const finalPrice =
  Number(item.finalPrice) > 0 ? Number(item.finalPrice) : sellingPrice;
const discount =
  mrp > 0 ? Math.round(((mrp - finalPrice) / mrp) * 100) : 0;

          let compatibility = item.shortDescription || "";
          try {
            if (item.keyFeatures) {
              const features =
                typeof item.keyFeatures === "string"
                  ? JSON.parse(item.keyFeatures)
                  : item.keyFeatures;
              if (Array.isArray(features) && features.length) {
                compatibility = features.join(", ");
              }
            }
          } catch {
            // Keep shortDescription as fallback.
          }

          return {
            id: item.id || item._id,
            name: item.productName || item.name || "",
            categoryId: item.category?.id ?? item.categoryId ?? null,
            brandId: item.brand?.id ?? item.brandId ?? null,
            brand: item.brand?.brandName || item.brand?.name || "-",
            category: item.category?.categoryName || item.category?.name || "",
            price: finalPrice,
            oldPrice: mrp,
            discount: discount > 0 ? discount : 0,
            rating: item.rating || 4.5,
            reviews: item.reviewsCount || 0,
            stock: Number(item.stockQuantity) || 0,
              maxOrderQuantity: Number(item.maxOrderQuantity) || 0,
            image: apiHelper.getImageUrl(item.mainImage) || "",
            partNumber: item.sku || item.barcode || "",
            compatibility,
            warranty: item.warrantyPeriod || "-",
            shipping: item.freeShipping ? "Free" : "Paid",
            inStock:
              item.stock === "IN_STOCK" ||
              (Number(item.stockQuantity) || 0) > 0,
          };
        });

      setProducts(mappedProducts);
    } catch (error) {
      console.error("Failed to fetch products", error);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Build filter options from actual backend product data.
  // No hard-coded category/brand names or counts.
  useEffect(() => {
    setLoadingFilters(true);

    const categoryMap = new Map();
    const brandMap = new Map();

    products.forEach((product) => {
      if (product.categoryId && product.category) {
        const key = String(product.categoryId);
        if (!categoryMap.has(key)) {
          categoryMap.set(key, {
            id: product.categoryId,
            name: product.category,
          });
        }
      }

      if (product.brandId && product.brand && product.brand !== "-") {
        const key = String(product.brandId);
        if (!brandMap.has(key)) {
          brandMap.set(key, {
            id: product.brandId,
            name: product.brand,
          });
        }
      }
    });

    setCategories([
      { id: "all", name: "All Parts", count: products.length },
      ...Array.from(categoryMap.values()).map((categoryItem) => ({
        ...categoryItem,
        count: products.filter(
          (product) => String(product.categoryId) === String(categoryItem.id),
        ).length,
      })),
    ]);

    setBrands([
      {
        id: "all",
        name: "All Brands",
        count: products.filter((product) => product.brandId != null).length,
      },
      ...Array.from(brandMap.values()).map((brandItem) => ({
        ...brandItem,
        count: products.filter(
          (product) => String(product.brandId) === String(brandItem.id),
        ).length,
      })),
    ]);

    setLoadingFilters(false);
  }, [products]);

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

  const maxQty = getMaxOrderQuantity(product);
  const currentQty = getCartQuantity(product.id);

  if (currentQty >= maxQty) {
    showErrorToast(
      `Maximum order quantity is ${maxQty}. You cannot order more than ${maxQty} item${maxQty > 1 ? "s" : ""}.`,
    );
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
const getMaxOrderQuantity = (product) => {
  const maxQty = Number(product?.maxOrderQuantity);
  return maxQty > 0 ? maxQty : Infinity;
};
const handleIncreaseQuantity = (e, product) => {
  e.preventDefault();
  e.stopPropagation();

  const maxQty = getMaxOrderQuantity(product);
  const currentQty = getCartQuantity(product.id);

  if (currentQty >= maxQty) {
    showErrorToast(
      `Maximum order quantity is ${maxQty}. You cannot order more than ${maxQty} item${maxQty > 1 ? "s" : ""}.`,
    );
    return;
  }

  addToCart(product, 1);
};

  const handleDecreaseQuantity = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    const currentQty = getCartQuantity(product.id);
    if (currentQty <= 1) {
      // Actually remove from cart using the context function
      removeFromCart(product.id);
    } else {
      updateQuantity(product.id, currentQty - 1);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // ---- filtering ----
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      appliedCategory === "all" ||
      String(product.categoryId) === String(appliedCategory);

    const matchesBrand =
      appliedBrands.length === 0 ||
      appliedBrands.includes("all") ||
      appliedBrands.some(
        (brandId) => String(product.brandId) === String(brandId),
      );

    const matchesPrice =
      product.price >= appliedPriceRange[0] &&
      product.price <= appliedPriceRange[1];

    const matchesStock = !inStockOnly || product.inStock;

    return matchesCategory && matchesBrand && matchesPrice && matchesStock;
  });

  // ---- sorting ----
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "discount":
        return b.discount - a.discount;
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

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
                  className={`h-4 w-4 transition-transform ${
                    showVehicleSearch ? "rotate-180" : ""
                  }`}
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
                          `cursor-pointer select-none px-3 py-2 ${
                            active
                              ? "bg-green-50 text-green-600"
                              : "text-gray-700"
                          } ${selected ? "bg-green-100 font-medium" : ""}`
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
                  className={`p-2 cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-gray-900 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 cursor-pointer ${
                    viewMode === "list"
                      ? "bg-gray-900 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
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
                            `cursor-pointer select-none px-4 py-2.5 ${
                              active
                                ? "bg-green-50 text-green-600"
                                : "text-gray-700"
                            } ${selected ? "bg-green-100 font-medium" : ""}`
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
                            `cursor-pointer select-none px-4 py-2.5 ${
                              active
                                ? "bg-green-50 text-green-600"
                                : "text-gray-700"
                            } ${selected ? "bg-green-100 font-medium" : ""}`
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
                            `cursor-pointer select-none px-4 py-2.5 ${
                              active
                                ? "bg-green-50 text-green-600"
                                : "text-gray-700"
                            } ${selected ? "bg-green-100 font-medium" : ""}`
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
        {/* <div className=" flex items-center justify-end ">
                    <button
                      onClick={() => navigate(-1)}
                      className="flex items-center gap-2 px-4 py-2 cursor-pointer bg-white border border-gray-200 rounded-lg hover:border-green-400 hover:bg-green-50 hover:shadow-md transition-all duration-300 group shrink-0"
                      aria-label="Go back"
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-500 group-hover:text-green-600 transition-colors" />
                      <span className="text-sm font-medium text-gray-600 group-hover:text-green-600 transition-colors">
                        Back
                      </span>
                    </button>
                    </div> */}
        <div className="flex gap-8 items-start">
          {/* Desktop Sidebar Filters */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-28 bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-6">
              {/* Categories */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
                <div className="space-y-1">
                  {loadingFilters ? (
                    <p className="px-3 py-2 text-sm text-gray-400">
                      Loading categories...
                    </p>
                  ) : (
                    categories.map((cat) => (
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
                    ))
                  )}
                </div>
              </div>

              {/* Brands */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Brands</h3>
                <div className="space-y-1">
                  {loadingFilters ? (
                    <p className="px-3 py-2 text-sm text-gray-400">
                      Loading brands...
                    </p>
                  ) : (
                    brands.map((brand) => (
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
                        <span className="flex-1">{brand.name}</span>
                        <span className="text-xs text-gray-400">
                          ({brand.count})
                        </span>
                      </button>
                    ))
                  )}
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
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {sortedProducts.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">
                  {products.length}
                </span>{" "}
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

            {loadingProducts ? (
              <div className="text-center py-20 text-gray-500">
                Loading products...
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                No products found matching your filters.
              </div>
            ) : (
              <>
                {/* Compact Grid with reduced gaps */}
                {/* PHONE VIEW - 2 cards per row */}
                <div className="sm:hidden grid grid-cols-2 gap-3">
                  {sortedProducts.map((product) => (
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
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.discount > 0 && (
                          <span className="absolute top-1.5 left-1.5 bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
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
                            className={`p-1 rounded-md shadow-md transition-colors ${
                              isInWishlist(product.id)
                                ? "bg-green-50 hover:bg-green-100"
                                : "bg-white hover:bg-gray-50"
                            }`}
                          >
                            <Heart
                              className={`h-3 w-3 cursor-pointer transition-colors ${
                                isInWishlist(product.id)
                                  ? "text-green-500 fill-green-500"
                                  : "text-gray-600"
                              }`}
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
                          {product.oldPrice > product.price && (
                            <span className="text-[10px] text-gray-400 line-through">
                              {formatPrice(product.oldPrice)}
                            </span>
                          )}
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
                            {product.shipping === "Free" ? "Free" : "Paid"}
                          </span>
                        </div>

                        {/* Add to Cart Button - Below stock */}
                        {getCartQuantity(product.id) > 0 ? (
                          <div className="flex items-center justify-between border border-green-600 rounded-md w-full">
                            <button
                              onClick={(e) =>
                                handleDecreaseQuantity(e, product)
                              }
                              className="p-1.5 hover:bg-green-50 text-green-600 cursor-pointer"
                            >
                              <Minus className="h-3 w-3" />
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
                {/* Products Grid / List Content */}
                <div
                  className={
                    viewMode === "grid"
                      ? "hidden sm:grid grid-cols-2 xl:grid-cols-3 gap-4"
                      : "hidden sm:flex flex-col gap-4"
                  }
                >
                  {sortedProducts.map((product) => {
                    const quantity = getCartQuantity(product.id);

                    return viewMode === "grid" ? (
                      /* --- FIXED 3-COLUMN GRID VIEW MODE WITH QUANTITY TOGGLE --- */
                      <Link
                        key={product.id}
                        to={`/product/${product.id}`}
                        className="bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all group flex flex-col relative overflow-hidden"
                      >
                        {/* Product Image */}
                        <div className="relative bg-gray-100 overflow-hidden aspect-square w-full">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                          {product.discount > 0 && (
                            <span className="absolute top-2.5 left-2.5 bg-green-600 text-white text-[11px] font-bold px-1.5 py-0.5 rounded">
                              -{product.discount}%
                            </span>
                          )}
                          {!product.inStock && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                              <span className="bg-white text-gray-900 font-semibold px-2 py-1 rounded-md text-[11px]">
                                Out of Stock
                              </span>
                            </div>
                          )}
                          <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300">
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
                              className={`p-1.5 rounded-md shadow-md transition-colors ${
                                isInWishlist(product.id)
                                  ? "bg-green-50 hover:bg-green-100"
                                  : "bg-white hover:bg-gray-50"
                              }`}
                            >
                              <Heart
                                className={`h-3.5 w-3.5 cursor-pointer transition-colors ${
                                  isInWishlist(product.id)
                                    ? "text-green-500 fill-green-500"
                                    : "text-gray-600"
                                }`}
                              />
                            </button>
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="flex flex-col flex-1 p-3">
                          {/* ROW 1: Brand and Rating aligned side-by-side */}
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-[11px] font-medium text-gray-500 truncate">
                              {product.brand}
                            </span>
                            <div className="flex items-center gap-0.5 flex-shrink-0 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                              <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                              <span className="text-[10px] font-semibold text-gray-600">
                                {product.rating}
                              </span>
                            </div>
                          </div>

                          {/* Title Block */}
                          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2 leading-tight mb-2 flex-1">
                            {product.name}
                          </h3>

                          {/* ROW 2: Price and Stock Status aligned side-by-side */}
                          <div className="flex items-baseline justify-between gap-2 mb-2.5 pt-1 border-t border-gray-50">
                            <div className="flex items-baseline gap-1">
                              <span className="text-sm font-bold text-gray-900">
                                {formatPrice(product.price)}
                              </span>
                              {product.oldPrice > product.price && (
                                <span className="text-[10px] text-gray-400 line-through">
                                  {formatPrice(product.oldPrice)}
                                </span>
                              )}
                            </div>

                            <div className="text-[10px] flex-shrink-0">
                              <span
                                className={`font-semibold ${
                                  product.inStock
                                    ? "text-green-600"
                                    : "text-red-500"
                                }`}
                              >
                                {product.inStock ? "In Stock" : "Out of Stock"}
                              </span>
                            </div>
                          </div>

                          {/* Grid Add to Cart / Quantity Switch */}
                          {quantity > 0 ? (
                            <div className="flex items-center justify-between border border-green-600 rounded-md overflow-hidden bg-white py-1 px-2 h-8">
                              <button
                                onClick={(e) =>
                                  handleDecreaseQuantity(e, product)
                                }
                                className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors cursor-pointer"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="text-xs font-bold text-gray-900">
                                {quantity}
                              </span>
                              <button
                                onClick={(e) =>
                                  handleIncreaseQuantity(e, product)
                                }
                                className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors cursor-pointer"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              disabled={!product.inStock}
                              onClick={(e) => handleAddToCart(e, product)}
                              className={`w-full flex items-center justify-center gap-1.5 font-medium py-1.5 rounded-md transition-colors text-xs h-8 cursor-pointer ${
                                product.inStock
                                  ? "bg-green-600 hover:bg-green-700 text-white"
                                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                              }`}
                            >
                              <ShoppingCart className="h-3.5 w-3.5" />
                              <span>Add to Cart</span>
                            </button>
                          )}
                        </div>
                      </Link>
                    ) : (
                      /* --- WORKING LIST VIEW MODE WITH QUANTITY TOGGLE --- */
                      <Link
                        key={product.id}
                        to={`/product/${product.id}`}
                        className="bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all group flex items-stretch overflow-hidden"
                      >
                        {/* Left: Product Image */}
                        <div className="relative w-48 bg-gray-50 flex-shrink-0 aspect-square">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                          {product.discount > 0 && (
                            <span className="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                              -{product.discount}%
                            </span>
                          )}
                          {!product.inStock && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                              <span className="bg-white text-gray-900 font-semibold px-3 py-1.5 rounded-lg text-xs">
                                Out of Stock
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Center: Details & Price & Stock */}
                        <div className="flex-1 p-5 flex flex-col justify-between">
                          <div>
                            <span className="text-xs font-medium text-gray-500 mb-1 block">
                              {product.brand}
                            </span>
                            <h3 className="text-base font-semibold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2 mb-2">
                              {product.name}
                            </h3>
                            <div className="flex items-center gap-1 mb-4">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium text-gray-700">
                                {product.rating}
                              </span>
                            </div>
                          </div>

                          {/* Price Layout with Stock Info directly below it */}
                          <div className="space-y-2">
                            <div className="flex items-baseline gap-2">
                              <span className="text-xl font-bold text-gray-900">
                                {formatPrice(product.price)}
                              </span>
                              {product.oldPrice > product.price && (
                                <span className="text-sm text-gray-400 line-through">
                                  {formatPrice(product.oldPrice)}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-3 text-xs">
                              <span
                                className={`font-semibold ${
                                  product.inStock
                                    ? "text-green-600"
                                    : "text-red-500"
                                }`}
                              >
                                {product.inStock ? "In Stock" : "Out of Stock"}
                              </span>
                              {product.shipping === "Free" && (
                                <span className="text-gray-500 flex items-center gap-1">
                                  • Free
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right Action Panel */}
                        <div className="w-52 p-5 border-l border-gray-100 flex flex-col justify-end items-end gap-3 relative">
                          <div className="absolute top-4 right-4">
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
                              className={`p-2 rounded-lg border transition-colors ${
                                isInWishlist(product.id)
                                  ? "bg-green-50 border-green-200 hover:bg-green-100"
                                  : "bg-white border-gray-200 hover:bg-gray-50"
                              }`}
                            >
                              <Heart
                                className={`h-4 w-4 cursor-pointer transition-colors ${
                                  isInWishlist(product.id)
                                    ? "text-green-500 fill-green-500"
                                    : "text-gray-600"
                                }`}
                              />
                            </button>
                          </div>

                          {/* List Add to Cart / Quantity Switch */}
                          {quantity > 0 ? (
                            <div className="w-full flex items-center justify-between border border-green-600 rounded-lg overflow-hidden bg-white py-2 px-3 h-[42px]">
                              <button
                                onClick={(e) =>
                                  handleDecreaseQuantity(e, product)
                                }
                                className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors cursor-pointer"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="text-sm font-bold text-gray-900">
                                {quantity}
                              </span>
                              <button
                                onClick={(e) =>
                                  handleIncreaseQuantity(e, product)
                                }
                                className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors cursor-pointer"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              disabled={!product.inStock}
                              onClick={(e) => handleAddToCart(e, product)}
                              className={`w-full flex items-center justify-center gap-2 font-medium px-4 py-2.5 rounded-lg transition-colors text-sm h-[42px] cursor-pointer ${
                                product.inStock
                                  ? "bg-green-600 hover:bg-green-700 text-white"
                                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                              }`}
                            >
                              <ShoppingCart className="h-4 w-4" />
                              <span>Add to Cart</span>
                            </button>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </>
            )}

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
                  {loadingFilters ? (
                    <p className="px-3 py-2 text-sm text-gray-400">
                      Loading categories...
                    </p>
                  ) : (
                    categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`flex items-center justify-between w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors border ${
                          selectedCategory === cat.id
                            ? "bg-green-50 text-green-600 font-medium border-green-200"
                            : "text-gray-600 hover:bg-gray-50 border-transparent"
                        }`}
                      >
                        <span>{cat.name}</span>
                        <span className="text-xs text-gray-400">
                          ({cat.count})
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">
                  Brands
                </h3>
                <div className="space-y-1">
                  {loadingFilters ? (
                    <p className="px-3 py-2 text-sm text-gray-400">
                      Loading brands...
                    </p>
                  ) : (
                    brands.map((brand) => (
                      <button
                        key={brand.id}
                        onClick={() => toggleBrand(brand.id)}
                        className={`flex items-center gap-2 w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors border ${
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
                        <span className="flex-1">{brand.name}</span>
                        <span className="text-xs text-gray-400">
                          ({brand.count})
                        </span>
                      </button>
                    ))
                  )}
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
