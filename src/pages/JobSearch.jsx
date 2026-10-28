import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sidebar } from '../components/dashboard/Sidebar';
import { HeaderNavbar } from '../components/common/HeaderNavbar';
import {
  getStoredJobs,
  getSavedJobIds,
  toggleSavedJobId,
  getAppliedJobIds,
  getCategoryBadgeStyle,
  getTypeBadgeStyle,
} from '../services/jobsService';
import { applyForJob } from '../services/applicationsService';
import { recordActivity } from '../services/activityService';
import {
  Search,
  MapPin,
  Briefcase,
  Calendar,
  Bookmark,
  ChevronDown,
  SlidersHorizontal,
  Filter,
  ArrowLeft,
  Check,
  Sparkles,
  User,
  ChevronLeft,
  ChevronRight,
  Target,
  X,
  Coins,
  CheckCircle2,
  Building2,
  Tag,
} from 'lucide-react';
import { toast } from 'react-toastify';

export const JobSearch = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Dynamic Jobs Data from LocalStorage
  const [jobs, setJobs] = useState(() => getStoredJobs());
  const [savedJobIds, setSavedJobIds] = useState(() => getSavedJobIds());
  const [appliedJobIds, setAppliedJobIds] = useState(() => getAppliedJobIds());

  // Filter States
  const [keyword, setKeyword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedJobType, setSelectedJobType] = useState('All Types');
  const [selectedExperience, setSelectedExperience] = useState('All Levels');
  
  // Quick Filter Pill: 'All' | 'Full Time' | 'Part Time' | 'Remote' | 'Hybrid'
  const [quickPill, setQuickPill] = useState('All');
  
  // Sort State: 'latest' | 'salary-high' | 'popular' | 'oldest'
  const [sortBy, setSortBy] = useState('latest');

  // Sidebar Filter Checkboxes & Inputs
  const [selectedTypesCheckboxes, setSelectedTypesCheckboxes] = useState(['Full Time']);
  const [minSalaryInput, setMinSalaryInput] = useState('');
  const [maxSalaryInput, setMaxSalaryInput] = useState('');
  const [skillsInput, setSkillsInput] = useState('');

  // Pagination State (6 jobs per page)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Profile Modal State (Triggered by 'Update Profile' promo card)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Re-fetch jobs and sync with storage & applications in real-time
  useEffect(() => {
    const syncData = () => {
      setJobs(getStoredJobs());
      setSavedJobIds(getSavedJobIds());
      setAppliedJobIds(getAppliedJobIds());
    };
    syncData();
    window.addEventListener('storage', syncData);
    window.addEventListener('jobs_updated', syncData);
    window.addEventListener('applications_updated', syncData);
    return () => {
      window.removeEventListener('storage', syncData);
      window.removeEventListener('jobs_updated', syncData);
      window.removeEventListener('applications_updated', syncData);
    };
  }, []);

  // Extract unique locations dynamically from data
  const availableLocations = useMemo(() => {
    const locSet = new Set(['All Locations']);
    jobs.forEach((j) => {
      if (j.location) {
        locSet.add(j.location);
      }
    });
    return Array.from(locSet);
  }, [jobs]);

  // Handle Search Submission from top unified search bar
  const handleTopSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setSearchQuery(keyword);
    setCurrentPage(1);
  };

  // Toggle Bookmark Handler with Toast & LocalStorage persistence
  const handleToggleBookmark = (jobId, jobTitle) => {
    const isNowSaved = toggleSavedJobId(jobId);
    setSavedJobIds(getSavedJobIds());
    if (isNowSaved) {
      recordActivity({
        type: 'bookmark',
        title: 'Job saved to bookmarks',
        meta: `${jobTitle}`,
        link: `/jobs/${jobId}`,
        iconType: 'bookmark',
      });
      toast.success(`"${jobTitle}" saved to bookmarks!`, {
        icon: '🔖',
      });
    } else {
      toast.info(`"${jobTitle}" removed from bookmarks.`);
    }
  };

  // Quick Apply Handler with real-time recruiter sync & activity/notification
  const handleQuickApply = (e, job) => {
    e.stopPropagation();
    const res = applyForJob({
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.companyName,
      candidateId: 1,
      candidateName: 'Olivia Wilson',
      candidateEmail: 'olivia.wilson@example.com',
      candidateRole: 'Senior Frontend Developer',
      candidateAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      notes: `Quick applied from Candidate Job Search for ${job.title} at ${job.companyName}.`,
    });

    if (res.success) {
      setAppliedJobIds(getAppliedJobIds());
      toast.success(`Successfully applied for ${job.title}! Recruiter has been notified.`, {
        icon: '🎉',
      });
    } else {
      toast.info(res.message || 'Already applied for this position.');
    }
  };

  // Toggle Job Type Checkbox
  const handleToggleTypeCheckbox = (type) => {
    setCurrentPage(1);
    setSelectedTypesCheckboxes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // Reset all filters
  const handleClearAllFilters = () => {
    setKeyword('');
    setSearchQuery('');
    setSelectedLocation('All Locations');
    setSelectedJobType('All Types');
    setSelectedExperience('All Levels');
    setSelectedTypesCheckboxes([]);
    setMinSalaryInput('');
    setMaxSalaryInput('');
    setSkillsInput('');
    setQuickPill('All');
    setSortBy('latest');
    setCurrentPage(1);
    toast.info('All filters have been reset');
  };

  // Filter & Sort Logic
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // 1. Keyword search (Title, Company, Skills, Description)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const titleMatch = job.title?.toLowerCase().includes(query);
        const compMatch = job.companyName?.toLowerCase().includes(query);
        const skillMatch = Array.isArray(job.skills) && job.skills.some((s) => s.toLowerCase().includes(query));
        const descMatch = job.description?.toLowerCase().includes(query);
        if (!titleMatch && !compMatch && !skillMatch && !descMatch) return false;
      }

      // 2. Top Location Filter
      if (selectedLocation !== 'All Locations') {
        if (!job.location?.toLowerCase().includes(selectedLocation.toLowerCase())) {
          return false;
        }
      }

      // 3. Top Job Type Filter
      if (selectedJobType !== 'All Types') {
        if (job.employmentType !== selectedJobType) {
          return false;
        }
      }

      // 4. Top Experience Level Filter
      if (selectedExperience !== 'All Levels') {
        if (!job.experience?.toLowerCase().includes(selectedExperience.toLowerCase())) {
          return false;
        }
      }

      // 5. Quick Filter Pill ('All' | 'Full Time' | 'Part Time' | 'Remote' | 'Hybrid')
      if (quickPill === 'Full Time' && job.employmentType !== 'Full Time') return false;
      if (quickPill === 'Part Time' && job.employmentType !== 'Part Time') return false;
      if (quickPill === 'Remote') {
        const isRemote = job.workplaceType === 'Remote' || job.location?.toLowerCase().includes('remote');
        if (!isRemote) return false;
      }
      if (quickPill === 'Hybrid' && job.workplaceType !== 'Hybrid') return false;

      // 6. Sidebar Job Type Checkboxes
      if (selectedTypesCheckboxes.length > 0) {
        if (!selectedTypesCheckboxes.includes(job.employmentType)) {
          return false;
        }
      }

      // 7. Salary Range (Min / Max)
      if (minSalaryInput) {
        const minVal = parseInt(minSalaryInput.replace(/\D/g, ''), 10);
        if (!isNaN(minVal) && (job.maxSalary || 0) < minVal) {
          return false;
        }
      }
      if (maxSalaryInput) {
        const maxVal = parseInt(maxSalaryInput.replace(/\D/g, ''), 10);
        if (!isNaN(maxVal) && (job.minSalary || 0) > maxVal) {
          return false;
        }
      }

      // 8. Sidebar Skills Search
      if (skillsInput.trim()) {
        const skillQuery = skillsInput.toLowerCase().trim();
        const hasSkill = Array.isArray(job.skills) && job.skills.some((s) => s.toLowerCase().includes(skillQuery));
        const inTitle = job.title?.toLowerCase().includes(skillQuery);
        if (!hasSkill && !inTitle) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'salary-high') {
        return (b.maxSalary || 0) - (a.maxSalary || 0);
      }
      if (sortBy === 'popular') {
        return (b.applicationsCount || 0) - (a.applicationsCount || 0);
      }
      if (sortBy === 'oldest') {
        return (a.id || '').localeCompare(b.id || '');
      }
      // 'latest' default
      return (b.id || '').localeCompare(a.id || '');
    });
  }, [
    jobs,
    searchQuery,
    selectedLocation,
    selectedJobType,
    selectedExperience,
    quickPill,
    selectedTypesCheckboxes,
    minSalaryInput,
    maxSalaryInput,
    skillsInput,
    sortBy,
  ]);

  // Paginated Slice
  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / itemsPerPage));
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredJobs.slice(start, start + itemsPerPage);
  }, [filteredJobs, currentPage, itemsPerPage]);

  const startIndex = filteredJobs.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, filteredJobs.length);

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex">
      {/* 1. Dark Slate Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-5 sm:p-7 lg:p-9 max-w-[1440px] w-full mx-auto space-y-6">
          {/* Top Navbar with Dynamic Title matching other pages */}
          <HeaderNavbar
            onToggleSidebar={() => setSidebarOpen(true)}
            icon={<Search className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.2] text-[#25324B]" />}
            title="Job Search"
            subtitle="Search and explore thousands of job opportunities from top companies."
            searchPlaceholder="Search jobs, companies..."
            onSearch={(val) => {
              setKeyword(val);
              setSearchQuery(val);
            }}
          />

          {/* 3. Hero Banner: 'Find Your Next Opportunity' matching reference image */}
          <div className="bg-gradient-to-r from-white via-[#F8FAFD] to-[#EFF6FF] border border-gray-200/80 rounded-3xl p-6 sm:p-8 lg:p-10 relative overflow-hidden shadow-xs">
            {/* Background Decorative Circles */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-indigo-50/40 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              {/* Left Text */}
              <div className="max-w-xl text-left">
                <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#25324B] tracking-tight leading-tight">
                  Find Your Next Opportunity
                </h1>
                <p className="text-xs sm:text-sm text-[#7C8493] mt-2.5 font-medium leading-relaxed max-w-lg">
                  Explore thousands of job opportunities from top companies and take the next step in your career journey.
                </p>
              </div>

              {/* Right Illustration matching reference image */}
              <div className="hidden md:flex items-center justify-end flex-shrink-0 relative">
                {/* Playful Handwritten Note with Curved Arrow */}
                <div className="absolute -top-3 -right-2 text-right pointer-events-none select-none z-20">
                  <span className="font-['Caveat',_cursive,_sans-serif] text-base sm:text-lg font-bold text-[#25324B] tracking-wide block transform -rotate-6">
                    Your Dream Job
                  </span>
                  <span className="font-['Caveat',_cursive,_sans-serif] text-base sm:text-lg font-bold text-[#25324B] tracking-wide block transform -rotate-3 -mt-1">
                    is Just a Search Away ⤴
                  </span>
                </div>

                {/* SVG Illustration: Person working on laptop with plants & floating window */}
                <svg
                  className="w-72 sm:w-80 h-44 sm:h-52"
                  viewBox="0 0 320 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Floating Document Window */}
                  <rect x="180" y="24" width="76" height="52" rx="8" fill="white" stroke="#E2E8F0" strokeWidth="1.5" />
                  <rect x="188" y="34" width="34" height="4" rx="2" fill="#60A5FA" />
                  <rect x="188" y="44" width="60" height="3" rx="1.5" fill="#E2E8F0" />
                  <rect x="188" y="52" width="48" height="3" rx="1.5" fill="#E2E8F0" />
                  <circle cx="242" cy="36" r="3" fill="#3B82F6" />

                  {/* Potted Plant */}
                  <path d="M72 135 C65 110, 80 90, 85 80 C88 95, 82 120, 80 135 Z" fill="#34D399" opacity="0.8" />
                  <path d="M60 140 C50 120, 60 100, 68 95 C70 110, 66 128, 68 140 Z" fill="#10B981" />
                  <path d="M86 142 C98 125, 96 108, 92 102 C86 115, 84 130, 82 142 Z" fill="#059669" />
                  <rect x="62" y="140" width="26" height="32" rx="4" fill="#6EE7B7" opacity="0.6" />
                  <rect x="60" y="137" width="30" height="5" rx="2.5" fill="#10B981" />

                  {/* Person Sitting with Laptop */}
                  {/* Body / Navy Sweater */}
                  <path
                    d="M135 155 C132 130, 142 110, 155 102 C168 110, 178 130, 175 155 Z"
                    fill="#1E293B"
                  />
                  {/* Head */}
                  <circle cx="155" cy="82" r="14" fill="#FCD34D" />
                  {/* Hair */}
                  <path
                    d="M141 82 C141 68, 169 68, 169 82 C167 74, 157 72, 149 75 C143 78, 141 82, 141 82 Z"
                    fill="#0F172A"
                  />
                  {/* Arm holding laptop */}
                  <path
                    d="M145 120 L160 132 L180 130"
                    stroke="#FCD34D"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Laptop */}
                  <path d="M158 135 L190 135 L196 142 L152 142 Z" fill="#94A3B8" />
                  <path d="M168 112 L198 128 L192 135 L162 120 Z" fill="#3B82F6" />
                  <rect x="165" y="115" width="26" height="16" rx="2" fill="#DBEAFE" transform="rotate(26 165 115)" />

                  {/* Legs / Jeans */}
                  <path
                    d="M135 155 C125 160, 110 162, 102 165 C100 172, 125 174, 145 168 Z"
                    fill="#334155"
                  />
                  <path
                    d="M165 155 C180 160, 195 162, 205 165 C208 172, 182 174, 160 168 Z"
                    fill="#1E293B"
                  />

                  {/* Floating Paper Airplane */}
                  <path
                    d="M260 90 L285 75 L272 105 L268 94 Z"
                    fill="#60A5FA"
                    opacity="0.85"
                  />
                  <path d="M268 94 L285 75" stroke="#3B82F6" strokeWidth="1" />
                </svg>
              </div>
            </div>
          </div>

          {/* 4. Big Unified Search Bar matching reference image */}
          <form
            onSubmit={handleTopSearchSubmit}
            className="bg-white rounded-2xl border border-gray-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-2 sm:p-2.5 flex flex-col lg:flex-row items-stretch lg:items-center gap-2"
          >
            {/* Field 1: Keyword Input */}
            <div className="flex items-center gap-3 px-3.5 py-2.5 flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-[#7C8493] flex-shrink-0" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search jobs by title, skills, or company..."
                className="w-full text-xs sm:text-[13px] font-medium text-[#25324B] placeholder:text-[#A0AEC0] outline-none bg-transparent"
              />
            </div>

            {/* Vertical Divider */}
            <div className="hidden lg:block w-[1px] h-8 bg-gray-200" />

            {/* Field 2: Location Dropdown */}
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 min-w-[170px]">
              <MapPin className="w-4 h-4 text-[#7C8493] flex-shrink-0" />
              <div className="flex flex-col text-left w-full">
                <span className="text-[10px] text-[#7C8493] font-semibold uppercase tracking-wider leading-none">
                  Location
                </span>
                <select
                  value={selectedLocation}
                  onChange={(e) => {
                    setSelectedLocation(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="text-xs sm:text-[13px] font-bold text-[#25324B] bg-transparent outline-none cursor-pointer mt-0.5"
                >
                  {availableLocations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="hidden lg:block w-[1px] h-8 bg-gray-200" />

            {/* Field 3: Job Type Dropdown */}
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 min-w-[150px]">
              <div className="flex flex-col text-left w-full">
                <span className="text-[10px] text-[#7C8493] font-semibold uppercase tracking-wider leading-none">
                  Job Type
                </span>
                <select
                  value={selectedJobType}
                  onChange={(e) => {
                    setSelectedJobType(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="text-xs sm:text-[13px] font-bold text-[#25324B] bg-transparent outline-none cursor-pointer mt-0.5"
                >
                  <option value="All Types">All Types</option>
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="hidden lg:block w-[1px] h-8 bg-gray-200" />

            {/* Field 4: Experience Level Dropdown */}
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 min-w-[160px]">
              <div className="flex flex-col text-left w-full">
                <span className="text-[10px] text-[#7C8493] font-semibold uppercase tracking-wider leading-none">
                  Experience Level
                </span>
                <select
                  value={selectedExperience}
                  onChange={(e) => {
                    setSelectedExperience(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="text-xs sm:text-[13px] font-bold text-[#25324B] bg-transparent outline-none cursor-pointer mt-0.5"
                >
                  <option value="All Levels">All Levels</option>
                  <option value="2-5 years">2-5 years</option>
                  <option value="3-6 years">3-6 years</option>
                  <option value="2-4 years">2-4 years</option>
                  <option value="5+ years">5+ years</option>
                </select>
              </div>
            </div>

            {/* Field 5: Search Button matching image */}
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#25324B] hover:bg-[#1C2638] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-[#25324B]/15 cursor-pointer flex-shrink-0"
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
              <span>Search</span>
            </button>
          </form>

          {/* 5. Sort Dropdown & Quick Filter Pills matching reference image */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Left: Sort By Dropdown */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-gray-200 shadow-2xs text-xs font-semibold text-[#515B6F]">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#7C8493]" />
                  <span className="text-[#7C8493] text-[11px]">Sort by</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="font-bold text-[#25324B] bg-transparent outline-none cursor-pointer pr-1"
                  >
                    <option value="latest">Latest Jobs</option>
                    <option value="salary-high">Highest Salary</option>
                    <option value="popular">Most Popular</option>
                    <option value="oldest">Oldest</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right: Quick Pills (All, Full Time, Part Time, Remote, Hybrid) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {['All', 'Full Time', 'Part Time', 'Remote', 'Hybrid'].map((pill) => {
                const isActive = quickPill === pill;
                return (
                  <button
                    key={pill}
                    type="button"
                    onClick={() => {
                      setQuickPill(pill);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[#25324B] text-white shadow-xs'
                        : 'bg-white text-[#515B6F] hover:bg-gray-50 border border-gray-200/90'
                    }`}
                  >
                    {pill}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Main 2-Column Content Grid matching reference image */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (Job Cards Feed): 8 cols */}
            <div className="lg:col-span-8 space-y-4">
              {/* Header count */}
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-semibold text-[#7C8493]">
                  Showing{' '}
                  <strong className="text-[#25324B] font-bold">
                    {startIndex}-{endIndex}
                  </strong>{' '}
                  of <strong className="text-[#25324B] font-bold">{filteredJobs.length}</strong>{' '}
                  jobs
                </span>

                {(searchQuery ||
                  selectedLocation !== 'All Locations' ||
                  selectedJobType !== 'All Types' ||
                  selectedExperience !== 'All Levels' ||
                  quickPill !== 'All' ||
                  selectedTypesCheckboxes.length > 0 ||
                  minSalaryInput ||
                  maxSalaryInput ||
                  skillsInput) && (
                  <button
                    type="button"
                    onClick={handleClearAllFilters}
                    className="text-xs text-blue-600 hover:text-blue-800 font-bold hover:underline cursor-pointer"
                  >
                    Clear active filters
                  </button>
                )}
              </div>

              {/* Jobs List */}
              {paginatedJobs.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200/80 p-10 text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto text-[#7C8493]">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-extrabold text-[#25324B]">No Jobs Found</h3>
                  <p className="text-xs text-[#7C8493] max-w-sm mx-auto">
                    We could not find any job postings matching your current filter criteria.
                  </p>
                  <button
                    type="button"
                    onClick={handleClearAllFilters}
                    className="px-4 py-2 rounded-xl bg-[#25324B] text-white text-xs font-bold hover:bg-[#1C2638] transition-colors cursor-pointer inline-block"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                paginatedJobs.map((job) => {
                  const isSaved = savedJobIds.includes(job.id);
                  const isApplied = appliedJobIds.includes(String(job.id));
                  return (
                    <div
                      key={job.id}
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      className="bg-white rounded-2xl border border-gray-200/80 hover:border-[#25324B]/30 hover:shadow-[0_6px_20px_rgba(37,50,75,0.08)] transition-all p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group text-left relative cursor-pointer"
                    >
                      {/* Left: Company Logo + Title + Company + Metadata Chips */}
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        {/* Company Logo in sleek box */}
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

                        <div className="min-w-0 flex-1">
                          <button
                            type="button"
                            onClick={() => navigate(`/jobs/${job.id}`)}
                            className="text-left font-extrabold text-[#25324B] group-hover:text-blue-600 transition-colors cursor-pointer text-base sm:text-[17px] tracking-tight block truncate"
                          >
                            {job.title}
                          </button>
                          <span className="text-xs font-semibold text-[#515B6F] block mt-0.5">
                            {job.companyName}
                          </span>

                          {/* Chips Row matching image */}
                          <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                            <span className="flex items-center gap-1 text-xs text-[#7C8493] font-medium">
                              <MapPin className="w-3.5 h-3.5 text-gray-400" />
                              <span>{job.location}</span>
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {job.employmentType}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                              {job.experience}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Bookmark + Salary + Posted Date + View Details Button */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 flex-shrink-0">
                        {/* Bookmark Ribbon */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleBookmark(job.id, job.title);
                            }}
                            className="p-1 text-gray-400 hover:text-[#25324B] transition-colors cursor-pointer"
                            title={isSaved ? 'Remove bookmark' : 'Bookmark job'}
                          >
                            <Bookmark
                              className={`w-4 h-4 transition-all ${
                                isSaved
                                  ? 'fill-[#25324B] text-[#25324B]'
                                  : 'stroke-[#7C8493] hover:stroke-[#25324B]'
                              }`}
                            />
                          </button>
                        </div>

                        {/* Salary & Posted Date */}
                        <div className="text-left sm:text-right">
                          <div className="flex items-center gap-1 sm:justify-end text-sm font-extrabold text-[#25324B]">
                            <Coins className="w-3.5 h-3.5 text-[#25324B]" />
                            <span>{job.salaryRange}</span>
                          </div>
                          <div className="flex items-center gap-1 sm:justify-end text-[11px] text-[#7C8493] font-medium mt-0.5">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <span>{job.postedTime}</span>
                          </div>
                        </div>

                        {/* Actions: Apply Now / Applied + View Details CTA Button */}
                        <div className="flex items-center gap-2">
                          {isApplied ? (
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Applied</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => handleQuickApply(e, job)}
                              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Apply Now</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => navigate(`/jobs/${job.id}`)}
                            className="px-4 py-2 rounded-xl bg-[#25324B] hover:bg-[#1C2638] text-white text-xs font-bold shadow-2xs transition-all cursor-pointer whitespace-nowrap"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Pagination Controls matching reference image: < 1 2 3 4 5 > */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-5">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-[#7C8493] hover:text-[#25324B] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {(() => {
                    const maxButtons = 5;
                    let start = Math.max(1, currentPage - 2);
                    let end = Math.min(totalPages, start + maxButtons - 1);
                    if (end - start + 1 < maxButtons) {
                      start = Math.max(1, end - maxButtons + 1);
                    }
                    const pages = [];
                    for (let i = start; i <= end; i++) {
                      pages.push(i);
                    }
                    return pages.map((pageNum) => (
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
                    ));
                  })()}

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

            {/* Right Column: Filters Sidebar & Promo Card (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* 1. Filter Jobs Card matching reference image */}
              <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-5 sm:p-6 text-left space-y-5">
                {/* Header: Title + Clear All button */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2 font-extrabold text-[#25324B] text-sm sm:text-base">
                    <Filter className="w-4 h-4 text-[#25324B]" />
                    <span>Filter Jobs</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearAllFilters}
                    className="text-xs text-[#7C8493] hover:text-[#25324B] font-semibold transition-colors cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>

                {/* Filter 1: Location */}
                <div>
                  <label className="text-xs font-bold text-[#25324B] block mb-1.5">Location</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#7C8493] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={selectedLocation}
                      onChange={(e) => {
                        setSelectedLocation(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full bg-[#F8F9FC] border border-gray-200 rounded-xl pl-10 pr-8 py-2 text-xs font-semibold text-[#25324B] outline-none cursor-pointer hover:border-gray-300 focus:border-[#25324B]"
                    >
                      {availableLocations.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Filter 2: Job Type Checkboxes matching image */}
                <div>
                  <label className="text-xs font-bold text-[#25324B] block mb-2">Job Type</label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {['Full Time', 'Part Time', 'Contract', 'Internship'].map((type) => {
                      const isChecked = selectedTypesCheckboxes.includes(type);
                      return (
                        <label
                          key={type}
                          className="flex items-center gap-2 text-xs font-medium text-[#515B6F] cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleTypeCheckbox(type)}
                            className="w-4 h-4 rounded text-[#25324B] focus:ring-[#25324B] border-gray-300 cursor-pointer accent-[#25324B]"
                          />
                          <span>{type}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Filter 3: Experience Level */}
                <div>
                  <label className="text-xs font-bold text-[#25324B] block mb-1.5">
                    Experience Level
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-[#7C8493] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={selectedExperience}
                      onChange={(e) => {
                        setSelectedExperience(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full bg-[#F8F9FC] border border-gray-200 rounded-xl pl-10 pr-8 py-2 text-xs font-semibold text-[#25324B] outline-none cursor-pointer hover:border-gray-300 focus:border-[#25324B]"
                    >
                      <option value="All Levels">All Levels</option>
                      <option value="2-5 years">2-5 years</option>
                      <option value="3-6 years">3-6 years</option>
                      <option value="2-4 years">2-4 years</option>
                      <option value="5+ years">5+ years</option>
                    </select>
                  </div>
                </div>

                {/* Filter 4: Salary Range */}
                <div>
                  <label className="text-xs font-bold text-[#25324B] block mb-1.5">
                    Salary Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <span className="text-xs text-[#7C8493] font-bold absolute left-3 top-1/2 -translate-y-1/2">
                        $
                      </span>
                      <input
                        type="text"
                        placeholder="Min Salary"
                        value={minSalaryInput}
                        onChange={(e) => {
                          setMinSalaryInput(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="w-full bg-[#F8F9FC] border border-gray-200 rounded-xl pl-7 pr-3 py-2 text-xs font-semibold text-[#25324B] placeholder:text-[#A0AEC0] outline-none focus:border-[#25324B]"
                      />
                    </div>
                    <div className="relative">
                      <span className="text-xs text-[#7C8493] font-bold absolute left-3 top-1/2 -translate-y-1/2">
                        $
                      </span>
                      <input
                        type="text"
                        placeholder="Max Salary"
                        value={maxSalaryInput}
                        onChange={(e) => {
                          setMaxSalaryInput(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="w-full bg-[#F8F9FC] border border-gray-200 rounded-xl pl-7 pr-3 py-2 text-xs font-semibold text-[#25324B] placeholder:text-[#A0AEC0] outline-none focus:border-[#25324B]"
                      />
                    </div>
                  </div>
                </div>

                {/* Filter 5: Skills */}
                <div>
                  <label className="text-xs font-bold text-[#25324B] block mb-1.5">Skills</label>
                  <div className="relative">
                    <Tag className="w-4 h-4 text-[#7C8493] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search skills..."
                      value={skillsInput}
                      onChange={(e) => {
                        setSkillsInput(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full bg-[#F8F9FC] border border-gray-200 rounded-xl pl-10 pr-3 py-2 text-xs font-semibold text-[#25324B] placeholder:text-[#A0AEC0] outline-none focus:border-[#25324B]"
                    />
                  </div>
                </div>

                {/* Apply Filters Action Button */}
                <button
                  type="button"
                  onClick={() => {
                    toast.success('Filters applied successfully');
                    window.scrollTo({ top: 350, behavior: 'smooth' });
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#25324B] hover:bg-[#1C2638] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>Apply Filters</span>
                </button>
              </div>

              {/* 2. Promo Card: Get Noticed by Top Companies matching reference image */}
              <div className="bg-gradient-to-br from-sky-50 via-blue-50/70 to-indigo-50/50 rounded-2xl border border-sky-100 p-6 relative overflow-hidden text-left shadow-xs">
                {/* Decorative Dots Pattern */}
                <div className="absolute top-3 right-3 grid grid-cols-4 gap-1 opacity-25 pointer-events-none">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="w-1 h-1 rounded-full bg-blue-600" />
                  ))}
                </div>
                <div className="absolute bottom-3 left-3 grid grid-cols-4 gap-1 opacity-20 pointer-events-none">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="w-1 h-1 rounded-full bg-blue-600" />
                  ))}
                </div>

                <div className="w-10 h-10 rounded-xl bg-blue-100/80 text-blue-700 flex items-center justify-center mb-3 shadow-2xs">
                  <Target className="w-5 h-5 stroke-[2.2]" />
                </div>

                <h4 className="text-base font-extrabold text-[#25324B] tracking-tight">
                  Get Noticed by Top Companies
                </h4>

                <p className="text-xs text-[#515B6F] mt-1.5 leading-relaxed font-medium">
                  Create your profile, complete your skills and increase your chances of getting hired.
                </p>

                <button
                  type="button"
                  onClick={() => navigate('/candidate-profile')}
                  className="mt-4 px-4 py-2 rounded-xl bg-[#25324B] hover:bg-[#1C2638] text-white text-xs font-bold inline-flex items-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <span>Update Profile</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Candidate Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 relative shadow-2xl border border-[#E9ECF2]">
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-[#7C8493] hover:text-[#25324B] hover:bg-[#F8F9FC] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-[#25324B] text-white flex items-center justify-center font-extrabold text-2xl shadow-md">
                P
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-[#25324B]">Pavan Kumar</h3>
                <p className="text-xs text-[#7C8493] font-medium">pavan.kumar@jobportal.com</p>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  Verified Candidate / Recruiter
                </span>
              </div>
            </div>

            <div className="space-y-4 text-xs text-left">
              <div>
                <label className="font-bold text-[#25324B] block mb-1">Headline</label>
                <input
                  type="text"
                  defaultValue="Full Stack Engineer & Tech Recruiter"
                  className="w-full bg-[#F8F9FC] border border-gray-200 rounded-xl px-3.5 py-2 font-medium text-[#25324B] outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-[#25324B] block mb-1">Top Skills</label>
                <div className="flex flex-wrap gap-1.5">
                  {['React.js', 'Tailwind CSS', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS'].map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-lg bg-gray-100 text-[#25324B] font-semibold text-[11px]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-[#25324B] block mb-1">Profile Bio</label>
                <textarea
                  rows={3}
                  defaultValue="Passionate software professional with experience building responsive, accessible web applications and scaling engineering teams."
                  className="w-full bg-[#F8F9FC] border border-gray-200 rounded-xl p-3 font-medium text-[#25324B] outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-[#515B6F] hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileModalOpen(false);
                    toast.success('Profile updated successfully!');
                  }}
                  className="px-5 py-2 rounded-xl bg-[#25324B] text-white text-xs font-bold hover:bg-[#1C2638]"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
