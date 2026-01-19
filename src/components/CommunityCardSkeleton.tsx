import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"

export function CommunityCardSkeleton() {
	return (
		<Card className="holographic-card border-white/5 bg-black/40 overflow-hidden relative">
			<CardHeader className="space-y-4">
				<div className="flex justify-between items-start">
					<div className="h-16 w-16 rounded-full bg-zinc-800 animate-pulse" />
					<div className="h-6 w-20 rounded-full bg-zinc-800 animate-pulse" />
				</div>
				<div className="h-8 w-3/4 bg-zinc-800 rounded animate-pulse" />
				<div className="flex gap-2">
					<div className="h-4 w-24 bg-zinc-800 rounded animate-pulse" />
					<div className="h-4 w-24 bg-zinc-800 rounded animate-pulse" />
				</div>
			</CardHeader>
			<CardContent className="space-y-3">
				<div className="h-4 w-full bg-zinc-800 rounded animate-pulse" />
				<div className="h-4 w-5/6 bg-zinc-800 rounded animate-pulse" />
				<div className="flex gap-2 pt-2">
					<div className="h-6 w-16 bg-zinc-800 rounded animate-pulse" />
					<div className="h-6 w-20 bg-zinc-800 rounded animate-pulse" />
					<div className="h-6 w-14 bg-zinc-800 rounded animate-pulse" />
				</div>
			</CardContent>
			<CardFooter className="gap-3">
				<div className="h-9 flex-1 bg-zinc-800 rounded animate-pulse" />
				<div className="h-9 flex-1 bg-zinc-800 rounded animate-pulse" />
			</CardFooter>
		</Card>
	)
}
