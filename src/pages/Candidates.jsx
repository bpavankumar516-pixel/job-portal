import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sidebar } from '../components/dashboard/Sidebar';
import { HeaderNavbar } from '../components/common/HeaderNavbar';
import { AddEditCandidateModal } from '../components/candidates/AddEditCandidateModal';
import { DeleteCandidateModal } from '../components/candidates/DeleteCandidateModal';
import { useCandidates } from '../context/CandidatesContext';
import {
  Users,
  Search,
  MapPin,
  Star,
  MessageSquare,
  Briefcase,
  CheckCircle2,
  Filter,
  ArrowRight,
  Sparkles,
  UserCheck,
  Building2,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Send,
  X,
  Plus,
  Edit3,
  Trash2,
} from 'lucide-react';
import { toast } from 'react-toastify';

export const Candidates = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Candidates from Context (Fetched dynamically via DummyJSON Users API)
  const {
    candidates,
    loading,
    error,
    shortlistedIds,
    toggleShortlist,
    isShortlisted,
    sendMessage,
    selectCandidate,
    createCandidate,
    updateCandidate,
    deleteCandidate,
  } = useCandidates();

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedExperience, setSelectedExperience] = useState('All');
  const [sortBy, setSortBy] = useState('rating');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // CRUD Modals State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [deletingCandidate, setDeletingCandidate] = useState(null);

  // Messaging Modal State
  const [messageTarget, setMessageTarget] = useState(null);
  const [messageSubject, setMessageSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');

  // Extract unique locations dynamically
  const availableLocations = useMemo(() => {
    const set = new Set(['All']);
    candidates.forEach((c) => {
      if (c.location) set.add(c.location);
    });
    return Array.from(set);
  }, [candidates]);

  // Roles filter options
  const roleFilters = ['All', 'Frontend', 'Backend', 'UI/UX', 'Full Stack', 'DevOps', 'Data Science'];

  // Filter & Sort Logic
  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      // 1. Text Search (Name, Role, Skills, Location, Bio)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = c.name.toLowerCase().includes(q);
        const matchRole = c.role.toLowerCase().includes(q);
        const matchLoc = c.location.toLowerCase().includes(q);
        const matchSkills = Array.isArray(c.skills) && c.skills.some((s) => s.toLowerCase().includes(q));
        if (!matchName && !matchRole && !matchLoc && !matchSkills) return false;
      }

      // 2. Role Filter Pill
      if (selectedRole !== 'All') {
        if (!c.role.toLowerCase().includes(selectedRole.toLowerCase())) {
          return false;
        }
      }

      // 3. Location Dropdown
      if (selectedLocation !== 'All') {
        if (c.location !== selectedLocation) {
          return false;
        }
      }

      // 4. Experience Filter
      if (selectedExperience !== 'All') {
        if (selectedExperience === '2+' && !c.experienceYears.includes('2') && !c.experienceYears.includes('3') && !c.experienceYears.includes('4') && !c.experienceYears.includes('5')) {
          return false;
        }
        if (selectedExperience === '4+' && !c.experienceYears.includes('4') && !c.experienceYears.includes('5') && !c.experienceYears.includes('6')) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') {
        return parseFloat(b.rating || 0) - parseFloat(a.rating || 0);
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'applications') {
        return (b.totalApplications || 0) - (a.totalApplications || 0);
      }
      return 0;
    });
  }, [candidates, searchQuery, selectedRole, selectedLocation, selectedExperience, sortBy]);

  // Pagination Slice
  const totalPages = Math.max(1, Math.ceil(filteredCandidates.length / itemsPerPage));
  const paginatedCandidates = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCandidates.slice(start, start + itemsPerPage);
  }, [filteredCandidates, currentPage, itemsPerPage]);

  const handleOpenMessageModal = (cand) => {
    setMessageTarget(cand);
    setMessageSubject(`Job Opportunity for ${cand.role}`);
    setMessageBody(`Hi ${cand.firstName || 'Candidate'},\n\nWe came across your profile and were impressed by your background in ${cand.skills?.slice(0, 3).join(', ')}. We have an exciting opening that aligns with your skillset and would love to connect for a quick introductory discussion.\n\nBest regards,\nPavan Kumar | Recruiter`);
  };

  const handleSendMessageSubmit = (e) => {
    e.preventDefault();
    if (!messageBody.trim()) {
      toast.warning('Please enter a message.');
      return;
    }
    sendMessage(messageTarget?.name || 'Candidate', messageBody);
    setMessageTarget(null);
    setMessageBody('');
    setMessageSubject('');
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedRole('All');
    setSelectedLocation('All');
    setSelectedExperience('All');
    setSortBy('rating');
    setCurrentPage(1);
    toast.info('Filters reset to default');
  };

  // CRUD Handlers
  const handleCreateCandidateSubmit = async (formData) => {
    await createCandidate(formData);
    setCurrentPage(1);
  };

  const handleEditCandidateSubmit = async (formData) => {
    if (editingCandidate) {
      await updateCandidate(editingCandidate.id, formData);
    }
  };

  const handleDeleteCandidateConfirm = async (id, name) => {
    await deleteCandidate(id, name);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex">
      {/* 1. Dark Slate Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-5 sm:p-7 lg:p-9 max-w-[1440px] w-full mx-auto space-y-6">
          {/* Top Navbar with Dynamic Title matching other pages */}
          <HeaderNavbar
            onToggleSidebar={() => setSidebarOpen(true)}
            icon={<Users className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.2] text-[#25324B]" />}
            title="Candidates"
            subtitle="Discover and evaluate top talent, review technical skillsets, and manage candidate pipelines."
            searchPlaceholder="Search candidates by name, skill, role..."
            onSearch={(val) => {
              setSearchQuery(val);
              setCurrentPage(1);
            }}
            rightAction={
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25324B] hover:bg-[#1C2638] text-white text-xs font-bold transition-all shadow-md shadow-[#25324B]/15 cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Add Candidate</span>
              </button>
            }
          />

          {/* 3. Top Row: 4 Metric Stats Cards matching Dashboard & Companies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] text-left flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#7C8493] block">Total Candidates</span>
                <p className="text-2xl font-extrabold text-[#25324B] mt-1">
                  {candidates.length} Profiles
                </p>
                <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Live from DummyJSON
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] text-left flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#7C8493] block">Active Talent</span>
                <p className="text-2xl font-extrabold text-[#25324B] mt-1">
                  {candidates.filter((c) => c.status === 'Active').length || candidates.length}
                </p>
                <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Ready to Interview
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <UserCheck className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] text-left flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#7C8493] block">Shortlisted Talent</span>
                <p className="text-2xl font-extrabold text-[#25324B] mt-1">
                  {shortlistedIds.length} Candidates
                </p>
                <span className="text-[11px] text-amber-600 font-bold mt-1 inline-flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> Bookmarked by you
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                <Star className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] text-left flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#7C8493] block">Immediate Availability</span>
                <p className="text-2xl font-extrabold text-[#25324B] mt-1">
                  {Math.round(candidates.length * 0.45)} Available
                </p>
                <span className="text-[11px] text-blue-600 font-bold mt-1 inline-flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 0-15 days notice
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* 4. Filter & Search Toolbar */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-4 sm:p-5 text-left space-y-4">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
              {/* Keyword Search Input */}
              <div className="relative flex-1 min-w-[260px]">
                <Search className="w-4 h-4 text-[#7C8493] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search candidates by name, skills, title, city..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-[#F8F9FC] border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-[#25324B] placeholder:text-[#A0AEC0] outline-none focus:border-[#25324B]"
                />
              </div>

              {/* Location Selector */}
              <div className="flex items-center gap-2">
                <div className="relative min-w-[150px]">
                  <select
                    value={selectedLocation}
                    onChange={(e) => {
                      setSelectedLocation(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full bg-[#F8F9FC] border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-[#25324B] outline-none cursor-pointer hover:border-gray-300"
                  >
                    <option value="All">All Locations</option>
                    {availableLocations.filter((l) => l !== 'All').map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Experience Selector */}
                <div className="relative min-w-[140px]">
                  <select
                    value={selectedExperience}
                    onChange={(e) => {
                      setSelectedExperience(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full bg-[#F8F9FC] border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-[#25324B] outline-none cursor-pointer hover:border-gray-300"
                  >
                    <option value="All">All Experience</option>
                    <option value="2+">2+ Years Exp</option>
                    <option value="4+">4+ Years Exp</option>
                  </select>
                </div>

                {/* Sort By */}
                <div className="relative min-w-[140px]">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-[#F8F9FC] border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-[#25324B] outline-none cursor-pointer hover:border-gray-300"
                  >
                    <option value="rating">Top Rated</option>
                    <option value="name">Name (A-Z)</option>
                    <option value="applications">Most Active</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Quick Role Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-gray-100">
              <span className="text-xs font-bold text-[#7C8493] flex-shrink-0 flex items-center gap-1.5 mr-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Role:</span>
              </span>
              {roleFilters.map((role) => {
                const isActive = selectedRole === role;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      setSelectedRole(role);
                      setCurrentPage(1);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[#25324B] text-white shadow-xs'
                        : 'bg-[#F8F9FC] text-[#515B6F] hover:bg-gray-100 border border-gray-200/80'
                    }`}
                  >
                    {role}
                  </button>
                );
              })}

              {(searchQuery || selectedRole !== 'All' || selectedLocation !== 'All' || selectedExperience !== 'All') && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="ml-auto text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline flex-shrink-0 cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* 5. Candidates Grid or Loading State */}
          {loading ? (
            <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-[#25324B] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-bold text-[#25324B]">Loading candidates from DummyJSON Users API...</p>
              <p className="text-xs text-[#7C8493]">Check your browser Network Tab for the live API response</p>
            </div>
          ) : paginatedCandidates.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto text-[#7C8493]">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-[#25324B]">No Candidates Found</h3>
              <p className="text-xs text-[#7C8493] max-w-sm mx-auto">
                No candidate profiles matched your search or filter criteria. Try adjusting your search query.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2 bg-[#25324B] text-white text-xs font-bold rounded-xl hover:bg-[#1C2638] transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
              {paginatedCandidates.map((cand) => {
                const shortlisted = isShortlisted(cand.id);
                return (
                  <div
                    key={cand.id}
                    onClick={() => {
                      selectCandidate(cand);
                      navigate(`/candidates/${cand.id}`);
                    }}
                    className="bg-white rounded-3xl border border-gray-200/80 hover:border-[#25324B]/30 hover:shadow-[0_8px_30px_rgba(37,50,75,0.1)] transition-all p-5 flex flex-col justify-between group relative overflow-hidden cursor-pointer"
                  >
                    {/* Top gradient wave bar */}
                    <div className="h-14 -mx-5 -mt-5 mb-0 bg-gradient-to-r from-sky-50 via-blue-50/70 to-indigo-50/50 p-3 flex items-start justify-between border-b border-gray-100/60">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-emerald-700 border border-emerald-200 shadow-2xs inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>{cand.status || 'Active'}</span>
                      </span>

                      <div className="flex items-center gap-1.5">
                        {/* Edit Candidate Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingCandidate(cand);
                          }}
                          className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-gray-500 hover:text-blue-600 transition-colors shadow-2xs cursor-pointer"
                          title="Edit Candidate"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Candidate Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingCandidate(cand);
                          }}
                          className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-gray-500 hover:text-rose-600 transition-colors shadow-2xs cursor-pointer"
                          title="Delete Candidate"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Shortlist Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleShortlist(cand.id, cand.name);
                          }}
                          className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-gray-400 hover:text-amber-500 transition-colors shadow-2xs cursor-pointer"
                          title={shortlisted ? 'Remove from shortlist' : 'Shortlist candidate'}
                        >
                          <Star className={`w-3.5 h-3.5 ${shortlisted ? 'fill-amber-400 text-amber-400' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Candidate Identity */}
                    <div className="pt-2">
                      <div className="flex items-start gap-3.5">
                        <div className="w-14 h-14 rounded-2xl border-2 border-white shadow-md bg-white flex items-center justify-center overflow-hidden flex-shrink-0 -mt-6 relative z-10">
                          {cand.avatar ? (
                            <img
                              src={cand.avatar}
                              alt={cand.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div
                            style={{ display: cand.avatar ? 'none' : 'flex' }}
                            className="w-full h-full bg-[#25324B] text-white font-extrabold text-lg items-center justify-center"
                          >
                            {cand.fallbackLetter || 'C'}
                          </div>
                        </div>

                        <div className="min-w-0 flex-1">
                          <span className="font-extrabold text-[#25324B] group-hover:text-blue-600 transition-colors text-base tracking-tight truncate block text-left">
                            {cand.name}
                          </span>
                          <span className="text-xs font-bold text-blue-600 block truncate">
                            {cand.role}
                          </span>
                        </div>
                      </div>

                      {/* Location & Company */}
                      <div className="mt-3 space-y-1 text-xs text-[#7C8493] font-medium">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{cand.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{cand.workHistory?.[0]?.company || 'TechCorp Solutions'}</span>
                        </div>
                      </div>

                      {/* Skills Tags */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {cand.skills?.slice(0, 4).map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 rounded-lg bg-[#F8F9FC] text-[#25324B] font-semibold text-[11px] border border-gray-100"
                          >
                            {skill}
                          </span>
                        ))}
                        {cand.skills?.length > 4 && (
                          <span className="px-1.5 py-0.5 rounded-lg bg-gray-50 text-gray-500 font-semibold text-[10px]">
                            +{cand.skills.length - 4} more
                          </span>
                        )}
                      </div>

                      {/* 3 Metric Pills */}
                      <div className="grid grid-cols-3 gap-1.5 mt-4 pt-3.5 border-t border-gray-100 text-center">
                        <div className="p-1.5 rounded-xl bg-[#F8F9FC]">
                          <span className="text-xs font-extrabold text-[#25324B] block">
                            {cand.experienceYears}
                          </span>
                          <span className="text-[10px] text-[#7C8493] font-semibold block">Exp</span>
                        </div>

                        <div className="p-1.5 rounded-xl bg-[#F8F9FC]">
                          <span className="text-xs font-extrabold text-[#25324B] block">
                            {cand.totalApplications}
                          </span>
                          <span className="text-[10px] text-[#7C8493] font-semibold block">Apps</span>
                        </div>

                        <div className="p-1.5 rounded-xl bg-[#F8F9FC]">
                          <span className="text-xs font-extrabold text-[#25324B] flex items-center justify-center gap-0.5">
                            <span>{cand.rating}</span>
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          </span>
                          <span className="text-[10px] text-[#7C8493] font-semibold block">Rating</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Footer */}
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenMessageModal(cand);
                        }}
                        className="p-2 rounded-xl border border-gray-200 text-[#7C8493] hover:text-[#25324B] hover:bg-gray-50 transition-colors cursor-pointer"
                        title="Send Message"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingCandidate(cand);
                        }}
                        className="px-3 py-2 rounded-xl border border-gray-200 text-[#515B6F] hover:text-blue-600 hover:bg-gray-50 text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                        title="Edit Candidate"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          selectCandidate(cand);
                          navigate(`/candidates/${cand.id}`);
                        }}
                        className="flex-1 py-2 rounded-xl bg-[#25324B] hover:bg-[#1C2638] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      >
                        <span>View Profile</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 6. Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-[#7C8493] hover:text-[#25324B] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-9 h-9 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                    currentPage === pageNum
                      ? 'bg-[#25324B] text-white shadow-xs'
                      : 'bg-white border border-gray-200 text-[#515B6F] hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-[#7C8493] hover:text-[#25324B] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Message Candidate Modal */}
      {messageTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 relative shadow-2xl border border-[#E9ECF2]">
            <button
              type="button"
              onClick={() => setMessageTarget(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-[#7C8493] hover:text-[#25324B] hover:bg-[#F8F9FC] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5 text-left">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-extrabold text-[#25324B] truncate">Message {messageTarget.name}</h3>
                <p className="text-xs text-[#7C8493] truncate">{messageTarget.role} • {messageTarget.email}</p>
              </div>
            </div>

            <form onSubmit={handleSendMessageSubmit} className="space-y-4 text-xs text-left">
              <div>
                <label className="font-bold text-[#25324B] block mb-1">Subject</label>
                <input
                  type="text"
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
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  className="w-full bg-[#F8F9FC] border border-gray-200 rounded-xl p-3 text-[#25324B] font-medium outline-none focus:border-[#25324B] resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setMessageTarget(null)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-[#515B6F] hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#25324B] hover:bg-[#1C2638] text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Create Candidate Modal */}
      <AddEditCandidateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCandidateSubmit}
      />

      {/* Edit Candidate Modal */}
      <AddEditCandidateModal
        isOpen={Boolean(editingCandidate)}
        onClose={() => setEditingCandidate(null)}
        onSubmit={handleEditCandidateSubmit}
        initialData={editingCandidate}
      />

      {/* Delete Candidate Confirmation Modal */}
      <DeleteCandidateModal
        isOpen={Boolean(deletingCandidate)}
        onClose={() => setDeletingCandidate(null)}
        onConfirm={handleDeleteCandidateConfirm}
        candidate={deletingCandidate}
      />
    </div>
  );
};
