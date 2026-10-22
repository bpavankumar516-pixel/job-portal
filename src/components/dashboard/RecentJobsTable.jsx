import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  MapPin,
  DollarSign,
  Users,
  Eye,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from 'lucide-react';

export const RecentJobsTable = ({ jobs = [], onToggleStatus, onViewJob }) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      job.companyName.toLowerCase().includes(filterQuery.toLowerCase()) ||
      job.category.toLowerCase().includes(filterQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ? true : job.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#E9ECF2] shadow-2xs">
      {/* Table Header with Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-[#F0F3F8] text-[#25324B] flex items-center justify-center">
              <Briefcase className="w-4 h-4 stroke-[2]" />
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-[#25324B]">
              Active Job Postings
            </h3>
          </div>
          <p className="text-xs text-[#7C8493]">
            Track open positions, applicant counts and status updates
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Table Search Input */}
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#7C8493]" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter positions..."
              className="w-full bg-[#F8F9FC] text-xs font-medium rounded-xl border border-[#E9ECF2] pl-8 pr-3 py-2 outline-none focus:border-[#25324B] focus:bg-white transition-all text-[#25324B]"
            />
          </div>

          {/* Status Dropdown Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F8F9FC] text-xs font-bold text-[#515B6F] border border-[#E9ECF2] rounded-xl px-3 py-2 outline-none cursor-pointer focus:border-[#25324B]"
          >
            <option value="all">All Status</option>
            <option value="open">Open Only</option>
            <option value="closed">Closed Only</option>
          </select>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#F0F2F6] text-[11px] font-extrabold text-[#7C8493] uppercase tracking-wider">
              <th className="pb-3 px-3">Position & Company</th>
              <th className="pb-3 px-3">Category</th>
              <th className="pb-3 px-3">Compensation</th>
              <th className="pb-3 px-3">Applicants</th>
              <th className="pb-3 px-3">Status</th>
              <th className="pb-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F8F9FC] text-xs">
            {filteredJobs.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-10 text-center text-xs text-[#7C8493]">
                  No matching jobs found. Try adjusting your search query or filters.
                </td>
              </tr>
            ) : (
              filteredJobs.map((job) => {
                const isOpen = job.status === 'Open';

                return (
                  <tr
                    key={job.id}
                    className="hover:bg-[#F8F9FC]/80 transition-colors group"
                  >
                    {/* Position & Company Logo */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={job.companyLogo}
                          alt={job.companyName}
                          className="w-10 h-10 rounded-xl object-cover border border-[#E9ECF2] shadow-2xs flex-shrink-0"
                        />
                        <div className="flex flex-col max-w-[220px]">
                          <span className="font-extrabold text-[#25324B] truncate hover:text-[#1B2537]">
                            {job.title}
                          </span>
                          <span className="text-[11px] text-[#7C8493] flex items-center gap-1">
                            <span>{job.companyName}</span>
                            <span>•</span>
                            <span className="flex items-center">
                              <MapPin className="w-2.5 h-2.5 mr-0.5" />
                              {job.location.split('(')[0]}
                            </span>
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#F0F3F8] text-[#25324B] border border-[#CCD5E4]/60">
                        {job.category}
                      </span>
                    </td>

                    {/* Compensation */}
                    <td className="py-3.5 px-3 font-bold text-[#25324B]">
                      {job.salaryRange}
                    </td>

                    {/* Applicants */}
                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center gap-1 font-extrabold text-[#25324B]">
                        <Users className="w-3.5 h-3.5 text-[#7C8493]" />
                        <span>{job.applicationsCount}</span>
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          isOpen
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isOpen ? 'bg-emerald-500' : 'bg-gray-400'
                          }`}
                        />
                        <span>{job.status}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onViewJob && onViewJob(job)}
                          className="p-1.5 rounded-lg text-[#7C8493] hover:text-[#25324B] hover:bg-[#F0F3F8] transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onToggleStatus && onToggleStatus(job.id)}
                          className="px-2 py-1 rounded-lg text-[10px] font-bold border border-[#CCD5E4] hover:bg-[#25324B] hover:text-white transition-colors cursor-pointer text-[#25324B]"
                          title="Toggle Status (Open/Closed)"
                        >
                          {isOpen ? 'Close' : 'Reopen'}
                        </button>
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
