"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertTriangle, RotateCcw, Loader2 } from "lucide-react"

interface ResetSessionModalProps {
   open: boolean
   onOpenChange: (open: boolean) => void
   onConfirm: () => Promise<void>
   sessionStats?: {
      messageCount: number
      calmScore: number
      duration: number
   }
}

export function ResetSessionModal({ open, onOpenChange, onConfirm, sessionStats }: ResetSessionModalProps) {
   const [isResetting, setIsResetting] = useState(false)

   const handleConfirm = async () => {
      setIsResetting(true)
      try {
         await onConfirm()
         onOpenChange(false)
      } catch (error) {
         console.error('Reset session error:', error)
      } finally {
         setIsResetting(false)
      }
   }

   const formatDuration = (seconds: number) => {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
   }

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="bg-black/90 border-white/10 backdrop-blur-xl text-white">
            <DialogHeader>
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20">
                     <AlertTriangle className="h-5 w-5 text-red-400" />
                  </div>
                  <DialogTitle className="text-left">Reset Training Session</DialogTitle>
               </div>
               <DialogDescription className="text-left text-zinc-400">
                  This will end your current training session and start a new one. Your progress will be saved, but you won't be able to continue from where you left off.
               </DialogDescription>
            </DialogHeader>

            {sessionStats && (
               <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3">
                  <h4 className="font-bold text-white text-sm">Current Session Summary:</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                     <div>
                        <div className="text-2xl font-bold text-cyan-400">{sessionStats.messageCount}</div>
                        <div className="text-xs text-zinc-400 uppercase tracking-wider">Messages</div>
                     </div>
                     <div>
                        <div className="text-2xl font-bold text-cyan-400">{sessionStats.calmScore}%</div>
                        <div className="text-xs text-zinc-400 uppercase tracking-wider">Calm Score</div>
                     </div>
                     <div>
                        <div className="text-2xl font-bold text-cyan-400">{formatDuration(sessionStats.duration)}</div>
                        <div className="text-xs text-zinc-400 uppercase tracking-wider">Duration</div>
                     </div>
                  </div>
               </div>
            )}

            <DialogFooter className="flex gap-2">
               <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isResetting}
                  className="border-white/10 text-zinc-300 hover:bg-white/5"
               >
                  Cancel
               </Button>
               <Button
                  onClick={handleConfirm}
                  disabled={isResetting}
                  className="bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30"
               >
                  {isResetting ? (
                     <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Resetting...
                     </>
                  ) : (
                     <>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset Session
                     </>
                  )}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   )
}