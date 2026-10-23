import React from 'react';
import { FileText, Briefcase, Clock, Users, Star, TrendingUp } from 'lucide-react';

export const JobStats = ({ stats }) => {
  const statItems = [
    {
      id: 'total-jobs',
      title: 'Total Jobs',
      value: stats?.totalJobs ?? 24,
      subtitle: '+3 this month',
      icon: FileText,
      subtitleColor: 'text-emerald-600',
    },
    {
      id: 'active-jobs',
      title: 'Active Jobs',
      value: stats?.activeJobs ?? 18,
      subtitle: '+2 this month',
      icon: Briefcase,
      subtitleColor: 'text-emerald-600',
    },
    {
      id: 'closed-jobs',
      title: 'Closed Jobs',
      value: stats?.closedJobs ?? 6,
      subtitle: '-1 this month',
      icon: Clock,
      subtitleColor: 'text-emerald-600',
    },
    {
      id: 'total-applications',
      title: 'Total Applications',
      value: stats?.totalApplications ?? 482,
      subtitle: '+56 this month',
      icon: Users,
      subtitleColor: 'text-emerald-600',
    },
    {
      id: 'featured-jobs',
      title: 'Featured Jobs',
      value: stats?.featuredJobs ?? 5,
      subtitle: '+1 this month',
      icon: Star,
      subtitleColor: 'text-emerald-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {statItems.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-5 border border-gray-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-[#CCD5E4] hover:shadow-xs transition-all flex flex-col justify-between"
          >
            {/* Top Row: Icon in Soft Squircle + Title */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold text-[#7C8493] tracking-tight">
                {item.title}
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#F0F3F8] text-[#25324B] flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 stroke-[1.8]" />
              </div>
            </div>

            {/* Main Value */}
            <div className="my-1">
              <span className="text-3xl font-extrabold text-[#25324B] tracking-tight">
                {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
              </span>
            </div>

            {/* Subtitle / Growth */}
            <div className={`text-xs font-semibold ${item.subtitleColor} flex items-center gap-1 pt-1`}>
              <TrendingUp className="w-3 h-3" />
              <span>{item.subtitle}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
