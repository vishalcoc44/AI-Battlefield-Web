import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, BrainCircuit, Swords, Database, Code, ChevronRight } from "lucide-react"

export function QuickReview() {
  return (
    <Card>
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-base font-semibold">Quick Review</CardTitle>
        <p className="text-xs text-muted-foreground">Sharpen your knowledge in 2 minutes!</p>
      </CardHeader>
      <CardContent className="space-y-4">
         <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
             <Input 
                placeholder="Choose a topic to review..." 
                className="pl-9 h-9 text-xs bg-muted/30"
             />
         </div>
         <p className="text-[10px] text-muted-foreground">Recent: Data Visualization in Python</p>
         
         <div className="flex justify-between gap-2">
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-full border-orange-200 bg-orange-50 text-orange-600 hover:bg-orange-100 hover:text-orange-700">
                <BrainCircuit className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-full border-sky-200 bg-sky-50 text-sky-600 hover:bg-sky-100 hover:text-sky-700">
                <Swords className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-full border-pink-200 bg-pink-50 text-pink-600 hover:bg-pink-100 hover:text-pink-700">
                <Database className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-full border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700">
                <Code className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                <ChevronRight className="h-4 w-4" />
            </Button>
         </div>

         <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1 h-9 text-xs">Practice</Button>
            <Button className="flex-1 h-9 text-xs bg-slate-900 text-white hover:bg-slate-800">
               Start Quiz <ChevronRight className="ml-1 h-3 w-3" />
            </Button>
         </div>
      </CardContent>
    </Card>
  )
}
