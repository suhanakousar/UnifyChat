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
import { FaEye, FaEyeSlash, FaArrowRight, FaGlobe, FaComments, FaBolt } from "react-icons/fa";

const Signin = () => {
  const formContext = useForm();
  const { register, handleSubmit, formState } = formContext;
  const { errors } = formState;
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/login`,
        data
      );
      if (response.data.status === "success") {
        showToastSuccess("Login successful");
        login(response.data?.token);
        localStorage.setItem('user_id', response.data.user?.id)
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect');
        navigate(redirect || "/");
      }
    } catch (err) {
      showToastError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-neutral-50 dark:bg-slate-900 transition-colors">
      {/* Left Side - Branding with Unique Design */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 dark:from-primary-800 dark:via-primary-900 dark:to-accent-800 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-40 right-20 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl animate-float-delayed"></div>
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
              Welcome back to
              <br />
              <span className="bg-gradient-to-r from-white to-primary-100 bg-clip-text text-transparent">
                global conversations
              </span>
            </h1>
            <p className="text-xl text-white/90 max-w-md">
              Continue breaking language barriers with AI-powered real-time translation.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="p-2 bg-white/20 rounded-xl">
                <FaGlobe className="text-white text-xl" />
              </div>
              <div>
                <p className="text-white font-semibold">140+ Languages</p>
                <p className="text-white/70 text-sm">Instant translation</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="p-2 bg-white/20 rounded-xl">
                <FaBolt className="text-white text-xl" />
              </div>
              <div>
                <p className="text-white font-semibold">Real-Time Speed</p>
                <p className="text-white/70 text-sm">&lt; 100ms latency</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="p-2 bg-white/20 rounded-xl">
                <FaComments className="text-white text-xl" />
              </div>
              <div>
                <p className="text-white font-semibold">Secure Chats</p>
                <p className="text-white/70 text-sm">End-to-end encrypted</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-white/60 text-sm">
          © 2025 UnifyChat. All rights reserved.
        </div>
      </div>

      {/* Right Side - Sign In Form */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center space-x-3 p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-lg">
            <img src={logo} alt="Chatlas Logo" className="w-10 h-10" />
            <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">UnifyChatChat</span>
          </div>

          {/* Header */}
          <div className="text-center lg:text-left space-y-3">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100">Welcome back</h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">Sign in to continue your conversations</p>
          </div>

          {/* Google Sign In */}
          <div className="space-y-4">
            <div className="flex justify-center p-4 bg-white dark:bg-slate-800 rounded-2xl border-2 border-neutral-200 dark:border-neutral-700">
              <button
                onClick={handleGoogleLogin}
                className="flex items-center justify-center space-x-3 px-6 py-3 bg-white dark:bg-slate-800 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-slate-700 transition-colors"
              >
                <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5" />
                <span className="text-neutral-700 dark:text-neutral-300 font-medium">Sign in with Google</span>
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-neutral-200 dark:border-neutral-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-neutral-50 dark:bg-slate-900 text-neutral-500 dark:text-neutral-400 font-medium">Or continue with email</span>
              </div>
            </div>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-5">
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
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 pr-12 bg-white dark:bg-slate-800 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400 transition-all"
                    {...register("password", { required: "Password is required" })}
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
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary-600 dark:text-primary-500 border-neutral-300 dark:border-neutral-600 rounded focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-slate-800"
                />
                <span className="ml-2 text-sm text-neutral-600 dark:text-neutral-400">Remember me</span>
              </label>
              <Link to="/Help" className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 dark:from-primary-500 dark:to-primary-600 dark:hover:from-primary-600 dark:hover:to-primary-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-xl shadow-lg shadow-primary-500/30 dark:shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign in</span>
                  <FaArrowRight />
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center pt-4">
            <p className="text-neutral-600 dark:text-neutral-400">
              Don't have an account?{" "}
              <Link to="/Signup" className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
