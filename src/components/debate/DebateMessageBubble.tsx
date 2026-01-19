import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Info, Loader2 } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { DebateMessage } from "@/types/debate"
import { sanitizeText, sanitizeHtml } from "@/lib/utils"

interface DebateMessageBubbleProps {
	message: DebateMessage;
}

export function DebateMessageBubble({ message }: DebateMessageBubbleProps) {
	const isUser = message.sender_role === 'user';
	const { factCheck } = message.metadata;

	return (
		<div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : ''}`}>
			<Avatar className="h-8 w-8 mt-1">
				<AvatarFallback className={isUser ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'}>
					{isUser ? 'U' : 'AI'}
				</AvatarFallback>
			</Avatar>

			<div className={`flex flex-col max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
				<div className={`p-4 rounded-2xl shadow-sm text-sm overflow-hidden ${isUser
					? 'bg-blue-600 text-white rounded-tr-none'
					: 'bg-white dark:bg-slate-800 border rounded-tl-none'
					}`}>
					{isUser ? (
						<div className="whitespace-pre-wrap">{sanitizeText(message.content)}</div>
					) : (
						<div className="prose dark:prose-invert prose-sm max-w-none break-words">
							<ReactMarkdown
								remarkPlugins={[remarkGfm]}
								components={{
									p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
									ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
									ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
									code: ({ children }) => <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">{children}</code>
								}}
							>
								{sanitizeHtml(message.content)}
							</ReactMarkdown>
						</div>
					)}
				</div>

				<div className="flex gap-2 mt-1 px-1">
					{factCheck === 'verified' && (
						<Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-200 gap-1 hover:bg-green-50">
							<CheckCircle className="h-3 w-3" /> Fact Checked
						</Badge>
					)}
					{factCheck === 'pending' && (
						<Badge variant="outline" className="text-[10px] bg-yellow-50 text-yellow-700 border-yellow-200 gap-1 animate-pulse hover:bg-yellow-50">
							<Info className="h-3 w-3" /> Verifying...
						</Badge>
					)}
					{/* We could add logic score here if available in metadata */}
				</div>
			</div>
		</div>
	)
}
