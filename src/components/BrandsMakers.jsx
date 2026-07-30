import { useState, useEffect, useRef } from "react";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import apiHelper from "../utils/apiHelper";

const BrandsMakers = () => {
  const navigate = useNavigate();
  const [showAllMobile, setShowAllMobile] = useState(false);
  const [showAllDesktop, setShowAllDesktop] = useState(false);
  const [tractorMakers, setTractorMakers] = useState([]);
  const [loading, setLoading] = useState(true);

  const DESKTOP_INITIAL_LIMIT = 12;

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const response = await apiHelper.get("/brand");
        
        let brandsData = [];
        if (response && response.data && Array.isArray(response.data)) {
          brandsData = response.data;
        } else if (Array.isArray(response)) {
          brandsData = response;
        }

        const mappedBrands = brandsData
          .filter(brand => brand.status === "ACTIVE")
          .map((item) => ({
            name: item.brandName || item.name || "Unknown",
            logo: apiHelper.image(item.image),
            slug: (item.brandName || item.name || "unknown")
              .toLowerCase()
              .replace(/\s+/g, '-'),
          }));

        setTractorMakers(mappedBrands);
      } catch (error) {
        console.error("Failed to fetch brands:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const handleTractorMakerClick = (brandName) => {
    navigate(`/tractors?brand=${encodeURIComponent(brandName)}`);
  };

  const handleViewAllTractors = () => {
    navigate("/tractors");
  };

  const scrollRef = useRef(null);
  const [scrollPos, setScrollPos] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const newPos = scrollPos + 1;
        if (newPos >= scrollRef.current.scrollWidth / 2) {
          scrollRef.current.scrollLeft = 0;
          setScrollPos(0);
        } else {
          scrollRef.current.scrollLeft = newPos;
          setScrollPos(newPos);
        }
      }
    }, 30);
    return () => clearInterval(interval);
  }, [scrollPos]);

  const getVisibleBrands = () => {
    if (window.innerWidth < 640) {
      return showAllMobile ? tractorMakers : tractorMakers.slice(0, 8);
    } else {
      return showAllDesktop ? tractorMakers : tractorMakers.slice(0, DESKTOP_INITIAL_LIMIT);
    }
  };

  const visibleBrands = getVisibleBrands();

  return (
    <section className="bg-gray-50 w-full">
      <div className="px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pt-12 md:pt-16 lg:pt-20">
        <div className="w-full max-w-[1440px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto">
          
          {/* Header with title/desc on left, button on right */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8 md:mb-12">
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
                Popular{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-700">
                  Tractor Makers
                </span>
              </h2>
              <p className="text-gray-600 text-base md:text-lg max-w-2xl">
                Find genuine parts for all major tractor brands
              </p>
            </div>

            {/* View All Button - hidden on mobile, shown on desktop */}
            <div className="hidden sm:flex sm:flex-shrink-0">
              <button
                onClick={handleViewAllTractors}
                className="inline-flex cursor-pointer items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-bold px-6 py-3.5 rounded-xl transition-all hover:shadow-lg group whitespace-nowrap"
              >
                <span>View All Tractor Brands</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Grid Layout Container */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 xl:gap-5">
            {visibleBrands.map((maker, i) => (
              <div
                key={i}
                onClick={() => handleTractorMakerClick(maker.name)}
                className="bg-white border-2 border-gray-100 rounded-2xl p-5 text-center hover:border-green-600 hover:shadow-xl hover:shadow-green-900/5 transition-all duration-300 cursor-pointer group hover:-translate-y-1"
              >
                <div className="h-16 flex items-center justify-center mb-3">
                  <img
                    src={maker.logo}
                    alt={`${maker.name} logo`}
                    className="max-h-12 max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${maker.name}&background=dc2626&color=fff&size=80&bold=true`;
                    }}
                  />
                </div>
                <span className="text-sm font-bold text-gray-700 group-hover:text-green-700 transition-colors">
                  {maker.name}
                </span>
              </div>
            ))}
          </div>

          {/* View More Link - Simple right-aligned link */}
          {!showAllDesktop && tractorMakers.length > DESKTOP_INITIAL_LIMIT && (
            <div className="hidden sm:flex justify-end mt-6">
              <button
                onClick={() => setShowAllDesktop(true)}
                className="inline-flex cursor-pointer items-center gap-2 text-green-700 hover:text-green-800 font-semibold text-base transition-all group"
              >
                <span>View More</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {/* Show Less Link - Right aligned */}
          {showAllDesktop && tractorMakers.length > DESKTOP_INITIAL_LIMIT && (
            <div className="hidden sm:flex justify-end mt-6">
              <button
                onClick={() => setShowAllDesktop(false)}
                className="inline-flex cursor-pointer items-center gap-2 text-green-700 hover:text-green-800 font-semibold text-base transition-all group"
              >
                <span>Show Less</span>
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Mobile: Show All / Show Less button */}
          <div className="flex sm:hidden justify-center mt-6">
            <button
              onClick={() => setShowAllMobile(!showAllMobile)}
              className="inline-flex cursor-pointer items-center gap-2 bg-white border-2 border-green-200 hover:bg-green-50 text-green-700 font-bold px-6 py-3 rounded-xl transition-all"
            >
              <span>{showAllMobile ? "Show Less Brands" : `Show All ${tractorMakers.length} Brands`}</span>
              {showAllMobile ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BrandsMakers;