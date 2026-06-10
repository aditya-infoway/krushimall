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
import { showCartAddedToast, showWishlistAddedToast, showWishlistRemovedToast, showLoginRequiredToast } from '../utils/toast.jsx';


const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, cart, updateQuantity } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [isCompatible, setIsCompatible] = useState(null);


    const getCartQuantity = (productId) => {
    const cartItem = cart.find(item => item.id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleIncreaseQuantity = () => {
    addToCart(product, 1);
  };

  const handleDecreaseQuantity = () => {
    const currentQty = getCartQuantity(product.id);
    if (currentQty <= 1) {
      updateQuantity(product.id, 0);
      setQuantity(1);
    } else {
      updateQuantity(product.id, currentQty - 1);
    }
  };

const modalImageRef = useRef(null);
  // Image Modal States
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalZoom, setModalZoom] = useState(1);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [modalSelectedImage, setModalSelectedImage] = useState(0);
  const lastTapRef = useRef(null);
  const imageContainerRef = useRef(null);

    const zoomIn = () => setModalZoom(prev => Math.min(prev + 0.1, 2));
  const zoomOut = () => setModalZoom(prev => Math.max(prev - 0.1, 0.2));

  const openImageModal = (index) => {
    setModalSelectedImage(index !== undefined ? index : selectedImage);
    setIsImageModalOpen(true);
    setModalZoom(1);
    setModalPosition({ x: 0, y: 0 });
    document.body.style.overflow = 'hidden';
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    document.body.style.overflow = '';
  };

  // Mouse wheel zoom
   const wheelTimeoutRef = useRef(null);

  const handleWheel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Accumulate delta for touchpad
    if (wheelTimeoutRef.current) {
      clearTimeout(wheelTimeoutRef.current);
    }
    
    const rect = imageContainerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Reduce sensitivity for touchpad - use smaller delta
    const delta = e.deltaY < 0 ? 0.05 : -0.05;
    const newZoom = Math.min(Math.max(0.5, modalZoom + delta), 4);
    
    if (newZoom === modalZoom) return;
    
    const scale = newZoom / modalZoom;
    const newX = mouseX - scale * (mouseX - modalPosition.x);
    const newY = mouseY - scale * (mouseY - modalPosition.y);
    
    setModalZoom(newZoom);
    setModalPosition({ x: newX, y: newY });
    
    // Reset timeout
    wheelTimeoutRef.current = setTimeout(() => {
      wheelTimeoutRef.current = null;
    }, 50);
  };

  // Double tap zoom on mobile
  const handleDoubleTap = (e) => {
    const now = Date.now();
    const lastTap = lastTapRef.current;
    lastTapRef.current = now;
    
    if (lastTap && now - lastTap < 300) {
      e.preventDefault();
      if (modalZoom > 1) {
        setModalZoom(1);
        setModalPosition({ x: 0, y: 0 });
      } else {
        setModalZoom(2.5);
        const rect = imageContainerRef.current?.getBoundingClientRect();
        if (rect) {
          setModalPosition({
            x: (rect.width / 2 - e.clientX + rect.left) * 1.5,
            y: (rect.height / 2 - e.clientY + rect.top) * 1.5,
          });
        }
      }
    }
  };

  // Drag handlers
  const handleDragStart = (e) => {
    if (modalZoom <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX - modalPosition.x, y: clientY - modalPosition.y });
  };

  const handleDragMove = (e) => {
    if (!isDragging || modalZoom <= 1) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setModalPosition({ x: clientX - dragStart.x, y: clientY - dragStart.y });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Pinch zoom on mobile
  const initialPinchDistance = useRef(null);
  const initialZoom = useRef(1);
  
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      initialPinchDistance.current = Math.hypot(
        e.touches[1].clientX - e.touches[0].clientX,
        e.touches[1].clientY - e.touches[0].clientY
      );
      initialZoom.current = modalZoom;
    } else if (e.touches.length === 1) {
      handleDragStart(e);
    }
  };

  const handleTouchMoveModal = (e) => {
    if (e.touches.length === 2 && initialPinchDistance.current) {
      e.preventDefault();
      const currentDistance = Math.hypot(
        e.touches[1].clientX - e.touches[0].clientX,
        e.touches[1].clientY - e.touches[0].clientY
      );
      const scale = currentDistance / initialPinchDistance.current;
      setModalZoom(Math.min(Math.max(0.5, initialZoom.current * scale), 4));
    } else {
      handleDragMove(e);
    }
  };

  const navigateImage = (direction) => {
    setModalSelectedImage(prev => {
      if (direction === 'next') {
        return (prev + 1) % product.images.length;
      }
      return (prev - 1 + product.images.length) % product.images.length;
    });
    setModalZoom(1);
    setModalPosition({ x: 0, y: 0 });
  };

  const scrollRef = useRef(null);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/product/" + product.id);
      return;
    }
    addToCart(product, quantity);
  
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/product/" + product.id);
      return;
    }
    addToCart(product, quantity);
    navigate("/cart");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

const handleWishlist = () => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/product/" + product.id);
      return;
    }
    
    // Check current state before toggling to determine correct toast
    if (isInWishlist(product.id)) {
      toggleWishlist(product);
      showWishlistRemovedToast(product.name);
    } else {
      toggleWishlist(product);
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


    // Handle browser back button when modal is open
  useEffect(() => {
    if (isImageModalOpen) {
      window.history.pushState({ modalOpen: true }, '', window.location.href);
      
      const handlePopState = () => {
        closeImageModal();
      };
      
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, [isImageModalOpen]);

  // Sample product data
  const product = {
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
    partNumber: "F002H21088",
    oemNumber: "15400-RTA-003",
    compatibility: [
      "Honda City 2014-2020",
      "Honda Jazz 2015-2022",
      "Honda Amaze 2013-2021",
    ],
    warranty: "6 Months Manufacturer Warranty",
    shipping: "Free Shipping",
    deliveryTime: "3-5 Business Days",
    returns: "10-Day Easy Returns",
    description:
      "The Bosch Engine Oil Filter ensures optimal engine performance by effectively removing contaminants from engine oil. Made with high-quality filter media that provides superior filtration efficiency and dirt-holding capacity.",
    specifications: [
      { label: "Brand", value: "Bosch" },
      { label: "Part Number", value: "F002H21088" },
      { label: "OEM Number", value: "15400-RTA-003" },
      { label: "Type", value: "Engine Oil Filter" },
      { label: "Material", value: "Synthetic Fiber" },
      { label: "Thread Size", value: "M20 x 1.5" },
      { label: "Height", value: "90 mm" },
      { label: "Outer Diameter", value: "65 mm" },
      { label: "Weight", value: "250 g" },
      { label: "Country of Origin", value: "Germany" },
    ],
    features: [
      "High-efficiency filtration media removes up to 99% of contaminants",
      "Anti-drain back valve prevents dry starts",
      "Silicone anti-drain back valve for extreme temperatures",
      "OE-quality construction ensures perfect fit",
      "Tested to meet or exceed OEM specifications",
    ],
    images: [
      "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=600&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=600&h=600&fit=crop&auto=format",
    ],
    reviews_list: [
      {
        id: 1,
        user: "Rajesh Kumar",
        rating: 5,
        date: "2024-01-15",
        title: "Perfect fit for my Honda City",
        comment:
          "Genuine product. Fits perfectly in my Honda City 2018 model. Engine runs smoother now.",
      },
      {
        id: 2,
        user: "Amit Sharma",
        rating: 5,
        date: "2024-01-10",
        title: "Original Bosch product",
        comment:
          "Verified original Bosch product. Much better quality than local alternatives.",
      },
      {
        id: 3,
        user: "Priya Patel",
        rating: 4,
        date: "2024-01-05",
        title: "Good quality filter",
        comment:
          "Good quality but delivery took 5 days. Product is genuine though.",
      },
    ],
    relatedProducts: [
      {
        id: 2,
        name: "Brembo Brake Pads",
        price: 3899,
        image:
          "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300&h=300&fit=crop&auto=format",
      },
      {
        id: 3,
        name: "NGK Spark Plugs",
        price: 999,
        image:
          "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=300&h=300&fit=crop&auto=format",
      },
      {
        id: 6,
        name: "Mann Air Filter",
        price: 749,
        image:
          "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300&h=300&fit=crop&auto=format",
      },
      {
        id: 12,
        name: "Mann Cabin Filter",
        price: 649,
        image:
          "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300&h=300&fit=crop&auto=format",
      },
    ],
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

  return (
    <div className="min-h-screen bg-gray-50 lg:mt-4">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 py-3">
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

      <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 py-8">
        {/* Product Page Layout */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Column 1: Gallery Design */}
          <div className="lg:col-span-1">
                       <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div 
                className="p-4 aspect-square flex items-center justify-center relative cursor-pointer group"
                onClick={() => openImageModal(selectedImage)}
              >
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain group-hover:opacity-90 transition-opacity"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full shadow">
                    Click to zoom
                  </span>
                </div>
                <span className="absolute top-4 left-4 bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg pointer-events-none">
                  -{product.discount}%
                </span>
              </div>
              <div className="flex gap-2 justify-center p-3 border-t border-gray-100 bg-gray-50/50">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(index);
                    }}
                    className={`w-16 h-16 border-2 rounded-lg p-1 bg-white flex items-center justify-center transition-all cursor-pointer ${
                      selectedImage === index
                        ? "border-green-600 shadow-sm"
                        : "border-gray-200 hover:border-gray-300"
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
                      className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
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
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Compatibility Icons */}
                           {/* Compatibility Icons */}
              <div className="mt-auto pt-4 border-t border-gray-100">
                <div className="flex flex-col gap-2 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>{product.shipping}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>{product.returns}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-600 flex-shrink-0" />
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
                    Germany
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
                          onClick={() => setQuantity(quantity + 1)}
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
                      className={`h-5 w-5 ${isInWishlist(product.id) ? "fill-green-600 text-green-600" : ""}`}
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
                          `cursor-pointer select-none px-4 py-2 ${active ? "bg-green-50 text-green-600" : "text-gray-700"}`
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
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
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
                        {product.specifications.map((spec, i) => (
                          <tr
                            key={i}
                            className={
                              i % 2 === 0 ? "bg-white" : "bg-gray-50/50"
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
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
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

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {product.relatedProducts.map((related) => (
              <Link
                key={related.id}
                to={`/product/${related.id}`}
                className="min-w-[45%] md:min-w-[23%] bg-white border border-gray-300 rounded-xl p-4 hover:border-green-400 hover:shadow-md transition-all snap-start cursor-pointer"
              >
                <div className="bg-gray-50 rounded-lg aspect-square mb-3 p-4 flex items-center justify-center">
                  <img
                    src={related.image}
                    alt={related.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 hover:text-green-600 line-clamp-2 mb-2">
                  {related.name}
                </h3>
                <span className="text-base font-bold text-gray-900">
                  {formatPrice(related.price)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
                 {/* Fullscreen Image Modal */}
      {isImageModalOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-white flex flex-col mt-20 lg:mt-24" 
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 flex-shrink-0 bg-white">
            <button onClick={closeImageModal} className="p-2 hover:bg-gray-100 rounded-full cursor-pointer">
              <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <span className="text-sm font-medium text-gray-700">
              {modalSelectedImage + 1} / {product.images.length}
            </span>
            <div className="w-10"></div>
          </div>

          {/* Image Area */}
                   <div 
            ref={imageContainerRef}
            className="flex-1 flex items-center justify-center overflow-hidden relative bg-gray-100"
            onWheel={handleWheel}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMoveModal}
            onTouchEnd={handleDragEnd}
            onClick={handleDoubleTap}
          >
            {/* Left Arrow */}
            <button
              onClick={(e) => { e.stopPropagation(); navigateImage('prev'); }}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer transition-all"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
            </button>

            <img
              src={product.images[modalSelectedImage]}
              alt={product.name}
              className="max-w-full max-h-full object-contain select-none pointer-events-none py-2"
              style={{
                transform: `translate(${modalPosition.x}px, ${modalPosition.y}px) scale(${modalZoom})`,
                transition: isDragging ? 'none' : 'transform 0.3s ease-out',
                cursor: modalZoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
              }}
              draggable={false}
            />

            {/* Right Arrow */}
            <button
              onClick={(e) => { e.stopPropagation(); navigateImage('next'); }}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer transition-all"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
            </button>

            {/* Zoom controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg z-10">
              <button onClick={(e) => { e.stopPropagation(); zoomOut(); }} className="p-1 hover:bg-gray-100 rounded-full cursor-pointer">
                <Minus className="h-5 w-5 text-gray-700" />
              </button>
              <span className="text-sm font-medium text-gray-700 min-w-[40px] text-center">
                {Math.round(modalZoom * 100)}%
              </span>
              <button onClick={(e) => { e.stopPropagation(); zoomIn(); }} className="p-1 hover:bg-gray-100 rounded-full cursor-pointer">
                <Plus className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Bottom Thumbnails */}
          <div className="flex justify-center gap-2 p-4 border-t border-gray-200 bg-white flex-shrink-0 overflow-x-auto">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => {
                  setModalSelectedImage(index);
                  setModalZoom(1);
                  setModalPosition({ x: 0, y: 0 });
                }}
                className={`w-14 h-14 sm:w-16 sm:h-16 border-2 rounded-lg overflow-hidden flex-shrink-0 transition-all cursor-pointer ${
                  modalSelectedImage === index ? "border-green-600" : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-contain p-1" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
