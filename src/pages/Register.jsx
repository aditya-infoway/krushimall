import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  Shield,
  Truck,
  RotateCcw,
  CheckCircle,
  Store,
  Building,
  MapPin,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Globe,
  Home,
  AlertCircle,
  TrendingUp,
  ChevronDown,
  Tractor,
  Package,
} from "lucide-react";
import { showSuccessToast, showErrorToast } from "../utils/toast";
import { Listbox, RadioGroup } from "@headlessui/react";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get role from URL params
  const params = new URLSearchParams(location.search);
  const defaultRole = params.get("role") || "user";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState(defaultRole);
  const [vendorType, setVendorType] = useState("new"); // 'new' or 'used'

  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    fullName: "",
    email: "",
    phone: "",

    // Step 2: Address
    country: "",
    state: "",
    city: "",
    address: "",
    pincode: "",

    // Step 3: Password
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});

  const loginPath = userType === "vendor" ? "/vendor-login" : "/login";

  // Update userType when URL param changes
  useEffect(() => {
    const role = params.get("role");
    if (role && (role === "user" || role === "vendor")) {
      setUserType(role);
    }
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Step 1 Validation
  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    return newErrors;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
    }
    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^[0-9]{5,6}$/.test(formData.pincode)) {
      newErrors.pincode = "Please enter a valid pincode";
    }
    return newErrors;
  };

  // Step 3 Validation
  const validateStep3 = () => {
    const newErrors = {};
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)
    ) {
      newErrors.password =
        "Password must contain uppercase, lowercase, number & special character";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms";
    }
    return newErrors;
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    let newErrors = {};

    if (step === 1) {
      newErrors = validateStep1();
    } else if (step === 2) {
      newErrors = validateStep2();
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showErrorToast("Please fix the errors before continuing");
      return;
    }
    setErrors({});
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateStep3();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showErrorToast("Please fix the form errors");
      return;
    }

    // Show success message
    const userTypeLabel = userType === "user" ? "Account" : "Vendor Account";
    showSuccessToast(`${userTypeLabel} created successfully!`);

    setTimeout(() => {
      navigate(loginPath);
    }, 1500);
  };

  const getStepTitle = () => {
    const titles = {
      1: "Personal Information",
      2: "Address Information",
      3: "Set Password",
    };
    return titles[step];
  };

  const getStepDescription = () => {
    const descriptions = {
      1: "Tell us about yourself",
      2: "Where are you located?",
      3: "Create your secure password",
    };
    return descriptions[step];
  };

  const userBenefits = [
    {
      icon: Truck,
      title: "Track Orders",
      description: "Real-time order tracking",
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      description: "10-day return policy",
    },
    {
      icon: Shield,
      title: "Secure Shopping",
      description: "Protected payments",
    },
    {
      icon: CheckCircle,
      title: "Exclusive Deals",
      description: "Member-only offers",
    },
  ];

  const vendorBenefits = [
    {
      icon: Store,
      title: "Sell Online",
      description: "List your products easily",
    },
    {
      icon: TrendingUp,
      title: "Reach Customers",
      description: "Access to thousands of buyers",
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Protected transactions",
    },
    {
      icon: CheckCircle,
      title: "Business Growth",
      description: "Grow your business online",
    },
  ];

  const vendorTypeOptions = [
    {
      id: "new",
      name: "New Tractor",
      icon: Tractor,
      description: "Sell brand new tractors",
    },
    {
      id: "used",
      name: "Used Tractor",
      icon: Package,
      description: "Sell pre-owned tractors",
    },
  ];

  return (
    <div className="bg-gray-50 pb-8 min-h-screen">
      <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pt-12 md:pt-16 lg:pt-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Side - Form */}
          <div className="max-w-md mx-auto lg:mx-0 w-full order-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
              <div className="text-center mb-8">
                <Link
                  to="/"
                  className="inline-block text-2xl font-bold text-green-600 tracking-tight mb-6"
                >
                  Krushi<span className="text-gray-900">Mall</span>
                </Link>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {userType === "user"
                    ? "Create Account"
                    : "Vendor Registration"}
                </h1>
                <p className="text-gray-600">{getStepDescription()}</p>
              </div>

              {/* Role Toggle - Only show on step 1 */}
              {step === 1 && (
                <div className="mb-6">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div
                      className={`p-2 rounded-lg ${userType === "user" ? "bg-green-100" : "bg-green-100"}`}
                    >
                      {userType === "user" ? (
                        <User className="h-5 w-5 text-green-600" />
                      ) : (
                        <Store className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {userType === "user" ? "Customer" : "Vendor"}{" "}
                        Registration
                      </p>
                      <p className="text-xs text-gray-500">
                        {userType === "user"
                          ? "Creating account as a customer"
                          : "Creating account as a vendor"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Vendor Type Radio Group - Headless UI - Only for Vendor */}
              {step === 1 && userType === "vendor" && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Vendor Type
                  </label>
                  <RadioGroup value={vendorType} onChange={setVendorType}>
                    <div className="grid grid-cols-2 gap-3">
                      {vendorTypeOptions.map((option) => (
                        <RadioGroup.Option
                          key={option.id}
                          value={option.id}
                          className={({ active, checked }) =>
                            `relative flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                              checked
                                ? "border-green-600 bg-green-50 shadow-md"
                                : "border-gray-300 bg-white hover:border-gray-400"
                            }`
                          }
                        >
                          {({ checked }) => (
                            <>
                              {/* Radio Circle Indicator */}
                              <div className="flex-shrink-0 mt-0.5">
                                <div
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                    checked
                                      ? "border-green-600 bg-green-600"
                                      : "border-gray-400 bg-white"
                                  }`}
                                >
                                  {checked && (
                                    <div className="w-2 h-2 rounded-full bg-white" />
                                  )}
                                </div>
                              </div>

                              {/* Content */}
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <option.icon
                                    className={`h-5 w-5 ${
                                      checked
                                        ? "text-green-600"
                                        : "text-gray-500"
                                    }`}
                                  />
                                  <span
                                    className={`font-semibold text-sm ${
                                      checked
                                        ? "text-green-700"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    {option.name}
                                  </span>
                                </div>
                              </div>
                            </>
                          )}
                        </RadioGroup.Option>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              )}
              {/* Progress Steps */}
              <div className="flex items-center justify-center gap-2 mb-8">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                        step >= s
                          ? "bg-green-600 text-white shadow-md shadow-green-600/30"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {step > s ? "✓" : s}
                    </div>
                    {s < 3 && (
                      <div
                        className={`w-12 h-1 rounded transition-all duration-300 ${
                          step > s ? "bg-green-600" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              <form onSubmit={step === 3 ? handleSubmit : handleNextStep}>
                {/* Step 1: Personal Info */}
                {step === 1 && (
                  <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all ${
                            errors.fullName
                              ? "border-red-300 bg-red-50"
                              : "border-gray-300"
                          }`}
                          placeholder="John Doe"
                        />
                      </div>
                      {errors.fullName && (
                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.fullName}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all ${
                            errors.email
                              ? "border-red-300 bg-red-50"
                              : "border-gray-300"
                          }`}
                          placeholder="your@email.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all ${
                            errors.phone
                              ? "border-red-300 bg-red-50"
                              : "border-gray-300"
                          }`}
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2: Address */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Country <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all ${
                              errors.country
                                ? "border-red-300 bg-red-50"
                                : "border-gray-300"
                            }`}
                            placeholder="India"
                          />
                        </div>
                        {errors.country && (
                          <p className="mt-1 text-xs text-red-600">
                            {errors.country}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all ${
                              errors.state
                                ? "border-red-300 bg-red-50"
                                : "border-gray-300"
                            }`}
                            placeholder="Maharashtra"
                          />
                        </div>
                        {errors.state && (
                          <p className="mt-1 text-xs text-red-600">
                            {errors.state}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all ${
                            errors.city
                              ? "border-red-300 bg-red-50"
                              : "border-gray-300"
                          }`}
                          placeholder="Mumbai"
                        />
                      </div>
                      {errors.city && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.city}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Home className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          rows="3"
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none ${
                            errors.address
                              ? "border-red-300 bg-red-50"
                              : "border-gray-300"
                          }`}
                          placeholder="123, Main Street, Area Name"
                        />
                      </div>
                      {errors.address && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.address}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pincode <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all ${
                          errors.pincode
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        }`}
                        placeholder="400001"
                      />
                      {errors.pincode && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.pincode}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3: Password */}
                {step === 3 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all ${
                            errors.password
                              ? "border-red-300 bg-red-50"
                              : "border-gray-300"
                          }`}
                          placeholder="Create a strong password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.password}
                        </p>
                      )}

                      {/* Password Strength Indicator */}
                      {formData.password && (
                        <div className="mt-2">
                          <div className="flex gap-1 mb-1">
                            <div
                              className={`flex-1 h-1 rounded-full ${formData.password.length >= 8 ? "bg-green-500" : "bg-gray-300"}`}
                            />
                            <div
                              className={`flex-1 h-1 rounded-full ${/(?=.*[a-z])(?=.*[A-Z])/.test(formData.password) ? "bg-green-500" : "bg-gray-300"}`}
                            />
                            <div
                              className={`flex-1 h-1 rounded-full ${/(?=.*\d)/.test(formData.password) ? "bg-green-500" : "bg-gray-300"}`}
                            />
                            <div
                              className={`flex-1 h-1 rounded-full ${/(?=.*[@$!%*?&])/.test(formData.password) ? "bg-green-500" : "bg-gray-300"}`}
                            />
                          </div>
                          <p className="text-xs text-gray-500">
                            Password must contain: 8+ chars, uppercase,
                            lowercase, number & special character
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all ${
                            errors.confirmPassword
                              ? "border-red-300 bg-red-50"
                              : "border-gray-300"
                          }`}
                          placeholder="Confirm your password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />{" "}
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="agreeToTerms"
                          checked={formData.agreeToTerms}
                          onChange={handleChange}
                          className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-600">
                          I agree to the{" "}
                          <Link
                            to="/terms"
                            className="text-green-600 hover:text-green-700 font-medium"
                          >
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link
                            to="/privacy"
                            className="text-green-600 hover:text-green-700 font-medium"
                          >
                            Privacy Policy
                          </Link>
                        </span>
                      </label>
                      {errors.agreeToTerms && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.agreeToTerms}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-3 mt-6">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={handlePreviousStep}
                      className="cursor-pointer flex-1 border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <ChevronLeft className="h-5 w-5" />
                      Back
                    </button>
                  )}

                  {step < 3 ? (
                    <button
                      type="submit"
                      className="cursor-pointer flex-[2] bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 group shadow-lg shadow-green-700/20 hover:shadow-green-700/40"
                    >
                      Continue
                      <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="cursor-pointer flex-[2] bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 group shadow-lg shadow-green-700/20 hover:shadow-green-700/40"
                    >
                      <CheckCircle className="h-5 w-5" />
                      {userType === "user"
                        ? "Create Account"
                        : "Register as Vendor"}
                    </button>
                  )}
                </div>
              </form>

              {/* Login Link */}
              <p className="text-center text-sm text-gray-600 mt-6">
                Already have an account?{" "}
                <Link
                  to={loginPath}
                  className="text-green-600 hover:text-green-700 font-semibold"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Right Side - Benefits */}
          <div className="hidden lg:block order-2 sticky top-24">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                {userType === "user"
                  ? "Join KrushiMall Today"
                  : "Become a Vendor"}
              </h2>
              <p className="text-gray-300 mb-8">
                {userType === "user"
                  ? "Create your account and get access to exclusive features and offers."
                  : "Join our vendor network and start selling your products online."}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {(userType === "user" ? userBenefits : vendorBenefits).map(
                  (benefit, index) => (
                    <div
                      key={index}
                      className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors"
                    >
                      <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mb-3">
                        <benefit.icon className="h-5 w-5 text-green-400" />
                      </div>
                      <h3 className="font-semibold text-white mb-1 text-sm">
                        {benefit.title}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {benefit.description}
                      </p>
                    </div>
                  ),
                )}
              </div>

              {/* Progress Indicator */}
              <div className="border-t border-gray-700 pt-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-400">
                    Step {step} of 3
                  </span>
                  <span className="text-sm text-green-400">
                    {Math.round((step / 3) * 100)}% Complete
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-500"
                    style={{ width: `${(step / 3) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
