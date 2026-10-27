import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sidebar } from '../components/dashboard/Sidebar';
import { HeaderNavbar } from '../components/common/HeaderNavbar';
import {
  getStoredJobs,
  getSavedJobIds,
  toggleSavedJobId,
  getAppliedJobIds,
  toggleApplyJob,
  isJobApplied,
} from '../services/jobsService';
import { recordActivity } from '../services/activityService';
import {
  Bookmark,
  Heart,
  Send,
  Check,
  MapPin,
  Briefcase,
  Clock,
  Coins,
  Building2,
  Search,
  SlidersHorizontal,
  ArrowLeft,
  ArrowRight,
  Eye,
  MoreHorizontal,
  Share2,
  Trash2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  X,
} from 'lucide-react';
import { toast } from 'react-toastify';

export const SavedJobs = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Dynamic Jobs & Saved / Applied IDs state
  const [jobs, setJobs] = useState(() => getStoredJobs());
  const [savedJobIds, setSavedJobIds] = useState(() => getSavedJobIds());
  const [appliedJobIds, setAppliedJobIds] = useState(() => getAppliedJobIds());

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('All Types');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedExperience, setSelectedExperience] = useState('All Levels');

  // Status Filter Pill: 'all' | 'applied' | 'not-applied' | 'expired'
  const [statusTab, setStatusTab] = useState('all');

  // Active Menu Dropdown for Three Dots
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Pagination (10 per page matching reference image)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Listen for storage events (cross-tab and within portal)
  useEffect(() => {
    const handleSync = () => {
      setJobs(getStoredJobs());
      setSavedJobIds(getSavedJobIds());
      setAppliedJobIds(getAppliedJobIds());
    };
    window.addEventListener('storage', handleSync);
    return () => window.removeEventListener('storage', handleSync);
  }, []);

  // Close three dots dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.job-card-actions-menu')) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  // Helper to format salary into Indian Rupee format matching reference image
  const formatSalary = (job) => {
    if (job.salaryRange && job.salaryRange.includes('₹')) {
      return job.salaryRange;
    }
    // Calculate approximate LPA from min/max salary or fallback
    const minL = Math.round((job.minSalary || 70000) / 10000);
    const maxL = Math.round((job.maxSalary || 120000) / 10000);
    return `₹ ${minL}L - ${maxL}L / year`;
  };

  // Extract unique locations dynamically from saved jobs
  const availableLocations = useMemo(() => {
    const set = new Set(['All Locations']);
    jobs.forEach((j) => {
      if (j.location) set.add(j.location);
    });
    return Array.from(set);
  }, [jobs]);

  // Saved Jobs Full Objects (preserving order of savedJobIds)
  const allSavedJobs = useMemo(() => {
    const map = new Map(jobs.map((j) => [j.id, j]));
    const list = [];
    savedJobIds.forEach((id) => {
      if (map.has(id)) {
        list.push(map.get(id));
      }
    });
    return list;
  }, [jobs, savedJobIds]);

  // Dynamic Metrics for Right Column Summary Widget
  const summaryMetrics = useMemo(() => {
    const totalSaved = allSavedJobs.length;
    let appliedCount = 0;
    let expiredCount = 0;

    allSavedJobs.forEach((job) => {
      const isApplied = appliedJobIds.includes(job.id);
      const isExpired = job.status === 'Closed' || job.expired;

      if (isApplied) appliedCount++;
      if (isExpired) expiredCount++;
    });

    const notAppliedCount = Math.max(0, totalSaved - appliedCount - expiredCount);

    return {
      totalSaved,
      appliedCount,
      notAppliedCount,
      expiredCount,
    };
  }, [allSavedJobs, appliedJobIds]);

  // Filter & Search Logic
  const filteredJobs = useMemo(() => {
    return allSavedJobs.filter((job) => {
      const isApplied = appliedJobIds.includes(job.id);
      const isExpired = job.status === 'Closed' || job.expired;

      // 1. Status Filter Tab
      if (statusTab === 'applied' && !isApplied) return false;
      if (statusTab === 'not-applied' && (isApplied || isExpired)) return false;
      if (statusTab === 'expired' && !isExpired) return false;

      // 2. Keyword Search (title, company, location, skills, description)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = job.title?.toLowerCase().includes(q);
        const matchCompany = job.companyName?.toLowerCase().includes(q);
        const matchLoc = job.location?.toLowerCase().includes(q);
        const matchSkills = Array.isArray(job.skills) && job.skills.some((s) => s.toLowerCase().includes(q));
        if (!matchTitle && !matchCompany && !matchLoc && !matchSkills) {
          return false;
        }
      }

      // 3. Job Type Filter
      if (selectedJobType !== 'All Types') {
        if (job.employmentType !== selectedJobType) return false;
      }

      // 4. Location Filter
      if (selectedLocation !== 'All Locations') {
        if (job.location !== selectedLocation) return false;
      }

      // 5. Experience Filter
      if (selectedExperience !== 'All Levels') {
        if (!job.experience?.toLowerCase().includes(selectedExperience.toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }, [allSavedJobs, statusTab, searchQuery, selectedJobType, selectedLocation, selectedExperience, appliedJobIds]);

  // Pagination Slice
  const totalItems = filteredJobs.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredJobs.slice(start, start + itemsPerPage);
  }, [filteredJobs, currentPage, itemsPerPage]);

  // Toggle Save (Heart / Bookmark)
  const handleToggleSave = (job, e) => {
    if (e) e.stopPropagation();
    const isNowSaved = toggleSavedJobId(job.id);
    setSavedJobIds(getSavedJobIds());

    if (isNowSaved) {
      toast.success(`"${job.title}" saved to bookmarks!`, { icon: '❤️' });
      recordActivity({
        type: 'bookmark',
        title: 'Job saved to bookmarks',
        meta: `${job.title} at ${job.companyName}`,
        link: `/jobs/${job.id}`,
        iconType: 'bookmark',
      });
    } else {
      toast.info(`"${job.title}" removed from saved jobs.`, { icon: '💔' });
      recordActivity({
        type: 'bookmark',
        title: 'Job removed from saved jobs',
        meta: `${job.title} at ${job.companyName}`,
        link: `/jobs/${job.id}`,
        iconType: 'bookmark',
      });
    }
  };

  // Toggle Apply to Job
  const handleToggleApply = (job, e) => {
    if (e) e.stopPropagation();
    const isNowApplied = toggleApplyJob(job.id);
    setAppliedJobIds(getAppliedJobIds());

    if (isNowApplied) {
      toast.success(`Application submitted for ${job.title} at ${job.companyName}!`, {
        icon: '🚀',
      });
      recordActivity({
        type: 'application',
        title: 'New application submitted',
        meta: `Applied for ${job.title} at ${job.companyName}`,
        link: `/jobs/${job.id}`,
        iconType: 'user-check',
      });
    } else {
      toast.info(`Application withdrawn for ${job.title}.`);
      recordActivity({
        type: 'application',
        title: 'Application withdrawn',
        meta: `Withdrew application for ${job.title} at ${job.companyName}`,
        link: `/jobs/${job.id}`,
        iconType: 'file-text',
      });
    }
  };

  // Reset all filters
  const handleClearAll = () => {
    setSearchQuery('');
    setSelectedJobType('All Types');
    setSelectedLocation('All Locations');
    setSelectedExperience('All Levels');
    setStatusTab('all');
    setCurrentPage(1);
    toast.info('All filters reset to default.');
  };

  // Copy share link
  const handleShareJob = (job, e) => {
    if (e) e.stopPropagation();
    setActiveMenuId(null);
    const url = `${window.location.origin}/jobs/${job.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      toast.success('Job link copied to clipboard!');
    } else {
      toast.info(`Job URL: ${url}`);
    }
  };

  // 5 Recently Viewed Jobs matching reference image
  const recentlyViewed = useMemo(() => {
    const list = [
      { id: 'job_04', title: 'UI/UX Designer', company: 'Meta', time: '2 days ago', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg', letter: 'M', bg: 'bg-blue-600' },
      { id: 'job_03', title: 'Backend Developer', company: 'Amazon', time: '3 days ago', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', letter: 'A', bg: 'bg-orange-500' },
      { id: 'job_01', title: 'Frontend Developer', company: 'Google', time: '4 days ago', logo: 'https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png', letter: 'G', bg: 'bg-red-500' },
      { id: 'job_02', title: 'Product Manager', company: 'Microsoft', time: '5 days ago', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg', letter: 'M', bg: 'bg-blue-600' },
      { id: 'job_05', title: 'Software Engineer', company: 'Netflix', time: '6 days ago', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg', letter: 'N', bg: 'bg-red-600' },
    ];
    return list;
  }, []);

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
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7C8493] hover:text-[#25324B] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Dashboard</span>
              </Link>
            }
            title="Saved Jobs"
            subtitle="Keep track of jobs you're interested in and apply later."
            searchPlaceholder="Search jobs, companies..."
            onSearch={(val) => {
              setSearchQuery(val);
              setCurrentPage(1);
            }}
          />

          {/* 3. Filter & Search Toolbar matching reference image */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-3 sm:p-4 shadow-2xs text-left">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
              {/* Search input field */}
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-[#7C8493] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search saved jobs by title, company or location..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-[#F8F9FC] border border-gray-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs font-semibold text-[#25324B] placeholder:text-[#A0AEC0] outline-none focus:border-[#25324B] transition-all"
                />
              </div>

              {/* Job Type Dropdown */}
              <div className="min-w-[140px]">
                <select
                  value={selectedJobType}
                  onChange={(e) => {
                    setSelectedJobType(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-[#F8F9FC] border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-[#25324B] outline-none cursor-pointer hover:border-gray-300 focus:border-[#25324B]"
                >
                  <option value="All Types">Job Type: All Types</option>
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              {/* Location Dropdown */}
              <div className="min-w-[140px]">
                <select
                  value={selectedLocation}
                  onChange={(e) => {
                    setSelectedLocation(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-[#F8F9FC] border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-[#25324B] outline-none cursor-pointer hover:border-gray-300 focus:border-[#25324B]"
                >
                  {availableLocations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc === 'All Locations' ? 'Location: All Locations' : loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Experience Level Dropdown */}
              <div className="min-w-[140px]">
                <select
                  value={selectedExperience}
                  onChange={(e) => {
                    setSelectedExperience(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-[#F8F9FC] border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-[#25324B] outline-none cursor-pointer hover:border-gray-300 focus:border-[#25324B]"
                >
                  <option value="All Levels">Experience: All Levels</option>
                  <option value="2-5 years">2-5 years</option>
                  <option value="3-6 years">3-6 years</option>
                  <option value="5+ years">5+ years</option>
                </select>
              </div>

              {/* Clear All Filters Button */}
              <button
                type="button"
                onClick={handleClearAll}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-[#515B6F] hover:text-[#25324B] hover:bg-gray-50 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer flex-shrink-0"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            </div>
          </div>

          {/* 4. Status Filter Pills matching reference image */}
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => {
                  setStatusTab('all');
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  statusTab === 'all'
                    ? 'bg-[#25324B] text-white shadow-xs'
                    : 'bg-white text-[#515B6F] hover:bg-gray-100 border border-gray-200/80'
                }`}
              >
                All Saved Jobs
              </button>

              <button
                type="button"
                onClick={() => {
                  setStatusTab('applied');
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  statusTab === 'applied'
                    ? 'bg-[#25324B] text-white shadow-xs'
                    : 'bg-white text-[#515B6F] hover:bg-gray-100 border border-gray-200/80'
                }`}
              >
                Applied ({summaryMetrics.appliedCount})
              </button>

              <button
                type="button"
                onClick={() => {
                  setStatusTab('not-applied');
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  statusTab === 'not-applied'
                    ? 'bg-[#25324B] text-white shadow-xs'
                    : 'bg-white text-[#515B6F] hover:bg-gray-100 border border-gray-200/80'
                }`}
              >
                Not Applied ({summaryMetrics.notAppliedCount})
              </button>

              <button
                type="button"
                onClick={() => {
                  setStatusTab('expired');
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  statusTab === 'expired'
                    ? 'bg-[#25324B] text-white shadow-xs'
                    : 'bg-white text-[#515B6F] hover:bg-gray-100 border border-gray-200/80'
                }`}
              >
                Expired ({summaryMetrics.expiredCount})
              </button>
            </div>

            {/* Showing Range Text matching reference image */}
            <p className="text-xs text-[#7C8493] font-medium">
              Showing {totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} saved jobs
            </p>
          </div>

          {/* 5. Main 2-Column Layout matching reference image (Left 8 Cols : Right 4 Cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">
            {/* ========================================================================= */}
            {/* LEFT COLUMN: Saved Jobs List (lg:col-span-8)                             */}
            {/* ========================================================================= */}
            <div className="lg:col-span-8 space-y-4">
              {paginatedJobs.length === 0 ? (
                <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto text-[#7C8493]">
                    <Bookmark className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-extrabold text-[#25324B]">No Saved Jobs Found</h3>
                  <p className="text-xs text-[#7C8493] max-w-sm mx-auto">
                    {searchQuery || statusTab !== 'all' || selectedJobType !== 'All Types'
                      ? 'No saved jobs matched your search criteria. Try adjusting your filters.'
                      : "You haven't saved any jobs yet. Browse job postings and click the heart icon to save."}
                  </p>
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={handleClearAll}
                      className="px-4 py-2 rounded-xl bg-[#25324B] text-white text-xs font-bold hover:bg-[#1C2638] transition-colors cursor-pointer"
                    >
                      Reset Filters
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/jobs')}
                      className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-[#25324B] hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      Browse Jobs
                    </button>
                  </div>
                </div>
              ) : (
                paginatedJobs.map((job) => {
                  const isSaved = savedJobIds.includes(job.id);
                  const isApplied = appliedJobIds.includes(job.id);
                  const isExpired = job.status === 'Closed' || job.expired;
                  const isMenuOpen = activeMenuId === job.id;

                  return (
                    <div
                      key={job.id}
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      className="bg-white rounded-2xl border border-gray-200/80 hover:border-[#CCD5E4] hover:shadow-[0_4px_16px_rgba(37,50,75,0.06)] transition-all p-5 flex flex-col sm:flex-row items-start justify-between gap-4 group cursor-pointer relative"
                    >
                      {/* Left: Company Logo + Title + Badges + Description */}
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        {/* Company Logo in square box */}
                        <div className="w-12 h-12 rounded-xl bg-white border border-[#E9ECF2] p-1.5 shadow-2xs flex items-center justify-center flex-shrink-0 overflow-hidden">
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
                            } text-white font-extrabold text-xs items-center justify-center`}
                          >
                            {job.fallbackLetter || job.companyName?.charAt(0) || 'C'}
                          </div>
                        </div>

                        {/* Text info */}
                        <div className="min-w-0 flex-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/jobs/${job.id}`);
                            }}
                            className="text-left font-extrabold text-[#25324B] group-hover:text-blue-600 transition-colors cursor-pointer text-base sm:text-[17px] tracking-tight block truncate"
                          >
                            {job.title}
                          </button>

                          <span className="text-xs font-semibold text-[#515B6F] block mt-0.5">
                            {job.companyName}
                          </span>

                          {/* Chips Row: Location + Employment Type + Experience */}
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className="flex items-center gap-1 text-xs text-[#7C8493] font-medium">
                              <MapPin className="w-3.5 h-3.5 text-gray-400" />
                              <span>{job.location}</span>
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {job.employmentType}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                              <Briefcase className="w-3 h-3 text-blue-500" />
                              <span>{job.experience}</span>
                            </span>
                            {isExpired && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                Expired
                              </span>
                            )}
                          </div>

                          {/* Short Description */}
                          <p className="text-xs text-[#7C8493] line-clamp-2 mt-2 leading-relaxed font-normal">
                            {job.description ||
                              'Develop and maintain web applications using modern web technologies. Work closely with cross-functional teams.'}
                          </p>
                        </div>
                      </div>

                      {/* Right: Salary + Heart Icon + Apply Now CTA + Menu */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 flex-shrink-0">
                        {/* Top: Salary + Heart Bookmark Icon */}
                        <div className="flex items-center gap-3">
                          <span className="text-xs sm:text-sm font-extrabold text-[#25324B]">
                            {formatSalary(job)}
                          </span>

                          {/* Heart Button matching reference image */}
                          <button
                            type="button"
                            onClick={(e) => handleToggleSave(job, e)}
                            className="p-1 text-gray-400 hover:text-rose-500 transition-colors cursor-pointer"
                            title={isSaved ? 'Remove from saved' : 'Save job'}
                          >
                            <Heart
                              className={`w-4 h-4 transition-all ${
                                isSaved
                                  ? 'fill-rose-500 text-rose-500 scale-110'
                                  : 'text-gray-400 hover:text-rose-500'
                              }`}
                            />
                          </button>
                        </div>

                        {/* Bottom Actions: Apply Now Button + Three Dots */}
                        <div className="flex items-center gap-2 relative job-card-actions-menu">
                          <button
                            type="button"
                            onClick={(e) => handleToggleApply(job, e)}
                            className={`px-4 sm:px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                              isApplied
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                                : 'bg-[#25324B] hover:bg-[#1C2638] text-white shadow-[#25324B]/15'
                            }`}
                          >
                            {isApplied ? (
                              <>
                                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                <span>Applied</span>
                              </>
                            ) : (
                              <>
                                <Send className="w-3.5 h-3.5" />
                                <span>Apply Now</span>
                              </>
                            )}
                          </button>

                          {/* Three Dots Button matching reference image */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuId(isMenuOpen ? null : job.id);
                              }}
                              className="p-2 rounded-xl border border-gray-200 text-[#7C8493] hover:text-[#25324B] hover:bg-gray-50 transition-colors cursor-pointer"
                              title="More options"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>

                            {/* Dropdown Menu */}
                            {isMenuOpen && (
                              <div
                                onClick={(e) => e.stopPropagation()}
                                className="absolute right-0 bottom-full mb-1.5 w-40 bg-white rounded-xl shadow-xl border border-gray-100 p-1.5 z-30 text-xs text-left animate-fadeIn"
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    navigate(`/jobs/${job.id}`);
                                  }}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 text-[#25324B] font-semibold transition-colors"
                                >
                                  <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                                  <span>View Details</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => handleShareJob(job, e)}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 text-[#25324B] font-semibold transition-colors"
                                >
                                  <Share2 className="w-3.5 h-3.5 text-gray-400" />
                                  <span>Share Job</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    setActiveMenuId(null);
                                    handleToggleSave(job, e);
                                  }}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 text-rose-600 font-semibold transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                  <span>Remove</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-[#7C8493] hover:text-[#25324B] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-9 h-9 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                        currentPage === pageNum
                          ? 'bg-[#25324B] text-white shadow-xs'
                          : 'bg-white border border-gray-200 text-[#515B6F] hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-[#7C8493] hover:text-[#25324B] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* ========================================================================= */}
            {/* RIGHT COLUMN: 3 Widgets matching reference image (lg:col-span-4)         */}
            {/* ========================================================================= */}
            <div className="lg:col-span-4 space-y-5">
              {/* WIDGET 1: Saved Jobs Summary matching reference image */}
              <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs relative overflow-hidden">
                <div className="flex items-center gap-2 mb-4">
                  <Bookmark className="w-4 h-4 text-[#25324B] stroke-[2.2]" />
                  <h3 className="text-sm font-extrabold text-[#25324B] tracking-tight">
                    Saved Jobs Summary
                  </h3>
                </div>

                {/* 2x2 Stats Grid */}
                <div className="grid grid-cols-2 gap-3 relative z-10">
                  <div className="p-2.5 rounded-xl bg-[#F8F9FC] border border-gray-100">
                    <span className="text-xl font-extrabold text-[#25324B] block leading-none">
                      {summaryMetrics.totalSaved}
                    </span>
                    <span className="text-[11px] font-semibold text-[#7C8493] mt-1 block">
                      Total Saved
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#F8F9FC] border border-gray-100">
                    <span className="text-xl font-extrabold text-blue-600 block leading-none">
                      {summaryMetrics.appliedCount}
                    </span>
                    <span className="text-[11px] font-semibold text-[#7C8493] mt-1 block">
                      Applied
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#F8F9FC] border border-gray-100">
                    <span className="text-xl font-extrabold text-emerald-600 block leading-none">
                      {summaryMetrics.notAppliedCount}
                    </span>
                    <span className="text-[11px] font-semibold text-[#7C8493] mt-1 block">
                      Not Applied
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#F8F9FC] border border-gray-100">
                    <span className="text-xl font-extrabold text-rose-500 block leading-none">
                      {summaryMetrics.expiredCount}
                    </span>
                    <span className="text-[11px] font-semibold text-[#7C8493] mt-1 block">
                      Expired
                    </span>
                  </div>
                </div>

                {/* Decorative document graphic on bottom right */}
                <div className="absolute right-2 -bottom-2 opacity-15 pointer-events-none">
                  <Bookmark className="w-20 h-20 text-[#25324B]" />
                </div>
              </div>

              {/* WIDGET 2: Recently Viewed matching reference image */}
              <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-[#25324B]" />
                    <h3 className="text-sm font-extrabold text-[#25324B] tracking-tight">
                      Recently Viewed
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate('/job-search')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* 5 Recently Viewed items */}
                <div className="divide-y divide-gray-100">
                  {recentlyViewed.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => navigate(`/jobs/${item.id}`)}
                      className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3 group cursor-pointer hover:bg-gray-50/60 -mx-2 px-2 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Company Logo in small box */}
                        <div className="w-9 h-9 rounded-lg border border-gray-200/80 p-1 flex items-center justify-center bg-white shadow-2xs flex-shrink-0 overflow-hidden">
                          {item.logo ? (
                            <img
                              src={item.logo}
                              alt={item.company}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div
                            style={{ display: item.logo ? 'none' : 'flex' }}
                            className={`w-full h-full rounded ${item.bg} text-white font-extrabold text-[10px] items-center justify-center`}
                          >
                            {item.letter}
                          </div>
                        </div>

                        <div className="min-w-0">
                          <h4 className="text-xs font-extrabold text-[#25324B] group-hover:text-blue-600 transition-colors truncate">
                            {item.title}
                          </h4>
                          <span className="text-[11px] text-[#7C8493] block truncate">
                            {item.company} • {item.time}
                          </span>
                        </div>
                      </div>

                      {/* Small bookmark icon */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const found = jobs.find((j) => j.id === item.id) || { id: item.id, title: item.title, companyName: item.company };
                          handleToggleSave(found, e);
                        }}
                        className="p-1 text-gray-300 hover:text-rose-500 transition-colors cursor-pointer flex-shrink-0"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            savedJobIds.includes(item.id)
                              ? 'fill-rose-500 text-rose-500'
                              : 'text-gray-300 hover:text-rose-500'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* WIDGET 3: Promo Banner ('Get Noticed by Top Companies') matching reference image */}
              <div className="bg-gradient-to-br from-sky-50 via-blue-50/70 to-indigo-50/50 rounded-2xl border border-sky-100 p-5 relative overflow-hidden shadow-xs">
                {/* Decorative background dots */}
                <div className="absolute top-2 right-2 grid grid-cols-4 gap-1 opacity-20 pointer-events-none">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="w-1 h-1 rounded-full bg-blue-600" />
                  ))}
                </div>

                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-3 shadow-md shadow-blue-600/20">
                  <Send className="w-4 h-4 stroke-[2.2]" />
                </div>

                <h4 className="text-sm font-extrabold text-[#25324B] tracking-tight">
                  Get Noticed by Top Companies
                </h4>

                <p className="text-xs text-[#515B6F] mt-1 leading-relaxed font-medium">
                  Complete your profile and apply for your dream job today.
                </p>

                <button
                  type="button"
                  onClick={() => navigate('/candidates')}
                  className="mt-3.5 px-4 py-2 rounded-xl bg-[#25324B] hover:bg-[#1C2638] text-white text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <span>Update Profile</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
