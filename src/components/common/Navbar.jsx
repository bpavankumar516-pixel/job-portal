import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BrandLogo } from '../auth/BrandLogo';
import {
  LogOut,
  User,
  Shield,
  Briefcase,
  ChevronDown,
  Bell,
  Settings,
  Sparkles,
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout, role, setActiveRole } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleRole = () => {
    const newRole = role === 'recruiter' ? 'candidate' : 'recruiter';
    setActiveRole(newRole);
  };

  return (
    <header className="bg-white border-b border-[#E9ECF2] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <BrandLogo role={user?.role || role} size="normal" />

          {/* Role badge in Slate #25324B */}
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-[#F0F3F8] text-[#25324B] border border-[#CCD5E4]">
            <Shield className="w-3.5 h-3.5" />
            <span>{user?.role || role} Mode</span>
          </span>
        </div>

        {/* Right Action Icons & User Dropdown */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Role switch toggle helper for demo testing */}
          <button
            type="button"
            onClick={toggleRole}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D6DDEB] hover:border-[#25324B] text-xs font-semibold text-[#25324B] hover:text-[#1B2537] transition-all bg-[#F8F9FC] cursor-pointer"
            title="Switch demo role perspective"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#25324B]" />
            <span>Switch to {role === 'recruiter' ? 'Candidate' : 'Recruiter'} View</span>
          </button>

          {/* Notifications icon */}
          <button
            type="button"
            className="p-2 rounded-xl text-[#7C8493] hover:text-[#25324B] hover:bg-[#F8F9FC] transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 stroke-[1.8]" />
            <span className="w-2 h-2 rounded-full bg-[#25324B] absolute top-2 right-2 ring-2 ring-white" />
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-[#F8F9FC] transition-colors cursor-pointer group focus:outline-none"
            >
              <img
                src={
                  user?.avatar ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                    user?.fullName || 'User'
                  )}`
                }
                alt={user?.fullName || 'User'}
                className="w-9 h-9 rounded-xl object-cover border border-[#D6DDEB] group-hover:border-[#25324B] transition-colors"
              />
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-[#25324B] leading-tight">
                  {user?.fullName || 'Signed In User'}
                </span>
                <span className="text-[11px] text-[#7C8493] capitalize">
                  {user?.role || role}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-[#7C8493] group-hover:text-[#25324B] transition-transform" />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E9ECF2] p-2 z-50 animate-fadeIn">
                <div className="p-3 border-b border-[#F0F2F6]">
                  <p className="text-xs font-semibold text-[#7C8493]">
                    Signed in as
                  </p>
                  <p className="text-sm font-bold text-[#25324B] truncate">
                    {user?.email}
                  </p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-[#F0F3F8] text-[#25324B] border border-[#CCD5E4]">
                    {user?.role || role} Account
                  </span>
                </div>

                <div className="py-1">
                  <div className="px-3 py-2 text-xs text-[#515B6F] flex items-center gap-2">
                    <User className="w-4 h-4 text-[#7C8493]" />
                    <span>Profile (Module 6 Ready)</span>
                  </div>
                  <div className="px-3 py-2 text-xs text-[#515B6F] flex items-center gap-2">
                    <Settings className="w-4 h-4 text-[#7C8493]" />
                    <span>Account Settings</span>
                  </div>
                </div>

                <div className="pt-1 border-t border-[#F0F2F6]">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out (Logout)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
