import React, { useState, useEffect } from 'react';
import { X, UserPlus, Edit3, Check, Sparkles } from 'lucide-react';

const COMMON_ROLES = [
  'Frontend Developer',
  'Software Engineer',
  'Backend Developer',
  'Full Stack Developer',
  'UI/UX Designer',
  'DevOps Engineer',
  'Data Scientist',
  'Cloud Solutions Architect',
  'QA Automation Engineer',
  'Mobile App Developer (React Native)',
  'Product Manager',
];

export const AddEditCandidateModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}) => {
  const isEditing = Boolean(initialData);

  const [formData, setFormData] = useState({
    name: '',
    role: 'Frontend Developer',
    email: '',
    phone: '',
    location: 'Bengaluru, KA',
    experienceYears: '3+ Years',
    currentCompany: 'TechCorp Solutions',
    noticePeriod: '15 Days',
    expectedSalary: '₹ 10 - 15 LPA',
    rating: '4.5',
    status: 'Active',
    skills: 'React.js, JavaScript, Tailwind CSS, Redux, REST APIs',
    bio: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        role: initialData.role || 'Frontend Developer',
        email: initialData.email || '',
        phone: initialData.phone || '',
        location: initialData.location || 'Bengaluru, KA',
        experienceYears: initialData.experienceYears || '3+ Years',
        currentCompany: initialData.workHistory?.[0]?.company || 'TechCorp Solutions',
        noticePeriod: initialData.noticePeriod || '15 Days',
        expectedSalary: initialData.expectedSalary || '₹ 10 - 15 LPA',
        rating: initialData.rating || '4.5',
        status: initialData.status || 'Active',
        skills: Array.isArray(initialData.skills)
          ? initialData.skills.join(', ')
          : initialData.skills || '',
        bio: initialData.bio || '',
      });
    } else {
      setFormData({
        name: '',
        role: 'Frontend Developer',
        email: '',
        phone: '+91 98765 43210',
        location: 'Bengaluru, KA',
        experienceYears: '3+ Years',
        currentCompany: 'TechCorp Solutions',
        noticePeriod: '15 Days',
        expectedSalary: '₹ 10 - 15 LPA',
        rating: '4.5',
        status: 'Active',
        skills: 'React.js, JavaScript, Tailwind CSS, Redux, REST APIs',
        bio: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Candidate full name is required';
    if (!formData.role.trim()) newErrors.role = 'Role / Title is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
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
        <div className="flex items-center gap-3.5 mb-6 text-left">
          <div className="w-12 h-12 rounded-2xl bg-[#25324B] text-white flex items-center justify-center shadow-md">
            {isEditing ? <Edit3 className="w-6 h-6 stroke-[2.2]" /> : <UserPlus className="w-6 h-6 stroke-[2.2]" />}
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#25324B] tracking-tight">
              {isEditing ? 'Edit Candidate Profile' : 'Add New Candidate'}
            </h2>
            <p className="text-xs text-[#7C8493] mt-0.5">
              {isEditing
                ? 'Update candidate skillset, contact info and career highlights.'
                : 'Create a new candidate profile in your talent pool using DummyJSON API.'}
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Row 1: Name & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#25324B] mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Rahul Sharma"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold outline-none transition-all ${
                  errors.name
                    ? 'border-rose-400 focus:ring-2 focus:ring-rose-200'
                    : 'border-[#E9ECF2] focus:border-[#25324B] focus:ring-2 focus:ring-[#25324B]/10'
                }`}
              />
              {errors.name && <span className="text-[11px] text-rose-500 font-medium mt-1 block">{errors.name}</span>}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#25324B] mb-1.5">
                Role / Designation <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="role"
                  list="roles-list"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="e.g. Frontend Developer"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold outline-none transition-all ${
                    errors.role
                      ? 'border-rose-400 focus:ring-2 focus:ring-rose-200'
                      : 'border-[#E9ECF2] focus:border-[#25324B] focus:ring-2 focus:ring-[#25324B]/10'
                  }`}
                />
                <datalist id="roles-list">
                  {COMMON_ROLES.map((r) => (
                    <option key={r} value={r} />
                  ))}
                </datalist>
              </div>
              {errors.role && <span className="text-[11px] text-rose-500 font-medium mt-1 block">{errors.role}</span>}
            </div>
          </div>

          {/* Row 2: Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#25324B] mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="candidate@example.com"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold outline-none transition-all ${
                  errors.email
                    ? 'border-rose-400 focus:ring-2 focus:ring-rose-200'
                    : 'border-[#E9ECF2] focus:border-[#25324B] focus:ring-2 focus:ring-[#25324B]/10'
                }`}
              />
              {errors.email && <span className="text-[11px] text-rose-500 font-medium mt-1 block">{errors.email}</span>}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#25324B] mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9ECF2] focus:border-[#25324B] focus:ring-2 focus:ring-[#25324B]/10 text-xs font-semibold outline-none transition-all"
              />
            </div>
          </div>

          {/* Row 3: Location & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#25324B] mb-1.5">
                Location (City, State) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Bengaluru, KA or Remote"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold outline-none transition-all ${
                  errors.location
                    ? 'border-rose-400 focus:ring-2 focus:ring-rose-200'
                    : 'border-[#E9ECF2] focus:border-[#25324B] focus:ring-2 focus:ring-[#25324B]/10'
                }`}
              />
              {errors.location && <span className="text-[11px] text-rose-500 font-medium mt-1 block">{errors.location}</span>}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#25324B] mb-1.5">
                Experience Years
              </label>
              <select
                name="experienceYears"
                value={formData.experienceYears}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9ECF2] focus:border-[#25324B] focus:ring-2 focus:ring-[#25324B]/10 text-xs font-semibold outline-none bg-white cursor-pointer"
              >
                <option value="1+ Year">1+ Year</option>
                <option value="2+ Years">2+ Years</option>
                <option value="3+ Years">3+ Years</option>
                <option value="4+ Years">4+ Years</option>
                <option value="5+ Years">5+ Years</option>
                <option value="6+ Years">6+ Years</option>
                <option value="8+ Years">8+ Years</option>
              </select>
            </div>
          </div>

          {/* Row 4: Company & Notice Period */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#25324B] mb-1.5">
                Current / Prev Company
              </label>
              <input
                type="text"
                name="currentCompany"
                value={formData.currentCompany}
                onChange={handleChange}
                placeholder="e.g. TechCorp Solutions"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9ECF2] focus:border-[#25324B] focus:ring-2 focus:ring-[#25324B]/10 text-xs font-semibold outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#25324B] mb-1.5">
                Notice Period
              </label>
              <select
                name="noticePeriod"
                value={formData.noticePeriod}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9ECF2] focus:border-[#25324B] focus:ring-2 focus:ring-[#25324B]/10 text-xs font-semibold outline-none bg-white cursor-pointer"
              >
                <option value="Immediately">Immediately</option>
                <option value="15 Days">15 Days</option>
                <option value="30 Days">30 Days</option>
                <option value="60 Days">60 Days</option>
                <option value="Serving Notice">Serving Notice</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#25324B] mb-1.5">
                Expected Salary
              </label>
              <input
                type="text"
                name="expectedSalary"
                value={formData.expectedSalary}
                onChange={handleChange}
                placeholder="e.g. ₹ 10 - 15 LPA"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9ECF2] focus:border-[#25324B] focus:ring-2 focus:ring-[#25324B]/10 text-xs font-semibold outline-none transition-all"
              />
            </div>
          </div>

          {/* Row 5: Skills (comma separated) */}
          <div>
            <label className="block text-xs font-bold text-[#25324B] mb-1.5">
              Technical Skills <span className="text-[#7C8493] font-normal">(comma-separated)</span>
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="React.js, Node.js, JavaScript, Tailwind CSS, SQL"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9ECF2] focus:border-[#25324B] focus:ring-2 focus:ring-[#25324B]/10 text-xs font-semibold outline-none transition-all"
            />
            <p className="text-[11px] text-[#7C8493] mt-1">
              Separate each skill with a comma to generate skill badges automatically.
            </p>
          </div>

          {/* Row 6: Bio / Professional Summary */}
          <div>
            <label className="block text-xs font-bold text-[#25324B] mb-1.5">
              Professional Summary / Bio
            </label>
            <textarea
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleChange}
              placeholder="Brief overview of candidate's technical expertise, achievements, and career focus..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9ECF2] focus:border-[#25324B] focus:ring-2 focus:ring-[#25324B]/10 text-xs font-medium outline-none transition-all resize-none"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-[#F0F2F6] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl border border-[#E9ECF2] text-xs font-bold text-[#515B6F] hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#25324B] hover:bg-[#1C2638] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isEditing ? 'Update Candidate' : 'Create Candidate'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
