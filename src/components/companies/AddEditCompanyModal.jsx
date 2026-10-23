import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Building2, Plus, Check } from 'lucide-react';

export const AddEditCompanyModal = ({
  isOpen,
  onClose,
  onSubmitCompany,
  initialData = null,
}) => {
  const isEditing = Boolean(initialData);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      industry: 'Technology',
      location: '',
      website: '',
      email: '',
      employees: '1,001 - 5,000 employees',
      description: '',
      status: 'Active',
      logo: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || '',
        industry: initialData.industry || 'Technology',
        location: initialData.location || '',
        website: initialData.website || '',
        email: initialData.email || '',
        employees: initialData.employees || '1,001 - 5,000 employees',
        description: initialData.description || '',
        status: initialData.status || 'Active',
        logo: initialData.logo || '',
      });
    } else {
      reset({
        name: '',
        industry: 'Technology',
        location: '',
        website: '',
        email: '',
        employees: '1,001 - 5,000 employees',
        description: '',
        status: 'Active',
        logo: '',
      });
    }
  }, [initialData, reset, isOpen]);

  if (!isOpen) return null;

  const onFormSubmit = async (data) => {
    await onSubmitCompany(data);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-xl p-6 sm:p-8 relative shadow-2xl border border-[#E9ECF2] max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#7C8493] hover:text-[#25324B] hover:bg-[#F8F9FC] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#F0F3F8] text-[#25324B] flex items-center justify-center border border-[#CCD5E4]">
            <Building2 className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-[#25324B]">
              {isEditing ? 'Edit Company Profile' : 'Add New Company'}
            </h3>
            <p className="text-xs text-[#7C8493]">
              {isEditing
                ? 'Update corporate information, location and contact data'
                : 'Register a new hiring partner and company profile'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          {/* Company Name */}
          <div>
            <label className="block text-xs font-bold text-[#25324B] mb-1">
              Company Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Stripe Solutions"
              {...register('name', { required: 'Company name is required' })}
              className="w-full bg-[#F8F9FC] text-xs sm:text-sm font-semibold rounded-xl border border-[#E9ECF2] p-2.5 outline-none focus:border-[#25324B] focus:bg-white text-[#25324B]"
            />
            {errors.name && (
              <p className="mt-1 text-[11px] text-red-500 font-medium">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Row 2: Industry & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#25324B] mb-1">
                Industry
              </label>
              <select
                {...register('industry')}
                className="w-full bg-[#F8F9FC] text-xs sm:text-sm font-semibold rounded-xl border border-[#E9ECF2] p-2.5 outline-none focus:border-[#25324B] focus:bg-white text-[#25324B] cursor-pointer"
              >
                <option value="Technology">Technology</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Social Media">Social Media</option>
                <option value="Consumer Electronics">Consumer Electronics</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Music & Audio">Music & Audio</option>
                <option value="IT Services">IT Services</option>
                <option value="Financial Services">Financial Services</option>
                <option value="Automotive">Automotive</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#25324B] mb-1">
                Status
              </label>
              <select
                {...register('status')}
                className="w-full bg-[#F8F9FC] text-xs sm:text-sm font-semibold rounded-xl border border-[#E9ECF2] p-2.5 outline-none focus:border-[#25324B] focus:bg-white text-[#25324B] cursor-pointer"
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Row 3: Location & Employees */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#25324B] mb-1">
                Headquarters Location *
              </label>
              <input
                type="text"
                placeholder="e.g. San Francisco, CA"
                {...register('location', { required: 'Location is required' })}
                className="w-full bg-[#F8F9FC] text-xs sm:text-sm font-semibold rounded-xl border border-[#E9ECF2] p-2.5 outline-none focus:border-[#25324B] focus:bg-white text-[#25324B]"
              />
              {errors.location && (
                <p className="mt-1 text-[11px] text-red-500 font-medium">
                  {errors.location.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#25324B] mb-1">
                Company Size (Employees)
              </label>
              <select
                {...register('employees')}
                className="w-full bg-[#F8F9FC] text-xs sm:text-sm font-semibold rounded-xl border border-[#E9ECF2] p-2.5 outline-none focus:border-[#25324B] focus:bg-white text-[#25324B] cursor-pointer"
              >
                <option value="1 - 50 employees">1 - 50 employees</option>
                <option value="51 - 250 employees">51 - 250 employees</option>
                <option value="251 - 1,000 employees">251 - 1,000 employees</option>
                <option value="1,001 - 5,000 employees">1,001 - 5,000 employees</option>
                <option value="5,001 - 10,000 employees">5,001 - 10,000 employees</option>
                <option value="10,001+ employees">10,001+ employees</option>
              </select>
            </div>
          </div>

          {/* Row 4: Website & Contact Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#25324B] mb-1">
                Website
              </label>
              <input
                type="text"
                placeholder="e.g. www.stripe.com"
                {...register('website')}
                className="w-full bg-[#F8F9FC] text-xs sm:text-sm font-semibold rounded-xl border border-[#E9ECF2] p-2.5 outline-none focus:border-[#25324B] focus:bg-white text-[#25324B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#25324B] mb-1">
                Contact Email
              </label>
              <input
                type="email"
                placeholder="e.g. careers@stripe.com"
                {...register('email')}
                className="w-full bg-[#F8F9FC] text-xs sm:text-sm font-semibold rounded-xl border border-[#E9ECF2] p-2.5 outline-none focus:border-[#25324B] focus:bg-white text-[#25324B]"
              />
            </div>
          </div>

          {/* Logo URL */}
          <div>
            <label className="block text-xs font-bold text-[#25324B] mb-1">
              Logo Image URL (Optional)
            </label>
            <input
              type="url"
              placeholder="https://example.com/logo.png (leave blank for auto avatar)"
              {...register('logo')}
              className="w-full bg-[#F8F9FC] text-xs sm:text-sm font-semibold rounded-xl border border-[#E9ECF2] p-2.5 outline-none focus:border-[#25324B] focus:bg-white text-[#25324B]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[#25324B] mb-1">
              Company Description *
            </label>
            <textarea
              rows="3"
              placeholder="Brief overview of the company, mission, and culture..."
              {...register('description', { required: 'Description is required' })}
              className="w-full bg-[#F8F9FC] text-xs sm:text-sm font-medium rounded-xl border border-[#E9ECF2] p-2.5 outline-none focus:border-[#25324B] focus:bg-white text-[#25324B] resize-none"
            />
            {errors.description && (
              <p className="mt-1 text-[11px] text-red-500 font-medium">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Actions */}
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
              className="px-6 py-2.5 rounded-xl bg-[#25324B] hover:bg-[#1C2638] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#25324B]/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isEditing ? (
                <>
                  <Check className="w-4 h-4 stroke-[2.2]" />
                  <span>Update Company</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 stroke-[2.2]" />
                  <span>Save Company</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
