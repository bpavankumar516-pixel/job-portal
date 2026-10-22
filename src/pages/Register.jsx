import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, User, Building, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from '../components/auth/BrandLogo';
import { RoleSelector } from '../components/auth/RoleSelector';
import { InputField } from '../components/common/InputField';
import { SocialLoginButtons } from '../components/auth/SocialLoginButtons';
import { AuthHeroLeft } from '../components/auth/AuthHeroLeft';

export const Register = () => {
  const { register: registerAuth, role, setActiveRole } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      companyOrTitle: '',
      agreeTerms: false,
    },
  });

  const passwordVal = watch('password');

  // Calculate password strength
  const getPasswordStrength = (pass = '') => {
    if (!pass) return { score: 0, text: '', color: 'bg-gray-200' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score: 1, text: 'Weak', color: 'bg-red-500' };
    if (score <= 3) return { score: 2, text: 'Medium', color: 'bg-amber-500' };
    return { score: 3, text: 'Strong', color: 'bg-[#25324B]' };
  };

  const strength = getPasswordStrength(passwordVal);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await registerAuth({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        role: role,
        companyOrTitle: data.companyOrTitle,
      });

      navigate('/dashboard');
    } catch {
      // Toast handled by AuthContext
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

      {/* Top right floating sign-in link */}
      <div className="hidden lg:flex absolute top-5 right-8 z-20 items-center gap-1.5 text-xs sm:text-sm text-[#515B6F]">
        <span>Already have an account?</span>
        <Link
          to="/login"
          className="font-bold text-[#25324B] hover:text-black hover:underline transition-colors"
        >
          Sign In
        </Link>
      </div>

      {/* Left Column: Visual Branding Hero (60% Width Split matching Login) */}
      <div className="hidden lg:flex w-full lg:w-[60%] h-full flex-shrink-0 border-r border-[#E9ECF2] overflow-hidden">
        <AuthHeroLeft role={role} />
      </div>

      {/* Right Column: Register Form (40% Width Split, Vertically Centered in 100vh) */}
      <div className="w-full lg:w-[40%] h-full flex flex-col justify-center items-center p-4 sm:p-6 lg:p-7 xl:p-8 relative z-10 overflow-y-auto lg:overflow-hidden">
        <div className="w-full max-w-[480px] relative z-10 my-auto">
          {/* Mobile top sign-in bar */}
          <div className="flex lg:hidden justify-between items-center mb-3 text-xs sm:text-sm">
            <span className="text-[#515B6F]">Already registered?</span>
            <Link
              to="/login"
              className="font-bold text-[#25324B] hover:underline"
            >
              Sign In
            </Link>
          </div>

          <div className="bg-white rounded-3xl p-5 sm:p-6 lg:p-7 shadow-auth-card border border-[#E9ECF2]/80">
            {/* Logo inside card */}
            <div className="mb-2.5">
              <BrandLogo role={role} size="normal" />
            </div>

            {/* Title & Subtitle */}
            <h2 className="text-2xl sm:text-[26px] font-extrabold text-[#25324B] tracking-tight">
              Create an Account
            </h2>
            <p className="text-xs sm:text-sm text-[#515B6F] mt-0.5 mb-2 leading-relaxed">
              {role === 'recruiter'
                ? 'Join thousands of companies hiring top tech talent worldwide.'
                : 'Discover thousands of opportunities and get hired by world-class teams.'}
            </p>

            {/* Role Selection Tabs */}
            <RoleSelector role={role} onChange={setActiveRole} />

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-1 mt-1">
              {/* Row 1: Full Name & Company/Job Title in 2 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                <InputField
                  label="Full Name"
                  name="fullName"
                  type="text"
                  placeholder="e.g. Sarah Jenkins"
                  icon={User}
                  autoComplete="name"
                  register={register}
                  rules={{
                    required: 'Full name is required',
                    minLength: {
                      value: 2,
                      message: 'Full name must be at least 2 characters',
                    },
                  }}
                  error={errors.fullName}
                  className="mb-0"
                />

                <InputField
                  label={role === 'recruiter' ? 'Company Name' : 'Job Title / Skill'}
                  name="companyOrTitle"
                  type="text"
                  placeholder={
                    role === 'recruiter'
                      ? 'e.g. TechCorp Inc.'
                      : 'e.g. React Developer'
                  }
                  icon={Building}
                  register={register}
                  rules={{
                    required: `${
                      role === 'recruiter' ? 'Company name' : 'Job title'
                    } is required`,
                  }}
                  error={errors.companyOrTitle}
                  className="mb-0"
                />
              </div>

              {/* Row 2: Work Email Address (Full Width) */}
              <InputField
                label={role === 'recruiter' ? 'Work Email Address' : 'Email Address'}
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

              {/* Row 3: Password & Confirm Password in 2 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                <InputField
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Min 6 characters"
                  icon={Lock}
                  autoComplete="new-password"
                  register={register}
                  rules={{
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Min 6 characters',
                    },
                  }}
                  error={errors.password}
                  className="mb-0"
                />

                <InputField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Re-enter password"
                  icon={Lock}
                  autoComplete="new-password"
                  register={register}
                  rules={{
                    required: 'Please confirm password',
                    validate: (val) =>
                      val === passwordVal || 'Passwords do not match',
                  }}
                  error={errors.confirmPassword}
                  className="mb-0"
                />
              </div>

              {/* Terms & Conditions Checkbox */}
              <div className="pt-0.5 pb-1">
                <label className="flex items-start gap-2 cursor-pointer select-none group">
                  <input
                    type="checkbox"
                    {...register('agreeTerms', {
                      required: 'You must agree to the Terms',
                    })}
                    className="w-3.5 h-3.5 mt-0.5 rounded text-[#25324B] border-gray-300 focus:ring-[#25324B] focus:ring-offset-0 accent-[#25324B] cursor-pointer"
                  />
                  <span className="text-[11px] sm:text-xs text-[#515B6F] leading-tight">
                    I agree to JobPortal's{' '}
                    <span className="text-[#25324B] font-semibold hover:underline">
                      Terms of Service
                    </span>{' '}
                    &{' '}
                    <span className="text-[#25324B] font-semibold hover:underline">
                      Privacy Policy
                    </span>
                    .
                  </span>
                </label>
                {errors.agreeTerms && (
                  <p className="mt-0.5 text-[10px] text-red-500 font-medium">
                    {errors.agreeTerms.message}
                  </p>
                )}
              </div>

              {/* Submit Button in Slate #25324B */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-1.5 py-2.5 sm:py-3 px-5 rounded-xl bg-[#25324B] hover:bg-[#1B2537] active:scale-[0.99] text-white font-bold text-xs sm:text-sm tracking-wide transition-all shadow-md shadow-[#25324B]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.2]" />
                  </>
                )}
              </button>
            </form>

            {/* Social Logins */}
            <SocialLoginButtons role={role} />

            {/* Bottom Sign In Prompt */}
            <div className="text-center mt-2.5 pt-2 border-t border-[#F0F2F6]">
              <p className="text-xs sm:text-sm text-[#515B6F]">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-bold text-[#25324B] hover:text-black hover:underline ml-1"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
