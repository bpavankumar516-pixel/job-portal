import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export const DeleteCompanyModal = ({ isOpen, onClose, onConfirm, company }) => {
  if (!isOpen || !company) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-7 relative shadow-2xl border border-[#E9ECF2] text-center">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon */}
        <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-100 shadow-2xs">
          <Trash2 className="w-6 h-6 stroke-[2]" />
        </div>

        <h3 className="text-lg font-extrabold text-[#25324B] mb-1">
          Delete {company.name}?
        </h3>
        <p className="text-xs text-[#515B6F] mb-6 leading-relaxed">
          Are you sure you want to remove <strong className="text-[#25324B]">{company.name}</strong> from the database? This action cannot be undone.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-[#CCD5E4] text-xs font-bold text-[#515B6F] hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(company.id);
              onClose();
            }}
            className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/20 transition-all cursor-pointer"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};
