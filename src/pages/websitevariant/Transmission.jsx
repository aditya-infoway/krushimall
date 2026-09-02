import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { Disc3, Settings, Cog, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon, CheckIcon } from "@heroicons/react/24/outline";
import { TransmissionSchema } from "./schema";
import apiHelper from "../../utils/apiHelper";
import { Combobox } from "@headlessui/react";
import { Listbox, Transition } from "@headlessui/react";
import { Fragment } from "react";
const gearTypeOptions = [
  { label: "Side Shift", value: "side_shift" },
  { label: "Constant Mesh", value: "constant_mesh" },
  { label: "Synchromesh", value: "synchromesh" },
  { label: "Sliding Mesh", value: "sliding_mesh" },
];
const ptoTypeOptions = [
  { label: "Independent", value: "independent" },
  { label: "Dependent", value: "dependent" },
  { label: "Live", value: "live" },
  { label: "Continuous", value: "continuous" },
];
const ptoPositionOptions = [
  { label: "Rear", value: "rear" },
  { label: "Front", value: "front" },
  { label: "Both", value: "both" },
];
const ptoRpmOptions = [
  { label: "540 RPM", value: 540 },
  { label: "750 RPM", value: 750 },
  { label: "1000 RPM", value: 1000 },
  { label: "540/540 RPM", value: 540540 },
  { label: "540/1000 RPM", value: 5401000 },
  { label: "540/750 RPM", value: 540750 },
];
const reverseGearOptions = [1, 2, 3, 4, 5, 6, 8, 10].map((n) => ({
  label: `${n} Reverse Gear${n > 1 ? "s" : ""}`,
  value: n,
}));
const forwardGearOptions = [4, 6, 8, 10, 12, 16, 20, 24].map((n) => ({
  label: `${n} Forward Gears`,
  value: n,
}));
const clutchOptions = [
  {
    label: "Single Clutch",
    value: "single_clutch",
    description: "Standard single clutch system",
    icon: Disc3,
  },
  {
    label: "Dual Clutch",
    value: "dual_clutch",
    description: "Dual clutch for smooth operation",
    icon: Settings,
  },
  {
    label: "Double Clutch",
    value: "double_clutch",
    description: "Provides better control & power",
    icon: Cog,
  },
];
const transmissionTypeOptions = [
  {
    label: "Sliding Mesh",
    value: "sliding_mesh",
    description: "Simple and cost effective",
    icon: Cog,
  },
  {
    label: "Constant Mesh",
    value: "constant_mesh",
    description: "Better performance and durability",
    icon: Settings,
  },
  {
    label: "Synchromesh",
    value: "synchromesh",
    description: "Smooth gear shifting and easy to operate",
    icon: Cog,
  },
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
 

export default function Transmission({
  setCurrentStep,
  step,
  completedSteps,
  onComplete,
  onProductSaved,
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
    defaultValues: {},
  });

  // ✅ Fix: pehle sirf isEdit mode me chalta tha. Ab productData jab
  // bhi available ho (edit mode se ya parent ke onProductSaved se
  // aane wale updated state se) form us se refill ho jayega — isse
  // "Previous" dabane ke baad is step ka data ghum jaane wala
  // problem nahi hoga.
  useEffect(() => {
  if (!productData) return;

  setValue("clutchType", productData.clutchType || "");
  setValue("forwardGears", productData.forwardGears || "");
  setValue("reverseGears", productData.reverseGears || "");
  setValue("gearType", productData.gearType || "");
  setValue("transmissionType", productData.transmissionType || "");
  setValue("ptoHp", productData.ptoHp || "");
  setValue("ptoRpm", productData.ptoRpm || "");
  setValue("ptoType", productData.ptoType || "");
  setValue("ptoPosition", productData.ptoPosition || "");

  setValue(
    "features.creeperGears",
    productData.creeperGears ?? false
  );
  setValue(
    "features.shuttleShift",
    productData.shuttleShift ?? false
  );
  setValue(
    "features.sideShiftGear",
    productData.sideShiftGear ?? false
  );
  setValue(
    "features.powerShuttle",
    productData.powerShuttle ?? false
  );
  setValue(
    "features.hiLoGears",
    productData.hiLoGears ?? false
  );
  setValue(
    "features.multiSpeedPto",
    productData.multiSpeedPto ?? false
  );
  setValue(
    "features.reversePto",
    productData.reversePto ?? false
  );
  setValue(
    "features.superReducer",
    productData.superReducer ?? false
  );
}, [productData, setValue]);

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
        clutchType: data.clutchType,
        forwardGears: data.forwardGears ? Number(data.forwardGears) : null,
        reverseGears: data.reverseGears ? Number(data.reverseGears) : null,
        gearType: data.gearType,
        transmissionType: data.transmissionType,
        ptoHp: data.ptoHp ? Number(data.ptoHp) : null,
        ptoRpm: data.ptoRpm ? Number(data.ptoRpm) : null,
        ptoType: data.ptoType,
        ptoPosition: data.ptoPosition,
        creeperGears: data.features?.creeperGears ?? false,
        shuttleShift: data.features?.shuttleShift ?? false,
        sideShiftGear: data.features?.sideShiftGear ?? false,
        powerShuttle: data.features?.powerShuttle ?? false,
        hiLoGears: data.features?.hiLoGears ?? false,
        multiSpeedPto: data.features?.multiSpeedPto ?? false,
        reversePto: data.features?.reversePto ?? false,
        superReducer: data.features?.superReducer ?? false,
        currentStep: 2,
      };

      await apiHelper.put(
        `/vendor-web/website-variant/${productId}/save-step`,
        payload,
      );

      toast.success("Transmission details saved!");

      // ✅ Parent ka productData state bhi update karo taaki
      // "Previous" dabane par ye step dubara khaali na dikhe.
      onProductSaved?.({ ...payload, id: productId });

      // Mark current step as completed
      if (onComplete) {
        onComplete(step);
      }

      // Go to next step
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
            Transmission Details
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Provide transmission and gear specifications for your product
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <div className="p-6 md:p-8 lg:p-10 space-y-10">
              {/* Clutch */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Clutch
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {clutchOptions.map((option) => {
                    const selected = watch("clutchType") === option.value;
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
                          {...register("clutchType")}
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
                {errors?.clutchType && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.clutchType.message}
                  </p>
                )}
              </div>

              {/* Gear Box */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Gear Box
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <Controller
                    name="forwardGears"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={forwardGearOptions}
                        value={
                          forwardGearOptions.find(
                            (o) => o.value === Number(field.value),
                          ) || null
                        }
                        onChange={(o) => field.onChange(o?.value)}
                        displayField="label"
                        label="Forward Gears"
                        placeholder="Select Forward Gears"
                        error={errors?.forwardGears?.message}
                      />
                    )}
                  />
                  <Controller
                    name="reverseGears"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={reverseGearOptions}
                        value={
                          reverseGearOptions.find(
                            (o) => o.value === Number(field.value),
                          ) || null
                        }
                        onChange={(o) => field.onChange(o?.value)}
                        displayField="label"
                        label="Reverse Gears"
                        placeholder="Select Reverse Gears"
                        error={errors?.reverseGears?.message}
                      />
                    )}
                  />
                  <Controller
                    name="gearType"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={gearTypeOptions}
                        value={
                          gearTypeOptions.find(
                            (o) => o.value === field.value,
                          ) || null
                        }
                        onChange={(o) => field.onChange(o?.value)}
                        displayField="label"
                        label="Gear Type"
                        placeholder="Select Gear Type"
                        error={errors?.gearType?.message}
                      />
                    )}
                  />
                </div>
              </div>

              {/* Transmission Type */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Transmission Type
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {transmissionTypeOptions.map((option) => {
                    const selected = watch("transmissionType") === option.value;
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
                          {...register("transmissionType")}
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
                {errors?.transmissionType && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.transmissionType.message}
                  </p>
                )}
              </div>

              {/* PTO (Power Take Off) */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  PTO (Power Take Off)
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Input
                    {...register("ptoHp")}
                    type="number"
                    label="PTO HP"
                    placeholder="Enter PTO HP"
                    error={errors?.ptoHp?.message}
                  />
                  <Controller
                    name="ptoRpm"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={ptoRpmOptions}
                        value={
                          ptoRpmOptions.find(
                            (o) => o.value === Number(field.value),
                          ) || null
                        }
                        onChange={(o) => field.onChange(o?.value)}
                        displayField="label"
                        label="PTO RPM"
                        placeholder="Select PTO RPM"
                        error={errors?.ptoRpm?.message}
                      />
                    )}
                  />
                  <Controller
                    name="ptoType"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={ptoTypeOptions}
                        value={
                          ptoTypeOptions.find((o) => o.value === field.value) ||
                          null
                        }
                        onChange={(o) => field.onChange(o?.value)}
                        displayField="label"
                        label="PTO Type"
                        placeholder="Select PTO Type"
                        error={errors?.ptoType?.message}
                      />
                    )}
                  />
                  <Controller
                    name="ptoPosition"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={ptoPositionOptions}
                        value={
                          ptoPositionOptions.find(
                            (o) => o.value === field.value,
                          ) || null
                        }
                        onChange={(o) => field.onChange(o?.value)}
                        displayField="label"
                        label="PTO Position"
                        placeholder="Select PTO Position"
                        error={errors?.ptoPosition?.message}
                      />
                    )}
                  />
                </div>
              </div>

              {/* Additional Transmission Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Additional Transmission Features
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    ["features.creeperGears", "Creeper Gears"],
                    ["features.shuttleShift", "Shuttle Shift"],
                    ["features.sideShiftGear", "Side Shift Gear"],
                    ["features.powerShuttle", "Power Shuttle"],
                    ["features.hiLoGears", "Hi-Lo Gears"],
                    ["features.multiSpeedPto", "Multi Speed PTO"],
                    ["features.reversePto", "Reverse PTO"],
                    ["features.superReducer", "Super Reducer (Optional)"],
                  ].map(([name, label]) => (
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
              <Button type="submit" className="min-w-36 cursor-pointer">
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