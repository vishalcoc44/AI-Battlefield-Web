"use client"

import { Ghost } from "lucide-react"

export function VoidEmptyState() {
	return (
		<div className="flex flex-col items-center justify-center py-16 px-4 text-center">
			<Ghost className="h-16 w-16 text-zinc-600 mb-4 animate-pulse" />
			<h3 className="text-xl font-bold text-zinc-400 mb-2">No Phantoms Active</h3>
			<p className="text-sm text-zinc-500 max-w-md">
				Be the first to enter The Void. Your anonymous thoughts await.
			</p>
		</div>
	)
}
