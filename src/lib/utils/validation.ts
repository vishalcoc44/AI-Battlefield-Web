import { COMMUNITY_CONSTANTS } from '../constants/communities'

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export interface CommunityValidationResult extends ValidationResult {
  fieldErrors: {
    name?: string[]
    description?: string[]
    type?: string[]
    category?: string[]
    tags?: string[]
    rules?: string[]
  }
}

export interface DiscussionValidationResult extends ValidationResult {
  fieldErrors: {
    title?: string[]
    content?: string[]
    tags?: string[]
  }
}

/**
 * Validates community creation/update data
 */
export function validateCommunityData(data: {
  name: string
  description: string
  type: 'Public' | 'Private'
  category: string
  tags: string[]
  rules?: string
}): CommunityValidationResult {
  const errors: string[] = []
  const fieldErrors: CommunityValidationResult['fieldErrors'] = {}

  // Name validation
  if (!data.name || data.name.trim().length === 0) {
    errors.push('Community name is required')
    fieldErrors.name = ['Name is required']
  } else if (data.name.length < COMMUNITY_CONSTANTS.NAME_MIN_LENGTH) {
    errors.push(`Community name must be at least ${COMMUNITY_CONSTANTS.NAME_MIN_LENGTH} characters`)
    fieldErrors.name = [`Must be at least ${COMMUNITY_CONSTANTS.NAME_MIN_LENGTH} characters`]
  } else if (data.name.length > COMMUNITY_CONSTANTS.NAME_MAX_LENGTH) {
    errors.push(`Community name must be no more than ${COMMUNITY_CONSTANTS.NAME_MAX_LENGTH} characters`)
    fieldErrors.name = [`Must be no more than ${COMMUNITY_CONSTANTS.NAME_MAX_LENGTH} characters`]
  } else if (!/^[a-zA-Z0-9\s\-_]+$/.test(data.name)) {
    errors.push('Community name can only contain letters, numbers, spaces, hyphens, and underscores')
    fieldErrors.name = ['Only letters, numbers, spaces, hyphens, and underscores allowed']
  }

  // Description validation
  if (data.description && data.description.length > COMMUNITY_CONSTANTS.DESCRIPTION_MAX_LENGTH) {
    errors.push(`Description must be no more than ${COMMUNITY_CONSTANTS.DESCRIPTION_MAX_LENGTH} characters`)
    fieldErrors.description = [`Must be no more than ${COMMUNITY_CONSTANTS.DESCRIPTION_MAX_LENGTH} characters`]
  }

  // Type validation
  if (!COMMUNITY_CONSTANTS.COMMUNITY_TYPES.includes(data.type)) {
    errors.push('Invalid community type')
    fieldErrors.type = ['Must be Public or Private']
  }

  // Category validation
  if (!COMMUNITY_CONSTANTS.ALLOWED_CATEGORIES.includes(data.category as any)) {
    errors.push('Invalid category selected')
    fieldErrors.category = ['Please select a valid category']
  }

  // Tags validation
  if (data.tags && data.tags.length > 0) {
    const invalidTags = data.tags.filter(tag =>
      !/^[a-zA-Z0-9\-_]+$/.test(tag) ||
      tag.length > COMMUNITY_CONSTANTS.TAG_MAX_LENGTH ||
      tag.length === 0
    )

    if (invalidTags.length > 0) {
      errors.push('Tags must be alphanumeric and no more than 20 characters each')
      fieldErrors.tags = ['Tags must contain only letters, numbers, hyphens, and underscores (max 20 chars each)']
    }

    if (data.tags.length > COMMUNITY_CONSTANTS.TAGS_MAX_COUNT) {
      errors.push(`Cannot have more than ${COMMUNITY_CONSTANTS.TAGS_MAX_COUNT} tags`)
      fieldErrors.tags = [`Maximum ${COMMUNITY_CONSTANTS.TAGS_MAX_COUNT} tags allowed`]
    }

    // Check for duplicates
    const uniqueTags = new Set(data.tags.map(t => t.toLowerCase()))
    if (uniqueTags.size !== data.tags.length) {
      errors.push('Duplicate tags are not allowed')
      fieldErrors.tags = ['Duplicate tags are not allowed']
    }
  }

  // Rules validation (optional field)
  if (data.rules && data.rules.length > 1000) {
    errors.push('Community rules must be no more than 1000 characters')
    fieldErrors.rules = ['Must be no more than 1000 characters']
  }

  return {
    isValid: errors.length === 0,
    errors,
    fieldErrors
  }
}

/**
 * Validates discussion thread creation data
 */
export function validateDiscussionData(data: {
  title: string
  content: string
  tags: string[]
}): DiscussionValidationResult {
  const errors: string[] = []
  const fieldErrors: DiscussionValidationResult['fieldErrors'] = {}

  // Title validation
  if (!data.title || data.title.trim().length === 0) {
    errors.push('Discussion title is required')
    fieldErrors.title = ['Title is required']
  } else if (data.title.length < 5) {
    errors.push('Discussion title must be at least 5 characters')
    fieldErrors.title = ['Must be at least 5 characters']
  } else if (data.title.length > 100) {
    errors.push('Discussion title must be no more than 100 characters')
    fieldErrors.title = ['Must be no more than 100 characters']
  }

  // Content validation
  if (!data.content || data.content.trim().length === 0) {
    errors.push('Discussion content is required')
    fieldErrors.content = ['Content is required']
  } else if (data.content.length < 10) {
    errors.push('Discussion content must be at least 10 characters')
    fieldErrors.content = ['Must be at least 10 characters']
  } else if (data.content.length > 5000) {
    errors.push('Discussion content must be no more than 5000 characters')
    fieldErrors.content = ['Must be no more than 5000 characters']
  }

  // Tags validation (same as community tags)
  if (data.tags && data.tags.length > 0) {
    const invalidTags = data.tags.filter(tag =>
      !/^[a-zA-Z0-9\-_]+$/.test(tag) ||
      tag.length > COMMUNITY_CONSTANTS.TAG_MAX_LENGTH ||
      tag.length === 0
    )

    if (invalidTags.length > 0) {
      errors.push('Tags must be alphanumeric and no more than 20 characters each')
      fieldErrors.tags = ['Tags must contain only letters, numbers, hyphens, and underscores (max 20 chars each)']
    }

    if (data.tags.length > 5) {
      errors.push('Cannot have more than 5 tags')
      fieldErrors.tags = ['Maximum 5 tags allowed']
    }

    // Check for duplicates
    const uniqueTags = new Set(data.tags.map(t => t.toLowerCase()))
    if (uniqueTags.size !== data.tags.length) {
      errors.push('Duplicate tags are not allowed')
      fieldErrors.tags = ['Duplicate tags are not allowed']
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    fieldErrors
  }
}

/**
 * Validates file upload
 */
export function validateFileUpload(file: File): ValidationResult {
  const errors: string[] = []

  // Check file size
  if (file.size > COMMUNITY_CONSTANTS.MAX_FILE_SIZE) {
    errors.push(`File size must be no more than ${COMMUNITY_CONSTANTS.MAX_FILE_SIZE / (1024 * 1024)}MB`)
  }

  // Check file type
  if (!COMMUNITY_CONSTANTS.ALLOWED_IMAGE_TYPES.includes(file.type as any)) {
    errors.push('Only image files (JPEG, PNG, GIF, WebP) are allowed')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}