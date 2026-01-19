"use client"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { VoidMask } from "@/lib/types"
import { Ghost, AlertTriangle } from "lucide-react"

interface EnterVoidModalProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	mask: VoidMask | null
	onConfirm: () => void
	isLoading?: boolean
}

export function EnterVoidModal({ open, onOpenChange, mask, onConfirm, isLoading }: EnterVoidModalProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="bg-black/90 border-white/10 text-white">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2 text-xl">
						<Ghost className="h-5 w-5 text-purple-500" />
						Enter The Void
					</DialogTitle>
					<DialogDescription className="text-zinc-400">
						You are about to enter an anonymous realm where ideas stand alone.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					{mask && (
						<div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
							<div className="text-2xl">🎭</div>
							<div>
								<div className="font-bold text-white">Identity: {mask.name}</div>
								<div className="text-sm text-zinc-400">Your anonymous mask</div>
							</div>
						</div>
					)}

					<div className="flex items-start gap-3 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
						<AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
						<div className="text-sm text-yellow-200">
							<p className="font-semibold mb-1">Important:</p>
							<ul className="list-disc list-inside space-y-1 text-yellow-300/80">
								<li>Your identity will be hidden</li>
								<li>Messages are ephemeral (24 hours)</li>
								<li>No history is preserved</li>
								<li>Be respectful of others</li>
							</ul>
						</div>
					</div>
				</div>

				<DialogFooter className="gap-2">
					<Button
						variant="ghost"
						onClick={() => onOpenChange(false)}
						disabled={isLoading}
						className="text-zinc-400 hover:text-white"
					>
						Cancel
					</Button>
					<Button
						onClick={onConfirm}
						disabled={isLoading}
						className="bg-white text-black hover:bg-zinc-200"
					>
						{isLoading ? "Entering..." : "Enter The Void"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
