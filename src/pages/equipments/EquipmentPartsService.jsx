import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  Wrench,
  Settings,
  GitBranch,
  CheckCircle,
  Joystick,
  Calendar,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Shield,
  Car,
  Droplets,
  Gauge,
  Cog,
  Filter,
  RotateCcw,
} from "lucide-react";
import { EquipmentPartsServiceSchema } from "./schema";
import apiHelper from "../../utils/apiHelper";

// Options for Parts Condition
const partsConditionOptions = [
  { label: "Excellent", value: "excellent" },
  { label: "Good", value: "good" },
  { label: "Average", value: "average" },
  { label: "Needs Repair", value: "needs_repair" },
  { label: "Not Available", value: "not_available" },
];

// Options for Major Repair
const majorRepairOptions = [
  { label: "Never", value: "never" },
  { label: "Minor", value: "minor" },
  { label: "Major", value: "major" },
];

// Options for Yes/No
const yesNoOptions = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

// Options for Accident Damage
const accidentDamageOptions = [
  { label: "Never", value: "never" },
  { label: "Minor", value: "minor" },
  { label: "Major", value: "major" },
];

// Options for Flood Damage
const floodDamageOptions = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];


// Custom DatePicker Component
const DatePicker = ({
  value,
  onChange,
  label,
  error,
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
          {label}
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

export default function EquipmentPartsService({
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
    resolver: yupResolver(EquipmentPartsServiceSchema),
    defaultValues: {
      partsCondition: {},
      attachments: {},
      partsReplaced: {},
    },
  });

  const watchOtherAttachment = watch("attachments.other");

  useEffect(() => {
    if (!isEdit || !productData) return;

    reset({
      partsCondition: {
        blades: productData.partsCondition?.blades || "",
        belts: productData.partsCondition?.belts || "",
        bearings: productData.partsCondition?.bearings || "",
        chains: productData.partsCondition?.chains || "",
        gears: productData.partsCondition?.gears || "",
        rollers: productData.partsCondition?.rollers || "",
        nozzles: productData.partsCondition?.nozzles || "",
      },
      attachments: {
        rotavator: productData.attachments?.rotavator || false,
        cultivator: productData.attachments?.cultivator || false,
        trailer: productData.attachments?.trailer || false,
        trolley: productData.attachments?.trolley || false,
        mbPlough: productData.attachments?.mbPlough || false,
        seedDrill: productData.attachments?.seedDrill || false,
        sprayer: productData.attachments?.sprayer || false,
        dozer: productData.attachments?.dozer || false,
        loader: productData.attachments?.loader || false,
        other: productData.attachments?.other || false,
      },
      otherAttachmentName: productData.otherAttachmentName || "",
      lastServiceDate: productData.lastServiceDate || "",
      majorRepair: productData.majorRepair || "",
      partsReplaced: {
        gearboxRepaired: productData.partsReplaced?.gearboxRepaired || "",
        beltChainChanged: productData.partsReplaced?.beltChainChanged || "",
        bearingChanged: productData.partsReplaced?.bearingChanged || "",
      },
      accidentDamage: productData.accidentDamage || "",
      floodDamage: productData.floodDamage || "",
    });
  }, [productData, isEdit, reset]);


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
      setLoading(true);
      const productId = isEdit
        ? productData?.id
        : localStorage.getItem("vendorEquipmentId");

      if (!productId) {
        toast("Please save basic information first.");
        return;
      }

      const payload = {
        partsCondition: {
          blades: data.partsCondition.blades || null,
          belts: data.partsCondition.belts || null,
          bearings: data.partsCondition.bearings || null,
          chains: data.partsCondition.chains || null,
          gears: data.partsCondition.gears || null,
          rollers: data.partsCondition.rollers || null,
          nozzles: data.partsCondition.nozzles || null,
        },
        attachments: {
          rotavator: data.attachments.rotavator || false,
          cultivator: data.attachments.cultivator || false,
          trailer: data.attachments.trailer || false,
          trolley: data.attachments.trolley || false,
          mbPlough: data.attachments.mbPlough || false,
          seedDrill: data.attachments.seedDrill || false,
          sprayer: data.attachments.sprayer || false,
          dozer: data.attachments.dozer || false,
          loader: data.attachments.loader || false,
          other: data.attachments.other || false,
        },
        otherAttachmentName: data.attachments.other ? data.otherAttachmentName : null,
        lastServiceDate: data.lastServiceDate || null,
        majorRepair: data.majorRepair || null,
        partsReplaced: {
          gearboxRepaired: data.partsReplaced.gearboxRepaired || null,
          beltChainChanged: data.partsReplaced.beltChainChanged || null,
          bearingChanged: data.partsReplaced.bearingChanged || null,
        },
        accidentDamage: data.accidentDamage || null,
        floodDamage: data.floodDamage || null,
        currentStep: 3,
      };

      await apiHelper.put(
        `/vendor-web/equipmentvariant/${productId}/save-step`,
        payload
      );

      toast.success("Parts & service details saved!");

      if (onComplete) {
        onComplete(step);
      }

      if (setCurrentStep) {
        setCurrentStep(step + 1);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to save parts & service details."
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
            Parts, Attachments & Service
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Provide details about parts condition, attachments, and service history
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <div className="p-6 md:p-8 lg:p-10 space-y-10">
              {/* Parts Condition */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Parts Condition
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Controller
                    name="partsCondition.blades"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={partsConditionOptions}
                        value={partsConditionOptions.find(
                          (o) => o.value === field.value
                        ) || null}
                        onChange={(o) => field.onChange(o?.value)}
                        displayField="label"
                        placeholder="Select Condition"
                        label="Blades / Tines"
                        error={errors?.partsCondition?.blades?.message}
                      />
                    )}
                  />
                  <Controller
                    name="partsCondition.belts"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={partsConditionOptions}
                        value={partsConditionOptions.find(
                          (o) => o.value === field.value
                        ) || null}
                        onChange={(o) => field.onChange(o?.value)}
                        displayField="label"
                        placeholder="Select Condition"
                        label="Belts"
                        error={errors?.partsCondition?.belts?.message}
                      />
                    )}
                  />
                  <Controller
                    name="partsCondition.bearings"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={partsConditionOptions}
                        value={partsConditionOptions.find(
                          (o) => o.value === field.value
                        ) || null}
                        onChange={(o) => field.onChange(o?.value)}
                        displayField="label"
                        placeholder="Select Condition"
                        label="Bearings"
                        error={errors?.partsCondition?.bearings?.message}
                      />
                    )}
                  />
                  <Controller
                    name="partsCondition.chains"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={partsConditionOptions}
                        value={partsConditionOptions.find(
                          (o) => o.value === field.value
                        ) || null}
                        onChange={(o) => field.onChange(o?.value)}
                        displayField="label"
                        placeholder="Select Condition"
                        label="Chains"
                        error={errors?.partsCondition?.chains?.message}
                      />
                    )}
                  />
                  <Controller
                    name="partsCondition.gears"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={partsConditionOptions}
                        value={partsConditionOptions.find(
                          (o) => o.value === field.value
                        ) || null}
                        onChange={(o) => field.onChange(o?.value)}
                        displayField="label"
                        placeholder="Select Condition"
                        label="Gears"
                        error={errors?.partsCondition?.gears?.message}
                      />
                    )}
                  />
                  <Controller
                    name="partsCondition.rollers"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={partsConditionOptions}
                        value={partsConditionOptions.find(
                          (o) => o.value === field.value
                        ) || null}
                        onChange={(o) => field.onChange(o?.value)}
                        displayField="label"
                        placeholder="Select Condition"
                        label="Rollers"
                        error={errors?.partsCondition?.rollers?.message}
                      />
                    )}
                  />
                  <Controller
                    name="partsCondition.nozzles"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={partsConditionOptions}
                        value={partsConditionOptions.find(
                          (o) => o.value === field.value
                        ) || null}
                        onChange={(o) => field.onChange(o?.value)}
                        displayField="label"
                        placeholder="Select Condition"
                        label="Nozzles (if applicable)"
                        error={errors?.partsCondition?.nozzles?.message}
                      />
                    )}
                  />
                </div>
              </div>

              {/* Attachments Included */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Attachments Included
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { name: "rotavator", label: "Rotavator" },
                    { name: "cultivator", label: "Cultivator" },
                    { name: "trailer", label: "Trailer" },
                    { name: "trolley", label: "Trolley" },
                    { name: "mbPlough", label: "MB Plough" },
                    { name: "seedDrill", label: "Seed Drill" },
                    { name: "sprayer", label: "Sprayer" },
                    { name: "dozer", label: "Dozer" },
                    { name: "loader", label: "Loader" },
                    { name: "other", label: "Other Attachment" },
                  ].map((attachment) => (
                    <label
                      key={attachment.name}
                      className="flex cursor-pointer items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-gray-50 transition-all"
                    >
                      <input
                        type="checkbox"
                        {...register(`attachments.${attachment.name}`)}
                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-2 focus:ring-green-600"
                      />
                      <span className="text-sm text-gray-700">
                        {attachment.label}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Other Attachment Name - shows only when Other is checked */}
                {watchOtherAttachment && (
                  <div className="mt-4">
                    <Input
                      {...register("otherAttachmentName")}
                      label="Please specify other attachment"
                      placeholder="Enter attachment name"
                      error={errors?.otherAttachmentName?.message}
                      icon={Tool}
                    />
                  </div>
                )}
              </div>

              {/* Service History */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Service History
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Controller
  name="lastServiceDate"
  control={control}
  render={({ field }) => (
    <DatePicker
      value={field.value ? parseLocalDate(field.value) : undefined}
      onChange={(date) => field.onChange(date ? formatLocalDate(date) : null)}
      label="Last Service Date"
      error={errors?.lastServiceDate?.message}
      placeholder="Select date..."
    />
  )}
/>
                  <Controller
                    name="majorRepair"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={majorRepairOptions}
                        value={majorRepairOptions.find(
                          (o) => o.value === field.value
                        ) || null}
                        onChange={(o) => field.onChange(o?.value)}
                        displayField="label"
                        placeholder="Select Repair Type"
                        label="Major Repair"
                        error={errors?.majorRepair?.message}
                      />
                    )}
                  />
                </div>
              </div>

              {/* Parts Replaced */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Parts Replaced
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Controller
                    name="partsReplaced.gearboxRepaired"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={yesNoOptions}
                        value={yesNoOptions.find(
                          (o) => o.value === field.value
                        ) || null}
                        onChange={(o) => field.onChange(o?.value)}
                        displayField="label"
                        placeholder="Select"
                        label="Gearbox Repaired"
                        error={errors?.partsReplaced?.gearboxRepaired?.message}
                      />
                    )}
                  />
                  <Controller
                    name="partsReplaced.beltChainChanged"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={yesNoOptions}
                        value={yesNoOptions.find(
                          (o) => o.value === field.value
                        ) || null}
                        onChange={(o) => field.onChange(o?.value)}
                        displayField="label"
                        placeholder="Select"
                        label="Belt / Chain Changed"
                        error={errors?.partsReplaced?.beltChainChanged?.message}
                      />
                    )}
                  />
                  <Controller
                    name="partsReplaced.bearingChanged"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={yesNoOptions}
                        value={yesNoOptions.find(
                          (o) => o.value === field.value
                        ) || null}
                        onChange={(o) => field.onChange(o?.value)}
                        displayField="label"
                        placeholder="Select"
                        label="Bearing Changed"
                        error={errors?.partsReplaced?.bearingChanged?.message}
                      />
                    )}
                  />
                </div>
              </div>

              {/* Accident & Flood Damage */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Damage History
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Controller
                    name="accidentDamage"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={accidentDamageOptions}
                        value={accidentDamageOptions.find(
                          (o) => o.value === field.value
                        ) || null}
                        onChange={(o) => field.onChange(o?.value)}
                        displayField="label"
                        placeholder="Select Accident History"
                        label="Accident Damage"
                        error={errors?.accidentDamage?.message}
                      />
                    )}
                  />
                  <Controller
                    name="floodDamage"
                    control={control}
                    render={({ field }) => (
                      <CustomListbox
                        data={floodDamageOptions}
                        value={floodDamageOptions.find(
                          (o) => o.value === field.value
                        ) || null}
                        onChange={(o) => field.onChange(o?.value)}
                        displayField="label"
                        placeholder="Select Flood History"
                        label="Flood Damage"
                        error={errors?.floodDamage?.message}
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
                  disabled={loading}
                >
                  {loading ? "Saving..." : isEdit ? "Update & Next" : "Save & Next"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}