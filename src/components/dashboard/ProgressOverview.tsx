"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"

const data = [
  { day: "1", score: 30 },
  { day: "5", score: 45 },
  { day: "10", score: 35 },
  { day: "15", score: 75 },
  { day: "20", score: 55 },
  { day: "25", score: 65 },
  { day: "30", score: 90 },
]

export function ProgressOverview() {
  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold">Progress Overview</CardTitle>
          <p className="text-sm text-muted-foreground">Your learning activity and completion trends.</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="python">
            <SelectTrigger className="h-8 w-[130px] text-xs">
              <SelectValue placeholder="Select Course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="python">Intro to Python</SelectItem>
              <SelectItem value="react">React Basics</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="oct">
            <SelectTrigger className="h-8 w-[100px] text-xs">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="oct">October</SelectItem>
              <SelectItem value="nov">November</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F97316" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis 
                dataKey="day" 
                tickLine={false} 
                axisLine={false} 
                tick={{ fontSize: 12, fill: '#64748B' }} 
                dy={10}
              />
              <YAxis 
                tickLine={false} 
                axisLine={false} 
                tick={{ fontSize: 12, fill: '#64748B' }} 
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 rounded-lg shadow-xl border border-border">
                        <p className="text-xs font-semibold mb-1">Oct 15, 2025 <span className="text-green-500 ml-1">+5%</span></p>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden w-24">
                             <div className="h-full bg-orange-500 w-[75%]"></div>
                          </div>
                          <span className="text-xs font-bold">{payload[0].value}%</span>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke="#F97316" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorScore)" 
                activeDot={{ r: 6, strokeWidth: 0, fill: "#F97316" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
