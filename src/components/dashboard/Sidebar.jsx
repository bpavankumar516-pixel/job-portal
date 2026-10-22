import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Building2,
  Briefcase,
  Search,
  User,
  FileText,
  Bookmark,
  BarChart3,
  LogOut,
  X,
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout, role } = useAuth();

  const navItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      to: '/dashboard',
    },
    {
      label: 'Companies',
      icon: Building2,
      to: '/companies',
    },
    {
      label: 'Job Postings',
      icon: Briefcase,
      to: '/jobs',
    },
    {
      label: 'Job Search',
      icon: Search,
      to: '/job-search',
    },
    {
      label: 'Candidate Profile',
      icon: User,
      to: '/candidate-profile',
    },
    {
      label: 'Applications',
      icon: FileText,
      to: '/applications',
    },
    {
      label: 'Saved Jobs',
      icon: Bookmark,
      to: '/saved-jobs',
    },
    {
      label: 'Reports',
      icon: BarChart3,
      to: '/reports',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container with Dark Slate #25324B */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 xl:w-72 bg-[#25324B] flex flex-col justify-between p-6 transition-transform duration-300 ease-in-out select-none flex-shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Top Logo matching image */}
          <div className="flex items-center justify-between pb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-[#25324B] flex items-center justify-center shadow-md">
                <Briefcase className="w-5 h-5 stroke-[2.3]" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xl font-extrabold text-white tracking-tight leading-none">
                  JobPortal
                </span>
                <span className="text-xs font-medium text-slate-300 mt-1 capitalize tracking-wide">
                  {role === 'candidate' ? 'Candidate Portal' : 'Recruiter Portal'}
                </span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close Sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  onClick={() => onClose && onClose()}
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all group ${
                      isActive
                        ? 'bg-white text-[#25324B] shadow-sm font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`w-5 h-5 transition-transform group-hover:scale-105 ${
                          isActive ? 'text-[#25324B]' : 'text-slate-300 group-hover:text-white'
                        }`}
                      />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom User info & Logout Button */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <div className="flex items-center gap-3 px-1">
            <div className="w-8 h-8 rounded-full bg-white text-[#25324B] flex items-center justify-center font-extrabold text-xs flex-shrink-0">
              {(user?.fullName || 'Pavan Kumar').charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs font-bold text-white truncate leading-tight">
                {user?.fullName || 'Pavan Kumar'}
              </span>
              <span className="text-[10px] text-slate-300 truncate">
                {user?.email || 'recruiter@jobportal.com'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-colors font-semibold text-xs sm:text-sm cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
