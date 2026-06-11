import { useState, useEffect } from "react";
import { X, Phone, Mail, User, MessageSquare, Send, Clock, Check, Sparkles } from "lucide-react";
import { RadioGroup } from "@headlessui/react";

const EnquiryModal = ({ isOpen: externalIsOpen, onClose }) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    tractorType: "new",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => {
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
        setShouldRender(false);
      }, 480);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, []);

  // Cookie functions
  const setCookie = (name, value, hours) => {
    const date = new Date();
    date.setTime(date.getTime() + hours * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}; path=/`;
  };

  const getCookie = (name) => {
    const cookieName = `${name}=`;
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.indexOf(cookieName) === 0) {
        return cookie.substring(cookieName.length, cookie.length);
      }
    }
    return null;
  };

  // Auto-show logic
  useEffect(() => {
    if (externalIsOpen !== undefined) return;

    const lastShown = getCookie("enquiryModalShown");
    const lastShownTime = getCookie("enquiryModalTime");

    if (!lastShown) {
      const timer = setTimeout(() => {
        setInternalIsOpen(true);
      }, 10000);
      return () => clearTimeout(timer);
    } else if (lastShownTime) {
      const lastTime = parseInt(lastShownTime);
      const currentTime = Date.now();
      const oneHour = 60 * 60 * 1000;

      if (currentTime - lastTime >= oneHour) {
        const timer = setTimeout(() => {
          setInternalIsOpen(true);
        }, 10000);
        return () => clearTimeout(timer);
      }
    }
  }, [externalIsOpen]);

  const handleClose = () => {
    setInternalIsOpen(false);
    if (onClose) onClose();
    setCookie("enquiryModalShown", "true", 1);
    setCookie("enquiryModalTime", Date.now().toString(), 1);

    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        tractorType: "new",
      });
    }, 480);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      console.log("Enquiry submitted:", formData);
      setIsSubmitting(false);
      setSubmitted(true);

      setTimeout(() => {
        handleClose();
      }, 2000);
    }, 1500);
  };

  if (!shouldRender) return null;

  return (
    <>
      {/* Backdrop with smooth blur transition */}
      <div
        onClick={handleClose}
        data-state={isOpen ? "open" : "closed"}
        className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 select-none pointer-events-auto class-modal-backdrop"
        style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
      >
        {/* Modal Card */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl mt-28 w-full max-w-md sm:max-w-lg relative mx-auto max-h-[85vh] sm:max-h-[90vh] overflow-y-auto class-modal-card"
          style={{ 
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.05)',
            transformOrigin: 'center center'
          }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-t-2xl px-4 sm:px-5 py-3 sm:py-4 sticky top-0 z-10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-white/20 p-1.5 sm:p-2 rounded-lg relative overflow-hidden group">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-white/10 scale-0 group-hover:scale-100 rounded-lg transition-transform duration-300" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Quick Enquiry
                </h2>
                <p className="text-green-100 text-xs flex items-center gap-1">
                  <Clock className="h-3 w-3 animate-pulse" />
                  Get best deals
                </p>
              </div>
            </div>

            {/* Close Button with hover animation */}
            <button
              onClick={handleClose}
              type="button"
              className="w-7 h-7 sm:w-8 sm:h-8 cursor-pointer bg-white/90 hover:bg-white rounded-full shadow-md flex items-center justify-center text-gray-500 hover:text-gray-700 hover:rotate-90 transition-all duration-300 flex-shrink-0 backdrop-blur-sm"
            >
              <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          </div>

          {/* Form Content */}
          <div className="p-4 sm:p-5">
            {submitted ? (
              <div className="text-center py-6 sm:py-8 class-fade-in">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 class-success-icon">
                  <Check className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 class-slide-up">
                  Enquiry Sent!
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 class-slide-up-delayed">
                  We'll contact you shortly.
                </p>
                <div className="flex justify-center gap-1 mt-3 class-slide-up-delayed-2">
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-green-500 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                {/* Name Field */}
                <div className="class-field-animate">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Full Name <span className="text-red-600">*</span>
                  </label>
                  <div className="relative group/input">
                    <User className={`absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 transition-colors duration-300 ${
                      focusedField === 'name' ? 'text-green-500' : 'text-gray-400'
                    }`} />
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all duration-300 bg-white hover:border-gray-300"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="class-field-animate">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Email Address <span className="text-red-600">*</span>
                  </label>
                  <div className="relative group/input">
                    <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 transition-colors duration-300 ${
                      focusedField === 'email' ? 'text-green-500' : 'text-gray-400'
                    }`} />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all duration-300 bg-white hover:border-gray-300"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div className="class-field-animate">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Phone Number <span className="text-red-600">*</span>
                  </label>
                  <div className="relative group/input">
                    <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 transition-colors duration-300 ${
                      focusedField === 'phone' ? 'text-green-500' : 'text-gray-400'
                    }`} />
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('phone')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all duration-300 bg-white hover:border-gray-300"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>

                {/* Tractor Type Selection */}
                <div className="class-field-animate">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Interested In <span className="text-red-600">*</span>
                  </label>
                  <RadioGroup
                    value={formData.tractorType}
                    onChange={(value) => setFormData({ ...formData, tractorType: value })}
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <RadioGroup.Option value="new">
                        {({ checked }) => (
                          <div
                            className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-all duration-300 ${
                              checked
                                ? "border-green-600 bg-green-50 shadow-sm shadow-green-100 scale-[1.02]"
                                : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                            }`}
                          >
                            <div
                              className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                                checked ? "border-green-600 bg-green-600 scale-110" : "border-gray-300"
                              }`}
                            >
                              {checked && <Check className="h-2.5 w-2.5 text-white animate-check" />}
                            </div>
                            <span className="text-xs font-medium transition-colors duration-300">
                              New Tractor
                            </span>
                          </div>
                        )}
                      </RadioGroup.Option>
                      <RadioGroup.Option value="used">
                        {({ checked }) => (
                          <div
                            className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-all duration-300 ${
                              checked
                                ? "border-green-600 bg-green-50 shadow-sm shadow-green-100 scale-[1.02]"
                                : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                            }`}
                          >
                            <div
                              className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                                checked ? "border-green-600 bg-green-600 scale-110" : "border-gray-300"
                              }`}
                            >
                              {checked && <Check className="h-2.5 w-2.5 text-white animate-check" />}
                            </div>
                            <span className="text-xs font-medium transition-colors duration-300">
                              Used Tractor
                            </span>
                          </div>
                        )}
                      </RadioGroup.Option>
                    </div>
                  </RadioGroup>
                </div>

                {/* Message Field */}
                <div className="class-field-animate">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Message
                  </label>
                  <div className="relative group/input">
                    <MessageSquare className={`absolute left-3 top-2 h-3.5 w-3.5 transition-colors duration-300 ${
                      focusedField === 'message' ? 'text-green-500' : 'text-gray-400'
                    }`} />
                    <textarea
                      name="message"
                      rows={2}
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none resize-none transition-all duration-300 bg-white hover:border-gray-300"
                      placeholder="Tell us your requirements..."
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-2 sm:py-2.5 rounded-lg transition-all duration-500 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-sm relative overflow-hidden group/btn shadow-md hover:shadow-lg active:scale-[0.98]"
                >
                  {/* Button shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                  
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin relative z-10"></div>
                      <span className="relative z-10">Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5 relative z-10 group-hover/btn:translate-x-0.5 transition-transform duration-300" />
                      <span className="relative z-10 group-hover/btn:translate-x-0.5 transition-transform duration-300">Submit Enquiry</span>
                      <Sparkles className="h-3 w-3 relative z-10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center text-gray-400 mt-2 flex items-center justify-center gap-1">
                  <Clock className="h-2.5 w-2.5" />
                  We'll contact you within 24 hours
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        /* --- Premium Smooth Animations --- */
        @keyframes backdropFadeIn {
          from { 
            opacity: 0;
            backdrop-filter: blur(0px);
          }
          to { 
            opacity: 1;
            backdrop-filter: blur(4px);
          }
        }
        @keyframes backdropFadeOut {
          from { 
            opacity: 1;
            backdrop-filter: blur(4px);
          }
          to { 
            opacity: 0;
            backdrop-filter: blur(0px);
          }
        }
        @keyframes modalScaleIn {
          from { 
            opacity: 0; 
            transform: scale(0.92) translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
        }
        @keyframes modalScaleOut {
          from { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
          to { 
            opacity: 0; 
            transform: scale(0.95) translateY(10px); 
          }
        }
        @keyframes successPopIn {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fieldSlideIn {
          from { opacity: 0; transform: translateX(-4px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes checkPopIn {
          from { transform: scale(0) rotate(-45deg); }
          to { transform: scale(1) rotate(0deg); }
        }

        .class-modal-backdrop[data-state="open"] {
          animation: backdropFadeIn 500ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .class-modal-backdrop[data-state="closed"] {
          animation: backdropFadeOut 400ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .class-modal-backdrop[data-state="open"] .class-modal-card {
          animation: modalScaleIn 500ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .class-modal-backdrop[data-state="closed"] .class-modal-card {
          animation: modalScaleOut 350ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .class-fade-in {
          animation: slideUpFade 400ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .class-success-icon {
          animation: successPopIn 500ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .class-slide-up {
          animation: slideUpFade 400ms cubic-bezier(0.22, 1, 0.36, 1) 100ms forwards;
          opacity: 0;
        }
        .class-slide-up-delayed {
          animation: slideUpFade 400ms cubic-bezier(0.22, 1, 0.36, 1) 200ms forwards;
          opacity: 0;
        }
        .class-slide-up-delayed-2 {
          animation: slideUpFade 400ms cubic-bezier(0.22, 1, 0.36, 1) 300ms forwards;
          opacity: 0;
        }
        .class-field-animate {
          animation: fieldSlideIn 350ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
          opacity: 0;
        }
        .class-field-animate:nth-child(1) { animation-delay: 50ms; }
        .class-field-animate:nth-child(2) { animation-delay: 100ms; }
        .class-field-animate:nth-child(3) { animation-delay: 150ms; }
        .class-field-animate:nth-child(4) { animation-delay: 200ms; }
        .class-field-animate:nth-child(5) { animation-delay: 250ms; }

        .animate-check {
          animation: checkPopIn 300ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        /* Smooth scrollbar for modal */
        .class-modal-card::-webkit-scrollbar {
          width: 4px;
        }
        .class-modal-card::-webkit-scrollbar-track {
          background: transparent;
        }
        .class-modal-card::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.15);
          border-radius: 10px;
        }
        .class-modal-card::-webkit-scrollbar-thumb:hover {
          background: rgba(0,0,0,0.25);
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .class-modal-backdrop[data-state="open"],
          .class-modal-backdrop[data-state="closed"],
          .class-modal-backdrop[data-state="open"] .class-modal-card,
          .class-modal-backdrop[data-state="closed"] .class-modal-card {
            animation-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  );
};

export default EnquiryModal;