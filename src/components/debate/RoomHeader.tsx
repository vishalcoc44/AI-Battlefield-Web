"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Hand, BrainCircuit, Loader2 } from "lucide-react"
import { Timer } from "./Timer"
import { VoteBar } from "./VoteBar"

interface RoomHeaderProps {
  roomId: string
  timeLeft: number
  voteStats: { pro: number; anti: number }
  showAiPanel: boolean
  analyzing: boolean
  onAIAnalysis: () => void
  onRaiseHand: () => void
  onLeave: () => void
  onVote: (side: 'PRO' | 'CON') => void
}

export function RoomHeader({
  roomId,
  timeLeft,
  voteStats,
  showAiPanel,
  analyzing,
  onAIAnalysis,
  onRaiseHand,
  onLeave,
  onVote
}: RoomHeaderProps) {
  return (
    <div className="z-40 bg-slate-950/40 border-b border-white/5 backdrop-blur-xl px-6 py-4 flex items-center justify-between shadow-lg shadow-black/20 shrink-0">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            <Badge variant="outline" className="border-red-500/50 text-red-400 px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase bg-red-500/10">
              Live Debate
            </Badge>
          </div>
          <h2 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 font-display">
            Room #{roomId.toString().slice(0, 8)}
          </h2>
          <Timer timeLeft={timeLeft} />
        </div>

        {/* Modern Voting Bar */}
        <VoteBar
          voteStats={voteStats}
          onVoteError={(error) => console.error('Vote error:', error)}
        />
      </div>

      <div className="flex gap-3">
        <Button
          variant="ghost"
          size="sm"
          className={`gap-2 hidden md:flex h-9 text-xs rounded-full border transition-all duration-300 ${
            showAiPanel
              ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
              : "bg-slate-800/50 border-white/10 text-slate-400 hover:bg-slate-800 hover:text-white"
          }`}
          onClick={onAIAnalysis}
          disabled={analyzing}
          aria-label={analyzing ? "Analyzing debate with AI" : "Get AI analysis of debate"}
          aria-pressed={showAiPanel}
        >
          {analyzing ? <Loader2 className="h-4 w-4 animate-spin text-indigo-400" aria-hidden="true" /> : <BrainCircuit className="h-4 w-4" aria-hidden="true" />}
          <span className="font-semibold tracking-wide">{analyzing ? "Analyzing..." : "AI Analysis"}</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 hidden md:flex h-9 text-xs bg-slate-800/50 border-white/10 hover:bg-slate-800 rounded-full text-slate-300 hover:text-white transition-colors"
          onClick={onRaiseHand}
          aria-label="Raise hand to speak"
        >
          <Hand className="h-4 w-4" aria-hidden="true" /> Raise Hand
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 px-4 text-xs bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-full transition-colors"
          onClick={onLeave}
          aria-label="Leave debate arena"
        >
          Leave Arena
        </Button>
      </div>
    </div>
  )
}