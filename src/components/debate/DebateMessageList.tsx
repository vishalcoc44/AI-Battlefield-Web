import { useEffect, useRef, useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Loader2 } from "lucide-react"
import { DebateMessageBubble } from "./DebateMessageBubble"
import type { DebateMessage } from "@/types/debate"

interface DebateMessageListProps {
	messages: DebateMessage[];
	isTyping: boolean;
	isLoading?: boolean;
	hasMore?: boolean;
	loadMoreMessages?: () => void;
	isLoadingMore?: boolean;
}

export function DebateMessageList({
	messages,
	isTyping,
	isLoading,
	hasMore,
	loadMoreMessages,
	isLoadingMore
}: DebateMessageListProps) {
	const bottomRef = useRef<HTMLDivElement>(null);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const [prevScrollHeight, setPrevScrollHeight] = useState(0);

	useEffect(() => {
		// Only auto-scroll to bottom if we are NOT loading more messages (historical)
		if (!isLoadingMore) {
			bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
		}
	}, [messages, isTyping, isLoadingMore]);

	// Restore scroll position after loading more
	useEffect(() => {
		if (scrollContainerRef.current && prevScrollHeight > 0) {
			const newScrollHeight = scrollContainerRef.current.scrollHeight;
			const diff = newScrollHeight - prevScrollHeight;
			scrollContainerRef.current.scrollTop = diff;
			setPrevScrollHeight(0);
		}
	}, [messages.length, prevScrollHeight]);

	const handleLoadMore = () => {
		if (scrollContainerRef.current) {
			setPrevScrollHeight(scrollContainerRef.current.scrollHeight);
		}
		loadMoreMessages?.();
	};

	if (isLoading && messages.length === 0) {
		return (
			<div className="flex-1 flex items-center justify-center p-4">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 space-y-6 max-w-4xl mx-auto w-full">
			{hasMore && (
				<div className="flex justify-center pt-2 pb-4">
					<button
						onClick={handleLoadMore}
						disabled={isLoadingMore}
						className="text-xs text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors"
					>
						{isLoadingMore ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
						{isLoadingMore ? 'Loading history...' : 'Load previous messages'}
					</button>
				</div>
			)}

			{messages.map((msg) => (
				<DebateMessageBubble key={msg.id} message={msg} />
			))}

			{isTyping && (
				<div className="flex gap-4 animate-in fade-in duration-300">
					<Avatar className="h-8 w-8 mt-1">
						<AvatarFallback className="bg-red-600 text-white">AI</AvatarFallback>
					</Avatar>
					<div className="p-4 rounded-2xl shadow-sm text-sm bg-white dark:bg-slate-800 border rounded-tl-none flex items-center gap-2">
						<Loader2 className="h-4 w-4 animate-spin" />
						Thinking...
					</div>
				</div>
			)}
			<div ref={bottomRef} />
		</div>
	)
}
