import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Listbox } from "@headlessui/react";
import {
  Tractor,
  MapPin,
  Heart,
  Star,
  Fuel,
  Gauge,
  Calendar,
  Sparkles,
  ArrowRight,
  BadgeCheck,
  Shield,
  Clock,
  Phone,
  Filter,
  Search,
  ChevronDown,
  Check,
} from "lucide-react";

const TractorList = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "new"; // 'new' or 'used'
  const brandFilter = searchParams.get("brand");
  const section = searchParams.get("section"); // 'popular', 'latest', 'upcoming', 'recent', 'deals'

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState(brandFilter || "");
  const [selectedHp, setSelectedHp] = useState("");
  const [priceRange, setPriceRange] = useState([
    0,
    type === "new" ? 1000000 : 600000,
  ]);
  const [sortBy, setSortBy] = useState("popular");

  useEffect(() => {
    setSelectedBrand(brandFilter || "");
    setSelectedHp(""); // clear HP when coming from a brand link
  }, [brandFilter]);

  useEffect(() => {
    setSelectedHp(""); // clear HP whenever brand changes
  }, [selectedBrand]);

  // Debug: Log the URL parameters
  useEffect(() => {
    console.log(
      "URL params - type:",
      type,
      "section:",
      section,
      "brand:",
      brandFilter,
    );
    console.log("Current tractors:", currentTractors);
    console.log("tractorsData[type]:", tractorsData[type]);
    console.log("tractorsData[type][section]:", tractorsData[type]?.[section]);
  }, [type, section, brandFilter]);

  // Tractor data based on type
  const tractorsData = {
    new: {
      popular: [
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
      ],
      latest: [
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
      ],
      upcoming: [
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
      ],
    },
    used: {
      popular: [
        {
          id: 101,
          name: "Mahindra 575 DI",
          brand: "Mahindra",
          price: 385000,
          hp: "45 HP",
          fuel: "Diesel",
          year: "2020",
          location: "Delhi",
          image: "/mah.png",
          rating: 4.6,
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
        },
        {
          id: 105,
          name: "New Holland 3630 TX",
          brand: "New Holland",
          price: 475000,
          hp: "50 HP",
          fuel: "Diesel",
          year: "2021",
          location: "Lucknow, UP",
          image: "/mah.png",
          rating: 4.6,
        },
        {
          id: 106,
          name: "TAFE 5900 DI",
          brand: "TAFE",
          price: 355000,
          hp: "42 HP",
          fuel: "Diesel",
          year: "2018",
          location: "Chennai, TN",
          image: "/mah.png",
          rating: 4.3,
        },
      ],
      recent: [
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
        },
        {
          id: 110,
          name: "Preet 3549",
          brand: "Preet",
          price: 345000,
          hp: "49 HP",
          fuel: "Diesel",
          year: "2020",
          location: "Chandigarh",
          image: "/mah.png",
          rating: 4.3,
        },
        {
          id: 111,
          name: "Sonalika DI 750 III",
          brand: "Sonalika",
          price: 365000,
          hp: "50 HP",
          fuel: "Diesel",
          year: "2019",
          location: "Bhopal, MP",
          image: "/mah.png",
          rating: 4.4,
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
        },
      ],
      deals: [
        {
          id: 113,
          name: "John Deere 5050D",
          brand: "John Deere",
          price: 455000,
          hp: "50 HP",
          fuel: "Diesel",
          year: "2020",
          location: "Punjab",
          image: "/mah.png",
          rating: 4.7,
        },
        {
          id: 114,
          name: "Mahindra 265 DI",
          brand: "Mahindra",
          price: 275000,
          hp: "35 HP",
          fuel: "Diesel",
          year: "2018",
          location: "Haryana",
          image: "/mah.png",
          rating: 4.2,
        },
        {
          id: 115,
          name: "Swaraj 855 FE",
          brand: "Swaraj",
          price: 395000,
          hp: "55 HP",
          fuel: "Diesel",
          year: "2019",
          location: "Maharashtra",
          image: "/mah.png",
          rating: 4.4,
        },
        {
          id: 116,
          name: "New Holland 4710",
          brand: "New Holland",
          price: 405000,
          hp: "47 HP",
          fuel: "Diesel",
          year: "2020",
          location: "Gujarat",
          image: "/mah.png",
          rating: 4.5,
        },
        {
          id: 117,
          name: "Farmtrac 45",
          brand: "Farmtrac",
          price: 315000,
          hp: "45 HP",
          fuel: "Diesel",
          year: "2019",
          location: "Rajasthan",
          image: "/mah.png",
          rating: 4.3,
        },
        {
          id: 118,
          name: "TAFE 45 DI",
          brand: "TAFE",
          price: 305000,
          hp: "45 HP",
          fuel: "Diesel",
          year: "2018",
          location: "Tamil Nadu",
          image: "/mah.png",
          rating: 4.2,
        },
      ],
    },
  };

  // Get current tractors based on section
  let currentTractors = [];
  if (section) {
    currentTractors = tractorsData[type][section] || [];
  } else {
    // If no section, combine all
    currentTractors = [
      ...(tractorsData[type].popular || []),
      ...(tractorsData[type].latest || []),
      ...(tractorsData[type].upcoming || []),
      ...(tractorsData[type].recent || []),
      ...(tractorsData[type].deals || []),
    ];
  }

  console.log("selectedBrand:", selectedBrand);
  console.log("selectedHp:", selectedHp);
  // Filter tractors
  const filteredTractors = currentTractors.filter((tractor) => {
    if (selectedBrand && tractor.brand !== selectedBrand) return false;
    if (selectedHp && tractor.hp !== selectedHp) return false;
    if (
      searchQuery &&
      !tractor.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !tractor.brand.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    if (tractor.price < priceRange[0] || tractor.price > priceRange[1])
      return false;
    return true;
  });

  // Sort tractors
  const sortedTractors = [...filteredTractors].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "newest") return b.year - a.year;
    return 0; // popular - default order
  });

  const brandOptions = [
    "All Brands",
    ...new Set(currentTractors.map((t) => t.brand)),
  ];
  const hpOptions = [
    "All HP",
    ...new Set(
      currentTractors
        .filter((tractor) => !selectedBrand || tractor.brand === selectedBrand)
        .map((tractor) => tractor.hp),
    ),
  ];
  const maxPrice = type === "new" ? 1000000 : 600000;

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedBrand("");
    setSelectedHp("");
    setPriceRange([0, maxPrice]);
    setSortBy("popular");
  };

  console.log("selectedBrand:", selectedBrand);
  console.log("selectedHp:", selectedHp);
  console.log("currentTractors:", currentTractors);
  console.log("filteredTractors:", filteredTractors);
  console.log("sortedTractors:", sortedTractors);

  const TractorCard = ({ tractor }) => (
    <div className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      <Link to={`/tractor/${tractor.id}`} className="block">
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <img
            src={tractor.image}
            alt={tractor.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-2 left-2">
            <span
              className={`text-white text-[10px] font-bold px-2 py-0.5 rounded-full ${type === "new" ? "bg-green-600" : "bg-green-600"}`}
            >
              {type === "new" ? "New" : "Pre-owned"}
            </span>
          </div>
          <button className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow hover:bg-gray-100">
            <Heart className="h-3.5 w-3.5 cursor-pointer text-gray-500 hover:text-green-500" />
          </button>
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/tractor/${tractor.id}`} className="block">
          <div className="flex items-center justify-between mb-3">
            <span
              className={`text-xs font-semibold ${type === "new" ? "text-green-600" : "text-green-600"}`}
            >
              {tractor.brand}
            </span>
            <div className="flex items-center gap-1 text-xs text-gray-500 ">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{tractor.location}</span>
            </div>
          </div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-1 hover:text-green-600 transition-colors">
              {tractor.name}
            </h3>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-semibold text-gray-700">
                {tractor.rating}
              </span>
            </div>
          </div>
        </Link>

        <div className="mt-auto pt-2 border-t">
          <div className="flex items-center justify-between">
            <p className="text-base font-black text-gray-900">
              ₹{tractor.price.toLocaleString()}
            </p>
            <Link
              to={`/tractor/${tractor.id}`}
              className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  const getTitle = () => {
    if (selectedBrand) {
      return `${selectedBrand} ${type === "new" ? "New" : "Used"} Tractors`;
    }
    if (section === "popular")
      return `Popular ${type === "new" ? "New" : "Used"} Tractors`;
    if (section === "latest") return "Latest New Tractors";
    if (section === "upcoming") return "Upcoming New Tractors";
    if (section === "recent") return "Recently Added Used Tractors";
    if (section === "deals") return "Best Value Used Tractor Deals";
    return `${type === "new" ? "New" : "Used"} Tractors`;
  };

  return (
    <div className=" bg-gray-50 pt-2 xl:mt-4">
      <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pt-6 pb-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{getTitle()}</h1>
          <p className="text-gray-500 mt-1">
            Showing {sortedTractors.length}tractors
          </p>
          {selectedBrand && (
            <div className="mt-2 inline-flex items-center gap-2 bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm">
              <span>Filtered by: {selectedBrand}</span>
              <button
                onClick={() => setSelectedBrand("")}
                className="hover:text-green-800"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* Filter Bar */}
        {/* Filter Bar - Headless UI */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input - Keep as is */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
            </div>

            {/* Brand Select - Headless UI Listbox */}
            <Listbox value={selectedBrand} onChange={setSelectedBrand}>
              <div className="relative">
                <Listbox.Button className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-left focus:ring-2 focus:ring-green-500 outline-none bg-white flex items-center justify-between">
                  <span
                    className={
                      selectedBrand ? "text-gray-900" : "text-gray-400"
                    }
                  >
                    {selectedBrand || "All Brands"}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </Listbox.Button>
                <Listbox.Options className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto py-1 text-sm">
                  <Listbox.Option
                    value=""
                    className={({ active }) =>
                      `cursor-pointer px-3 py-2 ${active ? "bg-green-50 text-green-700" : "text-gray-700"}`
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
                          `cursor-pointer px-3 py-2 flex items-center justify-between ${active ? "bg-green-50 text-green-700" : "text-gray-700"} ${selected ? "bg-green-100 font-medium" : ""}`
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

            {/* HP Select - Headless UI Listbox */}
            <Listbox value={selectedHp} onChange={setSelectedHp}>
              <div className="relative">
                <Listbox.Button className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-left focus:ring-2 focus:ring-green-500 outline-none bg-white flex items-center justify-between">
                  <span
                    className={selectedHp ? "text-gray-900" : "text-gray-400"}
                  >
                    {selectedHp || "All HP"}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </Listbox.Button>
                <Listbox.Options className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto py-1 text-sm">
                  <Listbox.Option
                    value=""
                    className={({ active }) =>
                      `cursor-pointer px-3 py-2 ${active ? "bg-green-50 text-green-700" : "text-gray-700"}`
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
                          `cursor-pointer px-3 py-2 flex items-center justify-between ${active ? "bg-green-50 text-green-700" : "text-gray-700"} ${selected ? "bg-green-100 font-medium" : ""}`
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

            {/* Sort Select - Headless UI Listbox */}
            <Listbox value={sortBy} onChange={setSortBy}>
              <div className="relative">
                <Listbox.Button className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-left focus:ring-2 focus:ring-green-500 outline-none bg-white flex items-center justify-between">
                  <span className="text-gray-900">
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
                <Listbox.Options className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1 text-sm">
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
                        `cursor-pointer px-3 py-2 flex items-center justify-between ${active ? "bg-green-50 text-green-700" : "text-gray-700"} ${selected ? "bg-green-100 font-medium" : ""}`
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

        {/* Results */}
        {sortedTractors.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl">
            <Tractor className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No tractors found
            </h3>
            <p className="text-gray-500">Try changing your filters</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-green-600 hover:text-green-700"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 justify-items-center sm:justify-items-stretch">
            {sortedTractors.map((tractor, index) => (
              <TractorCard key={`${tractor.id}-${index}`} tractor={tractor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TractorList;
