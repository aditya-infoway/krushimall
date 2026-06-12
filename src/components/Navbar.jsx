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
  Zap,
  Trash2,
  ArrowRight,
  LogIn,
  UserPlus,
  Cog,
  Gauge,
  Battery,
  Car,
  Thermometer,
  Wind,
  Disc,
  Droplets,
  Wrench,
  Filter,
  HandCoins,
  Tractor,
  GitCompare,
  Scale,
  CalendarCheck,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";

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
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const cartPreviewRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close cart preview when clicking outside
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

  // Close mobile dropdown when clicking outside
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

  // Prevent body scroll when mobile menu is open
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

  // Spare Parts subcategories for mega menu
  const sparePartsCategories = [
    {
      title: "Engine & Drivetrain",
      items: [
        { name: "Engine Parts", icon: Cog, href: "/category/engine-parts" },
        { name: "Transmission", icon: Gauge, href: "/category/transmission" },
        {
          name: "Exhaust System",
          icon: Wind,
          href: "/category/exhaust-system",
        },
      ],
    },
    {
      title: "Brakes & Suspension",
      items: [
        { name: "Brake Pads & Discs", icon: Disc, href: "/category/brakes" },
        { name: "Shock Absorbers", icon: Car, href: "/category/suspension" },
        { name: "Steering Parts", icon: Wrench, href: "/category/steering" },
      ],
    },
    {
      title: "Electrical & AC",
      items: [
        {
          name: "Battery & Charging",
          icon: Battery,
          href: "/category/electrical",
        },
        { name: "Lighting", icon: Zap, href: "/category/lighting" },
        {
          name: "AC & Heating",
          icon: Thermometer,
          href: "/category/ac-heating",
        },
      ],
    },
    {
      title: "Fluids & Filters",
      items: [
        { name: "Engine Oil", icon: Droplets, href: "/category/oil" },
        { name: "Filters", icon: Filter, href: "/category/filters" },
        { name: "Coolant", icon: Thermometer, href: "/category/coolant" },
      ],
    },
  ];

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
    // {
    //   label: "Contact",
    //   href: "/contact",
    //   icon: Phone,
    //   color: "from-green-600 to-green-700",
    // },
  ];

  const handleMobileDropdownToggle = (label) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[9999] bg-white shadow-sm">
      {/* Top Bar */}
      <div className="hidden md:block bg-green-700 text-gray-100 text-xs">
        <div className=" mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 py-2 flex items-center justify-between">
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

      {/* Main Navbar */}
      <div className=" mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46">
        <div className="flex items-center justify-between h-16">
          {/* Left - Logo + Desktop Nav */}
          <div className="flex-shrink-0 flex items-center gap-8">
            <Link
              to="/"
              className="text-2xl font-bold text-green-600 tracking-tight"
            >
              Krushi <span className="text-green-900">Mall</span>
            </Link>

            {/* Desktop Navigation */}
            <div
              className="hidden lg:flex items-center gap-1 "
              ref={dropdownRef}
            >
              {menuItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => {
                    if (item.hasMegaMenu || item.hasDropdown)
                      setHoverDropdown(item.label);
                  }}
                  onMouseLeave={() => {
                    if (item.hasMegaMenu || item.hasDropdown)
                      setHoverDropdown(null);
                  }}
                >
                  {item.hasMegaMenu ? (
                    <>
                      <Link
                        to={item.href}
                        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                        <ChevronDown
                          className={`h-3 w-3 transition-transform duration-200 ${hoverDropdown === item.label ? "rotate-180" : ""}`}
                        />
                      </Link>

                      {/* Mega Menu */}
                      <div
                        className={`absolute top-full left-0 mt-2 w-[800px] bg-white rounded-xl shadow-2xl border border-gray-100 z-50 transition-all duration-200 ${
                          hoverDropdown === item.label
                            ? "opacity-100 visible translate-y-0"
                            : "opacity-0 invisible -translate-y-2"
                        }`}
                      >
                        <div className="p-6 grid grid-cols-4 gap-6 left-24">
                          {sparePartsCategories.map((category, idx) => (
                            <div key={idx}>
                              <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">
                                {category.title}
                              </h4>
                              <ul className="space-y-2">
                                {category.items.map((subItem, subIdx) => (
                                  <li key={subIdx}>
                                    <Link
                                      to={subItem.href}
                                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition-colors group py-1.5"
                                    >
                                      <subItem.icon className="h-4 w-4 text-gray-400 group-hover:text-green-600 transition-colors" />
                                      {subItem.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-gray-100 p-4 bg-gray-50 rounded-b-xl">
                          <Link
                            to="/categories"
                            className="text-sm font-semibold text-green-600 hover:text-green-700 flex items-center justify-center gap-2"
                          >
                            View All Spare Parts
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </>
                  ) : (
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

          {/* Search Bar */}
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

          {/* Right Icons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden text-gray-500 hover:text-green-600 transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* User Menu with Dropdown - Desktop only */}
            <div
              className="relative hidden sm:block"
              onMouseEnter={() => setUserMenuOpen(true)}
              onMouseLeave={() => setUserMenuOpen(false)}
            >
              {isAuthenticated ? (
                <>
                  <button className="text-gray-500 hover:text-green-600 cursor-pointer transition-colors flex items-center gap-1 py-2">
                    <User className="h-5 w-5" />
                    <ChevronDown
                      className={`h-3 w-3 transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  <div className="absolute left-0 right-0 h-2 top-full"></div>

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
                          <User className="h-4 w-4" /> My Profile
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                        >
                          <Package className="h-4 w-4" /> My Orders
                        </Link>
                        <Link
                          to="/wishlist"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                        >
                          <Heart className="h-4 w-4" /> Wishlist
                        </Link>
                        <Link
                          to="/booking-history"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                        >
                          <CalendarCheck className="h-4 w-4" /> Booked Services
                        </Link>
                      </div>
                      <div className="border-t border-gray-100 pt-2">
                        <button
                          onClick={() => {
                            logout();
                            setUserMenuOpen(false);
                          }}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-green-600 hover:bg-green-50 w-full transition-colors"
                        >
                          <LogOut className="h-4 w-4" /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <button className="text-gray-500 hover:text-green-600 transition-colors  flex items-center gap-1 py-2">
                    <User className="h-5 w-5 " />
                    <ChevronDown
                      className={`h-3 w-3 transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  <div className="absolute left-0 right-0 h-2 top-full"></div>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 py-2 animate-fadeIn">
                      <Link
                        to="/login"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                      >
                        <LogIn className="h-4 w-4" />
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                      >
                        <UserPlus className="h-4 w-4" />
                        Register
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Cart - Desktop Hover Preview */}
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

              {/* Cart Preview Dropdown - Desktop Only */}
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
                          className="w-16 h-16 rounded-lg object-cover bg-gray-100 flex-shrink-0"
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
                          className="text-gray-400 hover:text-green-600 transition-colors self-start flex-shrink-0"
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

            {/* Cart - Mobile Direct Link */}
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

            {/* Hamburger Button */}
            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                setActiveDropdown(null);
              }}
              className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-xl bg-green-700 text-white hover:shadow-xl hover:shadow-green-700/30 active:scale-90 transition-all duration-300 group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {mobileMenuOpen ? (
                <X className="h-5 w-5 relative z-10 transform rotate-0 group-hover:rotate-90 transition-transform duration-300" />
              ) : (
                <Menu className="h-5 w-5 relative z-10 group-hover:scale-110 transition-transform duration-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
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

      {/* Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-white/30 backdrop-blur-sm z-40 animate-fadeIn"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Premium Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed right-0 top-0 h-full w-[85%] max-w-sm bg-white z-50 shadow-2xl animate-slideInRight overflow-hidden flex flex-col"
          ref={mobileMenuRef}
        >
          {/* Header */}
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
                  <span className="font-semibold text-sm">Sign In</span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all duration-300"
                >
                  <UserPlus className="h-5 w-5" />
                  <span className="font-semibold text-sm">Register</span>
                </Link>
              </div>
            )}
          </div>

          {/* Menu Items */}
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

            {/* Profile Menu - Mobile */}
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

            {/* Quick Links */}
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

            {/* Contact Info */}
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
          {/* Logout Button - Fixed at Bottom */}
          {isAuthenticated && (
            <div className="flex-shrink-0 border-t border-gray-200 bg-white px-4 py-4">
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
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
