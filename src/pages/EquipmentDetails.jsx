// components/EquipmentDetails.jsx
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Loader2,
  Heart,
  Share2,
  Phone,
  Mail,
  MapPin,
  Tag,
  Package,
  Shield,
  Clock,
  Star,
  StarHalf,
  Truck,
  Building2,
  User,
  MessagesSquare,
  FileText,
  Info,
  Gauge,
  Settings,
  Wrench,
  Calendar,
  Award,
  Eye,
  ShoppingCart,
  AlertCircle,
} from "lucide-react";
import EnquiryModal from "../components/EnquiryModal";

// ─── Helper Functions ──────────────────────────────────────────────────────
const hasValidValue = (value) => {
  return (
    value !== null &&
    value !== undefined &&
    value !== "" &&
    value !== "null" &&
    value !== "undefined" &&
    !(typeof value === "string" && value.trim() === "")
  );
};

// ─── Static Sample Data ────────────────────────────────────────────────────
const SAMPLE_EQUIPMENT = {
  id: "1",
  name: "New Vishwakarma Cutter Tokri Thresher",
  brand: "Shree Nath Trade Link",
  category: "Thresher",
  model: "Tokri Thresher Model",
  price: 85000,
  description:
    "The New Vishwakarma Cutter Tokri Thresher is a high-performance agricultural machine designed for efficient threshing of various crops. Easily driven with 35HP with overall weight machine is 22-23 Quintal. Suitable for Wheat, Mustard, Millet, Barley, Pigeon Pea, Gram, Bean, Kidney Bean, Peas. Output thresher is 24 quintal per hour approximate.",
  keyHighlights: [
    "35 HP Power Output",
    "22-23 Quintal Weight",
    "24 Quintal/Hour Output",
    "Multi-Crop Compatibility",
    "Heavy Duty Construction",
    "Easy Operation",
  ],
  specifications: {
    Power: "35 HP",
    Weight: "22-23 Quintal",
    Output: "24 Quintal/Hour",
    Crops: "Wheat, Mustard, Millet, Barley, Gram, Beans",
    Warranty: "1 Year",
    Condition: "New",
  },
  sellerName: "Shree Nath Trade Link",
  sellerType: "Wholesaler",
  sellerRating: 4.8,
  sellerReviews: 127,
  sellerSince: "2010",
  sellerPhone: "+91 98765 43210",
  sellerEmail: "info@shreenathtrade.com",
  stockStatus: "In Stock",
  warranty: "1 Year Manufacturer Warranty",
  delivery: "Free Delivery Available",
  images: [
    "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&auto=format&fit=crop&q=80",
  ],
  tags: ["Cutter", "Tokri", "Thresher", "Agriculture", "Farming"],
  location: "Punjab, India",
  year: "2024",
  hp: "35 HP",
};

// ─── Related Products ──────────────────────────────────────────────────────
const RELATED_EQUIPMENTS = [
  {
    id: "2",
    name: "Multicrop Thresher Pro",
    price: 95000,
    image:
      "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400&auto=format&fit=crop&q=80",
    location: "Haryana, India",
  },
  {
    id: "3",
    name: "Chaff Cutter Deluxe",
    price: 55000,
    image:
      "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400&auto=format&fit=crop&q=80",
    location: "Rajasthan, India",
  },
  {
    id: "4",
    name: "Maize Sheller Plus",
    price: 72000,
    image:
      "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400&auto=format&fit=crop&q=80",
    location: "Punjab, India",
  },
  {
    id: "5",
    name: "Paddy Thresher Max",
    price: 110000,
    image:
      "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400&auto=format&fit=crop&q=80",
    location: "Uttar Pradesh, India",
  },
];

// ─── Star Rating Component ──────────────────────────────────────────────────
const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400"
        />
      ))}
      {hasHalfStar && (
        <StarHalf className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star
          key={`empty-${i}`}
          className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300"
        />
      ))}
    </div>
  );
};

// ─── Pincode Checker ────────────────────────────────────────────────────────
const PincodeChecker = ({ equipmentId }) => {
  const [pincode, setPincode] = useState("");
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState(null);

  const handleCheck = async () => {
    if (!/^\d{6}$/.test(pincode)) {
      setResult({
        serviceable: false,
        message: "Enter a valid 6-digit pincode.",
      });
      return;
    }
    setChecking(true);
    setResult(null);
    try {
      await new Promise((r) => setTimeout(r, 600));
      setResult({
        serviceable: true,
        message: "Delivery available in your area.",
      });
    } catch (e) {
      setResult({ serviceable: false, message: "Could not check right now." });
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-200">
      <p className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-sm sm:text-base">
        <Truck className="w-4 h-4 text-green-600" />
        Check Delivery Availability
      </p>
      <div className="flex flex-row gap-0 border-2 border-gray-200 rounded-lg overflow-hidden focus-within:border-green-500 transition-colors">
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="Enter Pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
          className="flex-1 min-w-0 px-3 sm:px-4 py-2.5 text-sm outline-none bg-white"
        />
        <button
          onClick={handleCheck}
          disabled={checking}
          className="bg-green-700 hover:bg-green-800 text-white text-sm font-semibold px-4 sm:px-6 py-2.5 cursor-pointer disabled:opacity-60 transition-colors flex-shrink-0"
        >
          {checking ? (
            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
          ) : (
            "Check"
          )}
        </button>
      </div>
      {result && (
        <p
          className={`text-sm mt-2 flex items-center gap-1.5 ${
            result.serviceable ? "text-green-600" : "text-red-500"
          }`}
        >
          {result.serviceable ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <XCircle className="w-4 h-4" />
          )}
          {result.message}
        </p>
      )}
    </div>
  );
};

// ─── Detail Row Component ──────────────────────────────────────────────────
const DetailRow = ({ label, value, last = false }) => {
  if (!hasValidValue(value)) return null;

  return (
    <div
      className={`flex flex-col sm:flex-row sm:justify-between py-3 ${
        !last ? "border-b border-gray-100" : ""
      }`}
    >
      <span className="text-gray-500 text-sm">{label}</span>
      <span className="font-semibold text-gray-900 text-sm capitalize sm:text-right">
        {value}
      </span>
    </div>
  );
};

// ─── Section Card Component ────────────────────────────────────────────────
const SectionCard = ({ title, icon: Icon, children, className = "" }) => {
  let hasContent = false;

  if (children) {
    if (typeof children === "string" && children.trim() !== "") {
      hasContent = true;
    } else if (Array.isArray(children)) {
      hasContent = children.some((child) => {
        if (typeof child === "string" && child.trim() !== "") return true;
        if (child && typeof child === "object") {
          if (child.props && child.props.children) {
            if (
              typeof child.props.children === "string" &&
              child.props.children.trim() !== ""
            )
              return true;
            if (
              Array.isArray(child.props.children) &&
              child.props.children.length > 0
            )
              return true;
          }
          return true;
        }
        return false;
      });
    } else if (typeof children === "object" && children !== null) {
      hasContent = true;
    }
  }

  if (!hasContent) return null;

  return (
    <div
      className={`bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden ${className}`}
    >
      <div className="bg-green-600 px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-2">
        {Icon && <Icon size={18} className="text-white flex-shrink-0" />}
        <h3 className="text-base sm:text-lg font-bold text-white">{title}</h3>
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
};

// ─── Badge List Component ──────────────────────────────────────────────────
const BadgeList = ({ items }) => {
  const validItems = items?.filter((item) => hasValidValue(item)) || [];
  if (validItems.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {validItems.map((item, i) => (
        <span
          key={i}
          className="bg-green-50 text-green-700 border border-green-200 text-xs font-medium px-3 py-1.5 rounded-full"
        >
          {item}
        </span>
      ))}
    </div>
  );
};

// ─── Main Component ─────────────────────────────────────────────────────────
const EquipmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Static for now — replace with API call later
  const equipment = SAMPLE_EQUIPMENT;
  const relatedProducts = RELATED_EQUIPMENTS;

  const handleImageNav = (dir) => {
    setCurrentImage((prev) => {
      if (dir === "prev")
        return prev === 0 ? equipment.images.length - 1 : prev - 1;
      return (prev + 1) % equipment.images.length;
    });
  };

  // ─── Tab Content ──────────────────────────────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return <DescriptionTab equipment={equipment} />;
      case "specifications":
        return <SpecificationsTab equipment={equipment} />;
      case "seller":
        return <SellerTab equipment={equipment} />;
      default:
        return <DescriptionTab equipment={equipment} />;
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ── Top Sticky Header ── */}
      <div className="bg-white border-b border-gray-200 sticky top-[80px] sm:top-[80px] lg:top-[120px] z-40 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-10 py-2 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer flex-shrink-0"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
            <img
              src={equipment.images[0]}
              alt={equipment.name}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover flex-shrink-0 border border-gray-200"
            />
            <h1 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 truncate max-w-[120px] sm:max-w-[200px] lg:max-w-[300px]">
              {equipment.name}
            </h1>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="p-2 sm:p-2.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <Heart
                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
                }`}
              />
            </button>
            <button className="p-2 sm:p-2.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer hidden xs:inline-flex">
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
            <button
              onClick={() => setShowEnquiryModal(true)}
              className="bg-green-700 hover:bg-green-800 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2.5 rounded-lg cursor-pointer transition-colors flex-shrink-0 shadow-lg shadow-green-700/20 hover:shadow-green-700/30"
            >
              <span className="hidden sm:inline">Enquiry Now</span>
              <span className="sm:hidden">Enquiry</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-10 py-4 sm:py-6 mt-6  lg:mt-10">
        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 flex-wrap">
          <Link
            to="/"
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Home
          </Link>
          <span className="text-gray-300">/</span>
          <Link
            to="/equipment"
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Equipment
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-700 font-medium truncate max-w-[120px] sm:max-w-[200px]">
            {equipment.name}
          </span>
        </nav>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
          {/* LEFT - Image Gallery */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Main Image */}
              <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                <img
                  src={equipment.images[currentImage]}
                  alt={equipment.name}
                  className="w-full h-full object-contain p-2 sm:p-4"
                />
                {equipment.images.length > 1 && (
                  <>
                    <button
                      onClick={() => handleImageNav("prev")}
                      className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white cursor-pointer transition-colors"
                    >
                      <ChevronLeft className="text-gray-700" size={18} />
                    </button>
                    <button
                      onClick={() => handleImageNav("next")}
                      className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white cursor-pointer transition-colors"
                    >
                      <ChevronRight className="text-gray-700" size={18} />
                    </button>
                  </>
                )}
                <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-black/60 text-white text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full z-20">
                  {currentImage + 1} of {equipment.images.length}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-1.5 sm:gap-2 p-2 sm:p-3 overflow-x-auto">
                {equipment.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`w-14 h-12 sm:w-20 sm:h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                      currentImage === index
                        ? "border-green-500 shadow-md"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT - Product Info */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 lg:p-8 sticky top-20 sm:top-24">
              {/* Stock & Warranty Badges */}
              <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-sm font-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full ${
                    equipment.stockStatus === "In Stock"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-600 border border-red-200"
                  }`}
                >
                  {equipment.stockStatus === "In Stock" ? (
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  ) : (
                    <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  )}
                  {equipment.stockStatus}
                </span>
                {equipment.warranty && (
                  <span className="inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-sm font-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">
                      {equipment.warranty}
                    </span>
                    <span className="xs:hidden">Warranty</span>
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight">
                {equipment.name}
              </h1>

              {/* Brand & Category */}
              <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                <span className="text-xs sm:text-sm text-gray-500">by</span>
                <span className="text-xs sm:text-sm font-semibold text-green-700">
                  {equipment.brand}
                </span>
                <span className="text-gray-300">|</span>
                <span className="text-xs sm:text-sm bg-gray-100 text-gray-700 px-1.5 sm:px-2 py-0.5 rounded">
                  {equipment.category}
                </span>
              </div>

              {/* Price */}
              <div className="mb-3 sm:mb-4">
                <p className="text-2xl sm:text-3xl font-black text-green-700">
                  ₹{equipment.price.toLocaleString()}
                </p>
                <p className="text-[10px] sm:text-sm text-gray-500">
                  Inclusive of all taxes
                </p>
              </div>

              {/* Quick Specs Grid */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
                {equipment.hp && (
                  <div className="bg-gray-50 rounded-xl p-2 sm:p-3 flex flex-col items-center justify-center border border-gray-100">
                    <Gauge className="text-gray-600 mb-0.5 sm:mb-1" size={16} />
                    <p className="text-[10px] sm:text-xs font-semibold text-gray-900">
                      {equipment.hp}
                    </p>
                    <p className="text-[8px] sm:text-[10px] text-gray-500">
                      Power
                    </p>
                  </div>
                )}
                {equipment.year && (
                  <div className="bg-gray-50 rounded-xl p-2 sm:p-3 flex flex-col items-center justify-center border border-gray-100">
                    <Calendar
                      className="text-gray-600 mb-0.5 sm:mb-1"
                      size={16}
                    />
                    <p className="text-[10px] sm:text-xs font-semibold text-gray-900">
                      {equipment.year}
                    </p>
                    <p className="text-[8px] sm:text-[10px] text-gray-500">
                      Year
                    </p>
                  </div>
                )}
                {equipment.location && (
                  <div className="bg-gray-50 rounded-xl p-2 sm:p-3 flex flex-col items-center justify-center border border-gray-100">
                    <MapPin
                      className="text-gray-600 mb-0.5 sm:mb-1"
                      size={16}
                    />
                    <p className="text-[10px] sm:text-xs font-semibold text-gray-900 truncate max-w-[40px] sm:max-w-[60px]">
                      {equipment.location}
                    </p>
                    <p className="text-[8px] sm:text-[10px] text-gray-500">
                      Location
                    </p>
                  </div>
                )}
              </div>

              {/* Seller Info */}
              {equipment.sellerName && (
                <div className="bg-gray-50 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 border border-gray-200">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-700" />
                      </div>
                      <div>
                        <p className="text-sm sm:text-base font-semibold text-gray-900">
                          {equipment.sellerName}
                        </p>
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                          <span className="text-xs sm:text-sm text-gray-500">
                            {equipment.sellerType}
                          </span>
                          {equipment.sellerSince && (
                            <span className="text-[10px] sm:text-xs text-gray-400">
                              Since {equipment.sellerSince}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-0.5 sm:gap-1">
                        <StarRating rating={equipment.sellerRating || 4.5} />
                        <span className="text-xs sm:text-sm font-semibold text-gray-700">
                          {equipment.sellerRating || 4.5}
                        </span>
                      </div>
                      <p className="text-[10px] sm:text-xs text-gray-500">
                        {equipment.sellerReviews || 0} Reviews
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Delivery Info */}
              {equipment.delivery && (
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                  <Truck className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span>{equipment.delivery}</span>
                </div>
              )}

              {/* Pincode Checker */}
              <PincodeChecker equipmentId={id} />

              {/* Action Buttons */}
              <div className="flex flex-row gap-2 sm:gap-3 mt-3 sm:mt-4">
                <button
                  onClick={() => setShowEnquiryModal(true)}
                  className="flex-1 min-w-0 bg-green-700 hover:bg-green-800 text-white font-semibold py-3 sm:py-3.5 rounded-xl cursor-pointer transition-colors shadow-lg shadow-green-700/20 hover:shadow-green-700/30 flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-base px-2"
                >
                  <MessagesSquare className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="hidden xs:inline">Get Best Price</span>
                  <span className="xs:hidden">Enquire</span>
                </button>
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`flex-1 min-w-0 py-3 sm:py-3.5 rounded-xl font-semibold border-2 cursor-pointer transition-colors flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-base px-2 ${
                    isWishlisted
                      ? "bg-red-50 border-red-500 text-red-600"
                      : "bg-white border-gray-300 text-gray-700 hover:border-green-500 hover:text-green-600"
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${
                      isWishlisted ? "fill-red-500" : ""
                    }`}
                  />
                  <span className="hidden xs:inline">
                    {isWishlisted ? "Added to Wishlist" : "Add to Wishlist"}
                  </span>
                  <span className="xs:hidden">
                    {isWishlisted ? "Wishlisted" : "Wishlist"}
                  </span>
                </button>
              </div>
              {/* Tags */}
              {equipment.tags && equipment.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                  <span className="text-xs sm:text-sm font-medium text-gray-600">
                    Tags:
                  </span>
                  {equipment.tags.map((tag) => (
                    <Link
                      key={tag}
                      to={`/equipment?tag=${encodeURIComponent(tag)}`}
                      className="text-[10px] sm:text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Tabs Section ── */}
        <div className="mt-6 sm:mt-8">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Tab Headers */}
            <div className="border-b border-gray-200 overflow-x-auto">
              <div className="flex min-w-max">
                {[
                  { id: "description", label: "Description", icon: FileText },
                  {
                    id: "specifications",
                    label: "Specifications",
                    icon: Settings,
                  },
                  { id: "seller", label: "Seller Details", icon: Building2 },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap ${
                      activeTab === tab.id
                        ? "border-green-600 text-green-700 bg-green-50/50"
                        : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <tab.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">{tab.label}</span>
                    <span className="xs:hidden">
                      {tab.id === "description"
                        ? "Desc"
                        : tab.id === "specifications"
                        ? "Specs"
                        : "Seller"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-3 sm:p-4 lg:p-6">{renderTabContent()}</div>
          </div>
        </div>

        {/* ── Related Products ── */}
        {relatedProducts.length > 0 && (
          <div className="mt-8 sm:mt-12 mb-10">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
              <div className="h-1 w-6 sm:w-10 bg-green-600 rounded-full"></div>
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
                Related <span className="text-green-600">Equipment</span>
              </h2>
              <div className="flex-1 h-px bg-gray-200 hidden sm:block"></div>
              <Link
                to="/equipment"
                className="text-xs sm:text-sm font-semibold text-green-600 hover:text-green-700 flex items-center gap-1 transition-colors ml-auto sm:ml-0"
              >
                View All
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {relatedProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/equipment/${product.id}`}
                  className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-green-300 transition-all duration-300"
                >
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/20">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-900 font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow-lg hover:bg-white transition-all transform group-hover:scale-105 flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-sm">
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        Quick View
                      </span>
                    </div>
                  </div>
                  <div className="p-2 sm:p-4">
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2 mb-1 sm:mb-1.5">
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs text-gray-500 mb-1 sm:mb-2">
                      <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                      <span className="truncate">{product.location}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1.5 sm:pt-2 border-t border-gray-100">
                      <p className="text-xs sm:text-base font-bold text-gray-900">
                        ₹{product.price.toLocaleString()}
                      </p>
                      <button
                        className="bg-green-600 hover:bg-green-700 text-white text-[10px] sm:text-xs font-semibold px-2 sm:px-4 py-1 sm:py-2 rounded-lg transition-all duration-200 flex items-center gap-1 sm:gap-1.5 shadow-md hover:shadow-lg transform hover:scale-105"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <ShoppingCart className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                        <span className="hidden xs:inline">Add</span>
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={showEnquiryModal}
        enquiryMode="new"
        websiteVariantId={id}
        onClose={() => setShowEnquiryModal(false)}
      />
    </div>
  );
};

// ─── Tab Components ──────────────────────────────────────────────────────

// 1. Description Tab
const DescriptionTab = ({ equipment }) => (
  <div className="grid grid-cols-1 gap-3 sm:gap-4">
    <SectionCard title="Description" icon={Info}>
      <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
        {equipment.description}
      </p>
    </SectionCard>

    {equipment.keyHighlights && equipment.keyHighlights.length > 0 && (
      <SectionCard title="Key Highlights" icon={Award}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          {equipment.keyHighlights.map((highlight, index) => (
            <div key={index} className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700">{highlight}</span>
            </div>
          ))}
        </div>
      </SectionCard>
    )}
  </div>
);

// 2. Specifications Tab
const SpecificationsTab = ({ equipment }) => (
  <SectionCard title="Specifications" icon={Settings}>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
      {Object.entries(equipment.specifications || {}).map(
        ([key, value], index, arr) => (
          <DetailRow
            key={key}
            label={key}
            value={value}
            last={index === arr.length - 1}
          />
        ),
      )}
    </div>
  </SectionCard>
);

// 3. Seller Tab
const SellerTab = ({ equipment }) => (
  <div className="grid grid-cols-1 gap-3 sm:gap-4">
    <SectionCard title="Seller Information" icon={Building2}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
          <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-green-700" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900">
            {equipment.sellerName}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500">
            {equipment.sellerType}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4">
        {equipment.sellerSince && (
          <div className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-200">
            <p className="text-xs sm:text-sm text-gray-500">Since</p>
            <p className="font-semibold text-gray-900">
              {equipment.sellerSince}
            </p>
          </div>
        )}
        {equipment.sellerRating && (
          <div className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-200">
            <p className="text-xs sm:text-sm text-gray-500">Rating</p>
            <div className="flex items-center gap-2">
              <StarRating rating={equipment.sellerRating} />
              <span className="font-semibold text-gray-900">
                {equipment.sellerRating}
              </span>
            </div>
          </div>
        )}
        {equipment.sellerReviews && (
          <div className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-200">
            <p className="text-xs sm:text-sm text-gray-500">Reviews</p>
            <p className="font-semibold text-gray-900">
              {equipment.sellerReviews}
            </p>
          </div>
        )}
      </div>

      {(equipment.sellerPhone || equipment.sellerEmail) && (
        <div className="border-t border-gray-200 pt-3 sm:pt-4">
          <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
            Contact Details
          </p>
          {equipment.sellerPhone && (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mb-1">
              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
              <span className="break-all">{equipment.sellerPhone}</span>
            </div>
          )}
          {equipment.sellerEmail && (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
              <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
              <span className="break-all">{equipment.sellerEmail}</span>
            </div>
          )}
        </div>
      )}
    </SectionCard>
  </div>
);

export default EquipmentDetails;
