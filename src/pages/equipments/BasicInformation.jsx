import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { Country, State, City } from "country-state-city";
import toast from "react-hot-toast";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

import { EquipmentBasicInfoSchema } from "./schema";
import apiHelper from "../../utils/apiHelper";

// ==================== Static Options ====================

const equipmentTypeOptions = [
  { label: "Thresher", value: "thresher" },
  { label: "Rotavator", value: "rotavator" },
  { label: "Sprayer", value: "sprayer" },
  { label: "Cultivator", value: "cultivator" },
  { label: "Seed Drill", value: "seed_drill" },
  { label: "MB Plough", value: "mb_plough" },
  { label: "Trolley", value: "trolley" },
  { label: "Other", value: "other" },
];

const equipmentConditionOptions = [
  { label: "New", value: "new" },
  { label: "Used", value: "used" },
];

const sellerTypeOptions = [
  { label: "Farmer", value: "farmer" },
  { label: "Dealer", value: "dealer" },
  { label: "Individual", value: "individual" },
];

const ownerTypeOptions = [
  { label: "First Owner", value: "first_owner" },
  { label: "Second Owner", value: "second_owner" },
  { label: "Third Owner", value: "third_owner" },
];

const usageOptions = [
  { label: "Farming", value: "farming" },
  { label: "Commercial", value: "commercial" },
  { label: "Rent", value: "rent" },
];

// ==================== Static Category, Brand, Model, Variant Options ====================

const categoryOptions = [
  { id: 1, categoryName: "Tractor" },
  { id: 2, categoryName: "Harvester" },
  { id: 3, categoryName: "Plough" },
  { id: 4, categoryName: "Seeder" },
  { id: 5, categoryName: "Sprayer" },
  { id: 6, categoryName: "Cultivator" },
  { id: 7, categoryName: "Rotavator" },
  { id: 8, categoryName: "Thresher" },
];

const brandOptions = [
  { id: 1, brandName: "Mahindra", categoryId: 1 },
  { id: 2, brandName: "John Deere", categoryId: 1 },
  { id: 3, brandName: "Swaraj", categoryId: 1 },
  { id: 4, brandName: "Sonalika", categoryId: 1 },
  { id: 5, brandName: "New Holland", categoryId: 1 },
  { id: 6, brandName: "Kubota", categoryId: 1 },
  { id: 7, brandName: "Escorts", categoryId: 1 },
  { id: 8, brandName: "TAFE", categoryId: 1 },
  { id: 9, brandName: "Kheti", categoryId: 2 },
  { id: 10, brandName: "AgriMaster", categoryId: 3 },
];

const modelOptions = [
  { id: 1, modelName: "Arjun 605", brandId: 1 },
  { id: 2, modelName: "Yuvraj 215", brandId: 1 },
  { id: 3, modelName: "5310", brandId: 2 },
  { id: 4, modelName: "5050D", brandId: 2 },
  { id: 5, modelName: "744 FE", brandId: 3 },
  { id: 6, modelName: "735 XT", brandId: 3 },
  { id: 7, modelName: "DI 750 III", brandId: 4 },
  { id: 8, modelName: "WorldTrac", brandId: 4 },
  { id: 9, modelName: "3630 TX", brandId: 5 },
  { id: 10, modelName: "5620", brandId: 5 },
  { id: 11, modelName: "NeoStar A211N", brandId: 6 },
  { id: 12, modelName: "MuLTI 243", brandId: 6 },
];

const variantOptions = [
  { id: 1, variantName: "Standard", modelId: 1 },
  { id: 2, variantName: "Deluxe", modelId: 1 },
  { id: 3, variantName: "Premium", modelId: 1 },
  { id: 4, variantName: "Standard", modelId: 2 },
  { id: 5, variantName: "Deluxe", modelId: 2 },
  { id: 6, variantName: "4WD", modelId: 3 },
  { id: 7, variantName: "2WD", modelId: 3 },
  { id: 8, variantName: "Deluxe", modelId: 4 },
  { id: 9, variantName: "Standard", modelId: 4 },
  { id: 10, variantName: "Deluxe", modelId: 5 },
  { id: 11, variantName: "Standard", modelId: 5 },
];

// Light styling for react-select - matches vendor profile theme
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
};

// Custom Input Component
const Input = ({
  label,
  error,
  description,
  className = "",
  icon: Icon,
  required,
  ...props
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
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
  required,
  disabled,
}) => {
  return (
    <div>
      {label && (
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <Listbox value={value} onChange={onChange} disabled={disabled}>
        <div className="relative">
          <Listbox.Button
            className={`relative w-full cursor-default rounded-xl border border-gray-200 bg-white py-3 pl-4 pr-10 text-left text-sm text-gray-900 outline-none transition-all focus:ring-2 focus:ring-green-600 focus:border-green-600 ${
              disabled ? "bg-gray-50 cursor-not-allowed" : ""
            }`}
          >
            <span className="block truncate">
              {value ? value[displayField] || value.label : placeholder}
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

// Custom DatePicker Component
const DatePicker = ({
  value,
  onChange,
  label,
  error,
  required,
  placeholder = "Select date...",
}) => {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value || new Date());
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (value) setViewDate(value);
  }, [value]);

  const formatDisplay = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const isSameDay = (a, b) =>
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const handleSelectDay = (day) => {
    const newDate = new Date(year, month, day);
    onChange(newDate);
    setOpen(false);
  };

  const goPrevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const goNextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const weeks = [];
  let day = 1 - firstDayOfMonth;
  while (day <= daysInMonth) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push(day > 0 && day <= daysInMonth ? day : null);
      day++;
    }
    weeks.push(week);
  }

  return (
    <div ref={wrapperRef} className="relative">
      {label && (
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`relative w-full text-left rounded-xl border bg-white py-3 pl-10 pr-4 text-sm outline-none transition-all focus:ring-2 focus:ring-green-600 focus:border-green-600 ${
          error ? "border-red-300 bg-red-50" : "border-gray-200"
        }`}
      >
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {value ? formatDisplay(value) : placeholder}
        </span>
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-72 rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={goPrevMonth}
              className="p-1.5 rounded-lg hover:bg-green-50 text-gray-500 hover:text-green-600 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-semibold text-gray-900">
              {viewDate.toLocaleDateString("en-GB", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <button
              type="button"
              onClick={goNextMonth}
              className="p-1.5 rounded-lg hover:bg-green-50 text-gray-500 hover:text-green-600 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div
                key={d}
                className="text-center text-[11px] font-medium text-gray-400 py-1"
              >
                {d}
              </div>
            ))}
          </div>

          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 gap-1">
              {week.map((d, di) => {
                const thisDate = d ? new Date(year, month, d) : null;
                const selected = isSameDay(thisDate, value);
                return (
                  <button
                    type="button"
                    key={di}
                    disabled={!d}
                    onClick={() => d && handleSelectDay(d)}
                    className={`h-8 w-8 rounded-lg text-sm transition-colors ${
                      !d
                        ? "invisible"
                        : selected
                        ? "bg-green-600 text-white font-medium"
                        : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          ))}

          <button
            type="button"
            onClick={() => {
              onChange(null);
              setOpen(false);
            }}
            className="mt-3 text-xs text-gray-500 hover:text-red-500 transition-colors"
          >
            Clear
          </button>
        </div>
      )}

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

// Helper functions for date formatting
const formatLocalDate = (date) => {
  if (!date) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const parseLocalDate = (dateStr) =>
  dateStr ? new Date(dateStr + "T00:00:00") : undefined;

export default function BasicInformation({
  setCurrentStep,
  step,
  onComplete,
  productData,
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
    reset,
  } = useForm({
    resolver: yupResolver(EquipmentBasicInfoSchema),
    defaultValues: {},
  });

  const [country, setCountry] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [districtName, setDistrictName] = useState("");

  const categoryId = watch("categoryId");
  const brandId = watch("brandId");
  const modelId = watch("modelId");
  const watchCountry = watch("country");
  const watchState = watch("state");
  const watchDistrict = watch("district");

  // Filter brands based on selected category
  const filteredBrands = brandOptions.filter(
    (item) => Number(item.categoryId) === Number(categoryId),
  );

  // Filter models based on selected brand
  const filteredModels = modelOptions.filter(
    (item) => Number(item.brandId) === Number(brandId),
  );

  // Filter variants based on selected model
  const filteredVariants = variantOptions.filter(
    (item) => Number(item.modelId) === Number(modelId),
  );

  useEffect(() => {
    if (watchCountry) setCountry(watchCountry);
  }, [watchCountry]);

  useEffect(() => {
    if (watchState) setStateCode(watchState);
  }, [watchState]);

  useEffect(() => {
    if (watchDistrict) setDistrictName(watchDistrict);
  }, [watchDistrict]);

  useEffect(() => {
    if (!isEdit || !productData) return;

    setCountry(productData.country || "");
    setStateCode(productData.state || "");
    setDistrictName(productData.district || "");

    reset({
      categoryId: productData.categoryId,
      equipmentType: productData.equipmentType,
      brandId: productData.brandId,
      modelId: productData.modelId,
      variantId: productData.variantId,

      manufacturingYear: productData.manufacturingYear,
      purchaseYear: productData.purchaseYear,
      equipmentCondition: productData.equipmentCondition,
      serialNumber: productData.serialNumber,
      productCode: productData.productCode,
      color: productData.color,

      country: productData.country || "",
      state: productData.state || "",
      district: productData.district || "",
      taluka: productData.taluka || "",
      village: productData.village || "",

      sellerType: productData.sellerType,
      ownerType: productData.ownerType,
      ownershipProofAvailable: productData.ownershipProofAvailable,
      usage: productData.usage,
    });
  }, [productData, isEdit, reset]);

  const countryOptions = Country.getAllCountries().map((c) => ({
    value: c.isoCode,
    label: c.name,
  }));

  const stateOptions = State.getStatesOfCountry(country).map((s) => ({
    value: s.isoCode,
    label: s.name,
  }));

  const districtOptions = City.getCitiesOfState(country, stateCode).map(
    (c) => ({
      value: c.name,
      label: c.name,
    }),
  );

  const talukaOptions = City.getCitiesOfState(country, stateCode).map((c) => ({
    value: c.name,
    label: c.name,
  }));

  const onSubmit = async (data) => {
  try {
    const selectedBrand = filteredBrands.find(
      (item) => Number(item.id) === Number(data.brandId),
    );

    const selectedModel = filteredModels.find(
      (item) => Number(item.id) === Number(data.modelId),
    );

    const selectedVariant = filteredVariants.find(
      (item) => Number(item.id) === Number(data.variantId),
    );

    const payload = {
      // ==========================
      // Equipment Classification
      // ==========================
      categoryId: data.categoryId
        ? Number(data.categoryId)
        : null,

      equipmentType: data.equipmentType || "",

      brandId: data.brandId
        ? Number(data.brandId)
        : null,

      brand: selectedBrand?.brandName || "",

      modelId: data.modelId
        ? Number(data.modelId)
        : null,

      model: selectedModel?.modelName || "",

      variantId: data.variantId
        ? Number(data.variantId)
        : null,

      variant: selectedVariant?.variantName || "",

      // ==========================
      // Equipment Details
      // ==========================
      manufacturingYear:
        data.manufacturingYear || null,

      purchaseYear:
        data.purchaseYear || null,

      equipmentCondition:
        data.equipmentCondition || "",

      serialNumber:
        data.serialNumber || "",

      productCode:
        data.productCode || "",

      color:
        data.color || "",

      // ==========================
      // Location
      // ==========================
      country:
        data.country || "",

      state:
        data.state || "",

      district:
        data.district || "",

      taluka:
        data.taluka || "",

      village:
        data.village || "",

      // ==========================
      // Seller Details
      // ==========================
      sellerType:
        data.sellerType || "",

      ownerType:
        data.ownerType || "",

      ownershipProofAvailable:
        Boolean(data.ownershipProofAvailable),

      usage:
        data.usage || "",

      // ==========================
      // Step
      // ==========================
      currentStep: 1,
    };

    console.log("Equipment Variant Payload:", payload);

    // ONLY CREATE FOR NOW
    const res = await apiHelper.post(
      "/vendor-web/equipmentvariant",
      payload,
    );

    console.log("Equipment Variant Created:", res.data);

    // Store created ID for next steps
 if (res.data?.id) {
      localStorage.setItem(
        "vendorEquipmentId",
        res.data.id.toString(),
      );
    }

    toast.success("Basic information saved!");

    if (onComplete) {
      onComplete(step);
    }

    setCurrentStep(step + 1);
  } catch (error) {
    console.error(
      "Create Equipment Variant Error:",
      error,
    );

    toast.error(
      error?.response?.data?.message ||
        "Failed to save basic information. Please try again.",
    );
  }
};

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12 lg:py-16">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Add Equipment</h1>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the equipment details below to list your product
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <div className="p-6 md:p-8 lg:p-10 space-y-10">
              {/* ==================== Equipment Details ==================== */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Equipment Details
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {/* 1. Equipment Category */}
                  <Controller
                    name="categoryId"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={categoryOptions}
                        value={
                          categoryOptions.find((c) => c.id === field.value) ||
                          null
                        }
                        onChange={(option) => {
                          field.onChange(option.id);
                          setValue("brandId", "");
                          setValue("modelId", "");
                          setValue("variantId", "");
                        }}
                        displayField="categoryName"
                        placeholder="Select Category"
                        label="Equipment Category"
                        error={errors?.categoryId?.message}
                        required
                      />
                    )}
                  />

                  {/* 2. Equipment Type */}
                  <Controller
                    name="equipmentType"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={equipmentTypeOptions}
                        value={
                          equipmentTypeOptions.find(
                            (o) => o.value === field.value,
                          ) || null
                        }
                        onChange={(option) => field.onChange(option?.value)}
                        displayField="label"
                        placeholder="Select Equipment Type"
                        label="Equipment Type"
                        error={errors?.equipmentType?.message}
                        required
                      />
                    )}
                  />

                  {/* 3. Brand */}
                  <Controller
                    name="brandId"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={filteredBrands}
                        value={
                          filteredBrands.find((b) => b.id === field.value) ||
                          null
                        }
                        onChange={(option) => {
                          field.onChange(option.id);
                          setValue("modelId", "");
                          setValue("variantId", "");
                        }}
                        displayField="brandName"
                        placeholder="Select Brand"
                        label="Brand"
                        error={errors?.brandId?.message}
                        required
                      />
                    )}
                  />

                  {/* 4. Model */}
                  <Controller
                    name="modelId"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={filteredModels}
                        value={
                          filteredModels.find((m) => m.id === field.value) ||
                          null
                        }
                        onChange={(option) => {
                          field.onChange(option.id);
                          setValue("variantId", "");
                        }}
                        displayField="modelName"
                        placeholder="Select Model"
                        label="Model"
                        error={errors?.modelId?.message}
                        required
                      />
                    )}
                  />

                  {/* 5. Variant / Version */}
                  <Controller
                    name="variantId"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={filteredVariants}
                        value={
                          filteredVariants.find((v) => v.id === field.value) ||
                          null
                        }
                        onChange={(option) => field.onChange(option?.id)}
                        displayField="variantName"
                        placeholder="Select Variant / Version"
                        label="Variant / Version"
                        error={errors?.variantId?.message}
                      />
                    )}
                  />

                  {/* 6. Manufacturing Year - Using DatePicker */}
                  <Controller
                    name="manufacturingYear"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        value={
                          field.value ? parseLocalDate(field.value) : undefined
                        }
                        onChange={(date) =>
                          field.onChange(date ? formatLocalDate(date) : null)
                        }
                        label="Manufacturing Year"
                        error={errors?.manufacturingYear?.message}
                        placeholder="Select manufacturing date"
                        required
                      />
                    )}
                  />

                  {/* 7. Purchase Year - Using DatePicker */}
                  <Controller
                    name="purchaseYear"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        value={
                          field.value ? parseLocalDate(field.value) : undefined
                        }
                        onChange={(date) =>
                          field.onChange(date ? formatLocalDate(date) : null)
                        }
                        label="Purchase Year"
                        error={errors?.purchaseYear?.message}
                        placeholder="Select purchase date"
                      />
                    )}
                  />

                  {/* 8. Equipment Condition */}
                  <Controller
                    name="equipmentCondition"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={equipmentConditionOptions}
                        value={
                          equipmentConditionOptions.find(
                            (o) => o.value === field.value,
                          ) || null
                        }
                        onChange={(option) => field.onChange(option?.value)}
                        displayField="label"
                        placeholder="New / Used"
                        label="Equipment Condition"
                        error={errors?.equipmentCondition?.message}
                        required
                      />
                    )}
                  />

                  {/* 9. Serial Number */}
                  <Input
                    {...register("serialNumber")}
                    label="Serial Number"
                    placeholder="Enter serial number"
                    error={errors?.serialNumber?.message}
                  />

                  {/* 10. Product Code / SKU */}
                  <Input
                    {...register("productCode")}
                    label="Product Code / SKU"
                    placeholder="Enter product code / SKU"
                    error={errors?.productCode?.message}
                  />

                  {/* 11. Color */}
                  <Input
                    {...register("color")}
                    label="Color"
                    placeholder="Enter color"
                    error={errors?.color?.message}
                  />
                </div>
              </div>

              {/* ==================== Location ==================== */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Location
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Country <span className="text-red-500">*</span>
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
                            setValue("state", "");
                            setValue("district", "");
                            setValue("taluka", "");
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

                  {/* 13. State */}
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
                            setStateCode(selected?.value || "");
                            setValue("district", "");
                            setValue("taluka", "");
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

                  {/* 14. District */}
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
                          isDisabled={!stateCode}
                          value={
                            districtOptions.find(
                              (o) => o.value === field.value,
                            ) || null
                          }
                          onChange={(selected) => {
                            field.onChange(selected?.value || "");
                            setDistrictName(selected?.value || "");
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

                  {/* 15. Taluka */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Taluka
                    </label>
                    <Controller
                      name="taluka"
                      control={control}
                      render={({ field }) => (
                        <Select
                          options={talukaOptions}
                          styles={selectStyles}
                          placeholder="Search Taluka"
                          isDisabled={!districtName}
                          value={
                            talukaOptions.find(
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

                  {/* 16. Village - Using Select dropdown */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Village
                    </label>
                    <Controller
                      name="village"
                      control={control}
                      render={({ field }) => (
                        <Select
                          options={talukaOptions}
                          styles={selectStyles}
                          placeholder="Search Village"
                          isDisabled={!districtName}
                          value={
                            talukaOptions.find(
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
                </div>
              </div>

              {/* ==================== Seller Details ==================== */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Seller Details
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {/* Seller Type: Farmer / Dealer / Individual */}
                  <Controller
                    name="sellerType"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={sellerTypeOptions}
                        value={
                          sellerTypeOptions.find(
                            (o) => o.value === field.value,
                          ) || null
                        }
                        onChange={(option) => field.onChange(option?.value)}
                        displayField="label"
                        placeholder="Select Seller Type"
                        label="Seller Type"
                        error={errors?.sellerType?.message}
                        required
                      />
                    )}
                  />

                  {/* Ownership: First / Second / Third Owner */}
                  <Controller
                    name="ownerType"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={ownerTypeOptions}
                        value={
                          ownerTypeOptions.find(
                            (o) => o.value === field.value,
                          ) || null
                        }
                        onChange={(option) => field.onChange(option?.value)}
                        displayField="label"
                        placeholder="Select Ownership"
                        label="Ownership"
                        error={errors?.ownerType?.message}
                        required
                      />
                    )}
                  />

                  {/* Ownership Proof Available */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Ownership Proof Available
                    </label>
                    <Controller
                      name="ownershipProofAvailable"
                      control={control}
                      render={({ field }) => (
                        <Select
                          options={[
                            { label: "Yes", value: true },
                            { label: "No", value: false },
                          ]}
                          styles={selectStyles}
                          placeholder="Select"
                          value={
                            [
                              { label: "Yes", value: true },
                              { label: "No", value: false },
                            ].find((o) => o.value === field.value) || null
                          }
                          onChange={(selected) =>
                            field.onChange(selected?.value ?? false)
                          }
                        />
                      )}
                    />
                    {errors?.ownershipProofAvailable && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.ownershipProofAvailable.message}
                      </p>
                    )}
                  </div>

                  {/* Usage: Farming / Commercial / Rent */}
                  <Controller
                    name="usage"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={usageOptions}
                        value={
                          usageOptions.find((o) => o.value === field.value) ||
                          null
                        }
                        onChange={(option) => field.onChange(option?.value)}
                        displayField="label"
                        placeholder="Select Usage"
                        label="Usage"
                        error={errors?.usage?.message}
                        required
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 md:px-8 lg:px-10 py-6 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between gap-3">
              <Button
                type="button"
                variant="outlined"
                className="min-w-[7rem] order-2 sm:order-1 cursor-pointer"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <div className="flex flex-col sm:flex-row gap-3 order-1 sm:order-2">
                <Button type="submit" className="min-w-[9rem] cursor-pointer">
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
