import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield, Truck, RotateCcw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
 
const Login = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});


   const from = new URLSearchParams(location.search).get('redirect') || '/cart';

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // Login the user
    login({ name: 'User', email: formData.email });
    // Redirect to the intended page (cart or previous page)
    navigate(from, { replace: true });
  };



  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    return newErrors;
  };


  const benefits = [
    { icon: Truck, text: 'Track your orders in real-time' },
    { icon: RotateCcw, text: 'Easy returns and exchanges' },
    { icon: Shield, text: 'Secure payment processing' },
  ];

  return (
    <div className=" bg-gray-50 pb-8">
      <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pt-12 md:pt-16 lg:pt-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Form */}
          <div className="max-w-md mx-auto lg:mx-0 w-full">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
              <div className="text-center mb-8">
                <Link to="/" className="inline-block text-2xl font-bold text-green-600 tracking-tight mb-6">
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
                        errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
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
                    <Link to="/forgot-password" className="text-xs text-green-600 hover:text-green-700 font-medium">
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all ${
                        errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                  )}
                </div>

                {/* Remember Me */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-600">
                    Remember me
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full cursor-pointer bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 group"
                >
                  Log In
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Register Link */}
                <p className="text-center text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-green-600 hover:text-green-700 font-semibold">
                    Sign Up Now
                  </Link>
                </p>
              </form>
            
            </div>
          </div>

          {/* Right Side - Benefits */}
          <div className="hidden lg:block">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                Why Create an Account?
              </h2>
              <p className="text-gray-300 mb-8">
                Join thousands of satisfied customers who trust KrushiMall for their auto parts needs.
              </p>
              
              <div className="space-y-6 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                      <benefit.icon className="h-5 w-5 text-blue-400" />
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
                      <div key={i} className="w-10 h-10 rounded-full bg-gray-600 border-2 border-gray-800 flex items-center justify-center text-xs font-bold">
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="h-4 w-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
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