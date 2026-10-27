import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

export const DeleteJobModal = ({ isOpen, onClose, onConfirm, job, isBulk = false, count = 1 }) => {
  if (!isOpen) return null;
  if (!isBulk && !job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 relative shadow-2xl border border-[#E9ECF2] text-center">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-100">
          <Trash2 className="w-7 h-7" />
        </div>

        <h3 className="text-lg font-extrabold text-[#25324B] mb-2">
          {isBulk ? `Delete ${count} Job Postings?` : 'Delete Job Posting?'}
        </h3>
        <p className="text-xs sm:text-sm text-[#7C8493] mb-6 leading-relaxed">
          {isBulk ? (
            <>
              Are you sure you want to delete <strong className="text-[#25324B]">{count} selected job postings</strong>? This action cannot be undone and will permanently remove them from the portal.
            </>
          ) : (
            <>
              Are you sure you want to delete <strong className="text-[#25324B]">"{job?.title}"</strong>
              {job?.companyName ? ` at ${job.companyName}` : ''}? This action will permanently remove this posting from the recruiter portal.
            </>
          )}
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-[#E9ECF2] text-xs font-bold text-[#515B6F] hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(isBulk ? null : job?.id)}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/20 transition-all cursor-pointer"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
};
