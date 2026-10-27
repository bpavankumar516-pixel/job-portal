import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  getStoredNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearAllNotifications,
  formatRelativeTime,
} from '../../services/notificationService';
import {
  Search,
  Bell,
  ChevronDown,
  User,
  Building2,
  Briefcase,
  Shield,
  LogOut,
  Menu,
  CheckCheck,
  Trash2,
  UserCheck,
  Bookmark,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'react-toastify';

export const HeaderNavbar = ({
  onToggleSidebar,
  icon,
  title,
  subtitle,
  breadcrumb,
  searchPlaceholder = 'Search jobs, companies...',
  onSearch,
  rightAction,
}) => {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(() => getStoredNotifications());
  const [searchValue, setSearchValue] = useState('');
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  const displayName = user?.fullName || 'Pavan Kumar';
  const displayRole = user?.role || role || 'Recruiter';
  const displayInitial = displayName.charAt(0).toUpperCase();

  // Dynamic notification sync across window / storage events
  useEffect(() => {
    const handleSync = () => {
      setNotifications(getStoredNotifications());
    };
    window.addEventListener('notifications_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('notifications_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleNotificationClick = (item) => {
    markNotificationAsRead(item.id);
    setNotificationsOpen(false);
    if (item.link) {
      navigate(item.link);
    }
  };

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead();
    toast.success('All notifications marked as read');
  };

  const handleClearAll = () => {
    clearAllNotifications();
    toast.info('Notifications cleared');
  };

  const renderNotifIcon = (notif) => {
    const key = notif.iconType || notif.type;
    switch (key) {
      case 'application':
      case 'user-check':
        return (
          <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <UserCheck className="w-4 h-4 stroke-[2.2]" />
          </div>
        );
      case 'job':
      case 'briefcase':
        return (
          <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <Briefcase className="w-4 h-4 stroke-[2.2]" />
          </div>
        );
      case 'candidate':
      case 'user':
        return (
          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 stroke-[2.2]" />
          </div>
        );
      case 'company':
      case 'building':
        return (
          <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-4 h-4 stroke-[2.2]" />
          </div>
        );
      case 'bookmark':
        return (
          <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center flex-shrink-0">
            <Bookmark className="w-4 h-4 stroke-[2.2]" />
          </div>
        );
      case 'trash':
      case 'job_delete':
      case 'candidate_delete':
      case 'company_delete':
        return (
          <div className="w-8 h-8 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center flex-shrink-0">
            <Trash2 className="w-4 h-4 stroke-[2.2]" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 text-[#25324B] flex items-center justify-center flex-shrink-0">
            <Bell className="w-4 h-4 stroke-[2.2]" />
          </div>
        );
    }
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchValue);
    } else if (searchValue.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchValue)}`);
    }
  };

  return (
    <header className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-2">
      {/* Left: Mobile Menu Toggle + Tag / Breadcrumb + Heading + Subtitle */}
      <div className="flex items-start gap-3 flex-1 min-w-0">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-[#25324B] hover:bg-white transition-colors cursor-pointer border border-gray-200/80 bg-white shadow-2xs mt-0.5"
            aria-label="Open Navigation"
          >
            <Menu className="w-5 h-5 stroke-[2]" />
          </button>
        )}

        <div className="flex-1 min-w-0">
          {/* Breadcrumb if available (for detail pages) */}
          {breadcrumb && (
            <div className="flex items-center gap-1.5 text-xs text-[#7C8493] font-medium mb-1.5">
              {breadcrumb}
            </div>
          )}

          {/* Main Page Title with Icon directly beside it */}
          {title && (
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#25324B] tracking-tight leading-tight flex items-center gap-2.5 sm:gap-3 flex-wrap">
              {icon && (
                <span className="text-[#25324B] flex-shrink-0 inline-flex items-center">
                  {icon}
                </span>
              )}
              <span className="break-words">{title}</span>
            </h1>
          )}

          {/* Subtitle */}
          {subtitle && (
            <p className="text-xs sm:text-sm text-[#7C8493] mt-1 font-medium">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right Controls: Global Search, Notification Bell, Profile Badge & Optional Action Button */}
      <div className="flex items-center gap-3 self-end md:self-start flex-wrap sm:flex-nowrap pt-0.5">
        {/* Global Search Bar matching reference image */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative min-w-[210px] sm:min-w-[270px]"
        >
          <Search className="w-4 h-4 text-[#7C8493] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              if (onSearch) onSearch(e.target.value);
            }}
            placeholder={searchPlaceholder}
            className="w-full bg-white text-xs font-medium rounded-full border border-gray-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:border-[#CCD5E4] focus:border-[#25324B] focus:ring-2 focus:ring-[#25324B]/15 pl-10 pr-4 py-2 outline-none transition-all text-[#25324B] placeholder:text-[#A0AEC0]"
          />
        </form>

        {/* Dynamic Notifications Icon with Live Badge & Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-full bg-white border border-gray-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.04)] text-[#7C8493] hover:text-[#25324B] hover:bg-gray-50 transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 stroke-[2]" />
            {unreadCount > 0 && (
              <span className="min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-extrabold absolute -top-1 -right-1 flex items-center justify-center ring-2 ring-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2.5 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-[#E9ECF2] p-3.5 z-50 animate-fadeIn text-left text-xs max-h-[460px] flex flex-col">
              {/* Header: Title + Unread Count + Actions */}
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-gray-100 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-[#25324B] text-sm">Notifications</span>
                  {unreadCount > 0 ? (
                    <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-bold border border-red-100">
                      {unreadCount} New
                    </span>
                  ) : (
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-100">
                      All caught up
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllRead}
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer flex items-center gap-1"
                      title="Mark all as read"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Read All</span>
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearAll}
                      className="text-[11px] font-semibold text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Clear notifications"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Scrollable Notifications List */}
              <div className="overflow-y-auto space-y-2 pr-1 flex-1">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-[#7C8493]">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-[#25324B] flex items-center justify-center mx-auto mb-2">
                      <Bell className="w-5 h-5 text-slate-400 stroke-[1.8]" />
                    </div>
                    <p className="font-bold text-xs text-[#25324B]">No notifications yet</p>
                    <p className="text-[11px] text-[#7C8493] mt-0.5">
                      Actions taken across jobs, candidates, or companies will appear here in real-time.
                    </p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 group ${
                        notif.unread
                          ? 'bg-blue-50/40 hover:bg-blue-50/70 border-blue-100/80 shadow-2xs'
                          : 'bg-[#F8F9FC] hover:bg-gray-100/80 border-gray-100'
                      }`}
                    >
                      {renderNotifIcon(notif)}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-1">
                          <p
                            className={`text-xs truncate ${
                              notif.unread
                                ? 'font-bold text-[#25324B]'
                                : 'font-medium text-[#515B6F]'
                            }`}
                          >
                            {notif.title}
                          </p>
                          {notif.unread && (
                            <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-1" />
                          )}
                        </div>

                        <p className="text-[11px] text-[#7C8493] mt-0.5 line-clamp-2 leading-relaxed">
                          {notif.message}
                        </p>

                        <div className="flex items-center justify-between mt-1.5 pt-1 border-t border-gray-100/60">
                          <span className="text-[10px] text-gray-400 font-medium">
                            {formatRelativeTime(notif.timestamp) || notif.time}
                          </span>
                          <span className="text-[10px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            View details →
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Badge with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white hover:bg-gray-50 border border-gray-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all cursor-pointer focus:outline-none select-none"
          >
            <div className="w-7 h-7 rounded-full bg-[#25324B] text-white flex items-center justify-center font-extrabold text-xs flex-shrink-0">
              {displayInitial}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-[#25324B] leading-none">
                {displayName}
              </span>
              <span className="text-[10px] text-[#7C8493] font-semibold capitalize mt-0.5">
                {displayRole}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#7C8493]" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2.5 w-64 bg-white rounded-2xl shadow-xl border border-[#E9ECF2] p-2 z-50 animate-fadeIn text-left text-xs">
              <div className="p-2.5 bg-[#F8F9FC] rounded-xl mb-1.5 border border-gray-100">
                <p className="font-extrabold text-[#25324B]">{displayName}</p>
                <p className="text-[11px] text-[#7C8493] truncate">
                  {user?.email || 'recruiter@jobportal.com'}
                </p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold">
                  Verified Recruiter
                </span>
              </div>

              <div className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    navigate('/dashboard');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#515B6F] hover:text-[#25324B] hover:bg-[#F0F3F8] transition-colors font-medium cursor-pointer"
                >
                  <Briefcase className="w-4 h-4 text-[#7C8493]" />
                  <span>Dashboard Overview</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    navigate('/companies');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#515B6F] hover:text-[#25324B] hover:bg-[#F0F3F8] transition-colors font-medium cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-[#7C8493]" />
                  <span>Manage Companies</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    navigate('/jobs');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#515B6F] hover:text-[#25324B] hover:bg-[#F0F3F8] transition-colors font-medium cursor-pointer"
                >
                  <Briefcase className="w-4 h-4 text-[#7C8493]" />
                  <span>Job Postings</span>
                </button>
              </div>

              <div className="pt-1.5 mt-1 border-t border-[#F0F2F6]">
                <button
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Optional Right Action Button (e.g. + Add Company) */}
        {rightAction && <div>{rightAction}</div>}
      </div>
    </header>
  );
};
