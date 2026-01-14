"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  MapPin,
  Users,
  Video,
  Clock,
  CheckCircle,
  Loader2,
  Tag
} from "lucide-react"
import { dataService, type CommunityEvent } from "@/lib/data-service"

interface CommunityEventsProps {
  communityId?: string
  limit?: number
  showHeader?: boolean
}

export function CommunityEvents({
  communityId,
  limit = 10,
  showHeader = true
}: CommunityEventsProps) {
  const [events, setEvents] = useState<CommunityEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [rsvpLoading, setRsvpLoading] = useState<string | null>(null)

  const loadEvents = async () => {
    setLoading(true)
    try {
      if (!communityId) return
      const data = await dataService.getCommunityEvents(communityId, limit)
      setEvents(data)
    } catch (error) {
      console.error("Failed to load community events:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [communityId, limit])

  const handleRSVP = async (eventId: string) => {
    setRsvpLoading(eventId)
    try {
      const success = await dataService.rsvpToEvent(eventId, 'current-user')
      if (success) {
        // Update the event's attendee count
        setEvents(prev => prev.map(event =>
          event.id === eventId
            ? { ...event, currentParticipants: event.currentParticipants + 1 }
            : event
        ))
      }
    } catch (error) {
      console.error("Failed to RSVP:", error)
    } finally {
      setRsvpLoading(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    })
  }

  const getEventTypeColor = (type: CommunityEvent['type']) => {
    switch (type) {
      case 'Workshop': return 'bg-blue-100 text-blue-800'
      case 'Debate': return 'bg-emerald-100 text-emerald-800'
      case 'Discussion': return 'bg-green-100 text-green-800'
      case 'Social': return 'bg-teal-100 text-teal-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <Card>
        {showHeader && (
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
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
            <Calendar className="h-5 w-5" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        {events.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No upcoming events</p>
            <p className="text-sm">Check back later for new events!</p>
          </div>
        ) : (
          events.map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Badge
                        className={`mb-2 ${getEventTypeColor(event.type)}`}
                      >
                        {event.type}
                      </Badge>
                      <h3 className="font-semibold text-lg leading-tight mb-1">
                        {event.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Organized by {event.organizer.name} in {event.communityName}
                      </p>
                    </div>
                  </div>

                  {/* Date and Time */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(event.startTime)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{formatTime(event.startTime)}</span>
                    </div>
                    {event.location === 'Virtual' ? (
                      <div className="flex items-center gap-1">
                        <Video className="h-4 w-4 text-muted-foreground" />
                        <span>Virtual</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {event.description}
                  </p>

                  {/* Tags */}
                  {(event.tags || []).length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {(event.tags || []).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs gap-1">
                          <Tag className="h-2 w-2" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>
                        {event.currentParticipants}
                        {event.maxParticipants && `/${event.maxParticipants}`}
                        {' attendees'}
                      </span>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => handleRSVP(event.id)}
                      disabled={
                        rsvpLoading === event.id ||
                        (!!event.maxParticipants && event.currentParticipants >= event.maxParticipants)
                      }
                      className="gap-2"
                    >
                      {rsvpLoading === event.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <CheckCircle className="h-3 w-3" />
                      )}
                      {event.maxParticipants && event.currentParticipants >= event.maxParticipants
                        ? 'Full'
                        : 'RSVP'
                      }
                    </Button>
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