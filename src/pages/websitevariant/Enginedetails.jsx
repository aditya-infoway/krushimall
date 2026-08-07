import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Droplets, Filter, Cog, CheckCircle, Thermometer } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { EnginedetailsSchema } from "./schema";
import apiHelper from "../../utils/apiHelper";

const engineTypeOptions = [
  { label: "Diesel", value: "diesel" },
  { label: "Petrol", value: "petrol" },
  { label: "CNG", value: "cng" },
  { label: "Electric", value: "electric" },
  { label: "Hybrid", value: "hybrid" },
];
const fuelTypeOptions = [
  { label: "Diesel", value: "diesel" },
  { label: "Petrol", value: "petrol" },
  { label: "CNG", value: "cng" },
  { label: "Electric", value: "electric" },
];
const cylinderOptions = [
  { label: "2 Cylinders", value: "2" },
  { label: "3 Cylinders", value: "3" },
  { label: "4 Cylinders", value: "4" },
  { label: "6 Cylinders", value: "6" },
];
const aspiratedTypeOptions = [
  { label: "Naturally Aspirated", value: "naturally_aspirated" },
  { label: "Turbocharged", value: "turbocharged" },
  { label: "Turbocharged Intercooled", value: "turbocharged_intercooled" },
];
const emissionNormsOptions = [
  { label: "BS-III", value: "bs3" },
  { label: "BS-IV", value: "bs4" },
  { label: "BS-V", value: "bs5" },
  { label: "BS-VI", value: "bs6" },
  { label: "Euro 5", value: "euro5" },
  { label: "Euro 6", value: "euro6" },
];
const coolingSystemOptions = [
  {
    label: "Water Cooled",
    value: "water_cooled",
    description: "More efficient cooling • Better performance",
    icon: Droplets,
  },
  {
    label: "Oil Cooled",
    value: "oil_cooled",
    description: "Low maintenance • Suitable for heavy duty",
    icon: Thermometer,
  },
];
const airFilterTypeOptions = [
  {
    label: "Dry Type",
    value: "dry_type",
    description: "Low maintenance • Easy to replace",
    icon: Filter,
  },
  {
    label: "Oil Bath Type",
    value: "oil_bath_type",
    description: "Better dust trapping • Longer life",
    icon: Droplets,
  },
  {
    label: "Dual Element Type",
    value: "dual_element_type",
    description: "High efficiency • Better engine protection",
    icon: Cog,
  },
];
const engineConditionOptions = [
  { label: "New", value: "new", description: "Brand new engine" },
  { label: "Excellent", value: "excellent", description: "Well maintained" },
  { label: "Good", value: "good", description: "Normal condition" },
  { label: "Average", value: "average", description: "Average condition" },
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
  return (
    <div>
      {label && (
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <select
        value={value?.value || ""}
        onChange={(e) => {
          const selected = data.find((item) => item.value === e.target.value);
          onChange(selected);
        }}
        className={`w-full px-4 py-3 text-sm border rounded-xl bg-white outline-none transition-all focus:ring-2 focus:ring-green-600 focus:border-green-600 ${
          error ? "border-red-300 bg-red-50" : "border-gray-200"
        }`}
      >
        <option value="">{placeholder}</option>
        {data?.map((item) => (
          <option key={item.value} value={item.value}>
            {item[displayField] || item.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default function Enginedetails({
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
} = useForm({
    resolver: yupResolver(EnginedetailsSchema),
    defaultValues: {},
  });

  useEffect(() => {
  if (!isEdit || !productData) return;

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
}, [isEdit, productData, setValue]);

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
        engineType: data.engineType,
        fuelType: data.fuelType,
        horsePower: data.horsePower ? Number(data.horsePower) : null,
        numberOfCylinders: data.numberOfCylinders,
        cubicCapacity: data.cubicCapacity ? Number(data.cubicCapacity) : null,
        ratedRpm: data.ratedRpm ? Number(data.ratedRpm) : null,
        aspiratedType: data.aspiratedType,
        emissionNorms: data.emissionNorms,
        coolingSystem: data.coolingSystem,
        airFilterType: data.airFilterType,
        maximumTorque: data.maximumTorque ? Number(data.maximumTorque) : null,
        torqueRpm: data.torqueRpm ? Number(data.torqueRpm) : null,
        torqueBackup: data.torqueBackup ? Number(data.torqueBackup) : null,
        engineCondition: data.engineCondition,
        currentStep: 1,
      };

      await apiHelper.put(
        `/vendor-web/website-variant/${productId}/save-step`,
        payload,
      );

      toast.success("Engine details saved!");

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
              {/* Engine Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Engine Specifications
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Controller
                    name="engineType"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={engineTypeOptions}
                        value={
                          engineTypeOptions.find(
                            (o) => o.value === field.value,
                          ) || null
                        }
                        onChange={(o) => field.onChange(o?.value)}
                        displayField="label"
                        placeholder="Select Engine Type"
                        label="Engine Type"
                        error={errors?.engineType?.message}
                      />
                    )}
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
                        onChange={(o) => field.onChange(o?.value)}
                        displayField="label"
                        placeholder="Select Fuel Type"
                        label="Fuel Type"
                        error={errors?.fuelType?.message}
                      />
                    )}
                  />
                  <Input
                    {...register("horsePower")}
                    type="number"
                    label="Horse Power (HP)"
                    placeholder="Enter HP"
                    error={errors?.horsePower?.message}
                  />
                  <Controller
                    name="numberOfCylinders"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={cylinderOptions}
                        value={
                          cylinderOptions.find(
                            (o) => o.value === field.value,
                          ) || null
                        }
                        onChange={(o) => field.onChange(o?.value)}
                        displayField="label"
                        placeholder="Select Cylinders"
                        label="Number of Cylinders"
                        error={errors?.numberOfCylinders?.message}
                      />
                    )}
                  />
                  <Input
                    {...register("cubicCapacity")}
                    type="number"
                    label="Cubic Capacity (CC)"
                    placeholder="Enter CC"
                    error={errors?.cubicCapacity?.message}
                  />
                  <Input
                    {...register("ratedRpm")}
                    type="number"
                    label="Rated RPM"
                    placeholder="Enter Rated RPM"
                    error={errors?.ratedRpm?.message}
                  />
                  <Controller
                    name="aspiratedType"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={aspiratedTypeOptions}
                        value={
                          aspiratedTypeOptions.find(
                            (o) => o.value === field.value,
                          ) || null
                        }
                        onChange={(o) => field.onChange(o?.value)}
                        displayField="label"
                        placeholder="Select Aspirated Type"
                        label="Aspirated Type"
                        error={errors?.aspiratedType?.message}
                      />
                    )}
                  />
                  <Controller
                    name="emissionNorms"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={emissionNormsOptions}
                        value={
                          emissionNormsOptions.find(
                            (o) => o.value === field.value,
                          ) || null
                        }
                        onChange={(o) => field.onChange(o?.value)}
                        displayField="label"
                        placeholder="Select Emission Norms"
                        label="Emission Norms"
                        error={errors?.emissionNorms?.message}
                      />
                    )}
                  />
                </div>
              </div>

              {/* Cooling System */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Cooling System
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {coolingSystemOptions.map((option) => {
                    const selected = watch("coolingSystem") === option.value;
                    return (
                      <label
                        key={option.value}
                        className={`relative flex cursor-pointer items-center gap-4 rounded-xl border p-5 transition-all ${
                          selected
                            ? "border-green-600 bg-green-50 shadow-sm"
                            : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="radio"
                          value={option.value}
                          {...register("coolingSystem")}
                          className="absolute right-4 top-4 h-4 w-4 text-green-600 focus:ring-2 focus:ring-green-600"
                        />
                        <option.icon
                          className={`h-10 w-10 flex-shrink-0 ${selected ? "text-green-600" : "text-gray-400"}`}
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {option.label}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {option.description}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
                {errors?.coolingSystem && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.coolingSystem.message}
                  </p>
                )}
              </div>

              {/* Air Filter Type */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Air Filter Type
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {airFilterTypeOptions.map((option) => {
                    const selected = watch("airFilterType") === option.value;
                    return (
                      <label
                        key={option.value}
                        className={`relative flex cursor-pointer items-center gap-4 rounded-xl border p-5 transition-all ${
                          selected
                            ? "border-green-600 bg-green-50 shadow-sm"
                            : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="radio"
                          value={option.value}
                          {...register("airFilterType")}
                          className="absolute right-4 top-4 h-4 w-4 text-green-600 focus:ring-2 focus:ring-green-600"
                        />

                        <div>
                          <h4 className="font-medium text-gray-900">
                            {option.label}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {option.description}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
                {errors?.airFilterType && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.airFilterType.message}
                  </p>
                )}
              </div>

              {/* Torque Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Torque Details
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <Input
                    {...register("maximumTorque")}
                    type="number"
                    label="Maximum Torque (NM)"
                    placeholder="Enter Maximum Torque"
                    error={errors?.maximumTorque?.message}
                  />
                  <Input
                    {...register("torqueRpm")}
                    type="number"
                    label="Torque RPM"
                    placeholder="Enter Torque RPM"
                    error={errors?.torqueRpm?.message}
                  />
                  <Input
                    {...register("torqueBackup")}
                    type="number"
                    step="0.01"
                    label="Torque Backup (%)"
                    placeholder="Enter Torque Backup %"
                    error={errors?.torqueBackup?.message}
                  />
                </div>
              </div>

              {/* Engine Condition */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Engine Condition
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {engineConditionOptions.map((option) => {
                    const selected = watch("engineCondition") === option.value;
                    return (
                      <label
                        key={option.value}
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all ${
                          selected
                            ? "border-green-600 bg-green-50 shadow-sm"
                            : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="radio"
                          value={option.value}
                          {...register("engineCondition")}
                          className="mt-1 h-4 w-4 text-green-600 focus:ring-2 focus:ring-green-600 flex-shrink-0"
                        />
                        <div>
                          <span className="font-medium text-gray-900 block">
                            {option.label}
                          </span>
                          <p className="text-sm text-gray-500">
                            {option.description}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
                {errors?.engineCondition && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.engineCondition.message}
                  </p>
                )}
              </div>
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
               <Button type="submit" className="min-w-36cursor-pointer">
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
