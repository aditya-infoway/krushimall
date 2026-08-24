import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronRight, ArrowLeft, Wrench, Search } from "lucide-react";
import apiHelper from "../utils/apiHelper";

const CategoryDetail = () => {
  const { id } = useParams();

  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [category, setCategory] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const [catRes, subCatRes] = await Promise.all([
          apiHelper.get("/web/VendorCategory"),
          apiHelper.get("/web/VendorsubCategory"),
        ]);

        // ============================
        // CATEGORIES
        // ============================
        let allCats: any[] = [];

        if (catRes && catRes.data && Array.isArray(catRes.data)) {
          allCats = catRes.data;
        } else if (Array.isArray(catRes)) {
          allCats = catRes;
        }

        const categoryData = allCats.find(
          (cat) => String(cat.id) === String(id),
        );

        setCategory(categoryData || null);

        // ============================
        // SUB CATEGORIES
        // ============================
        let allSubs: any[] = [];

        if (subCatRes && subCatRes.data && Array.isArray(subCatRes.data)) {
          allSubs = subCatRes.data;
        } else if (Array.isArray(subCatRes)) {
          allSubs = subCatRes;
        }

        const filteredSubs = allSubs.filter(
          (sub) => String(sub.categoryId) === String(id),
        );

        setSubCategories(filteredSubs);
      } catch (err) {
        console.error("Failed to fetch category detail", err);

        setCategory(null);
        setSubCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // ============================
  // SEARCH SUBCATEGORIES
  // ============================
  const filteredSubCategories = subCategories.filter((sub) =>
    sub.subCategoryName?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // ============================
  // LOADING
  // ============================
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  // ============================
  // CATEGORY NOT FOUND
  // ============================
  if (!category) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Category not found</p>

        <Link to="/categories" className="text-green-600 font-semibold">
          Back to All Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* =========================================
          BREADCRUMB + TITLE
      ========================================= */}
      <div className="w-full xl:max-w-400 2xl:max-w-430 mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pt-8 pb-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:text-green-600">
            Home
          </Link>

          <ChevronRight className="h-3.5 w-3.5" />

          <Link to="/categories" className="hover:text-green-600">
            Categories
          </Link>

          <ChevronRight className="h-3.5 w-3.5" />

          <span className="text-gray-900 font-medium">
            {category.categoryName}
          </span>
        </div>

        {/* Back */}
        <Link
          to="/categories"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-600 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to All Categories
        </Link>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
          {category.categoryName}
        </h1>

        {/* Count */}
        <p className="text-sm text-gray-500 mt-1">
          Select sub-category to find parts • {subCategories.length}{" "}
          {subCategories.length === 1 ? "subcategory" : "subcategories"}
        </p>

        {/* =========================================
            SEARCH SUBCATEGORIES
        ========================================= */}
        <div className="relative w-full max-w-md mt-4">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

          <input
            type="text"
            placeholder="Search subcategories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* =========================================
          SUBCATEGORY CARDS
      ========================================= */}
      <div className="w-full max-w-350 mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* NO SEARCH RESULT */}
        {filteredSubCategories.length === 0 ? (
          <div className="text-center py-20">
            <Search className="h-16 w-16 text-gray-200 mx-auto mb-5" />

            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No subcategories match
            </h3>

            <p className="text-gray-500 mb-6">Try a different search term</p>

            <button
              onClick={() => setSearchQuery("")}
              className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition-colors"
            >
              Show All Subcategories
            </button>
          </div>
        ) : (
         <div className="flex flex-wrap justify-start gap-3 sm:gap-6">
            {filteredSubCategories.map((sub) => (
              <Link
                key={sub.id}
                to={`/SubSubCategory/${sub.subCategoryName}`}
              className="group relative w-[calc(50%-0.375rem)] sm:w-60 lg:w-60 bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                <div className="relative h-36 overflow-hidden bg-gray-100">
                  {sub.image ? (
                    <img
                      src={apiHelper.getImageUrl(sub.image)}
                      alt={sub.subCategoryName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <span className="text-2xl font-bold text-gray-300 uppercase">
                        {sub.subCategoryName?.substring(0, 2)}
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />

                  <div className="absolute bottom-3 left-3 text-white">
                    <Wrench className="h-7 w-7 mb-1" />
                    <h3 className="text-base font-bold">
                      {sub.subCategoryName}
                    </h3>
                  </div>
                </div>

                <div className="p-3 border-t border-gray-100">
                  <span className="text-sm text-green-600 group-hover:text-green-700 font-medium flex items-center gap-1">
                    View Products
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDetail;
