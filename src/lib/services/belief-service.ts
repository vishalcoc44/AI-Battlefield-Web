import { withRetry } from '@/lib/utils';
import { showToast, showErrorToast } from '@/lib/toast';
import { BELIEF_CONSTANTS } from '@/lib/constants/belief';
import {
  Belief,
  BeliefQuery,
  BeliefsResponse,
  BeliefDetailResponse,
  CreateBeliefRequest,
  UpdateBeliefRequest,
  BeliefSyncResult,
} from '@/types/belief';

// Base API configuration
const API_BASE = '/api/beliefs';
const DEFAULT_TIMEOUT = 30000; // 30 seconds

// Helper function to handle API responses
async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = BELIEF_CONSTANTS.ERROR_MESSAGES.SERVER_ERROR;

    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch (e) {
      // If we can't parse error response, use default message
    }

    // Handle specific HTTP status codes
    switch (response.status) {
      case 401:
        errorMessage = BELIEF_CONSTANTS.ERROR_MESSAGES.AUTH_ERROR;
        break;
      case 403:
        errorMessage = BELIEF_CONSTANTS.ERROR_MESSAGES.PERMISSION_ERROR;
        break;
      case 404:
        errorMessage = BELIEF_CONSTANTS.ERROR_MESSAGES.NOT_FOUND;
        break;
      case 429:
        errorMessage = BELIEF_CONSTANTS.ERROR_MESSAGES.RATE_LIMITED;
        break;
      case 400:
        errorMessage = BELIEF_CONSTANTS.ERROR_MESSAGES.VALIDATION_ERROR;
        break;
    }

    throw new Error(errorMessage);
  }

  return response.json();
}

// Helper function to create AbortController with timeout
function createTimeoutController(timeoutMs: number = DEFAULT_TIMEOUT) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  // Clear timeout when request completes
  const originalSignal = controller.signal;
  controller.signal.addEventListener('abort', () => clearTimeout(timeoutId));

  return controller;
}

// Fetch beliefs with filtering and pagination
export async function fetchBeliefs(query: BeliefQuery = {}): Promise<BeliefsResponse> {
  return withRetry(async () => {
    const controller = createTimeoutController();

    // Build query string
    const params = new URLSearchParams();

    if (query.page && query.page > 1) params.append('page', query.page.toString());
    if (query.limit && query.limit !== BELIEF_CONSTANTS.PAGINATION.DEFAULT_LIMIT) {
      params.append('limit', query.limit.toString());
    }
    if (query.status) params.append('status', query.status);
    if (query.trend) params.append('trend', query.trend);
    if (query.search) params.append('search', query.search);
    if (query.tags && query.tags.length > 0) params.append('tags', query.tags.join(','));
    if (query.sortBy) params.append('sortBy', query.sortBy);
    if (query.sortOrder) params.append('sortOrder', query.sortOrder);

    const url = `${API_BASE}?${params.toString()}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      return await handleApiResponse<BeliefsResponse>(response);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please try again');
      }
      throw error;
    }
  }, 3, 1000).catch((error) => {
    console.error('Failed to fetch beliefs:', error);
    showErrorToast(error);
    throw error;
  });
}

// Fetch a single belief with history
export async function fetchBeliefById(id: string): Promise<BeliefDetailResponse> {
  return withRetry(async () => {
    const controller = createTimeoutController();

    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      return await handleApiResponse<BeliefDetailResponse>(response);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please try again');
      }
      throw error;
    }
  }, 3, 1000).catch((error) => {
    console.error('Failed to fetch belief:', error);
    showErrorToast(error);
    throw error;
  });
}

// Create a new belief
export async function createBelief(beliefData: CreateBeliefRequest): Promise<Belief> {
  return withRetry(async () => {
    const controller = createTimeoutController();

    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(beliefData),
        signal: controller.signal,
      });

      const result = await handleApiResponse<Belief>(response);

      // Show success message
      showToast.success(
        BELIEF_CONSTANTS.SUCCESS_MESSAGES.BELIEF_CREATED,
        `Belief "${beliefData.topic}" has been created successfully.`
      );

      return result;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please try again');
      }
      throw error;
    }
  }, 3, 1000).catch((error) => {
    console.error('Failed to create belief:', error);
    showErrorToast(error);
    throw error;
  });
}

// Update an existing belief
export async function updateBelief(id: string, updateData: UpdateBeliefRequest): Promise<Belief> {
  return withRetry(async () => {
    const controller = createTimeoutController();

    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
        signal: controller.signal,
      });

      const result = await handleApiResponse<Belief>(response);

      // Show success message
      showToast.success(
        BELIEF_CONSTANTS.SUCCESS_MESSAGES.BELIEF_UPDATED,
        `Belief has been updated successfully.`
      );

      return result;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please try again');
      }
      throw error;
    }
  }, 3, 1000).catch((error) => {
    console.error('Failed to update belief:', error);
    showErrorToast(error);
    throw error;
  });
}

// Delete a belief (soft delete)
export async function deleteBelief(id: string): Promise<void> {
  return withRetry(async () => {
    const controller = createTimeoutController();

    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      await handleApiResponse<void>(response);

      // Show success message
      showToast.success(BELIEF_CONSTANTS.SUCCESS_MESSAGES.BELIEF_DELETED);

    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please try again');
      }
      throw error;
    }
  }, 3, 1000).catch((error) => {
    console.error('Failed to delete belief:', error);
    showErrorToast(error);
    throw error;
  });
}

// Sync beliefs with debate analysis
export async function syncBeliefsWithDebates(): Promise<BeliefSyncResult> {
  return withRetry(async () => {
    const controller = createTimeoutController(60000); // 1 minute timeout for sync

    try {
      const response = await fetch(`${BELIEF_CONSTANTS.API.SYNC_DEBATES}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      const result = await handleApiResponse<BeliefSyncResult>(response);

      // Show success message
      const message = result.syncedBeliefs > 0
        ? `${result.syncedBeliefs} belief${result.syncedBeliefs === 1 ? '' : 's'} synced from recent debates.`
        : 'No new beliefs detected in recent debates.';

      showToast.success(
        BELIEF_CONSTANTS.SUCCESS_MESSAGES.SYNC_COMPLETED,
        message
      );

      return result;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Sync timeout - analysis may take longer for large debate histories');
      }
      throw error;
    }
  }, 2, 2000).catch((error) => {
    console.error('Failed to sync beliefs with debates:', error);
    showErrorToast(error);
    throw error;
  });
}

// Calculate belief metrics from a list of beliefs
export function calculateBeliefMetrics(beliefs: Belief[]): BeliefMetrics {
  if (beliefs.length === 0) {
    return {
      totalShifts: 0,
      opennessLevel: 0,
      reinforcedCount: 0,
      shatteredCount: 0,
      shiftedCount: 0,
      averageConfidence: 0,
      totalBeliefs: 0,
    };
  }

  const reinforcedCount = beliefs.filter(b => b.status === 'Reinforced').length;
  const shatteredCount = beliefs.filter(b => b.status === 'Shattered').length;
  const shiftedCount = beliefs.filter(b => b.status === 'Shifted').length;

  // Calculate total shifts (beliefs that changed from initial state)
  const totalShifts = reinforcedCount + shatteredCount + shiftedCount;

  // Calculate openness level (0-10 scale based on shift frequency)
  const opennessLevel = Math.min(10, Math.round((totalShifts / beliefs.length) * 10));

  // Calculate average confidence
  const averageConfidence = Math.round(
    beliefs.reduce((sum, b) => sum + b.confidence_current, 0) / beliefs.length
  );

  return {
    totalShifts,
    opennessLevel,
    reinforcedCount,
    shatteredCount,
    shiftedCount,
    averageConfidence,
    totalBeliefs: beliefs.length,
  };
}

// Cache management for offline support
const beliefCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function cacheBeliefsData(key: string, data: any): void {
  beliefCache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

export function getCachedBeliefsData(key: string): any | null {
  const cached = beliefCache.get(key);
  if (!cached) return null;

  if (Date.now() - cached.timestamp > CACHE_DURATION) {
    beliefCache.delete(key);
    return null;
  }

  return cached.data;
}

export function clearBeliefsCache(): void {
  beliefCache.clear();
}