"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  MessageCircle,
  Heart,
  Plus,
  Pin,
  Lock,
  Send,
  Loader2,
  Tag
} from "lucide-react"
import { dataService, type CommunityDiscussion } from "@/lib/data-service"
import { sanitizeText } from "@/lib/utils"
import { supabase } from "@/lib/supabase"
import { COMMUNITY_CONSTANTS } from "@/lib/constants/communities"
import { DiscussionCreateFormData, DEFAULT_DISCUSSION_CREATE_DATA } from "@/lib/types/community-forms"
import { validateDiscussionData } from "@/lib/utils/validation"
import { showToast } from "@/lib/toast"

interface CommunityDiscussionsProps {
  communityId?: string
  limit?: number
  showCreateForm?: boolean
}

export function CommunityDiscussions({
  communityId,
  limit = COMMUNITY_CONSTANTS.DISCUSSIONS_LIMIT,
  showCreateForm = false
}: CommunityDiscussionsProps) {
  const [threads, setThreads] = useState<CommunityDiscussion[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [showCreateThread, setShowCreateThread] = useState(false)
  const [newThread, setNewThread] = useState<DiscussionCreateFormData>(DEFAULT_DISCUSSION_CREATE_DATA)
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string[]}>({})

  const loadThreads = async () => {
    setLoading(true)
    try {
      if (!communityId) return
      const data = await dataService.getCommunityDiscussions(communityId, limit)
      setThreads(data)
    } catch (error) {
      console.error("Failed to load discussion threads:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadThreads()
  }, [communityId, limit])

  const handleCreateThread = async () => {
    // Validate form data
    const tags = newThread.tags.split(',').map(t => t.trim()).filter(t => t)
    const validation = validateDiscussionData({
      ...newThread,
      tags
    })

    if (!validation.isValid) {
      setValidationErrors(validation.fieldErrors)
      return
    }

    setCreating(true)
    setValidationErrors({})
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const userId = user?.id
      if (!userId) {
        showToast.error("Authentication Required", "Please sign in to start a discussion.")
        return
      }

      const result = await dataService.createDiscussionThread(
        communityId || 'general',
        newThread.title,
        newThread.content,
        tags,
        userId
      )

      if (result) {
        // Convert DiscussionThread to CommunityDiscussion format
        const communityDiscussion: CommunityDiscussion = {
          id: result.id,
          title: result.title,
          content: result.content,
          tags: result.tags,
          isPinned: !!result.isPinned,
          isLocked: !!result.isLocked,
          replyCount: result.commentCount,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt,
          author: {
            id: userId,
            name: result.author,
            avatar: undefined
          }
        }
        setThreads(prev => [communityDiscussion, ...prev])
        setNewThread(DEFAULT_DISCUSSION_CREATE_DATA)
        setShowCreateThread(false)
        setValidationErrors({})
        showToast.success("Discussion Started", "Your thread has been posted!")
      }
    } catch (error) {
      console.error("Failed to create thread:", error)
      showToast.error("Failed to Post", "Unable to create discussion. Please try again.")
    } finally {
      setCreating(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`

    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Discussions
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Discussions
        </CardTitle>
        {showCreateForm && (
          <Button
            onClick={() => setShowCreateThread(!showCreateThread)}
            size="sm"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            New Thread
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {showCreateThread && showCreateForm && (
          <Card className="border-dashed">
            <CardContent className="pt-6 space-y-4">
              <Input
                placeholder="Thread title..."
                value={newThread.title}
                onChange={(e) => {
                  setNewThread(prev => ({ ...prev, title: e.target.value }))
                  if (validationErrors.title) {
                    setValidationErrors(prev => ({ ...prev, title: undefined }))
                  }
                }}
                className={validationErrors.title ? 'border-red-500' : ''}
              />
              {validationErrors.title && (
                <p className="text-xs text-red-400 mt-1">{validationErrors.title[0]}</p>
              )}
              <Textarea
                placeholder="What's on your mind?"
                rows={4}
                value={newThread.content}
                onChange={(e) => {
                  setNewThread(prev => ({ ...prev, content: e.target.value }))
                  if (validationErrors.content) {
                    setValidationErrors(prev => ({ ...prev, content: undefined }))
                  }
                }}
                className={validationErrors.content ? 'border-red-500' : ''}
              />
              {validationErrors.content && (
                <p className="text-xs text-red-400 mt-1">{validationErrors.content[0]}</p>
              )}
              <Input
                placeholder="Tags (comma-separated)..."
                value={newThread.tags}
                onChange={(e) => {
                  setNewThread(prev => ({ ...prev, tags: e.target.value }))
                  if (validationErrors.tags) {
                    setValidationErrors(prev => ({ ...prev, tags: undefined }))
                  }
                }}
                className={validationErrors.tags ? 'border-red-500' : ''}
              />
              {validationErrors.tags && (
                <p className="text-xs text-red-400 mt-1">{validationErrors.tags[0]}</p>
              )}
              <div className="flex gap-2">
                <Button
                  onClick={handleCreateThread}
                  disabled={creating || !newThread.title.trim() || !newThread.content.trim()}
                  className="gap-2"
                >
                  {creating && <Loader2 className="h-4 w-4 animate-spin" />}
                  <Send className="h-4 w-4" />
                  Post Thread
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateThread(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {threads.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No discussions yet</p>
            <p className="text-sm">Be the first to start a conversation!</p>
          </div>
        ) : (
          threads.map((thread) => (
            <Card key={thread.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarFallback>
                      {thread.author.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {thread.isPinned && (
                            <Pin className="h-4 w-4 text-blue-500" />
                          )}
                          {thread.isLocked && (
                            <Lock className="h-4 w-4 text-gray-500" />
                          )}
                          <h3 className="font-semibold text-lg leading-tight truncate pr-2" title={sanitizeText(thread.title)}>
                            {sanitizeText(thread.title)}
                          </h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          by {thread.author.name} • {formatDate(thread.createdAt)}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                      {sanitizeText(thread.content)}
                    </p>

                    {thread.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {thread.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs gap-1">
                            <Tag className="h-2 w-2" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {thread.likes || 0}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {thread.replyCount} comments
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