import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export const InputField = ({
  label,
  name,
  type = 'text',
  placeholder,
  icon: Icon,
  register,
  rules,
  error,
  disabled = false,
  autoComplete,
  className = '',
  rightElement,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === 'password';
  const inputType = isPasswordField ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`w-full ${className.includes('mb-') ? '' : 'mb-2.5'} ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-xs font-semibold text-[#25324B] mb-1 tracking-tight"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 pointer-events-none text-[#7C8493] flex items-center justify-center">
            <Icon className="w-4 h-4 stroke-[1.8]" />
          </div>
        )}

        <input
          id={name}
          type={inputType}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          {...(register ? register(name, rules) : {})}
          className={`w-full bg-white text-[#25324B] placeholder:text-[#A0AEC0] text-xs sm:text-sm font-medium rounded-xl border transition-all duration-200 outline-none ${
            Icon ? 'pl-10' : 'pl-3.5'
          } ${isPasswordField || rightElement ? 'pr-10' : 'pr-3.5'} py-2.5 ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-50/20'
              : 'border-[#D6DDEB] hover:border-[#25324B]/50 focus:border-[#25324B] focus:ring-3 focus:ring-[#25324B]/15'
          } ${disabled ? 'opacity-60 bg-gray-50 cursor-not-allowed' : ''}`}
        />

        {isPasswordField && (
          <button
            type="button"
            tabIndex="-1"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 p-1 text-[#7C8493] hover:text-[#25324B] transition-colors rounded-md focus:outline-none cursor-pointer"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4 stroke-[1.8]" />
            ) : (
              <Eye className="w-4 h-4 stroke-[1.8]" />
            )}
          </button>
        )}

        {!isPasswordField && rightElement && (
          <div className="absolute right-3">{rightElement}</div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-[11px] font-medium text-red-500 flex items-center gap-1 animate-fadeIn">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          <span>{error.message || 'This field is invalid'}</span>
        </p>
      )}
    </div>
  );
};
