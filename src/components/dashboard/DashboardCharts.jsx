import React, { useState } from 'react';

export const DashboardCharts = () => {
  const [hoveredBar, setHoveredBar] = useState(null);

  const data = [
    { month: 'Jan', value: 35, count: 185 },
    { month: 'Feb', value: 55, count: 290 },
    { month: 'Mar', value: 45, count: 240 },
    { month: 'Apr', value: 70, count: 370 },
    { month: 'May', value: 60, count: 315 },
    { month: 'Jun', value: 85, count: 450 },
    { month: 'Jul', value: 80, count: 420 },
    { month: 'Aug', value: 92, count: 490 },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] h-full flex flex-col justify-between">
      {/* Header matching reference image */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-base sm:text-lg font-extrabold text-[#25324B] tracking-tight">
          Dashboard Statistics
        </h3>
        <span className="text-xs font-medium text-[#7C8493]">
          Applications per month
        </span>
      </div>

      {/* Bar Chart matching reference image */}
      <div className="relative h-64 w-full flex items-end justify-between gap-2 sm:gap-4 px-2 pb-2">
        {data.map((item) => {
          const isHovered = hoveredBar === item.month;

          return (
            <div
              key={item.month}
              onMouseEnter={() => setHoveredBar(item.month)}
              onMouseLeave={() => setHoveredBar(null)}
              className="flex-1 flex flex-col items-center h-full justify-end relative group cursor-pointer"
            >
              {/* Dynamic Tooltip on hover */}
              {isHovered && (
                <div className="absolute -top-10 z-20 bg-[#25324B] text-white text-[11px] font-bold py-1 px-2.5 rounded-lg shadow-md whitespace-nowrap animate-fadeIn pointer-events-none">
                  {item.count} Applications
                </div>
              )}

              {/* Bar */}
              <div
                style={{ height: `${item.value}%` }}
                className={`w-full max-w-[42px] rounded-t-lg transition-all duration-300 ${
                  isHovered ? 'bg-[#1B2537] scale-y-105' : 'bg-[#4B5870]'
                }`}
              />

              {/* Label */}
              <span className="text-xs font-semibold text-[#7C8493] mt-3 group-hover:text-[#25324B] transition-colors">
                {item.month}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
