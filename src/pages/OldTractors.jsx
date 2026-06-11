import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Listbox, RadioGroup } from "@headlessui/react";
import {
  Tractor,
  MapPin,
  Heart,
  Star,
  Fuel,
  Gauge,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  BadgeCheck,
  Shield,
  Clock,
  Phone,
  Users,
  ShoppingBag,
  Package,
  Search,
  Check,
  Filter,
  ChevronDown,
  Settings2,
  Layers,
  User,
  Mail,
  MessageSquare,
  Send,
  HelpCircle,
  MessageCircle,
  X,
} from "lucide-react";
import mah from "../assets/mahindra.png";
import john from "../assets/johndeere.png";
import swara from "../assets/swaraj.png";
import logo from "../assets/massey.png";

const UsedTractors = () => {
  const [popularIndex, setPopularIndex] = useState(0);
  const [latestIndex, setLatestIndex] = useState(0);
  const [upcomingIndex, setUpcomingIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(4);
  const intervalRef = useRef(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedHp, setSelectedHp] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedTransmission, setSelectedTransmission] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState([0, 600000]);
  const [sortBy, setSortBy] = useState("popular");
  const [openIndex, setOpenIndex] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname.includes("old") ? "used" : "new";

  const [appliedFilters, setAppliedFilters] = useState({
    searchQuery: "",
    selectedBrand: "",
    selectedHp: "",
    selectedState: "",
    selectedCity: "",
    selectedTransmission: "",
    selectedCategory: "",
    priceRange: [0, 600000],
    sortBy: "popular",
  });

  // Enquiry form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    tractorType: "used",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const popularBrands = [
    { name: "Mahindra", logo: logo },
    { name: "John Deere", logo: logo },
    { name: "Swaraj", logo: logo },
    { name: "TAFE", logo: logo },
    { name: "New Holland", logo: logo },
    { name: "Sonalika", logo: logo },
    { name: "Escorts", logo: logo },
    { name: "Farmtrac", logo: logo },
    { name: "Eicher", logo: logo },
    { name: "Kubota", logo: logo },
    { name: "Preet", logo: logo },
    { name: "Indo Farm", logo: logo },
  ];

  const SUGGESTED_COMPARISONS = [
    {
      title: "Popular Used Mahindra Comparisons",
      left: { name: "Mahindra 575 DI 2020", price: "₹ 3.85 Lakh*", image: mah },
      right: {
        name: "Mahindra 475 DI 2019",
        price: "₹ 3.25 Lakh*",
        image: swara,
      },
      buttonText: "Mahindra 575 DI vs Mahindra 475 DI",
    },
    {
      title: "Cross-Brand Value Picks",
      left: {
        name: "John Deere 5310 2019",
        price: "₹ 4.95 Lakh*",
        image: john,
      },
      right: { name: "Swaraj 744 FE 2020", price: "₹ 4.25 Lakh*", image: mah },
      buttonText: "Compare Now",
    },
    {
      title: "Budget-Friendly Options",
      left: {
        name: "Eicher 380 Super DI",
        price: "₹ 2.95 Lakh*",
        image: swara,
      },
      right: {
        name: "Escorts Powertrac 439",
        price: "₹ 3.25 Lakh*",
        image: john,
      },
      buttonText: "Compare Now",
    },
  ];

  const FAQ_DATA = [
    {
      question: "What documents should I check when buying a used tractor?",
      answer:
        "Essential documents include RC (Registration Certificate), insurance papers, original purchase invoice, loan clearance/NOC from bank (if financed), fitness certificate, and valid PUC. Always verify engine and chassis numbers match the documents before purchase.",
    },
    {
      question: "How do you verify the condition of a used tractor?",
      answer:
        "Every used tractor undergoes a 120-point inspection covering engine health, transmission, hydraulics, tyres, electricals, and structural integrity. Our certified mechanics test run each tractor and provide a detailed condition report before listing.",
    },
    {
      question: "Is financing available for used tractors?",
      answer:
        "Yes, we offer up to 75-80% financing on used tractors through partner banks and NBFCs. Interest rates start from 12-15% with flexible tenure of 12-48 months. Contact our team for a free eligibility check.",
    },
    {
      question: "Can I get a warranty on a used tractor?",
      answer:
        "Yes, we provide a 6-month limited warranty on engine and transmission for all certified pre-owned tractors. Extended warranty options up to 2 years are also available at nominal additional cost.",
    },
    {
      question: "What is the minimum down payment required?",
      answer:
        "Minimum down payment starts from 20-25% of the tractor's value. However, this varies based on the tractor's age, condition, and your credit profile. We also accept exchange of your existing tractor as part of the down payment.",
    },
    {
      question: "Can I return or exchange a used tractor after purchase?",
      answer:
        "We offer a 3-day return window if the tractor doesn't match the described condition. A minimal inspection fee applies. We ensure complete transparency with detailed photos and inspection reports before purchase.",
    },
    {
      question: "How do you determine the price of a used tractor?",
      answer:
        "Pricing is based on multiple factors: year of manufacture, total running hours, engine condition, tyre wear, service history, current market demand, and geographical location. We ensure competitive pricing verified against multiple market benchmarks.",
    },
    {
      question: "Can I sell my old tractor through Krushi Mall?",
      answer:
        "Absolutely! List your tractor for free by filling our seller form. Our team will verify and photograph your tractor, provide a fair valuation, and list it for maximum visibility. We handle buyer inquiries and facilitate the transaction.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      console.log("Enquiry submitted:", formData);
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
          tractorType: "used",
        });
      }, 3000);
    }, 1500);
  };

  const popularUsedTractors = [
    {
      id: 101,
      name: "Mahindra 575 DI",
      brand: "Mahindra",
      price: 385000,
      hp: "45 HP",
      fuel: "Diesel",
      year: "2020",
      location: "Delhi, DL",
      image: "/mah.png",
      rating: 4.6,
      transmission: "Manual",
      category: "Utility Tractor",
    },
    {
      id: 102,
      name: "John Deere 5310",
      brand: "John Deere",
      price: 495000,
      hp: "55 HP",
      fuel: "Diesel",
      year: "2019",
      location: "Jaipur, RJ",
      image: "/mah.png",
      rating: 4.7,
      transmission: "Collarshift",
      category: "Heavy Duty",
    },
    {
      id: 103,
      name: "Swaraj 744 FE",
      brand: "Swaraj",
      price: 425000,
      hp: "48 HP",
      fuel: "Diesel",
      year: "2020",
      location: "Pune, MH",
      image: "/mah.png",
      rating: 4.5,
      transmission: "Manual",
      category: "Utility Tractor",
    },
    {
      id: 104,
      name: "Farmtrac 60 Powermaxx",
      brand: "Farmtrac",
      price: 415000,
      hp: "50 HP",
      fuel: "Diesel",
      year: "2019",
      location: "Ahmedabad, GJ",
      image: "/mah.png",
      rating: 4.4,
      transmission: "Constant Mesh",
      category: "Commercial",
    },
    {
      id: 105,
      name: "Sonalika DI 750 III",
      brand: "Sonalika",
      price: 365000,
      hp: "50 HP",
      fuel: "Diesel",
      year: "2018",
      location: "Bhopal, MP",
      image: "/mah.png",
      rating: 4.3,
      transmission: "Manual",
      category: "Utility Tractor",
    },
    {
      id: 106,
      name: "TAFE 5900 DI",
      brand: "TAFE",
      price: 345000,
      hp: "42 HP",
      fuel: "Diesel",
      year: "2019",
      location: "Chennai, TN",
      image: "/mah.png",
      rating: 4.2,
      transmission: "Manual",
      category: "Utility Tractor",
    },
  ];

  const latestUsedTractors = [
    {
      id: 107,
      name: "Mahindra Arjun 605",
      brand: "Mahindra",
      price: 525000,
      hp: "60 HP",
      fuel: "Diesel",
      year: "2022",
      location: "Nagpur, MH",
      image: "/mah.png",
      rating: 4.8,
      transmission: "Synchromesh",
      category: "Heavy Duty",
    },
    {
      id: 108,
      name: "Escorts Powertrac 439",
      brand: "Escorts",
      price: 325000,
      hp: "41 HP",
      fuel: "Diesel",
      year: "2019",
      location: "Faridabad, HR",
      image: "/mah.png",
      rating: 4.2,
      transmission: "Manual",
      category: "Mini Tractor",
    },
    {
      id: 109,
      name: "Eicher 380 Super DI",
      brand: "Eicher",
      price: 295000,
      hp: "40 HP",
      fuel: "Diesel",
      year: "2017",
      location: "Indore, MP",
      image: "/mah.png",
      rating: 4.1,
      transmission: "Partial Constant Mesh",
      category: "Utility Tractor",
    },
    {
      id: 110,
      name: "Preet 3549",
      brand: "Preet",
      price: 335000,
      hp: "49 HP",
      fuel: "Diesel",
      year: "2020",
      location: "Chandigarh",
      image: "/mah.png",
      rating: 4.3,
      transmission: "Manual",
      category: "Utility Tractor",
    },
    {
      id: 111,
      name: "New Holland 3630 TX",
      brand: "New Holland",
      price: 445000,
      hp: "50 HP",
      fuel: "Diesel",
      year: "2021",
      location: "Lucknow, UP",
      image: "/mah.png",
      rating: 4.6,
      transmission: "Constant Mesh",
      category: "Commercial",
    },
    {
      id: 112,
      name: "Kubota NeoStar A211N",
      brand: "Kubota",
      price: 285000,
      hp: "21 HP",
      fuel: "Diesel",
      year: "2021",
      location: "Bangalore, KA",
      image: "/mah.png",
      rating: 4.5,
      transmission: "Manual",
      category: "Mini Tractor",
    },
  ];

  const upcomingUsedTractors = [
    {
      id: 113,
      name: "John Deere 5050D",
      brand: "John Deere",
      price: 455000,
      hp: "50 HP",
      fuel: "Diesel",
      year: "2020",
      location: "Amritsar, PB",
      image: "/mah.png",
      rating: 4.7,
      transmission: "Collarshift",
      category: "Utility Tractor",
    },
    {
      id: 114,
      name: "Mahindra 265 DI",
      brand: "Mahindra",
      price: 275000,
      hp: "35 HP",
      fuel: "Diesel",
      year: "2018",
      location: "Rohtak, HR",
      image: "/mah.png",
      rating: 4.2,
      transmission: "Manual",
      category: "Mini Tractor",
    },
    {
      id: 115,
      name: "Swaraj 855 FE",
      brand: "Swaraj",
      price: 395000,
      hp: "55 HP",
      fuel: "Diesel",
      year: "2019",
      location: "Nashik, MH",
      image: "/mah.png",
      rating: 4.4,
      transmission: "Constant Mesh",
      category: "Heavy Duty",
    },
    {
      id: 116,
      name: "New Holland 4710",
      brand: "New Holland",
      price: 405000,
      hp: "47 HP",
      fuel: "Diesel",
      year: "2020",
      location: "Surat, GJ",
      image: "/mah.png",
      rating: 4.5,
      transmission: "Synchromesh",
      category: "Commercial",
    },
    {
      id: 117,
      name: "Mahindra JIVO 245",
      brand: "Mahindra",
      price: 255000,
      hp: "24 HP",
      fuel: "Diesel",
      year: "2019",
      location: "Patna, BR",
      image: "/mah.png",
      rating: 4.1,
      transmission: "Manual",
      category: "Mini Tractor",
    },
    {
      id: 118,
      name: "Sonalika Worldtrac 90",
      brand: "Sonalika",
      price: 575000,
      hp: "90 HP",
      fuel: "Diesel",
      year: "2021",
      location: "Hyderabad, TS",
      image: "/mah.png",
      rating: 4.6,
      transmission: "Synchromesh",
      category: "Heavy Duty",
    },
  ];

  const parseLocation = (locString) => {
    const parts = locString.split(",").map((p) => p.trim());
    return { city: parts[0] || "", state: parts[1] || parts[0] || "" };
  };

  const allTractors = [
    ...popularUsedTractors,
    ...latestUsedTractors,
    ...upcomingUsedTractors,
  ];
  const brandOptions = [
    "All Brands",
    ...new Set(allTractors.map((t) => t.brand)),
  ];
  const hpOptions = ["All HP", ...new Set(allTractors.map((t) => t.hp))];
  const stateOptions = [
    "All States",
    ...new Set(allTractors.map((t) => parseLocation(t.location).state)),
  ];
  const transmissionOptions = [
    "All Transmissions",
    ...new Set(allTractors.map((t) => t.transmission)),
  ];
  const categoryOptions = [
    "All Categories",
    ...new Set(allTractors.map((t) => t.category)),
  ];
  const cityOptions = [
    "All Cities",
    ...new Set(
      allTractors
        .filter(
          (t) =>
            !selectedState || parseLocation(t.location).state === selectedState,
        )
        .map((t) => parseLocation(t.location).city),
    ),
  ];
  const maxPrice = 600000;

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedBrand("");
    setSelectedHp("");
    setSelectedState("");
    setSelectedCity("");
    setSelectedTransmission("");
    setSelectedCategory("");
    setPriceRange([0, maxPrice]);
    setSortBy("popular");
    setAppliedFilters({
      searchQuery: "",
      selectedBrand: "",
      selectedHp: "",
      selectedState: "",
      selectedCity: "",
      selectedTransmission: "",
      selectedCategory: "",
      priceRange: [0, maxPrice],
      sortBy: "popular",
    });
  };

  const applyFilters = () => {
    setAppliedFilters({
      searchQuery,
      selectedBrand,
      selectedHp,
      selectedState,
      selectedCity,
      selectedTransmission,
      selectedCategory,
      priceRange,
      sortBy,
    });
  };

  useEffect(() => {
    if (selectedState) {
      const validCitiesForState = allTractors
        .filter((t) => parseLocation(t.location).state === selectedState)
        .map((t) => parseLocation(t.location).city);
      if (!validCitiesForState.includes(selectedCity)) setSelectedCity("");
    }
  }, [selectedState]);

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

useEffect(() => {
  const id = setInterval(() => {
    if (window.innerWidth >= 640) {
      setPopularIndex((prev) => (prev + 1) % popularUsedTractors.length);
      setLatestIndex((prev) => (prev + 1) % latestUsedTractors.length);
      setUpcomingIndex((prev) => (prev + 1) % upcomingUsedTractors.length);
    }
  }, 3000);
  return () => clearInterval(id);
}, []);

  const getVisibleTractors = (tractors, startIndex) => {
    const visible = [];
    for (let i = 0; i < cardsToShow; i++)
      visible.push(tractors[(startIndex + i) % tractors.length]);
    return visible;
  };

 const slideNext = (setIndex, length) => {
  setIndex((prev) => (prev + 1) % length);
};

const slidePrev = (setIndex, length) => {
  setIndex((prev) => (prev - 1 + length) % length);
};

  const TractorCard = ({ tractor }) => (
  <div className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col flex-shrink-0 w-full sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)]">
    {/* Clickable Image */}
    <Link to={`/tractor/${tractor.id}`} className="relative h-40 sm:h-44 overflow-hidden bg-gray-100 block">
      <img
        src={tractor.image}
        alt={tractor.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute top-2 left-2">
        <span className="bg-green-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          New
        </span>
      </div>
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          // Add wishlist logic here
        }}
        className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow hover:bg-gray-100 cursor-pointer"
      >
        <Heart className="h-3.5 w-3.5 text-gray-500 hover:text-green-600" />
      </button>
    </Link>
    
    <div className="p-3 flex flex-col flex-1">
      <div className="flex items-center justify-between mb-1">
        {/* Clickable Brand Name */}
        <Link to={`/tractor/${tractor.id}`} className="text-xs font-semibold text-green-600 hover:text-green-700 transition-colors">
          {tractor.brand}
        </Link>
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          <MapPin className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{tractor.location}</span>
        </div>
      </div>
      <div className="flex items-center justify-between mb-1">
        {/* Clickable Product Name */}
        <Link to={`/tractor/${tractor.id}`} className="text-sm font-bold text-gray-900 mb-2 line-clamp-1 hover:text-green-600 transition-colors">
          {tractor.name}
        </Link>
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
          <span className="text-xs font-semibold text-gray-700">
            {tractor.rating}
          </span>
        </div>
      </div>

      <div className="mt-auto pt-2 border-t">
        <div className="flex items-center justify-between">
          <p className="text-sm font-black text-gray-900">
            ₹{tractor.price.toLocaleString()}
          </p>
          <Link
            to={`/tractor/${tractor.id}`}
            className="bg-green-700 hover:bg-green-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  </div>
);
  const SliderSection = ({
  title,
  subtitle,
  tractors,
  index,
  setIndex,
  linkTo,
  badgeColor,
}) => {
  const sliderRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef(null);

  // Show arrows when scrolling/touching on mobile
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 1500);
    };

    slider.addEventListener("scroll", handleScroll, { passive: true });
    slider.addEventListener("touchstart", handleScroll, { passive: true });

    return () => {
      slider.removeEventListener("scroll", handleScroll);
      slider.removeEventListener("touchstart", handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const scrollSlider = (direction) => {
    if (!sliderRef.current) return;
    const { scrollLeft, clientWidth } = sliderRef.current;
    sliderRef.current.scrollTo({
      left: direction === "left" 
        ? scrollLeft - clientWidth * 0.8 
        : scrollLeft + clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  return (
    <div className="">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-1.5 h-6 rounded-full ${badgeColor}`}></div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {title}
            </h3>
          </div>
          {subtitle && (
            <p className="text-sm text-gray-500 ml-3.5">{subtitle}</p>
          )}
        </div>
        <Link
          to={linkTo}
          className="text-green-600 hover:text-green-700 font-semibold text-sm flex items-center gap-1"
        >
          View All <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* MOBILE ONLY - Native scroll with arrows appearing on touch */}
      <div className="sm:hidden relative">
        <button
          onClick={() => scrollSlider("left")}
          className={`cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 -ml-1 z-20 flex items-center justify-center w-8 h-8 border border-green-200 text-green-700 rounded-full bg-white shadow-lg hover:bg-green-50 transition-all duration-300 ${
            isScrolling ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div
          ref={sliderRef}
          className="flex overflow-x-auto gap-3 pb-4 px-4 scrollbar-hide snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {tractors.map((tractor) => (
            <div key={tractor.id} className="snap-start w-[75vw] flex-shrink-0">
              <TractorCard tractor={tractor} />
            </div>
          ))}
        </div>

        <button
          onClick={() => scrollSlider("right")}
          className={`cursor-pointer absolute right-0 top-1/2 -translate-y-1/2 -mr-1 z-20 flex items-center justify-center w-8 h-8 border border-green-200 text-green-700 rounded-full bg-white shadow-lg hover:bg-green-50 transition-all duration-300 ${
            isScrolling ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
          }`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

        {/* DESKTOP - Original code completely unchanged */}
        <div className="hidden sm:block relative px-8 sm:px-8 lg:px-10">
          <button
            onClick={() => slidePrev(setIndex, tractors.length)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center hover:bg-green-50 hover:border-green-300 transition-all"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
          </button>
          <div className="overflow-hidden">
            <div className="flex gap-3 sm:gap-4 transition-transform duration-500 ease-in-out">
              {getVisibleTractors(tractors, index).map((tractor) => (
                <TractorCard key={`${tractor.id}-${index}`} tractor={tractor} />
              ))}
            </div>
          </div>
          <button
            onClick={() => slideNext(setIndex, tractors.length)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center hover:bg-green-50 hover:border-green-300 transition-all"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ========== HERO SECTION ========== */}
      <div className="relative text-white min-h-[600px] md:min-h-[650px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=1920&auto=format&fit=crop&q=90"
            alt="Used tractor in field"
            className="w-full h-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 via-gray-900/40 to-gray-900/20" />
        </div>
        <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 py-16 md:py-20 lg:py-24 relative z-10 w-full">
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link
              to="/"
              className="text-green-400 hover:text-green-300 font-medium drop-shadow-md"
            >
              Home
            </Link>
            <span className="text-white/70 drop-shadow-md">/</span>
            <span className="text-green-400 font-medium drop-shadow-md">
              Used Tractors
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-full mb-6 shadow-lg">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-semibold">
                  Quality Pre-owned Tractors
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight drop-shadow-lg">
                Find Best{" "}
                <span className="text-green-300 drop-shadow-lg">
                  Used Tractor
                </span>
              </h1>
              <p className="text-white/90 text-base md:text-lg mb-6 max-w-xl drop-shadow-md">
                Quality assured pre-owned tractors at verified pricing.
                Certified by experts, warranty included, and easy financing
                options available.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/finance-emi"
                  className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm md:text-base shadow-lg hover:shadow-xl"
                >
                  <Phone className="h-4 w-4" /> Get EMI Options
                </Link>
                <a
                  href="tel:+911234567890"
                  className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm md:text-base shadow-lg hover:shadow-xl border border-white/30"
                >
                  <Phone className="h-4 w-4" /> Call Expert
                </a>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
              <div className="bg-green-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-white" />
                    <h3 className="font-bold text-white text-lg">
                      Filter Tractors
                    </h3>
                  </div>
                  <button
                    onClick={clearFilters}
                    className="text-white/90 hover:text-white cursor-pointer text-sm font-medium hover:underline"
                  >
                    Clear all
                  </button>
                </div>
                <p className="text-green-100 text-xs mt-1">
                  Find your perfect match
                </p>
              </div>

              <div className="p-6">
                {/* Tractor Type Toggle */}
               {/* Tractor Type Toggle - Headless UI RadioGroup */}
<div className="mb-5">
  <label className="block text-sm font-semibold text-gray-700 mb-2">
    Tractor Type
  </label>
  <RadioGroup value={activeTab} onChange={(value) => {
    if (value === "new" && location.pathname !== "/new-tractors") {
      navigate("/new-tractors");
    } else if (value === "used" && location.pathname !== "/old-tractors") {
      navigate("/old-tractors");
    }
  }}>
    <div className="grid grid-cols-2 gap-2">
      <RadioGroup.Option value="new">
        {({ checked }) => (
          <div className={`flex items-center justify-center cursor-pointer gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 border-2 ${
            checked ? "bg-green-600 text-white border-green-600 shadow-lg shadow-green-600/20" : "bg-white text-gray-700 border-gray-200 hover:border-green-300 hover:bg-green-50"
          }`}>
            <Tractor className="h-4 w-4" /> New
          </div>
        )}
      </RadioGroup.Option>
      <RadioGroup.Option value="used">
        {({ checked }) => (
          <div className={`flex items-center justify-center cursor-pointer gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 border-2 ${
            checked ? "bg-green-600 text-white border-green-600 shadow-lg shadow-green-600/20" : "bg-white text-gray-700 border-gray-200 hover:border-green-300 hover:bg-green-50"
          }`}>
            <Gauge className="h-4 w-4" /> Used
          </div>
        )}
      </RadioGroup.Option>
    </div>
  </RadioGroup>
</div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name or brand..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none transition-all bg-gray-50 hover:bg-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                 <div>
  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Brand</label>
  <Listbox value={selectedBrand} onChange={setSelectedBrand}>
    <div className="relative">
      <Listbox.Button className="w-full pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm text-left focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none bg-gray-50 hover:bg-white cursor-pointer">
        <span className={selectedBrand ? "text-gray-900" : "text-gray-400"}>
          {selectedBrand || "All Brands"}
        </span>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      </Listbox.Button>
      <Listbox.Options className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto py-1 text-sm">
        <Listbox.Option value="" className={({ active }) => `cursor-pointer px-4 py-2.5 ${active ? "bg-green-50 text-green-700" : "text-gray-700"}`}>
          All Brands
        </Listbox.Option>
        {brandOptions.filter(b => b !== "All Brands").map((brand) => (
          <Listbox.Option key={brand} value={brand} className={({ active, selected }) => `cursor-pointer px-4 py-2.5 flex items-center justify-between ${active ? "bg-green-50 text-green-700" : "text-gray-700"} ${selected ? "bg-green-100 font-medium" : ""}`}>
            {({ selected }) => (<><span>{brand}</span>{selected && <Check className="h-4 w-4 text-green-600" />}</>)}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </div>
  </Listbox>
</div>
                  <div>
  <label className="block text-sm font-semibold text-gray-700 mb-1.5">HP Range</label>
  <Listbox value={selectedHp} onChange={setSelectedHp}>
    <div className="relative">
      <Listbox.Button className="w-full pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm text-left focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none bg-gray-50 hover:bg-white cursor-pointer">
        <span className={selectedHp ? "text-gray-900" : "text-gray-400"}>{selectedHp || "All HP"}</span>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      </Listbox.Button>
      <Listbox.Options className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto py-1 text-sm">
        <Listbox.Option value="" className={({ active }) => `cursor-pointer px-4 py-2.5 ${active ? "bg-green-50 text-green-700" : "text-gray-700"}`}>All HP</Listbox.Option>
        {hpOptions.filter(hp => hp !== "All HP").map((hp) => (
          <Listbox.Option key={hp} value={hp} className={({ active, selected }) => `cursor-pointer px-4 py-2.5 flex items-center justify-between ${active ? "bg-green-50 text-green-700" : "text-gray-700"} ${selected ? "bg-green-100 font-medium" : ""}`}>
            {({ selected }) => (<><span>{hp}</span>{selected && <Check className="h-4 w-4 text-green-600" />}</>)}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </div>
  </Listbox>
</div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Transmission</label>
  <Listbox value={selectedTransmission} onChange={setSelectedTransmission}>
    <div className="relative">
      <Listbox.Button className="w-full pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm text-left focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none bg-gray-50 hover:bg-white cursor-pointer">
        <span className={selectedTransmission ? "text-gray-900" : "text-gray-400"}>{selectedTransmission || "All Transmissions"}</span>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      </Listbox.Button>
      <Listbox.Options className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto py-1 text-sm">
        <Listbox.Option value="" className={({ active }) => `cursor-pointer px-4 py-2.5 ${active ? "bg-green-50 text-green-700" : "text-gray-700"}`}>All Transmissions</Listbox.Option>
        {transmissionOptions.filter(t => t !== "All Transmissions").map((t) => (
          <Listbox.Option key={t} value={t} className={({ active, selected }) => `cursor-pointer px-4 py-2.5 flex items-center justify-between ${active ? "bg-green-50 text-green-700" : "text-gray-700"} ${selected ? "bg-green-100 font-medium" : ""}`}>
            {({ selected }) => (<><span>{t}</span>{selected && <Check className="h-4 w-4 text-green-600" />}</>)}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </div>
  </Listbox>
</div>
                <div>
  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
  <Listbox value={selectedCategory} onChange={setSelectedCategory}>
    <div className="relative">
      <Listbox.Button className="w-full pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm text-left focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none bg-gray-50 hover:bg-white cursor-pointer">
        <span className={selectedCategory ? "text-gray-900" : "text-gray-400"}>{selectedCategory || "All Categories"}</span>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      </Listbox.Button>
      <Listbox.Options className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto py-1 text-sm">
        <Listbox.Option value="" className={({ active }) => `cursor-pointer px-4 py-2.5 ${active ? "bg-green-50 text-green-700" : "text-gray-700"}`}>All Categories</Listbox.Option>
        {categoryOptions.filter(c => c !== "All Categories").map((c) => (
          <Listbox.Option key={c} value={c} className={({ active, selected }) => `cursor-pointer px-4 py-2.5 flex items-center justify-between ${active ? "bg-green-50 text-green-700" : "text-gray-700"} ${selected ? "bg-green-100 font-medium" : ""}`}>
            {({ selected }) => (<><span>{c}</span>{selected && <Check className="h-4 w-4 text-green-600" />}</>)}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </div>
  </Listbox>
</div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
  <label className="block text-sm font-semibold text-gray-700 mb-1.5">State</label>
  <Listbox value={selectedState} onChange={setSelectedState}>
    <div className="relative">
      <Listbox.Button className="w-full pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm text-left focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none bg-gray-50 hover:bg-white cursor-pointer">
        <span className={selectedState ? "text-gray-900" : "text-gray-400"}>{selectedState || "All States"}</span>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      </Listbox.Button>
      <Listbox.Options className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto py-1 text-sm">
        <Listbox.Option value="" className={({ active }) => `cursor-pointer px-4 py-2.5 ${active ? "bg-green-50 text-green-700" : "text-gray-700"}`}>All States</Listbox.Option>
        {stateOptions.filter(s => s !== "All States").map((state) => (
          <Listbox.Option key={state} value={state} className={({ active, selected }) => `cursor-pointer px-4 py-2.5 flex items-center justify-between ${active ? "bg-green-50 text-green-700" : "text-gray-700"} ${selected ? "bg-green-100 font-medium" : ""}`}>
            {({ selected }) => (<><span>{state}</span>{selected && <Check className="h-4 w-4 text-green-600" />}</>)}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </div>
  </Listbox>
</div>
                 <div>
  <label className="block text-sm font-semibold text-gray-700 mb-1.5">City</label>
  <Listbox value={selectedCity} onChange={setSelectedCity} disabled={cityOptions.length <= 1}>
    <div className="relative">
      <Listbox.Button className={`w-full pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm text-left focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none bg-gray-50 hover:bg-white ${cityOptions.length <= 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
        <span className={selectedCity ? "text-gray-900" : "text-gray-400"}>{selectedCity || "All Cities"}</span>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      </Listbox.Button>
      <Listbox.Options className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto py-1 text-sm">
        <Listbox.Option value="" className={({ active }) => `cursor-pointer px-4 py-2.5 ${active ? "bg-green-50 text-green-700" : "text-gray-700"}`}>All Cities</Listbox.Option>
        {cityOptions.filter(c => c !== "All Cities").map((city) => (
          <Listbox.Option key={city} value={city} className={({ active, selected }) => `cursor-pointer px-4 py-2.5 flex items-center justify-between ${active ? "bg-green-50 text-green-700" : "text-gray-700"} ${selected ? "bg-green-100 font-medium" : ""}`}>
            {({ selected }) => (<><span>{city}</span>{selected && <Check className="h-4 w-4 text-green-600" />}</>)}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </div>
  </Listbox>
</div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Budget (₹)
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max={maxPrice}
                      step="25000"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-700"
                    />
                    <div className="flex justify-between gap-2">
                      <div className="flex-1 bg-gray-50 rounded-lg px-3 py-1.5 text-center border border-gray-200">
                        <p className="text-[10px] text-gray-500">Min</p>
                        <p className="text-xs font-semibold text-gray-900">
                          ₹{priceRange[0].toLocaleString()}
                        </p>
                      </div>
                      <div className="flex-1 bg-gray-50 rounded-lg px-3 py-1.5 text-center border border-gray-200">
                        <p className="text-[10px] text-gray-500">Max</p>
                        <p className="text-xs font-semibold text-gray-900">
                          ₹{priceRange[1].toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Apply Filters Button */}
                <button
                  onClick={applyFilters}
                  className="w-full mt-4 bg-green-700 hover:bg-green-800 cursor-pointer text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-green-700/20 hover:shadow-green-700/30"
                >
                  <Filter className="h-4 w-4" />
                  Apply Filters
                </button>

                {/* Active Filters Summary */}
                {(appliedFilters.searchQuery ||
                  appliedFilters.selectedBrand ||
                  appliedFilters.selectedHp ||
                  appliedFilters.selectedState ||
                  appliedFilters.selectedCity ||
                  appliedFilters.selectedTransmission ||
                  appliedFilters.selectedCategory ||
                  appliedFilters.priceRange[1] < maxPrice) && (
                  <div className="pt-3 mt-3 border-t border-gray-100">
                    <p className="text-[11px] font-semibold text-gray-500 mb-1.5">
                      Active filters:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {appliedFilters.searchQuery && (
                        <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-[11px] font-medium px-2 py-1 rounded-lg border border-gray-200">
                          <Check className="h-3 w-3" />
                          {appliedFilters.searchQuery}
                          <button
                            onClick={() => {
                              setSearchQuery("");
                              setAppliedFilters((prev) => ({
                                ...prev,
                                searchQuery: "",
                              }));
                            }}
                            className="ml-1 hover:text-red-500 cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      )}
                      {appliedFilters.selectedBrand && (
                        <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-[11px] font-medium px-2 py-1 rounded-lg border border-gray-200">
                          <Check className="h-3 w-3" />
                          {appliedFilters.selectedBrand}
                          <button
                            onClick={() => {
                              setSelectedBrand("");
                              setAppliedFilters((prev) => ({
                                ...prev,
                                selectedBrand: "",
                              }));
                            }}
                            className="ml-1 hover:text-red-500 cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      )}
                      {appliedFilters.selectedHp && (
                        <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-[11px] font-medium px-2 py-1 rounded-lg border border-gray-200">
                          <Check className="h-3 w-3" />
                          {appliedFilters.selectedHp}
                          <button
                            onClick={() => {
                              setSelectedHp("");
                              setAppliedFilters((prev) => ({
                                ...prev,
                                selectedHp: "",
                              }));
                            }}
                            className="ml-1 hover:text-red-500 cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      )}
                      {appliedFilters.selectedState && (
                        <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-[11px] font-medium px-2 py-1 rounded-lg border border-gray-200">
                          <Check className="h-3 w-3" />
                          {appliedFilters.selectedState}
                          <button
                            onClick={() => {
                              setSelectedState("");
                              setAppliedFilters((prev) => ({
                                ...prev,
                                selectedState: "",
                              }));
                            }}
                            className="ml-1 hover:text-red-500 cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      )}
                      {appliedFilters.selectedCity && (
                        <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-[11px] font-medium px-2 py-1 rounded-lg border border-gray-200">
                          <Check className="h-3 w-3" />
                          {appliedFilters.selectedCity}
                          <button
                            onClick={() => {
                              setSelectedCity("");
                              setAppliedFilters((prev) => ({
                                ...prev,
                                selectedCity: "",
                              }));
                            }}
                            className="ml-1 hover:text-red-500 cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      )}
                      {appliedFilters.selectedTransmission && (
                        <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-[11px] font-medium px-2 py-1 rounded-lg border border-gray-200">
                          <Check className="h-3 w-3" />
                          {appliedFilters.selectedTransmission}
                          <button
                            onClick={() => {
                              setSelectedTransmission("");
                              setAppliedFilters((prev) => ({
                                ...prev,
                                selectedTransmission: "",
                              }));
                            }}
                            className="ml-1 hover:text-red-500 cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      )}
                      {appliedFilters.selectedCategory && (
                        <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-[11px] font-medium px-2 py-1 rounded-lg border border-gray-200">
                          <Check className="h-3 w-3" />
                          {appliedFilters.selectedCategory}
                          <button
                            onClick={() => {
                              setSelectedCategory("");
                              setAppliedFilters((prev) => ({
                                ...prev,
                                selectedCategory: "",
                              }));
                            }}
                            className="ml-1 hover:text-red-500 cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      )}
                      {appliedFilters.priceRange[1] < maxPrice && (
                        <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-[11px] font-medium px-2 py-1 rounded-lg border border-gray-200">
                          <Check className="h-3 w-3" />
                          Up to ₹{appliedFilters.priceRange[1].toLocaleString()}
                          <button
                            onClick={() => {
                              setPriceRange([0, maxPrice]);
                              setAppliedFilters((prev) => ({
                                ...prev,
                                priceRange: [0, maxPrice],
                              }));
                            }}
                            className="ml-1 hover:text-red-500 cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Bar - Outside Hero */}
      <div className="bg-white border-b lg:mt-6 border-gray-200 sticky top-16 z-30">
       <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 py-4">

          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Tractor className="h-4 w-4 text-green-700" />
              </div>
              <p className="text-sm font-semibold text-gray-700">
                Showing{" "}
                <span className="text-green-700 font-bold">
                  {allTractors.length}
                </span>{" "}
                tractors
              </p>
            </div>
         {/* Results Bar Sort - Headless UI Listbox */}
<div className="flex items-center gap-3">
  <span className="text-sm font-semibold text-gray-600">
    Sort by:
  </span>
  <Listbox value={sortBy} onChange={setSortBy}>
    <div className="relative">
      <Listbox.Button className="px-4 py-2 border border-gray-200 bg-white text-gray-700 rounded-xl text-sm text-left focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none cursor-pointer font-medium flex items-center justify-between gap-2 min-w-[160px]">
        <span>
          {sortBy === "popular" ? "Most Popular" :
           sortBy === "price-low" ? "Price: Low to High" :
           sortBy === "price-high" ? "Price: High to Low" :
           sortBy === "newest" ? "Newest First" : "Highest Rated"}
        </span>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </Listbox.Button>
      <Listbox.Options className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg py-1 text-sm">
        {[
          { value: "popular", label: "Most Popular" },
          { value: "price-low", label: "Price: Low to High" },
          { value: "price-high", label: "Price: High to Low" },
          { value: "newest", label: "Newest First" },
          { value: "rating", label: "Highest Rated" },
        ].map((option) => (
          <Listbox.Option
            key={option.value}
            value={option.value}
            className={({ active, selected }) =>
              `cursor-pointer px-4 py-2.5 flex items-center justify-between ${
                active ? "bg-green-50 text-green-700" : "text-gray-700"
              } ${selected ? "bg-green-100 font-medium" : ""}`
            }
          >
            {({ selected }) => (
              <>
                <span>{option.label}</span>
                {selected && <Check className="h-4 w-4 text-green-600" />}
              </>
            )}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </div>
  </Listbox>
</div>
          </div>
        </div>
      </div>

      {/* ========== SLIDER SECTIONS ========== */}
      <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pt-12 md:pt-16 lg:pt-20">
        <div className="mb-8 md:mb-14 lg:mb-20">
          <SliderSection
            title="Popular Used Tractors"
            subtitle="Most demanded across regional hubs"
            tractors={popularUsedTractors}
            index={popularIndex}
            setIndex={setPopularIndex}
            linkTo="/tractors?type=used&section=popular"
            badgeColor="bg-green-700"
          />
        </div>

        <div className="mb-8 md:mb-14 lg:mb-20">
          <SliderSection
            title="Recently Added Listings"
            subtitle="Fresh arrivals evaluated over 48 hours"
            tractors={latestUsedTractors}
            index={latestIndex}
            setIndex={setLatestIndex}
            linkTo="/tractors?type=used&section=recent"
            badgeColor="bg-green-700"
          />
        </div>

        <SliderSection
          title="Best Value Opportunities"
          subtitle="Highly competitive price points"
          tractors={upcomingUsedTractors}
          index={upcomingIndex}
          setIndex={setUpcomingIndex}
          linkTo="/tractors?type=used&section=deals"
          badgeColor="bg-green-700"
        />
      </div>

      {/* ========== POPULAR BRANDS MARQUEE ========== */}
      <div className="bg-white border-b border-gray-100">
       <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 py-8 pt-12 md:pt-16 lg:pt-20">
          <h3 className="text-center text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-6">
            Popular{" "}
            <span className="text-transparent bg-clip-text bg-green-600">
              Tractor Brands
            </span>
          </h3>
          <div className="relative overflow-hidden">
            <div className="flex gap-8 animate-marquee">
              {[...popularBrands, ...popularBrands].map((brand, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-2 flex-shrink-0 group cursor-pointer"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-green-50 border-2 border-gray-200 flex items-center justify-center group-hover:border-green-600 group-hover:shadow-md group-hover:bg-green-100 transition-all duration-300 overflow-hidden">
                    {brand.logo ? (
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="w-full h-full object-contain p-3"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <span
                      className={`text-base sm:text-lg font-black text-green-700 ${brand.logo ? "hidden" : "flex"}`}
                      style={{ display: brand.logo ? "none" : "flex" }}
                    >
                      {brand.name
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========== COMPARISON SECTION ========== */}
      <div className="border-t border-gray-200">
        <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pt-12 md:pt-16 lg:pt-20">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Compare{" "}
            <span className="text-transparent bg-clip-text bg-green-600">
              Used Tractors
            </span>
          </h2>
          <div className="mt-2 border-b border-gray-200">
            <span className="inline-block text-sm font-semibold text-green-700 border-b-2 border-green-700 pb-2 px-1">
              Best Value Comparisons
            </span>
          </div>
        </div>
       <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-12">

          {SUGGESTED_COMPARISONS.map((pair, index) => (
            <div
              key={index}
              className="bg-white border border-gray-100 rounded-xl p-2.5 sm:p-4 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="relative border border-gray-200 rounded-lg overflow-hidden mb-3 w-full h-24 sm:h-36">
                  <div className="grid grid-cols-2 gap-0 h-full w-full relative">
                    <div className="w-full h-full flex items-center justify-center">
                      <img
                        src={pair.left.image}
                        alt={pair.left.name}
                        className="w-full h-full object-cover relative z-10"
                      />
                    </div>
                    <div className="w-full h-full flex items-center justify-center">
                      <img
                        src={pair.right.image}
                        alt={pair.right.name}
                        className="w-full h-full object-cover relative z-10"
                      />
                    </div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-700 text-white text-[9px] sm:text-[10px] font-black w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center border-2 border-white shadow-md z-20">
                    VS
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1 mb-3 px-0.5 text-xs sm:text-sm">
                  <div className="text-left">
                    <p className="font-semibold text-gray-800 truncate">
                      {pair.left.name}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-600 mt-0.5">
                      From{" "}
                      <span className="font-semibold text-gray-700">
                        {pair.left.price}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800 truncate">
                      {pair.right.name}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-600 mt-0.5">
                      From{" "}
                      <span className="font-semibold text-gray-700">
                        {pair.right.price}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <Link to="/tractorcompare">
              <button className="w-full cursor-pointer border border-green-200 bg-white hover:bg-green-50 text-green-700 transition-colors duration-150 text-[10px] sm:text-xs font-semibold py-1.5 px-2 rounded-md text-center truncate">
                {pair.buttonText}
              </button>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* ========== ABOUT SECTION ========== */}
      <div className="relative bg-white overflow-hidden border-t border-gray-400">
        <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pt-12 md:pt-16 lg:pt-20 relative z-10">
          <div className="text-center mb-10">
           
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
              About <span className="text-green-700">Krushi Mall</span>
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-sm md:text-base leading-relaxed">
              Krushi Mall is an ecosystem designed to optimize agricultural
              trade management. Discover, track, process, and evaluate catalog
              units across local machinery ecosystems, implements, livestock
              assets, and bulk marketplace segments.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Users,
                title: "Expert Assistance",
                desc: "Strategic coordination desks accessible across structured operations timelines.",
              },
              {
                icon: BadgeCheck,
                title: "Sell Inventory",
                desc: "Promote and distribute used listings straight to target regional networks.",
              },
              {
                icon: ShoppingBag,
                title: "Sourcing Desks",
                desc: "Access diverse inventories across verified tractor frames and functional elements.",
              },
              {
                icon: Package,
                title: "Central Equipment Pool",
                desc: "From utility assemblies to processing gear, everything curated under precise standards.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group bg-white rounded-2xl border border-gray-200 p-6 text-center relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-green-700 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <feature.icon className="h-6 w-6 text-green-700" />
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========== ENQUIRY FORM SECTION ========== */}
      <section id="enquiry-form" className="bg-gray-50 pt-12 md:pt-16 lg:pt-20">
       <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46">

          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <Phone className="h-4 w-4" />
                <span>Quick Enquiry</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-4 leading-tight">
                Get the Best Deal on{" "}
                <span className="text-green-600">Used Tractors</span>
              </h2>
              <p className="text-gray-500 text-sm md:text-base mb-8 leading-relaxed">
                Fill in your details and our experts will help you find the
                perfect pre-owned tractor at the best price.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  {
                    icon: BadgeCheck,
                    title: "Certified Pre-owned",
                    desc: "120-point inspection",
                  },
                  {
                    icon: Shield,
                    title: "6-Month Warranty",
                    desc: "On engine & transmission",
                  },
                  {
                    icon: Clock,
                    title: "24-Hour Response",
                    desc: "Quick callback from team",
                  },
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {feature.title}
                      </p>
                      <p className="text-xs text-gray-500">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-green-700 rounded-xl p-5 text-white">
                <p className="text-sm font-semibold mb-2">
                  Need Immediate Help?
                </p>
                <a
                  href="tel:+911234567890"
                  className="flex items-center gap-2 text-lg font-bold hover:text-green-200 transition-colors"
                >
                  <Phone className="h-5 w-5" />
                  +91 12345 67890
                </a>
                <p className="text-xs text-green-100 mt-1">
                  Available Mon-Sat, 9AM-7PM
                </p>
              </div>
            </div>
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Enquiry Sent Successfully!
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      We'll contact you within 24 hours with the best deals.
                    </p>
                    <div className="flex items-center justify-center gap-1 text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400" />
                      ))}
                      <span className="text-sm text-gray-500 ml-1">
                        4.8/5 Customer Rating
                      </span>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Full Name <span className="text-red-600">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full pl-10 pr-3 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none bg-gray-50 hover:bg-white transition-colors"
                            placeholder="Enter your full name"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Phone Number <span className="text-red-600">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="tel"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full pl-10 pr-3 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none bg-gray-50 hover:bg-white transition-colors"
                            placeholder="+91 XXXXX XXXXX"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Email Address <span className="text-red-600">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none bg-gray-50 hover:bg-white transition-colors"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    {/* Tractor Type */}
                   <div>
  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
    Interested In <span className="text-red-600">*</span>
  </label>
  <RadioGroup value={formData.tractorType} onChange={(value) => setFormData({...formData, tractorType: value})}>
    <RadioGroup.Option value="used">
      {({ checked }) => (
        <div className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer ${checked ? "border-green-600 bg-green-50" : "border-gray-200 bg-white"}`}>
          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${checked ? "border-green-600 bg-green-600" : "border-gray-300"}`}>
            {checked && <Check className="h-3 w-3 text-white" />}
          </div>
          <span className="text-sm font-medium text-gray-900">Used Tractor</span>
        </div>
      )}
    </RadioGroup.Option>
  </RadioGroup>
</div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Message{" "}
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <textarea
                          name="message"
                          rows={3}
                          value={formData.message}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none bg-gray-50 hover:bg-white transition-colors resize-none"
                          placeholder="Tell us your budget, preferred brand, model..."
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-sm shadow-lg shadow-green-700/20 hover:shadow-green-700/30"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Submit Enquiry Now
                        </>
                      )}
                    </button>
                    <p className="text-xs text-center text-gray-400">
                      We respect your privacy. Your details are safe with us.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FAQ SECTION ========== */}
      <section className="bg-gray-50 pt-12 md:pt-16 lg:pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <HelpCircle className="h-4 w-4" />
              <span>Frequently Asked Questions</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
              Got Questions?{" "}
              <span className="text-green-600">We've Got Answers</span>
            </h2>
            <p className="text-gray-500 text-sm max-w-2xl mx-auto">
              Everything about buying certified pre-owned tractors
            </p>
          </div>
          <div className="space-y-3">
            {FAQ_DATA.map((faq, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl border transition-all duration-300 ${openIndex === index ? "border-green-600 shadow-md" : "border-gray-200 hover:border-gray-300 shadow-sm"}`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${openIndex === index ? "bg-green-100" : "bg-gray-100"}`}
                    >
                      <MessageCircle
                        className={`h-4 w-4 transition-colors ${openIndex === index ? "text-green-600" : "text-gray-400"}`}
                      />
                    </div>
                    <span
                      className={`text-sm sm:text-base font-semibold transition-colors ${openIndex === index ? "text-green-700" : "text-gray-900"}`}
                    >
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 flex-shrink-0 transition-transform duration-300 ${openIndex === index ? "rotate-180 text-green-600" : ""}`}
                  />
                </button>
                <div
                  className={`transition-all duration-300 overflow-hidden ${openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <div className="px-5 pb-4 pl-16">
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8 p-6 bg-green-700 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-2">
              Still Have Questions?
            </h3>
            <p className="text-green-100 text-sm mb-4">
              Our used tractor experts are ready to help
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="tel:+911234567890"
                className="inline-flex items-center gap-2 bg-white text-green-700 font-semibold px-5 py-2.5 rounded-lg hover:bg-green-50 transition-colors text-sm"
              >
                <Phone className="h-4 w-4" />
                Call Expert
              </a>
              <a
                href="#enquiry-form"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById("enquiry-form");
                  if (element) {
                    const offset = 100; // Navbar height offset
                    const elementPosition =
                      element.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - offset;
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: "smooth",
                    });
                  }
                }}
                className="inline-flex items-center gap-2 bg-green-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-green-800 transition-colors text-sm border border-green-500 cursor-pointer"
              >
                <MessageCircle className="h-4 w-4" />
                Send Enquiry
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TRUST BADGES ========== */}
      <div className="bg-white">
        <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 py-12">

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              {
                icon: BadgeCheck,
                title: "Certified Pre-owned",
                desc: "Expert Field Verified",
              },
              {
                icon: Shield,
                title: "6-Month Warranty",
                desc: "On Engine & Transmission",
              },
              {
                icon: Clock,
                title: "Free Evaluation",
                desc: "Before Delivery",
              },
              {
                icon: Sparkles,
                title: "Best Value",
                desc: "Price Match Promise",
              },
            ].map((badge, idx) => (
              <div
                key={idx}
                className="group relative bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-green-700"></div>
                <div className="p-5 text-center">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-green-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <badge.icon className="h-7 w-7 text-green-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-base mb-1">
                    {badge.title}
                  </h3>
                  <p className="text-xs text-gray-500">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsedTractors;
