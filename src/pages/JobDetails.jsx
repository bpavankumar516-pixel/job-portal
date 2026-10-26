import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCandidates } from '../context/CandidatesContext';
import { Sidebar } from '../components/dashboard/Sidebar';
import { HeaderNavbar } from '../components/common/HeaderNavbar';
import { AddEditJobModal } from '../components/jobs/AddEditJobModal';
import { DeleteJobModal } from '../components/jobs/DeleteJobModal';
import {
  getJobById,
  updateJob,
  deleteJob,
  toggleJobStatus,
  submitJobApplication,
  getJobEnrichedDetails,
  getStoredJobs,
  getCategoryBadgeStyle,
  getTypeBadgeStyle,
} from '../services/jobsService';
import { getStoredCompanies } from '../services/companiesService';
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Users,
  CheckCircle2,
  Bookmark,
  Share2,
  ArrowLeft,
  Edit2,
  Trash2,
  Send,
  Building2,
  Globe,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  FileText,
  Star,
  Check,
  Calendar,
  XCircle,
} from 'lucide-react';
import { toast } from 'react-toastify';

export const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const { candidates, selectCandidate } = useCandidates();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [job, setJob] = useState(() => getJobById(id));

  // Active Tab: 'overview' | 'applicants' | 'company' | 'benefits'
  const [activeTab, setActiveTab] = useState('overview');

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // Application form state
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicantName, setApplicantName] = useState(user?.fullName || 'Pavan Kumar');
  const [applicantEmail, setApplicantEmail] = useState(user?.email || 'pavan.kumar@jobportal.com');
  const [applicantNote, setApplicantNote] = useState('');

  // Sync when ID changes
  useEffect(() => {
    const found = getJobById(id);
    setJob(found);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const enriched = useMemo(() => {
    return job ? getJobEnrichedDetails(job) : null;
  }, [job]);

  // Match corresponding company
  const matchedCompany = useMemo(() => {
    if (!job) return null;
    const comps = getStoredCompanies();
    return comps.find((c) => c.name === job.companyName) || null;
  }, [job]);

  // Similar jobs
  const similarJobs = useMemo(() => {
    if (!job) return [];
    return getStoredJobs()
      .filter((j) => j.id !== job.id && (j.category === job.category || j.companyName === job.companyName))
      .slice(0, 3);
  }, [job]);

  // Handlers
  const handleUpdate = (formData) => {
    const updated = updateJob(job.id, formData);
    if (updated) {
      setJob(updated);
      toast.success(`Job "${updated.title}" updated successfully!`, {
        icon: '💼',
      });
      setIsEditModalOpen(false);
    }
  };

  const handleDelete = () => {
    deleteJob(job.id);
    toast.info(`Job "${job.title}" has been deleted.`, {
      icon: '🗑️',
    });
    setIsDeleteModalOpen(false);
    navigate('/jobs');
  };

  const handleToggleStatus = () => {
    const updated = toggleJobStatus(job.id);
    if (updated) {
      setJob(updated);
      toast.info(`Job marked as ${updated.status}.`, {
        icon: updated.status === 'Open' ? '🟢' : '🔴',
      });
    }
  };

  const handleQuickApply = (e) => {
    e.preventDefault();
    if (hasApplied) {
      toast.info('You have already applied for this opening.');
      return;
    }
    const updated = submitJobApplication(job.id);
    if (updated) {
      setJob(updated);
    }
    setHasApplied(true);
    setIsApplyModalOpen(false);
    toast.success(`Application submitted for "${job.title}" at ${job.companyName}!`, {
      icon: '🚀',
    });
  };

  const handleToggleSave = () => {
    setIsSaved(!isSaved);
    if (!isSaved) {
      toast.success('Job saved to your bookmarks!');
    } else {
      toast.info('Job removed from bookmarks.');
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Job posting link copied to clipboard!');
    } else {
      toast.info('Share URL: ' + window.location.href);
    }
  };

  const displayName = user?.fullName || 'Pavan Kumar';

  // If job not found
  if (!job) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white border border-[#CCD5E4] flex items-center justify-center mb-4 text-[#25324B]">
            <Briefcase className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#25324B] mb-2">Job Posting Not Found</h2>
          <p className="text-sm text-[#7C8493] max-w-md mb-6">
            The job opening you are looking for may have expired or been removed.
          </p>
          <button
            type="button"
            onClick={() => navigate('/jobs')}
            className="px-5 py-2.5 rounded-xl bg-[#25324B] text-white text-xs font-bold hover:bg-[#1C2638] transition-colors"
          >
            ← Back to Job Postings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex">
      {/* 1. Dark Slate Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-5 sm:p-7 lg:p-9 max-w-[1440px] w-full mx-auto space-y-6">
          {/* Top Navbar with Dynamic Title matching reference image */}
          <HeaderNavbar
            onToggleSidebar={() => setSidebarOpen(true)}
            breadcrumb={
              <nav className="flex items-center gap-1.5 text-xs text-[#7C8493] font-semibold">
                <Link to="/dashboard" className="hover:text-[#25324B] transition-colors">
                  Dashboard
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                <Link to="/jobs" className="hover:text-[#25324B] transition-colors">
                  Job Postings
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                <span className="font-bold text-[#25324B]">{job.title}</span>
              </nav>
            }
            icon={<Briefcase className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.2] text-[#25324B]" />}
            title={job.title}
            subtitle={`${job.companyName} • ${job.location} • ${job.employmentType} • ${job.salaryRange}`}
            searchPlaceholder="Search jobs, companies..."
            rightAction={
              <button
                type="button"
                onClick={() => navigate('/jobs')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#E9ECF2] text-xs font-bold text-[#25324B] hover:bg-gray-50 shadow-2xs transition-colors cursor-pointer flex-shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Job Postings</span>
              </button>
            }
          />

          {/* 3. Hero Header Card */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.03)] overflow-hidden">
            {/* Top Branded Banner */}
            <div className="h-32 sm:h-36 w-full bg-gradient-to-r from-[#25324B] via-[#1E293B] to-[#3B4861] relative p-5 sm:p-6 flex items-start justify-end">
              <div className="flex items-center gap-2 relative z-10">
                <button
                  type="button"
                  onClick={handleShare}
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border border-white/15"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border border-white/15"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Job</span>
                </button>
              </div>
            </div>

            {/* Profile Row */}
            <div className="px-6 sm:px-8 pb-7 pt-0 relative">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
                {/* Logo & Identity */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 flex-1 min-w-0">
                  {/* Floating Logo - ONLY the logo overlaps the banner */}
                  <div className="-mt-12 sm:-mt-14 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white border-4 border-white shadow-lg p-2 flex items-center justify-center flex-shrink-0 relative overflow-hidden z-10">
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
                        } text-white font-extrabold text-2xl flex items-center justify-center`}
                      >
                        {job.fallbackLetter || job.companyName?.charAt(0) || 'C'}
                      </div>
                    )}
                  </div>

                  {/* Text Details - fully situated on the white card background */}
                  <div className="pt-2 sm:pt-3 min-w-0 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#25324B] tracking-tight break-words">
                        {job.title}
                      </h2>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          job.status === 'Open'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-red-50 text-red-600 border-red-200'
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mt-2 text-xs text-[#7C8493] font-medium flex-wrap">
                      <span className="font-bold text-[#25324B] flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-[#25324B]" />
                        <span>{job.companyName}</span>
                      </span>
                      <span>•</span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getCategoryBadgeStyle(
                          job.category
                        )}`}
                      >
                        {job.category}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${getTypeBadgeStyle(
                          job.employmentType
                        )}`}
                      >
                        {job.employmentType}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#7C8493]" />
                        <span>{job.location}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Top Action CTAs */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  <button
                    type="button"
                    onClick={handleToggleSave}
                    className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                      isSaved
                        ? 'bg-amber-50 text-amber-600 border-amber-200'
                        : 'border-[#E9ECF2] text-[#7C8493] hover:text-[#25324B] bg-white'
                    }`}
                    title={isSaved ? 'Remove Bookmark' : 'Save Job'}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleStatus}
                    className="px-4 py-2.5 rounded-xl border border-[#E9ECF2] hover:bg-[#F8F9FC] text-[#25324B] text-xs font-bold transition-colors cursor-pointer"
                  >
                    {job.status === 'Open' ? 'Close Position' : 'Re-open Position'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsApplyModalOpen(true)}
                    disabled={hasApplied}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer ${
                      hasApplied
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                        : 'bg-[#25324B] hover:bg-[#1C2638] text-white shadow-[#25324B]/20'
                    }`}
                  >
                    {hasApplied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Application Submitted</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Apply for Position</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="p-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete Job"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 4 Metric Highlight Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#F0F2F6]">
                <div className="p-3.5 rounded-2xl bg-[#F8F9FC] border border-[#E9ECF2]/70">
                  <span className="text-[11px] font-bold text-[#7C8493] block">Applicants Received</span>
                  <p className="text-xl font-extrabold text-[#25324B] mt-0.5">
                    {job.applicationsCount} Candidates
                  </p>
                  <span className="text-[10px] text-blue-600 font-bold mt-0.5 inline-block">
                    +12 this week
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F8F9FC] border border-[#E9ECF2]/70">
                  <span className="text-[11px] font-bold text-[#7C8493] block">Compensation Band</span>
                  <p className="text-xl font-extrabold text-[#25324B] mt-0.5">{job.salaryRange}</p>
                  <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 inline-block">
                    Competitive Market Band
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F8F9FC] border border-[#E9ECF2]/70">
                  <span className="text-[11px] font-bold text-[#7C8493] block">Experience Level</span>
                  <p className="text-xl font-extrabold text-[#25324B] mt-0.5">{job.experience}</p>
                  <span className="text-[10px] text-[#7C8493] font-medium mt-0.5 inline-block">
                    Mid-Senior Level
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F8F9FC] border border-[#E9ECF2]/70">
                  <span className="text-[11px] font-bold text-[#7C8493] block">Recruiting Status</span>
                  <p className="text-xl font-extrabold text-[#25324B] mt-0.5">
                    {job.status === 'Open' ? 'Actively Hiring' : 'Position Closed'}
                  </p>
                  <span className="text-[10px] text-emerald-600 font-bold mt-0.5 inline-block">
                    {job.postedTime}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Tab Navigation Bar */}
          <div className="flex items-center gap-2 border-b border-[#E9ECF2] overflow-x-auto pb-0.5 select-none scrollbar-none">
            {[
              { id: 'overview', label: 'Role Overview & Scope', icon: FileText },
              {
                id: 'applicants',
                label: `Candidate Pipeline (${candidates.length > 0 ? candidates.length : 4})`,
                icon: Users,
              },
              { id: 'company', label: `About ${job.companyName}`, icon: Building2 },
              { id: 'benefits', label: 'Compensation & Rewards', icon: DollarSign },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'border-[#25324B] text-[#25324B]'
                      : 'border-transparent text-[#7C8493] hover:text-[#25324B]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* 5. Main 2-Column Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 8 Cols: Dynamic Tab Content */}
            <div className="lg:col-span-8 space-y-6">
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Job Description */}
                  <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
                    <h3 className="text-base sm:text-lg font-extrabold text-[#25324B] tracking-tight">
                      About the Role
                    </h3>
                    <p className="text-xs sm:text-sm text-[#515B6F] leading-relaxed">
                      {job.description}
                    </p>
                    <p className="text-xs sm:text-sm text-[#515B6F] leading-relaxed">
                      As a {job.title} at {job.companyName}, you will collaborate closely with a talented multi-disciplinary team to ship reliable, high-impact digital products. You will have full ownership of features from conception through architecture and continuous production deployment.
                    </p>

                    {/* Key Responsibilities */}
                    <div className="pt-4 border-t border-[#F0F2F6]">
                      <h4 className="text-xs font-bold text-[#7C8493] uppercase tracking-wider mb-3">
                        Core Responsibilities
                      </h4>
                      <ul className="space-y-2">
                        {enriched?.responsibilities?.map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs text-[#515B6F]">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Qualifications & Requirements */}
                    <div className="pt-4 border-t border-[#F0F2F6]">
                      <h4 className="text-xs font-bold text-[#7C8493] uppercase tracking-wider mb-3">
                        Key Requirements
                      </h4>
                      <ul className="space-y-2">
                        {job.requirements?.map((req, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs text-[#515B6F]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#25324B] mt-1.5 flex-shrink-0" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Technical Skills Stack */}
                    <div className="pt-4 border-t border-[#F0F2F6]">
                      <h4 className="text-xs font-bold text-[#7C8493] uppercase tracking-wider mb-2.5">
                        Technical Tooling & Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {enriched?.skills?.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 rounded-xl bg-[#F0F3F8] text-[#25324B] text-xs font-bold"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: APPLICANTS PIPELINE (RECRUITER VIEW) */}
              {activeTab === 'applicants' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                      <div>
                        <h3 className="text-base sm:text-lg font-extrabold text-[#25324B] tracking-tight">
                          Candidate Pipeline ({job.applicationsCount} Total)
                        </h3>
                        <p className="text-xs text-[#7C8493]">
                          Manage and evaluate applicants for this position in real-time
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => toast.info('Exporting candidate pipeline to CSV...')}
                        className="px-3.5 py-1.5 rounded-xl border border-[#E9ECF2] hover:bg-[#F8F9FC] text-xs font-bold text-[#25324B] transition-colors cursor-pointer"
                      >
                        Export Pipeline
                      </button>
                    </div>

                    {/* Applicants Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-[#25324B] border-collapse min-w-[550px]">
                        <thead>
                          <tr className="border-b border-gray-100 text-[#7C8493] font-bold text-[11px] bg-[#F8F9FC]/70">
                            <th className="py-2.5 px-3">Candidate</th>
                            <th className="py-2.5 px-3">Experience</th>
                            <th className="py-2.5 px-3">Match Score</th>
                            <th className="py-2.5 px-3">Stage</th>
                            <th className="py-2.5 px-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {(candidates.length > 0 ? candidates.slice(0, 6) : (enriched?.applicantsList || [])).map((cand, idx) => {
                            const stageList = [
                              { stage: 'Shortlisted', color: 'bg-blue-50 text-blue-700 border-blue-200' },
                              { stage: 'Interview', color: 'bg-purple-50 text-purple-700 border-purple-200' },
                              { stage: 'Applied', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                              { stage: 'Under Review', color: 'bg-amber-50 text-amber-700 border-amber-200' },
                            ];
                            const currentStage = stageList[idx % stageList.length];
                            return (
                              <tr key={cand.id || idx} className="hover:bg-[#F8F9FC]/60 transition-colors">
                                <td className="py-3 px-3">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-full border border-gray-200 overflow-hidden bg-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                                      {cand.avatar ? (
                                        <img src={cand.avatar} alt={cand.name} className="w-full h-full object-cover" />
                                      ) : (
                                        <span>{cand.name.charAt(0)}</span>
                                      )}
                                    </div>
                                    <div className="min-w-0">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          selectCandidate(cand);
                                          navigate(`/candidates/${cand.id}`);
                                        }}
                                        className="font-bold text-[#25324B] hover:text-blue-600 block truncate text-left cursor-pointer"
                                      >
                                        {cand.name}
                                      </button>
                                      <span className="text-[11px] text-[#7C8493] block truncate">{cand.email}</span>
                                    </div>
                                  </div>
                                </td>

                                <td className="py-3 px-3 font-medium text-gray-600">
                                  {cand.experienceYears || cand.experience || '2+ Years'}
                                </td>

                                <td className="py-3 px-3">
                                  <span className="font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md text-[11px]">
                                    {cand.matchScore ? `${cand.matchScore}%` : '85%'}
                                  </span>
                                </td>

                                <td className="py-3 px-3">
                                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${currentStage.color}`}>
                                    {currentStage.stage}
                                  </span>
                                </td>

                                <td className="py-3 px-3 text-right">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      selectCandidate(cand);
                                      navigate(`/candidates/${cand.id}`);
                                    }}
                                    className="px-3 py-1 rounded-lg bg-[#25324B] hover:bg-[#1C2638] text-white text-[11px] font-bold transition-all cursor-pointer inline-flex items-center gap-1"
                                  >
                                    <span>View Profile</span>
                                    <span>→</span>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: ABOUT HIRING COMPANY */}
              {activeTab === 'company' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl border border-[#E9ECF2] p-1.5 flex items-center justify-center bg-white shadow-2xs">
                          {job.companyLogo ? (
                            <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-contain" />
                          ) : (
                            <span className="font-extrabold text-lg text-[#25324B]">{job.companyName.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-extrabold text-[#25324B]">
                            {job.companyName}
                          </h3>
                          <p className="text-xs text-[#7C8493]">
                            {job.companyIndustry} • {job.location}
                          </p>
                        </div>
                      </div>

                      {matchedCompany && (
                        <Link
                          to={`/companies/${matchedCompany.id}`}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-colors"
                        >
                          <span>View Full Company Page</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-[#515B6F] leading-relaxed pt-2">
                      {matchedCompany?.description ||
                        `${job.companyName} is an industry leader pioneering customer-centric technology and career excellence.`}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#F0F2F6] text-xs">
                      <div className="p-3 bg-[#F8F9FC] rounded-xl">
                        <span className="text-[#7C8493] block">Company Size:</span>
                        <span className="font-bold text-[#25324B] mt-0.5 block">
                          {matchedCompany?.employees || '10,001+ employees'}
                        </span>
                      </div>
                      <div className="p-3 bg-[#F8F9FC] rounded-xl">
                        <span className="text-[#7C8493] block">Website:</span>
                        <span className="font-bold text-[#25324B] mt-0.5 block truncate">
                          {matchedCompany?.website || 'www.company.com'}
                        </span>
                      </div>
                      <div className="p-3 bg-[#F8F9FC] rounded-xl">
                        <span className="text-[#7C8493] block">Employer Rating:</span>
                        <span className="font-bold text-amber-500 mt-0.5 block">
                          ★ {matchedCompany?.rating || 4.8} / 5.0
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: REWARDS & BENEFITS */}
              {activeTab === 'benefits' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
                    <h3 className="text-base sm:text-lg font-extrabold text-[#25324B] tracking-tight">
                      Total Rewards & Comprehensive Benefits
                    </h3>
                    <p className="text-xs sm:text-sm text-[#7C8493]">
                      At {job.companyName}, we offer world-class benefits designed to support you and your family across health, wealth, and wellness.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                      <div className="p-4 rounded-2xl bg-[#F8F9FC] border border-[#E9ECF2]">
                        <h4 className="font-extrabold text-xs sm:text-sm text-[#25324B] mb-1">
                          🏥 Premium Healthcare
                        </h4>
                        <p className="text-xs text-[#515B6F]">
                          100% employer-sponsored health, dental, vision and mental wellness coverage.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#F8F9FC] border border-[#E9ECF2]">
                        <h4 className="font-extrabold text-xs sm:text-sm text-[#25324B] mb-1">
                          💰 401(k) & Equity
                        </h4>
                        <p className="text-xs text-[#515B6F]">
                          Generous retirement matching and competitive stock option packages.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#F8F9FC] border border-[#E9ECF2]">
                        <h4 className="font-extrabold text-xs sm:text-sm text-[#25324B] mb-1">
                          🌴 Unlimited PTO
                        </h4>
                        <p className="text-xs text-[#515B6F]">
                          Flexible time off policy plus 12 paid company holidays per year.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#F8F9FC] border border-[#E9ECF2]">
                        <h4 className="font-extrabold text-xs sm:text-sm text-[#25324B] mb-1">
                          🎓 $2,500 Learning Budget
                        </h4>
                        <p className="text-xs text-[#515B6F]">
                          Annual educational stipend for courses, books, and tech conferences.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right 4 Cols: Recruiter in Charge & Similar Jobs */}
            <div className="lg:col-span-4 space-y-6">
              {/* Job Summary Card */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3.5">
                <h4 className="font-extrabold text-sm text-[#25324B]">
                  Job Information Snapshot
                </h4>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <span className="text-[#7C8493]">Job ID:</span>
                    <span className="font-bold text-[#25324B] uppercase">{job.id}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <span className="text-[#7C8493]">Department:</span>
                    <span className="font-bold text-[#25324B]">{job.category}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <span className="text-[#7C8493]">Employment:</span>
                    <span className="font-bold text-[#25324B]">{job.employmentType}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <span className="text-[#7C8493]">Experience:</span>
                    <span className="font-bold text-[#25324B]">{job.experience}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#7C8493]">Posted Time:</span>
                    <span className="font-bold text-[#25324B]">{job.postedTime}</span>
                  </div>
                </div>
              </div>

              {/* Lead Recruiter Card */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#7C8493] uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Lead Recruiter</span>
                </div>

                <div className="flex items-center gap-3 p-3 bg-[#F8F9FC] rounded-2xl border border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-[#25324B] text-white flex items-center justify-center font-extrabold text-sm flex-shrink-0 shadow-sm">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h5 className="font-extrabold text-xs sm:text-sm text-[#25324B] truncate">
                      {displayName}
                    </h5>
                    <span className="text-[11px] text-[#7C8493] block truncate">
                      Technical Talent Acquisition Partner
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toast.info(`Direct recruiter channel active with ${displayName}.`)}
                  className="w-full py-2.5 rounded-xl bg-[#25324B] hover:bg-[#1C2638] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  Message Recruiter
                </button>
              </div>

              {/* Similar Jobs */}
              {similarJobs.length > 0 && (
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-sm text-[#25324B]">
                      Similar Openings
                    </h4>
                    <Link to="/jobs" className="text-xs font-bold text-[#25324B] hover:underline">
                      View All
                    </Link>
                  </div>

                  <div className="space-y-2.5">
                    {similarJobs.map((sim) => (
                      <div
                        key={sim.id}
                        onClick={() => navigate(`/jobs/${sim.id}`)}
                        className="p-3 rounded-2xl border border-gray-100 hover:border-[#CCD5E4] hover:bg-[#F8F9FC] transition-all cursor-pointer flex items-center justify-between group"
                      >
                        <div className="min-w-0 pr-2">
                          <h5 className="font-bold text-xs text-[#25324B] truncate group-hover:text-black">
                            {sim.title}
                          </h5>
                          <span className="text-[11px] text-[#7C8493] truncate block mt-0.5">
                            {sim.companyName} • {sim.location}
                          </span>
                        </div>

                        <span className="text-[10px] font-bold text-[#25324B] px-2 py-0.5 rounded-md bg-[#F0F3F8] flex-shrink-0">
                          {sim.salaryRange}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Edit Job Modal */}
      <AddEditJobModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmitJob={handleUpdate}
        initialData={job}
      />

      {/* Delete Confirmation Modal */}
      <DeleteJobModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        job={job}
      />

      {/* Interactive Application Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-7 relative shadow-2xl border border-[#E9ECF2]">
            <button
              type="button"
              onClick={() => setIsApplyModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <XCircle className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-[#25324B] text-white flex items-center justify-center shadow-xs">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-[#25324B]">
                  Apply for {job.title}
                </h3>
                <p className="text-xs text-[#7C8493]">
                  Submitting directly to {job.companyName} hiring team
                </p>
              </div>
            </div>

            <form onSubmit={handleQuickApply} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#25324B] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full bg-[#F8F9FC] text-xs sm:text-sm font-semibold rounded-xl border border-[#E9ECF2] p-2.5 outline-none focus:border-[#25324B] text-[#25324B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#25324B] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={applicantEmail}
                  onChange={(e) => setApplicantEmail(e.target.value)}
                  className="w-full bg-[#F8F9FC] text-xs sm:text-sm font-semibold rounded-xl border border-[#E9ECF2] p-2.5 outline-none focus:border-[#25324B] text-[#25324B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#25324B] mb-1">
                  Cover Note / Introduction
                </label>
                <textarea
                  rows={3}
                  value={applicantNote}
                  onChange={(e) => setApplicantNote(e.target.value)}
                  placeholder="Tell the hiring manager why you are a great match for this role..."
                  className="w-full bg-[#F8F9FC] text-xs sm:text-sm font-medium rounded-xl border border-[#E9ECF2] p-2.5 outline-none focus:border-[#25324B] text-[#25324B] resize-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-blue-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>
                  Your recruiter profile details and resume credentials will be forwarded along with this application.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#25324B] hover:bg-[#1C2638] text-white text-xs font-bold shadow-md shadow-[#25324B]/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Application</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
