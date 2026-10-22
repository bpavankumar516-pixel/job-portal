import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/common/Navbar';
import {
  CheckCircle2,
  Shield,
  Briefcase,
  Users,
  Building,
  FileText,
  Bookmark,
  LogOut,
  Sparkles,
  ArrowRight,
  Database,
  Lock,
} from 'lucide-react';

export const Dashboard = () => {
  const { user, logout, role } = useAuth();
  const isRecruiter = (user?.role || role) === 'recruiter';

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Welcome Banner in Slate #25324B */}
        <div className="bg-gradient-to-r from-white via-white to-[#F0F3F8] rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E9ECF2] relative overflow-hidden mb-8">
          <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-[#E6EAF2] to-transparent opacity-60 pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <img
                src={
                  user?.avatar ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                    user?.fullName || 'User'
                  )}`
                }
                alt={user?.fullName || 'User'}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#25324B] shadow-md"
              />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#25324B]">
                    Welcome back, {user?.fullName}!
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F0F3F8] text-[#25324B] border border-[#CCD5E4]">
                    {user?.role}
                  </span>
                </div>
                <p className="text-sm text-[#515B6F]">
                  You are securely signed in via{' '}
                  <span className="font-semibold text-[#25324B]">
                    Local Storage Session
                  </span>
                  . Module 1 Authentication is fully functional.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-200 bg-white hover:bg-red-50 text-red-600 font-bold text-sm transition-colors shadow-2xs cursor-pointer flex-shrink-0"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Module 1 Verification Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E9ECF2] mb-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F0F3F8] text-[#25324B] flex items-center justify-center border border-[#CCD5E4]">
                <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#25324B]">
                  Module 1: Authentication Completed
                </h3>
                <p className="text-xs text-[#7C8493]">
                  Styled exclusively in Slate #25324B theme with Local Storage & Context API
                </p>
              </div>
            </div>

            <span className="px-3 py-1 bg-[#F0F3F8] text-[#25324B] text-xs font-bold rounded-full border border-[#CCD5E4]">
              Active Status: Verified & Secured
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#F8F9FC] border border-[#E9ECF2] flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#25324B] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-[#25324B]">
                  Static Auth & LocalStorage
                </h4>
                <p className="text-xs text-[#515B6F] mt-0.5">
                  Users DB, active session, tokens, and remembered preferences persisted in local storage.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F9FC] border border-[#E9ECF2] flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#25324B] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-[#25324B]">
                  Role Selection
                </h4>
                <p className="text-xs text-[#515B6F] mt-0.5">
                  Dynamic toggling between Recruiter & Candidate with customized copy, icons, and routing.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F9FC] border border-[#E9ECF2] flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#25324B] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-[#25324B]">
                  React Hook Form & Validation
                </h4>
                <p className="text-xs text-[#515B6F] mt-0.5">
                  Strict email regex, minimum password lengths, confirmation matching, and alert displays.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F9FC] border border-[#E9ECF2] flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#25324B] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-[#25324B]">
                  Password Show / Hide
                </h4>
                <p className="text-xs text-[#515B6F] mt-0.5">
                  Interactive visibility toggles with Lucide eye icons across all auth forms.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F9FC] border border-[#E9ECF2] flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#25324B] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-[#25324B]">
                  Forgot Password UI
                </h4>
                <p className="text-xs text-[#515B6F] mt-0.5">
                  Modal & dedicated route workflows with simulated verification and instant reset.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F9FC] border border-[#E9ECF2] flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#25324B] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-[#25324B]">
                  Protected Routes & Toastify
                </h4>
                <p className="text-xs text-[#515B6F] mt-0.5">
                  Guarded dashboard, redirect return paths, and toast notifications on all auth events.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* User Session Info Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E9ECF2] lg:col-span-1">
            <h3 className="text-base font-bold text-[#25324B] mb-4 flex items-center gap-2">
              <Database className="w-4 h-4 text-[#25324B]" />
              <span>Current Session Details</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-[#F0F2F6]">
                <span className="text-[#7C8493]">User ID:</span>
                <span className="font-mono text-[#25324B]">{user?.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#F0F2F6]">
                <span className="text-[#7C8493]">Full Name:</span>
                <span className="font-bold text-[#25324B]">{user?.fullName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#F0F2F6]">
                <span className="text-[#7C8493]">Email Address:</span>
                <span className="font-semibold text-[#25324B]">{user?.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#F0F2F6]">
                <span className="text-[#7C8493]">Active Role:</span>
                <span className="font-bold text-[#25324B] uppercase">
                  {user?.role}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[#7C8493]">Storage Engine:</span>
                <span className="font-semibold text-emerald-600">
                  Window.localStorage
                </span>
              </div>
            </div>
          </div>

          {/* Next Modules Roadmap Preview */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E9ECF2] lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#25324B] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#25324B]" />
                <span>Next Modules Pipeline</span>
              </h3>
              <span className="text-xs text-[#7C8493]">
                Ready for subsequent implementation
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-dashed border-[#D6DDEB] bg-[#FAFAFC]">
                <div className="font-bold text-[#25324B] mb-1">
                  Module 2: Dashboard Statistics
                </div>
                <p className="text-[#515B6F]">
                  Total companies, active jobs, candidates, and interactive quick action cards.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-dashed border-[#D6DDEB] bg-[#FAFAFC]">
                <div className="font-bold text-[#25324B] mb-1">
                  Module 3: Company Management
                </div>
                <p className="text-[#515B6F]">
                  Third-party API integration with search, filter by industry, pagination, add/edit.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-dashed border-[#D6DDEB] bg-[#FAFAFC]">
                <div className="font-bold text-[#25324B] mb-1">
                  Module 4 & 5: Job Posting & Search
                </div>
                <p className="text-[#515B6F]">
                  Create job postings, filter by location, salary range, experience, and detail view.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-dashed border-[#D6DDEB] bg-[#FAFAFC]">
                <div className="font-bold text-[#25324B] mb-1">
                  Module 6, 7 & 8: Profile & Reports
                </div>
                <p className="text-[#515B6F]">
                  Candidate profiles, job applications tracker, saved jobs, and monthly analytics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
