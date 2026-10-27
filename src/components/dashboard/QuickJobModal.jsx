import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { X, Briefcase, PlusCircle, CheckCircle2 } from 'lucide-react';
import { addQuickJob } from '../../services/dashboardData';
import { getStoredCompanies } from '../../services/companiesService';
import { recordActivity } from '../../services/activityService';

export const QuickJobModal = ({ isOpen, onClose, onJobCreated }) => {
  const companiesList = useMemo(() => getStoredCompanies(), []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: '',
      companyName: companiesList[0]?.name || 'Google',
      category: 'Engineering & Software',
      employmentType: 'Full-time',
      experienceLevel: 'Mid-Senior Level',
      salaryRange: '$130k - $160k',
      location: companiesList[0]?.location || 'Mountain View, CA',
      requiredSkills: 'React.js, TypeScript, Tailwind CSS',
      deadline: '2026-12-31',
      featured: true,
    },
  });

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    try {
      const createdJob = addQuickJob(data);
      recordActivity({
        type: 'job',
        title: 'New job posting published',
        meta: `${createdJob.title} at ${createdJob.companyName}`,
        link: '/jobs',
        iconType: 'briefcase',
      });
      toast.success(`Job "${createdJob.title}" posted successfully!`, {
        icon: '💼',
      });
      reset();
      if (onJobCreated) onJobCreated(createdJob);
      onClose();
    } catch {
      toast.error('Failed to post job. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-2xl p-6 sm:p-8 relative shadow-2xl border border-[#E9ECF2] max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#7C8493] hover:text-[#25324B] hover:bg-[#F8F9FC] transition-colors cursor-pointer"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#F0F3F8] text-[#25324B] flex items-center justify-center border border-[#CCD5E4]">
            <Briefcase className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-[#25324B]">
              Post a New Job
            </h3>
            <p className="text-xs text-[#7C8493]">
              Quickly create a job posting stored in Local Storage
            </p>
          </div>
        </div>

        {/* Job Creation Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Job Title */}
          <div>
            <label className="block text-xs font-bold text-[#25324B] mb-1">
              Job Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Senior Frontend React Developer"
              {...register('title', { required: 'Job title is required' })}
              className="w-full bg-[#F8F9FC] text-xs sm:text-sm font-semibold rounded-xl border border-[#E9ECF2] p-2.5 outline-none focus:border-[#25324B] focus:bg-white text-[#25324B]"
            />
            {errors.title && (
              <p className="mt-1 text-[11px] text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Row 2: Company & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#25324B] mb-1">
                Company Name *
              </label>
              <select
                {...register('companyName', { required: 'Company name is required' })}
                className="w-full bg-[#F8F9FC] text-xs sm:text-sm font-semibold rounded-xl border border-[#E9ECF2] p-2.5 outline-none focus:border-[#25324B] focus:bg-white text-[#25324B] cursor-pointer"
              >
                {companiesList.map((comp) => (
                  <option key={comp.id} value={comp.name}>
                    {comp.name} ({comp.location})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#25324B] mb-1">
                Category
              </label>
              <select
                {...register('category')}
                className="w-full bg-[#F8F9FC] text-xs sm:text-sm font-semibold rounded-xl border border-[#E9ECF2] p-2.5 outline-none focus:border-[#25324B] focus:bg-white text-[#25324B] cursor-pointer"
              >
                <option value="Engineering & Software">Engineering & Software</option>
                <option value="Design & Creative">Design & Creative</option>
                <option value="Marketing & Sales">Marketing & Sales</option>
                <option value="Financial Services">Financial Services</option>
                <option value="Cybersecurity">Cybersecurity</option>
              </select>
            </div>
          </div>

          {/* Row 3: Employment Type & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#25324B] mb-1">
                Employment Type
              </label>
              <select
                {...register('employmentType')}
                className="w-full bg-[#F8F9FC] text-xs sm:text-sm font-semibold rounded-xl border border-[#E9ECF2] p-2.5 outline-none focus:border-[#25324B] focus:bg-white text-[#25324B] cursor-pointer"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#25324B] mb-1">
                Experience Level
              </label>
              <select
                {...register('experienceLevel')}
                className="w-full bg-[#F8F9FC] text-xs sm:text-sm font-semibold rounded-xl border border-[#E9ECF2] p-2.5 outline-none focus:border-[#25324B] focus:bg-white text-[#25324B] cursor-pointer"
              >
                <option value="Entry Level">Entry Level</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Mid-Senior Level">Mid-Senior Level</option>
                <option value="Senior Level">Senior Level</option>
                <option value="Lead / Director">Lead / Director</option>
              </select>
            </div>
          </div>

          {/* Row 4: Salary Range & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#25324B] mb-1">
                Salary Range
              </label>
              <input
                type="text"
                placeholder="e.g. $120k - $150k"
                {...register('salaryRange')}
                className="w-full bg-[#F8F9FC] text-xs sm:text-sm font-semibold rounded-xl border border-[#E9ECF2] p-2.5 outline-none focus:border-[#25324B] focus:bg-white text-[#25324B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#25324B] mb-1">
                Location
              </label>
              <input
                type="text"
                placeholder="e.g. San Francisco, CA (Remote)"
                {...register('location')}
                className="w-full bg-[#F8F9FC] text-xs sm:text-sm font-semibold rounded-xl border border-[#E9ECF2] p-2.5 outline-none focus:border-[#25324B] focus:bg-white text-[#25324B]"
              />
            </div>
          </div>

          {/* Required Skills */}
          <div>
            <label className="block text-xs font-bold text-[#25324B] mb-1">
              Required Skills (Comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. React.js, Tailwind CSS, TypeScript, GraphQL"
              {...register('requiredSkills')}
              className="w-full bg-[#F8F9FC] text-xs sm:text-sm font-semibold rounded-xl border border-[#E9ECF2] p-2.5 outline-none focus:border-[#25324B] focus:bg-white text-[#25324B]"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F0F2F6]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#CCD5E4] text-xs sm:text-sm font-bold text-[#515B6F] hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#25324B] hover:bg-[#1B2537] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#25324B]/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <PlusCircle className="w-4 h-4 stroke-[2.2]" />
                  <span>Publish Job Posting</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
