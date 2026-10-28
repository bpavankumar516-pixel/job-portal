import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/dashboard/Sidebar';
import { HeaderNavbar } from '../components/common/HeaderNavbar';
import {
  getStoredApplications,
  withdrawApplication,
} from '../services/applicationsService';
import {
  FileText,
  Briefcase,
  Building2,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  Trash2,
  Calendar,
  AlertCircle,
  ExternalLink,
  Sparkles,
  MapPin,
  ChevronDown,
  Coins,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { Jobs } from './Jobs';

export const Applications = () => {
  const navigate = useNavigate();
  const { user, role } = useAuth();

  // If Recruiter, render the previous original Applications view (<Jobs />)
  if (role !== 'candidate') {
    return <Jobs />;
  }

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Live Applications state synced across storage events
  const [applications, setApplications] = useState(() => getStoredApplications());

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobFilter, setSelectedJobFilter] = useState('All Jobs');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'In Review' | 'Shortlisted' | 'Interview' | 'Hired' | 'Rejected'

  // Sync with storage & application updates
  useEffect(() => {
    const handleSync = () => {
      setApplications(getStoredApplications());
    };
    window.addEventListener('applications_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('applications_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const candidateName = user?.fullName || 'Olivia Wilson';
  const candidateEmail = user?.email || 'olivia.wilson@example.com';

  // Filter applications specifically for the logged-in candidate
  const myApplications = useMemo(() => {
    return applications.filter(
      (a) =>
        a.candidateName === candidateName ||
        a.candidateEmail === candidateEmail ||
        a.candidateEmail === 'candidate@jobportal.com' ||
        a.candidateEmail === 'olivia.wilson@example.com' ||
        String(a.candidateId) === '1' ||
        a.candidateName === 'Olivia Wilson'
    );
  }, [applications, candidateName, candidateEmail]);

  // Metrics specifically for the candidate
  const stats = useMemo(() => {
    return {
      total: myApplications.length,
      inReview: myApplications.filter((a) => a.status === 'In Review').length,
      shortlisted: myApplications.filter((a) => a.status === 'Shortlisted').length,
      interview: myApplications.filter((a) => a.status === 'Interview').length,
      hired: myApplications.filter((a) => a.status === 'Hired').length,
    };
  }, [myApplications]);

  // Extract unique jobs for filter dropdown
  const uniqueJobTitles = useMemo(() => {
    const set = new Set(['All Jobs']);
    myApplications.forEach((a) => {
      if (a.jobTitle) set.add(a.jobTitle);
    });
    return Array.from(set);
  }, [myApplications]);

  // Filtered applications list
  const filteredApplications = useMemo(() => {
    return myApplications.filter((app) => {
      // 1. Status Filter
      if (statusFilter !== 'All' && app.status !== statusFilter) {
        return false;
      }

      // 2. Job Filter
      if (selectedJobFilter !== 'All Jobs' && app.jobTitle !== selectedJobFilter) {
        return false;
      }

      // 3. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchJob = app.jobTitle?.toLowerCase().includes(q);
        const matchCompany = app.companyName?.toLowerCase().includes(q);
        const matchNotes = app.notes?.toLowerCase().includes(q);
        const matchLocation = app.candidateLocation?.toLowerCase().includes(q);

        if (!matchJob && !matchCompany && !matchNotes && !matchLocation) {
          return false;
        }
      }

      return true;
    });
  }, [myApplications, statusFilter, selectedJobFilter, searchQuery]);

  // Withdraw Handler
  const handleWithdraw = (appId, jobTitle) => {
    if (window.confirm(`Are you sure you want to withdraw your application for "${jobTitle}"?`)) {
      const ok = withdrawApplication(appId);
      if (ok) {
        setApplications(getStoredApplications());
        toast.info(`Application for "${jobTitle}" has been withdrawn.`, {
          icon: '🗑️',
        });
      }
    }
  };

  // Status Badge Helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Hired':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Interview':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Shortlisted':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Rejected':
        return 'bg-rose-50 text-rose-600 border-rose-200';
      default:
        return 'bg-slate-100 text-[#25324B] border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex">
      {/* 1. Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-5 sm:p-7 lg:p-9 max-w-[1440px] w-full mx-auto space-y-6">
          {/* Header Navbar */}
          <HeaderNavbar
            onToggleSidebar={() => setSidebarOpen(true)}
            icon={<FileText className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.2] text-[#25324B]" />}
            title="My Job Applications"
            subtitle="Track real-time updates, recruiter reviews, and upcoming interview schedules."
            searchPlaceholder="Search by job title, company..."
            onSearch={(val) => setSearchQuery(val)}
          />

          {/* 3. Pipeline Metrics Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 text-left">
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
              <span className="text-[11px] font-bold text-[#7C8493] uppercase tracking-wider block">
                Total Applied
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#25324B] mt-2 block leading-none">
                {stats.total}
              </span>
              <span className="text-[11px] font-semibold text-blue-600 mt-1 block">
                Active submissions
              </span>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
              <span className="text-[11px] font-bold text-[#7C8493] uppercase tracking-wider block">
                In Review
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#25324B] mt-2 block leading-none">
                {stats.inReview}
              </span>
              <span className="text-[11px] font-semibold text-slate-500 mt-1 block">
                Screening in progress
              </span>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
              <span className="text-[11px] font-bold text-[#7C8493] uppercase tracking-wider block">
                Shortlisted
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-2 block leading-none">
                {stats.shortlisted}
              </span>
              <span className="text-[11px] font-semibold text-amber-600 mt-1 block">
                Passed screening
              </span>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
              <span className="text-[11px] font-bold text-[#7C8493] uppercase tracking-wider block">
                Interviews
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-blue-600 mt-2 block leading-none">
                {stats.interview}
              </span>
              <span className="text-[11px] font-semibold text-blue-600 mt-1 block">
                Interview stage
              </span>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
              <span className="text-[11px] font-bold text-[#7C8493] uppercase tracking-wider block">
                Offers / Hired
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-2 block leading-none">
                {stats.hired}
              </span>
              <span className="text-[11px] font-semibold text-emerald-600 mt-1 block">
                Hired positions
              </span>
            </div>
          </div>

          {/* 4. Filter Toolbar */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-center justify-between gap-3 text-left">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-[#7C8493] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by job title, company..."
                className="w-full bg-[#F8F9FC] text-xs sm:text-sm font-medium rounded-xl border border-[#E9ECF2] hover:border-[#CCD5E4] focus:border-[#25324B] focus:bg-white pl-10 pr-3.5 py-2.5 outline-none transition-all text-[#25324B]"
              />
            </div>

            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap w-full md:w-auto">
              {/* Job Position Filter */}
              {uniqueJobTitles.length > 2 && (
                <div className="relative flex-1 sm:flex-initial sm:w-48">
                  <select
                    value={selectedJobFilter}
                    onChange={(e) => setSelectedJobFilter(e.target.value)}
                    className="w-full bg-[#F8F9FC] text-xs font-bold text-[#25324B] border border-[#E9ECF2] hover:border-[#CCD5E4] rounded-xl px-3 py-2.5 pr-7 outline-none cursor-pointer appearance-none transition-colors"
                  >
                    {uniqueJobTitles.map((title) => (
                      <option key={title} value={title}>
                        {title}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-[#7C8493] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              )}

              {/* Status Tabs */}
              <div className="flex items-center gap-1 p-1 bg-[#F8F9FC] border border-gray-200/80 rounded-xl overflow-x-auto">
                {['All', 'In Review', 'Shortlisted', 'Interview', 'Hired'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setStatusFilter(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      statusFilter === tab
                        ? 'bg-[#25324B] text-white shadow-2xs'
                        : 'text-[#7C8493] hover:text-[#25324B]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 5. Candidate Applications Card List */}
          <div className="space-y-4 text-left">
            {filteredApplications.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto text-[#7C8493]">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-base font-extrabold text-[#25324B]">No Applications Found</h3>
                <p className="text-xs text-[#7C8493] max-w-sm mx-auto">
                  {myApplications.length === 0
                    ? "You haven't applied for any jobs yet. Browse open tech roles and submit applications!"
                    : 'No applications match your selected filter criteria. Try resetting your search.'}
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/job-search')}
                  className="px-5 py-2.5 rounded-xl bg-[#25324B] text-white text-xs font-bold hover:bg-[#1C2638] transition-colors cursor-pointer shadow-xs inline-flex items-center gap-2"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Explore Open Jobs</span>
                </button>
              </div>
            ) : (
              filteredApplications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl border border-gray-200/80 hover:border-[#CCD5E4] hover:shadow-[0_4px_16px_rgba(37,50,75,0.06)] transition-all p-5 flex flex-col sm:flex-row items-start justify-between gap-4 group"
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-gray-200/60 flex items-center justify-center font-extrabold text-[#25324B] flex-shrink-0 overflow-hidden">
                      {app.companyLogo ? (
                        <img
                          src={app.companyLogo}
                          alt={app.companyName}
                          className="w-full h-full object-contain p-1.5"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        (app.companyName || 'C').charAt(0)
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <Link
                          to={`/jobs/${app.jobId}`}
                          className="text-base font-extrabold text-[#25324B] hover:text-blue-600 transition-colors truncate"
                        >
                          {app.jobTitle}
                        </Link>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadge(
                            app.status
                          )}`}
                        >
                          {app.status}
                        </span>
                      </div>

                      <span className="text-xs font-bold text-[#515B6F] block mt-0.5">
                        {app.companyName}
                      </span>

                      <div className="flex items-center gap-3 mt-2 text-xs text-[#7C8493] flex-wrap font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>
                            Applied on{' '}
                            {new Date(app.appliedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </span>
                        <span>•</span>
                        <span className="text-emerald-700 font-bold">
                          {app.expectedSalary || '₹ 12L - 16L / year'}
                        </span>
                        {app.candidateLocation && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>{app.candidateLocation}</span>
                            </span>
                          </>
                        )}
                      </div>

                      {/* Recruiter / Application Notes */}
                      {app.notes && (
                        <p className="text-xs text-slate-500 bg-slate-50 border border-slate-100 rounded-xl p-2.5 mt-2.5">
                          <span className="font-bold text-[#25324B]">Note: </span>
                          {app.notes}
                        </p>
                      )}

                      {/* Pipeline Stage Visual Step Indicator */}
                      <div className="flex items-center gap-1.5 sm:gap-2 mt-3 pt-3 border-t border-gray-100 text-[11px] font-semibold text-[#7C8493] flex-wrap">
                        <span
                          className={`px-2 py-0.5 rounded-md ${
                            app.status === 'In Review' ||
                            app.status === 'Shortlisted' ||
                            app.status === 'Interview' ||
                            app.status === 'Hired'
                              ? 'bg-blue-50 text-blue-700 font-bold'
                              : 'bg-gray-100'
                          }`}
                        >
                          1. Applied ✓
                        </span>
                        <span>→</span>
                        <span
                          className={`px-2 py-0.5 rounded-md ${
                            app.status === 'Shortlisted' ||
                            app.status === 'Interview' ||
                            app.status === 'Hired'
                              ? 'bg-amber-50 text-amber-700 font-bold'
                              : app.status === 'In Review'
                              ? 'bg-blue-100 text-blue-800 font-bold'
                              : 'bg-gray-100'
                          }`}
                        >
                          2. Review
                        </span>
                        <span>→</span>
                        <span
                          className={`px-2 py-0.5 rounded-md ${
                            app.status === 'Interview' || app.status === 'Hired'
                              ? 'bg-indigo-50 text-indigo-700 font-bold'
                              : 'bg-gray-100'
                          }`}
                        >
                          3. Interview
                        </span>
                        <span>→</span>
                        <span
                          className={`px-2 py-0.5 rounded-md ${
                            app.status === 'Hired'
                              ? 'bg-emerald-50 text-emerald-700 font-bold'
                              : 'bg-gray-100'
                          }`}
                        >
                          4. Hired
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions: View Job Details + Withdraw */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <Link
                      to={`/jobs/${app.jobId}`}
                      className="px-3.5 py-2 rounded-xl bg-[#25324B] hover:bg-[#1C2638] text-white text-xs font-bold transition-all shadow-2xs whitespace-nowrap"
                    >
                      View Job Details
                    </Link>

                    {app.status !== 'Hired' && (
                      <button
                        type="button"
                        onClick={() => handleWithdraw(app.id, app.jobTitle)}
                        className="px-3 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Withdraw
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
