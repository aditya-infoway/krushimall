// AddProductStepper.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  ChevronRight,
  ArrowLeft,
  Package,
  Settings,
  Truck,
  Image,
  FileText,
  DollarSign,
  Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = [
  { id: 0, title: 'Basic Info', icon: Package },
  { id: 1, title: 'Engine Details', icon: Settings },
  { id: 2, title: 'Transmission', icon: Truck },
  { id: 3, title: 'Hydraulic Tyers', icon: Image },
  { id: 4, title: 'Pricing', icon: DollarSign },
  { id: 5, title: 'Documentation', icon: FileText },
  { id: 6, title: 'Preview', icon: Shield },
];

// Route to navigate back to when the back button is clicked
const VENDOR_PRODUCTS_ROUTE = '/vendor-profile';

const AddProductStepper = ({ children, currentStep, setCurrentStep, completedSteps }) => {
  const [isSticky, setIsSticky] = useState(false);
  const stepperRef = useRef(null);
  const navigate = useNavigate();

  // Handle sticky behavior
  useEffect(() => {
    const handleScroll = () => {
      if (stepperRef.current) {
        const rect = stepperRef.current.getBoundingClientRect();
        setIsSticky(rect.top <= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleStepClick = (stepId) => {
    // Allow navigation only to completed steps or current step
    if (stepId === currentStep) return;
    if (completedSteps.includes(stepId) || stepId < currentStep) {
      setCurrentStep(stepId);
    }
  };

  const getStepStatus = (stepId) => {
    if (completedSteps.includes(stepId)) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'upcoming';
  };

  const isStepAccessible = (stepId) => {
    if (stepId === currentStep) return true;
    if (completedSteps.includes(stepId)) return true;
    if (stepId < currentStep) return true;
    return false;
  };

  // Header row: page title on left, "Back to List" button on right, same on every step
  const renderHeader = () => (
    <div className=" px-4 sm:px-6 lg:px-8 pt-8">
      <div className="w-full max-w-6xl mx-auto flex items-start justify-between gap-4">
        <div>
          {/* <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the details below to list your product
          </p> */}
        </div>
        <button
          type="button"
          onClick={() => navigate(VENDOR_PRODUCTS_ROUTE)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors flex-shrink-0 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to List
        </button>
      </div>
    </div>
  );

  // Mobile: Show compact progress
  const renderMobileProgress = () => (
    <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 ">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">
              Step {currentStep + 1}
            </span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {STEPS[currentStep].title}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            {currentStep + 1} of {STEPS.length}
          </span>
          <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-600 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Desktop: Full stepper
  const renderDesktopStepper = () => (
    <div className={`hidden lg:block mt-4 bg-white border-b border-gray-200 transition-all duration-300 ${
      isSticky ? 'shadow-md' : ''
    }`}>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="relative">
          {/* Progress Line - Background */}
          <div className="absolute left-0 right-0 top-5 h-0.5 bg-gray-200">
            {/* Progress Line - Filled */}
            <div 
              className="h-full bg-green-600 transition-all duration-700 ease-in-out"
              style={{ 
                width: `${(currentStep / (STEPS.length - 1)) * 100}%` 
              }}
            />
          </div>

          {/* Steps */}
          <div className="relative flex justify-between">
            {STEPS.map((step, index) => {
              const status = getStepStatus(step.id);
              const isAccessible = isStepAccessible(step.id);
              const Icon = step.icon;

              return (
                <div key={step.id} className="flex flex-col items-center">
                  <button
                    onClick={() => handleStepClick(step.id)}
                    disabled={!isAccessible}
                    className={`
                      relative z-10 flex items-center justify-center
                      w-10 h-10 rounded-full border-2 transition-all duration-300
                      ${status === 'completed' 
                        ? 'bg-green-600 border-green-600 text-white cursor-pointer hover:scale-110' 
                        : status === 'current'
                          ? 'bg-white border-green-600 text-green-600 shadow-lg shadow-green-100 cursor-default'
                          : 'bg-white border-gray-300 text-gray-400 cursor-not-allowed'
                      }
                      ${isAccessible && status !== 'completed' && status !== 'current'
                        ? 'hover:border-green-400 hover:text-green-500 cursor-pointer'
                        : ''
                      }
                    `}
                  >
                    {status === 'completed' ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <Icon className={`h-5 w-5 ${
                        status === 'current' ? 'text-green-600' : 'text-gray-400'
                      }`} />
                    )}
                  </button>

                  <div className="mt-3 text-center">
                    <p className={`
                      text-xs font-medium transition-all duration-300
                      ${status === 'completed' ? 'text-green-600' : 
                        status === 'current' ? 'text-gray-900 font-semibold' : 
                        'text-gray-400'}
                    `}>
                      {step.title}
                    </p>
                    {status === 'current' && (
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        className="h-0.5 w-8 bg-green-600 mx-auto mt-1"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Stepper Container */}
      <div ref={stepperRef} className="sticky top-0 z-40">
        {renderHeader()}
        {renderDesktopStepper()}
        {renderMobileProgress()}
      </div>

      {/* Content with animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AddProductStepper;