import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { BELIEF_CONSTANTS } from '@/lib/constants/belief';
import { UpdateBeliefRequest } from '@/types/belief';
import { z } from 'zod';

// Validation schema for updates
const updateBeliefSchema = z.object({
  topic: z.string()
    .min(BELIEF_CONSTANTS.VALIDATION.TOPIC.MIN_LENGTH)
    .max(BELIEF_CONSTANTS.VALIDATION.TOPIC.MAX_LENGTH)
    .trim()
    .optional(),
  description: z.string()
    .max(BELIEF_CONSTANTS.VALIDATION.DESCRIPTION.MAX_LENGTH)
    .optional(),
  confidence_current: z.number()
    .min(BELIEF_CONSTANTS.VALIDATION.CONFIDENCE.MIN)
    .max(BELIEF_CONSTANTS.VALIDATION.CONFIDENCE.MAX)
    .optional(),
  tags: z.array(z.string().max(BELIEF_CONSTANTS.VALIDATION.TAGS.MAX_LENGTH))
    .max(BELIEF_CONSTANTS.VALIDATION.TAGS.MAX_COUNT)
    .optional(),
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

// GET /api/beliefs/[id] - Get a specific belief with history
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createClient();
    const { id } = await params;

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: 'Invalid belief ID format' },
        { status: 400 }
      );
    }

    // Get belief with history
    const { data: belief, error: beliefError } = await supabase
      .from('beliefs')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .single();

    if (beliefError) {
      if (beliefError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Belief not found' },
          { status: 404 }
        );
      }
      console.error('Database error:', beliefError);
      return NextResponse.json(
        { error: 'Failed to fetch belief' },
        { status: 500 }
      );
    }

    // Get belief history
    const { data: history, error: historyError } = await supabase
      .from('belief_history')
      .select('*')
      .eq('belief_id', id)
      .order('created_at', { ascending: true });

    if (historyError) {
      console.error('History fetch error:', historyError);
      // Don't fail the request if history fails, just return empty array
    }

    return NextResponse.json({
      ...belief,
      history: history || [],
    });

  } catch (error) {
    console.error('GET /api/beliefs/[id] error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/beliefs/[id] - Update a belief
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createClient();
    const { id } = await params;

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: 'Invalid belief ID format' },
        { status: 400 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = updateBeliefSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error.issues },
        { status: 400 }
      );
    }

    const updateData = validation.data;

    // First, get the current belief to calculate new status/trend if confidence changes
    const { data: currentBelief, error: fetchError } = await supabase
      .from('beliefs')
      .select('confidence_initial, confidence_current')
      .eq('id', id)
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Belief not found' },
          { status: 404 }
        );
      }
      console.error('Fetch error:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch belief' },
        { status: 500 }
      );
    }

    // Prepare update data
    const finalUpdateData: any = { ...updateData };

    // Recalculate status and trend if confidence changes
    if (updateData.confidence_current !== undefined) {
      const { status, trend } = calculateStatusAndTrend(
        currentBelief.confidence_initial,
        updateData.confidence_current
      );
      finalUpdateData.status = status;
      finalUpdateData.trend = trend;
    }

    // Update the belief
    const { data: belief, error } = await supabase
      .from('beliefs')
      .update(finalUpdateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to update belief' },
        { status: 500 }
      );
    }

    return NextResponse.json(belief);

  } catch (error) {
    console.error('PUT /api/beliefs/[id] error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/beliefs/[id] - Soft delete a belief
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createClient();
    const { id } = await params;

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: 'Invalid belief ID format' },
        { status: 400 }
      );
    }

    // Soft delete the belief
    const { data: belief, error } = await supabase
      .from('beliefs')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Belief not found' },
          { status: 404 }
        );
      }
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to delete belief' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Belief deleted successfully' });

  } catch (error) {
    console.error('DELETE /api/beliefs/[id] error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}