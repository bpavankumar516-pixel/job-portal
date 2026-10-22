import React from 'react';

export const StatCardSkeleton = () => (
  <div className="bg-white rounded-3xl p-6 border border-[#E9ECF2] shadow-2xs animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="w-24 h-4 bg-gray-200 rounded-md" />
      <div className="w-11 h-11 bg-gray-200 rounded-2xl" />
    </div>
    <div className="w-28 h-8 bg-gray-200 rounded-md mb-3" />
    <div className="pt-2 border-t border-[#F8F9FC] flex justify-between">
      <div className="w-16 h-4 bg-gray-200 rounded-full" />
      <div className="w-20 h-3 bg-gray-100 rounded-md" />
    </div>
  </div>
);

export const ChartSkeleton = () => (
  <div className="bg-white rounded-3xl p-6 border border-[#E9ECF2] shadow-2xs animate-pulse h-80 flex flex-col justify-between">
    <div className="flex justify-between items-center mb-6">
      <div className="space-y-2">
        <div className="w-48 h-5 bg-gray-200 rounded-md" />
        <div className="w-32 h-3 bg-gray-100 rounded-md" />
      </div>
      <div className="w-24 h-8 bg-gray-200 rounded-xl" />
    </div>
    <div className="flex items-end justify-between gap-3 h-48 w-full pt-4">
      {[40, 65, 80, 50, 90, 75, 60, 85, 70, 95, 80, 60].map((h, i) => (
        <div key={i} className="flex-1 bg-gray-200 rounded-t-md" style={{ height: `${h}%` }} />
      ))}
    </div>
  </div>
);
