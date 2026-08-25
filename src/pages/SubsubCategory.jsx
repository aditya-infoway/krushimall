import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { ChevronRight, Home, Wrench, ArrowLeft } from "lucide-react";
import apiHelper from "../utils/apiHelper";

const SubSubCategory = () => {
  const { subCategoryName } = useParams();
  const location = useLocation();

  const [category, setCategory] = useState(null);
  const [subCategory, setSubCategory] = useState(null);
  const [subSubCategories, setSubSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);

const categoryId = location.state?.categoryId || category?.id;

const backTo = categoryId
  ? `/category/${categoryId}`
  : "/categories";

const backLabel = category?.categoryName || "Categories";
  const getResponseData = (response) => {
    if (!response) return [];
    if (Array.isArray(response?.data?.data)) return response.data.data;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response)) return response;
    return [];
  };

  const normalizeName = (value) =>
    decodeURIComponent(String(value || "")).trim().replace(/\s+/g, " ").toLowerCase();

  const getSubSubCategoryName = (item) =>
    item?.subSubCategoryName ||
    item?.subsubcategoryName ||
    item?.subSubCategory ||
    item?.name ||
    item?.title ||
    "Unnamed";

  const getSubSubCategoryImage = (item) =>
    item?.image ||
    item?.subSubCategoryImage ||
    item?.subsubcategoryImage ||
    item?.icon ||
    null;

  const getEmbeddedChildren = (sub) => {
    if (Array.isArray(sub?.subSubCategories)) return sub.subSubCategories;
    if (Array.isArray(sub?.subSubCategory)) return sub.subSubCategory;
    if (Array.isArray(sub?.subsubcategory)) return sub.subsubcategory;
    if (Array.isArray(sub?.children)) return sub.children;
    if (Array.isArray(sub?.childCategories)) return sub.childCategories;
    return [];
  };

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [categoryRes, subCategoryRes] = await Promise.all([
          apiHelper.get("/web/VendorCategory"),
          apiHelper.get("/web/VendorsubCategory"),
        ]);

        if (!mounted) return;

        const categories = getResponseData(categoryRes);
        const allSubCategories = getResponseData(subCategoryRes);

        const decodedSubCategoryName = decodeURIComponent(subCategoryName || "");

        const foundSubCategory = allSubCategories.find((sub) => {
          const apiName = normalizeName(sub?.subCategoryName);
          const urlName = normalizeName(decodedSubCategoryName);
          return apiName === urlName || apiName.replace(/\s+/g, "-") === urlName.replace(/\s+/g, "-");
        });

        if (!foundSubCategory) {
          setCategory(null);
          setSubCategory(null);
          setSubSubCategories([]);
          return;
        }

        setSubCategory(foundSubCategory);

        const foundCategory = categories.find(
          (cat) => String(cat?.id) === String(foundSubCategory?.categoryId),
        );
        setCategory(foundCategory || null);

        let children = getEmbeddedChildren(foundSubCategory);

        try {
          const subSubRes = await apiHelper.get("/web/Vendorsub-subCategory");
          const separateChildren = getResponseData(subSubRes).filter((child) => {
            const childSubId =
              child?.subCategoryId ??
              child?.subcategoryId ??
              child?.parentSubCategoryId ??
              child?.parentId;
            return String(childSubId) === String(foundSubCategory.id);
          });

          const merged = [...children, ...separateChildren];
          children = merged.filter((child, index, arr) => {
            const childId = child?.id ?? getSubSubCategoryName(child);
            return (
              arr.findIndex(
                (x) => String(x?.id ?? getSubSubCategoryName(x)) === String(childId),
              ) === index
            );
          });
        } catch (err) {
          // separate endpoint not available, embedded children still used
        }

        setSubSubCategories(children);
      } catch (error) {
        console.error("Failed to fetch subcategory data:", error);
        setCategory(null);
        setSubCategory(null);
        setSubSubCategories([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (subCategoryName) fetchData();

    return () => {
      mounted = false;
    };
  }, [subCategoryName]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!subCategory) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Subcategory not found</p>
        <Link to={backTo} className="text-green-600 font-semibold">
          Back to {backLabel}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-white ">
        <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 py-10">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-green-600">
              <Home className="h-4 w-4" />
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link to={backTo} className="hover:text-green-600">
              {backLabel}
            </Link>
            {/* {category && (
              <>
                <ChevronRight className="h-4 w-4" />
                <Link
                  to={`/category/${encodeURIComponent(category.categoryName)}`}
                  className="hover:text-green-600"
                >
                  {category.categoryName}
                </Link>
              </>
            )} */}
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">
              {subCategory.subCategoryName}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46  pb-6">
        <Link
          to={backTo}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-600 "
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {backLabel}
        </Link>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
          {subCategory.subCategoryName}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Select sub-category to find parts • {subSubCategories.length} subcategories
        </p>
      </div>

      {/* Grid */}
      <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pb-16">
        {subSubCategories.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">No subcategories found</p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,240px))] gap-6">
            {subSubCategories.map((child) => {
              const childName = getSubSubCategoryName(child);
              const childImage = getSubSubCategoryImage(child);

              return (
                <Link
                  key={child.id || childName}
                 to={`/products?subSubCategoryId=${child.id}`}
                  className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
                >
                  <div className="relative h-38 overflow-hidden bg-gray-100">
                    {childImage ? (
                      <img
                        src={apiHelper.image(childImage)}
                        alt={childName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <span className="text-2xl font-bold text-gray-300 uppercase">
                          {childName?.substring(0, 2)}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <Wrench className="h-8 w-8 mb-2" />
                      <h3 className="text-lg font-bold">{childName}</h3>
                    </div>
                  </div>
                  <div className="p-4 border-t border-gray-100">
                    <span className="text-sm text-green-600 group-hover:text-green-700 font-medium flex items-center gap-1">
                      View Products <ChevronRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubSubCategory;