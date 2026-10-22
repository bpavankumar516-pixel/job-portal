import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from '../components/auth/BrandLogo';
import { InputField } from '../components/common/InputField';
import { AuthHeroLeft } from '../components/auth/AuthHeroLeft';

export const ForgotPassword = () => {
  const { requestPasswordReset, resetPassword, role } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Email, 2: New Password, 3: Success
  const [resetEmail, setResetEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register: regEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm();

  const {
    register: regPass,
    handleSubmit: handlePassSubmit,
    watch: watchPass,
    formState: { errors: passErrors },
  } = useForm();

  const newPassVal = watchPass('newPassword');

  const onSendEmail = async (data) => {
    try {
      setIsLoading(true);
      await requestPasswordReset(data.email);
      setResetEmail(data.email);
      setStep(2);
    } catch {
      // Error handled by AuthContext toast
    } finally {
      setIsLoading(false);
    }
  };

  const onResetPass = async (data) => {
    try {
      setIsLoading(true);
      await resetPassword(resetEmail, data.newPassword);
      setStep(3);
    } catch {
      // Error handled by AuthContext toast
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

      {/* Top right floating sign-in link in Slate #25324B */}
      <div className="hidden lg:flex absolute top-5 right-8 z-20 items-center gap-1.5 text-xs sm:text-sm text-[#515B6F]">
        <span>Remember your credentials?</span>
        <Link
          to="/login"
          className="font-bold text-[#25324B] hover:text-black hover:underline transition-colors"
        >
          Sign In
        </Link>
      </div>

      {/* Left Column: Visual Branding Hero (60% Width Split) */}
      <div className="hidden lg:flex w-full lg:w-[60%] h-full flex-shrink-0 border-r border-[#E9ECF2] overflow-hidden">
        <AuthHeroLeft role={role} />
      </div>

      {/* Right Column: Reset Form (40% Width Split, Vertically Centered in 100vh) */}
      <div className="w-full lg:w-[40%] h-full flex flex-col justify-center items-center p-4 sm:p-6 lg:p-7 xl:p-8 relative z-10 overflow-y-auto lg:overflow-hidden">
        <div className="w-full max-w-[480px] relative z-10 my-auto">
          {/* Mobile top sign-in bar */}
          <div className="flex lg:hidden justify-between items-center mb-3 text-xs sm:text-sm">
            <span className="text-[#515B6F]">Remember password?</span>
            <Link
              to="/login"
              className="font-bold text-[#25324B] hover:underline"
            >
              Sign In
            </Link>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-7 lg:p-8 shadow-auth-card border border-[#E9ECF2]/80">
            {/* Back to sign in */}
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#515B6F] hover:text-[#25324B] transition-colors mb-3 cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              <span>Back to Sign In</span>
            </Link>

            {/* Logo inside card */}
            <div className="mb-3.5">
              <BrandLogo role={role} size="normal" />
            </div>

            {step === 1 && (
              <div>
                <h2 className="text-2xl sm:text-[26px] font-extrabold text-[#25324B] tracking-tight">
                  Forgot Password?
                </h2>
                <p className="text-xs sm:text-sm text-[#515B6F] mt-1 mb-4 leading-relaxed">
                  Enter your registered email address and we'll verify your account to reset your password.
                </p>

                <form onSubmit={handleEmailSubmit(onSendEmail)} className="space-y-3">
                  <InputField
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="e.g. recruiter@jobportal.com"
                    icon={Mail}
                    autoComplete="email"
                    register={regEmail}
                    rules={{
                      required: 'Email address is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Please enter a valid email address',
                      },
                    }}
                    error={emailErrors.email}
                  />

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-3.5 py-3 px-5 rounded-xl bg-[#25324B] hover:bg-[#1B2537] text-white font-bold text-sm sm:text-base tracking-wide transition-all shadow-md shadow-[#25324B]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isLoading ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Verify & Send Instructions</span>
                        <ArrowRight className="w-4 h-4 stroke-[2.2]" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {step === 2 && (
              <div>
                <div className="w-11 h-11 rounded-xl bg-[#F0F3F8] text-[#25324B] flex items-center justify-center mb-3.5">
                  <Lock className="w-5 h-5 stroke-[2]" />
                </div>

                <h2 className="text-2xl sm:text-[28px] font-extrabold text-[#25324B] tracking-tight">
                  Set New Password
                </h2>
                <p className="text-xs sm:text-sm text-[#515B6F] mt-1 mb-4">
                  Account verified for <span className="font-bold text-[#25324B]">{resetEmail}</span>. Enter your new strong password below.
                </p>

                <form onSubmit={handlePassSubmit(onResetPass)} className="space-y-3">
                  <InputField
                    label="New Password"
                    name="newPassword"
                    type="password"
                    placeholder="Minimum 6 characters"
                    icon={Lock}
                    register={regPass}
                    rules={{
                      required: 'New password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    }}
                    error={passErrors.newPassword}
                  />

                  <InputField
                    label="Confirm New Password"
                    name="confirmPassword"
                    type="password"
                    placeholder="Re-enter new password"
                    icon={Lock}
                    register={regPass}
                    rules={{
                      required: 'Please confirm your new password',
                      validate: (val) => val === newPassVal || 'Passwords do not match',
                    }}
                    error={passErrors.confirmPassword}
                  />

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-3.5 py-3 px-5 rounded-xl bg-[#25324B] hover:bg-[#1B2537] text-white font-bold text-sm sm:text-base tracking-wide transition-all shadow-md shadow-[#25324B]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isLoading ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Save New Password</span>
                        <ArrowRight className="w-4 h-4 stroke-[2.2]" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {step === 3 && (
              <div className="text-center py-5">
                <div className="w-14 h-14 rounded-full bg-[#F0F3F8] text-[#25324B] flex items-center justify-center mx-auto mb-3.5">
                  <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
                </div>
                <h3 className="text-2xl font-extrabold text-[#25324B] mb-2">
                  Password Updated!
                </h3>
                <p className="text-xs sm:text-sm text-[#515B6F] mb-5">
                  Your new password is now stored securely in LocalStorage. You can sign in right away.
                </p>

                <button
                  onClick={() => navigate('/login')}
                  className="w-full py-3 px-5 rounded-xl bg-[#25324B] hover:bg-[#1B2537] text-white font-bold text-sm sm:text-base tracking-wide transition-all shadow-md shadow-[#25324B]/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Sign In</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.2]" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
