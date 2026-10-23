import React from 'react';
import {
  Building2,
  CheckCircle2,
  Layers,
  MapPin,
  TrendingUp,
} from 'lucide-react';

export const CompanyStats = ({ stats }) => {
  const statItems = [
    {
      id: 'total-companies',
      title: 'Total Companies',
      value: stats?.totalCompanies ?? 32,
      subtitle: '+12 this month',
      leftIcon: Building2,
      rightIcon: CheckCircle2,
    },
    {
      id: 'active-companies',
      title: 'Active Companies',
      value: stats?.activeCompanies || 112,
      subtitle: '+8 this month',
      leftIcon: CheckCircle2,
      rightIcon: Building2,
    },
    {
      id: 'total-industries',
      title: 'Total Industries',
      value: stats?.totalIndustries || 24,
      subtitle: '+3 this month',
      leftIcon: Layers,
      rightIcon: Layers,
    },
    {
      id: 'total-locations',
      title: 'Total Locations',
      value: stats?.totalLocations || 19,
      subtitle: '+2 this month',
      leftIcon: MapPin,
      rightIcon: MapPin,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item) => {
        const LeftIcon = item.leftIcon;
        const RightIcon = item.rightIcon;

        return (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-5 border border-gray-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-[#CCD5E4] hover:shadow-xs transition-all flex flex-col justify-between"
          >
            {/* Top Row: Title on Left with small icon, Right icon in soft circle */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#F0F3F8] text-[#25324B] flex items-center justify-center flex-shrink-0">
                  <LeftIcon className="w-3.5 h-3.5 stroke-[2]" />
                </div>
                <span className="text-xs font-semibold text-[#7C8493] tracking-tight">
                  {item.title}
                </span>
              </div>

              <div className="w-6 h-6 rounded-full bg-[#F0F3F8] text-[#7C8493] flex items-center justify-center flex-shrink-0">
                <RightIcon className="w-3 h-3 stroke-[2]" />
              </div>
            </div>

            {/* Main Value */}
            <div className="my-1">
              <span className="text-3xl font-extrabold text-[#25324B] tracking-tight">
                {item.value}
              </span>
            </div>

            {/* Subtitle / Growth */}
            <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1 pt-1">
              <TrendingUp className="w-3 h-3" />
              <span>{item.subtitle}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
