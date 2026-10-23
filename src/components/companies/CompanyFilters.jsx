import React from 'react';
import { Search, SlidersHorizontal, ChevronDown, RotateCcw } from 'lucide-react';

export const CompanyFilters = ({
  searchQuery,
  onSearchChange,
  selectedIndustry,
  onIndustryChange,
  sortBy,
  onSortChange,
  onResetFilters,
  hasActiveFilters,
}) => {
  const industries = [
    'All Industries',
    'Technology',
    'E-commerce',
    'Social Media',
    'Consumer Electronics',
    'Entertainment',
    'Music & Audio',
    'IT Services',
    'Financial Services',
    'Automotive',
  ];

  const sortOptions = [
    { value: 'name-asc', label: 'Company Name (A-Z)' },
    { value: 'name-desc', label: 'Company Name (Z-A)' },
    { value: 'employees-desc', label: 'Most Employees' },
    { value: 'rating-desc', label: 'Highest Rated' },
    { value: 'jobs-desc', label: 'Most Open Jobs' },
  ];

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-gray-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      {/* 1. Global Search Input */}
      <div className="relative flex-1 min-w-[260px]">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7C8493] pointer-events-none">
          <Search className="w-4 h-4 stroke-[2]" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search companies by name, industry, or location..."
          className="w-full bg-[#F8F9FC] text-xs sm:text-sm font-medium rounded-xl border border-[#E9ECF2] hover:border-[#CCD5E4] focus:border-[#25324B] focus:bg-white focus:ring-2 focus:ring-[#25324B]/15 pl-10 pr-3.5 py-2.5 outline-none transition-all text-[#25324B] placeholder:text-[#A0AEC0]"
        />
      </div>

      {/* 2. Controls: Industry Dropdown, Sort Dropdown & Filters Button */}
      <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
        {/* Industry Filter Dropdown matching image */}
        <div className="relative flex-1 sm:flex-initial sm:w-48">
          <label className="absolute -top-2 left-3 px-1 bg-white text-[10px] font-bold text-[#7C8493] leading-none z-10">
            Industry
          </label>
          <select
            value={selectedIndustry}
            onChange={(e) => onIndustryChange(e.target.value)}
            className="w-full bg-[#F8F9FC] text-xs font-bold text-[#25324B] border border-[#E9ECF2] hover:border-[#CCD5E4] focus:border-[#25324B] rounded-xl px-3 py-2.5 outline-none cursor-pointer appearance-none pr-8 transition-colors"
          >
            {industries.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#7C8493] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Sort by Dropdown matching image */}
        <div className="relative flex-1 sm:flex-initial sm:w-52">
          <label className="absolute -top-2 left-3 px-1 bg-white text-[10px] font-bold text-[#7C8493] leading-none z-10">
            Sort by
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full bg-[#F8F9FC] text-xs font-bold text-[#25324B] border border-[#E9ECF2] hover:border-[#CCD5E4] focus:border-[#25324B] rounded-xl px-3 py-2.5 outline-none cursor-pointer appearance-none pr-8 transition-colors"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#7C8493] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Filters Toggle / Reset Button matching image */}
        <button
          type="button"
          onClick={onResetFilters}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex-shrink-0 ${
            hasActiveFilters
              ? 'bg-[#25324B] text-white border-[#25324B] hover:bg-[#1C2638]'
              : 'bg-[#F8F9FC] text-[#515B6F] border-[#E9ECF2] hover:border-[#CCD5E4] hover:text-[#25324B]'
          }`}
          title={hasActiveFilters ? 'Reset Filters' : 'Filter Options'}
        >
          {hasActiveFilters ? (
            <>
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </>
          ) : (
            <>
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
