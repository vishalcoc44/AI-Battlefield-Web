"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollText, Shield, AlertTriangle } from "lucide-react"
import { dataService, type Community } from "@/lib/data-service"

interface CommunityRulesProps {
  community: Community
  showHeader?: boolean
}

export function CommunityRules({ community, showHeader = true }: CommunityRulesProps) {
  if (!community || !community.rules) {
    return (
      <Card>
        {showHeader && (
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ScrollText className="h-5 w-5" />
              Community Rules
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No specific rules have been set for this community.</p>
            <p className="text-sm mt-1">Please follow general platform guidelines.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  let rulesList: string[] = []

  if (Array.isArray(community.rules)) {
    rulesList = community.rules.map(r => r.description || r.title)
  } else if (typeof community.rules === 'string') {
    rulesList = community.rules.split('\n').filter(rule => rule.trim())
  }

  return (
    <Card>
      {showHeader && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScrollText className="h-5 w-5" />
            Community Rules
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline" className="gap-1">
            <Shield className="h-3 w-3" />
            {community.name}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {rulesList.length} rules
          </Badge>
        </div>

        <div className="space-y-3">
          {rulesList.map((rule, index) => (
            <div key={index} className="flex gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                  {index + 1}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground flex-1">
                {rule.trim()}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <div className="flex gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <h4 className="font-medium text-amber-800 dark:text-amber-200">Important</h4>
          </div>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            Violation of these rules may result in warnings, temporary suspension, or permanent removal from the community.
            Rules are enforced by community moderators and administrators.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}