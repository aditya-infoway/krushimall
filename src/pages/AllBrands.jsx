import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tractor, ArrowLeft, Loader2 } from "lucide-react";
import apiHelper from "../utils/apiHelper";

const AllBrands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch all brands
  useEffect(() => {
    const fetchAllBrands = async () => {
      try {
        setLoading(true);
        const response = await apiHelper.get("/web/brands");

        let brandsData = [];
        if (response && response.data && Array.isArray(response.data)) {
          brandsData = response.data;
        } else if (Array.isArray(response)) {
          brandsData = response;
        }

        // Map brands with their logo URLs from the API
        const activeBrands = brandsData
          .filter((brand) => brand.status === "ACTIVE")
          .map((item) => {
            const logoUrl = apiHelper.image(item.image);
            return {
              name: item.brandName || item.name || "Unknown",
              logo: logoUrl,
              id: item.id || item.brandId,
            };
          });
        setBrands(activeBrands);
      } catch (error) {
        console.error("Failed to fetch brands:", error);
        setBrands([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllBrands();
  }, []);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading brands...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Popular Brands Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20 py-16 md:py-20 lg:py-24">
          {/* Header with Back Button */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-3">
                <Tractor className="h-4 w-4" />
                <span className="text-sm font-semibold">All Brands</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                Explore All{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-700">
                  Tractor Brands
                </span>
              </h1>
              <p className="text-gray-500 mt-2 text-sm">
                Discover tractors from all major brands at best prices.
              </p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-2.5 rounded-xl transition-all text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          </div>

          {/* Brands Grid - Square Cards */}
          {brands.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <Tractor className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No brands available
              </h3>
              <p className="text-gray-500">
                Please check back later for updated brand listings
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  to={`/tractors?type=new&brand=${encodeURIComponent(
                    brand.name,
                  )}`}
                  className="flex flex-col items-center gap-3 group cursor-pointer"
                >
                  {/* Square Card instead of Circle */}
                  <div className="w-full aspect-square rounded-2xl bg-green-50 border-2 border-gray-200 flex items-center justify-center group-hover:border-green-600 group-hover:shadow-lg group-hover:bg-green-100 transition-all duration-300 overflow-hidden p-6">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.style.display = "none";
                        // Show fallback initials if image fails to load
                        const fallback = e.target.nextElementSibling;
                        if (fallback) fallback.style.display = "flex";
                      }}
                    />
                    <span className="text-2xl sm:text-3xl font-black text-green-700 hidden">
                      {brand.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-600 group-hover:text-green-700 transition-colors text-center">
                    {brand.name}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllBrands;
