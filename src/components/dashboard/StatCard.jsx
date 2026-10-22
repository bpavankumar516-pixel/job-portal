import React from 'react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  className = '',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 border border-gray-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between transition-all hover:border-[#CCD5E4] hover:shadow-xs ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* Top Header: Title on Left, Icon in Squircle on Right */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-semibold text-[#7C8493] tracking-tight">
          {title}
        </span>
        {Icon && (
          <div className="w-8 h-8 rounded-xl bg-[#F0F3F8] text-[#25324B] flex items-center justify-center flex-shrink-0">
            <Icon className="w-4 h-4 stroke-[1.8]" />
          </div>
        )}
      </div>

      {/* Main Metric Value */}
      <div className="my-1">
        <span className="text-3xl font-extrabold text-[#25324B] tracking-tight">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
      </div>

      {/* Subtitle / Change */}
      <div className="text-xs text-[#7C8493] font-medium pt-1">
        {subtitle}
      </div>
    </div>
  );
};
