"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { BELIEF_CONSTANTS } from '@/lib/constants/belief';
import { BeliefQuery } from '@/types/belief';
import { cn } from '@/lib/utils';

interface BeliefFiltersProps {
  filters: BeliefQuery;
  onFiltersChange: (filters: Partial<BeliefQuery>) => void;
  onResetFilters: () => void;
  totalResults?: number;
  className?: string;
}

export function BeliefFilters({
  filters,
  onFiltersChange,
  onResetFilters,
  totalResults,
  className
}: BeliefFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Check if any filters are active
  const hasActiveFilters = !!(
    filters.search ||
    filters.status ||
    filters.trend ||
    (filters.tags && filters.tags.length > 0) ||
    filters.sortBy !== 'created_at' ||
    filters.sortOrder !== 'desc'
  );

  // Handle search input with debounce
  const handleSearchChange = (value: string) => {
    onFiltersChange({ search: value || undefined, page: 1 });
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof BeliefQuery, value: string | string[] | undefined) => {
    onFiltersChange({ [key]: value, page: 1 });
  };

  // Get active filter badges
  const getActiveFilterBadges = () => {
    const badges = [];

    if (filters.search) {
      badges.push(
        <Badge key="search" variant="secondary" className="bg-blue-500/10 text-blue-400">
          Search: {filters.search}
          <button
            onClick={() => handleFilterChange('search', undefined)}
            className="ml-2 hover:text-red-400"
            aria-label="Remove search filter"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      );
    }

    if (filters.status) {
      badges.push(
        <Badge key="status" variant="secondary" className="bg-emerald-500/10 text-emerald-400">
          Status: {filters.status}
          <button
            onClick={() => handleFilterChange('status', undefined)}
            className="ml-2 hover:text-red-400"
            aria-label="Remove status filter"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      );
    }

    if (filters.trend) {
      badges.push(
        <Badge key="trend" variant="secondary" className="bg-orange-500/10 text-orange-400">
          Trend: {filters.trend}
          <button
            onClick={() => handleFilterChange('trend', undefined)}
            className="ml-2 hover:text-red-400"
            aria-label="Remove trend filter"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      );
    }

    return badges;
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search bar */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search beliefs..."
            value={filters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-zinc-500"
            aria-label="Search beliefs"
          />
        </div>

        <Button
          variant="outline"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={cn(
            "border-white/20 text-white hover:bg-white/5 gap-2",
            showAdvanced && "bg-white/10"
          )}
          aria-expanded={showAdvanced}
          aria-controls="advanced-filters"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={onResetFilters}
            className="text-zinc-400 hover:text-white hover:bg-red-500/10"
            aria-label="Reset all filters"
          >
            <X className="h-4 w-4 mr-2" />
            Reset
          </Button>
        )}
      </div>

      {/* Active filter badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {getActiveFilterBadges()}
        </div>
      )}

      {/* Advanced filters */}
      {showAdvanced && (
        <div
          id="advanced-filters"
          className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-white/5 rounded-xl border border-white/10"
        >
          {/* Status filter */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-white">Status</label>
            <Select
              value={filters.status || ''}
              onValueChange={(value) => handleFilterChange('status', value || undefined)}
            >
              <SelectTrigger className="bg-black border-white/20 text-white">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/20">
                <SelectItem value="">All statuses</SelectItem>
                {BELIEF_CONSTANTS.STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Trend filter */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-white">Trend</label>
            <Select
              value={filters.trend || ''}
              onValueChange={(value) => handleFilterChange('trend', value || undefined)}
            >
              <SelectTrigger className="bg-black border-white/20 text-white">
                <SelectValue placeholder="All trends" />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/20">
                <SelectItem value="">All trends</SelectItem>
                {BELIEF_CONSTANTS.TREND_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort by */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-white">Sort by</label>
            <Select
              value={filters.sortBy || 'created_at'}
              onValueChange={(value) => handleFilterChange('sortBy', value)}
            >
              <SelectTrigger className="bg-black border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/20">
                {BELIEF_CONSTANTS.SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort order */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-white">Order</label>
            <Select
              value={filters.sortOrder || 'desc'}
              onValueChange={(value) => handleFilterChange('sortOrder', value as 'asc' | 'desc')}
            >
              <SelectTrigger className="bg-black border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/20">
                <SelectItem value="desc">Newest first</SelectItem>
                <SelectItem value="asc">Oldest first</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Results count */}
      {totalResults !== undefined && (
        <div className="text-sm text-zinc-400">
          {totalResults === 0 ? (
            'No beliefs found'
          ) : (
            <>
              {totalResults} belief{totalResults === 1 ? '' : 's'} found
              {hasActiveFilters && ' (filtered)'}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// Skeleton loading component for filters
export function BeliefFiltersSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <div className="animate-pulse h-10 bg-zinc-700 rounded"></div>
        </div>
        <div className="animate-pulse h-10 w-24 bg-zinc-700 rounded"></div>
      </div>
    </div>
  );
}