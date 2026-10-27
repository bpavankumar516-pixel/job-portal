import React, { useState, useRef, useEffect } from 'react';
import {
  MapPin,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Briefcase,
} from 'lucide-react';
import { getCategoryBadgeStyle, getTypeBadgeStyle } from '../../services/jobsService';

export const JobTable = ({
  jobs,
  onViewJob,
  onEditJob,
  onDeleteJob,
  onToggleStatus,
  selectedJobIds = [],
  onToggleSelectJob,
  onToggleSelectAll,
}) => {
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef = useRef(null);

  // Close three dots dropdown on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenuId(null);
      }
    };
    if (activeMenuId) {
      document.addEventListener('mousedown', handleOutside);
    }
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [activeMenuId]);

  const allSelected = jobs.length > 0 && selectedJobIds.length === jobs.length;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-[#25324B] border-collapse min-w-[1050px]">
          {/* Table Header matching reference image */}
          <thead>
            <tr className="border-b border-[#F0F2F6] bg-[#F8F9FC]/70 text-[#7C8493] font-bold select-none text-[11px]">
              <th className="py-3.5 pl-5 pr-2 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleSelectAll}
                  className="w-4 h-4 rounded text-[#25324B] focus:ring-[#25324B] border-gray-300 cursor-pointer accent-[#25324B]"
                  aria-label="Select all jobs"
                />
              </th>
              <th className="py-3.5 px-3 font-bold">Job Title</th>
              <th className="py-3.5 px-3 font-bold">Company</th>
              <th className="py-3.5 px-3 font-bold">Category</th>
              <th className="py-3.5 px-3 font-bold">Type</th>
              <th className="py-3.5 px-3 font-bold">Location</th>
              <th className="py-3.5 px-3 font-bold">Salary Range</th>
              <th className="py-3.5 px-3 font-bold">Experience</th>
              <th className="py-3.5 px-3 font-bold">Status</th>
              <th className="py-3.5 px-3 font-bold text-center">Applications</th>
              <th className="py-3.5 pr-5 pl-2 font-bold text-right">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[#F0F2F6]">
            {jobs.length === 0 ? (
              <tr>
                <td colSpan="11" className="py-12 text-center text-[#7C8493]">
                  <div className="w-12 h-12 rounded-2xl bg-[#F0F3F8] text-[#25324B] flex items-center justify-center mx-auto mb-3">
                    <Briefcase className="w-6 h-6 stroke-[1.8]" />
                  </div>
                  <p className="font-extrabold text-[#25324B] text-sm">No Jobs Found</p>
                  <p className="text-xs text-[#7C8493] mt-1">
                    Try clearing or adjusting your search filters.
                  </p>
                </td>
              </tr>
            ) : (
              jobs.map((job) => {
                const isSelected = selectedJobIds.includes(job.id);
                const isMenuOpen = activeMenuId === job.id;

                return (
                  <tr
                    key={job.id}
                    className={`hover:bg-[#F8F9FC]/60 transition-colors group ${
                      isSelected ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    {/* 1. Checkbox */}
                    <td className="py-4 pl-5 pr-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelectJob(job.id)}
                        className="w-4 h-4 rounded text-[#25324B] focus:ring-[#25324B] border-gray-300 cursor-pointer accent-[#25324B]"
                        aria-label={`Select ${job.title}`}
                      />
                    </td>

                    {/* 2. Job Title + Posted date */}
                    <td className="py-4 px-3 max-w-[190px]">
                      <button
                        type="button"
                        onClick={() => onViewJob(job)}
                        className="text-left font-extrabold text-[#25324B] hover:underline text-xs sm:text-[13px] tracking-tight block truncate cursor-pointer"
                      >
                        {job.title}
                      </button>
                      <span className="text-[11px] text-[#7C8493] font-medium block mt-0.5">
                        {job.postedTime}
                      </span>
                    </td>

                    {/* 3. Company Logo + Name + Industry */}
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg border border-[#E9ECF2] p-1 flex items-center justify-center bg-white shadow-2xs flex-shrink-0 overflow-hidden">
                          {job.companyLogo ? (
                            <img
                              src={job.companyLogo}
                              alt={job.companyName}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                              }}
                              className="w-full h-full object-contain"
                              loading="lazy"
                            />
                          ) : null}
                          <div
                            style={{ display: job.companyLogo ? 'none' : 'flex' }}
                            className={`w-full h-full rounded ${
                              job.fallbackBg || 'bg-[#25324B]'
                            } text-white font-extrabold text-[10px] items-center justify-center`}
                          >
                            {job.fallbackLetter || job.companyName?.charAt(0) || 'C'}
                          </div>
                        </div>

                        <div className="min-w-0">
                          <span className="font-extrabold text-[#25324B] text-xs block truncate">
                            {job.companyName}
                          </span>
                          <span className="text-[10px] text-[#7C8493] block truncate">
                            {job.companyIndustry}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* 4. Category Badge */}
                    <td className="py-4 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getCategoryBadgeStyle(
                          job.category
                        )}`}
                      >
                        {job.category}
                      </span>
                    </td>

                    {/* 5. Employment Type Badge */}
                    <td className="py-4 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${getTypeBadgeStyle(
                          job.employmentType
                        )}`}
                      >
                        {job.employmentType}
                      </span>
                    </td>

                    {/* 6. Location with MapPin icon */}
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-1.5 text-xs text-[#515B6F] font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#7C8493] flex-shrink-0" />
                        <span className="truncate">{job.location}</span>
                      </div>
                    </td>

                    {/* 7. Salary Range */}
                    <td className="py-4 px-3 font-semibold text-xs text-[#25324B] whitespace-nowrap">
                      {job.salaryRange}
                    </td>

                    {/* 8. Experience */}
                    <td className="py-4 px-3 text-[#7C8493] font-medium text-xs whitespace-nowrap">
                      {job.experience}
                    </td>

                    {/* 9. Status Badge matching reference image */}
                    <td className="py-4 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          job.status === 'Open'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-red-50 text-red-600 border-red-200'
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>

                    {/* 10. Applications count */}
                    <td className="py-4 px-3 text-center font-bold text-xs text-[#25324B]">
                      {job.applicationsCount}
                    </td>

                    {/* 11. Actions */}
                    <td className="py-4 pr-5 pl-2 text-right relative">
                      <div className="flex items-center justify-end gap-1">
                        {/* Quick View */}
                        <button
                          type="button"
                          onClick={() => onViewJob(job)}
                          title="View Details"
                          className="p-1.5 rounded-lg text-[#7C8493] hover:text-[#25324B] hover:bg-[#F0F3F8] transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Quick Edit */}
                        <button
                          type="button"
                          onClick={() => onEditJob(job)}
                          title="Edit Job"
                          className="p-1.5 rounded-lg text-[#7C8493] hover:text-[#25324B] hover:bg-[#F0F3F8] transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Quick Delete */}
                        <button
                          type="button"
                          onClick={() => onDeleteJob(job)}
                          title="Delete Job"
                          className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        {/* Three Dots More Options */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(isMenuOpen ? null : job.id);
                            }}
                            className="p-1.5 rounded-lg text-[#7C8493] hover:text-[#25324B] hover:bg-[#F0F3F8] transition-colors cursor-pointer"
                            aria-label="More Actions"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {/* Dropdown Menu */}
                          {isMenuOpen && (
                            <div
                              ref={menuRef}
                              className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-[#E9ECF2] p-1 z-30 animate-fadeIn text-left text-xs"
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onViewJob(job);
                                }}
                                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-[#F0F3F8] text-[#25324B] font-semibold transition-colors cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5 text-[#7C8493]" />
                                <span>View Details</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onEditJob(job);
                                }}
                                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-[#F0F3F8] text-[#25324B] font-semibold transition-colors cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-[#7C8493]" />
                                <span>Edit Job</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onToggleStatus(job.id);
                                }}
                                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-[#F0F3F8] text-[#25324B] font-semibold transition-colors cursor-pointer"
                              >
                                {job.status === 'Open' ? (
                                  <>
                                    <XCircle className="w-3.5 h-3.5 text-amber-600" />
                                    <span>Mark as Closed</span>
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Mark as Open</span>
                                  </>
                                )}
                              </button>

                              <div className="border-t border-[#F0F2F6] my-1" />

                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onDeleteJob(job);
                                }}
                                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-red-50 text-red-600 font-semibold transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete Job</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
