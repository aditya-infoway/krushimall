import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { Country, State, City } from "country-state-city";
import toast from "react-hot-toast";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

import { BasicInformationSchema } from "./schema";
import apiHelper from "../../utils/apiHelper";
import { useMemo } from "react"; 
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

const fuelTypeOptions = [
  { label: "Diesel", value: "diesel" },
  { label: "Petrol", value: "petrol" },
  { label: "Electric", value: "electric" },
  { label: "CNG", value: "cng" },
];

const driveTypeOptions = [
  { label: "2WD", value: "2wd" },
  { label: "4WD", value: "4wd" },
];

const ownershipOptions = [
  { label: "First Owner", value: "first_owner" },
  { label: "Second Owner", value: "second_owner" },
  { label: "Third Owner", value: "third_owner" },
];

const ownerTypeOptions = [
  { label: "First Owner", value: "first_owner" },
  { label: "Second Owner", value: "second_owner" },
  { label: "Third Owner", value: "third_owner" },
];

const sellerTypeOptions = [
  { label: "Farmer", value: "farmer" },
  { label: "Dealer", value: "dealer" },
  { label: "Individual", value: "individual" },
];

const purposeOptions = [
  { label: "Farming", value: "farming" },
  { label: "Commercial", value: "commercial" },
  { label: "Rental", value: "rental" },
];

const tractorCategoryOptions = [
  { label: "Compact", value: "compact" },
  { label: "Utility", value: "utility" },
  { label: "Row Crop", value: "row_crop" },
  { label: "Orchard", value: "orchard" },
  { label: "Industrial", value: "industrial" },
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

// Custom Input Component - matches vendor profile theme
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

// Custom Textarea Component - matches vendor profile theme
const Textarea = ({
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
          <Icon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        )}
       <textarea
  {...props}
  rows={4}
  className={`w-180  resize-none ${
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

// Custom Button Component - matches vendor profile theme
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

// Custom Listbox Component using Headless UI - matches vendor profile theme
const CustomListbox = ({
  data,
  value,
  onChange,
  displayField,
  placeholder,
  label,
  error,
  required,
  icon: Icon,
}) => {
  return (
    <div>
      {label && (
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
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

// Custom DatePicker Component - matches vendor profile theme
const DatePicker = ({
  value, // Date object or null
  onChange, // (date: Date | null) => void
  label,
  error,
  placeholder = "Select date...",
  required,
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
    resolver: yupResolver(BasicInformationSchema),
    defaultValues: {},
  });

  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [modelYears, setModelYears] = useState([]);
  const [variants, setVariants] = useState([]);
  const [selectedStates, setSelectedStates] = useState([]);
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [highlightCount, setHighlightCount] = useState(5);
  const categoryId = watch("categoryId");
  const brandId = watch("brandId");
  const modelId = watch("modelId");
  const modelYearId = watch("modelYearId");
  const watchCountry = watch("country");
const rawAvailableStates = watch("availableStates");
const watchAvailableStates = useMemo(
  () => rawAvailableStates || [],
  [rawAvailableStates],
);

  // Update state when watch values change
  useEffect(() => {
    if (watchCountry) {
      setCountry(watchCountry);
    }
  }, [watchCountry]);

  useEffect(() => {
    setSelectedStates(watchAvailableStates);
  }, [watchAvailableStates]);

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
         apiHelper.get("/web/categories"),
          apiHelper.get("/web/brands"),
          apiHelper.get("/web/models"),
          apiHelper.get("/web/model-years"),
          apiHelper.get("/web/variants"),
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

  useEffect(() => {
    if (!isEdit || !productData) return;

    setCountry(productData.country || "");
    setSelectedStates(productData.availableStates || []);

    if (productData.availableStates?.length) {
      setState(productData.availableStates[0]);
    }

    if (productData.availableDistricts?.length) {
      setDistrict(productData.availableDistricts[0]);
    }

    reset({
      // Product Classification
       productName: productData.productName,
      categoryId: productData.categoryId,
      brandId: productData.brandId,
      modelId: productData.modelId,
      modelYearId: productData.modelYearId,
      variantId: productData.variantId,
      variantCode: productData.variantCode,

      // Tractor Details
      brand: productData.brand,
      model: productData.model,
      variant: productData.variant,
      hp: productData.hp,
      manufacturingYear: productData.manufacturingYear,
      purchaseYear: productData.purchaseYear,
      rcRegistrationNumber: productData.rcRegistrationNumber,
      engineNumber: productData.engineNumber,
      chassisNumber: productData.chassisNumber,
      tractorCategory: productData.tractorCategory,
      fuelType: productData.fuelType,
      driveType: productData.driveType,
 description: productData.description,
      // Colors
      colors: {
        red: productData.redColor,
        blue: productData.blueColor,
        green: productData.greenColor,
        orange: productData.orangeColor,
        black: productData.blackColor,
        white: productData.whiteColor,
        custom: productData.customColor,
      },
      // Highlights
     highlights: {
    highlight1: productData.highlight1,
    highlight2: productData.highlight2,
    highlight3: productData.highlight3,
    highlight4: productData.highlight4,
    highlight5: productData.highlight5,
  },
      customColorName: productData.customColorName,
      customColorCode: productData.customColorCode,

      // Location
      country: productData.country || "",
      availableStates: productData.availableStates || [],
      availableDistricts: productData.availableDistricts || [],
      taluka: productData.locationTaluka || "",
      city: productData.locationVillage || "",

      // Ownership
      ownership: productData.ownership,
      ownerType: productData.ownerType,
      firstOwner: productData.firstOwner,
      secondOwner: productData.secondOwner,
      thirdOwner: productData.thirdOwner,
      sellerType: productData.sellerType,
      ownershipProofAvailable: productData.ownershipProofAvailable,

      // Usage
      hoursMeterReading: productData.hoursMeterReading,
      approxWorkingHours: productData.approxWorkingHours,
      acresWorked: productData.acresWorked,
      purpose: productData.purpose,

      // Additional fields
      availableDealers: productData.availableDealers || [],
      stockStatus: productData.stockStatus,
    });

    setValue("showCustomColor", productData.customColor);
  }, [productData, isEdit, reset, setValue]);

  const showCustomColorInput = watch("showCustomColor");

  const countryOptions = Country.getAllCountries().map((c) => ({
    value: c.isoCode,
    label: c.name,
  }));

  const stateOptions = State.getStatesOfCountry(country).map((s) => ({
    value: s.isoCode,
    label: s.name,
  }));

  const districtOptions = selectedStates.flatMap((stateCode) =>
    City.getCitiesOfState(country, stateCode).map((c) => ({
      value: c.name,
      label: c.name,
    })),
  );
  const cityOptions = City.getCitiesOfState(country, state).map((c) => ({
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
        // Product Classification
           productName: data.productName || "",
        categoryId: data.categoryId ? Number(data.categoryId) : null,
        brandId: data.brandId ? Number(data.brandId) : null,
        modelId: data.modelId ? Number(data.modelId) : null,
        modelYearId: data.modelYearId ? Number(data.modelYearId) : null,
        variantId: data.variantId ? Number(data.variantId) : null,
        variantCode: data.variantCode || "",

        // Tractor Details
        brand: selectedBrand?.brandName || "",
        model: selectedModel?.modelName || "",
        variant: selectedVariant?.variantName || "",
        hp: data.hp || null,
        manufacturingYear: data.manufacturingYear || null,
        purchaseYear: data.purchaseYear || null,
        rcRegistrationNumber: data.rcRegistrationNumber || "",
        engineNumber: data.engineNumber || "",
        chassisNumber: data.chassisNumber || "",
        tractorCategory: data.tractorCategory || "",
        fuelType: data.fuelType || "",
        driveType: data.driveType || "",
  description: data.description || "",
        // Colors
        redColor: Boolean(data.colors?.red),
        blueColor: Boolean(data.colors?.blue),
        greenColor: Boolean(data.colors?.green),
        orangeColor: Boolean(data.colors?.orange),
        blackColor: Boolean(data.colors?.black),
        whiteColor: Boolean(data.colors?.white),
        customColor: Boolean(data.colors?.custom),
        customColorName: data.customColorName || "",
        customColorCode: data.customColorCode || "",
        // Highlights
       highlight1: data.highlights?.highlight1 || "",
highlight2: data.highlights?.highlight2 || "",
highlight3: data.highlights?.highlight3 || "",
highlight4: data.highlights?.highlight4 || "",
highlight5: data.highlights?.highlight5 || "",
        // Location
        country: data.country || "",
        availableStates: data.availableStates || [],
        availableDistricts: data.availableDistricts || [],

        locationState: data.availableStates?.[0] || "",
        locationDistrict: data.availableDistricts?.[0] || "",
        locationTaluka: data.taluka || "",
        locationVillage: data.city || "",

        // Ownership
        ownership: data.ownership || "",
        ownerType: data.ownerType || "",
        firstOwner: data.firstOwner || "",
        secondOwner: data.secondOwner || "",
        thirdOwner: data.thirdOwner || "",
        sellerType: data.sellerType || "",
        ownershipProofAvailable: Boolean(data.ownershipProofAvailable),

        // Usage
        hoursMeterReading: data.hoursMeterReading || null,
        approxWorkingHours: data.approxWorkingHours || null,
        acresWorked: data.acresWorked || null,
        purpose: data.purpose || "",

        // Additional Fields
        availableDealers: data.availableDealers || [],
        stockStatus: data.stockStatus || "",

        currentStep: 0,
      };

      let res;

      if (isEdit) {
        res = await apiHelper.put(
          `/vendor-web/used-website-variant/${productData.id}`,
          payload,
        );
      } else {
        res = await apiHelper.post("/vendor-web/used-website-variant", payload);

        localStorage.setItem("vendorProductId", res.data.id.toString());
      }

      toast.success("Basic information saved!");

      if (onComplete) {
        onComplete(step);
      }

      setCurrentStep(step + 1);
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
          <h1 className="text-2xl font-bold text-gray-900">Add Used Product</h1>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the details below to list your product
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden ">
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <div className="p-6 md:p-8 lg:p-10 space-y-10">
              {/* Product Classification */}
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
                        value={
                          categories.find((c) => c.id === field.value) || null
                        }
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
                        required
                      />
                    )}
                  />

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
                          setValue("modelYearId", "");
                          setValue("variantId", "");
                          setValue("variantCode", "");
                        }}
                        displayField="brandName"
                        placeholder="Select Brand"
                        label="Select Brand"
                        error={errors?.brandId?.message}
                        required
                      />
                    )}
                  />

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
                          setValue("modelYearId", "");
                          setValue("variantId", "");
                          setValue("variantCode", "");
                        }}
                        displayField="modelName"
                        placeholder="Select Model"
                        label="Select Model"
                        error={errors?.modelId?.message}
                        required
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
                          filteredModelYears.find(
                            (y) => y.id === field.value,
                          ) || null
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
                        required
                      />
                    )}
                  />
                </div>
              </div>

              {/* Tractor Details */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Tractor Details
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                        onChange={(option) => {
                          field.onChange(option.id);
                          setValue("variantCode", option.variantCode || "");
                          setValue("variant", option.variantName || "");
                        }}
                        displayField="variantName"
                        placeholder="Select Variant"
                        label="Variant"
                        error={errors?.variantId?.message}
                      />
                    )}
                  />
  <Input
    {...register("productName")}
    label="Website Display Product Name"
    placeholder="Mahindra Arjun Novo 605 DI 57 HP"
    required
    error={errors?.productName?.message}
  />
                  <Input
                    {...register("hp")}
                    label="HP"
                    placeholder="Enter horsepower"
                    type="number"
                    error={errors?.hp?.message}
                  />

                  <Input
                    {...register("manufacturingYear")}
                    label="Manufacturing Year *"
                    placeholder="Enter manufacturing year"
                    type="number"
                    error={errors?.manufacturingYear?.message}
                    required
                  />

                  <Input
                    {...register("purchaseYear")}
                    label="Purchase Year"
                    placeholder="Enter purchase year"
                    type="number"
                    error={errors?.purchaseYear?.message}
                  />

                  <Input
                    {...register("rcRegistrationNumber")}
                    label="RC Registration Number *"
                    placeholder="Enter RC registration number"
                    error={errors?.rcRegistrationNumber?.message}
                    required
                  />

                  <Input
                    {...register("engineNumber")}
                    label="Engine Number *"
                    placeholder="Enter engine number"
                    error={errors?.engineNumber?.message}
                    required
                  />

                  <Input
                    {...register("chassisNumber")}
                    label="Chassis Number *"
                    placeholder="Enter chassis number"
                    error={errors?.chassisNumber?.message}
                    required
                  />

                  <Controller
                    name="fuelType"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={fuelTypeOptions}
                        value={
                          fuelTypeOptions.find(
                            (o) => o.value === field.value,
                          ) || null
                        }
                        onChange={(option) => field.onChange(option?.value)}
                        displayField="label"
                        placeholder="Select Fuel Type"
                        label="Fuel Type"
                        error={errors?.fuelType?.message}
                      />
                    )}
                  />

                  <Controller
                    name="driveType"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={driveTypeOptions}
                        value={
                          driveTypeOptions.find(
                            (o) => o.value === field.value,
                          ) || null
                        }
                        onChange={(option) => field.onChange(option?.value)}
                        displayField="label"
                        placeholder="Select Drive Type"
                        label="Drive Type (2WD / 4WD)"
                        error={errors?.driveType?.message}
                      />
                    )}
                  />
                  <Textarea
  {...register("description")}
  label="Description"
  placeholder="Enter product description"
  rows={5}
  error={errors?.description?.message}
  className=" w-full"
/>
                </div>
              </div>

              {/* Available Colors - Checkboxes */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Available Colors
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Select available colors for this tractor
                </p>

                <div className="flex flex-wrap gap-4">
                  {colorOptions.map((color) => (
                    <label
                      key={color.value}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        {...register(`colors.${color.value}`)}
                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-2 focus:ring-green-600"
                      />
                      <span
                        className="h-6 w-6 rounded-full border border-gray-200"
                        style={{ backgroundColor: color.value }}
                      />
                      <span className="text-sm text-gray-700">
                        {color.label}
                      </span>
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
              {/* Location */}
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
                          onChange={(selected) => {
                            const values = selected?.map((s) => s.value) || [];
                            field.onChange(values);
                            setSelectedStates(values);
                            setState(values[0] || "");
                          }}
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
                      Available Districts{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      name="availableDistricts"
                      control={control}
                      render={({ field }) => (
                        <Select
                          options={districtOptions}
                          isMulti
                          styles={selectStyles}
                          placeholder="Search District"
                          isDisabled={!selectedStates.length}
                          value={districtOptions.filter((o) =>
                            field.value?.includes(o.value),
                          )}
                          onChange={(selected) => {
                            const values = selected?.map((s) => s.value) || [];

                            field.onChange(values);

                            // First selected district
                            setDistrict(values[0] || "");
                          }}
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
                </div>
              </div>

              {/* Ownership */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Ownership
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {/* <Controller
                    name="ownership"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={ownershipOptions}
                        value={
                          ownershipOptions.find(
                            (o) => o.value === field.value,
                          ) || null
                        }
                        onChange={(option) => field.onChange(option?.value)}
                        displayField="label"
                        placeholder="Select Ownership"
                        label="Ownership"
                        error={errors?.ownership?.message}
                      />
                    )}
                  /> */}

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
                        placeholder="Select Owner Type"
                        label="Owner Type"
                        error={errors?.ownerType?.message}
                      />
                    )}
                  />
                  {/* 
                  <Input
                    {...register("firstOwner")}
                    label="First Owner"
                    placeholder="Enter first owner name"
                    error={errors?.firstOwner?.message}
                  />

                  <Input
                    {...register("secondOwner")}
                    label="Second Owner"
                    placeholder="Enter second owner name"
                    error={errors?.secondOwner?.message}
                  />

                  <Input
                    {...register("thirdOwner")}
                    label="Third Owner"
                    placeholder="Enter third owner name"
                    error={errors?.thirdOwner?.message}
                  /> */}

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
                      />
                    )}
                  />

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
                            field.onChange(selected?.value || false)
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
                </div>
              </div>

              {/* Usage */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Usage
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Input
                    {...register("hoursMeterReading")}
                    label="Hours Meter Reading *"
                    placeholder="Enter hours meter reading"
                    type="number"
                    error={errors?.hoursMeterReading?.message}
                    required
                  />

                  <Input
                    {...register("approxWorkingHours")}
                    label="Approx Working Hours"
                    placeholder="Enter approximate working hours"
                    type="number"
                    error={errors?.approxWorkingHours?.message}
                  />

                  <Input
                    {...register("acresWorked")}
                    label="Acres Worked"
                    placeholder="Enter acres worked"
                    type="number"
                    error={errors?.acresWorked?.message}
                  />

                  <Controller
                    name="purpose"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={purposeOptions}
                        value={
                          purposeOptions.find((o) => o.value === field.value) ||
                          null
                        }
                        onChange={(option) => field.onChange(option?.value)}
                        displayField="label"
                        placeholder="Select Purpose"
                        label="Purpose"
                        error={errors?.purpose?.message}
                      />
                    )}
                  />
                </div>
              </div>

              {/* Additional Fields */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                        stockStatusOptions.find(
                          (o) => o.value === field.value,
                        ) || null
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

            {/* Action Buttons */}
            <div className="px-6 md:px-8 lg:px-10 py-6 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between gap-3">
              <Button
                type="button"
                variant="outlined"
                className="min-w-28 order-2 sm:order-1 cursor-pointer"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <div className="flex flex-col sm:flex-row gap-3 order-1 sm:order-2">
                {/* <Button
                  type="button"
                  variant="outlined"
                  className="min-w-[7rem] cursor-pointer"
                  onClick={() => {
                    if (step > 1) {
                      if (setCurrentStep) {
                        setCurrentStep(step - 1);
                      }
                    }
                  }}
                >
                  Previous
                </Button> */}
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
