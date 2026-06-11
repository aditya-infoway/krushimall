import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Star,
  ShoppingCart,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Flame,
  Trophy,
} from "lucide-react";

const FeaturedProducts = () => {
  const [addedToCart, setAddedToCart] = useState({});
  const [activeTab, setActiveTab] = useState("featured");
  const sliderRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef(null);

  // Show arrows when scrolling on mobile
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 1500); // Hide after 1.5 seconds of no scroll
    };

    slider.addEventListener("scroll", handleScroll, { passive: true });
    slider.addEventListener("touchstart", handleScroll, { passive: true });

    return () => {
      slider.removeEventListener("scroll", handleScroll);
      slider.removeEventListener("touchstart", handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [activeTab]);

  const featuredProducts = [
    {
      id: 1,
      name: "Bosch Engine Oil Filter",
      brand: "Bosch",
      price: "₹1,499",
      oldPrice: "₹2,499",
      discount: "40% OFF",
      rating: 4.8,
      reviews: 234,
      image:
        "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=400&fit=crop&auto=format",
    },
    {
      id: 2,
      name: "Brembo Brake Pads Set",
      brand: "Brembo",
      price: "₹3,899",
      oldPrice: "₹5,999",
      discount: "35% OFF",
      rating: 4.9,
      reviews: 567,
      image:
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=400&fit=crop&auto=format",
    },
    {
      id: 3,
      name: "NGK Spark Plugs (4 Pack)",
      brand: "NGK",
      price: "₹999",
      oldPrice: "₹1,999",
      discount: "50% OFF",
      rating: 4.7,
      reviews: 189,
      image:
        "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=400&h=400&fit=crop&auto=format",
    },
    {
      id: 4,
      name: "KYB Shock Absorber",
      brand: "KYB",
      price: "₹4,499",
      oldPrice: "₹5,999",
      discount: "25% OFF",
      rating: 4.6,
      reviews: 312,
      image:
        "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=400&h=400&fit=crop&auto=format",
    },
    {
      id: 5,
      name: "Mann Air Filter",
      brand: "Mann Filter",
      price: "₹749",
      oldPrice: "₹1,299",
      discount: "42% OFF",
      rating: 4.8,
      reviews: 156,
      image:
        "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=400&fit=crop&auto=format",
    },
    {
      id: 6,
      name: "Castrol EDGE 5W-30",
      brand: "Castrol",
      price: "₹3,299",
      oldPrice: "₹4,499",
      discount: "27% OFF",
      rating: 4.9,
      reviews: 892,
      image:
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=400&fit=crop&auto=format",
    },
  ];

  const bestSellerProducts = [
    {
      id: 7,
      name: "Bosch Wiper Blades AeroTwin",
      brand: "Bosch",
      price: "₹1,299",
      oldPrice: "₹1,999",
      discount: "35% OFF",
      rating: 4.8,
      reviews: 445,
      image:
        "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=400&h=400&fit=crop&auto=format",
    },
    {
      id: 8,
      name: "Valeo Clutch Kit Set",
      brand: "Valeo",
      price: "₹7,499",
      oldPrice: "₹9,999",
      discount: "25% OFF",
      rating: 4.7,
      reviews: 234,
      image:
        "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=400&h=400&fit=crop&auto=format",
    },
    {
      id: 9,
      name: "Denso Cabin Air Filter",
      brand: "Denso",
      price: "₹649",
      oldPrice: "₹899",
      discount: "28% OFF",
      rating: 4.6,
      reviews: 178,
      image:
        "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=400&fit=crop&auto=format",
    },
    {
      id: 10,
      name: "HELLA Headlight Bulb H7",
      brand: "HELLA",
      price: "₹899",
      oldPrice: "₹1,499",
      discount: "40% OFF",
      rating: 4.9,
      reviews: 623,
      image:
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=400&fit=crop&auto=format",
    },
    {
      id: 11,
      name: "Continental Timing Belt",
      brand: "Continental",
      price: "₹2,199",
      oldPrice: "₹3,499",
      discount: "37% OFF",
      rating: 4.8,
      reviews: 345,
      image:
        "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=400&h=400&fit=crop&auto=format",
    },
    {
      id: 12,
      name: "ATE Brake Disc Rotor",
      brand: "ATE",
      price: "₹2,899",
      oldPrice: "₹4,299",
      discount: "33% OFF",
      rating: 4.8,
      reviews: 345,
      image:
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=400&fit=crop&auto=format",
    },
  ];

  const topRatedProducts = [
    {
      id: 13,
      name: "Brembo Ceramic Brake Pads",
      brand: "Brembo",
      price: "₹4,999",
      oldPrice: "₹7,499",
      discount: "33% OFF",
      rating: 5.0,
      reviews: 891,
      image:
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=400&fit=crop&auto=format",
    },
    {
      id: 14,
      name: "Bosch Battery S4 55Ah",
      brand: "Bosch",
      price: "₹5,999",
      oldPrice: "₹7,999",
      discount: "25% OFF",
      rating: 4.9,
      reviews: 567,
      image:
        "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=400&h=400&fit=crop&auto=format",
    },
    {
      id: 15,
      name: "Mann Fuel Filter WK 842",
      brand: "Mann Filter",
      price: "₹1,849",
      oldPrice: "₹2,499",
      discount: "26% OFF",
      rating: 4.9,
      reviews: 234,
      image:
        "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=400&fit=crop&auto=format",
    },
    {
      id: 16,
      name: "Sachs Clutch Pressure Plate",
      brand: "Sachs",
      price: "₹3,699",
      oldPrice: "₹4,999",
      discount: "26% OFF",
      rating: 4.8,
      reviews: 432,
      image:
        "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=400&h=400&fit=crop&auto=format",
    },
    {
      id: 17,
      name: "Brembo Sport Brake Discs",
      brand: "Brembo",
      price: "₹6,499",
      oldPrice: "₹8,999",
      discount: "28% OFF",
      rating: 4.9,
      reviews: 678,
      image:
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=400&fit=crop&auto=format",
    },
    {
      id: 18,
      name: "Bosch Lambda Oxygen Sensor",
      brand: "Bosch",
      price: "₹2,799",
      oldPrice: "₹3,999",
      discount: "30% OFF",
      rating: 4.8,
      reviews: 456,
      image:
        "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=400&h=400&fit=crop&auto=format",
    },
  ];

  const addToCart = (productId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setAddedToCart((prev) => ({ ...prev, [productId]: true }));
    setTimeout(() => {
      setAddedToCart((prev) => ({ ...prev, [productId]: false }));
    }, 2000);
  };

  const getActiveProducts = () => {
    switch (activeTab) {
      case "featured":
        return featuredProducts;
      case "bestSeller":
        return bestSellerProducts;
      case "topRated":
        return topRatedProducts;
      default:
        return featuredProducts;
    }
  };

  const scrollSlider = (direction) => {
    if (!sliderRef.current) return;

    const { scrollLeft, clientWidth } = sliderRef.current;

    sliderRef.current.scrollTo({
      left:
        direction === "left"
          ? scrollLeft - clientWidth * 0.8
          : scrollLeft + clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  // Add this function
  const resetScroll = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollTo({ left: 0, behavior: "instant" });
    }
  };

  const ProductCard = ({ product }) => (
    <Link
      to={`/product/${product.id}`}
      className="group bg-white border-2 border-green-100 rounded-2xl overflow-hidden hover:border-green-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex-shrink-0 flex flex-col h-full"
    >
      {/* Product Image Area */}
      <div className="relative bg-green-50 h-44 sm:h-56 overflow-hidden flex-shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-green-600 text-white text-[10px] sm:text-[11px] font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-sm">
          {product.discount}
        </span>
      </div>

      {/* Info and Purchase Options */}
      <div className="p-3 sm:p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[10px] sm:text-xs text-green-700 font-medium tracking-wider uppercase">
            {product.brand}
          </p>
          <div className="flex items-center gap-0.5 sm:gap-1">
            <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-green-500 text-green-500" />
            <span className="text-[10px] sm:text-xs font-bold text-gray-700">
              {product.rating}
            </span>
            <span className="text-[10px] sm:text-xs text-gray-400">
              ({product.reviews})
            </span>
          </div>
        </div>
        <h3 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2 text-xs sm:text-sm leading-snug mb-2 flex-1">
          {product.name}
        </h3>

        {/* Pricing Matrix and Inline Action Button */}
        <div className="flex items-center justify-between pt-2 sm:pt-1 border-t border-green-100 mt-auto">
          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-black text-gray-900">
              {product.price}
            </span>
            <span className="text-[10px] sm:text-xs text-gray-400 line-through">
              {product.oldPrice}
            </span>
          </div>

          <button
            onClick={(e) => addToCart(product.id, e)}
            className={`p-2 sm:p-2.5 cursor-pointer rounded-xl transition-all shadow-sm ${
              addedToCart[product.id]
                ? "bg-green-500 text-white scale-95"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>
    </Link>
  );

  const activeProducts = getActiveProducts();

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white w-full">
      {/* STANDARDIZED: Same spacing pattern as all other components */}
      <div className="px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pt-12 md:pt-16 lg:pt-20">
        {/* Inner container with bottom padding to match top spacing */}
        <div className="w-full max-w-[1440px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto ">
          {/* UPDATED: Left-aligned header with title and description */}
          <div className="mb-10 md:mb-14">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
              Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-700">
                Products
              </span>
            </h2>
            <p className="text-gray-600 text-base md:text-lg max-w-2xl">
              Quality parts for your vehicle
            </p>
          </div>

          {/* Tab & Navigation Controller Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 sm:mb-10 pb-2 border-b border-gray-100">
            {/* Tabs Container - Line indicator style */}
            <div className="flex items-center gap-0 overflow-x-auto w-full sm:w-auto scrollbar-hide">
              <button
                onClick={() => {
                  setActiveTab("featured");
                  setTimeout(resetScroll, 0);
                }}
                className={`relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "featured"
                    ? "text-green-600"
                    : "text-gray-600 hover:text-green-700"
                }`}
              >
                <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Featured
                {activeTab === "featured" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 rounded-full" />
                )}
              </button>
              <button
                onClick={() => {
                  setActiveTab("bestSeller");
                  setTimeout(resetScroll, 0);
                }}
                className={`relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "bestSeller"
                    ? "text-green-600"
                    : "text-gray-600 hover:text-green-700"
                }`}
              >
                <Flame className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Best Seller
                {activeTab === "bestSeller" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 rounded-full" />
                )}
              </button>
              <button
                onClick={() => {
                  setActiveTab("topRated");
                  setTimeout(resetScroll, 0);
                }}
                className={`relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "topRated"
                    ? "text-green-600"
                    : "text-gray-600 hover:text-green-700"
                }`}
              >
                <Trophy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Top Rated
                {activeTab === "topRated" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 rounded-full" />
                )}
              </button>{" "}
            </div>
            {/* Slider Controls - Hidden on mobile (we use different controls) */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => scrollSlider("left")}
                className="w-10 h-10 bg-white border-2 border-green-200 rounded-xl flex items-center justify-center shadow-sm hover:bg-green-50 hover:border-green-400 transition-all cursor-pointer"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-5 w-5 text-green-700" />
              </button>
              <button
                onClick={() => scrollSlider("right")}
                className="w-10 h-10 bg-white border-2 border-green-200 rounded-xl flex items-center justify-center shadow-sm hover:bg-green-50 hover:border-green-400 transition-all cursor-pointer"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-5 w-5 text-green-700" />
              </button>
            </div>
          </div>

          {/* Carousel Zone - Arrows appear on touch/scroll mobile, hover desktop */}
          <div className="relative group w-full">
            {/* Left Arrow */}
            <button
              onClick={() => scrollSlider("left")}
              className={`cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 -ml-2 sm:-ml-4 z-20 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 border border-green-100 text-green-800 rounded-full bg-white shadow-md hover:bg-green-50 transition-all duration-300 ${
                isScrolling
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-2"
              } sm:opacity-0 sm:group-hover:opacity-100 sm:translate-x-0 sm:group-hover:translate-x-0`}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Product Rail */}
            <div
              ref={sliderRef}
              className="flex overflow-x-auto gap-4 sm:gap-6 pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth px-1"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {activeProducts.map((product) => (
                <div
                  key={product.id}
                  className="snap-start w-[260px] sm:w-[320px] lg:w-[340px] flex-shrink-0"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => scrollSlider("right")}
              className={`cursor-pointer absolute right-0 top-1/2 -translate-y-1/2 -mr-2 sm:-mr-4 z-20 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 border border-green-100 text-green-800 rounded-full bg-white shadow-md hover:bg-green-50 transition-all duration-300 ${
                isScrolling
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-2"
              } sm:opacity-0 sm:group-hover:opacity-100 sm:translate-x-0 sm:group-hover:translate-x-0`}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Hide scrollbar styles */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default FeaturedProducts;
