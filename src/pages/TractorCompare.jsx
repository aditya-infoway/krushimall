import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Listbox } from "@headlessui/react";
import {
  Tractor,
  Search,
  MapPin,
  Plus,
  Trash2,
  ArrowRightLeft,
  Star,
  ArrowRight,
  Check,
  ChevronDown,
} from "lucide-react";
import mah from "../assets/mahindra.png";
import john from "../assets/johndeere.png";
import swara from "../assets/swaraj.png";
import apiHelper from "../utils/apiHelper";

const BRANDS = ["Mahindra", "John Deere", "Swaraj"];

const SUGGESTED_COMPARISONS = [
  {
    title: "Mahindra 475 DI XP PLUS Comparison with similar tractors",
    left: {
      name: "Mahindra 475 DI XP P...",
      price: "₹ 6.40 Lakh*",
      image: mah,
    },
    right: { name: "Mahindra 575 DI", price: "₹ 6.95 Lakh*", image: swara },
    buttonText: "Mahindra 475 DI XP PLUS vs Mahindra 575 DI",
  },
  {
    title: "Popular Cross-Brand Matches",
    left: {
      name: "Mahindra 475 DI XP P...",
      price: "₹ 6.40 Lakh*",
      image: mah,
    },
    right: { name: "Swaraj 724 XM", price: "₹ 5.09 Lakh*", image: john },
    buttonText: "Compare Now",
  },
  {
    title: "Top Heavy Duty Alternatives",
    left: {
      name: "John Deere 5050 D",
      price: "₹ 7.90 Lakh*",
      image: john,
    },
    right: { name: "Swaraj 744 FE", price: "₹ 7.80 Lakh*", image: swara },
    buttonText: "Compare Now",
  },
];

export default function TractorCompare() {
  const compareSectionRef = useRef(null);

  const [showComparison, setShowComparison] = useState(false);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showcaseTractors, setShowcaseTractors] = useState([]);
  const [slots, setSlots] = useState([
    {
      brand: "",
      model: "",
      variant: "",
      models: [],
      variants: [],
    },
    {
      brand: "",
      model: "",
      variant: "",
      models: [],
      variants: [],
    },
    {
      brand: "",
      model: "",
      variant: "",
      models: [],
      variants: [],
    },
  ]);

  useEffect(() => {
    const fetchTrending = async () => {
      const res = await apiHelper.get("/compare-tractor/trending");

      setShowcaseTractors(res.data);
    };

    fetchTrending();
  }, []);

  useEffect(() => {
    fetchCompareData();
  }, []);

  const fetchCompareData = async () => {
    try {
      setLoading(true);

      const res = await await apiHelper.get("/compare-tractor/brands");

      setBrands(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBrandChange = async (index, brandId) => {
    const updated = [...slots];

    updated[index].brand = brandId;
    updated[index].model = "";
    updated[index].variant = "";
    updated[index].models = [];
    updated[index].variants = [];

    setSlots(updated);

    const res = await apiHelper.get(
      `/compare-tractor/brands/${brandId}/models`,
    );

    updated[index].models = res.data;

    setSlots([...updated]);
  };

  const handleModelChange = async (index, modelId) => {
    const updated = [...slots];

    updated[index].model = modelId;
    updated[index].variant = "";
    updated[index].variants = [];

    setSlots(updated);

    const res = await apiHelper.get(
      `/compare-tractor/models/${modelId}/variants`,
    );

    updated[index].variants = res.data;

    setSlots([...updated]);
  };

  const handleVariantChange = async (index, variantId) => {
    const updated = [...slots];

    updated[index].variant = variantId;

    const res = await apiHelper.get(`/compare-tractor/variant/${variantId}`);

    console.log("API Response:", res.data);

    updated[index].details = res.data;

    console.log(res);

    setSlots(updated);
  };
  const clearSlot = (index) => {
    const updated = [...slots];
    updated[index] = {
      brand: "",
      model: "",
      variant: "",
      models: [],
      variants: [],
    };
    setSlots(updated);
    const activeCount = updated.filter((s) => s.model && s.variant).length;
    if (activeCount < 2) setShowComparison(false);
  };

  const activeTractors = slots
    .filter((s) => s.details)
    .map((s) => ({
      ...s.details,
      modelName: s.models.find((m) => m.id === s.model)?.modelName,
      variantName: s.variants.find((v) => v.id === s.variant)?.variantName,
    }));

  const scrollToCompare = () => {
    const y =
      compareSectionRef.current.getBoundingClientRect().top +
      window.pageYOffset -
      100;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });
  };

  return (
    // TractorCompare - wrapper div
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans antialiased">
      <main className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pt-12 md:pt-16 lg:pt-20 pb-6 lg:pb-10">
        {/* TOP CONFIGURATOR WORKSPACE */}
        <section
          ref={compareSectionRef}
          className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm "
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-2.5">
            Compare{" "}
            <span className="text-transparent bg-clip-text bg-green-600">
              {" "}
              Tractors Side-by-Side{" "}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mb-6 leading-relaxed">
            Select models to compare below. The layout adapts seamlessly to your
            chosen items.
          </p>

          {/* FIXED RESPONSIVE GRID: grid-cols-2 forces 2 inputs side by side on mobile devices */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 mb-6">
            {slots.map((slot, index) => {
              const modelSelected = !!slot.model;
              const variantSelected = !!slot.variant;
              const tractorDetails = slot.variants.find(
                (v) => v.id === slot.variant,
              );

              return (
                <div
                  key={index}
                  className={`border rounded-lg p-3 sm:p-5 flex flex-col justify-between transition-all duration-300 min-h-[240px] sm:min-h-[260px] bg-white relative ${
                    index === 2 ? "hidden md:flex" : "flex"
                  } ${
                    variantSelected
                      ? "border-green-500 bg-green-50/5 ring-1 ring-green-500/20"
                      : "border-dashed border-gray-300 bg-gray-50/50"
                  }`}
                >
                  {modelSelected && (
                    <button
                      onClick={() => clearSlot(index)}
                      className="absolute top-2 right-2 sm:top-3 sm:right-3 text-gray-400 hover:text-green-600 transition-colors p-1 z-20"
                    >
                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  )}
                  <div className="space-y-3 sm:space-y-4">
                    {/* Tractor Model - Headless UI Listbox */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                        Brand
                      </label>

                      <Listbox
                        value={slot.brand}
                        onChange={(value) => handleBrandChange(index, value)}
                      >
                        <div className="relative">
                          <Listbox.Button className="w-full p-2 bg-white border border-gray-300 rounded text-xs sm:text-sm text-left flex items-center justify-between">
                            <span
                              className={
                                slot.brand ? "text-gray-800" : "text-gray-400"
                              }
                            >
                              {brands.find((b) => b.id === slot.brand)
                                ?.brandName || "Select Brand"}
                            </span>

                            <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                          </Listbox.Button>

                          <Listbox.Options className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-auto py-1 text-xs sm:text-sm">
                            {brands.map((brand) => (
                              <Listbox.Option
                                key={brand.id}
                                value={brand.id}
                                className={({ active, selected }) =>
                                  `cursor-pointer px-3 py-2 flex items-center justify-between ${
                                    active
                                      ? "bg-green-50 text-green-700"
                                      : "text-gray-700"
                                  } ${selected ? "bg-green-100 font-medium" : ""}`
                                }
                              >
                                {({ selected }) => (
                                  <>
                                    <span> {brand.brandName}</span>

                                    {selected && (
                                      <Check className="h-3.5 w-3.5 text-green-600" />
                                    )}
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </div>
                      </Listbox>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                        Tractor Model
                      </label>
                      <Listbox
                        value={slot.model}
                        onChange={(value) => handleModelChange(index, value)}
                      >
                        <div className="relative">
                          <Listbox.Button className="w-full p-2 bg-white border border-gray-300 rounded text-xs sm:text-sm text-left focus:border-green-500 outline-none transition flex items-center justify-between">
                            <span
                              className={
                                slot.model ? "text-gray-800" : "text-gray-400"
                              }
                            >
                              {slot.models.find((m) => m.id === slot.model)
                                ?.modelName || "+ Add Tractor"}
                            </span>
                            <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                          </Listbox.Button>
                          <Listbox.Options className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-auto py-1 text-xs sm:text-sm">
                            {slot.models.map((model) => (
                              <Listbox.Option
                                key={model.id}
                                value={model.id}
                                className={({ active, selected }) =>
                                  `cursor-pointer px-3 py-2 flex items-center justify-between ${
                                    active
                                      ? "bg-green-50 text-green-700"
                                      : "text-gray-700"
                                  } ${selected ? "bg-green-100 font-medium" : ""}`
                                }
                              >
                                {({ selected }) => (
                                  <>
                                    <span>{model.modelName}</span>

                                    {selected && (
                                      <Check className="h-3.5 w-3.5 text-green-600" />
                                    )}
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </div>
                      </Listbox>
                    </div>

                    {/* Variant Select - Headless UI Listbox */}
                    {modelSelected && (
                      <div className="animate-fadeIn">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-green-700 mb-1">
                          Select Variant *
                        </label>
                        <Listbox
                          value={slot.variant}
                          onChange={(value) =>
                            handleVariantChange(index, value)
                          }
                        >
                          <div className="relative">
                            <Listbox.Button className="w-full p-2 bg-white border border-green-300 rounded text-xs sm:text-sm text-left focus:border-green-500 outline-none transition font-semibold flex items-center justify-between">
                              <span
                                className={
                                  slot.variant
                                    ? "text-gray-800"
                                    : "text-gray-400"
                                }
                              >
                                {slot.variants.find(
                                  (v) => v.id === slot.variant,
                                )?.variantName || "-- Variant --"}
                              </span>
                              <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                            </Listbox.Button>
                            <Listbox.Options className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-auto py-1 text-xs sm:text-sm">
                              {slot.variants.map((variant) => (
                                <Listbox.Option
                                  key={variant.id}
                                  value={variant.id}
                                  className={({ active, selected }) =>
                                    `cursor-pointer px-3 py-2 flex items-center justify-between ${
                                      active
                                        ? "bg-green-50 text-green-700"
                                        : "text-gray-700"
                                    } ${selected ? "bg-green-100 font-medium" : ""}`
                                  }
                                >
                                  {({ selected }) => (
                                    <>
                                      <span>{variant.variantName}</span>

                                      {selected && (
                                        <Check className="h-3.5 w-3.5 text-green-600" />
                                      )}
                                    </>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </div>
                        </Listbox>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col items-center justify-center min-h-[70px] sm:min-h-[90px]">
                    {tractorDetails ? (
                      <div className="w-full text-center">
                        <img
                          src={apiHelper.getImageUrl(tractorDetails.image)}
                          className="h-20 object-contain mx-auto"
                          alt={tractorDetails.variantName}
                        />
                        <p className="text-xs mt-2">
                          {tractorDetails.variantName}
                        </p>
                      </div>
                    ) : (
                      <div className="text-center text-gray-400">
                        Empty Slot
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setShowComparison(true)}
            disabled={activeTractors.length < 2}
            className={`flex items-center justify-center gap-2 w-full sm:w-56 mx-auto font-bold py-2.5 sm:py-3 px-6 rounded-lg shadow transition-all duration-200 text-sm ${
              activeTractors.length >= 2
                ? "bg-green-700 hover:bg-green-800 text-white cursor-pointer"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <ArrowRightLeft className="w-4 h-4" />
            Compare Now
          </button>
        </section>

        {/* COMPARISON RESULTS MODULE */}
        {showComparison && activeTractors.length >= 2 && (
          <div className="pt-12 md:pt-16 lg:pt-20 pb-6 lg:pb-10 space-y-6 animate-fadeIn">
            {/* THE SPECIFICATION SHEET TABLE */}
            <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="bg-green-900 text-white px-5 py-4 font-bold text-base flex items-center gap-2">
                <Tractor className="w-5 h-5 text-green-400" />
                Technical Specifications Comparison
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[600px] border-collapse layout-fixed">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-200">
                      <th className="p-4 text-xs font-extrabold uppercase tracking-wider text-gray-600 w-1/4">
                        Core Parameters
                      </th>

                      {activeTractors.map((item, index) => (
                        <th
                          key={index}
                          className="p-4 text-sm font-bold text-gray-900 border-l "
                        >
                          <div className="flex flex-col items-center text-center">
                            <img
                              src={apiHelper.getImageUrl(item.frontView)}
                              alt={item.productName}
                              className="h-24 object-contain mb-3 bg-white p-1 rounded border border-gray-100"
                            />

                            <span className="block text-green-700 text-base font-bold truncate max-w-full">
                              {item.productName}
                            </span>

                            <span className="block text-xs font-semibold text-green-800 mt-1 truncate max-w-full bg-green-100 px-2.5 py-0.5 rounded-full">
                              {item.variantName}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-300 text-sm">
                    <tr>
                      <td className="p-4 font-bold bg-gray-50">Horse Power</td>
                      {activeTractors.map((item, idx) => (
                        <td key={idx} className="p-4 text-center border-l ">
                          {item.horsePower}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-4 font-bold bg-gray-50">Engine Type</td>
                      {activeTractors.map((item, idx) => (
                        <td key={idx} className="p-4 text-center border-l">
                          {item.engineType}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-4 font-bold bg-gray-50">Fuel Type</td>
                      {activeTractors.map((item, idx) => (
                        <td key={idx} className="p-4 text-center border-l">
                          {item.fuelType}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-4 font-bold bg-gray-50">Cylinders</td>
                      {activeTractors.map((item, idx) => (
                        <td key={idx} className="p-4 text-center border-l">
                          {item.numberOfCylinders}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-4 font-bold bg-gray-50">Clutch Type</td>
                      {activeTractors.map((item, idx) => (
                        <td key={idx} className="p-4 text-center border-l">
                          {item.clutchType}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-4 font-bold bg-gray-50">Gearbox</td>
                      {activeTractors.map((item, idx) => (
                        <td key={idx} className="p-4 text-center border-l">
                          {item.forwardGears}F + {item.reverseGears}R
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-4 font-bold bg-gray-50">PTO Power</td>
                      {activeTractors.map((item, idx) => (
                        <td key={idx} className="p-4 text-center border-l">
                          {item.ptoHp}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-4 font-bold bg-gray-50">
                        Lifting Capacity
                      </td>
                      {activeTractors.map((item, idx) => (
                        <td key={idx} className="p-4 text-center border-l">
                          {item.liftingCapacity}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-4 font-bold bg-gray-50">Price</td>
                      {activeTractors.map((item, idx) => (
                        <td
                          key={idx}
                          className="p-4 text-center border-l font-semibold text-green-700"
                        >
                          ₹ {item.exShowroomPrice}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* SHOWCASE REPLACEMENT GALLERY AREA */}
        <section className="mt-12">
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-2.5">
              Trending{" "}
              <span className="text-transparent bg-clip-text bg-green-600">
                Tractor Showcase
              </span>
            </h2>
            <p className="text-xs text-gray-600">
              Quickly browse these catalog options. Use them to configure
              comparisons above.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
           {showcaseTractors.map((tractor, index) => (
  <div key={index} className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
    <div>
      <div className="relative bg-gray-50 rounded-lg sm:rounded-xl mb-3 flex items-center justify-center overflow-hidden aspect-[4/3] sm:aspect-square lg:aspect-[4/3]">
        <img
          src={apiHelper.getImageUrl(tractor.frontView)}
          alt={tractor.productName}
          className="w-full h-full object-contain p-2 sm:p-3 lg:p-4 group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <h3 className="font-bold text-gray-900 text-xs sm:text-sm lg:text-base truncate mb-1.5 sm:mb-2">
        {tractor.productName}
      </h3>
      <div className="flex items-center gap-2 mb-2 sm:mb-3">
        <span className="text-[9px] sm:text-[10px] lg:text-[11px] font-semibold bg-gray-100 text-gray-600 px-1.5 sm:px-2 py-0.5 rounded-md">
          {tractor.horsePower} HP
        </span>
      </div>
    </div>

    <div className="pt-2 sm:pt-3 border-t border-gray-100 flex items-center justify-between gap-1.5 sm:gap-2">
      <div className="min-w-0">
        <span className="text-[9px] sm:text-[10px] text-gray-400 block uppercase font-semibold tracking-wider">
          Ex-Showroom
        </span>
        <span className="text-xs sm:text-sm lg:text-base font-bold text-green-700 truncate block">
          ₹ {tractor.exShowroomPrice}
        </span>
      </div>
      <Link to={`/tractor/${tractor.id}`} className="flex-shrink-0">
        <button className="bg-green-50 text-green-700 hover:bg-green-700 hover:text-white font-bold text-[10px] sm:text-xs lg:text-sm cursor-pointer py-1.5 sm:py-2 px-2 sm:px-3 lg:px-4 rounded-md sm:rounded-lg transition-all duration-200 hover:shadow-md whitespace-nowrap">
          View Details
        </button>
      </Link>
    </div>
  </div>
))}
          </div>
        </section>
      </main>
    </div>
  );
}
