"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowUpRight, ArrowDownRight, Minus, Edit, Trash2, Eye } from 'lucide-react';
import { BELIEF_CONSTANTS } from '@/lib/constants/belief';
import { Belief } from '@/types/belief';
import { cn, sanitizeText } from '@/lib/utils';

interface BeliefCardProps {
  belief: Belief;
  onEdit?: (belief: Belief) => void;
  onDelete?: (beliefId: string) => void;
  onView?: (belief: Belief) => void;
  className?: string;
  showActions?: boolean;
}

export function BeliefCard({
  belief,
  onEdit,
  onDelete,
  onView,
  className,
  showActions = true
}: BeliefCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Get status color and styling
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Reinforced':
        return {
          badge: 'bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20',
          glow: 'bg-emerald-500',
          text: 'text-emerald-400'
        };
      case 'Shattered':
        return {
          badge: 'bg-red-500/10 text-red-500 ring-1 ring-red-500/20',
          glow: 'bg-red-500',
          text: 'text-red-400'
        };
      case 'Shifted':
        return {
          badge: 'bg-orange-500/10 text-orange-500 ring-1 ring-orange-500/20',
          glow: 'bg-orange-500',
          text: 'text-orange-400'
        };
      default:
        return {
          badge: 'bg-zinc-500/10 text-zinc-500 ring-1 ring-zinc-500/20',
          glow: 'bg-zinc-500',
          text: 'text-zinc-400'
        };
    }
  };

  const statusStyles = getStatusStyles(belief.status);

  // Get trend icon and color
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowUpRight className="h-4 w-4 mr-1 text-emerald-500" />;
      case 'down':
        return <ArrowDownRight className="h-4 w-4 mr-1 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 mr-1 text-zinc-500" />;
    }
  };

  // Calculate confidence change
  const confidenceChange = belief.confidence_current - belief.confidence_initial;
  const changePercentage = Math.abs(confidenceChange);
  const changeText = confidenceChange > 0 ? `+${changePercentage}%` :
                    confidenceChange < 0 ? `-${changePercentage}%` : '0%';

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <Card
      className={cn(
        "holographic-card rounded-2xl p-8 transition-all duration-300 hover:bg-white/5 hover:border-white/20 group relative overflow-hidden cursor-pointer",
        className
      )}
      onClick={() => setIsExpanded(!isExpanded)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-expanded={isExpanded}
      aria-label={`Belief: ${belief.topic}. Status: ${belief.status}. Confidence: ${belief.confidence_current}%. Click to ${isExpanded ? 'collapse' : 'expand'} details.`}
    >
      {/* Background glow effect */}
      <div className={cn(
        "absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 transition-opacity group-hover:opacity-40",
        statusStyles.glow
      )} />

      <div className="flex flex-col h-full justify-between gap-6 relative z-10">
        {/* Header section */}
        <div className="space-y-4">
          {/* Status badge and trend */}
          <div className="flex justify-between items-start">
            <Badge
              variant="outline"
              className={cn(
                "border-0 uppercase text-[10px] font-black tracking-widest px-3 py-1 rounded-full",
                statusStyles.badge
              )}
            >
              {belief.status}
            </Badge>

            <div className={cn(
              "flex items-center text-xs font-black",
              statusStyles.text
            )}>
              {getTrendIcon(belief.trend)}
              {changeText}
            </div>
          </div>

          {/* Topic */}
          <h3 className="text-2xl font-black text-white leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-400 transition-all">
            {sanitizeText(belief.topic)}
          </h3>

          {/* Description - conditionally expanded */}
          {belief.description && (
            <div className="space-y-2">
              <p className={cn(
                "text-sm text-zinc-400 leading-relaxed font-medium transition-all",
                isExpanded ? "line-clamp-none" : "line-clamp-2"
              )}>
                {sanitizeText(belief.description)}
              </p>

              {belief.description.length > 100 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                  }}
                  className="text-xs text-zinc-500 hover:text-zinc-400 transition-colors"
                  aria-label={isExpanded ? "Show less" : "Show more"}
                >
                  {isExpanded ? "Show less" : "Show more"}
                </button>
              )}
            </div>
          )}

          {/* Tags */}
          {belief.tags && belief.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {belief.tags.slice(0, 3).map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs bg-zinc-800/50 text-zinc-300 border-zinc-700/50"
                >
                  {tag}
                </Badge>
              ))}
              {belief.tags.length > 3 && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-zinc-800/50 text-zinc-300 border-zinc-700/50"
                >
                  +{belief.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Progress bars section */}
        <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
          <div>
            <div className="text-[9px] text-zinc-600 uppercase tracking-widest font-bold mb-1">
              Initial Confidence
            </div>
            <Progress
              value={belief.confidence_initial}
              className="h-1 bg-zinc-800 [&>div]:bg-zinc-600"
            />
            <div className="text-right text-xs font-mono text-zinc-500 mt-1">
              {belief.confidence_initial}%
            </div>
          </div>

          <div>
            <div className="text-[9px] text-zinc-600 uppercase tracking-widest font-bold mb-1">
              Current State
            </div>
            <Progress
              value={belief.confidence_current}
              className={cn(
                "h-1 bg-zinc-800 [&>div]:shadow-[0_0_10px] transition-all",
                belief.trend === 'up' && "[&>div]:bg-emerald-500 [&>div]:shadow-emerald-500/50",
                belief.trend === 'down' && "[&>div]:bg-red-500 [&>div]:shadow-red-500/50",
                belief.trend === 'neutral' && "[&>div]:bg-zinc-500 [&>div]:shadow-zinc-500/50"
              )}
            />
            <div className={cn(
              "text-right text-xs font-mono mt-1",
              belief.trend === 'up' && "text-emerald-400",
              belief.trend === 'down' && "text-red-400",
              belief.trend === 'neutral' && "text-zinc-400"
            )}>
              {belief.confidence_current}%
            </div>
          </div>
        </div>

        {/* Action buttons - conditionally shown */}
        {showActions && (onEdit || onDelete || onView) && (
          <div className="flex gap-2 pt-4 border-t border-white/5">
            {onView && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onView(belief);
                }}
                className="flex-1 text-zinc-400 hover:text-white hover:bg-white/5"
                aria-label={`View details for ${belief.topic}`}
              >
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
            )}

            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(belief);
                }}
                className="flex-1 text-zinc-400 hover:text-white hover:bg-white/5"
                aria-label={`Edit belief: ${belief.topic}`}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}

            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(belief.id);
                }}
                className="flex-1 text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
                aria-label={`Delete belief: ${belief.topic}`}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}