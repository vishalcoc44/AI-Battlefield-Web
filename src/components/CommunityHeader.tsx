import { useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Lock, Globe, Activity, Share2, Loader2, Zap, Settings, Trash2, Camera, Upload } from "lucide-react"
import type { Community } from "@/lib/data-service"
import { useRouter } from "next/navigation"
import { validateFileUpload } from "@/lib/utils/validation"
import { showToast } from "@/lib/toast"
import { sanitizeText } from "@/lib/utils"

interface CommunityHeaderProps {
	community: Community
	isMember: boolean
	isAdmin: boolean
	joining: boolean
	onJoin: () => void
	onLeave: () => void
	onEdit?: () => void
	onDelete?: () => void
	onUpdateCover?: (file: File) => void
	onUpdateAvatar?: (file: File) => void
}

export function CommunityHeader({
	community, isMember, isAdmin, joining, onJoin, onLeave, onEdit, onDelete, onUpdateCover, onUpdateAvatar
}: CommunityHeaderProps) {
	const router = useRouter()
	const coverInputRef = useRef<HTMLInputElement>(null)
	const avatarInputRef = useRef<HTMLInputElement>(null)

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'avatar') => {
		const file = e.target.files?.[0]
		if (file) {
			// Validate file upload
			const validation = validateFileUpload(file)
			if (!validation.isValid) {
				showToast.error("Invalid File", validation.errors[0])
				// Reset the input
				e.target.value = ''
				return
			}

			if (type === 'cover' && onUpdateCover) onUpdateCover(file)
			if (type === 'avatar' && onUpdateAvatar) onUpdateAvatar(file)
		}
	}

	return (
		<div className="relative z-10 w-full animate-in fade-in duration-1000">
			{/* Hidden Inputs */}
			<input type="file" ref={coverInputRef} className="hidden" onChange={(e) => handleFileChange(e, 'cover')} accept="image/*" />
			<input type="file" ref={avatarInputRef} className="hidden" onChange={(e) => handleFileChange(e, 'avatar')} accept="image/*" />

			{/* 🖼️ High-Tech Cover */}
			<div className="h-[350px] w-full relative overflow-hidden group">
				{community.coverImage ? (
					<img src={community.coverImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
				) : (
					<div className="absolute inset-0 bg-gradient-to-br from-teal-900/40 to-black" />
				)}

				<div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/50 to-black z-10" />
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-50" />

				{isAdmin && (
					<div className="absolute top-4 right-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
						<Button variant="outline" size="sm" onClick={() => coverInputRef.current?.click()} className="bg-black/50 border-white/20 text-white backdrop-blur-md">
							<Camera className="h-4 w-4 mr-2" /> Edit Cover
						</Button>
					</div>
				)}
			</div>

			<div className="max-w-[1400px] mx-auto px-6 md:px-12 -mt-32 relative z-20">
				<div className="flex flex-col md:flex-row gap-10 items-end">
					{/* 🧬 Identity Module */}
					<div className="relative group">
						<div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-3xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-500 animate-pulse" />
						<div className="relative">
							<Avatar className="h-40 w-40 md:h-52 md:w-52 border-4 border-black shadow-2xl rounded-3xl relative z-10 bg-black">
								<AvatarImage src={community.avatar} alt={community.name} className="object-cover" />
								<AvatarFallback className="bg-zinc-900 text-zinc-500 text-5xl font-black rounded-3xl">
									{community.name?.[0]}
								</AvatarFallback>
							</Avatar>

							{isAdmin && (
								<div
									className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl cursor-pointer"
									onClick={() => avatarInputRef.current?.click()}
								>
									<Upload className="h-8 w-8 text-white/80" />
								</div>
							)}
						</div>
						<div className="absolute -bottom-3 -right-3 z-20 bg-black border border-white/10 rounded-full p-2 shadow-xl">
							{community.type === 'Private' ? <Lock className="h-5 w-5 text-zinc-500" /> : <Globe className="h-5 w-5 text-green-400" />}
						</div>
					</div>

					{/* 📝 Header Content */}
					<div className="flex-1 pb-4 space-y-6">
						<div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
							<div>
								<div className="flex gap-2 mb-3">
									<Badge variant="outline" className="bg-teal-500/10 text-teal-400 border-teal-500/20 backdrop-blur-md px-3 py-1 uppercase tracking-widest text-[10px]">
										{community.category}
									</Badge>
									<Badge variant="outline" className={`backdrop-blur-md border-white/10 px-3 py-1 uppercase tracking-widest text-[10px] ${community.activityLevel === 'High' ? 'bg-green-500/10 text-green-400' : 'bg-zinc-800/50 text-zinc-400'}`}>
										<Activity className="h-3 w-3 mr-1 inline" /> {community.activityLevel} Activity
									</Badge>
								</div>
								<h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white drop-shadow-xl truncate max-w-2xl">{community.name}</h1>
							</div>

							<div className="flex gap-3">
								{isAdmin && (
									<div className="flex gap-2">
										<Button variant="outline" size="icon" onClick={onEdit} className="border-white/10 bg-black/50 hover:bg-white/10 text-zinc-400 hover:text-white">
											<Settings className="h-4 w-4" />
										</Button>
										<Button variant="outline" size="icon" onClick={onDelete} className="border-red-500/20 bg-black/50 hover:bg-red-500/10 text-red-500 hover:text-red-400">
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								)}

								<Button
									variant="outline"
									className="border-white/10 bg-black/50 hover:bg-white/10 text-white backdrop-blur-md h-12 uppercase tracking-wide text-xs font-bold focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black"
									aria-label={`Share ${community.name} community`}
								>
									<Share2 className="h-4 w-4 mr-2" aria-hidden="true" /> Share
								</Button>

								<Button
									className={`${isMember
										? "bg-zinc-900 text-zinc-400 border border-white/10 hover:bg-zinc-800"
										: "bg-white text-black hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.2)]"}
                         font-black px-8 h-12 transition-all uppercase tracking-wider text-xs hover:scale-105 focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black`}
									onClick={isMember ? onLeave : onJoin}
									disabled={joining}
									aria-label={isMember ? `Leave ${community.name} community` : `Join ${community.name} community`}
									aria-disabled={joining}
								>
									{joining && <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />}
									{joining ? (
										isMember ? "Leaving..." : "Joining..."
									) : isMember ? (
										"Leave Tribe"
									) : (
										<>Initialize Link <Zap className="ml-2 h-4 w-4" aria-hidden="true" /></>
									)}
								</Button>
							</div>
						</div>

						<Tooltip>
							<TooltipTrigger asChild>
								<p className="text-zinc-400 text-lg max-w-3xl leading-relaxed font-light border-l-2 border-teal-500/30 pl-6 line-clamp-3 break-words cursor-pointer">
									{sanitizeText(community.desc)}
								</p>
							</TooltipTrigger>
							<TooltipContent>
								<p className="max-w-sm break-words">{sanitizeText(community.desc)}</p>
							</TooltipContent>
						</Tooltip>
					</div>
				</div>
			</div>
		</div>
	)
}
