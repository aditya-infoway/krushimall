import React, { useState, useEffect } from 'react';

const TrustCounter = () => {
  const targets = { farmers: 45000, parts: 120000, rating: 4.9, years: 15 };

  const [farmers, setFarmers] = useState(0);
  const [parts, setParts] = useState(0);
  const [rating, setRating] = useState(0);
  const [years, setYears] = useState(0);

  useEffect(() => {
    const duration = 2000; 
    const steps = 50;
    const stepTime = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      
      setFarmers(Math.floor((targets.farmers / steps) * currentStep));
      setParts(Math.floor((targets.parts / steps) * currentStep));
      setYears(Math.floor((targets.years / steps) * currentStep));
      setRating(parseFloat(((targets.rating / steps) * currentStep).toFixed(1)));

      if (currentStep >= steps) {
        setFarmers(targets.farmers);
        setParts(targets.parts);
        setRating(targets.rating);
        setYears(targets.years);
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white w-full">
      {/* Updated: Matching BrandsMakers spacing */}
      <div className="px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pt-12 md:pt-16 lg:pt-20">
        {/* Updated: Applied the same max-width wrapper */}
        <div className="w-full max-w-[1440px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 xl:gap-6">
            
            {/* Card 1 */}
            <div className="bg-white border border-green-100 rounded-xl p-4 md:p-5 xl:p-6 text-center hover:border-green-300 hover:bg-green-50/20 transition-all duration-300 shadow-sm">
              <div className="text-xl md:text-2xl xl:text-3xl font-black text-green-950">
                {(farmers / 1000).toFixed(0)}K+
              </div>
              <div className="text-[10px] md:text-[11px] xl:text-xs font-bold text-green-700/60 uppercase tracking-wider mt-1">
                Happy Farmers Served
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-green-100 rounded-xl p-4 md:p-5 xl:p-6 text-center hover:border-green-300 hover:bg-green-50/20 transition-all duration-300 shadow-sm">
              <div className="text-xl md:text-2xl xl:text-3xl font-black text-green-950">
                {(parts / 1000).toFixed(0)}K+
              </div>
              <div className="text-[10px] md:text-[11px] xl:text-xs font-bold text-green-700/60 uppercase tracking-wider mt-1">
                Spare Parts Cataloged
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-green-100 rounded-xl p-4 md:p-5 xl:p-6 text-center hover:border-green-300 hover:bg-green-50/20 transition-all duration-300 shadow-sm">
              <div className="text-xl md:text-2xl xl:text-3xl font-black text-green-950">
                {rating.toFixed(1)} / 5.0
              </div>
              <div className="text-[10px] md:text-[11px] xl:text-xs font-bold text-green-700/60 uppercase tracking-wider mt-1">
                Customer Satisfaction
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white border border-green-100 rounded-xl p-4 md:p-5 xl:p-6 text-center hover:border-green-300 hover:bg-green-50/20 transition-all duration-300 shadow-sm">
              <div className="text-xl md:text-2xl xl:text-3xl font-black text-green-950">
                {years}Yrs+
              </div>
              <div className="text-[10px] md:text-[11px] xl:text-xs font-bold text-green-700/60 uppercase tracking-wider mt-1">
                Agricultural Legacy
              </div>
            </div>

          </div>
          
        </div>
      </div>
    </section>
  );
};

export default TrustCounter;