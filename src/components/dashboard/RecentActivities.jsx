import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCandidates } from '../../context/CandidatesContext';
import { getStoredJobs } from '../../services/jobsService';
import { getDynamicActivities } from '../../services/activityService';
import {
  UserCheck,
  FileText,
  Briefcase,
  Star,
  Bookmark,
  Building2,
  MessageSquare,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle2,
  UserPlus,
  Trash2,
  Edit2,
  User,
} from 'lucide-react';

export const RecentActivities = () => {
  const navigate = useNavigate();
  const { candidates, shortlistedIds } = useCandidates();

  // Dynamic Jobs State with LocalStorage live-sync
  const [jobs, setJobs] = useState(() => getStoredJobs());
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'applications' | 'jobs' | 'candidates'
  const [activityVersion, setActivityVersion] = useState(0);

  useEffect(() => {
    const handleSync = () => {
      setJobs(getStoredJobs());
      setActivityVersion((v) => v + 1);
    };
    window.addEventListener('storage', handleSync);
    window.addEventListener('notifications_updated', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('notifications_updated', handleSync);
    };
  }, []);

  // Compute dynamic activities in real-time
  const allActivities = useMemo(() => {
    return getDynamicActivities(jobs, candidates, shortlistedIds);
  }, [jobs, candidates, shortlistedIds, activityVersion]);

  // Filter activities based on active pill
  const filteredActivities = useMemo(() => {
    if (activeFilter === 'applications') {
      return allActivities.filter((a) => a.type === 'application');
    }
    if (activeFilter === 'jobs') {
      return allActivities.filter(
        (a) => a.type === 'job' || a.type === 'bookmark' || a.type === 'job_delete'
      );
    }
    if (activeFilter === 'candidates') {
      return allActivities.filter(
        (a) => a.type === 'candidate' || a.type === 'candidate_delete'
      );
    }
    return allActivities;
  }, [allActivities, activeFilter]);

  // Helper to render matching icon dynamically
  const renderActivityIcon = (iconType, type) => {
    switch (iconType || type) {
      case 'user-check':
        return <UserCheck className="w-4 h-4 text-emerald-600 stroke-[2.2]" />;
      case 'user-plus':
        return <UserPlus className="w-4 h-4 text-emerald-600 stroke-[2.2]" />;
      case 'user':
        return <User className="w-4 h-4 text-blue-600 stroke-[2.2]" />;
      case 'file-text':
        return <FileText className="w-4 h-4 text-blue-600 stroke-[2.2]" />;
      case 'star':
        return <Star className="w-4 h-4 text-amber-500 fill-amber-400 stroke-[1.5]" />;
      case 'briefcase':
        return <Briefcase className="w-4 h-4 text-indigo-600 stroke-[2.2]" />;
      case 'bookmark':
        return <Bookmark className="w-4 h-4 text-purple-600 fill-purple-100 stroke-[2.2]" />;
      case 'building':
        return <Building2 className="w-4 h-4 text-sky-600 stroke-[2.2]" />;
      case 'message':
        return <MessageSquare className="w-4 h-4 text-blue-600 stroke-[2.2]" />;
      case 'trash':
      case 'job_delete':
      case 'candidate_delete':
      case 'company_delete':
        return <Trash2 className="w-4 h-4 text-red-600 stroke-[2.2]" />;
      case 'edit':
      case 'edit2':
        return <Edit2 className="w-4 h-4 text-blue-600 stroke-[2.2]" />;
      default:
        return <Clock className="w-4 h-4 text-slate-600 stroke-[2.2]" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] h-full flex flex-col justify-between text-left select-none">
      <div>
        {/* Header: Title + Dynamic Live Sync Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-extrabold text-[#25324B] tracking-tight">
                Recent Activities
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Stream
              </span>
            </div>
            <p className="text-xs text-[#7C8493] mt-0.5 font-medium">
              Real-time pipeline actions, candidates & postings
            </p>
          </div>

          {/* Activity Category Filter Pills */}
          <div className="flex items-center gap-1 p-1 bg-[#F8F9FC] border border-gray-200/80 rounded-xl flex-shrink-0">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-[#25324B] text-white shadow-xs'
                  : 'text-[#7C8493] hover:text-[#25324B]'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('applications')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'applications'
                  ? 'bg-[#25324B] text-white shadow-xs'
                  : 'text-[#7C8493] hover:text-[#25324B]'
              }`}
            >
              Apps
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('candidates')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'candidates'
                  ? 'bg-[#25324B] text-white shadow-xs'
                  : 'text-[#7C8493] hover:text-[#25324B]'
              }`}
            >
              Talent
            </button>
          </div>
        </div>

        {/* Dynamic Activity Items List */}
        <div className="space-y-3.5">
          {filteredActivities.length === 0 ? (
            <div className="py-12 text-center text-[#7C8493]">
              <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-[#25324B]">No activities recorded yet</p>
              <p className="text-[11px] text-[#7C8493] mt-0.5">
                Actions like posting jobs or shortlisting candidates will appear here.
              </p>
            </div>
          ) : (
            filteredActivities.map((act) => (
              <div
                key={act.id}
                onClick={() => act.link && navigate(act.link)}
                className="p-3 rounded-xl border border-gray-100 hover:border-[#CCD5E4] hover:bg-[#F8F9FC]/80 transition-all duration-200 flex items-start justify-between gap-3 group cursor-pointer bg-white"
              >
                <div className="flex items-start gap-3 min-w-0">
                  {/* Dynamic Colored Icon Box */}
                  <div className="w-9 h-9 rounded-xl bg-[#F8F9FC] border border-gray-200/60 flex items-center justify-center flex-shrink-0 group-hover:bg-white group-hover:scale-105 transition-all shadow-2xs mt-0.5">
                    {renderActivityIcon(act.iconType, act.type)}
                  </div>

                  {/* Title & Dynamic Meta */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-xs sm:text-[13px] font-extrabold text-[#25324B] tracking-tight group-hover:text-blue-600 transition-colors truncate">
                        {act.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-[#515B6F] font-medium leading-relaxed mt-0.5 line-clamp-1">
                      {act.meta}
                    </p>
                  </div>
                </div>

                {/* Right: Relative Time + Arrow */}
                <div className="flex items-center gap-1.5 flex-shrink-0 text-right mt-1">
                  <span className="text-[10px] font-semibold text-[#7C8493] whitespace-nowrap">
                    {act.time}
                  </span>
                  <ArrowRight className="w-3 h-3 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer Link & Pulse Info */}
      <div className="mt-4 pt-3 border-t border-[#F0F2F6] flex items-center justify-between text-xs text-[#7C8493] flex-wrap gap-2">
        <div className="flex items-center gap-1.5 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          <span>Click any activity to navigate to its details</span>
        </div>

        <button
          type="button"
          onClick={() => navigate('/candidates')}
          className="font-bold text-[#25324B] hover:text-blue-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
        >
          <span>Review Talent</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
