import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStoredJobs } from '../../services/jobsService';
import { useCandidates } from '../../context/CandidatesContext';
import {
  BarChart3,
  TrendingUp,
  Briefcase,
  Users,
  Layers,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export const DashboardCharts = () => {
  const navigate = useNavigate();
  const { candidates } = useCandidates();

  // Active Tab: 'applications' | 'categories' | 'talent'
  const [activeTab, setActiveTab] = useState('applications');
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Dynamic Jobs State with LocalStorage live-sync
  const [jobs, setJobs] = useState(() => getStoredJobs());

  useEffect(() => {
    const syncJobs = () => {
      setJobs(getStoredJobs());
    };
    syncJobs();
    window.addEventListener('storage', syncJobs);
    return () => window.removeEventListener('storage', syncJobs);
  }, []);

  // Helper to get concise role label so bars and X-axis never misalign
  const getShortRole = (title) => {
    if (!title) return 'Role';
    const t = title.toLowerCase();
    if (t.includes('front')) return 'Frontend';
    if (t.includes('software')) return 'Software';
    if (t.includes('back')) return 'Backend';
    if (t.includes('devops')) return 'DevOps';
    if (t.includes('ui') || t.includes('ux') || t.includes('design')) return 'UI/UX';
    if (t.includes('full')) return 'Full Stack';
    if (t.includes('data') || t.includes('ai')) return 'Data Sci';
    if (t.includes('cloud') || t.includes('architect')) return 'Cloud';
    if (t.includes('product')) return 'Product';
    if (t.includes('qa') || t.includes('test')) return 'QA Eng';
    return title.split(' ')[0] || title;
  };

  // 1. DATASET 1: Applications by Active Role
  const applicationsData = useMemo(() => {
    const sorted = [...jobs]
      .filter((j) => (j.applicationsCount || 0) > 0)
      .sort((a, b) => (b.applicationsCount || 0) - (a.applicationsCount || 0))
      .slice(0, 7);

    const totalApps = sorted.reduce((sum, j) => sum + (j.applicationsCount || 0), 0);

    return sorted.map((job) => ({
      id: job.id,
      label: job.title,
      shortLabel: getShortRole(job.title),
      subLabel: job.companyName,
      value: job.applicationsCount || 0,
      unit: 'Applications',
      percent: totalApps > 0 ? Math.round(((job.applicationsCount || 0) / totalApps) * 100) : 0,
      link: `/jobs/${job.id}`,
    }));
  }, [jobs]);

  // 2. DATASET 2: Jobs Distribution by Category
  const categoriesData = useMemo(() => {
    const map = {};
    jobs.forEach((job) => {
      const cat = job.category || 'IT & Software';
      map[cat] = (map[cat] || 0) + 1;
    });

    const entries = Object.entries(map).sort((a, b) => b[1] - a[1]);
    const totalJobs = jobs.length || 1;

    const shortCatMap = {
      'IT & Software': 'Software',
      'Design & Creative': 'Design',
      'Product & Management': 'Product',
      'Marketing & Sales': 'Marketing',
      'Data & Analytics': 'Data/AI',
      Finance: 'Finance',
      Engineering: 'Engineer',
    };

    return entries.slice(0, 6).map(([cat, count]) => ({
      id: cat,
      label: cat,
      shortLabel: shortCatMap[cat] || cat.split(' ')[0] || cat,
      subLabel: `${count} roles`,
      value: count,
      unit: 'Jobs',
      percent: Math.round((count / totalJobs) * 100),
      link: '/jobs',
    }));
  }, [jobs]);

  // 3. DATASET 3: Candidate Talent Distribution from DummyJSON Users
  const talentData = useMemo(() => {
    const roleGroups = [
      { key: 'Frontend', match: 'front', label: 'Frontend Devs', short: 'Frontend' },
      { key: 'Backend', match: 'back', label: 'Backend Devs', short: 'Backend' },
      { key: 'Full Stack', match: 'full', label: 'Full Stack', short: 'Full Stack' },
      { key: 'UI/UX', match: 'ui', label: 'UI/UX Design', short: 'UI/UX' },
      { key: 'DevOps', match: 'devops', label: 'DevOps & Cloud', short: 'DevOps' },
      { key: 'Data & AI', match: 'data', label: 'Data Science', short: 'Data Sci' },
    ];

    const counts = {
      Frontend: 0,
      Backend: 0,
      'Full Stack': 0,
      'UI/UX': 0,
      DevOps: 0,
      'Data & AI': 0,
    };

    candidates.forEach((cand) => {
      const roleStr = (cand.role || '').toLowerCase();
      let matched = false;
      for (const group of roleGroups) {
        if (roleStr.includes(group.match)) {
          counts[group.key] = (counts[group.key] || 0) + 1;
          matched = true;
          break;
        }
      }
      if (!matched) {
        counts['Full Stack'] = (counts['Full Stack'] || 0) + 1;
      }
    });

    const totalCands = candidates.length || 1;

    return roleGroups.map((group) => {
      const val = counts[group.key] || 0;
      return {
        id: group.key,
        label: group.label,
        shortLabel: group.short,
        subLabel: 'Available',
        value: val,
        unit: 'Candidates',
        percent: Math.round((val / totalCands) * 100),
        link: '/candidates',
      };
    });
  }, [candidates]);

  // Current Active Chart Data
  const currentChartData = useMemo(() => {
    if (activeTab === 'categories') return categoriesData;
    if (activeTab === 'talent') return talentData;
    return applicationsData;
  }, [activeTab, applicationsData, categoriesData, talentData]);

  // Maximum Data Value
  const maxDataValue = useMemo(() => {
    if (!currentChartData || currentChartData.length === 0) return 50;
    const max = Math.max(...currentChartData.map((d) => d.value));
    return max > 0 ? max : 50;
  }, [currentChartData]);

  // Dynamic Y-Axis scale ceiling rounded to clean round numbers
  const yAxisMax = useMemo(() => {
    if (maxDataValue <= 10) return 10;
    if (maxDataValue <= 20) return 20;
    if (maxDataValue <= 40) return 40;
    if (maxDataValue <= 60) return 60;
    if (maxDataValue <= 80) return 80;
    if (maxDataValue <= 100) return 100;
    return Math.ceil(maxDataValue / 25) * 25;
  }, [maxDataValue]);

  // Y-Axis Markers (100%, 75%, 50%, 25%, 0%)
  const yAxisMarkers = useMemo(() => {
    return [
      yAxisMax,
      Math.round(yAxisMax * 0.75),
      Math.round(yAxisMax * 0.5),
      Math.round(yAxisMax * 0.25),
      0,
    ];
  }, [yAxisMax]);

  // Dynamic KPI Metric Calculations
  const kpis = useMemo(() => {
    if (activeTab === 'applications') {
      const total = jobs.reduce((sum, j) => sum + (j.applicationsCount || 0), 0);
      const topJob = [...jobs].sort((a, b) => (b.applicationsCount || 0) - (a.applicationsCount || 0))[0];
      const avg = jobs.length > 0 ? Math.round(total / jobs.length) : 0;
      return [
        { label: 'Total Applications', value: total, subtitle: 'Across all active jobs' },
        { label: 'Peak Engagement', value: topJob ? `${topJob.applicationsCount} apps` : '0', subtitle: topJob?.title || 'None' },
        { label: 'Avg Applications', value: `${avg} / job`, subtitle: 'Recruitment velocity' },
      ];
    }
    if (activeTab === 'categories') {
      const topCat = categoriesData[0]?.label || 'IT & Software';
      return [
        { label: 'Total Job Postings', value: jobs.length, subtitle: 'Live in directory' },
        { label: 'Top Category', value: topCat, subtitle: `${categoriesData[0]?.value || 0} open roles` },
        { label: 'Categories Count', value: categoriesData.length, subtitle: 'Active hiring sectors' },
      ];
    }
    // Talent tab
    const activeTalent = candidates.filter((c) => c.status === 'Active').length || candidates.length;
    return [
      { label: 'Total Candidates', value: `${candidates.length} Profiles`, subtitle: 'Live talent pool' },
      { label: 'Interview Ready', value: `${activeTalent} Active`, subtitle: 'Immediate availability' },
      { label: 'Top Specialization', value: talentData[0]?.label || 'Frontend', subtitle: `${talentData[0]?.value || 0} candidates` },
    ];
  }, [activeTab, jobs, candidates, categoriesData, talentData]);

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] h-full flex flex-col justify-between text-left select-none">
      <div>
        {/* Top Header: Title, Live Sync Badge & View Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-extrabold text-[#25324B] tracking-tight">
                Hiring & Recruitment Analytics
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync
              </span>
            </div>
            <p className="text-xs text-[#7C8493] mt-0.5 font-medium truncate">
              Dynamic data from {jobs.length} jobs and {candidates.length} candidates
            </p>
          </div>

          {/* 3 Interactive Tab Selector Buttons */}
          <div className="flex items-center gap-1 p-1 bg-[#F8F9FC] border border-gray-200/80 rounded-xl flex-shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('applications')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'applications'
                  ? 'bg-[#25324B] text-white shadow-xs'
                  : 'text-[#7C8493] hover:text-[#25324B]'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Applications</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('categories')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'categories'
                  ? 'bg-[#25324B] text-white shadow-xs'
                  : 'text-[#7C8493] hover:text-[#25324B]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Categories</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('talent')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'talent'
                  ? 'bg-[#25324B] text-white shadow-xs'
                  : 'text-[#7C8493] hover:text-[#25324B]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Talent Pool</span>
            </button>
          </div>
        </div>

        {/* 3 Dynamic KPI Metric Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5 p-3 rounded-xl bg-[#F8F9FC] border border-gray-100">
          {kpis.map((kpi, idx) => (
            <div key={idx} className="border-r border-gray-200/60 last:border-r-0 pr-2">
              <span className="text-[11px] font-semibold text-[#7C8493] block">{kpi.label}</span>
              <p className="text-sm sm:text-base font-extrabold text-[#25324B] tracking-tight mt-0.5 truncate">
                {kpi.value}
              </p>
              <span className="text-[10px] text-[#7C8493] font-medium block truncate mt-0.5">
                {kpi.subtitle}
              </span>
            </div>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* PROPERLY ALIGNED DYNAMIC BAR CHART COMPONENT                              */}
        {/* Features:                                                                 */}
        {/* 1. Left Y-Axis Scale Numbers (aligned with dashed guide lines)            */}
        {/* 2. Isolated Plot Area (all bars sit precisely on the baseline axis!)     */}
        {/* 3. Distinct X-Axis Labels row below the baseline (no vertical distortion) */}
        {/* ========================================================================= */}
        <div className="flex items-stretch gap-2.5 pt-2">
          {/* Y-Axis Numerical Scale Labels (aligned to the 5 guideline levels) */}
          <div className="flex flex-col justify-between items-end text-[10px] font-bold text-[#A0AEC0] w-7 h-52 pb-1 select-none flex-shrink-0">
            {yAxisMarkers.map((val, idx) => (
              <span key={idx} className="leading-none">
                {val}
              </span>
            ))}
          </div>

          {/* Main Chart Column: Plot Area + Baseline + X-Axis Labels */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* The Plotting Area: Fixed h-52 with absolute horizontal dashed guide lines */}
            <div className="relative h-52 w-full border-b border-gray-300 flex items-end">
              {/* 4 Reference Dashed Guide Lines + Baseline (100%, 75%, 50%, 25%, 0%) */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                <div className="w-full border-b border-dashed border-gray-200" />
                <div className="w-full border-b border-dashed border-gray-200" />
                <div className="w-full border-b border-dashed border-gray-200" />
                <div className="w-full border-b border-dashed border-gray-200" />
                <div className="w-full" />
              </div>

              {/* The Dynamic Bars: Sitting DIRECTLY on the bottom baseline! */}
              <div className="relative z-10 w-full h-full flex items-end justify-around gap-2 px-1">
                {currentChartData.map((item, index) => {
                  const isHovered = hoveredIndex === index;
                  // Calculate height strictly as percentage of yAxisMax, clamped between 5% and 94%
                  const heightPercent = Math.min(
                    94,
                    Math.max(6, Math.round((item.value / yAxisMax) * 100))
                  );
                  const isTop = item.value === maxDataValue && item.value > 0;

                  return (
                    <div
                      key={item.id || index}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      onClick={() => navigate(item.link)}
                      className="flex-1 flex flex-col items-center justify-end h-full relative group cursor-pointer max-w-[46px]"
                    >
                      {/* Floating Tooltip */}
                      {isHovered && (
                        <div className="absolute -top-14 z-40 bg-[#25324B] text-white py-1.5 px-3 rounded-xl shadow-xl whitespace-nowrap animate-fadeIn pointer-events-none text-left border border-slate-700/60">
                          <p className="text-xs font-bold leading-tight">{item.label}</p>
                          <p className="text-[10px] text-slate-300 mt-0.5 font-medium flex items-center gap-1.5">
                            <span className="text-emerald-400 font-bold">
                              {item.value} {item.unit}
                            </span>
                            <span>•</span>
                            <span>{item.subLabel}</span>
                            <span>•</span>
                            <span>{item.percent}%</span>
                          </p>
                        </div>
                      )}

                      {/* Number badge sitting directly on top of the bar */}
                      <span
                        className={`text-[10px] font-extrabold mb-1 leading-none transition-all ${
                          isHovered
                            ? 'text-[#25324B] scale-110'
                            : isTop
                            ? 'text-blue-600'
                            : 'text-[#7C8493]'
                        }`}
                      >
                        {item.value}
                      </span>

                      {/* The Bar */}
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-lg transition-all duration-300 relative overflow-hidden ${
                          isHovered
                            ? 'bg-gradient-to-t from-[#1B2537] via-[#25324B] to-blue-600 shadow-md shadow-[#25324B]/25'
                            : isTop
                            ? 'bg-gradient-to-t from-[#25324B] to-[#3B4B69]'
                            : 'bg-gradient-to-t from-[#40506D] to-[#60708D]'
                        }`}
                      >
                        {/* Top highlight bar */}
                        <div
                          className={`h-1 w-full ${isTop ? 'bg-amber-400' : 'bg-white/30'}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* X-Axis Labels Row: COMPLETELY INDEPENDENT below the baseline */}
            <div className="w-full flex items-start justify-around gap-2 pt-2.5 px-1">
              {currentChartData.map((item, index) => {
                const isHovered = hoveredIndex === index;
                return (
                  <div
                    key={item.id || index}
                    onClick={() => navigate(item.link)}
                    className="flex-1 text-center max-w-[46px] cursor-pointer"
                  >
                    <span
                      title={item.label}
                      className={`text-[11px] font-bold block truncate transition-colors leading-tight ${
                        isHovered ? 'text-[#25324B]' : 'text-[#515B6F]'
                      }`}
                    >
                      {item.shortLabel || item.label}
                    </span>
                    <span
                      title={item.subLabel}
                      className="text-[9px] text-[#A0AEC0] font-semibold block truncate leading-tight mt-0.5"
                    >
                      {item.subLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer: Live Feedback & Link */}
      <div className="mt-4 pt-3 border-t border-[#F0F2F6] flex items-center justify-between text-xs text-[#7C8493] flex-wrap gap-2">
        <div className="flex items-center gap-1.5 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          <span>Click any bar to inspect role & application pipeline</span>
        </div>

        <button
          type="button"
          onClick={() => {
            if (activeTab === 'talent') navigate('/candidates');
            else navigate('/jobs');
          }}
          className="font-bold text-[#25324B] hover:text-blue-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
        >
          <span>{activeTab === 'talent' ? 'View All Candidates' : 'View Job Postings'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
