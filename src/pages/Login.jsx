import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from '../components/auth/BrandLogo';
import { RoleSelector } from '../components/auth/RoleSelector';
import { InputField } from '../components/common/InputField';
import { SocialLoginButtons } from '../components/auth/SocialLoginButtons';
import { AuthHeroLeft } from '../components/auth/AuthHeroLeft';

export const Login = () => {
  const { login, role, setActiveRole, remembered, isAuthenticated, requestPasswordReset } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  const [isForgotView, setIsForgotView] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isForgotLoading, setIsForgotLoading] = useState(false);
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const initialEmail =
    remembered?.email ||
    (role === 'candidate' ? 'candidate@jobportal.com' : 'recruiter@jobportal.com');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: initialEmail,
      password: 'Password@123',
      rememberMe: Boolean(remembered?.email) || true,
    },
  });

  const emailValue = watch('email');

  // Automatically update demo credentials when switching tabs
  const handleRoleChange = (selectedRole) => {
    setActiveRole(selectedRole);
    if (selectedRole === 'recruiter') {
      setValue('email', 'recruiter@jobportal.com', { shouldValidate: true });
      setValue('password', 'Password@123', { shouldValidate: true });
    } else {
      setValue('email', 'candidate@jobportal.com', { shouldValidate: true });
      setValue('password', 'Password@123', { shouldValidate: true });
    }
  };

  const handleOpenForgot = () => {
    setForgotEmail(
      emailValue || (role === 'recruiter' ? 'recruiter@jobportal.com' : 'candidate@jobportal.com')
    );
    setForgotSubmitted(false);
    setIsForgotView(true);
  };

  const handleBackToLogin = () => {
    setIsForgotView(false);
    setForgotSubmitted(false);
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    try {
      setIsForgotLoading(true);
      await requestPasswordReset(forgotEmail);
      setForgotSubmitted(true);
    } catch {
      // Toast message is handled in AuthContext
    } finally {
      setIsForgotLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await login({
        email: data.email,
        password: data.password,
        role: role,
        rememberMe: data.rememberMe,
      });

      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch {
      // Error is caught and surfaced via toast in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-[#F8F9FC] flex flex-col lg:flex-row relative">
      {/* Decorative Organic Wave in Top Right Corner */}
      <div className="hidden lg:block absolute top-0 right-0 pointer-events-none z-0 overflow-hidden">
        <svg
          className="w-72 lg:w-96 h-auto text-[#E6EAF2]/80"
          viewBox="0 0 360 200"
          fill="currentColor"
        >
          <path d="M0,0 L360,0 L360,140 C280,185 180,130 110,75 C60,35 25,15 0,0 Z" />
        </svg>
      </div>

      {/* Top right floating register link for desktop in Slate #25324B */}
      <div className="hidden lg:flex absolute top-5 right-8 z-20 items-center gap-1.5 text-xs sm:text-sm text-[#515B6F]">
        <span>Don't have an account?</span>
        <Link
          to="/register"
          className="font-bold text-[#25324B] hover:text-black hover:underline transition-colors"
        >
          Register
        </Link>
      </div>

      {/* Left Column: Visual Branding Hero (60% Width Split) */}
      <div className="hidden lg:flex w-full lg:w-[60%] h-full flex-shrink-0 border-r border-[#E9ECF2] overflow-hidden">
        <AuthHeroLeft role={role} />
      </div>

      {/* Right Column: Sign In Form (40% Width Split, Vertically Centered in 100vh) */}
      <div className="w-full lg:w-[40%] h-full flex flex-col justify-center items-center p-4 sm:p-6 lg:p-7 xl:p-8 relative z-10 overflow-y-auto lg:overflow-hidden">
        <div className="w-full max-w-[480px] relative z-10 my-auto">
          {/* Mobile top register bar */}
          <div className="flex lg:hidden justify-between items-center mb-3 text-xs sm:text-sm">
            <span className="text-[#515B6F]">Need an account?</span>
            <Link
              to="/register"
              className="font-bold text-[#25324B] hover:underline"
            >
              Register here
            </Link>
          </div>

          {/* Main White Card matching the reference image layout in Slate #25324B */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 lg:p-8 shadow-auth-card border border-[#E9ECF2]/80">
            {/* Logo inside card */}
            <div className="mb-3.5">
              <BrandLogo role={role} size="normal" />
            </div>

            {/* Title & Subtitle */}
            <h2 className="text-2xl sm:text-[26px] font-extrabold text-[#25324B] tracking-tight">
              Welcome Back!
            </h2>
            <p className="text-xs sm:text-sm text-[#515B6F] mt-1 mb-2.5 leading-relaxed">
              {role === 'recruiter'
                ? 'Sign in to your recruiter account and manage postings, candidates and applications.'
                : 'Sign in to your candidate account and explore dream jobs and track applications.'}
            </p>

            {/* Role Selection Tabs: Clicking automatically populates demo credentials */}
            <RoleSelector role={role} onChange={handleRoleChange} />

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
              {/* Email Field */}
              <InputField
                label="Email Address"
                name="email"
                type="email"
                placeholder="Enter your email address"
                icon={Mail}
                autoComplete="email"
                register={register}
                rules={{
                  required: 'Email address is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email address',
                  },
                }}
                error={errors.email}
              />

              {/* Password Field */}
              <InputField
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your password"
                icon={Lock}
                autoComplete="current-password"
                register={register}
                rules={{
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                }}
                error={errors.password}
              />

              {/* Remember me & Forgot Password */}
              <div className="flex items-center justify-between pt-0.5 pb-1.5">
                <label className="flex items-center gap-2 cursor-pointer select-none group">
                  <input
                    type="checkbox"
                    {...register('rememberMe')}
                    className="w-3.5 h-3.5 rounded text-[#25324B] border-gray-300 focus:ring-[#25324B] focus:ring-offset-0 transition-colors accent-[#25324B] cursor-pointer"
                  />
                  <span className="text-xs sm:text-sm font-semibold text-[#25324B] group-hover:text-black">
                    Remember me
                  </span>
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs sm:text-sm font-semibold text-[#25324B] hover:text-black hover:underline transition-colors focus:outline-none cursor-pointer"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button in Slate #25324B */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2.5 py-3 px-5 rounded-xl bg-[#25324B] hover:bg-[#1B2537] active:scale-[0.99] text-white font-bold text-sm sm:text-base tracking-wide transition-all shadow-md shadow-[#25324B]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <ArrowRight className="w-4 h-4 stroke-[2.2]" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            {/* Social Logins */}
            <SocialLoginButtons role={role} />

            {/* Bottom Register Prompt */}
            <div className="text-center mt-3 pt-2.5 border-t border-[#F0F2F6]">
              <p className="text-xs sm:text-sm text-[#515B6F]">
                New to JobPortal?{' '}
                <Link
                  to="/register"
                  className="font-bold text-[#25324B] hover:text-black hover:underline ml-1"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
