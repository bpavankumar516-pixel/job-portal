import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Menu,
  Search,
  Bell,
  Sparkles,
  ChevronDown,
  LogOut,
  User,
  Shield,
  Briefcase,
  Check,
} from 'lucide-react';

export const DashboardHeader = ({ onMobileMenuToggle, searchQuery, onSearchChange }) => {
  const { user, logout, role, setActiveRole } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const isRecruiter = (user?.role || role) === 'recruiter';

  const notifications = [
    {
      id: 1,
      title: 'New application received',
      desc: 'Alex Morgan applied for Lead UI/UX Product Designer',
      time: '15m ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Company verified',
      desc: 'TechCorp Solutions hiring badge updated',
      time: '1h ago',
      unread: true,
    },
    {
      id: 3,
      title: 'Application status',
      desc: 'Cloud Security Analyst was successfully closed',
      time: '5h ago',
      unread: false,
    },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#E9ECF2] h-18 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu Toggle & Global Search Bar */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-xl">
        <button
          type="button"
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-xl text-[#25324B] hover:bg-[#F8F9FC] transition-colors cursor-pointer"
          aria-label="Open Sidebar Menu"
        >
          <Menu className="w-5 h-5 stroke-[2]" />
        </button>

        {/* Global Search Input */}
        <div className="relative w-full max-w-md hidden sm:block">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7C8493] pointer-events-none">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery || ''}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Search jobs, companies, candidates, skills..."
            className="w-full bg-[#F8F9FC] text-[#25324B] placeholder:text-[#A0AEC0] text-xs sm:text-sm font-medium rounded-xl border border-[#E9ECF2] hover:border-[#CCD5E4] focus:border-[#25324B] focus:bg-white focus:ring-3 focus:ring-[#25324B]/15 pl-10 pr-4 py-2 outline-none transition-all"
          />
        </div>
      </div>

      {/* Right: Actions, Notifications, Role Switcher & User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Role Toggle Pill Button */}
        <button
          type="button"
          onClick={() => setActiveRole(isRecruiter ? 'candidate' : 'recruiter')}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#CCD5E4] bg-[#F0F3F8] hover:bg-[#E2E8F0] text-xs font-extrabold text-[#25324B] transition-all cursor-pointer shadow-2xs"
          title="Click to toggle Recruiter / Candidate view"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#25324B]" />
          <span>Switch to {isRecruiter ? 'Candidate' : 'Recruiter'}</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2.5 rounded-xl text-[#7C8493] hover:text-[#25324B] hover:bg-[#F8F9FC] transition-colors relative cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5 stroke-[1.8]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#25324B] absolute top-2 right-2 ring-2 ring-white" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#E9ECF2] p-3 z-50 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#F0F2F6]">
                <span className="text-xs font-extrabold text-[#25324B]">Notifications</span>
                <span className="text-[11px] font-semibold text-[#7C8493] cursor-pointer hover:underline">
                  Mark all as read
                </span>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-xl text-left transition-colors ${
                      n.unread ? 'bg-[#F0F3F8]/70 border border-[#CCD5E4]/50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-[#25324B]">{n.title}</h4>
                      <span className="text-[10px] text-[#7C8493]">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-[#515B6F] mt-0.5">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#F8F9FC] transition-colors cursor-pointer group focus:outline-none"
          >
            <img
              src={
                user?.avatar ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                  user?.fullName || 'User'
                )}`
              }
              alt={user?.fullName || 'User'}
              className="w-9 h-9 rounded-xl object-cover border border-[#CCD5E4] group-hover:border-[#25324B] transition-colors"
            />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-extrabold text-[#25324B] leading-tight">
                {user?.fullName || 'Sarah Jenkins'}
              </span>
              <span className="text-[10px] font-semibold text-[#7C8493] capitalize">
                {user?.role || role}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#7C8493] group-hover:text-[#25324B]" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-[#E9ECF2] p-2 z-50 animate-fadeIn">
              <div className="p-3 border-b border-[#F0F2F6]">
                <p className="text-xs font-bold text-[#25324B]">{user?.fullName}</p>
                <p className="text-[11px] text-[#7C8493] truncate">{user?.email}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#F0F3F8] text-[#25324B]">
                  <Shield className="w-3 h-3" />
                  <span>{user?.role || role} account</span>
                </div>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveRole(isRecruiter ? 'candidate' : 'recruiter');
                    setDropdownOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-[#25324B] hover:bg-[#F0F3F8] rounded-xl transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#25324B]" />
                    <span>Switch Role</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold text-[#7C8493]">
                    {isRecruiter ? 'Candidate' : 'Recruiter'}
                  </span>
                </button>
              </div>

              <div className="pt-1 border-t border-[#F0F2F6]">
                <button
                  type="button"
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
