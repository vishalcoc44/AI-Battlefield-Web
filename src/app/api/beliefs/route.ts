import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { BELIEF_CONSTANTS } from '@/lib/constants/belief';
import { Belief, CreateBeliefRequest, BeliefQuery } from '@/types/belief';
import { z } from 'zod';

// Validation schemas
const createBeliefSchema = z.object({
  topic: z.string()
    .min(BELIEF_CONSTANTS.VALIDATION.TOPIC.MIN_LENGTH)
    .max(BELIEF_CONSTANTS.VALIDATION.TOPIC.MAX_LENGTH)
    .trim(),
  description: z.string()
    .max(BELIEF_CONSTANTS.VALIDATION.DESCRIPTION.MAX_LENGTH)
    .optional(),
  confidence_initial: z.number()
    .min(BELIEF_CONSTANTS.VALIDATION.CONFIDENCE.MIN)
    .max(BELIEF_CONSTANTS.VALIDATION.CONFIDENCE.MAX),
  confidence_current: z.number()
    .min(BELIEF_CONSTANTS.VALIDATION.CONFIDENCE.MIN)
    .max(BELIEF_CONSTANTS.VALIDATION.CONFIDENCE.MAX),
  tags: z.array(z.string().max(BELIEF_CONSTANTS.VALIDATION.TAGS.MAX_LENGTH))
    .max(BELIEF_CONSTANTS.VALIDATION.TAGS.MAX_COUNT)
    .default([]),
});

const beliefQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number()
    .min(1)
    .max(BELIEF_CONSTANTS.PAGINATION.MAX_LIMIT)
    .default(BELIEF_CONSTANTS.PAGINATION.DEFAULT_LIMIT),
  status: z.enum(['Reinforced', 'Shifted', 'Shattered', 'Neutral']).optional(),
  trend: z.enum(['up', 'down', 'neutral']).optional(),
  search: z.string().max(100).optional(),
  tags: z.string().optional(), // comma-separated
  sortBy: z.enum(['created_at', 'updated_at', 'confidence_current', 'topic']).default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Helper function to calculate status and trend
function calculateStatusAndTrend(initial: number, current: number) {
  const diff = current - initial;
  const absDiff = Math.abs(diff);

  let trend: 'up' | 'down' | 'neutral' = 'neutral';
  if (diff > 0) trend = 'up';
  else if (diff < 0) trend = 'down';

  let status: 'Reinforced' | 'Shifted' | 'Shattered' | 'Neutral' = 'Neutral';
  if (absDiff >= BELIEF_CONSTANTS.STATUS_THRESHOLDS.REINFORCED_MIN_CHANGE) {
    status = trend === 'up' ? 'Reinforced' : 'Shattered';
  } else if (absDiff >= BELIEF_CONSTANTS.STATUS_THRESHOLDS.SHIFTED_MIN_CHANGE) {
    status = 'Shifted';
  }

  return { status, trend };
}

// GET /api/beliefs - List beliefs with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const validation = beliefQuerySchema.safeParse(queryParams);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: validation.error.issues },
        { status: 400 }
      );
    }

    const query = validation.data;

    // Build the query
    let dbQuery = supabase
      .from('beliefs')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .is('deleted_at', null);

    // Apply filters
    if (query.status) {
      dbQuery = dbQuery.eq('status', query.status);
    }

    if (query.trend) {
      dbQuery = dbQuery.eq('trend', query.trend);
    }

    if (query.search) {
      dbQuery = dbQuery.or(`topic.ilike.%${query.search}%,description.ilike.%${query.search}%`);
    }

    if (query.tags) {
      const tagArray = query.tags.split(',').map(tag => tag.trim());
      // Filter beliefs that contain any of the specified tags
      dbQuery = dbQuery.contains('tags', tagArray);
    }

    // Apply sorting
    const orderBy = query.sortBy;
    const ascending = query.sortOrder === 'asc';
    dbQuery = dbQuery.order(orderBy, { ascending });

    // Apply pagination
    const from = (query.page - 1) * query.limit;
    const to = from + query.limit - 1;
    dbQuery = dbQuery.range(from, to);

    const { data: beliefs, error, count } = await dbQuery;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch beliefs' },
        { status: 500 }
      );
    }

    const total = count || 0;
    const hasMore = total > (query.page * query.limit);

    return NextResponse.json({
      beliefs: beliefs || [],
      total,
      hasMore,
      page: query.page,
      limit: query.limit,
    });

  } catch (error) {
    console.error('GET /api/beliefs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/beliefs - Create a new belief
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = createBeliefSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error.issues },
        { status: 400 }
      );
    }

    const beliefData = validation.data;

    // Calculate status and trend
    const { status, trend } = calculateStatusAndTrend(
      beliefData.confidence_initial,
      beliefData.confidence_current
    );

    // Create the belief
    const { data: belief, error } = await supabase
      .from('beliefs')
      .insert({
        user_id: user.id,
        topic: beliefData.topic,
        description: beliefData.description || null,
        confidence_initial: beliefData.confidence_initial,
        confidence_current: beliefData.confidence_current,
        status,
        trend,
        tags: beliefData.tags,
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);

      // Handle unique constraint violations
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'A belief with this topic already exists' },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to create belief' },
        { status: 500 }
      );
    }

    return NextResponse.json(belief, { status: 201 });

  } catch (error) {
    console.error('POST /api/beliefs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}