import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";
import toast from "react-hot-toast";
import {
  Droplets,
 
  Gauge,
  Ruler,
  Weight,
  Clock,
  
  Fuel,
  Settings,
  RotateCcw,
  Layers,
  
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Combobox } from "@headlessui/react";
import { EquipmentSpecificationsSchema } from "./schema";
import apiHelper from "../../utils/apiHelper";
import { MagnifyingGlassIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useState,  useRef } from "react"
import {  Transition } from "@headlessui/react";
import { Fragment } from "react";
// Options for Equipment Type
const equipmentTypeOptions = [
  { label: "Thresher", value: "thresher" },
  { label: "Rotavator", value: "rotavator" },
  { label: "Sprayer", value: "sprayer" },
  { label: "Harvester", value: "harvester" },
  { label: "Plough", value: "plough" },
  { label: "Seeder", value: "seeder" },
  { label: "Cultivator", value: "cultivator" },
  { label: "Balancer", value: "balancer" },
  { label: "Trailer", value: "trailer" },
  { label: "Leveller", value: "leveller" },
];

// Options for Power Source
const powerSourceOptions = [
  { label: "Tractor PTO", value: "tractor_pto" },
  { label: "Electric", value: "electric" },
  { label: "Diesel", value: "diesel" },
  { label: "Petrol", value: "petrol" },
  { label: "Manual", value: "manual" },
  { label: "Hydraulic", value: "hydraulic" },
  { label: "Solar", value: "solar" },
];

// Options for PTO Requirement
const ptoRequirementOptions = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

// Options for Crop Type (Thresher)
const cropTypeOptions = [
  { label: "Wheat", value: "wheat" },
  { label: "Rice", value: "rice" },
  { label: "Maize", value: "maize" },
  { label: "Sorghum", value: "sorghum" },
  { label: "Millet", value: "millet" },
  { label: "Sunflower", value: "sunflower" },
  { label: "Soybean", value: "soybean" },
  { label: "Groundnut", value: "groundnut" },
  { label: "Mustard", value: "mustard" },
  { label: "Cotton", value: "cotton" },
];

// Options for Fan Type (Thresher)
const fanTypeOptions = [
  { label: "Centrifugal", value: "centrifugal" },
  { label: "Axial", value: "axial" },
  { label: "Mixed Flow", value: "mixed_flow" },
];

// Options for Cleaning System (Thresher)
const cleaningSystemOptions = [
  { label: "Air Screen", value: "air_screen" },
  { label: "Chaffer", value: "chaffer" },
  { label: "Sieve", value: "sieve" },
  { label: "Combination", value: "combination" },
];

// Options for Pump Type (Sprayer)
const pumpTypeOptions = [
  { label: "Diaphragm", value: "diaphragm" },
  { label: "Piston", value: "piston" },
  { label: "Centrifugal", value: "centrifugal" },
  { label: "Rotary", value: "rotary" },
  { label: "Hydraulic", value: "hydraulic" },
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

// Custom Listbox Component
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

export default function EquipmentSpecifications({
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
     resolver: yupResolver(EquipmentSpecificationsSchema),
    defaultValues: {},
  });

  const watchEquipmentType = watch("equipmentType");

  useEffect(() => {
    if ( !productData) return;

    // Common fields
    setValue("equipmentType", productData.equipmentType || "");
    setValue("powerSource", productData.powerSource || "");
    setValue("ptoRequirement", productData.ptoRequirement || "");
    setValue("requiredTractorHp", productData.requiredTractorHp || "");
    setValue("workingWidth", productData.workingWidth || "");
    setValue("workingCapacity", productData.workingCapacity || "");
    setValue("workingSpeed", productData.workingSpeed || "");
    setValue("workingDepth", productData.workingDepth || "");
    setValue("weight", productData.weight || "");
    setValue("length", productData.length || "");
    setValue("width", productData.width || "");
    setValue("height", productData.height || "");
    setValue("productionCapacity", productData.productionCapacity || "");
    setValue("fuelConsumption", productData.fuelConsumption || "");
    setValue("rpm", productData.rpm || "");
    setValue("numberOfBlades", productData.numberOfBlades || "");
    setValue("numberOfRows", productData.numberOfRows || "");
    setValue("tankCapacity", productData.tankCapacity || "");

    // Thresher specific
    setValue("threshingCapacity", productData.threshingCapacity || "");
    setValue("cropType", productData.cropType || "");
    setValue("drumSize", productData.drumSize || "");
    setValue("fanType", productData.fanType || "");
    setValue("cleaningSystem", productData.cleaningSystem || "");

    // Rotavator specific
    setValue("rotorRpm", productData.rotorRpm || "");

    // Sprayer specific
    setValue("sprayWidth", productData.sprayWidth || "");
    setValue("pumpType", productData.pumpType || "");
    setValue("nozzleCount", productData.nozzleCount || "");
    setValue("pressure", productData.pressure || "");
  }, [ productData, setValue]);

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
      ...data,

      requiredTractorHp: data.requiredTractorHp
        ? Number(data.requiredTractorHp)
        : null,

      workingWidth: data.workingWidth
        ? String(data.workingWidth)
        : null,

      workingCapacity: data.workingCapacity
        ? String(data.workingCapacity)
        : null,

      workingSpeed: data.workingSpeed
        ? String(data.workingSpeed)
        : null,

      workingDepth: data.workingDepth
        ? String(data.workingDepth)
        : null,

      weight: data.weight
        ? Number(data.weight)
        : null,

      length: data.length
        ? Number(data.length)
        : null,

      width: data.width
        ? Number(data.width)
        : null,

      height: data.height
        ? Number(data.height)
        : null,

      productionCapacity: data.productionCapacity
        ? String(data.productionCapacity)
        : null,

      fuelConsumption: data.fuelConsumption
        ? String(data.fuelConsumption)
        : null,

      rpm: data.rpm
        ? Number(data.rpm)
        : null,

      numberOfBlades: data.numberOfBlades
        ? Number(data.numberOfBlades)
        : null,

      numberOfRows: data.numberOfRows
        ? Number(data.numberOfRows)
        : null,

      tankCapacity: data.tankCapacity
        ? Number(data.tankCapacity)
        : null,

      threshingCapacity: data.threshingCapacity
        ? String(data.threshingCapacity)
        : null,

      cropType: data.cropType || null,

      drumSize: data.drumSize
        ? String(data.drumSize)
        : null,

      fanType: data.fanType || null,

      cleaningSystem: data.cleaningSystem || null,

      rotorRpm: data.rotorRpm
        ? Number(data.rotorRpm)
        : null,

      sprayWidth: data.sprayWidth
        ? String(data.sprayWidth)
        : null,

      pumpType: data.pumpType || null,

      nozzleCount: data.nozzleCount
        ? Number(data.nozzleCount)
        : null,

      pressure: data.pressure
        ? String(data.pressure)
        : null,

      currentStep: 2,
    };

    console.log("STEP 2 PRODUCT ID:", productId);
    console.log("STEP 2 PAYLOAD:", payload);

    await apiHelper.put(
      `/vendor-web/EquipmentVariant/${productId}/save-step`,
      payload
    );

    // Get latest complete product data
    const latestRes = await apiHelper.get(
      `/vendor-web/equipmentvariant/${productId}`
    );

    const latestData = latestRes.data;

    toast.success("Equipment specifications saved!");

    // IMPORTANT:
    // Update parent state just like Condition page
    onProductSaved?.({
      ...latestData,
      id: productId,
    });

    if (onComplete) {
      onComplete(step, latestData);
    }

    setCurrentStep(step + 1);
  } catch (error) {
    console.error(error);

    toast.error(
      error.response?.data?.message ||
        "Failed to save equipment specifications."
    );
  }
};

  const handlePrevious = () => {
    setCurrentStep(step - 1);
  };

  // Check if equipment type is Thresher to show specific fields
  const isThresher = watchEquipmentType === "thresher";
  const isRotavator = watchEquipmentType === "rotavator";
  const isSprayer = watchEquipmentType === "sprayer";

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12 lg:py-16">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Equipment Specifications
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Provide detailed specifications for your equipment
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-visible">
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <div className="p-6 md:p-8 lg:p-10 space-y-10">
              {/* Basic Equipment Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Technical Details
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Controller
                    name="equipmentType"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={equipmentTypeOptions}
                        value={equipmentTypeOptions.find(
                          (o) => o.value === field.value
                        ) || null}
                        onChange={(o) => field.onChange(o?.value)}
                        displayField="label"
                        placeholder="Select Equipment Type"
                        label="Equipment Type"
                        error={errors?.equipmentType?.message}
                      />
                    )}
                  />
                  <Controller
                    name="powerSource"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={powerSourceOptions}
                        value={powerSourceOptions.find(
                          (o) => o.value === field.value
                        ) || null}
                        onChange={(o) => field.onChange(o?.value)}
                        displayField="label"
                        placeholder="Select Power Source"
                        label="Power Source"
                        error={errors?.powerSource?.message}
                      />
                    )}
                  />
                  <Controller
                    name="ptoRequirement"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={ptoRequirementOptions}
                        value={ptoRequirementOptions.find(
                          (o) => o.value === field.value
                        ) || null}
                        onChange={(o) => field.onChange(o?.value)}
                        displayField="label"
                        placeholder="Select PTO Requirement"
                        label="PTO Requirement"
                        error={errors?.ptoRequirement?.message}
                      />
                    )}
                  />
                  <Input
                    {...register("requiredTractorHp")}
                    type="number"
                    label="Required Tractor HP"
                    placeholder="Enter required HP"
                    icon={Gauge}
                    error={errors?.requiredTractorHp?.message}
                  />
                </div>
              </div>

              {/* Dimensions & Weight */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Dimensions & Weight
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Input
                    {...register("workingWidth")}
                    type="number"
                    label="Working Width (m)"
                    placeholder="Enter working width"
                    icon={Ruler}
                    error={errors?.workingWidth?.message}
                  />
                  <Input
                    {...register("workingDepth")}
                    type="number"
                    label="Working Depth (cm)"
                    placeholder="Enter working depth"
                    icon={Ruler}
                    error={errors?.workingDepth?.message}
                  />
                  <Input
                    {...register("weight")}
                    type="number"
                    label="Weight (kg)"
                    placeholder="Enter weight"
                    icon={Weight}
                    error={errors?.weight?.message}
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mt-4">
                  <Input
                    {...register("length")}
                    type="number"
                    label="Length (m)"
                    placeholder="Enter length"
                    icon={Ruler}
                    error={errors?.length?.message}
                  />
                  <Input
                    {...register("width")}
                    type="number"
                    label="Width (m)"
                    placeholder="Enter width"
                    icon={Ruler}
                    error={errors?.width?.message}
                  />
                  <Input
                    {...register("height")}
                    type="number"
                    label="Height (m)"
                    placeholder="Enter height"
                    icon={Ruler}
                    error={errors?.height?.message}
                  />
                </div>
              </div>

              {/* Performance & Capacity */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Performance & Capacity
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Input
                    {...register("workingCapacity")}
                    type="number"
                    label="Working Capacity (acres/hr)"
                    placeholder="Enter working capacity"
                    icon={Clock}
                    error={errors?.workingCapacity?.message}
                  />
                  <Input
                    {...register("workingSpeed")}
                    type="number"
                    label="Working Speed (km/hr)"
                    placeholder="Enter working speed"
                    icon={Gauge}
                    error={errors?.workingSpeed?.message}
                  />
                  <Input
                    {...register("productionCapacity")}
                    type="number"
                    label="Production/Output Capacity"
                    placeholder="Enter output capacity"
                    icon={Layers}
                    error={errors?.productionCapacity?.message}
                  />
                  <Input
                    {...register("fuelConsumption")}
                    type="number"
                    label="Fuel Consumption (ltr/hr)"
                    placeholder="Enter fuel consumption"
                    icon={Fuel}
                    error={errors?.fuelConsumption?.message}
                  />
                </div>
              </div>

              {/* Technical Specifications */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Technical Specifications
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Input
                    {...register("rpm")}
                    type="number"
                    label="RPM"
                    placeholder="Enter RPM"
                    icon={RotateCcw}
                    error={errors?.rpm?.message}
                  />
                  <Input
                    {...register("numberOfBlades")}
                    type="number"
                    label="Number of Blades/Tines/Rotors"
                    placeholder="Enter number"
                    icon={Settings}
                    error={errors?.numberOfBlades?.message}
                  />
                  <Input
                    {...register("numberOfRows")}
                    type="number"
                    label="Number of Rows"
                    placeholder="Enter number of rows"
                    icon={Layers}
                    error={errors?.numberOfRows?.message}
                  />
                  <Input
                    {...register("tankCapacity")}
                    type="number"
                    label="Tank Capacity (ltr)"
                    placeholder="Enter tank capacity"
                    icon={Droplets}
                    error={errors?.tankCapacity?.message}
                  />
                </div>
              </div>

              {/* Dynamic Fields Based on Equipment Type */}
              {isThresher && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Thresher Specifications
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Input
                      {...register("threshingCapacity")}
                      type="number"
                      label="Threshing Capacity (kg/hr)"
                      placeholder="Enter threshing capacity"
                      icon={Layers}
                      error={errors?.threshingCapacity?.message}
                    />
                    <Controller
                      name="cropType"
                      control={control}
                      render={({ field }) => (
                        <CustomListbox
                          data={cropTypeOptions}
                          value={cropTypeOptions.find(
                            (o) => o.value === field.value
                          ) || null}
                          onChange={(o) => field.onChange(o?.value)}
                          displayField="label"
                          placeholder="Select Crop Type"
                          label="Crop Type"
                          error={errors?.cropType?.message}
                        />
                      )}
                    />
                    <Input
                      {...register("drumSize")}
                      type="number"
                      label="Drum Size (mm)"
                      placeholder="Enter drum size"
                      icon={Settings}
                      error={errors?.drumSize?.message}
                    />
                    <Controller
                      name="fanType"
                      control={control}
                      render={({ field }) => (
                        <CustomListbox
                          data={fanTypeOptions}
                          value={fanTypeOptions.find(
                            (o) => o.value === field.value
                          ) || null}
                          onChange={(o) => field.onChange(o?.value)}
                          displayField="label"
                          placeholder="Select Fan Type"
                          label="Fan Type"
                          error={errors?.fanType?.message}
                        />
                      )}
                    />
                    <Controller
                      name="cleaningSystem"
                      control={control}
                      render={({ field }) => (
                        <CustomListbox
                          data={cleaningSystemOptions}
                          value={cleaningSystemOptions.find(
                            (o) => o.value === field.value
                          ) || null}
                          onChange={(o) => field.onChange(o?.value)}
                          displayField="label"
                          placeholder="Select Cleaning System"
                          label="Cleaning System"
                          error={errors?.cleaningSystem?.message}
                        />
                      )}
                    />
                  </div>
                </div>
              )}

              {isRotavator && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Rotavator Specifications
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Input
                      {...register("rotorRpm")}
                      type="number"
                      label="Rotor RPM"
                      placeholder="Enter rotor RPM"
                      icon={RotateCcw}
                      error={errors?.rotorRpm?.message}
                    />
                  </div>
                </div>
              )}

              {isSprayer && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Sprayer Specifications
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Input
                      {...register("sprayWidth")}
                      type="number"
                      label="Spray Width (m)"
                      placeholder="Enter spray width"
                      icon={Ruler}
                      error={errors?.sprayWidth?.message}
                    />
                    <Controller
                      name="pumpType"
                      control={control}
                      render={({ field }) => (
                        <CustomListbox
                          data={pumpTypeOptions}
                          value={pumpTypeOptions.find(
                            (o) => o.value === field.value
                          ) || null}
                          onChange={(o) => field.onChange(o?.value)}
                          displayField="label"
                          placeholder="Select Pump Type"
                          label="Pump Type"
                          error={errors?.pumpType?.message}
                        />
                      )}
                    />
                    <Input
                      {...register("nozzleCount")}
                      type="number"
                      label="Nozzle Count"
                      placeholder="Enter nozzle count"
                      icon={Settings}
                      error={errors?.nozzleCount?.message}
                    />
                    <Input
                      {...register("pressure")}
                      type="number"
                      label="Pressure (bar)"
                      placeholder="Enter pressure"
                      icon={Gauge}
                      error={errors?.pressure?.message}
                    />
                  </div>
                </div>
              )}
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
                  className="min-w-28"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="min-w-36">
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