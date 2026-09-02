import { useEffect, useState } from "react";
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

const TOTAL_STEPS = 7;

const WebsiteVariant = () => {
  const { id } = useParams();

  const isEdit = !!id;
  const [step, setStep] = useState(0);

  const [completedSteps, setCompletedSteps] = useState(
    isEdit ? Array.from({ length: TOTAL_STEPS }, (_, i) => i) : [],
  );

  const [productData, setProductData] = useState(null);

  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      try {
        const res = await apiHelper.get(`/vendor-web/used-website-variant/${id}`);
        setProductData(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    loadProduct();
  }, [id]);

  const handleStepChange = (newStep) => {
    if (newStep <= step) {
      setStep(newStep);
      return;
    }

    if (newStep === step + 1) {
      setCompletedSteps((prev) =>
        prev.includes(step) ? prev : [...prev, step],
      );

      setStep(newStep);
      return;
    }

    if (completedSteps.includes(newStep)) {
      setStep(newStep);
    }
  };

  const markStepCompleted = (stepId) => {
    setCompletedSteps((prev) =>
      prev.includes(stepId) ? prev : [...prev, stepId],
    );
  };

  // ✅ Naya: har step ke successful save ke baad parent ka productData
  // state update karo, taaki "Previous" ya Preview par jaake wapas
  // aane par bhi data yahi se milta rahe — koi extra fetch call
  // ki zaroorat nahi.
  const handleProductSaved = (data) => {
    if (!data) return;
    setProductData((prev) => ({ ...(prev || {}), ...data }));
  };

  const commonProps = {
    step,
    completedSteps,
    setCurrentStep: handleStepChange,
    onComplete: markStepCompleted,
    onProductSaved: handleProductSaved, // ✅ add this
    productData,
    isEdit,
  };

  return (
    <AddProductStepper
      currentStep={step}
      setCurrentStep={handleStepChange}
      completedSteps={completedSteps}
      isEdit={isEdit}
    >
      {step === 0 && <BasicInformation {...commonProps} />}
      {step === 1 && <EngineDetails {...commonProps} />}

      {step === 2 && <HydraulicTyres {...commonProps} />}
      {step === 3 && <Transmission {...commonProps} />}
      {step === 4 && <PriceLocation {...commonProps} />}
      {step === 5 && <MediaDocument {...commonProps} />}
      {step === 6 && <PreviewSubmit {...commonProps} />}
    </AddProductStepper>
  );
};

export default WebsiteVariant;