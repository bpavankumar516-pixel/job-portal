import React from 'react';
import { Search, SlidersHorizontal, ChevronDown, Plus, RotateCcw } from 'lucide-react';

export const JobFilters = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedType,
  onTypeChange,
  selectedStatus,
  onStatusChange,
  onResetFilters,
  onCreateJob,
  hasActiveFilters,
}) => {
  const categories = [
    'All Categories',
    'IT & Software',
    'Design',
    'Data Science',
    'Product',
    'QA & Testing',
    'DevOps',
    'Mobile Development',
    'IT Support',
  ];

  const employmentTypes = [
    'All Types',
    'Full Time',
    'Contract',
    'Part Time',
    'Internship',
  ];

  const statuses = ['All Status', 'Open', 'Closed'];

  return (
    <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      {/* 1. Search Bar */}
      <div className="relative flex-1 min-w-[240px]">
        <Search className="w-4 h-4 text-[#7C8493] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search jobs by title, category, or location..."
          className="w-full bg-[#F8F9FC] text-xs sm:text-sm font-medium rounded-xl border border-[#E9ECF2] hover:border-[#CCD5E4] focus:border-[#25324B] focus:bg-white focus:ring-2 focus:ring-[#25324B]/15 pl-10 pr-3.5 py-2.5 outline-none transition-all text-[#25324B] placeholder:text-[#A0AEC0]"
        />
      </div>

      {/* 2. Controls: Category, Type, Status Dropdowns + Filters + Create Button */}
      <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
        {/* Job Category Dropdown */}
        <div className="relative flex-1 sm:flex-initial sm:w-44">
          <label className="absolute -top-2 left-3 px-1 bg-white text-[10px] font-bold text-[#7C8493] leading-none z-10">
            Job Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full bg-[#F8F9FC] text-xs font-bold text-[#25324B] border border-[#E9ECF2] hover:border-[#CCD5E4] focus:border-[#25324B] rounded-xl px-3 py-2.5 outline-none cursor-pointer appearance-none pr-7 transition-colors"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#7C8493] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Employment Type Dropdown */}
        <div className="relative flex-1 sm:flex-initial sm:w-36">
          <label className="absolute -top-2 left-3 px-1 bg-white text-[10px] font-bold text-[#7C8493] leading-none z-10">
            Employment Type
          </label>
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full bg-[#F8F9FC] text-xs font-bold text-[#25324B] border border-[#E9ECF2] hover:border-[#CCD5E4] focus:border-[#25324B] rounded-xl px-3 py-2.5 outline-none cursor-pointer appearance-none pr-7 transition-colors"
          >
            {employmentTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#7C8493] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Job Status Dropdown */}
        <div className="relative flex-1 sm:flex-initial sm:w-32">
          <label className="absolute -top-2 left-3 px-1 bg-white text-[10px] font-bold text-[#7C8493] leading-none z-10">
            Job Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full bg-[#F8F9FC] text-xs font-bold text-[#25324B] border border-[#E9ECF2] hover:border-[#CCD5E4] focus:border-[#25324B] rounded-xl px-3 py-2.5 outline-none cursor-pointer appearance-none pr-7 transition-colors"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#7C8493] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Filters Reset / Filter Icon Button */}
        <button
          type="button"
          onClick={onResetFilters}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex-shrink-0 ${
            hasActiveFilters
              ? 'bg-[#25324B] text-white border-[#25324B]'
              : 'bg-[#F8F9FC] text-[#515B6F] border-[#E9ECF2] hover:border-[#CCD5E4] hover:text-[#25324B]'
          }`}
          title={hasActiveFilters ? 'Clear Filters' : 'Filter Options'}
        >
          {hasActiveFilters ? (
            <RotateCcw className="w-3.5 h-3.5" />
          ) : (
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#7C8493]" />
          )}
          <span>Filters</span>
        </button>

        {/* + Create Job Posting Button matching reference image */}
        <button
          type="button"
          onClick={onCreateJob}
          className="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl bg-[#25324B] hover:bg-[#1C2638] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#25324B]/20 transition-all cursor-pointer flex-shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.4]" />
          <span>Create Job Posting</span>
        </button>
      </div>
    </div>
  );
};
