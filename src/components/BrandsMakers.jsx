import { useState, useEffect, useRef } from "react";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import sonalika from "../assets/sonalika.png";
import eicher from "../assets/eicher.png";
import escorts from "../assets/escorts.png";
import force from "../assets/force.png";
import indo from "../assets/indo.png";
import kubota from "../assets/kubota.png";
import massey from "../assets/massey.png";
import newinfo from "../assets/new.png";
import swalogo from "../assets/swarajlogo.png";
import tafe from "../assets/tafe.png"

const BrandsMakers = () => {
  const navigate = useNavigate();
  const [showAllMobile, setShowAllMobile] = useState(false);

  const partsBrands = [
    "Bosch",
    "Brembo",
    "Denso",
    "Valeo",
    "Mann Filter",
    "NGK",
    "KYB",
    "Monroe",
    "Continental",
    "Hella",
    "SKF",
    "Gates",
    "Sachs",
    "Febi",
    "TRW",
    "Delphi",
  ];

  const tractorMakers = [
    {
      name: "Mahindra",
      logo: "https://cdn.simpleicons.org/mahindra/FF0000",
      slug: "mahindra",
    },
    {
      name: "Swaraj",
      logo: swalogo,
      slug: "swaraj",
    },
    {
      name: "John Deere",
      logo: "https://cdn.simpleicons.org/johndeere/367C2B",
      slug: "john-deere",
    },
    {
      name: "TAFE",
      logo: tafe,
      slug: "tafe",
    },
    {
      name: "New Holland",
      logo: newinfo,
      slug: "new-holland",
    },
    {
      name: "Sonalika",
      logo: sonalika,
      slug: "sonalika",
    },
    {
      name: "Escorts",
      logo: escorts,
      slug: "escorts",
    },
    {
      name: "Eicher",
      logo: eicher,
      slug: "eicher",
    },
    {
      name: "Kubota",
      logo: kubota,
      slug: "kubota",
    },
    {
      name: "Massey Ferguson",
      logo: massey,
      slug: "massey-ferguson",
    },
    {
      name: "Force Motors",
      logo: force,
      slug: "force-motors",
    },
    {
      name: "Indo Farm",
      logo: indo,
      slug: "indo-farm",
    },
  ];

  // Handle tractor maker click - navigate to tractors page with brand filter
  const handleTractorMakerClick = (brandName) => {
    navigate(`/tractors?brand=${encodeURIComponent(brandName)}`);
  };

  // Handle View All button - navigate to tractors page
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

  return (
    <section className="bg-gray-50 w-full">
      {/* STANDARDIZED: Same spacing pattern as FeaturesBar for consistency */}
      <div className="px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pt-12 md:pt-16 lg:pt-20">
        {/* Inner container with bottom padding to match top spacing */}
        <div className="w-full max-w-[1440px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto ">
          
          {/* Header with title/desc on left, button on right */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8 md:mb-12">
            {/* Left side: Title and Description */}
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

            {/* Right side: View All Button - hidden on mobile, shown on desktop */}
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
            {tractorMakers.map((maker, i) => (
              <div
                key={i}
                onClick={() => handleTractorMakerClick(maker.name)}
                className={`bg-white border-2 border-gray-100 rounded-2xl p-5 text-center hover:border-green-600 hover:shadow-xl hover:shadow-green-900/5 transition-all duration-300 cursor-pointer group hover:-translate-y-1 ${
                  !showAllMobile && i >= 8 ? "hidden sm:block" : ""
                }`}
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

          {/* Show All / Show Less button - Only visible on mobile */}
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