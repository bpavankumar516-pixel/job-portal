import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/dashboard/Sidebar';
import { AddEditCompanyModal } from '../components/companies/AddEditCompanyModal';
import { DeleteCompanyModal } from '../components/companies/DeleteCompanyModal';
import {
  getCompanyById,
  updateCompany,
  deleteCompany,
  getCompanyJobs,
  getCompanyEnrichedData,
  getStoredCompanies,
} from '../services/companiesService';
import {
  Building2,
  MapPin,
  Users,
  Globe,
  Mail,
  Star,
  Briefcase,
  ChevronRight,
  ArrowLeft,
  Edit2,
  Trash2,
  ExternalLink,
  Plus,
  CheckCircle2,
  DollarSign,
  Clock,
  Send,
  Bookmark,
  Share2,
  Bell,
  ChevronDown,
  Menu,
  HeartPulse,
  Laptop,
  Sun,
  GraduationCap,
  PiggyBank,
  Coffee,
  Smile,
  ShieldCheck,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { toast } from 'react-toastify';

export const CompanyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Active Tab: 'overview' | 'jobs' | 'perks' | 'tech' | 'offices'
  const [activeTab, setActiveTab] = useState('overview');

  // Company and enriched data
  const [company, setCompany] = useState(() => getCompanyById(id));
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [savedJobs, setSavedJobs] = useState({});
  const [appliedJobs, setAppliedJobs] = useState({});

  // Jobs filter within this company
  const [jobSearch, setJobSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  // Sync company data when ID changes
  useEffect(() => {
    const found = getCompanyById(id);
    setCompany(found);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const enriched = useMemo(() => {
    return company ? getCompanyEnrichedData(company) : null;
  }, [company]);

  const rawJobs = useMemo(() => {
    return company ? getCompanyJobs(company) : [];
  }, [company]);

  const filteredJobs = useMemo(() => {
    return rawJobs.filter((job) => {
      const matchSearch =
        !jobSearch.trim() ||
        job.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
        job.skills.some((s) => s.toLowerCase().includes(jobSearch.toLowerCase()));
      const matchDept = selectedDept === 'All' || job.dept === selectedDept;
      return matchSearch && matchDept;
    });
  }, [rawJobs, jobSearch, selectedDept]);

  const departments = useMemo(() => {
    const set = new Set(rawJobs.map((j) => j.dept));
    return ['All', ...Array.from(set)];
  }, [rawJobs]);

  // Similar companies in the same industry
  const similarCompanies = useMemo(() => {
    if (!company) return [];
    return getStoredCompanies()
      .filter((c) => c.industry === company.industry && c.id !== company.id)
      .slice(0, 3);
  }, [company]);

  const handleUpdate = (formData) => {
    const updated = updateCompany(company.id, formData);
    if (updated) {
      setCompany(updated);
      toast.success(`"${updated.name}" details updated successfully!`, {
        icon: '🏢',
      });
      setIsEditModalOpen(false);
    }
  };

  const handleDelete = () => {
    deleteCompany(company.id);
    toast.info(`"${company.name}" has been removed.`, {
      icon: '🗑️',
    });
    setIsDeleteModalOpen(false);
    navigate('/companies');
  };

  const handleApplyJob = (job) => {
    if (appliedJobs[job.id]) {
      toast.info(`You have already applied for ${job.title}.`);
      return;
    }
    setAppliedJobs((prev) => ({ ...prev, [job.id]: true }));
    toast.success(`Application submitted for "${job.title}" at ${company.name}!`, {
      icon: '🚀',
    });
  };

  const handleToggleSaveJob = (jobId) => {
    setSavedJobs((prev) => {
      const next = !prev[jobId];
      if (next) {
        toast.success('Job saved to your bookmarks!');
      } else {
        toast.info('Job removed from bookmarks.');
      }
      return { ...prev, [jobId]: next };
    });
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Company page link copied to clipboard!');
    } else {
      toast.info('Share URL: ' + window.location.href);
    }
  };

  const displayName = user?.fullName || 'Pavan Kumar';
  const displayRole = user?.role || role || 'Recruiter';
  const displayInitial = displayName.charAt(0).toUpperCase();

  // If company not found
  if (!company) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white border border-[#CCD5E4] flex items-center justify-center mb-4 text-[#25324B]">
            <Building2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#25324B] mb-2">Company Not Found</h2>
          <p className="text-sm text-[#7C8493] max-w-md mb-6">
            The company profile you are looking for may have been removed or does not exist.
          </p>
          <button
            type="button"
            onClick={() => navigate('/companies')}
            className="px-5 py-2.5 rounded-xl bg-[#25324B] text-white text-xs font-bold hover:bg-[#1C2638] transition-colors"
          >
            ← Back to Companies
          </button>
        </div>
      </div>
    );
  }

  const renderPerkIcon = (iconName) => {
    switch (iconName) {
      case 'HeartPulse':
        return <HeartPulse className="w-5 h-5 text-rose-500" />;
      case 'PiggyBank':
        return <PiggyBank className="w-5 h-5 text-emerald-500" />;
      case 'Laptop':
        return <Laptop className="w-5 h-5 text-blue-500" />;
      case 'Sun':
        return <Sun className="w-5 h-5 text-amber-500" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-purple-500" />;
      case 'Coffee':
        return <Coffee className="w-5 h-5 text-orange-500" />;
      case 'Smile':
        return <Smile className="w-5 h-5 text-teal-500" />;
      default:
        return <Users className="w-5 h-5 text-indigo-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex">
      {/* 1. Dark Slate Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-5 sm:p-7 lg:p-9 max-w-[1440px] w-full mx-auto space-y-6">
          {/* Top Bar: Breadcrumbs & Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl text-[#25324B] hover:bg-white transition-colors cursor-pointer"
                aria-label="Open Navigation"
              >
                <Menu className="w-5 h-5 stroke-[2]" />
              </button>

              <div>
                {/* Breadcrumb Path */}
                <nav className="flex items-center gap-1.5 text-xs text-[#7C8493] font-medium mb-1">
                  <Link to="/dashboard" className="hover:text-[#25324B] transition-colors">
                    Dashboard
                  </Link>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  <Link to="/companies" className="hover:text-[#25324B] transition-colors">
                    Companies
                  </Link>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  <span className="font-bold text-[#25324B]">{company.name}</span>
                </nav>

                <h1 className="text-xl sm:text-2xl font-extrabold text-[#25324B] tracking-tight">
                  Company Profile & Vacancies
                </h1>
              </div>
            </div>

            {/* Top Right User Profile & Back Button */}
            <div className="flex items-center gap-3 self-end sm:self-center">
              <button
                type="button"
                onClick={() => navigate('/companies')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E9ECF2] text-xs font-bold text-[#25324B] hover:bg-gray-50 shadow-2xs transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Companies</span>
              </button>

              <button
                type="button"
                onClick={() => toast.info('You have 2 employer notifications.')}
                className="p-2.5 rounded-xl bg-white border border-gray-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.04)] text-[#7C8493] hover:text-[#25324B] transition-colors relative cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4 stroke-[2]" />
                <span className="w-2 h-2 rounded-full bg-red-500 absolute top-2 right-2 ring-2 ring-white" />
              </button>

              {/* Profile Badge */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white hover:bg-gray-50 border border-gray-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all cursor-pointer focus:outline-none"
                >
                  <div className="w-7 h-7 rounded-full bg-[#25324B] text-white flex items-center justify-center font-extrabold text-xs">
                    {displayInitial}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-[#25324B] leading-none">
                      {displayName}
                    </span>
                    <span className="text-[10px] text-[#7C8493] font-semibold capitalize mt-0.5">
                      {displayRole}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#7C8493]" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-60 bg-white rounded-2xl shadow-xl border border-[#E9ECF2] p-2 z-50 animate-fadeIn text-left text-xs">
                    <div className="p-2.5 bg-[#F8F9FC] rounded-xl mb-1">
                      <p className="font-extrabold text-[#25324B]">{displayName}</p>
                      <p className="text-[11px] text-[#7C8493] truncate">{user?.email || 'recruiter@jobportal.com'}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl font-bold transition-colors cursor-pointer"
                    >
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3. Hero Header Card with Cover Banner & Branding */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.03)] overflow-hidden">
            {/* Top Gradient Banner */}
            <div className="h-36 sm:h-44 w-full bg-gradient-to-r from-[#25324B] via-[#1E293B] to-[#334155] relative p-6 flex items-end justify-end">
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
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>

            {/* Bottom Profile Info */}
            <div className="px-6 sm:px-8 pb-7 pt-0 relative">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-14 mb-6">
                {/* Logo & Identity */}
                <div className="flex items-end gap-5">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white border-4 border-white shadow-lg p-2.5 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                    {company.logo ? (
                      <img
                        src={company.logo}
                        alt={company.name}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div
                        className={`w-full h-full rounded-2xl ${
                          company.fallbackBg || 'bg-[#25324B]'
                        } text-white font-extrabold text-3xl flex items-center justify-center`}
                      >
                        {company.fallbackLetter || company.name?.charAt(0) || 'C'}
                      </div>
                    )}
                  </div>

                  <div className="pb-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#25324B] tracking-tight">
                        {company.name}
                      </h2>
                      <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>Verified Employer</span>
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {company.status || 'Active'}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-xs text-[#7C8493] font-medium flex-wrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          company.industryColor || 'bg-blue-50 text-blue-700'
                        } border`}
                      >
                        {company.industry}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#7C8493]" />
                        <span>{company.location}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-[#7C8493]" />
                        <span>{company.employees}</span>
                      </span>
                      <span className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{company.rating || 4.8} (1,420 Reviews)</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Primary CTA Buttons */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  <a
                    href={`https://${company.website?.replace(/^https?:\/\//, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#E9ECF2] hover:border-[#CCD5E4] text-[#25324B] text-xs font-bold hover:bg-[#F8F9FC] transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Visit Website</span>
                    <ExternalLink className="w-3 h-3 text-[#7C8493]" />
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('jobs');
                      toast.info(`Showing all ${rawJobs.length} active positions for ${company.name}`);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25324B] hover:bg-[#1C2638] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#25324B]/20 transition-all cursor-pointer"
                  >
                    <Briefcase className="w-4 h-4 stroke-[2.2]" />
                    <span>View {company.openJobs || rawJobs.length} Open Roles</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="p-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete Company"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 4 Company Highlight Quick Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#F0F2F6]">
                <div className="p-3.5 rounded-2xl bg-[#F8F9FC] border border-[#E9ECF2]/70">
                  <span className="text-[11px] font-bold text-[#7C8493] block">Active Vacancies</span>
                  <p className="text-xl font-extrabold text-[#25324B] mt-0.5">
                    {company.openJobs || rawJobs.length} Positions
                  </p>
                  <span className="text-[10px] text-emerald-600 font-bold mt-0.5 inline-block">
                    +4 roles this month
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F8F9FC] border border-[#E9ECF2]/70">
                  <span className="text-[11px] font-bold text-[#7C8493] block">Average Compensation</span>
                  <p className="text-xl font-extrabold text-[#25324B] mt-0.5">$155,000 / yr</p>
                  <span className="text-[10px] text-[#7C8493] font-medium mt-0.5 inline-block">
                    Top Tier Tech Tier
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F8F9FC] border border-[#E9ECF2]/70">
                  <span className="text-[11px] font-bold text-[#7C8493] block">Applicants Received</span>
                  <p className="text-xl font-extrabold text-[#25324B] mt-0.5">342 Candidates</p>
                  <span className="text-[10px] text-blue-600 font-bold mt-0.5 inline-block">
                    +18 this week
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F8F9FC] border border-[#E9ECF2]/70">
                  <span className="text-[11px] font-bold text-[#7C8493] block">Interview Response</span>
                  <p className="text-xl font-extrabold text-[#25324B] mt-0.5">2 - 4 Days</p>
                  <span className="text-[10px] text-emerald-600 font-bold mt-0.5 inline-block">
                    High Response Rate
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-[#E9ECF2] overflow-x-auto pb-0.5 select-none scrollbar-none">
            {[
              { id: 'overview', label: 'Overview & About', icon: Building2 },
              {
                id: 'jobs',
                label: `Open Positions (${rawJobs.length})`,
                icon: Briefcase,
              },
              { id: 'perks', label: 'Culture & Benefits', icon: HeartPulse },
              { id: 'tech', label: 'Tech Stack & Tools', icon: Laptop },
              { id: 'offices', label: 'Offices & Locations', icon: MapPin },
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

          {/* 5. Main Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 8 Columns: Dynamic Tab Content */}
            <div className="lg:col-span-8 space-y-6">
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6 animate-fadeIn">
                  {/* About the Company */}
                  <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
                    <h3 className="text-base sm:text-lg font-extrabold text-[#25324B] tracking-tight">
                      About {company.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#515B6F] leading-relaxed">
                      {company.description}
                    </p>
                    <p className="text-xs sm:text-sm text-[#515B6F] leading-relaxed">
                      At {company.name}, our mission is to deliver groundbreaking products and empower our global customers through world-class engineering, continuous innovation, and an inclusive workplace culture.
                    </p>

                    {/* Quick Facts Grid */}
                    <div className="pt-4 border-t border-[#F0F2F6]">
                      <h4 className="text-xs font-bold text-[#7C8493] uppercase tracking-wider mb-3">
                        Company Snapshot
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 bg-[#F8F9FC] rounded-xl">
                          <span className="text-[#7C8493] font-medium block">Executive Leader (CEO):</span>
                          <span className="font-bold text-[#25324B] mt-0.5 block">{enriched?.ceo}</span>
                        </div>
                        <div className="p-3 bg-[#F8F9FC] rounded-xl">
                          <span className="text-[#7C8493] font-medium block">Founded:</span>
                          <span className="font-bold text-[#25324B] mt-0.5 block">{enriched?.founded}</span>
                        </div>
                        <div className="p-3 bg-[#F8F9FC] rounded-xl">
                          <span className="text-[#7C8493] font-medium block">Company Ownership:</span>
                          <span className="font-bold text-[#25324B] mt-0.5 block">{enriched?.type}</span>
                        </div>
                        <div className="p-3 bg-[#F8F9FC] rounded-xl">
                          <span className="text-[#7C8493] font-medium block">Headquarters:</span>
                          <span className="font-bold text-[#25324B] mt-0.5 block">{company.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Core Values */}
                  <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
                    <h3 className="text-base sm:text-lg font-extrabold text-[#25324B] tracking-tight">
                      Core Values & Work Culture
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-[#F8F9FC] border border-[#E9ECF2]/60">
                        <span className="font-extrabold text-[#25324B] text-sm block mb-1">
                          🚀 Innovation First
                        </span>
                        <p className="text-xs text-[#515B6F] leading-relaxed">
                          We encourage creative experimentation, rapid prototyping, and taking bold calculated bets to solve meaningful problems.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#F8F9FC] border border-[#E9ECF2]/60">
                        <span className="font-extrabold text-[#25324B] text-sm block mb-1">
                          🤝 Customer Obsession
                        </span>
                        <p className="text-xs text-[#515B6F] leading-relaxed">
                          Every decision we make starts with understanding and exceeding the expectations of the users and businesses we serve.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#F8F9FC] border border-[#E9ECF2]/60">
                        <span className="font-extrabold text-[#25324B] text-sm block mb-1">
                          🌱 Diversity & Inclusion
                        </span>
                        <p className="text-xs text-[#515B6F] leading-relaxed">
                          Diverse teams build better products. We are committed to fostering an equitable environment where every voice is valued.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#F8F9FC] border border-[#E9ECF2]/60">
                        <span className="font-extrabold text-[#25324B] text-sm block mb-1">
                          ⚡ Integrity & Transparency
                        </span>
                        <p className="text-xs text-[#515B6F] leading-relaxed">
                          We champion open communication, high ethical standards, and accountability across every level of our organization.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: OPEN POSITIONS */}
              {activeTab === 'jobs' && (
                <div className="space-y-4 animate-fadeIn">
                  {/* Job Filters Toolbar */}
                  <div className="bg-white rounded-2xl p-4 border border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-2xs">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-[#7C8493] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={jobSearch}
                        onChange={(e) => setJobSearch(e.target.value)}
                        placeholder={`Search roles at ${company.name}...`}
                        className="w-full bg-[#F8F9FC] text-xs font-medium rounded-xl border border-[#E9ECF2] pl-9 pr-3 py-2 outline-none focus:border-[#25324B] text-[#25324B]"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={selectedDept}
                        onChange={(e) => setSelectedDept(e.target.value)}
                        className="bg-[#F8F9FC] text-xs font-bold text-[#25324B] border border-[#E9ECF2] rounded-xl px-3 py-2 outline-none cursor-pointer"
                      >
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Jobs List */}
                  {filteredJobs.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
                      <Briefcase className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <h4 className="font-bold text-[#25324B] text-sm">No Openings Found</h4>
                      <p className="text-xs text-[#7C8493] mt-1">
                        Try modifying your search query or department filter.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      {filteredJobs.map((job) => {
                        const isSaved = Boolean(savedJobs[job.id]);
                        const isApplied = Boolean(appliedJobs[job.id]);

                        return (
                          <div
                            key={job.id}
                            className="bg-white rounded-2xl p-5 border border-gray-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-[#CCD5E4] hover:shadow-xs transition-all flex flex-col justify-between"
                          >
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="text-sm sm:text-base font-extrabold text-[#25324B]">
                                    {job.title}
                                  </h4>
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                                    {job.dept}
                                  </span>
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                                    {job.workplace}
                                  </span>
                                </div>

                                <div className="flex items-center gap-3 text-xs text-[#7C8493] mt-1.5 flex-wrap">
                                  <span className="flex items-center gap-1 font-bold text-[#25324B]">
                                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>{job.salary}</span>
                                  </span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span>{job.location}</span>
                                  </span>
                                  <span>•</span>
                                  <span>{job.exp}</span>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleToggleSaveJob(job.id)}
                                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                                  isSaved
                                    ? 'bg-amber-50 text-amber-600 border-amber-200'
                                    : 'border-[#E9ECF2] text-[#7C8493] hover:text-[#25324B]'
                                }`}
                                title={isSaved ? 'Remove Bookmark' : 'Save Job'}
                              >
                                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                              </button>
                            </div>

                            {/* Skills tags */}
                            <div className="flex items-center gap-1.5 flex-wrap my-2">
                              {job.skills.map((skill) => (
                                <span
                                  key={skill}
                                  className="px-2.5 py-0.5 rounded-md bg-[#F0F3F8] text-[#25324B] text-[10px] font-bold"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>

                            {/* Bottom row: Posted date & Apply Button */}
                            <div className="pt-3 border-t border-[#F8F9FC] flex items-center justify-between text-xs">
                              <span className="text-[#7C8493]">
                                Posted {job.posted} • {job.applicants} applicants
                              </span>

                              <button
                                type="button"
                                onClick={() => handleApplyJob(job)}
                                disabled={isApplied}
                                className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                  isApplied
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                                    : 'bg-[#25324B] text-white hover:bg-[#1C2638] shadow-2xs'
                                }`}
                              >
                                {isApplied ? (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Applied</span>
                                  </>
                                ) : (
                                  <>
                                    <Send className="w-3.5 h-3.5" />
                                    <span>Quick Apply</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: CULTURE & BENEFITS */}
              {activeTab === 'perks' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                    <h3 className="text-base sm:text-lg font-extrabold text-[#25324B] tracking-tight mb-2">
                      Perks & Employee Benefits
                    </h3>
                    <p className="text-xs sm:text-sm text-[#7C8493] mb-6">
                      {company.name} provides industry-leading compensation, total rewards, and comprehensive support for your life, health, and family.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {enriched?.perks?.map((perk, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-2xl bg-[#F8F9FC] border border-[#E9ECF2]/70 flex items-start gap-3.5 hover:border-[#CCD5E4] transition-colors"
                        >
                          <div className="w-10 h-10 rounded-xl bg-white border border-[#E9ECF2] shadow-2xs flex items-center justify-center flex-shrink-0">
                            {renderPerkIcon(perk.icon)}
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-extrabold text-[#25324B]">
                              {perk.title}
                            </h4>
                            <p className="text-xs text-[#515B6F] mt-1 leading-relaxed">
                              {perk.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: TECH STACK */}
              {activeTab === 'tech' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
                    <h3 className="text-base sm:text-lg font-extrabold text-[#25324B] tracking-tight">
                      Technology Stack & Tooling
                    </h3>
                    <p className="text-xs sm:text-sm text-[#7C8493]">
                      Primary technologies, frameworks, and cloud infrastructure leveraged by engineering teams at {company.name}.
                    </p>

                    <div className="flex flex-wrap gap-2.5 pt-2">
                      {enriched?.techStacks?.map((tech) => (
                        <div
                          key={tech}
                          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F8F9FC] border border-[#E9ECF2] text-xs font-bold text-[#25324B] hover:border-[#25324B] transition-colors"
                        >
                          <span className="w-2 h-2 rounded-full bg-blue-500" />
                          <span>{tech}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: OFFICES & LOCATIONS */}
              {activeTab === 'offices' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
                    <h3 className="text-base sm:text-lg font-extrabold text-[#25324B] tracking-tight">
                      Office Locations & Hubs
                    </h3>
                    <p className="text-xs sm:text-sm text-[#7C8493]">
                      Explore {company.name}'s global offices and regional technology centers.
                    </p>

                    <div className="space-y-3.5 pt-2">
                      {enriched?.officeLocations?.map((loc, i) => (
                        <div
                          key={i}
                          className="p-4 rounded-2xl bg-[#F8F9FC] border border-[#E9ECF2] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white border border-[#E9ECF2] flex items-center justify-center text-[#25324B] shadow-2xs flex-shrink-0">
                              <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-extrabold text-sm text-[#25324B]">
                                  {loc.city}
                                </h4>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                                  {loc.type}
                                </span>
                              </div>
                              <p className="text-xs text-[#7C8493] mt-0.5">{loc.address}</p>
                              <span className="text-[11px] text-[#25324B] font-medium block mt-1">
                                {loc.phone}
                              </span>
                            </div>
                          </div>

                          <div className="text-left sm:text-right flex-shrink-0">
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white border border-[#E9ECF2] text-[#25324B]">
                              {loc.activeJobs} Open Roles
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right 4 Columns: Recruiter in Charge & Similar Companies */}
            <div className="lg:col-span-4 space-y-6">
              {/* Recruiter In Charge Card */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[#7C8493] uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Lead Hiring Recruiter</span>
                </div>

                <div className="flex items-center gap-3.5 p-3.5 bg-[#F8F9FC] rounded-2xl border border-[#E9ECF2]">
                  <div className="w-11 h-11 rounded-full bg-[#25324B] text-white flex items-center justify-center font-extrabold text-sm flex-shrink-0 shadow-sm">
                    {displayInitial}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-sm text-[#25324B] truncate">
                      {displayName}
                    </h4>
                    <span className="text-xs text-[#7C8493] font-medium block truncate">
                      Lead Talent Acquisition Partner
                    </span>
                    <span className="text-[11px] text-blue-600 font-semibold block mt-0.5 truncate">
                      recruiter@jobportal.com
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toast.success(`Direct recruiter messaging opened for ${displayName}.`)}
                  className="w-full py-2.5 rounded-xl bg-[#25324B] hover:bg-[#1C2638] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  Contact Recruiter
                </button>
              </div>

              {/* Contact Information Card */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3.5">
                <h4 className="font-extrabold text-sm text-[#25324B]">
                  Direct Contact & Support
                </h4>

                <div className="space-y-2.5 text-xs text-[#7C8493]">
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-[#25324B]" />
                    <span className="text-[#25324B] font-bold">{company.email || 'careers@company.com'}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-[#25324B]" />
                    <span className="text-[#25324B] font-bold">{company.website}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-[#25324B]" />
                    <span>{company.location}</span>
                  </div>
                </div>
              </div>

              {/* Similar Industry Companies */}
              {similarCompanies.length > 0 && (
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-sm text-[#25324B]">
                      Similar in {company.industry}
                    </h4>
                    <Link
                      to="/companies"
                      className="text-xs font-bold text-[#25324B] hover:underline"
                    >
                      View All
                    </Link>
                  </div>

                  <div className="space-y-2.5">
                    {similarCompanies.map((sim) => (
                      <div
                        key={sim.id}
                        onClick={() => navigate(`/companies/${sim.id}`)}
                        className="p-3 rounded-2xl border border-gray-100 hover:border-[#CCD5E4] hover:bg-[#F8F9FC] transition-all cursor-pointer flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-xl border border-[#E9ECF2] p-1 flex items-center justify-center bg-white flex-shrink-0">
                            {sim.logo ? (
                              <img
                                src={sim.logo}
                                alt={sim.name}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <span className="font-bold text-xs">{sim.name.charAt(0)}</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <h5 className="font-bold text-xs text-[#25324B] truncate group-hover:text-black">
                              {sim.name}
                            </h5>
                            <span className="text-[10px] text-[#7C8493] truncate block">
                              {sim.location}
                            </span>
                          </div>
                        </div>

                        <span className="text-[11px] font-bold text-[#25324B] px-2 py-0.5 rounded-md bg-[#F0F3F8]">
                          {sim.openJobs || 12} roles
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

      {/* Edit Company Modal */}
      <AddEditCompanyModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmitCompany={handleUpdate}
        initialData={company}
      />

      {/* Delete Confirmation Modal */}
      <DeleteCompanyModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        company={company}
      />
    </div>
  );
};
