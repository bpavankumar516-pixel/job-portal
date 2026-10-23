import React from 'react';
import {
  X,
  MapPin,
  DollarSign,
  Briefcase,
  Users,
  Clock,
  Calendar,
  CheckCircle2,
  Building2,
  Edit2,
  ExternalLink,
} from 'lucide-react';
import { getCategoryBadgeStyle, getTypeBadgeStyle } from '../../services/jobsService';

export const JobDetailsModal = ({ isOpen, onClose, job, onEdit, onToggleStatus }) => {
  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-xl p-6 sm:p-8 relative shadow-2xl border border-[#E9ECF2] max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#7C8493] hover:text-[#25324B] hover:bg-[#F8F9FC] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header: Company Logo, Job Title, Badges */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl border border-[#E9ECF2] p-2 flex items-center justify-center bg-white shadow-2xs flex-shrink-0">
            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={job.companyName}
                className="w-full h-full object-contain"
              />
            ) : (
              <div
                className={`w-full h-full rounded-xl ${
                  job.fallbackBg || 'bg-[#25324B]'
                } text-white font-extrabold text-base flex items-center justify-center`}
              >
                {job.fallbackLetter || job.companyName?.charAt(0) || 'C'}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#25324B] break-words">
                {job.title}
              </h3>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  job.status === 'Open'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-red-50 text-red-600 border-red-200'
                }`}
              >
                {job.status}
              </span>
            </div>

            <p className="text-xs text-[#7C8493] mt-0.5 font-medium">
              {job.companyName} • {job.companyIndustry}
            </p>

            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getCategoryBadgeStyle(
                  job.category
                )}`}
              >
                {job.category}
              </span>
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${getTypeBadgeStyle(
                  job.employmentType
                )}`}
              >
                {job.employmentType}
              </span>
            </div>
          </div>
        </div>

        {/* Metric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-2xl bg-[#F8F9FC] border border-[#E9ECF2] text-xs mb-5">
          <div>
            <span className="text-[#7C8493] block">Salary:</span>
            <p className="font-extrabold text-[#25324B] mt-0.5">{job.salaryRange}</p>
          </div>
          <div>
            <span className="text-[#7C8493] block">Experience:</span>
            <p className="font-extrabold text-[#25324B] mt-0.5">{job.experience}</p>
          </div>
          <div>
            <span className="text-[#7C8493] block">Location:</span>
            <p className="font-extrabold text-[#25324B] mt-0.5 truncate">{job.location}</p>
          </div>
          <div>
            <span className="text-[#7C8493] block">Applicants:</span>
            <p className="font-extrabold text-[#25324B] mt-0.5">{job.applicationsCount} Candidates</p>
          </div>
        </div>

        {/* Job Description */}
        <div className="mb-4">
          <h4 className="text-xs font-bold text-[#7C8493] uppercase tracking-wider mb-1.5">
            Role Overview
          </h4>
          <p className="text-xs sm:text-sm text-[#515B6F] leading-relaxed">
            {job.description}
          </p>
        </div>

        {/* Requirements */}
        {job.requirements && job.requirements.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs font-bold text-[#7C8493] uppercase tracking-wider mb-2">
              Key Requirements
            </h4>
            <ul className="space-y-1.5">
              {job.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-[#515B6F]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#F0F2F6]">
          <button
            type="button"
            onClick={() => {
              onToggleStatus(job.id);
            }}
            className="text-xs font-bold text-[#25324B] hover:underline cursor-pointer"
          >
            {job.status === 'Open' ? 'Mark as Closed' : 'Re-open Position'}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(job);
              }}
              className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#25324B] text-white text-xs font-bold hover:bg-[#1C2638] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
