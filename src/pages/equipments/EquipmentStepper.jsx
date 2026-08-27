import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ChevronRight, ArrowLeft, Package, Settings, Wrench, FileText, Image, DollarSign, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  { id: 0, title: "Basic Information", icon: Package },
  { id: 1, title: "Specifications", icon: Settings },
  { id: 2, title: "Condition", icon: Wrench },
  { id: 3, title: "Parts & Service", icon: FileText },
  { id: 4, title: "Price & Location", icon: DollarSign },
  { id: 5, title: "Photos & Documents", icon: Image },
  { id: 6, title: "Review & Submit", icon: Shield },
];

const VENDOR_PRODUCTS_ROUTE = "/vendor-profile?tab=equipmentProducts";

const EquipmentStepper = ({ children, currentStep, setCurrentStep, completedSteps, isEdit }) => {
  const [isSticky, setIsSticky] = useState(false);
  const stepperRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (stepperRef.current) setIsSticky(stepperRef.current.getBoundingClientRect().top <= 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleStepClick = (stepId) => {
    if (stepId === currentStep) return;
    if (isEdit || completedSteps.includes(stepId) || stepId < currentStep) setCurrentStep(stepId);
  };

  const getStepStatus = (stepId) => {
    if (stepId === currentStep) return "current";
    if (completedSteps.includes(stepId)) return "completed";
    return "upcoming";
  };

  const isStepAccessible = (stepId) =>
    stepId === currentStep || isEdit || completedSteps.includes(stepId) || stepId < currentStep;

  return (
    <div className="min-h-screen bg-gray-50">
      <div ref={stepperRef} className="sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8 pt-8">
          <div className="w-full max-w-6xl mx-auto flex items-start justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(VENDOR_PRODUCTS_ROUTE)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to List
            </button>
          </div>
        </div>

        <div className={`hidden lg:block mt-4 bg-white border-b border-gray-200 transition-all duration-300 ${isSticky ? "shadow-md" : ""}`}>
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="relative">
              <div className="absolute left-0 right-0 top-5 h-0.5 bg-gray-200">
                <div
                  className="h-full bg-green-600 transition-all duration-700 ease-in-out"
                  style={{ width: `${isEdit ? 100 : (currentStep / (STEPS.length - 1)) * 100}%` }}
                />
              </div>
              <div className="relative flex justify-between">
                {STEPS.map((step) => {
                  const status = getStepStatus(step.id);
                  const isAccessible = isStepAccessible(step.id);
                  const Icon = step.icon;
                  return (
                    <div key={step.id} className="flex flex-col items-center">
                      <button
                        onClick={() => handleStepClick(step.id)}
                        disabled={!isAccessible}
                        className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                          status === "completed"
                            ? "bg-green-600 border-green-600 text-white cursor-pointer hover:scale-110"
                            : status === "current"
                            ? "bg-white border-green-600 text-green-600 shadow-lg shadow-green-100 cursor-default"
                            : "bg-white border-gray-300 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {status === "completed" ? <CheckCircle className="h-5 w-5" /> : <Icon className={`h-5 w-5 ${status === "current" ? "text-green-600" : "text-gray-400"}`} />}
                      </button>
                      <div className="mt-3 text-center">
                        <p className={`text-xs font-medium transition-all duration-300 ${status === "completed" ? "text-green-600" : status === "current" ? "text-gray-900 font-semibold" : "text-gray-400"}`}>
                          {step.title}
                        </p>
                        {status === "current" && (
                          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} className="h-0.5 w-8 bg-green-600 mx-auto mt-1" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">Step {currentStep + 1}</span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{STEPS[currentStep].title}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">{currentStep + 1} of {STEPS.length}</span>
              <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-600 rounded-full transition-all duration-500" style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentStep} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default EquipmentStepper;