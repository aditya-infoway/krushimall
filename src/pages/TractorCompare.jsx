import React, { useState } from "react";
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

// Mock Database Matrix containing our structured Tractor Models and Variants
const TRACTOR_DATABASE = {
  "Mahindra 475 DI XP Plus": {
    variants: {
      "Standard 2WD": {
        hp: "44 HP",
        steering: "Mechanical / Power Steering (Optional)",
        cabin: "No (Canopy Optional)",
        clutch: "Single / Dual (Optional)",
        dashboard: "Analog-Digital Combo",
        seat: "Yes (Mechanical Adjustable)",
        weights: "Optional (30 kg)",
        price: "₹ 6.40 Lakh*",
        image: mah,
      },
      "Power Plus 4WD": {
        hp: "47 HP",
        steering: "Power Steering",
        cabin: "No",
        clutch: "Dual Clutch",
        dashboard: "Digital Dashboard",
        seat: "Yes (Deluxe Adjustable)",
        weights: "Included (60 kg)",
        price: "₹ 7.25 Lakh*",
        image: mah,
      },
    },
  },
  "John Deere 5050 D": {
    variants: {
      "GearPro Standard": {
        hp: "50 HP",
        steering: "Power Steering",
        cabin: "No",
        clutch: "Dual Clutch",
        dashboard: "Digital Dashboard",
        seat: "Yes (Adjustable)",
        weights: "Optional",
        price: "₹ 7.90 Lakh*",
        image: john,
      },
      "AC Cabin Luxury Edition": {
        hp: "50 HP",
        steering: "Power Steering",
        cabin: "Yes (Factory Fitted AC)",
        clutch: "Dual Clutch",
        dashboard: "Advanced Digital Dashboard",
        seat: "Yes (Premium Suspension Adjustable)",
        weights: "Included (90 kg)",
        price: "₹ 10.50 Lakh*",
        image: john,
      },
    },
  },
  "Swaraj 744 FE": {
    variants: {
      "5 Star MS": {
        hp: "48 HP",
        steering: "Mechanical Steering",
        cabin: "No",
        clutch: "Single Clutch",
        dashboard: "Analog Dashboard",
        seat: "Fixed Standard",
        weights: "No",
        price: "₹ 6.90 Lakh*",
        image: swara,
      },
      "XT Power Steering": {
        hp: "52 HP",
        steering: "Power Steering",
        cabin: "No",
        clutch: "Dual Clutch",
        dashboard: "Digital Dashboard",
        seat: "Yes (Adjustable)",
        weights: "Included (45 kg)",
        price: "₹ 7.80 Lakh*",
        image: swara,
      },
    },
  },
};

const SHOWCASE_TRACTORS = [
  {
    name: "Eicher 380 Super DI",
    hp: "40 HP",
    rating: "4.6",
    priceRange: "₹ 6.10 - 6.40 Lakh*",
    image: mah,
  },
  {
    name: "Massey Ferguson 241 DI",
    hp: "42 HP",
    rating: "4.8",
    priceRange: "₹ 6.80 - 7.25 Lakh*",
    image: john,
  },
  {
    name: "New Holland 3630 TX Plus",
    hp: "55 HP",
    rating: "4.9",
    priceRange: "₹ 7.95 - 8.50 Lakh*",
    image: swara,
  },
];

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
  const [slots, setSlots] = useState([
    { model: "", variant: "" },
    { model: "", variant: "" },
    { model: "", variant: "" },
  ]);

  const [showComparison, setShowComparison] = useState(false);

  const handleModelChange = (index, modelValue) => {
    const updated = [...slots];
    updated[index].model = modelValue;
    updated[index].variant = "";
    setSlots(updated);
    setShowComparison(false);
  };

  const handleVariantChange = (index, variantValue) => {
    const updated = [...slots];
    updated[index].variant = variantValue;
    setSlots(updated);
    setShowComparison(false);
  };

  const clearSlot = (index) => {
    const updated = [...slots];
    updated[index] = { model: "", variant: "" };
    setSlots(updated);
    const activeCount = updated.filter((s) => s.model && s.variant).length;
    if (activeCount < 2) setShowComparison(false);
  };

  const activeTractors = slots
    .map((s, idx) => {
      if (s.model && s.variant) {
        return {
          slotId: idx,
          modelName: s.model,
          variantName: s.variant,
          ...TRACTOR_DATABASE[s.model].variants[s.variant],
        };
      }
      return null;
    })
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans antialiased">
      {/* MAIN CONTAINER */}
     <main className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pt-12 md:pt-16 lg:pt-20 py-6">
        {/* TOP CONFIGURATOR WORKSPACE */}
        <section className="bg-white border border-gray-200 rounded-xl mt-6 p-4 sm:p-6 shadow-sm mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-2.5">
            Compare  <span className="text-transparent bg-clip-text bg-green-600"> Tractors Side-by-Side </span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mb-6 leading-relaxed">
            Select models to compare below. The layout adapts seamlessly to your chosen items.
          </p>

          {/* FIXED RESPONSIVE GRID: grid-cols-2 forces 2 inputs side by side on mobile devices */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 mb-6">
            {slots.map((slot, index) => {
              const modelSelected = !!slot.model;
              const variantSelected = !!slot.variant;
              const tractorDetails = variantSelected
                ? TRACTOR_DATABASE[slot.model].variants[slot.variant]
                : null;

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
      Tractor Model
    </label>
    <Listbox value={slot.model} onChange={(value) => handleModelChange(index, value)}>
      <div className="relative">
        <Listbox.Button className="w-full p-2 bg-white border border-gray-300 rounded text-xs sm:text-sm text-left focus:border-green-500 outline-none transition flex items-center justify-between">
          <span className={slot.model ? "text-gray-800" : "text-gray-400"}>
            {slot.model || "+ Add Tractor"}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
        </Listbox.Button>
        <Listbox.Options className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-auto py-1 text-xs sm:text-sm">
          {Object.keys(TRACTOR_DATABASE).map((modelName) => (
            <Listbox.Option
              key={modelName}
              value={modelName}
              className={({ active, selected }) =>
                `cursor-pointer px-3 py-2 flex items-center justify-between ${
                  active ? "bg-green-50 text-green-700" : "text-gray-700"
                } ${selected ? "bg-green-100 font-medium" : ""}`
              }
            >
              {({ selected }) => (
                <>
                  <span>{modelName}</span>
                  {selected && <Check className="h-3.5 w-3.5 text-green-600" />}
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
      <Listbox value={slot.variant} onChange={(value) => handleVariantChange(index, value)}>
        <div className="relative">
          <Listbox.Button className="w-full p-2 bg-white border border-green-300 rounded text-xs sm:text-sm text-left focus:border-green-500 outline-none transition font-semibold flex items-center justify-between">
            <span className={slot.variant ? "text-gray-800" : "text-gray-400"}>
              {slot.variant || "-- Variant --"}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
          </Listbox.Button>
          <Listbox.Options className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-auto py-1 text-xs sm:text-sm">
            {Object.keys(TRACTOR_DATABASE[slot.model].variants).map((vName) => (
              <Listbox.Option
                key={vName}
                value={vName}
                className={({ active, selected }) =>
                  `cursor-pointer px-3 py-2 flex items-center justify-between ${
                    active ? "bg-green-50 text-green-700" : "text-gray-700"
                  } ${selected ? "bg-green-100 font-medium" : ""}`
                }
              >
                {({ selected }) => (
                  <>
                    <span>{vName}</span>
                    {selected && <Check className="h-3.5 w-3.5 text-green-600" />}
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
                          src={tractorDetails.image}
                          alt="Preview"
                          className="h-16 sm:h-24 w-full object-contain mb-1 rounded"
                        />
                        <span className="text-[10px] sm:text-xs text-gray-600 font-semibold">
                          {tractorDetails.hp}
                        </span>
                      </div>
                    ) : (
                      <div className="text-center text-gray-400 text-[11px] sm:text-xs py-2">
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
          <div className="space-y-6 mb-12 animate-fadeIn">
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
                          className="p-4 text-sm font-bold text-gray-900 border-l border-gray-200"
                        >
                          <div className="flex flex-col items-center text-center">
                            <img
                              src={item.image}
                              alt={item.modelName}
                              className="h-24 object-contain mb-3 bg-white p-1 rounded border border-gray-100"
                            />
                            <span className="block text-green-700 text-base font-bold truncate max-w-full">
                              {item.modelName}
                            </span>
                            <span className="block text-xs font-semibold text-green-800 mt-1 truncate max-w-full bg-green-100 px-2.5 py-0.5 rounded-full">
                              {item.variantName}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100 text-sm">
                    <tr>
                      <td className="p-4 font-bold text-gray-900 bg-gray-50/50">
                        Horse Power
                      </td>
                      {activeTractors.map((item, idx) => (
                        <td
                          key={idx}
                          className="p-4 font-semibold text-gray-800 text-center border-l border-gray-100"
                        >
                          {item.hp}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-gray-900 bg-gray-50/50">
                        Power Steering
                      </td>
                      {activeTractors.map((item, idx) => (
                        <td
                          key={idx}
                          className="p-4 text-gray-700 text-center border-l border-gray-100"
                        >
                          {item.steering}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-gray-900 bg-gray-50/50">
                        AC Cabin
                      </td>
                      {activeTractors.map((item, idx) => (
                        <td
                          key={idx}
                          className="p-4 text-center border-l border-gray-100"
                        >
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-semibold ${item.cabin.toLowerCase().includes("yes") ? "bg-green-100 text-green-800" : "bg-green-50 text-green-700"}`}
                          >
                            {item.cabin}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-gray-900 bg-gray-50/50">
                        Dual Clutch
                      </td>
                      {activeTractors.map((item, idx) => (
                        <td
                          key={idx}
                          className="p-4 text-gray-700 text-center border-l border-gray-100"
                        >
                          {item.clutch}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-gray-900 bg-gray-50/50">
                        Digital Dashboard
                      </td>
                      {activeTractors.map((item, idx) => (
                        <td
                          key={idx}
                          className="p-4 text-gray-700 text-center border-l border-gray-100"
                        >
                          {item.dashboard}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-gray-900 bg-gray-50/50">
                        Adjustable Seat
                      </td>
                      {activeTractors.map((item, idx) => (
                        <td
                          key={idx}
                          className="p-4 text-gray-700 text-center border-l border-gray-100"
                        >
                          {item.seat}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-gray-900 bg-gray-50/50">
                        Front Weights
                      </td>
                      {activeTractors.map((item, idx) => (
                        <td
                          key={idx}
                          className="p-4 text-gray-700 text-center border-l border-gray-100"
                        >
                          {item.weights}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* HIGHLY HIGHLIGHTED PRICING SEGMENT */}
            <section className="bg-gradient-to-r from-green-700 to-green-900 rounded-xl p-6 text-white shadow-lg">
              <div className="mb-4">
                <span className="uppercase tracking-widest text-[10px] font-extrabold bg-white/20 text-white px-2.5 py-1 rounded">
                  Commercial Valuation
                </span>
                <h3 className="text-xl font-black mt-2 tracking-tight">
                  Final Estimated Price Comparison
                </h3>
              </div>

              <div
                className={`grid gap-4 ${activeTractors.length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-3"}`}
              >
                {activeTractors.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-lg p-5 text-gray-900 shadow-md border-t-4 border-green-700 flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase truncate">
                        {item.modelName}
                      </h4>
                      <p className="text-sm font-semibold text-gray-600 truncate mb-3">
                        {item.variantName}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-400 block font-semibold">
                        Estimated Price
                      </span>
                      <div className="text-2xl font-black text-green-700 tracking-tight">
                        {item.price}
                      </div>
                      <span className="text-[10px] text-gray-400 block mt-0.5">
                        *Ex-Showroom Price
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* SHOWCASE REPLACEMENT GALLERY AREA */}
        <section className="mt-12  pt-8">
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-2.5">
              Trending  <span className="text-transparent bg-clip-text bg-green-600">Tractor Showcase </span>
            </h2>
            <p className="text-xs text-gray-600">
              Quickly browse these catalog options. Use them to configure
              comparisons above.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {SHOWCASE_TRACTORS.map((tractor, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="relative bg-gray-50 rounded-lg mb-3 flex items-center justify-center">
                    <img
                      src={tractor.image}
                      alt={tractor.name}
                      className="h-45 w-full object-fill "
                    />
                    <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs text-green-700 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-0.5 shadow-xs">
                      <Star className="w-3 h-3 fill-green-700 text-green-700" />{" "}
                      {tractor.rating}
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-900 text-sm truncate">
                    {tractor.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 mb-3">
                    <span className="text-[11px] font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                      {tractor.hp} Engine
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase font-semibold">
                      Est. Range
                    </span>
                    <span className="text-sm font-bold text-green-700">
                      {tractor.priceRange}
                    </span>
                  </div>
                  <button className="bg-green-50 text-green-700 hover:bg-green-700 hover:text-white font-bold text-xs py-2 px-3 rounded-md transition duration-150">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- POPULAR COMPARISON HANDPICKS --- */}
        <section className="mt-12  pt-8 mb-12">
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Compare to buy  <span className="text-transparent bg-clip-text bg-green-600"> the right tractor </span>
            </h2>
            <div className="mt-2 border-b border-gray-200">
              <span className="inline-block text-sm font-semibold text-green-700 border-b-2 border-green-700 pb-2 px-1">
                Tractor
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {SUGGESTED_COMPARISONS.map((pair, index) => (
              <div
                key={index}
                className="bg-white border border-gray-100 rounded-xl p-2.5 sm:p-4 shadow-xs flex flex-col justify-between"
              >
                <div>
                  {/* Edge-to-edge split layout container */}
                  <div className="relative border border-gray-200 rounded-lg overflow-hidden mb-3 w-full h-24 sm:h-36">
                    <div className="grid grid-cols-2 gap-0 h-full w-full relative">
                      
                      {/* Left Side */}
                      <div className="w-full h-full flex items-center justify-center bg-cover bg-center">
                        <img
                          src={pair.left.image}
                          alt={pair.left.name}
                          className="w-full h-full object-cover relative z-10"
                        />
                      </div>

                      {/* Right Side */}
                      <div className="w-full h-full flex items-center justify-center bg-cover bg-center">
                        <img
                          src={pair.right.image}
                          alt={pair.right.name}
                          className="w-full h-full object-cover relative z-10"
                        />
                      </div>
                    </div>

                    {/* Overlaid Center VS Badge */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-900 text-white text-[9px] sm:text-[10px] font-black w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center border-2 border-white shadow-md z-20 select-none uppercase">
                      vs
                    </div>
                  </div>

                  {/* Left-Aligned / Right-Aligned labels */}
                  <div className="grid grid-cols-2 gap-1 mb-3 px-0.5 text-xs sm:text-sm">
                    <div className="text-left">
                      <p className="font-semibold text-gray-800 truncate line-clamp-1">
                        {pair.left.name}
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-600 mt-0.5 sm:mt-1">
                        From <span className="font-semibold text-gray-700">{pair.left.price}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800 truncate line-clamp-1">
                        {pair.right.name}
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-600 mt-0.5 sm:mt-1">
                        From <span className="font-semibold text-gray-700">{pair.right.price}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action comparison button wrapper */}
                <div className="mt-1">
                  <button className="w-full cursor-pointer border border-green-200 bg-white hover:bg-green-50 text-green-700 transition-colors duration-150 text-[10px] sm:text-xs font-semibold py-1.5 px-2 rounded-md text-center truncate">
                    {pair.left.name.split(" ")[0]} {pair.left.name.split(" ")[1] || ""} vs {pair.right.name}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}