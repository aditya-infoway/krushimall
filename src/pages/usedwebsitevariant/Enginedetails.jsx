
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { Droplets, Filter, Cog, CheckCircle, Thermometer } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { EnginedetailsSchema } from "./schema";
import apiHelper from "../../utils/apiHelper";
import { Listbox, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon, CheckIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";
import { Combobox } from "@headlessui/react";
// ---- Newly added option lists for Vehicle Inspection Details ----
const overallConditionOptions = [
  { label: "Excellent", value: "excellent" },
  { label: "Very Good", value: "very_good" },
  { label: "Good", value: "good" },
  { label: "Average", value: "average" },
  { label: "Needs Repair", value: "needs_repair" },
];
const yesNoOptions = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];
const smokeOptions = [
  { label: "No Smoke", value: "no_smoke" },
  { label: "White", value: "white" },
  { label: "Blue", value: "blue" },
  { label: "Black", value: "black" },
];
// NOTE: "Engine Sound" options were not explicitly listed by you — assuming
// Normal / Abnormal. Change to whatever your actual list is if different.
const engineSoundOptions = [
  { label: "Normal", value: "normal" },
  { label: "Abnormal", value: "abnormal" },
];
const clutchOptions = [
  { label: "Excellent", value: "excellent" },
  { label: "Good", value: "good" },
  { label: "Average", value: "average" },
  { label: "Replace Soon", value: "replace_soon" },
];
const gearboxOptions = [
  { label: "Smooth", value: "smooth" },
  { label: "Hard", value: "hard" },
  { label: "Noise", value: "noise" },
];
const steeringTypeOptions = [
  { label: "Power Steering", value: "power_steering" },
  { label: "Manual", value: "manual" },
];
const steeringConditionOptions = [
  { label: "Excellent", value: "excellent" },
  { label: "Good", value: "good" },
  { label: "Loose", value: "loose" },
];
const brakesOptions = [
  { label: "Excellent", value: "excellent" },
  { label: "Good", value: "good" },
  { label: "Average", value: "average" },
];
const batteryOptions = [
  { label: "New", value: "new" },
  { label: "Good", value: "good" },
  { label: "Weak", value: "weak" },
  { label: "Replace", value: "replace" },
];
const lightsCheckboxFields = [
  { name: "lightsHeadLight", label: "Head Light" },
  { name: "lightsIndicator", label: "Indicator" },
  { name: "lightsTailLight", label: "Tail Light" },
  { name: "lightsHorn", label: "Horn" },
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

// Custom Textarea Component
const Textarea = ({
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
          <Icon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        )}
        <textarea
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
            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
 

// Reusable helper: renders a Controller-driven select using CustomListbox
const SelectField = ({ control, errors, name, data, label, placeholder }) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <CustomListbox
        data={data}
        value={data.find((o) => o.value === field.value) || null}
        onChange={(o) => field.onChange(o?.value)}
        displayField="label"
        placeholder={placeholder}
        label={label}
        error={errors?.[name]?.message}
      />
    )}
  />
);

export default function Enginedetails({
  setCurrentStep,
  step,
  onComplete,
  productData,
    onProductSaved,
  isEdit,
}) {
  const navigate = useNavigate();

const {
  register,
  handleSubmit,
  formState: { errors },
  control,
  watch,
  setValue,
} = useForm({
    resolver: yupResolver(EnginedetailsSchema),
    defaultValues: {},
  });

  useEffect(() => {
   if (!productData) return; 

  setValue("engineType", productData.engineType || "");
  setValue("fuelType", productData.fuelType || "");
  setValue("horsePower", productData.horsePower || "");
  setValue("numberOfCylinders", productData.numberOfCylinders || "");
  setValue("cubicCapacity", productData.cubicCapacity || "");
  setValue("ratedRpm", productData.ratedRpm || "");
  setValue("aspiratedType", productData.aspiratedType || "");
  setValue("emissionNorms", productData.emissionNorms || "");
  setValue("coolingSystem", productData.coolingSystem || "");
  setValue("airFilterType", productData.airFilterType || "");
  setValue("maximumTorque", productData.maximumTorque || "");
  setValue("torqueRpm", productData.torqueRpm || "");
  setValue("torqueBackup", productData.torqueBackup || "");
  setValue("engineCondition", productData.engineCondition || "");

 
  setValue("overallCondition", productData.overallCondition || "");
  setValue("engineSelfStart", productData.engineSelfStart || "");
  setValue("engineColdStart", productData.engineColdStart || "");
  setValue("engineSmoke", productData.engineSmoke || "");
  setValue("engineSound", productData.engineSound || "");
  setValue("engineOilLeakage", productData.engineOilLeakage || "");
  setValue("clutchCondition", productData.clutchCondition || "");
  setValue("gearboxCondition", productData.gearboxCondition || "");
  setValue("steeringType", productData.steeringType || "");
  setValue("steeringCondition", productData.steeringCondition || "");
  setValue("brakesCondition", productData.brakesCondition || "");
  setValue("batteryCondition", productData.batteryCondition || "");
  setValue("lightsHeadLight", !!productData.lightsHeadLight);
  setValue("lightsIndicator", !!productData.lightsIndicator);
  setValue("lightsTailLight", !!productData.lightsTailLight);
  setValue("lightsHorn", !!productData.lightsHorn);
},  [productData, setValue]);

  const onSubmit = async (data) => {
  try {
    const productId = productData?.id
      ? productData.id
      : localStorage.getItem("vendorProductId");   

    if (!productId) {
      toast("Please save basic information first.");
      return;
    }

    const payload = {
      // ---- Vehicle Inspection Details ----
      overallCondition: data.overallCondition,
      engineSelfStart: data.engineSelfStart,
      engineColdStart: data.engineColdStart,
      engineSmoke: data.engineSmoke,
      engineSound: data.engineSound,
      engineOilLeakage: data.engineOilLeakage,
      clutchCondition: data.clutchCondition,
      gearboxCondition: data.gearboxCondition,
      steeringType: data.steeringType,
      steeringCondition: data.steeringCondition,
      brakesCondition: data.brakesCondition,
      batteryCondition: data.batteryCondition,
      lightsHeadLight: !!data.lightsHeadLight,
      lightsIndicator: !!data.lightsIndicator,
      lightsTailLight: !!data.lightsTailLight,
      lightsHorn: !!data.lightsHorn,

      currentStep: 1,
    };

    await apiHelper.put(
      `/vendor-web/used-website-variant/${productId}/save-step`,
      payload,
    );

    toast.success("Engine details saved!");

    onProductSaved?.({ ...payload, id: productId });   // add this

    if (onComplete) {
      onComplete(step);
    }

    setCurrentStep(step + 1);
  } catch (error) {
    console.error(error);
    toast.error(
      error.response?.data?.message || "Failed to save engine details.",
    );
  }
};

  const handlePrevious = () => {
    setCurrentStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12 lg:py-16">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Engine Details</h1>
          <p className="text-sm text-gray-500 mt-1">
            Provide detailed engine specifications for your product
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <div className="p-6 md:p-8 lg:p-10 space-y-10">
       

              {/* ==================== Vehicle Inspection Details (NEW) ==================== */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Vehicle Inspection Details
                </h3>

                {/* Overall Condition */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                  <SelectField
                    control={control}
                    errors={errors}
                    name="overallCondition"
                    data={overallConditionOptions}
                    label="Overall Condition"
                    placeholder="Select Overall Condition"
                  />
                </div>

                {/* Engine sub-fields */}
                <h4 className="text-sm font-semibold text-gray-800 mb-3">
                  Engine
                </h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                  <SelectField
                    control={control}
                    errors={errors}
                    name="engineSelfStart"
                    data={yesNoOptions}
                    label="Self Start Working"
                    placeholder="Select Yes/No"
                  />
                  <SelectField
                    control={control}
                    errors={errors}
                    name="engineColdStart"
                    data={yesNoOptions}
                    label="Cold Start"
                    placeholder="Select Yes/No"
                  />
                  <SelectField
                    control={control}
                    errors={errors}
                    name="engineSmoke"
                    data={smokeOptions}
                    label="Smoke"
                    placeholder="Select Smoke Type"
                  />
                  <SelectField
                    control={control}
                    errors={errors}
                    name="engineSound"
                    data={engineSoundOptions}
                    label="Engine Sound"
                    placeholder="Select Engine Sound"
                  />
                  <SelectField
                    control={control}
                    errors={errors}
                    name="engineOilLeakage"
                    data={yesNoOptions}
                    label="Oil Leakage"
                    placeholder="Select Yes/No"
                  />
                </div>

                {/* Clutch & Gearbox */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                  <SelectField
                    control={control}
                    errors={errors}
                    name="clutchCondition"
                    data={clutchOptions}
                    label="Clutch"
                    placeholder="Select Clutch Condition"
                  />
                  <SelectField
                    control={control}
                    errors={errors}
                    name="gearboxCondition"
                    data={gearboxOptions}
                    label="Gearbox"
                    placeholder="Select Gearbox Condition"
                  />

                  {/* Steering (type + condition) */}
                  <SelectField
                    control={control}
                    errors={errors}
                    name="steeringType"
                    data={steeringTypeOptions}
                    label="Steering"
                    placeholder="Select Steering Type"
                  />
                  <SelectField
                    control={control}
                    errors={errors}
                    name="steeringCondition"
                    data={steeringConditionOptions}
                    label="Steering Condition"
                    placeholder="Select Steering Condition"
                  />
                </div>

                {/* Brakes & Battery */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                  <SelectField
                    control={control}
                    errors={errors}
                    name="brakesCondition"
                    data={brakesOptions}
                    label="Brakes"
                    placeholder="Select Brakes Condition"
                  />
                  <SelectField
                    control={control}
                    errors={errors}
                    name="batteryCondition"
                    data={batteryOptions}
                    label="Battery"
                    placeholder="Select Battery Condition"
                  />
                </div>

                {/* Lights - checkboxes */}
                <h4 className="text-sm font-semibold text-gray-800 mb-3">
                  Lights
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {lightsCheckboxFields.map((item) => (
                    <label
                      key={item.name}
                      className="flex items-center gap-2 rounded-xl border border-gray-200 p-3 cursor-pointer hover:border-green-300 hover:bg-gray-50 transition-all"
                    >
                      <input
                        type="checkbox"
                        {...register(item.name)}
                        className="h-4 w-4 rounded text-green-600 focus:ring-2 focus:ring-green-600"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              {/* ==================== End Vehicle Inspection Details ==================== */}
            </div>

            {/* Action Buttons */}
            <div className="px-6 md:px-8 lg:px-10 py-6 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between gap-3">
              <Button type="button" variant="outlined" onClick={handlePrevious}>
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