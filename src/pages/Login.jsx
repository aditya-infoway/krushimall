import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Shield,
  Truck,
  RotateCcw,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import apiHelper from "../utils/apiHelper";
import { showSuccessToast, showErrorToast } from "../utils/toast";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from =
    new URLSearchParams(location.search).get("redirect") || "/profile";

const [showPassword, setShowPassword] = useState(false);
const [isLoading, setIsLoading] = useState(false);
const [role, setRole] = useState("user");

const [formData, setFormData] = useState({
  email: "",
  password: "",
  rememberMe: false,
});

const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      // =========================
      // VENDOR LOGIN
      // =========================
      if (role === "vendor") {
        const response = await apiHelper.post("/vendor/login", {
          email: formData.email,
          password: formData.password,
        });

        if (response.success) {
          localStorage.setItem("isVendorLoggedIn", "true");
          localStorage.setItem("vendorToken", response.token);
          localStorage.setItem("vendorData", JSON.stringify(response.vendor));

          window.dispatchEvent(new Event("vendorAuthChanged"));

          showSuccessToast("Vendor login successful!");

          navigate("/vendor-profile", { replace: true });
        }

        return;
      }

      // =========================
      // USER LOGIN
      // =========================
      const response = await apiHelper.post("/webauth/login", {
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });

      localStorage.setItem("webToken", response.token);

      login({
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        phone: response.user.phone,
        isVerified: response.user.isVerified,
        isVendor: response.user.isVendor,
        vendor: response.user.vendor,
      });

      showSuccessToast("Login successful!");

      navigate(from, { replace: true });
    } catch (error) {
      const status = error.response?.status;
      const code = error.response?.data?.code;

      // Account was registered as Vendor — user-side login is blocked for
      // it on the backend. Nudge them to the Vendor tab instead of
      // showing a confusing "wrong password"/"not found" message.
      if (code === "USE_VENDOR_LOGIN") {
        setRole("vendor");
        showErrorToast(
          error.response?.data?.message ||
            "This account is registered as a Vendor. Please use Vendor login.",
        );
        return;
      }

      if (error.response?.data?.requiresVerification) {
        showErrorToast("Please verify your email first. Check your OTP.");
        navigate(`/verify-otp?email=${formData.email}`);
        return;
      }

      if (code === "USER_NOT_FOUND" || status === 404) {
        setErrors((prev) => ({
          ...prev,
          email: "Account not found. Please check your email.",
        }));

        showErrorToast("Account not found. Please check your email.");
        return;
      }

      if (code === "INVALID_PASSWORD" || status === 401) {
        setErrors((prev) => ({
          ...prev,
          password: "Incorrect password. Please try again.",
        }));

        showErrorToast("Incorrect password. Please try again.");
        return;
      }

      showErrorToast(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    return newErrors;
  };

  const benefits = [
    { icon: Truck, text: "Track your orders in real-time" },
    { icon: RotateCcw, text: "Easy returns and exchanges" },
    { icon: Shield, text: "Secure payment processing" },
  ];

  return (
    <div className="bg-gray-50 pb-8 min-h-screen">
      <div className="w-full xl:max-w-400 2xl:max-w-430 mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pt-12 md:pt-16 lg:pt-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Form */}
          <div className="max-w-md mx-auto lg:mx-0 w-full">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
              <div className="text-center mb-8">
                <Link
                  to="/"
                  className="inline-block text-2xl font-bold text-green-600 tracking-tight mb-6"
                >
                  Krushi<span className="text-gray-900">Mall</span>
                </Link>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  Welcome Back 👋
                </h1>
                <p className="text-gray-600">
                  Login to access your account and continue shopping
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                {/* Login Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Login As
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    {/* User */}
                    <label
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        role === "user"
                          ? "border-green-600 bg-green-50 ring-1 ring-green-600"
                          : "border-gray-300 hover:border-green-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name="loginRole"
                        value="user"
                        checked={role === "user"}
                        onChange={() => {
                          setRole("user");
                          setErrors({});
                        }}
                        className="h-4 w-4 text-green-600 focus:ring-green-500"
                      />

                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          User
                        </p>
                        <p className="text-xs text-gray-500">User Login</p>
                      </div>
                    </label>

                    {/* Vendor */}
                    <label
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        role === "vendor"
                          ? "border-green-600 bg-green-50 ring-1 ring-green-600"
                          : "border-gray-300 hover:border-green-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name="loginRole"
                        value="vendor"
                        checked={role === "vendor"}
                        onChange={() => {
                          setRole("vendor");
                          setErrors({});
                        }}
                        className="h-4 w-4 text-green-600 focus:ring-green-500"
                      />

                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          Vendor
                        </p>
                        <p className="text-xs text-gray-500">Vendor Login</p>
                      </div>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
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
                      } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                      placeholder="your@email.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-xs text-green-600 hover:text-green-700 font-medium"
                    >
                      Forgot Password?
                    </Link>
                  </div>
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
                      } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                      placeholder="Enter your password"
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
                    <p className="mt-1 text-xs text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Remember Me */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-600">
                    Remember me
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full cursor-pointer bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
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
                      Logging in...
                    </>
                  ) : (
                    <>
                      Log In
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {/* Register Link */}
                <p className="text-center text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-green-600 hover:text-green-700 font-semibold"
                  >
                    Sign Up Now
                  </Link>
                </p>
              </form>
            </div>
          </div>

          {/* Right Side - Benefits */}
          <div className="hidden lg:block">
            <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                Why Create an Account?
              </h2>
              <p className="text-gray-300 mb-8">
                Join thousands of satisfied customers who trust KrushiMall for
                their auto parts needs.
              </p>

              <div className="space-y-6 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="shrink-0 w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                      <benefit.icon className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{benefit.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-700 pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full bg-gray-600 border-2 border-gray-800 flex items-center justify-center text-xs font-bold"
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="h-4 w-4 text-yellow-400 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-sm text-gray-400">
                      Trusted by 10,000+ customers
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;