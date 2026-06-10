import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Tractor,
  Heart,
  MapPin,
  Calendar,
  Fuel,
  Gauge,
  ArrowRight,
  Star,
  Sparkles,
  BadgeCheck,
  TrendingUp,
  Clock,
  Eye,
  ChevronLeft,
  ChevronRight,
  Zap,
  Award,
  Shield,
  ShoppingCart,
} from "lucide-react";
import mah from "../assets/mahindra.png";
import john from "../assets/johndeere.png";
import swara from "../assets/swaraj.png";
import logo from "../assets/johnlogo.png";

const TractorShowcase = () => {
  const [newIndex, setNewIndex] = useState(0);
  const [usedIndex, setUsedIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(4);
  const [wishlist, setWishlist] = useState({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef(null);
  const newTimerRef = useRef(null);
  const usedTimerRef = useRef(null);

  const allNewTractors = [
    {
      id: 1,
      name: "Mahindra 575 DI",
      brand: "Mahindra",
      price: "₹6,85,000",
      hp: "45 HP",
      fuel: "Diesel",
      year: "2024",
      location: "Delhi",
      image: "/mah.png",
      rating: 4.8,
      badge: "Best Seller",
      verified: true,
      discount: "5% OFF",
    },
    {
      id: 2,
      name: "Swaraj 744 FE",
      brand: "Swaraj",
      price: "₹7,25,000",
      hp: "48 HP",
      fuel: "Diesel",
      year: "2024",
      location: "Pune",
      image: "/mah.png",
      rating: 4.7,
      badge: "Popular",
      verified: true,
      discount: "8% OFF",
    },
    {
      id: 3,
      name: "John Deere 5310",
      brand: "John Deere",
      price: "₹8,95,000",
      hp: "55 HP",
      fuel: "Diesel",
      year: "2024",
      location: "Jaipur",
      image: "/mah.png",
      rating: 4.9,
      badge: "Premium",
      verified: true,
      discount: "3% OFF",
    },
    {
      id: 4,
      name: "TAFE 5900 DI",
      brand: "TAFE",
      price: "₹5,95,000",
      hp: "42 HP",
      fuel: "Diesel",
      year: "2024",
      location: "Chennai",
      image: "/mah.png",
      rating: 4.6,
      badge: "Value Buy",
      verified: true,
      discount: "10% OFF",
    },
    {
      id: 5,
      name: "New Holland 3630 TX",
      brand: "New Holland",
      price: "₹7,75,000",
      hp: "50 HP",
      fuel: "Diesel",
      year: "2024",
      location: "Lucknow",
      image: "/mah.png",
      rating: 4.8,
      badge: "Staff Pick",
      verified: true,
      discount: "6% OFF",
    },
    {
      id: 6,
      name: "Sonalika DI 750 III",
      brand: "Sonalika",
      price: "₹6,35,000",
      hp: "50 HP",
      fuel: "Diesel",
      year: "2024",
      location: "Bhopal",
      image: "/mah.png",
      rating: 4.5,
      badge: "Budget Friendly",
      verified: true,
      discount: "12% OFF",
    },
    {
      id: 7,
      name: "Mahindra Arjun 605",
      brand: "Mahindra",
      price: "₹9,25,000",
      hp: "60 HP",
      fuel: "Diesel",
      year: "2024",
      location: "Nagpur",
      image: "/mah.png",
      rating: 4.9,
      badge: "Premium",
      verified: true,
      discount: "4% OFF",
    },
    {
      id: 8,
      name: "Escorts Powertrac 439",
      brand: "Escorts",
      price: "₹5,45,000",
      hp: "41 HP",
      fuel: "Diesel",
      year: "2024",
      location: "Faridabad",
      image: "/mah.png",
      rating: 4.4,
      badge: "Value Pick",
      verified: true,
      discount: "7% OFF",
    },
  ];

  const allUsedTractors = [
    {
      id: 101,
      name: "Mahindra 575 DI",
      brand: "Mahindra",
      price: "₹4,50,000",
      originalPrice: "₹6,85,000",
      hp: "45 HP",
      year: "2021",
      hours: "2,450 hrs",
      location: "Meerut, UP",
      image: "/mah.png",
      rating: 4.3,
      condition: "Excellent",
      verified: true,
      sellerType: "Individual",
      warranty: "6 Months",
    },
    {
      id: 102,
      name: "Swaraj 855 FE",
      brand: "Swaraj",
      price: "₹5,20,000",
      originalPrice: "₹8,25,000",
      hp: "52 HP",
      year: "2020",
      hours: "3,120 hrs",
      location: "Karnal, HR",
      image: "/mah.png",
      rating: 4.1,
      condition: "Good",
      verified: true,
      sellerType: "Dealer",
      warranty: "3 Months",
    },
    {
      id: 103,
      name: "John Deere 5050D",
      brand: "John Deere",
      price: "₹6,80,000",
      originalPrice: "₹9,95,000",
      hp: "50 HP",
      year: "2022",
      hours: "1,850 hrs",
      location: "Ludhiana, PB",
      image: "/mah.png",
      rating: 4.5,
      condition: "Like New",
      verified: true,
      sellerType: "Dealer",
      warranty: "1 Year",
    },
    {
      id: 104,
      name: "Eicher 380",
      brand: "Eicher",
      price: "₹3,20,000",
      originalPrice: "₹5,25,000",
      hp: "40 HP",
      year: "2019",
      hours: "4,200 hrs",
      location: "Indore, MP",
      image: "/mah.png",
      rating: 4.0,
      condition: "Good",
      verified: false,
      sellerType: "Individual",
      warranty: "No",
    },
    {
      id: 105,
      name: "TAFE MF 245",
      brand: "TAFE",
      price: "₹3,80,000",
      originalPrice: "₹5,95,000",
      hp: "42 HP",
      year: "2020",
      hours: "3,800 hrs",
      location: "Coimbatore, TN",
      image: "/mah.png",
      rating: 4.2,
      condition: "Good",
      verified: true,
      sellerType: "Dealer",
      warranty: "3 Months",
    },
    {
      id: 106,
      name: "New Holland 3630",
      brand: "New Holland",
      price: "₹5,50,000",
      originalPrice: "₹7,75,000",
      hp: "50 HP",
      year: "2021",
      hours: "2,100 hrs",
      location: "Varanasi, UP",
      image: "/mah.png",
      rating: 4.4,
      condition: "Excellent",
      verified: true,
      sellerType: "Individual",
      warranty: "6 Months",
    },
    {
      id: 107,
      name: "Sonalika 745 DI",
      brand: "Sonalika",
      price: "₹4,20,000",
      originalPrice: "₹6,35,000",
      hp: "50 HP",
      year: "2021",
      hours: "2,900 hrs",
      location: "Patna, BR",
      image: "/mah.png",
      rating: 4.1,
      condition: "Good",
      verified: true,
      sellerType: "Dealer",
      warranty: "3 Months",
    },
    {
      id: 108,
      name: "Escorts Powertrac 439",
      brand: "Escorts",
      price: "₹3,60,000",
      originalPrice: "₹5,45,000",
      hp: "41 HP",
      year: "2019",
      hours: "3,600 hrs",
      location: "Alwar, RJ",
      image: "/mah.png",
      rating: 3.9,
      condition: "Fair",
      verified: false,
      sellerType: "Individual",
      warranty: "No",
    },
  ];

  const SUGGESTED_COMPARISONS = [
    {
      title: "Mahindra 475 DI XP PLUS Comparison with similar tractors",
      left: {
        name: "Mahindra 475 DI XP P...",
        price: "₹ 6.40 Lakh*",
        image: mah,
      },
      right: { name: "Mahindra 575 DI", price: "₹ 6.95 Lakh*", image: swara },
      buttonText: "Mahindra 475 DI XP PLUS vs Mahindra 575 DI",
    },
    {
      title: "Popular Cross-Brand Matches",
      left: {
        name: "Mahindra 475 DI XP P...",
        price: "₹ 6.40 Lakh*",
        image: mah,
      },
      right: { name: "Swaraj 724 XM", price: "₹ 5.09 Lakh*", image: john },
      buttonText: "Compare Now",
    },
    {
      title: "Top Heavy Duty Alternatives",
      left: {
        name: "John Deere 5050 D",
        price: "₹ 7.90 Lakh*",
        image: john,
      },
      right: { name: "Swaraj 744 FE", price: "₹ 7.80 Lakh*", image: swara },
      buttonText: "Compare Now",
    },
  ];

  const toggleWishlist = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Detect screen size for responsive cards
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setCardsToShow(1);
      else if (window.innerWidth < 1024) setCardsToShow(2);
      else setCardsToShow(4);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-slide for mobile
  useEffect(() => {
    const slideNextMobile = (setIndex, length) => {
      setIndex((prev) => {
        const next = prev + 1;
        if (next >= length) {
          // When reaching the cloned first card, reset to beginning
          setTimeout(() => {
            setIsTransitioning(true);
            setIndex(0);
            setTimeout(() => setIsTransitioning(false), 50);
          }, 500);
        }
        return next;
      });
    };

    intervalRef.current = setInterval(() => {
      if (window.innerWidth < 640) {
        slideNextMobile(setNewIndex, allNewTractors.length);
        slideNextMobile(setUsedIndex, allUsedTractors.length);
      } else {
        setNewIndex((prev) => (prev + 1) % Math.ceil(allNewTractors.length / cardsToShow));
        setUsedIndex((prev) => (prev + 1) % Math.ceil(allUsedTractors.length / cardsToShow));
      }
    }, 3000);
    return () => clearInterval(intervalRef.current);
  }, [cardsToShow]);

  const getVisibleTractors = (tractors, startIndex) => {
    const visible = [];
    for (let i = 0; i < cardsToShow; i++) {
      visible.push(tractors[(startIndex + i) % tractors.length]);
    }
    return visible;
  };

  const slideNext = (setIndex, length) => {
    setIndex((prev) => {
      const next = prev + 1;
      if (next >= length) {
        setTimeout(() => {
          setIsTransitioning(true);
          setIndex(0);
          setTimeout(() => setIsTransitioning(false), 50);
        }, 500);
      }
      return next;
    });
    resetAutoSlide();
  };

  const slidePrev = (setIndex, length) => {
    setIndex((prev) => {
      if (prev === 0) {
        return length;
      }
      return prev - 1;
    });
    resetAutoSlide();
  };

  const resetAutoSlide = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (window.innerWidth < 640) {
        setNewIndex((prev) => {
          const next = prev + 1;
          if (next >= allNewTractors.length) {
            setTimeout(() => {
              setIsTransitioning(true);
              setNewIndex(0);
              setTimeout(() => setIsTransitioning(false), 50);
            }, 500);
          }
          return next;
        });
        setUsedIndex((prev) => {
          const next = prev + 1;
          if (next >= allUsedTractors.length) {
            setTimeout(() => {
              setIsTransitioning(true);
              setUsedIndex(0);
              setTimeout(() => setIsTransitioning(false), 50);
            }, 500);
          }
          return next;
        });
      } else {
        setNewIndex((prev) => (prev + 1) % Math.ceil(allNewTractors.length / cardsToShow));
        setUsedIndex((prev) => (prev + 1) % Math.ceil(allUsedTractors.length / cardsToShow));
      }
    }, 3000);
  };

  const TractorCard = ({ tractor, isUsed = false, className = "" }) => (
    <Link
      to={`/tractor/${tractor.id}`}
      className={`group bg-white rounded-2xl border-2 border-gray-200 hover:border-green-400 shadow-sm hover:shadow-2xl hover:shadow-green-100/50 transition-all duration-500 overflow-hidden flex flex-col flex-shrink-0 hover:-translate-y-2 cursor-pointer h-full ${className}`}
    >
      {/* Image Section - Fixed height */}
      <div className="relative h-36 sm:h-44 overflow-hidden bg-gradient-to-br from-green-50 to-white flex-shrink-0">
        <img
          src={tractor.image}
          alt={tractor.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />

        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1">
          {tractor.badge && (
            <span className="bg-gradient-to-r from-green-600 to-green-700 text-white text-[9px] sm:text-[10px] font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-lg shadow-green-600/30 flex items-center gap-1">
              <Award className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              {tractor.badge}
            </span>
          )}
          {isUsed && tractor.warranty !== "No" && (
            <span className="bg-green-500 text-white text-[9px] sm:text-[10px] font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-lg shadow-green-500/30 flex items-center gap-1">
              <Shield className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              {tractor.warranty}
            </span>
          )}
        </div>

        {/* Wishlist */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
          <button
            onClick={(e) => toggleWishlist(tractor.id, e)}
            className="p-1 sm:p-1.5 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-all"
          >
            <Heart
              className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-colors ${
                wishlist[tractor.id]
                  ? "fill-green-500 text-green-500"
                  : "text-gray-600 hover:text-green-500"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Content Section - Flex grow to fill remaining space */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        {/* Brand with Location */}
        <div className="flex items-center gap-1 mb-1">
          <span className="text-[10px] sm:text-xs font-bold text-green-700 uppercase tracking-wider">
            {tractor.brand}
          </span>
          <span className="text-gray-300 text-[10px]">•</span>
          <div className="flex items-center gap-0.5 text-[10px] sm:text-xs text-gray-500 min-w-0">
            <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-green-600 flex-shrink-0" />
            <span className="truncate">{tractor.location}</span>
          </div>
        </div>

        {/* Name & Rating */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-green-700 transition-colors flex-1">
            {tractor.name}
          </h3>
          {isUsed ? (
            <span
              className={`flex-shrink-0 inline-flex items-center gap-1 text-[8px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-full ${
                tractor.condition === "Excellent" ||
                tractor.condition === "Like New"
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : tractor.condition === "Good"
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-gray-100 text-gray-700 border border-gray-200"
              }`}
            >
              <span
                className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${
                  tractor.condition === "Excellent" ||
                  tractor.condition === "Like New"
                    ? "bg-green-500"
                    : tractor.condition === "Good"
                      ? "bg-green-500"
                      : "bg-gray-500"
                }`}
              />
              {tractor.condition}
            </span>
          ) : (
            <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
              <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-yellow-500 fill-yellow-500" />
              <span className="text-[10px] sm:text-xs font-bold text-gray-900">
                {tractor.rating}
              </span>
            </div>
          )}
        </div>

        {/* Price & Action - Always at bottom */}
        <div className="mt-auto pt-2 sm:pt-3 border-t-2 border-gray-100">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm sm:text-lg font-black text-gray-900 group-hover:text-green-700 transition-colors truncate">
                {tractor.price}
              </p>
              {isUsed && (
                <p className="text-[8px] sm:text-[10px] text-gray-400 line-through">
                  {tractor.originalPrice}
                </p>
              )}
            </div>
            {/* Mobile: Icon only, Desktop: Full text */}
            <span className="sm:hidden bg-green-600 text-white p-1.5 rounded-lg transition-all shadow-md shadow-green-600/20 group-hover:shadow-lg group-hover:shadow-green-600/30 flex items-center justify-center flex-shrink-0">
              <ShoppingCart className="h-3.5 w-3.5" />
            </span>
            <span className="hidden sm:inline-flex bg-green-600 text-white text-xs font-bold px-3 lg:px-4 py-2 rounded-xl transition-all shadow-md shadow-green-600/20 group-hover:shadow-lg group-hover:shadow-green-600/30 items-center gap-1.5 whitespace-nowrap">
              View Deal
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
  
  const SliderSection = ({
    title,
    icon: Icon,
    iconGradient,
    tractors,
    index,
    setIndex,
    isUsed,
    linkTo,
  }) => {
    // Clone first 2 cards at the end for smooth infinite loop
    const extendedTractors = [...tractors, ...tractors.slice(0, 2)];
    
    return (
      <div className="mb-20 md:mb-28 lg:mb-0 lg:py-10">
        <div className="flex items-center justify-between mb-5 px-4 sm:px-10">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <span
              className={`w-9 h-9 rounded-lg bg-gradient-to-r ${iconGradient} flex items-center justify-center`}
            >
              <Icon className="h-4 w-4 text-white" />
            </span>
            {title}
          </h3>
          <Link
            to={linkTo}
            className="text-green-600 hover:text-green-700 font-semibold flex items-center gap-1 text-sm"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Mobile View - 1.5 cards sliding with infinite loop */}
        <div className="sm:hidden relative">
          <div className="overflow-hidden px-8">
            <div 
              className={`flex transition-transform ${isTransitioning ? 'duration-0' : 'duration-500'} ease-in-out`}
              style={{
                transform: `translateX(-${index * (100 / 1.5)}%)`,
              }}
            >
              {extendedTractors.map((tractor, idx) => (
                <div 
                  key={`${tractor.id}-${idx}`} 
                  className="px-1.5"
                  style={{ 
                    width: `${100 / 1.5}%`, 
                    flexShrink: 0 
                  }}
                >
                  <TractorCard tractor={tractor} isUsed={isUsed} />
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Arrows */}
          <button
            onClick={() => slidePrev(setIndex, tractors.length)}
            className="absolute cursor-pointer left-0 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white border-2 border-green-200 shadow-lg flex items-center justify-center transition-all hover:bg-green-50"
          >
            <ChevronLeft className="h-3.5 w-3.5 text-green-700" />
          </button>

          <button
            onClick={() => slideNext(setIndex, tractors.length)}
            className="absolute cursor-pointer right-0 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white border-2 border-green-200 shadow-lg flex items-center justify-center transition-all hover:bg-green-50"
          >
            <ChevronRight className="h-3.5 w-3.5 text-green-700" />
          </button>
        </div>

        {/* Desktop View - Original grid layout */}
        <div className="hidden sm:block relative px-8 sm:px-10 lg:px-10">
          {/* Left Arrow */}
          <button
            onClick={() => slidePrev(setIndex, Math.ceil(tractors.length / cardsToShow))}
            className="absolute cursor-pointer left-0 sm:left-1 md:-left-2 lg:-left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border-2 border-green-200 shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:bg-green-50 hover:border-green-400"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-green-700" />
          </button>

          {/* Cards */}
          <div className="overflow-hidden">
            <div className="flex gap-3 sm:gap-4 transition-transform duration-500 ease-in-out">
              {getVisibleTractors(tractors, index * (window.innerWidth < 1024 ? 1 : 1)).map((tractor) => (
                <TractorCard
                  key={`${tractor.id}-${index}`}
                  tractor={tractor}
                  isUsed={isUsed}
                  className="w-full sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)]"
                />
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => slideNext(setIndex, Math.ceil(tractors.length / cardsToShow))}
            className="absolute cursor-pointer right-0 sm:right-1 md:-right-2 lg:-right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border-2 border-green-200 shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:bg-green-50 hover:border-green-400"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-green-700" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <section className="bg-gray-50 overflow-hidden w-full">
      {/* STANDARDIZED: Same spacing pattern as FeaturesBar & BrandsMakers */}
      <div className="px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pt-12 md:pt-16 lg:pt-20">
        {/* Inner container with bottom padding to match top spacing */}
        <div className="w-full max-w-[1440px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto">
          
          {/* UPDATED: Left-aligned main title with description below */}
          <div className="mb-10 md:mb-14">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
              Find Your Perfect{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-700">
                Tractor
              </span>
            </h2>
            <p className="text-gray-600 text-base md:text-lg max-w-2xl">
              Browse new and used tractors from all major brands
            </p>
          </div>

          {/* New Tractors Section */}
          <div className="my-12 md:my-16 lg:mb-10">
            <SliderSection
              title="New Tractors"
              icon={Tractor}
              iconGradient="from-green-600 to-green-700"
              tractors={allNewTractors}
              index={newIndex}
              setIndex={setNewIndex}
              isUsed={false}
              linkTo="/tractors"
            />
          </div>

          {/* Used Tractors Section */}
          <SliderSection
            title="Used Tractors"
            icon={TrendingUp}
            iconGradient="from-green-600 to-green-700"
            tractors={allUsedTractors}
            index={usedIndex}
            setIndex={setUsedIndex}
            isUsed={true}
            linkTo="/old-tractors"
          />
          
        </div>
      </div>

      {/* --- POPULAR COMPARISON HANDPICKS --- */}
      <div className=" border-gray-200 w-full">
        <div className="px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pt-12 md:pt-16 lg:pt-20">
          <div className="w-full max-w-[1440px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto">
            
            {/* Comparison Header */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
                Compare to buy{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-700">
                  the right tractor
                </span>
              </h2>
              <div className="border-b border-gray-200">
                <span className="inline-block text-sm font-semibold text-green-700 border-b-2 border-green-700 pb-2 px-1">
                  Tractor
                </span>
              </div>
            </div>

            {/* Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 ">
              {SUGGESTED_COMPARISONS.map((pair, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-100 rounded-xl p-2.5 sm:p-4 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    {/* Edge-to-edge split layout container */}
                    <div className="relative border border-gray-200 rounded-lg overflow-hidden mb-3 w-full h-24 sm:h-36">
                      <div className="grid grid-cols-2 gap-0 h-full w-full relative">
                        {/* Left Side */}
                        <div className="w-full h-full flex items-center justify-center bg-cover bg-center">
                          <img
                            src={pair.left.image}
                            alt={pair.left.name}
                            className="w-full h-full object-cover relative z-10"
                          />
                        </div>

                        {/* Right Side */}
                        <div className="w-full h-full flex items-center justify-center bg-cover bg-center">
                          <img
                            src={pair.right.image}
                            alt={pair.right.name}
                            className="w-full h-full object-cover relative z-10"
                          />
                        </div>
                      </div>

                      {/* Overlaid Center VS Badge */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-900 text-white text-[9px] sm:text-[10px] font-black w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center border-2 border-white shadow-md z-20 select-none uppercase">
                        vs
                      </div>
                    </div>

                    {/* Left-Aligned / Right-Aligned labels */}
                    <div className="grid grid-cols-2 gap-1 mb-3 px-0.5 text-xs sm:text-sm">
                      <div className="text-left">
                        <p className="font-semibold text-gray-800 truncate line-clamp-1">
                          {pair.left.name}
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-600 mt-0.5 sm:mt-1">
                          From{" "}
                          <span className="font-semibold text-gray-700">
                            {pair.left.price}
                          </span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800 truncate line-clamp-1">
                          {pair.right.name}
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-600 mt-0.5 sm:mt-1">
                          From{" "}
                          <span className="font-semibold text-gray-700">
                            {pair.right.price}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action comparison button wrapper */}
                  <div className="mt-1">
                    <Link to="/tractorcompare">
                      <button className="w-full cursor-pointer border border-green-200 bg-white hover:bg-green-50 text-green-700 transition-colors duration-150 text-[10px] sm:text-xs font-semibold py-1.5 px-2 rounded-md text-center truncate">
                        {pair.left.name.split(" ")[0]}{" "}
                        {pair.left.name.split(" ")[1] || ""} vs {pair.right.name}
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default TractorShowcase;