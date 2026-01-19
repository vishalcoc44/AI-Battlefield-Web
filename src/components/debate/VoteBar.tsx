"use client"

import { dataService } from "@/lib/data-service"
import { GYM_CONSTANTS } from "@/lib/constants/gym"
import { toast } from "sonner"

interface VoteBarProps {
  voteStats: { pro: number; anti: number }
  onVoteError?: (error: string) => void
}

export function VoteBar({ voteStats, onVoteError }: VoteBarProps) {
  const handleVote = async (side: 'PRO' | 'CON') => {
    try {
      // This would need to be passed down from parent or use a context
      // For now, we'll assume it's handled at the parent level
      console.log('Vote cast:', side)
    } catch (error) {
      console.error('Vote error:', error)
      onVoteError?.('Failed to cast vote')
    }
  }

  return (
    <div className="flex items-center gap-3 w-full max-w-md mt-1 group/vote" role="group" aria-label="Vote on debate outcome">
      <span className="text-[10px] font-bold text-blue-400 w-8 text-right tabular-nums" aria-label="Pro votes">{voteStats.pro}%</span>
      <div
        className="h-2 flex-1 bg-slate-800/50 rounded-full overflow-hidden flex relative cursor-pointer shadow-inner border border-white/5 transition-transform hover:scale-[1.02]"
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={voteStats.pro}
        aria-label="Vote distribution"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') {
            e.preventDefault()
            handleVote('CON')
          } else if (e.key === 'ArrowRight') {
            e.preventDefault()
            handleVote('PRO')
          }
        }}
      >
        <div
          className="h-full bg-gradient-to-r from-blue-600 to-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.5)] transition-all duration-500 ease-out"
          style={{ width: `${voteStats.pro}%` }}
          onClick={() => handleVote('PRO')}
          aria-label="Click to vote Pro"
        />
        <div
          className="h-full bg-slate-900/50 flex-1 hover:bg-white/5 transition-colors"
          onClick={() => handleVote('CON')}
          aria-label="Click to vote Con"
        />
        <div
          className="absolute right-0 top-0 h-full bg-gradient-to-l from-orange-600 to-orange-500 shadow-[0_0_10px_rgba(234,88,12,0.5)] transition-all duration-500 ease-out"
          style={{ width: `${voteStats.anti}%` }}
          aria-label="Con vote indicator"
        />
      </div>
      <span className="text-[10px] font-bold text-orange-400 w-8 tabular-nums" aria-label="Con votes">{voteStats.anti}%</span>
    </div>
  )
}