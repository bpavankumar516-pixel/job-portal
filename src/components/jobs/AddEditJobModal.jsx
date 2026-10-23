import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { X, Briefcase, Plus, Check } from 'lucide-react';
import { getStoredCompanies } from '../../services/companiesService';

export const AddEditJobModal = ({
  isOpen,
  onClose,
  onSubmitJob,
  initialData = null,
}) => {
  const isEditing = Boolean(initialData);
  const companies = useMemo(() => getStoredCompanies(), []);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: '',
      companyName: companies[0]?.name || 'Google',
      category: 'IT & Software',
      employmentType: 'Full Time',
      location: 'Bengaluru, KA',
      salaryRange: '$80k - $120k',
      experience: '2-5 years',
      status: 'Open',
      featured: false,
      description: '',
      requirements: '',
    },
  });

  const selectedCompany = watch('companyName');

  // Auto-fill company location on company select
  useEffect(() => {
    if (!isEditing && selectedCompany) {
      const match = companies.find((c) => c.name === selectedCompany);
      if (match?.location) {
        setValue('location', match.location);
      }
    }
  }, [selectedCompany, isEditing, companies, setValue]);

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || '',
        companyName: initialData.companyName || companies[0]?.name || 'Google',
        category: initialData.category || 'IT & Software',
        employmentType: initialData.employmentType || 'Full Time',
        location: initialData.location || 'Bengaluru, KA',
        salaryRange: initialData.salaryRange || '$80k - $120k',
        experience: initialData.experience || '2-5 years',
        status: initialData.status || 'Open',
        featured: Boolean(initialData.featured),
        description: initialData.description || '',
        requirements: Array.isArray(initialData.requirements)
          ? initialData.requirements.join(', ')
          : initialData.requirements || '',
      });
    } else {
      reset({
        title: '',
        companyName: companies[0]?.name || 'Google',
        category: 'IT & Software',
        employmentType: 'Full Time',
        location: 'Bengaluru, KA',
        salaryRange: '$80k - $120k',
        experience: '2-5 years',
        status: 'Open',
        featured: false,
        description: '',
        requirements: '',
      });
    }
  }, [initialData, reset, isOpen, companies]);

  if (!isOpen) return null;

  const handleFormSubmit = (data) => {
    onSubmitJob(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-2xl p-6 sm:p-8 relative shadow-2xl border border-[#E9ECF2] max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#7C8493] hover:text-[#25324B] hover:bg-[#F8F9FC] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#25324B] text-white flex items-center justify-center shadow-sm">
            <Briefcase className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-[#25324B]">
              {isEditing ? 'Edit Job Posting' : 'Create a New Job Posting'}
            </h3>
            <p className="text-xs text-[#7C8493]">
              {isEditing
                ? 'Update job vacancy details in real-time'
                : 'Publish a new opening visible across the recruiter portal'}
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Row 1: Job Title */}
          <div>
            <label className="block text-xs font-bold text-[#25324B] mb-1">
              Job Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Frontend Developer"
              {...register('title', { required: 'Job title is required' })}
              className="w-full bg-[#F8F9FC] text-xs sm:text-sm font-semibold rounded-xl border border-[#E9ECF2] p-2.5 outline-none focus:border-[#25324B] focus:bg-white text-[#25324B]"
            />
            {errors.title && (
              <p className="mt-1 text-[11px] text-red-500 font-medium">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Row 2: Company & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#25324B] mb-1">
                Hiring Company *
              </label>
              <select
                {...register('companyName', { required: 'Company is required' })}
                className="w-full bg-[#F8F9FC] text-xs sm:text-sm font-semibold rounded-xl border border-[#E9ECF2] p-2.5 outline-none focus:border-[#25324B] focus:bg-white text-[#25324B] cursor-pointer"
              >
                {companies.map((comp) => (
                  <option key={comp.id} value={comp.name}>
                    {comp.name} ({comp.location})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#25324B] mb-1">
                Job Category
              </label>
              <select
                {...register('category')}
                className="w-full bg-[#F8F9FC] text-xs sm:text-sm font-semibold rounded-xl border border-[#E9ECF2] p-2.5 outline-none focus:border-[#25324B] focus:bg-white text-[#25324B] cursor-pointer"
              >
                <option value="IT & Software">IT & Software</option>
                <option value="Design">Design</option>
                <option value="Data Science">Data Science</option>
                <option value="Product">Product</option>
                <option value="QA & Testing">QA & Testing</option>
                <option value="DevOps">DevOps</option>
                <option value="Mobile Development">Mobile Development</option>
                <option value="IT Support">IT Support</option>
              </select>
            </div>
          </div>

          {/* Row 3: Employment Type & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#25324B] mb-1">
                Employment Type
              </label>
              <select
                {...register('employmentType')}
                className="w-full bg-[#F8F9FC] text-xs sm:text-sm font-semibold rounded-xl border border-[#E9ECF2] p-2.5 outline-none focus:border-[#25324B] focus:bg-white text-[#25324B] cursor-pointer"
              >
                <option value="Full Time">Full Time</option>
                <option value="Contract">Contract</option>
                <option value="Part Time">Part Time</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#25324B] mb-1">
                Location *
              </label>
              <input
                type="text"
                placeholder="e.g. Bengaluru, KA or Remote"
                {...register('location', { required: 'Location is required' })}
                className="w-full bg-[#F8F9FC] text-xs sm:text-sm font-semibold rounded-xl border border-[#E9ECF2] p-2.5 outline-none focus:border-[#25324B] focus:bg-white text-[#25324B]"
              />
              {errors.location && (
                <p className="mt-1 text-[11px] text-red-500 font-medium">
                  {errors.location.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 4: Salary Range & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#25324B] mb-1">
                Salary Range *
              </label>
              <input
                type="text"
                placeholder="e.g. $80k - $120k"
                {...register('salaryRange', { required: 'Salary range is required' })}
                className="w-full bg-[#F8F9FC] text-xs sm:text-sm font-semibold rounded-xl border border-[#E9ECF2] p-2.5 outline-none focus:border-[#25324B] focus:bg-white text-[#25324B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#25324B] mb-1">
                Experience Level *
              </label>
              <input
                type="text"
                placeholder="e.g. 2-5 years"
                {...register('experience', { required: 'Experience is required' })}
                className="w-full bg-[#F8F9FC] text-xs sm:text-sm font-semibold rounded-xl border border-[#E9ECF2] p-2.5 outline-none focus:border-[#25324B] focus:bg-white text-[#25324B]"
              />
            </div>
          </div>

          {/* Row 5: Status & Featured Checkbox */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            <div>
              <label className="block text-xs font-bold text-[#25324B] mb-1">
                Job Status
              </label>
              <select
                {...register('status')}
                className="w-full bg-[#F8F9FC] text-xs sm:text-sm font-semibold rounded-xl border border-[#E9ECF2] p-2.5 outline-none focus:border-[#25324B] focus:bg-white text-[#25324B] cursor-pointer"
              >
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div className="pt-5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  {...register('featured')}
                  className="w-4 h-4 rounded text-[#25324B] focus:ring-[#25324B] border-gray-300 accent-[#25324B]"
                />
                <span className="text-xs font-bold text-[#25324B]">
                  Feature this job (Highlight on top)
                </span>
              </label>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-xs font-bold text-[#25324B] mb-1">
              Job Description
            </label>
            <textarea
              rows={3}
              placeholder="Outline the responsibilities and scope of this role..."
              {...register('description')}
              className="w-full bg-[#F8F9FC] text-xs sm:text-sm font-medium rounded-xl border border-[#E9ECF2] p-2.5 outline-none focus:border-[#25324B] focus:bg-white text-[#25324B] resize-none"
            />
          </div>

          {/* Key Requirements */}
          <div>
            <label className="block text-xs font-bold text-[#25324B] mb-1">
              Key Requirements (comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g. React.js, TypeScript, REST APIs, Git"
              {...register('requirements')}
              className="w-full bg-[#F8F9FC] text-xs sm:text-sm font-medium rounded-xl border border-[#E9ECF2] p-2.5 outline-none focus:border-[#25324B] focus:bg-white text-[#25324B]"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F0F2F6]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#E9ECF2] text-[#515B6F] hover:bg-[#F8F9FC] text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#25324B] hover:bg-[#1C2638] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#25324B]/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? 'Save Changes' : 'Publish Job Posting'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
