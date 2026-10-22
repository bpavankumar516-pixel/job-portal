import React from 'react';
import { BrandLogo } from './BrandLogo';
import heroBgImg from '../../assets/office_handshake.jpg';

export const AuthHeroLeft = ({ role = 'recruiter' }) => {
  const isRecruiter = role === 'recruiter';

  return (
    <div className="relative h-full w-full overflow-hidden select-none flex flex-col justify-between p-8 lg:p-12 xl:p-16">
      {/* 2400px Ultra-HD Job Portal Background Image */}
      <img
        src={heroBgImg}
        alt="Talent Hiring and Recruitment"
        className="absolute inset-0 w-full h-full object-cover object-center select-none"
        loading="eager"
        decoding="sync"
      />

      {/* Subtle contrast overlay so lite white text is sharp and readable */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/35 to-black/45 pointer-events-none" />

      {/* Top Header with Logo: Dark Icon (#25324B) preserved, Lite White text */}
      <div className="relative z-10">
        <BrandLogo role={role} size="normal" variant="dark" textVariant="light" />
      </div>

      {/* Center Main Value Proposition in Lite White (Mundhu Lage Layout) */}
      <div className="relative z-10 max-w-xl my-auto py-6">
        <h1 className="text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-extrabold text-white leading-[1.15] tracking-tight mb-4 drop-shadow-md">
          {isRecruiter ? (
            <>
              Find Top Talent,
              <br />
              <span className="text-white relative inline-block">
                Build Great Teams
                <svg
                  className="absolute -bottom-2.5 left-0 w-full h-3 text-[#25324B] overflow-visible"
                  viewBox="0 0 240 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 9C60 2 180 2 237 8"
                    stroke="#25324B"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </>
          ) : (
            <>
              Find Dream Jobs,
              <br />
              <span className="text-white relative inline-block">
                Build Your Career
                <svg
                  className="absolute -bottom-2.5 left-0 w-full h-3 text-[#25324B] overflow-visible"
                  viewBox="0 0 240 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 9C60 2 180 2 237 8"
                    stroke="#25324B"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </>
          )}
        </h1>

        <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed max-w-lg drop-shadow-sm">
          {isRecruiter
            ? 'Discover skilled professionals, manage your job postings and hire the right talent — faster and smarter.'
            : 'Discover 10,000+ top companies, apply with one click and get hired by world-class teams — faster and smarter.'}
        </p>
      </div>

      {/* Bottom Signature Script Note in Lite White */}
      <div className="relative z-10 pt-4 flex items-center justify-between">
        <div>
          <p className="font-handwriting text-2xl sm:text-3xl font-bold tracking-wide text-white leading-none drop-shadow-md">
            {isRecruiter ? 'Your next star hire is here' : 'Your next dream job is here'}
          </p>
          <svg
            className="w-32 h-2 mt-1.5 text-[#25324B]"
            viewBox="0 0 140 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 5C45 1 95 1 138 6"
              stroke="#25324B"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
