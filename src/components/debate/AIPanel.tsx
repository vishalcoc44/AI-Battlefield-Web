"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, Target, BrainCircuit } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface AIAnalysis {
  fallacies: { speaker: string; fallacy: string; explanation: string }[]
  opportunities: { suggestion: string; context: string }[]
}

interface AIPanelProps {
  analysis: AIAnalysis | null
  analyzing: boolean
}

export function AIPanel({ analysis, analyzing }: AIPanelProps) {
  return (
    <div className="flex flex-col h-full w-80">
      <div className="p-4 border-b border-slate-800 font-bold text-indigo-400 text-xs flex items-center gap-2 bg-indigo-950/30">
        <BrainCircuit className="h-4 w-4" />
        Neural Analysis
      </div>
      <ScrollArea className="flex-1 p-4 space-y-6">
        <div className="space-y-4">
          {analyzing ? (
            <div className="flex items-center justify-center py-10 text-slate-500">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent mr-2" />
              <span className="text-xs uppercase tracking-widest">Analyzing vectors...</span>
            </div>
          ) : analysis ? (
            <>
              {analysis.fallacies.map((f, i) => (
                <div key={i} className="bg-slate-900 p-4 rounded-lg border border-indigo-900 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-orange-500" />
                  <h4 className="text-xs font-bold mb-2 flex items-center gap-2 text-slate-100">
                    <AlertTriangle className="h-3 w-3 text-orange-500" />
                    Fallacy: {f.fallacy}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-1">
                    <span className="text-zinc-500 font-bold uppercase">{f.speaker}:</span> {f.explanation}
                  </p>
                </div>
              ))}
              {analysis.opportunities.map((o, i) => (
                <div key={i} className="bg-slate-900 p-4 rounded-lg border border-blue-900 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                  <h4 className="text-xs font-bold mb-2 flex items-center gap-2 text-slate-100">
                    <Target className="h-3 w-3 text-blue-500" />
                    Strategic Opportunity
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {o.suggestion}
                  </p>
                </div>
              ))}
              {analysis.fallacies.length === 0 && analysis.opportunities.length === 0 && (
                <p className="text-xs text-slate-500 text-center">No significant analytics found for recent window.</p>
              )}
            </>
          ) : (
            <p className="text-xs text-slate-500 text-center uppercase tracking-widest mt-10">
              System Standby. <br /> Initiate Analysis.
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}