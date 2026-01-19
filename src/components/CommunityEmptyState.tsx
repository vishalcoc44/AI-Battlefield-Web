import { SearchX, FolderOpen, Users, MessageCircle, Zap, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface CommunityEmptyStateProps {
	title?: string
	description?: string
	actionLabel?: string
	onAction?: () => void
}

export function CommunityEmptyState({
	title = "No Frequencies Found",
	description = "Detailed scan returned zero results matching your query parameters.",
	actionLabel,
	onAction
}: CommunityEmptyStateProps) {
	const isEmptyNetwork = !actionLabel?.includes("Clear Search")

	return (
		<div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-6 rounded-2xl border border-white/5 bg-gradient-to-br from-black/20 to-teal-900/10 backdrop-blur-sm">
			{/* Main Empty State */}
			<div className="space-y-4">
				<div className="p-6 rounded-full bg-gradient-to-br from-zinc-900/50 to-teal-900/20 border border-white/10 shadow-2xl">
					<SearchX className="h-12 w-12 text-zinc-400" />
				</div>
				<div className="space-y-2">
					<h3 className="text-2xl font-black text-white tracking-wide">{title}</h3>
					<p className="text-zinc-400 max-w-md mx-auto leading-relaxed">{description}</p>
				</div>
			</div>

			{/* Primary Action */}
			{actionLabel && onAction && (
				<Button
					onClick={onAction}
					className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-black px-8 py-3 text-lg shadow-[0_0_30px_rgba(20,184,166,0.3)] hover:shadow-[0_0_40px_rgba(20,184,166,0.5)] transition-all duration-300 hover:scale-105"
				>
					<Zap className="mr-2 h-5 w-5" /> {actionLabel}
				</Button>
			)}

			{/* Enhanced Guidance for Empty Network */}
			{isEmptyNetwork && (
				<div className="w-full max-w-2xl mt-8 space-y-4">
					<p className="text-sm text-zinc-500 font-mono">Getting Started Guide</p>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<Card className="bg-zinc-900/30 border-white/5 hover:border-teal-500/30 transition-colors">
							<CardContent className="p-4 text-center space-y-2">
								<div className="p-2 bg-teal-500/10 rounded-lg w-fit mx-auto">
									<Users className="h-5 w-5 text-teal-400" />
								</div>
								<h4 className="font-bold text-white text-sm">Build Your Tribe</h4>
								<p className="text-xs text-zinc-400">Create communities around shared interests and goals</p>
							</CardContent>
						</Card>

						<Card className="bg-zinc-900/30 border-white/5 hover:border-teal-500/30 transition-colors">
							<CardContent className="p-4 text-center space-y-2">
								<div className="p-2 bg-blue-500/10 rounded-lg w-fit mx-auto">
									<MessageCircle className="h-5 w-5 text-blue-400" />
								</div>
								<h4 className="font-bold text-white text-sm">Spark Discussions</h4>
								<p className="text-xs text-zinc-400">Start meaningful conversations and debates</p>
							</CardContent>
						</Card>

						<Card className="bg-zinc-900/30 border-white/5 hover:border-teal-500/30 transition-colors">
							<CardContent className="p-4 text-center space-y-2">
								<div className="p-2 bg-emerald-500/10 rounded-lg w-fit mx-auto">
									<Target className="h-5 w-5 text-emerald-400" />
								</div>
								<h4 className="font-bold text-white text-sm">Set Objectives</h4>
								<p className="text-xs text-zinc-400">Define clear goals and community guidelines</p>
							</CardContent>
						</Card>
					</div>

					<div className="text-center pt-4 border-t border-white/5">
						<p className="text-xs text-zinc-600">
							💡 <strong>Pro Tip:</strong> Great communities start with clear purposes and active moderation
						</p>
					</div>
				</div>
			)}
		</div>
	)
}
