"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { TopNav } from "@/components/layout/TopNav"
import { Button } from "@/components/ui/button"
import { Ghost, LogOut, Loader2 } from "lucide-react"
import { CosmicBackground } from "@/components/ui/cosmic-background"
import { useVoidSession } from "@/hooks/useVoidSession"
import { VoidMessageFeed } from "@/components/void/VoidMessageFeed"
import { VoidMessageInput } from "@/components/void/VoidMessageInput"
import { useUser } from "@/hooks/use-user"
import { showToast } from "@/lib/toast"

export default function VoidSessionPage() {
	const router = useRouter()
	const params = useParams()
	const { user } = useUser()
	const { session, messages, isPosting, endSession, sendMessage, isLoading } = useVoidSession()
	const messagesEndRef = useRef<HTMLDivElement>(null)

	// Check authentication
	useEffect(() => {
		if (user === null) return
		if (!user) {
			router.push('/auth')
		}
	}, [user, router])

	// Auto-scroll to bottom when messages change
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages])

	// Redirect if no session
	useEffect(() => {
		if (!isLoading && !session) {
			router.push('/void')
		}
	}, [session, isLoading, router])

	const handleEndSession = async () => {
		try {
			await endSession()
		} catch (err) {
			console.error('Failed to end session:', err)
		}
	}

	const handleSendMessage = async (content: string) => {
		if (!session) return
		try {
			await sendMessage(content)
		} catch (err) {
			console.error('Failed to send message:', err)
		}
	}

	if (isLoading) {
		return (
			<div className="dark flex flex-col min-h-screen bg-black text-white">
				<CosmicBackground theme="monochrome" />
				<div className="relative z-10 flex flex-col min-h-screen">
					<TopNav />
					<main className="flex-1 flex items-center justify-center">
						<Loader2 className="h-8 w-8 animate-spin text-purple-500" />
					</main>
				</div>
			</div>
		)
	}

	if (!session) {
		return null
	}

	return (
		<div className="dark flex flex-col min-h-screen bg-black text-white font-sans overflow-x-hidden">
			<CosmicBackground theme="monochrome" />

			<div className="relative z-10 flex flex-col min-h-screen">
				<TopNav />
				<main className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4 md:p-8">
					{/* Header */}
					<div className="flex items-center justify-between mb-8">
						<div className="flex items-center gap-3">
							<Ghost className="h-8 w-8 text-purple-500" />
							<div>
								<h1 className="text-2xl font-black">The Void</h1>
								<p className="text-sm text-zinc-400">Identity: {session.maskName}</p>
							</div>
						</div>
						<Button
							variant="ghost"
							onClick={handleEndSession}
							className="text-zinc-400 hover:text-white"
						>
							<LogOut className="h-4 w-4 mr-2" />
							Leave
						</Button>
					</div>

					{/* Messages Feed */}
					<div className="flex-1 overflow-y-auto mb-4 space-y-4">
						<VoidMessageFeed messages={messages} />
						<div ref={messagesEndRef} />
					</div>

					{/* Message Input */}
					<div className="border-t border-white/10 pt-4">
						<VoidMessageInput
							onSend={handleSendMessage}
							isPosting={isPosting}
							disabled={!session.is_active}
						/>
					</div>
				</main>
			</div>
		</div>
	)
}
