"use client"

import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Zap, Send } from "lucide-react"

export function ArgumentStrengthMeter() {
  return (
    <Card className="border-l-4 border-l-orange-500">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Zap className="h-5 w-5 text-orange-500 fill-orange-500" />
          Argument Strength
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <div className="flex justify-between text-sm font-medium">
             <span>Current Power Level</span>
             <span className="text-orange-600">High (78/100)</span>
          </div>
          <Progress value={78} className="h-2 [&>div]:bg-linear-to-r [&>div]:from-orange-400 [&>div]:to-red-600" />
          <p className="text-xs text-muted-foreground pt-1">
             Your logic consistency has improved by 12% this week.
          </p>
        </div>

        <div className="bg-muted/30 p-4 rounded-lg space-y-3">
           <label className="text-sm font-medium text-muted-foreground block">
              Quick Practice: "Refute this claim..."
           </label>
           <p className="text-sm italic border-l-2 border-slate-300 pl-3 py-1">
              "AI will never be truly creative because it only remixes existing data."
           </p>
           <div className="relative">
              <Textarea 
                placeholder="Type your counter-argument..." 
                className="min-h-[80px] resize-none pr-12 bg-background" 
              />
              <Button size="icon" className="absolute bottom-2 right-2 h-8 w-8 rounded-full">
                 <Send className="h-4 w-4" />
              </Button>
           </div>
        </div>
      </CardContent>
    </Card>
  )
}
