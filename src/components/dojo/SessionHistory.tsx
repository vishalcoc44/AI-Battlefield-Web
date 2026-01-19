import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { History, TrendingUp, MessageSquare, Clock, Target, Download } from "lucide-react"
import { DojoSession } from "@/types/dojo"
import { showErrorToast } from "@/lib/toast"

interface SessionHistoryProps {
   trigger?: React.ReactNode
}

interface SessionStats {
   totalSessions: number
   averageCalmScore: number
   bestCalmScore: number
   totalMessages: number
   completionRate: number
}

export function SessionHistory({ trigger }: SessionHistoryProps) {
   const [sessions, setSessions] = useState<DojoSession[]>([])
   const [stats, setStats] = useState<SessionStats | null>(null)
   const [isLoading, setIsLoading] = useState(false)
   const [isOpen, setIsOpen] = useState(false)

   const exportSession = async (sessionId: string) => {
      try {
         const response = await fetch(`/api/dojo/session?sessionId=${sessionId}&export=json`)

         if (!response.ok) {
            throw new Error('Failed to export session')
         }

         const blob = await response.blob()
         const url = window.URL.createObjectURL(blob)
         const a = document.createElement('a')
         a.href = url
         a.download = `zen-dojo-session-${sessionId}.json`
         document.body.appendChild(a)
         a.click()
         window.URL.revokeObjectURL(url)
         document.body.removeChild(a)
      } catch (error) {
         console.error('Export session error:', error)
         showErrorToast(error)
      }
   }

   const loadSessionHistory = async () => {
      setIsLoading(true)
      try {
         const response = await fetch('/api/dojo/session?history=true')

         if (!response.ok) {
            throw new Error('Failed to load session history')
         }

         const sessionData: DojoSession[] = await response.json()
         setSessions(sessionData)

         // Calculate stats
         if (sessionData.length > 0) {
            const completedSessions = sessionData.filter(s => s.completed_at)
            const totalMessages = sessionData.reduce((sum, s) => sum + s.message_count, 0)
            const totalCalmScore = sessionData.reduce((sum, s) => sum + s.calm_score, 0)

            setStats({
               totalSessions: sessionData.length,
               averageCalmScore: Math.round(totalCalmScore / sessionData.length),
               bestCalmScore: Math.max(...sessionData.map(s => s.calm_score)),
               totalMessages,
               completionRate: Math.round((completedSessions.length / sessionData.length) * 100)
            })
         }
      } catch (error) {
         console.error('Load session history error:', error)
         showErrorToast(error)
      } finally {
         setIsLoading(false)
      }
   }

   useEffect(() => {
      if (isOpen && sessions.length === 0) {
         loadSessionHistory()
      }
   }, [isOpen])

   const formatDuration = (seconds: number) => {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
   }

   const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
         month: 'short',
         day: 'numeric',
         hour: '2-digit',
         minute: '2-digit'
      })
   }

   return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
         <DialogTrigger asChild>
            {trigger || (
               <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10">
                  <History className="h-4 w-4 mr-2" />
                  Session History
               </Button>
            )}
         </DialogTrigger>
         <DialogContent className="bg-black/90 border-white/10 backdrop-blur-xl text-white max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
               <DialogTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Training Session History
               </DialogTitle>
               <DialogDescription>
                  Review your past Zen Dojo training sessions and track your progress
               </DialogDescription>
            </DialogHeader>

            {/* Stats Overview */}
            {stats && (
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
                     <div className="text-2xl font-bold text-cyan-400">{stats.totalSessions}</div>
                     <div className="text-xs text-zinc-400 uppercase tracking-wider">Total Sessions</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
                     <div className="text-2xl font-bold text-cyan-400">{stats.averageCalmScore}%</div>
                     <div className="text-xs text-zinc-400 uppercase tracking-wider">Avg Calm Score</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
                     <div className="text-2xl font-bold text-green-400">{stats.bestCalmScore}%</div>
                     <div className="text-xs text-zinc-400 uppercase tracking-wider">Best Score</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
                     <div className="text-2xl font-bold text-purple-400">{stats.totalMessages}</div>
                     <div className="text-xs text-zinc-400 uppercase tracking-wider">Total Messages</div>
                  </div>
               </div>
            )}

            {/* Session List */}
            <div className="space-y-3">
               {isLoading ? (
                  <div className="text-center py-8">
                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto"></div>
                     <p className="mt-4 text-zinc-400">Loading session history...</p>
                  </div>
               ) : sessions.length === 0 ? (
                  <div className="text-center py-8">
                     <History className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                     <p className="text-zinc-400">No training sessions found</p>
                     <p className="text-sm text-zinc-500">Complete your first session to see history</p>
                  </div>
               ) : (
                  sessions.map((session) => (
                     <div
                        key={session.id}
                        className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
                     >
                        <div className="flex items-center justify-between mb-2">
                           <div className="flex items-center gap-4">
                              <div className="text-sm font-medium text-white capitalize">
                                 {session.scenario.replace('_', ' ')}
                              </div>
                              <div className="text-xs px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                                 {session.difficulty}
                              </div>
                           </div>
                           <div className="text-right">
                              <div className={`text-lg font-bold ${session.calm_score >= 70 ? 'text-green-400' : session.calm_score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                                 {session.calm_score}%
                              </div>
                              <div className="text-xs text-zinc-400">Calm Score</div>
                           </div>
                        </div>

                        <div className="flex items-center gap-6 text-xs text-zinc-400">
                           <div className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              {session.message_count} messages
                           </div>
                           <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDuration(session.session_duration_seconds)}
                           </div>
                           <div className="flex items-center gap-1">
                              <Target className="h-3 w-3" />
                              {session.completed_at ? 'Completed' : 'In Progress'}
                           </div>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                           <div className="text-xs text-zinc-500">
                              {formatDate(session.created_at)}
                           </div>
                           <Button
                              onClick={() => exportSession(session.id)}
                              size="sm"
                              variant="ghost"
                              className="h-6 px-2 text-xs text-zinc-400 hover:text-cyan-400 hover:bg-cyan-500/10"
                           >
                              <Download className="h-3 w-3 mr-1" />
                              Export
                           </Button>
                        </div>
                     </div>
                  ))
               )}
            </div>

            {/* Refresh Button */}
            <div className="flex justify-center mt-6">
               <Button
                  onClick={loadSessionHistory}
                  disabled={isLoading}
                  variant="outline"
                  size="sm"
                  className="bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10"
               >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Refresh History
               </Button>
            </div>
         </DialogContent>
      </Dialog>
   )
}