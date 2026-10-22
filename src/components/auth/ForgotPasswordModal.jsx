import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Mail, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { InputField } from '../common/InputField';
import { useAuth } from '../../context/AuthContext';

export const ForgotPasswordModal = ({ isOpen, onClose, initialEmail = '' }) => {
  const { requestPasswordReset, resetPassword } = useAuth();
  const [step, setStep] = useState(1); // 1: Email, 2: Reset Link Sent / New Password
  const [resetEmail, setResetEmail] = useState(initialEmail);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
    reset: resetEmailForm,
  } = useForm({
    defaultValues: { email: initialEmail },
  });

  const {
    register: registerNewPass,
    handleSubmit: handleSubmitNewPass,
    watch: watchNewPass,
    formState: { errors: passErrors },
    reset: resetPassForm,
  } = useForm();

  if (!isOpen) return null;

  const handleClose = () => {
    setStep(1);
    resetEmailForm();
    resetPassForm();
    onClose();
  };

  const onSendEmail = async (data) => {
    try {
      setIsSubmitting(true);
      await requestPasswordReset(data.email);
      setResetEmail(data.email);
      setStep(2);
    } catch {
      // handled
    } finally {
      setIsSubmitting(false);
    }
  };

  const onUpdatePassword = async (data) => {
    try {
      setIsSubmitting(true);
      await resetPassword(resetEmail, data.newPassword);
      setStep(3);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch {
      // handled
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordVal = watchNewPass('newPassword');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 sm:p-8 relative shadow-2xl border border-gray-100">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 1 && (
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#F0F3F8] text-[#25324B] flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 stroke-[2]" />
            </div>

            <h3 className="text-xl font-bold text-[#25324B] mb-1">
              Reset Your Password
            </h3>
            <p className="text-sm text-[#515B6F] mb-6">
              Enter your registered email address and we'll send you instructions to reset your password.
            </p>

            <form onSubmit={handleSubmitEmail(onSendEmail)}>
              <InputField
                label="Registered Email Address"
                name="email"
                type="email"
                placeholder="e.g. recruiter@jobportal.com"
                icon={Mail}
                register={registerEmail}
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
                disabled={isSubmitting}
                className="w-full mt-4 py-3.5 px-6 rounded-xl bg-[#25324B] hover:bg-[#1B2537] text-white font-semibold text-sm transition-all shadow-md shadow-[#25324B]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Send Reset Instructions</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#F0F3F8] text-[#25324B] flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6 stroke-[2]" />
            </div>

            <h3 className="text-xl font-bold text-[#25324B] mb-1">
              Set New Password
            </h3>
            <p className="text-sm text-[#515B6F] mb-5">
              Reset link verified for <span className="font-semibold text-[#25324B]">{resetEmail}</span>. Enter your new password below.
            </p>

            <form onSubmit={handleSubmitNewPass(onUpdatePassword)}>
              <InputField
                label="New Password"
                name="newPassword"
                type="password"
                placeholder="Minimum 6 characters"
                icon={Lock}
                register={registerNewPass}
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
                register={registerNewPass}
                rules={{
                  required: 'Please confirm your new password',
                  validate: (value) =>
                    value === passwordVal || 'Passwords do not match',
                }}
                error={passErrors.confirmPassword}
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 py-3.5 px-6 rounded-xl bg-[#25324B] hover:bg-[#1B2537] text-white font-semibold text-sm transition-all shadow-md shadow-[#25324B]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Update Password & Save</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-[#F0F3F8] text-[#25324B] flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h3 className="text-2xl font-bold text-[#25324B] mb-2">
              Password Changed!
            </h3>
            <p className="text-sm text-[#515B6F]">
              Your password has been successfully updated in LocalStorage. You can now log in with your new credentials.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
