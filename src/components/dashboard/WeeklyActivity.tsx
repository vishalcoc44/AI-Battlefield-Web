"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts"

const data = [
  { name: 'Courses Viewed', value: 45, color: '#F97316' }, // Orange
  { name: 'Assignments Done', value: 25, color: '#3B82F6' }, // Blue
  { name: 'Discussions Joined', value: 20, color: '#EC4899' }, // Pink
  { name: 'Live Sessions', value: 10, color: '#6366F1' }, // Indigo
]

export function WeeklyActivity() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
           <span className="relative flex h-3 w-3">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
             <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
           </span>
           Weekly Activity Split
        </CardTitle>
        <div className="flex gap-1">
           <Button variant="outline" size="icon" className="h-8 w-8">
              <Search className="h-4 w-4" />
           </Button>
           <Button variant="outline" size="icon" className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
           </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={0}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) - 10}
                            className="fill-muted-foreground text-xs"
                          >
                            Total Hrs
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 15}
                            className="fill-foreground text-3xl font-bold"
                          >
                            42
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-4">
           {data.map((item) => (
             <div key={item.name} className="flex items-center gap-2 text-[10px] whitespace-nowrap">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-muted-foreground">{item.name}:</span>
                <span className="font-semibold">{item.value}%</span>
             </div>
           ))}
        </div>
      </CardContent>
    </Card>
  )
}
