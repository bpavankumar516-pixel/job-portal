import React, { useState, useRef, useEffect } from 'react';
import {
  MapPin,
  Users,
  Globe,
  MoreVertical,
  Edit2,
  Trash2,
  ExternalLink,
} from 'lucide-react';

export const CompanyCard = ({
  company,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const menuRef = useRef(null);

  // Close three-dot menu on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleOutside);
    }
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [menuOpen]);

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-[#CCD5E4] hover:shadow-xs transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Top Header: Logo, Company Name, Active Badge & Industry */}
        <div
          onClick={() => onViewDetails(company)}
          className="flex items-start gap-3.5 mb-3.5 cursor-pointer"
        >
          {/* Company Logo with Fallback */}
          <div className="w-12 h-12 rounded-xl border border-[#E9ECF2] p-1.5 flex items-center justify-center bg-white shadow-2xs flex-shrink-0 group-hover:scale-105 transition-transform overflow-hidden">
            {!imgError && company.logo ? (
              <img
                src={company.logo}
                alt={company.name}
                onError={() => setImgError(true)}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            ) : (
              <div
                className={`w-full h-full rounded-lg ${
                  company.fallbackBg || 'bg-[#25324B]'
                } text-white font-extrabold text-sm flex items-center justify-center`}
              >
                {company.fallbackLetter || company.name?.charAt(0) || 'C'}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            {/* Name + Active Status Badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-extrabold text-base text-[#25324B] tracking-tight truncate group-hover:text-black">
                {company.name}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                {company.status || 'Active'}
              </span>
            </div>

            {/* Industry Badge */}
            <span
              className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                company.industryColor || 'bg-blue-50 text-blue-700 border-blue-100'
              } border`}
            >
              {company.industry}
            </span>
          </div>
        </div>

        {/* Company Meta: Location, Employees, Website */}
        <div className="space-y-1.5 text-xs text-[#7C8493] mb-3">
          <div className="flex items-center gap-2 truncate">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-[#7C8493]" />
            <span className="truncate font-medium">{company.location}</span>
          </div>

          <div className="flex items-center gap-2 truncate">
            <Users className="w-3.5 h-3.5 flex-shrink-0 text-[#7C8493]" />
            <span className="truncate font-medium">{company.employees}</span>
          </div>

          <div className="flex items-center gap-2 truncate">
            <Globe className="w-3.5 h-3.5 flex-shrink-0 text-[#7C8493]" />
            <a
              href={`https://${company.website?.replace(/^https?:\/\//, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate font-medium hover:text-[#25324B] hover:underline transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {company.website}
            </a>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-[#515B6F] line-clamp-2 leading-relaxed mb-4">
          {company.description}
        </p>
      </div>

      {/* Bottom Actions: View Details Button & Three-Dots Menu */}
      <div className="pt-3 border-t border-[#F8F9FC] flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onViewDetails(company)}
          className="px-4 py-2 rounded-xl bg-[#25324B] hover:bg-[#1B2537] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer flex-shrink-0"
        >
          View Details
        </button>

        {/* More Actions Dropdown Menu */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-lg text-[#7C8493] hover:text-[#25324B] hover:bg-[#F0F3F8] transition-colors cursor-pointer"
            aria-label="More options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 bottom-full mb-1.5 w-36 bg-white rounded-xl shadow-lg border border-[#E9ECF2] p-1 z-30 animate-fadeIn text-left text-xs">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onEdit(company);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[#F0F3F8] text-[#25324B] font-semibold transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5 text-[#7C8493]" />
                <span>Edit</span>
              </button>

              <a
                href={`https://${company.website?.replace(/^https?:\/\//, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[#F0F3F8] text-[#25324B] font-semibold transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#7C8493]" />
                <span>Visit Site</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(company);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-red-50 text-red-600 font-semibold transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
