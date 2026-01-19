import { Users, MessageCircle, Trophy, CalendarDays } from "lucide-react"

interface CommunityStatsProps {
	memberCount: string | number
	discussionCount: number
	activeConflicts: number
	eventCount: number
}

export function CommunityStats({ memberCount, discussionCount, activeConflicts, eventCount }: CommunityStatsProps) {
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
		<div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-in slide-in-from-bottom-8 duration-1000 delay-100">
			<StatCard icon={Users} label="Operatives" value={memberCount} />
			<StatCard icon={MessageCircle} label="Comms" value={discussionCount} />
			<StatCard icon={Trophy} label="Active Conflicts" value={activeConflicts} />
			<StatCard icon={CalendarDays} label="Events" value={eventCount} />
		</div>
	)
}
