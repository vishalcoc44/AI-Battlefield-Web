// Community form data types
export interface CommunityCreateFormData {
  name: string
  description: string
  type: 'Public' | 'Private'
  category: string
  tags: string
  rules: string
}

export interface CommunityEditFormData {
  name?: string
  desc?: string
  category?: string
  type?: 'Public' | 'Private'
  tags?: string[]
  rules?: string | string[]
  coverImage?: string
  avatar?: string
}

export interface DiscussionCreateFormData {
  title: string
  content: string
  tags: string
}

export interface CommunitySearchFilters {
  searchTerm: string
  category: string
  type?: 'Public' | 'Private'
  memberCountRange?: {
    min?: number
    max?: number
  }
  activityLevel?: 'Low' | 'Medium' | 'High'
  sortBy?: 'name' | 'members' | 'activity' | 'created'
  sortOrder?: 'asc' | 'desc'
}

// Default values for forms
export const DEFAULT_COMMUNITY_CREATE_DATA: CommunityCreateFormData = {
  name: '',
  description: '',
  type: 'Public',
  category: 'General',
  tags: '',
  rules: ''
}

export const DEFAULT_DISCUSSION_CREATE_DATA: DiscussionCreateFormData = {
  title: '',
  content: '',
  tags: ''
}

// Validation schemas (could be used with a validation library like zod)
export const COMMUNITY_NAME_SCHEMA = {
  minLength: 3,
  maxLength: 50,
  pattern: /^[a-zA-Z0-9\s\-_]+$/
}

export const COMMUNITY_DESCRIPTION_SCHEMA = {
  maxLength: 500
}

export const COMMUNITY_TAG_SCHEMA = {
  maxLength: 20,
  pattern: /^[a-zA-Z0-9\-_]+$/
}