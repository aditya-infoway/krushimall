import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Shield,
  Store,
  TrendingUp,
  Users,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import apiHelper from "../utils/apiHelper";

const VendorLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();


  const [showPassword, setShowPassword] = useState(false);
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

  try {
    const response = await apiHelper.post("/vendor/login", {
      email: formData.email,
      password: formData.password,
    });

    if (response.success) {
      localStorage.setItem("isVendorLoggedIn", "true");
      localStorage.setItem("vendorToken", response.token);
      localStorage.setItem("vendorData", JSON.stringify(response.vendor));
      window.dispatchEvent(new Event("vendorAuthChanged"));

      navigate("/vendor-profile", { replace: true });
    }
  } catch (err) {
    console.log(err);
    const message = err.response?.data?.message || "Login failed. Please try again.";
    setErrors({ submit: message });
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
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    return newErrors;
  };

  const vendorBenefits = [
    { icon: Store, text: "List your products easily" },
    { icon: Users, text: "Reach thousands of customers" },
    { icon: TrendingUp, text: "Grow your business online" },
    { icon: Shield, text: "Secure payment processing" },
  ];

  return (
    <div className="bg-gray-50 pb-8 min-h-screen flex items-center">
      <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pt-12 md:pt-16 lg:pt-20">
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
                  Welcome Back Vendor 👋
                </h1>
                <p className="text-gray-600">
                  Login to manage your products and orders
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
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
                      }`}
                      placeholder="vendor@email.com"
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
                      to="/vendor/forgot-password"
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
                      }`}
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
                <div className="flex items-center justify-between">
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
                  <Link
                    to="/login?role=user"
                    className="text-sm text-gray-500 hover:text-green-600 transition-colors"
                  >
                    Login as Customer?
                  </Link>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full cursor-pointer bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 group shadow-lg shadow-green-700/20 hover:shadow-green-700/40"
                >
                  <Store className="h-5 w-5" />
                  Vendor Login
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Register Link */}
                <div className="space-y-3 pt-2">
                  <p className="text-center text-sm text-gray-600">
                    Already registered?{" "}
                    <Link
                      to="/become-vendor"
                      className="text-green-600 font-semibold hover:text-green-700"
                    >
                      Sign Up Now
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Right Side - Benefits */}
          <div className="hidden lg:block">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                  <Store className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">
                  Vendor Dashboard
                </h2>
              </div>
              <p className="text-gray-300 mb-8">
                Login to manage your business, track orders, and grow your sales
                with KrushiMall.
              </p>

              <div className="space-y-6 mb-8">
                {vendorBenefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 group hover:bg-white/5 p-3 rounded-xl transition-all duration-300"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center group-hover:bg-green-600/30 transition-colors">
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
                      Join 500+ trusted vendors
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Link to Customer Login */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <Link
                  to="/login"
                  className="flex items-center justify-between text-gray-400 hover:text-white transition-colors group"
                >
                  <span>Login as Customer instead?</span>
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorLogin;
