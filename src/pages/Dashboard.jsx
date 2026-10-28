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
import { CandidateDashboard } from '../components/dashboard/CandidateDashboard';
import { getStoredCompanies } from '../services/companiesService';
import { getJobStats, getSavedJobIds } from '../services/jobsService';
import { useCandidates } from '../context/CandidatesContext';
import { HeaderNavbar } from '../components/common/HeaderNavbar';
import {
  Building2,
  Briefcase,
  Clock,
  User,
  FileText,
  Bookmark,
  LayoutDashboard,
  Menu,
  ChevronDown,
  LogOut,
  Sparkles,
  Shield,
} from 'lucide-react';
import { toast } from 'react-toastify';

export const Dashboard = () => {
  const { user, role, logout } = useAuth();

  // If logged in as Candidate, render the dedicated Candidate Dashboard
  if (role === 'candidate') {
    return <CandidateDashboard />;
  }

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const navigate = useNavigate();
  const { candidates } = useCandidates();

  // Dynamic state for stats - totalCompanies & jobs dynamically fetched
  const [stats, setStats] = useState(() => {
    const stored = getStoredCompanies();
    const jobStats = getJobStats();
    const saved = getSavedJobIds();
    return {
      totalCompanies: stored?.length || 32,
      totalJobs: jobStats.totalJobs || 24,
      activeJobs: jobStats.activeJobs || 18,
      totalCandidates: candidates.length || 30,
      totalApplications: jobStats.totalApplications || 482,
      savedJobs: saved.length || 4,
    };
  });

  // Re-sync dynamic metrics from storage on mount
  useEffect(() => {
    const handleSync = () => {
      const stored = getStoredCompanies();
      const jobStats = getJobStats();
      const saved = getSavedJobIds();
      setStats((prev) => ({
        ...prev,
        totalCompanies: stored?.length || 32,
        totalJobs: jobStats.totalJobs || 24,
        activeJobs: jobStats.activeJobs || 18,
        totalCandidates: candidates.length || 30,
        totalApplications: jobStats.totalApplications || 482,
        savedJobs: saved.length || 4,
      }));
    };

    handleSync();
    window.addEventListener('storage', handleSync);
    return () => window.removeEventListener('storage', handleSync);
  }, [candidates]);

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
          {/* Common Top Navbar with Dynamic Title matching reference image */}
          <HeaderNavbar
            onToggleSidebar={() => setSidebarOpen(true)}
            icon={<LayoutDashboard className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.2] text-[#25324B]" />}
            title={`Welcome back, ${displayName}!`}
            subtitle={
              displayRole === 'candidate'
                ? 'Here is what is happening with your job applications today.'
                : 'Here is what is happening with your hiring today.'
            }
            searchPlaceholder="Search jobs, companies..."
          />

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
              subtitle="+3 this month"
              icon={Briefcase}
              onClick={() => navigate('/jobs')}
            />

            <StatCard
              title="Active Job Postings"
              value={stats.activeJobs}
              subtitle="+2 this month"
              icon={Clock}
              onClick={() => navigate('/jobs')}
            />

            <StatCard
              title="Total Candidates"
              value={stats.totalCandidates}
              subtitle="Live Talent Pool"
              icon={User}
              onClick={() => navigate('/candidates')}
            />

            <StatCard
              title="Total Applications"
              value={stats.totalApplications}
              subtitle="Across Active Jobs"
              icon={FileText}
              onClick={() => navigate('/jobs')}
            />
          </div>

          {/* 4. Second Row: Saved Jobs Card on the Left */}
          <div className="w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.7rem)] lg:w-[calc(20%-0.8rem)]">
            <StatCard
              title="Saved Jobs"
              value={stats.savedJobs}
              subtitle="Bookmarked by you"
              icon={Bookmark}
              onClick={() => navigate('/job-search')}
            />
          </div>

          {/* 5. Quick Actions Section (4 Dark Slate Cards) */}
          <QuickActions
            onPostJob={() => setIsPostModalOpen(true)}
            onAddCompany={() => navigate('/companies')}
            onReviewCandidates={() => navigate('/candidates')}
            onViewReports={() => {
              window.scrollTo({ top: 600, behavior: 'smooth' });
              toast.info('Viewing Analytics and Statistics');
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
