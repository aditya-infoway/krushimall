import { useParams, Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const CategoryPage = () => {
  const { categoryName } = useParams();

  const subCategories = {
    "engine-parts": [
      { name: "Pistons & Rings", icon: "🔧" },
      { name: "Cylinder Heads", icon: "⚙️" },
      { name: "Timing Belts", icon: "⏱️" },
      { name: "Gaskets & Seals", icon: "🔩" },
      { name: "Air Supply", icon: "🌬️" },
      { name: "Cooler", icon: "❄️" },
      { name: "EGR", icon: "🔄" },
      { name: "Flywheel", icon: "🛞" },
      { name: "Engine Mounts", icon: "🔧" },
      { name: "Oil Pump", icon: "🛢️" },
      { name: "Water Pump", icon: "💧" },
      { name: "Fuel Injectors", icon: "⛽" },
      { name: "Spark Plugs", icon: "⚡" },
      { name: "Crankshaft", icon: "🔩" },
      { name: "Camshaft", icon: "⚙️" },
    ],
    "brakes-suspension": [
      { name: "Brake Pads", icon: "🛑" },
      { name: "Shock Absorbers", icon: "🔧" },
      { name: "Brake Discs", icon: "🛑" },
      { name: "Brake Calipers", icon: "🔧" },
      { name: "Suspension Springs", icon: "🔩" },
      { name: "Control Arms", icon: "🔧" },
      { name: "Tie Rods", icon: "🔩" },
      { name: "Ball Joints", icon: "⚙️" },
    ],
    // Add other categories...
  };

  const location = useLocation();

const backTo = location.state?.from === "all-categories" ? "/categories" : "/spare-parts";
const backLabel = location.state?.from === "all-categories" ? "All Categories" : "Spare Parts";



  const categoryData = subCategories[categoryName] || subCategories["engine-parts"];
  const categoryTitle = categoryName?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="bg-gray-50 min-h-screen lg:mt-4">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-green-600">
              <Home className="h-4 w-4" />
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link  to={backTo} className="hover:text-green-600">
                {backLabel}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">{categoryTitle}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 py-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-2.5">{categoryTitle}</h1>
        <p className="text-gray-600 mb-8">Select sub-category to find parts</p>

        {/* Simple Grid with only icons and names */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {categoryData.map((sub, index) => (
            <Link
              key={index}
              to={`/category/${categoryName}/${sub.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
              className="flex flex-col items-center justify-center p-6 bg-white rounded-lg border border-gray-300 hover:border-green-400 hover:shadow-md transition-all group"
            >
              <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                {sub.icon}
              </span>
              <span className="text-sm text-gray-700 text-center font-medium group-hover:text-green-600">
                {sub.name}
              </span>
            </Link>
          ))}
        </div>

        {/* If no subcategories found */}
        {categoryData.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No sub-categories found for {categoryTitle}</p>
            <Link 
                to={backTo} 
              className="mt-4 inline-block text-green-600 hover:text-green-700 font-medium"
            >
             ← Back to {backLabel}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;


