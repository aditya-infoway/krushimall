import { useState, useEffect, useCallback } from "react";
import {
  Search,
  ChevronDown,
  Tractor,
  Wrench,
  Clock,
  Phone,
  ChevronLeft,
  ChevronRight,
  Timer,
  BadgeCheck,
  Globe,
  Package,
  Users,
  Star,
  Zap,
  ArrowRight,
  Sparkles,
  Percent,
  CreditCard,
} from "lucide-react";

import { Listbox } from "@headlessui/react";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const [vehicle, setVehicle] = useState({
    make: "",
    model: "",
    year: "",
  });

  const tractorData = {
    Mahindra: [
      "575 DI",
      "Arjun 605",
      "JIVO 245",
      "Nova 755",
      "Arjun Novo 605 DI",
    ],
    "John Deere": [
      "5310",
      "5050D",
      "5405 Gear Pro",
      "6120 B",
      "5310 PowerTech",
    ],
    Swaraj: ["744 FE", "855 FE", "963 FE", "717", "744 XT"],
    TAFE: ["5900 DI", "Massey 245", "Massey 7250"],
    Escorts: ["Farmtrac 60", "Farmtrac 45", "Powertrac 439"],
    "New Holland": ["3630 TX", "3630 TX Plus", "Excel 4710"],
    Sonalika: ["DI 745", "DI 750 III", "Worldtrac 90"],
    Eicher: ["380", "485", "557"],
  };

  const years = ["2024", "2023", "2022", "2021", "2020", "2019"];
  const makes = Object.keys(tractorData);
  const models = vehicle.make ? tractorData[vehicle.make] : [];

  const slides = [
    {
      image:
        "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1920&auto=format&fit=crop",
      title: "Premium Tractor Parts",
      subtitle: "India's Largest Marketplace",
      description:
        "Find genuine tractor spare parts for every major brand. 50,000+ parts ready to ship.",
      badge: " Trending",
      stats: [
        { value: "50K+", label: "Parts Available", icon: Package },
        { value: "10K+", label: "Happy Farmers", icon: Users },
        { value: "4.8", label: "Rating", icon: Star },
      ],
    },
    {
      image:
        "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1920&auto=format&fit=crop",
      title: "Agriculture Equipment",
      subtitle: "Engine, Clutch, Brakes & More",
      description:
        "Premium quality engine parts, hydraulic systems, and transmission components delivered fast.",
      badge: " Fast Delivery",
      stats: [
        { value: "24h", label: "Dispatch Time", icon: Timer },
        { value: "100%", label: "Genuine Parts", icon: BadgeCheck },
        { value: "PAN", label: "India Delivery", icon: Globe },
      ],
    },
    {
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1920&auto=format&fit=crop",
      title: "Season Sale",
      subtitle: "Up to 40% Off on Parts",
      description:
        "Special discounts on filters, oils, belts, and maintenance kits. Limited time offer!",
      badge: " Best Prices",
      stats: [
        { value: "40%", label: "Max Discount", icon: Percent },
        { value: "500+", label: "Brands", icon: Zap },
        { value: "EMI", label: "Available", icon: CreditCard },
      ],
    },
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  }, [slides.length]);

  const goToNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  }, [slides.length]);

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) goToNext();
    if (distance < -50) goToPrev();
  };

  const currentSlideData = slides[currentSlide];

  return (
    <section
      className="relative bg-slate-900 w-full"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative min-h-[600px] md:min-h-[700px] lg:min-h-[750px] xl:min-h-[800px] 2xl:min-h-[850px] flex items-center  overflow-visible">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              currentSlide === index
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105 pointer-events-none"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-black/60"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent"></div>
          </div>
        ))}

        {/* CONTAINER FOR CONTENT */}
        <div className="relative z-20 w-full max-w-[1440px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 h-full flex items-start">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-start w-full pt-12 md:pt-16 lg:pt-20 pb-10">
            {/* LEFT CONTENT */}
            <div className="lg:col-span-7 text-white space-y-6 lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-green-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg">
                <Sparkles className="h-4 w-4" />
                <span>{currentSlideData.badge}</span>
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black leading-tight tracking-tight">
                  <span className="text-white drop-shadow-lg">
                    {currentSlideData.title}
                  </span>
                </h2>
                <p className="text-xl md:text-2xl font-bold text-green-400">
                  {currentSlideData.subtitle}
                </p>
                <p className="text-base md:text-lg text-gray-200 max-w-xl leading-relaxed drop-shadow">
                  {currentSlideData.description}
                </p>
              </div>

              {/* Stats with Icons */}
              <div className="flex flex-wrap gap-6">
                {currentSlideData.stats.map((stat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                      <stat.icon
                        className={`h-5 w-5 ${
                          stat.icon === Star
                            ? "text-green-400 fill-green-400"
                            : "text-green-400"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-white">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-300">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-green-400" />
                  <span>24/7 Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-green-400" />
                  <span>1800-123-4567</span>
                </div>
              </div>
            </div>

            {/* RIGHT SEARCH CARD */}
            <div className="lg:col-span-5 w-full max-w-md lg:max-w-none ml-auto">
              <div className="bg-white rounded-3xl shadow-2xl">
                {/* Card Header */}
                <div className="bg-green-700 p-6 text-white relative overflow-hidden rounded-t-3xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -mb-8 -ml-8"></div>

                  <div className="relative">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Search className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold">
                          Find Parts
                        </h3>
                        <p className="text-green-100 text-sm">
                          Select your tractor model
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 md:p-6 space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                        Tractor Brand
                      </label>
                      <CustomSelect
                        value={vehicle.make}
                        onChange={(value) =>
                          setVehicle({
                            make: value,
                            model: "",
                            year: vehicle.year,
                          })
                        }
                        options={makes}
                        placeholder="Select Brand"
                        icon={<Tractor className="h-4 w-4" />}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                        Model
                      </label>
                      <CustomSelect
                        value={vehicle.model}
                        onChange={(value) =>
                          setVehicle({ ...vehicle, model: value })
                        }
                        options={models}
                        placeholder={
                          vehicle.make ? "Select Model" : "Select brand first"
                        }
                        disabled={!vehicle.make}
                        icon={<Wrench className="h-4 w-4" />}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                        Year
                      </label>
                      <CustomSelect
                        value={vehicle.year}
                        onChange={(value) =>
                          setVehicle({ ...vehicle, year: value })
                        }
                        options={years}
                        placeholder="Select Year"
                        icon={<Clock className="h-4 w-4" />}
                      />
                    </div>
                  </div>

                  <button className="w-full cursor-pointer bg-green-700 hover:bg-green-800 text-white font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-green-700/20 hover:shadow-green-700/30 group">
                    <Search className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span>Search Tractor Parts</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Buttons */}
        <button
          onClick={goToPrev}
          className="absolute cursor-pointer left-4 xl:left-8 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/30 backdrop-blur-sm text-white rounded-full p-3 transition-all duration-300 hidden md:block"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={goToNext}
          className="absolute cursor-pointer right-4 xl:right-8 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/30 backdrop-blur-sm text-white rounded-full p-3 transition-all duration-300 hidden md:block"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Dots indicators */}
      {/* Dots indicators - Hidden on mobile, visible on desktop */}
<div className="absolute bottom-4 left-0 right-0 hidden md:flex justify-center items-center gap-3 z-30">
  {slides.map((_, index) => (
    <button
      key={index}
      onClick={() => goToSlide(index)}
      className={`transition-all duration-300 rounded-full ${
        currentSlide === index
          ? "w-10 h-3 bg-green-700 shadow-lg"
          : "w-3 h-3 bg-white/50 hover:bg-white/80"
      }`}
      aria-label={`Go to slide ${index + 1}`}
    />
  ))}
</div>
      </div>
    </section>
  );
};

const CustomSelect = ({
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  icon,
}) => {
  return (
    <Listbox value={value} onChange={onChange} disabled={disabled}>
      <div className="relative">
        <Listbox.Button
          className={`relative w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-left text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all ${
            disabled ? "opacity-50 cursor-not-allowed" : "hover:border-gray-300 cursor-pointer"
          }`}
        >
          <div className="flex items-center gap-3">
            {icon && <span className="text-gray-400">{icon}</span>}
            <span
              className={value ? "text-gray-900 font-medium" : "text-gray-400"}
            >
              {value || placeholder}
            </span>
          </div>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </Listbox.Button>
        <Listbox.Options className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto">
          {options.length > 0 ? (
            options.map((option) => (
              <Listbox.Option
                key={option}
                value={option}
                className={({ active }) =>
                  `cursor-pointer px-4 py-3 text-sm transition-colors ${
                    active ? "bg-green-50 text-green-600 font-medium" : "text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                {option}
              </Listbox.Option>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-gray-400 text-center">
              {disabled ? "Select brand first" : "No options available"}
            </div>
          )}
        </Listbox.Options>
      </div>
    </Listbox>
  );
};


export default HeroSection;