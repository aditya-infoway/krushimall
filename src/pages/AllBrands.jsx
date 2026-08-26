import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Tractor,
  Search,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  Heart,
  ArrowRight,
  Sparkles,
  Package,
  Phone,
  BadgeCheck,
  Shield,
  Clock,
  Loader2,
} from "lucide-react";
import apiHelper from "../utils/apiHelper";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";

const AllBrands = () => {
  const [tractors, setTractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [brandOptions, setBrandOptions] = useState([]);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Fetch all tractors
  useEffect(() => {
    const fetchAllTractors = async () => {
      try {
        setLoading(true);
        const response = await apiHelper.get("/website-variants");
        const data = response?.data || response || [];

        // Map the data
        const mapped = data.map((v) => ({
          id: v.id,
          name: v.productName,
          brand: v.brand?.brandName || "Unknown",
          price: v.exShowroomPrice || 0,
          hp: v.horsePower ? `${v.horsePower} HP` : "-",
          fuel: v.fuelType || "-",
          year: new Date(v.createdAt).getFullYear(),
          location: [v.city, ].filter(Boolean).join(", "),
          image: apiHelper.image(v.frontView),
          rating: 4.5,
        }));
        setTractors(mapped);

        // Extract unique brands
        const brands = [...new Set(mapped.map((t) => t.brand))].filter(Boolean);
        setBrandOptions(brands);
      } catch (error) {
        console.error("Failed to fetch tractors:", error);
        setTractors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllTractors();
  }, []);

  // Filter tractors by search and brand
  const filteredTractors = tractors.filter((tractor) => {
    const matchesSearch =
      tractor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tractor.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand =
      selectedBrand === "" || tractor.brand === selectedBrand;
    return matchesSearch && matchesBrand;
  });

  // Tractor Card Component
  const TractorCard = ({ tractor }) => {
    const wishlisted = isInWishlist(tractor.id);

    return (
      <div className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
        <Link
          to={`/tractor/${tractor.id}`}
          className="relative h-48 overflow-hidden bg-gray-100 block"
        >
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
              if (!isAuthenticated) {
                navigate(`/login?redirect=/all-brands`);
                return;
              }
              toggleWishlist(tractor);
            }}
            className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow hover:bg-gray-100 cursor-pointer"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                wishlisted
                  ? "text-red-500 fill-red-500"
                  : "text-gray-500 hover:text-red-500"
              }`}
            />
          </button>
        </Link>

        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-green-700">
              {tractor.brand}
            </span>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{tractor.location}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-2 mt-2">
            <Link
              to={`/tractor/${tractor.id}`}
              className="text-sm font-bold text-gray-900 line-clamp-1 hover:text-green-700 transition-colors"
            >
              {tractor.name}
            </Link>

            <div className="flex items-center gap-1  ml-2 flex-shrink-0">
              <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-semibold text-gray-700">
                {tractor.rating}
              </span>
            </div>
          </div>

          <div className="mt-auto pt-2 border-t border-gray-800">
            <div className="flex items-center justify-between">
              <p className="text-sm font-black text-gray-900">
                ₹{tractor.price.toLocaleString()}
              </p>
              <Link
                to={`/tractor/${tractor.id}`}
                className="bg-green-700 hover:bg-green-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading all tractors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative text-white min-h-[300px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1920&auto=format&fit=crop&q=90"
            alt="All Tractor Brands"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 via-gray-900/40 to-gray-900/20" />
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20 py-12 relative z-10 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-full mb-4 shadow-lg">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-semibold">All Tractor Brands</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 leading-tight drop-shadow-lg">
              Explore All <span className="text-green-300">Tractor Brands</span>
            </h1>
            <p className="text-white/90 text-base md:text-lg mb-6 max-w-xl drop-shadow-md">
              Discover tractors from all major brands at best prices.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/new-tractors"
                className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm shadow-lg hover:shadow-xl"
              >
                <Tractor className="h-4 w-4" /> New Tractors
              </Link>
              <Link
                to="/old-tractors"
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm border border-white/30"
              >
                Used Tractors
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20 py-8 lg:py-12">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-8">
          <div className="flex flex-row items-center gap-2">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by brand or model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-2/3 lg:w-1/2  pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none transition-all bg-gray-50 hover:bg-white"
              />
            </div>

            {/* Results Count */}
            <div className="flex items-center text-sm text-gray-600 whitespace-nowrap">
              <Package className="h-4 w-4 text-green-700 mr-2" />
              <span className="font-semibold text-green-700">
                {filteredTractors.length}
              </span>
              <span className="ml-1">tractors found</span>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {filteredTractors.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <Tractor className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No tractors found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTractors.map((tractor) => (
              <TractorCard key={tractor.id} tractor={tractor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllBrands;
