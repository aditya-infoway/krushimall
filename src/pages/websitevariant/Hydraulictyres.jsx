import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Tractor,
  Settings,
  GitBranch,
  CheckCircle,
  Joystick,
} from "lucide-react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";

import { HydraulicTyresSchema } from "./schema";
import apiHelper from "../../utils/apiHelper";

const hydraulicTypes = [
  {
    label: "ADDC",
    value: "addc",
    description: "Automatic Depth & Draft Control",
    icon: GitBranch,
  },
  {
    label: "Position Control",
    value: "positionControl",
    description: "Maintain implement position",
    icon: Tractor,
  },
  {
    label: "Draft Control",
    value: "draftControl",
    description: "Automatic draft sensing control",
    icon: Settings,
  },
];
const controlTypeOptions = [
  {
    label: "Automatic Control",
    value: "automatic",
    description: "Automatic response and easy operation",
    icon: Settings,
  },
  {
    label: "Manual Control",
    value: "manual",
    description: "Manual operation and full control",
    icon: Joystick,
  },
];
const remoteValveOptions = [
  {
    label: "Single Acting",
    value: "single_acting",
    description: "For single direction operation",
  },
  {
    label: "Double Acting",
    value: "double_acting",
    description: "For both direction operation",
  },
];
const remoteValveCountOptions = [
  { label: "1 Remote Valve", value: "1" },
  { label: "2 Remote Valves", value: "2" },
  { label: "3 Remote Valves", value: "3" },
  { label: "4 Remote Valves", value: "4" },
  { label: "5+ Remote Valves", value: "5_plus" },
];
const linkageOptions = [
  { label: "Category I", value: "cat1" },
  { label: "Category II", value: "cat2" },
  { label: "Category III", value: "cat3" },
];
const linkageCategoryOptions = [
  { label: "Category 1", value: "category1" },
  { label: "Category 2", value: "category2" },
];
const topLinkOptions = [
  { label: "Adjustable", value: "adjustable" },
  { label: "Fixed", value: "fixed" },
];
const draftSensitivityOptions = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

const featureFields = [
  ["features.externalHydraulicCylinder", "External Hydraulic Cylinder"],
  ["features.selfLevelling", "Self Levelling"],
  ["features.quickHitch", "Quick Hitch"],
  ["features.downPositionControl", "Down Position Control"],
  ["features.loadSensing", "Load Sensing"],
  ["features.flowControl", "Flow Control"],
  ["features.returnToDepth", "Return to Depth"],
  ["features.transportLock", "Transport Lock"],
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

export default function HydraulicTyres({
  setCurrentStep,
  step,
  onComplete,
  productData,
  isEdit,
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(HydraulicTyresSchema),
    defaultValues: {},
  });

  useEffect(() => {
    if (!isEdit || !productData) return;

    reset({
      liftingCapacity: productData.liftingCapacity ?? "",
      liftingCapacityAt610mm: productData.liftingCapacityAt610mm ?? "",
      hydraulicType: productData.hydraulicType ?? "",
      controlType: productData.controlType ?? "",
      remoteValveType: productData.remoteValveType ?? "",
      numberOfRemoteValves: productData.numberOfRemoteValves ?? "",
      threePointLinkage: productData.threePointLinkage ?? "",
      linkageCategory: productData.linkageCategory ?? "",
      topLink: productData.topLink ?? "",
      draftSensitivity: productData.draftSensitivity ?? "",

      features: {
        externalHydraulicCylinder:
          productData.externalHydraulicCylinder ?? false,

        selfLevelling: productData.selfLevelling ?? false,

        quickHitch: productData.quickHitch ?? false,

        downPositionControl: productData.downPositionControl ?? false,

        loadSensing: productData.loadSensing ?? false,

        flowControl: productData.flowControl ?? false,

        returnToDepth: productData.returnToDepth ?? false,

        transportLock: productData.transportLock ?? false,
      },
    });
  }, [productData, isEdit, reset]);

 const onSubmit = async (data) => {
    try {
      setLoading(true);
      const productId = isEdit
        ? productData?.id
        : localStorage.getItem("vendorProductId");

      if (!productId) {
        toast("Please save basic information first.");
        return;
      }

      const payload = {
        liftingCapacity: data.liftingCapacity
          ? Number(data.liftingCapacity)
          : null,
        liftingCapacityAt610mm: data.liftingCapacityAt610mm
          ? Number(data.liftingCapacityAt610mm)
          : null,
        hydraulicType: data.hydraulicType,
        controlType: data.controlType,
        remoteValveType: data.remoteValveType,
        numberOfRemoteValves: data.numberOfRemoteValves,
        threePointLinkage: data.threePointLinkage,
        linkageCategory: data.linkageCategory,
        topLink: data.topLink,
        draftSensitivity: data.draftSensitivity,
        externalHydraulicCylinder:
          data.features?.externalHydraulicCylinder ?? false,
        selfLevelling: data.features?.selfLevelling ?? false,
        quickHitch: data.features?.quickHitch ?? false,
        downPositionControl: data.features?.downPositionControl ?? false,
        loadSensing: data.features?.loadSensing ?? false,
        flowControl: data.features?.flowControl ?? false,
        returnToDepth: data.features?.returnToDepth ?? false,
        transportLock: data.features?.transportLock ?? false,
        currentStep: 3,
      };

      await apiHelper.put(
        `/vendor-web/website-variant/${productId}/save-step`,
        payload,
      );

      toast.success("Hydraulic details saved!");

      if (onComplete) {
        onComplete(step);
      }

      if (setCurrentStep) {
        setCurrentStep(step + 1);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to save hydraulic details.",
      );
    } finally {
      setLoading(false);
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
            Hydraulic & Tyre Details
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Provide hydraulic system specifications and tyre details
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <div className="p-6 md:p-8 lg:p-10 space-y-10">
              {/* Lifting Capacity */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Lifting Capacity
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Maximum Lifting Capacity (kg){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <Input
                        {...register("liftingCapacity")}
                        type="number"
                        placeholder="Enter lifting capacity"
                        error={errors?.liftingCapacity?.message}
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-500 font-medium">
                        kg
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      At 610 mm (kg)
                    </label>
                    <div className="flex items-center gap-3">
                      <Input
                        {...register("liftingCapacityAt610mm")}
                        type="number"
                        placeholder="Enter capacity at 610 mm"
                        error={errors?.liftingCapacityAt610mm?.message}
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-500 font-medium">
                        kg
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hydraulic Type */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Hydraulic Type
                </h3>
                <Controller
                  name="hydraulicType"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      {hydraulicTypes.map((item) => {
                        const Icon = item.icon;
                        const selected = field.value === item.value;
                        return (
                          <div
                            key={item.value}
                            onClick={() => field.onChange(item.value)}
                            className={`relative cursor-pointer rounded-xl border p-5 transition-all ${
                              selected
                                ? "border-green-600 bg-green-50 shadow-sm"
                                : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
                            }`}
                          >
                            {selected && (
                              <CheckCircle className="absolute right-3 top-3 h-5 w-5 text-green-600" />
                            )}
                            <div className="flex items-start gap-4">
                              <Icon className="mt-1 h-10 w-10 flex-shrink-0 text-green-600" />
                              <div>
                                <h4 className="font-semibold text-gray-900">
                                  {item.label}
                                </h4>
                                <p className="mt-1 text-sm text-gray-500">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                />
                {errors?.hydraulicType && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.hydraulicType.message}
                  </p>
                )}
              </div>

              {/* Control Type */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Control Type
                </h3>
                <Controller
                  name="controlType"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {controlTypeOptions.map((option) => {
                        const Icon = option.icon;
                        const selected = field.value === option.value;
                        return (
                          <div
                            key={option.value}
                            onClick={() => field.onChange(option.value)}
                            className={`relative cursor-pointer rounded-xl border p-5 transition-all ${
                              selected
                                ? "border-green-600 bg-green-50 shadow-sm"
                                : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
                            }`}
                          >
                            {selected && (
                              <CheckCircle className="absolute right-3 top-3 h-5 w-5 text-green-600" />
                            )}
                            <div className="flex items-center gap-4">
                              <Icon className="h-10 w-10 flex-shrink-0 text-green-600" />
                              <div>
                                <h4 className="font-semibold text-gray-900">
                                  {option.label}
                                </h4>
                                <p className="mt-1 text-sm text-gray-500">
                                  {option.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                />
                {errors?.controlType && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.controlType.message}
                  </p>
                )}
              </div>

              {/* Remote Valve */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Remote Valve (Spool)
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="rounded-xl border border-gray-200 p-5">
                    <h4 className="font-medium text-gray-900 mb-4">
                      Valve Type
                    </h4>
                    <div className="space-y-3">
                      {remoteValveOptions.map((option) => (
                        <label
                          key={option.value}
                          className="flex cursor-pointer items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <input
                            type="radio"
                            value={option.value}
                            {...register("remoteValveType")}
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
                      ))}
                    </div>
                    {errors?.remoteValveType && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.remoteValveType.message}
                      </p>
                    )}
                  </div>

                  <div className="rounded-xl border border-gray-200 p-5">
                    <h4 className="font-medium text-gray-900 mb-1">
                      Number of Remote Valves
                    </h4>
                    <p className="text-xs text-gray-500 mb-4">
                      How many remote valves are available?
                    </p>
                    <Controller
                      name="numberOfRemoteValves"
                      control={control}
                      render={({ field }) => (
                        <CustomListbox
                          data={remoteValveCountOptions}
                          value={
                            remoteValveCountOptions.find(
                              (o) => o.value === field.value,
                            ) || null
                          }
                          onChange={(o) => field.onChange(o?.value)}
                          displayField="label"
                          placeholder="Select number of remote valves"
                          error={errors?.numberOfRemoteValves?.message}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Linkage Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Linkage Details
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Controller
                    name="threePointLinkage"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        label="3 Point Linkage"
                        data={linkageOptions}
                        value={
                          linkageOptions.find((o) => o.value === field.value) ||
                          null
                        }
                        onChange={(o) => field.onChange(o?.value)}
                        displayField="label"
                        placeholder="Select linkage type"
                        error={errors?.threePointLinkage?.message}
                      />
                    )}
                  />
                  <Controller
                    name="linkageCategory"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        label="Linkage Category"
                        data={linkageCategoryOptions}
                        value={
                          linkageCategoryOptions.find(
                            (o) => o.value === field.value,
                          ) || null
                        }
                        onChange={(o) => field.onChange(o?.value)}
                        displayField="label"
                        placeholder="Select category"
                        error={errors?.linkageCategory?.message}
                      />
                    )}
                  />
                  <Controller
                    name="topLink"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        label="Top Link"
                        data={topLinkOptions}
                        value={
                          topLinkOptions.find((o) => o.value === field.value) ||
                          null
                        }
                        onChange={(o) => field.onChange(o?.value)}
                        displayField="label"
                        placeholder="Select top link"
                        error={errors?.topLink?.message}
                      />
                    )}
                  />
                  <Controller
                    name="draftSensitivity"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        label="Draft Sensitivity"
                        data={draftSensitivityOptions}
                        value={
                          draftSensitivityOptions.find(
                            (o) => o.value === field.value,
                          ) || null
                        }
                        onChange={(o) => field.onChange(o?.value)}
                        displayField="label"
                        placeholder="Select sensitivity"
                        error={errors?.draftSensitivity?.message}
                      />
                    )}
                  />
                </div>
              </div>

              {/* Additional Hydraulic Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Additional Hydraulic Features
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {featureFields.map(([name, label]) => (
                    <label
                      key={name}
                      className="flex cursor-pointer items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-gray-50 transition-all"
                    >
                      <input
                        type="checkbox"
                        {...register(name)}
                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-2 focus:ring-green-600"
                      />
                      <span className="text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
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
                <Button
                  type="submit"
                  className="min-w-28 cursor-pointer"
                
                >
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
