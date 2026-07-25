import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import Select from "react-select";
import { Country, State, City } from "country-state-city";
import { MapPinned } from "lucide-react";
import toast from "react-hot-toast";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";

import { PriceLocationSchema } from "./schema.js";
import apiHelper from "../../utils/apiHelper";

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

const tcsApplicableOptions = [
  { label: "Select", value: "" },
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

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
          className={`w-full ${Icon ? "pl-10" : "px-4"} pr-4 py-3 text-sm border rounded-xl bg-white outline-none transition-all focus:ring-2 focus:ring-green-600 focus:border-green-600 ${
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
    "px-6 py-3 rounded-xl text-sm font-semibold transition-all";
  const variants = {
    primary: "bg-green-600 text-white hover:bg-green-700 shadow-md",
    outlined: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
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
  return (
    <div>
      {label && (
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-default rounded-xl border border-gray-200 bg-white py-3 pl-4 pr-10 text-left text-sm text-gray-900 outline-none transition-all focus:ring-2 focus:ring-green-600 focus:border-green-600">
            <span className="block truncate">
              {value ? value[displayField] : placeholder}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {data?.map((item) => (
                <Listbox.Option
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
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default function PriceLocation({
  setCurrentStep,
  step,
  completedSteps,
  onComplete,
    productData,   
  isEdit, 
}) {
  const navigate = useNavigate();
  const [position, setPosition] = useState([22.3039, 70.8022]);

const {
  register,
  handleSubmit,
  formState: { errors },
  control,
  watch,
  reset,
} = useForm({
  resolver: yupResolver(PriceLocationSchema),
  defaultValues: {},
});

  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  

 useEffect(() => {
  const fetchPriceLocation = async () => {
    try {
      const productId = isEdit
        ? productData?.id
        : localStorage.getItem("vendorProductId");

      if (!productId) return;

      const res = await apiHelper.get(
        `/vendor-web/website-variant/${productId}`
      );

      const data = res.data.data || res.data;

      reset({
        exShowroomPrice: data.exShowroomPrice || "",
        onRoadPrice: data.onRoadPrice || "",
        currency: data.currency || "",
        gst: data.gst || "18",
        tcsApplicable: data.tcsApplicable || "",
        tcsPercentage: data.tcsPercentage || "",
        financeAvailable: data.financeAvailable || "",
        emiAvailable: data.emiAvailable || "",
        downPayment: data.downPayment || "",
        exchangeOffer: data.exchangeOffer || "",
        offerPrice: data.offerPrice || "",
        negotiable: data.negotiable || "",
        country: data.country || "",
        state: data.state || "",
        district: data.district || "",
        taluka: data.taluka || "",
        city: data.city || "",
        pincode: data.pincode || "",
        landmark: data.landmark || "",
        fullAddress: data.fullAddress || "",
      });

      setCountry(data.country || "");
      setState(data.state || "");
      setDistrict(data.district || "");

      if (data.latitude && data.longitude) {
        setPosition([Number(data.latitude), Number(data.longitude)]);
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
      : localStorage.getItem("vendorProductId");

    if (!productId) {
      toast("Please save basic information first.");
      return;
    }

    const payload = {
      exShowroomPrice: data.exShowroomPrice ? Number(data.exShowroomPrice) : null,
      onRoadPrice: data.onRoadPrice ? Number(data.onRoadPrice) : null,
      currency: data.currency,
      gst: data.gst ? Number(data.gst) : null,
      tcsApplicable: data.tcsApplicable,
      tcsPercentage: data.tcsPercentage ? Number(data.tcsPercentage) : null,
      financeAvailable: data.financeAvailable,
      emiAvailable: data.emiAvailable,
      downPayment: data.downPayment ? Number(data.downPayment) : null,
      exchangeOffer: data.exchangeOffer,
      offerPrice: data.offerPrice ? Number(data.offerPrice) : null,
      negotiable: data.negotiable,
      country: data.country,
      state: data.state,
      district: data.district,
      taluka: data.taluka,
      city: data.city,
      pincode: data.pincode,
      landmark: data.landmark,
      fullAddress: data.fullAddress,
      latitude: position[0],
      longitude: position[1],
      currentStep: 4,
    };

    await apiHelper.put(
      `/vendor-web/website-variant/${productId}/save-step`,
      payload,
    );

    toast.success("Price and location details saved!");
    if (onComplete) onComplete(step);
    if (setCurrentStep) setCurrentStep(step + 1);
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
  const cityOptions = City.getCitiesOfState(country, state).map((c) => ({
    value: c.name,
    label: c.name,
  }));

  const currencyOptions = [
    { label: "INR - Indian Rupee", value: "INR" },
    { label: "USD - US Dollar", value: "USD" },
    { label: "EUR - Euro", value: "EUR" },
    { label: "GBP - British Pound", value: "GBP" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12 lg:py-16">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Price & Location</h1>
          <p className="text-sm text-gray-500 mt-1">
            Set pricing, finance options, and location details
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <div className="p-6 md:p-8 lg:p-10 space-y-10">
              {/* Pricing Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Pricing Details
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Ex-Showroom Price <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        {...register("exShowroomPrice")}
                        type="number"
                        placeholder="Enter price"
                        error={errors?.exShowroomPrice?.message}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      On-Road Price{" "}
                      <span className="text-xs text-gray-400">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Input
                        {...register("onRoadPrice")}
                        type="number"
                        placeholder="Enter on-road price"
                        error={errors?.onRoadPrice?.message}
                      />
                    </div>
                  </div>

                  <Controller
                    name="currency"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        label="Currency"
                        data={currencyOptions}
                        value={
                          currencyOptions.find(
                            (o) => o.value === field.value,
                          ) || null
                        }
                        onChange={(o) => field.onChange(o?.value)}
                        displayField="label"
                        placeholder="Select Currency"
                        error={errors?.currency?.message}
                      />
                    )}
                  />

                  <Input
                    {...register("gst")}
                    type="number"
                    label="GST (%)"
                    placeholder="GST %"
                    error={errors?.gst?.message}
                  />
                  <Controller
                    name="tcsApplicable"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        label="TCS Applicable"
                        data={tcsApplicableOptions}
                        value={
                          tcsApplicableOptions.find(
                            (o) => o.value === field.value,
                          ) || null
                        }
                        onChange={(o) => field.onChange(o?.value)}
                        displayField="label"
                        placeholder="Select"
                        error={errors?.tcsApplicable?.message}
                      />
                    )}
                  />

                  <Input
                    {...register("tcsPercentage")}
                    type="number"
                    label="TCS (%)"
                    placeholder="Enter TCS %"
                    error={errors?.tcsPercentage?.message}
                  />

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Finance Available <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-6">
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="radio"
                          value="yes"
                          {...register("financeAvailable")}
                          className="h-4 w-4 text-green-600 focus:ring-2 focus:ring-green-600"
                        />
                        <span className="text-sm text-gray-700">Yes</span>
                      </label>
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="radio"
                          value="no"
                          {...register("financeAvailable")}
                          className="h-4 w-4 text-green-600 focus:ring-2 focus:ring-green-600"
                        />
                        <span className="text-sm text-gray-700">No</span>
                      </label>
                    </div>
                    {errors?.financeAvailable && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.financeAvailable.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      EMI Available <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-6">
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="radio"
                          value="yes"
                          {...register("emiAvailable")}
                          className="h-4 w-4 text-green-600 focus:ring-2 focus:ring-green-600"
                        />
                        <span className="text-sm text-gray-700">Yes</span>
                      </label>
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="radio"
                          value="no"
                          {...register("emiAvailable")}
                          className="h-4 w-4 text-green-600 focus:ring-2 focus:ring-green-600"
                        />
                        <span className="text-sm text-gray-700">No</span>
                      </label>
                    </div>
                    {errors?.emiAvailable && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.emiAvailable.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Down Payment{" "}
                      <span className="text-xs text-gray-400">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Input
                        {...register("downPayment")}
                        type="number"
                        placeholder="Enter amount"
                        error={errors?.downPayment?.message}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Exchange Offer
                    </label>
                    <div className="flex gap-6">
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="radio"
                          value="yes"
                          {...register("exchangeOffer")}
                          className="h-4 w-4 text-green-600 focus:ring-2 focus:ring-green-600"
                        />
                        <span className="text-sm text-gray-700">Yes</span>
                      </label>
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="radio"
                          value="no"
                          {...register("exchangeOffer")}
                          className="h-4 w-4 text-green-600 focus:ring-2 focus:ring-green-600"
                        />
                        <span className="text-sm text-gray-700">No</span>
                      </label>
                    </div>
                    {errors?.exchangeOffer && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.exchangeOffer.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Offer Price{" "}
                      <span className="text-xs text-gray-400">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Input
                        {...register("offerPrice")}
                        type="number"
                        placeholder="Enter offer price"
                        error={errors?.offerPrice?.message}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Negotiable
                    </label>
                    <div className="flex gap-6">
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="radio"
                          value="yes"
                          {...register("negotiable")}
                          className="h-4 w-4 text-green-600 focus:ring-2 focus:ring-green-600"
                        />
                        <span className="text-sm text-gray-700">Yes</span>
                      </label>
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="radio"
                          value="no"
                          {...register("negotiable")}
                          className="h-4 w-4 text-green-600 focus:ring-2 focus:ring-green-600"
                        />
                        <span className="text-sm text-gray-700">No</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Location Details
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Country
                    </label>
                    <Controller
                      name="country"
                      control={control}
                      render={({ field }) => (
                        <Select
                          options={countryOptions}
                          styles={selectStyles}
                          placeholder="Search Country"
                          value={
                            countryOptions.find(
                              (o) => o.value === field.value,
                            ) || null
                          }
                          onChange={(selected) => {
                            field.onChange(selected?.value || "");
                            setCountry(selected?.value || "");
                            setState("");
                          }}
                        />
                      )}
                    />
                    {errors.country && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.country.message}
                      </p>
                    )}
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
                            setState(selected?.value || "");
                            setDistrict("");
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
                          options={cityOptions}
                          styles={selectStyles}
                          placeholder="Search District"
                          isDisabled={!state}
                          value={
                            cityOptions.find((o) => o.value === field.value) ||
                            null
                          }
                          onChange={(selected) => {
                            field.onChange(selected?.value || "");
                            setDistrict(selected?.value || "");
                          }}
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
                          options={cityOptions}
                          styles={selectStyles}
                          placeholder="Search Taluka"
                          isDisabled={!district}
                          value={
                            cityOptions.find((o) => o.value === field.value) ||
                            null
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
                      City <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      name="city"
                      control={control}
                      render={({ field }) => (
                        <Select
                          options={cityOptions}
                          styles={selectStyles}
                          placeholder="Search City"
                          isDisabled={!state}
                          value={
                            cityOptions.find((o) => o.value === field.value) ||
                            null
                          }
                          onChange={(selected) =>
                            field.onChange(selected?.value || "")
                          }
                        />
                      )}
                    />
                    {errors?.city && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.city.message}
                      </p>
                    )}
                  </div>

                  <Input
                    {...register("pincode")}
                    type="number"
                    label="Pincode"
                    placeholder="Enter pincode"
                    error={errors?.pincode?.message}
                  />

                  <Input
                    {...register("landmark")}
                    label="Landmark"
                    placeholder="Enter landmark"
                    error={errors?.landmark?.message}
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Full Address
                  </label>
                  <textarea
                    {...register("fullAddress")}
                    rows={3}
                    className={`w-full px-4 py-3 text-sm border rounded-xl bg-white outline-none transition-all focus:ring-2 focus:ring-green-600 focus:border-green-600 ${
                      errors?.fullAddress
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200"
                    }`}
                    placeholder="Enter complete address..."
                  />
                  {errors?.fullAddress && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.fullAddress.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Map Location */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Map Location
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Drag the pin to exact location of your tractor
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
                className="min-w-[7rem] order-2 sm:order-1 cursor-pointer"
                onClick={handlePrevious}
              >
                Previous
              </Button>
              <div className="flex flex-col sm:flex-row gap-3 order-1 sm:order-2">
                <Button
                  type="button"
                  variant="outlined"
                  className="min-w-[7rem] cursor-pointer"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="min-w-[7rem] cursor-pointer">
                  Save &amp; Next
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
