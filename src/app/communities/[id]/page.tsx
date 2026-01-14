"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { TopNav } from "@/components/layout/TopNav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
	Users, Globe, Lock, Shield,
	Trophy, TrendingUp, Share2, ArrowLeft,
	Loader2, CalendarDays, MessageCircle, Zap, Activity
} from "lucide-react"
import { dataService, type Community } from "@/lib/data-service"
import { supabase } from "@/lib/supabase"
import { CommunityActivityFeed } from "@/components/CommunityActivityFeed"
import { CommunityDiscussions } from "@/components/CommunityDiscussions"
import { CommunityEvents } from "@/components/CommunityEvents"
import { CommunityMembers } from "@/components/CommunityMembers"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

export default function CommunityDetailPage() {
	const params = useParams()
	const router = useRouter()
	const id = params.id as string

	const [community, setCommunity] = useState<Community | null>(null)
	const [loading, setLoading] = useState(true)
	const [joining, setJoining] = useState(false)
	const [isMember, setIsMember] = useState(false)
	const [memberCount, setMemberCount] = useState<string>("0")
	const [feedbackDialog, setFeedbackDialog] = useState<{ open: boolean, title: string, message: string }>({ open: false, title: '', message: '' })
	const [confirmDialog, setConfirmDialog] = useState<{ open: boolean, title: string, message: string, onConfirm: () => void }>({ open: false, title: '', message: '', onConfirm: () => { } })

	useEffect(() => {
		async function loadCommunity() {
			if (!id) return
			setLoading(true)
			try {
				const data = await dataService.getCommunityById(id)
				if (data) {
					setCommunity(data)
					setMemberCount(data.members)

					// Check membership status
					const { data: { user } } = await supabase.auth.getUser()
					if (user) {
						const memberProfile = await dataService.getCommunityMemberProfile(user.id, id)
						setIsMember(!!memberProfile)
					}
				}
			} catch (error) {
				console.error("Failed to load community details:", error)
			} finally {
				setLoading(false)
			}
		}
		loadCommunity()
	}, [id])

	const handleJoinLeave = async () => {
		if (!community) return

		setJoining(true)
		try {
			const { data: { user } } = await supabase.auth.getUser()
			if (!user) {
				setFeedbackDialog({ open: true, title: "Authentication Required", message: "Please sign in to join communities" })
				return
			}

			if (isMember) {
				setConfirmDialog({
					open: true,
					title: "Leave Community",
					message: "Are you sure you want to leave this community? You will lose access to member-only discussions.",
					onConfirm: async () => {
						const response = await dataService.leaveCommunity(community.id, user.id)
						if (response.success) {
							setFeedbackDialog({ open: true, title: "Left Community", message: "You have left the community successfully." })
							setIsMember(false)
						} else {
							setFeedbackDialog({ open: true, title: "Error", message: "Failed to leave community. Please try again." })
						}
						setConfirmDialog(prev => ({ ...prev, open: false }))
					}
				})
			} else {
				const response = await dataService.joinCommunity(community.id, user.id)
				if (response.success) {
					setIsMember(true)
					setFeedbackDialog({ open: true, title: "Welcome!", message: "You have successfully joined the community." })
				}
			}
		} catch (error: any) {
			if (error?.code === "23505") {
				setIsMember(true)
				setFeedbackDialog({ open: true, title: "Already a Member", message: "You are already a member of this community." })
			} else {
				setFeedbackDialog({ open: true, title: "Error", message: "Failed to update membership. Please try again." })
			}
		} finally {
			setJoining(false)
		}
	}


	if (loading) {
		return (
			<div className="flex flex-col min-h-screen bg-black relative overflow-hidden">
				<div className="fixed inset-0 z-0 pointer-events-none bg-black">
					<div className="absolute inset-0 bg-grid-white/[0.04]" />
				</div>
				<TopNav />
				<div className="flex justify-center items-center h-screen">
					<div className="flex flex-col items-center gap-4">
						<Loader2 className="h-10 w-10 animate-spin text-pink-500" />
						<p className="text-zinc-500 font-mono animate-pulse">Decrypting dossier...</p>
					</div>
				</div>
			</div>
		)
	}

	if (!community) {
		return (
			<div className="flex flex-col min-h-screen bg-black text-white">
				<TopNav />
				<div className="flex-1 flex flex-col items-center justify-center gap-4">
					<h1 className="text-3xl font-black text-zinc-500">Signal Lost</h1>
					<Button onClick={() => router.push('/communities')} variant="outline" className="border-white/10 text-white hover:bg-white/5">
						<ArrowLeft className="mr-2 h-4 w-4" /> Return to Network
					</Button>
				</div>
			</div>
		)
	}

	const StatCard = ({ icon: Icon, label, value }: { icon: any, label: string, value: string | number }) => (
		<div className="flex flex-col items-center justify-center p-6 holographic-card rounded-2xl border-white/5 hover:border-teal-500/30 transition-all duration-500 group relative overflow-hidden">
			<div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
			<div className="p-3 bg-white/5 rounded-xl mb-3 group-hover:scale-110 transition-transform border border-white/5">
				<Icon className="h-5 w-5 text-teal-500" />
			</div>
			<div className="font-black text-3xl tracking-tighter text-white">{value}</div>
			<div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1 group-hover:text-teal-400 transition-colors">{label}</div>
		</div>
	)

	return (
		<div className="dark flex flex-col min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-teal-500/30">

			{/* 🌌 Cosmic Background (Consistent) */}
			<div className="fixed inset-0 z-0 pointer-events-none">
				<div className="absolute inset-0 bg-gradient-to-br from-black via-[#050510] to-[#0a1a0f]" />
				<div className="absolute inset-0 bg-grid-white/[0.04]" />
				<div className="bg-noise opacity-[0.15]" />
				<div className="absolute top-[-20%] left-[20%] w-[60vw] h-[60vw] bg-teal-600/10 rounded-full blur-[150px] animate-pulse mix-blend-screen" />
			</div>

			<div className="relative z-10"><TopNav /></div>

			{/* Immersive Hero Header */}
			<div className="relative z-10 w-full animate-in fade-in duration-1000">
				{/* 🖼️ High-Tech Cover */}
				<div className="h-[350px] w-full relative overflow-hidden group">
					<div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/50 to-black z-10" />

					{/* Generative Grid Overlay */}
					<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-50" />

					{/* Dynamic Background Element */}
					<div className="absolute inset-0 bg-gradient-to-r from-teal-900/20 via-emerald-900/20 to-green-900/20 mix-blend-overlay" />

					<Button
						variant="ghost"
						size="sm"
						className="absolute top-6 left-6 gap-2 bg-black/40 backdrop-blur-md hover:bg-white/10 text-zinc-300 border border-white/10 transition-all z-20 rounded-full px-4"
						onClick={() => router.push('/communities')}
					>
						<ArrowLeft className="h-4 w-4" /> Abort
					</Button>
				</div>

				<div className="max-w-[1400px] mx-auto px-6 md:px-12 -mt-32 relative z-20">
					<div className="flex flex-col md:flex-row gap-10 items-end">
						{/* 🧬 Identity Module */}
						<div className="relative group">
							{/* Hexagon/Circle Tech Frame */}
							<div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-3xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-500 animate-pulse" />
							<Avatar className="h-40 w-40 md:h-52 md:w-52 border-4 border-black shadow-2xl rounded-3xl relative z-10 bg-black">
								<AvatarFallback className="bg-zinc-900 text-zinc-500 text-5xl font-black rounded-3xl">
									{community.name?.[0]}
								</AvatarFallback>
							</Avatar>
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
									<h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white drop-shadow-xl">{community.name}</h1>
								</div>

								<div className="flex gap-3">
									<Button variant="outline" className="border-white/10 bg-black/50 hover:bg-white/10 text-white backdrop-blur-md h-12 uppercase tracking-wide text-xs font-bold">
										<Share2 className="h-4 w-4 mr-2" /> Share
									</Button>
									<Button
										className={`${isMember
											? "bg-zinc-900 text-zinc-400 border border-white/10 hover:bg-zinc-800"
											: "bg-white text-black hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.2)]"} 
                                 font-black px-8 h-12 transition-all uppercase tracking-wider text-xs hover:scale-105`}
										onClick={handleJoinLeave}
										disabled={joining}
									>
										{joining ? (
											<Loader2 className="h-4 w-4 animate-spin mr-2" />
										) : isMember ? (
											"Member Settings"
										) : (
											<>Initialize Link <Zap className="ml-2 h-4 w-4" /></>
										)}
									</Button>
								</div>
							</div>

							<p className="text-zinc-400 text-lg max-w-3xl leading-relaxed font-light border-l-2 border-teal-500/30 pl-6">
								{community.desc}
							</p>
						</div>
					</div>
				</div>
			</div>

			<main className="flex-1 p-6 md:p-12 max-w-[1400px] mx-auto w-full space-y-12 relative z-10">

				{/* 📊 Data Grid */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-in slide-in-from-bottom-8 duration-1000 delay-100">
					<StatCard icon={Users} label="Operatives" value={memberCount} />
					<StatCard icon={MessageCircle} label="Comms" value={community.discussionCount || 0} />
					<StatCard icon={Trophy} label="Active Conflicts" value={community.integrations?.gymRoomsActive || 0} />
					<StatCard icon={CalendarDays} label="Events" value={community.upcomingEvents || 0} />
				</div>

				<Tabs defaultValue="overview" className="w-full">
					<div className="flex justify-start mb-8 border-b border-white/10">
						<TabsList className="bg-transparent p-0 w-full max-w-2xl flex justify-start gap-8">
							{["overview", "discussions", "events", "members"].map(tab => (
								<TabsTrigger
									key={tab}
									value={tab}
									className="rounded-none border-b-2 border-transparent px-2 pb-4 pt-2 text-zinc-500 hover:text-white data-[state=active]:border-teal-500 data-[state=active]:text-teal-500 data-[state=active]:bg-transparent transition-all capitalize font-mono text-sm tracking-wider"
								>
									{tab}
								</TabsTrigger>
							))}
						</TabsList>
					</div>

					<TabsContent value="overview" className="space-y-6 focus-visible:outline-none animate-in fade-in-50 duration-500">
						<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
							{/* Main Feed */}
							<div className="lg:col-span-8 space-y-8">
								<Card className="holographic-card border-white/5 p-6">
									<CardHeader className="p-0 mb-6">
										<CardTitle className="flex items-center gap-3 text-lg font-bold text-white uppercase tracking-wider">
											<TrendingUp className="h-5 w-5 text-teal-500" />
											Live Intelligence Feed
										</CardTitle>
									</CardHeader>
									<CardContent className="p-0">
										<CommunityActivityFeed limit={5} showHeader={false} communityId={community?.id} />
									</CardContent>
								</Card>

								<div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
									<h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Signal Tags</h3>
									<div className="flex flex-wrap gap-2">
										{(community.tags || []).map(tag => (
											<Badge key={tag} variant="outline" className="px-3 py-1 text-xs border-white/10 text-zinc-400 hover:text-white hover:border-teal-500/50 cursor-pointer transition-colors">
												#{tag}
											</Badge>
										))}
									</div>
								</div>
							</div>

							{/* Sidebar */}
							<div className="lg:col-span-4 space-y-6">
								{/* Rules Card */}
								<Card className="holographic-card border-white/5">
									<CardHeader>
										<div className="flex items-center gap-2">
											<Shield className="h-4 w-4 text-teal-500" />
											<CardTitle className="text-sm font-bold uppercase tracking-widest text-white">Directives</CardTitle>
										</div>
									</CardHeader>
									<CardContent className="space-y-4">
										{typeof community.rules === 'string' ? (
											<div className="text-sm text-zinc-400 whitespace-pre-line leading-relaxed font-mono">
												{community.rules}
											</div>
										) : (
											<ul className="space-y-3 text-sm text-zinc-400 font-mono">
												{Array.isArray(community.rules) && community.rules.map((rule: any, i: number) => (
													<li key={i} className="flex gap-3 items-start">
														<span className="font-bold text-teal-500 bg-teal-500/10 px-1.5 rounded">{i + 1}</span>
														<span>{rule.description || rule.title || JSON.stringify(rule)}</span>
													</li>
												))}
											</ul>
										)}
									</CardContent>
								</Card>

								{/* Integrations Card */}
								<Card className="border-0 bg-transparent">
									<CardHeader className="px-0">
										<CardTitle className="text-sm font-bold uppercase tracking-widest text-zinc-500">Linked Modules</CardTitle>
									</CardHeader>
									<CardContent className="space-y-3 px-0">
										<div className="flex justify-between items-center p-4 bg-zinc-900/50 rounded-xl border border-white/5 hover:border-blue-500/30 transition-colors cursor-pointer group">
											<div className="flex items-center gap-3">
												<div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
													<MessageCircle className="h-4 w-4 text-blue-500" />
												</div>
												<span className="text-sm font-bold text-zinc-300 group-hover:text-white">Debate Gym</span>
											</div>
											<Badge variant="secondary" className="bg-black border border-white/10 text-blue-400">{community.integrations?.gymRoomsActive || 0}</Badge>
										</div>
										<div className="flex justify-between items-center p-4 bg-zinc-900/50 rounded-xl border border-white/5 hover:border-yellow-500/30 transition-colors cursor-pointer group">
											<div className="flex items-center gap-3">
												<div className="p-2 bg-yellow-500/10 rounded-lg group-hover:bg-yellow-500/20 transition-colors">
													<Trophy className="h-4 w-4 text-yellow-500" />
												</div>
												<span className="text-sm font-bold text-zinc-300 group-hover:text-white">Predictions</span>
											</div>
											<Badge variant="secondary" className="bg-black border border-white/10 text-yellow-400">{community.integrations?.debatesHosted || 0}</Badge>
										</div>
									</CardContent>
								</Card>
							</div>
						</div>
					</TabsContent>

					<TabsContent value="discussions" className="mt-6 animate-in fade-in-50 duration-500">
						<CommunityDiscussions limit={10} communityId={id} showCreateForm={isMember} />
					</TabsContent>

					<TabsContent value="events" className="mt-6 animate-in fade-in-50 duration-500">
						<CommunityEvents limit={10} communityId={id} />
					</TabsContent>

					<TabsContent value="members" className="mt-6 animate-in fade-in-50 duration-500">
						<CommunityMembers communityId={id} limit={20} />
					</TabsContent>
				</Tabs>
			</main>

			{/* Feedback Dialog */}
			<Dialog open={feedbackDialog.open} onOpenChange={(open) => setFeedbackDialog(prev => ({ ...prev, open }))}>
				<DialogContent className="glass-card border-white/10 bg-black text-white">
					<DialogHeader>
						<DialogTitle>{feedbackDialog.title}</DialogTitle>
						<DialogDescription className="text-zinc-400">{feedbackDialog.message}</DialogDescription>
					</DialogHeader>
					<div className="flex justify-end">
						<Button onClick={() => setFeedbackDialog(prev => ({ ...prev, open: false }))} className="bg-white text-black hover:bg-zinc-200">Acknowledge</Button>
					</div>
				</DialogContent>
			</Dialog>

			{/* Confirmation Dialog */}
			<Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}>
				<DialogContent className="glass-card border-white/10 bg-black text-white">
					<DialogHeader>
						<DialogTitle>{confirmDialog.title}</DialogTitle>
						<DialogDescription className="text-zinc-400">{confirmDialog.message}</DialogDescription>
					</DialogHeader>
					<div className="flex justify-end gap-2">
						<Button variant="outline" onClick={() => setConfirmDialog(prev => ({ ...prev, open: false }))} className="border-white/10 hover:bg-white/10">Cancel</Button>
						<Button variant="destructive" onClick={confirmDialog.onConfirm}>Confirm</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	)
}
