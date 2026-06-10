import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Tractor,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  ArrowLeft,
  Check,
} from "lucide-react";
import { Link } from "react-router-dom";

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Mahindra 575 DI Clutch Plate",
    brand: "Mahindra",
    model: "575 DI",
    category: "Transmission",
    price: "₹4,200",
    image:
      "https://assets.tractorjunction.com/tractor-junction/assets/images/upload/massey-ferguson-241-di-1693217292.webp?width=538&height=320",
  },
  {
    id: 2,
    name: "John Deere 5050 E Radiator Assembly",
    brand: "John Deere",
    model: "5050 E",
    category: "Cooling System",
    price: "₹6,850",
    image:
      "https://assets.tractorjunction.com/tractor-junction/assets/images/upload/john-deere-5130-m-1739596215.webp?width=694&height=404",
  },
  {
    id: 3,
    name: "Swaraj 744 FE High-Flow Hydraulic Pump",
    brand: "Swaraj",
    model: "744 FE",
    category: "Hydraulics",
    price: "₹8,100",
    image:
      "https://assets.tractorjunction.com/tractor-junction/assets/images/tractor-images/tractor-image-0-1736318371.webp?width=538&height=320",
  },
  {
    id: 4,
    name: "Mahindra Arjun 555 Air Filter",
    brand: "Mahindra",
    model: "Arjun 555",
    category: "Filters",
    price: "₹950",
    image:
      "https://assets.tractorjunction.com/tractor-junction/assets/images/upload/mahindra-oja-3136-4wd-1692164001.webp?width=347&height=202",
  },
  {
    id: 5,
    name: "John Deere 5310 Heavy Duty Brake Disc",
    brand: "John Deere",
    model: "5310",
    category: "Brakes",
    price: "₹3,400",
    image:
      "https://assets.tractorjunction.com/tractor-junction/assets/images/upload/john-deere-5050-d-gearpro-4wd-1716993454.webp?width=538&height=320",
  },
  {
    id: 6,
    name: "Swaraj 855 FE Fuel Injection Pump",
    brand: "Swaraj",
    model: "855 FE",
    category: "Fuel System",
    price: "₹12,600",
    image:
      "https://assets.tractorjunction.com/tractor-junction/assets/images/upload/swaraj-735-xt-1755857615.webp?width=538&height=320",
  },
];

const BRAND_MODELS = {
  Mahindra: ["575 DI", "Arjun 555"],
  "John Deere": ["5050 E", "5310"],
  Swaraj: ["744 FE", "855 FE"],
};

const BrandModelFilter = () => {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filterStep, setFilterStep] = useState("brand"); // "brand" or "model"

  const carouselRef = useRef(null);
  const dropdownRef = useRef(null);

  // Close popup menu when clicking outside
  useEffect(() => {
    const clickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  const filteredProducts = useMemo(() => {
    return INITIAL_PRODUCTS.filter((product) => {
      const matchBrand = selectedBrand ? product.brand === selectedBrand : true;
      const matchModel = selectedModel ? product.model === selectedModel : true;
      return matchBrand && matchModel;
    });
  }, [selectedBrand, selectedModel]);

  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand);
    setSelectedModel("");
    setFilterStep("model"); // Go directly to step 2 selection window
  };

  const handleModelSelect = (model) => {
    setSelectedModel(model);
    setIsDropdownOpen(false); // Close dropdown upon complete selection setup
  };

  const clearAllFilters = () => {
    setSelectedBrand("");
    setSelectedModel("");
    setFilterStep("brand");
    setIsDropdownOpen(false);
  };

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
    <div className="w-full bg-gradient-to-b from-gray-50 to-white">
      {/* Updated: Matching BrandsMakers spacing */}
      <div className="px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pt-12 md:pt-16 lg:pt-20">
        {/* Updated: Applied the same max-width wrapper */}
        <div className="w-full max-w-[1440px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto">
          
          {/* Simple Top Row Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-green-100">
            <div>
              <span className="text-green-700 text-sm font-bold tracking-wider uppercase inline-flex items-center gap-1.5 mb-2">
                <Tractor className="w-4 h-4 text-green-600" /> Compatibility
                Finder
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
                Shop Parts By{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-700">
                  Tractor Model
                </span>
              </h2>
            </div>

            {/* Unified Filter Button Control Element Area */}
            <div className="relative self-start sm:self-auto" ref={dropdownRef}>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsDropdownOpen(!isDropdownOpen);
                    if (!selectedBrand) setFilterStep("brand");
                  }}
                  className={`cursor-pointer inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl border transition-all ${
                    isDropdownOpen || selectedBrand
                      ? "bg-green-700 text-white border-green-700 shadow-md shadow-green-700/20"
                      : "bg-white text-green-800 border-green-200 hover:bg-green-50"
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span>
                    {selectedBrand
                      ? `${selectedBrand}${selectedModel ? ` • ${selectedModel}` : " (Select Model)"}`
                      : "Filter by Tractor"}
                  </span>
                </button>

                {(selectedBrand || selectedModel) && (
                  <button
                    onClick={clearAllFilters}
                    className="cursor-pointer text-xs font-bold text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 p-2.5 rounded-xl transition-colors border border-gray-100"
                    title="Reset Filter Matrix"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Interactive Step Dropdown Menu Context */}
              {isDropdownOpen && (
                <div className="absolute right-0 sm:right-0 left-0 sm:left-auto top-full mt-2 w-full sm:w-64 bg-white border border-green-100 rounded-2xl shadow-xl z-50 p-4 space-y-3">
                  {/* Header configuration inside window popup */}
                  <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                    <div className="flex items-center gap-1.5">
                      {filterStep === "model" && (
                        <button
                          onClick={() => setFilterStep("brand")}
                          className="text-gray-400 hover:text-green-700 transition-colors p-0.5 rounded-md hover:bg-gray-50 cursor-pointer"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <span className="text-[11px] font-black uppercase text-green-900 tracking-wider">
                        {filterStep === "brand"
                          ? "Step 1: Choose Brand"
                          : `Step 2: ${selectedBrand} Models`}
                      </span>
                    </div>
                    <button
                      onClick={() => setIsDropdownOpen(false)}
                      className="text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* STEP 1: Render Brands Stack */}
                  {filterStep === "brand" && (
                    <div className="space-y-0.5 max-h-48 overflow-y-auto pr-0.5">
                      {Object.keys(BRAND_MODELS).map((brand) => (
                        <button
                          key={brand}
                          onClick={() => handleBrandSelect(brand)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
                            selectedBrand === brand
                              ? "bg-green-50 text-green-800"
                              : "text-gray-700 hover:bg-green-50/60"
                          }`}
                        >
                          <span>{brand}</span>
                          {selectedBrand === brand && (
                            <Check className="w-3.5 h-3.5 text-green-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* STEP 2: Render Models Stack */}
                  {filterStep === "model" && selectedBrand && (
                    <div className="space-y-0.5 max-h-48 overflow-y-auto pr-0.5">
                      <button
                        onClick={() => handleModelSelect("")}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          selectedModel === ""
                            ? "bg-green-600 text-white"
                            : "text-gray-700 hover:bg-green-50/60"
                        }`}
                      >
                        All {selectedBrand} Parts
                      </button>
                      {BRAND_MODELS[selectedBrand].map((model) => (
                        <button
                          key={model}
                          onClick={() => handleModelSelect(model)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
                            selectedModel === model
                              ? "bg-green-600 text-white"
                              : "text-gray-700 hover:bg-green-50/60"
                          }`}
                        >
                          <span>{model}</span>
                          {selectedModel === model && (
                            <Check className="w-3.5 h-3.5 text-white" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Carousel Zone with Vertically Centered Left/Right Navigation Overlays */}
          <div className="relative group w-full">
            {filteredProducts.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-green-100 rounded-2xl p-16 text-center">
                <h3 className="text-lg font-bold text-green-900 mb-1">
                  No items found
                </h3>
                <p className="text-gray-500 text-sm max-w-sm mx-auto">
                  No matching product inventory found. Click the clear action tab
                  or shift dropdown selections.
                </p>
              </div>
            ) : (
              <>
                {/* Left Carousel Arrow Button Trigger */}
                <button
                  onClick={() => scroll("left")}
                  className="cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-20 flex items-center justify-center w-10 h-10 border border-green-100 text-green-800 rounded-full bg-white shadow-md hover:bg-green-50 opacity-0 group-hover:opacity-100 transition-all duration-200"
                  aria-label="Scroll Product Cards Left"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Central Dynamic Sliding Row Track Frame */}
                <div
                  ref={carouselRef}
                  className="flex overflow-x-auto gap-6 pb-4 scrollbar-none snap-x snap-mandatory scroll-smooth px-1"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="snap-start group/card w-[270px] bg-white border border-green-100 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col justify-between flex-shrink-0"
                    >
                      <div>
                        {/* Product Asset Thumbnail */}
                        <div className="relative bg-white h-44 overflow-hidden border-b border-gray-50">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover/card:scale-102 transition-transform duration-500"
                          />
                          <span className="absolute top-3 left-3 bg-white text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-green-100 shadow-sm">
                            {product.category}
                          </span>
                        </div>

                        {/* Technical Detail Content Area */}
                        <div className="p-4">
                          <p className="text-[10px] text-green-600 font-extrabold uppercase tracking-wider mb-1">
                            {product.brand} • {product.model}
                          </p>
                          <h4 className="font-bold text-gray-900 group-hover/card:text-green-600 text-xs leading-snug transition-colors line-clamp-2">
                            {product.name}
                          </h4>
                        </div>
                      </div>

                      {/* Dynamic Action Call Footer Container */}
                      <div className="px-4 pb-4 pt-2.5 flex items-center justify-between border-t border-gray-50 bg-white">
                        <span className="text-sm font-black text-gray-900">
                          {product.price}
                        </span>
                        <Link to="/spare-parts">
                          <button className="cursor-pointer text-[11px] font-bold text-white bg-green-700 hover:bg-green-800 px-3.5 py-2 rounded-lg transition-colors shadow-sm">
                            View Details
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right Carousel Arrow Button Trigger */}
                <button
                  onClick={() => scroll("right")}
                  className="cursor-pointer absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-20 flex items-center justify-center w-10 h-10 border border-green-100 text-green-800 rounded-full bg-white shadow-md hover:bg-green-50 opacity-0 group-hover:opacity-100 transition-all duration-200"
                  aria-label="Scroll Product Cards Right"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandModelFilter;