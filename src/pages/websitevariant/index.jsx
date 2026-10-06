import { useEffect, useState } from "react";
import EntryType from "./EntryType";
import BasicInformation from "./Basicinformation";
import EngineDetails from "./Enginedetails";
import Transmission from "./Transmission";
import HydraulicTyres from "./Hydraulictyres";
import PriceLocation from "./Pricelocation";
import MediaDocument from "./Mediadocument";
import PreviewSubmit from "./Previewsubmit";
import AddProductStepper from "./AddProductStepper";
import { useParams } from "react-router-dom";
import apiHelper from "../../utils/apiHelper";

// Entry Type + Basic Info, Engine, Transmission, Hydraulic Tyres,
// Pricing, Documentation, Preview
const TOTAL_STEPS = 8;

// Edit mode me Entry Type (step 0) skip hota hai, Basic Info (step 1) se start
const FIRST_EDIT_STEP = 1;

// Auto mode: in fields ko copy nahi karna
const AUTOFILL_EXCLUDED_KEYS = [
  "id",
  "createdAt",
  "updatedAt",
  "vendorId",
  "vendorAdminId",
  "createdById",
  "createdBy",
  "createdType",
  "isCompleted",
  "status",
  "currentStep",
  "enquiryCount",
  "entryMode",
  "clonedFromId",
];

const WebsiteVariant = () => {
  const { id } = useParams();
  const isEdit = !!id;

  // ✅ Edit me Entry Type (step 0) skip -> seedha Basic Info se start
  const [step, setStep] = useState(isEdit ? FIRST_EDIT_STEP : 0);

  const [completedSteps, setCompletedSteps] = useState(
    isEdit ? Array.from({ length: TOTAL_STEPS }, (_, i) => i) : [],
  );

  const [productData, setProductData] = useState(null);
  const [entry, setEntry] = useState({ mode: "manual", sourceId: null });

  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      try {
        const res = await apiHelper.get(`/vendor-web/website-variant/${id}`);
        setProductData(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    loadProduct();
  }, [id]);

  const handleStepChange = (newStep) => {
    // ✅ Edit mode me step 0 (Entry Type) par kabhi wapas nahi jaana
    if (isEdit && newStep < FIRST_EDIT_STEP) return;

    // Always allow going backwards
    if (newStep > step && !isEdit && !productData?.id && newStep !== step + 1) {
      return;
    }

    // Sirf agla step
    if (newStep === step + 1) {
      setCompletedSteps((prev) =>
        prev.includes(step) ? prev : [...prev, step],
      );
      setStep(newStep);
      return;
    }

    // ✅ Edit mode: koi bhi step directly clickable
    if (isEdit) {
      setStep(newStep);
      return;
    }

    // Completed step par direct click
    if (completedSteps.includes(newStep)) {
      setStep(newStep);
    }
  };

  const markStepCompleted = (stepId) => {
    setCompletedSteps((prev) =>
      prev.includes(stepId) ? prev : [...prev, stepId],
    );
  };

  const handleProductSaved = (data) => {
    if (!data) return;
    setProductData((prev) => ({ ...(prev || {}), ...data }));
  };

  const handleAutoFill = (source) => {
    // Stale draft id hatao
    localStorage.removeItem("vendorProductId");

    if (!source) {
      setProductData(null);
      setCompletedSteps([]);
      return;
    }

    const rest = Object.fromEntries(
      Object.entries(source).filter(
        ([key]) => !AUTOFILL_EXCLUDED_KEYS.includes(key),
      ),
    );

    setProductData(rest);
    // Entry Type + saare steps checked
    setCompletedSteps(Array.from({ length: TOTAL_STEPS }, (_, i) => i));
  };

  const commonProps = {
    step,
    completedSteps,
    setCurrentStep: handleStepChange,
    onComplete: markStepCompleted,
    onProductSaved: handleProductSaved,
    onAutoFill: handleAutoFill,
    productData,
    isEdit,
    entry,
    setEntry,
  };

  return (
    <AddProductStepper
      currentStep={step}
      setCurrentStep={handleStepChange}
      completedSteps={completedSteps}
      isEdit={isEdit}
    >
      {step === 0 && !isEdit && <EntryType {...commonProps} />}
      {step === 1 && <BasicInformation {...commonProps} />}
      {step === 2 && <EngineDetails {...commonProps} />}
      {step === 3 && <Transmission {...commonProps} />}
      {step === 4 && <HydraulicTyres {...commonProps} />}
      {step === 5 && <PriceLocation {...commonProps} />}
      {step === 6 && <MediaDocument {...commonProps} />}
      {step === 7 && <PreviewSubmit {...commonProps} />}
    </AddProductStepper>
  );
};

export default WebsiteVariant;