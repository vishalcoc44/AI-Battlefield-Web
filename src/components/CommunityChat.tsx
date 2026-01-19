"use client"

import { useEffect, useState, useRef } from "react"
import { Send, Loader2, User, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { dataService, type CommunityChatMessage } from "@/lib/data-service"
import { supabase } from "@/lib/supabase"
import { sanitizeText } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CommunityChatProps {
	communityId: string
	currentUserId: string
	isMember: boolean
}

export function CommunityChat({ communityId, currentUserId, isMember }: CommunityChatProps) {
	const [messages, setMessages] = useState<CommunityChatMessage[]>([])
	const [newMessage, setNewMessage] = useState("")
	const [loading, setLoading] = useState(true)
	const [sending, setSending] = useState(false)
	const scrollRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		loadMessages()

		// Realtime subscription
		const channel = supabase
			.channel(`community_chat:${communityId}`)
			.on('postgres_changes', {
				event: 'INSERT',
				schema: 'public',
				table: 'community_chat_messages',
				filter: `community_id=eq.${communityId}`
			}, (payload) => {
				const newMsg = payload.new as any
				// Fetch user details for the new message if needed, or simple optimistic update?
				// The payload only has raw columns. We need username/avatar.
				// We can fetch it, or just display raw for now?
				// Better to fetch the full message object including user relation.
				fetchNewMessageDetails(newMsg.id)
			})
			.subscribe()

		return () => {
			supabase.removeChannel(channel)
		}
	}, [communityId])

	useEffect(() => {
		// Auto-scroll to bottom
		if (scrollRef.current) {
			scrollRef.current.scrollIntoView({ behavior: "smooth" })
		}
	}, [messages])

	async function loadMessages() {
		setLoading(true)
		try {
			const msgs = await dataService.getCommunityChatMessages(communityId)
			setMessages(msgs)
		} catch (error) {
			console.error("Failed to load chat:", error)
		} finally {
			setLoading(false)
		}
	}

	async function fetchNewMessageDetails(messageId: string) {
		// This is a bit inefficient (N+1), but simple for now. 
		// Ideally we include user data in the payload via custom replication or edge function,
		// but standard Supabase realtime is just raw row.
		// Alternatively, if we just sent it, we have the data? 
		// But this is for *incoming* messages from others too.

		// For now, let's just re-fetch the single message with relations
		const { data, error } = await supabase
			.from('community_chat_messages')
			.select(`
				*,
				user:user_id (
					username,
					avatar_url
				)
			`)
			.eq('id', messageId)
			.single()

		if (!error && data) {
			const activeMsg: CommunityChatMessage = {
				id: data.id,
				communityId: data.community_id,
				userId: data.user_id,
				content: data.content,
				createdAt: data.created_at,
				user: data.user ? {
					username: data.user.username,
					avatarUrl: data.user.avatar_url
				} : undefined
			}
			setMessages(prev => {
				// Deduplicate
				if (prev.find(m => m.id === activeMsg.id)) return prev
				return [...prev, activeMsg]
			})
		}
	}

	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!newMessage.trim() || !isMember) return

		const tempId = `temp-${Date.now()}`
		const tempMsg: CommunityChatMessage = {
			id: tempId,
			communityId,
			userId: currentUserId,
			content: newMessage,
			createdAt: new Date().toISOString(),
			user: {
				username: "You", // Placeholder until verified
				// We could pass current username as prop to avoid this
			}
		}

		// Optimistic update
		// setMessages(prev => [...prev, tempMsg])
		// Let's rely on realtime for consistency for now, less jitter if fetching succeeds fast.

		setSending(true)
		try {
			await dataService.sendCommunityChatMessage(communityId, currentUserId, newMessage)
			setNewMessage("")
		} catch (error) {
			console.error("Failed to send:", error)
		} finally {
			setSending(false)
		}
	}

	if (!isMember) {
		return (
			<Card className="bg-zinc-900/50 border-white/10 h-[600px] flex items-center justify-center">
				<div className="text-center space-y-4">
					<div className="inline-flex p-4 bg-zinc-800 rounded-full mb-2">
						<AlertCircle className="h-8 w-8 text-zinc-500" />
					</div>
					<h3 className="text-xl font-bold text-white">Encrypted Channel</h3>
					<p className="text-zinc-400 max-w-xs mx-auto">Access restricted to operatives (members) only. Join the community to decrypt communications.</p>
				</div>
			</Card>
		)
	}

	return (
		<Card className="bg-black/40 border-white/10 h-[600px] flex flex-col relative overflow-hidden backdrop-blur-sm">
			{/* Background decoration */}
			<div className="absolute inset-0 pointer-events-none bg-grid-white/[0.02]" />
			<div className="absolute bottom-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl" />

			<CardHeader className="border-b border-white/5 bg-black/20 pb-4">
				<CardTitle className="text-sm font-mono uppercase tracking-widest text-teal-500 flex items-center gap-2">
					<span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
					Live War Room
				</CardTitle>
			</CardHeader>

			<CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
				<ScrollArea className="flex-1 p-4">
					<div className="space-y-4">
						{loading && messages.length === 0 ? (
							<div className="flex justify-center items-center h-40">
								<Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
							</div>
						) : messages.length === 0 ? (
							<div className="text-center text-zinc-500 py-10 font-mono text-sm">
								No signals detected. Initiate broadcast.
							</div>
						) : (
							messages.map((msg) => {
								const isMe = msg.userId === currentUserId
								return (
									<div key={msg.id} className={`flex gap-3 max-w-[80%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}>
										<Avatar className="h-8 w-8 border border-white/10">
											<AvatarImage src={msg.user?.avatarUrl} />
											<AvatarFallback className="bg-zinc-800 text-xs text-zinc-400">
												{msg.user?.username?.[0] || '?'}
											</AvatarFallback>
										</Avatar>
										<div className={`space-y-1 ${isMe ? 'text-right' : ''}`}>
											<div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono uppercase">
												<span>{msg.user?.username || 'Unknown'}</span>
												<span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
											</div>
											<div className={`p-3 rounded-2xl text-sm ${isMe
													? 'bg-teal-600/20 text-teal-100 border border-teal-500/20 rounded-tr-none'
													: 'bg-zinc-800/50 text-zinc-300 border border-white/5 rounded-tl-none'
												}`}>
												{sanitizeText(msg.content)}
											</div>
										</div>
									</div>
								)
							})
						)}
						<div ref={scrollRef} />
					</div>
				</ScrollArea>

				<div className="p-4 border-t border-white/10 bg-black/40 backdrop-blur-md">
					<form onSubmit={handleSendMessage} className="flex gap-2">
						<Input
							value={newMessage}
							onChange={(e) => setNewMessage(e.target.value)}
							placeholder="Broadcast message..."
							className="bg-zinc-900/50 border-white/10 focus:border-teal-500/50 text-white placeholder:text-zinc-600"
							disabled={sending}
						/>
						<Button type="submit" size="icon" disabled={sending || !newMessage.trim()} className="bg-teal-600 hover:bg-teal-700 text-white shrink-0">
							{sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
						</Button>
					</form>
				</div>
			</CardContent>
		</Card>
	)
}
