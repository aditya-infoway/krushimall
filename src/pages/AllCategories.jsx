import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronDown } from "lucide-react";
import apiHelper from "../utils/apiHelper";

const AllCategories = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, subCatRes] = await Promise.all([
          apiHelper.get("/web/VendorCategory"),
          apiHelper.get("/web/VendorsubCategory"),
        ]);
        setCategories(catRes?.data || catRes || []);
        setSubCategories(subCatRes?.data || subCatRes || []);
      } catch (err) {
        console.error("Failed to fetch categories/subcategories", err);
        setCategories([]);
        setSubCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Har category ke sath uski subcategories jodo
  const categoriesWithSubs = categories.map((cat) => ({
    ...cat,
    subs: subCategories.filter((sub) => sub.categoryId === cat.id),
  }));

  const filteredCategories = categoriesWithSubs.filter(
    (cat) =>
      cat.categoryName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.subs.some((sub) =>
        sub.subCategoryName?.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  const visibleCategories = showAll
    ? filteredCategories
    : filteredCategories.slice(0, 15);

  return (
    <div className="min-h-screen bg-white">
      {/* Title */}
      <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pt-12 md:pt-16 lg:pt-20 pb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
          All{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-700">
            Categories
          </span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {categories.length} categories • {subCategories.length} subcategories
        </p>

        {/* Search */}
        <div className="relative w-full max-w-md mt-4">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pb-16">
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading categories...</div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-20">
            <Search className="h-20 w-20 text-gray-200 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No categories match
            </h3>
            <p className="text-gray-500 mb-6">Try a different search term</p>
            <button
              onClick={() => setSearchQuery("")}
              className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition-colors"
            >
              Show All Categories
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {visibleCategories.map((category, index) => (
                <Link
                  key={category.id}
                  to={`/category/${category.id}`}
                  state={{ from: "all-categories" }}
                  className={`group relative bg-white rounded-2xl border border-gray-300 hover:border-green-300 hover:shadow-xl hover:shadow-green-50 transition-all duration-300 overflow-hidden flex flex-col ${
                    !showAll && index >= 8 ? "hidden sm:block" : ""
                  }`}
                >
                  {/* Image Container */}
                  <div className="relative h-36 sm:h-40 overflow-hidden bg-gray-50">
                    <img
                      src={apiHelper.image(category.image)}
                      alt={category.categoryName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 via-green-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm text-gray-900 text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">
                      {category.subs.length} subcategories
                    </span>
                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <span className="text-white font-bold text-xs line-clamp-1">
                        {category.categoryName}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 flex-1">
                    <h3 className="font-semibold text-gray-900 text-xs sm:text-sm leading-tight line-clamp-2 mb-2">
                      {category.categoryName}
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {category.subs.slice(0, 3).map((sub) => (
                        <span
                          key={sub.id}
                          className="text-[9px] sm:text-[10px] bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded-md"
                        >
                          {sub.subCategoryName}
                        </span>
                      ))}
                      {category.subs.length > 3 && (
                        <span className="text-[9px] sm:text-[10px] text-gray-400">
                          +{category.subs.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Show More / Show Less Button */}
            {filteredCategories.length > 8 && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="inline-flex items-center gap-2 cursor-pointer bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg"
                >
                  {showAll
                    ? "Show Less"
                    : `View All ${filteredCategories.length} Categories`}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${showAll ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllCategories;