"use client"

import { VoidMessage } from "@/lib/types"

function formatTimeAgo(date: Date): string {
	const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
	if (seconds < 60) return 'just now'
	const minutes = Math.floor(seconds / 60)
	if (minutes < 60) return `${minutes}m ago`
	const hours = Math.floor(minutes / 60)
	if (hours < 24) return `${hours}h ago`
	const days = Math.floor(hours / 24)
	return `${days}d ago`
}

interface VoidMessageFeedProps {
	messages: VoidMessage[]
}

export function VoidMessageFeed({ messages }: VoidMessageFeedProps) {
	if (messages.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-16 px-4 text-center">
				<div className="text-4xl mb-4">🌌</div>
				<p className="text-zinc-500 text-sm">The void is silent. Be the first to speak.</p>
			</div>
		)
	}

	return (
		<div className="space-y-4">
			{messages.map((message) => (
				<div
					key={message.id}
					className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
				>
					<div className="flex items-start justify-between gap-4 mb-2">
						<div className="flex items-center gap-2">
							<span className="text-xs font-mono text-zinc-400">🎭</span>
							<span className="font-bold text-white">{message.maskName}</span>
						</div>
						<span className="text-xs text-zinc-500">
							{formatTimeAgo(new Date(message.createdAt))}
						</span>
					</div>
					<p className="text-zinc-300 text-sm whitespace-pre-wrap break-words">{message.content}</p>
				</div>
			))}
		</div>
	)
}
