import React, { useState, useMemo, useRef } from "react";
import {
  Leaf,
  ShieldCheck,
  ShoppingBag,
  Eye,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

// Specialized Agriculture / Krushi Product Catalog Dataset
const AGRI_PRODUCTS = [
  {
    id: 1,
    name: "Heavy-Duty 11-Tyne Universal Cultivator",
    category: "Implements",
    subText: "Soil Preparation",
    price: "₹48,500",
    rating: 4.9,
    tag: "Best Seller",
    image:
      "https://red-parts.react.themeforest.scompiler.ru/themes/blue/images/products/product-9-1.jpg",
  },
  {
    id: 2,
    name: "Automatic Ultra-Precise Seed Drill Machine",
    category: "Sowing",
    subText: "Precision Seeding",
    price: "₹72,000",
    rating: 4.8,
    tag: "New Launch",
    image:
      "https://red-parts.react.themeforest.scompiler.ru/themes/blue/images/products/product-10-1.jpg",
  },
  {
    id: 3,
    name: "Premium Battery-Operated 2-in-1 Knapsack Sprayer",
    category: "Crop Care",
    subText: "Pest Management",
    price: "₹4,299",
    rating: 4.7,
    tag: "Top Rated",
    image:
      "https://red-parts.react.themeforest.scompiler.ru/themes/blue/images/products/product-15-1.jpg",
  },
  {
    id: 4,
    name: "Rotary Tiller / Rotavator Multi-Speed Gearbox",
    category: "Implements",
    subText: "Tillage Equipment",
    price: "₹95,000",
    rating: 4.9,
    tag: "Subsidy Eligible",
    image:
      "https://red-parts.react.themeforest.scompiler.ru/themes/blue/images/products/product-17-1.jpg",
  },
  {
    id: 5,
    name: "Solar-Powered Smart Automatic Drip Irrigation Controller",
    category: "Irrigation",
    subText: "Water Automation",
    price: "₹18,999",
    rating: 4.6,
    tag: "Eco Friendly",
    image:
      "https://red-parts.react.themeforest.scompiler.ru/themes/blue/images/products/product-12-1.jpg",
  },
  {
    id: 6,
    name: "High-Output Post Hole Digger Tractor Attachment",
    category: "Implements",
    subText: "Farm Utility",
    price: "₹64,000",
    rating: 4.8,
    tag: "Heavy Duty",
    image:
      "https://red-parts.react.themeforest.scompiler.ru/themes/blue/images/products/product-20-1.jpg",
  },
];

const CATEGORIES = [
  "All Machinery",
  "Implements",
  "Sowing",
  "Crop Care",
  "Irrigation",
];

const AgriProductSection = () => {
  const [activeTab, setActiveTab] = useState("All Machinery");
  const carouselRef = useRef(null);

  // Dynamic filter layer
  const filteredProducts = useMemo(() => {
    if (activeTab === "All Machinery") return AGRI_PRODUCTS;
    return AGRI_PRODUCTS.filter((product) => product.category === activeTab);
  }, [activeTab]);

  // Smooth Carousel manual control scroll trigger
  const scroll = (direction) => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const shiftDistance = clientWidth * 0.75;
      carouselRef.current.scrollTo({
        left:
          direction === "left"
            ? scrollLeft - shiftDistance
            : scrollLeft + shiftDistance,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white w-full">
      {/* STANDARDIZED: Same spacing pattern as all other components */}
      <div className="px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pt-12 md:pt-16 lg:pt-20">
        {/* Inner container with bottom padding to match top spacing */}
        <div className="w-full max-w-[1440px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto ">
          {/* Section Header - Left Aligned */}
          <div className="mb-10 md:mb-14">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
              Advanced{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-700">
                Agricultural Products
              </span>
            </h2>
            <p className="text-gray-600 text-base md:text-lg max-w-2xl">
              Boost field productivity and yield with our premium collection of
              certified implements, harvesters, and smart irrigation systems.
            </p>
          </div>

          {/* Dynamic Horizontal Tab Filter Menu */}
          {/* Dynamic Horizontal Tab Filter Menu - Scrollable on mobile */}
          <div className="flex items-center gap-2 xl:gap-3 mb-10 md:mb-12 overflow-x-auto scrollbar-hide pb-1">
            {CATEGORIES.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`cursor-pointer px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 border whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab
                    ? "bg-green-700 border-green-700 text-white shadow-md shadow-green-700/10"
                    : "bg-white border-green-200 text-green-800 hover:bg-green-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Product Carousel Lane Container with Left/Right Buttons */}
          <div className="relative group w-full">
            {filteredProducts.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-green-100 rounded-2xl p-16 text-center">
                <h3 className="text-lg font-bold text-green-900 mb-1">
                  No machinery found
                </h3>
                <p className="text-gray-500 text-sm max-w-sm mx-auto">
                  No active agricultural listings under this segment category
                  right now.
                </p>
              </div>
            ) : (
              <>
                {/* Manual Left Scroll Control */}
                <button
                  onClick={() => scroll("left")}
                  className="cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-20 flex items-center justify-center w-11 h-11 border border-green-100 text-green-800 rounded-full bg-white shadow-md hover:bg-green-50 opacity-0 group-hover:opacity-100 transition-all duration-200"
                  aria-label="Scroll Carousel Left"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Horizontal Scroll Matrix Row */}
                <div
                  ref={carouselRef}
                  className="flex overflow-x-auto gap-6 pb-6 scrollbar-none snap-x snap-mandatory scroll-smooth px-1"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="snap-start group/card w-[310px] sm:w-[320px] bg-white border border-green-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between flex-shrink-0"
                    >
                      <div>
                        {/* Image Aspect Box with Badges */}
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-green-50/20 border-b border-green-100">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700"
                          />

                          {/* Absolute Corner Pill Tags */}
                          <span className="absolute top-4 left-4 bg-white border border-green-200 text-green-700 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                            {product.tag}
                          </span>

                          {/* Quick-Action View Overlays */}
                          <div className="absolute inset-0 bg-green-950/20 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                            <Link
                              to={`/product/${product.id}`}
                              className="cursor-pointer p-3 bg-white text-green-700 rounded-full shadow-lg hover:bg-green-600 hover:text-white transition-colors"
                            >
                              <Eye className="w-5 h-5" />
                            </Link>
                          </div>
                        </div>

                        {/* Technical Meta Content */}
                        <div className="p-5">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] text-green-600 font-extrabold tracking-wider uppercase">
                              {product.category} • {product.subText}
                            </span>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                              <span className="text-xs font-bold text-green-900">
                                {product.rating}
                              </span>
                            </div>
                          </div>

                          <h3 className="font-extrabold text-green-950 group-hover/card:text-green-600 transition-colors text-sm md:text-base leading-snug line-clamp-2 h-12">
                            {product.name}
                          </h3>

                          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-green-700">
                            <ShieldCheck className="w-4 h-4 text-green-600" />
                            <span>Brand Warranty Included</span>
                          </div>
                        </div>
                      </div>

                      {/* Pricing & Cart Trigger Base Footer */}
                      <div className="px-5 pb-5 pt-3 border-t border-green-100 flex items-center justify-between bg-white">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-green-700/60 uppercase tracking-wider">
                            Price
                          </span>
                          <span className="text-lg font-black text-green-900">
                            {product.price}
                          </span>
                        </div>

                        <Link
                          to={`/product/${product.id}`}
                          className="cursor-pointer inline-flex items-center gap-2 bg-green-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-green-800 transition-all shadow-sm"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>View Details</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Manual Right Scroll Control */}
                <button
                  onClick={() => scroll("right")}
                  className="cursor-pointer absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-20 flex items-center justify-center w-11 h-11 border border-green-100 text-green-800 rounded-full bg-white shadow-md hover:bg-green-50 opacity-0 group-hover:opacity-100 transition-all duration-200"
                  aria-label="Scroll Carousel Right"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
        {/* Hide scrollbar styles */}
        <style>{`
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`}</style>
      </div>
    </section>
  );
};

export default AgriProductSection;
