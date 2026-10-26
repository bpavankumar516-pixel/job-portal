import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Sidebar } from '../components/dashboard/Sidebar';
import { HeaderNavbar } from '../components/common/HeaderNavbar';
import { AddEditCandidateModal } from '../components/candidates/AddEditCandidateModal';
import { DeleteCandidateModal } from '../components/candidates/DeleteCandidateModal';
import { useCandidates } from '../context/CandidatesContext';
import {
  ArrowLeft,
  Star,
  MessageSquare,
  MoreVertical,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Globe,
  Download,
  Briefcase,
  GraduationCap,
  Sparkles,
  Send,
  X,
  CheckCircle2,
  Share2,
  Copy,
  Clock,
  DollarSign,
  UserCheck,
  Building2,
  FileText,
  Users,
  Search,
  Edit3,
  Trash2,
} from 'lucide-react';
import { toast } from 'react-toastify';

const LinkedInIcon = () => (
  <svg className="w-4 h-4 fill-[#0A66C2]" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
  </svg>
);

export const CandidateProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Candidates Context Hook (Powered by DummyJSON Users API)
  const {
    candidates,
    loading,
    error,
    selectedCandidate,
    selectCandidate,
    getCandidate,
    updateCandidate,
    deleteCandidate,
    toggleShortlist,
    isShortlisted,
    sendMessage,
  } = useCandidates();

  // Active Tab: 'overview' | 'experience' | 'education' | 'skills' | 'applications'
  const [activeTab, setActiveTab] = useState('overview');

  // Modals & Popovers
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageSubject, setMessageSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [switcherSearch, setSwitcherSearch] = useState('');
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Sync candidate if ID in URL parameter changes
  useEffect(() => {
    if (id) {
      getCandidate(id);
    }
  }, [id, getCandidate]);

  const candidate = selectedCandidate || candidates[0];
  const shortlisted = candidate ? isShortlisted(candidate.id) : false;

  const handleDownloadResume = () => {
    toast.success(`Downloading ${candidate?.name || 'Candidate'}'s Resume (PDF)...`, {
      icon: '📄',
    });
  };

  const handleSendMessageSubmit = (e) => {
    e.preventDefault();
    if (!messageBody.trim()) {
      toast.warning('Please enter a message.');
      return;
    }
    sendMessage(candidate?.name || 'Candidate', messageBody);
    setIsMessageModalOpen(false);
    setMessageBody('');
    setMessageSubject('');
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Candidate profile link copied to clipboard!');
    } else {
      toast.info(`URL: ${window.location.href}`);
    }
    setMoreMenuOpen(false);
  };

  const handleEditSubmit = async (formData) => {
    if (candidate) {
      await updateCandidate(candidate.id, formData);
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteConfirm = async (id, name) => {
    await deleteCandidate(id, name);
    setIsDeleteModalOpen(false);
    navigate('/candidates');
  };

  // Filter switcher list
  const filteredSwitcherCandidates = candidates.filter((c) => {
    if (!switcherSearch.trim()) return true;
    const q = switcherSearch.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q) || c.location.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex">
      {/* 1. Dark Slate Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-5 sm:p-7 lg:p-9 max-w-[1440px] w-full mx-auto space-y-6">
          {/* Top Navbar with Dynamic Title matching reference image */}
          <HeaderNavbar
            onToggleSidebar={() => setSidebarOpen(true)}
            breadcrumb={
              <Link
                to="/candidates"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7C8493] hover:text-[#25324B] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Candidates</span>
              </Link>
            }
            title="Candidate Profile"
            subtitle="View detailed information about the candidate, skills, experience and application history."
            searchPlaceholder="Search candidates, skills, locations..."
            rightAction={
              <div className="flex items-center gap-2 relative">
                {/* Dedicated Candidates Directory Link (No popup modal!) */}
                <Link
                  to="/candidates"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#E9ECF2] text-xs font-bold text-[#515B6F] hover:text-[#25324B] hover:bg-gray-50 transition-colors cursor-pointer shadow-2xs"
                  title="View all candidate members on dedicated directory page"
                >
                  <Users className="w-3.5 h-3.5 text-[#7C8493]" />
                  <span>All Candidates ({candidates.length})</span>
                </Link>

                {/* Edit Candidate Button */}
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-white border border-[#E9ECF2] hover:bg-gray-50 text-[#25324B] text-xs font-bold transition-all cursor-pointer shadow-2xs"
                  title="Edit Candidate Profile"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#515B6F]" />
                  <span>Edit</span>
                </button>

                {/* Shortlist Button matching reference image */}
                <button
                  type="button"
                  onClick={() => candidate && toggleShortlist(candidate.id, candidate.name)}
                  className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-2xs ${
                    shortlisted
                      ? 'bg-amber-50 text-amber-700 border-amber-300'
                      : 'bg-white text-[#25324B] border-[#E9ECF2] hover:bg-gray-50'
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${shortlisted ? 'fill-amber-400 text-amber-400' : 'text-[#7C8493]'}`} />
                  <span>{shortlisted ? 'Shortlisted' : 'Shortlist'}</span>
                </button>

                {/* Message Button matching reference image */}
                <button
                  type="button"
                  onClick={() => setIsMessageModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl bg-[#25324B] hover:bg-[#1C2638] text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-[#25324B]/15"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Message</span>
                </button>

                {/* Three dots options */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                    className="p-2 rounded-xl bg-white border border-[#E9ECF2] text-[#7C8493] hover:text-[#25324B] hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {moreMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-[#E9ECF2] p-1.5 z-30 text-xs text-left animate-fadeIn">
                      <button
                        type="button"
                        onClick={() => {
                          setMoreMenuOpen(false);
                          setIsEditModalOpen(true);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#F8F9FC] font-semibold text-[#25324B] transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-gray-400" />
                        <span>Edit Candidate</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#F8F9FC] font-semibold text-[#25324B] transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5 text-gray-400" />
                        <span>Copy Profile Link</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMoreMenuOpen(false);
                          handleDownloadResume();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#F8F9FC] font-semibold text-[#25324B] transition-colors"
                      >
                        <Download className="w-3.5 h-3.5 text-gray-400" />
                        <span>Download Profile PDF</span>
                      </button>
                      <Link
                        to="/candidates"
                        onClick={() => setMoreMenuOpen(false)}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#F8F9FC] font-semibold text-[#25324B] transition-colors"
                      >
                        <Users className="w-3.5 h-3.5 text-gray-400" />
                        <span>All Candidates Directory</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setMoreMenuOpen(false);
                          setIsDeleteModalOpen(true);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-rose-50 font-semibold text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                        <span>Delete Candidate</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            }
          />

          {/* Loading State */}
          {loading && !candidate ? (
            <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-[#25324B] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-bold text-[#25324B]">Fetching candidate details from DummyJSON Users API...</p>
              <p className="text-xs text-[#7C8493]">Check the Network Tab in DevTools to see the live API call</p>
            </div>
          ) : !candidate ? (
            <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center space-y-3">
              <UserCheck className="w-12 h-12 text-[#7C8493] mx-auto" />
              <h3 className="text-lg font-bold text-[#25324B]">Candidate Not Found</h3>
              <p className="text-xs text-[#7C8493]">Unable to load candidate profile. Please browse the full directory.</p>
              <button
                type="button"
                onClick={() => navigate('/candidates')}
                className="px-4 py-2 bg-[#25324B] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Back to Candidates Directory
              </button>
            </div>
          ) : (
            /* 3. Main 3-Column Profile Layout matching reference image */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">
              {/* ========================================================
                  COLUMN 1: Left Profile Card (lg:col-span-4 xl:col-span-3.5)
                  ======================================================== */}
              <div className="lg:col-span-4 xl:col-span-3.5 bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
                {/* Decorative Top Wave Graphic with Active Badge */}
                <div className="h-28 bg-gradient-to-br from-sky-50 via-blue-50/80 to-indigo-50/60 relative p-4 flex items-start justify-end">
                  <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#3B82F6_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
                  <span className="relative z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white/90 text-emerald-700 border border-emerald-200 shadow-2xs backdrop-blur-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{candidate.status || 'Active'}</span>
                  </span>
                </div>

                {/* Profile Identity */}
                <div className="px-6 pb-6 pt-0 relative">
                  {/* Circular Avatar */}
                  <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg -mt-12 bg-white flex items-center justify-center overflow-hidden relative z-10">
                    {candidate.avatar ? (
                      <img
                        src={candidate.avatar}
                        alt={candidate.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div
                      style={{ display: candidate.avatar ? 'none' : 'flex' }}
                      className="w-full h-full bg-[#25324B] text-white font-extrabold text-2xl items-center justify-center"
                    >
                      {candidate.fallbackLetter || 'C'}
                    </div>
                  </div>

                  {/* Name & Headline matching reference image */}
                  <div className="mt-4">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#25324B] tracking-tight">
                      {candidate.name}
                    </h2>
                    <p className="text-xs sm:text-[13px] font-bold text-blue-600 mt-0.5">
                      {candidate.role}
                    </p>
                  </div>

                  {/* Contact & Meta Details with Icons matching image */}
                  <div className="space-y-2 mt-4 pt-3.5 border-t border-gray-100 text-xs text-[#7C8493] font-medium">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{candidate.location}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{candidate.email}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span>{candidate.phone}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span>Age: {candidate.age}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <a
                        href={candidate.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline truncate"
                      >
                        {candidate.website}
                      </a>
                    </div>
                  </div>

                  {/* Bio paragraph */}
                  <p className="text-xs text-[#515B6F] mt-4 pt-3.5 border-t border-gray-100 leading-relaxed font-medium">
                    {candidate.bio}
                  </p>

                  {/* 3-Column Stats Row matching reference image */}
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-100 text-center">
                    <div className="p-2 rounded-xl bg-[#F8F9FC] border border-gray-100">
                      <strong className="text-base sm:text-lg font-extrabold text-[#25324B] block leading-tight">
                        {candidate.experienceYears}
                      </strong>
                      <span className="text-[10px] text-[#7C8493] font-semibold block mt-0.5">
                        Years Experience
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-[#F8F9FC] border border-gray-100">
                      <strong className="text-base sm:text-lg font-extrabold text-[#25324B] block leading-tight">
                        {candidate.totalApplications}
                      </strong>
                      <span className="text-[10px] text-[#7C8493] font-semibold block mt-0.5">
                        Total Applications
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-[#F8F9FC] border border-gray-100">
                      <strong className="text-base sm:text-lg font-extrabold text-[#25324B] flex items-center justify-center gap-1 leading-tight">
                        <span>{candidate.rating}</span>
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      </strong>
                      <span className="text-[10px] text-[#7C8493] font-semibold block mt-0.5">
                        Overall Rating
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons matching reference image */}
                  <div className="space-y-2 mt-5">
                    <button
                      type="button"
                      onClick={handleDownloadResume}
                      className="w-full py-2.5 rounded-xl bg-[#25324B] hover:bg-[#1C2638] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Resume</span>
                    </button>

                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-[#25324B] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <LinkedInIcon />
                      <span>View LinkedIn</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* ========================================================
                  COLUMN 2: Middle Content (lg:col-span-5 xl:col-span-5.5)
                  Work Experience, Education, Skills, Navigation Tabs
                  ======================================================== */}
              <div className="lg:col-span-5 xl:col-span-5.5 space-y-5">
                {/* Navigation Tabs matching reference image */}
                <div className="bg-white rounded-2xl border border-gray-200/80 p-1.5 flex items-center gap-1 sm:gap-2 shadow-2xs overflow-x-auto scrollbar-none">
                  {[
                    { id: 'overview', label: 'Overview', icon: FileText },
                    { id: 'experience', label: 'Experience', icon: Briefcase },
                    { id: 'education', label: 'Education', icon: GraduationCap },
                    { id: 'skills', label: 'Skills', icon: Sparkles },
                    { id: 'applications', label: 'Applications', icon: Users },
                  ].map((tab) => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                          isActive
                            ? 'bg-[#25324B] text-white shadow-xs'
                            : 'text-[#7C8493] hover:text-[#25324B] hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Section 1: Work Experience Card matching reference image */}
                {(activeTab === 'overview' || activeTab === 'experience') && (
                  <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <div className="flex items-center gap-2 font-extrabold text-[#25324B] text-sm sm:text-base">
                        <Briefcase className="w-4 h-4 text-[#25324B]" />
                        <span>Work Experience</span>
                      </div>
                      <span className="text-xs font-bold text-[#7C8493]">
                        {candidate.experienceYears} Years
                      </span>
                    </div>

                    {/* Timeline List */}
                    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-100">
                      {candidate.workHistory?.map((work, idx) => (
                        <div key={work.id || idx} className="relative">
                          {/* Timeline Node Badge */}
                          <div
                            className={`absolute -left-[30px] top-0.5 w-6 h-6 rounded-lg ${
                              work.badgeBg || 'bg-teal-600'
                            } text-white font-extrabold text-[11px] flex items-center justify-center shadow-2xs`}
                          >
                            {work.badgeLetter || 'T'}
                          </div>

                          <div>
                            <h4 className="text-sm font-extrabold text-[#25324B]">
                              {work.company}
                            </h4>
                            <p className="text-xs font-bold text-blue-600 mt-0.5">
                              {work.role}
                            </p>
                            <span className="text-[11px] text-[#7C8493] font-medium block mt-0.5">
                              {work.period}
                            </span>

                            <ul className="mt-2.5 space-y-1.5 text-xs text-[#515B6F] list-disc list-inside">
                              {work.bullets?.map((bullet, bIdx) => (
                                <li key={bIdx} className="leading-relaxed">
                                  {bullet}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section 2: Education Card matching reference image */}
                {(activeTab === 'overview' || activeTab === 'education') && (
                  <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-xs space-y-4">
                    <div className="flex items-center gap-2 font-extrabold text-[#25324B] text-sm sm:text-base pb-3 border-b border-gray-100">
                      <GraduationCap className="w-4 h-4 text-[#25324B]" />
                      <span>Education</span>
                    </div>

                    <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-[#F8F9FC] border border-gray-100">
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-[#25324B]">
                            {candidate.education?.degree || 'B.Tech in Computer Science'}
                          </h4>
                          <p className="text-xs text-[#515B6F] font-semibold mt-0.5">
                            {candidate.education?.institution || 'JNTU, Hyderabad'}
                          </p>
                          <span className="text-[11px] text-[#7C8493] font-medium block mt-0.5">
                            {candidate.education?.period || '2017 - 2021'}
                          </span>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 flex-shrink-0">
                        {candidate.education?.grade || '8.5 CGPA'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Section 3: Skills Card matching reference image */}
                {(activeTab === 'overview' || activeTab === 'skills') && (
                  <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-xs space-y-4">
                    <div className="flex items-center gap-2 font-extrabold text-[#25324B] text-sm sm:text-base pb-3 border-b border-gray-100">
                      <Sparkles className="w-4 h-4 text-[#25324B]" />
                      <span>Skills</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {candidate.skills?.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1.5 rounded-xl bg-[#F8F9FC] hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-gray-200 text-[#25324B] text-xs font-bold transition-colors select-none"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ========================================================
                  COLUMN 3: Right Column (lg:col-span-3 xl:col-span-3)
                  Candidate Info, Application History, Match Promo
                  ======================================================== */}
              <div className="lg:col-span-3 xl:col-span-3 space-y-5">
                {/* Card 1: Candidate Information matching reference image */}
                <div className="bg-white rounded-3xl border border-gray-200/80 p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 font-extrabold text-[#25324B] text-sm sm:text-base pb-3 border-b border-gray-100">
                    <UserCheck className="w-4 h-4 text-[#25324B]" />
                    <span>Candidate Information</span>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[#7C8493] font-medium flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        <span>Current Location</span>
                      </span>
                      <strong className="text-[#25324B] font-bold text-right truncate">
                        {candidate.currentLocation || candidate.location}
                      </strong>
                    </div>

                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[#7C8493] font-medium flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                        <span>Experience</span>
                      </span>
                      <strong className="text-[#25324B] font-bold">
                        {candidate.experienceYears} Years
                      </strong>
                    </div>

                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[#7C8493] font-medium flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                        <span>Expected Salary</span>
                      </span>
                      <strong className="text-[#25324B] font-bold text-right">
                        {candidate.expectedSalary}
                      </strong>
                    </div>

                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[#7C8493] font-medium flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span>Notice Period</span>
                      </span>
                      <strong className="text-[#25324B] font-bold">
                        {candidate.noticePeriod}
                      </strong>
                    </div>

                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[#7C8493] font-medium flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-gray-400" />
                        <span>Availability</span>
                      </span>
                      <strong className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                        {candidate.availability}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Card 2: Application History matching reference image */}
                <div className="bg-white rounded-3xl border border-gray-200/80 p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2 font-extrabold text-[#25324B] text-sm sm:text-base">
                      <FileText className="w-4 h-4 text-[#25324B]" />
                      <span>Application History</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => toast.info('Displaying all past applications')}
                      className="text-xs text-blue-600 hover:text-blue-800 font-bold transition-colors cursor-pointer"
                    >
                      View All
                    </button>
                  </div>

                  <div className="space-y-3">
                    {candidate.applicationHistory?.map((app) => (
                      <div
                        key={app.id}
                        className="p-3 rounded-2xl bg-[#F8F9FC] border border-gray-100 flex items-center justify-between gap-2 hover:bg-gray-100/60 transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <h5 className="text-xs font-bold text-[#25324B] truncate">
                            {app.jobTitle}
                          </h5>
                          <span className="text-[10px] text-[#7C8493] font-medium block mt-0.5">
                            Applied • {app.time}
                          </span>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex-shrink-0 ${
                            app.badgeColor || 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card 3: Match Promo Card: 'Great Candidate!' matching reference image */}
                <div className="bg-gradient-to-br from-sky-50 via-blue-50/70 to-indigo-50/50 rounded-3xl border border-sky-100 p-6 relative overflow-hidden shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-[#25324B] text-white flex items-center justify-center mb-3 shadow-md">
                    <Send className="w-5 h-5 -rotate-12 stroke-[2.2]" />
                  </div>

                  <h4 className="text-base font-extrabold text-[#25324B] tracking-tight">
                    Great Candidate!
                  </h4>

                  <p className="text-xs text-[#515B6F] mt-1.5 leading-relaxed font-medium">
                    This candidate matches {candidate.matchScore || 85}% of the job requirements.
                  </p>

                  <button
                    type="button"
                    onClick={() => setIsMessageModalOpen(true)}
                    className="w-full mt-4 py-2.5 rounded-xl bg-[#25324B] hover:bg-[#1C2638] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                  >
                    <span>Contact Now</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Message Candidate Modal */}
      {isMessageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 relative shadow-2xl border border-[#E9ECF2]">
            <button
              type="button"
              onClick={() => setIsMessageModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-[#7C8493] hover:text-[#25324B] hover:bg-[#F8F9FC] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-extrabold text-[#25324B]">Message {candidate?.name}</h3>
                <p className="text-xs text-[#7C8493]">{candidate?.role} • {candidate?.email}</p>
              </div>
            </div>

            <form onSubmit={handleSendMessageSubmit} className="space-y-4 text-xs text-left">
              <div>
                <label className="font-bold text-[#25324B] block mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="e.g., Interview Invitation / Job Opportunity"
                  value={messageSubject}
                  onChange={(e) => setMessageSubject(e.target.value)}
                  className="w-full bg-[#F8F9FC] border border-gray-200 rounded-xl px-3.5 py-2.5 text-[#25324B] font-semibold outline-none focus:border-[#25324B]"
                />
              </div>

              <div>
                <label className="font-bold text-[#25324B] block mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder={`Hi ${candidate?.firstName || 'Candidate'}, we reviewed your profile and were impressed with your experience. We would love to discuss an exciting opportunity with you...`}
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  className="w-full bg-[#F8F9FC] border border-gray-200 rounded-xl p-3 text-[#25324B] font-medium outline-none focus:border-[#25324B] resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsMessageModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-[#515B6F] hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#25324B] hover:bg-[#1C2638] text-white text-xs font-bold flex items-center gap-2 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Candidate Switcher Modal (Browse 30 DummyJSON Candidates) */}
      {isSwitcherOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-2xl p-6 sm:p-8 relative shadow-2xl border border-[#E9ECF2] max-h-[85vh] flex flex-col">
            <button
              type="button"
              onClick={() => setIsSwitcherOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-[#7C8493] hover:text-[#25324B] hover:bg-[#F8F9FC] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-left mb-4">
              <h3 className="text-lg font-extrabold text-[#25324B]">
                DummyJSON Candidates ({candidates.length} Profiles)
              </h3>
              <p className="text-xs text-[#7C8493] mt-0.5">
                Live candidate profiles fetched directly from <code className="text-blue-600 bg-blue-50 px-1 py-0.5 rounded">https://dummyjson.com/users</code>
              </p>
            </div>

            {/* Search filter in switcher */}
            <div className="relative mb-4">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candidates by name, role, or location..."
                value={switcherSearch}
                onChange={(e) => setSwitcherSearch(e.target.value)}
                className="w-full bg-[#F8F9FC] border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold text-[#25324B] outline-none focus:border-[#25324B]"
              />
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
              {filteredSwitcherCandidates.map((cand) => {
                const isSelected = candidate?.id === cand.id;
                return (
                  <div
                    key={cand.id}
                    onClick={() => {
                      selectCandidate(cand);
                      setIsSwitcherOpen(false);
                      navigate(`/candidates/${cand.id}`);
                    }}
                    className={`p-3 rounded-2xl border flex items-center justify-between gap-3 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/60 border-blue-200 shadow-2xs'
                        : 'bg-white border-gray-100 hover:bg-[#F8F9FC] hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden bg-white flex-shrink-0">
                        <img src={cand.avatar} alt={cand.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-xs text-[#25324B] truncate">
                            {cand.name}
                          </span>
                          {cand.id === 1 && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 text-[9px] font-bold">
                              Reference Profile
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-blue-600 font-semibold block truncate">
                          {cand.role}
                        </span>
                        <span className="text-[10px] text-[#7C8493] block truncate">
                          {cand.location} • {cand.experienceYears} Exp
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-xl bg-[#25324B] text-white text-[11px] font-bold hover:bg-[#1C2638] flex-shrink-0"
                    >
                      View Profile
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {/* Edit Candidate Modal */}
      <AddEditCandidateModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        initialData={candidate}
      />

      {/* Delete Candidate Modal */}
      <DeleteCandidateModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        candidate={candidate}
      />
    </div>
  );
};
