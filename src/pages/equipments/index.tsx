import { useEffect, useState } from "react";
import BasicInformation from "./BasicInformation";
import EquipmentSpecifications from "./EquipmentSpecifications";
import EquipmentCondition from "./EquipmentCondition";
import EquipmentPartsService from "./EquipmentPartsService";
import PriceLocation from "./PriceLocation";
import MediaDocument from "./MediaDocument";
import PreviewSubmit from "./PreviewSubmit";
import AddProductStepper from "./EquipmentStepper"; // Reuse same stepper shell
import { useParams } from "react-router-dom";
import apiHelper from "../../utils/apiHelper";

// Total number of steps in the flow (Basic Info, Specifications,
// Condition, Parts & Service, Price & Location, Photos & Documents,
// Review & Submit)
const TOTAL_STEPS = 7;

const EquipmentVariant = () => {
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
        const res = await apiHelper.get(`/vendor-web/equipmentvariant/${id}`);
        setProductData(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    loadProduct();
  }, [id]);

  const handleStepChange = (newStep: any) => {
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

  const markStepCompleted = (stepId: any) => {
    setCompletedSteps((prev) =>
      prev.includes(stepId) ? prev : [...prev, stepId],
    );
  };

  // ✅ Naya: har step ke successful save ke baad parent ka productData
  // state update karo, taaki "Previous" ya kisi aur step par jaake
  // wapas aane par bhi data yahi se milta rahe.
  const handleProductSaved = (data: any) => {
    if (!data) return;
    setProductData((prev: any) => ({ ...(prev || {}), ...data }));
  };

  const commonProps = {
    step,
    completedSteps,
    setCurrentStep: handleStepChange,
    onComplete: markStepCompleted,
    onProductSaved: handleProductSaved, // ✅ add
    productData,
    isEdit,
    id,
  };

  return (
    <AddProductStepper
      currentStep={step}
      setCurrentStep={handleStepChange}
      completedSteps={completedSteps}
      isEdit={isEdit}
    >
      {step === 0 && <BasicInformation {...commonProps} />}
      {step === 1 && <EquipmentSpecifications {...commonProps} />}
      {step === 2 && <EquipmentCondition {...commonProps} />}
      {step === 3 && <EquipmentPartsService {...commonProps} />}
      {step === 4 && <PriceLocation {...commonProps} />}
      {step === 5 && <MediaDocument {...commonProps} />}
      {step === 6 && <PreviewSubmit {...commonProps} />}
    </AddProductStepper>
  );
};

export default EquipmentVariant;