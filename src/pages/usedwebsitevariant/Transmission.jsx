import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { TransmissionSchema } from "./schema";
import apiHelper from "../../utils/apiHelper";

// Service & Maintenance Options with Yes/No
const serviceOptions = [
  { label: "Engine Overhauled", value: "engine_overhauled" },
  { label: "Gearbox Repaired", value: "gearbox_repaired" },
  { label: "Clutch Changed", value: "clutch_changed" },
  { label: "Tyres Changed", value: "tyres_changed" },
  { label: "Battery Changed", value: "battery_changed" },
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

// Flood Damage Options
const floodDamageOptions = [
  { label: "Select Flood Damage", value: "" },
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

// Insurance Options
const insuranceOptions = [
  { label: "Select Insurance Status", value: "" },
  { label: "Active", value: "active" },
  { label: "Expired", value: "expired" },
];

// Finance Options
const financeOptions = [
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
const CustomSelect = ({
  data,
  value,
  onChange,
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
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3 text-sm border rounded-xl bg-white outline-none transition-all focus:ring-2 focus:ring-green-600 focus:border-green-600 ${
          error ? "border-red-300 bg-red-50" : "border-gray-200"
        }`}
      >
        {data?.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
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
    setValue("lastServiceDate", productData.lastServiceDate || "");
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
    setValue("insuranceExpiryDate", productData.insuranceExpiryDate || "");

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
        `/vendor-web/website-variant/${productId}/save-step`,
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
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to save transmission details.",
      );
    }
  };

  const handlePrevious = () => {
    if (setCurrentStep) {
      setCurrentStep(step - 1);
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
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <div className="p-6 md:p-8 lg:p-10 space-y-10">
              {/* Service & Maintenance */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Service
                </h3>

                {/* Last Service Date in Grid */}

                {/* Services Done in Grid */}
                <p className="text-sm font-medium text-gray-700 mb-4">
                  Services Done:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Last Service Date */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Last Service Date
                    </label>
                    <input
                      type="date"
                      {...register("lastServiceDate")}
                      className="w-full px-4 py-3 text-sm border rounded-xl bg-white outline-none transition-all focus:ring-2 focus:ring-green-600 focus:border-green-600 border-gray-200"
                    />
                    {errors?.lastServiceDate && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.lastServiceDate.message}
                      </p>
                    )}
                  </div>

                  {/* Service Fields */}
                  {serviceOptions.map((option) => (
                    <Controller
                      key={option.value}
                      name={`service.${option.value}`}
                      control={control}
                      render={({ field }) => (
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            {option.label}
                          </label>

                          <CustomSelect
                            data={yesNoOptions}
                            value={field.value}
                            onChange={(val) => field.onChange(val)}
                            placeholder="Select"
                            error={errors?.service?.[option.value]?.message}
                          />
                        </div>
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Accident */}
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
                    render={({ field }) => (
                      <CustomSelect
                        data={accidentOptions}
                        value={field.value}
                        onChange={field.onChange}
                        label="Accident Status"
                        placeholder="Select Accident Status"
                        error={errors?.accident?.message}
                        required
                      />
                    )}
                  />

                  {/* Flood Damage */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Flood Damage
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
                  </div>

                  {/* Insurance */}
                  <Controller
                    name="insurance"
                    control={control}
                    render={({ field }) => (
                      <CustomSelect
                        data={insuranceOptions}
                        value={field.value}
                        onChange={field.onChange}
                        label="Insurance"
                        placeholder="Select Insurance"
                      />
                    )}
                  />

                  {/* Expiry Date */}
                  {watch("insurance") === "active" && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Insurance Expiry Date
                      </label>

                      <input
                        type="date"
                        {...register("insuranceExpiryDate")}
                        className="w-full px-4 py-3 border rounded-xl border-gray-200"
                      />
                    </div>
                  )}

                  {/* Loan Remaining */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Loan Remaining?
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
                  </div>

                  {/* Finance Details */}
                  {watch("finance") === "yes" && (
                    <>
                      <Input
                        {...register("financeCompany")}
                        label="Finance Company"
                        placeholder="Enter finance company"
                      />

                      <Input
                        {...register("outstandingAmount")}
                        label="Outstanding Amount"
                        type="number"
                        placeholder="Enter outstanding amount"
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
                className="min-w-[7rem] order-2 sm:order-1"
                onClick={handlePrevious}
              >
                Previous
              </Button>
              <div className="flex flex-col sm:flex-row gap-3 order-1 sm:order-2">
                <Button
                  type="button"
                  variant="outlined"
                  className="min-w-[7rem]"
                  onClick={() => navigate(-1)}
                >
                  Cancel
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
