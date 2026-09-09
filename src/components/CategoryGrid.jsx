import { useState, useEffect, useRef, useCallback } from "react";
import {
  Wrench,
  Cog,
  Gauge,
  Tractor,
  Disc,
  ArrowRight,
  Zap,
  Filter,
  Fuel,
  Thermometer,
  Wind,
  Car,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import apiHelper from "../utils/apiHelper";

// Keyword -> icon mapping
const ICON_RULES = [
  { keywords: ["engine"], icon: Wrench },
  { keywords: ["transmission", "gear"], icon: Cog },
  { keywords: ["brake"], icon: Disc },
  { keywords: ["electric"], icon: Zap },
  { keywords: ["hydraulic"], icon: Gauge },
  { keywords: ["body"], icon: Tractor },
  { keywords: ["filter"], icon: Filter },
  { keywords: ["fuel"], icon: Fuel },
  { keywords: ["cooling", "radiator"], icon: Thermometer },
  { keywords: ["exhaust"], icon: Wind },
  { keywords: ["tyre", "wheel"], icon: Car },
];

const getIconForCategory = (name = "") => {
  const lower = name.toLowerCase();
  const match = ICON_RULES.find((rule) =>
    rule.keywords.some((keyword) => lower.includes(keyword))
  );
  return match ? match.icon : Cog;
};

// Color palette with green theme
const CARD_COLORS = [
  { bg: "from-green-50 to-emerald-50", border: "border-green-200", icon: "text-green-600", hoverBg: "hover:border-green-400" },
  { bg: "from-emerald-50 to-teal-50", border: "border-emerald-200", icon: "text-emerald-600", hoverBg: "hover:border-emerald-400" },
  { bg: "from-green-50 to-lime-50", border: "border-green-200", icon: "text-green-600", hoverBg: "hover:border-green-400" },
  { bg: "from-emerald-50 to-green-50", border: "border-emerald-200", icon: "text-emerald-600", hoverBg: "hover:border-emerald-400" },
  { bg: "from-teal-50 to-emerald-50", border: "border-teal-200", icon: "text-teal-600", hoverBg: "hover:border-teal-400" },
  { bg: "from-green-50 to-emerald-50", border: "border-green-200", icon: "text-green-600", hoverBg: "hover:border-green-400" },
  { bg: "from-emerald-50 to-green-50", border: "border-emerald-200", icon: "text-emerald-600", hoverBg: "hover:border-emerald-400" },
  { bg: "from-green-50 to-lime-50", border: "border-green-200", icon: "text-green-600", hoverBg: "hover:border-green-400" },
];

const CategoryGrid = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brokenImageIds, setBrokenImageIds] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const marqueeRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await apiHelper.get("/web/VendorCategory", {
          parentId: "null",
        });

        let categoriesData = [];
        if (response && response.data && Array.isArray(response.data)) {
          categoriesData = response.data;
        } else if (Array.isArray(response)) {
          categoriesData = response;
        }

        const mappedData = categoriesData.map((item, index) => ({
          id: item.id,
          name: item.categoryName,
          image: apiHelper.getImageUrl(item.image),
          count: item.productCount ? `${item.productCount}+ Products` : null,
          slug: (item.categoryName || "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, ""),
          icon: getIconForCategory(item.categoryName),
          color: CARD_COLORS[index % CARD_COLORS.length],
        }));

        setCategories(mappedData);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Auto-slide for mobile
  useEffect(() => {
    if (!isMobile || categories.length === 0 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % categories.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isMobile, categories.length, isPaused]);

  // Handle dot navigation
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Handle marquee animation with requestAnimationFrame
  useEffect(() => {
    if (isMobile || categories.length === 0) return;

    const marqueeElement = marqueeRef.current;
    if (!marqueeElement) return;

    let startTime = null;
    let animationId = null;
    let totalWidth = 0;

    // Calculate widths
    const calculateWidths = () => {
      const firstChild = marqueeElement.querySelector('.category-card');
      if (!firstChild) return;
      const cardWidth = firstChild.offsetWidth + 24;
      totalWidth = cardWidth * categories.length;
    };

    calculateWidths();

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;
      const speed = 50;
      const offset = (elapsed * speed) % (totalWidth || 1);

      if (!isPaused && !isHovered) {
        marqueeElement.style.transform = `translateX(-${offset}px)`;
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    // Resize observer for dynamic updates
    const resizeObserver = new ResizeObserver(() => {
      calculateWidths();
    });
    resizeObserver.observe(marqueeElement.parentElement);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, [categories, isMobile, isPaused, isHovered]);

  // Handle hover for desktop
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  // Handle touch for mobile
  const handleTouchStart = useCallback(() => {
    setIsPaused(true);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setTimeout(() => setIsPaused(false), 3000);
  }, []);

  return (
    <section className="w-full bg-linear-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
      <div className="px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pt-8 md:pt-12 lg:pt-16 pb-6 md:pb-8">
        <div className="w-full max-w-360 xl:max-w-400 2xl:max-w-430 mx-auto">
          {/* Header */}
          <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 md:gap-6 mb-6 md:mb-10 lg:mb-14">
            <div className="flex-1">
              <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                <span className="inline-flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-xl bg-linear-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30">
                  <Sparkles className="h-4 w-4 md:h-5 md:w-5" />
                </span>
                <span className="text-xs md:text-sm font-semibold uppercase tracking-widest text-green-600">
                  Categories
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                Shop By{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 text-transparent bg-clip-text bg-linear-to-r from-green-600 to-emerald-500">
                    Category
                  </span>
                  <svg
                    className="absolute -bottom-1 left-0 w-full h-2 md:h-3 text-green-300/40"
                    viewBox="0 0 100 10"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 5 Q25 0 50 5 T100 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </span>
              </h2>
              <p className="text-sm md:text-base lg:text-lg text-gray-600 max-w-2xl mt-2 md:mt-3 leading-relaxed">
                Explore premium tractor spare parts & agricultural equipment 
                categories designed for every farming need
              </p>
            </div>

            <div className="sm:shrink-0">
              <Link to="/spare-parts">
                <button className="inline-flex cursor-pointer items-center gap-2 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-4 md:px-6 lg:px-7 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl transition-all shadow-md hover:shadow-xl group whitespace-nowrap text-sm md:text-base">
                  <span className="flex items-center gap-2">
                    View All
                    <ArrowRight className="h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </Link>
            </div>
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
              {Array.from({ length: isMobile ? 4 : 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-48 md:h-56 lg:h-60 rounded-xl md:rounded-2xl bg-white border-2 border-green-200 shadow-sm overflow-hidden relative"
                >
                  <div className="h-32 md:h-36 lg:h-40 w-full bg-gray-200 relative overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  </div>
                  <div className="p-3 md:p-4 space-y-2">
                    <div className="h-3 md:h-4 w-2/3 bg-gray-200 rounded" />
                    <div className="h-2 md:h-3 w-1/3 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && categories.length === 0 && (
            <div className="text-center text-gray-500 text-sm py-10 md:py-16">
              <div className="text-4xl md:text-6xl mb-3 md:mb-4">🌾</div>
              <p className="text-base md:text-lg font-medium">No categories available right now.</p>
            </div>
          )}

          {/* Category Display */}
          {!loading && categories.length > 0 && (
            <div className="relative">
              {/* Desktop Marquee */}
              {!isMobile && (
                <>
                  {/* Gradient fade edges */}
                  <div className="absolute left-0 top-0 bottom-0 w-12 md:w-16 lg:w-24 bg-linear-to-r from-gray-50 via-gray-50/80 to-transparent z-10 pointer-events-none" />
                  <div className="absolute right-0 top-0 bottom-0 w-12 md:w-16 lg:w-24 bg-linear-to-l from-gray-50 via-gray-50/80 to-transparent z-10 pointer-events-none" />

                  <div 
                    className="overflow-hidden relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div
                      ref={marqueeRef}
                      className="flex gap-4 md:gap-5 lg:gap-6 py-2 md:py-3 lg:py-4"
                      style={{ width: "max-content", willChange: "transform" }}
                    >
                      {[...categories, ...categories].map((cat, index) => (
                        <div
                          key={`${cat.id}-${index}`}
                          className="category-card w-40 sm:w-47.5 md:w-52.5 lg:w-60 shrink-0"
                        >
                          <Link
                            to={`/category/${cat.id}`}
                            className={`group relative flex flex-col overflow-hidden rounded-xl md:rounded-2xl bg-white border-2 border-green-50 ${cat.color.hoverBg} shadow-md hover:shadow-2xl hover:-translate-y-1 md:hover:-translate-y-2 transition-all duration-300 h-full`}
                            style={{
                              background: `linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to))`,
                            }}
                          >
                            {/* Image section */}
                            <div className="relative h-28 sm:h-32 md:h-36 lg:h-40 w-full overflow-hidden bg-gray-100">
                              {cat.image && !brokenImageIds[cat.id] ? (
                                <>
                                  <img
                                    src={cat.image}
                                    alt={cat.name}
                                    loading="lazy"
                                    onError={() =>
                                      setBrokenImageIds((prev) => ({
                                        ...prev,
                                        [cat.id]: true,
                                      }))
                                    }
                                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                                  />
                                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
                                </>
                              ) : (
                                <div className={`flex h-full w-full items-center justify-center bg-linear-to-br ${cat.color.bg}`}>
                                  <cat.icon className={`h-10 w-10 md:h-12 md:w-14 ${cat.color.icon} opacity-60`} />
                                </div>
                              )}

                              {/* Icon badge with green border */}
                              <div className={`absolute -bottom-1 left-3 md:left-4 h-9 w-9 md:h-10 md:w-11 rounded-lg md:rounded-xl bg-white shadow-lg flex items-center justify-center ring-2 ring-green-100 group-hover:ring-green-400 transition-all duration-300`}>
                                <cat.icon className={`h-4 w-4 md:h-5 md:w-5 ${cat.color.icon}`} />
                              </div>

                              {/* Count badge */}
                              {cat.count && (
                                <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-white/95 backdrop-blur-sm text-gray-700 text-[10px] md:text-xs font-semibold px-2 py-1 md:px-3 md:py-1.5 rounded-full shadow-md border border-green-200">
                                  {cat.count}
                                </div>
                              )}
                            </div>

                            {/* Text content */}
                            <div className="flex flex-col flex-1 justify-between pt-2 md:pt-3 pb-1.5 md:pb-2 px-3 md:px-4">
                              <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-900 group-hover:text-green-600  leading-tight line-clamp-2">
                                {cat.name}
                              </h3>

                              <div className="flex items-center justify-between mt-1.5 md:mt-2 pt-1.5 md:pt-2 border-t border-green-100">
                                <span className="text-[10px] md:text-xs text-green-600 font-medium">Explore</span>
                                <ArrowRight className="h-3 w-3 md:h-4 md:w-4 text-green-600 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>

                            {/* Green accent line on hover */}
                            {/* <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-emerald-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" /> */}
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Mobile Carousel */}
              {isMobile && (
                <div 
                  className="relative overflow-hidden w-100"
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  <div 
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ 
                      transform: `translateX(-${currentIndex * (100 / 3)}%)`,
                      willChange: "transform"
                    }}
                  >
                    {categories.map((cat, index) => (
                      <div
                        key={cat.id}
                        className="w-1/3 shrink-0 px-1.5"
                      >
                        <Link
                          to={`/category/${cat.id}`}
                          className={`group relative flex flex-col overflow-hidden rounded-xl bg-white border-2 border-green-50 shadow-md hover:shadow-lg transition-all duration-300 h-full `}
                          style={{
                            background: `linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to))`,
                          }}
                        >
                          {/* Image section */}
                          <div className="relative h-28 w-full overflow-hidden bg-gray-100">
                            {cat.image && !brokenImageIds[cat.id] ? (
                              <>
                                <img
                                  src={cat.image}
                                  alt={cat.name}
                                  loading="lazy"
                                  onError={() =>
                                    setBrokenImageIds((prev) => ({
                                      ...prev,
                                      [cat.id]: true,
                                    }))
                                  }
                                  className="h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
                              </>
                            ) : (
                              <div className={`flex h-full w-full items-center justify-center bg-linear-to-br ${cat.color.bg}`}>
                                <cat.icon className={`h-8 w-8 ${cat.color.icon} opacity-60`} />
                              </div>
                            )}

                            {/* Icon badge with green ring */}
                            <div className={`absolute -bottom-1 left-2 h-8 w-8 rounded-lg bg-white shadow-lg flex items-center justify-center ring-2 ring-green-200`}>
                              <cat.icon className={`h-3.5 w-3.5 ${cat.color.icon}`} />
                            </div>

                            {/* Count badge */}
                            {cat.count && (
                              <div className="absolute top-2  bg-white/95 backdrop-blur-sm text-gray-700 text-[9px] font-semibold px-2 py-0.5 rounded-full shadow-md border border-green-200">
                                {cat.count}
                              </div>
                            )}
                          </div>

                          {/* Text content */}
                          <div className="flex flex-col flex-1 justify-between pt-1.5 pb-1.5 px-2.5">
                            <h3 className="text-[11px] font-bold text-gray-900 leading-tight line-clamp-2">
                              {cat.name}
                            </h3>

                            <div className="flex items-center justify-between mt-1 pt-1 border-t border-green-100">
                              <span className="text-[9px] text-green-600 font-medium">Explore</span>
                              <ArrowRight className="h-2.5 w-2.5 text-green-600" />
                            </div>
                          </div>

                          {/* Green accent line */}
                          {/* <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" /> */}
                        </Link>
                      </div>
                    ))}
                  </div>

                  {/* Dot indicators - Green theme */}
                  <div className="flex justify-center gap-1.5 mt-3">
                    {categories.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          index === currentIndex 
                            ? 'w-4 bg-linear-to-r from-green-500 to-emerald-500' 
                            : 'w-1.5 bg-green-200'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </section>
  );
};

export default CategoryGrid;