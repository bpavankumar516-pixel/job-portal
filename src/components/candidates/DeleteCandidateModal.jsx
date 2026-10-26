import React, { useState } from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

export const DeleteCandidateModal = ({
  isOpen,
  onClose,
  onConfirm,
  candidate,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !candidate) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm(candidate.id, candidate.name);
      onClose();
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-7 relative shadow-2xl border border-[#E9ECF2] text-left">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#7C8493] hover:text-[#25324B] hover:bg-[#F8F9FC] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Icon & Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0 border border-rose-100 shadow-2xs">
            <Trash2 className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-[#25324B] tracking-tight">
              Delete Candidate
            </h3>
            <p className="text-xs text-[#7C8493] mt-0.5">
              This action will remove the candidate from your directory and pipeline.
            </p>
          </div>
        </div>

        {/* Candidate Preview Box */}
        <div className="p-3.5 rounded-2xl bg-[#F8F9FC] border border-gray-100 flex items-center gap-3 my-4">
          <div className="w-11 h-11 rounded-xl bg-white border border-gray-200 overflow-hidden flex items-center justify-center font-extrabold text-sm text-[#25324B] flex-shrink-0 shadow-2xs">
            {candidate.avatar ? (
              <img src={candidate.avatar} alt={candidate.name} className="w-full h-full object-cover" />
            ) : (
              <span>{candidate.name?.charAt(0) || 'C'}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-extrabold text-[#25324B] truncate">{candidate.name}</h4>
            <p className="text-xs text-blue-600 font-bold truncate">{candidate.role}</p>
            <p className="text-[11px] text-[#7C8493] truncate">{candidate.email}</p>
          </div>
        </div>

        {/* Warning Note */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 text-amber-800 text-xs font-medium border border-amber-200/80 mb-5">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>Note: DummyJSON DELETE API will be called to simulate candidate removal.</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2.5 rounded-xl border border-[#E9ECF2] text-xs font-bold text-[#515B6F] hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Delete Candidate</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
