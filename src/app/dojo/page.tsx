"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { TopNav } from "@/components/layout/TopNav"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Loader2 } from "lucide-react"
import { CosmicBackground } from "@/components/ui/cosmic-background"
import { useDojoSession } from "@/hooks/useDojoSession"
import { ResetSessionModal } from "@/components/dojo/ResetSessionModal"
import { DojoHeader } from "@/components/dojo/DojoHeader"
import { DojoMessageList } from "@/components/dojo/DojoMessageList"
import { DojoInput } from "@/components/dojo/DojoInput"
import { DOJO_CONSTANTS } from "@/lib/constants/dojo"
import { validateMessage } from "@/lib/utils"
import { supabase } from "@/lib/supabase"

export default function DojoPage() {
   const router = useRouter()
   const { session, uiState, isLoading, sendMessage, resetSession, saveDraft } = useDojoSession()
   const [inputValue, setInputValue] = useState("")
   const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
   const [showResetModal, setShowResetModal] = useState(false)
   const messagesEndRef = useRef<HTMLDivElement>(null)

   // Authentication is now handled by the useDojoSession hook
   // Redirect to auth if there's an authentication error
   useEffect(() => {
      if (uiState.error === 'Please sign in to continue') {
         // Store the intended destination
         sessionStorage.setItem('redirectAfterAuth', '/dojo')
         router.push('/auth')
      }
   }, [uiState.error, router])

   // Auto-scroll to bottom when messages change
   useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
   }, [session?.messages, uiState.isTyping])

   // Load draft message on mount
   useEffect(() => {
      const draft = localStorage.getItem(DOJO_CONSTANTS.STORAGE_KEYS.DRAFT_MESSAGE)
      if (draft) {
         setInputValue(draft)
      }
   }, [])

   // Save draft when input changes
   useEffect(() => {
      const timeoutId = setTimeout(() => {
         saveDraft(inputValue)
      }, 500)
      return () => clearTimeout(timeoutId)
   }, [inputValue, saveDraft])

   const handleSend = async () => {
      if (!inputValue.trim() || uiState.isAnalyzing || uiState.isGenerating) return

      // Validate message client-side
      const validation = validateMessage(inputValue)
      if (!validation.isValid) {
         // Error will be shown by the hook
         return
      }

      await sendMessage(inputValue)
      setInputValue("")
   }

   const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault()
         handleSend()
      }
      // Escape key to clear input
      if (e.key === 'Escape') {
         setInputValue("")
      }
   }

   // Keyboard shortcuts handler
   useEffect(() => {
      const handleGlobalKeyDown = (e: KeyboardEvent) => {
         // Ctrl/Cmd + Enter to send message
         if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault()
            handleSend()
         }
         // Ctrl/Cmd + R to reset session
         if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault()
            resetSession()
         }
      }

      document.addEventListener('keydown', handleGlobalKeyDown)
      return () => document.removeEventListener('keydown', handleGlobalKeyDown)
   }, [handleSend, resetSession])

   // Show loading state while initializing
   if (isLoading) {
      return (
         <div className="flex flex-col h-screen bg-black text-white items-center justify-center">
            <CosmicBackground theme="cyan" />
            <div className="relative z-10">
               <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
               <p className="mt-4 text-zinc-400">Initializing Zen Dojo...</p>
            </div>
         </div>
      )
   }

   // Show error state if there's an authentication or session error
   if (uiState.error) {
      return (
         <div className="flex flex-col h-screen bg-black text-white items-center justify-center">
            <CosmicBackground theme="cyan" />
            <div className="relative z-10 text-center">
               <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
               <h2 className="text-xl font-bold mb-2">Session Error</h2>
               <p className="text-zinc-400 mb-4">{uiState.error}</p>
               <Button onClick={() => window.location.reload()}>
                  Retry
               </Button>
            </div>
         </div>
      )
   }

   return (
      <div className="flex flex-col h-screen bg-black text-white relative overflow-hidden selection:bg-cyan-500/30 font-sans">
         {/* 🌌 Cosmic Background: Zen Void (Standardized) */}
         <CosmicBackground theme="cyan" />

         <div className="relative z-10 w-full"><TopNav /></div>

         <DojoHeader session={session} onStartNew={createSession} />

         {/* Error Display */}
         {uiState.error && (
            <div className="relative z-20 mx-4 md:mx-8 mt-4">
               <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-sm">
                  {uiState.error}
               </div>
            </div>
         )}

         <DojoMessageList
            ref={messagesEndRef}
            messages={session.messages}
            scenario={session.scenario}
            isAnalyzing={uiState.isAnalyzing}
            isGenerating={uiState.isGenerating}
         />

         <DojoInput
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSend}
            onReset={() => setShowResetModal(true)}
            disabled={uiState.isAnalyzing || uiState.isGenerating}
            isAnalyzing={uiState.isAnalyzing}
            isGenerating={uiState.isGenerating}
         />

         {/* Reset Session Modal */}
         <ResetSessionModal
            open={showResetModal}
            onOpenChange={setShowResetModal}
            onConfirm={resetSession}
            sessionStats={session ? {
               messageCount: session.message_count,
               calmScore: session.calm_score,
               duration: session.session_duration_seconds
            } : undefined}
         />
      </div>
   )
}
