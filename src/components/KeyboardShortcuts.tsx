"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Keyboard, HelpCircle } from "lucide-react"

interface KeyboardShortcut {
  key: string
  description: string
  category: string
}

interface KeyboardShortcutsProps {
  shortcuts?: KeyboardShortcut[]
}

const defaultShortcuts: KeyboardShortcut[] = [
  // Search & Navigation
  { key: "Ctrl+K", description: "Focus search input", category: "Search & Navigation" },
  { key: "Esc", description: "Close modals and clear selection", category: "Search & Navigation" },

  // Intel Operations
  { key: "Click + Drag", description: "Select text to annotate", category: "Intel Operations" },
  { key: "Space", description: "Play/pause audio in Wiretap Player", category: "Intel Operations" },
  { key: "Click", description: "Seek in audio progress bar", category: "Intel Operations" },

  // Form Controls
  { key: "Enter", description: "Submit forms and annotations", category: "Form Controls" },
  { key: "Tab", description: "Navigate between form fields", category: "Form Controls" },

  // General
  { key: "Ctrl+R", description: "Refresh page (browser default)", category: "General" },
  { key: "F5", description: "Refresh page (browser default)", category: "General" },
]

export function KeyboardShortcuts({ shortcuts = defaultShortcuts }: KeyboardShortcutsProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Listen for keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Close shortcuts modal with Escape
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
        return
      }

      // Open shortcuts modal with ? key
      if (event.key === '?' && !event.ctrlKey && !event.metaKey) {
        event.preventDefault()
        setIsOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Group shortcuts by category
  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = []
    }
    acc[shortcut.category].push(shortcut)
    return acc
  }, {} as Record<string, KeyboardShortcut[]>)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="fixed bottom-4 right-4 z-40 bg-black/80 border border-white/10 text-zinc-400 hover:text-white hover:bg-black/90 backdrop-blur-sm"
          title="Keyboard Shortcuts (?)"
        >
          <Keyboard className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Shortcuts</span>
          <span className="sm:hidden">?</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-black/95 border-zinc-800 text-white backdrop-blur-xl max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <p className="text-zinc-400 text-sm">
            Press <kbd className="px-2 py-1 bg-zinc-800 rounded text-xs">?</kbd> to open this dialog anytime
          </p>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
            <div key={category} className="space-y-3">
              <h3 className="text-emerald-400 font-semibold text-sm uppercase tracking-wider">
                {category}
              </h3>
              <div className="space-y-2">
                {categoryShortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 px-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50"
                  >
                    <span className="text-zinc-300 text-sm">
                      {shortcut.description}
                    </span>
                    <kbd className="px-3 py-1 bg-zinc-800 text-zinc-200 rounded text-xs font-mono border border-zinc-700">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-zinc-800">
          <p className="text-xs text-zinc-500 text-center">
            Intelligence Operations System - Version 2.0
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}