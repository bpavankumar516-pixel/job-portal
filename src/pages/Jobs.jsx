import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/dashboard/Sidebar';
import { HeaderNavbar } from '../components/common/HeaderNavbar';
import { JobStats } from '../components/jobs/JobStats';
import { JobFilters } from '../components/jobs/JobFilters';
import { JobTable } from '../components/jobs/JobTable';
import { AddEditJobModal } from '../components/jobs/AddEditJobModal';
import { JobDetailsModal } from '../components/jobs/JobDetailsModal';
import { DeleteJobModal } from '../components/jobs/DeleteJobModal';
import {
  getStoredJobs,
  addJob,
  updateJob,
  deleteJob,
  deleteMultipleJobs,
  toggleJobStatus,
  getJobStats,
} from '../services/jobsService';
import { recordActivity } from '../services/activityService';
import { ChevronLeft, ChevronRight, User, Briefcase, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

export const Jobs = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Dynamic Jobs & Stats State from LocalStorage
  const [jobs, setJobs] = useState(() => getStoredJobs());
  const [stats, setStats] = useState(() => getJobStats());

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedStatus, setSelectedStatus] = useState('All Status');

  // Pagination (10 per page matching image)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Bulk selection
  const [selectedJobIds, setSelectedJobIds] = useState([]);

  // Modals State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [viewingJob, setViewingJob] = useState(null);
  const [deletingJob, setDeletingJob] = useState(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // Sync state helper
  const syncState = () => {
    setJobs(getStoredJobs());
    setStats(getJobStats());
  };

  // Sync across tabs or storage events
  useEffect(() => {
    const handleSync = () => {
      setJobs(getStoredJobs());
      setStats(getJobStats());
    };
    window.addEventListener('storage', handleSync);
    return () => window.removeEventListener('storage', handleSync);
  }, []);

  // Filter logic
  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    // 1. Search Query filter (title, category, location, company)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.category.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q) ||
          j.companyName.toLowerCase().includes(q)
      );
    }

    // 2. Category filter
    if (selectedCategory !== 'All Categories') {
      result = result.filter((j) => j.category === selectedCategory);
    }

    // 3. Employment Type filter
    if (selectedType !== 'All Types') {
      result = result.filter((j) => j.employmentType === selectedType);
    }

    // 4. Job Status filter
    if (selectedStatus !== 'All Status') {
      result = result.filter((j) => j.status === selectedStatus);
    }

    return result;
  }, [jobs, searchQuery, selectedCategory, selectedType, selectedStatus]);

  // Reset to page 1 on filter changes
  useEffect(() => {
    setCurrentPage(1);
    setSelectedJobIds([]);
  }, [searchQuery, selectedCategory, selectedType, selectedStatus]);

  // Pagination slice
  const totalItems = filteredJobs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredJobs.slice(start, start + itemsPerPage);
  }, [filteredJobs, currentPage, itemsPerPage]);

  // Handlers for Job CRUD
  const handleSaveJob = (formData) => {
    if (editingJob) {
      const updated = updateJob(editingJob.id, formData);
      syncState();
      recordActivity({
        type: 'job',
        title: 'Job posting updated',
        meta: `${updated.title} · ${updated.companyName} (${updated.location})`,
        link: `/jobs/${updated.id}`,
        iconType: 'briefcase',
      });
      toast.success(`Job "${updated.title}" updated successfully!`, {
        icon: '💼',
      });
      setEditingJob(null);
    } else {
      const created = addJob(formData);
      syncState();
      recordActivity({
        type: 'job',
        title: 'Job posting published',
        meta: `${created.title} · ${created.companyName} (${created.location})`,
        link: `/jobs/${created.id}`,
        iconType: 'briefcase',
      });
      toast.success(`Job "${created.title}" published successfully!`, {
        icon: '🚀',
      });
      setIsCreateModalOpen(false);
    }
  };

  // Auto-adjust page if current page exceeds total pages after deletion
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const handleConfirmDelete = (id) => {
    const toDelete = jobs.find((j) => String(j.id) === String(id));
    deleteJob(id);
    syncState();
    setSelectedJobIds((prev) => prev.filter((item) => String(item) !== String(id)));
    toast.info(`Job "${toDelete?.title || 'Posting'}" deleted.`, {
      icon: '🗑️',
    });
    if (toDelete) {
      recordActivity({
        type: 'job_delete',
        title: 'Job posting deleted',
        meta: `Removed "${toDelete.title}" at ${toDelete.companyName}`,
        link: '/jobs',
        iconType: 'trash',
      });
    }
    setDeletingJob(null);
  };

  const handleConfirmBulkDelete = () => {
    if (selectedJobIds.length === 0) return;
    const count = selectedJobIds.length;
    deleteMultipleJobs(selectedJobIds);
    syncState();
    setSelectedJobIds([]);
    setIsBulkDeleting(false);
    toast.info(`${count} job postings deleted successfully.`, {
      icon: '🗑️',
    });
    recordActivity({
      type: 'job_delete',
      title: 'Bulk job postings deleted',
      meta: `Removed ${count} job postings`,
      link: '/jobs',
      iconType: 'trash',
    });
  };

  const handleToggleStatus = (id) => {
    const toggled = toggleJobStatus(id);
    if (toggled) {
      syncState();
      recordActivity({
        type: 'job',
        title: `Job marked as ${toggled.status}`,
        meta: `${toggled.title} at ${toggled.companyName} is now ${toggled.status}`,
        link: `/jobs/${toggled.id}`,
        iconType: 'briefcase',
      });
      toast.info(
        `Job "${toggled.title}" marked as ${toggled.status}.`,
        { icon: toggled.status === 'Open' ? '🟢' : '🔴' }
      );
      if (viewingJob && viewingJob.id === id) {
        setViewingJob(toggled);
      }
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All Categories');
    setSelectedType('All Types');
    setSelectedStatus('All Status');
    setCurrentPage(1);
    toast.info('Job filters have been reset.');
  };

  // Bulk Selection Handlers
  const handleToggleSelectJob = (id) => {
    setSelectedJobIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedJobIds.length === paginatedJobs.length) {
      setSelectedJobIds([]);
    } else {
      setSelectedJobIds(paginatedJobs.map((j) => j.id));
    }
  };

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    selectedCategory !== 'All Categories' ||
    selectedType !== 'All Types' ||
    selectedStatus !== 'All Status';

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex">
      {/* 1. Dark Slate Sidebar matching reference image */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-5 sm:p-7 lg:p-9 max-w-[1440px] w-full mx-auto space-y-6">
          {/* Top Navbar matching reference image */}
          <HeaderNavbar
            onToggleSidebar={() => setSidebarOpen(true)}
            icon={<Briefcase className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.2] text-[#25324B]" />}
            title="Job Postings"
            subtitle="Manage your job postings and find the best talent for your team."
            searchPlaceholder="Search jobs, companies..."
            onSearch={(val) => setSearchQuery(val)}
          />

          {/* 3. Five Statistics Metric Cards matching reference image */}
          <JobStats stats={stats} />

          {/* 4. Filter & Action Toolbar matching reference image */}
          <JobFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            onResetFilters={handleResetFilters}
            onCreateJob={() => setIsCreateModalOpen(true)}
            hasActiveFilters={hasActiveFilters}
          />

          {/* Bulk Selection Bar */}
          {selectedJobIds.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#25324B] text-white px-5 py-3 rounded-2xl shadow-lg animate-fadeIn">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-xs font-bold text-white">
                  {selectedJobIds.length}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-100">
                  {selectedJobIds.length} job{selectedJobIds.length > 1 ? 's' : ''} selected
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedJobIds([])}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Clear Selection
                </button>

                <button
                  type="button"
                  onClick={() => setIsBulkDeleting(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Selected ({selectedJobIds.length})</span>
                </button>
              </div>
            </div>
          )}

          {/* 5. Job Table matching reference image */}
          <JobTable
            jobs={paginatedJobs}
            onViewJob={(job) => navigate(`/jobs/${job.id}`)}
            onEditJob={(job) => setEditingJob(job)}
            onDeleteJob={(job) => setDeletingJob(job)}
            onToggleStatus={handleToggleStatus}
            selectedJobIds={selectedJobIds}
            onToggleSelectJob={handleToggleSelectJob}
            onToggleSelectAll={handleToggleSelectAll}
          />

          {/* 6. Pagination Footer matching reference image */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-[#F0F2F6]">
            {/* Left: Showing Range Text */}
            <span className="text-xs font-medium text-[#7C8493]">
              Showing{' '}
              <strong className="text-[#25324B] font-bold">
                {totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, totalItems)}
              </strong>{' '}
              of <strong className="text-[#25324B] font-bold">{totalItems}</strong> jobs
            </span>

            {/* Right: Page Navigation Buttons */}
            <div className="flex items-center gap-1.5">
              {/* Previous Page Button */}
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg border border-[#E9ECF2] bg-white flex items-center justify-center text-[#515B6F] hover:bg-[#F8F9FC] hover:text-[#25324B] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer text-xs"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page Number Buttons */}
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pg) => {
                const isActive = pg === currentPage;

                return (
                  <button
                    key={pg}
                    type="button"
                    onClick={() => setCurrentPage(pg)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#25324B] text-white shadow-2xs'
                        : 'border border-[#E9ECF2] bg-white text-[#515B6F] hover:bg-[#F8F9FC] hover:text-[#25324B]'
                    }`}
                  >
                    {pg}
                  </button>
                );
              })}

              {/* Next Page Button */}
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-lg border border-[#E9ECF2] bg-white flex items-center justify-center text-[#515B6F] hover:bg-[#F8F9FC] hover:text-[#25324B] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer text-xs"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Create / Edit Job Modal */}
      <AddEditJobModal
        isOpen={isCreateModalOpen || Boolean(editingJob)}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingJob(null);
        }}
        onSubmitJob={handleSaveJob}
        initialData={editingJob}
      />

      {/* View Job Details Modal */}
      <JobDetailsModal
        isOpen={Boolean(viewingJob)}
        onClose={() => setViewingJob(null)}
        job={viewingJob}
        onEdit={(job) => {
          setViewingJob(null);
          setEditingJob(job);
        }}
        onToggleStatus={handleToggleStatus}
      />

      {/* Delete Confirmation Modal (Single Job) */}
      <DeleteJobModal
        isOpen={Boolean(deletingJob)}
        onClose={() => setDeletingJob(null)}
        onConfirm={handleConfirmDelete}
        job={deletingJob}
      />

      {/* Delete Confirmation Modal (Bulk Selected Jobs) */}
      <DeleteJobModal
        isOpen={isBulkDeleting}
        onClose={() => setIsBulkDeleting(false)}
        onConfirm={handleConfirmBulkDelete}
        isBulk={true}
        count={selectedJobIds.length}
      />
    </div>
  );
};
