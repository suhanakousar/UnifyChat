import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { logo } from "../assets";
import {
  showToastError,
  showToastSuccess,
} from "../components/common/ShowToast";
import axios from "axios";
import { useAuth } from "../context/authContext";
import { API_BASE_URL } from "../config/api";
import { Button } from "../components/ui";
import { FaEye, FaEyeSlash, FaArrowRight, FaCheck, FaShieldAlt, FaBolt, FaUsers } from "react-icons/fa";

const Signup = () => {
  const formContext = useForm();
  const { register, handleSubmit, formState, getValues } = formContext;
  const { errors } = formState;
  const { login } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const togglePasswordVisibilityConfirm = () =>
    setShowPasswordConfirm(!showPasswordConfirm);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/signup`,
        data
      );
      if (response.data?.status === "success") {
        showToastSuccess(response.data?.message || "Account created successfully");
        localStorage.setItem('user_id', response.data.user?.id)
        login(response.data?.token);
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect');
        navigate(redirect || "/");
      }
    } catch (err) {
      showToastError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: FaBolt,
      text: "Real-time translation to 140+ languages",
    },
    {
      icon: FaShieldAlt,
      text: "Secure end-to-end encrypted messaging",
    },
    {
      icon: FaUsers,
      text: "Create unlimited group chats",
    },
  ];

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-neutral-50 dark:bg-slate-900 transition-colors">
      {/* Left Side - Branding with Unique Design */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-accent-600 via-accent-700 to-primary-600 dark:from-accent-800 dark:via-accent-900 dark:to-primary-800 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-32 left-20 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-float-delayed"></div>
        </div>
        
        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => navigate("/")}>
            <div className="p-2 bg-white/10 backdrop-blur-sm rounded-2xl group-hover:bg-white/20 transition-all">
              <img src={logo} alt="Chatlas Logo" className="w-10 h-10" />
            </div>
            <span className="text-3xl font-bold text-white">Chat</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
              Join the global
              <br />
              <span className="bg-gradient-to-r from-white to-accent-100 bg-clip-text text-transparent">
                conversation
              </span>
            </h1>
            <p className="text-xl text-white/90 max-w-md">
              Experience seamless communication without language barriers.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4 p-5 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/15 transition-all">
                <div className="flex-shrink-0 p-3 bg-white/20 rounded-xl">
                  <feature.icon className="text-white text-xl" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium leading-relaxed">{feature.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* User Count */}
          <div className="flex items-center space-x-4 p-5 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-white/10 border-2 border-white flex items-center justify-center">
                  <span className="text-white text-sm">👤</span>
                </div>
              ))}
            </div>
            <p className="text-white/90 font-medium">Join 10,000+ users worldwide</p>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-white/60 text-sm">
          © 2025 UnifyChat. All rights reserved.
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center space-x-3 p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-lg">
            <img src={logo} alt="Chatlas Logo" className="w-10 h-10" />
            <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">UnifyChat</span>
          </div>

          {/* Header */}
          <div className="text-center lg:text-left space-y-3">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100">Create account</h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">Start chatting across languages</p>
          </div>

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                Full name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400 transition-all"
                {...register("username", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters"
                  }
                })}
              />
              {errors.username && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.username?.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                Email address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400 transition-all"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.email?.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className="w-full px-4 py-3 pr-12 bg-white dark:bg-slate-800 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400 transition-all"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters"
                    }
                  })}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.password?.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                Confirm password
              </label>
              <div className="relative">
                <input
                  type={showPasswordConfirm ? "text" : "password"}
                  placeholder="Re-enter your password"
                  className="w-full px-4 py-3 pr-12 bg-white dark:bg-slate-800 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400 transition-all"
                  {...register("passwordConfirm", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === getValues("password") || "Passwords do not match"
                  })}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibilityConfirm}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                >
                  {showPasswordConfirm ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
              {errors.passwordConfirm && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.passwordConfirm?.message}</p>
              )}
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                className="w-4 h-4 mt-1 text-primary-600 dark:text-primary-500 border-neutral-300 dark:border-neutral-600 rounded focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-slate-800"
                {...register("terms", {
                  required: "You must accept the terms and conditions"
                })}
              />
              <label className="ml-2 text-sm text-neutral-600 dark:text-neutral-400">
                I agree to the{" "}
                <Link to="/Help" className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/Help" className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.terms && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.terms?.message}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-gradient-to-r from-accent-600 to-primary-600 hover:from-accent-700 hover:to-primary-700 dark:from-accent-500 dark:to-primary-500 dark:hover:from-accent-600 dark:hover:to-primary-600 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-xl shadow-lg shadow-accent-500/30 dark:shadow-accent-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Create account</span>
                  <FaArrowRight />
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="text-center pt-4">
            <p className="text-neutral-600 dark:text-neutral-400">
              Already have an account?{" "}
              <Link to="/Signin" className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
