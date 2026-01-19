import { toast as toastFunction } from "@/hooks/use-toast"

type ToastVariant = "default" | "destructive" | "success" | "warning" | "info"

interface ToastOptions {
  title?: string
  description?: string
  duration?: number
}

export const showToast = {
  success: (title: string, description?: string, options?: ToastOptions) => {
    return toastFunction({
      title,
      description,
      variant: "success",
      ...options,
    })
  },

  error: (title: string, description?: string, options?: ToastOptions) => {
    return toastFunction({
      title,
      description,
      variant: "destructive",
      ...options,
    })
  },

  warning: (title: string, description?: string, options?: ToastOptions) => {
    return toastFunction({
      title,
      description,
      variant: "warning",
      ...options,
    })
  },

  info: (title: string, description?: string, options?: ToastOptions) => {
    return toastFunction({
      title,
      description,
      variant: "info",
      ...options,
    })
  },

  default: (title: string, description?: string, options?: ToastOptions) => {
    return toastFunction({
      title,
      description,
      ...options,
    })
  },
}

// Utility function to show error toasts based on error classification
export function showErrorToast(error: any, fallbackTitle = "Error", fallbackDescription = "An unexpected error occurred") {
  let title = fallbackTitle
  let description = fallbackDescription

  if (error?.message) {
    description = error.message
  }

  // Try to classify the error
  if (error?.status === 401) {
    title = "Authentication Required"
    description = "Please sign in to continue"
  } else if (error?.status === 403) {
    title = "Access Denied"
    description = "You don't have permission to perform this action"
  } else if (error?.status === 404) {
    title = "Not Found"
    description = "The requested resource was not found"
  } else if (error?.status >= 500) {
    title = "Server Error"
    description = "Something went wrong on our end. Please try again later."
  } else if (!navigator.onLine) {
    title = "No Internet Connection"
    description = "Please check your network connection and try again"
  }

  showToast.error(title, description)
}