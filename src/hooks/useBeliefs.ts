"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  fetchBeliefs,
  createBelief,
  updateBelief,
  deleteBelief,
  syncBeliefsWithDebates,
  calculateBeliefMetrics,
  cacheBeliefsData,
  getCachedBeliefsData,
  clearBeliefsCache,
} from '@/lib/services/belief-service';
import { BELIEF_CONSTANTS } from '@/lib/constants/belief';
import { showToast, showErrorToast } from '@/lib/toast';
import type {
  Belief,
  BeliefQuery,
  BeliefMetrics,
  CreateBeliefRequest,
  UpdateBeliefRequest,
  BeliefSyncResult,
} from '@/types/belief';

// Hook return type
export interface UseBeliefsReturn {
  // State
  beliefs: Belief[];
  metrics: BeliefMetrics;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;

  // Filters and pagination
  filters: BeliefQuery;
  setFilters: (filters: Partial<BeliefQuery>) => void;
  resetFilters: () => void;

  // Actions
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
  createBelief: (data: CreateBeliefRequest) => Promise<Belief | null>;
  updateBelief: (id: string, data: UpdateBeliefRequest) => Promise<Belief | null>;
  deleteBelief: (id: string) => Promise<boolean>;
  syncWithDebates: () => Promise<BeliefSyncResult | null>;

  // Utilities
  isAuthenticated: boolean;
  clearCache: () => void;
}

export function useBeliefs(initialFilters: Partial<BeliefQuery> = {}): UseBeliefsReturn {
  // State
  const [beliefs, setBeliefs] = useState<Belief[]>([]);
  const [metrics, setMetrics] = useState<BeliefMetrics>({
    totalShifts: 0,
    opennessLevel: 0,
    reinforcedCount: 0,
    shatteredCount: 0,
    shiftedCount: 0,
    averageConfidence: 0,
    totalBeliefs: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Filters and pagination
  const [filters, setFiltersState] = useState<BeliefQuery>({
    page: 1,
    limit: BELIEF_CONSTANTS.PAGINATION.DEFAULT_LIMIT,
    sortBy: 'created_at',
    sortOrder: 'desc',
    ...initialFilters,
  });

  // Refs for cleanup and caching
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  // Load filters from localStorage on mount
  useEffect(() => {
    const savedFilters = localStorage.getItem(BELIEF_CONSTANTS.STORAGE_KEYS.FILTERS);
    const savedPagination = localStorage.getItem(BELIEF_CONSTANTS.STORAGE_KEYS.PAGINATION);

    if (savedFilters) {
      try {
        const parsedFilters = JSON.parse(savedFilters);
        setFiltersState(prev => ({ ...prev, ...parsedFilters }));
      } catch (e) {
        console.error('Failed to parse saved filters:', e);
      }
    }

    if (savedPagination) {
      try {
        const parsedPagination = JSON.parse(savedPagination);
        setCurrentPage(parsedPagination.page || 1);
      } catch (e) {
        console.error('Failed to parse saved pagination:', e);
      }
    }
  }, []);

  // Save filters to localStorage when they change
  useEffect(() => {
    localStorage.setItem(BELIEF_CONSTANTS.STORAGE_KEYS.FILTERS, JSON.stringify({
      status: filters.status,
      trend: filters.trend,
      search: filters.search,
      tags: filters.tags,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    }));
  }, [filters]);

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setIsAuthenticated(!!user);

        if (!user) {
          setError('Please sign in to view your beliefs');
          setLoading(false);
          return;
        }

        // Load initial data
        await loadBeliefs(true);
      } catch (err: any) {
        console.error('Auth check error:', err);
        setError('Authentication check failed');
        setLoading(false);
      }
    };

    checkAuth();

    // Cleanup
    return () => {
      isMountedRef.current = false;
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Set up auto-refresh
  useEffect(() => {
    if (!isAuthenticated) return;

    // Clear existing interval
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }

    // Set up new interval
    refreshIntervalRef.current = setInterval(() => {
      if (isMountedRef.current) {
        refresh();
      }
    }, BELIEF_CONSTANTS.REFRESH_INTERVAL);

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [isAuthenticated]);


  // Load more beliefs
  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    setCurrentPage(prev => prev + 1);
  }, [hasMore, loading]);

  // Set filters
  const setFilters = useCallback((newFilters: Partial<BeliefQuery>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters, page: 1 }));
    setCurrentPage(1);
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFiltersState({
      page: 1,
      limit: BELIEF_CONSTANTS.PAGINATION.DEFAULT_LIMIT,
      sortBy: 'created_at',
      sortOrder: 'desc',
    });
    setCurrentPage(1);
  }, []);

  // Create belief
  const handleCreateBelief = useCallback(async (data: CreateBeliefRequest): Promise<Belief | null> => {
    try {
      const newBelief = await createBelief(data);

      if (isMountedRef.current) {
        // Optimistically add to the list
        setBeliefs(prev => [newBelief, ...prev]);
        setMetrics(prev => calculateBeliefMetrics([newBelief, ...prev]));

        // Refresh to get accurate data
        setTimeout(() => refresh(), 1000);
      }

      return newBelief;
    } catch (err: any) {
      return null;
    }
  }, [refresh]);

  // Update belief
  const handleUpdateBelief = useCallback(async (id: string, data: UpdateBeliefRequest): Promise<Belief | null> => {
    try {
      const updatedBelief = await updateBelief(id, data);

      if (isMountedRef.current) {
        // Optimistically update in the list
        setBeliefs(prev => prev.map(b => b.id === id ? updatedBelief : b));
        setMetrics(prev => calculateBeliefMetrics(prev.map(b => b.id === id ? updatedBelief : b)));

        // Refresh to get accurate data
        setTimeout(() => refresh(), 1000);
      }

      return updatedBelief;
    } catch (err: any) {
      return null;
    }
  }, [refresh]);

  // Delete belief
  const handleDeleteBelief = useCallback(async (id: string): Promise<boolean> => {
    try {
      await deleteBelief(id);

      if (isMountedRef.current) {
        // Optimistically remove from the list
        setBeliefs(prev => prev.filter(b => b.id !== id));
        setMetrics(prev => calculateBeliefMetrics(prev.filter(b => b.id !== id)));

        // Refresh to get accurate data
        setTimeout(() => refresh(), 1000);
      }

      return true;
    } catch (err: any) {
      return false;
    }
  }, [refresh]);

  // Sync with debates
  const syncWithDebates = useCallback(async (): Promise<BeliefSyncResult | null> => {
    try {
      const result = await syncBeliefsWithDebates();

      if (isMountedRef.current) {
        // Refresh beliefs after sync
        setTimeout(() => refresh(), 2000);
      }

      return result;
    } catch (err: any) {
      return null;
    }
  }, [refresh]);

  // Clear cache
  const clearCache = useCallback(() => {
    clearBeliefsCache();
    showToast.info('Cache cleared', 'Beliefs cache has been cleared');
  }, []);

  // Reload when filters or pagination change
  useEffect(() => {
    if (isAuthenticated) {
      loadBeliefs(true);
    }
  }, [filters, loadBeliefs, isAuthenticated]);

  return {
    // State
    beliefs,
    metrics,
    loading,
    error,
    hasMore,
    currentPage,

    // Filters and pagination
    filters,
    setFilters,
    resetFilters,

    // Actions
    refresh,
    loadMore,
    createBelief: handleCreateBelief,
    updateBelief: handleUpdateBelief,
    deleteBelief: handleDeleteBelief,
    syncWithDebates,

    // Utilities
    isAuthenticated,
    clearCache,
  };
}