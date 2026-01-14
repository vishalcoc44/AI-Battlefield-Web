"use client"

import * as React from "react"
import { 
  LayoutDashboard, 
  BookOpen, 
  CheckCircle, 
  FileText, 
  Grid, 
  Bell, 
  MessageSquare, 
  Settings, 
  LogOut, 
  ChevronDown, 
  Moon, 
  User,
  Zap
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

interface NavItemProps {
  icon: React.ReactNode
  label: string
  isActive?: boolean
  hasSubmenu?: boolean
  isOpen?: boolean
  children?: React.ReactNode
  badge?: string
}

function NavItem({ icon, label, isActive, hasSubmenu, isOpen, children, badge }: NavItemProps) {
  return (
    <div className="mb-1">
      <Button 
        variant={isActive ? "secondary" : "ghost"} 
        className={cn("w-full justify-start font-medium", isActive && "bg-secondary text-primary")}
      >
        <span className="mr-3 text-muted-foreground group-hover:text-primary">{icon}</span>
        <span className="flex-1 text-left">{label}</span>
        {badge && (
           <Badge variant="destructive" className="ml-auto h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
             {badge}
           </Badge>
        )}
        {hasSubmenu && (
          <ChevronDown className={cn("ml-auto h-4 w-4 transition-transform", !isOpen && "-rotate-90")} />
        )}
      </Button>
      {isOpen && children && (
        <div className="ml-9 mt-1 space-y-1 border-l pl-3">
          {children}
        </div>
      )}
    </div>
  )
}

function SubNavItem({ label, isActive }: { label: string, isActive?: boolean }) {
  return (
    <Button 
      variant="ghost" 
      size="sm"
      className={cn("w-full justify-start h-8 text-sm", isActive ? "text-primary font-medium" : "text-muted-foreground")}
    >
      {label}
    </Button>
  )
}

export function Sidebar() {
  return (
    <div className="w-64 border-r bg-card flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-2">
        <div className="h-8 w-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
          //
        </div>
        <span className="font-bold text-xl tracking-tight">Knowvio</span>
        <div className="ml-auto border rounded p-1">
            <span className="sr-only">Collapse</span>
            {/* Using a placeholder for collapse icon */}
            <div className="h-4 w-4 bg-gray-200 rounded-sm" />
        </div>
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-6">
          <nav>
            <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" isActive />
            <NavItem icon={<BookOpen size={20} />} label="Courses" hasSubmenu />
            <NavItem icon={<CheckCircle size={20} />} label="Categories" />
            <NavItem icon={<FileText size={20} />} label="Assignments" hasSubmenu isOpen>
               <SubNavItem label="Pending" isActive />
               <SubNavItem label="Submitted" />
               <SubNavItem label="Feedback" />
            </NavItem>
            <NavItem icon={<FileText size={20} />} label="Exams" />
            <NavItem icon={<Grid size={20} />} label="Resources" />
            <NavItem icon={<Bell size={20} />} label="Notifications" badge="9+" />
            <NavItem icon={<MessageSquare size={20} />} label="Discussion" />
          </nav>
        </div>
      </ScrollArea>

      <div className="p-4 space-y-4">
        <Card className="bg-slate-900 text-white border-none shadow-lg">
           <CardContent className="p-4 space-y-3">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold text-sm">
                   <Zap className="h-4 w-4 fill-orange-500 text-orange-500" />
                   Upgrade to <span className="text-orange-400 font-bold">Pro</span>
                </div>
             </div>
             <div className="space-y-1">
               <div className="flex justify-between text-xs text-slate-400">
                  <span>5 days left!</span>
               </div>
               <Progress value={70} className="h-1 bg-slate-700 [&>div]:bg-orange-500" />
             </div>
             <p className="text-[10px] text-slate-400 leading-tight">
               Don't lose access to your courses, upgrade before your trial ends.
             </p>
             <Button size="sm" className="w-full bg-white text-black hover:bg-slate-200 h-8 text-xs font-semibold">
               Upgrade Now
             </Button>
           </CardContent>
        </Card>

        <div className="flex items-center justify-between px-2">
           <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
             <Moon size={18} />
             <span>Dark Mode</span>
           </div>
           <Switch />
        </div>
        
        <div className="space-y-1">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground">
             <Settings className="mr-2 h-4 w-4" /> Settings
          </Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground">
             <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>

        <div className="flex items-center gap-3 pt-2 border-t">
           <Avatar className="h-9 w-9 border">
              <AvatarImage src="/avatars/01.png" alt="Alex" />
              <AvatarFallback>AJ</AvatarFallback>
           </Avatar>
           <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">Alex Johnson</p>
           </div>
           <Button variant="ghost" size="icon" className="h-8 w-8">
              <span className="sr-only">Menu</span>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4"><path d="M3.625 7.5C3.625 8.05228 3.17728 8.5 2.625 8.5C2.07272 8.5 1.625 8.05228 1.625 7.5C1.625 6.94772 2.07272 6.5 2.625 6.5C3.17728 6.5 3.625 6.94772 3.625 7.5ZM8.125 7.5C8.125 8.05228 7.67728 8.5 7.125 8.5C6.57272 8.5 6.125 8.05228 6.125 7.5C6.125 6.94772 6.57272 6.5 7.125 6.5C7.67728 6.5 8.125 6.94772 8.125 7.5ZM12.625 7.5C12.625 8.05228 12.1773 8.5 11.625 8.5C11.0727 8.5 10.625 8.05228 10.625 7.5C10.625 6.94772 11.0727 6.5 11.625 6.5C12.1773 6.5 12.625 6.94772 12.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
           </Button>
        </div>
      </div>
    </div>
  )
}
