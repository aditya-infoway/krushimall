import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Listbox } from "@headlessui/react";
import {
  Tractor,
  MapPin,
  Heart,
  Star,
  Search,
  ChevronDown,
  ChevronLeft,
  Check,
  Filter,
  X,
  ArrowUpDown,
} from "lucide-react";
import apiHelper from "../utils/apiHelper";

const TractorList = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "new";
  const section = searchParams.get("section");
  const searchFilter = searchParams.get("search") || "";
  const navigate = useNavigate();

  // URL Params (Single values for now)
  const transmissionFilter = searchParams.get("transmission") || "";
  const driveTypeFilter = searchParams.get("driveType") || "";
  const stateFilter = searchParams.get("state") || "";
  const cityFilter = searchParams.get("city") || "";
  const minPrice = Number(searchParams.get("minPrice")) || 0;
  const maxPrice =
    Number(searchParams.get("maxPrice")) || (type === "new" ? 1000000 : 600000);
  const sort = searchParams.get("sort") || "popular";

  // State
  const [searchQuery, setSearchQuery] = useState(searchFilter);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  // Arrays for Multi-Select Filtering
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedHps, setSelectedHps] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const brandFilter = searchParams.get("brand") || "";
  const hpFilter = searchParams.get("hp") || "";
  const categoryFilter = searchParams.get("category") || "";

  const [selectedTransmission, setSelectedTransmission] =
    useState(transmissionFilter);
  const [selectedDriveType, setSelectedDriveType] = useState(driveTypeFilter);
  const [selectedState, setSelectedState] = useState(stateFilter);
  const [selectedCity, setSelectedCity] = useState(cityFilter);
  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);
  const [sortBy, setSortBy] = useState(sort);
  const [draftBrands, setDraftBrands] = useState([]);
  const [draftCategories, setDraftCategories] = useState([]);
  const [draftHps, setDraftHps] = useState([]);
  const [draftPriceRange, setDraftPriceRange] = useState(priceRange);
  const [newTractors, setNewTractors] = useState([]);
  const [usedTractors, setUsedTractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Lock background scroll while the mobile filter drawer / brand modal is open
  useEffect(() => {
    if (isMobileFilterOpen || isBrandModalOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isMobileFilterOpen, isBrandModalOpen]);

  // Fetch real tractors from the backend
  useEffect(() => {
    const fetchNewTractors = async () => {
      try {
        let endpoint = "/website-variants?status=ACTIVE&isUpcoming=false";

        if (section === "upcoming") {
          endpoint = "/website-variants?status=ACTIVE&isUpcoming=true";
        } else if (section === "latest") {
          endpoint = "/website-variants/latest";
        } else if (section === "popular") {
          endpoint = "/website-variants/popular";
        }

        const response = await apiHelper.get(endpoint);
        const tractorList = response.data || [];

        const formattedTractors = tractorList.map((apiTractor) => ({
          id: apiTractor.id,
          name: apiTractor.productName || "Tractor",
          brand: apiTractor.brand?.brandName || apiTractor.brandName || "",
          category:
            apiTractor.category?.categoryName || apiTractor.categoryName || "",
          transmission:
            apiTractor.transmissionType || apiTractor.transmission || "",
          price: apiTractor.exShowroomPrice || 0,
          hp: apiTractor.horsePower
            ? `${apiTractor.horsePower} HP`
            : apiTractor.hp
              ? `${apiTractor.hp} HP`
              : "",
          fuel: "Diesel",
          year: apiTractor.modelYear?.modelYear || "2024",
          location: apiTractor.city || apiTractor.district || "Location",
          image: apiTractor.frontView
            ? apiHelper.image(apiTractor.frontView)
            : "/mah.png",
          rating: 4.5,
          isUpcoming: apiTractor.isUpcoming,
        }));

        setNewTractors(formattedTractors);
      } catch (error) {
        console.error("Error fetching new tractors:", error);
      }
    };

    const fetchUsedTractors = async () => {
      try {
        let endpoint = "/vendor-web/used-website-variant/public";
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
          name: apiTractor.productName,
          brand: apiTractor.brandRef?.brandName,
          category: apiTractor.category?.categoryName,
          hp: apiTractor.hp ? `${apiTractor.hp} HP` : "",
          driveType: apiTractor.driveType,
          state: apiTractor.state,
          city: apiTractor.city,
          price: apiTractor.expectedPrice,
          image: apiTractor.frontView
            ? apiHelper.image(apiTractor.frontView)
            : "/mah.png",
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
  }, [type, section]);

  // Sync URL params (Only runs once on mount to set initial state from URL if needed)
useEffect(() => {
  const brands = brandFilter ? brandFilter.split(",") : [];
  const hps = hpFilter ? hpFilter.split(",") : [];
  const categories = categoryFilter ? categoryFilter.split(",") : [];

  setSelectedBrands(brands);
  setSelectedHps(hps);
  setSelectedCategories(categories);

  // Draft state also
  setDraftBrands(brands);
  setDraftHps(hps);
  setDraftCategories(categories);

  setPriceRange([minPrice, maxPrice]);
  setDraftPriceRange([minPrice, maxPrice]);

  setSortBy(sort);
}, [
  brandFilter,
  hpFilter,
  categoryFilter,
  minPrice,
  maxPrice,
  sort,
]);

  const currentTractors = type === "new" ? newTractors : usedTractors;

  // Get unique filter options
  const getUniqueCategories = () => {
    const categories = new Set();
    currentTractors.forEach((t) => {
      if (t.category) categories.add(t.category);
    });
    return Array.from(categories);
  };

  const getUniqueBrands = () => {
    const brands = new Set();
    currentTractors.forEach((t) => {
      if (t.brand) brands.add(t.brand);
    });
    return Array.from(brands);
  };

  const getUniqueHP = () => {
    const hp = new Set();
    currentTractors.forEach((t) => {
      if (t.hp) hp.add(t.hp);
    });
    return Array.from(hp);
  };

  // Filter tractors (handles Arrays)
  const filteredTractors = currentTractors.filter((tractor) => {
    if (
      searchQuery &&
      !tractor.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !tractor.brand.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;

    if (selectedBrands.length > 0 && !selectedBrands.includes(tractor.brand))
      return false;
    if (selectedHps.length > 0 && !selectedHps.includes(tractor.hp))
      return false;
    if (
      selectedCategories.length > 0 &&
      !selectedCategories.includes(tractor.category)
    )
      return false;

    if (selectedTransmission && tractor.transmission !== selectedTransmission)
      return false;
    if (selectedDriveType && tractor.driveType !== selectedDriveType)
      return false;
    if (selectedState && tractor.state !== selectedState) return false;
    if (selectedCity && tractor.city !== selectedCity) return false;

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
    return 0;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedBrands([]);
    setSelectedHps([]);
    setSelectedCategories([]);
    setSelectedTransmission("");
    setSelectedDriveType("");
    setSelectedState("");
    setSelectedCity("");
    setPriceRange([0, maxPrice]);
    setSortBy("popular");
  };
  const applyFilters = () => {
    setSelectedBrands(draftBrands);
    setSelectedCategories(draftCategories);
    setSelectedHps(draftHps);
    setPriceRange(draftPriceRange);

    setIsMobileFilterOpen(false);
  };
  useEffect(() => {
    if (currentTractors.length > 0 && !searchParams.get("maxPrice")) {
      const highest = Math.max(...currentTractors.map((t) => t.price));
      setPriceRange([0, highest]);
    }
  }, [currentTractors]);

  // Count active filters
  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedBrands.length > 0) count++;
    if (selectedHps.length > 0) count++;
    if (selectedCategories.length > 0) count++;
    if (selectedTransmission) count++;
    if (selectedDriveType) count++;
    if (selectedState) count++;
    if (selectedCity) count++;
    if (searchQuery) count++;
    return count;
  };

  const TractorCard = ({ tractor }) => (
    <div className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden w-full">
      <Link
        to={
          type === "new"
            ? `/tractor/${tractor.id}`
            : `/used-tractor/${tractor.id}`
        }
        className="block"
      >
        <div className="relative h-40 sm:h-48 overflow-hidden bg-gray-100">
          <img
            src={tractor.image}
            alt={tractor.name}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
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
      <div className="p-3 sm:p-4">
        <Link
          to={
            type === "new"
              ? `/tractor/${tractor.id}`
              : `/used-tractor/${tractor.id}`
          }
          className="block"
        >
          <div className="flex items-center justify-between mb-3 gap-2">
            <span className="text-xs font-semibold text-green-600 truncate">
              {tractor.brand}
            </span>
            <div className="flex items-center gap-1 text-xs text-gray-500 min-w-0">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{tractor.location}</span>
            </div>
          </div>
          <div className="flex items-center justify-between mb-1 gap-2">
            <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-1 hover:text-green-600 transition-colors">
              {tractor.name}
            </h3>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-semibold text-gray-700">
                {tractor.rating}
              </span>
            </div>
          </div>
        </Link>

        <div className="mt-auto pt-2 border-t">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm sm:text-base font-black text-gray-900 truncate">
              ₹{tractor.price.toLocaleString()}
            </p>
            <Link
              to={
                type === "new"
                  ? `/tractor/${tractor.id}`
                  : `/used-tractor/${tractor.id}`
              }
              className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex-shrink-0"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  // --- FLIPKART STYLE CHECKBOX COMPONENT (WITH MODAL TRIGGER) ---
  const CheckboxFilterGroup = ({
    title,
    items,
    selectedItems,
    setSelectedItems,
    countData,
    showSearch = false,
    onShowMore,
  }) => {
    const [localSearch, setLocalSearch] = useState("");

    const safeItems = Array.isArray(items) ? items : [];
    const validItems = safeItems.filter(
      (item) => item && typeof item === "string",
    );
    const filteredItems = validItems.filter((item) =>
      item.toLowerCase().includes(localSearch.toLowerCase()),
    );
    const displayedItems = filteredItems.slice(0, 6);

    return (
      <div className="mb-6 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
        <h4 className="text-sm font-semibold text-gray-800 mb-3">{title}</h4>
        {showSearch && (
          <div className="relative mb-3">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${title.toLowerCase()}...`}
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-8 pr-2 py-1.5 border border-gray-200 rounded text-xs focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none"
            />
          </div>
        )}
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={selectedItems.length === 0}
              onChange={() => setSelectedItems([])}
              className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer flex-shrink-0"
            />
            <span className="text-sm text-gray-600 group-hover:text-gray-900">
              All
            </span>
            <span className="ml-auto text-xs text-gray-400">
              ({currentTractors.length})
            </span>
          </label>
          {displayedItems.map((item) => (
            <label
              key={item}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedItems.includes(item)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedItems([...selectedItems, item]);
                  } else {
                    setSelectedItems(selectedItems.filter((i) => i !== item));
                  }
                }}
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer flex-shrink-0"
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900 truncate max-w-[140px]">
                {item}
              </span>
              <span className="ml-auto text-xs text-gray-400 flex-shrink-0">
                ({countData[item] || 0})
              </span>
            </label>
          ))}
        </div>

        {filteredItems.length > 6 && onShowMore && (
          <button
            onClick={onShowMore}
            className="mt-2 text-xs font-medium text-green-600 hover:text-green-700 hover:underline"
          >
            {`+ ${filteredItems.length - 6} More`}
          </button>
        )}
      </div>
    );
  };

  // --- FLIPKART STYLE BRAND MODAL (fully responsive) ---
  const BrandFilterModal = () => {
    const [modalSearch, setModalSearch] = useState("");
    const safeItems = Array.isArray(getUniqueBrands()) ? getUniqueBrands() : [];
    const validItems = safeItems.filter(
      (item) => item && typeof item === "string",
    );
    const filteredModalItems = validItems.filter((item) =>
      item.toLowerCase().includes(modalSearch.toLowerCase()),
    );

    return (
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50">
        <div className="bg-white w-full sm:max-w-4xl rounded-t-2xl sm:rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[90vh]">
          {/* Modal Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 bg-white flex-shrink-0">
            <h3 className="text-lg font-bold text-gray-900">Brands</h3>
            <button
              onClick={() => setIsBrandModalOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Modal Search Bar */}
          <div className="px-4 sm:px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex-shrink-0">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search Brand"
                value={modalSearch}
                onChange={(e) => setModalSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Responsive grid content: 1 col on mobile up to 4 on desktop */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-3">
              <label className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={selectedBrands.length === 0}
                  onChange={() => setSelectedBrands([])}
                  className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer flex-shrink-0"
                />
                <span className="text-sm text-gray-700 font-medium">All</span>
              </label>
              {filteredModalItems.map((item) => (
                <label
                  key={item}
                  className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(item)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedBrands([...selectedBrands, item]);
                      } else {
                        setSelectedBrands(
                          selectedBrands.filter((i) => i !== item),
                        );
                      }
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer flex-shrink-0"
                  />
                  <span className="text-sm text-gray-700 truncate">{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-4 px-4 sm:px-6 py-4 border-t border-gray-200 bg-white flex-shrink-0">
            <button
              onClick={() => setSelectedBrands([])}
              className="text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              CLEAR ALL
            </button>
            <button
              onClick={applyFilters}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded shadow-sm transition-colors"
            >
              APPLY FILTERS
            </button>
          </div>
        </div>
      </div>
    );
  };

  // --- FLIPKART STYLE ACCORDION SECTION ---
  const getDefaultOpenSection = () => {
    if (selectedBrands.length > 0) return "BRAND";
    if (selectedHps.length > 0) return "HORSE POWER (HP)";
    if (selectedCategories.length > 0) return "CATEGORIES";
    if (selectedTransmission) return "TRANSMISSION";
    if (selectedDriveType) return "DRIVE TYPE";
    if (selectedState) return "STATE";
    if (selectedCity) return "CITY";
    return "CATEGORIES";
  };

  const [openSection, setOpenSection] = useState(getDefaultOpenSection);
  useEffect(() => {
    setOpenSection(getDefaultOpenSection());
  }, [
    selectedBrands,
    selectedHps,
    selectedCategories,
    selectedTransmission,
    selectedDriveType,
    selectedState,
    selectedCity,
  ]);

  const AccordionSection = ({ title, children }) => {
    const isOpen = openSection === title;
    return (
      <div className="mb-2 border-b border-gray-100 pb-2 last:border-0">
        <button
          onClick={() => setOpenSection(isOpen ? null : title)}
          className="w-full flex items-center justify-between py-2 text-sm font-semibold text-gray-800 hover:text-green-600 transition-colors"
        >
          {title}
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
        {isOpen && <div className="mt-2">{children}</div>}
      </div>
    );
  };

  // FilterSidebar now takes an `isMobile` flag so it renders correctly
  // both as a sticky desktop column and as full-width content inside the
  // mobile drawer (no fixed width, no nested `sticky`/`overflow-y-auto`
  // fighting with the drawer's own scroll container).
  const FilterSidebar = ({ isMobile = false }) => {
    const getCounts = (key) => {
      const counts = {};
      currentTractors.forEach((t) => {
        const val = t[key];
        if (val) counts[val] = (counts[val] || 0) + 1;
      });
      return counts;
    };

    const categoryCounts = getCounts("category");
    const brandCounts = getCounts("brand");
    const hpCounts = getCounts("hp");

    const maxSliderValue = currentTractors.length
      ? Math.max(...currentTractors.map((t) => t.price), 1)
      : 100000;

    return (
      <div className={isMobile ? "w-full" : "w-full lg:w-72 flex-shrink-0"}>
        <div
          className={
            isMobile
              ? "bg-white p-4"
              : "bg-white rounded-2xl border border-gray-200 p-5 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto custom-scrollbar"
          }
        >
          {/* Filter Header (desktop only — mobile drawer has its own header) */}
          {!isMobile && (
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h3 className="font-medium text-gray-900 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
                {getActiveFilterCount() > 0 && (
                  <span className="ml-1 text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                    {getActiveFilterCount()}
                  </span>
                )}
              </h3>
              {getActiveFilterCount() > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-green-600 hover:text-green-700 font-medium cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>
          )}

          {isMobile && getActiveFilterCount() > 0 && (
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <span className="text-xs text-gray-500">
                {getActiveFilterCount()} filter
                {getActiveFilterCount() > 1 ? "s" : ""} applied
              </span>
              <button
                onClick={clearFilters}
                className="text-xs text-green-600 hover:text-green-700 font-medium cursor-pointer"
              >
                Clear All
              </button>
            </div>
          )}

          {/* NEW: Sort Section */}
          <div className="mb-6 pb-4 border-b border-gray-100">
            <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4" />
              SORT BY
            </h4>
            <Listbox value={sortBy} onChange={setSortBy}>
              <div className="relative">
                <Listbox.Button className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-left focus:ring-2 focus:ring-green-500 outline-none bg-white flex items-center justify-between hover:border-green-400 transition-colors">
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
                  <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
                </Listbox.Button>
                <Listbox.Options className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1 text-sm max-h-64 overflow-y-auto">
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
                        `cursor-pointer px-3 py-2 flex items-center justify-between ${
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

          <AccordionSection title="CATEGORIES">
            <CheckboxFilterGroup
              title="Categories"
              items={getUniqueCategories()}
              selectedItems={draftCategories}
              setSelectedItems={setDraftCategories}
              countData={categoryCounts}
            />
          </AccordionSection>

          <AccordionSection title="BRAND">
            <CheckboxFilterGroup
              title="Brands"
              items={getUniqueBrands()}
              selectedItems={draftBrands}
              setSelectedItems={setDraftBrands}
              countData={brandCounts}
              showSearch
              onShowMore={() => setIsBrandModalOpen(true)}
            />
          </AccordionSection>

          <AccordionSection title="HORSE POWER (HP)">
            <CheckboxFilterGroup
              title="Horse Power"
              items={getUniqueHP()}
              selectedItems={draftHps}
              setSelectedItems={setDraftHps}
              countData={hpCounts}
            />
          </AccordionSection>

          {/* Price Range */}
          <div className="mt-4 pt-2 border-t border-gray-100">
            <h4 className="text-sm font-semibold text-gray-800 mb-3">PRICE</h4>
            <div className="flex flex-col gap-3 px-1">
              <div className="flex items-center gap-3 text-xs text-gray-600">
                <span className="w-12 flex-shrink-0">
                  ₹{priceRange[0].toLocaleString()}
                </span>
                <input
                  type="range"
                  min={0}
                  max={maxSliderValue}
                  value={draftPriceRange[1]}
                  onChange={(e) =>
                    setDraftPriceRange([
                      draftPriceRange[0],
                      Number(e.target.value),
                    ])
                  }
                  className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600 min-w-0"
                />
                <span className="w-16 flex-shrink-0 text-right">
                  ₹{priceRange[1].toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Apply Button */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 pt-3 pb-safe">
            <button
              onClick={applyFilters}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors"
            >
              Apply Filters ({sortedTractors.length})
            </button>
          </div>
        </div>
      </div>
    );
  };

  const getTitle = () => {
    if (selectedBrands.length > 0) {
      return `${selectedBrands.join(", ")} ${type === "new" ? "New" : "Used"} Tractors`;
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
    <div className="bg-gray-50 pt-2 xl:mt-4 overflow-x-hidden">
      <div className="w-full max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-10 xl:px-16 2xl:px-24 pt-4 sm:pt-6 pb-6 lg:pb-20">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 break-words">
              {getTitle()}
            </h1>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">
              Showing {sortedTractors.length} tractors
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Mobile / tablet Filter Button (hidden on desktop, sidebar shows instead) */}
            <button
              onClick={() => {
                setDraftBrands(selectedBrands);
                setDraftCategories(selectedCategories);
                setDraftHps(selectedHps);
                setDraftPriceRange(priceRange);

                setIsMobileFilterOpen(true);
              }}
              className="lg:hidden flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-green-400 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium hidden xs:inline">
                Filters
              </span>
              {getActiveFilterCount() > 0 && (
                <span className="bg-green-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {getActiveFilterCount()}
                </span>
              )}
            </button>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 cursor-pointer bg-white border border-gray-200 rounded-lg hover:border-green-400 hover:bg-green-50 hover:shadow-md transition-all duration-300 group flex-shrink-0"
              aria-label="Go back"
            >
              <ChevronLeft className="w-4 h-4 text-gray-500 group-hover:text-green-600 transition-colors" />
              <span className="text-sm font-medium text-gray-600 group-hover:text-green-600 transition-colors">
                Back
              </span>
            </button>
          </div>
        </div>

        {/* Main Content - Sidebar + Products */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <FilterSidebar />
          </div>

          {/* Products Area */}
          <div className="flex-1 min-w-0">
            {/* Filter Bar - Top */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-3 sm:p-4 mb-4 sm:mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search parts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  />
                </div>

                {/* Sort Select */}
                {/* <Listbox value={sortBy} onChange={setSortBy}>
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
                      <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    </Listbox.Button>
                    <Listbox.Options className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1 text-sm max-h-64 overflow-y-auto">
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
                            `cursor-pointer px-3 py-2 flex items-center justify-between ${
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
                </Listbox> */}

                {/* Active Filters Display */}
                {/* {(selectedBrands.length > 0 ||
                  selectedCategories.length > 0 ||
                  selectedHps.length > 0) && (
                  <div className="md:col-span-2 flex items-center gap-2 overflow-x-auto flex-wrap pt-1">
                    {selectedBrands.map((brand) => (
                      <span
                        key={brand}
                        className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full whitespace-nowrap"
                      >
                        {brand}
                        <button
                          onClick={() =>
                            setSelectedBrands(
                              selectedBrands.filter((b) => b !== brand),
                            )
                          }
                          className="hover:text-green-900"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    {selectedCategories.map((cat) => (
                      <span
                        key={cat}
                        className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full whitespace-nowrap"
                      >
                        {cat}
                        <button
                          onClick={() =>
                            setSelectedCategories(
                              selectedCategories.filter((c) => c !== cat),
                            )
                          }
                          className="hover:text-blue-900"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    {selectedHps.map((hp) => (
                      <span
                        key={hp}
                        className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded-full whitespace-nowrap"
                      >
                        {hp}
                        <button
                          onClick={() =>
                            setSelectedHps(selectedHps.filter((h) => h !== hp))
                          }
                          className="hover:text-purple-900"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))} */}
                {/* </div>
                )} */}
              </div>
            </div>

            {/* Results */}
            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-700 mx-auto"></div>
              </div>
            ) : sortedTractors.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl px-4">
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
              <div className="grid grid-cols-2 xs:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5">
                {sortedTractors.map((tractor, index) => (
                  <TractorCard
                    key={`${tractor.id}-${index}`}
                    tractor={tractor}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Overlay (bottom sheet on small screens, side drawer from sm up) */}
      {isMobileFilterOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div
            className="fixed inset-x-0 bottom-4 top-[90px] sm:left-0 sm:right-auto sm:top-[90px] sm:bottom-0 w-full  sm:w-[420px] md:w-[460px]
          bg-white shadow-xl rounded-t-2xl sm:rounded-none flex flex-col z-50 lg:hidden"
          >
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pb-15 ">
              <FilterSidebar isMobile />
            </div>
          </div>
        </>
      )}
      {isBrandModalOpen && <BrandFilterModal />}
    </div>
  );
};

export default TractorList;
