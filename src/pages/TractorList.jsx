import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Listbox } from "@headlessui/react";
import {
  Tractor,
  MapPin,
  Heart,
  Star,
  Search,
  ChevronDown,
  Check,
} from "lucide-react";
import apiHelper from "../utils/apiHelper";

const TractorList = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "new"; // 'new' or 'used'
  const brandFilter = searchParams.get("brand");
  const section = searchParams.get("section"); // 'popular', 'recent'/'latest', 'deals'

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState(brandFilter || "");
  const [selectedHp, setSelectedHp] = useState("");
  const [priceRange, setPriceRange] = useState([
  
  ]);
  const [sortBy, setSortBy] = useState("popular");
  const [newTractors, setNewTractors] = useState([]);
  const [usedTractors, setUsedTractors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real tractors from the backend — NEW or USED depending on `type`,
  // and for USED, the right section endpoint (popular/latest/best-value/all).
  useEffect(() => {
    const fetchNewTractors = async () => {
      try {
        const response = await apiHelper.get("/website-variants");
        const tractorList = response.data || [];

        const formattedTractors = tractorList.map((apiTractor) => ({
          id: apiTractor.id,
          name: apiTractor.productName || "Tractor",
          brand:
            apiTractor.brand?.brandName || apiTractor.brandName || "Brand",
          price: apiTractor.exShowroomPrice || 0,
          hp: apiTractor.horsePower ? `${apiTractor.horsePower} HP` : "N/A",
          fuel: "Diesel",
          year: apiTractor.modelYear?.modelYear || "2024",
          location: apiTractor.city || apiTractor.district || "Location",
          image: apiTractor.frontView
            ? apiHelper.image(apiTractor.frontView)
            : "/mah.png",
          rating: 4.5,
        }));

        setNewTractors(formattedTractors);
      } catch (error) {
        console.error("Error fetching new tractors:", error);
      }
    };

    const fetchUsedTractors = async () => {
      try {
        // Pick the right endpoint based on which "View All" was clicked.
        let endpoint = "/vendor-web/used-website-variant/public"; // default: all
        if (section === "popular") {
          endpoint = "/vendor-web/used-website-variant/popular";
        } else if (section === "recent" || section === "latest") {
          endpoint = "/vendor-web/used-website-variant/latest";
        } else if (section === "deals") {
          endpoint = "/vendor-web/used-website-variant/best-value";
        }

        const response = await apiHelper.get(endpoint);
        const tractorList = response.data || [];

        const formattedTractors = tractorList.map((apiTractor) => ({
          id: apiTractor.id,
          name: apiTractor.productName || "Tractor",
          brand: apiTractor.brandRef?.brandName || "Brand",
          price: apiTractor.expectedPrice || 0,
          hp: apiTractor.hp ? `${apiTractor.hp} HP` : "N/A",
          fuel: apiTractor.fuelType || "Diesel",
          year: apiTractor.manufacturingYear || "N/A",
          location: apiTractor.city || apiTractor.state || "Location",
          image: apiTractor.frontView
            ? apiHelper.image(apiTractor.frontView)
            : "/mah.png",
          rating: 4.5,
        }));

        setUsedTractors(formattedTractors);
      } catch (error) {
        console.error("Error fetching used tractors:", error);
      }
    };

    setLoading(true);
    if (type === "new") {
      fetchNewTractors().finally(() => setLoading(false));
    } else {
      fetchUsedTractors().finally(() => setLoading(false));
    }
    // Re-fetch whenever the type or section in the URL changes
    // (e.g. clicking a different "View All" link).
  }, [type, section]);

  useEffect(() => {
    setSelectedBrand(brandFilter || "");
    setSelectedHp(""); // clear HP when coming from a brand link
  }, [brandFilter]);

  useEffect(() => {
    setSelectedHp(""); // clear HP whenever brand changes
  }, [selectedBrand]);

  // Current tractors = real fetched data (no more hardcoded dummy arrays)
  const currentTractors = type === "new" ? newTractors : usedTractors;

  // Filter tractors
  const filteredTractors = currentTractors.filter((tractor) => {
    if (
      selectedBrand &&
      tractor.brand.toLowerCase() !== selectedBrand.toLowerCase()
    )
      return false;
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
useEffect(() => { 
  if (currentTractors.length > 0) { 
    const highest = Math.max(...currentTractors.map((t) => t.price)); 
    setPriceRange([0, highest]); 
  } 
}, [currentTractors]);
  const TractorCard = ({ tractor }) => (
    <div className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      <Link
        to={
          type === "new"
            ? `/tractor/${tractor.id}`
            : `/used-tractor/${tractor.id}`
        }
        className="block"
      >
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <img
            src={tractor.image}
            alt={tractor.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-2 left-2">
            <span className="text-white text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-600">
              {type === "new" ? "New" : "Pre-owned"}
            </span>
          </div>
          <button className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow hover:bg-gray-100">
            <Heart className="h-3.5 w-3.5 cursor-pointer text-gray-500 hover:text-green-500" />
          </button>
        </div>
      </Link>
      <div className="p-4">
        <Link
          to={
            type === "new"
              ? `/tractor/${tractor.id}`
              : `/used-tractor/${tractor.id}`
          }
          className="block"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-green-600">
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
              to={
                type === "new"
                  ? `/tractor/${tractor.id}`
                  : `/used-tractor/${tractor.id}`
              }
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
      <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pt-6 pb-6 lg:pb-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{getTitle()}</h1>
          <p className="text-gray-500 mt-1">
            Showing {sortedTractors.length} tractors
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
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-700 mx-auto"></div>
          </div>
        ) : sortedTractors.length === 0 ? (
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