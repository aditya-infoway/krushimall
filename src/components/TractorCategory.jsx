import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Tractor, Sprout, Leaf, Mountain, Truck, ArrowRight, Package, ChevronLeft, ChevronRight } from "lucide-react";
import apiHelper from "../utils/apiHelper";

const TractorCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await apiHelper.get("/web/categories");
        
        let categoriesData = [];
        if (response && response.data && Array.isArray(response.data)) {
          categoriesData = response.data;
        } else if (Array.isArray(response)) {
          categoriesData = response;
        }

        const mappedCategories = categoriesData
          .filter(cat => cat.status === "ACTIVE")
          .map((item) => ({
            id: item.id || item._id,
            name: item.categoryName || item.name || "Unknown",
            slug: (item.categoryName || item.name || "unknown")
              .toLowerCase()
              .replace(/\s+/g, '-'),
            description: item.description || "",
            icon: getCategoryIcon(item.categoryName || item.name),
            image: apiHelper.image(item.image),
            count: item.tractorCount || 0,
          }));

        setCategories(mappedCategories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Show arrows when scrolling on mobile

useEffect(() => {
  const slider = carouselRef.current;
  if (!slider) return;

  const showArrows = () => {
    setIsScrolling(true);
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 1500);
  };

  // Add both scroll and touch events
  slider.addEventListener("scroll", showArrows, { passive: true });
  slider.addEventListener("touchstart", showArrows, { passive: true });
  slider.addEventListener("touchmove", showArrows, { passive: true });

  return () => {
    slider.removeEventListener("scroll", showArrows);
    slider.removeEventListener("touchstart", showArrows);
    slider.removeEventListener("touchmove", showArrows);
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
  };
}, []);

  const getCategoryIcon = (name) => {
    const lowerName = name?.toLowerCase() || "";
    if (lowerName.includes("small") || lowerName.includes("compact")) return Sprout;
    if (lowerName.includes("medium") || lowerName.includes("mid")) return Leaf;
    if (lowerName.includes("large") || lowerName.includes("big") || lowerName.includes("heavy")) return Mountain;
    if (lowerName.includes("utility") || lowerName.includes("general")) return Tractor;
    if (lowerName.includes("premium") || lowerName.includes("high")) return Truck;
    return Tractor;
  };

  const scrollSlider = (direction) => {
    if (!carouselRef.current) return;
    const { scrollLeft, clientWidth } = carouselRef.current;
    carouselRef.current.scrollTo({
      left: direction === "left" 
        ? scrollLeft - clientWidth * 0.8 
        : scrollLeft + clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <section className="bg-gradient-to-b from-gray-50 to-white w-full">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white w-full">
      {/* Header */}
      <div className="mb-10 md:mb-14">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
              Explore{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-700">
                Tractor Categories
              </span>
            </h2>
            <p className="text-gray-600 text-base md:text-lg max-w-2xl">
              Choose the right category for your farming requirements
            </p>
          </div>

          <div className="flex-shrink-0">
            {/* Desktop: View All Button */}
            <Link
              to="/tractors"
              className="hidden sm:inline-flex items-center gap-2  text-green-600 hover:text-green-700 font-bold px-6 py-3.5 rounded-xl transition-all  group whitespace-nowrap"
            >
              <span>View All Categories</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            {/* Mobile: Arrow Icon Only - NO TEXT */}
            <Link
              to="/tractors"
              className="sm:hidden inline-flex items-center justify-center w-10 h-10 bg-green-700 hover:bg-green-800 text-white rounded-xl transition-all hover:shadow-lg hover:shadow-green-700/30 group"
              aria-label="View all categories"
            >
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Carousel Zone */}
      <div className="relative group w-full">
        {/* Left Arrow - Mobile & Desktop */}
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

        {/* Category Rail */}
        <div
          ref={carouselRef}
          className="flex overflow-x-auto gap-4 sm:gap-6 pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth px-1"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.id}
                to={`/tractors?category=${encodeURIComponent(category.slug)}`}
                className="snap-start w-[140px] sm:w-[180px] md:w-[200px] flex-shrink-0"
              >
                <div className="relative bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-green-600 hover:shadow-xl hover:shadow-green-900/5 transition-all duration-300 cursor-pointer group">
                  
                  <div className="w-full h-0 pb-[80%] relative bg-gradient-to-br from-green-50 to-green-100/30 overflow-hidden">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          e.target.style.display = "none";
                          const parent = e.target.parentElement;
                          const icon = document.createElement('div');
                          icon.className = 'absolute inset-0 flex items-center justify-center';
                          icon.innerHTML = `<svg class="w-10 h-10 sm:w-12 sm:h-12 text-green-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3L3 8v8l9 5 9-5V8l-9-5z"/><path d="M12 12v9"/><path d="M3 8l9 5 9-5"/></svg>`;
                          parent.appendChild(icon);
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-green-700 transition-transform duration-300 group-hover:scale-110" />
                      </div>
                    )}
                  </div>

                  <div className="px-1.5 sm:px-2 py-1.5 sm:py-2 text-center bg-white">
                    <h3 className="text-[9px] sm:text-xs font-bold text-gray-800 group-hover:text-green-700 transition-colors leading-tight truncate">
                      {category.name}
                    </h3>
                    {category.count > 0 && (
                      <span className="text-[7px] sm:text-[10px] text-gray-500 block mt-0.5">
                        {category.count} tractors
                      </span>
                    )}
                  </div>

                  <div className="absolute top-1 right-1 sm:top-2 sm:right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-0.5 sm:p-1 shadow-md z-10">
                    <ArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-green-700" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Right Arrow - Mobile & Desktop */}
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

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default TractorCategory;