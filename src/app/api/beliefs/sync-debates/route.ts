import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { BELIEF_CONSTANTS } from '@/lib/constants/belief';
import { BeliefSyncResult } from '@/types/belief';

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const windowMs = BELIEF_CONSTANTS.RATE_LIMITS.SYNC_DEBATES.WINDOW_MINUTES * 60 * 1000;
  const maxRequests = BELIEF_CONSTANTS.RATE_LIMITS.SYNC_DEBATES.MAX_REQUESTS;

  const userLimit = rateLimitStore.get(userId);

  if (!userLimit || now > userLimit.resetTime) {
    // Reset or create new limit
    rateLimitStore.set(userId, {
      count: 1,
      resetTime: now + windowMs,
    });
    return true;
  }

  if (userLimit.count >= maxRequests) {
    return false;
  }

  userLimit.count++;
  return true;
}

// Simple NLP analysis for belief detection (basic implementation)
function analyzeDebateForBeliefs(messages: any[]): any[] {
  const beliefPatterns = [
    /I (believe|think|feel) (that )?/i,
    /I'm (convinced|sure|certain) (that )?/i,
    /I've (changed my mind|realized|come to believe)/i,
    /My view on/i,
    /I used to think/i,
    /Now I understand/i,
  ];

  const beliefs: any[] = [];

  for (const message of messages) {
    const content = message.content?.toLowerCase() || '';

    for (const pattern of beliefPatterns) {
      if (pattern.test(content)) {
        // Extract potential belief topics (very basic)
        const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);

        for (const sentence of sentences) {
          if (pattern.test(sentence)) {
            // Try to extract a topic (very naive approach)
            const words = sentence.split(' ');
            const topicWords = words.slice(0, Math.min(5, words.length));
            const topic = topicWords.join(' ').trim();

            if (topic.length > 5) {
              beliefs.push({
                topic: topic.charAt(0).toUpperCase() + topic.slice(1),
                content: sentence.trim(),
                messageId: message.id,
                confidenceShift: Math.random() * 40 - 20, // Random shift for demo
                reasoning: `Detected in debate message: "${sentence.trim()}"`,
                evidence: [message.content],
              });
              break; // Only one belief per message for now
            }
          }
        }
        break; // Only process first matching pattern per message
      }
    }
  }

  return beliefs;
}

// POST /api/beliefs/sync-debates - Sync beliefs with debate analysis
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

    // Check rate limit
    if (!checkRateLimit(user.id)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    // Get recent debate messages (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select(`
        id,
        content,
        created_at,
        sessions!inner(
          user_id
        )
      `)
      .eq('sessions.user_id', user.id)
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: false })
      .limit(100); // Limit to prevent excessive processing

    if (messagesError) {
      console.error('Messages fetch error:', messagesError);
      return NextResponse.json(
        { error: 'Failed to fetch debate messages' },
        { status: 500 }
      );
    }

    if (!messages || messages.length === 0) {
      return NextResponse.json({
        syncedBeliefs: 0,
        newBeliefs: 0,
        updatedBeliefs: 0,
        analysis: [],
        message: 'No recent debate messages found to analyze.',
      });
    }

    // Analyze messages for beliefs
    const detectedBeliefs = analyzeDebateForBeliefs(messages);

    if (detectedBeliefs.length === 0) {
      return NextResponse.json({
        syncedBeliefs: 0,
        newBeliefs: 0,
        updatedBeliefs: 0,
        analysis: [],
        message: 'No belief changes detected in recent debates.',
      });
    }

    let newBeliefs = 0;
    let updatedBeliefs = 0;

    // Process each detected belief
    for (const detected of detectedBeliefs) {
      try {
        // Check if a similar belief already exists
        const { data: existingBeliefs } = await supabase
          .from('beliefs')
          .select('id, topic, confidence_current')
          .eq('user_id', user.id)
          .ilike('topic', `%${detected.topic.toLowerCase()}%`)
          .is('deleted_at', null)
          .limit(1);

        if (existingBeliefs && existingBeliefs.length > 0) {
          // Update existing belief
          const existing = existingBeliefs[0];
          const newConfidence = Math.max(0, Math.min(100,
            existing.confidence_current + detected.confidenceShift
          ));

          await supabase
            .from('beliefs')
            .update({
              confidence_current: Math.round(newConfidence),
              updated_at: new Date().toISOString(),
            })
            .eq('id', existing.id);

          updatedBeliefs++;
        } else {
          // Create new belief
          const initialConfidence = 50; // Default starting confidence
          const currentConfidence = Math.max(0, Math.min(100,
            initialConfidence + detected.confidenceShift
          ));

          await supabase
            .from('beliefs')
            .insert({
              user_id: user.id,
              topic: detected.topic,
              description: `Detected from debate analysis: ${detected.reasoning}`,
              confidence_initial: initialConfidence,
              confidence_current: Math.round(currentConfidence),
              tags: ['debate-analysis'],
            });

          newBeliefs++;
        }
      } catch (error) {
        console.error('Error processing detected belief:', error);
        // Continue processing other beliefs
      }
    }

    const result: BeliefSyncResult = {
      syncedBeliefs: newBeliefs + updatedBeliefs,
      newBeliefs,
      updatedBeliefs,
      analysis: detectedBeliefs,
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('POST /api/beliefs/sync-debates error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}