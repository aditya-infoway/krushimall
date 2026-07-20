import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Upload, Trash2, FileText, Image, X } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { MediaDocumnetSchema } from "./schema";
import apiHelper from "../../utils/apiHelper";

const imageUploads = [
  { key: "frontView", label: "Front View", required: true },
  { key: "leftView", label: "Left View", required: true },
  { key: "rightView", label: "Right View", required: true },
  { key: "rearView", label: "Rear View", required: true },
  { key: "engineView", label: "Engine View", required: true },
  { key: "dashboardView", label: "Dashboard View", required: true },
  { key: "tyreView", label: "Tyre View", required: true },
  { key: "hydraulicView", label: "Hydraulic View", required: true },
  { key: "ptoView", label: "PTO View", required: true },
  { key: "chassisNumber", label: "Chassis Number", required: true },
  { key: "rcBook", label: "RC Book", required: true },
  { key: "additionalImage1", label: "Additional Image 1", required: false },
  { key: "additionalImage2", label: "Additional Image 2", required: false },
  { key: "additionalImage3", label: "Additional Image 3", required: false },
  { key: "additionalImage4", label: "Additional Image 4", required: false },
  { key: "additionalImage5", label: "Additional Image 5", required: false },
];

const documentUploads = [
  { key: "brochure", label: "Brochure / Spec Sheet", required: true },
  { key: "warrantyCard", label: "Warranty Card", required: true },
  {
    key: "insuranceCertificate",
    label: "Insurance Certificate",
    required: true,
  },
  { key: "invoice", label: "Invoice", required: true },
  { key: "others", label: "Others (Optional)", required: false },
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

export default function MediaDocument({
  setCurrentStep,
  step,
  completedSteps,
  onComplete,
  productData,
  isEdit,
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState({});
  const [documents, setUploadedDocs] = useState({});

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    getValues,
    register,
  } = useForm({
    resolver: yupResolver(MediaDocumnetSchema),
    defaultValues: {},
  });

  useEffect(() => {
    if (!isEdit || !productData) return;

    const newPreviews = {};
    const newDocs = {};

    imageUploads.forEach(({ key }) => {
      if (productData[key]) {
        newPreviews[key] = apiHelper.image(productData[key]);
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
    setUploadedDocs(newDocs);

    console.log("productData keys:", Object.keys(productData));
    console.log("form values after setValue:", getValues());
  }, [productData, isEdit, setValue, getValues]);

  useEffect(() => {
    register("frontView");
    register("leftView");
    register("rightView");
    register("rearView");
    register("engineView");
    register("dashboardView");
    register("tyreView");
    register("hydraulicView");
    register("ptoView");
    register("chassisNumber");
    register("rcBook");
    register("brochure");
    register("warrantyCard");
    register("insuranceCertificate");
    register("invoice");
  }, [register]);

  const handleFileChange = (key, file) => {
    if (!file) return;
    setValue(key, file);
    setUploadedDocs((prev) => ({ ...prev, [key]: file }));
    if (file.type.startsWith("image/")) {
      setPreviews((prev) => ({ ...prev, [key]: URL.createObjectURL(file) }));
    }
  };

  const removeImage = (key) => {
    setValue(key, null);
    setPreviews((prev) => ({ ...prev, [key]: "" }));
  };

  const removeDocument = (key) => {
    setUploadedDocs((prev) => ({ ...prev, [key]: null }));
    setValue(key, null);
  };

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

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof File) formData.append(key, value);
      });

      await apiHelper.put(
        `/vendor-web/website-variant/${productId}/save-step`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      toast.success("Media and documents saved!");

      if (onComplete) onComplete(step);
      if (setCurrentStep) setCurrentStep(step + 1);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to save media and documents.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = () => {
    const formData = watch();
    toast.success("Draft saved!");
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
            Media & Documents
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Upload images and documents for your product
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <div className="p-6 md:p-8 lg:p-10 space-y-10">
              {/* Images Upload */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Images Upload
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Upload images of your tractor from different angles
                </p>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {imageUploads.map((image) => (
                    <div key={image.key}>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        {image.label}
                        {image.required && (
                          <span className="text-red-500"> *</span>
                        )}
                      </label>

                      <div className="relative h-48 overflow-hidden rounded-xl border-2 border-dashed border-gray-300 hover:border-green-400 transition-colors bg-gray-50">
                        {previews[image.key] ? (
                          <>
                            <img
                              src={previews[image.key]}
                              alt={image.label}
                              className="h-full w-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(image.key)}
                              className="absolute right-2 top-2 rounded-lg bg-red-600 p-1.5 text-white hover:bg-red-700 transition-colors shadow-md"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        ) : (
                          <label className="flex h-full cursor-pointer flex-col items-center justify-center hover:bg-gray-100 transition-colors">
                            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mb-2">
                              <Upload className="h-6 w-6 text-green-600" />
                            </div>
                            <span className="text-sm font-medium text-green-600">
                              Upload Image
                            </span>
                            <span className="text-xs text-gray-400 mt-1">
                              Click to browse
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleFileChange(
                                  image.key,
                                  e.target.files?.[0] || null,
                                )
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
                  ))}
                </div>
              </div>

              {/* Documents Uploads */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Documents Uploads
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Upload tractor related documents
                </p>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                  {documentUploads.map((doc) => (
                    <div key={doc.key}>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        {doc.label}
                        {doc.required && (
                          <span className="text-red-500"> *</span>
                        )}
                      </label>

                      <div className="relative rounded-xl border-2 border-dashed border-gray-300 hover:border-green-400 transition-colors bg-gray-50">
                        {documents?.[doc.key] ? (
                          <div className="flex h-32 flex-col items-center justify-center p-3 text-center">
                            <FileText className="h-10 w-10 text-green-600 mb-2" />
                            <p className="max-w-full truncate text-xs font-medium text-gray-700">
                              {documents[doc.key]?.name}
                            </p>
                            <p className="text-[10px] text-gray-500">
                              {documents[doc.key]?.size
                                ? `${(documents[doc.key].size / 1024).toFixed(1)} KB`
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
                              Upload PDF
                            </span>
                            <span className="mt-1 text-xs text-gray-400">
                              Max size: 5MB
                            </span>
                            <input
                              type="file"
                              accept=".pdf"
                              className="hidden"
                              onChange={(e) =>
                                handleFileChange(
                                  doc.key,
                                  e.target.files?.[0] || null,
                                )
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
                  ))}
                </div>

                <p className="mt-4 text-xs text-gray-500">
                  Supported format: PDF (Max size: 5MB)
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
                <Button
                  type="button"
                  variant="outlined"
                  className="min-w-[7rem]"
                  onClick={handleSaveDraft}
                >
                  Save Draft
                </Button>
                <Button
                  type="submit"
                  className="min-w-[7rem]"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save & Next"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
