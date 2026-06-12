import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Listbox, Checkbox } from "@headlessui/react";
import {
  Search,
  Car,
  Wrench,
  Star,
  Heart,
  Shield,
  Truck,
  ChevronRight,
  ArrowRight,
  Percent,
  BookOpen,
  Users,
  Award,
  Zap,
  Filter,
  Cog,
  Gauge,
  Thermometer,
  Wind,
  Clock,
  CheckCircle,
  Quote,
  ChevronDown,
  IndianRupee,
  MapPin,
  Sparkles,
  Tractor,
  Check,
} from "lucide-react";

const SpareParts = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [selectedPartCategory, setSelectedPartCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const categoriesScrollRef = useRef(null);
  const featuredScrollRef = useRef(null);
  const bestSellerScrollRef = useRef(null);
  const [isScrollingCategories, setIsScrollingCategories] = useState(false);
  const [isScrollingFeatured, setIsScrollingFeatured] = useState(false);
  const [isScrollingBestSeller, setIsScrollingBestSeller] = useState(false);
  const scrollTimeoutRef1 = useRef(null);
  const scrollTimeoutRef2 = useRef(null);
  const scrollTimeoutRef3 = useRef(null);
  const [readyToDispatch, setReadyToDispatch] = useState(true);
  const [includeOutOfStock, setIncludeOutOfStock] = useState(false);
  const [oemPart, setOemPart] = useState(true);
  const [oesCertified, setOesCertified] = useState(true);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(0);


  const galleryImages = [
  "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&h=400&fit=crop",
 "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&h=400&fit=crop",
];

  // Hook to detect scroll for showing arrows
  const useScrollDetection = (ref, setIsScrolling, timeoutRef) => {
    useEffect(() => {
      const slider = ref.current;
      if (!slider) return;
      const handleScroll = () => {
        setIsScrolling(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setIsScrolling(false), 1500);
      };
      slider.addEventListener("scroll", handleScroll, { passive: true });
      slider.addEventListener("touchstart", handleScroll, { passive: true });
      return () => {
        slider.removeEventListener("scroll", handleScroll);
        slider.removeEventListener("touchstart", handleScroll);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }, []);
  };

  useScrollDetection(
    categoriesScrollRef,
    setIsScrollingCategories,
    scrollTimeoutRef1,
  );
  useScrollDetection(
    featuredScrollRef,
    setIsScrollingFeatured,
    scrollTimeoutRef2,
  );
  useScrollDetection(
    bestSellerScrollRef,
    setIsScrollingBestSeller,
    scrollTimeoutRef3,
  );

  const scrollSlider = (ref, direction) => {
    if (!ref.current) return;
    const { scrollLeft, clientWidth } = ref.current;
    ref.current.scrollTo({
      left:
        direction === "left"
          ? scrollLeft - clientWidth * 0.8
          : scrollLeft + clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  // New local states required for added section mechanics
  const [faqOpen, setFaqOpen] = useState(null);

  const categoriesRef = useRef(null);

  // ADD THIS: Smooth scroll function
  const scrollToCategories = () => {
    if (categoriesRef.current) {
      const navbarHeight = 80; // Adjust this value to match your navbar height in pixels
      const elementPosition =
        categoriesRef.current.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // ========== VEHICLE DATA ==========
  const vehicleMakes = [
    "Maruti Suzuki",
    "Hyundai",
    "Tata Motors",
    "Mahindra",
    "Toyota",
    "Honda",
    "Ford",
    "Volkswagen",
    "Renault",
    "Nissan",
  ];

  const vehicleYears = Array.from({ length: 25 }, (_, i) => 2025 - i);

  const handleSearch = () => {
    navigate(
      `/spare-parts?price=${selectedPriceRange}&category=${selectedPartCategory}&brand=${selectedBrand}&city=${selectedCity}`,
    );
  };

  // ========== CATEGORIES ==========
  const categories = [
    {
      id: 1,
      name: "Engine Parts",
      icon: Cog,
      image:
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop",
      slug: "engine-parts",
    },
    {
      id: 2,
      name: "Brakes & Suspension",
      icon: Gauge,
      image:
        "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=300&fit=crop",
      slug: "brakes-suspension",
    },
    {
      id: 3,
      name: "Electrical Parts",
      icon: Zap,
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop",
      slug: "electrical-parts",
    },
    {
      id: 4,
      name: "Filters & Fluids",
      icon: Filter,
      image:
        "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=300&fit=crop",
      slug: "filters-fluids",
    },
    {
      id: 5,
      name: "Cooling System",
      icon: Thermometer,
      image:
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop",
      slug: "cooling-system",
    },
    {
      id: 6,
      name: "Exhaust System",
      icon: Wind,
      image:
        "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=300&fit=crop",
      slug: "exhaust-system",
    },
    {
      id: 7,
      name: "Transmission",
      icon: Cog,
      image:
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop",
      slug: "transmission",
    },
    {
      id: 8,
      name: "Body Parts",
      icon: Car,
      image:
        "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=300&fit=crop",
      slug: "body-parts",
    },
  ];

  // ========== MOCK DATA ARRAYS FOR NEW SECTIONS ==========
  const featuredProducts = [
    {
      id: 101,
      name: "Premium High-Friction Brake Pads",
      price: "₹1,850",
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop",
    },
    {
      id: 102,
      name: "Heavy Duty Synthetic Oil Filter",
      price: "₹420",
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=300&fit=crop",
    },
    {
      id: 103,
      name: "Iridium Power Spark Plug Set",
      price: "₹1,200",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=300&fit=crop",
    },
    {
      id: 104,
      name: "All-Weather Rubber V-Belt",
      price: "₹650",
      rating: 4.6,
      image:
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop",
    },
  ];

  const bestSellers = [
    {
      id: 201,
      name: "Pre-Mixed Engine Coolant 1L",
      price: "₹299",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop",
    },
    {
      id: 202,
      name: "High-Performance Air Filter",
      price: "₹580",
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=300&fit=crop",
    },
    {
      id: 203,
      name: "Halogen Headlight Bulb 12V",
      price: "₹180",
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop",
    },
    {
      id: 204,
      name: "Stainless Steel Exhaust Clamps",
      price: "₹350",
      rating: 4.6,
      image:
        "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=300&fit=crop",
    },
  ];

  const popularBrands = [
    { id: 1, name: "Bosch", components: "Electrical & Braking" },
    { id: 2, name: "Nippon Paint", components: "Body & Coatings" },
    { id: 3, name: "Lucas TVS", components: "Starters & Dynamos" },
    { id: 4, name: "Valvoline", components: "Oils & Lubricants" },
    { id: 5, name: "Minda", components: "Switches & Lighting" },
    { id: 6, name: "Purolator", components: "Filtration Units" },
  ];

  const specialOffers = [
    {
      id: 1,
      title: "Monsoon Brake Safety Upgrade",
      discount: "Flat 15% OFF",
      code: "BRAKE15",
      desc: "Valid on all brake discs and pads assemblies.",
    },
    {
      id: 2,
      title: "Engine Tune-Up Essential Pack",
      discount: "Save ₹400 Combo",
      code: "TUNEUPSAVE",
      desc: "Get filters and spark plugs combined discount.",
    },
  ];

  const recentlyViewed = [
    {
      id: 501,
      name: "Radiator Cooling Fan Assembly",
      price: "₹2,450",
      image:
        "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=300&fit=crop",
    },
    {
      id: 502,
      name: "High-Pressure Exhaust Muffler",
      price: "₹4,800",
      image:
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop",
    },
  ];

  const faqs = [
    {
      q: "How do I ensure a spare part matches my exact car configuration?",
      a: "Input your brand manufacturer details, exact build year, model profile, and variant metrics within our 'Quick Part Search' widget layout to load components built for your car configuration.",
    },
    {
      q: "What is the certified return timeline policy for non-matching parts?",
      a: "We support a complete replacement verification or refund process if requested within the matching validity timeline windows post-handover.",
    },
    {
      q: "Are all auto accessories and core mechanical assemblies genuine?",
      a: "Yes, every component cataloged under our listings originates strictly from verified manufacturer production channels or direct authorized supply channels.",
    },
  ];

  const handleVehicleSearch = () => {
    navigate(
      `/spare-parts?make=${selectedMake}&model=${selectedModel}&year=${selectedYear}`,
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen ">
      {/* ========== HERO SECTION ========== */}
      <section className="relative bg-gray-900 text-white min-h-[550px] flex items-center">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1600&auto=format&fit=crop&q=90"
            alt="Automotive workshop with genuine spare parts and tools"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/85 via-gray-900/50 to-black/20" />
        </div>

        <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pt-12 md:pt-16 lg:pt-20 pb-8 relative z-10 ">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg shadow-green-700/30">
                <Sparkles className="h-4 w-4" />
                <span>Genuine Parts Marketplace</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-white drop-shadow-md">
                Genuine Spare Parts at{" "}
                <span className="text-green-400 bg-gray-900/60 px-3 inline-block rounded-lg backdrop-blur-sm border border-white/10">
                  Unbeatable Prices
                </span>
              </h1>
              <p className="text-lg text-gray-200 font-medium mb-8 drop-shadow-sm">
                India's trusted destination for authentic automotive spare
                parts. Over 1 million parts for 5000+ vehicle models.
              </p>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-700/30 border border-green-600/30 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      100% Genuine
                    </p>
                    <p className="text-xs text-gray-300">Quality Assured</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-700/30 border border-green-600/30 flex items-center justify-center">
                    <Truck className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Fast Delivery
                    </p>
                    <p className="text-xs text-gray-300">PAN India Shipping</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-700/30 border border-green-600/30 flex items-center justify-center">
                    <Award className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Warranty</p>
                    <p className="text-xs text-gray-300">On All Parts</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="#current-offers"
                  className="px-6 py-3 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-800 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Percent className="h-5 w-5" />
                  View Offers
                </Link>
                <Link
                  to="#categories"
                  className="px-6 py-3 bg-gray-900/60 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-gray-900/80 transition-all duration-300 flex items-center gap-2 border border-gray-500/30 hover:border-white/40"
                >
                  <Wrench className="h-5 w-5" />
                  Browse Categories
                </Link>
              </div>
            </div>

            {/* Right Side - Filter Widget */}
            <div className="lg:block relative z-30">
              <div className="bg-gray-900/85 backdrop-blur-md rounded-2xl p-6 border border-gray-500/20 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-green-700/30 flex items-center justify-center">
                    <Filter className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Find Spare Parts
                    </h3>
                    <p className="text-xs text-gray-300">
                      Filter by your requirements
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Price Range Filter */}
                  <Listbox
                    value={selectedPriceRange}
                    onChange={setSelectedPriceRange}
                  >
                    <div className="relative">
                      <Listbox.Button className="w-full px-4 py-3 rounded-lg text-gray-900 bg-white text-left flex items-center justify-between hover:shadow-md transition-shadow duration-200 border border-gray-200 focus:ring-2 focus:ring-green-600">
                        <div className="flex items-center gap-3">
                          <IndianRupee className="h-4 w-4 text-gray-400" />
                          <span
                            className={
                              selectedPriceRange
                                ? "text-gray-900 font-medium"
                                : "text-gray-400"
                            }
                          >
                            {selectedPriceRange || "Price Range"}
                          </span>
                        </div>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </Listbox.Button>
                      <Listbox.Options className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto py-1 text-sm">
                        {[
                          "Below ₹200",
                          "₹201 - ₹800",
                          "₹801 - ₹2,500",
                          "Above ₹2,501",
                        ].map((range) => (
                          <Listbox.Option
                            key={range}
                            value={range}
                            className={({ active, selected }) =>
                              `cursor-pointer px-4 py-2.5 transition-colors ${
                                active
                                  ? "bg-green-100 text-green-700 font-medium"
                                  : selected
                                    ? "bg-green-50 text-green-600"
                                    : "text-gray-700"
                              }`
                            }
                          >
                            {range}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </div>
                  </Listbox>

                  {/* Categories Filter */}
                  <Listbox
                    value={selectedPartCategory}
                    onChange={setSelectedPartCategory}
                  >
                    <div className="relative">
                      <Listbox.Button className="w-full px-4 py-3 rounded-lg text-gray-900 bg-white text-left flex items-center justify-between hover:shadow-md transition-shadow duration-200 border border-gray-200 focus:ring-2 focus:ring-green-600">
                        <div className="flex items-center gap-3">
                          <Cog className="h-4 w-4 text-gray-400" />
                          <span
                            className={
                              selectedPartCategory
                                ? "text-gray-900 font-medium"
                                : "text-gray-400"
                            }
                          >
                            {selectedPartCategory || "Categories"}
                          </span>
                        </div>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </Listbox.Button>
                      <Listbox.Options className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto py-1 text-sm">
                        {[
                          "Tractor Parts Assembly",
                          "Tractor Valve",
                          "Tractor Pto Pulley",
                          "Tractor Brake Shoe",
                        ].map((category) => (
                          <Listbox.Option
                            key={category}
                            value={category}
                            className={({ active, selected }) =>
                              `cursor-pointer px-4 py-2.5 transition-colors ${
                                active
                                  ? "bg-green-100 text-green-700 font-medium"
                                  : selected
                                    ? "bg-green-50 text-green-600"
                                    : "text-gray-700"
                              }`
                            }
                          >
                            {category}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </div>
                  </Listbox>

                  {/* Brands Filter */}
                  <Listbox value={selectedBrand} onChange={setSelectedBrand}>
                    <div className="relative">
                      <Listbox.Button className="w-full px-4 py-3 rounded-lg text-gray-900 bg-white text-left flex items-center justify-between hover:shadow-md transition-shadow duration-200 border border-gray-200 focus:ring-2 focus:ring-green-600">
                        <div className="flex items-center gap-3">
                          <Tractor className="h-4 w-4 text-gray-400" />
                          <span
                            className={
                              selectedBrand
                                ? "text-gray-900 font-medium"
                                : "text-gray-400"
                            }
                          >
                            {selectedBrand || "Brands"}
                          </span>
                        </div>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </Listbox.Button>
                      <Listbox.Options className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto py-1 text-sm">
                        {[
                          "HMT Tractor Spare Parts",
                          "Mahindra Tractor Spare Parts",
                          "Eicher Tractor Spare Parts",
                          "Kubota Spare Parts",
                        ].map((brand) => (
                          <Listbox.Option
                            key={brand}
                            value={brand}
                            className={({ active, selected }) =>
                              `cursor-pointer px-4 py-2.5 transition-colors ${
                                active
                                  ? "bg-green-100 text-green-700 font-medium"
                                  : selected
                                    ? "bg-green-50 text-green-600"
                                    : "text-gray-700"
                              }`
                            }
                          >
                            {brand}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </div>
                  </Listbox>

                  {/* State & City Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* State Filter */}
                    <Listbox value={selectedState} onChange={setSelectedState}>
                      <div className="relative">
                        <Listbox.Button className="w-full px-4 py-3 rounded-lg text-gray-900 bg-white text-left flex items-center justify-between hover:shadow-md transition-shadow duration-200 border border-gray-200 focus:ring-2 focus:ring-green-600">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span
                              className={`truncate ${
                                selectedState
                                  ? "text-gray-900 font-medium"
                                  : "text-gray-400"
                              }`}
                            >
                              {selectedState || "State"}
                            </span>
                          </div>
                          <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        </Listbox.Button>
                        <Listbox.Options className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto py-1 text-sm">
                          {[
                            "Maharashtra",
                            "Gujarat",
                            "Punjab",
                            "Haryana",
                            "Uttar Pradesh",
                            "Madhya Pradesh",
                            "Rajasthan",
                            "Tamil Nadu",
                            "Karnataka",
                            "Bihar",
                          ].map((state) => (
                            <Listbox.Option
                              key={state}
                              value={state}
                              className={({ active, selected }) =>
                                `cursor-pointer px-4 py-2.5 transition-colors ${
                                  active
                                    ? "bg-green-100 text-green-700 font-medium"
                                    : selected
                                      ? "bg-green-50 text-green-600"
                                      : "text-gray-700"
                                }`
                              }
                            >
                              {state}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </div>
                    </Listbox>

                    {/* City Filter */}
                    <Listbox value={selectedCity} onChange={setSelectedCity}>
                      <div className="relative">
                        <Listbox.Button className="w-full px-4 py-3 rounded-lg text-gray-900 bg-white text-left flex items-center justify-between hover:shadow-md transition-shadow duration-200 border border-gray-200 focus:ring-2 focus:ring-green-600">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span
                              className={
                                selectedCity
                                  ? "text-gray-900 font-medium"
                                  : "text-gray-400"
                              }
                            >
                              {selectedCity || "Your City"}
                            </span>
                          </div>
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        </Listbox.Button>
                        <Listbox.Options className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto py-1 text-sm">
                          {[
                            "Delhi",
                            "Mumbai",
                            "Bangalore",
                            "Chennai",
                            "Hyderabad",
                            "Pune",
                            "Ahmedabad",
                            "Jaipur",
                            "Lucknow",
                            "Kolkata",
                          ].map((city) => (
                            <Listbox.Option
                              key={city}
                              value={city}
                              className={({ active, selected }) =>
                                `cursor-pointer px-4 py-2.5 transition-colors ${
                                  active
                                    ? "bg-green-100 text-green-700 font-medium"
                                    : selected
                                      ? "bg-green-50 text-green-600"
                                      : "text-gray-700"
                                }`
                              }
                            >
                              {city}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </div>
                    </Listbox>
                  </div>
                  {/* Search Button */}
                  <button
                    onClick={handleSearch}
                    className="w-full px-6 py-3.5 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-800 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group"
                  >
                    <Search className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span>Search Parts</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ========== SECTION 3: SEARCH BY CATEGORY ========== */}
      <section
        id="categories"
        ref={categoriesRef}
        className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pt-12 md:pt-16 lg:pt-20"
      >
        <div className="flex items-center justify-between mb-5 sm:mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <Wrench className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              Search{" "}
              <span className="text-transparent bg-clip-text bg-green-600">
                by Category
              </span>
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Browse our extensive catalog of spare parts categories
            </p>
          </div>
          <Link
            to="/categories"
            className="text-green-600 hover:text-green-700 font-semibold flex items-center gap-1 text-sm  hover:underline"
          >
            <span className="hidden sm:inline">View All</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* MOBILE - Native scroll with arrows on touch */}
        <div className="sm:hidden relative">
          <button
            onClick={() => scrollSlider(categoriesScrollRef, "left")}
            className={`cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 -ml-1 z-20 flex items-center justify-center w-8 h-8 border border-green-200 text-green-700 rounded-full bg-white shadow-lg hover:bg-green-50 transition-all duration-300 ${
              isScrollingCategories
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-2"
            }`}
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
          </button>
          <div
            ref={categoriesScrollRef}
            className="flex overflow-x-auto gap-3 pb-4 px-4 scrollbar-hide snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((category) => (
              <div
                key={category.id}
                className="snap-start w-[75vw] flex-shrink-0"
              >
                <Link
                  to={`/category/${category.slug}`}
                  className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full"
                >
                  <div className="relative h-40 overflow-hidden bg-gray-100">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-3 left-3 text-white">
                      <category.icon className="h-6 w-6 mb-1" />
                      <h3 className="text-sm font-bold">{category.name}</h3>
                    </div>
                  </div>
                  <div className="p-3 border-t border-gray-100 mt-auto">
                    <span className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center gap-1">
                      View Subcategories <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          <button
            onClick={() => scrollSlider(categoriesScrollRef, "right")}
            className={`cursor-pointer absolute right-0 top-1/2 -translate-y-1/2 -mr-1 z-20 flex items-center justify-center w-8 h-8 border border-green-200 text-green-700 rounded-full bg-white shadow-lg hover:bg-green-50 transition-all duration-300 ${
              isScrollingCategories
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-2"
            }`}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* DESKTOP - Grid */}
        <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <category.icon className="h-8 w-8 mb-2" />
                  <h3 className="text-lg font-bold">{category.name}</h3>
                </div>
              </div>
              <div className="p-4 border-t border-gray-100">
                <span className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1">
                  View Subcategories <ChevronRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      {/* ========== SECTION 4: FEATURED PRODUCTS ========== */}
      <section className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pt-12 md:pt-16 lg:pt-20 border-t border-gray-100">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <Star className="h-6 w-6 text-green-600 fill-green-600" />
              Featured{" "}
              <span className="text-transparent bg-clip-text bg-green-600">
                {" "}
                Products{" "}
              </span>
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              High-performance replacements picked for your vehicle setup
            </p>
          </div>
          <Link
            to="/products"
            className="text-sm font-semibold text-green-600 flex items-center gap-1 hover:underline"
          >
            <span className="hidden sm:inline">View All</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
        {/* MOBILE - 1.5 cards sliding */}
        {/* MOBILE - Native scroll with arrows on touch */}
        <div className="sm:hidden relative">
          <button
            onClick={() => scrollSlider(featuredScrollRef, "left")}
            className={`cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 -ml-1 z-20 flex items-center justify-center w-8 h-8 border border-green-200 text-green-700 rounded-full bg-white shadow-lg hover:bg-green-50 transition-all duration-300 ${
              isScrollingFeatured
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-2"
            }`}
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
          </button>
          <div
            ref={featuredScrollRef}
            className="flex overflow-x-auto gap-3 pb-4 px-4 scrollbar-hide snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="snap-start w-[75vw] flex-shrink-0"
              >
                <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-full">
                  <div>
                    <Link to={`/product/${product.id}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-40 object-cover rounded-lg mb-3 cursor-pointer hover:opacity-90 transition-opacity"
                      />
                    </Link>
                    <Link to={`/product/${product.id}`}>
                      <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 hover:text-green-600 transition-colors cursor-pointer">
                        {product.name}
                      </h4>
                    </Link>
                    <div className="flex items-center gap-1 text-green-600 text-xs mt-2 font-medium">
                      <CheckCircle className="h-3 w-3" /> Guaranteed Fitment
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      {product.price}
                    </span>
                    <button className="cursor-pointer px-3 py-1.5 bg-green-700 hover:bg-green-800 text-white rounded-md text-xs font-semibold transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => scrollSlider(featuredScrollRef, "right")}
            className={`cursor-pointer absolute right-0 top-1/2 -translate-y-1/2 -mr-1 z-20 flex items-center justify-center w-8 h-8 border border-green-200 text-green-700 rounded-full bg-white shadow-lg hover:bg-green-50 transition-all duration-300 ${
              isScrollingFeatured
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-2"
            }`}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        {/* DESKTOP - Original grid unchanged */}
        <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-lg mb-3 cursor-pointer hover:opacity-90 transition-opacity"
                  />
                </Link>
                <Link to={`/product/${product.id}`}>
                  <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 hover:text-green-600 transition-colors cursor-pointer">
                    {product.name}
                  </h4>
                </Link>
                <div className="flex items-center gap-1 text-green-600 text-xs mt-2 font-medium">
                  <CheckCircle className="h-3 w-3" /> Guaranteed Fitment
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">
                  {product.price}
                </span>
                <button className="cursor-pointer px-3 py-1.5 bg-green-700 hover:bg-green-800 text-white rounded-md text-xs font-semibold transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>{" "}
      </section>
      {/* ========== SECTION 5: BEST SELLING PRODUCTS ========== */}
      <section className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pt-12 md:pt-16 lg:pt-20 border-t border-gray-100">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <Award className="h-6 w-6 text-green-600" />
            Best{" "}
            <span className="text-transparent bg-clip-text bg-green-600">
              {" "}
              Selling Products{" "}
            </span>
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            The most frequently replaced component elements across India
          </p>
        </div>

        {/* MOBILE - 1.5 cards sliding */}
        {/* MOBILE - Native scroll with arrows on touch */}
        <div className="sm:hidden relative">
          <button
            onClick={() => scrollSlider(bestSellerScrollRef, "left")}
            className={`cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 -ml-1 z-20 flex items-center justify-center w-8 h-8 border border-green-200 text-green-700 rounded-full bg-white shadow-lg hover:bg-green-50 transition-all duration-300 ${
              isScrollingBestSeller
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-2"
            }`}
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
          </button>
          <div
            ref={bestSellerScrollRef}
            className="flex overflow-x-auto gap-3 pb-4 px-4 scrollbar-hide snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {bestSellers.map((item) => (
              <div key={item.id} className="snap-start w-[75vw] flex-shrink-0">
                <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-full">
                  <div>
                    <Link to={`/product/${item.id}`} className="relative block">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-40 object-cover rounded-lg mb-3 cursor-pointer hover:opacity-90 transition-opacity"
                      />
                      <span className="absolute top-2 left-2 bg-green-700 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                        Top Seller
                      </span>
                    </Link>
                    <Link to={`/product/${item.id}`}>
                      <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 hover:text-green-600 transition-colors cursor-pointer">
                        {item.name}
                      </h4>
                    </Link>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      {item.price}
                    </span>
                    <button className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors">
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => scrollSlider(bestSellerScrollRef, "right")}
            className={`cursor-pointer absolute right-0 top-1/2 -translate-y-1/2 -mr-1 z-20 flex items-center justify-center w-8 h-8 border border-green-200 text-green-700 rounded-full bg-white shadow-lg hover:bg-green-50 transition-all duration-300 ${
              isScrollingBestSeller
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-2"
            }`}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* DESKTOP - Original grid unchanged */}
        <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <Link to={`/product/${item.id}`} className="relative block">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-40 object-cover rounded-lg mb-3 cursor-pointer hover:opacity-90 transition-opacity"
                  />
                  <span className="absolute top-2 left-2 bg-green-700 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                    Top Seller
                  </span>
                </Link>
                <Link to={`/product/${item.id}`}>
                  <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 hover:text-green-600 transition-colors cursor-pointer">
                    {item.name}
                  </h4>
                </Link>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">
                  {item.price}
                </span>
                <button className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors">
                  <Heart className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========== SECTION 6: SHOP BY BRAND ========== */}
      <section className="bg-green-700 text-white py-14 mt-12 md:mt-16 lg:mt-20 relative overflow-hidden">
        {/* Subtle background decorative pattern grids */}
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:32px_32px]" />

        <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46  relative z-10">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-green-200 bg-white/10 px-3 py-1 rounded-full border border-white/10">
              100% Genuine Direct Supply
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-3 text-white">
              Shop Accredited OEM & OES Brands
            </h2>
            <p className="text-green-100 text-sm mt-2 max-w-xl mx-auto">
              Direct factory-sourced replacements calibrated strictly to
              manufacturer assembly tolerances.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              {
                name: "Bosch India",
                parts: "Braking, Spark Plugs & Electronics",
              },
              { name: "Maruti Genuine", parts: "MSGA Original Core Spares" },
              { name: "Lumax", parts: "Headlamp Units & Lighting Systems" },
              { name: "Minda (UNO)", parts: "Switches, Horns & Alternators" },
              { name: "Gabriel", parts: "Shock Absorbers & Strut Kits" },
              { name: "Purolator", parts: "Premium Air, Fuel & Cabin Filters" },
            ].map((brand, idx) => (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/30 rounded-xl p-5 flex flex-col items-center justify-center text-center hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer shadow-sm"
              >
                <span className="font-bold text-base tracking-wide text-white group-hover:text-green-200 transition-colors">
                  {brand.name}
                </span>
                <div className="w-6 h-0.5 bg-white/20 my-2.5 rounded group-hover:w-10 transition-all duration-300" />
                <span className="text-[11px] text-green-200 font-medium leading-tight">
                  {brand.parts}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== SECTION 7: EXPLORE COMPONENT CATEGORIES ========== */}
      <section className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pt-12 md:pt-16 lg:pt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-6 w-1 bg-green-700 rounded-full" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Explore{" "}
                <span className="text-transparent bg-clip-text bg-green-600">
                  {" "}
                  Premium Categories{" "}
                </span>
              </h2>
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Locate specific systems from precision-engineered internal
              assemblies to exterior trim elements.
            </p>
          </div>
          <Link
            to={`/categories`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-green-600 hover:text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-100 transition-colors group self-start md:self-auto"
          >
            All Categories{" "}
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: "Engine & Mechanical", count: "1,240+ Parts", icon: Cog },
            { title: "Brakes & Suspension", count: "850+ Parts", icon: Gauge },
            { title: "Electricals & Lights", count: "620+ Parts", icon: Zap },
            {
              title: "Filters & Lubricants",
              count: "410+ Parts",
              icon: Filter,
            },
          ].map((cat, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200/80 rounded-xl p-5 hover:border-green-600 hover:shadow-md transition-all duration-300 cursor-pointer group flex items-start gap-4"
            >
              <div className="p-3 rounded-lg bg-gray-50 text-gray-700 group-hover:bg-green-50 group-hover:text-green-700 transition-colors">
                <cat.icon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm group-hover:text-green-700 transition-colors">
                  {cat.title}
                </h4>
                <p className="text-xs text-gray-400 mt-0.5">{cat.count}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========== SECTION 8: PRODUCT LISTING SECTION ========== */}
      {/* ========== SECTION 8: PRODUCT LISTING SECTION ========== */}
      <section className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 py-8 bg-gray-50/50 border-t border-b border-gray-200/60">
        <div className="grid lg:grid-cols-4 gap-8 my-4">
          {/* Enhanced Filter Panel Sidebar */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm h-fit space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className="font-bold text-gray-900 flex items-center gap-2 text-sm">
                <Filter className="h-4 w-4 text-green-600" /> Refine Component
                Results
              </span>
              <button
                className="text-xs text-green-600 font-bold hover:text-green-700 cursor-pointer"
                onClick={() => {
                  setReadyToDispatch(true);
                  setIncludeOutOfStock(false);
                  setOemPart(true);
                  setOesCertified(true);
                }}
              >
                Reset
              </button>
            </div>

            {/* Stock Status - Headless UI Checkbox */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-3">
                Stock Status
              </label>
              <div className="space-y-2">
                <Checkbox
                  checked={readyToDispatch}
                  onChange={setReadyToDispatch}
                  className="group flex items-center gap-3 text-xs text-gray-600 cursor-pointer hover:text-gray-900 transition-colors"
                >
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      readyToDispatch
                        ? "bg-green-600 border-green-600"
                        : "border-gray-300 group-hover:border-green-400"
                    }`}
                  >
                    {readyToDispatch && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>
                  Ready to Dispatch (24h)
                </Checkbox>

                <Checkbox
                  checked={includeOutOfStock}
                  onChange={setIncludeOutOfStock}
                  className="group flex items-center gap-3 text-xs text-gray-600 cursor-pointer hover:text-gray-900 transition-colors"
                >
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      includeOutOfStock
                        ? "bg-green-600 border-green-600"
                        : "border-gray-300 group-hover:border-green-400"
                    }`}
                  >
                    {includeOutOfStock && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>
                  Include Out of Stock
                </Checkbox>
              </div>
            </div>

            {/* Component Grade - Headless UI Checkbox */}
            <div className="pt-4 border-t border-gray-100">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-3">
                Component Grade
              </label>
              <div className="space-y-2">
                <Checkbox
                  checked={oemPart}
                  onChange={setOemPart}
                  className="group flex items-center gap-3 text-xs text-gray-600 cursor-pointer hover:text-gray-900 transition-colors"
                >
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      oemPart
                        ? "bg-green-600 border-green-600"
                        : "border-gray-300 group-hover:border-green-400"
                    }`}
                  >
                    {oemPart && <Check className="h-3 w-3 text-white" />}
                  </div>
                  OEM Original Part
                </Checkbox>

                <Checkbox
                  checked={oesCertified}
                  onChange={setOesCertified}
                  className="group flex items-center gap-3 text-xs text-gray-600 cursor-pointer hover:text-gray-900 transition-colors"
                >
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      oesCertified
                        ? "bg-green-600 border-green-600"
                        : "border-gray-300 group-hover:border-green-400"
                    }`}
                  >
                    {oesCertified && <Check className="h-3 w-3 text-white" />}
                  </div>
                  OES Certified Alternative
                </Checkbox>
              </div>
            </div>
          </div>

          {/* Active Product Grid View */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-white p-4 border border-gray-200 rounded-xl shadow-sm">
              <span className="text-xs font-medium text-gray-500">
                Showing <span className="text-gray-900 font-bold">1-3</span> of
                184 calibrated assemblies for your selection
              </span>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-400 font-medium">Order By:</span>
                <span className="text-gray-900 font-bold bg-gray-50 px-2 py-1 rounded border border-gray-200">
                  Relevance
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  id: 1,
                  name: "Synthetic Micro-Fiber Air Filter",
                  price: "₹580",
                  brand: "Purolator OES",
                  img: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=300&fit=crop",
                },
                {
                  id: 2,
                  name: "High-Friction Front Brake Pad Set",
                  price: "₹1,850",
                  brand: "Bosch Premium",
                  img: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop",
                },
                {
                  id: 3,
                  name: "Laser Iridium Power Spark Core",
                  price: "₹1,200",
                  brand: "NGK Technology",
                  img: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=300&fit=crop",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:border-green-600 flex flex-col justify-between group"
                >
                  <div>
                    <Link
                      to={`/product/${item.id}`}
                      className="overflow-hidden rounded-lg mb-3 bg-gray-50 h-36 border border-gray-100 block"
                    >
                      <img
                        src={item.img}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        alt={item.name}
                      />
                    </Link>
                    <span className="text-[9px] font-extrabold text-green-600 uppercase tracking-wider bg-green-50 px-2 py-0.5 rounded border border-green-100/50">
                      {item.brand}
                    </span>
                    <Link to={`/product/${item.id}`}>
                      <h5 className="font-bold text-gray-900 text-sm line-clamp-2 mt-2 leading-snug hover:text-green-600 transition-colors">
                        {item.name}
                      </h5>
                    </Link>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                    <span className="font-extrabold text-base text-gray-900">
                      {item.price}
                    </span>
                    <Link
                      to={`/product/${item.id}`}
                      className="text-xs font-bold text-green-600 hover:text-green-700 flex items-center gap-0.5"
                    >
                      View Details <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== SECTION 9: PRODUCT DETAIL IN-DEPTH BREAKDOWN ========== */}
     <section className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 py-14">
  <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:p-8 shadow-sm">
    <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
      {/* Gallery Component layout */}
      <div className="lg:col-span-5 space-y-3">
        <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200/60 h-64 shadow-inner relative group">
          <img
            src={galleryImages[selectedGalleryImage]}
            className="w-full h-full object-cover transition-all duration-300"
            alt="Main Component Breakdown"
          />
          <span className="absolute bottom-3 right-3 text-[10px] font-bold text-gray-700 bg-white/90 backdrop-blur-sm px-2 py-1 rounded shadow-sm">
            Interactive Preview
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {galleryImages.map((img, index) => (
            <div
              key={index}
              onClick={() => setSelectedGalleryImage(index)}
              className={`h-14 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                selectedGalleryImage === index
                  ? "border-2 border-green-700 opacity-100"
                  : "border border-gray-200 opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={img}
                className="w-full h-full object-cover"
                alt={`Thumbnail ${index + 1}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Specs / Content Details layout */}
      <div className="lg:col-span-7 space-y-4">
        <div>
          <span className="bg-green-100 text-green-700 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider inline-block border border-green-200/50">
            Component Spotlight
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-2.5 tracking-tight">
            High-Output Engine Ignition Control Assembly Block
          </h3>
        </div>

        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
          Engineered specifically with high-density internal coil windings
          to optimize secondary voltage output profiles. Dramatically
          reduces thermal resistance degradation and eliminates cylinder
          cold-start misfires under highly humid conditions or abrupt
          temperature changes.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60 text-xs text-gray-600">
          <div className="flex items-center justify-between border-b border-gray-200/40 pb-1.5 sm:border-none sm:pb-0">
            <span className="text-gray-400 font-medium">
              Core Alloys:
            </span>
            <span className="font-bold text-gray-900">
              Reinforced Ceramic / Pure Copper
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-gray-200/40 pb-1.5 sm:border-none sm:pb-0">
            <span className="text-gray-400 font-medium">
              Standard Compliance:
            </span>
            <span className="font-bold text-gray-900">
              ISO 9001 / ARAI Calibrated
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 font-medium">
              Factory Warranty:
            </span>
            <span className="font-bold text-gray-900">
              12 Months Product Cover
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 font-medium">
              Compatibility Guard:
            </span>
            <span className="font-bold text-green-700 flex items-center gap-1">
              <CheckCircle className="h-3.5 w-3.5 fill-green-100" /> 100%
              Fit Confirmed
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* ========== SECTION 10: OFFERS & DEALS ========== */}
      <section
        id="current-offers"
        className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pt-12 md:pt-16 lg:pt-20 border-t border-gray-200"
      >
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900  flex items-center gap-2.5 tracking-tight">
              <Percent className="h-5 w-5 text-green-600" /> Verified{" "}
              <span className="text-transparent bg-clip-text bg-green-600">
                Purchase Vouchers{" "}
              </span>
            </h2>
            <p className="text-gray-500 text-sm mt-0.5">
              Redeem these absolute discount tokens during checkout verification
              loops to apply pricing deductions.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {specialOffers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col justify-between p-6 relative hover:border-green-600 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="absolute top-0 left-0 w-1.5 h-full bg-green-700" />
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-xs font-extrabold text-green-700 bg-green-50 px-2.5 py-1 rounded border border-green-100">
                    {offer.discount}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                    Active Voucher
                  </span>
                </div>
                <h4 className="font-bold text-gray-900 text-sm sm:text-base mt-4">
                  {offer.title}
                </h4>
                <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                  {offer.desc}
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between bg-gray-50 -mx-6 -mb-6 px-6 py-4">
                <span className="text-xs font-semibold text-gray-500">
                  Click Code to Copy:
                </span>
                <span className="font-mono bg-white text-gray-800 font-bold px-3 py-1.5 rounded-lg text-xs tracking-wider border border-gray-300 shadow-sm cursor-pointer hover:bg-gray-50 hover:border-gray-400 active:scale-95 transition-all">
                  {offer.code}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========== SECTION 11: RECENTLY VIEWED ========== */}
      <section className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pt-12 md:pt-16 lg:pt-20 ">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="h-4 w-4 text-gray-400" />
          <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Based{" "}
            <span className="text-transparent bg-clip-text bg-green-600">
              {" "}
              On Your History{" "}
            </span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {recentlyViewed.map((item) => (
    <Link
      key={item.id}
      to={`/categories`}
      className="bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-3 shadow-sm hover:shadow-md transition-all duration-200 group cursor-pointer hover:border-green-600"
    >
      <div className="w-14 h-14 rounded-lg bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="min-w-0 flex-1">
        <h5 className="text-xs font-bold text-gray-800 line-clamp-1 group-hover:text-green-700 transition-colors">
          {item.name}
        </h5>
        <p className="text-xs text-gray-900 font-extrabold mt-1">
          {item.price}
        </p>
      </div>
      <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all" />
    </Link>
  ))}
</div>
      </section>

      {/* ========== SECTION 12: FREQUENTLY ANSWERED QUERIES (FAQ) ========== */}
      <section className="max-w-4xl mx-auto px-4 py-14 md:py-18 lg:py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Frequently{" "}
            <span className="text-transparent bg-clip-text bg-green-600">
              {" "}
              Answered Queries (FAQs){" "}
            </span>
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Essential information regarding shipping schedules, compatibility
            guarantees, and claims validation.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = faqOpen === idx;
            return (
              <div
                key={idx}
                className={`bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-200 shadow-sm ${isOpen ? "ring-1 ring-green-600 border-transparent shadow-md" : "hover:border-gray-300"}`}
              >
                <button
                  onClick={() => setFaqOpen(isOpen ? null : idx)}
                  className="w-full px-5 py-4 text-left font-bold text-sm sm:text-base text-gray-900 flex items-center justify-between gap-4 transition-colors outline-none"
                >
                  <span className={isOpen ? "text-green-700" : "text-gray-900"}>
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-green-700" : ""}`}
                  />
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-40 border-t border-gray-100 bg-gray-50/50" : "max-h-0"}`}
                >
                  <div className="px-5 py-4 text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {faq.a}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default SpareParts;
