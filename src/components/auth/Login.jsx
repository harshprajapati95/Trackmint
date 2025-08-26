import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { useAuth } from "../../context/AuthContext";

const Login = ({ onSwitchToSignup }) => {
  const { login, loading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      reset();
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light">
      <div className="w-full max-w-md p-8">
        <div className="card">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">TrackMint</h1>
            <p className="text-secondary">Your personal finance companion</p>
          </div>

          {/* Welcome Message */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-2">Welcome back!</h2>
            <p className="text-secondary">Sign in to your account to continue</p>
          </div>
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-danger/10 rounded-lg border border-danger/20">
              <p className="text-danger text-sm">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div className="form-group">
              <label className="form-label flex items-center gap-2">
                <Mail size={18} />
                Email Address
              </label>
              <input
                type="email"
                className={`form-input ${errors.email ? 'border-danger' : ''}`}
                placeholder="Enter your email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
              />
              {errors.email && (
                <p className="text-danger text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label className="form-label flex items-center gap-2">
                <Lock size={18} />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input pr-12 ${errors.password ? 'border-danger' : ''}`}
                  placeholder="Enter your password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary hover:text-primary"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-danger text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-accent border-border rounded focus:ring-accent focus:ring-2"
                  {...register('rememberMe')}
                />
                <span className="ml-2 text-sm text-secondary">Remember me</span>
              </label>
              <button type="button" className="text-sm text-accent hover:text-primary">
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || loading}
              className={`btn btn-primary w-full flex items-center justify-center gap-2 ${
                (isLoading || loading) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading || loading ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-8">
            <p className="text-secondary">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToSignup}
                className="text-accent hover:text-primary font-semibold inline-flex items-center gap-1"
              >
                Sign up now
                <ArrowRight size={16} />
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

