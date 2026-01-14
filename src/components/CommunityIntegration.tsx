"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Link,
  MessageSquare,
  Users,
  Zap,
  ArrowRight,
  ExternalLink,
  Plus,
  Calendar,
  Loader2
} from "lucide-react"
import { dataService, type Community } from "@/lib/data-service"

interface CommunityIntegrationProps {
  community: Community
  showHeader?: boolean
}

export function CommunityIntegration({ community, showHeader = true }: CommunityIntegrationProps) {
  if (!community) return null

  const integrations = community.integrations || {
    debatesHosted: 0,
    gymRoomsActive: 0,
    crossCommunityEvents: 0
  }

  const linkedDebates = community.linkedDebates || []
  const communityGymRooms = community.communityGymRooms || []

  return (
    <Card>
      {showHeader && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Community Integration
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="space-y-6">
        {/* Integration Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <MessageSquare className="h-5 w-5 mx-auto mb-1 text-blue-600" />
            <div className="text-lg font-bold text-blue-700 dark:text-blue-300">
              {integrations.debatesHosted}
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400">Debates Hosted</div>
          </div>

          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <Users className="h-5 w-5 mx-auto mb-1 text-green-600" />
            <div className="text-lg font-bold text-green-700 dark:text-green-300">
              {integrations.gymRoomsActive}
            </div>
            <div className="text-xs text-green-600 dark:text-green-400">Active Gym Rooms</div>
          </div>

          <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <Calendar className="h-5 w-5 mx-auto mb-1 text-purple-600" />
            <div className="text-lg font-bold text-purple-700 dark:text-purple-300">
              {integrations.crossCommunityEvents}
            </div>
            <div className="text-xs text-purple-600 dark:text-purple-400">Cross-Community Events</div>
          </div>
        </div>

        {/* Linked Debates */}
        {linkedDebates.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Community Debates
              </h4>
              <Button size="sm" variant="outline" className="gap-1">
                <Plus className="h-3 w-3" />
                Host Debate
              </Button>
            </div>

            <div className="space-y-2">
              {linkedDebates.map((debateId, index) => (
                <div key={debateId} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                      <MessageSquare className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">Debate Session #{index + 1}</div>
                      <div className="text-sm text-muted-foreground">Hosted by {community.name}</div>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="gap-1">
                    <ExternalLink className="h-3 w-3" />
                    Join
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Community Gym Rooms */}
        {communityGymRooms.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Community Gym Rooms
              </h4>
              <Button size="sm" variant="outline" className="gap-1">
                <Plus className="h-3 w-3" />
                Create Room
              </Button>
            </div>

            <div className="space-y-2">
              {communityGymRooms.map((roomId, index) => (
                <div key={roomId} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">Gym Room #{index + 1}</div>
                      <div className="text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          {Math.floor(Math.random() * 50) + 10} participants active
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="gap-1">
                    <ArrowRight className="h-3 w-3" />
                    Enter
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Integration Actions */}
        <div className="space-y-3 pt-4 border-t">
          <h4 className="font-medium">Integration Actions</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button variant="outline" className="justify-start gap-2">
              <MessageSquare className="h-4 w-4" />
              Schedule Community Debate
            </Button>
            <Button variant="outline" className="justify-start gap-2">
              <Users className="h-4 w-4" />
              Create Gym Room
            </Button>
            <Button variant="outline" className="justify-start gap-2">
              <Calendar className="h-4 w-4" />
              Plan Cross-Community Event
            </Button>
            <Button variant="outline" className="justify-start gap-2">
              <Link className="h-4 w-4" />
              Link External Resources
            </Button>
          </div>
        </div>

        {/* Integration Benefits */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Zap className="h-4 w-4 text-blue-600" />
            Integration Benefits
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Connect community discussions with structured debates</li>
            <li>• Host real-time collaborative thinking sessions</li>
            <li>• Build cross-community relationships and events</li>
            <li>• Enhance member engagement through integrated activities</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}