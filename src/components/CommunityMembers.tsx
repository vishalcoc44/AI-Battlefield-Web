"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Users,
  Crown,
  Shield,
  User,
  MessageCircle,
  TrendingUp,
  Calendar,
  Award,
  Loader2
} from "lucide-react"
import { dataService, type CommunityMember } from "@/lib/data-service"
import { sanitizeText } from "@/lib/utils"
import { COMMUNITY_CONSTANTS } from "@/lib/constants/communities"

interface CommunityMembersProps {
  communityId: string
  limit?: number
  showHeader?: boolean
}

export function CommunityMembers({
  communityId,
  limit = COMMUNITY_CONSTANTS.MEMBERS_LIMIT,
  showHeader = true
}: CommunityMembersProps) {
  const [members, setMembers] = useState<CommunityMember[]>([])
  const [loading, setLoading] = useState(true)

  const loadMembers = async () => {
    setLoading(true)
    try {
      const data = await dataService.getCommunityMembers(communityId, limit)
      setMembers(data)
    } catch (error) {
      console.error("Failed to load community members:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMembers()
  }, [communityId, limit])

  const getRoleIcon = (role: CommunityMember['role']) => {
    switch (role) {
      case 'founder': return <Crown className="h-4 w-4 text-yellow-600" />
      case 'admin': return <Shield className="h-4 w-4 text-red-600" />
      case 'moderator': return <Shield className="h-4 w-4 text-blue-600" />
      default: return <User className="h-4 w-4 text-gray-600" />
    }
  }

  const getRoleColor = (role: CommunityMember['role']) => {
    switch (role) {
      case 'founder': return 'bg-yellow-100 text-yellow-800'
      case 'admin': return 'bg-red-100 text-red-800'
      case 'moderator': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays < 1) return 'Today'
    if (diffInDays < 7) return `${diffInDays}d ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)}mo ago`
    return `${Math.floor(diffInDays / 365)}y ago`
  }

  if (loading) {
    return (
      <Card>
        {showHeader && (
          <CardHeader>
            <CardTitle>Community Members</CardTitle>
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
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Community Members ({members.length})
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        {members.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No members found</p>
          </div>
        ) : (
          members.map((member) => (
            <Card key={member.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                    <AvatarFallback className="bg-gradient-to-br from-blue-100 to-emerald-100 text-teal-700 font-semibold">
                      {member.displayName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getRoleIcon(member.role)}
                          <h3 className="font-semibold text-lg">{member.displayName}</h3>
                          <Badge className={`text-xs ${getRoleColor(member.role)}`}>
                            {member.role}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">@{member.username}</p>
                      </div>
                    </div>

                    {member.bio && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {sanitizeText(member.bio)}
                      </p>
                    )}

                    {/* Expertise Tags */}
                    {member.expertise.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {member.expertise.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {member.expertise.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{member.expertise.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Badges */}
                    {member.badges.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {member.badges.map((badge) => (
                          <Badge key={badge} variant="secondary" className="text-xs gap-1">
                            <Award className="h-2 w-2" />
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          <span>{member.postCount} posts</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          <span>{member.reputation} rep</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Joined {formatDate(member.joinedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  )
}