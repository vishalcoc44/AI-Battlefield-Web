import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, BookOpen, CheckCircle, BarChart3, Flame } from "lucide-react"

export function StatCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
               <BookOpen className="h-4 w-4" /> Courses Enrolled
               <span className="text-[10px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded-full">+12%</span>
            </span>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold">05</div>
            <div className="h-8 w-16 bg-orange-100 rounded flex items-end gap-1 px-1 pb-1">
               <div className="w-2 h-3 bg-orange-400 rounded-sm"></div>
               <div className="w-2 h-5 bg-orange-400 rounded-sm"></div>
               <div className="w-2 h-4 bg-orange-400 rounded-sm"></div>
               <div className="w-2 h-6 bg-orange-400 rounded-sm"></div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
               <CheckCircle className="h-4 w-4" /> Lessons Completed
               <span className="text-[10px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded-full">+5%</span>
            </span>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold">42</div>
            <svg className="h-8 w-20 text-orange-400" viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="3">
               <path d="M0 35 C 20 35, 40 10, 60 25 S 100 5, 100 5" />
            </svg>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
               <BarChart3 className="h-4 w-4" /> Average Score
               <span className="text-[10px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded-full">+10%</span>
            </span>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold">88%</div>
            {/* Mock chart showing a dip then recovery? */}
            <svg className="h-8 w-20 text-orange-400" viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="3">
               <path d="M0 10 C 20 10, 30 35, 50 35 S 80 20, 100 30" strokeDasharray="60 40" /> 
               {/* Simplified path */}
               <path d="M0 5 Q 50 40 100 20" />
            </svg>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
               <Flame className="h-4 w-4" /> Learning Streak
               <span className="text-[10px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded-full">+6%</span>
            </span>
          </div>
          <div className="flex items-end justify-between">
             <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">07</span>
                <span className="text-sm font-medium text-muted-foreground">Days</span>
             </div>
             <div className="flex gap-1">
                <div className="h-6 w-6 rounded-full border-2 border-orange-400 flex items-center justify-center">
                   <div className="h-2 w-2 bg-orange-400 rounded-full" />
                </div>
                <div className="h-6 w-6 rounded-full border-2 border-orange-400 flex items-center justify-center">
                   <div className="h-2 w-2 bg-orange-400 rounded-full" />
                </div>
                <div className="h-6 w-6 rounded-full border-2 border-orange-400 flex items-center justify-center">
                   <div className="h-2 w-2 bg-orange-400 rounded-full" />
                </div>
                <div className="h-6 w-6 rounded-full border-2 border-muted flex items-center justify-center">
                   
                </div>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
