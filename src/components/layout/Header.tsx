"use client"

import { Search, MessageSquare, Bell, MoreHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <div className="h-auto py-6 flex flex-col md:flex-row items-start md:items-center justify-between px-8 bg-transparent max-w-7xl mx-auto w-full gap-4">
      <div className="space-y-1">
         <h1 className="text-xl font-bold">Welcome Back Alex!</h1>
         <p className="text-sm text-muted-foreground">You've completed 3 lessons today — keep it up!</p>
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="relative w-full md:w-96">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
           <Input 
             placeholder="Search for Courses, Resources etc.." 
             className="pl-9 bg-background border-none shadow-sm ring-1 ring-border focus-visible:ring-primary"
           />
        </div>
        
        {/* Removed duplicate notification icons since they are in TopNav now, 
            but kept the search bar here as it fits the "Page Context" better 
            than cramped in the nav. Or I can remove this block if desired.
            Let's keep the Search here as a large prominent search.
        */}
      </div>
    </div>
  )
}
