"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  BarChart3,
  TrendingUp,
  Users,
  MessageCircle,
  Calendar,
  Award,
  Activity,
  Target,
  Loader2
} from "lucide-react"
import { dataService, type Community } from "@/lib/data-service"

interface CommunityStatisticsProps {
  communityId?: string
  showHeader?: boolean
}

interface CommunityStats {
  totalMembers: number
  activeMembers: number
  totalDiscussions: number
  totalEvents: number
  avgActivityScore: number
  growthRate: number
  topCategories: Array<{ name: string; count: number }>
  memberGrowth: Array<{ month: string; members: number }>
  activityTrend: Array<{ date: string; discussions: number; events: number }>
}

export function CommunityStatistics({ communityId, showHeader = true }: CommunityStatisticsProps) {
  const [stats, setStats] = useState<CommunityStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true)
      try {
        // Mock statistics - in real app, this would come from API
        const mockStats: CommunityStats = {
          totalMembers: communityId ? 12500 : 45000,
          activeMembers: communityId ? 8900 : 32000,
          totalDiscussions: communityId ? 1247 : 4500,
          totalEvents: communityId ? 23 : 89,
          avgActivityScore: 78,
          growthRate: 12.5,
          topCategories: [
            { name: "Philosophy", count: 450 },
            { name: "Technology", count: 380 },
            { name: "Politics", count: 290 },
            { name: "Ethics", count: 220 },
            { name: "Debate", count: 180 }
          ],
          memberGrowth: [
            { month: "Jan", members: 9500 },
            { month: "Feb", members: 10200 },
            { month: "Mar", members: 10800 },
            { month: "Apr", members: 11500 },
            { month: "May", members: 12200 },
            { month: "Jun", members: 12500 }
          ],
          activityTrend: [
            { date: "Mon", discussions: 45, events: 3 },
            { date: "Tue", discussions: 52, events: 2 },
            { date: "Wed", discussions: 38, events: 4 },
            { date: "Thu", discussions: 61, events: 1 },
            { date: "Fri", discussions: 55, events: 3 },
            { date: "Sat", discussions: 32, events: 5 },
            { date: "Sun", discussions: 28, events: 2 }
          ]
        }

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))
        setStats(mockStats)
      } catch (error) {
        console.error("Failed to load statistics:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [communityId])

  if (loading) {
    return (
      <Card>
        {showHeader && (
          <CardHeader>
            <CardTitle>Community Statistics</CardTitle>
          </CardHeader>
        )}
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (!stats) return null

  return (
    <Card>
      {showHeader && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Community Statistics
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <Users className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold">{stats.totalMembers.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Total Members</div>
          </div>

          <div className="text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <Activity className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold">{stats.activeMembers.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Active Members</div>
          </div>

          <div className="text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <MessageCircle className="h-6 w-6 mx-auto mb-2 text-cyan-600" />
            <div className="text-2xl font-bold">{stats.totalDiscussions.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Discussions</div>
          </div>

          <div className="text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <Calendar className="h-6 w-6 mx-auto mb-2 text-orange-600" />
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
            <div className="text-xs text-muted-foreground">Events</div>
          </div>
        </div>

        {/* Activity Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Community Activity Score</span>
            <span className="text-sm text-muted-foreground">{stats.avgActivityScore}%</span>
          </div>
          <Progress value={stats.avgActivityScore} className="h-2" />
        </div>

        {/* Growth Rate */}
        <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <TrendingUp className="h-5 w-5 text-green-600" />
          <div>
            <div className="font-medium text-green-800 dark:text-green-200">
              +{stats.growthRate}% Growth
            </div>
            <div className="text-xs text-green-600 dark:text-green-400">
              Member growth over last month
            </div>
          </div>
        </div>

        {/* Top Categories */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Target className="h-4 w-4" />
            Top Categories
          </h4>
          <div className="space-y-2">
            {stats.topCategories.map((category, index) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                    #{index + 1}
                  </span>
                  <span className="text-sm">{category.name}</span>
                </div>
                <span className="text-sm font-medium">{category.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Trend (Simple visualization) */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Weekly Activity Trend
          </h4>
          <div className="grid grid-cols-7 gap-2">
            {stats.activityTrend.map((day) => (
              <div key={day.date} className="text-center">
                <div className="text-xs text-muted-foreground mb-1">{day.date}</div>
                <div className="space-y-1">
                  <div
                    className="bg-blue-500 rounded text-xs text-white text-center min-h-[20px] flex items-end justify-center"
                    style={{ height: `${Math.max(20, day.discussions * 2)}px` }}
                  >
                    {day.discussions}
                  </div>
                  <div className="text-xs text-muted-foreground">discussions</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}