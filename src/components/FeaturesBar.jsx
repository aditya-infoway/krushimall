import React from 'react';
import { Tractor, Wrench, Settings, ArrowRight } from 'lucide-react';

const FeaturesBar = () => {
  const features = [
    {
      id: 1,
      title: 'Premium Tractors',
      description: 'Explore our latest lineup of high-performance, fuel-efficient tractors built to tackle any field or farming demand.',
      icon: <Tractor className="w-6 h-6 text-green-600 group-hover:text-white transition-colors duration-300" />,
      link: '/tractors',
      buttonText: 'View Inventory'
    },
    {
      id: 2,
      title: 'Genuine Spare Parts',
      description: 'Keep your machinery running like new with our extensive catalog of certified, factory-original replacement parts.',
      icon: <Settings className="w-6 h-6 text-green-600 group-hover:text-white transition-all duration-500 group-hover:rotate-90" />,
      link: '/spare-parts',
      buttonText: 'Shop Parts'
    },
    {
      id: 3,
      title: 'Expert Service',
      description: 'Schedule routine maintenance or urgent repairs with our certified technicians to minimize your downtime.',
      icon: <Wrench className="w-6 h-6 text-green-600 group-hover:text-white transition-all duration-300 group-hover:-translate-y-0.5 group-hover:rotate-12" />,
      link: '/service',
      buttonText: 'Book Service'
    }
  ];

  return (
    // STANDARDIZED: Same spacing pattern as BrandsMakers for consistency
    <div className="w-full bg-gray-50 pt-12 md:pt-16 lg:pt-20 px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46">
      {/* Inner container with bottom padding to match top spacing */}
      <div className="w-full max-w-[1440px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto ">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 xl:gap-10">
          {features.map((feature) => (
            <div 
              key={feature.id} 
              className="group bg-white rounded-2xl border-2 border-gray-200 p-6 lg:p-8 flex flex-col justify-between transition-all duration-300 hover:border-green-600 hover:shadow-xl hover:shadow-green-900/5 hover:-translate-y-1"
            >
              <div>
                {/* Icon & Title Header */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center shrink-0 border border-green-100 transition-all duration-300 group-hover:bg-green-600 group-hover:border-green-600 group-hover:scale-105">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-black text-gray-900 tracking-tight transition-colors duration-300 group-hover:text-green-900">
                    {feature.title}
                  </h3>
                </div>
                
                {/* Description Text */}
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {feature.description}
                </p>
              </div>

              {/* Full Action Button */}
              <a
                href={feature.link}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold rounded-xl text-green-700 bg-green-50 hover:bg-green-700 hover:text-white transition-all duration-200"
              >
                <span>{feature.buttonText}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </a>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
};

export default FeaturesBar;

