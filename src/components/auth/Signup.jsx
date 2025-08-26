import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, User, UserPlus, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Signup = ({ onSwitchToLogin }) => {
  const { register: registerUser, loading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  // Watch password field for confirmation validation
  const password = watch('password');

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // remove validation-only + checkbox fields
      const { agreeToTerms, marketingConsent, confirmPassword, ...userData } = data;

      await registerUser(userData); // only send what matters
      reset();
    } catch (err) {
      console.error("Registration error:", err);
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
            <h2 className="text-2xl font-semibold text-primary mb-2">Create Account</h2>
            <p className="text-secondary">Join thousands of smart investors</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-danger/10 rounded-lg border border-danger/20">
              <p className="text-danger text-sm">{error}</p>
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  className={`form-input ${errors.firstName ? 'border-danger' : ''}`}
                  placeholder="John"
                  {...register('firstName', {
                    required: 'First name is required',
                    minLength: {
                      value: 2,
                      message: 'First name must be at least 2 characters',
                    },
                  })}
                />
                {errors.firstName && (
                  <p className="text-danger text-sm mt-1">{errors.firstName.message}</p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  className={`form-input ${errors.lastName ? 'border-danger' : ''}`}
                  placeholder="Doe"
                  {...register('lastName', {
                    required: 'Last name is required',
                    minLength: {
                      value: 2,
                      message: 'Last name must be at least 2 characters',
                    },
                  })}
                />
                {errors.lastName && (
                  <p className="text-danger text-sm mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label className="form-label flex items-center gap-2">
                <Mail size={18} />
                Email Address
              </label>
              <input
                type="email"
                className={`form-input ${errors.email ? 'border-danger' : ''}`}
                placeholder="john.doe@example.com"
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
                  placeholder="Create a strong password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters',
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]/,
                      message: 'Password must contain uppercase, lowercase, and number',
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

            {/* Confirm Password Field */}
            <div className="form-group">
              <label className="form-label flex items-center gap-2">
                <Lock size={18} />
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={`form-input pr-12 ${errors.confirmPassword ? 'border-danger' : ''}`}
                  placeholder="Confirm your password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: value => value === password || 'Passwords do not match',
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary hover:text-primary"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-danger text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="form-group">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-accent border-border rounded focus:ring-accent focus:ring-2 mt-0.5"
                  {...register('agreeToTerms', {
                    required: 'You must agree to the terms and conditions',
                  })}
                />
                <span className="text-sm text-secondary">
                  I agree to the{' '}
                  <button type="button" className="text-accent hover:text-primary">
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button type="button" className="text-accent hover:text-primary">
                    Privacy Policy
                  </button>
                </span>
              </label>
              {errors.agreeToTerms && (
                <p className="text-danger text-sm mt-1">{errors.agreeToTerms.message}</p>
              )}
            </div>

            {/* Marketing Consent */}
            <div className="form-group">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-accent border-border rounded focus:ring-accent focus:ring-2 mt-0.5"
                  {...register('marketingConsent')}
                />
                <span className="text-sm text-secondary">
                  I would like to receive product updates and financial tips via email
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || loading}
              className={`btn btn-accent w-full flex items-center justify-center gap-2 ${(isLoading || loading) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              {isLoading || loading ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="text-center mt-8">
            <p className="text-secondary">
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-accent hover:text-primary font-semibold inline-flex items-center gap-1"
              >
                <ArrowLeft size={16} />
                Sign in instead
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
