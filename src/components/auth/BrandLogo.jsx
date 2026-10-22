import React from 'react';
import { Link } from 'react-router-dom';

export const BrandLogo = ({
  role = 'recruiter',
  size = 'normal',
  showSubtitle = true,
  variant = 'dark', // 'dark' | 'light'
  textVariant = null, // 'light' | 'dark' | null (null defaults to matching variant)
}) => {
  const isLarge = size === 'large';
  const isSmall = size === 'small';
  const isLight = variant === 'light';
  const isTextLight = textVariant === 'light' || (textVariant === null && isLight);

  return (
    <Link to="/" className="inline-flex items-center gap-2.5 group text-left select-none">
      {/* Briefcase Icon */}
      <div
        className={`${
          isLarge ? 'w-10 h-10' : isSmall ? 'w-8 h-8' : 'w-9 h-9'
        } rounded-xl ${
          isLight
            ? 'bg-white text-[#25324B] shadow-md shadow-black/20'
            : 'bg-[#25324B] text-white shadow-md shadow-[#25324B]/20'
        } flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105`}
      >
        <svg
          className={isLarge ? 'w-6 h-6' : isSmall ? 'w-4 h-4' : 'w-5 h-5'}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="7" width="20" height="14" rx="3" ry="3" />
          <path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3" />
          <line
            x1="2"
            y1="13"
            x2="22"
            y2="13"
            stroke={isLight ? '#25324B' : '#FFFFFF'}
            strokeWidth="1.8"
            opacity="0.85"
          />
          <circle cx="12" cy="13" r="1.5" fill={isLight ? '#25324B' : '#FFFFFF'} />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center leading-none">
          <span
            className={`${
              isLarge ? 'text-xl' : 'text-lg'
            } font-extrabold ${isTextLight ? 'text-white' : 'text-[#25324B]'} tracking-tight`}
          >
            Job
          </span>
          <span
            className={`${
              isLarge ? 'text-xl' : 'text-lg'
            } font-extrabold ${isTextLight ? 'text-white' : 'text-[#25324B]'} tracking-tight ml-0.5`}
          >
            Portal
          </span>
        </div>
        {showSubtitle && (
          <span
            className={`text-[11px] font-medium ${
              isTextLight ? 'text-slate-200' : 'text-[#7C8493]'
            } mt-0.5 capitalize tracking-wide`}
          >
            {role === 'candidate' ? 'Candidate Portal' : 'Recruiter Portal'}
          </span>
        )}
      </div>
    </Link>
  );
};
