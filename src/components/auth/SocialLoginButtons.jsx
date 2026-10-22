import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const SocialLoginButtons = ({ role = 'recruiter' }) => {
  const { socialLogin } = useAuth();
  const navigate = useNavigate();
  const [loadingProvider, setLoadingProvider] = useState(null);

  const handleSocial = async (provider) => {
    try {
      setLoadingProvider(provider);
      await socialLogin(provider, role);
      navigate('/dashboard');
    } catch {
      // toast already handled in AuthContext
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="w-full mt-3">
      {/* Divider */}
      <div className="relative flex items-center justify-center my-3">
        <div className="border-t border-[#E5E7EB] w-full" />
        <span className="bg-white px-2.5 text-[10px] font-medium text-[#7C8493] uppercase tracking-wider absolute">
          or continue with
        </span>
      </div>

      {/* 3 Buttons Grid */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Google */}
        <button
          type="button"
          onClick={() => handleSocial('google')}
          disabled={loadingProvider !== null}
          className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border border-[#D6DDEB] bg-white hover:bg-[#F9FAFC] hover:border-[#25324B]/30 transition-all text-xs font-semibold text-[#25324B] shadow-2xs disabled:opacity-50 cursor-pointer"
        >
          {loadingProvider === 'google' ? (
            <span className="w-3.5 h-3.5 border-2 border-gray-400 border-t-[#25324B] rounded-full animate-spin" />
          ) : (
            <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
          )}
          <span>Google</span>
        </button>

        {/* LinkedIn */}
        <button
          type="button"
          onClick={() => handleSocial('linkedin')}
          disabled={loadingProvider !== null}
          className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border border-[#D6DDEB] bg-white hover:bg-[#F9FAFC] hover:border-[#25324B]/30 transition-all text-xs font-semibold text-[#25324B] shadow-2xs disabled:opacity-50 cursor-pointer"
        >
          {loadingProvider === 'linkedin' ? (
            <span className="w-3.5 h-3.5 border-2 border-gray-400 border-t-[#0077B5] rounded-full animate-spin" />
          ) : (
            <svg className="w-3.5 h-3.5 flex-shrink-0 fill-[#0077B5]" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
            </svg>
          )}
          <span>LinkedIn</span>
        </button>

        {/* GitHub */}
        <button
          type="button"
          onClick={() => handleSocial('github')}
          disabled={loadingProvider !== null}
          className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border border-[#D6DDEB] bg-white hover:bg-[#F9FAFC] hover:border-[#25324B]/30 transition-all text-xs font-semibold text-[#25324B] shadow-2xs disabled:opacity-50 cursor-pointer"
        >
          {loadingProvider === 'github' ? (
            <span className="w-3.5 h-3.5 border-2 border-gray-400 border-t-[#24292e] rounded-full animate-spin" />
          ) : (
            <svg className="w-3.5 h-3.5 flex-shrink-0 fill-[#24292e]" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          )}
          <span>GitHub</span>
        </button>
      </div>
    </div>
  );
};
