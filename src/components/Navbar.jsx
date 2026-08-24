import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  User,
  Search,
  Menu,
  X,
  Heart,
  ChevronDown,
  ChevronRight,
  Phone,
  Tag,
  LogOut,
  Package,
  HelpCircle,
  MapPin,
  Mail,
  Trash2,
  ArrowRight,
  LogIn,
  Wrench,
  Tractor,
  Scale,
  CalendarCheck,
  Store,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useNavigate, useLocation } from "react-router-dom";
import { showSuccessToast } from "../utils/toast";
import apiHelper from "../utils/apiHelper";

const Navbar = () => {
  const { cart, cartCount, cartTotal, removeFromCart } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { wishlistCount } = useWishlist();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [hoverDropdown, setHoverDropdown] = useState(null);
  const [cartPreviewOpen, setCartPreviewOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // ============================================================
  // MEGA MENU ACTIVE STATES
  // ============================================================

  const [activeMegaCat, setActiveMegaCat] = useState(null);

  // NEW:
  // Which subcategory is currently hovered
  const [activeMegaSub, setActiveMegaSub] = useState(null);

  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const cartPreviewRef = useRef(null);
  const userMenuRef = useRef(null);

  const navigate = useNavigate();

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleFullLogout = () => {
    logout();

    localStorage.removeItem("vendorToken");
    localStorage.removeItem("vendorData");
    localStorage.removeItem("isVendorLoggedIn");

    window.dispatchEvent(new Event("vendorAuthChanged"));

    setIsVendorLoggedIn(false);
    setUserMenuOpen(false);
    setMobileMenuOpen(false);

    showSuccessToast("Logout successful!");

    navigate("/", { replace: true });
  };

  // ============================================================
  // CATEGORY DATA
  // ============================================================

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subSubCategories, setSubSubCategories] = useState([]);

  const [vendorData, setVendorData] = useState(() => {
    const savedVendor = localStorage.getItem("vendorData");

    if (!savedVendor) return null;

    try {
      return JSON.parse(savedVendor);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const [catRes, subCatRes, subSubCatRes] = await Promise.all([
          apiHelper.get("/web/VendorCategory"),
          apiHelper.get("/web/VendorsubCategory"),
          apiHelper.get("/web/Vendorsub-subCategory"),
        ]);

        const catData = catRes?.data || catRes || [];
        const subCatData = subCatRes?.data || subCatRes || [];
        const subSubCatData = subSubCatRes?.data || subSubCatRes || [];

        setCategories(Array.isArray(catData) ? catData : []);
        setSubCategories(Array.isArray(subCatData) ? subCatData : []);
        setSubSubCategories(Array.isArray(subSubCatData) ? subSubCatData : []);

        if (Array.isArray(catData) && catData.length > 0) {
          setActiveMegaCat(catData[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch categories/subcategories", err);
      }
    };

    fetchCategoryData();
  }, []);

  // ============================================================
  // CLOSE CART / USER MENU WHEN CLICKING OUTSIDE
  // ============================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        cartPreviewRef.current &&
        !cartPreviewRef.current.contains(event.target)
      ) {
        setCartPreviewOpen(false);
      }

      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ============================================================
  // MOBILE OUTSIDE CLICK
  // ============================================================
  const handleVendorLogout = () => {
    localStorage.removeItem("vendorToken");
    localStorage.removeItem("vendorData");
    localStorage.removeItem("isVendorLoggedIn");

    setVendorData(null);
    setUserMenuOpen(false);

    window.dispatchEvent(new Event("vendorAuthChanged"));

    navigate("/login");
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ============================================================
  // PREVENT BODY SCROLL WHEN MOBILE MENU OPEN
  // ============================================================

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // ============================================================
  // LOCATION / VENDOR LOGIN
  // ============================================================

  const location = useLocation();

  const [isVendorLoggedIn, setIsVendorLoggedIn] = useState(
    localStorage.getItem("isVendorLoggedIn") === "true",
  );

  useEffect(() => {
    setIsVendorLoggedIn(localStorage.getItem("isVendorLoggedIn") === "true");
  }, [location.pathname, user]);

  useEffect(() => {
    const syncVendorStatus = () => {
      setIsVendorLoggedIn(localStorage.getItem("isVendorLoggedIn") === "true");
    };

    window.addEventListener("vendorAuthChanged", syncVendorStatus);

    return () =>
      window.removeEventListener("vendorAuthChanged", syncVendorStatus);
  }, []);

  // ============================================================
  // MENU ITEMS
  // ============================================================
  useEffect(() => {
    const loadNavbarVendor = async () => {
      if (localStorage.getItem("isVendorLoggedIn") !== "true") {
        setVendorData(null);
        return;
      }

      try {
        const response = await apiHelper.get("/vendor/me");

        const vendor = response?.vendor;

        if (!vendor) return;

        const data = {
          ...vendor,
          name: vendor.name || vendor.businessName || "Vendor",
          email: vendor.email || "",
          phone: vendor.number || vendor.phone || "",
          vendorType: String(vendor.vendorType || "").toLowerCase(),
          vehicleType: String(vendor.vehicleType || "").toLowerCase(),
        };

        setVendorData(data);

        // Keep localStorage updated
        localStorage.setItem("vendorData", JSON.stringify(data));
      } catch (error) {
        console.error("Failed to load navbar vendor:", error);
      }
    };

    loadNavbarVendor();
  }, [isVendorLoggedIn]);
  const menuItems = [
    {
      label: "Tractor",
      icon: Tractor,
      href: "/new-tractors",
      color: "from-green-600 to-green-700",
    },
    {
      label: "Spare Parts",
      icon: Wrench,
      href: "/spare-parts",
      hasMegaMenu: true,
      color: "from-green-600 to-green-700",
    },
    {
      label: "All Products",
      href: "/products",
      icon: Package,
      color: "from-green-600 to-green-700",
    },
    {
      label: "Compare",
      href: "/tractorcompare",
      icon: Scale,
      color: "from-green-600 to-green-700",
    },
    {
      label: "Services",
      href: "/Service",
      icon: Tag,
      color: "from-green-600 to-green-700",
    },
  ];

  // ============================================================
  // PRICE FORMAT
  // ============================================================

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // ============================================================
  // ACTIVE CATEGORY
  // ============================================================

  const activeCategoryObj = categories.find((c) => c.id === activeMegaCat);

  // ============================================================
  // CATEGORY -> SUBCATEGORIES
  // ============================================================

  const activeCategorySubs = subCategories.filter(
    (sub) => sub.categoryId === activeMegaCat,
  );

  // ============================================================
  // ACTIVE SUBCATEGORY
  // ============================================================

  const activeSubCategoryObj = activeCategorySubs.find(
    (sub) => sub.id === activeMegaSub,
  );

  // ============================================================
  // SUB-SUB CATEGORIES
  //
  // This supports multiple possible parent field names:
  //
  // subCategoryId
  // parentSubCategoryId
  // parentId
  // parentCategoryId
  //
  // So you don't have to change the UI if your API uses one
  // of these names.
  // ============================================================

  const activeSubCategorySubs = activeMegaSub
    ? subSubCategories.filter(
        (item) => String(item.subCategoryId) === String(activeMegaSub),
      )
    : [];

  // ============================================================
  // CHECK IF A SUBCATEGORY HAS CHILDREN
  // ============================================================

  const hasSubSubCategories = activeSubCategorySubs.length > 0;

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <nav className="fixed top-0 left-0 right-0 z-9999 bg-white shadow-sm">
      {/* ====================================================== */}
      {/* TOP BAR */}
      {/* ====================================================== */}

      <div className="hidden md:block bg-green-700 text-gray-100 text-xs">
        <div className="mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 py-2 flex items-center justify-between">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-sm">
            <div className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone size={16} className="text-gray-200" />
              <span>+91 12345 67890</span>
            </div>

            <div className="flex items-center gap-2 hover:text-white transition-colors">
              <Mail size={16} className="text-gray-200" />
              <span>support@krushimall.com</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link to="Orders" className="hover:text-white transition-colors">
              Track Order
            </Link>

            <Link to="/help" className="hover:text-white transition-colors">
              Help Center
            </Link>
          </div>
        </div>
      </div>

      {/* ====================================================== */}
      {/* MAIN NAVBAR */}
      {/* ====================================================== */}

      <div className="mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46">
        <div className="flex items-center justify-between h-16">
          {/* ================================================== */}
          {/* LOGO + DESKTOP NAV */}
          {/* ================================================== */}

          <div className="shrink-0 flex items-center gap-8">
            <Link
              to="/"
              className="text-2xl font-bold text-green-600 tracking-tight"
            >
              Krushi <span className="text-green-900">Mall</span>
            </Link>

            {/* ================================================= */}
            {/* DESKTOP NAVIGATION */}
            {/* ================================================= */}

            <div
              className="hidden lg:flex items-center gap-1"
              ref={dropdownRef}
            >
              {menuItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => {
                    if (item.hasMegaMenu || item.hasDropdown) {
                      setHoverDropdown(item.label);
                    }
                  }}
                  onMouseLeave={() => {
                    if (item.hasMegaMenu || item.hasDropdown) {
                      setHoverDropdown(null);
                    }
                  }}
                >
                  {/* ================================================= */}
                  {/* SPARE PARTS */}
                  {/* ================================================= */}

                  {item.hasMegaMenu ? (
                    <>
                      <Link
                        to={item.href}
                        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <item.icon className="h-4 w-4" />

                        {item.label}

                        <ChevronDown
                          className={`h-3 w-3 transition-transform duration-200 ${
                            hoverDropdown === item.label ? "rotate-180" : ""
                          }`}
                        />
                      </Link>

                      {/* ================================================= */}
                      {/* MEGA MENU */}
                      {/* ================================================= */}

                      <div
                        className={`absolute top-full left-0 mt-2 w-250 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 transition-all duration-200 overflow-hidden ${
                          hoverDropdown === item.label
                            ? "opacity-100 visible translate-y-0"
                            : "opacity-0 invisible -translate-y-2"
                        }`}
                      >
                        {/* ================================================= */}
                        {/* THREE COLUMNS */}
                        {/* ================================================= */}

                        <div
                          className="flex"
                          style={{
                            minHeight: "300px",
                          }}
                        >
                          {/* ============================================= */}
                          {/* COLUMN 1 - ALL CATEGORIES */}
                          {/* ============================================= */}

                          <div className="w-52 shrink-0 border-r border-gray-100 py-2 max-h-96 overflow-y-auto">
                            <p className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                              All Categories
                            </p>

                            {categories.map((category) => (
                              <button
                                key={category.id}
                                onMouseEnter={() => {
                                  setActiveMegaCat(category.id);

                                  // Important:
                                  // Reset previously selected subcategory
                                  setActiveMegaSub(null);
                                }}
                                onClick={() => {
                                  navigate(`/category/${category.id}`);
                                }}
                                className={`w-full text-left px-4 py-2.5 flex items-center justify-between gap-2 text-sm font-medium border-l-2 transition-colors ${
                                  activeMegaCat === category.id
                                    ? "border-green-600 bg-green-50 text-green-700"
                                    : "border-transparent text-gray-700 hover:bg-gray-50"
                                }`}
                              >
                                <span className="flex items-center gap-2 truncate">
                                  {/* Category Image */}

                                  <div className="w-7 h-7 rounded-md overflow-hidden bg-gray-100 shrink-0">
                                    {category.image ? (
                                      <img
                                        src={apiHelper.image(category.image)}
                                        alt={category.categoryName}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <span className="w-full h-full flex items-center justify-center text-[11px] font-semibold text-gray-500">
                                        {category.categoryName?.charAt(0)}
                                      </span>
                                    )}
                                  </div>

                                  <span className="truncate">
                                    {category.categoryName}
                                  </span>
                                </span>

                                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                              </button>
                            ))}
                          </div>

                          {/* ============================================= */}
                          {/* COLUMN 2 - SUBCATEGORIES */}
                          {/* ============================================= */}

                          <div className="w-56 shrink-0 border-r border-gray-100 py-2 px-2 max-h-96 overflow-y-auto">
                            <p className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                              {activeCategoryObj?.categoryName || "Select"}{" "}
                              Categories
                            </p>

                            {activeCategorySubs.length > 0 ? (
                              activeCategorySubs.map((sub) => (
                                <Link
                                  key={sub.id}
                                  to={`/subsubcategory/${sub.subCategoryName}`}
                                  onMouseEnter={() => setActiveMegaSub(sub.id)}
                                  className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                                    activeMegaSub === sub.id
                                      ? "bg-green-50 text-green-700 font-semibold"
                                      : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                                  }`}
                                >
                                  {/* Subcategory Image */}

                                  <div className="w-7 h-7 rounded-md overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
                                    {sub.image ? (
                                      <img
                                        src={apiHelper.image(sub.image)}
                                        alt={sub.subCategoryName}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <span className="text-[10px] font-bold text-gray-500">
                                        {sub.subCategoryName?.charAt(0)}
                                      </span>
                                    )}
                                  </div>

                                  {/* Name */}

                                  <span className="truncate flex-1">
                                    {sub.subCategoryName}
                                  </span>

                                  {/* Arrow */}

                                  <ChevronRight
                                    className={`h-3.5 w-3.5 shrink-0 ${
                                      activeMegaSub === sub.id
                                        ? "text-green-600"
                                        : "text-gray-400"
                                    }`}
                                  />
                                </Link>
                              ))
                            ) : (
                              <p className="px-3 py-2 text-sm text-gray-400">
                                No subcategories available.
                              </p>
                            )}
                          </div>

                          {/* ============================================= */}
                          {/* COLUMN 3 - DYNAMIC CONTENT */}
                          {/* ============================================= */}

                          <div className="flex-1 p-6 overflow-y-auto max-h-96">
                            {/* ================================================= */}
                            {/* SUBCATEGORY HOVERED */}
                            {/* ================================================= */}

                            {activeSubCategoryObj ? (
                              <div className="w-full">
                                {/* ========================================= */}
                                {/* SUBCATEGORY HEADER */}
                                {/* ========================================= */}

                                <div className="w-full bg-green-50 rounded-xl p-4 flex items-center gap-4 mb-5 border border-green-100">
                                  {/* Image */}

                                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-white border border-green-100 shrink-0 flex items-center justify-center">
                                    {activeSubCategoryObj.image ? (
                                      <img
                                        src={apiHelper.image(
                                          activeSubCategoryObj.image,
                                        )}
                                        alt={
                                          activeSubCategoryObj.subCategoryName
                                        }
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <span className="text-xl font-bold text-green-700">
                                        {activeSubCategoryObj.subCategoryName?.charAt(
                                          0,
                                        )}
                                      </span>
                                    )}
                                  </div>

                                  {/* Name */}

                                  <div className="flex-1 text-left min-w-0">
                                    <h4 className="font-bold text-gray-900 text-lg truncate">
                                      {activeSubCategoryObj.subCategoryName}
                                    </h4>

                                    <p className="text-xs text-gray-500">
                                      {activeSubCategorySubs.length}{" "}
                                      {activeSubCategorySubs.length === 1
                                        ? "subcategory"
                                        : "subcategories"}{" "}
                                      available
                                    </p>
                                  </div>
                                </div>

                                {/* ========================================= */}
                                {/* TITLE */}
                                {/* ========================================= */}

                                <div className="flex items-center justify-between mb-3">
                                  <h3 className="text-lg font-bold text-gray-900">
                                    {activeSubCategoryObj.subCategoryName}{" "}
                                    Categories
                                  </h3>

                                  <Link
                                    to={`/subsubcategory/${activeSubCategoryObj.subCategoryName}`}
                                    className="text-sm font-semibold text-green-600 hover:text-green-700"
                                  >
                                    View All →
                                  </Link>
                                </div>

                                {/* ========================================= */}
                                {/* CHILD / SUB-SUB CATEGORY CARDS */}
                                {/* ========================================= */}

                                {hasSubSubCategories ? (
                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {activeSubCategorySubs.map((child) => {
                                      const childName =
                                        child.subSubCategoryName;

                                      return (
                                        <Link
                                          key={child.id}
                                          to={`/products`}
                                          className="group flex items-center gap-3 border border-gray-200 rounded-lg px-3 py-3 bg-white hover:border-green-500 hover:bg-green-50 transition-all"
                                        >
                                          {/* Child Image */}

                                          {/* <div className="w-9 h-9 rounded-md overflow-hidden bg-gray-100 border border-gray-100 shrink-0 flex items-center justify-center">
                                              {child.image ? (
                                                <img
                                                  src={apiHelper.image(
                                                    child.image,
                                                  )}
                                                  alt={childName}
                                                  className="w-full h-full object-cover"
                                                />
                                              ) : (
                                                <span className="text-xs font-bold text-green-600">
                                                  {childName?.charAt(0)}
                                                </span>
                                              )}
                                            </div> */}

                                          {/* Child Name */}

                                          <span className="text-sm font-semibold text-gray-700 group-hover:text-green-700 truncate flex-1 text-left">
                                            {childName}
                                          </span>

                                          {/* Arrow */}

                                          <ChevronRight className="h-4 w-4 shrink-0 text-gray-400 group-hover:text-green-600" />
                                        </Link>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  /* ========================================= */
                                  /* NO CHILD CATEGORY */
                                  /* ========================================= */

                                  <div className="border border-dashed border-gray-300 rounded-xl py-10 text-center">
                                    <p className="text-sm text-gray-500 mb-4">
                                      No child categories available
                                    </p>

                                    <Link
                                      to={`/products`}
                                      className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg"
                                    >
                                      View Products
                                      <ArrowRight className="h-4 w-4" />
                                    </Link>
                                  </div>
                                )}
                              </div>
                            ) : (
                              /* ================================================= */
                              /* DEFAULT CATEGORY VIEW */
                              /* ================================================= */

                              activeCategoryObj && (
                                <div className="w-full">
                                  {/* ======================================= */}
                                  {/* CATEGORY HEADER */}
                                  {/* ======================================= */}

                                  <div className="w-full bg-green-50 rounded-xl p-4 flex items-center gap-4 mb-5 border border-green-100">
                                    {/* Category Image */}

                                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-white border border-green-100 shrink-0 flex items-center justify-center">
                                      {activeCategoryObj.image ? (
                                        <img
                                          src={apiHelper.image(
                                            activeCategoryObj.image,
                                          )}
                                          alt={activeCategoryObj.categoryName}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <span className="text-xl font-bold text-green-700">
                                          {activeCategoryObj.categoryName?.charAt(
                                            0,
                                          )}
                                        </span>
                                      )}
                                    </div>

                                    {/* Category Details */}

                                    <div className="flex-1 text-left min-w-0">
                                      <h4 className="font-bold text-gray-900 text-lg truncate">
                                        {activeCategoryObj.categoryName}
                                      </h4>

                                      <p className="text-xs text-gray-500">
                                        {activeCategorySubs.length}{" "}
                                        {activeCategorySubs.length === 1
                                          ? "subcategory"
                                          : "subcategories"}{" "}
                                        available
                                      </p>
                                    </div>
                                  </div>

                                  {/* ======================================= */}
                                  {/* CATEGORY TITLE */}
                                  {/* ======================================= */}

                                  <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-bold text-gray-900">
                                      {activeCategoryObj.categoryName}{" "}
                                      Categories
                                    </h3>

                                    <Link
                                      to={`/category/${activeCategoryObj.categoryName}`}
                                      className="text-sm font-semibold text-green-600 hover:text-green-700"
                                    >
                                      View All →
                                    </Link>
                                  </div>

                                  {/* ======================================= */}
                                  {/* SUBCATEGORY CARDS */}
                                  {/* ======================================= */}

                                  {activeCategorySubs.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                      {activeCategorySubs.map((sub) => (
                                        <Link
                                          key={sub.id}
                                          to={`/subcategoryparts/${sub.subCategoryName}`}
                                          onMouseEnter={() =>
                                            setActiveMegaSub(sub.id)
                                          }
                                          className="group flex items-center gap-3 border border-gray-200 rounded-lg px-3 py-3 bg-white hover:border-green-500 hover:bg-green-50 transition-all"
                                        >
                                          {/* Image */}

                                          <div className="w-9 h-9 rounded-md overflow-hidden bg-gray-100 border border-gray-100 shrink-0 flex items-center justify-center">
                                            {sub.image ? (
                                              <img
                                                src={apiHelper.image(sub.image)}
                                                alt={sub.subCategoryName}
                                                className="w-full h-full object-cover"
                                              />
                                            ) : (
                                              <span className="text-xs font-bold text-green-600">
                                                {sub.subCategoryName?.charAt(0)}
                                              </span>
                                            )}
                                          </div>

                                          {/* Name */}

                                          <span className="text-sm font-semibold text-gray-700 group-hover:text-green-700 truncate flex-1 text-left">
                                            {sub.subCategoryName}
                                          </span>

                                          {/* Arrow */}

                                          <ChevronRight className="h-4 w-4 shrink-0 text-gray-400 group-hover:text-green-600" />
                                        </Link>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="border border-dashed border-gray-300 rounded-xl py-10 text-center">
                                      <p className="text-sm text-gray-500 mb-4">
                                        No subcategories available
                                      </p>

                                      <Link
                                        to={`/category/${activeCategoryObj.categoryName}`}
                                        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg"
                                      >
                                        View Products
                                        <ArrowRight className="h-4 w-4" />
                                      </Link>
                                    </div>
                                  )}
                                </div>
                              )
                            )}
                          </div>
                        </div>

                        {/* ================================================= */}
                        {/* FOOTER */}
                        {/* ================================================= */}

                        <div className="border-t border-gray-100 p-3 bg-gray-50">
                          <Link
                            to="/categories"
                            className="text-sm font-semibold text-green-700 hover:text-green-800 flex items-center justify-center gap-2"
                          >
                            View All Spare Parts
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* ================================================= */
                    /* NORMAL MENU ITEM */
                    /* ================================================= */

                    <Link
                      to={item.href}
                      className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <item.icon className="h-4 w-4" />

                      {item.label}

                      {item.badge && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-green-600 text-white rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ====================================================== */}
          {/* SEARCH BAR */}
          {/* ====================================================== */}

          <div className="hidden md:flex flex-1 max-w-md mx-1">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

              <input
                type="text"
                placeholder="Search parts..."
                className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* ====================================================== */}
          {/* RIGHT ICONS */}
          {/* ====================================================== */}

          <div className="flex items-center gap-3">
            {/* Mobile Search */}

            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden text-gray-500 hover:text-green-600 transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* ================================================== */}
            {/* USER MENU */}
            {/* ================================================== */}

          <div className="relative hidden sm:block" ref={userMenuRef}>
  {isAuthenticated ? (
    <>
      {/* ================= USER (priority) ================= */}
      <button
        onClick={() => setUserMenuOpen(!userMenuOpen)}
        className="text-gray-500 hover:text-green-600 cursor-pointer transition-colors flex items-center gap-1 py-2"
      >
        <User className="h-5 w-5" />
        <ChevronDown
          className={`h-3 w-3 transition-transform ${
            userMenuOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {userMenuOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 py-2 animate-fadeIn">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="font-semibold text-gray-900 text-sm">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-gray-500">
              {user?.email || "user@example.com"}
            </p>
          </div>

          <div className="py-2">
            <Link
              to="/profile"
              onClick={() => setUserMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
            >
              <User className="h-4 w-4" />
              My Profile
            </Link>

            {!isVendorLoggedIn ? (
              <Link
                to="/vendor-login"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
              >
                <Store className="h-4 w-4" />
                Vendor Login
              </Link>
            ) : (
              <Link
                to="/vendor-profile"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
              >
                <Store className="h-4 w-4" />
                Vendor Profile
              </Link>
            )}

            <Link
              to="/orders"
              onClick={() => setUserMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
            >
              <Package className="h-4 w-4" />
              My Orders
            </Link>

            <Link
              to="/wishlist"
              onClick={() => setUserMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
            >
              <Heart className="h-4 w-4" />
              Wishlist
            </Link>

            <Link
              to="/booking-history"
              onClick={() => setUserMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
            >
              <CalendarCheck className="h-4 w-4" />
              Booked Services
            </Link>
          </div>

          <div className="border-t border-gray-100 pt-2">
            <button
              onClick={handleFullLogout}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-green-600 hover:bg-green-50 w-full transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  ) : isVendorLoggedIn ? (
    <>
      {/* ================= VENDOR (fallback, only when user NOT logged in) ================= */}
      <button
        onClick={() => setUserMenuOpen(!userMenuOpen)}
        className="text-gray-500 hover:text-green-600 cursor-pointer transition-colors flex items-center gap-1 py-2"
      >
        <User className="h-5 w-5" />
        <ChevronDown
          className={`h-3 w-3 transition-transform ${
            userMenuOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {userMenuOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 py-2 animate-fadeIn">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="font-semibold text-gray-900 text-sm">
              {vendorData?.name || vendorData?.businessName || "Vendor"}
            </p>
            <p className="text-xs text-gray-500">
              {vendorData?.email || "vendor@example.com"}
            </p>
          </div>

          <div className="py-2">
            <Link
              to="/vendor-profile"
              onClick={() => setUserMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
            >
              <Store className="h-4 w-4" />
              My Profile
            </Link>

            <Link
              to="/login"
              onClick={() => setUserMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
            >
              <LogIn className="h-4 w-4" />
              User Login
            </Link>
          </div>

          <div className="border-t border-gray-100 pt-2">
            <button
              onClick={handleVendorLogout}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-green-600 hover:bg-green-50 w-full transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  ) : (
    <>
      {/* ================= NOT LOGGED IN ================= */}
      <button
        onClick={() => setUserMenuOpen(!userMenuOpen)}
        className="text-gray-500 hover:text-green-600 transition-colors flex items-center gap-1 py-2"
      >
        <User className="h-5 w-5" />
        <ChevronDown
          className={`h-3 w-3 transition-transform ${
            userMenuOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {userMenuOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 py-2 animate-fadeIn">
          <Link
            to="/login"
            onClick={() => setUserMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
          >
            <LogIn className="h-4 w-4" />
            Login
          </Link>
        </div>
      )}
    </>
  )}
</div>
            {/* ================================================== */}
            {/* CART */}
            {/* ================================================== */}

            <div
              className="relative hidden md:block"
              ref={cartPreviewRef}
              onMouseEnter={() => setCartPreviewOpen(true)}
              onMouseLeave={() => setCartPreviewOpen(false)}
            >
              <Link
                to="/cart"
                className="relative text-gray-500 hover:text-green-600 transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />

                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                    {cartCount}
                  </span>
                )}
              </Link>

              {cartPreviewOpen && cart.length > 0 && (
                <div className="absolute right-0 top-full mt-0 w-96 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 animate-fadeIn">
                  <div className="p-4 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">
                      {cart.length} {cart.length === 1 ? "item" : "items"} in
                      cart
                    </p>
                  </div>

                  <div className="max-h-64 overflow-y-auto">
                    {cart.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-3 p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover bg-gray-100 shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {item.name}
                          </h4>

                          <p className="text-xs text-gray-500 mt-0.5">
                            {item.quantity} x {formatPrice(item.price)}
                          </p>

                          <p className="text-sm font-semibold text-gray-900 mt-1">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>

                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            removeFromCart(item.id);
                          }}
                          className="text-gray-400 hover:text-green-600 transition-colors self-start shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {cart.length > 3 && (
                    <div className="px-4 py-2 text-xs text-gray-500 text-center border-b border-gray-50">
                      +{cart.length - 3} more items in cart
                    </div>
                  )}

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-semibold text-gray-900">
                        Total:
                      </span>

                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(cartTotal)}
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <Link
                        to="/cart"
                        onClick={() => setCartPreviewOpen(false)}
                        className="flex-1 text-center bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold py-2.5 rounded-lg transition-colors text-sm"
                      >
                        View Cart
                      </Link>

                      <Link
                        to="/checkout"
                        onClick={() => setCartPreviewOpen(false)}
                        className="flex-1 text-center bg-green-700 hover:bg-green-800 text-white font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 text-sm shadow-lg shadow-green-700/20 hover:shadow-green-700/30"
                      >
                        Checkout
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ================================================== */}
            {/* MOBILE CART */}
            {/* ================================================== */}

            <Link
              to="/cart"
              className="md:hidden relative text-gray-500 hover:text-green-600 transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* ================================================== */}
            {/* WISHLIST */}
            {/* ================================================== */}

            <Link
              to="/wishlist"
              className="relative p-2 text-gray-600 hover:text-green-600 transition-colors"
            >
              <Heart className="h-6 w-6" />

              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* ================================================== */}
            {/* HAMBURGER */}
            {/* ================================================== */}

            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                setActiveDropdown(null);
              }}
              className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-xl bg-green-700 text-white hover:shadow-xl hover:shadow-green-700/30 active:scale-90 transition-all duration-300 group overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {mobileMenuOpen ? (
                <X className="h-5 w-5 relative z-10 transform rotate-0 group-hover:rotate-90 transition-transform duration-300" />
              ) : (
                <Menu className="h-5 w-5 relative z-10 group-hover:scale-110 transition-transform duration-300" />
              )}
            </button>
          </div>
        </div>

        {/* ====================================================== */}
        {/* MOBILE SEARCH */}
        {/* ====================================================== */}

        {mobileSearchOpen && (
          <div className="md:hidden pb-3 animate-slideDown">
            <div className="relative group">
              <div className="absolute inset-0 bg-green-700 rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>

              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-green-600" />

                <input
                  type="text"
                  placeholder="Search parts..."
                  className="block w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm bg-white focus:bg-white focus:ring-4 focus:ring-green-600/20 focus:border-green-600 outline-none transition-all duration-300 shadow-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ====================================================== */}
      {/* MOBILE BACKDROP */}
      {/* ====================================================== */}

      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-white/30 backdrop-blur-sm z-40 animate-fadeIn"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ====================================================== */}
      {/* MOBILE MENU */}
      {/* ====================================================== */}

      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed right-0 top-0 h-full w-[85%] max-w-sm bg-white z-50 shadow-2xl animate-slideInRight overflow-hidden flex flex-col"
          ref={mobileMenuRef}
        >
          {/* ================================================== */}
          {/* MOBILE HEADER */}
          {/* ================================================== */}

          <div className="p-6 bg-green-700">
            <div className="flex items-center justify-between mb-4">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-bold text-white tracking-tight"
              >
                Krushi <span className="text-green-200">Mall</span>
              </Link>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {isAuthenticated ? (
              <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0) || "U"}
                </div>

                <div className="text-white">
                  <p className="font-semibold text-sm">
                    {user?.name || "User"}
                  </p>

                  <p className="text-xs text-gray-300">
                    {user?.email || "user@example.com"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 bg-green-600 rounded-xl text-white hover:shadow-lg hover:shadow-green-600/30 transition-all duration-300"
                >
                  <LogIn className="h-5 w-5" />
                  <span className="font-semibold text-sm">User</span>
                </Link>
              </div>
            )}
          </div>

          {/* ================================================== */}
          {/* MOBILE MENU ITEMS */}
          {/* ================================================== */}

          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
            <div className="mb-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">
                Main Menu
              </p>

              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setActiveDropdown(null);
                  }}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group hover:bg-green-700 hover:text-white hover:shadow-xl hover:shadow-green-700/20 hover:scale-[1.02] transform mb-1"
                >
                  <div className="p-1.5 rounded-lg bg-gray-100 group-hover:bg-white/20 transition-colors duration-300">
                    <item.icon className="h-5 w-5 text-green-600 group-hover:text-white transition-colors duration-300" />
                  </div>

                  <span className="font-semibold flex-1">{item.label}</span>

                  {item.badge && (
                    <span className="px-2 py-0.5 text-xs font-bold bg-green-600 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}

                  <ChevronRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </Link>
              ))}
            </div>

            {/* ================================================== */}
            {/* PROFILE MENU */}
            {/* ================================================== */}

            {isAuthenticated && (
              <div className="border-t-2 border-dashed border-gray-200 pt-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">
                  My Account
                </p>

                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group hover:bg-green-700 hover:text-white hover:shadow-xl hover:shadow-green-700/20 hover:scale-[1.02] transform mb-1"
                >
                  <div className="p-1.5 rounded-lg bg-gray-100 group-hover:bg-white/20 transition-colors duration-300">
                    <User className="h-5 w-5 text-green-600 group-hover:text-white" />
                  </div>

                  <span className="font-semibold flex-1">My Profile</span>
                </Link>

                {!isVendorLoggedIn ? (
                  <Link
                    to="/vendor-login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group hover:bg-green-700 hover:text-white hover:shadow-xl hover:shadow-green-700/20 hover:scale-[1.02] transform mb-1"
                  >
                    <div className="p-1.5 rounded-lg bg-gray-100 group-hover:bg-white/20 transition-colors duration-300">
                      <Store className="h-5 w-5 text-green-600 group-hover:text-white" />
                    </div>

                    <span className="font-semibold flex-1">Vendor Login</span>
                  </Link>
                ) : (
                  <Link
                    to="/vendor-profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group hover:bg-green-700 hover:text-white hover:shadow-xl hover:shadow-green-700/20 hover:scale-[1.02] transform mb-1"
                  >
                    <div className="p-1.5 rounded-lg bg-gray-100 group-hover:bg-white/20 transition-colors duration-300">
                      <Store className="h-5 w-5 text-green-600 group-hover:text-white" />
                    </div>

                    <span className="font-semibold flex-1">Vendor Profile</span>
                  </Link>
                )}

                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group hover:bg-green-700 hover:text-white hover:shadow-xl hover:shadow-green-700/20 hover:scale-[1.02] transform mb-1"
                >
                  <div className="p-1.5 rounded-lg bg-gray-100 group-hover:bg-white/20 transition-colors duration-300">
                    <Package className="h-5 w-5 text-green-600 group-hover:text-white" />
                  </div>

                  <span className="font-semibold flex-1">My Orders</span>
                </Link>

                <Link
                  to="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group hover:bg-green-700 hover:text-white hover:shadow-xl hover:shadow-green-700/20 hover:scale-[1.02] transform mb-1"
                >
                  <div className="p-1.5 rounded-lg bg-gray-100 group-hover:bg-white/20 transition-colors duration-300">
                    <Heart className="h-5 w-5 text-green-600 group-hover:text-white" />
                  </div>

                  <span className="font-semibold flex-1">Wishlist</span>
                </Link>

                <Link
                  to="/booking-history"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group hover:bg-green-700 hover:text-white hover:shadow-xl hover:shadow-green-700/20 hover:scale-[1.02] transform mb-1"
                >
                  <div className="p-1.5 rounded-lg bg-gray-100 group-hover:bg-white/20 transition-colors duration-300">
                    <CalendarCheck className="h-5 w-5 text-green-600 group-hover:text-white" />
                  </div>

                  <span className="font-semibold flex-1">Booked Services</span>
                </Link>
              </div>
            )}

            {/* ================================================== */}
            {/* QUICK LINKS */}
            {/* ================================================== */}

            <div className="border-t-2 border-dashed border-gray-200 pt-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">
                Quick Links
              </p>

              <Link
                to="Orders"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group hover:bg-green-700 hover:text-white hover:shadow-xl hover:shadow-green-700/20 hover:scale-[1.02] transform"
              >
                <div className="p-1.5 rounded-lg bg-gray-100 group-hover:bg-white/20 transition-colors duration-300">
                  <MapPin className="h-5 w-5 text-green-600 group-hover:text-white" />
                </div>

                <span className="font-semibold flex-1">Track Order</span>

                <ChevronRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </Link>

              <Link
                to="/help"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group hover:bg-green-700 hover:text-white hover:shadow-xl hover:shadow-green-700/20 hover:scale-[1.02] transform"
              >
                <div className="p-1.5 rounded-lg bg-gray-100 group-hover:bg-white/20 transition-colors duration-300">
                  <HelpCircle className="h-5 w-5 text-green-600 group-hover:text-white" />
                </div>

                <span className="font-semibold flex-1">Help Center</span>

                <ChevronRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </Link>
            </div>

            {/* ================================================== */}
            {/* CONTACT INFO */}
            {/* ================================================== */}

            <div className="mt-4 p-5 bg-gray-50 rounded-2xl border-2 border-gray-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-600/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>

              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Get In Touch
              </p>

              <div className="space-y-2 relative z-10">
                <a
                  href="tel:+911234567890"
                  className="flex items-center gap-3 text-sm text-gray-700 hover:text-green-600 transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-gray-200 group-hover:bg-green-100 transition-colors">
                    <Phone className="h-4 w-4 text-green-600" />
                  </div>

                  <span className="font-medium">+91 12345 67890</span>
                </a>

                <a
                  href="mailto:support@krushimall.com"
                  className="flex items-center gap-3 text-sm text-gray-700 hover:text-green-600 transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-gray-200 group-hover:bg-green-100 transition-colors">
                    <Mail className="h-4 w-4 text-green-600" />
                  </div>

                  <span className="font-medium">support@krushimall.com</span>
                </a>
              </div>
            </div>
          </div>

          {/* ================================================== */}
          {/* MOBILE LOGOUT */}
          {/* ================================================== */}

          {isAuthenticated && (
            <div className="shrink-0 border-t border-gray-200 bg-white px-4 py-4">
              <button
                onClick={handleFullLogout}
                className="w-full px-4 py-3.5 rounded-xl transition-all duration-300 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 flex items-center gap-3 group"
              >
                <div className="p-1.5 rounded-lg bg-red-100 group-hover:bg-red-200 transition-colors">
                  <LogOut className="h-5 w-5" />
                </div>

                <span className="font-semibold">Logout</span>
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
