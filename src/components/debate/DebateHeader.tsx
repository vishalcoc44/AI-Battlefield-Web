import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Shield, MoreVertical } from "lucide-react"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
} from "@/components/ui/dialog"
import type { DebateSession } from "@/types/debate"
import { DEBATE_CONSTANTS } from "@/lib/constants/debate"

interface DebateHeaderProps {
	metrics: DebateSession['metrics'];
	onEndDebate: () => void;
	onDeleteDebate: () => void;
	isEnding?: boolean;
	isDeleting?: boolean;
}

export function DebateHeader({
	metrics,
	onEndDebate,
	onDeleteDebate,
	isEnding = false,
	isDeleting = false
}: DebateHeaderProps) {
	const steelmanScore = Math.round(metrics.avg_steelman || 0);
	const persona = DEBATE_CONSTANTS.PERSONA.SOCRATES;

	return (
		<div className="bg-card border-b p-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center sticky top-16 z-40 shadow-sm">
			<div className="flex items-center gap-3">
				<Avatar className="h-10 w-10 border-2 border-red-500">
					<AvatarFallback>{persona.avatarFallback}</AvatarFallback>
				</Avatar>
				<div>
					<h3 className="font-bold">{persona.name}</h3>
					<div className="flex items-center gap-2 text-xs text-muted-foreground">
						<Shield className="h-3 w-3" />
						Steelman Level:{" "}
						<span className={`font-bold ${steelmanScore > 80 ? 'text-green-600' : 'text-yellow-600'}`}>
							{steelmanScore}%
						</span>
					</div>
				</div>
			</div>

			{/* Stance Bar - Simplified for now, can be complexified later */}
			<div className="flex flex-col items-center w-full opacity-50 cursor-not-allowed" title="Live stance tracking coming soon">
				<div className="flex justify-between w-full text-xs font-bold mb-1 px-1">
					<span className="text-red-600">AI Stance</span>
					<span className="text-blue-600">Your Stance</span>
				</div>
				<div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden flex">
					<div className="h-full bg-red-500" style={{ width: '50%' }} />
					<div className="h-full bg-slate-800 w-1 z-10" />
					<div className="h-full bg-blue-500" style={{ width: '50%' }} />
				</div>
			</div>

			<div className="flex justify-end">
				<div className="flex items-center gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon" className="h-8 w-8">
								<MoreVertical className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<Dialog>
								<DialogTrigger asChild>
									<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
										End Debate
									</DropdownMenuItem>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>End Debate Session?</DialogTitle>
										<DialogDescription>
											Are you sure you want to end this debate? It will be marked as completed.
										</DialogDescription>
									</DialogHeader>
									<DialogFooter>
										<DialogClose asChild>
											<Button variant="ghost">Cancel</Button>
										</DialogClose>
										<Button
											variant="default"
											onClick={onEndDebate}
											disabled={isEnding}
										>
											{isEnding ? 'Ending...' : 'End Debate'}
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>

							<Dialog>
								<DialogTrigger asChild>
									<DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600 focus:text-red-600 focus:bg-red-50">
										Delete Debate
									</DropdownMenuItem>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Delete Debate?</DialogTitle>
										<DialogDescription>
											Are you sure you want to permanently delete this debate? This action cannot be undone.
										</DialogDescription>
									</DialogHeader>
									<DialogFooter>
										<DialogClose asChild>
											<Button variant="ghost">Cancel</Button>
										</DialogClose>
										<Button
											variant="destructive"
											onClick={onDeleteDebate}
											disabled={isDeleting}
										>
											{isDeleting ? 'Deleting...' : 'Delete Forever'}
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</div>
	)
}
