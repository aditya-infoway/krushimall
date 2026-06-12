import { useState, useEffect, useRef } from "react";
import {
  Heart,
  Share2,
  Phone,
  ChevronLeft,
  ChevronRight,
  Settings,
  Gauge,
  GitBranch,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";
import EnquiryModal from "../components/EnquiryModal";

const TractorDetail = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [wishlist, setWishlist] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [relatedIndex, setRelatedIndex] = useState(0);
  const intervalRef = useRef(null);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const relatedScrollRef = useRef(null);
const [isScrollingRelated, setIsScrollingRelated] = useState(false);
const scrollTimeoutRef = useRef(null);
const containerRef = useRef(null);
const [zoomStyle, setZoomStyle] = useState({ display: "none", x: 50, y: 50 });

  const tractor = {
    name: "Swaraj 744 FE Good tractor",
    price: "₹ 265000",
    category: "Tractor",
    hp: "45 HP",
    cc: "3136 CC",
    drive: "2 WD",
    tyreCondition: "80%",
    engineCondition: "good",
    rc: "yes",
    phone: "12345 67890",
    description:
      "Ekdum Badhiya Tractor Farming Ke liye Best. Well-maintained tractor in excellent running condition. Single owner, regularly serviced at authorized center. All documents clear including RC and insurance.",
    images: ["/mah.png", "/mah.png", "/mah.png", "/mah.png"],
    similar: [
      { name: "Mahindra 265 DI", price: "₹ 460,000", image: "/mah.png" },
      { name: "Mahindra 575 DI", price: "₹ 165,000", image: "/mah.png" },
      { name: "HMT 5911 Tractor", price: "₹ 395,000", image: "/mah.png" },
      { name: "Eicher 241", price: "₹ 155,000", image: "/mah.png" },
    ],
    relatedProducts: [
      {
        id: 5,
        name: "Mahindra Arjun 605 Big Tractor",
        location: "Mettur",
        price: "₹8,50,000",
        image: "/mah.png",
      },
      {
        id: 6,
        name: "best swaraj tractor",
        location: "Bengaluru",
        price: "₹4,45,000",
        image: "/mah.png",
      },
      {
        id: 7,
        name: "Eicher 380 Tractor Best",
        location: "Karimnagar",
        price: "₹3,50,000",
        image: "/mah.png",
      },
      {
        id: 8,
        name: "Swaraj 744 FE",
        location: "Sandila",
        price: "₹3,70,000",
        image: "/mah.png",
      },
      {
        id: 9,
        name: "Swaraj 735 FE",
        location: "Moradabad",
        price: "₹1,55,000",
        image: "/mah.png",
      },
      {
        id: 10,
        name: "Mahindra 475 DI MS SP PLUS",
        location: "Barnala",
        price: "₹1,12,000",
        image: "/mah.png",
      },
    ],
  };

  // Auto-slide for related products
 useEffect(() => {
  intervalRef.current = setInterval(() => {
    if (window.innerWidth >= 640) {
      setRelatedIndex((prev) => (prev + 1) % tractor.relatedProducts.length);
    }
  }, 3000);
  return () => clearInterval(intervalRef.current);
}, []);

  const cardsToShow = 4;

  const getVisibleRelated = () => {
    const visible = [];
    for (let i = 0; i < cardsToShow; i++) {
      visible.push(
        tractor.relatedProducts[
          (relatedIndex + i) % tractor.relatedProducts.length
        ],
      );
    }
    return visible;
  };

  const slideRelated = (direction) => {
    clearInterval(intervalRef.current);
    if (direction === "next") {
      setRelatedIndex((prev) => (prev + 1) % tractor.relatedProducts.length);
    } else {
      setRelatedIndex(
        (prev) =>
          (prev - 1 + tractor.relatedProducts.length) %
          tractor.relatedProducts.length,
      );
    }
    intervalRef.current = setInterval(() => {
      setRelatedIndex((prev) => (prev + 1) % tractor.relatedProducts.length);
    }, 3000);
  };

  useEffect(() => {
  const slider = relatedScrollRef.current;
  if (!slider) return;

  const handleScroll = () => {
    setIsScrollingRelated(true);
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => setIsScrollingRelated(false), 1500);
  };

  slider.addEventListener("scroll", handleScroll, { passive: true });
  slider.addEventListener("touchstart", handleScroll, { passive: true });

  return () => {
    slider.removeEventListener("scroll", handleScroll);
    slider.removeEventListener("touchstart", handleScroll);
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
  };
}, []);


const scrollRelated = (direction) => {
  if (!relatedScrollRef.current) return;
  const { scrollLeft, clientWidth } = relatedScrollRef.current;
  relatedScrollRef.current.scrollTo({
    left: direction === "left" ? scrollLeft - clientWidth * 0.8 : scrollLeft + clientWidth * 0.8,
    behavior: "smooth",
  });
};

const handleMouseMove = (e) => {
  if (!containerRef.current) return;
  const rect = containerRef.current.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;

  setZoomStyle({
    display: "block",
    x: x,
    y: y,
  });
};

const handleMouseLeave = () => {
  setZoomStyle({ display: "none", x: 50, y: 50 });
};

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Breadcrumb */}
      <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pt-8 pb-4">
        <div className="flex items-center gap-2 text-sm">
          <Link to="/" className="text-green-600 hover:text-green-700 font-medium">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <Link
            to="/tractor"
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Tractor
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-500">{tractor.name}</span>
        </div>
      </div>

      {/* Main Layout */}
      <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT IMAGE SECTION */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
             <div
  ref={containerRef}
  className="relative aspect-[1/1] bg-gray-100 overflow-hidden cursor-zoom-in"
  onMouseMove={handleMouseMove}
  onMouseLeave={handleMouseLeave}
>
  <img
    src={tractor.images[currentImage]}
    alt=""
    className="w-full h-full transition-transform duration-200"
    style={{
      transform:
        zoomStyle.display === "block" ? "scale(2)" : "scale(1)",
      transformOrigin: `${zoomStyle.x || 50}% ${zoomStyle.y || 50}%`,
    }}
  />
                <button
                  onClick={() =>
                    setCurrentImage((prev) =>
                      prev === 0 ? tractor.images.length - 1 : prev - 1,
                    )
                  }
                  className="absolute cursor-pointer left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-all"
                >
                  <ChevronLeft className="text-gray-700" size={20} />
                </button>
                <button
                  onClick={() =>
                    setCurrentImage(
                      (prev) => (prev + 1) % tractor.images.length,
                    )
                  }
                  className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-all"
                >
                  <ChevronRight className="text-gray-700" size={20} />
                </button>

                {/* Slide counter */}
                <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-3 py-1 rounded-full z-20">
    slide {currentImage + 1} of {tractor.images.length}
  </div>

  <div className="absolute top-3 right-3 flex gap-2 z-20">
    <button
      onClick={() => setWishlist(!wishlist)}
      className="w-10 h-10 cursor-pointer bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all"
    >
      <Heart
        size={18}
        className={`${wishlist ? "fill-green-500 text-green-500" : "text-gray-500"}`}
      />
    </button>
    <button className="w-10 h-10 cursor-pointer bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all">
      <Share2 size={18} className="text-gray-500" />
    </button>
  </div>
</div>


              <div className="flex gap-2 p-3 overflow-x-auto">
                {tractor.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`w-20 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                      currentImage === index
                        ? "border-green-500 shadow-md"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CENTER DETAILS */}
          <div className=" lg:col-span-4">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="inline-block bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
                {tractor.category}
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                {tractor.name}
              </h1>
              <p className="text-3xl font-black text-gray-900 mb-6">
                {tractor.price}
              </p>

              <button className="w-full py-3 cursor-pointer rounded-xl bg-green-600 hover:shadow-lg text-white font-semibold text-lg mb-6 transition-all">
                <Phone className="inline mr-2" size={18} />
                Call Seller
              </button>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-gray-50 rounded-xl p-3 flex flex-col items-center justify-center">
                  <Gauge className="text-gray-600 mb-1" size={20} />
                  <p className="text-xs font-semibold text-gray-900">
                    {tractor.hp}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 flex flex-col items-center justify-center">
                  <Settings className="text-gray-600 mb-1" size={20} />
                  <p className="text-xs font-semibold text-gray-900">
                    {tractor.cc}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 flex flex-col items-center justify-center">
                  <GitBranch className="text-gray-600 mb-1" size={20} />
                  <p className="text-xs font-semibold text-gray-900">
                    {tractor.drive}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-100">
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Tyre Condition:</span>
                  <span className="font-semibold text-gray-900">
                    {tractor.tyreCondition}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Engine Condition:</span>
                  <span className="font-semibold text-gray-900 capitalize">
                    {tractor.engineCondition}
                  </span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-gray-600">RC Available:</span>
                  <span className="font-semibold text-gray-900 capitalize">
                    {tractor.rc}
                  </span>
                </div>
              </div>

              <div className="mt-6 bg-gradient-to-r from-green-50 to-green-50 rounded-xl p-4 flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg bg-white flex items-center justify-center shadow-sm">
                  <img src="/mah.png" alt="" className="w-8" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">Swaraj 744 FE</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    New Product Available.
                  </p>
                  <button
                    onClick={() => setShowEnquiryModal(true)}
                    className="bg-green-600 text-white cursor-pointer px-4 py-1.5 rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
                  >
                    Enquiry
                  </button>
                </div>
              </div>

              <button className="mt-4 w-full border-2 border-gray-200 rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all">
                <Share2 className="inline mr-2" size={16} />
                Share
              </button>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-5">
                Need Help?
              </h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center">
                  <Phone className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Call us:</p>
                  <p className="font-semibold text-gray-900">{tractor.phone}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-5">
                Similar  <span className="text-transparent bg-clip-text bg-green-600"> Products </span>
              </h3>
              <div className="space-y-4">
                {tractor.similar.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl border border-gray-200 shadow-sm p-3 flex gap-3 hover:shadow-lg transition-all"
                  >
                    <div className="w-[92px] h-[92px] rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={item.image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900 leading-snug">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1">Unknown</p>
                      </div>
                      <p className="font-bold text-gray-900">{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs - Description & Product Details */}
        <div className="mt-10 mb-6">
          <div className="flex gap-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("description")}
              className={`pb-4 font-semibold transition-all ${
                activeTab === "description"
                  ? "border-b-2 border-green-500 text-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab("details")}
              className={`pb-4 font-semibold transition-all ${
                activeTab === "details"
                  ? "border-b-2 border-green-500 text-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Product Details
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mt-4">
            {activeTab === "description" ? (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {tractor.description}
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Product Details
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Tyre Condition:</span>
                    <span className="font-semibold text-gray-900">
                      {tractor.tyreCondition}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Engine Condition:</span>
                    <span className="font-semibold text-gray-900 capitalize">
                      {tractor.engineCondition}
                    </span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-gray-600">RC Available:</span>
                    <span className="font-semibold text-gray-900 capitalize">
                      {tractor.rc}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Slider */}
{/* Related Products Slider */}
<div className="mt-10">
  <h2 className="text-2xl font-bold text-gray-900 mb-2">
    Related Products <span className="text-transparent bg-clip-text bg-green-600"> - Tractor </span>
  </h2>
  <p className="text-gray-500 text-sm mb-6">
    Short Details About Tractor
  </p>

  {/* MOBILE - Native scroll with arrows on touch */}
  <div className="sm:hidden relative">
    <button
      onClick={() => scrollRelated("left")}
      className={`cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 -ml-1 z-20 flex items-center justify-center w-8 h-8 border border-green-200 text-green-700 rounded-full bg-white shadow-lg hover:bg-green-50 transition-all duration-300 ${
        isScrollingRelated ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
      }`}
    >
      <ChevronLeft className="h-4 w-4" />
    </button>

    <div
      ref={relatedScrollRef}
      className="flex overflow-x-auto gap-3 pb-4 px-4 scrollbar-hide snap-x snap-mandatory scroll-smooth"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {tractor.relatedProducts.map((product) => (
        <Link
          key={product.id}
          to={`/tractor/${product.id}`}
          className="snap-start w-[75vw] flex-shrink-0"
        >
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition-all">
            <div className="bg-gray-100 h-36 sm:h-40">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-3">
              <div className="text-xs bg-green-600 text-white inline-block px-2 py-0.5 rounded-full mb-2">Tractor</div>
              <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">{product.name}</h4>
              <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                <MapPin className="h-3 w-3" />
                <span>{product.location}</span>
              </div>
              <p className="text-base font-bold text-gray-900">{product.price}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>

    <button
      onClick={() => scrollRelated("right")}
      className={`cursor-pointer absolute right-0 top-1/2 -translate-y-1/2 -mr-1 z-20 flex items-center justify-center w-8 h-8 border border-green-200 text-green-700 rounded-full bg-white shadow-lg hover:bg-green-50 transition-all duration-300 ${
        isScrollingRelated ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
      }`}
    >
      <ChevronRight className="h-4 w-4" />
    </button>
  </div>

  {/* DESKTOP - Original slider unchanged */}
  <div className="hidden sm:block relative px-8 sm:px-10 lg:px-12">
    <button
      onClick={() => slideRelated("prev")}
      className="absolute left-0 sm:left-1 lg:left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white border border-gray-200 cursor-pointer rounded-full shadow-md flex items-center justify-center hover:bg-green-50 hover:border-green-300 transition-all"
    >
      <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
    </button>

    <div className="overflow-hidden">
      <div className="flex gap-3 sm:gap-4 transition-transform duration-500 ease-in-out">
        {getVisibleRelated().map((product, idx) => (
          <Link
            key={`${product.id}-${relatedIndex}-${idx}`}
            to={`/tractor/${product.id}`}
            className="flex-shrink-0 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition-all w-full sm:w-[calc(50%-6px)] lg:w-[calc(25%-12px)]"
          >
            <div className="bg-gray-100 h-36 sm:h-40">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-3">
              <div className="text-xs bg-green-600 text-white inline-block px-2 py-0.5 rounded-full mb-2">Tractor</div>
              <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">{product.name}</h4>
              <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                <MapPin className="h-3 w-3" />
                <span>{product.location}</span>
              </div>
              <p className="text-base font-bold text-gray-900">{product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>

    <button
      onClick={() => slideRelated("next")}
      className="absolute right-0 sm:right-1 lg:right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 cursor-pointer bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center hover:bg-green-50 hover:border-green-300 transition-all"
    >
      <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
    </button>
  </div>

  <div className="text-center mt-8">
    <Link
      to="/tractors"
      className="inline-block cursor-pointer bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
    >
      View All
    </Link>
  </div>
</div>
      </div>
      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={showEnquiryModal}
        onClose={() => setShowEnquiryModal(false)}
      />
    </div>
  );
};

export default TractorDetail;
