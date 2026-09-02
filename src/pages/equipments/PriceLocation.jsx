import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import Select from "react-select";
import { Country, State, City } from "country-state-city";
import { MapPinned } from "lucide-react";
import toast from "react-hot-toast";
import { Listbox, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon, CheckIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { EquipmentPriceLocationSchema } from "./schema";
import apiHelper from "../../utils/apiHelper";
import { Combobox } from "@headlessui/react";

// Leaflet icon setup
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return (
    <Marker
      position={position}
      draggable
      eventHandlers={{
        dragend: (e) => {
          const latlng = e.target.getLatLng();
          setPosition([latlng.lat, latlng.lng]);
        },
      }}
    />
  );
}

// React-select styles
const selectStyles = {
  control: (base, state) => ({
    ...base,
    borderRadius: "0.75rem",
    borderColor: state.isFocused ? "#16a34a" : "#e5e7eb",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(22,163,74,0.2)" : "none",
    minHeight: "46px",
    backgroundColor: "white",
    "&:hover": { borderColor: "#16a34a" },
  }),
  menu: (base) => ({
    ...base,
    borderRadius: "0.75rem",
    overflow: "hidden",
    boxShadow:
      "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
    backgroundColor: "white",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#16a34a"
      : state.isFocused
      ? "#f0fdf4"
      : "white",
    color: state.isSelected ? "white" : "#111827",
    cursor: "pointer",
    "&:active": {
      backgroundColor: "#16a34a",
    },
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "#f0fdf4",
    borderRadius: "0.5rem",
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "#16a34a",
    fontWeight: "500",
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: "#16a34a",
    "&:hover": {
      backgroundColor: "#dcfce7",
      color: "#16a34a",
    },
  }),
};

// Custom Input Component
const Input = ({
  label,
  error,
  description,
  className = "",
  icon: Icon,
  ...props
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        )}
        <input
          {...props}
          className={`w-full ${
            Icon ? "pl-10" : "px-4"
          } pr-4 py-3 text-sm border rounded-xl bg-white outline-none transition-all focus:ring-2 focus:ring-green-600 focus:border-green-600 ${
            error ? "border-red-300 bg-red-50" : "border-gray-200"
          } ${props.disabled ? "bg-gray-50 cursor-not-allowed" : ""}`}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {description && !error && (
        <p className="mt-1 text-xs text-gray-500">{description}</p>
      )}
    </div>
  );
};

// Custom Button Component
const Button = ({
  children,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}) => {
  const baseStyles =
    "px-6 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer";
  const variants = {
    primary: "bg-green-600 text-white hover:bg-green-700 shadow-md",
    outlined: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${
        variants[variant] || variants.primary
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Custom Listbox Component using Headless UI
const CustomListbox = ({
  data,
  value,
  onChange,
  displayField,
  placeholder,
  label,
  error,
}) => {
  const [query, setQuery] = useState("");
  const buttonRef = useRef(null);

  const filteredData =
    query === ""
      ? data
      : data?.filter((item) =>
          (item[displayField] || item.label || "")
            .toLowerCase()
            .includes(query.toLowerCase()),
        );

  return (
    <div>
      {label && (
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <Combobox
        value={value}
        onChange={(option) => {
          onChange(option);
          setQuery("");
        }}
      >
        <div className="relative">
          <div className="relative">
            <Combobox.Input
              className={`w-full cursor-default rounded-xl border bg-white py-3 pl-10 pr-4 text-left text-sm text-gray-900 outline-none transition-all focus:ring-2 focus:ring-green-600 focus:border-green-600 ${
                error ? "border-red-300 bg-red-50" : "border-gray-200"
              }`}
              displayValue={(item) => (item ? item[displayField] : "")}
              placeholder={placeholder}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => buttonRef.current?.click()}
            />
            <Combobox.Button
              ref={buttonRef}
              className="absolute inset-y-0 left-0 flex items-center pl-3"
            >
              <MagnifyingGlassIcon
                className="h-4 w-4 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {filteredData?.length ? (
                filteredData.map((item) => (
                  <Combobox.Option
                    key={item.id || item.value}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-green-100 text-green-900" : "text-gray-900"
                      }`
                    }
                    value={item}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {item[displayField] || item.label}
                        </span>
                        {selected && (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-green-600">
                            <CheckIcon className="h-4 w-4" aria-hidden="true" />
                          </span>
                        )}
                      </>
                    )}
                  </Combobox.Option>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-400">
                  No results found
                </div>
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default function PriceLocation({
  setCurrentStep,
  step,
  onComplete,
  onProductSaved,
  productData,
  isEdit,
}) {
  const navigate = useNavigate();
  const [position, setPosition] = useState([22.3039, 70.8022]);
  const [country, setCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(EquipmentPriceLocationSchema),
    defaultValues: {},
  });

 useEffect(() => {
  const fetchPriceLocation = async () => {
    try {
      const productId = isEdit
        ? productData?.id
        : localStorage.getItem("vendorEquipmentId");

      if (!productId) return;

      const res = await apiHelper.get(
        `/vendor-web/equipmentvariant/${productId}`,
      );

      const data = res.data.data || res.data;

      reset({
        expectedPrice: data.expectedPrice || "",
        negotiable: data.negotiable || "",
        exchangeAvailable: data.exchangeAvailable || "",
        financeAvailable: data.financeAvailable || "",
        village: data.village || "",
        taluka: data.taluka || "",
        district: data.district || "",
        state: data.state || "",
        pincode: data.pincode || "",
        landmark: data.landmark || "",
      });

      setCountry(data.country || "IN");
      setSelectedState(data.state || "");

      if (data.latitude != null && data.longitude != null) {
        setPosition([
          Number(data.latitude),
          Number(data.longitude),
        ]);
      }
    } catch (error) {
      console.log("Price location fetch error", error);
    }
  };

  fetchPriceLocation();
}, [reset, productData, isEdit]);

const onSubmit = async (data) => {
  try {
    const productId = isEdit
      ? productData?.id
      : localStorage.getItem("vendorEquipmentId");

    if (!productId) {
      toast("Please save basic information first.");
      return;
    }

    const payload = {
      expectedPrice: data.expectedPrice
        ? Number(data.expectedPrice)
        : null,
      negotiable: data.negotiable,
      exchangeAvailable: data.exchangeAvailable,
      financeAvailable: data.financeAvailable,
      village: data.village,
      taluka: data.taluka,
      district: data.district,
      state: data.state,
      pincode: data.pincode,
      landmark: data.landmark,
      country: country || "IN",
      latitude: position[0],
      longitude: position[1],
      currentStep: 4,
    };

    await apiHelper.put(
      `/vendor-web/equipmentvariant/${productId}/save-step`,
      payload,
    );

    toast.success("Price and location details saved!");

    // Parent AddProductStepper ko latest saved data dena
    onProductSaved?.({
      ...payload,
      id: productId,
    });

    if (onComplete) {
      onComplete(step);
    }

    if (setCurrentStep) {
      setCurrentStep(step + 1);
    }
  } catch (error) {
    console.error(error);

    toast.error(
      error.response?.data?.message ||
        "Failed to save price and location details.",
    );
  }
};

  const handlePrevious = () => {
    if (setCurrentStep) {
      setCurrentStep(step - 1);
    }
  };

  const countryOptions = Country.getAllCountries().map((c) => ({
    value: c.isoCode,
    label: c.name,
  }));

  const stateOptions = State.getStatesOfCountry(country).map((s) => ({
    value: s.isoCode,
    label: s.name,
  }));

  const districtOptions = City.getCitiesOfState(country, selectedState).map(
    (c) => ({
      value: c.name,
      label: c.name,
    }),
  );

  const negotiableOptions = [
    { label: "Select", value: "" },
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
  ];

  const yesNoOptions = [
    { label: "Select", value: "" },
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12 lg:py-16">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Price & Location</h1>
          <p className="text-sm text-gray-500 mt-1">
            Set pricing and location details for your equipment
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <div className="p-6 md:p-8 lg:p-10 space-y-10">
              {/* Price Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Price
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Input
                    {...register("expectedPrice")}
                    type="number"
                    label="Expected Price *"
                    placeholder="Enter expected price"
                    error={errors?.expectedPrice?.message}
                  />

                  <Controller
                    name="negotiable"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        label="Negotiable"
                        data={negotiableOptions}
                        value={
                          negotiableOptions.find(
                            (o) => o.value === field.value,
                          ) || null
                        }
                        onChange={(o) => field.onChange(o?.value)}
                        displayField="label"
                        placeholder="Select"
                        error={errors?.negotiable?.message}
                      />
                    )}
                  />

                  <Controller
                    name="exchangeAvailable"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        label="Exchange Available"
                        data={yesNoOptions}
                        value={
                          yesNoOptions.find((o) => o.value === field.value) ||
                          null
                        }
                        onChange={(o) => field.onChange(o?.value)}
                        displayField="label"
                        placeholder="Select"
                        error={errors?.exchangeAvailable?.message}
                      />
                    )}
                  />

                  <Controller
                    name="financeAvailable"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        label="Finance Available"
                        data={yesNoOptions}
                        value={
                          yesNoOptions.find((o) => o.value === field.value) ||
                          null
                        }
                        onChange={(o) => field.onChange(o?.value)}
                        displayField="label"
                        placeholder="Select"
                        error={errors?.financeAvailable?.message}
                      />
                    )}
                  />
                </div>
              </div>

              {/* Location Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Location
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Country
                    </label>
                    <Select
                      options={countryOptions}
                      styles={selectStyles}
                      placeholder="Search Country"
                      value={
                        countryOptions.find((o) => o.value === country) || null
                      }
                      onChange={(selected) => {
                        setCountry(selected?.value || "");
                        setSelectedState("");
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      State <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      name="state"
                      control={control}
                      render={({ field }) => (
                        <Select
                          options={stateOptions}
                          styles={selectStyles}
                          placeholder="Search State"
                          isDisabled={!country}
                          value={
                            stateOptions.find((o) => o.value === field.value) ||
                            null
                          }
                          onChange={(selected) => {
                            field.onChange(selected?.value || "");
                            setSelectedState(selected?.value || "");
                          }}
                        />
                      )}
                    />
                    {errors?.state && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.state.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      District <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      name="district"
                      control={control}
                      render={({ field }) => (
                        <Select
                          options={districtOptions}
                          styles={selectStyles}
                          placeholder="Search District"
                          isDisabled={!selectedState}
                          value={
                            districtOptions.find(
                              (o) => o.value === field.value,
                            ) || null
                          }
                          onChange={(selected) =>
                            field.onChange(selected?.value || "")
                          }
                        />
                      )}
                    />
                    {errors?.district && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.district.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Taluka
                    </label>
                    <Controller
                      name="taluka"
                      control={control}
                      render={({ field }) => (
                        <Select
                          options={districtOptions}
                          styles={selectStyles}
                          placeholder="Search Taluka"
                          isDisabled={!selectedState}
                          value={
                            districtOptions.find(
                              (o) => o.value === field.value,
                            ) || null
                          }
                          onChange={(selected) =>
                            field.onChange(selected?.value || "")
                          }
                        />
                      )}
                    />
                    {errors?.taluka && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.taluka.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Village
                    </label>
                    <Controller
                      name="village"
                      control={control}
                      render={({ field }) => (
                        <Select
                          options={districtOptions}
                          styles={selectStyles}
                          placeholder="Search Village"
                          isDisabled={!selectedState}
                          value={
                            districtOptions.find(
                              (o) => o.value === field.value,
                            ) || null
                          }
                          onChange={(selected) =>
                            field.onChange(selected?.value || "")
                          }
                        />
                      )}
                    />
                    {errors?.village && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.village.message}
                      </p>
                    )}
                  </div>

                  <Input
                    {...register("pincode")}
                    type="text"
                    label="Pincode"
                    placeholder="Enter pincode"
                    error={errors?.pincode?.message}
                  />
                </div>

                <div className="mt-4">
                  <Input
                    {...register("landmark")}
                    label="Landmark"
                    placeholder="Enter landmark"
                    error={errors?.landmark?.message}
                  />
                </div>
              </div>

              {/* Google Map Location */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Google Map Location
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Click on the map or drag the pin to exact location
                </p>
                <div className="overflow-hidden rounded-xl border border-gray-200">
                  <MapContainer
                    center={position}
                    zoom={11}
                    style={{ height: "400px", width: "100%" }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker
                      position={position}
                      setPosition={setPosition}
                    />
                  </MapContainer>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 md:px-8 lg:px-10 py-6 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between gap-3">
              <Button
                type="button"
                variant="outlined"
                className="min-w-28 order-2 sm:order-1 cursor-pointer"
                onClick={handlePrevious}
              >
                Previous
              </Button>
              <div className="flex flex-col sm:flex-row gap-3 order-1 sm:order-2">
                <Button
                  type="button"
                  variant="outlined"
                  className="min-w-28 cursor-pointer"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="min-w-28 cursor-pointer">
                  {isEdit ? "Update & Next" : "Save & Next"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
