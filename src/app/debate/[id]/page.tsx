"use client"

import { TopNav } from "@/components/layout/TopNav"
import { useDebateSession } from "@/hooks/useDebateSession"
import { DebateHeader } from "@/components/debate/DebateHeader"
import { DebateMessageList } from "@/components/debate/DebateMessageList"
import { DebateInput } from "@/components/debate/DebateInput"

export default function DebatePage({ params }: { params: { id: string } }) {
   const {
      messages,
      session,
      isLoading,
      isTyping,
      sendMessage,
      endDebate,
      hasMore,
      loadMoreMessages,
      isLoadingMore,
      deleteDebate,
      isDeleting
   } = useDebateSession();

   return (
      <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950">
         <TopNav />

         {session && (
            <DebateHeader
               metrics={session.metrics}
               onEndDebate={endDebate}
               onDeleteDebate={deleteDebate}
               isEnding={session.status === 'completed'}
               isDeleting={isDeleting}
            />
         )}

         <DebateMessageList
            messages={messages}
            isTyping={isTyping}
            isLoading={isLoading}
            hasMore={hasMore}
            loadMoreMessages={loadMoreMessages}
            isLoadingMore={isLoadingMore}
         />

         <DebateInput
            onSend={sendMessage}
            disabled={isLoading || isTyping || session?.status === 'completed'}
         />
      </div>
   )
}
