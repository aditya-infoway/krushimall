// import { useState } from "react";
// import BasicInformation from "./Basicinformation";
// import EngineDetails from "./Enginedetails";
// import Transmission from "./Transmission";
// import HydraulicTyres from "./Hydraulictyres";
// import PriceLocation from "./Pricelocation";
// import MediaDocument from "./Mediadocument";
// import PreviewSubmit from "./Previewsubmit";

// const WebsiteVariant = () => {
//   const [step, setStep] = useState(1);

//   const nextStep = () => setStep((prev) => prev + 1);
//   const prevStep = () => setStep((prev) => prev - 1);

//   const commonProps = {
//     nextStep,
//     prevStep,
//     step,
//   };

//   return (
//     <>
//       {step === 1 && <BasicInformation {...commonProps} />}
//       {step === 2 && <EngineDetails {...commonProps} />}
//       {step === 3 && <Transmission {...commonProps} />}
//       {step === 4 && <HydraulicTyres {...commonProps} />}
//       {step === 5 && <PriceLocation {...commonProps} />}
//       {step === 6 && <MediaDocument {...commonProps} />}
//       {step === 7 && <PreviewSubmit {...commonProps} />}
//     </>
//   );
// };

// export default WebsiteVariant;


import { useState } from "react";
import BasicInformation from "./Basicinformation";
import EngineDetails from "./Enginedetails";
import Transmission from "./Transmission";
import HydraulicTyres from "./Hydraulictyres";
import PriceLocation from "./Pricelocation";
import MediaDocument from "./Mediadocument";
import PreviewSubmit from "./Previewsubmit";
import AddProductStepper from "./AddProductStepper"; // Import the stepper

const WebsiteVariant = () => {
  const [step, setStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  const nextStep = () => {
    // Mark current step as completed before moving forward
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
    setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  // Handle step navigation with validation
  const handleStepChange = (newStep) => {
    // Allow going back to any previous step
    if (newStep < step) {
      setStep(newStep);
      return;
    }
    
    // Only allow going forward if current step is completed
    if (completedSteps.includes(step) || newStep === step + 1) {
      setStep(newStep);
    }
  };

  // Mark a step as completed (for cases where user saves without moving forward)
  const markStepCompleted = (stepId) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  const commonProps = {
    nextStep,
    prevStep,
    step,
    completedSteps,
    setCurrentStep: handleStepChange,
    onComplete: markStepCompleted,
  };

  return (
    <AddProductStepper 
      currentStep={step}
      setCurrentStep={handleStepChange}
      completedSteps={completedSteps}
    >
     {step === 0 && <BasicInformation />}
{step === 1 && <EngineDetails />}
{step === 2 && <Transmission />}
{step === 3 && <HydraulicTyres />}
{step === 4 && <PriceLocation />}
{step === 5 && <MediaDocument />}
{step === 6 && <PreviewSubmit />}
    </AddProductStepper>
  );
};

export default WebsiteVariant;