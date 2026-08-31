import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  // ArrowRight,
  Shield,
  Truck,
  RotateCcw,
  CheckCircle,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Globe,
  Home,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { showSuccessToast, showErrorToast } from "../utils/toast";
import { Country, State, City } from "country-state-city";
import { Combobox } from "@headlessui/react";
import apiHelper from "../utils/apiHelper";

const TOTAL_STEPS = 4; // 1: personal, 2: address, 3: password (registers here), 4: OTP verify

const Register = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [vendorType, setVendorType] = useState("Vehicle");

  const [vehicleType, setVehicleType] = useState("New");
  const [registerType, setRegisterType] = useState("user");
  const [timer, setTimer] = useState(0);

  // Dynamic dropdown states
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    fullName: "",
    email: "",
    phone: "",

    // Step 2: Address
    country: "",
    state: "",
    district: "",
    city: "",
    address: "",
    pincode: "",

    // Step 3: Password
    password: "",
    confirmPassword: "",
    agreeToTerms: false,

    // Step 4: OTP
    otp: "",
  });

  const [errors, setErrors] = useState({});

  // Load countries on mount
  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  // Timer for OTP resend
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

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

  // Handle dropdown changes
  const handleCountryChange = (value) => {
    setSelectedCountry(value);
    setStates(value ? State.getStatesOfCountry(value.isoCode) : []);
    setSelectedState(null);
    setSelectedDistrict(null);
    setCities([]);
    setSelectedCity(null);
    setFormData((prev) => ({
      ...prev,
      country: value?.name || "",
      state: "",
      district: "",
      city: "",
    }));
    if (errors.country) setErrors((prev) => ({ ...prev, country: "" }));
  };

  const handleStateChange = (value) => {
    setSelectedState(value);
    setCities(
      value && selectedCountry
        ? City.getCitiesOfState(selectedCountry.isoCode, value.isoCode)
        : [],
    );
    setSelectedDistrict(null);
    setSelectedCity(null);
    setFormData((prev) => ({
      ...prev,
      state: value?.name || "",
      district: "",
      city: "",
    }));
    if (errors.state) setErrors((prev) => ({ ...prev, state: "" }));
  };

  const handleDistrictChange = (value) => {
    setSelectedDistrict(value);
    setFormData((prev) => ({ ...prev, district: value?.name || value || "" }));
    if (errors.district) setErrors((prev) => ({ ...prev, district: "" }));
  };

  const handleCityChange = (value) => {
    setSelectedCity(value);
    setFormData((prev) => ({ ...prev, city: value?.name || value || "" }));
    if (errors.city) setErrors((prev) => ({ ...prev, city: "" }));
  };

  // Step 1 Validation — local only, no API call
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

  // Step 2 Validation — local only, no API call
  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.country.trim()) newErrors.country = "Country is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.district.trim()) newErrors.district = "District is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
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

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms";
    }

    return newErrors;
  };
  // Steps 1 & 2 just move forward — nothing is sent to the backend yet
  const handleNextStep = (e) => {
    e.preventDefault();
    let newErrors = {};
    if (step === 1) newErrors = validateStep1();
    else if (step === 2) newErrors = validateStep2();

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

  // Step 3 submit — THIS is where the account actually gets created.
  // Everything collected across steps 1-3 is sent together to /webauth/register.
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateStep3();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showErrorToast("Please fix the form errors");
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await apiHelper.post("/webauth/register", {
        registerType,

        ...(registerType === "vendor" && {
          vendorType,
          vehicleType: vendorType === "Vehicle" ? vehicleType : null,
        }),

        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        country: formData.country,
        state: formData.state,
        district: formData.district,
        city: formData.city,
        address: formData.address,
        pincode: formData.pincode,
      });

      if (response.success) {
        setTimer(60);
        showSuccessToast(
          "Account created! Check your email/phone for the OTP.",
        );
        setStep(4);
      }
    } catch (error) {
      console.error("Registration error:", error);
      showErrorToast(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Step 4: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!formData.otp || formData.otp.length < 4) {
      setErrors((prev) => ({ ...prev, otp: "Please enter the OTP" }));
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await apiHelper.post("/webauth/verify-otp", {
        email: formData.email,
        otp: formData.otp,
      });

      if (response.success) {
        showSuccessToast("Account verified! Please log in.");
        setTimeout(() => navigate("/login"), 1200);
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      showErrorToast(
        error.response?.data?.message ||
          "OTP verification failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (timer > 0) return;

    setIsLoading(true);
    try {
      await apiHelper.post("/webauth/resend-otp", { email: formData.email });
      setTimer(60);
      showSuccessToast("OTP resent successfully!");
    } catch (error) {
      showErrorToast("Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStepDescription = () => {
    const descriptions = {
      1: "Tell us about yourself",
      2: "Where are you located?",
      3: "Create your secure password",
      4: "Verify your email & phone",
    };
    return descriptions[step] || "";
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

  // Searchable dropdown helper
  const ComboboxWrapper = ({
    label,
    value,
    onChange,
    options,
    placeholder,
    error,
    icon: Icon,
    disabled = false,
    getLabel = (o) => (typeof o === "string" ? o : o?.name),
  }) => {
    const [query, setQuery] = useState("");
    const buttonRef = useRef(null);

    const filtered =
      query === ""
        ? options
        : options.filter((option) =>
            getLabel(option).toLowerCase().includes(query.toLowerCase()),
          );

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} <span className="text-red-500">*</span>
        </label>
        <Combobox
          value={value}
          onChange={onChange}
          onClose={() => setQuery("")}
          disabled={disabled}
        >
          <div className="relative">
            {Icon && (
              <Icon className="absolute  left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-0" />
            )}
            <Combobox.Input
              className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-white disabled:bg-gray-100 disabled:cursor-not-allowed ${
                error ? "border-red-300 bg-red-50" : "border-gray-300"
              }`}
              displayValue={(val) => (val ? getLabel(val) : "")}
              onChange={(e) => setQuery(e.target.value)}
              onClick={() => buttonRef.current?.click()}
              placeholder={placeholder}
            />
            <Combobox.Button
              ref={buttonRef}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </Combobox.Button>

            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filtered.length === 0 ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-500">
                  No matches found
                </div>
              ) : (
                filtered.map((option, idx) => (
                  <Combobox.Option
                    key={
                      typeof option === "string"
                        ? option
                        : option.isoCode || idx
                    }
                    value={option}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-green-100 text-green-900" : "text-gray-900"
                      }`
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {getLabel(option)}
                        </span>
                        {selected && (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                          </span>
                        )}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </div>
        </Combobox>
        {error && (
          <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {error}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 pb-8 min-h-screen">
      <div className="w-full xl:max-w-400 2xl:max-w-430 mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pt-12 md:pt-16 lg:pt-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Side - Form */}
          <div className="max-w-md mx-auto lg:mx-0 w-full order-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
              <div className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  Create Account
                </h1>
                <p className="text-gray-600">{getStepDescription()}</p>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center justify-center gap-2 mb-8">
                {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map(
                  (s) => (
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
                      {s < TOTAL_STEPS && (
                        <div
                          className={`w-10 h-1 rounded transition-all duration-300 ${
                            step > s ? "bg-green-600" : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>
                  ),
                )}
              </div>
              {/* Register Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Register As
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {/* USER */}
                  <label
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      registerType === "user"
                        ? "border-green-600 bg-green-50 ring-1 ring-green-600"
                        : "border-gray-300 hover:border-green-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="registerType"
                      value="user"
                      checked={registerType === "user"}
                      onChange={() => setRegisterType("user")}
                      className="h-4 w-4 text-green-600 focus:ring-green-500"
                    />

                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        User
                      </p>
                      <p className="text-xs text-gray-500">Customer Account</p>
                    </div>
                  </label>

                  {/* VENDOR */}
                  <label
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      registerType === "vendor"
                        ? "border-green-600 bg-green-50 ring-1 ring-green-600"
                        : "border-gray-300 hover:border-green-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="registerType"
                      value="vendor"
                      checked={registerType === "vendor"}
                      onChange={() => setRegisterType("vendor")}
                      className="h-4 w-4 text-green-600 focus:ring-green-500"
                    />

                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        Vendor
                      </p>
                      <p className="text-xs text-gray-500">Vendor Account</p>
                    </div>
                  </label>
                </div>
              </div>
              {/* Vendor Type */}
              {registerType === "vendor" && (
                <div className="mt-5 space-y-5">
                  {/* Vendor Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Vendor Type <span className="text-red-500">*</span>
                    </label>

                    <div className="flex flex-wrap gap-6 mb-3">
                      {/* Vehicle */}
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="vendorType"
                          value="Vehicle"
                          checked={vendorType === "Vehicle"}
                          onChange={() => setVendorType("Vehicle")}
                          className="h-5 w-5 text-green-600 focus:ring-green-500"
                        />

                        <span className="text-sm text-gray-700">Vehicle</span>
                      </label>

                      {/* Spare Parts */}
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="vendorType"
                          value="Spare Parts"
                          checked={vendorType === "Spare Parts"}
                          onChange={() => setVendorType("Spare Parts")}
                          className="h-5 w-5 text-green-600 focus:ring-green-500"
                        />

                        <span className="text-sm text-gray-700">
                          Spare Parts
                        </span>
                      </label>

                      {/* Service */}
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="vendorType"
                          value="Service"
                          checked={vendorType === "Service"}
                          onChange={() => setVendorType("Service")}
                          className="h-5 w-5 text-green-600 focus:ring-green-500"
                        />

                        <span className="text-sm text-gray-700">Service</span>
                      </label>

 <label className="flex items-center gap-2 cursor-pointer">
                        <input
                        type="radio"
                          name="vendorType"
                          value="Equipment"
                          checked={vendorType === "Equipment"}
                          onChange={() => setVendorType("Equipment")}
                          className="h-5 w-5 text-green-600 focus:ring-green-500"
                        />

                        <span className="text-sm text-gray-700">Equipment</span>
                      </label>

                    </div>
                  </div>

                  {/* Vehicle Type */}
                  {vendorType === "Vehicle" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Vehicle Type <span className="text-red-500">*</span>
                      </label>

                      <div className="flex gap-6 mb-3">
                        {/* New */}
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="vehicleType"
                            value="New"
                            checked={vehicleType === "New"}
                            onChange={() => setVehicleType("New")}
                            className="h-5 w-5 text-green-600 focus:ring-green-500"
                          />

                          <span className="text-sm text-gray-700">New</span>
                        </label>

                        {/* Used */}
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="vehicleType"
                            value="Used"
                            checked={vehicleType === "Used"}
                            onChange={() => setVehicleType("Used")}
                            className="h-5 w-5 text-green-600 focus:ring-green-500"
                          />

                          <span className="text-sm text-gray-700">Used</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {/* Step 1: Personal Info (local only) */}
              {step === 1 && (
                <form onSubmit={handleNextStep} className="space-y-4">
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

                  <button
                    type="submit"
                    className="w-full cursor-pointer bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 group shadow-lg shadow-green-700/20 hover:shadow-green-700/40"
                  >
                    Continue
                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              )}

              {/* Step 2: Address (local only) */}
              {step === 2 && (
                <form onSubmit={handleNextStep} className="space-y-4">
                  <ComboboxWrapper
                    label="Country"
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    options={countries}
                    placeholder="Type to search countries..."
                    error={errors.country}
                    icon={Globe}
                  />
                  <ComboboxWrapper
                    label="State"
                    value={selectedState}
                    onChange={handleStateChange}
                    options={states}
                    placeholder={
                      selectedCountry
                        ? "Type to search states..."
                        : "Select a country first"
                    }
                    error={errors.state}
                    icon={MapPin}
                    disabled={!selectedCountry}
                  />
                  <ComboboxWrapper
                    label="District"
                    value={selectedDistrict}
                    onChange={handleDistrictChange}
                    options={cities}
                    placeholder={
                      selectedState
                        ? "Type to search district..."
                        : "Select a state first"
                    }
                    error={errors.district}
                    icon={MapPin}
                    disabled={!selectedState}
                  />
                  <ComboboxWrapper
                    label="City"
                    value={selectedCity}
                    onChange={handleCityChange}
                    options={cities}
                    placeholder={
                      selectedState
                        ? "Type to search cities..."
                        : "Select a state first"
                    }
                    error={errors.city}
                    icon={Home}
                    disabled={!selectedState}
                  />

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

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handlePreviousStep}
                      className="cursor-pointer flex-1 border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <ChevronLeft className="h-5 w-5" />
                      Back
                    </button>
                    <button
                      type="submit"
                      className="cursor-pointer flex-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 group shadow-lg shadow-green-700/20 hover:shadow-green-700/40"
                    >
                      Continue
                      <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: Password — this submit is what actually registers the account */}
              {step === 3 && (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
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
                        disabled={isLoading}
                        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all ${
                          errors.password
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
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

                    {/* {formData.password && (
                      <div className="mt-2">
                        <div className="flex gap-1 mb-1">
                          <div className={`flex-1 h-1 rounded-full ${formData.password.length >= 8 ? "bg-green-500" : "bg-gray-300"}`} />
                          <div className={`flex-1 h-1 rounded-full ${/(?=.*[a-z])(?=.*[A-Z])/.test(formData.password) ? "bg-green-500" : "bg-gray-300"}`} />
                          <div className={`flex-1 h-1 rounded-full ${/(?=.*\d)/.test(formData.password) ? "bg-green-500" : "bg-gray-300"}`} />
                          <div className={`flex-1 h-1 rounded-full ${/(?=.*[@$!%*?&])/.test(formData.password) ? "bg-green-500" : "bg-gray-300"}`} />
                        </div>
                        <p className="text-xs text-gray-500">
                          Password must contain: 8+ chars, uppercase, lowercase, number & special character
                        </p>
                      </div>
                    )} */}
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
                        disabled={isLoading}
                        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all ${
                          errors.confirmPassword
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
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
                        disabled={isLoading}
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

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handlePreviousStep}
                      disabled={isLoading}
                      className="cursor-pointer flex-1 border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-5 w-5" />
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="cursor-pointer flex-2 bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 group shadow-lg shadow-green-700/20 hover:shadow-green-700/40 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5" />
                          Create Account
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Step 4: OTP Verification — account already exists in DB at this point */}
              {step === 4 && (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-blue-700">
                      We've sent a verification code to your email and phone.
                      Enter it below to activate your account.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Enter OTP <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="otp"
                      value={formData.otp}
                      onChange={handleChange}
                      disabled={isLoading}
                      className={`w-full pl-4 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all ${
                        errors.otp
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                      placeholder="Enter 6-digit OTP"
                    />
                    {errors.otp && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.otp}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={timer > 0 || isLoading}
                      className="text-sm text-green-600 hover:text-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full cursor-pointer bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Verifying...
                      </>
                    ) : (
                      "Verify & Continue to Login"
                    )}
                  </button>
                </form>
              )}

              <p className="text-center text-sm text-gray-600 mt-6">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-green-600 hover:text-green-700 font-semibold"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Right Side - Benefits */}
          <div className="hidden lg:block order-2 sticky top-24">
            <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                Join KrushiMall Today
              </h2>
              <p className="text-gray-300 mb-8">
                Create your account and get access to exclusive features and
                offers.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {userBenefits.map((benefit, index) => (
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
                ))}
              </div>

              <div className="border-t border-gray-700 pt-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-400">
                    Step {step} of {TOTAL_STEPS}
                  </span>
                  <span className="text-sm text-green-400">
                    {Math.round((step / TOTAL_STEPS) * 100)}% Complete
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-green-500 to-green-400 rounded-full transition-all duration-500"
                    style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
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
