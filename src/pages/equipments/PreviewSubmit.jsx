import { useState, useEffect } from "react";
import {
  CheckCircle,
  Gauge,
  Tractor,
  Fuel,
  CalendarDays,
  FileText,
  ChevronLeft,
  Save,
  Send,
  X,
  MapPin,
  Tag,
  DollarSign,
  Package,
  Settings,
  Wrench,
  Shield,
  Clock,
  User,
  Building2,
  Phone,
  Mail,
  MapPinned,
  BadgeCheck,
  Image,
  Video,
  File,
  ClipboardCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import apiHelper from "../../utils/apiHelper";

// Custom Button Component
const Button = ({
  children,
  variant = "primary",
  className = "",
  type = "button",
  disabled = false,
  ...props
}) => {
  const baseStyles =
    "px-6 py-3 rounded-xl text-sm font-semibold transition-all inline-flex items-center justify-center gap-2";
  const variants = {
    primary:
      "bg-green-600 text-white hover:bg-green-700 shadow-md disabled:opacity-50 disabled:cursor-not-allowed",
    outlined: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseStyles} ${
        variants[variant] || variants.primary
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Preview Section Component
function PreviewSection({ title, icon: Icon, children }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="border-b border-gray-100 px-5 py-3 bg-gray-50 flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-green-600" />}
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-700">
          {title}
        </h3>
      </div>
      <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
    </div>
  );
}

// Preview Row Component
function PreviewRow({ label, value }) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
        {label}
      </p>
      <p className="text-sm font-medium text-gray-800">{value ?? "-"}</p>
    </div>
  );
}

// Status Badge Component
function StatusBadge({ label, variant = "green" }) {
  const variants = {
    green: "bg-green-50 text-green-700 border-green-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
    red: "bg-red-50 text-red-700 border-red-200",
    gray: "bg-gray-50 text-gray-700 border-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${
        variants[variant] || variants.gray
      }`}
    >
      <BadgeCheck className="h-3 w-3" />
      {label}
    </span>
  );
}

export default function PreviewSubmit({
  setCurrentStep,
  step,
  onComplete,
  productData,
  isEdit,
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [showVideoGallery, setShowVideoGallery] = useState(false);
  const [equipmentData, setEquipmentData] = useState(null);

  useEffect(() => {
    loadData();
  }, [isEdit, productData]);

  const loadData = async () => {
    try {
      const id = isEdit
        ? productData?.id
        : localStorage.getItem("vendorEquipmentId");

      if (!id) return;

      const res = await apiHelper.get(`/vendor-web/equipmentvariant/${id}`);
      setEquipmentData(res.data);

      const variant = res.data?.data ?? res.data;
      if (isEdit && variant?.agreed) {
        setAgreed(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Collect images
  const images = [
    equipmentData?.frontView,
    equipmentData?.leftView,
    equipmentData?.rightView,
    equipmentData?.rearView,
    equipmentData?.mainEquipment,
    equipmentData?.workingMechanism,
    equipmentData?.controlPanel,
    equipmentData?.serialNumberImage,
    equipmentData?.attachmentsImage,
    equipmentData?.tyresWheels,
  ].filter(Boolean);

  // Collect videos
  const videos = [
    equipmentData?.walkaroundVideo,
    equipmentData?.workingVideo,
    equipmentData?.machineStartVideo,
    equipmentData?.ptoWorkingVideo,
    equipmentData?.hydraulicWorkingVideo,
  ].filter(Boolean);

  // Collect documents
  const documents = [
    {
      key: "purchaseInvoice",
      label: "Purchase Invoice",
      file: equipmentData?.purchaseInvoice,
    },
    {
      key: "ownershipProof",
      label: "Ownership Proof",
      file: equipmentData?.ownershipProof,
    },
    {
      key: "warrantyDocument",
      label: "Warranty Document",
      file: equipmentData?.warrantyDocument,
    },
    { key: "insurance", label: "Insurance", file: equipmentData?.insurance },
    {
      key: "serviceRecords",
      label: "Service Records",
      file: equipmentData?.serviceRecords,
    },
    {
      key: "otherDocuments",
      label: "Other Documents",
      file: equipmentData?.otherDocuments,
    },
  ].filter((doc) => doc.file);

  const selectedImage = images[selectedIndex];

  // Helper to check if equipment is in good condition
  const getConditionScore = () => {
    const condition = equipmentData?.overallCondition || "good";
    const scores = {
      excellent: { label: "Excellent", variant: "green" },
      very_good: { label: "Very Good", variant: "green" },
      good: { label: "Good", variant: "blue" },
      average: { label: "Average", variant: "yellow" },
      needs_repair: { label: "Needs Repair", variant: "red" },
    };
    return scores[condition] || scores.good;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const productId = isEdit
        ? productData?.id
        : localStorage.getItem("vendorEquipmentId");

      if (!productId) {
        toast.error("Product ID not found");
        return;
      }

      await apiHelper.put(`/vendor-web/equipmentvariant/${productId}/submit`, {
        agreed,
      });

      toast.success("Equipment submitted successfully for review!");

      if (!isEdit) {
        localStorage.removeItem("vendorProductId");
      }

      navigate("/vendor-profile?tab=products", { replace: true });
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to submit. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = () => toast.success("Draft saved!");

  const handlePrevious = () => {
    if (setCurrentStep) {
      setCurrentStep(step - 1);
    }
  };

  const conditionScore = getConditionScore();

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12 lg:py-16">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <ClipboardCheck className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Review & Submit
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Review all details before submitting your equipment for review
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 lg:p-10 space-y-8">
            {/* Equipment Overview */}
            <div className="rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="mb-6 text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Tractor className="h-5 w-5 text-green-600" />
                Equipment Details
              </h3>

              <div className="grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <div
                    className="relative overflow-hidden rounded-xl bg-gray-100"
                    style={{ minHeight: "250px" }}
                  >
                    {selectedImage ? (
                      <img
                        src={apiHelper.image(selectedImage)}
                        alt="Equipment"
                        className="h-64 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-64 w-full flex-col items-center justify-center">
                        <Tractor className="h-16 w-16 text-gray-300" />
                        <p className="mt-2 text-sm text-gray-400">
                          No image available
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 flex gap-2 overflow-x-auto">
                    {images.slice(0, 5).map((img, index) => (
                      <img
                        key={index}
                        src={apiHelper.image(img)}
                        alt={`thumb-${index}`}
                        onClick={() => setSelectedIndex(index)}
                        className={`h-14 w-14 cursor-pointer rounded-lg object-cover transition-all ${
                          selectedIndex === index
                            ? "border-2 border-green-600 ring-2 ring-green-100"
                            : "border border-gray-200 hover:border-green-300"
                        }`}
                      />
                    ))}
                    {images.length > 5 && (
                      <button
                        type="button"
                        onClick={() => setShowGallery(true)}
                        className="flex h-14 w-14 items-center justify-center rounded-lg border border-gray-200 text-sm font-medium hover:border-green-300 hover:bg-green-50 transition-colors"
                      >
                        +{images.length - 5}
                      </button>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {equipmentData?.productName || "-"}
                    </h2>
                    <StatusBadge
                      label={conditionScore.label}
                      variant={conditionScore.variant}
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3 text-sm">
                    <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
                      <Gauge className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">
                        {equipmentData?.horsePower ||
                          equipmentData?.requiredTractorHp ||
                          "-"}{" "}
                        HP
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
                      <Fuel className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">
                        {equipmentData?.fuelType ||
                          equipmentData?.powerSource ||
                          "-"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
                      <CalendarDays className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">
                        {equipmentData?.manufacturingYear ||
                          equipmentData?.modelYear?.modelYear ||
                          "-"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-gray-100 pt-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      Expected Price
                    </p>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-6 w-6 text-green-600" />
                      <h3 className="text-3xl font-bold text-green-600">
                        ₹{" "}
                        {equipmentData?.expectedPrice?.toLocaleString?.() ??
                          equipmentData?.exShowroomPrice?.toLocaleString?.() ??
                          "-"}
                      </h3>
                      {equipmentData?.negotiable === "yes" && (
                        <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                          Negotiable
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-3">
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <h4 className="mb-3 text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Tag className="h-4 w-4 text-green-600" />
                      Key Highlights
                    </h4>
                    <ul className="space-y-2 text-sm">
                      {[
                        equipmentData?.highlight1,
                        equipmentData?.highlight2,
                        equipmentData?.highlight3,
                        equipmentData?.highlight4,
                        equipmentData?.highlight5,
                      ]
                        .filter(Boolean)
                        .map((highlight, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{highlight}</span>
                          </li>
                        ))}
                      {!equipmentData?.highlight1 && (
                        <li className="text-gray-400 text-center py-2">
                          No highlights added
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Details Sections */}
            <div className="space-y-6">
              {/* Equipment Details */}
              <PreviewSection title="Equipment Details" icon={Tractor}>
                <PreviewRow
                  label="Equipment Type"
                  value={
                    equipmentData?.equipmentType ||
                    equipmentData?.category?.categoryName
                  }
                />
                <PreviewRow
                  label="Brand"
                 value={equipmentData?.brand}
                />
                <PreviewRow
                  label="Model"
                  value={equipmentData?.model}
                />
                <PreviewRow
                  label="Variant"
                   value={equipmentData?.variant}
                />
                <PreviewRow
                  label="Serial Number"
                  value={equipmentData?.serialNumber}
                />
                <PreviewRow
                  label="Product Code"
                  value={equipmentData?.productCode}
                />
                <PreviewRow label="Color" value={equipmentData?.color} />
                <PreviewRow
                  label="Condition"
                  value={
                    equipmentData?.equipmentCondition ||
                    equipmentData?.overallCondition
                  }
                />
              </PreviewSection>

              {/* Technical Specifications */}
              <PreviewSection title="Technical Specifications" icon={Settings}>
                <PreviewRow
                  label="Power Source"
                  value={equipmentData?.powerSource}
                />
                <PreviewRow
                  label="PTO Requirement"
                  value={equipmentData?.ptoRequirement}
                />
                <PreviewRow
                  label="Required Tractor HP"
                  value={equipmentData?.requiredTractorHp}
                />
                <PreviewRow
                  label="Working Width"
                  value={equipmentData?.workingWidth}
                />
                <PreviewRow
                  label="Working Depth"
                  value={equipmentData?.workingDepth}
                />
                <PreviewRow
                  label="Working Capacity"
                  value={equipmentData?.workingCapacity}
                />
                <PreviewRow
                  label="Working Speed"
                  value={equipmentData?.workingSpeed}
                />
                <PreviewRow
                  label="Weight"
                  value={
                    equipmentData?.weight ? `${equipmentData.weight} kg` : "-"
                  }
                />
                <PreviewRow
                  label="Length"
                  value={
                    equipmentData?.length ? `${equipmentData.length} m` : "-"
                  }
                />
                <PreviewRow
                  label="Width"
                  value={
                    equipmentData?.width ? `${equipmentData.width} m` : "-"
                  }
                />
                <PreviewRow
                  label="Height"
                  value={
                    equipmentData?.height ? `${equipmentData.height} m` : "-"
                  }
                />
                <PreviewRow
                  label="Production Capacity"
                  value={equipmentData?.productionCapacity}
                />
                <PreviewRow
                  label="Fuel Consumption"
                  value={equipmentData?.fuelConsumption}
                />
                <PreviewRow label="RPM" value={equipmentData?.rpm} />
                <PreviewRow
                  label="Number of Blades/Tines"
                   value={equipmentData?.numberOfBlades}
                />
                <PreviewRow
                  label="Number of Rows"
                  value={equipmentData?.numberOfRows}
                />
                <PreviewRow
                  label="Tank Capacity"
                  value={
                    equipmentData?.tankCapacity
                      ? `${equipmentData.tankCapacity} L`
                      : "-"
                  }
                />
                {/* Dynamic fields */}
                {equipmentData?.threshingCapacity && (
                  <PreviewRow
                    label="Threshing Capacity"
                    value={equipmentData.threshingCapacity}
                  />
                )}
                {equipmentData?.cropType && (
                  <PreviewRow
                    label="Crop Type"
                    value={equipmentData.cropType}
                  />
                )}
                {equipmentData?.drumSize && (
                  <PreviewRow
                    label="Drum Size"
                    value={equipmentData.drumSize}
                  />
                )}
                {equipmentData?.fanType && (
                  <PreviewRow label="Fan Type" value={equipmentData.fanType} />
                )}
                {equipmentData?.cleaningSystem && (
                  <PreviewRow
                    label="Cleaning System"
                    value={equipmentData.cleaningSystem}
                  />
                )}
                {equipmentData?.rotorRpm && (
                  <PreviewRow
                    label="Rotor RPM"
                    value={equipmentData.rotorRpm}
                  />
                )}
                {equipmentData?.sprayWidth && (
                  <PreviewRow
                    label="Spray Width"
                    value={equipmentData.sprayWidth}
                  />
                )}
                {equipmentData?.pumpType && (
                  <PreviewRow
                    label="Pump Type"
                    value={equipmentData.pumpType}
                  />
                )}
                {equipmentData?.nozzleCount && (
                  <PreviewRow
                    label="Nozzle Count"
                    value={equipmentData.nozzleCount}
                  />
                )}
                {equipmentData?.pressure && (
                  <PreviewRow label="Pressure" value={equipmentData.pressure} />
                )}
              </PreviewSection>

              {/* Condition Score */}
              <PreviewSection title="Condition Score" icon={Shield}>
                <PreviewRow
                  label="Overall Condition"
                  value={conditionScore.label}
                />
                <PreviewRow
                  label="Main Machine"
                  value={equipmentData?.mechanical?.mainMachineCondition}
                />
                <PreviewRow
                  label="Drive System"
                  value={equipmentData?.mechanical?.driveSystem}
                />
                <PreviewRow
                  label="Belt/Chain Condition"
                  value={equipmentData?.mechanical?.beltChainCondition}
                />
                <PreviewRow
                  label="Bearing Condition"
                  value={equipmentData?.mechanical?.bearingCondition}
                />
                <PreviewRow
                  label="Gearbox Condition"
                  value={equipmentData?.mechanical?.gearboxCondition}
                />
                <PreviewRow
                  label="Oil Leakage"
                  value={equipmentData?.oilLeakage}
                />
                <PreviewRow
                  label="Working Condition"
                  value={equipmentData?.workingCondition}
                />
                <PreviewRow
                  label="Wiring"
                  value={equipmentData?.electrical?.wiring}
                />
                <PreviewRow
                  label="Motor/Starter"
                  value={equipmentData?.electrical?.motorStarter}
                />
                <PreviewRow
                  label="Battery"
                  value={equipmentData?.electrical?.battery}
                />
                <PreviewRow
                  label="Lights"
                  value={equipmentData?.electrical?.lights}
                />
                <PreviewRow
                  label="Control Panel"
                  value={equipmentData?.electrical?.controlPanel}
                />
              </PreviewSection>

              {/* Parts / Attachments */}
              <PreviewSection title="Parts & Attachments" icon={Wrench}>
                <PreviewRow
                  label="Blades/Tines"
                  value={equipmentData?.partsCondition?.blades}
                />
                <PreviewRow
                  label="Belts"
                  value={equipmentData?.partsCondition?.belts}
                />
                <PreviewRow
                  label="Bearings"
                  value={equipmentData?.partsCondition?.bearings}
                />
                <PreviewRow
                  label="Chains"
                  value={equipmentData?.partsCondition?.chains}
                />
                <PreviewRow
                  label="Gears"
                  value={equipmentData?.partsCondition?.gears}
                />
                <PreviewRow
                  label="Rollers"
                  value={equipmentData?.partsCondition?.rollers}
                />
                <PreviewRow
                  label="Nozzles"
                  value={equipmentData?.partsCondition?.nozzles}
                />
                <PreviewRow
                  label="Rotavator"
                  value={equipmentData?.attachments?.rotavator ? "Yes" : "No"}
                />
                <PreviewRow
                  label="Cultivator"
                  value={equipmentData?.attachments?.cultivator ? "Yes" : "No"}
                />
                <PreviewRow
                  label="Trailer"
                  value={equipmentData?.attachments?.trailer ? "Yes" : "No"}
                />
                <PreviewRow
                  label="Trolley"
                  value={equipmentData?.attachments?.trolley ? "Yes" : "No"}
                />
                <PreviewRow
                  label="MB Plough"
                  value={equipmentData?.attachments?.mbPlough ? "Yes" : "No"}
                />
                <PreviewRow
                  label="Seed Drill"
                  value={equipmentData?.attachments?.seedDrill ? "Yes" : "No"}
                />
                <PreviewRow
                  label="Sprayer"
                  value={equipmentData?.attachments?.sprayer ? "Yes" : "No"}
                />
                <PreviewRow
                  label="Dozer"
                  value={equipmentData?.attachments?.dozer ? "Yes" : "No"}
                />
                <PreviewRow
                  label="Loader"
                  value={equipmentData?.attachments?.loader ? "Yes" : "No"}
                />
                {equipmentData?.otherAttachmentName && (
                  <PreviewRow
                    label="Other Attachment"
                    value={equipmentData.otherAttachmentName}
                  />
                )}
              </PreviewSection>

              {/* Service History */}
              <PreviewSection title="Service History" icon={Clock}>
                <PreviewRow
                  label="Last Service Date"
                  value={
                    equipmentData?.lastServiceDate
                      ? new Date(
                          equipmentData.lastServiceDate,
                        ).toLocaleDateString("en-IN")
                      : "-"
                  }
                />
                <PreviewRow
                  label="Major Repair"
                  value={equipmentData?.majorRepair}
                />
                <PreviewRow
                  label="Gearbox Repaired"
                  value={equipmentData?.partsReplaced?.gearboxRepaired}
                />
                <PreviewRow
                  label="Belt/Chain Changed"
                  value={equipmentData?.partsReplaced?.beltChainChanged}
                />
                <PreviewRow
                  label="Bearing Changed"
                  value={equipmentData?.partsReplaced?.bearingChanged}
                />
                <PreviewRow
                  label="Accident Damage"
                  value={equipmentData?.accidentDamage}
                />
                <PreviewRow
                  label="Flood Damage"
                  value={equipmentData?.floodDamage}
                />
              </PreviewSection>

              {/* Photos */}
              <div className="rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="border-b border-gray-100 px-5 py-3 bg-gray-50 flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                    <Image className="h-4 w-4 text-green-600" />
                    Photos ({images.length})
                  </h3>
                  <button
                    type="button"
                    className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
                    onClick={() => handlePrevious()}
                  >
                    Edit
                  </button>
                </div>

                <div className="p-5">
                  <div className="flex flex-wrap gap-3">
                    {images.map((img, index) => (
                      <img
                        key={index}
                        src={apiHelper.image(img)}
                        alt={`img-${index}`}
                        className="h-20 w-20 rounded-lg border object-cover hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => {
                          setSelectedIndex(index);
                          setShowGallery(true);
                        }}
                      />
                    ))}
                    {images.length === 0 && (
                      <p className="text-sm text-gray-400">
                        No images uploaded
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Videos */}
              {videos.length > 0 && (
                <div className="rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="border-b border-gray-100 px-5 py-3 bg-gray-50 flex items-center justify-between">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                      <Video className="h-4 w-4 text-green-600" />
                      Videos ({videos.length})
                    </h3>
                    <button
                      type="button"
                      className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
                      onClick={() => handlePrevious()}
                    >
                      Edit
                    </button>
                  </div>

                  <div className="p-5">
                    <div className="flex flex-wrap gap-3">
                      {videos.map((video, index) => (
                        <video
                          key={index}
                          src={apiHelper.image(video)}
                          className="h-32 w-48 rounded-lg border object-cover hover:shadow-lg transition-shadow cursor-pointer"
                          controls
                          onClick={() => setShowVideoGallery(true)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Documents */}
              <div className="rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="border-b border-gray-100 px-5 py-3 bg-gray-50 flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                    <File className="h-4 w-4 text-green-600" />
                    Documents ({documents.length})
                  </h3>
                  <button
                    type="button"
                    className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
                    onClick={() => handlePrevious()}
                  >
                    Edit
                  </button>
                </div>

                <div className="p-5">
                  <div className="flex flex-wrap gap-3">
                    {documents.map((doc, index) => (
                      <a
                        key={index}
                        href={apiHelper.image(doc.file)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm hover:border-green-300 hover:bg-green-50 transition-colors"
                      >
                        <FileText className="h-4 w-4 text-green-600" />
                        <span className="text-gray-700">{doc.label}</span>
                      </a>
                    ))}
                    {documents.length === 0 && (
                      <p className="text-sm text-gray-400">
                        No documents uploaded
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Price */}
              <PreviewSection title="Price" icon={DollarSign}>
                <PreviewRow
                  label="Expected Price"
                  value={`₹ ${
                    equipmentData?.expectedPrice?.toLocaleString?.() ?? "-"
                  }`}
                />
                <PreviewRow
                  label="Negotiable"
                  value={equipmentData?.negotiable}
                />
                <PreviewRow
                  label="Exchange Available"
                  value={equipmentData?.exchangeAvailable}
                />
                <PreviewRow
                  label="Finance Available"
                  value={equipmentData?.financeAvailable}
                />
              </PreviewSection>

              {/* Location */}
              <PreviewSection title="Location" icon={MapPin}>
                <PreviewRow
                  label="Country"
                  value={equipmentData?.country || "India"}
                />
                <PreviewRow label="State" value={equipmentData?.state} />
                <PreviewRow label="District" value={equipmentData?.district} />
                <PreviewRow label="Taluka" value={equipmentData?.taluka} />
                <PreviewRow label="Village" value={equipmentData?.village} />
                <PreviewRow label="Pincode" value={equipmentData?.pincode} />
                <PreviewRow label="Landmark" value={equipmentData?.landmark} />
              </PreviewSection>

              {/* Seller Details */}
              <PreviewSection title="Seller Details" icon={User}>
                <PreviewRow
                  label="Seller Type"
                  value={equipmentData?.sellerType}
                />
                <PreviewRow
                  label="Owner Type"
                  value={equipmentData?.ownerType}
                />
                <PreviewRow
                  label="Ownership Proof"
                  value={
                    equipmentData?.ownershipProofAvailable
                      ? "Available"
                      : "Not Available"
                  }
                />
                <PreviewRow label="Usage" value={equipmentData?.usage} />
              </PreviewSection>
            </div>

            {/* Terms Agreement */}
            <div className="rounded-xl border border-gray-200 p-5 bg-gray-50">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-2 focus:ring-green-600 flex-shrink-0"
                />
                <span className="text-sm text-gray-700">
                  I confirm that all the information provided is correct to the
                  best of my knowledge. I agree to the{" "}
                  <a
                    href="#"
                    className="text-green-600 hover:underline font-medium"
                  >
                    Terms &amp; Conditions
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-green-600 hover:underline font-medium"
                  >
                    Listing Policy
                  </a>{" "}
                  of KrushiMall.
                </span>
              </label>
            </div>

            {/* Info Message */}
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-center text-sm text-blue-700 flex items-center justify-center gap-2">
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
              <span>
                Once submitted, our team will review your equipment details. You
                will get notified via email / SMS.
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 md:px-8 lg:px-10 py-6 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between gap-3">
            <Button
              type="button"
              variant="outlined"
              className="min-w-[7rem] order-2 sm:order-1 cursor-pointer"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="flex flex-col sm:flex-row gap-3 order-1 sm:order-2">
              <Button
                type="button"
                variant="outlined"
                className="min-w-[7rem] cursor-pointer"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="outlined"
                className="min-w-[7rem] cursor-pointer"
                onClick={handleSaveDraft}
              >
                <Save className="h-4 w-4" />
                Save Draft
              </Button>
              <Button
                type="button"
                className="min-w-[7rem] cursor-pointer"
                disabled={!agreed || loading}
                onClick={handleSubmit}
              >
                <Send className="h-4 w-4" />
                {loading ? "Submitting..." : isEdit ? "Update" : "Submit"}
              </Button>
            </div>
          </div>
        </div>

        {/* Gallery Modal */}
        <AnimatePresence>
          {showGallery && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="max-h-[80vh] w-full max-w-4xl overflow-auto rounded-2xl bg-white p-6"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">
                    All Images
                  </h3>
                  <button
                    onClick={() => setShowGallery(false)}
                    className="rounded-lg p-2 hover:bg-gray-100 transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
                  {images.map((img, index) => (
                    <motion.img
                      key={index}
                      src={apiHelper.image(img)}
                      alt={`image-${index}`}
                      className="h-32 w-full cursor-pointer rounded-lg border object-cover hover:shadow-lg transition-shadow"
                      onClick={() => {
                        setSelectedIndex(index);
                        setShowGallery(false);
                      }}
                      whileHover={{ scale: 1.05 }}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Video Gallery Modal */}
        <AnimatePresence>
          {showVideoGallery && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="max-h-[80vh] w-full max-w-4xl overflow-auto rounded-2xl bg-white p-6"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">
                    All Videos
                  </h3>
                  <button
                    onClick={() => setShowVideoGallery(false)}
                    className="rounded-lg p-2 hover:bg-gray-100 transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {videos.map((video, index) => (
                    <video
                      key={index}
                      src={apiHelper.image(video)}
                      className="w-full rounded-lg border object-cover"
                      controls
                      autoPlay={false}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
