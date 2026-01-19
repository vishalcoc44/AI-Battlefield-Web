"use client"

import { useState, KeyboardEvent } from "react"
import { Button } from "@/components/ui/button"
import { Send, Loader2 } from "lucide-react"
import { VOID_CONSTANTS } from "@/lib/constants/void"

interface VoidMessageInputProps {
	onSend: (content: string) => Promise<void>
	isPosting?: boolean
	disabled?: boolean
}

export function VoidMessageInput({ onSend, isPosting = false, disabled = false }: VoidMessageInputProps) {
	const [content, setContent] = useState("")

	const handleSend = async () => {
		if (!content.trim() || isPosting || disabled) return

		const messageContent = content.trim()
		setContent("")
		await onSend(messageContent)
	}

	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handleSend()
		}
	}

	const isOverLimit = content.length > VOID_CONSTANTS.VALIDATION.MESSAGE_CONTENT.MAX_LENGTH

	return (
		<div className="space-y-2">
			<textarea
				value={content}
				onChange={(e) => setContent(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder="Speak into the void..."
				disabled={disabled || isPosting}
				maxLength={VOID_CONSTANTS.VALIDATION.MESSAGE_CONTENT.MAX_LENGTH}
				className="w-full min-h-[100px] p-4 bg-black/50 border border-white/10 rounded-lg text-white placeholder-zinc-500 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
			/>
			<div className="flex items-center justify-between">
				<div className="text-xs text-zinc-500">
					{content.length} / {VOID_CONSTANTS.VALIDATION.MESSAGE_CONTENT.MAX_LENGTH}
					{isOverLimit && <span className="text-red-500 ml-2">Character limit exceeded</span>}
				</div>
				<Button
					onClick={handleSend}
					disabled={!content.trim() || isPosting || disabled || isOverLimit}
					className="bg-white text-black hover:bg-zinc-200"
				>
					{isPosting ? (
						<>
							<Loader2 className="h-4 w-4 mr-2 animate-spin" />
							Sending...
						</>
					) : (
						<>
							<Send className="h-4 w-4 mr-2" />
							Send
						</>
					)}
				</Button>
			</div>
		</div>
	)
}
