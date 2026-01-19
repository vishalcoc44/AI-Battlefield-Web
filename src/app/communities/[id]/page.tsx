"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { TopNav } from "@/components/layout/TopNav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Shield, TrendingUp, MessageCircle, Trophy, ArrowLeft, Loader2, CalendarDays } from "lucide-react"
import { dataService, type Community } from "@/lib/data-service"
import { CommunityActivityFeed } from "@/components/CommunityActivityFeed"
import { CommunityDiscussions } from "@/components/CommunityDiscussions"
import { CommunityEvents } from "@/components/CommunityEvents"
import { CommunityMembers } from "@/components/CommunityMembers"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TooltipProvider } from "@/components/ui/tooltip"

import { useCommunityMembership } from "@/hooks/useCommunityMembership"
import { CommunityHeader } from "@/components/CommunityHeader"
import { CommunityStats } from "@/components/CommunityStats"
import { CommunityErrorState } from "@/components/CommunityErrorState"
import { CommunityChat } from "@/components/CommunityChat"
import { CommunityEditFormData } from "@/lib/types/community-forms"
import { classifyError, withRetry } from "@/lib/utils"
import { COMMUNITY_CONSTANTS } from "@/lib/constants/communities"

export default function CommunityDetailPage() {
	const params = useParams()
	const router = useRouter()
	const id = params.id as string

	const [community, setCommunity] = useState<Community | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [memberCount, setMemberCount] = useState<string>("0")

	// Membership Hook
	const {
		isMember,
		isAdmin,
		loading: membershipLoading,
		joining,
		joinCommunity,
		leaveCommunity,
		userId
	} = useCommunityMembership(id)

	// Dialog States
	const [feedbackDialog, setFeedbackDialog] = useState<{ open: boolean, title: string, message: string }>({ open: false, title: '', message: '' })
	const [editDialogOpen, setEditDialogOpen] = useState(false)
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [leaveDialogOpen, setLeaveDialogOpen] = useState(false)

	// Edit Form State
	const [editData, setEditData] = useState<CommunityEditFormData>({})
	const [saving, setSaving] = useState(false)

	useEffect(() => {
		loadCommunity()

		// Keyboard shortcuts for community detail page
		const handleKeyDown = (e: KeyboardEvent) => {
			// Don't trigger shortcuts when typing in inputs
			if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
				return
			}

			// "j" to join/leave community
			if (e.key === 'j' && !e.ctrlKey && !e.metaKey) {
				e.preventDefault()
				handleJoinLeave()
			}

			// "e" to edit community (if admin)
			if (e.key === 'e' && !e.ctrlKey && !e.metaKey && isAdmin) {
				e.preventDefault()
				setEditDialogOpen(true)
			}

			// "Escape" to close dialogs
			if (e.key === 'Escape') {
				if (leaveDialogOpen) {
					setLeaveDialogOpen(false)
				} else if (editDialogOpen) {
					setEditDialogOpen(false)
				} else if (deleteDialogOpen) {
					setDeleteDialogOpen(false)
				}
			}
		}

		document.addEventListener('keydown', handleKeyDown)

		// Cleanup function
		return () => {
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [id, isAdmin, leaveDialogOpen, editDialogOpen, deleteDialogOpen])

	// Clear saved data when navigating to a different community
	useEffect(() => {
		return () => {
			if (id) {
				// Check if we're navigating away and clear if it's a different community
				const savedData = localStorage.getItem(COMMUNITY_CONSTANTS.LOCAL_STORAGE_KEYS.COMMUNITY_EDIT_DRAFT)
				if (savedData) {
					try {
						const parsedData = JSON.parse(savedData)
						// Clear if it's older than 1 hour (stale data)
						if (Date.now() - parsedData.timestamp > 60 * 60 * 1000) {
							localStorage.removeItem(COMMUNITY_CONSTANTS.LOCAL_STORAGE_KEYS.COMMUNITY_EDIT_DRAFT)
						}
					} catch (error) {
						localStorage.removeItem(COMMUNITY_CONSTANTS.LOCAL_STORAGE_KEYS.COMMUNITY_EDIT_DRAFT)
					}
				}
			}
		}
	}, [id])

	// Load saved form data from localStorage
	useEffect(() => {
		if (community?.id) {
			const savedData = localStorage.getItem(COMMUNITY_CONSTANTS.LOCAL_STORAGE_KEYS.COMMUNITY_EDIT_DRAFT)
			if (savedData) {
				try {
					const parsedData = JSON.parse(savedData)
					// Only use saved data if it's for the current community
					if (parsedData.communityId === community.id) {
						setEditData(parsedData.data)
					}
				} catch (error) {
					console.error('Failed to parse saved edit data:', error)
				}
			}
		}
	}, [community?.id])

	// Save form data to localStorage whenever it changes
	useEffect(() => {
		if (community?.id && Object.keys(editData).length > 0) {
			const dataToSave = {
				communityId: community.id,
				data: editData,
				timestamp: Date.now()
			}
			localStorage.setItem(COMMUNITY_CONSTANTS.LOCAL_STORAGE_KEYS.COMMUNITY_EDIT_DRAFT, JSON.stringify(dataToSave))
		}
	}, [editData, community?.id])

	async function loadCommunity() {
		if (!id) return
		setLoading(true)
		setError(null)
		try {
			const data = await withRetry(
				() => dataService.getCommunityById(id),
				3, // max attempts
				1000, // base delay
				(error) => {
					const classification = classifyError(error)
					return classification.retryable
				}
			)
			if (data) {
				setCommunity(data)
				setMemberCount(data.members)
				setEditData({
					name: data.name,
					desc: data.desc,
					category: data.category,
					type: data.type,
					// Simple rule handling for now
					rules: typeof data.rules === 'string' ? data.rules : JSON.stringify(data.rules || [])
				})
			} else {
				setError("Community frequency not found.")
			}
		} catch (error: any) {
			console.error("Failed to load community details:", error)
			const classification = classifyError(error)
			setError(classification.message)
		} finally {
			setLoading(false)
		}
	}

	const handleJoinLeave = () => {
		if (isMember) {
			// Show confirmation dialog for leaving
			setLeaveDialogOpen(true)
		} else {
			// Join directly (no confirmation needed)
			performJoin()
		}
	}

	const performJoin = async () => {
		try {
			await joinCommunity()
			setFeedbackDialog({ open: true, title: "Welcome", message: "Uplink established. You are now an operative." })
		} catch (error: any) {
			const classification = classifyError(error)
			setFeedbackDialog({ open: true, title: "Operation Failed", message: classification.message })
		}
	}

	const performLeave = async () => {
		try {
			await leaveCommunity()
			setLeaveDialogOpen(false)
			setFeedbackDialog({ open: true, title: "Left Community", message: "You have disconnected from this frequency." })
		} catch (error: any) {
			const classification = classifyError(error)
			setFeedbackDialog({ open: true, title: "Operation Failed", message: classification.message })
		}
	}

	const handleUpdate = async () => {
		if (!userId || !community) return
		setSaving(true)
		try {
			const updated = await dataService.updateCommunity(community.id, editData, userId)
			if (updated) {
				setCommunity(updated)
				setEditDialogOpen(false)
				// Clear saved draft data since it was successfully saved
				localStorage.removeItem(COMMUNITY_CONSTANTS.LOCAL_STORAGE_KEYS.COMMUNITY_EDIT_DRAFT)
				setFeedbackDialog({ open: true, title: "Update Success", message: "Community parameters reconfigured." })
			}
		} catch (error: any) {
			const classification = classifyError(error)
			setFeedbackDialog({ open: true, title: "Update Failed", message: classification.message })
		} finally {
			setSaving(false)
		}
	}

	const handleDelete = async () => {
		if (!userId || !community) return
		setSaving(true)
		try {
			await dataService.deleteCommunity(community.id, userId)
			router.push('/communities')
		} catch (error: any) {
			const classification = classifyError(error)
			setFeedbackDialog({ open: true, title: "Delete Failed", message: classification.message })
			setSaving(false)
		}
	}

	const handleImageUpdate = async (file: File, type: 'cover' | 'avatar') => {
		if (!community || !userId) return
		// Use a local loading state for image if needed, or reuse saving
		// setSaving(true) // Reuse saving to disable other interactions? Or just silent update?
		// User feedback is better.
		try {
			const url = await dataService.uploadCommunityImage(community.id, file, type)
			if (url) {
				const updates = type === 'cover' ? { coverImage: url } : { avatar: url }
				const updatedCommunity = await dataService.updateCommunity(community.id, updates, userId)
				if (updatedCommunity) {
					setCommunity(updatedCommunity)
					setFeedbackDialog({ open: true, title: "Visuals Updated", message: "Signal signatures re-calibrated." })
				}
			}
		} catch (error) {
			setFeedbackDialog({ open: true, title: "Upload Failed", message: "Transmission interrupted." })
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

	if (error || !community) {
		return (
			<div className="flex flex-col min-h-screen bg-black text-white">
				<TopNav />
				<div className="flex-1 flex flex-col items-center justify-center p-6">
					<CommunityErrorState message={error || "Community not found"} onRetry={loadCommunity} />
					<Button onClick={() => router.push('/communities')} variant="ghost" className="mt-4 text-zinc-500 hover:text-white">
						<ArrowLeft className="mr-2 h-4 w-4" /> Return to Network
					</Button>
				</div>
			</div>
		)
	}

	return (
		<div className="dark flex flex-col min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-teal-500/30">
			<TooltipProvider>

			{/* 🌌 Cosmic Background (Consistent) */}
			<div className="fixed inset-0 z-0 pointer-events-none">
				<div className="absolute inset-0 bg-gradient-to-br from-black via-[#050510] to-[#0a1a0f]" />
				<div className="absolute inset-0 bg-grid-white/[0.04]" />
				<div className="bg-noise opacity-[0.15]" />
				<div className="absolute top-[-20%] left-[20%] w-[60vw] h-[60vw] bg-teal-600/10 rounded-full blur-[150px] animate-pulse mix-blend-screen" />
			</div>

			<div className="relative z-10"><TopNav /></div>

			<CommunityHeader
				community={community}
				isMember={isMember}
				isAdmin={isAdmin}
				joining={joining || membershipLoading} // Disable if checking or joining
				onJoin={handleJoinLeave}
				onLeave={handleJoinLeave}
				onEdit={() => setEditDialogOpen(true)}
				onDelete={() => setDeleteDialogOpen(true)}
				onUpdateCover={(file) => handleImageUpdate(file, 'cover')}
				onUpdateAvatar={(file) => handleImageUpdate(file, 'avatar')}
			/>

			<main className="flex-1 p-6 md:p-12 max-w-[1400px] mx-auto w-full space-y-12 relative z-10">

				{/* 📊 Data Grid */}
				<CommunityStats
					memberCount={memberCount}
					discussionCount={community.discussionCount || 0}
					activeConflicts={community.integrations?.gymRoomsActive || 0}
					eventCount={community.upcomingEvents || 0}
				/>

				<Tabs defaultValue="overview" className="w-full">

					<div className="flex justify-start mb-8 border-b border-white/10">
						<TabsList className="bg-transparent p-0 w-full max-w-2xl flex justify-start gap-8" role="tablist" aria-label="Community sections">
							<TabsTrigger
								value="war-room"
								className="rounded-none border-b-2 border-transparent px-2 pb-4 pt-2 text-zinc-500 hover:text-white data-[state=active]:border-teal-500 data-[state=active]:text-teal-500 data-[state=active]:bg-transparent transition-all capitalize font-mono text-sm tracking-wider flex items-center gap-2 focus:ring-2 focus:ring-teal-500/50 focus:ring-offset-2 focus:ring-offset-black"
								aria-label="War Room - live chat"
							>
								<span className="relative flex h-2 w-2" aria-hidden="true">
									<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
									<span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
								</span>
								War Room
							</TabsTrigger>
							{["overview", "discussions", "events", "members"].map(tab => (
								<TabsTrigger
									key={tab}
									value={tab}
									className="rounded-none border-b-2 border-transparent px-2 pb-4 pt-2 text-zinc-500 hover:text-white data-[state=active]:border-teal-500 data-[state=active]:text-teal-500 data-[state=active]:bg-transparent transition-all capitalize font-mono text-sm tracking-wider focus:ring-2 focus:ring-teal-500/50 focus:ring-offset-2 focus:ring-offset-black"
									aria-label={`${tab} section`}
								>
									{tab}
								</TabsTrigger>
							))}
						</TabsList>
					</div>

					<TabsContent value="war-room" className="mt-6 animate-in fade-in-50 duration-500">
						<CommunityChat communityId={id} currentUserId={userId!} isMember={isMember} />
					</TabsContent>

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

			{/* Edit Dialog */}
			<Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
				<DialogContent className="bg-zinc-950 border-white/10 text-white sm:max-w-xl">
					<DialogHeader>
						<DialogTitle>Reconfigure Tribe Parameters</DialogTitle>
						<DialogDescription>Update community frequency settings.</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 pt-4">
						<div className="space-y-2">
							<Label>Name</Label>
							<Input value={editData.name || ''} onChange={e => setEditData({ ...editData, name: e.target.value })} className="bg-zinc-900 border-white/10" />
						</div>
						<div className="space-y-2">
							<Label>Description</Label>
							<Textarea value={editData.desc || ''} onChange={e => setEditData({ ...editData, desc: e.target.value })} className="bg-zinc-900 border-white/10" />
						</div>
						<div className="space-y-2">
							<Label>Category</Label>
							<Input value={editData.category || ''} onChange={e => setEditData({ ...editData, category: e.target.value })} className="bg-zinc-900 border-white/10" />
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setEditDialogOpen(false)} className="border-white/10">Cancel</Button>
						<Button onClick={handleUpdate} disabled={saving} className="bg-teal-600 hover:bg-teal-700">
							{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Configurations"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation Dialog */}
			<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<DialogContent className="bg-zinc-950 border-white/10 text-white">
					<DialogHeader>
						<DialogTitle className="text-red-500">Dissolve Tribe?</DialogTitle>
						<DialogDescription className="text-zinc-400">
							This action is irreversible. All data, discussions, and links associated with this community will be permanently erased.
						</DialogDescription>
					</DialogHeader>
					<div className="flex justify-end gap-2 mt-4">
						<Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="border-white/10">Abort</Button>
						<Button variant="destructive" onClick={handleDelete} disabled={saving}>
							{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Dissolution"}
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			{/* Leave Community Confirmation Dialog */}
			<Dialog open={leaveDialogOpen} onOpenChange={setLeaveDialogOpen}>
				<DialogContent className="bg-zinc-950 border-white/10 text-white">
					<DialogHeader>
						<DialogTitle className="text-yellow-500">Leave Tribe?</DialogTitle>
						<DialogDescription className="text-zinc-400">
							Are you sure you want to disconnect from this community? You can rejoin at any time, but you will lose access to ongoing discussions and events.
						</DialogDescription>
					</DialogHeader>
					<div className="flex justify-end gap-2 mt-4">
						<Button variant="outline" onClick={() => setLeaveDialogOpen(false)} className="border-white/10">Cancel</Button>
						<Button variant="destructive" onClick={performLeave} disabled={joining}>
							{joining ? <Loader2 className="h-4 w-4 animate-spin" /> : "Leave Tribe"}
						</Button>
					</div>
				</DialogContent>
			</Dialog>

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
			</TooltipProvider>
		</div>
	)
}
