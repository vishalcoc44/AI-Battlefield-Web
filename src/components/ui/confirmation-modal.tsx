"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
  isLoading?: boolean
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false
}: ConfirmationModalProps) {
  const handleConfirm = () => {
    onConfirm()
    // Don't close modal here - let the parent handle it after confirmation
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: 'text-red-500',
          confirmButton: 'bg-red-600 hover:bg-red-700 text-white',
          title: 'text-red-400'
        }
      case 'warning':
        return {
          icon: 'text-amber-500',
          confirmButton: 'bg-amber-600 hover:bg-amber-700 text-white',
          title: 'text-amber-400'
        }
      case 'info':
        return {
          icon: 'text-blue-500',
          confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white',
          title: 'text-blue-400'
        }
      default:
        return {
          icon: 'text-red-500',
          confirmButton: 'bg-red-600 hover:bg-red-700 text-white',
          title: 'text-red-400'
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/95 border-zinc-800 text-white backdrop-blur-xl max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center">
            <AlertTriangle className={`w-6 h-6 ${styles.icon}`} />
          </div>
          <DialogTitle className={`text-lg font-bold ${styles.title}`}>
            {title}
          </DialogTitle>
          <DialogDescription className="text-zinc-400 text-sm mt-2">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`flex-1 ${styles.confirmButton} disabled:opacity-50`}
          >
            {isLoading ? 'Processing...' : confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}