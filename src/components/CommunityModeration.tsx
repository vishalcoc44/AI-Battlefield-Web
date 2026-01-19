"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Shield,
  Users,
  MessageSquare,
  Flag,
  Ban,
  Settings,
  UserX,
  AlertTriangle,
  CheckCircle,
  X,
  Loader2
} from "lucide-react"
import { dataService } from "@/lib/data-service"
import { sanitizeText } from "@/lib/utils"

interface ModerationItem {
  id: string
  type: 'post' | 'comment' | 'member' | 'report'
  title: string
  content: string
  author: string
  reportedBy?: string
  reason?: string
  status: 'pending' | 'resolved' | 'dismissed'
  createdAt: string
}

interface CommunityModerationProps {
  communityId: string
  showHeader?: boolean
}

export function CommunityModeration({ communityId, showHeader = true }: CommunityModerationProps) {
  const [moderationItems, setModerationItems] = useState<ModerationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState("reports")
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    const loadModerationItems = async () => {
      setLoading(true)
      try {
        // Mock moderation items - in real app, this would come from API
        const mockItems: ModerationItem[] = [
          {
            id: "mod1",
            type: "report",
            title: "Inappropriate content in discussion",
            content: "User posted content that violates community guidelines about respectful discourse.",
            author: "john_doe",
            reportedBy: "moderator_alice",
            reason: "Harassment and personal attacks",
            status: "pending",
            createdAt: "2024-01-14T08:30:00Z"
          },
          {
            id: "mod2",
            type: "member",
            title: "Suspicious account activity",
            content: "New member has been posting spam content across multiple discussions.",
            author: "spammer123",
            reportedBy: "system",
            reason: "Spam and abuse",
            status: "pending",
            createdAt: "2024-01-13T15:45:00Z"
          },
          {
            id: "mod3",
            type: "post",
            title: "Off-topic discussion thread",
            content: "Thread about video games in a philosophy community needs review.",
            author: "gamer_fan",
            reportedBy: "community_member",
            reason: "Off-topic content",
            status: "pending",
            createdAt: "2024-01-12T11:20:00Z"
          }
        ]

        await new Promise(resolve => setTimeout(resolve, 500))
        setModerationItems(mockItems)
      } catch (error) {
        console.error("Failed to load moderation items:", error)
      } finally {
        setLoading(false)
      }
    }

    loadModerationItems()
  }, [communityId])

  const handleModerationAction = async (itemId: string, action: 'approve' | 'reject' | 'ban' | 'warn') => {
    setActionLoading(itemId)
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setModerationItems(prev =>
        prev.map(item =>
          item.id === itemId
            ? { ...item, status: action === 'approve' ? 'resolved' : 'dismissed' as const }
            : item
        )
      )
    } catch (error) {
      console.error("Moderation action failed:", error)
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusColor = (status: ModerationItem['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'dismissed': return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: ModerationItem['type']) => {
    switch (type) {
      case 'report': return <Flag className="h-4 w-4" />
      case 'member': return <Users className="h-4 w-4" />
      case 'post': return <MessageSquare className="h-4 w-4" />
      case 'comment': return <MessageSquare className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <Card>
        {showHeader && (
          <CardHeader>
            <CardTitle>Community Moderation</CardTitle>
          </CardHeader>
        )}
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  const pendingItems = moderationItems.filter(item => item.status === 'pending')

  return (
    <Card>
      {showHeader && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Community Moderation
          </CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reports" className="relative">
              Reports
              {pendingItems.length > 0 && (
                <Badge className="ml-2 bg-red-500 text-white text-xs">
                  {pendingItems.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-4 mt-4">
            {pendingItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No pending moderation items</p>
                <p className="text-sm">All reports have been reviewed</p>
              </div>
            ) : (
              pendingItems.map((item) => (
                <Card key={item.id} className="border-l-4 border-l-yellow-500">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getTypeIcon(item.type)}
                          <h4 className="font-medium">{item.title}</h4>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground mb-2">
                          {sanitizeText(item.content)}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                          <span>By: {item.author}</span>
                          {item.reportedBy && <span>Reported by: {item.reportedBy}</span>}
                          {item.reason && <span>Reason: {item.reason}</span>}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleModerationAction(item.id, 'approve')}
                          disabled={actionLoading === item.id}
                          className="gap-1"
                        >
                          {actionLoading === item.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <CheckCircle className="h-3 w-3" />
                          )}
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleModerationAction(item.id, 'reject')}
                          disabled={actionLoading === item.id}
                          className="gap-1"
                        >
                          {actionLoading === item.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <X className="h-3 w-3" />
                          )}
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleModerationAction(item.id, 'ban')}
                          disabled={actionLoading === item.id}
                          className="gap-1"
                        >
                          {actionLoading === item.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Ban className="h-3 w-3" />
                          )}
                          Ban
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="members" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="text-center">
                    <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold">1,247</div>
                    <div className="text-sm text-muted-foreground">Total Members</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="text-center">
                    <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                    <div className="text-2xl font-bold">3</div>
                    <div className="text-sm text-muted-foreground">Under Review</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Member Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input placeholder="Search members..." className="flex-1" />
                  <Button variant="outline">Search</Button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">john_doe</div>
                        <div className="text-sm text-muted-foreground">Active 2 hours ago</div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="gap-1">
                      <UserX className="h-3 w-3" />
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Community Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Auto-moderation Rules</label>
                  <Textarea
                    placeholder="Enter rules for automatic content moderation..."
                    rows={4}
                    defaultValue="Block spam content, prevent harassment, moderate political extremism"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Content Warnings</div>
                    <div className="text-sm text-muted-foreground">Show content warnings for sensitive topics</div>
                  </div>
                  <Button variant="outline" size="sm">Enable</Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Member Verification</div>
                    <div className="text-sm text-muted-foreground">Require email verification for new members</div>
                  </div>
                  <Button variant="outline" size="sm">Enable</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}