import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sidebar } from './Sidebar';
import { HeaderNavbar } from '../common/HeaderNavbar';
import { StatCard } from './StatCard';
import {
  getStoredApplications,
  applyForJob,
  getApplicationStats,
} from '../../services/applicationsService';
import {
  getStoredJobs,
  getSavedJobIds,
  toggleSavedJobId,
  getAppliedJobIds,
} from '../../services/jobsService';
import { recordActivity } from '../../services/activityService';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Clock,
  Calendar,
  Bookmark,
  Sparkles,
  Search,
  UserCheck,
  Building2,
  MapPin,
  Coins,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  ChevronRight,
  Target,
} from 'lucide-react';
import { toast } from 'react-toastify';

export const CandidateDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Dynamic Live State synced across storage events
  const [applications, setApplications] = useState(() => getStoredApplications());
  const [jobs, setJobs] = useState(() => getStoredJobs());
  const [savedJobIds, setSavedJobIds] = useState(() => getSavedJobIds());
  const [appliedJobIds, setAppliedJobIds] = useState(() => getAppliedJobIds());

  const syncData = () => {
    setApplications(getStoredApplications());
    setJobs(getStoredJobs());
    setSavedJobIds(getSavedJobIds());
    setAppliedJobIds(getAppliedJobIds());
  };

  useEffect(() => {
    syncData();
    window.addEventListener('storage', syncData);
    window.addEventListener('applications_updated', syncData);
    window.addEventListener('jobs_updated', syncData);
    return () => {
      window.removeEventListener('storage', syncData);
      window.removeEventListener('applications_updated', syncData);
      window.removeEventListener('jobs_updated', syncData);
    };
  }, []);

  const candidateName = user?.fullName || 'Olivia Wilson';

  // Metrics for Candidate
  const candidateStats = useMemo(() => {
    const totalApplied = applications.length;
    const inReview = applications.filter((a) => a.status === 'In Review').length;
    const interviews = applications.filter((a) => a.status === 'Interview').length;
    const shortlisted = applications.filter((a) => a.status === 'Shortlisted').length;
    const saved = savedJobIds.length;

    return {
      totalApplied,
      inReview,
      interviews,
      shortlisted,
      saved,
      matchScore: 92,
    };
  }, [applications, savedJobIds]);

  // Recommended Jobs (Top 3 open tech roles)
  const recommendedJobs = useMemo(() => {
    return jobs.filter((j) => j.status === 'Open').slice(0, 3);
  }, [jobs]);

  // Quick Apply handler from Recommended Jobs
  const handleQuickApply = (e, job) => {
    e.stopPropagation();
    const res = applyForJob({
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.companyName,
      candidateId: 1,
      candidateName: candidateName,
      candidateEmail: user?.email || 'olivia.wilson@example.com',
      candidateRole: 'Senior Frontend Developer',
      candidateAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      notes: `Applied from Candidate Dashboard for ${job.title} at ${job.companyName}.`,
    });

    if (res.success) {
      syncData();
      toast.success(`Applied for ${job.title} at ${job.companyName}!`, { icon: '🎉' });
    } else {
      toast.info(res.message || 'Already applied for this position.');
    }
  };

  // Toggle Bookmark handler
  const handleToggleBookmark = (e, job) => {
    e.stopPropagation();
    const isNowSaved = toggleSavedJobId(job.id);
    setSavedJobIds(getSavedJobIds());
    if (isNowSaved) {
      recordActivity({
        type: 'bookmark',
        title: 'Job saved to bookmarks',
        meta: `${job.title} at ${job.companyName}`,
        link: `/jobs/${job.id}`,
        iconType: 'bookmark',
      });
      toast.success(`"${job.title}" saved to bookmarks!`, { icon: '🔖' });
    } else {
      toast.info(`"${job.title}" removed from bookmarks.`);
    }
  };

  // Status Badge Helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Interview':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Shortlisted':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Hired':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
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
            icon={<LayoutDashboard className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.2] text-[#25324B]" />}
            title={`Welcome back, ${candidateName}! 👋`}
            subtitle="Track your applications, upcoming interview schedules, and explore top tech opportunities."
            searchPlaceholder="Search jobs, companies, skills..."
            onSearch={() => navigate('/job-search')}
          />

          {/* 3. Candidate Top Metrics (5 StatCards matching dashboard theme) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 text-left">
            <StatCard
              title="Applied Jobs"
              value={candidateStats.totalApplied}
              subtitle="Live applications"
              icon={FileText}
              onClick={() => navigate('/applications')}
            />

            <StatCard
              title="Under Review"
              value={candidateStats.inReview}
              subtitle="Awaiting feedback"
              icon={Clock}
              onClick={() => navigate('/applications')}
            />

            <StatCard
              title="Interviews"
              value={candidateStats.interviews}
              subtitle="Scheduled rounds"
              icon={Calendar}
              onClick={() => navigate('/applications')}
            />

            <StatCard
              title="Saved Jobs"
              value={candidateStats.saved}
              subtitle="Bookmarked by you"
              icon={Bookmark}
              onClick={() => navigate('/saved-jobs')}
            />

            <StatCard
              title="Profile Match"
              value={`${candidateStats.matchScore}%`}
              subtitle="Top 10% Talent"
              icon={Sparkles}
              onClick={() => navigate('/candidate-profile')}
            />
          </div>

          {/* 4. Candidate Quick Action Cards (4 Dark Slate Cards #25324B) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              onClick={() => navigate('/job-search')}
              className="bg-[#25324B] hover:bg-[#1C2638] text-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group border border-white/5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#25324B] transition-colors">
                  <Search className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm sm:text-base text-white">Search Open Jobs</h4>
                <p className="text-xs text-slate-300 mt-1">Browse 120+ live tech roles across top companies</p>
              </div>
            </div>

            <div
              onClick={() => navigate('/saved-jobs')}
              className="bg-[#25324B] hover:bg-[#1C2638] text-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group border border-white/5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#25324B] transition-colors">
                  <Bookmark className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm sm:text-base text-white">Saved Bookmarks</h4>
                <p className="text-xs text-slate-300 mt-1">Review {candidateStats.saved} bookmarked roles & apply</p>
              </div>
            </div>

            <div
              onClick={() => navigate('/applications')}
              className="bg-[#25324B] hover:bg-[#1C2638] text-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group border border-white/5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#25324B] transition-colors">
                  <FileText className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm sm:text-base text-white">My Applications</h4>
                <p className="text-xs text-slate-300 mt-1">Track status across {candidateStats.totalApplied} submissions</p>
              </div>
            </div>

            <div
              onClick={() => navigate('/candidate-profile')}
              className="bg-[#25324B] hover:bg-[#1C2638] text-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group border border-white/5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#25324B] transition-colors">
                  <UserCheck className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm sm:text-base text-white">Candidate Profile</h4>
                <p className="text-xs text-slate-300 mt-1">Update skills, experience & resume</p>
              </div>
            </div>
          </div>

          {/* 5. Main Candidate Grid: Applications Tracker (7 Cols) & Recommended Jobs (5 Cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">
            {/* Left 7 Cols: Active Applications Tracker */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-[#25324B] flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#25324B]" />
                    <span>My Recent Applications</span>
                  </h3>
                  <p className="text-xs text-[#7C8493] mt-0.5">
                    Live updates on your interview progress and recruiter reviews
                  </p>
                </div>
                <Link
                  to="/applications"
                  className="text-xs font-bold text-[#25324B] hover:text-blue-600 inline-flex items-center gap-1 transition-colors"
                >
                  <span>View All ({applications.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {applications.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm text-[#25324B]">No applications yet</h4>
                  <p className="text-xs text-[#7C8493] max-w-sm mx-auto">
                    Start exploring jobs and submit applications to track them here in real-time.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('/job-search')}
                    className="px-4 py-2 rounded-xl bg-[#25324B] hover:bg-[#1C2638] text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Browse Jobs
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.slice(0, 4).map((app) => (
                    <div
                      key={app.id}
                      onClick={() => navigate(`/jobs/${app.jobId}`)}
                      className="p-4 rounded-xl border border-gray-100 hover:border-[#25324B]/30 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer group bg-gray-50/40 hover:bg-white"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-11 h-11 rounded-xl bg-white border border-gray-200 p-1.5 flex items-center justify-center flex-shrink-0 shadow-2xs">
                          {app.companyLogo ? (
                            <img
                              src={app.companyLogo}
                              alt={app.companyName}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <Building2 className="w-5 h-5 text-gray-400" />
                          )}
                        </div>

                        <div className="min-w-0 truncate">
                          <h4 className="font-bold text-sm text-[#25324B] group-hover:text-blue-600 transition-colors truncate">
                            {app.jobTitle}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-[#7C8493] mt-0.5">
                            <span className="font-medium text-gray-700">{app.companyName}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {app.candidateLocation || 'Remote'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center flex-shrink-0">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(
                            app.status
                          )}`}
                        >
                          {app.status}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/applications');
                          }}
                          className="px-3 py-1.5 rounded-lg border border-gray-200 hover:border-[#25324B] text-[#25324B] text-xs font-bold transition-colors cursor-pointer"
                        >
                          Status
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right 5 Cols: Recommended Opportunities */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-[#25324B] flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <span>Recommended for You</span>
                  </h3>
                  <p className="text-xs text-[#7C8493] mt-0.5">
                    Roles tailored to your Frontend & React profile
                  </p>
                </div>
                <Link
                  to="/job-search"
                  className="text-xs font-bold text-[#25324B] hover:text-blue-600 inline-flex items-center gap-1 transition-colors"
                >
                  <span>Explore</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-3">
                {recommendedJobs.map((job) => {
                  const isApplied = appliedJobIds.includes(String(job.id));
                  const isSaved = savedJobIds.includes(job.id);

                  return (
                    <div
                      key={job.id}
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      className="p-3.5 rounded-xl border border-gray-100 hover:border-[#25324B]/30 hover:shadow-xs transition-all bg-gray-50/40 hover:bg-white cursor-pointer group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 p-1.5 flex items-center justify-center flex-shrink-0 shadow-2xs">
                            {job.companyLogo ? (
                              <img
                                src={job.companyLogo}
                                alt={job.companyName}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <Building2 className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs sm:text-sm text-[#25324B] group-hover:text-blue-600 transition-colors truncate">
                              {job.title}
                            </h4>
                            <p className="text-[11px] text-[#7C8493] truncate">{job.companyName}</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => handleToggleBookmark(e, job)}
                          className="p-1 text-gray-400 hover:text-[#25324B] transition-colors"
                          title={isSaved ? 'Remove bookmark' : 'Bookmark job'}
                        >
                          <Bookmark
                            className={`w-4 h-4 ${
                              isSaved ? 'fill-[#25324B] text-[#25324B]' : 'stroke-gray-400'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-gray-100">
                        <div className="flex items-center gap-1 text-xs font-extrabold text-[#25324B]">
                          <Coins className="w-3.5 h-3.5 text-[#25324B]" />
                          <span>{job.salaryRange}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {isApplied ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Applied
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => handleQuickApply(e, job)}
                              className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-all cursor-pointer shadow-2xs"
                            >
                              Apply
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => navigate(`/jobs/${job.id}`)}
                            className="px-3 py-1 rounded-lg bg-[#25324B] hover:bg-[#1C2638] text-white text-[11px] font-bold transition-all cursor-pointer"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
