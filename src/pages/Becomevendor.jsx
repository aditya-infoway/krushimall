import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Field, Label, Radio, RadioGroup } from "@headlessui/react";
import {
  Store,
  Package,
  Wrench,
  Truck,
  Briefcase,
  Calendar,
  MapPin,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ArrowRight,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Globe,
  Home,
  Building,
  Hash,
  Shield,
  Check,
  Send,
  CreditCard,
  FileText,
  UserCheck,
} from "lucide-react";
import { showSuccessToast, showErrorToast } from "../utils/toast";
import { Combobox } from "@headlessui/react";
import { Country, State, City } from "country-state-city";
import apiHelper from "../utils/apiHelper";

// Combobox wrapper component
const ComboboxWrapper = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  icon: Icon,
  disabled = false,
  required = false,
  getLabel = (o) => (typeof o === "string" ? o : o?.name),
}) => {
  const [query, setQuery] = useState("");
  const buttonRef = useRef(null);

  const filtered =
    query === ""
      ? options
      : options.filter((option) =>
          getLabel(option).toLowerCase().includes(query.toLowerCase())
        );

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Combobox
        value={value}
        onChange={onChange}
        onClose={() => setQuery("")}
        disabled={disabled}
      >
        <div className="relative">
          {Icon && (
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
          )}
          <Combobox.Input
            className={`w-full pl-10 pr-10 py-3 text-sm border rounded-lg bg-white disabled:bg-gray-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all ${
              error ? "border-red-300 bg-red-50" : "border-gray-300"
            }`}
            displayValue={(val) => (val ? getLabel(val) : "")}
            onChange={(e) => setQuery(e.target.value)}
            onClick={() => buttonRef.current?.click()}
            placeholder={placeholder}
            disabled={disabled}
          />
          <Combobox.Button
            ref={buttonRef}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor">
              <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Combobox.Button>

          <Combobox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filtered.length === 0 && query !== "" ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-500">
                No matches found
              </div>
            ) : (
              filtered.map((option, idx) => (
                <Combobox.Option
                  key={idx}
                  value={option}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-green-100 text-green-900" : "text-gray-900"
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
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

const BecomeVendor = () => {
   console.log("BecomeVendor Component");
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  // Step 1: Vendor & Personal Details
  const [vendorType, setVendorType] = useState("vehicle");
  const [vehicleType, setVehicleType] = useState("new");
  const [personalData, setPersonalData] = useState({
    name: "",
    number: "",
    email: "",
    otp: "",
  });

  // Step 2: Address Details with Dynamic Dropdowns
  const [addressData, setAddressData] = useState({
    country: "",
    state: "",
    district: "",
    city: "",
    address: "",
    pincode: "",
  });

  // Dynamic dropdown states
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  // Step 3: Password
  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  // Load countries on mount
  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);
  }, []);

  // Update states when country changes
  useEffect(() => {
    if (selectedCountry) {
      const stateList = State.getStatesOfCountry(selectedCountry.isoCode);
      setStates(stateList);
    } else {
      setStates([]);
    }
    setSelectedState(null);
    setSelectedCity(null);
    setSelectedDistrict(null);
    setAddressData(prev => ({ ...prev, state: "", city: "", district: "" }));
  }, [selectedCountry]);

  // Update cities when state changes
useEffect(() => {
  if (selectedCountry && selectedState) {
    const cityList = City.getCitiesOfState(
      selectedCountry.isoCode,
      selectedState.isoCode
    );

    setCities(cityList);
    setDistricts(cityList); // Same data source
  } else {
    setCities([]);
    setDistricts([]);
  }

  setSelectedCity(null);
  setSelectedDistrict(null);

  setAddressData(prev => ({
    ...prev,
    city: "",
    district: "",
  }));
}, [selectedCountry, selectedState]);

 


  // Step 1 Handlers
  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonalData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!personalData.name.trim()) {
      newErrors.name = "Full name is required";
    }
    if (!personalData.number || personalData.number.length < 10) {
      newErrors.number = "Please enter a valid phone number";
    }
    if (!personalData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalData.email)) {
      newErrors.email = "Please enter a valid email";
    }
   
    return newErrors;
  };

  
  
  const handleResendOTP = () => {
    if (timer === 0) {
      handleSendOTP();
    }
  };

  const handleStep1Next = () => {
    const newErrors = validateStep1();
   if (
  !personalData.name ||
  !personalData.number ||
  !personalData.email
) {
  toast.error("Please fill all required fields");
  return;
}

setCurrentStep(2);
    setCurrentStep(2);
  };

  // Step 2 Handlers
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleCountryChange = (value) => {
    setSelectedCountry(value);
    setAddressData(prev => ({ ...prev, country: value?.name || "" }));
  };

  const handleStateChange = (value) => {
    setSelectedState(value);
    setAddressData(prev => ({ ...prev, state: value?.name || "" }));
  };

  const handleCityChange = (value) => {
    setSelectedCity(value);
    setAddressData(prev => ({ ...prev, city: value?.name || "" }));
  };

const handleDistrictChange = (value) => {
  setSelectedDistrict(value);

  setAddressData(prev => ({
    ...prev,
    district: value?.name || "",
  }));
};

  const validateStep2 = () => {
    const newErrors = {};
    if (!selectedCountry) newErrors.country = "Country is required";
    if (!selectedState) newErrors.state = "State is required";
    if (!selectedCity) newErrors.city = "City is required";
    if (!selectedDistrict) newErrors.district = "District is required";
    if (!addressData.address.trim()) newErrors.address = "Address is required";
    if (!addressData.pincode || !/^\d{5,6}$/.test(addressData.pincode)) {
      newErrors.pincode = "Please enter a valid pincode (5-6 digits)";
    }
    return newErrors;
  };

  const handleStep2Next = () => {
    const newErrors = validateStep2();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showErrorToast("Please fill all address fields correctly");
      return;
    }
    setCurrentStep(3);
  };

  // Step 3 Handlers
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateStep3 = () => {
    const newErrors = {};
    if (!passwordData.password || passwordData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (passwordData.password !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    return newErrors;
  };

const handleSubmit = async () => {
  console.log("START");

  const newErrors = validateStep3();

  if (Object.keys(newErrors).length > 0) {
    console.log("Validation failed", newErrors);
    setErrors(newErrors);
    return;
  }

  console.log("Validation Passed");

  setIsLoading(true);

  try {
    const payload = {
      vendorType,
      vehicleType: vendorType === "vehicle" ? vehicleType : null,

      name: personalData.name,
      number: personalData.number,
      email: personalData.email,

      country: addressData.country,
      state: addressData.state,
      district: addressData.district,
      city: addressData.city,
      address: addressData.address,
      pincode: addressData.pincode,

      vendorPassword: passwordData.password,
    };

    console.log("Payload", payload);

    const response = await apiHelper.post("/vendor/become", payload);

    console.log("API Response", response);

    if (response.success) {
      showSuccessToast(response.message);
      navigate("/vendor-login");
    }
  } catch (err) {
    console.log("ERROR", err);
  } finally {
    setIsLoading(false);
  }
};

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <React.Fragment key={step}>
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                currentStep === step
                  ? "bg-green-600 text-white ring-4 ring-green-100"
                  : currentStep > step
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {currentStep > step ? (
                <Check className="h-5 w-5" />
              ) : (
                step
              )}
            </div>
          </div>
          {step < 3 && (
            <div
              className={`w-16 h-0.5 mx-2 transition-all ${
                currentStep > step ? "bg-green-600" : "bg-gray-200"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );


 

  return (
    <div className="bg-gray-50 pb-8 min-h-screen">
      <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pt-12 md:pt-16 lg:pt-20">
        <div className="max-w-2xl mx-auto">
          <Link
            to="/profile"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-green-600 mb-6 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Back to Profile
          </Link>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Store className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Register as a Vendor
              </h1>
              <p className="text-gray-600">
                Tell us about your business to start selling on KrushiMall
              </p>
            </div>

            {/* Step Indicator */}
            {renderStepIndicator()}

            {/* Step 1: Vendor Type & Personal Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* Vendor Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Vendor Type <span className="text-red-500">*</span>
                  </label>
                  <RadioGroup value={vendorType} onChange={setVendorType} className="flex flex-wrap gap-6">
                    {[
                      { value: "vehicle", label: "Vehicle" },
                      { value: "spare-parts", label: "Spare Parts" },
                      { value: "service", label: "Service" },
                    ].map((opt) => (
                      <Field key={opt.value} className="flex items-center gap-2">
                        <Radio
                          value={opt.value}
                          className="group flex size-5 items-center justify-center rounded-full border-2 border-gray-400 bg-white data-checked:border-green-600 data-checked:bg-green-600"
                        >
                          <span className="invisible size-2 rounded-full bg-white group-data-checked:visible" />
                        </Radio>
                        <Label className="text-sm text-gray-700 cursor-pointer">{opt.label}</Label>
                      </Field>
                    ))}
                  </RadioGroup>
                </div>

                {/* Vehicle Type */}
                {vendorType === "vehicle" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Vehicle Type <span className="text-red-500">*</span>
                    </label>
                    <RadioGroup value={vehicleType} onChange={setVehicleType} className="flex gap-6">
                      {[
                        { value: "new", label: "New" },
                        { value: "used", label: "Used" },
                      ].map((opt) => (
                        <Field key={opt.value} className="flex items-center gap-2">
                          <Radio
                            value={opt.value}
                            className="group flex size-5 items-center justify-center rounded-full border-2 border-gray-400 bg-white data-checked:border-green-600 data-checked:bg-green-600"
                          >
                            <span className="invisible size-2 rounded-full bg-white group-data-checked:visible" />
                          </Radio>
                          <Label className="text-sm text-gray-700 cursor-pointer">{opt.label}</Label>
                        </Field>
                      ))}
                    </RadioGroup>
                  </div>
                )}

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={personalData.name}
                      onChange={handlePersonalChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all ${
                        errors.name ? "border-red-300 bg-red-50" : "border-gray-300"
                      }`}
                      placeholder="Your Full Name"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.name}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      name="number"
                      value={personalData.number}
                      onChange={handlePersonalChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all ${
                        errors.number ? "border-red-300 bg-red-50" : "border-gray-300"
                      }`}
                      placeholder="9876543210"
                    />
                  </div>
                  {errors.number && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.number}
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
                      value={personalData.email}
                      onChange={handlePersonalChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all ${
                        errors.email ? "border-red-300 bg-red-50" : "border-gray-300"
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

               
                <button
                  type="button"
                  onClick={handleStep1Next}
                  className="cursor-pointer w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 group shadow-lg shadow-green-700/20 hover:shadow-green-700/40"
                >
                  Next Step
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}

            {/* Step 2: Address Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {/* Country */}
                <ComboboxWrapper
                  label="Country"
                  value={selectedCountry}
                  onChange={handleCountryChange}
                  options={countries}
                  placeholder="Select a country"
                  icon={Globe}
                  error={errors.country}
                  required={true}
                />

                {/* State */}
                <ComboboxWrapper
                  label="State"
                  value={selectedState}
                  onChange={handleStateChange}
                  options={states}
                  placeholder={selectedCountry ? "Select a state" : "Select a country first"}
                  icon={Building}
                  error={errors.state}
                  required={true}
                  disabled={!selectedCountry}
                />

                   {/* District */}
                <ComboboxWrapper
                  label="District"
                  value={selectedDistrict}
                  onChange={handleDistrictChange}
                  options={districts}
                 placeholder={
  selectedState
    ? "Select a district"
    : "Select a state first"
}
                  icon={MapPin}
                  error={errors.district}
                  required={true}
                 disabled={!selectedState}
                />

                {/* City */}
                <ComboboxWrapper
                  label="City"
                  value={selectedCity}
                  onChange={handleCityChange}
                  options={cities}
                  placeholder={selectedState ? "Select a city" : "Select a state first"}
                  icon={Home}
                  error={errors.city}
                  required={true}
                  disabled={!selectedState}
                />

             

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <textarea
                      name="address"
                      value={addressData.address}
                      onChange={handleAddressChange}
                      rows="3"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none ${
                        errors.address ? "border-red-300 bg-red-50" : "border-gray-300"
                      }`}
                      placeholder="123, Main Street, Area Name"
                    />
                  </div>
                  {errors.address && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.address}
                    </p>
                  )}
                </div>

                {/* Pincode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="pincode"
                      value={addressData.pincode}
                      onChange={handleAddressChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all ${
                        errors.pincode ? "border-red-300 bg-red-50" : "border-gray-300"
                      }`}
                      placeholder="302001"
                    />
                  </div>
                  {errors.pincode && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.pincode}
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="cursor-pointer flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    <ChevronLeft className="h-5 w-5" />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleStep2Next}
                    className="cursor-pointer flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 group shadow-lg shadow-green-700/20 hover:shadow-green-700/40"
                  >
                    Next Step
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Password */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-700 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Create a separate password for your vendor account
                  </p>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={passwordData.password}
                      onChange={handlePasswordChange}
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all ${
                        errors.password ? "border-red-300 bg-red-50" : "border-gray-300"
                      }`}
                      placeholder="Min 8 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all ${
                        errors.confirmPassword ? "border-red-300 bg-red-50" : "border-gray-300"
                      }`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="cursor-pointer flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    <ChevronLeft className="h-5 w-5" />
                    Back
                  </button>
                 <button
  type="button"
  onClick={() => {
    console.log("BUTTON CLICKED");
    handleSubmit();
  }}
  className="cursor-pointer flex-1 bg-gradient-to-r from-green-600 to-green-700"
>
  Register as Vendor
</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeVendor;