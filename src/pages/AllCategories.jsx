import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ChevronRight,
  ArrowRight,
  X,
  Cog,
  Gauge,
  Filter,
  Thermometer,
  Wind,
  Disc,
  Droplets,
  Battery,
  Shield,
  Car,
  Wrench,
  PenTool,
  Package,
  CircleDot,
  Fan,
  Timer,
  Waves,
  Brush,
  Flame,
  Radio,
  Lock,
  Sun,
  Sparkles,
  ChevronDown,
} from "lucide-react";

const AllCategories = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  const categories = [
    {
      id: 1,
      name: "Engine Components",
      icon: Cog,
      parts: "1,240",
      image:
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop",
      slug: "engine-components",
      description:
        "Pistons, cylinders, crankshafts, valves, timing belts & complete engine assemblies",
      subcategories: [
        "Pistons & Rings",
        "Cylinder Heads",
        "Crankshafts",
        "Valves",
        "Timing Belts",
        "Gaskets",
      ],
    },
    {
      id: 2,
      name: "Transmission & Clutch",
      icon: Gauge,
      parts: "520",
      image:
        "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&h=400&fit=crop",
      slug: "transmission-clutch",
      description:
        "Gearboxes, clutch kits, drive shafts, differentials & transmission fluids",
      subcategories: [
        "Clutch Kits",
        "Gearboxes",
        "Drive Shafts",
        "Differentials",
        "Fluid",
      ],
    },
    {
      id: 3,
      name: "Brake System",
      icon: Disc,
      parts: "850",
      image:
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop",
      slug: "brake-system",
      description:
        "Brake pads, discs, calipers, master cylinders & complete brake kits",
      subcategories: [
        "Brake Pads",
        "Brake Discs",
        "Calipers",
        "Master Cylinders",
        "Brake Lines",
      ],
    },
    {
      id: 4,
      name: "Suspension & Steering",
      icon: Wrench,
      parts: "620",
      image:
        "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&h=400&fit=crop",
      slug: "suspension-steering",
      description:
        "Shock absorbers, struts, control arms, tie rods & steering racks",
      subcategories: [
        "Shock Absorbers",
        "Struts",
        "Control Arms",
        "Tie Rods",
        "Steering Racks",
      ],
    },
    {
      id: 5,
      name: "Electrical & Battery",
      icon: Battery,
      parts: "590",
      image:
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop",
      slug: "electrical-battery",
      description:
        "Batteries, alternators, starters, wiring harnesses & voltage regulators",
      subcategories: [
        "Batteries",
        "Alternators",
        "Starters",
        "Wiring",
        "Regulators",
      ],
    },
    {
      id: 6,
      name: "Lighting & Signals",
      icon: Sun,
      parts: "280",
      image:
        "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&h=400&fit=crop",
      slug: "lighting-signals",
      description:
        "Headlights, taillights, fog lamps, indicators & complete lighting kits",
      subcategories: [
        "Headlights",
        "Taillights",
        "Fog Lamps",
        "Indicators",
        "LED Kits",
      ],
    },
    {
      id: 7,
      name: "Cooling & AC System",
      icon: Thermometer,
      parts: "700",
      image:
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop",
      slug: "cooling-ac",
      description:
        "Radiators, AC compressors, condensers, water pumps & cooling fans",
      subcategories: [
        "Radiators",
        "AC Compressors",
        "Condensers",
        "Water Pumps",
        "Fans",
      ],
    },
    {
      id: 8,
      name: "Fuel System",
      icon: Flame,
      parts: "460",
      image:
        "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&h=400&fit=crop",
      slug: "fuel-system",
      description:
        "Fuel pumps, injectors, carburetors, fuel tanks & complete delivery systems",
      subcategories: [
        "Fuel Pumps",
        "Injectors",
        "Carburetors",
        "Fuel Tanks",
        "Fuel Lines",
      ],
    },
    {
      id: 9,
      name: "Exhaust & Emission",
      icon: Wind,
      parts: "290",
      image:
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop",
      slug: "exhaust-emission",
      description:
        "Mufflers, catalytic converters, exhaust pipes, O2 sensors & EGR valves",
      subcategories: [
        "Mufflers",
        "Catalytic Converters",
        "Exhaust Pipes",
        "O2 Sensors",
      ],
    },
    {
      id: 10,
      name: "Filters & Fluids",
      icon: Filter,
      parts: "630",
      image:
        "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&h=400&fit=crop",
      slug: "filters-fluids",
      description:
        "Oil filters, air filters, fuel filters, engine oil, coolant & brake fluid",
      subcategories: [
        "Oil Filters",
        "Air Filters",
        "Fuel Filters",
        "Engine Oil",
        "Coolant",
      ],
    },
    {
      id: 11,
      name: "Body & Exterior",
      icon: Car,
      parts: "710",
      image:
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop",
      slug: "body-exterior",
      description:
        "Bumpers, doors, fenders, hoods, mirrors & complete body panels",
      subcategories: ["Bumpers", "Doors", "Fenders", "Hoods", "Mirrors"],
    },
    {
      id: 12,
      name: "Glass & Windshield",
      icon: Shield,
      parts: "200",
      image:
        "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&h=400&fit=crop",
      slug: "glass-windshield",
      description:
        "Windshields, window glass, sunroof glass, weather strips & seals",
      subcategories: ["Windshields", "Window Glass", "Sunroof Glass", "Seals"],
    },
    {
      id: 13,
      name: "Interior & Dashboard",
      icon: PenTool,
      parts: "430",
      image:
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop",
      slug: "interior-dashboard",
      description:
        "Dashboard panels, door trims, center consoles, steering wheels & gear knobs",
      subcategories: [
        "Dashboard",
        "Door Panels",
        "Center Console",
        "Steering Wheel",
      ],
    },
    {
      id: 14,
      name: "Seats & Upholstery",
      icon: Car,
      parts: "280",
      image:
        "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&h=400&fit=crop",
      slug: "seats-upholstery",
      description:
        "Seat covers, foam cushions, seat belts, headrests & complete seat assemblies",
      subcategories: [
        "Seat Covers",
        "Foam Cushions",
        "Seat Belts",
        "Headrests",
      ],
    },
    {
      id: 15,
      name: "Infotainment & Audio",
      icon: Radio,
      parts: "150",
      image:
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop",
      slug: "infotainment-audio",
      description:
        "Audio systems, navigation units, displays, speakers & amplifiers",
      subcategories: ["Audio Systems", "Navigation", "Displays", "Speakers"],
    },
    {
      id: 16,
      name: "Security & Locks",
      icon: Lock,
      parts: "180",
      image:
        "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&h=400&fit=crop",
      slug: "security-locks",
      description:
        "Door locks, ignition locks, remote keys, immobilizers & alarm systems",
      subcategories: ["Door Locks", "Ignition Locks", "Remote Keys", "Alarms"],
    },
    {
      id: 17,
      name: "Sensors & ECU",
      icon: CircleDot,
      parts: "250",
      image:
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop",
      slug: "sensors-ecu",
      description:
        "ECU modules, ABS sensors, parking sensors, oxygen sensors & diagnostic tools",
      subcategories: [
        "ECU Modules",
        "ABS Sensors",
        "Parking Sensors",
        "O2 Sensors",
      ],
    },
    {
      id: 18,
      name: "Paint & Coatings",
      icon: Brush,
      parts: "150",
      image:
        "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&h=400&fit=crop",
      slug: "paint-coatings",
      description:
        "Touch-up paints, primers, clear coats, rust protection & polishing compounds",
      subcategories: [
        "Touch-up Paint",
        "Primers",
        "Clear Coats",
        "Rust Protection",
      ],
    },
    {
      id: 19,
      name: "Wipers & Washers",
      icon: Waves,
      parts: "120",
      image:
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop",
      slug: "wipers-washers",
      description:
        "Wiper blades, washer pumps, washer fluid reservoirs & complete wiper systems",
      subcategories: [
        "Wiper Blades",
        "Washer Pumps",
        "Washer Fluid",
        "Wiper Motors",
      ],
    },
    {
      id: 20,
      name: "Wheels & Tyres",
      icon: Disc,
      parts: "380",
      image:
        "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&h=400&fit=crop",
      slug: "wheels-tyres",
      description:
        "Alloy wheels, steel rims, tyres, wheel nuts, hubcaps & TPMS sensors",
      subcategories: ["Alloy Wheels", "Steel Rims", "Tyres", "TPMS Sensors"],
    },
  ];

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.subcategories.some((sub) =>
        sub.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  const visibleCategories = showAll
    ? filteredCategories
    : filteredCategories.slice(0, 15);
  const hasMore = filteredCategories.length > 15;

  const totalParts = categories.reduce((sum, c) => sum + parseInt(c.parts), 0);

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
          {categories.length} categories • {totalParts.toLocaleString()}+ parts
          available
        </p>
      </div>
      {/* Categories Grid */}
      <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pb-16">
        {filteredCategories.length === 0 ? (
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
                  to={`/category/${category.slug}`}
                  state={{ from: "all-categories" }}
                  className={`group relative bg-white rounded-2xl border border-gray-300 hover:border-green-300 hover:shadow-xl hover:shadow-green-50 transition-all duration-300 overflow-hidden flex flex-col ${
                    !showAll && index >= 8 ? "hidden sm:block" : ""
                  }`}
                >
                  {/* Image Container */}
                  <div className="relative h-36 sm:h-40 overflow-hidden bg-gray-50">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 via-green-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm text-gray-900 text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">
                      {category.parts} parts
                    </span>
                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex items-center gap-2">
                        <category.icon className="h-4 w-4 text-white" />
                        <span className="text-white font-bold text-xs line-clamp-1">
                          {category.name}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 flex-1">
                    <div className="flex items-start gap-2 mb-2">
                      <category.icon className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <h3 className="font-semibold text-gray-900 text-xs sm:text-sm leading-tight line-clamp-2">
                        {category.name}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {category.subcategories.slice(0, 3).map((sub, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] sm:text-[10px] bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded-md"
                        >
                          {sub}
                        </span>
                      ))}
                      {category.subcategories.length > 3 && (
                        <span className="text-[9px] sm:text-[10px] text-gray-400">
                          +{category.subcategories.length - 3}
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
