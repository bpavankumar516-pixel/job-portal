import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/dashboard/Sidebar';
import { CompanyStats } from '../components/companies/CompanyStats';
import { CompanyFilters } from '../components/companies/CompanyFilters';
import { CompanyCard } from '../components/companies/CompanyCard';
import { AddEditCompanyModal } from '../components/companies/AddEditCompanyModal';
import { CompanyDetailsModal } from '../components/companies/CompanyDetailsModal';
import { DeleteCompanyModal } from '../components/companies/DeleteCompanyModal';
import { HeaderNavbar } from '../components/common/HeaderNavbar';
import {
  getStoredCompanies,
  addCompany,
  updateCompany,
  deleteCompany,
  getCompanyStats,
} from '../services/companiesService';
import {
  Plus,
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
  Building2,
  LogOut,
  User,
  Shield,
  Search,
} from 'lucide-react';
import { toast } from 'react-toastify';

export const Companies = () => {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Companies state from local storage
  const [companies, setCompanies] = useState(() => getStoredCompanies());
  const [stats, setStats] = useState(() => getCompanyStats());

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
  const [sortBy, setSortBy] = useState('name-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [viewingCompany, setViewingCompany] = useState(null);
  const [deletingCompany, setDeletingCompany] = useState(null);

  // Filter & Sort Logic
  const filteredAndSortedCompanies = useMemo(() => {
    let result = [...companies];

    // 1. Search Query filter (name, industry, location)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.industry.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      );
    }

    // 2. Industry filter
    if (selectedIndustry !== 'All Industries') {
      result = result.filter((c) => c.industry === selectedIndustry);
    }

    // 3. Sorting
    result.sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'employees-desc') return (b.employeeCount || 0) - (a.employeeCount || 0);
      if (sortBy === 'rating-desc') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'jobs-desc') return (b.openJobs || 0) - (a.openJobs || 0);
      return 0;
    });

    return result;
  }, [companies, searchQuery, selectedIndustry, sortBy]);

  // Pagination calculation
  const totalItems = filteredAndSortedCompanies.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const paginatedCompanies = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedCompanies.slice(start, start + itemsPerPage);
  }, [filteredAndSortedCompanies, currentPage]);

  // Reset to page 1 on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedIndustry, sortBy]);

  // Handlers for Add, Edit, Delete
  const handleSaveCompany = (formData) => {
    if (editingCompany) {
      const updated = updateCompany(editingCompany.id, formData);
      setCompanies(getStoredCompanies());
      setStats(getCompanyStats());
      toast.success(`Company "${updated.name}" updated successfully!`, {
        icon: '🏢',
      });
      setEditingCompany(null);
    } else {
      const created = addCompany(formData);
      setCompanies(getStoredCompanies());
      setStats(getCompanyStats());
      toast.success(`Company "${created.name}" created successfully!`, {
        icon: '🚀',
      });
    }
  };

  const handleConfirmDelete = (id) => {
    const toDelete = companies.find((c) => c.id === id);
    deleteCompany(id);
    setCompanies(getStoredCompanies());
    setStats(getCompanyStats());
    toast.info(`Company "${toDelete?.name || 'Selected'}" has been removed.`, {
      icon: '🗑️',
    });
    setDeletingCompany(null);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedIndustry('All Industries');
    setSortBy('name-asc');
    setCurrentPage(1);
    toast.info('Filters have been reset.');
  };

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    selectedIndustry !== 'All Industries' ||
    sortBy !== 'name-asc';

  const displayName = user?.fullName || 'Pavan Kumar';
  const displayRole = user?.role || role || 'Recruiter';
  const displayInitial = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex">
      {/* 1. Dark Slate Sidebar matching reference image */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-[1440px] w-full mx-auto space-y-6">
          {/* Common Top Navbar matching reference image */}
          <HeaderNavbar
            onToggleSidebar={() => setSidebarOpen(true)}
            icon={<Building2 className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.2] text-[#25324B]" />}
            title="Companies"
            subtitle="Discover and manage top companies and build better opportunities."
            searchPlaceholder="Search jobs, companies..."
            onSearch={(val) => setSearchQuery(val)}
            rightAction={
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-[#25324B] hover:bg-[#1C2638] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#25324B]/20 transition-all cursor-pointer flex-shrink-0"
              >
                <Plus className="w-4 h-4 stroke-[2.4]" />
                <span>Add Company</span>
              </button>
            }
          />

          {/* 3. Four Metric Summary Cards matching reference image */}
          <CompanyStats stats={stats} />

          {/* 4. Filter & Search Bar matching reference image */}
          <CompanyFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedIndustry={selectedIndustry}
            onIndustryChange={setSelectedIndustry}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onResetFilters={handleResetFilters}
            hasActiveFilters={hasActiveFilters}
          />

          {/* 5. Company Grid (3x3 matching reference image) */}
          {paginatedCompanies.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] my-6">
              <div className="w-16 h-16 rounded-2xl bg-[#F0F3F8] text-[#25324B] flex items-center justify-center mx-auto mb-4 border border-[#CCD5E4]">
                <Search className="w-8 h-8 stroke-[1.8]" />
              </div>
              <h3 className="text-lg font-extrabold text-[#25324B] mb-1">
                No Companies Found
              </h3>
              <p className="text-xs sm:text-sm text-[#7C8493] max-w-md mx-auto mb-5 leading-relaxed">
                We couldn't find any companies matching your search query "{searchQuery}" or selected industry filter.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl bg-[#25324B] text-white text-xs font-bold hover:bg-[#1C2638] transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginatedCompanies.map((company) => (
                <CompanyCard
                  key={company.id}
                  company={company}
                  onViewDetails={(comp) => navigate(`/companies/${comp.id}`)}
                  onEdit={(comp) => setEditingCompany(comp)}
                  onDelete={(comp) => setDeletingCompany(comp)}
                />
              ))}
            </div>
          )}

          {/* 6. Pagination Footer matching reference image */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#F0F2F6]">
            {/* Left: Showing Range Text */}
            <span className="text-xs font-medium text-[#7C8493]">
              Showing{' '}
              <strong className="text-[#25324B] font-bold">
                {totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, totalItems)}
              </strong>{' '}
              of <strong className="text-[#25324B] font-bold">{totalItems}</strong> companies
            </span>

            {/* Right: Page Buttons */}
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

      {/* Add / Edit Company Modal */}
      <AddEditCompanyModal
        isOpen={isAddModalOpen || Boolean(editingCompany)}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingCompany(null);
        }}
        onSubmitCompany={handleSaveCompany}
        initialData={editingCompany}
      />

      {/* Company Details Modal */}
      <CompanyDetailsModal
        isOpen={Boolean(viewingCompany)}
        onClose={() => setViewingCompany(null)}
        company={viewingCompany}
      />

      {/* Delete Confirmation Modal */}
      <DeleteCompanyModal
        isOpen={Boolean(deletingCompany)}
        onClose={() => setDeletingCompany(null)}
        onConfirm={handleConfirmDelete}
        company={deletingCompany}
      />
    </div>
  );
};
