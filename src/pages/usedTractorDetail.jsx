// components/TractorDetails.jsx
import { useState, useEffect, useRef } from "react";
import {
  Heart,
  Share2,
  Phone,
  ChevronLeft,
  ChevronRight,
  Settings,
  Gauge,
  GitBranch,
  MapPin,
  Zap,
  Droplets,
  Wind,
  Wrench,
  DollarSign,
  Tag,
  CheckCircle,
  XCircle,
  Info,
  Package,
  Cog,
  Store,
  Fuel,
  Weight,
  Ruler,
  AlertCircle,
  Loader2,
  Calendar,
  Award,
  Truck,
  Shield,
  Star,
  User,
  Calendar as CalendarIcon,
  MessageSquare,
  ThumbsUp,
  Eye,
  ShoppingCart,
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import EnquiryModal from "../components/EnquiryModal";
import apiHelper from "../utils/apiHelper";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";

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

// Format date to show only year
const formatLaunchYear = (dateValue) => {
  if (!hasValidValue(dateValue)) return null;
  try {
    const date = new Date(dateValue);
    if (!isNaN(date.getTime())) {
      return date.getFullYear().toString();
    }
    return dateValue;
  } catch (e) {
    return dateValue;
  }
};

// Format stock status to display nicely
const formatStockStatus = (status) => {
  if (!hasValidValue(status)) return null;
  const statusMap = {
    in_stock: "In Stock",
    "in-stock": "In Stock",
    instock: "In Stock",
    available: "Available",
    out_of_stock: "Out of Stock",
    "out-of-stock": "Out of Stock",
    outofstock: "Out of Stock",
    unavailable: "Unavailable",
    draft: "Draft",
    DRAFT: "Draft",
  };
  return statusMap[status.toLowerCase()] || status;
};

// Get stock status color
const getStockStatusColor = (status) => {
  if (!hasValidValue(status))
    return "bg-gray-100 text-gray-600 border-gray-200";
  const statusLower = status.toLowerCase();
  if (
    statusLower === "in_stock" ||
    statusLower === "in-stock" ||
    statusLower === "instock" ||
    statusLower === "available"
  ) {
    return "bg-green-50 text-green-700 border-green-200";
  }
  return "bg-yellow-50 text-yellow-700 border-yellow-200";
};

// Helper to check multiple possible field names
const getFieldValue = (obj, fieldNames) => {
  for (const field of fieldNames) {
    if (hasValidValue(obj[field])) {
      return obj[field];
    }
  }
  return null;
};

const DetailRow = ({ label, value, last = false }) => {
  if (!hasValidValue(value)) return null;

  return (
    <div
      className={`flex justify-between py-3 ${!last ? "border-b border-gray-400" : ""}`}
    >
      <span className="text-gray-500 text-sm">{label}</span>
      <span className="font-semibold text-gray-900 text-sm capitalize text-right max-w-[55%]">
        {value}
      </span>
    </div>
  );
};

const SectionCard = ({ title, icon: Icon, children, className = "" }) => {
  // Check if children have any valid content
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
      className={`bg-white rounded-2xl border border-gray-400 shadow-sm overflow-hidden ${className}`}
    >
      {/* Green Header Section */}
      <div className="bg-green-600 px-6 py-4 flex items-center gap-2">
        {Icon && <Icon size={18} className="text-white" />}
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>

      {/* White Content Section */}
      <div className="p-6">{children}</div>
    </div>
  );
};

const BadgeList = ({ items }) => {
  // Filter out any invalid items
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

const ColorDot = ({ color }) => {
  if (!hasValidValue(color)) return null;

  const colorMap = {
    Red: "#ef4444",
    Blue: "#3b82f6",
    Green: "#22c55e",
    Yellow: "#eab308",
    Orange: "#f97316",
    Black: "#111827",
    White: "#f9fafb",
    Grey: "#6b7280",
    Custom: "linear-gradient(135deg,#22c55e,#3b82f6,#ef4444)",
  };
  const bg = colorMap[color] || "#d1d5db";
  return (
    <div className="flex items-center gap-1.5">
      <div
        className="w-5 h-5 rounded-full border border-gray-300 flex-shrink-0"
        style={{ background: bg }}
      />
      <span className="text-xs text-gray-600">{color}</span>
    </div>
  );
};

// ─── Tab Configuration ─────────────────────────────────────────────────────
const TABS = [
  { id: "description", label: "Description" },
  { id: "basic", label: "Basic Info" },
  { id: "specifications", label: "Specifications" },
  { id: "inspection", label: "Inspection" },
  { id: "tyres", label: "Tyres" },
  { id: "hydraulic", label: "Hydraulic & PTO" },
  { id: "attachments", label: "Attachments" },
  { id: "pricing", label: "Pricing" },
  { id: "location", label: "Location" },
];

// ─── Review Components ──────────────────────────────────────────────────────

// Star Rating Component
const StarRating = ({
  rating,
  onRatingChange,
  readonly = false,
  size = "md",
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const stars = [1, 2, 3, 4, 5];

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-8 h-8",
  };

  return (
    <div className="flex gap-1">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onRatingChange(star)}
          onMouseEnter={() => !readonly && setHoverRating(star)}
          onMouseLeave={() => !readonly && setHoverRating(0)}
          className={`${!readonly && "cursor-pointer"} focus:outline-none transition-transform ${!readonly && "hover:scale-110"}`}
          disabled={readonly}
        >
          <Star
            className={`${sizeClasses[size]} ${
              (hoverRating || rating) >= star
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );
};

// Single Review Card
const ReviewCard = ({ review }) => {
  const formatDate = (date) => {
    if (!date) return "Recent";
    try {
      const d = new Date(date);
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Recent";
    }
  };

  return (
    <div className="border-b border-gray-100 last:border-0 py-4 first:pt-0">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-semibold text-sm">
            {review.userName?.charAt(0)?.toUpperCase() || "U"}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h4 className="font-semibold text-gray-900 text-sm">
              {review.userName || "Anonymous User"}
            </h4>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <CalendarIcon className="w-3 h-3" />
              {formatDate(review.createdAt)}
            </span>
          </div>
          <StarRating rating={review.rating} readonly size="sm" />
          {review.comment && (
            <p className="text-gray-600 text-sm mt-1.5 leading-relaxed">
              {review.comment}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Reviews Section Component
const ReviewsSection = ({ tractorId }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [userName, setUserName] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch Reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        // Replace with your actual API call
        // const response = await apiHelper.get(`/reviews/tractor/${tractorId}`);
        // setReviews(response.data);

        // Sample data
        setTimeout(() => {
          setReviews([
            {
              id: 1,
              userName: "Rajesh Kumar",
              rating: 5,
              comment:
                "Excellent tractor! Great performance and fuel efficiency. Perfect for my farm.",
              createdAt: "2026-06-15T10:30:00",
            },
            {
              id: 2,
              userName: "Priya Singh",
              rating: 4,
              comment:
                "Good value for money. Smooth transmission and powerful engine.",
              createdAt: "2026-06-10T14:20:00",
            },
            {
              id: 3,
              userName: "Amit Patel",
              rating: 5,
              comment:
                "Best investment for my farm. After-sales service is excellent.",
              createdAt: "2026-06-05T09:15:00",
            },
          ]);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setError("Failed to load reviews");
        setLoading(false);
      }
    };
    fetchReviews();
  }, [tractorId]);

  // Submit Review
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }
    if (!comment.trim()) {
      setError("Please write a review comment");
      return;
    }
    if (comment.trim().length < 10) {
      setError("Review must be at least 10 characters");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      // Replace with your actual API call
      // await apiHelper.post('/reviews/tractor', {
      //   tractorId,
      //   userName: userName.trim() || "Anonymous",
      //   rating,
      //   comment: comment.trim()
      // });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newReview = {
        id: Date.now(),
        userName: userName.trim() || "Anonymous User",
        rating,
        comment: comment.trim(),
        createdAt: new Date().toISOString(),
      };

      setReviews([newReview, ...reviews]);
      setSuccessMessage("Thank you! Your review has been submitted.");
      setRating(0);
      setUserName("");
      setComment("");

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error submitting review:", error);
      setError("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate Statistics
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
      : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Customer <span className="text-green-600">Reviews</span>
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        What our customers say about this tractor
      </p>

      {/* Two-column layout: reviews on left, form on right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* LEFT COLUMN: Summary + All Reviews */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-3 pb-6 border-b border-gray-100">
            <div className="text-4xl font-bold text-gray-900">
              {averageRating.toFixed(1)}
            </div>
            <div>
              <StarRating rating={averageRating} readonly size="md" />
              <p className="text-sm text-gray-500 mt-1">
                Based on {totalReviews}{" "}
                {totalReviews === 1 ? "review" : "reviews"}
              </p>
            </div>
          </div>

          <div className="pt-6">
            {reviews.length > 0 ? (
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">
                  All Reviews ({reviews.length})
                </h4>
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-300 mb-3">
                  <Star className="w-12 h-12 mx-auto" />
                </div>
                <p className="text-gray-500">No reviews yet.</p>
                <p className="text-gray-400 text-sm mt-1">
                  Be the first to review this tractor!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Review Form */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Write a Review
          </h3>

          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating <span className="text-red-500">*</span>
              </label>
              <StarRating
                rating={rating}
                onRatingChange={setRating}
                size="lg"
              />
              {rating === 0 && error && (
                <p className="text-red-500 text-xs mt-1">
                  Please select a rating
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Review <span className="text-red-500">*</span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this tractor..."
                rows="4"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none"
              />
              {comment && comment.length < 10 && (
                <p className="text-red-500 text-xs mt-1">
                  Minimum 10 characters required
                </p>
              )}
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>

            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <p className="text-green-700 text-sm">{successMessage}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </span>
              ) : (
                "Submit Review"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────
const UsedTractorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("description");
  const [relatedIndex, setRelatedIndex] = useState(0);
  const intervalRef = useRef(null);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const relatedScrollRef = useRef(null);
  const [isScrollingRelated, setIsScrollingRelated] = useState(false);
  const scrollTimeoutRef = useRef(null);
  const containerRef = useRef(null);
  const [zoomStyle, setZoomStyle] = useState({ display: "none", x: 50, y: 50 });
  const [tractorData, setTractorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ─── Fetch Data ──────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
       const response = await apiHelper.get(
  `/vendor-web/used-website-variant/public/${id}`,
);
        setTractorData(response.data);
      } catch (error) {
        console.error("Error fetching tractor data:", error);
        setError(error.message || "Failed to load tractor details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // ─── Process Images ─────────────────────────────────────────────────────
  const imageUrls = tractorData
    ? [
        tractorData.frontView,
        tractorData.leftView,
        tractorData.rightView,
        tractorData.rearView,
        tractorData.engineView,
        tractorData.dashboardView,
        tractorData.tyreView,
        tractorData.hydraulicView,
        tractorData.ptoView,
        tractorData.chassisNumberImage,
        tractorData.rcBook,
        tractorData.additionalImage1,
        tractorData.additionalImage2,
        tractorData.additionalImage3,
        tractorData.additionalImage4,
        tractorData.additionalImage5,
      ]
        .filter((img) => hasValidValue(img))
        .map((img) => apiHelper.image(img))
    : [];

  const finalImages = imageUrls.length > 0 ? imageUrls : ["/mah.png"];

  // ─── Process Data ────────────────────────────────────────────────────────
  const d = tractorData || {};

  // Key highlights - using available fields
  const keyHighlights = [
    d.highlight1,
    d.highlight2,
    d.highlight3,
    d.highlight4,
    d.highlight5,
  ].filter((h) => hasValidValue(h));

  // Available colors
  const displayColors = [
    d.redColor ? "Red" : null,
    d.blueColor ? "Blue" : null,
    d.greenColor ? "Green" : null,
    d.orangeColor ? "Orange" : null,
    d.blackColor ? "Black" : null,
    d.whiteColor ? "White" : null,
    d.customColor ? d.customColorName || "Custom" : null,
  ].filter((c) => c !== null && c !== undefined && c !== "");

  // Attachments
  const attachments = [
    d.rotavator ? "Rotavator" : null,
    d.cultivator ? "Cultivator" : null,
    d.trailer ? "Trailer" : null,
    d.trolley ? "Trolley" : null,
    d.mbPlough ? "MB Plough" : null,
    d.seedDrill ? "Seed Drill" : null,
    d.sprayer ? "Sprayer" : null,
    d.dozer ? "Dozer" : null,
    d.loader ? "Loader" : null,
  ].filter(Boolean);

  // ─── Tractor Object ──────────────────────────────────────────────────────
  const tractor = {
    // Basic Info
    name: hasValidValue(d.productName) ? d.productName : "Swaraj 744 FE",
    category: hasValidValue(d.category?.categoryName)
      ? d.category.categoryName
      : "Tractor",
    brand: hasValidValue(d.brand) ? d.brand : "Unknown",
    model: hasValidValue(d.model) ? d.model : "Unknown",
    variant: hasValidValue(d.variant) ? d.variant : "Unknown",
    variantCode: hasValidValue(d.variantCode) ? d.variantCode : null,
    status: hasValidValue(d.status) ? d.status : "DRAFT",
    isCompleted: d.isCompleted || false,

    // Pricing
    price: hasValidValue(d.expectedPrice)
      ? `₹ ${Number(d.expectedPrice).toLocaleString("en-IN")}`
      : "₹ 2,65,000",
    expectedPrice: d.expectedPrice || null,
    financeAvailable: hasValidValue(d.financeAvailable)
      ? d.financeAvailable
      : null,
    exchangeOffer: hasValidValue(d.exchangeOffer) ? d.exchangeOffer : null,
    negotiable: hasValidValue(d.negotiable) ? d.negotiable : null,

    // Specs
    hp: hasValidValue(d.hp) ? `${d.hp} HP` : "45 HP",
    fuelType: hasValidValue(d.fuelType) ? d.fuelType : "Diesel",
    driveType: hasValidValue(d.driveType) ? d.driveType : "2 WD",
    tractorCategory: hasValidValue(d.tractorCategory)
      ? d.tractorCategory
      : null,
    manufacturingYear: hasValidValue(d.manufacturingYear)
      ? d.manufacturingYear
      : null,
    purchaseYear: hasValidValue(d.purchaseYear) ? d.purchaseYear : null,
    hoursMeterReading: hasValidValue(d.hoursMeterReading)
      ? d.hoursMeterReading
      : null,
    approxWorkingHours: hasValidValue(d.approxWorkingHours)
      ? d.approxWorkingHours
      : null,
    acresWorked: hasValidValue(d.acresWorked) ? d.acresWorked : null,

    // Registration
    rcRegistrationNumber: hasValidValue(d.rcRegistrationNumber)
      ? d.rcRegistrationNumber
      : null,
    engineNumber: hasValidValue(d.engineNumber) ? d.engineNumber : null,
    chassisNumber: hasValidValue(d.chassisNumber) ? d.chassisNumber : null,
    chassisNumberImage: hasValidValue(d.chassisNumberImage)
      ? apiHelper.image(d.chassisNumberImage)
      : null,
    rcBook: hasValidValue(d.rcBook) ? apiHelper.image(d.rcBook) : null,

    // Ownership
    ownership: hasValidValue(d.ownership) ? d.ownership : null,
    ownerType: hasValidValue(d.ownerType) ? d.ownerType : null,
    firstOwner: hasValidValue(d.firstOwner) ? d.firstOwner : null,
    secondOwner: hasValidValue(d.secondOwner) ? d.secondOwner : null,
    thirdOwner: hasValidValue(d.thirdOwner) ? d.thirdOwner : null,
    sellerType: hasValidValue(d.sellerType) ? d.sellerType : null,
    ownershipProofAvailable: d.ownershipProofAvailable || false,
    purpose: hasValidValue(d.purpose) ? d.purpose : null,

    // Engine Details
    engineSelfStart: hasValidValue(d.engineSelfStart)
      ? d.engineSelfStart
      : null,
    engineColdStart: hasValidValue(d.engineColdStart)
      ? d.engineColdStart
      : null,
    engineSmoke: hasValidValue(d.engineSmoke) ? d.engineSmoke : null,
    engineSound: hasValidValue(d.engineSound) ? d.engineSound : null,
    engineOilLeakage: hasValidValue(d.engineOilLeakage)
      ? d.engineOilLeakage
      : null,

    // Vehicle Inspection
    overallCondition: hasValidValue(d.overallCondition)
      ? d.overallCondition
      : null,
    clutchCondition: hasValidValue(d.clutchCondition)
      ? d.clutchCondition
      : null,
    gearboxCondition: hasValidValue(d.gearboxCondition)
      ? d.gearboxCondition
      : null,
    steeringType: hasValidValue(d.steeringType) ? d.steeringType : null,
    steeringCondition: hasValidValue(d.steeringCondition)
      ? d.steeringCondition
      : null,
    brakesCondition: hasValidValue(d.brakesCondition)
      ? d.brakesCondition
      : null,
    batteryCondition: hasValidValue(d.batteryCondition)
      ? d.batteryCondition
      : null,

    // Lights
    lightsHeadLight: d.lightsHeadLight || false,
    lightsIndicator: d.lightsIndicator || false,
    lightsTailLight: d.lightsTailLight || false,
    lightsHorn: d.lightsHorn || false,

    // Tyres
    frontTyreBrand: hasValidValue(d.frontTyreBrand) ? d.frontTyreBrand : null,
    frontTyreRemainingPercent: hasValidValue(d.frontTyreRemainingPercent)
      ? `${d.frontTyreRemainingPercent}%`
      : null,
    frontTyreCondition: hasValidValue(d.frontTyreCondition)
      ? d.frontTyreCondition
      : null,
    rearTyreBrand: hasValidValue(d.rearTyreBrand) ? d.rearTyreBrand : null,
    rearTyreRemainingPercent: hasValidValue(d.rearTyreRemainingPercent)
      ? `${d.rearTyreRemainingPercent}%`
      : null,
    rearTyreCondition: hasValidValue(d.rearTyreCondition)
      ? d.rearTyreCondition
      : null,

    // Hydraulic
    hydraulicLiftWorking: hasValidValue(d.hydraulicLiftWorking)
      ? d.hydraulicLiftWorking
      : null,
    hydraulicCondition: hasValidValue(d.hydraulicCondition)
      ? d.hydraulicCondition
      : null,

    // PTO
    ptoStatus: hasValidValue(d.ptoStatus) ? d.ptoStatus : null,

    // Attachments
    attachments: attachments,

    // Service History
    lastServiceDate: hasValidValue(d.lastServiceDate)
      ? new Date(d.lastServiceDate).toLocaleDateString()
      : null,
    engineOverhauled: hasValidValue(d.engineOverhauled)
      ? d.engineOverhauled
      : null,
    gearboxRepaired: hasValidValue(d.gearboxRepaired)
      ? d.gearboxRepaired
      : null,
    clutchChanged: hasValidValue(d.clutchChanged) ? d.clutchChanged : null,
    tyresChanged: hasValidValue(d.tyresChanged) ? d.tyresChanged : null,
    batteryChanged: hasValidValue(d.batteryChanged) ? d.batteryChanged : null,

    // Accident Details
    accident: hasValidValue(d.accident) ? d.accident : null,
    floodDamage: hasValidValue(d.floodDamage) ? d.floodDamage : null,

    // Insurance
    insurance: hasValidValue(d.insurance) ? d.insurance : null,
    insuranceExpiryDate: hasValidValue(d.insuranceExpiryDate)
      ? new Date(d.insuranceExpiryDate).toLocaleDateString()
      : null,

    // Finance
    finance: hasValidValue(d.finance) ? d.finance : null,
    financeCompany: hasValidValue(d.financeCompany) ? d.financeCompany : null,
    outstandingAmount: hasValidValue(d.outstandingAmount)
      ? `₹ ${Number(d.outstandingAmount).toLocaleString("en-IN")}`
      : null,

    // Location
    country: hasValidValue(d.country) ? d.country : null,
    state: hasValidValue(d.state) ? d.state : null,
    district: hasValidValue(d.district) ? d.district : null,
    taluka: hasValidValue(d.taluka) ? d.taluka : null,
    city: hasValidValue(d.city) ? d.city : null,
    pincode: hasValidValue(d.pincode) ? d.pincode : null,
    landmark: hasValidValue(d.landmark) ? d.landmark : null,
    fullAddress: hasValidValue(d.fullAddress) ? d.fullAddress : null,
    latitude: hasValidValue(d.latitude) ? d.latitude : null,
    longitude: hasValidValue(d.longitude) ? d.longitude : null,

    // Available Dealers/States
    availableStates: d.availableStates || [],
    availableDistricts: d.availableDistricts || [],
    availableDealers: d.availableDealers || [],

    // Documents
    brochure: hasValidValue(d.brochure) ? apiHelper.image(d.brochure) : null,
    warrantyCard: hasValidValue(d.warrantyCard)
      ? apiHelper.image(d.warrantyCard)
      : null,
    insuranceCertificate: hasValidValue(d.insuranceCertificate)
      ? apiHelper.image(d.insuranceCertificate)
      : null,
    invoice: hasValidValue(d.invoice) ? apiHelper.image(d.invoice) : null,
    others: hasValidValue(d.others) ? apiHelper.image(d.others) : null,

    // Similar & Related Products (sample data - you should fetch from API)
    images: finalImages,
    phone: "12345 67890", // This should come from vendor or user data
    description: hasValidValue(d.description)
      ? d.description
      : "Used Tractor in excellent condition",

   similar:
  (d.similarProducts || []).map((item) => ({
    id: item.id,
    name: item.productName,
    location: item.city,
    price: `₹ ${Number(item.expectedPrice || 0).toLocaleString("en-IN")}`,
    image: item.frontView
      ? apiHelper.image(item.frontView)
      : "/mah.png",
  })),
   relatedProducts:
  (d.relatedProducts || []).map((item) => ({
    id: item.id,
    name: item.productName,
    location: item.city,
    price: `₹ ${Number(item.expectedPrice || 0).toLocaleString("en-IN")}`,
    image: item.frontView
      ? apiHelper.image(item.frontView)
      : "/mah.png",
  })),
  };

  const wishlistProduct = {
    id: Number(id),
    name: tractor.name,
    brand: tractor.brand,
    price: hasValidValue(d.expectedPrice) ? Number(d.expectedPrice) : 0,
    image: tractor.images[0],
  };

  const handleWishlistClick = () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/tractor/${id}`);
      return;
    }
    toggleWishlist(wishlistProduct);
  };

  // ─── Auto Slider ──────────────────────────────────────────────────────────
 useEffect(() => {
  if (!tractor.relatedProducts?.length) return;

  intervalRef.current = setInterval(() => {
    setRelatedIndex(prev => (prev + 1) % tractor.relatedProducts.length);
  }, 3000);

  return () => clearInterval(intervalRef.current);
}, [tractor.relatedProducts.length]);

  const cardsToShow = 4;
const getVisibleRelated = () => {
  if (!tractor.relatedProducts?.length) return [];

  const visible = [];

  for (let i = 0; i < Math.min(cardsToShow, tractor.relatedProducts.length); i++) {
    visible.push(
      tractor.relatedProducts[
        (relatedIndex + i) % tractor.relatedProducts.length
      ]
    );
  }

  return visible;
};

  const slideRelated = (direction) => {
    clearInterval(intervalRef.current);
    if (direction === "next") {
      setRelatedIndex((prev) => (prev + 1) % tractor.relatedProducts.length);
    } else {
      setRelatedIndex(
        (prev) =>
          (prev - 1 + tractor.relatedProducts.length) %
          tractor.relatedProducts.length,
      );
    }
    intervalRef.current = setInterval(() => {
      setRelatedIndex((prev) => (prev + 1) % tractor.relatedProducts.length);
    }, 3000);
  };

  useEffect(() => {
    const slider = relatedScrollRef.current;
    if (!slider) return;
    const handleScroll = () => {
      setIsScrollingRelated(true);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(
        () => setIsScrollingRelated(false),
        1500,
      );
    };
    slider.addEventListener("scroll", handleScroll, { passive: true });
    slider.addEventListener("touchstart", handleScroll, { passive: true });
    return () => {
      slider.removeEventListener("scroll", handleScroll);
      slider.removeEventListener("touchstart", handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const scrollRelated = (direction) => {
    if (!relatedScrollRef.current) return;
    const { scrollLeft, clientWidth } = relatedScrollRef.current;
    relatedScrollRef.current.scrollTo({
      left:
        direction === "left"
          ? scrollLeft - clientWidth * 0.8
          : scrollLeft + clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  // ─── Zoom Handlers ───────────────────────────────────────────────────────
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomStyle({ display: "block", x, y });
  };
  const handleMouseLeave = () =>
    setZoomStyle({ display: "none", x: 50, y: 50 });

  // ─── Loading State ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading tractor details…</p>
        </div>
      </div>
    );
  }

  // ─── Error State ────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">
            Error Loading Data
          </h3>
          <p className="text-gray-600 mt-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ─── Render Tab Content ──────────────────────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <DescriptionTab tractor={tractor} keyHighlights={keyHighlights} />
        );
      case "basic":
        return <BasicInfoTab tractor={tractor} />;
      case "specifications":
        return <SpecificationsTab tractor={tractor} />;
      case "inspection":
        return <InspectionTab tractor={tractor} />;
      case "tyres":
        return <TyresTab tractor={tractor} />;
      case "hydraulic":
        return <HydraulicTab tractor={tractor} />;
      case "attachments":
        return <AttachmentsTab tractor={tractor} />;
      case "pricing":
        return <PricingTab tractor={tractor} />;
      case "location":
        return <LocationTab tractor={tractor} />;
      default:
        return (
          <DescriptionTab tractor={tractor} keyHighlights={keyHighlights} />
        );
    }
  };

  // ─── Main Render ─────────────────────────────────────────────────────────
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Breadcrumb with Back Button on Right */}
      <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pt-8 pb-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm flex-wrap">
            <Link
              to="/"
              className="text-green-600 hover:text-green-700 font-medium transition-colors"
            >
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              to="/tractor"
              className="text-green-600 hover:text-green-700 font-medium transition-colors"
            >
              Tractor
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-500 truncate max-w-[150px] sm:max-w-[250px]">
              {tractor.name}
            </span>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 cursor-pointer bg-white border border-gray-200 rounded-lg hover:border-green-400 hover:bg-green-50 hover:shadow-md transition-all duration-300 group flex-shrink-0"
            aria-label="Go back"
          >
            <ChevronLeft className="w-4 h-4 text-gray-500 group-hover:text-green-600 transition-colors" />
            <span className="text-sm font-medium text-gray-600 group-hover:text-green-600 transition-colors">
              Back
            </span>
          </button>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pb-10">
        {/* Top Grid - Image, Info, Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT - Images */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
              <div
                ref={containerRef}
                className="relative aspect-[1/1] bg-gray-100 overflow-hidden cursor-zoom-in"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  src={tractor.images[currentImage]}
                  alt={tractor.name}
                  className="w-full h-full transition-transform duration-200 object-cover"
                  style={{
                    transform:
                      zoomStyle.display === "block" ? "scale(2)" : "scale(1)",
                    transformOrigin: `${zoomStyle.x || 50}% ${zoomStyle.y || 50}%`,
                  }}
                />
                <button
                  onClick={() =>
                    setCurrentImage((prev) =>
                      prev === 0 ? tractor.images.length - 1 : prev - 1,
                    )
                  }
                  className="absolute cursor-pointer left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-all"
                >
                  <ChevronLeft className="text-gray-700" size={20} />
                </button>
                <button
                  onClick={() =>
                    setCurrentImage(
                      (prev) => (prev + 1) % tractor.images.length,
                    )
                  }
                  className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-all"
                >
                  <ChevronRight className="text-gray-700" size={20} />
                </button>
                <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-3 py-1 rounded-full z-20">
                  {currentImage + 1} of {tractor.images.length}
                </div>
                <div className="absolute top-3 right-3 flex gap-2 z-20">
                  <button
                    onClick={handleWishlistClick}
                    className="w-10 h-10 cursor-pointer bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all"
                  >
                    <Heart
                      size={18}
                      className={
                        isInWishlist(Number(id))
                          ? "fill-green-500 text-green-500"
                          : "text-gray-500"
                      }
                    />
                  </button>
                  <button className="w-10 h-10 cursor-pointer bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all">
                    <Share2 size={18} className="text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="flex gap-2 p-3 overflow-x-auto">
                {tractor.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`w-20 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
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

          {/* CENTER - Price/Specs */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="inline-block bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {tractor.category}
                </span>
                {tractor.status && (
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                      tractor.status === "DRAFT" || tractor.status === "draft"
                        ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                        : "bg-green-50 text-green-700 border-green-200"
                    }`}
                  >
                    {tractor.status}
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {tractor.name}
              </h1>
              <p className="text-3xl font-black text-gray-900 mb-1">
                {tractor.price}
              </p>
              {tractor.manufacturingYear && (
                <p className="text-sm text-gray-500 mb-4">
                  {tractor.manufacturingYear} Model
                </p>
              )}

              <button className="w-full py-3 cursor-pointer rounded-xl bg-green-600 hover:shadow-lg text-white font-semibold text-lg mb-6 transition-all">
                <Phone className="inline mr-2" size={18} />
                Call Seller
              </button>

              {/* Quick spec pills */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {hasValidValue(tractor.hp) && (
                  <div className="bg-gray-50 rounded-xl p-3 flex flex-col items-center justify-center">
                    <Gauge className="text-gray-600 mb-1" size={20} />
                    <p className="text-xs font-semibold text-gray-900">
                      {tractor.hp}
                    </p>
                  </div>
                )}
                {hasValidValue(tractor.fuelType) && (
                  <div className="bg-gray-50 rounded-xl p-3 flex flex-col items-center justify-center">
                    <Fuel className="text-gray-600 mb-1" size={20} />
                    <p className="text-xs font-semibold text-gray-900">
                      {tractor.fuelType}
                    </p>
                  </div>
                )}
                {hasValidValue(tractor.driveType) && (
                  <div className="bg-gray-50 rounded-xl p-3 flex flex-col items-center justify-center">
                    <GitBranch className="text-gray-600 mb-1" size={20} />
                    <p className="text-xs font-semibold text-gray-900">
                      {tractor.driveType}
                    </p>
                  </div>
                )}
              </div>

              {/* Core condition rows */}
              <div className="border-t border-gray-100">
                <DetailRow
                  label="Overall Condition"
                  value={tractor.overallCondition}
                />
                <DetailRow
                  label="Hours Meter"
                  value={tractor.hoursMeterReading}
                />
                <DetailRow label="Owner Type" value={tractor.ownerType} />
                <DetailRow
                  label="RC Available"
                  value={tractor.rcRegistrationNumber ? "Yes" : "No"}
                  last
                />
              </div>

              {/* Available Colors */}
              {displayColors.length > 0 && (
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Available Colors
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {displayColors.map((c, index) => (
                      <ColorDot key={index} color={c} />
                    ))}
                  </div>
                </div>
              )}

              {/* Enquiry card */}
              <div className="mt-6 bg-green-50 rounded-xl p-4 flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg bg-white flex items-center justify-center shadow-sm">
                 <img
  src={tractor.images?.[0] || "/mah.png"}
  alt={tractor.name}
  className="w-10 h-10 object-contain rounded"
/>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{tractor.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {tractor.status === "DRAFT"
                      ? "Listing in progress"
                      : "Product Available"}
                  </p>
                  <button
                    onClick={() => setShowEnquiryModal(true)}
                    className="bg-green-600 text-white cursor-pointer px-4 py-1.5 rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
                  >
                    Enquiry
                  </button>
                </div>
              </div>

              <button className="mt-4 w-full border-2 border-gray-200 rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all">
                <Share2 className="inline mr-2" size={16} />
                Share
              </button>
            </div>
          </div>

          {/* RIGHT - Sidebar */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-5">
                Need Help?
              </h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center">
                  <Phone className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Call us:</p>
                  <p className="font-semibold text-gray-900">{tractor.phone}</p>
                </div>
              </div>
            </div>

            {/* Similar products */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-5">
                Similar <span className="text-green-800">Products</span>
              </h3>
              <div className="space-y-4">
                {tractor.similar.map((item, index) => (
                   <Link
    key={item.id}
    to={`/used-tractor/${item.id}`}
    className="block"
  >
                  <div
                    key={index}
                    className="bg-white rounded-2xl border border-green-400 shadow-sm p-3 flex gap-3 hover:shadow-lg transition-all"
                  >
                    <div className="w-[92px] h-[92px] rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={item.image || "/mah.png"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900 leading-snug">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1">
                          {item.location || "Unknown"}
                        </p>
                      </div>
                      <p className="font-bold text-gray-900">{item.price}</p>
                    </div>
                  </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── TABS SECTION ── */}
        <div className="mt-10 mb-6">
          {/* Tab Navigation */}
          <div className="flex gap-8 border-b border-gray-200 overflow-x-auto hide-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "border-b-2 border-green-500 text-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="mt-6">{renderTabContent()}</div>
        </div>

        <ReviewsSection tractorId={id} />

        {/* ── Related Products Slider ── */}
        <div className="mt-16">
          {/* Header with decorative elements */}
          <div className="flex items-center gap-4 mb-2">
            <div className="h-1 w-10 bg-green-600 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-900">
              Related <span className="text-green-600">Products</span>
            </h2>
            <div className="flex-1 h-px bg-gray-200"></div>
            <Link
              to="/used-tractor"
            
              className="text-sm font-semibold text-green-600 hover:text-green-700 flex items-center gap-1 transition-colors whitespace-nowrap"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <p className="text-gray-500 text-sm mb-6 ml-14">
            Discover more tractors that might interest you
          </p>

          {/* Mobile View */}
          <div className="sm:hidden relative">
            <button
              onClick={() => scrollRelated("left")}
              className={`cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 -ml-1 z-20 flex items-center justify-center w-9 h-9 bg-white border-2 border-green-200 text-green-700 rounded-full shadow-lg hover:bg-green-50 hover:border-green-400 transition-all duration-300 ${
                isScrollingRelated
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-2"
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div
              ref={relatedScrollRef}
              className="flex overflow-x-auto gap-4 pb-4 px-1 snap-x snap-mandatory scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {tractor.relatedProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/tractor/${product.id}`}
                  className="snap-start w-[75vw] flex-shrink-0"
                >
                  <div className="group bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-xl hover:border-green-300 transition-all duration-300">
                    <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 h-44 overflow-hidden">
                      <img
                        src={product.image || "/mah.png"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                      <span className="absolute top-3 left-3 bg-green-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        Featured
                      </span>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs bg-green-50 text-green-700 font-semibold px-2.5 py-1 rounded-full border border-green-200">
                          Tractor
                        </span>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300 fill-gray-300"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900 group-hover:text-green-600 transition-colors duration-200 line-clamp-2 mb-1.5">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span>
                          {product.location || "Location not specified"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <p className="text-base font-bold text-gray-900">
                          {product.price}
                        </p>
                        <button
                          className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1 shadow-md hover:shadow-lg"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          <ShoppingCart className="w-3 h-3" />
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <button
              onClick={() => scrollRelated("right")}
              className={`cursor-pointer absolute right-0 top-1/2 -translate-y-1/2 -mr-1 z-20 flex items-center justify-center w-9 h-9 bg-white border-2 border-green-200 text-green-700 rounded-full shadow-lg hover:bg-green-50 hover:border-green-400 transition-all duration-300 ${
                isScrollingRelated
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-2"
              }`}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Desktop View */}
          <div className="hidden sm:block relative px-8 sm:px-10 lg:px-12">
            <button
              onClick={() => slideRelated("prev")}
              className="absolute left-0 sm:left-1 lg:left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border-2 border-gray-200 cursor-pointer rounded-full shadow-md flex items-center justify-center hover:bg-green-50 hover:border-green-400 transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>
            <div className="overflow-hidden">
              <div className="flex gap-4 sm:gap-5 transition-transform duration-500 ease-in-out">
                  {getVisibleRelated()
                  .filter(Boolean)
               .map((product, idx) => (
                  <Link
                    key={`${product.id}-${relatedIndex}-${idx}`}
                    to={`/used-tractor/${product.id}`}
                    className="flex-shrink-0 group bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-xl hover:border-green-300 transition-all duration-300 w-full sm:w-[calc(50%-6px)] lg:w-[calc(25%-12px)]"
                  >
                    <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 h-48 overflow-hidden">
                      <img
                        src={product.image || "/mah.png"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                      <span className="absolute top-3 left-3 bg-gradient-to-r from-green-600 to-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        Featured
                      </span>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/20">
                        <span className="bg-white/90 backdrop-blur-sm text-gray-900 font-semibold px-4 py-2 rounded-lg shadow-lg hover:bg-white transition-all transform group-hover:scale-105 flex items-center gap-2 text-sm">
                          <Eye className="w-4 h-4" />
                          Quick View
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs bg-green-50 text-green-700 font-semibold px-3 py-1 rounded-full border border-green-200">
                          Tractor
                        </span>
                        <div className="flex items-center gap-1">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300 fill-gray-300"}`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-400 ml-1">
                            (24)
                          </span>
                        </div>
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900 group-hover:text-green-600 transition-colors duration-200 line-clamp-2 mb-1.5">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span>
                          {product.location || "Location not specified"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div>
                          <p className="text-base font-bold text-gray-900">
                            {product.price}
                          </p>
                          <p className="text-xs text-gray-400 line-through">
                            ₹9,50,000
                          </p>
                        </div>
                        <button
                          className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-1.5 shadow-md hover:shadow-lg transform hover:scale-105"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          Add
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <button
              onClick={() => slideRelated("next")}
              className="absolute right-0 sm:right-1 lg:right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 cursor-pointer bg-white border-2 border-gray-200 rounded-full shadow-md flex items-center justify-center hover:bg-green-50 hover:border-green-400 transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>
          </div>

          <div className="text-center mt-10">
            <Link
              to="/tractors"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3.5 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <Eye className="w-4 h-4" />
              View All Products
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={showEnquiryModal}
        enquiryMode="used"
        usedWebsiteVariantId={id}
        onClose={() => setShowEnquiryModal(false)}
      />
    </div>
  );
};

// ─── Tab Components ──────────────────────────────────────────────────────

// 1. Description Tab
const DescriptionTab = ({ tractor, keyHighlights }) => (
  <div className="grid grid-cols-1 gap-4">
    <SectionCard title="Description" icon={Info}>
      <p className="text-gray-700 leading-relaxed">{tractor.description}</p>
    </SectionCard>

    {keyHighlights.length > 0 && (
      <SectionCard title="Key Highlights" icon={Award}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {keyHighlights.map((highlight, index) => (
            <div key={index} className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
              <span className="text-gray-700 text-sm">{highlight}</span>
            </div>
          ))}
        </div>
      </SectionCard>
    )}
  </div>
);

// 2. Basic Info Tab
const BasicInfoTab = ({ tractor }) => {
  const leftItems = [
    { label: "Product Name", value: tractor.name },
    { label: "Category", value: tractor.category },
    { label: "Brand", value: tractor.brand },
    { label: "Model", value: tractor.model },
    { label: "Variant", value: tractor.variant },
    { label: "Variant Code", value: tractor.variantCode },
    { label: "Status", value: tractor.status },

    { label: "Purchase Year", value: tractor.purchaseYear },
  ];

  const rightItems = [
    { label: "Tractor Category", value: tractor.tractorCategory },
    { label: "Fuel Type", value: tractor.fuelType },
    { label: "Drive Type", value: tractor.driveType },
    { label: "Hours Meter Reading", value: tractor.hoursMeterReading },
    { label: "Approx Working Hours", value: tractor.approxWorkingHours },
    { label: "Acres Worked", value: tractor.acresWorked },
    { label: "Purpose", value: tractor.purpose },
    { label: "RC Registration Number", value: tractor.rcRegistrationNumber },
    { label: "Manufacturing Year", value: tractor.manufacturingYear },
  ];

  return (
    <SectionCard title="Basic Information" icon={Package}>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left Side */}
        <div className="lg:border-r border-gray-300 dark:border-gray-700 lg:pr-6">
          {leftItems.map((item, index) => (
            <DetailRow
              key={item.label}
              label={item.label}
              value={item.value}
              last={index === leftItems.length - 1}
            />
          ))}
        </div>

        {/* Right Side */}
        <div className="lg:pl-6">
          {rightItems.map((item, index) => (
            <DetailRow
              key={item.label}
              label={item.label}
              value={item.value}
              last={index === rightItems.length - 1}
            />
          ))}
        </div>
      </div>
    </SectionCard>
  );
};

// 3. Specifications Tab
const SpecificationsTab = ({ tractor }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <SectionCard title="Engine & Performance" icon={Gauge}>
      <DetailRow label="Horse Power" value={tractor.hp} />
      <DetailRow label="Fuel Type" value={tractor.fuelType} />
      <DetailRow label="Drive Type" value={tractor.driveType} />
      <DetailRow label="Tractor Category" value={tractor.tractorCategory} />
      <DetailRow label="Engine Self Start" value={tractor.engineSelfStart} />
      <DetailRow label="Engine Cold Start" value={tractor.engineColdStart} />
      <DetailRow label="Engine Smoke" value={tractor.engineSmoke} />
      <DetailRow label="Engine Sound" value={tractor.engineSound} />
      <DetailRow
        label="Engine Oil Leakage"
        value={tractor.engineOilLeakage}
        last
      />
    </SectionCard>

    <SectionCard title="Ownership Details" icon={User}>
      <DetailRow label="Ownership" value={tractor.ownership} />
      <DetailRow label="Owner Type" value={tractor.ownerType} />
      <DetailRow label="First Owner" value={tractor.firstOwner} />
      <DetailRow label="Second Owner" value={tractor.secondOwner} />
      <DetailRow label="Third Owner" value={tractor.thirdOwner} />
      <DetailRow label="Seller Type" value={tractor.sellerType} />
      <DetailRow
        label="Ownership Proof"
        value={tractor.ownershipProofAvailable ? "Available" : "Not Available"}
        last
      />
    </SectionCard>
  </div>
);

// 4. Inspection Tab
const InspectionTab = ({ tractor }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <SectionCard title="Vehicle Condition" icon={CheckCircle}>
      <DetailRow label="Overall Condition" value={tractor.overallCondition} />
      <DetailRow label="Clutch Condition" value={tractor.clutchCondition} />
      <DetailRow label="Gearbox Condition" value={tractor.gearboxCondition} />
      <DetailRow label="Steering Type" value={tractor.steeringType} />
      <DetailRow label="Steering Condition" value={tractor.steeringCondition} />
      <DetailRow label="Brakes Condition" value={tractor.brakesCondition} />
      <DetailRow
        label="Battery Condition"
        value={tractor.batteryCondition}
        last
      />
    </SectionCard>

    <div className="flex flex-col gap-4">
      <SectionCard title="Lights & Electrical" icon={Zap}>
        <DetailRow
          label="Head Light"
          value={tractor.lightsHeadLight ? "Working" : "Not Working"}
        />
        <DetailRow
          label="Indicator"
          value={tractor.lightsIndicator ? "Working" : "Not Working"}
        />
        <DetailRow
          label="Tail Light"
          value={tractor.lightsTailLight ? "Working" : "Not Working"}
        />
        <DetailRow
          label="Horn"
          value={tractor.lightsHorn ? "Working" : "Not Working"}
          last
        />
      </SectionCard>

      <SectionCard title="Service History" icon={Wrench}>
        <DetailRow label="Last Service Date" value={tractor.lastServiceDate} />
        <DetailRow label="Engine Overhauled" value={tractor.engineOverhauled} />
        <DetailRow label="Gearbox Repaired" value={tractor.gearboxRepaired} />
        <DetailRow label="Clutch Changed" value={tractor.clutchChanged} />
        <DetailRow label="Tyres Changed" value={tractor.tyresChanged} />
        <DetailRow
          label="Battery Changed"
          value={tractor.batteryChanged}
          last
        />
      </SectionCard>
    </div>
  </div>
);

// 5. Tyres Tab
const TyresTab = ({ tractor }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <SectionCard title="Front Tyres" icon={Settings}>
      <DetailRow label="Brand" value={tractor.frontTyreBrand} />
      <DetailRow label="Remaining" value={tractor.frontTyreRemainingPercent} />
      <DetailRow label="Condition" value={tractor.frontTyreCondition} last />
    </SectionCard>

    <SectionCard title="Rear Tyres" icon={Settings}>
      <DetailRow label="Brand" value={tractor.rearTyreBrand} />
      <DetailRow label="Remaining" value={tractor.rearTyreRemainingPercent} />
      <DetailRow label="Condition" value={tractor.rearTyreCondition} last />
    </SectionCard>
  </div>
);

// 6. Hydraulic & PTO Tab
const HydraulicTab = ({ tractor }) => (
  <SectionCard title="Hydraulic & PTO" icon={Droplets}>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <DetailRow
          label="Hydraulic Lift Working"
          value={tractor.hydraulicLiftWorking}
        />
        <DetailRow
          label="Hydraulic Condition"
          value={tractor.hydraulicCondition} last
        />
      </div>
      <div>
        <DetailRow label="PTO Status" value={tractor.ptoStatus}  />
      </div>
    </div>
  </SectionCard>
);

// 7. Attachments Tab
const AttachmentsTab = ({ tractor }) => (
  <SectionCard title="Attachments" icon={Package}>
    {tractor.attachments.length > 0 ? (
      <div className="flex flex-wrap gap-2">
        {tractor.attachments.map((item, index) => (
          <span
            key={index}
            className="bg-green-50 text-green-700 border border-green-200 text-xs font-medium px-3 py-1.5 rounded-full"
          >
            {item}
          </span>
        ))}
      </div>
    ) : (
      <p className="text-gray-500">No attachments listed</p>
    )}
  </SectionCard>
);

// 8. Pricing Tab
const PricingTab = ({ tractor }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <SectionCard title="Price Details" icon={DollarSign}>
      <DetailRow label="Expected Price" value={tractor.price} />
      <DetailRow label="Finance Available" value={tractor.financeAvailable} />
      <DetailRow label="Exchange Offer" value={tractor.exchangeOffer} />
      <DetailRow label="Negotiable" value={tractor.negotiable} last />
    </SectionCard>

    <SectionCard title="Insurance & Finance" icon={Shield}>
      <DetailRow label="Insurance" value={tractor.insurance} />
      <DetailRow label="Insurance Expiry" value={tractor.insuranceExpiryDate} />
      <DetailRow label="Finance" value={tractor.finance} />
      <DetailRow label="Finance Company" value={tractor.financeCompany} />
      <DetailRow
        label="Outstanding Amount"
        value={tractor.outstandingAmount}
        last
      />
    </SectionCard>
  </div>
);

// 9. Location Tab
const LocationTab = ({ tractor }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <SectionCard title="Location Details" icon={MapPin}>
      <DetailRow label="Country" value={tractor.country} />
      <DetailRow label="State" value={tractor.state} />
      <DetailRow label="District" value={tractor.district} />
      <DetailRow label="Taluka" value={tractor.taluka} />
      <DetailRow label="City" value={tractor.city} />
      <DetailRow label="Pincode" value={tractor.pincode} />
      <DetailRow label="Landmark" value={tractor.landmark} last />
    </SectionCard>

    <div className="flex flex-col gap-4">
      <SectionCard title="Full Address" icon={MapPin}>
        <p className="text-gray-700">
          {tractor.fullAddress || "Address not available"}
        </p>
        {tractor.latitude && tractor.longitude && (
          <div className="mt-2 text-sm text-gray-500">
            <p>Latitude: {tractor.latitude}</p>
            <p>Longitude: {tractor.longitude}</p>
          </div>
        )}
      </SectionCard>

      {tractor.availableStates?.length > 0 && (
        <SectionCard title="Available States" icon={MapPin}>
          <BadgeList items={tractor.availableStates.map((s) => s?.name || s)} />
        </SectionCard>
      )}
    </div>
  </div>
);

export default UsedTractorDetails;
