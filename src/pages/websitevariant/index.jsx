import { useEffect, useState } from "react";
import BasicInformation from "./Basicinformation";
import EngineDetails from "./Enginedetails";
import Transmission from "./Transmission";
import HydraulicTyres from "./Hydraulictyres";
import PriceLocation from "./Pricelocation";
import MediaDocument from "./Mediadocument";
import PreviewSubmit from "./Previewsubmit";
import AddProductStepper from "./AddProductStepper"; // Import the stepper
import { useParams } from "react-router-dom";
import apiHelper from "../../utils/apiHelper";



const WebsiteVariant = () => {
  const { id } = useParams();

const isEdit = !!id;
  const [step, setStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [productData, setProductData] = useState(null);

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

  // Handle step navigation with validation
  const handleStepChange = (newStep) => {
    // Always allow going backwards
    if (newStep <= step) {
      setStep(newStep);
      return;
    }

    // Allow going only to the next step
    if (newStep === step + 1) {
      setCompletedSteps((prev) =>
        prev.includes(step) ? prev : [...prev, step],
      );

      setStep(newStep);
      return;
    }

    // Allow clicking any completed step
    if (completedSteps.includes(newStep)) {
      setStep(newStep);
    }
  };

  // Mark a step as completed (for cases where user saves without moving forward)
  const markStepCompleted = (stepId) => {
    setCompletedSteps((prev) =>
      prev.includes(stepId) ? prev : [...prev, stepId],
    );
  };

const commonProps = {
    step,
    completedSteps,
    setCurrentStep: handleStepChange,
    onComplete: markStepCompleted,
    productData,
    isEdit,
};

  return (
    <AddProductStepper
      currentStep={step}
      setCurrentStep={handleStepChange}
      completedSteps={completedSteps}
    >
      {step === 0 && <BasicInformation {...commonProps} />}
      {step === 1 && <EngineDetails {...commonProps} />}
      {step === 2 && <Transmission {...commonProps} />}
      {step === 3 && <HydraulicTyres {...commonProps} />}
      {step === 4 && <PriceLocation {...commonProps} />}
      {step === 5 && <MediaDocument {...commonProps} />}
      {step === 6 && <PreviewSubmit {...commonProps} />}
    </AddProductStepper>
  );
};

export default WebsiteVariant;
