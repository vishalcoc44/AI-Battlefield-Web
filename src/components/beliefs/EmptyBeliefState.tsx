"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Plus, BookOpen, TrendingUp } from 'lucide-react';
import { BELIEF_CONSTANTS } from '@/lib/constants/belief';

interface EmptyBeliefStateProps {
  onCreateBelief?: () => void;
  className?: string;
}

export function EmptyBeliefState({
  onCreateBelief,
  className
}: EmptyBeliefStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-8 ${className}`}>
      <Card className="holographic-card rounded-2xl p-12 max-w-2xl w-full text-center relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-500 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 space-y-8">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500/20 to-emerald-500/20 flex items-center justify-center border border-white/10">
              <Brain className="h-12 w-12 text-white" />
            </div>
          </div>

          {/* Title and description */}
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-white tracking-tighter">
              {BELIEF_CONSTANTS.EMPTY_STATE.TITLE}
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed max-w-lg mx-auto">
              {BELIEF_CONSTANTS.EMPTY_STATE.DESCRIPTION}
            </p>
          </div>

          {/* Action button */}
          {onCreateBelief && (
            <Button
              onClick={onCreateBelief}
              className="bg-white text-black hover:bg-zinc-200 font-bold px-8 py-3 rounded-full transition-all hover:scale-105"
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              {BELIEF_CONSTANTS.EMPTY_STATE.ACTION_TEXT}
            </Button>
          )}

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/10">
            <div className="text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto">
                <TrendingUp className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-white font-bold">Track Changes</h3>
              <p className="text-zinc-400 text-sm">
                Monitor how your confidence in ideas evolves over time
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
                <BookOpen className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-white font-bold">Reflect Deeply</h3>
              <p className="text-zinc-400 text-sm">
                Document the reasoning behind your belief shifts
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto">
                <Brain className="h-6 w-6 text-orange-400" />
              </div>
              <h3 className="text-white font-bold">Grow Intellectually</h3>
              <p className="text-zinc-400 text-sm">
                Build self-awareness through structured reflection
              </p>
            </div>
          </div>

          {/* Tips section */}
          <div className="mt-8 p-6 bg-white/5 rounded-xl border border-white/10">
            <h4 className="text-white font-bold mb-3 flex items-center justify-center gap-2">
              <BookOpen className="h-4 w-4" />
              Getting Started Tips
            </h4>
            <ul className="text-zinc-400 text-sm space-y-2 text-left max-w-md mx-auto">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Start with beliefs you feel strongly about (0% or 100% confidence)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                Be specific about what changed your mind
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 mt-1">•</span>
                Use tags to organize related beliefs
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                Regular reflection leads to better self-understanding
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}