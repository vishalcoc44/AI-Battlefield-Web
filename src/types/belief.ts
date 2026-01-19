// Belief-related types and interfaces

export type BeliefStatus = 'Reinforced' | 'Shifted' | 'Shattered' | 'Neutral';
export type BeliefTrend = 'up' | 'down' | 'neutral';

// Core belief interface
export interface Belief {
  id: string;
  user_id: string;
  topic: string;
  description?: string;
  confidence_initial: number;
  confidence_current: number;
  status: BeliefStatus;
  trend: BeliefTrend;
  tags: string[];
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

// Belief history for tracking confidence changes over time
export interface BeliefHistory {
  id: string;
  belief_id: string;
  confidence_value: number;
  change_reason?: string;
  source?: string;
  created_at: string;
}

// Metrics for belief statistics
export interface BeliefMetrics {
  totalShifts: number;
  opennessLevel: number; // 1-10 scale
  reinforcedCount: number;
  shatteredCount: number;
  shiftedCount: number;
  averageConfidence: number;
  totalBeliefs: number;
}

// Form data for creating/editing beliefs
export interface BeliefFormData {
  topic: string;
  description?: string;
  confidence_initial: number;
  confidence_current: number;
  tags: string[];
}

// API response types
export interface BeliefsResponse {
  beliefs: Belief[];
  total: number;
  hasMore: boolean;
}

export interface BeliefDetailResponse extends Belief {
  history: BeliefHistory[];
}

// Filter and sort options
export interface BeliefFilters {
  status?: BeliefStatus;
  trend?: BeliefTrend;
  search?: string;
  tags?: string[];
  sortBy?: 'created_at' | 'updated_at' | 'confidence_current' | 'topic';
  sortOrder?: 'asc' | 'desc';
}

// Pagination options
export interface BeliefPagination {
  page: number;
  limit: number;
}

// Combined query parameters
export interface BeliefQuery extends BeliefFilters, BeliefPagination {}

// Hook state interfaces
export interface UseBeliefsState {
  beliefs: Belief[];
  metrics: BeliefMetrics;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  filters: BeliefFilters;
  lastUpdated: number;
}

// API request types
export interface CreateBeliefRequest extends Omit<BeliefFormData, 'tags'> {
  tags?: string[];
}

export interface UpdateBeliefRequest extends Partial<CreateBeliefRequest> {
  id: string;
}

// Debate sync related types
export interface DebateBeliefAnalysis {
  topic: string;
  confidenceShift: number;
  reasoning: string;
  evidence: string[];
}

export interface BeliefSyncResult {
  syncedBeliefs: number;
  newBeliefs: number;
  updatedBeliefs: number;
  analysis: DebateBeliefAnalysis[];
}

// Export validation rules
export const BELIEF_VALIDATION = {
  TOPIC: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 200
  },
  DESCRIPTION: {
    MAX_LENGTH: 1000
  },
  CONFIDENCE: {
    MIN: 0,
    MAX: 100
  },
  TAGS: {
    MAX_COUNT: 10,
    MAX_LENGTH: 50
  }
} as const;