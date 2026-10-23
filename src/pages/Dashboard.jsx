import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/dashboard/Sidebar';
import { StatCard } from '../components/dashboard/StatCard';
import { QuickActions } from '../components/dashboard/QuickActions';
import { DashboardCharts } from '../components/dashboard/DashboardCharts';
import { RecentActivities } from '../components/dashboard/RecentActivities';
import { TopCompanies } from '../components/dashboard/TopCompanies';
import { QuickJobModal } from '../components/dashboard/QuickJobModal';
import { getStoredCompanies } from '../services/companiesService';
import {
  Building2,
  Briefcase,
  Clock,
  User,
  FileText,
  Bookmark,
  Menu,
  ChevronDown,
  LogOut,
  Sparkles,
  Shield,
} from 'lucide-react';
import { toast } from 'react-toastify';

export const Dashboard = () => {
  const { user, role, logout, setActiveRole } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigate = useNavigate();

  // Dynamic state for stats - totalCompanies dynamically fetched from companies database
  const [stats, setStats] = useState(() => {
    const stored = getStoredCompanies();
    return {
      totalCompanies: stored?.length || 32,
      totalJobs: 436,
      activeJobs: 212,
      totalCandidates: 2846,
      totalApplications: 5319,
      savedJobs: 94,
    };
  });

  // Re-sync dynamic total companies from storage on mount
  useEffect(() => {
    const handleSync = () => {
      const stored = getStoredCompanies();
      setStats((prev) => ({
        ...prev,
        totalCompanies: stored?.length || 32,
      }));
    };

    handleSync();
    window.addEventListener('storage', handleSync);
    return () => window.removeEventListener('storage', handleSync);
  }, []);

  const displayName =
    user?.fullName ||
    (role === 'candidate' ? 'Candidate' : 'Pavan Kumar');
  const displayRole = user?.role || role || 'recruiter';
  const displayInitial = displayName.charAt(0).toUpperCase();

  const handleJobCreated = (newJob) => {
    setStats((prev) => ({
      ...prev,
      totalJobs: prev.totalJobs + 1,
      activeJobs: prev.activeJobs + 1,
    }));
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex">
      {/* 1. Dark Slate Sidebar matching reference image */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-[1440px] w-full mx-auto space-y-6">
          {/* Header Row: Welcome Title on Left, Recruiter Pill Badge on Right */}
          <div className="flex items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Hamburger */}
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl text-[#25324B] hover:bg-white transition-colors cursor-pointer"
                aria-label="Open Navigation"
              >
                <Menu className="w-5 h-5 stroke-[2]" />
              </button>

              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#25324B] tracking-tight">
                  Welcome back, {displayName}!
                </h1>
                <p className="text-xs sm:text-sm text-[#7C8493] mt-1 font-medium">
                  {displayRole === 'candidate'
                    ? 'Here is what is happening with your job applications today.'
                    : 'Here is what is happening with your hiring today.'}
                </p>
              </div>
            </div>

            {/* Real-time Interactive Profile Dropdown matching reference image */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-gray-50 border border-gray-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-xs transition-all cursor-pointer group focus:outline-none select-none"
                aria-expanded={profileDropdownOpen}
              >
                <div className="w-7 h-7 rounded-full bg-[#25324B] text-white flex items-center justify-center font-extrabold text-xs flex-shrink-0 transition-transform group-hover:scale-105">
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
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#7C8493] transition-transform duration-200 ${
                    profileDropdownOpen ? 'rotate-180 text-[#25324B]' : 'group-hover:text-[#25324B]'
                  }`}
                />
              </button>

              {/* Real-time SaaS Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-72 bg-white rounded-2xl shadow-xl border border-[#E9ECF2] p-2 z-50 animate-fadeIn text-left">
                  {/* User Profile Header Card */}
                  <div className="p-3 bg-[#F8F9FC] rounded-xl border border-[#E9ECF2]/60 mb-1.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#25324B] text-white flex items-center justify-center font-extrabold text-sm shadow-xs flex-shrink-0">
                        {displayInitial}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-extrabold text-[#25324B] truncate">
                          {displayName}
                        </span>
                        <span className="text-[11px] text-[#7C8493] truncate font-medium">
                          {user?.email || 'recruiter@jobportal.com'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Dropdown Action Items */}
                  <div className="space-y-0.5 py-1 text-xs">
                    {/* View Profile */}
                    <button
                      type="button"
                      onClick={() => {
                        toast.info(`Viewing profile for ${displayName}`);
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#515B6F] hover:text-[#25324B] hover:bg-[#F0F3F8] transition-colors font-medium cursor-pointer"
                    >
                      <User className="w-4 h-4 text-[#7C8493]" />
                      <span>My Profile & Details</span>
                    </button>

                    {/* Company Workspace */}
                    <button
                      type="button"
                      onClick={() => {
                        toast.info('Company Management (Module 3) is connected.');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#515B6F] hover:text-[#25324B] hover:bg-[#F0F3F8] transition-colors font-medium cursor-pointer"
                    >
                      <Building2 className="w-4 h-4 text-[#7C8493]" />
                      <span>TechCorp Solutions</span>
                    </button>

                    {/* Security & Local Storage */}
                    <button
                      type="button"
                      onClick={() => {
                        toast.info('Session is secured with Local Storage token.');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#515B6F] hover:text-[#25324B] hover:bg-[#F0F3F8] transition-colors font-medium cursor-pointer"
                    >
                      <Shield className="w-4 h-4 text-[#7C8493]" />
                      <span>Security & Session</span>
                    </button>
                  </div>

                  {/* Sign Out Section */}
                  <div className="pt-1.5 mt-1 border-t border-[#F0F2F6]">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors font-bold text-xs cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3. Top Row of 5 Statistics Cards matching reference image */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <StatCard
              title="Total Companies"
              value={stats.totalCompanies}
              subtitle="+12 this month"
              icon={Building2}
              onClick={() => navigate('/companies')}
            />

            <StatCard
              title="Total Jobs"
              value={stats.totalJobs}
              subtitle="+34 this month"
              icon={Briefcase}
            />

            <StatCard
              title="Active Job Postings"
              value={stats.activeJobs}
              subtitle="49% of all jobs"
              icon={Clock}
            />

            <StatCard
              title="Total Candidates"
              value={stats.totalCandidates}
              subtitle="+210 this month"
              icon={User}
            />

            <StatCard
              title="Total Applications"
              value={stats.totalApplications}
              subtitle="+480 this month"
              icon={FileText}
            />
          </div>

          {/* 4. Second Row: Saved Jobs Card on the Left */}
          <div className="w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.7rem)] lg:w-[calc(20%-0.8rem)]">
            <StatCard
              title="Saved Jobs"
              value={stats.savedJobs}
              subtitle="Across your profile"
              icon={Bookmark}
            />
          </div>

          {/* 5. Quick Actions Section (4 Dark Slate Cards) */}
          <QuickActions
            onPostJob={() => setIsPostModalOpen(true)}
            onAddCompany={() => {
              navigate('/companies');
            }}
            onReviewCandidates={() => {
              toast.info('Candidate Profile & Review (Module 6) is active.');
            }}
            onViewReports={() => {
              toast.info('Reports & Analytics (Module 8) is active.');
            }}
          />

          {/* 6. Main Dashboard Grid matching reference image: Dashboard Statistics (7 Cols) & Recent Activities (5 Cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Dashboard Statistics Bar Chart matching reference image */}
            <div className="lg:col-span-7">
              <DashboardCharts />
            </div>

            {/* Recent Activities Feed matching reference image */}
            <div className="lg:col-span-5">
              <RecentActivities />
            </div>
          </div>

          {/* 7. Top Hiring Companies Section */}
          <TopCompanies />
        </main>
      </div>

      {/* Quick Job Creation Modal */}
      <QuickJobModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onJobCreated={handleJobCreated}
      />
    </div>
  );
};
