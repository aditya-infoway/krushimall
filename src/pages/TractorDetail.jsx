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
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import EnquiryModal from "../components/EnquiryModal";
import apiHelper from "../utils/apiHelper";

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
  return "bg-green-50 text-green-700 border-green-200";
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
      className={`flex justify-between py-3 ${!last ? "border-b border-gray-100" : ""}`}
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
      className={`bg-white rounded-2xl border border-gray-200 shadow-sm p-6 ${className}`}
    >
      <div className="flex items-center gap-2 mb-5">
        {Icon && <Icon size={18} className="text-green-600" />}
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      </div>
      {children}
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
  { id: "details", label: "Product Details" },
  { id: "engine", label: "Engine" },
  { id: "transmission", label: "Transmission" },
  { id: "hydraulic", label: "Hydraulic & Tyres" },
  { id: "pricing", label: "Pricing" },
  { id: "dealer", label: "Dealer Info" },
];

// ─── Main Component ────────────────────────────────────────────────────────
const TractorDetails = () => {
  const { id } = useParams();
  const [currentImage, setCurrentImage] = useState(0);
  const [wishlist, setWishlist] = useState(false);
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
        const response = await apiHelper.get(`/website-variants/${id}`);
        console.log("API Response:", response.data);
        // Log specific fields for debugging - using actual field names from API

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

  // Key highlights
  const keyHighlights = [
    d.highlight1,
    d.highlight2,
    d.highlight3,
    d.highlight4,
    d.highlight5,
    d.highlight6,
    d.highlight7,
    d.highlight8,
  ].filter((h) => hasValidValue(h));

  // Available colors
  // Available colors - Using correct API field names
  // For testing: Show colors even if they're false
  const colorFields = {
    red: d.redColor,
    blue: d.blueColor,
    green: d.greenColor,
    yellow: d.yellowColor,
    orange: d.orangeColor,
    black: d.blackColor,
    white: d.whiteColor,
    grey: d.greyColor,
  };

  const availableColors = [
    d.redColor ? "Red" : null,
    d.blueColor ? "Blue" : null,
    d.greenColor ? "Green" : null,
    d.yellowColor ? "Yellow" : null,
    d.orangeColor ? "Orange" : null,
    d.blackColor ? "Black" : null,
    d.whiteColor ? "White" : null,
    d.greyColor ? "Grey" : null,
    d.customColor ? d.customColorName || "Custom" : null,
  ].filter((c) => c !== null && c !== undefined && c !== "");

  // Only show colors that are actually saved in the database
  const displayColors = availableColors;

  console.log("Available Colors from API:", colorFields);
  console.log("Available Colors array:", availableColors);
  console.log("Display Colors:", displayColors);

  // Transmission features
  const transmissionFeatures = [
    d.creeperGears === true && "Creeper Gears",
    d.shuttleShift === true && "Shuttle Shift",
    d.sideShiftGear === true && "Side Shift Gear",
    d.powerShuttle === true && "Power Shuttle",
    d.hiLoGears === true && "Hi-Lo Gears",
    d.multiSpeedPTO === true && "Multi Speed PTO",
    d.reversePTO === true && "Reverse PTO",
    d.superReducer === true && "Super Reducer",
  ].filter(Boolean);

  // Hydraulic features
  const hydraulicFeatures = [
    d.externalHydraulicCylinder === true && "External Hydraulic Cylinder",
    d.selfLevelling === true && "Self Levelling",
    d.quickHitch === true && "Quick Hitch",
    d.downPositionControl === true && "Down Position Control",
    d.loadSensing === true && "Load Sensing",
    d.flowControl === true && "Flow Control",
    d.returnToDepth === true && "Return to Depth",
    d.transportLock === true && "Transport Lock",
  ].filter(Boolean);

  // ─── Tractor Object ──────────────────────────────────────────────────────
  const tractor = {
    // Basic Info
    name: hasValidValue(d.productName) ? d.productName : "Swaraj 744 FE",
    category: hasValidValue(d.category?.categoryName)
      ? d.category.categoryName
      : "Tractor",
    brand: hasValidValue(d.brand?.brandName) ? d.brand.brandName : "Unknown",
    model: hasValidValue(d.model?.modelName) ? d.model.modelName : "Unknown",
    variant: hasValidValue(d.variant?.variantName)
      ? d.variant.variantName
      : "Unknown",
    variantCode: hasValidValue(d.variantCode) ? d.variantCode : null,
    productCode: hasValidValue(d.productCode) ? d.productCode : null,
    skuCode: hasValidValue(d.skuCode) ? d.skuCode : null,
    launchYear: formatLaunchYear(
      getFieldValue(d, ["launchYear", "year", "manufacturingYear"]),
    ),

    // Pricing
    price: hasValidValue(d.exShowroomPrice)
      ? `₹ ${Number(d.exShowroomPrice).toLocaleString("en-IN")}`
      : "₹ 2,65,000",
    onRoadPrice: hasValidValue(d.onRoadPrice)
      ? `₹ ${Number(d.onRoadPrice).toLocaleString("en-IN")}`
      : null,

    // Specs
    hp: hasValidValue(d.horsePower) ? `${d.horsePower} HP` : "45 HP",
    cc: hasValidValue(d.cubicCapacity) ? `${d.cubicCapacity} CC` : "3136 CC",
    drive: hasValidValue(d.driveType) ? d.driveType : "2 WD",
    tyreCondition: hasValidValue(d.tyreCondition) ? d.tyreCondition : "80%",
    engineCondition: hasValidValue(d.engineCondition)
      ? d.engineCondition
      : "Good",
    rc: hasValidValue(d.rcAvailable) ? "Yes" : "No",
    phone: hasValidValue(d.phone) ? d.phone : "12345 67890",
    description: hasValidValue(d.shortDescription)
      ? d.shortDescription
      : "Ekdum Badhiya Tractor Farming Ke liye Best.",
    images: finalImages,
    stockStatus: formatStockStatus(
      getFieldValue(d, ["stockStatus", "stock_status", "availability"]),
    ),

    // Engine
    engineType: hasValidValue(d.engineType) ? d.engineType : null,
    fuelType: hasValidValue(d.fuelType) ? d.fuelType : null,
    cylinders: hasValidValue(d.numberOfCylinders) ? d.numberOfCylinders : null,
    ratedRPM: hasValidValue(d.ratedRPM) ? d.ratedRPM : null,
    aspiratedType: hasValidValue(d.aspiratedType) ? d.aspiratedType : null,
    emissionNorms: hasValidValue(d.emissionNorms) ? d.emissionNorms : null,
    coolingSystem: hasValidValue(d.coolingSystem) ? d.coolingSystem : null,
    airFilterType: hasValidValue(d.airFilterType) ? d.airFilterType : null,
    maxTorque: hasValidValue(d.maximumTorque) ? `${d.maximumTorque} NM` : null,
    torqueRPM: hasValidValue(d.torqueRPM) ? `${d.torqueRPM} RPM` : null,
    torqueBackup: hasValidValue(d.torqueBackup) ? `${d.torqueBackup}%` : null,

    // Transmission
    clutchType: hasValidValue(d.clutchType) ? d.clutchType : null,
    forwardGears: hasValidValue(d.forwardGears) ? d.forwardGears : null,
    reverseGears: hasValidValue(d.reverseGears) ? d.reverseGears : null,
    gearType: hasValidValue(d.gearType) ? d.gearType : null,
    transmissionType: hasValidValue(d.transmissionType)
      ? d.transmissionType
      : null,
    ptoHP: hasValidValue(getFieldValue(d, ["ptoHp", "ptoHP", "pto_hp"]))
      ? `${getFieldValue(d, ["ptoHp", "ptoHP", "pto_hp"])} HP`
      : null,
    ptoRPM: hasValidValue(getFieldValue(d, ["ptoRpm", "ptoRPM", "pto_rpm"]))
      ? `${getFieldValue(d, ["ptoRpm", "ptoRPM", "pto_rpm"])} RPM`
      : null,
    ptoType: hasValidValue(d.ptoType) ? d.ptoType : null,
    ptoPosition: hasValidValue(d.ptoPosition) ? d.ptoPosition : null,

    // Hydraulic
    maxLiftingCapacity: hasValidValue(
      getFieldValue(d, [
        "liftingCapacity",
        "maxLiftingCapacity",
        "maxLiftingCap",
      ]),
    )
      ? `${getFieldValue(d, ["liftingCapacity", "maxLiftingCapacity", "maxLiftingCap"])} kg`
      : null,
    liftingCapacityLinkEnd: hasValidValue(
      getFieldValue(d, [
        "liftingCapacityAt610mm",
        "liftingCapacityAtLinkEnd",
        "liftingCapacityLinkEnd",
      ]),
    )
      ? `${getFieldValue(d, ["liftingCapacityAt610mm", "liftingCapacityAtLinkEnd", "liftingCapacityLinkEnd"])} kg`
      : null,
    hydraulicType: hasValidValue(d.hydraulicType) ? d.hydraulicType : null,
    controlType: hasValidValue(d.controlType) ? d.controlType : null,
    remoteValve: hasValidValue(d.remoteValveSpool) ? d.remoteValveSpool : null,
    numberOfRemoteValves: hasValidValue(d.numberOfRemoteValves)
      ? d.numberOfRemoteValves
      : null,
    threePointLinkage: hasValidValue(d.threePointLinkage)
      ? d.threePointLinkage
      : null,
    linkageCategory: hasValidValue(d.linkageCategory)
      ? d.linkageCategory
      : null,
    topLink: hasValidValue(d.topLink) ? d.topLink : null,
    draftSensitivity: hasValidValue(d.draftSensitivity)
      ? d.draftSensitivity
      : null,

    // Pricing extras
    gst: hasValidValue(d.gst) ? `${d.gst}%` : null,
    tcsApplicable: hasValidValue(d.tcsApplicable)
      ? d.tcsApplicable
        ? "Yes"
        : "No"
      : null,
    tcsPercent: hasValidValue(d.tcsPercent) ? `${d.tcsPercent}%` : null,
    financeAvailable: hasValidValue(d.financeAvailable)
      ? d.financeAvailable
        ? "Yes"
        : "No"
      : null,
    emiAvailable: hasValidValue(d.emiAvailable)
      ? d.emiAvailable
        ? "Yes"
        : "No"
      : null,
    downPayment: hasValidValue(d.downPayment)
      ? `₹ ${Number(d.downPayment).toLocaleString("en-IN")}`
      : null,
    exchangeOffer: hasValidValue(d.exchangeOffer)
      ? d.exchangeOffer
        ? "Yes"
        : "No"
      : null,
    offerPrice: hasValidValue(d.offerPrice)
      ? `₹ ${Number(d.offerPrice).toLocaleString("en-IN")}`
      : null,
    negotiable: hasValidValue(d.negotiable)
      ? d.negotiable
        ? "Yes"
        : "No"
      : null,
    currency: hasValidValue(d.currency) ? d.currency : null,

    // Dealer availability
    availableStates: d.availableStates || [],
    availableDistricts: d.availableDistricts || [],
    availableDealers: d.availableDealers || [],

    // Similar & Related Products
    similar: d.similarProducts || [
      { name: "Mahindra 265 DI", price: "₹ 4,60,000", image: "/mah.png" },
      { name: "Mahindra 575 DI", price: "₹ 1,65,000", image: "/mah.png" },
      { name: "HMT 5911 Tractor", price: "₹ 3,95,000", image: "/mah.png" },
      { name: "Eicher 241", price: "₹ 1,55,000", image: "/mah.png" },
    ],
    relatedProducts: d.relatedProducts || [
      {
        id: 5,
        name: "Mahindra Arjun 605",
        location: "Mettur",
        price: "₹8,50,000",
        image: "/mah.png",
      },
      {
        id: 6,
        name: "Best Swaraj Tractor",
        location: "Bengaluru",
        price: "₹4,45,000",
        image: "/mah.png",
      },
      {
        id: 7,
        name: "Eicher 380 Tractor",
        location: "Karimnagar",
        price: "₹3,50,000",
        image: "/mah.png",
      },
      {
        id: 8,
        name: "Swaraj 744 FE",
        location: "Sandila",
        price: "₹3,70,000",
        image: "/mah.png",
      },
    ],
  };

  // ─── Auto Slider ──────────────────────────────────────────────────────────
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (window.innerWidth >= 640) {
        setRelatedIndex((prev) => (prev + 1) % tractor.relatedProducts.length);
      }
    }, 3000);
    return () => clearInterval(intervalRef.current);
  }, [tractor.relatedProducts.length]);

  const cardsToShow = 4;
  const getVisibleRelated = () => {
    const visible = [];
    for (let i = 0; i < cardsToShow; i++) {
      visible.push(
        tractor.relatedProducts[
          (relatedIndex + i) % tractor.relatedProducts.length
        ],
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
      case "details":
        return <ProductDetailsTab tractor={tractor} />;
      case "engine":
        return <EngineTab tractor={tractor} />;
      case "transmission":
        return (
          <TransmissionTab
            tractor={tractor}
            transmissionFeatures={transmissionFeatures}
          />
        );
      case "hydraulic":
        return (
          <HydraulicTab
            tractor={tractor}
            hydraulicFeatures={hydraulicFeatures}
          />
        );
      case "pricing":
        return <PricingTab tractor={tractor} />;
      case "dealer":
        return <DealerTab tractor={tractor} />;
      default:
        return (
          <DescriptionTab tractor={tractor} keyHighlights={keyHighlights} />
        );
    }
  };

  // ─── Main Render ─────────────────────────────────────────────────────────
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Breadcrumb */}
      <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pt-8 pb-4">
        <div className="flex items-center gap-2 text-sm">
          <Link
            to="/"
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <Link
            to="/tractor"
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Tractor
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-500">{tractor.name}</span>
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
                    onClick={() => setWishlist(!wishlist)}
                    className="w-10 h-10 cursor-pointer bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all"
                  >
                    <Heart
                      size={18}
                      className={
                        wishlist
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
                {hasValidValue(tractor.stockStatus) && (
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full border ${getStockStatusColor(tractor.stockStatus)}`}
                  >
                    {tractor.stockStatus}
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {tractor.name}
              </h1>
              <p className="text-3xl font-black text-gray-900 mb-1">
                {tractor.price}
              </p>
              {hasValidValue(tractor.onRoadPrice) && (
                <p className="text-sm text-gray-500 mb-4">
                  On-Road:{" "}
                  <span className="font-semibold text-gray-700">
                    {tractor.onRoadPrice}
                  </span>
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
                {hasValidValue(tractor.cc) && (
                  <div className="bg-gray-50 rounded-xl p-3 flex flex-col items-center justify-center">
                    <Settings className="text-gray-600 mb-1" size={20} />
                    <p className="text-xs font-semibold text-gray-900">
                      {tractor.cc}
                    </p>
                  </div>
                )}
                {hasValidValue(tractor.drive) && (
                  <div className="bg-gray-50 rounded-xl p-3 flex flex-col items-center justify-center">
                    <GitBranch className="text-gray-600 mb-1" size={20} />
                    <p className="text-xs font-semibold text-gray-900">
                      {tractor.drive}
                    </p>
                  </div>
                )}
              </div>

              {/* Core condition rows */}
              <div className="border-t border-gray-100">
                <DetailRow
                  label="Tyre Condition"
                  value={tractor.tyreCondition}
                />
                <DetailRow
                  label="Engine Condition"
                  value={tractor.engineCondition}
                />
                <DetailRow label="RC Available" value={tractor.rc} last />
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
                  <img src="/mah.png" alt="Logo" className="w-8" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{tractor.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    New Product Available.
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
                Similar <span className="text-green-600">Products</span>
              </h3>
              <div className="space-y-4">
                {tractor.similar.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl border border-gray-200 shadow-sm p-3 flex gap-3 hover:shadow-lg transition-all"
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
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── TABS SECTION ── */}
        <div className="mt-10 mb-6">
          {/* Tab Navigation */}
          {/* Tab Navigation - No icons, no scrollbar */}
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

        {/* ── Related Products Slider ── */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Related Products <span className="text-green-600">- Tractor</span>
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Short Details About Tractor
          </p>

          {/* Mobile View */}
          <div className="sm:hidden relative">
            <button
              onClick={() => scrollRelated("left")}
              className={`cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 -ml-1 z-20 flex items-center justify-center w-8 h-8 border border-green-200 text-green-700 rounded-full bg-white shadow-lg hover:bg-green-50 transition-all duration-300 ${
                isScrollingRelated
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-2"
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div
              ref={relatedScrollRef}
              className="flex overflow-x-auto gap-3 pb-4 px-4 snap-x snap-mandatory scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {tractor.relatedProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/tractor/${product.id}`}
                  className="snap-start w-[75vw] flex-shrink-0"
                >
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition-all">
                    <div className="bg-gray-100 h-36">
                      <img
                        src={product.image || "/mah.png"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <div className="text-xs bg-green-600 text-white inline-block px-2 py-0.5 rounded-full mb-2">
                        Tractor
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                        <MapPin className="h-3 w-3" />
                        <span>{product.location || "Unknown"}</span>
                      </div>
                      <p className="text-base font-bold text-gray-900">
                        {product.price}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <button
              onClick={() => scrollRelated("right")}
              className={`cursor-pointer absolute right-0 top-1/2 -translate-y-1/2 -mr-1 z-20 flex items-center justify-center w-8 h-8 border border-green-200 text-green-700 rounded-full bg-white shadow-lg hover:bg-green-50 transition-all duration-300 ${
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
              className="absolute left-0 sm:left-1 lg:left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white border border-gray-200 cursor-pointer rounded-full shadow-md flex items-center justify-center hover:bg-green-50 hover:border-green-300 transition-all"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
            </button>
            <div className="overflow-hidden">
              <div className="flex gap-3 sm:gap-4 transition-transform duration-500 ease-in-out">
                {getVisibleRelated().map((product, idx) => (
                  <Link
                    key={`${product.id}-${relatedIndex}-${idx}`}
                    to={`/tractor/${product.id}`}
                    className="flex-shrink-0 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition-all w-full sm:w-[calc(50%-6px)] lg:w-[calc(25%-12px)]"
                  >
                    <div className="bg-gray-100 h-36 sm:h-40">
                      <img
                        src={product.image || "/mah.png"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <div className="text-xs bg-green-600 text-white inline-block px-2 py-0.5 rounded-full mb-2">
                        Tractor
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                        <MapPin className="h-3 w-3" />
                        <span>{product.location || "Unknown"}</span>
                      </div>
                      <p className="text-base font-bold text-gray-900">
                        {product.price}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <button
              onClick={() => slideRelated("next")}
              className="absolute right-0 sm:right-1 lg:right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 cursor-pointer bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center hover:bg-green-50 hover:border-green-300 transition-all"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
            </button>
          </div>

          <div className="text-center mt-8">
            <Link
              to="/tractors"
              className="inline-block cursor-pointer bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              View All
            </Link>
          </div>
        </div>
      </div>

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={showEnquiryModal}
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
const BasicInfoTab = ({ tractor }) => (
  <SectionCard title="Basic Information" icon={Package}>
    <DetailRow label="Category" value={tractor.category} />
    <DetailRow label="Brand" value={tractor.brand} />
    <DetailRow label="Model" value={tractor.model} />
    <DetailRow label="Variant" value={tractor.variant} />
    <DetailRow label="Variant Code" value={tractor.variantCode} />
    <DetailRow label="Product Code" value={tractor.productCode} />
    <DetailRow label="SKU Code" value={tractor.skuCode} />
    <DetailRow label="Launch Year" value={tractor.launchYear} />
    <DetailRow label="Stock Status" value={tractor.stockStatus} last />
  </SectionCard>
);

// 3. Product Details Tab
const ProductDetailsTab = ({ tractor }) => (
  <SectionCard title="Product Details" icon={Settings}>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <DetailRow label="Horse Power" value={tractor.hp} />
        <DetailRow label="Cubic Capacity" value={tractor.cc} />
        <DetailRow label="Drive Type" value={tractor.drive} />
        <DetailRow label="Tyre Condition" value={tractor.tyreCondition} />
      </div>
      <div>
        <DetailRow label="Engine Condition" value={tractor.engineCondition} />
        <DetailRow label="RC Available" value={tractor.rc} />
        <DetailRow label="Stock Status" value={tractor.stockStatus} />
        <DetailRow label="Launch Year" value={tractor.launchYear} last />
      </div>
    </div>
  </SectionCard>
);

// 4. Engine Tab
const EngineTab = ({ tractor }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <SectionCard title="Engine Specifications" icon={Gauge}>
      <DetailRow label="Engine Type" value={tractor.engineType} />
      <DetailRow label="Fuel Type" value={tractor.fuelType} />
      <DetailRow label="Horse Power" value={tractor.hp} />
      <DetailRow label="No. of Cylinders" value={tractor.cylinders} />
      <DetailRow label="Cubic Capacity" value={tractor.cc} />
      <DetailRow label="Rated RPM" value={tractor.ratedRPM} />
      <DetailRow label="Aspirated Type" value={tractor.aspiratedType} />
      <DetailRow label="Emission Norms" value={tractor.emissionNorms} last />
    </SectionCard>

    <div className="flex flex-col gap-4">
      <SectionCard title="Cooling & Air Filter" icon={Wind}>
        <DetailRow label="Cooling System" value={tractor.coolingSystem} />
        <DetailRow label="Air Filter Type" value={tractor.airFilterType} last />
      </SectionCard>

      <SectionCard title="Torque Details" icon={Gauge}>
        <DetailRow label="Max Torque" value={tractor.maxTorque} />
        <DetailRow label="Torque RPM" value={tractor.torqueRPM} />
        <DetailRow label="Torque Backup" value={tractor.torqueBackup} />
        <DetailRow
          label="Engine Condition"
          value={tractor.engineCondition}
          last
        />
      </SectionCard>
    </div>
  </div>
);

// 5. Transmission Tab
const TransmissionTab = ({ tractor, transmissionFeatures }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <SectionCard title="Clutch & Gearbox" icon={Cog}>
      <DetailRow label="Clutch Type" value={tractor.clutchType} />
      <DetailRow label="Forward Gears" value={tractor.forwardGears} />
      <DetailRow label="Reverse Gears" value={tractor.reverseGears} />
      <DetailRow label="Gear Type" value={tractor.gearType} />
      <DetailRow
        label="Transmission Type"
        value={tractor.transmissionType}
        last
      />
    </SectionCard>

    <div className="flex flex-col gap-4">
      <SectionCard title="PTO (Power Take Off)" icon={Zap}>
        <DetailRow label="PTO HP" value={tractor.ptoHP} />
        <DetailRow label="PTO RPM" value={tractor.ptoRPM} />
        <DetailRow label="PTO Type" value={tractor.ptoType} />
        <DetailRow label="PTO Position" value={tractor.ptoPosition} last />
      </SectionCard>

      {transmissionFeatures.length > 0 && (
        <SectionCard title="Additional Features" icon={Wrench}>
          <BadgeList items={transmissionFeatures} />
        </SectionCard>
      )}
    </div>
  </div>
);

// 6. Hydraulic Tab
const HydraulicTab = ({ tractor, hydraulicFeatures }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <SectionCard title="Lifting Capacity" icon={Gauge}>
      <DetailRow
        label="Max Lifting Capacity"
        value={tractor.maxLiftingCapacity}
      />
      <DetailRow label="At Link End" value={tractor.liftingCapacityLinkEnd} />
      <DetailRow label="Hydraulic Type" value={tractor.hydraulicType} />
      <DetailRow label="Control Type" value={tractor.controlType} last />
    </SectionCard>

    <div className="flex flex-col gap-4">
      <SectionCard title="Remote Valve & Linkage" icon={Wrench}>
        <DetailRow label="Remote Valve (Spool)" value={tractor.remoteValve} />
        <DetailRow
          label="No. of Remote Valves"
          value={tractor.numberOfRemoteValves}
        />
        <DetailRow label="3-Point Linkage" value={tractor.threePointLinkage} />
        <DetailRow label="Linkage Category" value={tractor.linkageCategory} />
        <DetailRow label="Top Link" value={tractor.topLink} />
        <DetailRow
          label="Draft Sensitivity"
          value={tractor.draftSensitivity}
          last
        />
      </SectionCard>

      {hydraulicFeatures.length > 0 && (
        <SectionCard title="Additional Hydraulic Features" icon={Droplets}>
          <BadgeList items={hydraulicFeatures} />
        </SectionCard>
      )}
    </div>
  </div>
);

// 7. Pricing Tab
const PricingTab = ({ tractor }) => (
  <SectionCard title="Pricing Details" icon={DollarSign}>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
      <div>
        <DetailRow label="Ex-Showroom Price" value={tractor.price} />
        <DetailRow label="On-Road Price" value={tractor.onRoadPrice} />
        <DetailRow label="Currency" value={tractor.currency} />
        <DetailRow label="GST" value={tractor.gst} />
        <DetailRow label="TCS Applicable" value={tractor.tcsApplicable} />
        <DetailRow label="TCS (%)" value={tractor.tcsPercent} />
      </div>
      <div>
        <DetailRow label="Finance Available" value={tractor.financeAvailable} />
        <DetailRow label="EMI Available" value={tractor.emiAvailable} />
        <DetailRow label="Down Payment" value={tractor.downPayment} />
        <DetailRow label="Exchange Offer" value={tractor.exchangeOffer} />
        <DetailRow label="Offer Price" value={tractor.offerPrice} />
        <DetailRow label="Negotiable" value={tractor.negotiable} last />
      </div>
    </div>
  </SectionCard>
);

// 8. Dealer Info Tab
const DealerTab = ({ tractor }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {tractor.availableStates.length > 0 && (
      <SectionCard title="Dealer Availability" icon={MapPin}>
        <div className="space-y-4">
          {tractor.availableStates.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                States
              </p>
              <BadgeList
                items={tractor.availableStates.map((s) => s?.name || s)}
              />
            </div>
          )}
          {tractor.availableDistricts.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Districts
              </p>
              <BadgeList
                items={tractor.availableDistricts.map((d) => d?.name || d)}
              />
            </div>
          )}
        </div>
      </SectionCard>
    )}

    {tractor.availableDealers.length > 0 && (
      <SectionCard title="Authorized Dealers" icon={Store}>
        <div className="space-y-3">
          {tractor.availableDealers.map((dealer, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
            >
              <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <MapPin size={16} className="text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">
                  {dealer?.name || dealer}
                </p>
                {dealer?.location && (
                  <p className="text-xs text-gray-500">{dealer.location}</p>
                )}
                {dealer?.phone && (
                  <p className="text-xs text-gray-500">{dealer.phone}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    )}
  </div>
);

export default TractorDetails;
