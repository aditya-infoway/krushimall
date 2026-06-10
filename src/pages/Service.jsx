import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Listbox, RadioGroup } from "@headlessui/react";
import {
  MapPin,
  Search,
  Phone,
  Mail,
  Globe,
  X,
  Filter,
  ChevronDown,
  Star,
  Wrench,
  Check,
} from "lucide-react";

const Service = () => {
  const navigate = useNavigate();

  const [searchTab, setSearchTab] = useState("address");
  const [searchQuery, setSearchQuery] = useState("");
  const [radius, setRadius] = useState("");
  const [selectedService, setSelectedService] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [mapType, setMapType] = useState("streets");
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const serviceCenters = [
    {
      id: 1,
      name: "AG Central Co-Op",
      address:
        "920 N Congress Parkway, Athens, 37303, Tennessee, United States",
      phone: "+1 423-368-7753",
      website: "www.agcentral.coop",
      email: "",
      serviceType: "tractor_repair",
      brand: "mahindra",
      rating: 4.7,
      estimatedCost: 150,
    },
    {
      id: 2,
      name: "AOK Turf Equipment Inc.",
      address: "1357 Main Street, Coventry, 02816, Rhode Island, United States",
      phone: "+1 401-826-2584",
      email: "admin@aokturfequipment.com",
      website: "www.aokturfequip.com",
      serviceType: "engine_repair",
      brand: "massey",
      rating: 4.2,
      estimatedCost: 185,
    },
    {
      id: 3,
      name: "Abbott Farm Products",
      address: "3016 Whittinghill Road, Memphis, 47143, Indiana, United States",
      phone: "+1 812-256-1358",
      email: "hayabbott@gmail.com",
      website: "",
      serviceType: "engine_repair",
      brand: "mahindra",
      rating: 4.5,
      estimatedCost: 130,
    },
    {
      id: 4,
      name: "Balaji Welding & Tractor Works",
      address: "GIDC Industrial Estate, Sector 2, Gujarat, India",
      phone: "+91 98765 43210",
      email: "balajiwelding@gmail.com",
      website: "",
      serviceType: "welding",
      brand: "massey",
      rating: 3.9,
      estimatedCost: 95,
    },
  ];

  const servicesList = [
    { id: "all", name: "All Services" },
    { id: "tractor_repair", name: "Tractor Repair" },
    { id: "engine_repair", name: "Engine Repair" },
    { id: "tyre_repair", name: "Tyre Repair" },
    { id: "welding", name: "Welding" },
  ];

  const brandsList = [
    { id: "all", name: "All Brands" },
    { id: "mahindra", name: "Mahindra" },
    { id: "massey", name: "Massey Ferguson" },
  ];

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedService !== "all") count++;
    if (selectedBrand !== "all") count++;
    if (searchQuery) count++;
    return count;
  }, [selectedService, selectedBrand, searchQuery]);

  const clearAllFilters = () => {
    setSelectedService("all");
    setSelectedBrand("all");
    setSearchQuery("");
    setSearchTab("address");
  };

  const filteredCenters = serviceCenters.filter((center) => {
    const matchesService =
      selectedService === "all" || center.serviceType === selectedService;
    const matchesBrand =
      selectedBrand === "all" || center.brand === selectedBrand;
    const matchesText =
      searchQuery === "" ||
      center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      center.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesService && matchesBrand && matchesText;
  });

  const getMapUrl = () => {
    return "https://maps.google.com/maps?q=21.5222,70.4579&t=&z=13&ie=UTF8&iwloc=B&output=embed";
  };

  return (
    <div className="h-screen bg-gray-50 font-sans text-gray-800 flex flex-col overflow-x-hidden">
      {/* Main Title Header Section */}
      <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pt-4 lg:pt-12 pb-2 flex-shrink-0">
        <div className="lg:pl-[calc(33.333%+1.5rem)]">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
            Find a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-700">
              Service Center Near You
            </span>
          </h1>
        </div>
      </div>

      {/* Main Interactive Map Block Wrapper */}
      <main className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pb-6 flex-1 flex flex-col min-h-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[calc(100vh-11rem)] flex-1 min-h-0">
          {/* LEFT SIDE PANEL */}
          <section className="lg:col-span-4 flex flex-col bg-white border border-gray-200 shadow-sm rounded-2xl h-[550px] lg:h-full min-h-0 overflow-hidden lg:-mt-12">
            {/* Search and Filter Form */}
            <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0 space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                  Search by
                </label>
                <RadioGroup value={searchTab} onChange={setSearchTab}>
                  <div className="grid grid-cols-3 gap-1">
                    {["address", "postal", "city"].map((tab) => (
                      <RadioGroup.Option key={tab} value={tab}>
                        {({ checked }) => (
                          <div
                            className={`py-2 px-2 text-xs font-bold border transition-all cursor-pointer text-center rounded-lg ${
                              checked
                                ? "bg-green-700 text-white border-green-700 shadow-sm"
                                : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                            }`}
                          >
                            {tab === "address"
                              ? "Address"
                              : tab === "postal"
                                ? "Postal Code"
                                : "City"}
                          </div>
                        )}
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {/* Text Search Input */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-0.5">
                  {searchTab === "address" && "Address"}
                  {searchTab === "postal" && "Postal Code"}
                  {searchTab === "city" && "City"}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter location or center name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 pr-8 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Advanced Filters Toggle */}
              <button
                type="button"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="cursor-pointer flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-green-700 transition-colors"
              >
                <Filter className="h-4 w-4" />
                Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${showAdvancedFilters ? "rotate-180" : ""}`}
                />
              </button>

              {/* Filter Dropdowns */}
              {showAdvancedFilters && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-0.5">
                      Service Type
                    </label>
                    <Listbox
                      value={selectedService}
                      onChange={setSelectedService}
                    >
                      <div className="relative">
                        <Listbox.Button className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm text-left bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium flex items-center justify-between">
                          <span
                            className={
                              selectedService !== "all"
                                ? "text-gray-800"
                                : "text-gray-400"
                            }
                          >
                            {servicesList.find((s) => s.id === selectedService)
                              ?.name || "All Services"}
                          </span>
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        </Listbox.Button>
                        <Listbox.Options className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-auto py-1 text-sm">
                          {servicesList.map((service) => (
                            <Listbox.Option
                              key={service.id}
                              value={service.id}
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
                                  <span>{service.name}</span>
                                  {selected && (
                                    <Check className="h-4 w-4 text-green-600" />
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
                    <label className="block text-xs font-bold text-gray-600 mb-0.5">
                      Brand
                    </label>
                    <Listbox value={selectedBrand} onChange={setSelectedBrand}>
                      <div className="relative">
                        <Listbox.Button className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm text-left bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium flex items-center justify-between">
                          <span
                            className={
                              selectedBrand !== "all"
                                ? "text-gray-800"
                                : "text-gray-400"
                            }
                          >
                            {brandsList.find((b) => b.id === selectedBrand)
                              ?.name || "All Brands"}
                          </span>
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        </Listbox.Button>
                        <Listbox.Options className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-auto py-1 text-sm">
                          {brandsList.map((brand) => (
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
                                  <span>{brand.name}</span>
                                  {selected && (
                                    <Check className="h-4 w-4 text-green-600" />
                                  )}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </div>
                    </Listbox>
                  </div>
                </div>
              )}

              {/* Active Filter Chips */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {selectedService !== "all" && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-200">
                      {servicesList.find((s) => s.id === selectedService)?.name}
                      <button
                        type="button"
                        onClick={() => setSelectedService("all")}
                        className="hover:text-green-900"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {selectedBrand !== "all" && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-200">
                      {brandsList.find((b) => b.id === selectedBrand)?.name}
                      <button
                        type="button"
                        onClick={() => setSelectedBrand("all")}
                        className="hover:text-green-900"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-200">
                      "{searchQuery}"
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="hover:text-green-900"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {activeFiltersCount > 1 && (
                    <button
                      type="button"
                      onClick={clearAllFilters}
                      className="cursor-pointer text-xs text-gray-500 hover:text-gray-700 underline font-medium ml-1"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              )}

              <button
                type="button"
                className="w-full cursor-pointer bg-green-600 hover:bg-green-700 text-white font-bold text-sm py-2.5 px-3 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5 tracking-wide"
              >
                <Search className="h-4 w-4" /> Search Centers
              </button>
            </div>

            {/* Results count */}
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between text-xs flex-shrink-0">
              <span className="font-bold text-gray-700">
                {filteredCenters.length}{" "}
                {filteredCenters.length === 1 ? "center" : "centers"} found
              </span>
              <span className="text-gray-400 font-medium">
                Click Center to Book Setup
              </span>
            </div>

            {/* Scrollable Results List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50/30 min-h-0">
              {filteredCenters.length === 0 ? (
                <div className="text-center py-6">
                  <Search className="h-6 w-6 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs text-gray-400 font-medium">
                    No service centers found matching these criteria.
                  </p>
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="cursor-pointer mt-1.5 text-xs text-green-600 hover:text-green-700 font-semibold"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                filteredCenters.map((center) => (
                  <div
                    key={center.id}
                    onClick={() =>
                      navigate("/booking", {
                        state: { selectedCenter: center },
                      })
                    }
                    className="bg-white border border-gray-200 p-4 shadow-sm relative rounded-2xl transition-all hover:border-green-600 hover:shadow-md cursor-pointer group"
                  >
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-green-50 text-green-700 text-xs font-bold uppercase px-2 py-1 rounded-lg flex items-center gap-1">
                      <Wrench className="h-3 w-3" /> Open Booking
                    </div>

                    <h3 className="text-sm font-bold text-gray-900 pr-16 tracking-tight group-hover:text-green-700 transition-colors">
                      {center.name}
                    </h3>

                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-bold text-gray-700">
                        {center.rating}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-1">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-lg tracking-wider bg-green-50 text-green-700">
                        {center.brand}
                      </span>
                      <span className="text-[10px] bg-gray-100 text-gray-700 font-bold uppercase px-2 py-0.5 rounded-lg tracking-wider">
                        {center.serviceType.replace("_", " ")}
                      </span>
                    </div>

                    <div className="mt-2 space-y-1 text-xs text-gray-600 font-medium border-t border-gray-100 pt-2">
                      <div className="flex items-start gap-1">
                        <MapPin className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="leading-tight text-gray-500 text-xs line-clamp-2">
                          {center.address}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700 text-xs">
                          {center.phone}
                        </span>
                      </div>
                      {center.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3 text-green-600 flex-shrink-0" />
                          <span className="text-gray-500 underline truncate text-xs">
                            {center.email}
                          </span>
                        </div>
                      )}
                      {center.website && (
                        <div className="flex items-center gap-1">
                          <Globe className="h-3 w-3 text-green-600 flex-shrink-0" />
                          <span className="text-green-700 hover:underline text-xs">
                            {center.website}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* RIGHT SIDE PANEL: Map Display */}
          <section className="lg:col-span-8 bg-gray-100 relative h-[400px] lg:h-full min-h-0 overflow-hidden border border-gray-200 shadow-sm rounded-2xl">
            <iframe
              src={getMapUrl()}
              width="100%"
              height="100%"
              style={{ border: 0, display: "block" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Dealer Tracker Frame Grid Panel"
            ></iframe>

            <RadioGroup value={mapType} onChange={setMapType}>
              <div className="absolute top-3 right-3 bg-white/95 border border-gray-200 p-2 rounded-xl shadow-sm text-xs font-bold space-y-1 text-gray-700 z-10">
                {["Streets", "Satellite", "Hybrid", "Topographic"].map(
                  (type) => (
                    <RadioGroup.Option key={type} value={type.toLowerCase()}>
                      {({ checked }) => (
                        <div className="flex items-center gap-2 cursor-pointer px-1 py-0.5">
                          <div
                            className={`w-3 h-3 rounded-full border flex items-center justify-center ${checked ? "border-green-600 bg-green-600" : "border-gray-300"}`}
                          >
                            {checked && (
                              <Check className="h-2 w-2 text-white" />
                            )}
                          </div>
                          {type}
                        </div>
                      )}
                    </RadioGroup.Option>
                  ),
                )}
              </div>
            </RadioGroup>

            <div className="absolute bottom-0 right-0 bg-white/80 backdrop-blur-sm px-2 py-1 text-xs text-gray-500 rounded-tl-xl border-l border-t border-gray-200 select-none pointer-events-none">
              Leaflet | © OpenStreetMap contributors
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Service;
