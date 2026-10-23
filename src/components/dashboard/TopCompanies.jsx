import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Star,
  Briefcase,
  Users,
  Globe,
  X,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { getStoredCompanies } from '../../services/companiesService';

export const TopCompanies = ({ onSelectCompany }) => {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companies, setCompanies] = useState(() => {
    const stored = getStoredCompanies();
    return stored.slice(0, 4);
  });
  const [totalCount, setTotalCount] = useState(() => getStoredCompanies().length);

  // Sync companies dynamically when window or storage changes
  useEffect(() => {
    const handleSync = () => {
      const stored = getStoredCompanies();
      setCompanies(stored.slice(0, 4));
      setTotalCount(stored.length);
    };

    handleSync();
    window.addEventListener('storage', handleSync);
    return () => window.removeEventListener('storage', handleSync);
  }, []);

  const handleOpenCompany = (company) => {
    setSelectedCompany(company);
    if (onSelectCompany) onSelectCompany(company);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#F0F3F8] text-[#25324B] flex items-center justify-center">
            <Building2 className="w-4 h-4 stroke-[2]" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-[#25324B] tracking-tight">
              Top Hiring Companies
            </h3>
            <p className="text-xs text-[#7C8493] font-medium">
              Leading organizations actively recruiting on the portal
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/companies')}
          className="text-xs font-bold text-[#25324B] hover:underline cursor-pointer flex items-center gap-1 group bg-transparent border-0"
        >
          <span>View All ({totalCount})</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* 4-Card Responsive Grid matching Quick Actions symmetry */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {companies.map((comp) => (
          <div
            key={comp.id}
            onClick={() => handleOpenCompany(comp)}
            className="p-4 rounded-2xl border border-gray-100/90 hover:border-[#CCD5E4] hover:bg-[#F8F9FC]/70 hover:shadow-xs transition-all duration-200 cursor-pointer flex flex-col justify-between group bg-white"
          >
            <div>
              {/* Top: Logo & Rating */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="w-12 h-12 rounded-xl border border-[#E9ECF2] p-1.5 flex items-center justify-center bg-white shadow-2xs group-hover:scale-105 transition-transform overflow-hidden flex-shrink-0">
                  {comp.logo ? (
                    <img
                      src={comp.logo}
                      alt={comp.name}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        if (e.target.nextSibling) {
                          e.target.nextSibling.style.display = 'flex';
                        }
                      }}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  ) : null}
                  <div
                    style={{ display: comp.logo ? 'none' : 'flex' }}
                    className={`w-full h-full rounded-lg ${
                      comp.fallbackBg || 'bg-[#25324B]'
                    } text-white font-extrabold text-xs items-center justify-center`}
                  >
                    {comp.fallbackLetter || comp.name?.charAt(0) || 'C'}
                  </div>
                </div>

                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FFF9E6] text-[#B7791F] text-[11px] font-bold">
                  <Star className="w-3 h-3 fill-current text-amber-500" />
                  <span>{comp.rating || 4.8}</span>
                </div>
              </div>

              {/* Company Name & Verified Badge */}
              <div className="flex items-center gap-1.5 mb-1">
                <h4 className="font-extrabold text-sm text-[#25324B] truncate group-hover:text-black">
                  {comp.name}
                </h4>
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
              </div>

              {/* Industry & Location */}
              <p className="text-xs text-[#7C8493] font-medium truncate mb-2">
                {comp.industry}
              </p>

              <div className="flex items-center text-[11px] text-[#7C8493] gap-1 mb-3">
                <MapPin className="w-3 h-3 text-[#7C8493] flex-shrink-0" />
                <span className="truncate">{comp.location}</span>
              </div>
            </div>

            {/* Bottom: Open Jobs Badge & Action */}
            <div className="pt-2.5 border-t border-[#F0F2F6] flex items-center justify-between text-xs">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#F0F3F8] text-[#25324B] border border-[#CCD5E4]/60">
                {comp.openJobs || 12} Open Roles
              </span>
              <span className="text-[11px] font-bold text-[#25324B] group-hover:underline flex items-center gap-0.5">
                <span>View</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Company Profile Modal */}
      {selectedCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-7 relative shadow-2xl border border-[#E9ECF2]">
            <button
              type="button"
              onClick={() => setSelectedCompany(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-start gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl border border-[#E9ECF2] p-1.5 flex items-center justify-center bg-white shadow-xs flex-shrink-0 overflow-hidden">
                {selectedCompany.logo ? (
                  <img
                    src={selectedCompany.logo}
                    alt={selectedCompany.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div
                    className={`w-full h-full rounded-xl ${
                      selectedCompany.fallbackBg || 'bg-[#25324B]'
                    } text-white font-extrabold text-base flex items-center justify-center`}
                  >
                    {selectedCompany.fallbackLetter || selectedCompany.name?.charAt(0) || 'C'}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold text-[#25324B]">
                    {selectedCompany.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700">
                    Verified
                  </span>
                </div>
                <p className="text-xs text-[#7C8493] mt-0.5">
                  {selectedCompany.industry} • {selectedCompany.location}
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#515B6F] leading-relaxed mb-4">
              {selectedCompany.description}
            </p>

            {/* Grid Metrics */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-[#F8F9FC] border border-[#E9ECF2] text-xs mb-5">
              <div>
                <span className="text-[#7C8493] flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>Company Size:</span>
                </span>
                <p className="font-bold text-[#25324B] mt-0.5">{selectedCompany.employees}</p>
              </div>
              <div>
                <span className="text-[#7C8493] flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Active Vacancies:</span>
                </span>
                <p className="font-bold text-[#25324B] mt-0.5">{selectedCompany.openJobs} Positions</p>
              </div>
              <div>
                <span className="text-[#7C8493] flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Website:</span>
                </span>
                <p className="font-bold text-[#25324B] truncate mt-0.5">{selectedCompany.website}</p>
              </div>
              <div>
                <span className="text-[#7C8493] flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                  <span>Employer Rating:</span>
                </span>
                <p className="font-bold text-[#25324B] mt-0.5">{selectedCompany.rating} / 5.0</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#F0F2F6]">
              <button
                type="button"
                onClick={() => {
                  const targetId = selectedCompany.id;
                  setSelectedCompany(null);
                  navigate(`/companies/${targetId}`);
                }}
                className="px-4 py-2 rounded-xl bg-[#25324B] text-white hover:bg-[#1C2638] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <span>View Full Company Page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setSelectedCompany(null)}
                className="px-4 py-2 rounded-xl bg-[#25324B] text-white text-xs font-bold hover:bg-[#1B2537] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
