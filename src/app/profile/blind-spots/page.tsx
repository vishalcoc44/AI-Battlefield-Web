"use client"

import { TopNav } from "@/components/layout/TopNav"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Eye, Dumbbell } from "lucide-react"

const data = [
   { subject: 'Confirmation Bias', A: 120, fullMark: 150 },
   { subject: 'Ad Hominem', A: 40, fullMark: 150 },
   { subject: 'Strawman', A: 86, fullMark: 150 },
   { subject: 'Sunk Cost', A: 99, fullMark: 150 },
   { subject: 'Anchoring', A: 65, fullMark: 150 },
   { subject: 'Halo Effect', A: 50, fullMark: 150 },
];

export default function BlindSpotPage() {
   return (
      <div className="dark flex flex-col min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-red-500/30">

         {/* 🌌 Cosmic Background */}
         <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-black via-[#050510] to-[#1a0b2e]" />
            <div className="absolute inset-0 bg-grid-white/[0.04] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />
            <div className="bg-noise opacity-[0.15]" />
            <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-red-600/10 rounded-full blur-[120px] animate-pulse mix-blend-screen" />
         </div>

         <div className="relative z-10 flex flex-col min-h-screen">
            <TopNav />
            <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8">
               <div className="text-center space-y-2">
                  <div className="inline-flex p-3 rounded-full bg-red-100 text-red-600 mb-2">
                     <Eye className="h-8 w-8" />
                  </div>
                  <h1 className="text-3xl font-bold">Blind Spot Detector</h1>
                  <p className="text-muted-foreground">AI analysis of your debate history reveals these cognitive vulnerabilities.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <Card className="h-[400px]">
                     <CardHeader>
                        <CardTitle>Bias Radar</CardTitle>
                        <CardDescription>Higher values indicate higher frequency of detection.</CardDescription>
                     </CardHeader>
                     <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                           <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                              <PolarGrid />
                              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                              <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                              <Radar
                                 name="User"
                                 dataKey="A"
                                 stroke="#ef4444"
                                 fill="#ef4444"
                                 fillOpacity={0.6}
                              />
                           </RadarChart>
                        </ResponsiveContainer>
                     </CardContent>
                  </Card>

                  <div className="space-y-4">
                     <Card className="border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-900/10">
                        <CardContent className="p-4 space-y-2">
                           <div className="flex items-center gap-2 font-bold text-red-700 dark:text-red-400">
                              <AlertTriangle className="h-4 w-4" />
                              Major Alert: Confirmation Bias
                           </div>
                           <p className="text-sm text-slate-700 dark:text-slate-300">
                              You tend to dismiss evidence that contradicts your initial stance on "Tech Regulation" topics.
                           </p>
                           <div className="bg-white dark:bg-slate-900 p-3 rounded border text-xs italic text-muted-foreground">
                              "Recent Instance: You ignored the study cited by Dr. Reason regarding GDPR compliance costs."
                           </div>
                           <Button size="sm" variant="outline" className="w-full border-red-200 text-red-700 hover:bg-red-100 mt-2">
                              <Dumbbell className="h-3 w-3 mr-2" /> Train to Fix This
                           </Button>
                        </CardContent>
                     </Card>

                     <Card>
                        <CardContent className="p-4 space-y-2">
                           <div className="flex items-center gap-2 font-bold text-orange-600">
                              <AlertTriangle className="h-4 w-4" />
                              Watch Out: Sunk Cost Fallacy
                           </div>
                           <p className="text-sm text-muted-foreground">
                              You often double down on losing arguments rather than conceding minor points.
                           </p>
                        </CardContent>
                     </Card>
                  </div>
               </div>
            </main>
         </div>
      </div>
   )
}
