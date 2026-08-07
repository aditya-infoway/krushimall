import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { TransmissionSchema } from "./schema";
import apiHelper from "../../utils/apiHelper";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

// Service & Maintenance Options with Yes/No
const serviceOptions = [
  { label: "Engine Overhauled", value: "engineOverhauled" },
  { label: "Gearbox Repaired", value: "gearboxRepaired" },
  { label: "Clutch Changed", value: "clutchChanged" },
  { label: "Tyres Changed", value: "tyresChanged" },
  { label: "Battery Changed", value: "batteryChanged" },
];

// Yes/No Options
const yesNoOptions = [
  { label: "Select", value: "" },
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

// Accident Options
const accidentOptions = [
  { label: "Select Accident Status", value: "" },
  { label: "Never Accident", value: "never_accident" },
  { label: "Minor", value: "minor" },
  { label: "Major", value: "major" },
];

// Insurance Options
const insuranceOptions = [
  { label: "Select Insurance Status", value: "" },
  { label: "Active", value: "active" },
  { label: "Expired", value: "expired" },
];

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

// Custom Select Component
const CustomListbox = ({
  data,
  value,
  onChange,
  displayField,
  placeholder,
  label,
  error,
  required,
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
              {value && value[displayField]
                ? value[displayField]
                : value && typeof value === "object" && value.label
                  ? value.label
                  : placeholder}
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

// ✅ FIX: DatePicker ab top-level pe hai — Transmission ke andar nahi
// Isse ye har render pe re-create/remount nahi hoga
const DatePicker = ({
  value,
  onChange,
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
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
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

export default function Transmission({
  setCurrentStep,
  step,
  completedSteps,
  onComplete,
  productData,
  isEdit,
}) {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(TransmissionSchema),
    defaultValues: {
      service: {
        engineOverhauled: "",
        gearboxRepaired: "",
        clutchChanged: "",
        tyresChanged: "",
        batteryChanged: "",
      },
    },
  });

  useEffect(() => {
    if (!isEdit || !productData) return;

    // Service & Maintenance
  setValue(
  "lastServiceDate",
  productData.lastServiceDate
    ? new Date(productData.lastServiceDate)
    : null
);
    setValue("service.engineOverhauled", productData.engineOverhauled || "");
    setValue("service.gearboxRepaired", productData.gearboxRepaired || "");
    setValue("service.clutchChanged", productData.clutchChanged || "");
    setValue("service.tyresChanged", productData.tyresChanged || "");
    setValue("service.batteryChanged", productData.batteryChanged || "");

    // Accident
    setValue("accident", productData.accident || "");

    // Flood Damage
    setValue("floodDamage", productData.floodDamage || "");

    // Insurance
    setValue("insurance", productData.insurance || "");
setValue(
  "insuranceExpiryDate",
  productData.insuranceExpiryDate
    ? new Date(productData.insuranceExpiryDate)
    : null
);

    // Finance
    setValue("finance", productData.finance || "");
    setValue("financeCompany", productData.financeCompany || "");
    setValue("outstandingAmount", productData.outstandingAmount || "");
  }, [productData, isEdit, setValue]);

  const onSubmit = async (data) => {
    try {
      const productId = isEdit
        ? productData?.id
        : localStorage.getItem("vendorProductId");

      if (!productId) {
        toast.error("Please save basic information first.");
        return;
      }

      const payload = {
        // Service & Maintenance
        lastServiceDate: data.lastServiceDate,
        engineOverhauled: data.service?.engineOverhauled || "",
        gearboxRepaired: data.service?.gearboxRepaired || "",
        clutchChanged: data.service?.clutchChanged || "",
        tyresChanged: data.service?.tyresChanged || "",
        batteryChanged: data.service?.batteryChanged || "",

        // Accident
        accident: data.accident,

        // Flood Damage
        floodDamage: data.floodDamage,

        // Insurance
        insurance: data.insurance,
        insuranceExpiryDate: data.insuranceExpiryDate,

        // Finance
        finance: data.finance,
        financeCompany: data.financeCompany,
        outstandingAmount: data.outstandingAmount
          ? Number(data.outstandingAmount)
          : null,

        currentStep: 2,
      };

      await apiHelper.put(
        `/vendor-web/used-website-variant/${productId}/save-step`,
        payload,
      );

      toast.success("Transmission details saved!");

      if (onComplete) {
        onComplete(step);
      }

      if (setCurrentStep) {
        setCurrentStep(step + 1);
      }
    } catch (error) {
      console.error("❌ Save Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to save transmission details.",
      );
    }
  };

  const onInvalid = (formErrors) => {
    console.log("❌ VALIDATION FAILED:", formErrors);
    toast.error("Please fill all required fields correctly.");
  };

  const handlePrevious = () => {
    if (setCurrentStep) {
      setCurrentStep(step - 2);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12 lg:py-16">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Transmission & Service Details
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Provide transmission, service, and maintenance details for your
            product
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit, onInvalid)} autoComplete="off">
            <div className="p-6 md:p-8 lg:p-10 space-y-10">
              {/* Service & Maintenance */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Service
                </h3>

                <p className="text-sm font-medium text-gray-700 mb-4">
                  Services Done:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Last Service Date */}
                  <Controller
                    name="lastServiceDate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        label="Last Service Date"
                        value={field.value}
                        onChange={field.onChange}
                        error={errors?.lastServiceDate?.message}
                        placeholder="Select last service date"
                        required
                      />
                    )}
                  />
                  {/* Service Fields */}
                  {serviceOptions.map((option) => (
                    <Controller
                      key={option.value}
                      name={`service.${option.value}`}
                      control={control}
                      render={({ field }) => {
                        const selectedOption = yesNoOptions.find(
                          (item) => item.value === field.value,
                        );

                        return (
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                              {option.label}
                            </label>
                            <CustomListbox
                              data={yesNoOptions}
                              value={selectedOption || yesNoOptions[0]}
                              onChange={(val) =>
                                field.onChange(val?.value || "")
                              }
                              placeholder="Select"
                              error={errors?.service?.[option.value]?.message}
                              displayField="label"
                            />
                          </div>
                        );
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Accident, Insurance & Finance */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Accident, Insurance & Finance
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Accident */}
                  <Controller
                    name="accident"
                    control={control}
                    render={({ field }) => {
                      const selectedOption = accidentOptions.find(
                        (item) => item.value === field.value,
                      );

                      return (
                        <CustomListbox
                          data={accidentOptions}
                          value={selectedOption || accidentOptions[0]}
                          onChange={(val) => field.onChange(val?.value || "")}
                          label="Accident Status"
                          placeholder="Select Accident Status"
                          error={errors?.accident?.message}
                          required
                          displayField="label"
                        />
                      );
                    }}
                  />

                  {/* Flood Damage */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Flood Damage <span className="text-red-500">*</span>
                    </label>

                    <div className="flex gap-6">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          value="yes"
                          {...register("floodDamage")}
                        />
                        Yes
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          value="no"
                          {...register("floodDamage")}
                        />
                        No
                      </label>
                    </div>
                    {errors?.floodDamage && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.floodDamage.message}
                      </p>
                    )}
                  </div>

                  {/* Insurance */}
                  <Controller
                    name="insurance"
                    control={control}
                    render={({ field }) => {
                      const selectedOption = insuranceOptions.find(
                        (item) => item.value === field.value,
                      );

                      return (
                        <CustomListbox
                          data={insuranceOptions}
                          value={selectedOption || insuranceOptions[0]}
                          onChange={(val) => field.onChange(val?.value || "")}
                          label="Insurance"
                          placeholder="Select Insurance"
                          error={errors?.insurance?.message}
                          displayField="label"
                        />
                      );
                    }}
                  />

                  {/* Expiry Date */}
                  {watch("insurance") === "active" && (
                    <Controller
                      name="insuranceExpiryDate"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          label="Insurance Expiry Date"
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select insurance expiry date"
                          error={errors?.insuranceExpiryDate?.message}
                        />
                      )}
                    />
                  )}

                  {/* Loan Remaining */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Loan Remaining? <span className="text-red-500">*</span>
                    </label>

                    <div className="flex gap-6">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          value="yes"
                          {...register("finance")}
                        />
                        Yes
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          value="no"
                          {...register("finance")}
                        />
                        No
                      </label>
                    </div>
                    {errors?.finance && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.finance.message}
                      </p>
                    )}
                  </div>

                  {/* Finance Details */}
                  {watch("finance") === "yes" && (
                    <>
                      <Input
                        {...register("financeCompany")}
                        label="Finance Company"
                        placeholder="Enter finance company"
                        error={errors?.financeCompany?.message}
                      />

                      <Input
                        {...register("outstandingAmount")}
                        label="Outstanding Amount"
                        type="number"
                        placeholder="Enter outstanding amount"
                        error={errors?.outstandingAmount?.message}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="px-6 md:px-8 lg:px-10 py-6 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between gap-3">
              <Button
                type="button"
                variant="outlined"
                className="min-w-28 order-2 sm:order-1"
                onClick={handlePrevious}
              >
                Previous
              </Button>
              <div className="flex flex-col sm:flex-row gap-3 order-1 sm:order-2">
                <Button
                  type="button"
                  variant="outlined"
                  className="min-w-28"
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