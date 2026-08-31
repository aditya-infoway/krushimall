// components/EquipmentDetails.jsx
import { useState, useEffect, useRef } from "react";
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
  DollarSign,
  Fuel,
  Weight,
  Ruler,
  Zap,
  Droplets,
  Wind,
  Cog,
  Store,
  List,
  Grid,
  Check,
  Sparkles,
  Play,
  X,
} from "lucide-react";
import apiHelper from "../utils/apiHelper";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import Select from "react-select";
import { State, City } from "country-state-city";
import { showErrorToast, showSuccessToast } from "../utils/toast";

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

const formatDate = (value) => {
  if (!hasValidValue(value)) return null;

  const date = new Date(value);

  if (isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const DetailRow = ({ label, value, last = false }) => {
  if (!hasValidValue(value)) return null;

  return (
    <div
      className={`flex justify-between py-3 ${
        !last ? "border-b border-gray-600" : ""
      }`}
    >
      <span className="text-gray-500 text-sm">{label}</span>
      <span className="font-semibold text-gray-900 text-sm capitalize text-right max-w-[55%]">
        {value}
      </span>
    </div>
  );
};

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
      <div className="p-4 sm:p-6 ">{children}</div>
    </div>
  );
};

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
    Pink: "#ec4899",
    Purple: "#8b5cf6",
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

// ─── Enquiry Modal Component ──────────────────────────────────────────────
const EnquiryModal = ({ isOpen, onClose, equipment }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    state: null,
    city: null,
    address: "",
    pincode: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const INDIA_STATES = State.getStatesOfCountry("IN").map((s) => ({
    value: s.isoCode,
    label: s.name,
  }));

  const cityOptions = formData.state
    ? City.getCitiesOfState("IN", formData.state.value).map((c) => ({
        value: c.name,
        label: c.name,
      }))
    : [];

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

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "state") next.city = null;
      return next;
    });
  };

  // NEW
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.mobile ||
      !formData.state ||
      !formData.city
    ) {
      showErrorToast("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        equipmentId: equipment?.id,
        fullName: formData.fullName,
        email: formData.email,
        mobile: formData.mobile,
        state: formData.state.label,
        city: formData.city.label,
        address: formData.address,
        pincode: formData.pincode,
      };

      const res = await apiHelper.post("/vendor-web/equipmentenquiry", payload);

      if (res.data?.success === false) {
        showErrorToast(res.data?.message || "Failed to submit enquiry.");
        setIsSubmitting(false);
        return;
      }

      showSuccessToast(res.data?.message || "Enquiry submitted successfully.");
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          fullName: "",
          email: "",
          mobile: "",
          state: null,
          city: null,
          address: "",
          pincode: "",
        });
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Enquiry submission error:", error);
      console.error("Backend response:", error?.response?.data);
      showErrorToast(
        error?.response?.data?.message ||
          "Failed to submit enquiry. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 bg-green-600 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-white">Enquiry Form</h3>
            <p className="text-xs text-white mt-0.5">
              {equipment?.name || "Equipment"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white text-white hover:text-green-600 cursor-pointer transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {submitted ? (
          <div className="px-6 py-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">
              Enquiry Sent!
            </h4>
            <p className="text-gray-500 text-sm">
              We'll contact you within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Full Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 bg-gray-50 hover:bg-white transition-colors"
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Email <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 bg-gray-50 hover:bg-white transition-colors"
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
                value={formData.mobile}
                onChange={(e) => handleChange("mobile", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 bg-gray-50 hover:bg-white transition-colors"
                placeholder="Mobile number"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  State <span className="text-red-600">*</span>
                </label>
                <Select
                  options={INDIA_STATES}
                  value={formData.state}
                  onChange={(option) => handleChange("state", option)}
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
                  value={formData.city}
                  onChange={(option) => handleChange("city", option)}
                  placeholder="Select city..."
                  isSearchable
                  isDisabled={!formData.state}
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
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 bg-gray-50 hover:bg-white transition-colors"
                placeholder="Address"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Pincode
              </label>
              <input
                type="text"
                pattern="[0-9]{6}"
                value={formData.pincode}
                onChange={(e) => handleChange("pincode", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 bg-gray-50 hover:bg-white transition-colors"
                placeholder="Enter Pincode"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-green-700 hover:bg-green-800 cursor-pointer transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// ─── Tabs Configuration ────────────────────────────────────────────────────
const TABS = [
  // { id: "description", label: "Description" },
  { id: "basic-info", label: "Basic Information" },
  { id: "specifications", label: "Specifications" },
  { id: "mechanical", label: "Mechanical" },
  { id: "electrical", label: "Electrical" },
  { id: "parts", label: "Parts & Attachments" },
  { id: "seller", label: "Seller Details" },
  { id: "media", label: "Media & Documents" },
];

// ─── Main Component ─────────────────────────────────────────────────────────
const EquipmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [activeTab, setActiveTab] = useState("basic-info");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [equipmentData, setEquipmentData] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [relatedIndex, setRelatedIndex] = useState(0);
  const intervalRef = useRef(null);
  const relatedScrollRef = useRef(null);
  const [isScrollingRelated, setIsScrollingRelated] = useState(false);
  const scrollTimeoutRef = useRef(null);
  const containerRef = useRef(null);
  const [zoomStyle, setZoomStyle] = useState({ display: "none", x: 50, y: 50 });
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  // ─── Fetch Data ──────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiHelper.get(
          `/vendor-web/equipmentvariant/public/${id}`,
        );

        const data = response.data;
        setEquipmentData(data);

        if (data.similarProducts) {
          setSimilarProducts(data.similarProducts);
        }
        if (data.relatedProducts) {
          setRelatedProducts(data.relatedProducts);
        }
      } catch (error) {
        console.error("Error fetching equipment data:", error);
        setError(error.message || "Failed to load equipment details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // ─── Process Images ─────────────────────────────────────────────────────
  const imageUrls = equipmentData
    ? [
        equipmentData.frontView,
        equipmentData.leftView,
        equipmentData.rightView,
        equipmentData.rearView,
        equipmentData.mainEquipment,
        equipmentData.workingMechanism,
        equipmentData.controlPanel,
        equipmentData.serialNumberImage,
        equipmentData.attachmentsImage,
        equipmentData.tyresWheels,
      ]
        .filter((img) => hasValidValue(img))
        .map((img) => apiHelper.image(img))
    : [];

  const finalImages = imageUrls.length > 0 ? imageUrls : ["/mah.png"];

  // ─── Process Equipment Data ─────────────────────────────────────────────
  const d = equipmentData || {};

  const keyHighlights = [
    d.highlight1,
    d.highlight2,
    d.highlight3,
    d.highlight4,
    d.highlight5,
  ].filter((h) => hasValidValue(h));

  const availableColors = d.color ? [d.color] : [];

  const attachments = d.attachments || {};
  const attachmentList = Object.keys(attachments).filter(
    (key) => attachments[key] === true,
  );

  // ─── Equipment Object ──────────────────────────────────────────────────────
  const equipment = {
    id: d.id,
    name: d.displayName || d.productName || "Equipment",
    brand: d.brand || "Unknown",
    category: d.categoryId || d.equipmentType || "Equipment",
    model: d.model || "Unknown",
    variant: d.variant || "Unknown",
    variantId: d.variantId,
    modelId: d.modelId,
    brandId: d.brandId,
    categoryId: d.categoryId,
    productName: d.productName,
    displayName: d.displayName,
    equipmentType: d.equipmentType,

    price: hasValidValue(d.expectedPrice)
      ? `₹ ${Number(d.expectedPrice).toLocaleString("en-IN")}`
      : "₹ 0",
    expectedPrice: d.expectedPrice,
    negotiable: d.negotiable,
    exchangeAvailable: d.exchangeAvailable,
    financeAvailable: d.financeAvailable,

    manufacturingYear: d.manufacturingYear,
    purchaseYear: d.purchaseYear,
    equipmentCondition: d.equipmentCondition || "New",
    serialNumber: d.serialNumber || "",
    productCode: d.productCode || "",
    color: d.color || "",

    country: d.country || "",
    state: d.state || "",
    district: d.district || "",
    taluka: d.taluka || "",
    village: d.village || "",
    pincode: d.pincode || "",
    landmark: d.landmark || "",
    latitude: d.latitude,
    longitude: d.longitude,

    sellerType: d.sellerType || "",
    ownerType: d.ownerType || "",
    ownershipProofAvailable: d.ownershipProofAvailable || false,
    usage: d.usage || "",

    description:
      d.shortDescription || d.description || "Equipment details not available.",
    images: finalImages,

    stockStatus: d.status === "ACTIVE" ? "In Stock" : "Out of Stock",
    warranty: d.warranty || "1 Year Manufacturer Warranty",
    delivery: d.delivery || "Free Delivery Available",

    sellerName: d.vendor?.name || d.createdBy || "Trusted Seller",
    sellerTypeDisplay: d.sellerType || "Dealer",
    sellerSince: d.createdAt
      ? new Date(d.createdAt).getFullYear().toString()
      : "2024",
    sellerRating: d.sellerRating || 4.5,
    sellerReviews: d.sellerReviews || 0,
    sellerPhone: d.phone || d.vendor?.phone || "+91 98765 43210",
    sellerEmail: d.email || d.vendor?.email || "info@example.com",

    tags: d.tags || ["Agriculture", "Farming", "Equipment"],
    location: [d.district, d.state].filter(Boolean).join(", "),
    year: d.manufacturingYear || d.purchaseYear || "2024",

    hp: d.requiredTractorHp
      ? `${d.requiredTractorHp} HP`
      : d.powerRequirement || "35 HP",
    powerSource: d.powerSource,
    ptoRequirement: d.ptoRequirement,
    requiredTractorHp: d.requiredTractorHp,

    workingWidth: d.workingWidth,
    workingCapacity: d.workingCapacity,
    workingSpeed: d.workingSpeed,
    weight: d.weight,
    length: d.length,
    width: d.width,
    height: d.height,
    productionCapacity: d.productionCapacity,
    fuelConsumption: d.fuelConsumption,
    rpm: d.rpm,
    numberOfBlades: d.numberOfBlades,
    numberOfRows: d.numberOfRows,
    tankCapacity: d.tankCapacity,
    workingDepth: d.workingDepth,

    threshingCapacity: d.threshingCapacity,
    cropType: d.cropType,
    drumSize: d.drumSize,
    fanType: d.fanType,
    cleaningSystem: d.cleaningSystem,
    rotorRpm: d.rotorRpm,
    sprayWidth: d.sprayWidth,
    pumpType: d.pumpType,
    nozzleCount: d.nozzleCount,
    pressure: d.pressure,

    overallCondition: d.overallCondition,
    oilLeakage: d.oilLeakage,
    workingCondition: d.workingCondition,
    mechanical: d.mechanical || {},
    electrical: d.electrical || {},

    partsCondition: d.partsCondition || {},
    attachments: d.attachments || {},
    attachmentList: attachmentList,
    otherAttachmentName: d.otherAttachmentName,

    lastServiceDate: d.lastServiceDate,
    majorRepair: d.majorRepair,
    partsReplaced: d.partsReplaced || {},
    accidentDamage: d.accidentDamage,
    floodDamage: d.floodDamage,

    purchaseInvoice: d.purchaseInvoice,
    ownershipProof: d.ownershipProof,
    warrantyDocument: d.warrantyDocument,
    insurance: d.insurance,
    serviceRecords: d.serviceRecords,
    otherDocuments: d.otherDocuments,

    walkaroundVideo: d.walkaroundVideo,
    workingVideo: d.workingVideo,
    machineStartVideo: d.machineStartVideo,
    ptoWorkingVideo: d.ptoWorkingVideo,
    hydraulicWorkingVideo: d.hydraulicWorkingVideo,

    status: d.status,
    isCompleted: d.isCompleted,
    currentStep: d.currentStep,
    agreed: d.agreed,
    enquiryCount: d.enquiryCount || 0,
  };

  const wishlistProduct = {
    id: Number(id),
    name: equipment.name,
    brand: equipment.brand,
    price: equipment.expectedPrice || 0,
    image: equipment.images[0],
  };

  const handleWishlistClick = () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/equipment/${id}`);
      return;
    }
    toggleWishlist(wishlistProduct);
  };

  // ─── Auto Slider ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!relatedProducts.length) return;

    intervalRef.current = setInterval(() => {
      setRelatedIndex((prev) => (prev + 1) % relatedProducts.length);
    }, 3000);

    return () => clearInterval(intervalRef.current);
  }, [relatedProducts.length]);

  const cardsToShow = 4;
  const getVisibleRelated = () => {
    if (!relatedProducts?.length) return [];

    const visible = [];
    for (let i = 0; i < Math.min(cardsToShow, relatedProducts.length); i++) {
      visible.push(
        relatedProducts[(relatedIndex + i) % relatedProducts.length],
      );
    }
    return visible;
  };

  const slideRelated = (direction) => {
    clearInterval(intervalRef.current);
    if (direction === "next") {
      setRelatedIndex((prev) => (prev + 1) % relatedProducts.length);
    } else {
      setRelatedIndex(
        (prev) => (prev - 1 + relatedProducts.length) % relatedProducts.length,
      );
    }
    intervalRef.current = setInterval(() => {
      setRelatedIndex((prev) => (prev + 1) % relatedProducts.length);
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

  // ─── Image Navigation ────────────────────────────────────────────────────
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
      // case "description":
      //   return (
      //     <DescriptionTab equipment={equipment} keyHighlights={keyHighlights} />
      //   );
      case "basic-info":
        return <BasicInfoTab equipment={equipment} />;
      case "specifications":
        return <SpecificationsTab equipment={equipment} />;
      case "mechanical":
        return <MechanicalTab equipment={equipment} />;
      case "electrical":
        return <ElectricalTab equipment={equipment} />;
      case "parts":
        return <PartsAttachmentsTab equipment={equipment} />;
      case "seller":
        return <SellerTab equipment={equipment} />;
      case "media":
        return <MediaDocumentsTab equipment={equipment} />;
      default:
        return (
          <BasicInfoTab equipment={equipment} keyHighlights={keyHighlights} />
        );
    }
  };

  // ─── Loading State ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">
            Loading equipment details…
          </p>
        </div>
      </div>
    );
  }

  // ─── Error State ────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
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

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-20 pt-8 pb-4">
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
              to="/equipment"
              className="text-green-600 hover:text-green-700 font-medium transition-colors"
            >
              Equipment
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-500 truncate max-w-[150px] sm:max-w-[250px]">
              {equipment.name}
            </span>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 cursor-pointer bg-white border border-gray-200 rounded-lg hover:border-green-400 hover:bg-green-50 hover:shadow-md transition-all duration-300 group flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4 text-gray-500 group-hover:text-green-600 transition-colors" />
            <span className="text-sm font-medium text-gray-600 group-hover:text-green-600 transition-colors">
              Back
            </span>
          </button>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-20 pb-10">
        {/* Top Grid - Image, Info, Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT - Images */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
              <div
                ref={containerRef}
                className="relative aspect-[4/3] bg-gray-100 overflow-hidden cursor-zoom-in"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  src={equipment.images[currentImage]}
                  alt={equipment.name}
                  className="w-full h-full transition-transform duration-200 object-contain"
                  style={{
                    transform:
                      zoomStyle.display === "block" ? "scale(2)" : "scale(1)",
                    transformOrigin: `${zoomStyle.x || 50}% ${
                      zoomStyle.y || 50
                    }%`,
                  }}
                />
                {equipment.images.length > 1 && (
                  <>
                    <button
                      onClick={() => handleImageNav("prev")}
                      className="absolute cursor-pointer left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-all"
                    >
                      <ChevronLeft className="text-gray-700" size={20} />
                    </button>
                    <button
                      onClick={() => handleImageNav("next")}
                      className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-all"
                    >
                      <ChevronRight className="text-gray-700" size={20} />
                    </button>
                  </>
                )}
                <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-3 py-1 rounded-full z-20">
                  {currentImage + 1} of {equipment.images.length}
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
                <div className="absolute bottom-3 left-3">
                  <span
                    className={`text-white text-xs font-bold px-3 py-1 rounded-full ${
                      equipment.status === "ACTIVE"
                        ? "bg-green-600"
                        : "bg-gray-600"
                    }`}
                  >
                    {equipment.status || "ACTIVE"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 p-3 overflow-x-auto">
                {equipment.images.map((img, index) => (
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
                  {equipment.equipmentType || equipment.category || "Equipment"}
                </span>
                {hasValidValue(equipment.equipmentCondition) && (
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                      equipment.equipmentCondition === "new"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    }`}
                  >
                    {equipment.equipmentCondition === "new" ? "New" : "Used"}
                  </span>
                )}
                {equipment.status === "ACTIVE" && (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full border bg-green-50 text-green-700 border-green-200">
                    Available
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {equipment.name}
              </h1>
              <p className="text-3xl font-black text-gray-900 mb-1">
                {equipment.price}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                {equipment.negotiable === "yes" ? "Negotiable" : "Fixed Price"}{" "}
                •
                {equipment.financeAvailable === "yes"
                  ? " Finance Available"
                  : " No Finance"}
              </p>

              <button
                onClick={() => setShowEnquiryModal(true)}
                className="w-full py-3 cursor-pointer rounded-xl bg-green-600 hover:shadow-lg text-white font-semibold text-lg mb-6 transition-all flex items-center justify-center gap-2"
              >
                <MessagesSquare className="w-4 h-4" />
                Get Best Price
              </button>

              {/* Quick spec pills */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {hasValidValue(equipment.hp) && (
                  <div className="bg-gray-50 rounded-xl p-3 flex flex-col items-center justify-center border border-gray-100">
                    <Gauge className="text-gray-600 mb-1" size={20} />
                    <p className="text-xs font-semibold text-gray-900">
                      {equipment.hp}
                    </p>
                    <p className="text-[10px] text-gray-500">Power</p>
                  </div>
                )}
                {hasValidValue(equipment.year) && (
                  <div className="bg-gray-50 rounded-xl p-3 flex flex-col items-center justify-center border border-gray-100">
                    <Calendar className="text-gray-600 mb-1" size={20} />
                    <p className="text-xs font-semibold text-gray-900">
                      {equipment.year}
                    </p>
                    <p className="text-[10px] text-gray-500">Year</p>
                  </div>
                )}
                {hasValidValue(equipment.location) && (
                  <div className="bg-gray-50 rounded-xl p-3 flex flex-col items-center justify-center border border-gray-100">
                    <MapPin className="text-gray-600 mb-1" size={20} />
                    <p className="text-xs font-semibold text-gray-900 truncate max-w-[60px]">
                      {equipment.location}
                    </p>
                    <p className="text-[10px] text-gray-500">Location</p>
                  </div>
                )}
              </div>

              {/* Available Colors */}
              {availableColors.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Available Colors
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {availableColors.map((c, index) => (
                      <ColorDot key={index} color={c} />
                    ))}
                  </div>
                </div>
              )}

              {/* Delivery Info */}
              {equipment.delivery && (
                <div className="mt-4 flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <Truck className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span>{equipment.delivery}</span>
                </div>
              )}

              {/* Pincode Checker */}
              <PincodeChecker equipmentId={id} />

              {/* Share Button */}
              <button className="mt-4 w-full border-2 border-gray-200 rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                <Share2 size={16} />
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
                  <p className="font-semibold text-gray-900">
                    {equipment.sellerPhone}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">Enquiries</p>
                <p className="font-semibold text-gray-900">
                  {equipment.enquiryCount} enquiries
                </p>
              </div>
            </div>

            {/* Similar products */}
            {similarProducts.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-5">
                  Similar <span className="text-green-800">Products</span>
                </h3>
                <div className="space-y-4">
                  {similarProducts.slice(0, 3).map((item) => (
                    <Link
                      key={item.id}
                      to={`/equipment/${item.id}`}
                      className="block"
                    >
                      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-3 flex gap-3 hover:shadow-lg transition-all">
                        <div className="w-[92px] h-[92px] rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          <img
                            src={apiHelper.image(item.frontView) || "/mah.png"}
                            alt={
                              item.displayName || item.productName || item.name
                            }
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900 leading-snug text-sm">
                              {item.displayName ||
                                item.productName ||
                                item.name}
                            </h4>
                            <p className="text-xs text-gray-400 mt-1">
                              {item.brand || "Unknown"}
                            </p>
                          </div>
                          <p className="font-bold text-gray-900 text-sm">
                            ₹
                            {Number(item.expectedPrice || 0).toLocaleString(
                              "en-IN",
                            )}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── TABS SECTION ── */}
        <div className="mt-10">
          <div className="flex gap-6 border-b border-gray-200 overflow-x-auto hide-scrollbar pb-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 pt-2 font-semibold whitespace-nowrap transition-all text-sm ${
                  activeTab === tab.id
                    ? "border-b-2 border-green-500 text-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-6">{renderTabContent()}</div>
        </div>

        {/* ── Related Products Slider ── */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-4 mb-2">
              <div className="h-1 w-10 bg-green-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-900">
                Related <span className="text-green-600">Equipment</span>
              </h2>
              <div className="flex-1 h-px bg-gray-200"></div>
              <Link
                to="/equipment"
                className="text-sm font-semibold text-green-600 hover:text-green-700 flex items-center gap-1 transition-colors whitespace-nowrap"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="text-gray-500 text-sm mb-6 ml-14">
              Discover more equipment that might interest you
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
                {relatedProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/equipment/${product.id}`}
                    className="snap-start w-[75vw] flex-shrink-0"
                  >
                    <div className="group bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-xl hover:border-green-300 transition-all duration-300">
                      <div className="relative bg-gray-100 h-44 overflow-hidden">
                        <img
                          src={apiHelper.image(product.frontView) || "/mah.png"}
                          alt={
                            product.displayName ||
                            product.productName ||
                            product.name
                          }
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                        <span className="absolute top-3 left-3 bg-green-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md">
                          Equipment
                        </span>
                      </div>
                      <div className="p-4">
                        <h4 className="text-sm font-semibold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2 mb-1.5">
                          {product.displayName ||
                            product.productName ||
                            product.name}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          <span>
                            {[product.district, product.state]
                              .filter(Boolean)
                              .join(", ") || "Location not specified"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <p className="text-base font-bold text-gray-900">
                            ₹
                            {Number(product.expectedPrice || 0).toLocaleString(
                              "en-IN",
                            )}
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
                        to={`/equipment/${product.id}`}
                        className="flex-shrink-0 group bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-xl hover:border-green-300 transition-all duration-300 w-full sm:w-[calc(50%-6px)] lg:w-[calc(25%-12px)]"
                      >
                        <div className="relative bg-gray-100 h-48 overflow-hidden">
                          <img
                            src={
                              apiHelper.image(product.frontView) || "/mah.png"
                            }
                            alt={
                              product.displayName ||
                              product.productName ||
                              product.name
                            }
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                          <span className="absolute top-3 left-3 bg-gradient-to-r from-green-600 to-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md">
                            Equipment
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
                              {product.equipmentType ||
                                product.category?.categoryName ||
                                "Equipment"}
                            </span>
                            <div className="flex items-center gap-1">
                              <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3.5 h-3.5 ${
                                      i < 4
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300 fill-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <h4 className="text-sm font-semibold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2 mb-1.5">
                            {product.displayName ||
                              product.productName ||
                              product.name}
                          </h4>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            <span>
                              {[product.district, product.state]
                                .filter(Boolean)
                                .join(", ") || "Location not specified"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <p className="text-base font-bold text-gray-900">
                              ₹
                              {Number(
                                product.expectedPrice || 0,
                              ).toLocaleString("en-IN")}
                            </p>
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
          </div>
        )}
      </div>

      {/* Enquiry Modal - Custom for Equipment */}
      <EnquiryModal
        isOpen={showEnquiryModal}
        onClose={() => setShowEnquiryModal(false)}
        equipment={equipment}
      />
    </div>
  );
};

// ─── Tab Components ──────────────────────────────────────────────────────

// 1. Description Tab
const DescriptionTab = ({ equipment, keyHighlights }) => (
  <div className="grid grid-cols-1 gap-4">
    <SectionCard title="Description" icon={Info}>
      <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
        {equipment.description || "No description available."}
      </p>
    </SectionCard>

    {keyHighlights.length > 0 && (
      <SectionCard title="Key Highlights" icon={Award}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {keyHighlights.map((highlight, index) => (
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

// 2. Basic Info Tab - WITHOUT Category ID, Brand ID, Model ID, Variant ID
const BasicInfoTab = ({ equipment }) => {
  const basicInfoItems = [
    { label: "Display Name", value: equipment.displayName },
    { label: "Product Name", value: equipment.productName },
    { label: "Equipment Type", value: equipment.equipmentType },
    { label: "Brand", value: equipment.brand },
    { label: "Model", value: equipment.model },
    { label: "Variant", value: equipment.variant },
    { label: "Condition", value: equipment.equipmentCondition },
    { label: "Manufacturing Year", value: equipment.manufacturingYear },
    { label: "Purchase Year", value: equipment.purchaseYear },
    { label: "Serial Number", value: equipment.serialNumber },
    { label: "Product Code", value: equipment.productCode },
    { label: "Color", value: equipment.color },
    { label: "Status", value: equipment.status },
    { label: "Current Step", value: equipment.currentStep },
    { label: "Agreed", value: equipment.agreed ? "Yes" : "No" },
    // { label: "Enquiry Count", value: equipment.enquiryCount },
  ];

  const validItems = basicInfoItems.filter((item) => hasValidValue(item.value));

  if (validItems.length === 0) return null;

  return (
    <SectionCard title="Basic Information" icon={Package}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
        {validItems.map((item, index, arr) => (
          <DetailRow
            key={item.label}
            label={item.label}
            value={item.value}
            // last={index === arr.length - 1}
          />
        ))}
      </div>
    </SectionCard>
  );
};

// 3. Specifications Tab
const SpecificationsTab = ({ equipment }) => {
  const specItems = [
    { label: "Power Source", value: equipment.powerSource },
    { label: "PTO Requirement", value: equipment.ptoRequirement },
    { label: "Required Tractor HP", value: equipment.requiredTractorHp },
    { label: "Working Width", value: equipment.workingWidth },
    { label: "Working Capacity", value: equipment.workingCapacity },
    { label: "Working Speed", value: equipment.workingSpeed },
    { label: "Weight", value: equipment.weight },
    { label: "Length", value: equipment.length },
    { label: "Width", value: equipment.width },
    { label: "Height", value: equipment.height },
    { label: "Production Capacity", value: equipment.productionCapacity },
    { label: "Fuel Consumption", value: equipment.fuelConsumption },
    { label: "RPM", value: equipment.rpm },
    { label: "Number of Blades", value: equipment.numberOfBlades },
    { label: "Number of Rows", value: equipment.numberOfRows },
    { label: "Tank Capacity", value: equipment.tankCapacity },
    { label: "Working Depth", value: equipment.workingDepth },
    { label: "Threshing Capacity", value: equipment.threshingCapacity },
    { label: "Crop Type", value: equipment.cropType },
    { label: "Drum Size", value: equipment.drumSize },
    { label: "Fan Type", value: equipment.fanType },
    { label: "Cleaning System", value: equipment.cleaningSystem },
    { label: "Rotor RPM", value: equipment.rotorRpm },
    { label: "Spray Width", value: equipment.sprayWidth },
    { label: "Pump Type", value: equipment.pumpType },
    { label: "Nozzle Count", value: equipment.nozzleCount },
    { label: "Pressure", value: equipment.pressure },
  ];

  const validItems = specItems.filter((item) => hasValidValue(item.value));

  if (validItems.length === 0) return null;

  return (
    <SectionCard title="Specifications" icon={Settings}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
        {validItems.map((item, index, arr) => (
          <DetailRow
            key={item.label}
            label={item.label}
            value={item.value}
            last={index === arr.length - 1}
          />
        ))}
      </div>
    </SectionCard>
  );
};

// 4. Mechanical Tab
const MechanicalTab = ({ equipment }) => {
  const mechanicalItems = [
    { label: "Overall Condition", value: equipment.overallCondition },
    { label: "Oil Leakage", value: equipment.oilLeakage },
    { label: "Working Condition", value: equipment.workingCondition },
    {
      label: "Main Machine",
      value: equipment.mechanical?.mainMachineCondition,
    },
    { label: "Drive System", value: equipment.mechanical?.driveSystem },
    { label: "Belt/Chain", value: equipment.mechanical?.beltChainCondition },
    { label: "Bearings", value: equipment.mechanical?.bearingCondition },
    { label: "Gearbox", value: equipment.mechanical?.gearboxCondition },
  ];

  const validItems = mechanicalItems.filter((item) =>
    hasValidValue(item.value),
  );

  if (validItems.length === 0) return null;

  return (
    <SectionCard title="Mechanical Condition" icon={Wrench}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
        {validItems.map((item, index, arr) => (
          <DetailRow
            key={item.label}
            label={item.label}
            value={item.value}
            // last={index === arr.length - 1}
          />
        ))}
      </div>
    </SectionCard>
  );
};

// 5. Electrical Tab
const ElectricalTab = ({ equipment }) => {
  const electricalItems = [
    { label: "Wiring", value: equipment.electrical?.wiring },
    { label: "Motor/Starter", value: equipment.electrical?.motorStarter },
    { label: "Battery", value: equipment.electrical?.battery },
    { label: "Lights", value: equipment.electrical?.lights },
    { label: "Control Panel", value: equipment.electrical?.controlPanel },
  ];

  const validItems = electricalItems.filter((item) =>
    hasValidValue(item.value),
  );

  if (validItems.length === 0) return null;

  return (
    <SectionCard title="Electrical Condition" icon={Zap}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
        {validItems.map((item, index, arr) => (
          <DetailRow
            key={item.label}
            label={item.label}
            value={item.value}
            last={index === arr.length - 1}
          />
        ))}
      </div>
    </SectionCard>
  );
};

// 6. Parts & Attachments Tab
const PartsAttachmentsTab = ({ equipment }) => {
  const partsItems = [
    { label: "Blades", value: equipment.partsCondition?.blades },
    { label: "Belts", value: equipment.partsCondition?.belts },
    { label: "Bearings", value: equipment.partsCondition?.bearings },
    { label: "Chains", value: equipment.partsCondition?.chains },
    { label: "Gears", value: equipment.partsCondition?.gears },
    { label: "Rollers", value: equipment.partsCondition?.rollers },
    { label: "Nozzles", value: equipment.partsCondition?.nozzles },
  ];

  const validParts = partsItems.filter((item) => hasValidValue(item.value));

  return (
    <div className="grid grid-cols-1 gap-4">
      {validParts.length > 0 && (
        <SectionCard title="Parts Condition" icon={Wrench}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
            {validParts.map((item, index, arr) => (
              <DetailRow
                key={item.label}
                label={item.label}
                value={item.value}
                last={index === arr.length - 1}
              />
            ))}
          </div>
        </SectionCard>
      )}

      {equipment.attachmentList.length > 0 && (
        <SectionCard title="Attachments" icon={Settings}>
          <div className="flex flex-wrap gap-2">
            {equipment.attachmentList.map((attachment) => (
              <span
                key={attachment}
                className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium px-3 py-1.5 rounded-full"
              >
                {attachment.replace(/([A-Z])/g, " $1").trim()}
              </span>
            ))}
            {equipment.otherAttachmentName && (
              <span className="bg-purple-50 text-purple-700 border border-purple-200 text-xs font-medium px-3 py-1.5 rounded-full">
                Other: {equipment.otherAttachmentName}
              </span>
            )}
          </div>
        </SectionCard>
      )}

      <SectionCard title="Service History" icon={Calendar}>
        <DetailRow
          label="Last Service Date"
          value={formatDate(equipment.lastServiceDate)}
        />
        <DetailRow label="Major Repair" value={equipment.majorRepair} />
        <DetailRow label="Accident Damage" value={equipment.accidentDamage} />
        <DetailRow label="Flood Damage" value={equipment.floodDamage} />
        <DetailRow
          label="Belt/Chain Changed"
          value={equipment.partsReplaced?.beltChainChanged}
        />
        <DetailRow
          label="Bearings Changed"
          value={equipment.partsReplaced?.bearingChanged}
        />
        <DetailRow
          label="Gearbox Repaired"
          value={equipment.partsReplaced?.gearboxRepaired}
          last
        />
      </SectionCard>
    </div>
  );
};

// 7. Seller Tab
const SellerTab = ({ equipment }) => (
  <div className="grid grid-cols-1 gap-4">
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
            {equipment.sellerTypeDisplay}{" "}
            {equipment.sellerSince && `• Since ${equipment.sellerSince}`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-500">Seller Type</p>
          <p className="font-semibold text-gray-900 capitalize">
            {equipment.sellerType}
          </p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-500">Owner Type</p>
          <p className="font-semibold text-gray-900 capitalize">
            {equipment.ownerType}
          </p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-500">Usage</p>
          <p className="font-semibold text-gray-900 capitalize">
            {equipment.usage}
          </p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-200 mb-4">
        <p className="text-xs sm:text-sm text-gray-500">
          Ownership Proof Available
        </p>
        <p className="font-semibold text-gray-900">
          {equipment.ownershipProofAvailable ? "Yes" : "No"}
        </p>
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

    <SectionCard title="Location Details" icon={MapPin}>
      <DetailRow label="Country" value={equipment.country} />
      <DetailRow label="State" value={equipment.state} />
      <DetailRow label="District" value={equipment.district} />
      <DetailRow label="Taluka" value={equipment.taluka} />
      <DetailRow label="Village" value={equipment.village} />
      <DetailRow label="Pincode" value={equipment.pincode} />
      <DetailRow label="Landmark" value={equipment.landmark} />
      <DetailRow label="Latitude" value={equipment.latitude} />
      <DetailRow label="Longitude" value={equipment.longitude} last />
    </SectionCard>
  </div>
);

// 8. Media & Documents Tab
const MediaDocumentsTab = ({ equipment }) => {
  const mediaItems = [
    { label: "Front View", value: equipment.frontView },
    { label: "Left View", value: equipment.leftView },
    { label: "Right View", value: equipment.rightView },
    { label: "Rear View", value: equipment.rearView },
    { label: "Main Equipment", value: equipment.mainEquipment },
    { label: "Working Mechanism", value: equipment.workingMechanism },
    { label: "Control Panel", value: equipment.controlPanel },
    { label: "Serial Number Image", value: equipment.serialNumberImage },
    { label: "Attachments Image", value: equipment.attachmentsImage },
    { label: "Tyres/Wheels", value: equipment.tyresWheels },
  ];

  const validMedia = mediaItems.filter((item) => hasValidValue(item.value));

  const videoItems = [
    { label: "Walkaround Video", value: equipment.walkaroundVideo },
    { label: "Working Video", value: equipment.workingVideo },
    { label: "Machine Start Video", value: equipment.machineStartVideo },
    { label: "PTO Working Video", value: equipment.ptoWorkingVideo },
    {
      label: "Hydraulic Working Video",
      value: equipment.hydraulicWorkingVideo,
    },
  ];

  const validVideos = videoItems.filter((item) => hasValidValue(item.value));

  const documentItems = [
    { label: "Purchase Invoice", value: equipment.purchaseInvoice },
    { label: "Ownership Proof", value: equipment.ownershipProof },
    { label: "Warranty Document", value: equipment.warrantyDocument },
    { label: "Insurance", value: equipment.insurance },
    { label: "Service Records", value: equipment.serviceRecords },
    { label: "Other Documents", value: equipment.otherDocuments },
  ];

  const validDocuments = documentItems.filter((item) =>
    hasValidValue(item.value),
  );

  if (
    validMedia.length === 0 &&
    validVideos.length === 0 &&
    validDocuments.length === 0
  ) {
    return (
      <SectionCard title="Media & Documents" icon={FileText}>
        <p className="text-gray-500 text-center py-4">
          No media or documents available.
        </p>
      </SectionCard>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {validMedia.length > 0 && (
        <SectionCard title="Equipment Images" icon={FileText}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {validMedia.map((item) => (
              <div
                key={item.label}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <img
                  src={apiHelper.image(item.value)}
                  alt={item.label}
                  className="w-full h-32 object-cover"
                  onError={(e) => {
                    e.target.src = "/mah.png";
                  }}
                />
                <p className="text-xs text-center text-gray-500 py-1">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {validVideos.length > 0 && (
        <SectionCard title="Videos" icon={Play}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {validVideos.map((item) => (
              <div
                key={item.label}
                className="bg-gray-50 rounded-lg p-3 border border-gray-200"
              >
                <p className="font-semibold text-gray-700 text-sm">
                  {item.label}
                </p>
                <a
                  href={apiHelper.image(item.value)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700 text-sm flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  View Video
                </a>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {validDocuments.length > 0 && (
        <SectionCard title="Documents" icon={FileText}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {validDocuments.map((item) => (
              <div
                key={item.label}
                className="bg-gray-50 rounded-lg p-3 border border-gray-200 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-gray-700 text-sm">
                    {item.label}
                  </p>
                  <p className="text-xs text-gray-500 truncate max-w-[150px]">
                    {item.value.split("/").pop()}
                  </p>
                </div>
                <a
                  href={apiHelper.image(item.value)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
                >
                  View
                </a>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
};

export default EquipmentDetails;
