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
  SlidersHorizontal,
  Check,
  Filter,
  ChevronDown,
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
import logo from "../assets/johnlogo.png";

const NewTractors = () => {
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
  const [selectedTransmission, setSelectedTransmission] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [sortBy, setSortBy] = useState("popular");
  const [openIndex, setOpenIndex] = useState(null);
  // Add this with other useState declarations:
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname.includes("old") ? "used" : "new";

  // Add these new states after your existing filter states:
  const [appliedFilters, setAppliedFilters] = useState({
    searchQuery: "",
    selectedBrand: "",
    selectedHp: "",
    selectedTransmission: "",
    selectedCategory: "",
    priceRange: [0, 1000000],
    sortBy: "popular",
  });

  // Add this function after clearFilters:
  const applyFilters = () => {
    setAppliedFilters({
      searchQuery,
      selectedBrand,
      selectedHp,
      selectedTransmission,
      selectedCategory,
      priceRange,
      sortBy,
    });
  };

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

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    tractorType: "new",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
          tractorType: "new",
        });
      }, 3000);
    }, 1500);
  };

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

  const FAQ_DATA = [
    {
      question: "What documents are required to buy a new tractor?",
      answer:
        "You'll need valid ID proof (Aadhaar Card/PAN Card), address proof, passport-size photographs, and land documents (if applying for agricultural loans). For financing, additional income proof and bank statements may be required.",
    },
    {
      question: "Do you offer tractor loans or EMI options?",
      answer:
        "Yes, we partner with leading banks and NBFCs to offer attractive financing options with EMI starting from as low as ₹8,999/month. You can get up to 90% financing with flexible tenure options from 12 to 60 months. Use our EMI calculator or contact our team for personalized options.",
    },
    {
      question: "Is there a warranty on new tractors?",
      answer:
        "Absolutely! All new tractors come with manufacturer warranty ranging from 2 to 5 years depending on the brand and model. This covers manufacturing defects and major components. Extended warranty options are also available for additional peace of mind.",
    },
    {
      question: "How long does delivery take after booking?",
      answer:
        "Most popular models are available for delivery within 7-14 days. For specific variants or custom configurations, delivery may take 2-4 weeks. We keep you updated throughout the process and provide temporary registration for immediate use if needed.",
    },
    {
      question: "Can I get a demo or test drive before purchasing?",
      answer:
        "Yes, we encourage customers to take a test drive. Simply fill the enquiry form or call our helpline, and we'll arrange a demo at your nearest dealership or even at your farm location, completely free of cost.",
    },
    {
      question: "Which tractor brand is best for my farming needs?",
      answer:
        "The best tractor depends on your specific requirements - farm size, soil type, crops grown, and implements used. Popular choices include Mahindra for all-round performance, John Deere for heavy-duty work, and Swaraj for fuel efficiency. Our experts can help you choose based on your exact needs after a free consultation.",
    },
    {
      question: "What is the price range of new tractors available?",
      answer:
        "New tractors in India range from approximately ₹4.5 lakhs for compact 20 HP models to ₹12+ lakhs for premium 60+ HP tractors. The price varies based on brand, horsepower, features, and transmission type. We offer tractors across all price segments with transparent pricing.",
    },
    {
      question: "Do you provide after-sales service and spare parts?",
      answer:
        "Yes, we have a robust after-sales network with authorized service centers across India. Genuine spare parts are readily available, and we offer annual maintenance contracts (AMC) for hassle-free tractor maintenance. Our service team is just a call away.",
    },
    {
      question: "Can I exchange my old tractor for a new one?",
      answer:
        "Yes, we offer attractive exchange bonuses on your old tractor. Our team will evaluate your existing tractor's condition, model, and age to provide the best exchange value, which can be adjusted against your new tractor purchase.",
    },
    {
      question: "What is the difference between 2WD and 4WD tractors?",
      answer:
        "2WD tractors are ideal for regular farming on flat terrain and are more fuel-efficient. 4WD tractors provide better traction and are recommended for heavy-duty tasks, hilly areas, or wet paddy fields. 4WD models typically cost 15-25% more but offer superior performance in challenging conditions.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const popularTractors = [
    {
      id: 2,
      name: "Mahindra 575 DI",
      brand: "Mahindra",
      price: 685000,
      hp: "45 HP",
      fuel: "Diesel",
      year: "2024",
      location: "Delhi",
      image: "/mah.png",
      rating: 4.8,
    },
    {
      id: 3,
      name: "John Deere 5310",
      brand: "John Deere",
      price: 895000,
      hp: "55 HP",
      fuel: "Diesel",
      year: "2024",
      location: "Jaipur, RJ",
      image: "/mah.png",
      rating: 4.9,
    },
    {
      id: 7,
      name: "Mahindra Arjun 605",
      brand: "Mahindra",
      price: 925000,
      hp: "60 HP",
      fuel: "Diesel",
      year: "2024",
      location: "Nagpur, MH",
      image: "/mah.png",
      rating: 4.9,
    },
    {
      id: 11,
      name: "Farmtrac 60 Powermaxx",
      brand: "Farmtrac",
      price: 715000,
      hp: "50 HP",
      fuel: "Diesel",
      year: "2024",
      location: "Ahmedabad, GJ",
      image: "/mah.png",
      rating: 4.6,
    },
    {
      id: 1,
      name: "Swaraj 744 FE",
      brand: "Swaraj",
      price: 725000,
      hp: "48 HP",
      fuel: "Diesel",
      year: "2024",
      location: "Pune, MH",
      image: "/mah.png",
      rating: 4.7,
    },
    {
      id: 5,
      name: "New Holland 3630 TX",
      brand: "New Holland",
      price: 775000,
      hp: "50 HP",
      fuel: "Diesel",
      year: "2024",
      location: "Lucknow, UP",
      image: "/mah.png",
      rating: 4.8,
    },
  ];

  const latestTractors = [
    {
      id: 1,
      name: "Swaraj 744 FE",
      brand: "Swaraj",
      price: 725000,
      hp: "48 HP",
      fuel: "Diesel",
      year: "2024",
      location: "Pune, MH",
      image: "/mah.png",
      rating: 4.7,
    },
    {
      id: 4,
      name: "TAFE 5900 DI",
      brand: "TAFE",
      price: 595000,
      hp: "42 HP",
      fuel: "Diesel",
      year: "2024",
      location: "Chennai, TN",
      image: "/mah.png",
      rating: 4.6,
    },
    {
      id: 8,
      name: "Escorts Powertrac 439",
      brand: "Escorts",
      price: 545000,
      hp: "41 HP",
      fuel: "Diesel",
      year: "2024",
      location: "Faridabad, HR",
      image: "/mah.png",
      rating: 4.4,
    },
    {
      id: 10,
      name: "Eicher 380 Super DI",
      brand: "Eicher",
      price: 525000,
      hp: "40 HP",
      fuel: "Diesel",
      year: "2024",
      location: "Indore, MP",
      image: "/mah.png",
      rating: 4.5,
    },
    {
      id: 12,
      name: "Preet 3549",
      brand: "Preet",
      price: 585000,
      hp: "49 HP",
      fuel: "Diesel",
      year: "2024",
      location: "Chandigarh",
      image: "/mah.png",
      rating: 4.4,
    },
    {
      id: 2,
      name: "Mahindra 575 DI",
      brand: "Mahindra",
      price: 685000,
      hp: "45 HP",
      fuel: "Diesel",
      year: "2024",
      location: "Delhi",
      image: "/mah.png",
      rating: 4.8,
    },
  ];

  const upcomingTractors = [
    {
      id: 5,
      name: "New Holland 3630 TX",
      brand: "New Holland",
      price: 775000,
      hp: "50 HP",
      fuel: "Diesel",
      year: "2024",
      location: "Lucknow, UP",
      image: "/mah.png",
      rating: 4.8,
    },
    {
      id: 6,
      name: "Sonalika DI 750 III",
      brand: "Sonalika",
      price: 635000,
      hp: "50 HP",
      fuel: "Diesel",
      year: "2024",
      location: "Bhopal, MP",
      image: "/mah.png",
      rating: 4.5,
    },
    {
      id: 9,
      name: "Kubota NeoStar A211N",
      brand: "Kubota",
      price: 495000,
      hp: "21 HP",
      fuel: "Diesel",
      year: "2024",
      location: "Bangalore, KA",
      image: "/mah.png",
      rating: 4.3,
    },
    {
      id: 3,
      name: "John Deere 5310",
      brand: "John Deere",
      price: 895000,
      hp: "55 HP",
      fuel: "Diesel",
      year: "2024",
      location: "Jaipur, RJ",
      image: "/mah.png",
      rating: 4.9,
    },
    {
      id: 7,
      name: "Mahindra Arjun 605",
      brand: "Mahindra",
      price: 925000,
      hp: "60 HP",
      fuel: "Diesel",
      year: "2024",
      location: "Nagpur, MH",
      image: "/mah.png",
      rating: 4.9,
    },
    {
      id: 1,
      name: "Swaraj 744 FE",
      brand: "Swaraj",
      price: 725000,
      hp: "48 HP",
      fuel: "Diesel",
      year: "2024",
      location: "Pune, MH",
      image: "/mah.png",
      rating: 4.7,
    },
  ];

  const allTractors = [
    ...popularTractors,
    ...latestTractors,
    ...upcomingTractors,
  ];
  const brandOptions = [
    "All Brands",
    ...new Set(allTractors.map((t) => t.brand)),
  ];
  const hpOptions = ["All HP", ...new Set(allTractors.map((t) => t.hp))];
  const transmissionOptions = [
    "All Transmissions",
    "Manual",
    "Synchronous",
    "Constant Mesh",
  ];
  const categoryOptions = ["All Categories", "Small", "Medium", "Big"];
  const maxPrice = 1000000;

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedBrand("");
    setSelectedHp("");
    setSelectedTransmission("");
    setSelectedCategory("");
    setPriceRange([0, maxPrice]);
    setSortBy("popular");
    setAppliedFilters({
      searchQuery: "",
      selectedBrand: "",
      selectedHp: "",
      selectedTransmission: "",
      selectedCategory: "",
      priceRange: [0, maxPrice],
      sortBy: "popular",
    });
  };
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
    intervalRef.current = setInterval(() => {
      setPopularIndex((prev) => (prev + 1) % popularTractors.length);
      setLatestIndex((prev) => (prev + 1) % latestTractors.length);
      setUpcomingIndex((prev) => (prev + 1) % upcomingTractors.length);
    }, 3000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const getVisibleTractors = (tractors, startIndex) => {
    const visible = [];
    for (let i = 0; i < cardsToShow; i++) {
      visible.push(tractors[(startIndex + i) % tractors.length]);
    }
    return visible;
  };

  const slideNext = (setIndex, length) => {
    setIndex((prev) => (prev + 1) % length);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setPopularIndex((prev) => (prev + 1) % popularTractors.length);
      setLatestIndex((prev) => (prev + 1) % latestTractors.length);
      setUpcomingIndex((prev) => (prev + 1) % upcomingTractors.length);
    }, 3000);
  };

  const slidePrev = (setIndex, length) => {
    setIndex((prev) => (prev - 1 + length) % length);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setPopularIndex((prev) => (prev + 1) % popularTractors.length);
      setLatestIndex((prev) => (prev + 1) % latestTractors.length);
      setUpcomingIndex((prev) => (prev + 1) % upcomingTractors.length);
    }, 3000);
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
    // Clone first 2 cards for smooth infinite loop on mobile
    const extendedTractors = [...tractors, ...tractors.slice(0, 2)];
    
    return (
      <div className="">
        {/* Title Layout Spacing Fixed */}
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

        {/* MOBILE ONLY - 1.5 cards sliding */}
        <div className="sm:hidden relative">
          <div className="overflow-hidden px-8">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
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
                  <TractorCard tractor={tractor} />
                </div>
              ))}
            </div>
          </div>

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
            className="absolute right-0  top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center hover:bg-green-50 hover:border-green-300 transition-all"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative text-white min-h-[600px] md:min-h-[650px] flex items-center overflow-hidden">
        {/* Full Section Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1920&auto=format&fit=crop&q=90"
            alt="Tractor in golden field"
            className="w-full h-full object-cover object-center"
          />
          {/* Lighter overlay - image more visible but text still readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 via-gray-900/40 to-gray-900/20" />
        </div>

        <div className="max-w-[1440px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 py-16 md:py-20 lg:py-24 relative z-10 w-full">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link
              to="/"
              className="text-green-400 hover:text-green-300 font-medium drop-shadow-md"
            >
              Home
            </Link>
            <span className="text-white/70 drop-shadow-md">/</span>
            <span className="text-green-400 font-medium drop-shadow-md">
              New Tractors
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left side - Text content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-full mb-6 shadow-lg">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-semibold">
                  Brand New Collection 2024
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight drop-shadow-lg">
                Find Your Perfect{" "}
                <span className="text-green-300 drop-shadow-lg">
                  New Tractor
                </span>
              </h1>
              <p className="text-white/90 text-base md:text-lg mb-6 max-w-xl drop-shadow-md">
                Explore the latest tractors from all major brands. Best prices,
                warranty included, and easy financing options available.
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
            {/* Right side - Filter Panel */}
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
                {/* ✅ NEW: Tractor Type Toggle */}
                {/* Tractor Type Toggle - Headless UI RadioGroup */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tractor Type
                  </label>
                  <RadioGroup
                    value={activeTab}
                    onChange={(value) => {
                      if (
                        value === "new" &&
                        location.pathname !== "/new-tractors"
                      ) {
                        navigate("/new-tractors");
                      } else if (
                        value === "used" &&
                        location.pathname !== "/old-tractors"
                      ) {
                        navigate("/old-tractors");
                      }
                    }}
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <RadioGroup.Option value="new">
                        {({ checked }) => (
                          <div
                            className={`flex items-center justify-center cursor-pointer gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 border-2 ${
                              checked
                                ? "bg-green-600 text-white border-green-600 shadow-lg shadow-green-600/20"
                                : "bg-white text-gray-700 border-gray-200 hover:border-green-300 hover:bg-green-50"
                            }`}
                          >
                            <Tractor className="h-4 w-4" />
                            New
                          </div>
                        )}
                      </RadioGroup.Option>
                      <RadioGroup.Option value="used">
                        {({ checked }) => (
                          <div
                            className={`flex items-center justify-center cursor-pointer gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 border-2 ${
                              checked
                                ? "bg-green-600 text-white border-green-600 shadow-lg shadow-green-600/20"
                                : "bg-white text-gray-700 border-gray-200 hover:border-green-300 hover:bg-green-50"
                            }`}
                          >
                            <Gauge className="h-4 w-4" />
                            Used
                          </div>
                        )}
                      </RadioGroup.Option>
                    </div>
                  </RadioGroup>
                </div>{" "}
                {/* Search Box - existing code continues */}
                <div className="mb-4">
                  {" "}
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
                  {/* Brand Select */}
                  {/* Brand Select - Headless UI Listbox */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Brand
                    </label>
                    <Listbox value={selectedBrand} onChange={setSelectedBrand}>
                      <div className="relative">
                        <Listbox.Button className="w-full pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm text-left focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none bg-gray-50 hover:bg-white cursor-pointer">
                          <span
                            className={
                              selectedBrand ? "text-gray-900" : "text-gray-400"
                            }
                          >
                            {selectedBrand || "All Brands"}
                          </span>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </Listbox.Button>
                        <Listbox.Options className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto py-1 text-sm">
                          <Listbox.Option
                            value=""
                            className={({ active }) =>
                              `cursor-pointer px-4 py-2.5 ${active ? "bg-green-50 text-green-700" : "text-gray-700"}`
                            }
                          >
                            All Brands
                          </Listbox.Option>
                          {brandOptions
                            .filter((b) => b !== "All Brands")
                            .map((brand) => (
                              <Listbox.Option
                                key={brand}
                                value={brand}
                                className={({ active, selected }) =>
                                  `cursor-pointer px-4 py-2.5 flex items-center justify-between ${
                                    active
                                      ? "bg-green-50 text-green-700"
                                      : "text-gray-700"
                                  } ${selected ? "bg-green-100 font-medium" : ""}`
                                }
                              >
                                {({ selected }) => (
                                  <>
                                    <span>{brand}</span>
                                    {selected && (
                                      <Check className="h-4 w-4 text-green-600" />
                                    )}
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                        </Listbox.Options>
                      </div>
                    </Listbox>
                  </div>
                  {/* HP Select */}
                  {/* HP Select - Headless UI Listbox */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      HP Range
                    </label>
                    <Listbox value={selectedHp} onChange={setSelectedHp}>
                      <div className="relative">
                        <Listbox.Button className="w-full pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm text-left focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none bg-gray-50 hover:bg-white cursor-pointer">
                          <span
                            className={
                              selectedHp ? "text-gray-900" : "text-gray-400"
                            }
                          >
                            {selectedHp || "All HP"}
                          </span>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </Listbox.Button>
                        <Listbox.Options className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto py-1 text-sm">
                          <Listbox.Option
                            value=""
                            className={({ active }) =>
                              `cursor-pointer px-4 py-2.5 ${active ? "bg-green-50 text-green-700" : "text-gray-700"}`
                            }
                          >
                            All HP
                          </Listbox.Option>
                          {hpOptions
                            .filter((hp) => hp !== "All HP")
                            .map((hp) => (
                              <Listbox.Option
                                key={hp}
                                value={hp}
                                className={({ active, selected }) =>
                                  `cursor-pointer px-4 py-2.5 flex items-center justify-between ${active ? "bg-green-50 text-green-700" : "text-gray-700"} ${selected ? "bg-green-100 font-medium" : ""}`
                                }
                              >
                                {({ selected }) => (
                                  <>
                                    <span>{hp}</span>
                                    {selected && (
                                      <Check className="h-4 w-4 text-green-600" />
                                    )}
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                        </Listbox.Options>
                      </div>
                    </Listbox>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {/* Transmission Filter */}
                  {/* Transmission - Headless UI Listbox */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Transmission
                    </label>
                    <Listbox
                      value={selectedTransmission}
                      onChange={setSelectedTransmission}
                    >
                      <div className="relative">
                        <Listbox.Button className="w-full pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm text-left focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none bg-gray-50 hover:bg-white cursor-pointer">
                          <span
                            className={
                              selectedTransmission
                                ? "text-gray-900"
                                : "text-gray-400"
                            }
                          >
                            {selectedTransmission || "All Transmissions"}
                          </span>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </Listbox.Button>
                        <Listbox.Options className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto py-1 text-sm">
                          <Listbox.Option
                            value=""
                            className={({ active }) =>
                              `cursor-pointer px-4 py-2.5 ${active ? "bg-green-50 text-green-700" : "text-gray-700"}`
                            }
                          >
                            All Transmissions
                          </Listbox.Option>
                          {transmissionOptions
                            .filter((t) => t !== "All Transmissions")
                            .map((t) => (
                              <Listbox.Option
                                key={t}
                                value={t}
                                className={({ active, selected }) =>
                                  `cursor-pointer px-4 py-2.5 flex items-center justify-between ${active ? "bg-green-50 text-green-700" : "text-gray-700"} ${selected ? "bg-green-100 font-medium" : ""}`
                                }
                              >
                                {({ selected }) => (
                                  <>
                                    <span>{t}</span>
                                    {selected && (
                                      <Check className="h-4 w-4 text-green-600" />
                                    )}
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                        </Listbox.Options>
                      </div>
                    </Listbox>
                  </div>

                  {/* Category Filter */}
                  {/* Category - Headless UI Listbox */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Category
                    </label>
                    <Listbox
                      value={selectedCategory}
                      onChange={setSelectedCategory}
                    >
                      <div className="relative">
                        <Listbox.Button className="w-full pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm text-left focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none bg-gray-50 hover:bg-white cursor-pointer">
                          <span
                            className={
                              selectedCategory
                                ? "text-gray-900"
                                : "text-gray-400"
                            }
                          >
                            {selectedCategory || "All Categories"}
                          </span>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </Listbox.Button>
                        <Listbox.Options className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto py-1 text-sm">
                          <Listbox.Option
                            value=""
                            className={({ active }) =>
                              `cursor-pointer px-4 py-2.5 ${active ? "bg-green-50 text-green-700" : "text-gray-700"}`
                            }
                          >
                            All Categories
                          </Listbox.Option>
                          {categoryOptions
                            .filter((c) => c !== "All Categories")
                            .map((c) => (
                              <Listbox.Option
                                key={c}
                                value={c}
                                className={({ active, selected }) =>
                                  `cursor-pointer px-4 py-2.5 flex items-center justify-between ${active ? "bg-green-50 text-green-700" : "text-gray-700"} ${selected ? "bg-green-100 font-medium" : ""}`
                                }
                              >
                                {({ selected }) => (
                                  <>
                                    <span>{c}</span>
                                    {selected && (
                                      <Check className="h-4 w-4 text-green-600" />
                                    )}
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                        </Listbox.Options>
                      </div>
                    </Listbox>
                  </div>
                </div>
                {/* Price Range Slider */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Budget (₹)
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max={maxPrice}
                      step="50000"
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
                {/* Active Filters Summary */}
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
      <div className="bg-white border-b border-gray-200 lg:mt-6 sticky top-16 z-30">
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
                      {sortBy === "popular"
                        ? "Most Popular"
                        : sortBy === "price-low"
                          ? "Price: Low to High"
                          : sortBy === "price-high"
                            ? "Price: High to Low"
                            : sortBy === "newest"
                              ? "Newest First"
                              : "Highest Rated"}
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
                            active
                              ? "bg-green-50 text-green-700"
                              : "text-gray-700"
                          } ${selected ? "bg-green-100 font-medium" : ""}`
                        }
                      >
                        {({ selected }) => (
                          <>
                            <span>{option.label}</span>
                            {selected && (
                              <Check className="h-4 w-4 text-green-600" />
                            )}
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

      {/* Slider Sections - Spacing classes fixed below to match old layout */}
      <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pt-16 md:pt-20 lg:pt-24">
        <div className="mb-8 md:mb-14 lg:mb-20">
          <SliderSection
            title="Popular Tractor"
            subtitle="Most loved by farmers"
            tractors={popularTractors}
            index={popularIndex}
            setIndex={setPopularIndex}
            linkTo="/tractors?type=new&section=popular"
            badgeColor="bg-green-700"
          />
        </div>

        <div className="mb-8 md:mb-14 lg:mb-20">
          <SliderSection
            title="Latest Tractor"
            subtitle="Just arrived in showroom"
            tractors={latestTractors}
            index={latestIndex}
            setIndex={setLatestIndex}
            linkTo="/tractors?type=new&section=latest"
            badgeColor="bg-green-700"
          />
        </div>

        <SliderSection
          title="Upcoming Tractors"
          subtitle="Coming soon - Pre-book now"
          tractors={upcomingTractors}
          index={upcomingIndex}
          setIndex={setUpcomingIndex}
          linkTo="/tractors?type=new&section=upcoming"
          badgeColor="bg-green-700"
        />
      </div>

      {/* Popular Brands Marquee Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 py-8 pt-16 md:pt-20 lg:pt-24">
          <h3 className="text-center text-2xl sm:text-3xl font-extrabold  text-gray-900 tracking-tight mb-6">
            Popular{" "}
            <span className="text-transparent  bg-clip-text bg-green-600 gap-3">
              Tractor Brands
            </span>
          </h3>
          <div className="relative overflow-hidden">
            <div className="flex gap-8 animate-marquee">
              {/* Double the brands for seamless loop */}
              {[...popularBrands, ...popularBrands].map((brand, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-2 flex-shrink-0 group cursor-pointer"
                >
                  {/* Brand circle with initials */}
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

      {/* --- POPULAR COMPARISON HANDPICKS --- */}

      <div className="border-t border-gray-200 w-full">
        <div className="w-full max-w-[1440px] xl:max-w-[1600px] 2xl:max-w-[1720px] px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pt-16 md:pt-20 lg:pt-24 mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
            Compare to buy{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-700">
              the right tractor
            </span>
          </h2>
          <div className="mt-2 mb-6 border-b border-gray-200">
            <span className="inline-block text-sm font-semibold text-green-700 border-b-2 border-green-700 pb-2 px-1">
              Tractor
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 xl:gap-5 pb-4">
            {SUGGESTED_COMPARISONS.map((pair, index) => (
              <div
                key={index}
                className="bg-white border border-gray-100 rounded-xl p-2.5 sm:p-4 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="relative border border-gray-200 rounded-lg overflow-hidden mb-3 w-full h-24 sm:h-36">
                    <div className="grid grid-cols-2 gap-0 h-full w-full relative">
                      <div className="w-full h-full flex items-center justify-center bg-cover bg-center">
                        <img
                          src={pair.left.image}
                          alt={pair.left.name}
                          className="w-full h-full object-cover relative z-10"
                        />
                      </div>
                      <div className="w-full h-full flex items-center justify-center bg-cover bg-center">
                        <img
                          src={pair.right.image}
                          alt={pair.right.name}
                          className="w-full h-full object-cover relative z-10"
                        />
                      </div>
                    </div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-900 text-white text-[9px] sm:text-[10px] font-black w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center border-2 border-white shadow-md z-20 select-none uppercase">
                      vs
                    </div>
                  </div>
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

      <div className="relative lg:mt-12 bg-white overflow-hidden border-t border-gray-400">
        <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pt-16 md:pt-20 lg:pt-24 relative z-10">
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
                iconBg: "bg-gray-50",
              },
              {
                icon: BadgeCheck,
                title: "Sell Inventory",
                desc: "Promote and distribute used listings straight to target regional networks.",
                iconBg: "bg-gray-50",
              },
              {
                icon: ShoppingBag,
                title: "Sourcing Desks",
                desc: "Access diverse inventories across verified tractor frames and functional elements.",
                iconBg: "bg-gray-50",
              },
              {
                icon: Package,
                title: "Central Equipment Pool",
                desc: "From utility assemblies to processing gear, everything curated under precise standards.",
                iconBg: "bg-gray-50",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group bg-white rounded-2xl border border-gray-200 p-6 text-center relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-green-700 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${feature.iconBg} border border-gray-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}
                >
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

      <section id="enquiry-form" className="bg-gray-50 pt-16 md:pt-20 lg:pt-24">
        <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46">
          <div className="grid lg:grid-cols-5 gap-6 lg:gap-12">
            {/* Left Side - Info */}
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <Phone className="h-4 w-4" />
                <span>Quick Enquiry</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-4 leading-tight">
                Get the Best Deal on{" "}
                <span className="text-green-600">Your Tractor</span>
              </h2>
              <p className="text-gray-500 text-sm md:text-base mb-8 leading-relaxed">
                Fill in your details and our tractor experts will contact you
                with the best prices, EMI options, and exclusive offers.
              </p>

              {/* Features */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                    <BadgeCheck className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Best Price Guarantee
                    </p>
                    <p className="text-xs text-gray-500">
                      We match any competitor's price
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      100% Genuine Products
                    </p>
                    <p className="text-xs text-gray-500">
                      Authorized dealer network
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      24-Hour Response
                    </p>
                    <p className="text-xs text-gray-500">
                      Quick callback from our team
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
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

            {/* Right Side - Form */}
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
                      {/* Name Field */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Full Name <span className="text-green-600">*</span>
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

                      {/* Phone Field */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Phone Number <span className="text-green-600">*</span>
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

                    {/* Email Field */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Email Address <span className="text-green-600">*</span>
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

                    {/* Tractor Type Radio - Headless UI */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Interested In <span className="text-green-600">*</span>
                      </label>
                      <RadioGroup
                        value={formData.tractorType}
                        onChange={(value) =>
                          setFormData({ ...formData, tractorType: value })
                        }
                      >
                        <RadioGroup.Option value="new">
                          {({ checked }) => (
                            <div
                              className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer ${checked ? "border-green-600 bg-green-50" : "border-gray-200 bg-white"}`}
                            >
                              <div
                                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${checked ? "border-green-600 bg-green-600" : "border-gray-300"}`}
                              >
                                {checked && (
                                  <Check className="h-3 w-3 text-white" />
                                )}
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                New Tractor
                              </span>
                            </div>
                          )}
                        </RadioGroup.Option>
                      </RadioGroup>
                    </div>
                    {/* Message Field */}
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
                          placeholder="Tell us about your requirements, budget, preferred brand..."
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
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

      <section className="bg-gray-50 pt-16 md:pt-20 lg:pt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
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
              Everything you need to know about buying a new tractor - from
              documentation to delivery
            </p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-3">
            {FAQ_DATA.map((faq, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl border transition-all duration-300 ${
                  openIndex === index
                    ? "border-green-600 shadow-md"
                    : "border-gray-200 hover:border-gray-300 shadow-sm"
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                        openIndex === index ? "bg-green-100" : "bg-gray-100"
                      }`}
                    >
                      <MessageCircle
                        className={`h-4 w-4 transition-colors ${
                          openIndex === index
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      />
                    </div>
                    <span
                      className={`text-sm sm:text-base font-semibold transition-colors ${
                        openIndex === index ? "text-green-700" : "text-gray-900"
                      }`}
                    >
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                      openIndex === index ? "rotate-180 text-green-600" : ""
                    }`}
                  />
                </button>
                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    openIndex === index
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
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

          {/* Still Have Questions */}
          <div className="text-center mt-8 p-6 bg-green-700 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-2">
              Still Have Questions?
            </h3>
            <p className="text-green-100 text-sm mb-4">
              Our tractor experts are ready to help you find the perfect tractor
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

      {/* Trust Badges */}
      <div className="bg-white">
        <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 py-12">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              {
                icon: BadgeCheck,
                title: "100% Genuine",
                desc: "Authorized Dealers",
                color: "from-green-600 to-green-700",
                bgColor: "bg-green-50",
              },
              {
                icon: Shield,
                title: "Full Warranty",
                desc: "Up to 5 Years",
                color: "from-green-600 to-green-700",
                bgColor: "bg-green-50",
              },
              {
                icon: Clock,
                title: "Fast Delivery",
                desc: "Within 7 Days",
                color: "from-green-600 to-green-700",
                bgColor: "bg-green-50",
              },
              {
                icon: Sparkles,
                title: "Best Price",
                desc: "Price Match Guarantee",
                color: "from-green-600 to-green-700",
                bgColor: "bg-green-50",
              },
            ].map((badge, idx) => (
              <div
                key={idx}
                className="group relative bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${badge.color}`}
                ></div>
                <div className="p-5 text-center">
                  <div
                    className={`w-14 h-14 mx-auto mb-3 rounded-xl ${badge.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
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
      <style>{`
        .slider-container:hover .slider-track {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default NewTractors;
