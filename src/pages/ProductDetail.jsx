import { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  Star,
  Truck,
  Shield,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Check,
  Minus,
  Plus,
  Share2,
  MessageCircle,
  ThumbsUp,
  AlertCircle,
  Car,
  ChevronDown,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { Listbox } from "@headlessui/react";
import {
  // showCartAddedToast,
  showWishlistAddedToast,
  showWishlistRemovedToast,
  showErrorToast,
  // showLoginRequiredToast,
} from "../utils/toast.jsx";
import apiHelper from "../utils/apiHelper";
const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, cart, updateQuantity, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [isCompatible, setIsCompatible] = useState(null);
  const containerRef = useRef(null);
  const [zoomStyle, setZoomStyle] = useState({ display: "none", x: 50, y: 50 });
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const handleMouseLeave = () => {
    setZoomStyle({ display: "none", x: 50, y: 50 });
  };

  const getCartQuantity = (productId) => {
    const cartItem = cart.find((item) => item.id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  const getMaxOrderQuantity = () => {
    const maxQty = Number(product?.maxOrderQuantity);

    // If backend doesn't send maxOrderQuantity,
    // don't unnecessarily restrict the customer.
    return maxQty > 0 ? maxQty : Infinity;
  };

  const handleIncreaseQuantity = () => {
    if (!product) return;

    const maxQty = getMaxOrderQuantity();
    const currentQty = getCartQuantity(product.id);

    if (currentQty >= maxQty) {
      showErrorToast(
        `Maximum order quantity is ${maxQty}. You cannot order more than ${maxQty} item${
          maxQty > 1 ? "s" : ""
        }.`,
      );
      return;
    }

    addToCart(product, 1);
  };

  const handleDecreaseQuantity = () => {
    const currentQty = getCartQuantity(product.id);

    if (currentQty <= 1) {
      removeFromCart(product.id);
      setQuantity(1);
    } else {
      updateQuantity(product.id, currentQty - 1);
    }
  };

  const scrollRef = useRef(null);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/product/" + product.id);
      return;
    }

    const maxQty = getMaxOrderQuantity();

    const currentCartQty = getCartQuantity(product.id);

    // Total quantity after this addition
    const totalQty = currentCartQty + quantity;

    if (totalQty > maxQty) {
      const remainingQty = Math.max(0, maxQty - currentCartQty);

      if (remainingQty === 0) {
        showErrorToast(
          `Maximum order quantity is ${maxQty}. You have already reached the maximum quantity.`,
        );
      } else {
        showErrorToast(
          `You can add only ${remainingQty} more item${
            remainingQty > 1 ? "s" : ""
          }. Maximum order quantity is ${maxQty}.`,
        );
      }

      return;
    }

    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/product/" + product.id);
      return;
    }

    const currentCartQty = getCartQuantity(product.id);

    // ✅ Agar item already cart me hai, quantity waha se hi control hoti hai
    // (+/- buttons se). Buy pe dobara local `quantity` add mat karo —
    // warna cart quantity galat badh jaati hai.
    if (currentCartQty > 0) {
      navigate("/cart");
      return;
    }

    const maxQty = getMaxOrderQuantity();
    const totalQty = currentCartQty + quantity;

    if (totalQty > maxQty) {
      const remainingQty = Math.max(0, maxQty - currentCartQty);

      if (remainingQty === 0) {
        showErrorToast(
          `Maximum order quantity is ${maxQty}. You have already reached the maximum quantity.`,
        );
      } else {
        showErrorToast(
          `You can add only ${remainingQty} more item${
            remainingQty > 1 ? "s" : ""
          }. Maximum order quantity is ${maxQty}.`,
        );
      }

      return;
    }

    addToCart(product, quantity);
    navigate("/cart");
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await apiHelper.get(`/web/product/${id}`);

        const data = response?.data?.product || response?.product;

        if (!data) {
          throw new Error("Product not found");
        }

        const mrp = Number(data.mrp) || 0;
        const sellingPrice = Number(data.sellingPrice) || 0;
const finalPrice =
  Number(data.finalPrice) > 0 ? Number(data.finalPrice) : sellingPrice;
        const images = [
          data.mainImage,
          data.thumbnailImage,
          ...(Array.isArray(data.additionalImages)
            ? data.additionalImages
            : []),
        ].filter(Boolean);

        const mappedProduct = {
          id: data.id,

          name: data.productName,

          brand: data.brand?.brandName || data.brand?.name || "-",

          category: data.category?.categoryName || data.category?.name || "-",

          subCategory:
            data.subCategory?.subCategoryName || data.subCategory?.name || "-",

          subSubCategory:
            data.subSubCategory?.subSubCategoryName ||
            data.subSubCategory?.name ||
            "-",

          price: finalPrice,
          oldPrice: mrp,

          discount:
            mrp > finalPrice && mrp > 0
              ? Math.round(((mrp - finalPrice) / mrp) * 100)
              : 0,

          rating: 0,
          reviews: 0,

          stock: Number(data.stockQuantity) || 0,
          maxOrderQuantity: Number(data.maxOrderQuantity) || 1,
          partNumber: data.partNumber || "-",

          oemNumber: data.oemNumber || "-",

          countryOfOrigin: data.countryOfOrigin || "-",

          compatibility: [],

          warranty:
            data.warrantyDetails || data.warrantyPeriod || "No Warranty",

          shipping: data.freeShipping ? "Free Shipping" : "Standard Shipping",

          deliveryTime: data.estimatedDeliveryTime || "Standard Delivery",

          returns:
            data.returnPolicy === "NONE" ? "No Returns" : data.returnPolicy,

          description: data.shortDescription || "",

          features: (() => {
            if (!data.keyFeatures) return [];

            if (Array.isArray(data.keyFeatures)) {
              return data.keyFeatures;
            }

            if (typeof data.keyFeatures === "string") {
              try {
                const parsed = JSON.parse(data.keyFeatures);

                return Array.isArray(parsed) ? parsed : [];
              } catch {
                return data.keyFeatures
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean);
              }
            }

            return [];
          })(),

          specifications: (() => {
            const value = data.specifications;

            if (!value) return [];

            // Already an array
            if (Array.isArray(value)) {
              return value
                .map((spec) => ({
                  label: spec?.title || spec?.label || spec?.name || "-",

                  value: spec?.value || spec?.description || "-",
                }))
                .filter((spec) => spec.label !== "-" || spec.value !== "-");
            }

            // JSON string
            if (typeof value === "string") {
              try {
                const parsed = JSON.parse(value);

                if (Array.isArray(parsed)) {
                  return parsed
                    .map((spec) => ({
                      label: spec?.title || spec?.label || spec?.name || "-",

                      value: spec?.value || spec?.description || "-",
                    }))
                    .filter((spec) => spec.label !== "-" || spec.value !== "-");
                }

                if (parsed && typeof parsed === "object") {
                  return Object.entries(parsed).map(([key, value]) => ({
                    label: key,
                    value: String(value ?? "-"),
                  }));
                }
              } catch {
                return [];
              }
            }

            // Object
            if (typeof value === "object" && value !== null) {
              return Object.entries(value).map(([key, value]) => ({
                label: key,
                value: String(value ?? "-"),
              }));
            }

            return [];
          })(),

          images: images.map((image) => apiHelper.getImageUrl(image)),
          image: data.mainImage ? apiHelper.getImageUrl(data.mainImage) : "",
          reviews_list: [],

          relatedProducts: [],
        };

        setProduct(mappedProduct);
        try {
          const relatedRes = await apiHelper.get(
            `/web/product/${data.id}/related?limit=6`,
          );
          const relatedData = relatedRes?.data?.data || relatedRes?.data || [];

          const mappedRelated = relatedData.map((item) => {
            const mrp = Number(item.mrp) || 0;
            const sellingPrice = Number(item.sellingPrice) || 0;
            return {
              id: item.id,
              name: item.productName,
              image: apiHelper.getImageUrl(item.mainImage),
              price: sellingPrice,
              oldPrice: mrp,
            };
          });

          setRelatedProducts(mappedRelated);
        } catch (err) {
          console.error("Failed to fetch related products:", err);
          setRelatedProducts([]);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);

        setError(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to load product",
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleWishlist = () => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/product/" + product.id);
      return;
    }

    const wasInWishlist = isInWishlist(product.id); // ✅
    toggleWishlist(product);

    if (wasInWishlist) {
      showWishlistRemovedToast(product.name);
    } else {
      showWishlistAddedToast(product.name);
    }
  };

  const scrollRelated = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollToPoint =
        direction === "left"
          ? scrollLeft - clientWidth / 2
          : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollToPoint, behavior: "smooth" });
    }
  };

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomStyle({
      display: "block",
      x: x,
      y: y,
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const checkCompatibility = () => {
    if (selectedVehicle) {
      setIsCompatible(true);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold">Product Not Found</h2>

        <p className="mt-2 text-gray-500">
          {error || "Product details are not available."}
        </p>

        <button
          type="button"
          onClick={() => navigate("/products")}
          className="mt-4 rounded-lg bg-green-600 px-5 py-2 text-white"
        >
          Back to Products
        </button>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 lg:mt-4">
      {/* Breadcrumb */}

      <div className="bg-white border-b border-gray-200">
        <div className="w-full xl:max-w-400 2xl:max-w-430 mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-green-600 cursor-pointer">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link
              to="/products"
              className="hover:text-green-600 cursor-pointer"
            >
              Products
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link
              to="/products?category=filters"
              className="hover:text-green-600 cursor-pointer"
            >
              Filters
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium truncate">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="w-full xl:max-w-400 2xl:max-w-430 mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 py-5">
        {/* Product Page Layout */}
        <div className=" flex items-center justify-end mb-3">
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
        </div>
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Column 1: Gallery Design */}
          {/* Column 1: Gallery - Hover Zoom on Image */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div
                ref={containerRef}
                className="relative aspect-square overflow-hidden bg-gray-100 cursor-zoom-in"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full transition-transform duration-200"
                  style={{
                    transform:
                      zoomStyle.display === "block" ? "scale(2)" : "scale(1)",
                    transformOrigin: `${zoomStyle.x || 50}% ${
                      zoomStyle.y || 50
                    }%`,
                  }}
                />

                <span className="absolute top-4 left-4 bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md z-20 pointer-events-none">
                  -{product.discount}%
                </span>
              </div>

              <div className="flex gap-2 justify-center p-3 border-t border-gray-100 bg-white overflow-x-auto">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(index);
                    }}
                    className={`w-16 h-16 border-2 rounded-lg p-1 bg-gray-50 flex items-center justify-center transition-all cursor-pointer shrink-0 overflow-hidden ${
                      selectedImage === index
                        ? "border-green-600 shadow-sm"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="max-w-full max-h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* Column 2: Product Info & Features */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm h-full flex flex-col">
              <div className="text-xs uppercase tracking-wider font-bold text-green-600 mb-2">
                {product.brand}
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-3 leading-snug">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Features Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                  Key Features
                </h3>
                {product.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 text-sm text-gray-600"
                  >
                    <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Compatibility Icons */}
              {/* Compatibility Icons */}
              <div className="mt-auto pt-4 border-t border-gray-100">
                <div className="flex flex-col gap-2 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-green-600 shrink-0" />
                    <span>{product.shipping}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw className="h-4 w-4 text-green-600 shrink-0" />
                    <span>{product.returns}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-600 shrink-0" />
                    <span>{product.warranty}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Right Actions & Product Details */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              {/* Price Tag styling */}
              <div className="mb-4 pb-4 border-b border-gray-100">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    {formatPrice(product.oldPrice)}
                  </span>
                </div>
                <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded mt-1 inline-block">
                  You save {product.discount}%
                </span>
              </div>

              {/* Product Details */}
              <div className="space-y-3 mb-4 pb-4 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Brand:</span>
                  <span className="text-xs font-semibold text-gray-900">
                    {product.brand}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Part Number:</span>
                  <span className="text-xs font-mono font-semibold text-gray-900">
                    {product.partNumber}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">OEM Number:</span>
                  <span className="text-xs font-mono font-semibold text-gray-900">
                    {product.oemNumber}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Country of Origin:
                  </span>
                  <span className="text-xs font-semibold text-gray-900">
                    {product.countryOfOrigin}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Availability:</span>
                  <span className="text-xs text-green-600 font-semibold">
                    In Stock
                  </span>
                </div>
              </div>

              {/* Action Controls Group */}
              {/* Action Controls Group */}
              <div className="space-y-3">
                {getCartQuantity(product.id) > 0 ? (
                  <>
                    {/* Already in cart - show quantity controls */}
                    <div className="flex items-center border border-green-600 rounded-lg bg-white">
                      <button
                        onClick={handleDecreaseQuantity}
                        className="p-3 hover:bg-green-50 text-green-600 cursor-pointer flex-1 flex items-center justify-center"
                      >
                        <Minus className="h-5 w-5" />
                      </button>
                      <span className="px-4 text-lg font-bold text-green-600 border-x border-green-200">
                        {getCartQuantity(product.id)}
                      </span>
                      <button
                        onClick={handleIncreaseQuantity}
                        className="p-3 hover:bg-green-50 text-green-600 cursor-pointer flex-1 flex items-center justify-center"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                    {/* Go to Cart button */}
                    <button
                      onClick={() => navigate("/cart")}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="h-4 w-4" /> Go to Cart
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      {/* Quantity Counter */}
                      <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="p-2.5 hover:bg-gray-50 text-gray-600 cursor-pointer"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-10 text-center font-semibold text-sm text-gray-900">
                          {quantity}
                        </span>
                        <button
                          onClick={() => {
                            const maxQty = getMaxOrderQuantity();

                            if (quantity >= maxQty) {
                              showErrorToast(
                                `Maximum order quantity is ${maxQty}. You cannot order more than ${maxQty} item${
                                  maxQty > 1 ? "s" : ""
                                }.`,
                              );
                              return;
                            }

                            setQuantity((prev) => prev + 1);
                          }}
                          className="p-2.5 hover:bg-gray-50 text-gray-600 cursor-pointer"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Add to Cart button */}
                      <button
                        onClick={handleAddToCart}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors cursor-pointer"
                      >
                        <ShoppingCart className="h-4 w-4" /> Add to Cart
                      </button>
                    </div>
                  </>
                )}

                {/* Wishlist + Share + Buy Now - All in one row */}
                <div className="flex gap-2">
                  {/* Wishlist - Icon only */}
                  <button
                    onClick={handleWishlist}
                    className={`flex items-center justify-center border py-2.5 px-3 rounded-lg transition-colors cursor-pointer ${
                      isInWishlist(product.id)
                        ? "border-green-600 bg-green-50 text-green-600"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        isInWishlist(product.id)
                          ? "fill-green-600 text-green-600"
                          : ""
                      }`}
                    />
                  </button>

                  {/* Share - Icon only */}
                  <button className="flex items-center justify-center border border-gray-300 text-gray-500 hover:text-gray-700 p-2.5 rounded-lg transition-colors cursor-pointer">
                    <Share2 className="h-5 w-5" />
                  </button>

                  {/* Buy Now */}
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
                  >
                    Buy
                  </button>
                </div>
              </div>
              {/* Service Badges */}
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-green-600" />
                  <span>{product.deliveryTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 text-green-600" />
                  <span>{product.returns}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>{product.warranty}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compatibility Check Bar */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-12 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg text-green-600">
              <Car className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                Check Vehicle Compatibility
              </h3>
              <p className="text-xs text-gray-500">
                Ensure this fits your exact production model year setup.
              </p>
            </div>
          </div>
          <div className="flex flex-1 max-w-md w-full gap-2">
            <div className="relative flex-1">
              <Listbox
                value={selectedVehicle}
                onChange={(value) => {
                  setSelectedVehicle(value);
                  setIsCompatible(null);
                }}
              >
                <div className="relative">
                  <Listbox.Button className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-left bg-white flex items-center justify-between shadow-sm outline-none cursor-pointer">
                    <span
                      className={
                        selectedVehicle ? "text-gray-900" : "text-gray-400"
                      }
                    >
                      {selectedVehicle || "Select Your Vehicle"}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </Listbox.Button>
                  <Listbox.Options className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto py-1 text-sm">
                    {product.compatibility.map((vehicle, index) => (
                      <Listbox.Option
                        key={index}
                        value={vehicle}
                        className={({ active }) =>
                          `cursor-pointer select-none px-4 py-2 ${
                            active
                              ? "bg-green-50 text-green-600"
                              : "text-gray-700"
                          }`
                        }
                      >
                        {vehicle}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>
            <button
              onClick={checkCompatibility}
              className="bg-green-600 hover:bg-green-700 text-white font-medium text-sm px-6 py-2 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Check
            </button>
          </div>
          {isCompatible && (
            <div className="text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg flex items-center gap-1 font-medium">
              <Check className="h-3.5 w-3.5" /> Exact Match
            </div>
          )}
        </div>

        {/* Bottom Tab Specification Sections */}
        <div className="mb-12">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50/50">
              <nav className="flex">
                {["description", "specifications", "reviews"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3.5 text-sm font-semibold border-b-2 capitalize transition-colors cursor-pointer ${
                      activeTab === tab
                        ? "border-green-600 text-green-600 bg-white"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab === "reviews" ? `Reviews (${product.reviews})` : tab}
                  </button>
                ))}
              </nav>
            </div>
            <div className="p-6">
              <div className="text-sm text-gray-600">
                {activeTab === "description" && (
                  <div className="max-w-4xl space-y-4">
                    <p className="leading-relaxed">{product.description}</p>
                    <div className="grid md:grid-cols-2 gap-3 pt-2">
                      {product.features.map((f, i) => (
                        <div
                          key={i}
                          className="flex gap-2 items-center text-sm bg-gray-50 p-3 rounded-lg"
                        >
                          <Check className="h-4 w-4 text-green-600 shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "specifications" && (
                  <div className="max-w-2xl border border-gray-200 rounded-lg overflow-hidden bg-white">
                    <table className="w-full border-collapse">
                      <tbody>
                        <tr className="bg-white">
                          <td className="px-4 py-3 font-medium text-gray-900 border-r border-gray-200 w-1/3">
                            Part Number
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {product.partNumber}
                          </td>
                        </tr>
                        <tr className="bg-gray-50/50">
                          <td className="px-4 py-3 font-medium text-gray-900 border-r border-gray-200 w-1/3">
                            OEM Number
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {product.oemNumber}
                          </td>
                        </tr>
                        <tr className="bg-white">
                          <td className="px-4 py-3 font-medium text-gray-900 border-r border-gray-200 w-1/3">
                            Country of Origin
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {product.countryOfOrigin}
                          </td>
                        </tr>
                        {product.specifications.map((spec, i) => (
                          <tr
                            key={i}
                            className={
                              i % 2 === 0 ? "bg-gray-50/50" : "bg-white"
                            }
                          >
                            <td className="px-4 py-3 font-medium text-gray-900 border-r border-gray-200 w-1/3">
                              {spec.label}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {spec.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="max-w-3xl space-y-6">
                    {product.reviews_list.map((review) => (
                      <div
                        key={review.id}
                        className="border border-gray-200 rounded-lg p-5"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-green-700">
                                {review.user.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <span className="font-semibold text-gray-900 block">
                                {review.user}
                              </span>
                              <div className="flex gap-0.5 mt-0.5">
                                {[...Array(review.rating)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-gray-400">
                            {review.date}
                          </span>
                        </div>
                        <h5 className="font-semibold text-gray-900 text-sm mb-2">
                          {review.title}
                        </h5>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {review.comment}
                        </p>
                        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
                          <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-green-600 cursor-pointer">
                            <ThumbsUp className="h-3.5 w-3.5" /> Helpful
                          </button>
                          <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-green-600 cursor-pointer">
                            <MessageCircle className="h-3.5 w-3.5" /> Reply
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      
        {/* Related Products Section */}
       {/* Related Products Section */}
{relatedProducts.length > 0 && (
  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm  mb-3">
    {/* Header */}
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-bold text-gray-900">
        Related Products
      </h2>

      <div className="flex items-center gap-3">
        <Link
          to="/products"
          className="text-sm font-semibold text-green-600 hover:text-green-700 cursor-pointer"
        >
          View All
        </Link>

        <div className="flex items-center gap-1">
          <button
            onClick={() => scrollRelated("left")}
            className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            onClick={() => scrollRelated("right")}
            className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>

    {/* Products */}
    <div
      ref={scrollRef}
      className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-1"
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {relatedProducts.map((related) => (
        <Link
          key={related.id}
          to={`/product/${related.id}`}
          className="
            min-w-[220px]
            md:min-w-[220px]
            lg:min-w-[230px]
            bg-white
            border border-gray-300
            rounded-xl
            p-3
            hover:border-green-400
            hover:shadow-md
            transition-all
            snap-start
            cursor-pointer
          "
        >
          {/* Product Image */}
          <div className="bg-gray-50 rounded-lg h-[180px] mb-3 p-3 flex items-center justify-center overflow-hidden">
            <img
              src={related.image}
              alt={related.name}
              className="h-[160px] w-[160px] object-contain"
            />
          </div>

          {/* Product Name */}
          <h3 className="text-sm font-semibold text-gray-900 hover:text-green-600 line-clamp-2 mb-2">
            {related.name}
          </h3>

          {/* Price */}
          <span className="text-base font-bold text-gray-900">
            {formatPrice(related.price)}
          </span>
        </Link>
      ))}
    </div>
  </div>
)}
      </div>
    </div>
  );
};

export default ProductDetail;
