import React from 'react';
import { Briefcase, User } from 'lucide-react';

export const RoleSelector = ({ role, onChange }) => {
  return (
    <div className="grid grid-cols-2 gap-3 my-3 sm:my-3.5">
      {/* Recruiter Tab */}
      <button
        type="button"
        onClick={() => onChange('recruiter')}
        className={`relative flex items-center gap-3 p-3 sm:p-3.5 rounded-xl border transition-all duration-200 text-left outline-none cursor-pointer ${
          role === 'recruiter'
            ? 'bg-[#25324B] border-[#25324B] text-white shadow-md shadow-[#25324B]/20 ring-2 ring-[#25324B]/10'
            : 'bg-white border-[#E5E7EB] hover:border-[#25324B]/40 hover:bg-[#F8F9FC] text-[#25324B]'
        }`}
      >
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
            role === 'recruiter' ? 'bg-white/20 text-white' : 'bg-[#F0F3F8] text-[#25324B]'
          }`}
        >
          <Briefcase className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.2]" />
        </div>
        <div className="flex flex-col min-w-0">
          <span
            className={`text-xs sm:text-sm font-bold leading-tight ${
              role === 'recruiter' ? 'text-white' : 'text-[#25324B]'
            }`}
          >
            Recruiter
          </span>
          <span
            className={`text-[11px] sm:text-xs mt-0.5 truncate ${
              role === 'recruiter' ? 'text-white/85' : 'text-[#7C8493]'
            }`}
          >
            Hire the best talent
          </span>
        </div>
      </button>

      {/* Candidate Tab */}
      <button
        type="button"
        onClick={() => onChange('candidate')}
        className={`relative flex items-center gap-3 p-3 sm:p-3.5 rounded-xl border transition-all duration-200 text-left outline-none cursor-pointer ${
          role === 'candidate'
            ? 'bg-[#25324B] border-[#25324B] text-white shadow-md shadow-[#25324B]/20 ring-2 ring-[#25324B]/10'
            : 'bg-white border-[#E5E7EB] hover:border-[#25324B]/40 hover:bg-[#F8F9FC] text-[#25324B]'
        }`}
      >
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
            role === 'candidate' ? 'bg-white/20 text-white' : 'bg-[#F0F3F8] text-[#25324B]'
          }`}
        >
          <User className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.2]" />
        </div>
        <div className="flex flex-col min-w-0">
          <span
            className={`text-xs sm:text-sm font-bold leading-tight ${
              role === 'candidate' ? 'text-white' : 'text-[#25324B]'
            }`}
          >
            Candidate
          </span>
          <span
            className={`text-[11px] sm:text-xs mt-0.5 truncate ${
              role === 'candidate' ? 'text-white/85' : 'text-[#7C8493]'
            }`}
          >
            Find your dream job
          </span>
        </div>
      </button>
    </div>
  );
};
