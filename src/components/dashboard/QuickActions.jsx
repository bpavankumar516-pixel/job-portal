import React from 'react';
import { Plus, Building2, User, BarChart2 } from 'lucide-react';

export const QuickActions = ({ onPostJob, onAddCompany, onReviewCandidates, onViewReports }) => {
  const actions = [
    {
      id: 'post-job',
      title: 'Post a Job',
      desc: 'Create a new job posting',
      icon: Plus,
      onClick: onPostJob,
    },
    {
      id: 'add-company',
      title: 'Add Company',
      desc: 'Register a hiring company',
      icon: Building2,
      onClick: onAddCompany,
    },
    {
      id: 'review-candidates',
      title: 'Review Candidates',
      desc: 'Browse new profiles',
      icon: User,
      onClick: onReviewCandidates,
    },
    {
      id: 'view-reports',
      title: 'View Reports',
      desc: 'Hiring insights',
      icon: BarChart2,
      onClick: onViewReports,
    },
  ];

  return (
    <div className="mb-6">
      <h3 className="text-base sm:text-lg font-extrabold text-[#25324B] tracking-tight mb-3.5">
        Quick Actions
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((act) => {
          const Icon = act.icon;

          return (
            <div
              key={act.id}
              onClick={act.onClick}
              className="bg-[#25324B] hover:bg-[#1C2638] text-white rounded-2xl p-4 flex items-center gap-3.5 transition-all shadow-sm cursor-pointer group"
            >
              <div className="w-11 h-11 rounded-xl bg-white/10 text-white flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105">
                <Icon className="w-5 h-5 stroke-[2.2]" />
              </div>

              <div className="flex flex-col text-left">
                <span className="text-sm font-bold text-white tracking-tight leading-tight">
                  {act.title}
                </span>
                <span className="text-xs text-slate-300 font-normal mt-0.5">
                  {act.desc}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
