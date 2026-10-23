import React from 'react';
import {
  X,
  MapPin,
  Users,
  Globe,
  Mail,
  Star,
  Briefcase,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export const CompanyDetailsModal = ({ isOpen, onClose, company }) => {
  if (!isOpen || !company) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 relative shadow-2xl border border-[#E9ECF2]">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#7C8493] hover:text-[#25324B] hover:bg-[#F8F9FC] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header: Logo, Name, Industry, Active status */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl border border-[#E9ECF2] p-2 flex items-center justify-center bg-white shadow-xs flex-shrink-0">
            {company.logo ? (
              <img
                src={company.logo}
                alt={company.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full rounded-xl bg-[#25324B] text-white font-extrabold text-xl flex items-center justify-center">
                {company.name?.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl font-extrabold text-[#25324B] truncate">
                {company.name}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {company.status || 'Active'}
              </span>
            </div>

            <p className="text-xs text-[#7C8493] mt-0.5 font-medium">
              {company.industry} • {company.location}
            </p>

            {company.rating && (
              <div className="flex items-center gap-1 mt-1 text-xs font-bold text-amber-500">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{company.rating} / 5.0 Rating</span>
              </div>
            )}
          </div>
        </div>

        {/* Overview Description */}
        <div className="mb-5">
          <h4 className="text-xs font-bold text-[#7C8493] uppercase tracking-wider mb-1.5">
            About Company
          </h4>
          <p className="text-xs sm:text-sm text-[#515B6F] leading-relaxed">
            {company.description}
          </p>
        </div>

        {/* Company Details Grid */}
        <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[#F8F9FC] border border-[#E9ECF2] text-xs mb-6">
          <div>
            <span className="text-[#7C8493] flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#25324B]" />
              <span>Employees:</span>
            </span>
            <p className="font-bold text-[#25324B] mt-0.5">{company.employees}</p>
          </div>

          <div>
            <span className="text-[#7C8493] flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[#25324B]" />
              <span>Open Positions:</span>
            </span>
            <p className="font-bold text-[#25324B] mt-0.5">{company.openJobs || 12} Roles</p>
          </div>

          <div>
            <span className="text-[#7C8493] flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#25324B]" />
              <span>Website:</span>
            </span>
            <a
              href={`https://${company.website?.replace(/^https?:\/\//, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#25324B] hover:underline truncate block mt-0.5"
            >
              {company.website}
            </a>
          </div>

          <div>
            <span className="text-[#7C8493] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#25324B]" />
              <span>Contact Email:</span>
            </span>
            <p className="font-bold text-[#25324B] truncate mt-0.5">{company.email}</p>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-[#F0F2F6]">
          <a
            href={`https://${company.website?.replace(/^https?:\/\//, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#25324B] hover:underline"
          >
            <span>Visit Company Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#25324B] hover:bg-[#1C2638] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            Close View
          </button>
        </div>
      </div>
    </div>
  );
};
