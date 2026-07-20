import { useState, useEffect } from "react";
import { CheckCircle, Gauge, Tractor, Fuel, CalendarDays, FileText, ChevronLeft, Save, Send, X, MapPin, Tag, DollarSign, Package } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import apiHelper from "../../utils/apiHelper";

// Custom Button Component
const Button = ({ children, variant = "primary", className = "", type = "button", disabled = false, ...props }) => {
  const baseStyles = "px-6 py-3 rounded-xl text-sm font-semibold transition-all inline-flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-green-600 text-white hover:bg-green-700 shadow-md disabled:opacity-50 disabled:cursor-not-allowed",
    outlined: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
  };
  
  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

function PreviewSection({ title, children }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="border-b border-gray-100 px-5 py-3 text-sm font-semibold uppercase tracking-wider text-gray-700 bg-gray-50">
        {title}
      </h3>
      <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </div>
  );
}

function PreviewRow({ label, value }) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs font-medium uppercase tracking-wider text-gray-400">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value ?? "-"}</p>
    </div>
  );
}

export default function PreviewSubmit({ 
  setCurrentStep, 
  setFinished,
   step,
  completedSteps,
  onComplete, 
  productData,   
  isEdit,

}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [tractorData, setTractorData] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

 useEffect(() => {
  loadData();
}, [isEdit, productData]);

const loadData = async () => {
  try {
    const id = isEdit
      ? productData?.id
      : localStorage.getItem("vendorProductId");

    if (!id) return;

    const res = await apiHelper.get(`/vendor-web/website-variant/${id}`);
    setTractorData(res.data);
  } catch (error) {
    console.error(error);
  }
};

  const images = [
    tractorData?.frontView,
    tractorData?.leftView,
    tractorData?.rightView,
    tractorData?.rearView,
    tractorData?.engineView,
    tractorData?.dashboardView,
    tractorData?.tyreView,
    tractorData?.hydraulicView,
    tractorData?.ptoView,
    tractorData?.additionalImage1,
    tractorData?.additionalImage2,
    tractorData?.additionalImage3,
    tractorData?.additionalImage4,
    tractorData?.additionalImage5,
  ].filter(Boolean);

  const documentFiles = [
    tractorData?.brochure,
    tractorData?.invoice,
    tractorData?.insuranceCertificate,
    tractorData?.rcBook,
    tractorData?.warrantyCard,
    tractorData?.others,
  ].filter(Boolean);

  const selectedImage = images[selectedIndex];

  const handleSubmit = async () => {
  try {
    setLoading(true);

    const productId = isEdit
      ? productData?.id
      : localStorage.getItem("vendorProductId");

    if (!productId) {
      toast.error("Product ID not found");
      return;
    }

    await apiHelper.put(
      `/vendor-web/website-variant/${productId}/submit`,
      { agreed }
    );

    toast.success("Tractor submitted successfully for review!");

    // Only clean up the temp id if it was a create-flow submission
    if (!isEdit) {
      localStorage.removeItem("vendorProductId");
    }

    navigate("/vendor-profile?tab=products", { replace: true });
  } catch (error) {
    console.error(error);
    toast.error(
      error.response?.data?.message || "Failed to submit. Please try again."
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

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12 lg:py-16">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Preview & Submit</h1>
          <p className="text-sm text-gray-500 mt-1">
            Review all details before submitting your product for review
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 lg:p-10 space-y-8">
            {/* Tractor Overview */}
            <div className="rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="mb-6 text-lg font-semibold text-gray-900">Tractor Overview</h3>

              <div className="grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <div className="relative overflow-hidden rounded-xl bg-gray-100" style={{ minHeight: "250px" }}>
                    {selectedImage ? (
                      <img 
                        src={apiHelper.getImageUrl(selectedImage)} 
                        alt="Tractor" 
                        className="h-64 w-full object-cover" 
                      />
                    ) : (
                      <div className="flex h-64 w-full flex-col items-center justify-center">
                        <Tractor className="h-16 w-16 text-gray-300" />
                        <p className="mt-2 text-sm text-gray-400">No image available</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 flex gap-2 overflow-x-auto">
                    {images.slice(0, 5).map((img, index) => (
                      <img
                        key={index}
                        src={apiHelper.getImageUrl(img)}
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
                    <h2 className="text-2xl font-bold text-gray-900">{tractorData?.productName || "-"}</h2>
                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 border border-green-200">
                      New Tractor
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-5 text-sm">
                    <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
                      <Gauge className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">{tractorData?.horsePower} HP</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
                      <Fuel className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">{tractorData?.fuelType}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
                      <CalendarDays className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">{tractorData?.modelYear?.modelYear}</span>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-gray-100 pt-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Ex-Showroom Price</p>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-6 w-6 text-green-600" />
                      <h3 className="text-3xl font-bold text-green-600">
                        ₹ {tractorData?.exShowroomPrice?.toLocaleString?.() ?? "-"}
                      </h3>
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
                        tractorData?.highlight1,
                        tractorData?.highlight2,
                        tractorData?.highlight3,
                        tractorData?.highlight4,
                        tractorData?.highlight5,
                      ]
                        .filter(Boolean)
                        .map((highlight, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{highlight}</span>
                          </li>
                        ))}
                      {!tractorData?.highlight1 && (
                        <li className="text-gray-400 text-center py-2">No highlights added</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Details Sections */}
            <div className="space-y-6">
              <PreviewSection title="Basic Information">
                <PreviewRow label="Brand" value={tractorData?.brand?.brandName} />
                <PreviewRow label="Category" value={tractorData?.category?.categoryName} />
                <PreviewRow label="Model" value={tractorData?.model?.modelName} />
                <PreviewRow
                  label="Launch Year"
                  value={tractorData?.launchYear ? new Date(tractorData.launchYear).toLocaleDateString("en-IN") : "-"}
                />
                <PreviewRow label="Variant" value={tractorData?.variant?.variantName} />
                <PreviewRow label="Country of Origin" value={tractorData?.country || "India"} />
                <PreviewRow label="Tractor Status" value={tractorData?.tractorStatus} />
                <PreviewRow label="Stock Status" value={tractorData?.stockStatus} />
              </PreviewSection>

              <PreviewSection title="Engine Details">
                <PreviewRow label="Horse Power" value={`${tractorData?.horsePower || "-"} HP`} />
                <PreviewRow label="Engine Type" value={tractorData?.engineType} />
                <PreviewRow label="Fuel Type" value={tractorData?.fuelType} />
                <PreviewRow label="No. Of Cylinders" value={tractorData?.numberOfCylinders} />
                <PreviewRow label="Cubic Capacity" value={tractorData?.cubicCapacity} />
                <PreviewRow label="Aspirated Type" value={tractorData?.aspiratedType} />
                <PreviewRow label="Air Filter" value={tractorData?.airFilterType} />
                <PreviewRow label="Cooling System" value={tractorData?.coolingSystem} />
                <PreviewRow label="Torque RPM" value={tractorData?.torqueRpm} />
                <PreviewRow label="Emission Norms" value={tractorData?.emissionNorms} />
                <PreviewRow label="Engine Condition" value={tractorData?.engineCondition} />
              </PreviewSection>

              <PreviewSection title="Transmission Details">
                <PreviewRow label="Clutch Type" value={tractorData?.clutchType} />
                <PreviewRow label="Forward Gears" value={tractorData?.forwardGears} />
                <PreviewRow label="Reverse Gears" value={tractorData?.reverseGears} />
                <PreviewRow label="Gear Type" value={tractorData?.gearType} />
                <PreviewRow label="Transmission Type" value={tractorData?.transmissionType} />
                <PreviewRow label="PTO HP" value={tractorData?.ptoHp} />
                <PreviewRow label="PTO RPM" value={tractorData?.ptoRpm} />
                <PreviewRow label="PTO Type" value={tractorData?.ptoType} />
                <PreviewRow label="PTO Position" value={tractorData?.ptoPosition} />
              </PreviewSection>

              <PreviewSection title="Hydraulic & Tyres">
                <PreviewRow label="Lifting Capacity" value={tractorData?.liftingCapacity} />
                <PreviewRow label="Lifting Capacity @610mm" value={tractorData?.liftingCapacityAt610mm} />
                <PreviewRow label="Hydraulic Type" value={tractorData?.hydraulicType} />
                <PreviewRow label="Control Type" value={tractorData?.controlType} />
                <PreviewRow label="Remote Valve Type" value={tractorData?.remoteValveType} />
                <PreviewRow label="Number Of Remote Valves" value={tractorData?.numberOfRemoteValves} />
                <PreviewRow label="3 Point Linkage" value={tractorData?.threePointLinkage} />
                <PreviewRow label="Linkage Category" value={tractorData?.linkageCategory} />
                <PreviewRow label="Top Link" value={tractorData?.topLink} />
                <PreviewRow label="Draft Sensitivity" value={tractorData?.draftSensitivity} />
              </PreviewSection>

              <PreviewSection title="Price & Location">
                <PreviewRow label="Ex-Showroom Price" value={`₹ ${tractorData?.exShowroomPrice?.toLocaleString?.() ?? "-"}`} />
                <PreviewRow label="On-Road Price" value={`₹ ${tractorData?.onRoadPrice?.toLocaleString?.() ?? "-"}`} />
                <PreviewRow label="GST" value={`${tractorData?.gst || "-"}%`} />
                <PreviewRow label="TCS" value={tractorData?.tcsApplicable} />
                <PreviewRow label="Finance Available" value={tractorData?.financeAvailable} />
                <PreviewRow label="EMI Available" value={tractorData?.emiAvailable ? "Yes" : "No"} />
                <PreviewRow label="Negotiable" value={tractorData?.negotiable} />
                <PreviewRow label="State" value={tractorData?.state} />
                <PreviewRow label="District" value={tractorData?.district} />
                <PreviewRow label="Taluka" value={tractorData?.taluka} />
                <PreviewRow label="City" value={tractorData?.city} />
                <PreviewRow label="Landmark" value={tractorData?.landmark} />
                <PreviewRow label="Pincode" value={tractorData?.pincode} />
                <PreviewRow label="Address" value={tractorData?.fullAddress} />
              </PreviewSection>

              {/* Media & Documents */}
              <div className="rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="border-b border-gray-100 px-5 py-3 bg-gray-50 flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-700">Media & Documents</h3>
                  <button 
                    type="button" 
                    className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
                    onClick={() => handlePrevious()}
                  >
                    Edit
                  </button>
                </div>

                <div className="p-5">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="mb-3 text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Package className="h-4 w-4 text-green-600" />
                        Images ({images.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {images.slice(0, 5).map((img, index) => (
                          <img 
                            key={index} 
                            src={apiHelper.getImageUrl(img)} 
                            alt={`img-${index}`} 
                            className="h-16 w-16 rounded-lg border object-cover hover:shadow-md transition-shadow" 
                          />
                        ))}
                        {images.length > 5 && (
                          <button
                            type="button"
                            onClick={() => setShowGallery(true)}
                            className="flex h-16 w-16 items-center justify-center rounded-lg border border-gray-200 text-sm font-medium hover:border-green-300 hover:bg-green-50 transition-colors"
                          >
                            +{images.length - 5}
                          </button>
                        )}
                        {images.length === 0 && (
                          <p className="text-sm text-gray-400">No images uploaded</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="mb-3 text-sm font-medium text-gray-700 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-green-600" />
                        Documents ({documentFiles.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {documentFiles.slice(0, 3).map((doc, index) => (
                          <a
                            key={index}
                            href={apiHelper.getImageUrl(doc)}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:border-green-300 hover:bg-green-50 transition-colors"
                          >
                            <FileText className="h-4 w-4 text-green-600" />
                            <span className="text-gray-700">PDF {index + 1}</span>
                          </a>
                        ))}
                        {documentFiles.length > 3 && (
                          <div className="flex items-center rounded-lg border px-3 py-2 text-sm bg-gray-50">
                            +{documentFiles.length - 3} more
                          </div>
                        )}
                        {documentFiles.length === 0 && (
                          <p className="text-sm text-gray-400">No documents uploaded</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
                  I confirm that all the information provided is correct to the best of my knowledge. I agree to the{" "}
                  <a href="#" className="text-green-600 hover:underline font-medium">Terms &amp; Conditions</a> and{" "}
                  <a href="#" className="text-green-600 hover:underline font-medium">Listing Policy</a> of KrushiMall.
                </span>
              </label>
            </div>

            {/* Info Message */}
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-center text-sm text-blue-700 flex items-center justify-center gap-2">
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
              <span>Once submitted, our team will review your tractor details. You will get notified via email / SMS.</span>
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
              <ChevronLeft className="h-4 w-4" />
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
                <Save className="h-4 w-4" />
                Save Draft
              </Button>
              <Button 
                type="button" 
                className="min-w-[7rem]"
                disabled={!agreed || loading}
                onClick={handleSubmit}
              >
                <Send className="h-4 w-4" />
                {loading ? "Submitting..." : "Submit"}
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
                  <h3 className="text-xl font-bold text-gray-900">All Images</h3>
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
                      src={apiHelper.getImageUrl(img)}
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
      </div>
    </div>
  );
}