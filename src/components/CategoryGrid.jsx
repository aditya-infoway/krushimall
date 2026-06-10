import React from "react";
import {
  Wrench,
  Cog,
  Gauge,
  Tractor,
  Disc,
  ArrowRight,
  Sparkles,
  Zap,
  Filter,
  Fuel,
} from "lucide-react";
import { Link } from "react-router-dom";

const CategoryGrid = () => {
  const allCategories = [
    {
      icon: Wrench,
      name: "Engine Parts",
      count: "2,450+ Products",
      image: "https://red-parts.react.themeforest.scompiler.ru/themes/blue/images/products/product-13-1.jpg",
      color: "from-green-600 to-green-700",
      link: "/category/engine-parts"
    },
    {
      icon: Cog,
      name: "Transmission",
      count: "1,830+ Products",
      image: "https://red-parts.react.themeforest.scompiler.ru/themes/blue/images/products/product-4-1.jpg",
      color: "from-green-600 to-green-700",
      link: "/category/transmission"
    },
    {
      icon: Disc,
      name: "Brake System",
      count: "3,120+ Products",
      image: "https://red-parts.react.themeforest.scompiler.ru/themes/blue/images/products/product-2-1.jpg",
      color: "from-green-500 to-green-600",
      link: "/category/brakes-suspension"
    },
    {
      icon: Zap,
      name: "Electrical Parts",
      count: "1,950+ Products",
      image: "https://red-parts.react.themeforest.scompiler.ru/themes/blue/images/products/product-3-1.jpg",
      color: "from-green-500 to-green-600",
      link: "/category/electrical-parts"
    },
    {
      icon: Gauge,
      name: "Hydraulic Parts",
      count: "980+ Products",
      image: "https://5.imimg.com/data5/SELLER/Default/2025/1/478521189/NT/ZX/ZI/132966626/hydraulic-part-250x250.png",
      color: "from-green-600 to-green-700",
      link: "/category/engine-parts"
    },
    {
      icon: Tractor,
      name: "Body Parts",
      count: "2,670+ Products",
      image: "https://5.imimg.com/data5/SELLER/Default/2023/10/354838043/DA/RR/KO/26547004/3611085m91-control-valve-assembly-250x250.jpg",
      color: "from-green-500 to-green-600",
      link: "/category/body-parts"
    },
    {
      icon: Filter,
      name: "Filters",
      count: "1,540+ Products",
      image: "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?q=80&w=1200&auto=format&fit=crop",
      color: "from-green-600 to-green-700",
      link: "/category/filters-fluids"
    },
    {
      icon: Fuel,
      name: "Fuel System",
      count: "890+ Products",
      image: "https://5.imimg.com/data5/SELLER/Default/2025/3/497361944/SI/YM/GV/1143955/dual-fuel-system-250x250.jpg",
      color: "from-green-500 to-green-600",
      link: "/category/filters-fluids"
    },
  ];

  const loopCategories = [...allCategories, ...allCategories];

  return (
    <section className="bg-gray-50 overflow-hidden w-full">
      {/* Updated Keyframe Injection with Hover Pause State Rules */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-continuous {
          display: flex;
          width: max-content;
          animation: marquee 35s linear infinite;
        }
        /* Pauses the slider timeline when mouse hovers over track element */
        .animate-marquee-continuous:hover {
          animation-play-state: paused;
        }
      `}} />

      {/* STANDARDIZED: Same spacing pattern as other components */}
      <div className="px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pt-12 md:pt-16 lg:pt-20">
        {/* Inner container with bottom padding to match top spacing */}
        <div className="w-full max-w-[1440px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto">
          
          {/* UPDATED: Header with badge/title on left, button on right */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8 md:mb-12">
            {/* Left side: Badge, Title and Description */}
            <div className="flex-1">
             
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
                Shop By <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-700">Category</span>
              </h2>
              <p className="text-gray-600 text-base md:text-lg max-w-2xl">
                Explore tractor spare parts & agriculture equipment categories for every farming need
              </p>
            </div>

            {/* Right side: View All Button - aligned with title baseline */}
            <div className="sm:flex-shrink-0">
              <Link to="/spare-parts">
                <button className="inline-flex cursor-pointer items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3.5 rounded-xl transition-all hover:shadow-lg group whitespace-nowrap">
                  View All Categories
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>

          {/* Infinite Loop Slider Track */}
          <div className="relative w-full overflow-hidden mask-gradient-edges">
            {/* Fading Edge Vignette Effect */}
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

            {/* Slider Row Container */}
            <div className="animate-marquee-continuous gap-6 py-4">
              {loopCategories.map((cat, i) => (
                <Link
                  key={i}
                  to={cat.link}
                  className="group relative w-35 h-35 lg:w-40 lg:h-40 rounded-full overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-500 flex-shrink-0 border-4 border-white block"
                >
                  {/* Circular Zoom Image Background */}
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Dark Vignette Mask Layer */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black/80" />

                  {/* Card Elements Layered Inside Circle */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white">
                    {/* Circle Rounded floating icon */}
                    <div className={`w-11 h-11 rounded-full bg-gradient-to-r ${cat.color} flex items-center justify-center shadow-md  mb-2`}>
                      <cat.icon className="h-5 w-5 text-white" />
                    </div>

                    {/* Text Details */}
                    <h3 className="text-sm lg:text-lg font-bold leading-tight px-2">{cat.name}</h3>
                    <p className="text-white/70 text-xs font-medium mt-1 mb-2">{cat.count}</p>

                    {/* Explorable Arrow Animation */}
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-green-400 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <span>Explore</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;