import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Upload, Trash2, FileText, Image, X, Video, Camera } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { EquipmentMediaDocumentSchema } from "./schema";
import apiHelper from "../../utils/apiHelper";

// Mandatory Photos
const mandatoryPhotos = [
  { key: "frontView", label: "Front View", required: true },
  { key: "leftView", label: "Left View", required: true },
  { key: "rightView", label: "Right View", required: true },
  { key: "rearView", label: "Rear View", required: true },
  { key: "mainEquipment", label: "Main Equipment", required: true },
  { key: "workingMechanism", label: "Working Mechanism", required: true },
  { key: "controlPanel", label: "Control Panel", required: true },
  { key: "serialNumberImage", label: "Serial Number", required: true },
  { key: "attachmentsImage", label: "Attachments", required: false },
  { key: "tyresWheels", label: "Tyres / Wheels (if applicable)", required: false },
];

// Optional Videos
const optionalVideos = [
  { key: "walkaroundVideo", label: "Walkaround Video" },
  { key: "workingVideo", label: "Working Video" },
  { key: "machineStartVideo", label: "Machine Start Video" },
  { key: "ptoWorkingVideo", label: "PTO Working Video" },
  { key: "hydraulicWorkingVideo", label: "Hydraulic Working Video" },
];

// Documents
const documentUploads = [
  { key: "purchaseInvoice", label: "Purchase Invoice", required: false },
  { key: "ownershipProof", label: "Ownership Proof", required: false },
  { key: "warrantyDocument", label: "Warranty Document", required: false },
  { key: "insurance", label: "Insurance", required: false },
  { key: "serviceRecords", label: "Service Records", required: false },
  { key: "otherDocuments", label: "Other Documents", required: false },
];

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
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default function MediaDocument({
  setCurrentStep,
  step,
  onComplete,
  productData,
  isEdit,
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState({});
  const [videoPreviews, setVideoPreviews] = useState({});
  const [documents, setDocuments] = useState({});

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    getValues,
    register,
  } = useForm({
    resolver: yupResolver(EquipmentMediaDocumentSchema),
    defaultValues: {},
  });

  useEffect(() => {
    if (!isEdit || !productData) return;

    const newPreviews = {};
    const newVideoPreviews = {};
    const newDocs = {};

    mandatoryPhotos.forEach(({ key }) => {
      if (productData[key]) {
        newPreviews[key] = apiHelper.image(productData[key]);
        setValue(key, productData[key], { shouldValidate: false });
      }
    });

    optionalVideos.forEach(({ key }) => {
      if (productData[key]) {
        newVideoPreviews[key] = apiHelper.image(productData[key]);
        setValue(key, productData[key], { shouldValidate: false });
      }
    });

    documentUploads.forEach(({ key }) => {
      if (productData[key]) {
        newDocs[key] = {
          name: productData[key].split("/").pop().replace(/^\d+-/, ""),
          existingUrl: apiHelper.image(productData[key]),
        };
        setValue(key, productData[key], { shouldValidate: false });
      }
    });

    setPreviews(newPreviews);
    setVideoPreviews(newVideoPreviews);
    setDocuments(newDocs);
  }, [productData, isEdit, setValue, getValues]);

  useEffect(() => {
    // Register mandatory photos
    mandatoryPhotos.forEach(({ key }) => register(key));
    // Register optional videos
    optionalVideos.forEach(({ key }) => register(key));
    // Register documents
    documentUploads.forEach(({ key }) => register(key));
  }, [register]);

  const handleFileChange = (key, file) => {
    if (!file) return;
    setValue(key, file);
    
    // Check if it's a video
    if (file.type.startsWith("video/")) {
      setVideoPreviews((prev) => ({ ...prev, [key]: URL.createObjectURL(file) }));
      setDocuments((prev) => ({ ...prev, [key]: file }));
    } else if (file.type.startsWith("image/")) {
      setPreviews((prev) => ({ ...prev, [key]: URL.createObjectURL(file) }));
      setDocuments((prev) => ({ ...prev, [key]: file }));
    } else {
      // It's a document (PDF, etc.)
      setDocuments((prev) => ({ ...prev, [key]: file }));
    }
  };

  const removeImage = (key) => {
    setValue(key, null);
    setPreviews((prev) => ({ ...prev, [key]: "" }));
    setDocuments((prev) => ({ ...prev, [key]: null }));
  };

  const removeVideo = (key) => {
    setValue(key, null);
    setVideoPreviews((prev) => ({ ...prev, [key]: "" }));
    setDocuments((prev) => ({ ...prev, [key]: null }));
  };

  const removeDocument = (key) => {
    setDocuments((prev) => ({ ...prev, [key]: null }));
    setValue(key, null);
  };

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

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof File) formData.append(key, value);
      });

      await apiHelper.put(
        `/vendor-web/equipmentvariant/${productId}/save-step`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("Media and documents saved!");

      if (onComplete) onComplete(step);
      if (setCurrentStep) setCurrentStep(step + 1);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to save media and documents."
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

  // Render upload box for images
  const renderImageUpload = (image, previews, removeFn, isVideo = false) => {
    const hasPreview = previews[image.key];
    const fileType = isVideo ? "video/*" : "image/*";
    const icon = isVideo ? Video : Image;
    const IconComponent = icon;

    return (
      <div key={image.key}>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
          {image.label}
          {image.required && <span className="text-red-500"> *</span>}
        </label>

        <div className="relative h-48 overflow-hidden rounded-xl border-2 border-dashed border-gray-300 hover:border-green-400 transition-colors bg-gray-50">
          {hasPreview ? (
            <>
              {isVideo ? (
                <video
                  src={hasPreview}
                  className="h-full w-full object-cover"
                  controls
                />
              ) : (
                <img
                  src={hasPreview}
                  alt={image.label}
                  className="h-full w-full object-cover"
                />
              )}
              <button
                type="button"
                onClick={() => removeFn(image.key)}
                className="absolute right-2 top-2 rounded-lg bg-red-600 p-1.5 text-white hover:bg-red-700 transition-colors shadow-md"
              >
                <Trash2 size={16} />
              </button>
            </>
          ) : (
            <label className="flex h-full cursor-pointer flex-col items-center justify-center hover:bg-gray-100 transition-colors">
              <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mb-2">
                <IconComponent className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-sm font-medium text-green-600">
                {isVideo ? "Upload Video" : "Upload Image"}
              </span>
              <span className="text-xs text-gray-400 mt-1">
                Click to browse
              </span>
              <input
                type="file"
                accept={fileType}
                className="hidden"
                onChange={(e) =>
                  handleFileChange(image.key, e.target.files?.[0] || null)
                }
              />
            </label>
          )}
        </div>
        {errors[image.key] && (
          <p className="mt-1 text-xs text-red-600">
            {errors[image.key]?.message}
          </p>
        )}
      </div>
    );
  };

  // Render document upload box
  const renderDocumentUpload = (doc) => {
    const hasDoc = documents[doc.key];

    return (
      <div key={doc.key}>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
          {doc.label}
          {doc.required && <span className="text-red-500"> *</span>}
        </label>

        <div className="relative rounded-xl border-2 border-dashed border-gray-300 hover:border-green-400 transition-colors bg-gray-50">
          {hasDoc ? (
            <div className="flex h-32 flex-col items-center justify-center p-3 text-center">
              <FileText className="h-10 w-10 text-green-600 mb-2" />
              <p className="max-w-full truncate text-xs font-medium text-gray-700">
                {hasDoc?.name || "Document uploaded"}
              </p>
              <p className="text-[10px] text-gray-500">
                {hasDoc?.size
                  ? `${(hasDoc.size / 1024).toFixed(1)} KB`
                  : "Uploaded"}
              </p>
              <button
                type="button"
                onClick={() => removeDocument(doc.key)}
                className="mt-2 text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
              >
                <X size={12} /> Remove
              </button>
            </div>
          ) : (
            <label className="flex h-32 cursor-pointer flex-col items-center justify-center hover:bg-gray-100 transition-colors">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-2">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
              <span className="text-sm font-medium text-green-600">
                Upload Document
              </span>
              <span className="mt-1 text-xs text-gray-400">
                PDF, DOC, JPG, PNG
              </span>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) =>
                  handleFileChange(doc.key, e.target.files?.[0] || null)
                }
              />
            </label>
          )}
        </div>
        {errors[doc.key] && (
          <p className="mt-1 text-xs text-red-600">
            {errors[doc.key]?.message}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12 lg:py-16">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Photos & Documents
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Upload photos, videos and documents for your equipment
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <div className="p-6 md:p-8 lg:p-10 space-y-10">
              {/* Mandatory Photos */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Mandatory Photos
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Upload photos of your equipment from different angles
                </p>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {mandatoryPhotos.map((image) =>
                    renderImageUpload(image, previews, removeImage, false)
                  )}
                </div>
              </div>

              {/* Optional Videos */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Optional Videos
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Upload videos showcasing your equipment
                </p>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {optionalVideos.map((video) =>
                    renderImageUpload(video, videoPreviews, removeVideo, true)
                  )}
                </div>

                <p className="mt-4 text-xs text-gray-500">
                  Supported format: MP4, WebM, AVI (Max size: 50MB)
                </p>
              </div>

              {/* Documents */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Documents
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Upload equipment related documents
                </p>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {documentUploads.map((doc) => renderDocumentUpload(doc))}
                </div>

                <p className="mt-4 text-xs text-gray-500">
                  Supported format: PDF, DOC, JPG, PNG (Max size: 10MB)
                </p>
              </div>

              <div className="text-xs text-gray-500 flex items-center gap-2">
                <span className="text-red-500">*</span> Marked fields are
                mandatory
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