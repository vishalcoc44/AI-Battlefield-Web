"use client"

import * as React from "react"
import {
  Home,
  Users,
  Swords,
  Trophy,
  User,
  Menu,
  Zap,
  BrainCircuit,
  Ghost,
  Globe,
  GraduationCap,
  Database,
  LogOut,
  Settings,
  CreditCard
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useUser } from "@/hooks/use-user"

interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
}

function NavItem({ href, icon, label }: NavItemProps) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Link href={href}>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-9 gap-2 px-4 rounded-full transition-all duration-300 relative overflow-hidden group",
          isActive
            ? "bg-white/10 text-white font-bold shadow-[0_0_15px_-3px_rgba(255,255,255,0.3)] border border-white/20"
            : "text-zinc-400 hover:bg-white/5 hover:text-white"
        )}
      >
        {isActive && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />}
        <span className={cn("relative z-10", isActive ? "text-white" : "text-zinc-400 group-hover:text-white")}>{icon}</span>
        <span className="relative z-10">{label}</span>
      </Button>
    </Link>
  )
}

export function TopNav() {
  const { user, profile, signOut } = useUser()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/auth')
  }

  // Fallback initials
  const initials = profile?.username?.substring(0, 2).toUpperCase() || user?.email?.substring(0, 2).toUpperCase() || "U"

  return (
    <div className="sticky top-0 z-50 flex flex-col backdrop-blur-2xl bg-[#09090b]/80 border-b border-white/[0.08] supports-[backdrop-filter]:bg-[#09090b]/80 shadow-[0_4px_30px_-10px_rgba(0,0,0,0.5)]">
      {/* Top Row: Brand & Actions */}
      <div className="px-4 md:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden -ml-2 text-zinc-400 hover:text-white">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-4 w-72 glass-card border-r-white/10 bg-black/90">
              <div className="flex flex-col gap-2 mt-8">
                <NavItem href="/dashboard" icon={<Home size={18} />} label="Home" />
                <NavItem href="/communities" icon={<Users size={18} />} label="Communities" />
                <NavItem href="/academy" icon={<GraduationCap size={18} />} label="Academy" />
                <NavItem href="/war-room" icon={<Globe size={18} />} label="War Room" />
                <NavItem href="/intel" icon={<Database size={18} />} label="Intel Ops" />
                <NavItem href="/gym" icon={<Swords size={18} />} label="Debate Gym" />
                <NavItem href="/prediction" icon={<Trophy size={18} />} label="Prediction Lab" />
                <NavItem href="/dojo" icon={<BrainCircuit size={18} />} label="Zen Dojo" />
                <NavItem href="/void" icon={<Ghost size={18} />} label="The Void" />
                <NavItem href="/profile/beliefs" icon={<BrainCircuit size={18} />} label="Beliefs" />
                <NavItem href="/profile" icon={<User size={18} />} label="Profile" />
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="relative h-9 w-9 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl blur opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-full w-full bg-black/50 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-white/30 transition-colors">
                <span className="text-white font-black text-xs">AI</span>
              </div>
            </div>
            <span className="font-black text-lg tracking-tight hidden md:inline-block text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500Group">Battlefield</span>
          </Link>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">


          <div className="hidden sm:flex items-center gap-3 bg-white/5 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/5 shadow-inner">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Lvl 12</span>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <Zap className="h-3 w-3 text-yellow-500 fill-yellow-500 animate-pulse" />
              <span className="text-xs font-bold tabular-nums text-white">2,450 XP</span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-transparent p-0 ring-2 ring-transparent hover:ring-white/10 transition-all">
                <Avatar className="h-9 w-9 border border-white/10 shadow-[0_0_15px_-5px_rgba(255,255,255,0.3)]">
                  <AvatarImage src={profile?.avatar_url || "/avatars/01.png"} alt={profile?.username || "User"} />
                  <AvatarFallback className="bg-zinc-900 text-white font-bold">{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-72 mt-2 bg-black/80 backdrop-blur-xl border border-white/10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] rounded-xl p-2 relative overflow-hidden"
              align="end"
              forceMount
            >
              {/* Glossy Overlay */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/5 to-transparent h-24" />

              <DropdownMenuLabel className="font-normal p-3 relative z-10">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-white/10">
                    <AvatarImage src={profile?.avatar_url || "/avatars/01.png"} alt={profile?.username || "User"} />
                    <AvatarFallback className="bg-zinc-800 text-white font-bold text-xs">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1 overflow-hidden">
                    <p className="text-sm font-bold leading-none text-white truncate">
                      {profile?.username || "Agnet"}
                    </p>
                    <p className="text-xs leading-none text-zinc-500 truncate">
                      {user?.email || "signing in..."}
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>

              <div className="px-2 py-1.5 bg-white/5 rounded-lg mb-2 relative z-10 border border-white/5 mx-1">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-zinc-400">Level 12</span>
                  <span className="text-white font-bold">2,450 XP</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 w-[65%]" />
                </div>
              </div>

              <DropdownMenuSeparator className="bg-white/10" />

              <div className="p-1 space-y-1 relative z-10">
                <DropdownMenuItem asChild className="group hover:bg-white/10 focus:bg-white/10 rounded-lg cursor-pointer text-zinc-400 focus:text-white transition-colors">
                  <Link href="/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4 group-hover:text-sky-400 transition-colors" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="group hover:bg-white/10 focus:bg-white/10 rounded-lg cursor-pointer text-zinc-400 focus:text-white transition-colors">
                  <Link href="/profile/beliefs" className="flex items-center gap-2">
                    <BrainCircuit className="h-4 w-4 group-hover:text-purple-400 transition-colors" />
                    <span>Belief Tracker</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="group hover:bg-white/10 focus:bg-white/10 rounded-lg cursor-pointer text-zinc-400 focus:text-white transition-colors">
                  <CreditCard className="h-4 w-4 mr-2 group-hover:text-yellow-400 transition-colors" />
                  <span>Subscription</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="group hover:bg-white/10 focus:bg-white/10 rounded-lg cursor-pointer text-zinc-400 focus:text-white transition-colors">
                  <Settings className="h-4 w-4 mr-2 group-hover:text-gray-200 transition-colors" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </div>

              <DropdownMenuSeparator className="bg-white/10" />

              <DropdownMenuItem
                onClick={handleSignOut}
                className="group hover:bg-red-500/10 focus:bg-red-500/10 text-red-500/80 focus:text-red-400 rounded-lg cursor-pointer m-1"
              >
                <LogOut className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Bottom Row: Navigation Links */}
      <div className="border-t border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="px-4 md:px-6 h-12 flex items-center overflow-x-auto no-scrollbar mask-gradient-x">
          <nav className="flex items-center gap-1 min-w-max mx-auto md:mx-0">
            <NavItem href="/dashboard" icon={<Home size={14} />} label="Home" />
            <NavItem href="/communities" icon={<Users size={14} />} label="Communities" />
            <NavItem href="/academy" icon={<GraduationCap size={14} />} label="Academy" />
            <NavItem href="/war-room" icon={<Globe size={14} />} label="War Room" />
            <NavItem href="/intel" icon={<Database size={14} />} label="Intel Ops" />
            <NavItem href="/gym" icon={<Swords size={14} />} label="Debate Gym" />
            <NavItem href="/prediction" icon={<Trophy size={14} />} label="Prediction Lab" />
            <NavItem href="/dojo" icon={<BrainCircuit size={14} />} label="Zen Dojo" />
            <NavItem href="/void" icon={<Ghost size={14} />} label="The Void" />
            <NavItem href="/profile/beliefs" icon={<BrainCircuit size={14} />} label="Beliefs" />
          </nav>
        </div>
      </div>
    </div>
  )
}
