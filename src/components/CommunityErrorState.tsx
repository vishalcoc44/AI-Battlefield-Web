import { AlertCircle, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CommunityErrorStateProps {
	title?: string
	message?: string
	onRetry?: () => void
}

export function CommunityErrorState({
	title = "Connection Lost",
	message = "Unable to establish uplink with the community database.",
	onRetry
}: CommunityErrorStateProps) {
	return (
		<div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-4 rounded-2xl border border-red-500/20 bg-red-500/5 backdrop-blur-sm animate-in fade-in zoom-in duration-500">
			<div className="p-4 rounded-full bg-red-500/10 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
				<AlertCircle className="h-10 w-10 text-red-500" />
			</div>
			<div className="space-y-1">
				<h3 className="text-xl font-bold text-white tracking-wide">{title}</h3>
				<p className="text-zinc-400 max-w-md mx-auto">{message}</p>
			</div>
			{onRetry && (
				<Button
					variant="outline"
					onClick={onRetry}
					className="mt-4 border-red-500/20 text-red-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/50"
				>
					<RefreshCcw className="mr-2 h-4 w-4" /> Re-Initialize
				</Button>
			)}
		</div>
	)
}
