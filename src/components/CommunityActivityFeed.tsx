"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  MessageCircle,
  Heart,
  Calendar,
  Users,
  TrendingUp,
  RefreshCw,
  Loader2
} from "lucide-react"
import { dataService, type CommunityActivityFeedItem } from "@/lib/data-service"

interface CommunityActivityFeedProps {
  limit?: number
  showHeader?: boolean
  communityId?: string
}

export function CommunityActivityFeed({ limit = 10, showHeader = true, communityId }: CommunityActivityFeedProps) {
  const [activities, setActivities] = useState<CommunityActivityFeedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadActivities = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true)
    else setLoading(true)

    try {
      if (!communityId) return // Or handle global feed
      const data = await dataService.getCommunityActivityFeed(communityId, limit)
      setActivities(data)
    } catch (error) {
      console.error("Failed to load activities:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadActivities()
  }, [limit, communityId])

  const getActivityIcon = (type: CommunityActivityFeedItem['type']) => {
    switch (type) {
      case 'posted': return <MessageCircle className="h-4 w-4" />
      case 'replied': return <MessageCircle className="h-4 w-4" />
      case 'created_event': return <Calendar className="h-4 w-4" />
      case 'joined': return <Users className="h-4 w-4" />
      default: return <MessageCircle className="h-4 w-4" />
    }
  }

  const getActivityColor = (type: CommunityActivityFeedItem['type']) => {
    switch (type) {
      case 'posted': return 'text-blue-600'
      case 'replied': return 'text-blue-600'
      case 'created_event': return 'text-green-600'
      case 'joined': return 'text-teal-600'
      default: return 'text-gray-600'
    }
  }

  if (loading) {
    return (
      <Card>
        {showHeader && (
          <CardHeader>
            <CardTitle>Community Activity</CardTitle>
          </CardHeader>
        )}
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      {showHeader && (
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg">Community Activity</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => loadActivities(true)}
            disabled={refreshing}
            className="gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarFallback className="text-xs">
                {activity.user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-medium ${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </span>
                    <span className="font-medium text-sm">{activity.user.name}</span>
                    <span className="text-xs text-muted-foreground">in</span>
                    <Badge variant="outline" className="text-xs">
                      {activity.communityName}
                    </Badge>
                  </div>

                  <h4 className="font-medium text-sm mb-1 leading-tight">
                    {activity.title}
                  </h4>

                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {activity.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{activity.timestamp}</span>
                    {activity.likes && (
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {activity.likes}
                      </div>
                    )}
                    {activity.comments && (
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {activity.comments}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {activities.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No recent activity</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}