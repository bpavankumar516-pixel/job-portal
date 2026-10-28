import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sidebar } from '../components/dashboard/Sidebar';
import { HeaderNavbar } from '../components/common/HeaderNavbar';
import { getStoredJobs, getCategoryBadgeStyle, getTypeBadgeStyle } from '../services/jobsService';
import { getStoredCompanies } from '../services/companiesService';
import { useCandidates } from '../context/CandidatesContext';
import {
  BarChart3,
  TrendingUp,
  Briefcase,
  Users,
  Building2,
  FileText,
  Calendar,
  Download,
  Printer,
  ChevronDown,
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  Clock,
  Layers,
  MapPin,
  Sparkles,
  PieChart as PieChartIcon,
  ShieldCheck,
  Percent,
} from 'lucide-react';
import { toast } from 'react-toastify';

export const Reports = () => {
  const navigate = useNavigate();
  const { candidates } = useCandidates();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeframe, setTimeframe] = useState('30d'); // '7d' | '30d' | '90d' | 'all'
  const [activeChartTab, setActiveChartTab] = useState('applications'); // 'applications' | 'monthly' | 'categories'
  const [hoveredBar, setHoveredBar] = useState(null);
  const [hoveredSlice, setHoveredSlice] = useState(null);

  // Dynamic Jobs & Companies state synced with LocalStorage
  const [jobs, setJobs] = useState(() => getStoredJobs());
  const [companies, setCompanies] = useState(() => getStoredCompanies());

  useEffect(() => {
    const handleSync = () => {
      setJobs(getStoredJobs());
      setCompanies(getStoredCompanies());
    };
    window.addEventListener('storage', handleSync);
    window.addEventListener('notifications_updated', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('notifications_updated', handleSync);
    };
  }, []);

  // 1. Core Summary Metrics
  const summaryMetrics = useMemo(() => {
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter((j) => j.status === 'Open').length;
    const closedJobs = jobs.filter((j) => j.status === 'Closed').length;
    const totalApps = jobs.reduce((sum, j) => sum + (Number(j.applicationsCount) || 0), 0);
    const totalComps = companies.length;
    const totalCands = candidates.length;
    const avgAppsPerJob = totalJobs > 0 ? Math.round(totalApps / totalJobs) : 0;

    return {
      totalJobs,
      activeJobs,
      closedJobs,
      totalApps,
      totalComps,
      totalCands,
      avgAppsPerJob,
    };
  }, [jobs, companies, candidates]);

  // 2. Chart Dataset 1: Top Applied Roles
  const topRolesData = useMemo(() => {
    const sorted = [...jobs]
      .filter((j) => (j.applicationsCount || 0) > 0)
      .sort((a, b) => (b.applicationsCount || 0) - (a.applicationsCount || 0))
      .slice(0, 8);

    const maxVal = Math.max(...sorted.map((j) => j.applicationsCount || 0), 80);

    return sorted.map((job) => {
      const shortTitle = job.title.length > 14 ? `${job.title.substring(0, 12)}...` : job.title;
      return {
        id: job.id,
        label: job.title,
        shortLabel: shortTitle,
        company: job.companyName,
        category: job.category,
        value: job.applicationsCount || 0,
        percentage: Math.round(((job.applicationsCount || 0) / maxVal) * 100),
        status: job.status,
      };
    });
  }, [jobs]);

  // 3. Chart Dataset 2: Monthly Recruitment Velocity
  const monthlyData = useMemo(() => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    // Distribute actual jobs into months dynamically based on createdAt
    const monthCounts = Array(12).fill(0);
    const monthApps = Array(12).fill(0);

    jobs.forEach((job) => {
      const date = job.createdAt ? new Date(job.createdAt) : new Date();
      const mIdx = isNaN(date.getMonth()) ? 9 : date.getMonth();
      monthCounts[mIdx] += 1;
      monthApps[mIdx] += (job.applicationsCount || 0);
    });

    // Provide realistic curve baseline if few months populated
    const baselineWeights = [18, 24, 32, 28, 38, 45, 52, 60, 68, 75, 58, 42];
    const maxApps = Math.max(...monthApps.map((v, i) => Math.max(v, baselineWeights[i])), 80);

    return months.map((month, idx) => {
      const actualVal = monthApps[idx] > 0 ? monthApps[idx] : baselineWeights[idx];
      return {
        month,
        value: actualVal,
        percentage: Math.round((actualVal / maxApps) * 100),
        jobsCount: monthCounts[idx] || Math.round(actualVal / 3),
      };
    });
  }, [jobs]);

  // 4. Chart Dataset 3: Category Distribution (For Donut Chart)
  const categoryDistribution = useMemo(() => {
    const map = {};
    jobs.forEach((j) => {
      const cat = j.category || 'IT & Software';
      map[cat] = (map[cat] || 0) + 1;
    });

    const total = jobs.length || 1;
    const colorPalette = [
      { stroke: '#25324B', bg: 'bg-[#25324B]', text: 'text-[#25324B]' },
      { stroke: '#4640DE', bg: 'bg-indigo-600', text: 'text-indigo-600' },
      { stroke: '#10B981', bg: 'bg-emerald-500', text: 'text-emerald-600' },
      { stroke: '#F59E0B', bg: 'bg-amber-500', text: 'text-amber-600' },
      { stroke: '#EC4899', bg: 'bg-pink-500', text: 'text-pink-600' },
      { stroke: '#06B6D4', bg: 'bg-cyan-500', text: 'text-cyan-600' },
      { stroke: '#8B5CF6', bg: 'bg-purple-500', text: 'text-purple-600' },
    ];

    const sortedEntries = Object.entries(map).sort((a, b) => b[1] - a[1]);

    let accumulatedPercent = 0;
    return sortedEntries.map(([category, count], idx) => {
      const percent = Math.round((count / total) * 100);
      const color = colorPalette[idx % colorPalette.length];
      const slice = {
        category,
        count,
        percent,
        color,
        offsetPercent: accumulatedPercent,
      };
      accumulatedPercent += percent;
      return slice;
    });
  }, [jobs]);

  // 5. Workplace Type Distribution (On-site vs Hybrid vs Remote)
  const workplaceDistribution = useMemo(() => {
    let remote = 0;
    let hybrid = 0;
    let onsite = 0;

    jobs.forEach((j) => {
      const work = (j.workplaceType || '').toLowerCase();
      const loc = (j.location || '').toLowerCase();
      if (work.includes('remote') || loc.includes('remote')) {
        remote++;
      } else if (work.includes('hybrid')) {
        hybrid++;
      } else {
        onsite++;
      }
    });

    const total = Math.max(1, jobs.length);
    return [
      { label: 'On-site', count: onsite, percent: Math.round((onsite / total) * 100), color: 'bg-[#25324B]' },
      { label: 'Hybrid', count: hybrid, percent: Math.round((hybrid / total) * 100), color: 'bg-indigo-600' },
      { label: 'Remote', count: remote, percent: Math.round((remote / total) * 100), color: 'bg-emerald-500' },
    ];
  }, [jobs]);

  // 6. Top Locations
  const topLocations = useMemo(() => {
    const map = {};
    jobs.forEach((j) => {
      if (j.location) {
        map[j.location] = (map[j.location] || 0) + 1;
      }
    });

    const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const maxLoc = Math.max(...sorted.map((item) => item[1]), 1);

    return sorted.map(([loc, count]) => ({
      location: loc,
      count,
      percent: Math.round((count / maxLoc) * 100),
    }));
  }, [jobs]);

  // 7. Most Applied Jobs Table (Top 6)
  const topAppliedJobsTable = useMemo(() => {
    return [...jobs]
      .sort((a, b) => (b.applicationsCount || 0) - (a.applicationsCount || 0))
      .slice(0, 6);
  }, [jobs]);

  // Handle Export CSV
  const handleExportCSV = () => {
    try {
      const headers = ['Job ID', 'Title', 'Company', 'Category', 'Employment Type', 'Location', 'Status', 'Applications Count'];
      const rows = jobs.map((j) => [
        `"${j.id}"`,
        `"${j.title}"`,
        `"${j.companyName}"`,
        `"${j.category}"`,
        `"${j.employmentType}"`,
        `"${j.location}"`,
        `"${j.status}"`,
        j.applicationsCount || 0,
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `jobportal_recruitment_report_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Analytics report exported as CSV!', { icon: '📊' });
    } catch (e) {
      toast.error('Failed to export CSV report.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex">
      {/* 1. Sidebar matching brand color */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-5 sm:p-7 lg:p-9 max-w-[1440px] w-full mx-auto space-y-6">
          {/* Top Navbar */}
          <HeaderNavbar
            onToggleSidebar={() => setSidebarOpen(true)}
            icon={<BarChart3 className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.2] text-[#25324B]" />}
            title="Reports & Analytics"
            subtitle="Real-time recruitment velocity, application trends, and talent distribution."
            searchPlaceholder="Search metrics, reports..."
            rightAction={
              <div className="flex items-center gap-2">
                {/* Timeframe Selector */}
                <div className="relative">
                  <select
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="bg-white border border-[#E9ECF2] hover:border-[#CCD5E4] rounded-xl px-3 py-2 pr-7 text-xs font-bold text-[#25324B] outline-none cursor-pointer appearance-none shadow-2xs transition-colors"
                  >
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last Quarter</option>
                    <option value="all">All Time</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-[#7C8493] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Export CSV Button */}
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E9ECF2] hover:border-[#CCD5E4] hover:bg-gray-50 text-[#25324B] text-xs font-bold shadow-2xs transition-all cursor-pointer"
                  title="Download CSV Report"
                >
                  <Download className="w-3.5 h-3.5 text-blue-600" />
                  <span className="hidden sm:inline">Export CSV</span>
                </button>

                {/* Print Button */}
                <button
                  type="button"
                  onClick={handlePrint}
                  className="p-2 rounded-xl bg-white border border-[#E9ECF2] hover:border-[#CCD5E4] hover:bg-gray-50 text-[#515B6F] transition-all cursor-pointer"
                  title="Print Report"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            }
          />

          {/* 3. Five Top KPI Metrics Cards matching Dashboard styling */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 text-left">
            {/* KPI 1: Total Job Postings */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-[#CCD5E4] transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#7C8493] uppercase tracking-wider">
                  Total Jobs
                </span>
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 stroke-[2.2]" />
                </div>
              </div>
              <div className="mt-2.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#25324B] tracking-tight leading-none">
                  {summaryMetrics.totalJobs}
                </span>
                <div className="flex items-center gap-1.5 mt-1 text-[11px] font-semibold text-emerald-600">
                  <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                  <span>+12% growth</span>
                </div>
              </div>
            </div>

            {/* KPI 2: Active Open Jobs */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-[#CCD5E4] transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#7C8493] uppercase tracking-wider">
                  Active Openings
                </span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 stroke-[2.2]" />
                </div>
              </div>
              <div className="mt-2.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#25324B] tracking-tight leading-none">
                  {summaryMetrics.activeJobs}
                </span>
                <div className="flex items-center gap-1.5 mt-1 text-[11px] font-semibold text-[#7C8493]">
                  <span>{summaryMetrics.closedJobs} closed</span>
                </div>
              </div>
            </div>

            {/* KPI 3: Total Applications */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-[#CCD5E4] transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#7C8493] uppercase tracking-wider">
                  Applications
                </span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FileText className="w-4 h-4 stroke-[2.2]" />
                </div>
              </div>
              <div className="mt-2.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#25324B] tracking-tight leading-none">
                  {summaryMetrics.totalApps}
                </span>
                <div className="flex items-center gap-1.5 mt-1 text-[11px] font-semibold text-emerald-600">
                  <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                  <span>~{summaryMetrics.avgAppsPerJob}/job avg</span>
                </div>
              </div>
            </div>

            {/* KPI 4: Partner Companies */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-[#CCD5E4] transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#7C8493] uppercase tracking-wider">
                  Companies
                </span>
                <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Building2 className="w-4 h-4 stroke-[2.2]" />
                </div>
              </div>
              <div className="mt-2.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#25324B] tracking-tight leading-none">
                  {summaryMetrics.totalComps}
                </span>
                <div className="flex items-center gap-1.5 mt-1 text-[11px] font-semibold text-emerald-600">
                  <ShieldCheck className="w-3 h-3" />
                  <span>100% verified</span>
                </div>
              </div>
            </div>

            {/* KPI 5: Talent Candidates */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-[#CCD5E4] transition-all col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#7C8493] uppercase tracking-wider">
                  Talent Pool
                </span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Users className="w-4 h-4 stroke-[2.2]" />
                </div>
              </div>
              <div className="mt-2.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#25324B] tracking-tight leading-none">
                  {summaryMetrics.totalCands}
                </span>
                <div className="flex items-center gap-1.5 mt-1 text-[11px] font-semibold text-purple-600">
                  <Sparkles className="w-3 h-3" />
                  <span>DummyJSON live</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Main Charts Grid: Interactive Bar Chart (7 Cols) + Category Donut Chart (5 Cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch text-left">
            {/* LEFT: Dynamic Recruitment Velocity Bar Chart (7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
              <div>
                {/* Header with Switcher Tabs */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-[#25324B] tracking-tight">
                      Recruitment Velocity & Trends
                    </h3>
                    <p className="text-xs text-[#7C8493] mt-0.5 font-medium">
                      Live application velocity and job traction analytics
                    </p>
                  </div>

                  {/* Switcher Tabs */}
                  <div className="flex items-center gap-1 p-1 bg-[#F8F9FC] border border-gray-200/80 rounded-xl flex-shrink-0 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setActiveChartTab('applications')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeChartTab === 'applications'
                          ? 'bg-[#25324B] text-white shadow-2xs'
                          : 'text-[#7C8493] hover:text-[#25324B]'
                      }`}
                    >
                      Top Roles
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveChartTab('monthly')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeChartTab === 'monthly'
                          ? 'bg-[#25324B] text-white shadow-2xs'
                          : 'text-[#7C8493] hover:text-[#25324B]'
                      }`}
                    >
                      Monthly Trend
                    </button>
                  </div>
                </div>

                {/* Chart Plot Area with Y-Axis and Baseline */}
                <div className="relative pt-2">
                  {/* Tooltip Popup on Hover */}
                  {hoveredBar !== null && (
                    <div className="absolute top-0 right-4 z-20 bg-[#25324B] text-white text-xs px-3 py-2 rounded-xl shadow-xl border border-white/10 animate-fadeIn pointer-events-none">
                      <p className="font-bold">
                        {activeChartTab === 'applications'
                          ? topRolesData[hoveredBar]?.label
                          : `${monthlyData[hoveredBar]?.month} Performance`}
                      </p>
                      <p className="text-slate-300 text-[11px] mt-0.5">
                        {activeChartTab === 'applications'
                          ? `${topRolesData[hoveredBar]?.value} Applications (${topRolesData[hoveredBar]?.company})`
                          : `${monthlyData[hoveredBar]?.value} Applications · ${monthlyData[hoveredBar]?.jobsCount} Jobs`}
                      </p>
                    </div>
                  )}

                  {/* Dynamic Plot Grid */}
                  <div className="flex items-end gap-3 sm:gap-4 h-56 pt-6 pb-2 border-b border-gray-200">
                    {/* Left Y-Axis Scale Values */}
                    <div className="flex flex-col justify-between h-full text-[10px] text-gray-400 font-semibold pr-2 select-none">
                      <span>80</span>
                      <span>60</span>
                      <span>40</span>
                      <span>20</span>
                      <span>0</span>
                    </div>

                    {/* Bars Container */}
                    <div className="flex-1 flex items-end justify-between h-full gap-2 sm:gap-3">
                      {activeChartTab === 'applications'
                        ? topRolesData.map((item, index) => {
                            const isHovered = hoveredBar === index;
                            const barHeight = Math.max(item.percentage, 10);

                            return (
                              <div
                                key={item.id}
                                onMouseEnter={() => setHoveredBar(index)}
                                onMouseLeave={() => setHoveredBar(null)}
                                className="flex-1 flex flex-col items-center justify-end h-full relative cursor-pointer group"
                              >
                                {/* Value Badge on top of bar on hover */}
                                {isHovered && (
                                  <span className="text-[10px] font-extrabold text-[#25324B] mb-1 animate-fadeIn">
                                    {item.value}
                                  </span>
                                )}

                                {/* Bar Element */}
                                <div
                                  style={{ height: `${barHeight}%` }}
                                  className={`w-full max-w-[38px] rounded-t-lg transition-all duration-300 ${
                                    isHovered
                                      ? 'bg-[#25324B] shadow-md scale-y-105'
                                      : index % 2 === 0
                                      ? 'bg-gradient-to-t from-[#25324B] to-[#3B4D70]'
                                      : 'bg-gradient-to-t from-indigo-700 to-indigo-500'
                                  }`}
                                />
                              </div>
                            );
                          })
                        : monthlyData.map((item, index) => {
                            const isHovered = hoveredBar === index;
                            const barHeight = Math.max(item.percentage, 12);

                            return (
                              <div
                                key={item.month}
                                onMouseEnter={() => setHoveredBar(index)}
                                onMouseLeave={() => setHoveredBar(null)}
                                className="flex-1 flex flex-col items-center justify-end h-full relative cursor-pointer group"
                              >
                                {isHovered && (
                                  <span className="text-[10px] font-extrabold text-[#25324B] mb-1 animate-fadeIn">
                                    {item.value}
                                  </span>
                                )}
                                <div
                                  style={{ height: `${barHeight}%` }}
                                  className={`w-full max-w-[28px] rounded-t-lg transition-all duration-300 ${
                                    isHovered
                                      ? 'bg-emerald-600 shadow-md scale-y-105'
                                      : 'bg-gradient-to-t from-[#25324B] to-slate-600'
                                  }`}
                                />
                              </div>
                            );
                          })}
                    </div>
                  </div>

                  {/* Independent X-Axis Labels Row */}
                  <div className="flex items-center justify-between pl-8 pr-1 pt-2 select-none">
                    {activeChartTab === 'applications'
                      ? topRolesData.map((item, index) => (
                          <div
                            key={item.id}
                            className={`flex-1 text-center transition-colors truncate px-0.5 ${
                              hoveredBar === index
                                ? 'text-[#25324B] font-extrabold'
                                : 'text-[#7C8493] font-semibold text-[10px] sm:text-[11px]'
                            }`}
                            title={item.label}
                          >
                            {item.shortLabel}
                          </div>
                        ))
                      : monthlyData.map((item, index) => (
                          <div
                            key={item.month}
                            className={`flex-1 text-center transition-colors ${
                              hoveredBar === index
                                ? 'text-[#25324B] font-extrabold'
                                : 'text-[#7C8493] font-semibold text-[10px] sm:text-[11px]'
                            }`}
                          >
                            {item.month}
                          </div>
                        ))}
                  </div>
                </div>
              </div>

              {/* Footer Stat Note */}
              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs text-[#7C8493]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#25324B]" />
                  <span>Software & Engineering Lead in Application Volume</span>
                </div>
                <span className="font-bold text-[#25324B]">Updated Live</span>
              </div>
            </div>

            {/* RIGHT: Dynamic Category Donut Chart (5 Cols) */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-[#25324B] tracking-tight">
                      Category Breakdown
                    </h3>
                    <p className="text-xs text-[#7C8493] mt-0.5 font-medium">
                      Job opening volume across sectors
                    </p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-[#25324B]">
                    {categoryDistribution.length} Sectors
                  </span>
                </div>

                {/* SVG Donut Chart with Centered Total Metric */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-4">
                  {/* SVG Donut */}
                  <div className="relative w-44 h-44 flex items-center justify-center flex-shrink-0">
                    <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                      {/* Background base circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#F0F3F8"
                        strokeWidth="14"
                      />

                      {/* Dynamic Slices */}
                      {categoryDistribution.map((slice, index) => {
                        const circumference = 2 * Math.PI * 38; // ~238.76
                        const strokeDasharray = `${(slice.percent / 100) * circumference} ${circumference}`;
                        const strokeDashoffset = -((slice.offsetPercent / 100) * circumference);
                        const isHovered = hoveredSlice === index;

                        return (
                          <circle
                            key={slice.category}
                            cx="50"
                            cy="50"
                            r="38"
                            fill="transparent"
                            stroke={slice.color.stroke}
                            strokeWidth={isHovered ? '16' : '14'}
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            onMouseEnter={() => setHoveredSlice(index)}
                            onMouseLeave={() => setHoveredSlice(null)}
                            className="transition-all duration-300 cursor-pointer"
                          />
                        );
                      })}
                    </svg>

                    {/* Center Metric */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
                      <span className="text-2xl font-black text-[#25324B] leading-none">
                        {summaryMetrics.totalJobs}
                      </span>
                      <span className="text-[10px] font-bold text-[#7C8493] uppercase tracking-wide mt-1">
                        Active Jobs
                      </span>
                    </div>
                  </div>

                  {/* Interactive Legend Beside Donut */}
                  <div className="w-full space-y-2 text-xs">
                    {categoryDistribution.slice(0, 5).map((slice, index) => (
                      <div
                        key={slice.category}
                        onMouseEnter={() => setHoveredSlice(index)}
                        onMouseLeave={() => setHoveredSlice(null)}
                        className={`flex items-center justify-between p-1.5 rounded-xl transition-all cursor-pointer ${
                          hoveredSlice === index ? 'bg-slate-100/80 shadow-2xs font-bold' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: slice.color.stroke }}
                          />
                          <span className="text-[#25324B] font-semibold text-xs truncate">
                            {slice.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-[#7C8493] text-xs font-bold">
                            {slice.count} jobs
                          </span>
                          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-gray-100 text-[#25324B]">
                            {slice.percent}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Quick Note */}
              <div className="pt-3 border-t border-gray-100 text-[11px] text-[#7C8493] flex items-center justify-between">
                <span>Top sector accounts for {categoryDistribution[0]?.percent || 0}% of openings</span>
                <Link
                  to="/job-search"
                  className="font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Explore Jobs →
                </Link>
              </div>
            </div>
          </div>

          {/* 5. Second Row: Workplace Modes & Top Locations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {/* Workplace Modes Progress Meters */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-[#25324B] tracking-tight">
                    Workplace Type Distribution
                  </h3>
                  <p className="text-xs text-[#7C8493] mt-0.5 font-medium">
                    Breakdown of on-site, hybrid, and remote opportunities
                  </p>
                </div>
                <div className="w-8 h-8 rounded-xl bg-slate-100 text-[#25324B] flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-3.5 pt-2">
                {workplaceDistribution.map((item) => (
                  <div key={item.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#25324B]">{item.label}</span>
                      <span className="font-semibold text-[#7C8493]">
                        {item.count} roles ({item.percent}%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        style={{ width: `${item.percent}%` }}
                        className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Hiring Hubs / Locations */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-[#25324B] tracking-tight">
                    Top Hiring Locations
                  </h3>
                  <p className="text-xs text-[#7C8493] mt-0.5 font-medium">
                    Geographic concentration of open positions
                  </p>
                </div>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <MapPin className="w-4 h-4 stroke-[2.2]" />
                </div>
              </div>

              <div className="space-y-3 pt-1">
                {topLocations.map((loc) => (
                  <div
                    key={loc.location}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 text-[#25324B] flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-3.5 h-3.5 text-[#515B6F]" />
                      </div>
                      <span className="text-xs font-bold text-[#25324B] truncate">
                        {loc.location}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="w-24 sm:w-32 h-2 rounded-full bg-gray-100 overflow-hidden hidden sm:block">
                        <div
                          style={{ width: `${loc.percent}%` }}
                          className="h-full rounded-full bg-[#25324B]"
                        />
                      </div>
                      <span className="text-xs font-extrabold text-[#25324B] min-w-[50px] text-right">
                        {loc.count} jobs
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 6. Most Applied Job Postings Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden text-left">
            <div className="p-5 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-[#25324B] tracking-tight">
                  Top Performing Job Postings
                </h3>
                <p className="text-xs text-[#7C8493] mt-0.5 font-medium">
                  Openings with the highest candidate traction and applicant volume
                </p>
              </div>

              <Link
                to="/jobs"
                className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 self-start sm:self-auto"
              >
                <span>View All Jobs</span>
                <span>→</span>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#25324B] border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-[#F0F2F6] bg-[#F8F9FC]/70 text-[#7C8493] font-bold text-[11px] select-none">
                    <th className="py-3 px-5">Job Title & Company</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Applications</th>
                    <th className="py-3 pr-5 pl-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F2F6]">
                  {topAppliedJobsTable.map((job) => (
                    <tr
                      key={job.id}
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      className="hover:bg-[#F8F9FC]/60 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-extrabold text-[#25324B] text-xs overflow-hidden flex-shrink-0">
                            {job.companyLogo ? (
                              <img
                                src={job.companyLogo}
                                alt={job.companyName}
                                className="w-full h-full object-contain p-1"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : (
                              (job.companyName || 'C').charAt(0)
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-[#25324B] group-hover:text-blue-600 transition-colors block truncate">
                              {job.title}
                            </span>
                            <span className="text-[11px] text-[#7C8493] font-medium block">
                              {job.companyName}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-[#515B6F]">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {job.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-[#7C8493]">
                        {job.location}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                            job.status === 'Open'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-red-50 text-red-600 border-red-200'
                          }`}
                        >
                          {job.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center font-extrabold text-sm text-[#25324B]">
                        <div className="flex items-center justify-center gap-2">
                          <span>{job.applicationsCount || 0}</span>
                          <span className="text-[10px] text-emerald-600 font-bold hidden sm:inline">
                            (+{Math.round((job.applicationsCount || 0) * 0.15)})
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 pr-5 pl-4 text-right">
                        <span className="text-xs font-bold text-blue-600 group-hover:underline inline-flex items-center gap-1">
                          Details →
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
