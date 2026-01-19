import { FolderLock, FileText, Lock, Eye } from "lucide-react"
import { IntelDossier } from "@/lib/data-service"
import Link from "next/link"
import { cn, sanitizeText } from "@/lib/utils"

interface IntelDossierCardProps {
	dossier: IntelDossier
	userXp?: number
}

export function IntelDossierCard({ dossier, userXp = 0 }: IntelDossierCardProps) {
	// Logic: Locked if status is Locked OR if user doesn't have enough XP
	// But specific visual 'XP Lock' if it's purely an XP issue
	const isXpLocked = (dossier.minXp || 0) > userXp
	const isStatusLocked = dossier.status === 'Locked' || dossier.status === 'Classified'

	// Combined lock state
	const isLocked = isStatusLocked || isXpLocked
	const isClassified = dossier.status === 'Classified'

	const linkAriaLabel = isLocked
		? `${dossier.title} - ${isXpLocked ? `Requires ${dossier.minXp} XP` : 'Access denied'}`
		: `${dossier.title} - ${dossier.category} dossier`

	return (
		<Link
			href={isLocked ? '#' : `/intel/${dossier.id}`}
			aria-label={linkAriaLabel}
			className={cn(
				"glass p-6 rounded-xl border-l-4 transition-all group relative overflow-hidden",
				isClassified ? "border-l-red-500 cursor-not-allowed opacity-80" :
					isLocked ? "border-l-amber-500 hover:bg-white/5 cursor-pointer opacity-90" :
						"border-l-emerald-500 hover:bg-white/5 cursor-pointer"
			)}
			onClick={(e) => isLocked && e.preventDefault()}
		>
			{/* Background Glitch Effect for Classified */}
			{isClassified && (
				<div className="absolute inset-0 bg-red-500/5 z-0 pointer-events-none" />
			)}

			{/* XP Lock Overlay */}
			{isXpLocked && !isStatusLocked && (
				<div className="absolute inset-0 bg-black/60 z-20 flex flex-col items-center justify-center p-4 text-center backdrop-blur-[2px]">
					<Lock className="h-8 w-8 text-amber-500 mb-2" />
					<p className="text-amber-500 font-bold font-mono text-sm uppercase">Clearance Denied</p>
					<p className="text-zinc-400 text-xs mt-1">Requires {dossier.minXp} XP</p>
				</div>
			)}

			<div className="flex justify-between items-start mb-4 relative z-10">
				{isClassified ? (
					<Lock className="h-6 w-6 text-red-500" />
				) : isLocked ? (
					<FolderLock className="h-6 w-6 text-amber-500" />
				) : (
					<FolderLock className="h-6 w-6 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
				)}

				<span className={cn(
					"text-[10px] font-mono uppercase border px-2 py-0.5 rounded",
					isClassified ? "text-red-500 border-red-500/20 bg-red-500/10" :
						isLocked ? "text-amber-500 border-amber-500/20 bg-amber-500/10" :
							"text-emerald-500 border-emerald-500/20 bg-emerald-500/10"
				)}>
					{dossier.status}
				</span>
			</div>

			<h3 className={cn(
				"font-bold text-lg relative z-10 transition-colors line-clamp-2 break-words overflow-wrap-anywhere",
				isClassified ? "text-red-400" :
					isLocked ? "text-amber-100" :
						"text-white group-hover:underline decoration-emerald-500 underline-offset-4"
			)}>
				{sanitizeText(dossier.title)}
			</h3>

			{dossier.description && (
				<p className="text-xs text-zinc-500 mt-2 line-clamp-2 relative z-10 break-words overflow-wrap-anywhere">
					{sanitizeText(dossier.description)}
				</p>
			)}

			<div className="flex items-center gap-4 mt-4 text-xs font-mono text-zinc-500 relative z-10">
				<span className="flex items-center gap-1">
					<FileText className="h-3 w-3" /> {dossier.category}
				</span>
				{dossier.tags.length > 0 && (
					<span className="opacity-50">#{dossier.tags[0]}</span>
				)}
			</div>
		</Link>
	)
}

export function IntelDossierSkeleton() {
	return (
		<div className="glass p-6 rounded-xl border-l-4 border-l-zinc-800 animate-pulse">
			<div className="flex justify-between items-start mb-4">
				<div className="h-6 w-6 bg-zinc-800 rounded" />
				<div className="h-4 w-16 bg-zinc-800 rounded" />
			</div>
			<div className="h-6 w-3/4 bg-zinc-800 rounded mb-2" />
			<div className="h-4 w-1/2 bg-zinc-800 rounded" />
		</div>
	)
}
