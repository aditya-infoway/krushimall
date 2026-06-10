import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import trac from "../assets/mahindra.png"

const PromoBanners = () => {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white w-full">
      {/* Updated: Matching BrandsMakers spacing */}
      <div className="px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pt-12 md:pt-16 lg:pt-20">
        {/* Updated: Applied the same max-width wrapper */}
        <div className="w-full max-w-[1440px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-8">
            {/* Banner 1: Motor Oils */}
            <div className="relative overflow-hidden rounded-2xl bg-green-600 h-64 md:h-72 lg:h-80 xl:h-96 group shadow-lg border-2 border-green-300">
              {/* Background Image */}
              <img
                src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop&q=60"
                alt="Motor Oils"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-center items-start p-8 sm:p-10 xl:p-12 z-10">
                <h3 className="text-2xl sm:text-3xl xl:text-4xl font-black text-white tracking-wide uppercase mb-2">
                  Motor <span className="text-green-200">Oils</span>
                </h3>
                <p className="text-green-100 text-sm sm:text-base xl:text-lg font-medium mb-6 leading-relaxed max-w-xs xl:max-w-sm">
                  Synthetic motor oil with free shipping. Friction free life
                  guaranteed.
                </p>
                <Link to="/spare-parts">
                  <button className="inline-flex items-center gap-2 bg-white text-green-700 text-sm xl:text-base font-bold px-6 py-3 rounded-xl transition-all hover:bg-green-50 shadow-md group/btn cursor-pointer">
                    Shop Now
                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>
            </div>

            {/* Banner 2: Save Up To Offer */}
            <div className="relative overflow-hidden rounded-2xl bg-green-700 h-64 md:h-72 lg:h-80 xl:h-96 group shadow-lg border-2 border-green-300">
              {/* Background Image */}
              <img
                src={trac}
                alt="Car Interior"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-center items-start p-8 sm:p-10 xl:p-12 z-10">
                <div className="bg-white text-green-700 text-xs sm:text-sm xl:text-base font-black px-3 py-1 rounded-md tracking-wider uppercase mb-3 shadow-md">
                  Save Up To ₹3,000
                </div>
                <p className="text-green-100 text-sm sm:text-base xl:text-lg font-medium mb-6 leading-relaxed max-w-xs xl:max-w-sm">
                  Luxurious interior parts for real aesthetes. Leather, fabric,
                  ivory and more.
                </p>
                <Link to="/spare-parts">
                  <button className="inline-flex items-center gap-2 bg-white text-green-700 text-sm xl:text-base font-bold px-6 py-3 rounded-xl transition-all hover:bg-green-50 shadow-md group/btn cursor-pointer">
                    Shop Now
                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default PromoBanners;