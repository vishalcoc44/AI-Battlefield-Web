"use client"

import { Timer as TimerIcon } from "lucide-react"

interface TimerProps {
  timeLeft: number
  className?: string
}

export function Timer({ timeLeft, className = "" }: TimerProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className={`flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full text-xs font-mono font-medium border border-white/10 shadow-inner ${className}`}>
      <TimerIcon className="h-3.5 w-3.5 text-slate-400" />
      <span className={timeLeft < 60 ? "text-red-400 font-bold tabular-nums" : "text-slate-200 tabular-nums"}>
        {formatTime(timeLeft)}
      </span>
    </div>
  )
}