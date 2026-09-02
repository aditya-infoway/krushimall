import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { MagnifyingGlassIcon, CheckIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Transition } from "@headlessui/react";
import { EquipmentConditionSchema } from "./schema";
import apiHelper from "../../utils/apiHelper";
import { Combobox } from "@headlessui/react";
import { useState, useRef } from "react";
// Options for Overall Condition
const overallConditionOptions = [
  { label: "Excellent", value: "excellent", description: "Like new condition" },
  { label: "Very Good", value: "very_good", description: "Well maintained" },
  { label: "Good", value: "good", description: "Normal condition" },
  { label: "Average", value: "average", description: "Average condition" },
  {
    label: "Needs Repair",
    value: "needs_repair",
    description: "Requires attention",
  },
];

// Options for Mechanical Condition
const mechanicalConditionOptions = [
  { label: "Excellent", value: "excellent", description: "Perfect working" },
  { label: "Good", value: "good", description: "Good working" },
  { label: "Average", value: "average", description: "Average working" },
  {
    label: "Needs Repair",
    value: "needs_repair",
    description: "Requires repair",
  },
];

// Options for Oil Leakage
const oilLeakageOptions = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

// Options for Working Condition
const workingConditionOptions = [
  {
    label: "Fully Working",
    value: "fully_working",
    description: "All functions working",
  },
  {
    label: "Partially Working",
    value: "partially_working",
    description: "Some functions working",
  },
  {
    label: "Not Working",
    value: "not_working",
    description: "Not in working condition",
  },
  {
    label: "Needs Repair",
    value: "needs_repair",
    description: "Requires repair",
  },
];

// Options for Electrical Components
const electricalOptions = [
  { label: "Excellent", value: "excellent" },
  { label: "Good", value: "good" },
  { label: "Average", value: "average" },
  { label: "Needs Repair", value: "needs_repair" },
  { label: "Not Available", value: "not_available" },
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

export default function EquipmentCondition({
  setCurrentStep,
  step,
  onComplete,
  
  onProductSaved,
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
    resolver: yupResolver(EquipmentConditionSchema),
    defaultValues: {
      mechanical: {},
      electrical: {},
    },
  });

  useEffect(() => {
    if (!productData) return;

    setValue("overallCondition", productData.overallCondition || "");
    setValue(
      "mechanical.mainMachineCondition",
      productData.mechanical?.mainMachineCondition || "",
    );
    setValue(
      "mechanical.driveSystem",
      productData.mechanical?.driveSystem || "",
    );
    setValue(
      "mechanical.beltChainCondition",
      productData.mechanical?.beltChainCondition || "",
    );
    setValue(
      "mechanical.bearingCondition",
      productData.mechanical?.bearingCondition || "",
    );
    setValue(
      "mechanical.gearboxCondition",
      productData.mechanical?.gearboxCondition || "",
    );
    setValue("oilLeakage", productData.oilLeakage || "");
    setValue("workingCondition", productData.workingCondition || "");
    setValue("electrical.wiring", productData.electrical?.wiring || "");
    setValue(
      "electrical.motorStarter",
      productData.electrical?.motorStarter || "",
    );
    setValue("electrical.battery", productData.electrical?.battery || "");
    setValue("electrical.lights", productData.electrical?.lights || "");
    setValue(
      "electrical.controlPanel",
      productData.electrical?.controlPanel || "",
    );
  }, [productData, setValue]);

  const onSubmit = async (data) => {
    try {
      const productId = productData?.id
        ? productData.id
        : localStorage.getItem("vendorEquipmentId");

      if (!productId) {
        toast("Please save basic information first.");
        return;
      }

      const payload = {
        overallCondition: data.overallCondition,
        mechanical: {
          mainMachineCondition: data.mechanical.mainMachineCondition,
          driveSystem: data.mechanical.driveSystem,
          beltChainCondition: data.mechanical.beltChainCondition,
          bearingCondition: data.mechanical.bearingCondition,
          gearboxCondition: data.mechanical.gearboxCondition,
        },
        oilLeakage: data.oilLeakage,
        workingCondition: data.workingCondition,
        electrical: {
          wiring: data.electrical.wiring,
          motorStarter: data.electrical.motorStarter,
          battery: data.electrical.battery,
          lights: data.electrical.lights,
          controlPanel: data.electrical.controlPanel,
        },
        currentStep: 2,
      };
      await apiHelper.put(
        `/vendor-web/equipmentvariant/${productId}/save-step`,
        payload,
      );

      toast.success("Equipment condition saved!");

      onProductSaved?.({ ...payload, id: productId }); // add this

      if (onComplete) {
        onComplete(step);
      }

      setCurrentStep(step + 1);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to save equipment condition.",
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
          <h1 className="text-2xl font-bold text-gray-900">
            Equipment Condition
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Provide detailed condition assessment of your equipment
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-visible">
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <div className="p-6 md:p-8 lg:p-10 space-y-10">
              {/* Overall Condition */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Overall Condition
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {overallConditionOptions.map((option) => {
                    const selected = watch("overallCondition") === option.value;
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
                          {...register("overallCondition")}
                          className="mt-1 h-4 w-4 text-green-600 focus:ring-2 focus:ring-green-600 flex-shrink-0"
                        />
                        <div>
                          <span className="font-medium text-gray-900 block">
                            {option.label}
                          </span>
                          {option.description && (
                            <p className="text-sm text-gray-500">
                              {option.description}
                            </p>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
                {errors?.overallCondition && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.overallCondition.message}
                  </p>
                )}
              </div>

              {/* Mechanical Condition */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Mechanical Condition
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Controller
                    name="mechanical.mainMachineCondition"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={mechanicalConditionOptions}
                        value={
                          mechanicalConditionOptions.find(
                            (o) => o.value === field.value,
                          ) || null
                        }
                        onChange={(o) => field.onChange(o?.value)}
                        displayField="label"
                        placeholder="Select Condition"
                        label="Main Machine Condition"
                        error={
                          errors?.mechanical?.mainMachineCondition?.message
                        }
                      />
                    )}
                  />
                  <Controller
                    name="mechanical.driveSystem"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={mechanicalConditionOptions}
                        value={
                          mechanicalConditionOptions.find(
                            (o) => o.value === field.value,
                          ) || null
                        }
                        onChange={(o) => field.onChange(o?.value)}
                        displayField="label"
                        placeholder="Select Condition"
                        label="Drive System"
                        error={errors?.mechanical?.driveSystem?.message}
                      />
                    )}
                  />
                  <Controller
                    name="mechanical.beltChainCondition"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={mechanicalConditionOptions}
                        value={
                          mechanicalConditionOptions.find(
                            (o) => o.value === field.value,
                          ) || null
                        }
                        onChange={(o) => field.onChange(o?.value)}
                        displayField="label"
                        placeholder="Select Condition"
                        label="Belt / Chain Condition"
                        error={errors?.mechanical?.beltChainCondition?.message}
                      />
                    )}
                  />
                  <Controller
                    name="mechanical.bearingCondition"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={mechanicalConditionOptions}
                        value={
                          mechanicalConditionOptions.find(
                            (o) => o.value === field.value,
                          ) || null
                        }
                        onChange={(o) => field.onChange(o?.value)}
                        displayField="label"
                        placeholder="Select Condition"
                        label="Bearing Condition"
                        error={errors?.mechanical?.bearingCondition?.message}
                      />
                    )}
                  />
                  <Controller
                    name="mechanical.gearboxCondition"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={mechanicalConditionOptions}
                        value={
                          mechanicalConditionOptions.find(
                            (o) => o.value === field.value,
                          ) || null
                        }
                        onChange={(o) => field.onChange(o?.value)}
                        displayField="label"
                        placeholder="Select Condition"
                        label="Gearbox Condition"
                        error={errors?.mechanical?.gearboxCondition?.message}
                      />
                    )}
                  />
                </div>
              </div>

              {/* Oil Leakage */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Oil Leakage
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {oilLeakageOptions.map((option) => {
                    const selected = watch("oilLeakage") === option.value;
                    return (
                      <label
                        key={option.value}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all ${
                          selected
                            ? "border-green-600 bg-green-50 shadow-sm"
                            : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="radio"
                          value={option.value}
                          {...register("oilLeakage")}
                          className="h-4 w-4 text-green-600 focus:ring-2 focus:ring-green-600"
                        />
                        <span className="font-medium text-gray-900">
                          {option.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
                {errors?.oilLeakage && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.oilLeakage.message}
                  </p>
                )}
              </div>

              {/* Working Condition */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Working Condition
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {workingConditionOptions.map((option) => {
                    const selected = watch("workingCondition") === option.value;
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
                          {...register("workingCondition")}
                          className="mt-1 h-4 w-4 text-green-600 focus:ring-2 focus:ring-green-600 flex-shrink-0"
                        />
                        <div>
                          <span className="font-medium text-gray-900 block">
                            {option.label}
                          </span>
                          {option.description && (
                            <p className="text-sm text-gray-500">
                              {option.description}
                            </p>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
                {errors?.workingCondition && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.workingCondition.message}
                  </p>
                )}
              </div>

              {/* Electrical */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Electrical
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Controller
                    name="electrical.wiring"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={electricalOptions}
                        value={
                          electricalOptions.find(
                            (o) => o.value === field.value,
                          ) || null
                        }
                        onChange={(o) => field.onChange(o?.value)}
                        displayField="label"
                        placeholder="Select Condition"
                        label="Wiring"
                        error={errors?.electrical?.wiring?.message}
                      />
                    )}
                  />
                  <Controller
                    name="electrical.motorStarter"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={electricalOptions}
                        value={
                          electricalOptions.find(
                            (o) => o.value === field.value,
                          ) || null
                        }
                        onChange={(o) => field.onChange(o?.value)}
                        displayField="label"
                        placeholder="Select Condition"
                        label="Motor / Starter"
                        error={errors?.electrical?.motorStarter?.message}
                      />
                    )}
                  />
                  <Controller
                    name="electrical.battery"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={electricalOptions}
                        value={
                          electricalOptions.find(
                            (o) => o.value === field.value,
                          ) || null
                        }
                        onChange={(o) => field.onChange(o?.value)}
                        displayField="label"
                        placeholder="Select Condition"
                        label="Battery"
                        error={errors?.electrical?.battery?.message}
                      />
                    )}
                  />
                  <Controller
                    name="electrical.lights"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={electricalOptions}
                        value={
                          electricalOptions.find(
                            (o) => o.value === field.value,
                          ) || null
                        }
                        onChange={(o) => field.onChange(o?.value)}
                        displayField="label"
                        placeholder="Select Condition"
                        label="Lights"
                        error={errors?.electrical?.lights?.message}
                      />
                    )}
                  />
                  <Controller
                    name="electrical.controlPanel"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={electricalOptions}
                        value={
                          electricalOptions.find(
                            (o) => o.value === field.value,
                          ) || null
                        }
                        onChange={(o) => field.onChange(o?.value)}
                        displayField="label"
                        placeholder="Select Condition"
                        label="Control Panel"
                        error={errors?.electrical?.controlPanel?.message}
                      />
                    )}
                  />
                </div>
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
