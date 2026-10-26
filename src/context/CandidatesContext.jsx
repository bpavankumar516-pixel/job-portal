import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  fetchDummyJsonCandidates,
  fetchDummyJsonCandidateById,
  searchDummyJsonCandidates,
  createDummyJsonCandidate,
  updateDummyJsonCandidate,
  deleteDummyJsonCandidate,
  getShortlistedCandidateIds,
  toggleCandidateShortlistStorage,
} from '../services/candidatesService';
import { toast } from 'react-toastify';

const CandidatesContext = createContext(null);

export const CandidatesProvider = ({ children }) => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [shortlistedIds, setShortlistedIds] = useState(() => getShortlistedCandidateIds());
  const [searchQuery, setSearchQuery] = useState('');

  // Initial load: Fetch real users from DummyJSON API (shows in Network tab)
  const loadCandidates = useCallback(async (limit = 30) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDummyJsonCandidates(limit);
      setCandidates(data);
      if (data.length > 0 && !selectedCandidate) {
        setSelectedCandidate(data[0]); // default to first candidate (Rahul Sharma)
      }
    } catch (err) {
      console.error('Failed to load candidates from DummyJSON:', err);
      setError('Unable to load candidates from DummyJSON API. Please check network connection.');
    } finally {
      setLoading(false);
    }
  }, [selectedCandidate]);

  useEffect(() => {
    loadCandidates();
  }, []);

  // Fetch or retrieve a candidate by ID
  const getCandidate = useCallback(
    async (id) => {
      if (!id) return null;
      const cleanId = Number(String(id).replace(/\D/g, '')) || 1;
      // Check in memory first
      const found = candidates.find((c) => c.id === cleanId || c.dummyId === cleanId);
      if (found) {
        setSelectedCandidate(found);
        return found;
      }
      // Otherwise fetch directly from DummyJSON API / local storage
      try {
        const fetched = await fetchDummyJsonCandidateById(cleanId);
        if (fetched) {
          setSelectedCandidate(fetched);
          return fetched;
        }
      } catch (err) {
        console.error(`Error fetching candidate #${id}:`, err);
      }
      return candidates[0] || null;
    },
    [candidates]
  );

  // Set selected candidate directly
  const selectCandidate = useCallback(
    async (candOrId) => {
      if (typeof candOrId === 'object' && candOrId !== null) {
        setSelectedCandidate(candOrId);
        return candOrId;
      }
      return await getCandidate(candOrId);
    },
    [getCandidate]
  );

  // Search candidates using DummyJSON Search API
  const searchCandidates = useCallback(async (query) => {
    setSearchQuery(query);
    setLoading(true);
    try {
      const results = await searchDummyJsonCandidates(query);
      setCandidates(results);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // CREATE Candidate (Real DummyJSON POST API call + State + LocalStorage)
  const createCandidate = useCallback(async (formData) => {
    try {
      const newCand = await createDummyJsonCandidate(formData);
      setCandidates((prev) => [newCand, ...prev]);
      toast.success(`Candidate ${newCand.name} created successfully!`, {
        icon: '👤',
      });
      return newCand;
    } catch (err) {
      console.error('Error creating candidate:', err);
      toast.error('Failed to create candidate. Please try again.');
      throw err;
    }
  }, []);

  // UPDATE / EDIT Candidate (Real DummyJSON PUT API call + State + LocalStorage)
  const updateCandidate = useCallback(async (id, updatedFields) => {
    try {
      const updated = await updateDummyJsonCandidate(id, updatedFields);
      setCandidates((prev) =>
        prev.map((c) => (c.id === Number(id) || c.id === id ? { ...c, ...updated } : c))
      );
      setSelectedCandidate((prev) =>
        prev && (prev.id === Number(id) || prev.id === id) ? { ...prev, ...updated } : prev
      );
      toast.success(`Candidate ${updatedFields.name || 'profile'} updated successfully!`, {
        icon: '✏️',
      });
      return updated;
    } catch (err) {
      console.error('Error updating candidate:', err);
      toast.error('Failed to update candidate. Please try again.');
      throw err;
    }
  }, []);

  // DELETE Candidate (Real DummyJSON DELETE API call + State + LocalStorage)
  const deleteCandidate = useCallback(async (id, candidateName = 'Candidate') => {
    try {
      await deleteDummyJsonCandidate(id);
      setCandidates((prev) => prev.filter((c) => c.id !== Number(id) && c.id !== id));
      setSelectedCandidate((prev) => {
        if (prev && (prev.id === Number(id) || prev.id === id)) {
          return candidates.find((c) => c.id !== Number(id) && c.id !== id) || null;
        }
        return prev;
      });
      toast.info(`Candidate ${candidateName} has been deleted.`, {
        icon: '🗑️',
      });
      return true;
    } catch (err) {
      console.error('Error deleting candidate:', err);
      toast.error('Failed to delete candidate. Please try again.');
      throw err;
    }
  }, [candidates]);

  // Toggle Shortlist status with toast feedback
  const toggleShortlist = useCallback((candidateId, candidateName = 'Candidate') => {
    const isNowShortlisted = toggleCandidateShortlistStorage(candidateId);
    setShortlistedIds(getShortlistedCandidateIds());
    if (isNowShortlisted) {
      toast.success(`${candidateName} has been shortlisted!`, {
        icon: '⭐',
      });
    } else {
      toast.info(`${candidateName} removed from shortlist.`);
    }
    return isNowShortlisted;
  }, []);

  // Check if candidate is shortlisted
  const isShortlisted = useCallback(
    (candidateId) => {
      const cleanId = Number(String(candidateId).replace(/\D/g, '')) || 1;
      return shortlistedIds.includes(cleanId);
    },
    [shortlistedIds]
  );

  // Send message to candidate
  const sendMessage = useCallback((candidateName, messageText) => {
    toast.success(`Message sent successfully to ${candidateName}!`, {
      icon: '💬',
    });
    return true;
  }, []);

  const value = {
    candidates,
    loading,
    error,
    selectedCandidate,
    shortlistedIds,
    searchQuery,
    loadCandidates,
    getCandidate,
    selectCandidate,
    searchCandidates,
    createCandidate,
    updateCandidate,
    deleteCandidate,
    toggleShortlist,
    isShortlisted,
    sendMessage,
  };

  return <CandidatesContext.Provider value={value}>{children}</CandidatesContext.Provider>;
};

export const useCandidates = () => {
  const context = useContext(CandidatesContext);
  if (!context) {
    throw new Error('useCandidates must be used within a CandidatesProvider');
  }
  return context;
};
