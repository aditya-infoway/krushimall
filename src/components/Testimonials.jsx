import { useState, useEffect, useRef } from "react";
import { Star, ChevronLeft, ChevronRight, Quote, User } from "lucide-react";

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const reviews = [
    {
      name: "Rajesh Kumar",
      role: "Farmer - Meerut, UP",
      text: "I bought a Mahindra 575 DI through this site. The EMI option made it very affordable. Delivery was on time and the tractor was in perfect condition.",
      rating: 5,
      tractor: "Mahindra 575 DI",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    {
      name: "Reena Patel",
      role: "Farm Owner - Gujarat",
      text: "I ordered spare parts for my Swaraj tractor. Genuine parts at half the price compared to local dealers. Fast delivery and excellent packaging.",
      rating: 5,
      tractor: "Swaraj 744 FE",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    },
    {
      name: "Amit Sharma",
      role: "Tractor Dealer - Punjab",
      text: "As a dealer, I've been sourcing parts from here for 2 years. Great wholesale prices and bulk discounts. Their service center is very reliable.",
      rating: 5,
      tractor: "Multiple Brands",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    },
    {
      name: "Mohammad Farhan",
      role: "Farmer - UP West",
      text: "Sold my old Eicher tractor here within 3 days at a good price. The verification process was smooth and the buyer was genuine.",
      rating: 4,
      tractor: "Eicher 380",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    },
    {
      name: "Vikram Singh",
      role: "Workshop Owner - Haryana",
      text: "The hydraulic pump I ordered was OEM quality and fit perfectly. Saved 40% compared to showroom price. Will definitely order again!",
      rating: 5,
      tractor: "John Deere 5310",
      avatar:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    },
    {
      name: "Deepak Yadav",
      role: "Farmer - Rajasthan",
      text: "Got my tractor serviced through their nearby service. Mechanic came on time, did full service at my farm itself. Very convenient and affordable.",
      rating: 5,
      tractor: "Sonalika DI 750",
      avatar:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
    },
    {
      name: "Harpreet Singh",
      role: "Farmer - Punjab",
      text: "Best prices for tractor parts online. Ordered brake shoes and filters, all genuine products. Delivery was quick and packaging was excellent.",
      rating: 5,
      tractor: "Mahindra Arjun 605",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    {
      name: "Ramesh Patel",
      role: "Farm Owner - MP",
      text: "The finance option helped me buy my dream tractor. Easy EMI process and minimal documentation. Highly recommended for tractor loans.",
      rating: 4,
      tractor: "John Deere 5050D",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    },
    {
      name: "Sunil Verma",
      role: "Tractor Mechanic - UP",
      text: "I recommend Krushi Mall to all my customers. Genuine parts at wholesale rates. The service center support is also excellent.",
      rating: 5,
      tractor: "Multiple Brands",
      avatar:
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    },
  ];

  const totalSlides = Math.ceil(reviews.length / 3);
  const mobileTotalSlides = reviews.length;

  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % totalSlides);
        setMobileIndex((prev) => (prev + 1) % mobileTotalSlides);
        setIsTransitioning(false);
      }, 200);
    }, 4000);

    return () => clearInterval(timer);
  }, [isAutoPlaying, totalSlides, mobileTotalSlides]);

  const handleDesktopSlideChange = (getNewIndex) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(getNewIndex);
      setIsTransitioning(false);
    }, 200);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const handleMobileSlideChange = (getNewIndex) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setMobileIndex(getNewIndex);
      setIsTransitioning(false);
    }, 300);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const goToPrevious = () => {
    handleDesktopSlideChange((prev) => (prev - 1 + totalSlides) % totalSlides);
    handleMobileSlideChange((prev) => (prev - 1 + mobileTotalSlides) % mobileTotalSlides);
  };

  const goToNext = () => {
    handleDesktopSlideChange((prev) => (prev + 1) % totalSlides);
    handleMobileSlideChange((prev) => (prev + 1) % mobileTotalSlides);
  };

  const goToDesktopSlide = (index) => {
    handleDesktopSlideChange(() => index);
    handleMobileSlideChange(() => index * 3);
  };

  const goToMobileSlide = (index) => {
    handleMobileSlideChange(() => index);
    handleDesktopSlideChange(() => Math.floor(index / 3));
  };

  const getVisibleReviews = () => {
    const start = currentIndex * 3;
    return reviews.slice(start, start + 3);
  };

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white overflow-hidden w-full">
      <div className="px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pt-12 md:pt-16 lg:pt-20">
        <div className="w-full max-w-[1440px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto pb-12 md:pb-16 lg:pb-20">
          
          {/* Header - Left Aligned */}
          <div className="mb-10 md:mb-14">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
              What Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-700">
                Customers
              </span>{" "}
              Say
            </h2>

            <p className="text-gray-600 text-base md:text-lg max-w-2xl">
              Trusted by thousands of farmers and tractor owners across India
            </p>
          </div>

          {/* MOBILE VIEW - 1.5 cards */}
          <div className="md:hidden relative">
            <div className="relative overflow-hidden px-8">
              <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{
                  transform: `translateX(-${mobileIndex * (100 / 1.5)}%)`,
                }}
              >
                {reviews.map((review, idx) => (
                  <div
                    key={idx}
                    className="flex-shrink-0 px-2"
                    style={{ width: `${100 / 1.5}%` }}
                  >
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 relative overflow-hidden flex flex-col justify-between min-h-[280px]">
                      {/* Decorative Quote Mark */}
                      <div className="absolute top-4 right-6 opacity-5 pointer-events-none">
                        <Quote className="h-16 w-16 text-gray-900" />
                      </div>

                      {/* Top Section: Review Text */}
                      <div className="mb-6">
                        <blockquote className="text-sm text-gray-700 leading-relaxed italic">
                          "{review.text}"
                        </blockquote>
                      </div>

                      {/* Bottom Section: Combined User Profile & Information */}
                      <div className="border-t border-gray-100 pt-4 mt-auto">
                        <div className="flex items-center gap-3">
                          {/* Rounded Image Avatar */}
                          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-green-500 shadow-sm flex-shrink-0 bg-gray-100">
                            {review.avatar ? (
                              <img
                                src={review.avatar}
                                alt={review.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "";
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
                                <User className="h-6 w-6" />
                              </div>
                            )}
                          </div>

                          {/* Metadata column */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-0.5">
                              <p className="font-bold text-gray-900 text-sm truncate">
                                {review.name}
                              </p>
                              <div className="flex gap-0.5 flex-shrink-0">
                                {[...Array(5)].map((_, starIndex) => (
                                  <Star
                                    key={starIndex}
                                    className={`h-3 w-3 ${
                                      starIndex < review.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-200"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-gray-500 gap-1">
                              <p className="truncate max-w-[60%]">{review.role}</p>
                              <span className="font-semibold text-green-700 bg-green-50 px-1.5 py-0.5 rounded text-[10px] truncate max-w-[40%]">
                                {review.tractor}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile Navigation Arrows */}
              <button
                onClick={goToPrevious}
                className="absolute cursor-pointer left-0 top-1/2 -translate-y-1/2 bg-white text-gray-700 rounded-full p-1.5 shadow-lg transition-all z-10 border border-gray-200 w-8 h-8 flex items-center justify-center"
                aria-label="Previous reviews"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                onClick={goToNext}
                className="absolute cursor-pointer right-0 top-1/2 -translate-y-1/2 bg-white text-gray-700 rounded-full p-1.5 shadow-lg transition-all z-10 border border-gray-200 w-8 h-8 flex items-center justify-center"
                aria-label="Next reviews"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Mobile Dots */}
            <div className="flex justify-center items-center gap-3 mt-8">
              {[...Array(mobileTotalSlides)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToMobileSlide(index)}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    mobileIndex === index
                      ? "w-8 h-2.5 bg-green-600 shadow-lg"
                      : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Mobile Counter */}
            <div className="text-center mt-4 text-sm text-gray-400 font-medium">
              {mobileIndex + 1} / {mobileTotalSlides}
            </div>
          </div>

          {/* DESKTOP VIEW - Original 3 cards grid */}
          <div className="hidden md:block">
            <div className="relative px-10 md:px-14">
              {/* Reviews Grid - 3 per row */}
              <div
                className={`grid md:grid-cols-3 gap-4 md:gap-6 transition-all duration-300 ${
                  isTransitioning
                    ? "opacity-0 translate-y-2"
                    : "opacity-100 translate-y-0"
                }`}
              >
                {getVisibleReviews().map((review, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-7 relative overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between min-h-[280px]"
                  >
                    {/* Decorative Quote Mark */}
                    <div className="absolute top-4 right-6 opacity-5 pointer-events-none">
                      <Quote className="h-16 w-16 text-gray-900" />
                    </div>

                    {/* Top Section: Review Text */}
                    <div className="mb-6">
                      <blockquote className="text-sm md:text-base text-gray-700 leading-relaxed italic">
                        "{review.text}"
                      </blockquote>
                    </div>

                    {/* Bottom Section: Combined User Profile & Information */}
                    <div className="border-t border-gray-100 pt-4 mt-auto">
                      <div className="flex items-center gap-3">
                        {/* Rounded Image Avatar */}
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-green-500 shadow-sm flex-shrink-0 bg-gray-100">
                          {review.avatar ? (
                            <img
                              src={review.avatar}
                              alt={review.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
                              <User className="h-6 w-6" />
                            </div>
                          )}
                        </div>

                        {/* Metadata column containing Details, Stars, and Vehicle Type */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <p className="font-bold text-gray-900 text-sm truncate">
                              {review.name}
                            </p>
                            {/* Rating Row inside profile scope */}
                            <div className="flex gap-0.5 flex-shrink-0">
                              {[...Array(5)].map((_, starIndex) => (
                                <Star
                                  key={starIndex}
                                  className={`h-3 w-3 ${
                                    starIndex < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-200"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-gray-500 gap-1">
                            <p className="truncate max-w-[60%]">{review.role}</p>
                            <span className="font-semibold text-green-700 bg-green-50 px-1.5 py-0.5 rounded text-[10px] truncate max-w-[40%]">
                              {review.tractor}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Navigation Arrows */}
              <button
                onClick={goToPrevious}
                className="absolute cursor-pointer left-0 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 text-gray-700 rounded-full p-2.5 shadow-lg hover:shadow-xl transition-all z-10 border border-gray-200 w-10 h-10 flex items-center justify-center"
                aria-label="Previous reviews"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                onClick={goToNext}
                className="absolute cursor-pointer right-0 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 text-gray-700 rounded-full p-2.5 shadow-lg hover:shadow-xl transition-all z-10 border border-gray-200 w-10 h-10 flex items-center justify-center"
                aria-label="Next reviews"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Desktop Dots */}
            <div className="flex justify-center items-center gap-3 mt-10">
              {[...Array(totalSlides)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToDesktopSlide(index)}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    currentIndex === index
                      ? "w-8 h-2.5 bg-green-600 shadow-lg"
                      : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Desktop Counter */}
            <div className="text-center mt-4 text-sm text-gray-400 font-medium">
              {currentIndex + 1} / {totalSlides}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Testimonials;