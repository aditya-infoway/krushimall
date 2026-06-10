import React from "react";
import { ShieldCheck, BadgeIndianRupee, Package } from "lucide-react";

const WhyChooseSection = () => {
  const benefits = [
    {
      icon: ShieldCheck,
      title: "100% Genuine Parts",
      description:
        "Every tractor part is verified for quality and authenticity. We source directly from trusted manufacturers and authorized dealers.",
    },
    {
      icon: BadgeIndianRupee,
      title: "Best Market Prices",
      description:
        "Competitive pricing on all tractor spare parts. Save up to 40% compared to showroom prices with same quality assurance.",
    },
    {
      icon: Package,
      title: "50,000+ Parts Available",
      description:
        "Extensive inventory covering all major tractor brands. From engine components to hydraulic systems, we have everything.",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 w-full">
      {/* Updated: Matching BrandsMakers spacing */}
      <div className="px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pt-12 md:pt-16 lg:pt-20">
        {/* Updated: Applied the same max-width wrapper */}
        <div className="w-full max-w-[1440px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto">
          
          {/* Core Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 items-center">
            {/* Left Block: Image Container */}
            <div className="lg:col-span-5 relative group">
              <div className="absolute inset-0 bg-green-100 rounded-2xl transform rotate-3 scale-102 group-hover:rotate-1 transition-transform duration-300 -z-10 opacity-60" />

              <div className="w-full h-[350px] md:h-[450px] xl:h-[500px] rounded-2xl shadow-md border border-gray-100 overflow-hidden bg-gray-100">
                <img
                  /* OPTIONAL ALTERNATIVE IMAGES (Just copy-paste into src if you prefer them):
                    Alternative 1 (Close up mechanical wheel/tillage): https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&q=80&w=800
                    Alternative 2 (Farm scenery working tractor): https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=800
                  */
                  src="https://www.shutterstock.com/image-illustration/why-choose-us-symbol-concept-260nw-2579903629.jpg"
                  alt="Modern tractor working in agricultural field"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  onError={(e) => {
                    // Final safety net layout if user network blocks unsplash completely
                    e.target.style.display = "none";
                    e.target.parentNode.innerHTML = `
                      <div class="flex flex-col items-center justify-center p-6 text-center h-full bg-gradient-to-br from-green-600 to-green-800 text-white">
                        <svg class="w-14 h-14 mb-3 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        <h4 class="text-xl font-black tracking-tight">Krushi Mall Genuine Parts</h4>
                        <p class="text-xs text-green-100 max-w-xs mt-1.5 font-medium">Verified agricultural machinery spares and components.</p>
                      </div>
                    `;
                  }}
                />
              </div>
            </div>

            {/* Right Block: Content & Styled Bullets */}
            <div className="lg:col-span-7 space-y-8 xl:space-y-10">
              <div>
                
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
                  Why Choose{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-700">
                    Krushi Mall?
                  </span>
                </h2>
                <p className="text-gray-600 mt-2 text-sm md:text-base xl:text-lg font-medium">
                  India's most trusted tractor parts marketplace with quality
                  assurance and best prices.
                </p>
              </div>

              {/* Bullet List Container */}
              <div className="space-y-6 xl:space-y-8">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-4 xl:gap-5 group">
                    {/* Styled Bullet Icon */}
                    <div className="flex-shrink-0 w-10 h-10 xl:w-12 xl:h-12 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-green-600 mt-1 transition-all group-hover:bg-green-600 group-hover:text-white">
                      <benefit.icon className="h-5 w-5 xl:h-6 xl:w-6" />
                    </div>
                    {/* Point Content */}
                    <div className="space-y-1">
                      <h3 className="text-lg xl:text-xl font-bold text-gray-900 transition-colors group-hover:text-green-700">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 text-sm md:text-base xl:text-lg leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;