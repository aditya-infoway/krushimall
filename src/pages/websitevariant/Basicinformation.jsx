import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import Select from "react-select";
import { Country, State, City } from "country-state-city";
import toast from "react-hot-toast";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";

import { BasicInformationSchema } from "./schema";
import apiHelper from "../../utils/apiHelper";

const tractorStatusOptions = [
  { label: "Available", value: "available" },
  { label: "Sold", value: "sold" },
  { label: "Pending", value: "pending" },
  { label: "In Transit", value: "in_transit" },
];

const colorOptions = [
  { label: "Red", value: "red" },
  { label: "Blue", value: "blue" },
  { label: "Green", value: "green" },
  { label: "Orange", value: "orange" },
  { label: "Black", value: "black" },
  { label: "White", value: "white" },
];

const stockStatusOptions = [
  { label: "In Stock", value: "in_stock" },
  { label: "Out of Stock", value: "out_of_stock" },
  { label: "Limited Stock", value: "limited_stock" },
  { label: "Pre-order", value: "pre_order" },
];

const dealerOptions = [
  { label: "Dealer 1", value: "dealer1" },
  { label: "Dealer 2", value: "dealer2" },
  { label: "Dealer 3", value: "dealer3" },
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
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
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

// Custom Input Component - matches vendor profile theme
const Input = ({ label, error, description, className = "", icon: Icon, ...props }) => {
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
          className={`w-full ${Icon ? 'pl-10' : 'px-4'} pr-4 py-3 text-sm border rounded-xl bg-white outline-none transition-all focus:ring-2 focus:ring-green-600 focus:border-green-600 ${
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

// Custom Textarea Component - matches vendor profile theme
const Textarea = ({ label, error, description, className = "", icon: Icon, ...props }) => {
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
          className={`w-full ${Icon ? 'pl-10' : 'px-4'} pr-4 py-3 text-sm border rounded-xl bg-white outline-none transition-all focus:ring-2 focus:ring-green-600 focus:border-green-600 ${
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

// Custom Button Component - matches vendor profile theme
const Button = ({ children, variant = "primary", className = "", type = "button", ...props }) => {
  const baseStyles = "px-6 py-3 rounded-xl text-sm font-semibold transition-all";
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

// Custom Listbox Component using Headless UI - matches vendor profile theme
const CustomListbox = ({ data, value, onChange, displayField, placeholder, label, error, icon: Icon }) => {
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
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
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

// Custom DatePicker Component - matches vendor profile theme
const DatePicker = ({ value, onChange, label, error, placeholder = "Select date...", icon: Icon }) => {
  return (
    <div>
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
          type="date"
          value={value || ""}
          onChange={(e) => onChange(e.target.value ? new Date(e.target.value) : null)}
          className={`w-full ${Icon ? 'pl-10' : 'px-4'} pr-4 py-3 text-sm border rounded-xl bg-white outline-none transition-all focus:ring-2 focus:ring-green-600 focus:border-green-600 ${
            error ? "border-red-300 bg-red-50" : "border-gray-200"
          }`}
          placeholder={placeholder}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default function BasicInformation({ setCurrentStep }) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(BasicInformationSchema),
    defaultValues: {}
  });

  const [country, setCountry] = useState("");
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [modelYears, setModelYears] = useState([]);
  const [variants, setVariants] = useState([]);
  const [highlightCount, setHighlightCount] = useState(5);

  const showCustomColorInput = watch("showCustomColor");
  const categoryId = watch("categoryId");
  const brandId = watch("brandId");
  const modelId = watch("modelId");
  const modelYearId = watch("modelYearId");
  const selectedStates = watch("availableStates") || [];

  const filteredBrands = brands.filter(
    (item) => Number(item.categoryId) === Number(categoryId),
  );
  const filteredModels = models.filter(
    (item) => Number(item.brandId) === Number(brandId),
  );
  const filteredModelYears = modelYears.filter(
    (item) => Number(item.modelId) === Number(modelId),
  );
  const filteredVariants = variants.filter(
    (item) => Number(item.modelYearId) === Number(modelYearId),
  );

  useEffect(() => {
    loadMasters();
  }, []);

  const loadMasters = async () => {
    try {
      const [categoryRes, brandRes, modelRes, modelYearRes, variantRes] =
        await Promise.all([
          apiHelper.get("/category"),
          apiHelper.get("/brand"),
          apiHelper.get("/model"),
          apiHelper.get("/model-year"),
          apiHelper.get("/variant"),
        ]);

      setCategories(categoryRes.data || categoryRes);
      setBrands(brandRes.data || brandRes);
      setModels(modelRes.data || modelRes);
      setModelYears(modelYearRes.data || modelYearRes);
      setVariants(variantRes.data || variantRes);
    } catch (error) {
      console.error(error);
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
  const cityOptions = selectedStates.flatMap((stateCode) =>
    City.getCitiesOfState(country, stateCode).map((c) => ({
      value: c.name,
      label: c.name,
    })),
  );

  const formatLocalDate = (date) => {
    if (!date) return "";
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };
  const parseLocalDate = (dateStr) =>
    dateStr ? new Date(dateStr + "T00:00:00") : undefined;

  const onSubmit = async (data) => {
    try {
      const payload = {
        categoryId: data.categoryId ? Number(data.categoryId) : null,
        brandId: data.brandId ? Number(data.brandId) : null,
        modelId: data.modelId ? Number(data.modelId) : null,
        modelYearId: data.modelYearId ? Number(data.modelYearId) : null,
        variantId: data.variantId ? Number(data.variantId) : null,
        variantCode: data.variantCode,
        productName: data.productName,
        productCode: data.productCode,
        skuCode: data.skuCode,
        launchYear: data.launchYear
          ? new Date(data.launchYear).toISOString()
          : null,
        country: data.country,
        tractorStatus: data.tractorStatus,
        shortDescription: data.shortDescription,
        highlight1: data.highlights?.highlight1,
        highlight2: data.highlights?.highlight2,
        highlight3: data.highlights?.highlight3,
        highlight4: data.highlights?.highlight4,
        highlight5: data.highlights?.highlight5,
        redColor: Boolean(data.colors?.red),
        blueColor: Boolean(data.colors?.blue),
        greenColor: Boolean(data.colors?.green),
        orangeColor: Boolean(data.colors?.orange),
        blackColor: Boolean(data.colors?.black),
        whiteColor: Boolean(data.colors?.white),
        customColor: Boolean(data.colors?.custom),
        customColorName: data.customColorName,
        customColorCode: data.customColorCode,
        availableStates: data.availableStates,
        availableDistricts: data.availableDistricts,
        availableDealers: data.availableDealers,
        stockStatus: data.stockStatus,
        seoTitle: data.seoTitle,
        seoUrl: data.seoUrl,
        metaDescription: data.metaDescription,
        keywords: data.keywords,
        currentStep: 0,
      };

      const res = await apiHelper.post("/vendor/products", payload);
      const productId = res.data.id;
      localStorage.setItem("vendorProductId", productId.toString());

      toast.success("Basic information saved!");
      setCurrentStep(1);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "Failed to save basic information. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12 lg:py-16">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the details below to list your product
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <div className="p-6 md:p-8 lg:p-10 space-y-10">
              {/* Category, Brand, Model, Model Year */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Product Classification
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Controller
                    name="categoryId"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={categories}
                        value={categories.find((c) => c.id === field.value) || null}
                        onChange={(option) => {
                          field.onChange(option.id);
                          setValue("brandId", "");
                          setValue("modelId", "");
                          setValue("modelYearId", "");
                          setValue("variantId", "");
                          setValue("variantCode", "");
                        }}
                        displayField="categoryName"
                        placeholder="Select Category"
                        label="Select Category"
                        error={errors?.categoryId?.message}
                      />
                    )}
                  />

                  <Controller
                    name="brandId"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={filteredBrands}
                        value={filteredBrands.find((b) => b.id === field.value) || null}
                        onChange={(option) => {
                          field.onChange(option.id);
                          setValue("modelId", "");
                          setValue("modelYearId", "");
                          setValue("variantId", "");
                          setValue("variantCode", "");
                        }}
                        displayField="brandName"
                        placeholder="Select Brand"
                        label="Select Brand"
                        error={errors?.brandId?.message}
                      />
                    )}
                  />

                  <Controller
                    name="modelId"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={filteredModels}
                        value={filteredModels.find((m) => m.id === field.value) || null}
                        onChange={(option) => {
                          field.onChange(option.id);
                          setValue("modelYearId", "");
                          setValue("variantId", "");
                          setValue("variantCode", "");
                        }}
                        displayField="modelName"
                        placeholder="Select Model"
                        label="Select Model"
                        error={errors?.modelId?.message}
                      />
                    )}
                  />

                  <Controller
                    name="modelYearId"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={filteredModelYears}
                        value={
                          filteredModelYears.find((y) => y.id === field.value) || null
                        }
                        onChange={(option) => {
                          field.onChange(option.id);
                          setValue("variantId", "");
                          setValue("variantCode", "");
                        }}
                        displayField="modelYear"
                        placeholder="Select Model Year"
                        label="Select Model Year"
                        error={errors?.modelYearId?.message}
                      />
                    )}
                  />
                </div>
              </div>

              {/* Variant, Variant Code, Launch Year, Product Name */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Product Details
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Controller
                    name="variantId"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={filteredVariants}
                        value={
                          filteredVariants.find((v) => v.id === field.value) || null
                        }
                        onChange={(option) => {
                          field.onChange(option.id);
                          setValue("variantCode", option.variantCode || "");
                        }}
                        displayField="variantName"
                        placeholder="Select Variant"
                        label="Select Variant"
                        error={errors?.variantId?.message}
                      />
                    )}
                  />

                  <Input
                    {...register("variantCode")}
                    label="Variant Code"
                    placeholder="Variant Code"
                    disabled
                  />

                  <Controller
                    name="launchYear"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        value={field.value ? parseLocalDate(field.value) : undefined}
                        onChange={(dates) =>
                          field.onChange(dates ? formatLocalDate(dates) : null)
                        }
                        label="Launch Year"
                        error={errors?.launchYear?.message}
                        placeholder="Select launch date..."
                      />
                    )}
                  />

                  <Input
                    {...register("productName")}
                    label="Website Display Product Name"
                    placeholder="Enter product Name"
                    error={errors?.productName?.message}
                  />
                </div>
              </div>

              {/* Product Code, SKU Code, Tractor Status */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Input
                  {...register("productCode")}
                  label="Product Code"
                  placeholder="Enter product Code"
                  error={errors?.productCode?.message}
                />
                <Input
                  {...register("skuCode")}
                  label="SKU Code"
                  placeholder="Enter SKU code"
                  error={errors?.skuCode?.message}
                />

                <Controller
                  name="tractorStatus"
                  control={control}
                  render={({ field }) => (
                    <CustomListbox
                      data={tractorStatusOptions}
                      value={
                        tractorStatusOptions.find((o) => o.value === field.value) ||
                        null
                      }
                      onChange={(option) => field.onChange(option?.value)}
                      displayField="label"
                      placeholder="Select Status"
                      label="Tractor Status"
                      error={errors?.tractorStatus?.message}
                    />
                  )}
                />
              </div>

              {/* Short Description */}
              <div>
                <Textarea
                  {...register("shortDescription")}
                  label="Short Description"
                  placeholder="Write short description about this tractor (Max 200 characters)"
                  maxLength={200}
                  rows={3}
                  description="Max 200 characters"
                  error={errors?.shortDescription?.message}
                />
              </div>

              {/* Key Highlights */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Key Highlights
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Add key highlights about this tractor
                </p>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                  {Array.from({ length: highlightCount }, (_, index) => (
                    <Input
                      key={index}
                      {...register(`highlights.highlight${index + 1}`)}
                      label={`Highlight ${index + 1}`}
                      placeholder="Enter highlight"
                    />
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outlined"
                  className="mt-4"
                  onClick={() => setHighlightCount((prev) => prev + 1)}
                >
                  + Add Another Highlight
                </Button>
              </div>

              {/* Available Colors */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Available Colors
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Select available colors for this tractor
                </p>

                <div className="flex flex-wrap gap-4">
                  {colorOptions.map((color) => (
                    <label key={color.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register(`colors.${color.value}`)}
                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-2 focus:ring-green-600"
                      />
                      <span
                        className="h-6 w-6 rounded-full border border-gray-200"
                        style={{ backgroundColor: color.value }}
                      />
                      <span className="text-sm text-gray-700">{color.label}</span>
                    </label>
                  ))}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("colors.custom")}
                      onChange={(e) => {
                        setValue("showCustomColor", e.target.checked);
                        register("colors.custom").onChange(e);
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-2 focus:ring-green-600"
                    />
                    <span className="text-sm text-gray-700">Custom</span>
                  </label>
                </div>

                {showCustomColorInput && (
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <Input
                      {...register("customColorName")}
                      label="Custom Color Name"
                      placeholder="Enter custom color name"
                      error={errors?.customColorName?.message}
                    />
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Custom Color
                      </label>
                      <input
                        type="color"
                        {...register("customColorCode")}
                        className="h-12 w-24 cursor-pointer rounded-xl border border-gray-200 p-1"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Dealer Availability */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Dealer Availability
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Select where this tractor is available
                </p>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
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
                            countryOptions.find((o) => o.value === field.value) ||
                            null
                          }
                          onChange={(selected) => {
                            field.onChange(selected?.value || "");
                            setCountry(selected?.value || "");
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
                      Available States <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      name="availableStates"
                      control={control}
                      render={({ field }) => (
                        <Select
                          options={stateOptions}
                          isMulti
                          styles={selectStyles}
                          placeholder="Search State"
                          isDisabled={!country}
                          value={stateOptions.filter((o) =>
                            field.value?.includes(o.value),
                          )}
                          onChange={(selected) =>
                            field.onChange(selected?.map((s) => s.value) || [])
                          }
                        />
                      )}
                    />
                    {errors?.availableStates && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.availableStates.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Available Districts <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      name="availableDistricts"
                      control={control}
                      render={({ field }) => (
                        <Select
                          options={cityOptions}
                          isMulti
                          styles={selectStyles}
                          placeholder="Search District"
                          isDisabled={!selectedStates.length}
                          value={cityOptions.filter((o) =>
                            field.value?.includes(o.value),
                          )}
                          onChange={(selected) =>
                            field.onChange(selected?.map((s) => s.value) || [])
                          }
                        />
                      )}
                    />
                    {errors?.availableDistricts && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.availableDistricts.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Available Dealers <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      name="availableDealers"
                      control={control}
                      render={({ field }) => (
                        <Select
                          options={dealerOptions}
                          isMulti
                          styles={selectStyles}
                          placeholder="Search Dealers"
                          value={dealerOptions.filter((o) =>
                            field.value?.includes(o.value),
                          )}
                          onChange={(selected) =>
                            field.onChange(selected?.map((s) => s.value) || [])
                          }
                        />
                      )}
                    />
                    {errors?.availableDealers && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.availableDealers.message}
                      </p>
                    )}
                  </div>

                  <Controller
                    name="stockStatus"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={stockStatusOptions}
                        value={
                          stockStatusOptions.find((o) => o.value === field.value) ||
                          null
                        }
                        onChange={(option) => field.onChange(option?.value)}
                        displayField="label"
                        placeholder="Select Stock Status"
                        label="Stock Status"
                        error={errors?.stockStatus?.message}
                      />
                    )}
                  />
                </div>
              </div>

              {/* SEO Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  SEO Details
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                  <Input
                    {...register("seoTitle")}
                    label="SEO Title"
                    placeholder="Enter SEO title"
                    error={errors?.seoTitle?.message}
                  />
                  <Input
                    {...register("seoUrl")}
                    label="SEO URL"
                    placeholder="Enter SEO URL"
                    error={errors?.seoUrl?.message}
                  />
                  <Textarea
                    {...register("metaDescription")}
                    label="Meta Description"
                    placeholder="Enter meta description"
                    maxLength={160}
                    rows={2}
                    description="Max 160 characters"
                    error={errors?.metaDescription?.message}
                  />
                  <Input
                    {...register("keywords")}
                    label="Keywords"
                    placeholder="Enter keywords"
                    description="Comma separated keywords"
                    error={errors?.keywords?.message}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
   <div className="px-6 md:px-8 lg:px-10 py-6 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between gap-3">
          <Button 
            type="button" 
            variant="outlined" 
            className="min-w-[7rem] order-2 sm:order-1"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <div className="flex flex-col sm:flex-row gap-3 order-1 sm:order-2">
            <Button 
              type="button" 
              variant="outlined" 
              className="min-w-[7rem]"
              onClick={() => {
                if (step > 1) {
                  if (setCurrentStep) {
                    setCurrentStep(step - 1);
                  } else if (prevStep) {
                    prevStep();
                  }
                }
              }}
            >
              Previous
            </Button>
            <Button type="submit" className="min-w-[7rem]">
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