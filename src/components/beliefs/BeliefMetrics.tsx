"use client";

import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw, TrendingUp, Target, Award } from 'lucide-react';
import { BeliefMetrics as BeliefMetricsType } from '@/types/belief';
import { cn } from '@/lib/utils';

interface BeliefMetricsProps {
  metrics: BeliefMetricsType;
  onSync?: () => void;
  isSyncing?: boolean;
  className?: string;
}

export function BeliefMetrics({
  metrics,
  onSync,
  isSyncing = false,
  className
}: BeliefMetricsProps) {
  const cards = [
    {
      title: "Total Shifts",
      value: metrics.totalShifts,
      subtitle: `+${Math.round((metrics.totalShifts / Math.max(metrics.totalBeliefs, 1)) * 100)}% this month`,
      icon: TrendingUp,
      gradient: "from-blue-500 to-blue-600",
      glowColor: "rgba(59,130,246,0.5)",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Openness Level",
      value: `V${metrics.opennessLevel}`,
      subtitle: metrics.opennessLevel >= 8 ? "Top 5% of users" :
                metrics.opennessLevel >= 6 ? "Highly open" :
                metrics.opennessLevel >= 4 ? "Moderately open" : "Developing",
      icon: Target,
      gradient: "from-orange-500 to-orange-600",
      glowColor: "rgba(249,115,22,0.5)",
      bgColor: "bg-orange-500/10",
    },
    {
      title: "Reinforced",
      value: metrics.reinforcedCount,
      subtitle: "Core beliefs",
      icon: Award,
      gradient: "from-emerald-500 to-emerald-600",
      glowColor: "rgba(16,185,129,0.5)",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Sync Analysis",
      value: "",
      subtitle: "with Debates",
      icon: RefreshCw,
      gradient: "from-white to-zinc-300",
      glowColor: "rgba(255,255,255,0.1)",
      bgColor: "bg-white/5",
      isButton: true,
      onClick: onSync,
      isLoading: isSyncing,
    },
  ];

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-4 gap-6 mb-12", className)}>
      {cards.map((card, index) => {
        const Icon = card.icon;

        if (card.isButton) {
          return (
            <Card
              key={index}
              className={cn(
                "holographic-card rounded-2xl p-6 relative overflow-hidden group cursor-pointer hover:border-white/30 transition-colors",
                card.bgColor
              )}
              onClick={card.onClick}
              role="button"
              tabIndex={0}
              aria-label={`${card.title}: ${card.subtitle}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  card.onClick?.();
                }
              }}
            >
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-center space-y-2 relative z-10">
                <div className={cn(
                  "h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-2 border border-white/10 group-hover:scale-110 transition-transform",
                  card.isLoading && "animate-spin"
                )}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="font-bold text-white text-sm uppercase tracking-wider">
                  {card.title}
                </div>
                <div className="text-xs text-zinc-400">
                  {card.subtitle}
                </div>
              </div>
            </Card>
          );
        }

        return (
          <Card
            key={index}
            className={cn(
              "holographic-card rounded-2xl p-6 relative overflow-hidden group",
              card.bgColor
            )}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className={cn("absolute inset-0 bg-gradient-to-br", card.gradient)} />
            </div>
            <div className="relative z-10">
              <div className="text-sm text-zinc-400 font-bold uppercase tracking-widest mb-2">
                {card.title}
              </div>
              <div
                className="text-5xl font-black text-white drop-shadow-[0_0_15px]"
                style={{ textShadow: `0 0 15px ${card.glowColor}` }}
              >
                {card.value}
              </div>
              <div className="mt-2 text-xs text-zinc-400 font-mono">
                {card.subtitle}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

// Skeleton loading component for metrics
export function BeliefMetricsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="holographic-card rounded-2xl p-6 relative overflow-hidden">
          <div className="animate-pulse">
            <div className="h-4 bg-zinc-700 rounded mb-2"></div>
            <div className="h-12 bg-zinc-700 rounded mb-2"></div>
            <div className="h-3 bg-zinc-700 rounded w-3/4"></div>
          </div>
        </Card>
      ))}
    </div>
  );
}