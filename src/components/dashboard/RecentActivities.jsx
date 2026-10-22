import React from 'react';

export const RecentActivities = () => {
  const activities = [
    {
      id: 1,
      title: 'New application received',
      meta: 'Frontend Developer · Aarav Mehta',
      time: '5 min ago',
    },
    {
      id: 2,
      title: 'Job posting published',
      meta: 'UI/UX Designer · Northwind Labs',
      time: '1 hr ago',
    },
    {
      id: 3,
      title: 'Company profile updated',
      meta: 'Brightwave Technologies',
      time: '3 hrs ago',
    },
    {
      id: 4,
      title: 'Candidate saved a job',
      meta: 'Backend Engineer · Orbit Systems',
      time: 'Yesterday',
    },
    {
      id: 5,
      title: 'Application withdrawn',
      meta: 'QA Analyst · Helix Corp',
      time: '2 days ago',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] h-full">
      <h3 className="text-base sm:text-lg font-extrabold text-[#25324B] tracking-tight mb-6">
        Recent Activities
      </h3>

      <div className="space-y-6">
        {activities.map((act) => (
          <div key={act.id} className="flex items-start justify-between gap-3 text-left">
            <div className="flex items-start gap-3">
              {/* Slate bullet dot */}
              <span className="w-2 h-2 rounded-full bg-[#25324B] mt-1.5 flex-shrink-0" />

              <div>
                <h4 className="text-sm font-bold text-[#25324B] leading-tight">
                  {act.title}
                </h4>
                <p className="text-xs text-[#7C8493] mt-0.5 font-medium">
                  {act.meta}
                </p>
              </div>
            </div>

            <span className="text-xs text-[#7C8493] whitespace-nowrap font-medium flex-shrink-0">
              {act.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
