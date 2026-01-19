import { BaseService } from './base-service'
import { IntelDossier, IntelSubmission, IntelRecord, IntelAnnotation } from '../types'
import { withTimeout } from '../utils'

export class IntelService extends BaseService {
	async createIntelSubmission(submission: { title: string, description: string, contentUrl?: string }): Promise<boolean> {
		if (this.useMock) return true

		try {
			// Get current user
			const { data: { user } } = await this.supabase.auth.getUser()
			if (!user) throw new Error("Unauthorized")

			// 1. Create the submission record
			const { data: submissionData, error: submissionError } = await this.supabase
				.from('intel_submissions')
				.insert({
					user_id: user.id,
					title: submission.title,
					description: submission.description,
					content_url: submission.contentUrl,
					status: 'Approved' // Auto-approve submissions to make them visible
				})
				.select()
				.single()

			if (submissionError) throw submissionError

			// 2. Automatically create a dossier from the submission so it appears in Intel Ops
			const { data: dossierData, error: dossierError } = await this.supabase
				.from('intel_dossiers')
				.insert({
					title: submission.title,
					description: submission.description,
					status: 'Active',
					category: 'Op', // Default category
					tags: [], // Empty tags array
					cover_image: submission.contentUrl || null,
					min_xp: 0 // No XP requirement by default
				})
				.select()
				.single()

			if (dossierError) {
				console.error("Failed to create dossier from submission:", dossierError)
				// Don't fail the whole operation if dossier creation fails
				// The submission was created successfully
				return true // Return early since we can't create records without a dossier
			}

			// 3. If there's a content URL and dossier was created successfully, create an intel record linking to the dossier
			if (submission.contentUrl && dossierData?.id) {
				// Determine content type from file extension
				const url = submission.contentUrl.toLowerCase()
				let contentType: 'text' | 'pdf' | 'image' | 'video' | 'audio' = 'text'
				
				if (url.includes('.pdf')) {
					contentType = 'pdf'
				} else if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
					contentType = 'image'
				} else if (url.match(/\.(mp4|webm|ogg|mov|avi)$/)) {
					contentType = 'video'
				} else if (url.match(/\.(mp3|wav|ogg|m4a|aac)$/)) {
					contentType = 'audio'
				}

				const { error: recordError } = await this.supabase
					.from('intel_records')
					.insert({
						dossier_id: dossierData.id,
						title: submission.title,
						content_type: contentType,
						content_url: submission.contentUrl,
						summary: submission.description,
						confidence_score: 85
					})

				if (recordError) {
					console.error("Failed to create intel record from submission:", recordError)
					console.error("Record error details:", JSON.stringify(recordError, null, 2))
					// Don't fail the whole operation if record creation fails
					// The submission and dossier were created successfully
				}
			}

			return true
		} catch (error) {
			console.error("Failed to submit intel:", error)
			return false
		}
	}

	async uploadFile(file: File): Promise<string | null> {
		if (this.useMock) return "https://example.com/mock-file.pdf"

		try {
			const fileExt = file.name.split('.').pop()
			const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
			const filePath = `${fileName}`

			const { error: uploadError } = await this.supabase.storage
				.from('intel-assets')
				.upload(filePath, file)

			if (uploadError) {
				// Provide more specific error messages based on Supabase error codes
				if (uploadError.message?.includes('exceeded')) {
					throw new Error(`File size exceeds storage limit. Please choose a smaller file.`)
				} else if (uploadError.message?.includes('not allowed')) {
					throw new Error(`File type not allowed. Only secure document formats are permitted.`)
				} else if (uploadError.message?.includes('quota')) {
					throw new Error(`Storage quota exceeded. Contact system administrator.`)
				} else {
					throw new Error(`Upload failed: ${uploadError.message || 'Unknown storage error'}`)
				}
			}

			const { data: { publicUrl } } = this.supabase.storage
				.from('intel-assets')
				.getPublicUrl(filePath)

			if (!publicUrl) {
				throw new Error('Upload succeeded but public URL could not be generated.')
			}

			return publicUrl
		} catch (error) {
			console.error('Error uploading intel file:', error)
			throw error // Re-throw so caller can handle specific errors
		}
	}

	async getIntelAnnotations(dossierId: string, page: number = 1, limit: number = 20): Promise<{ data: IntelAnnotation[], count: number }> {
		if (this.useMock) return { data: [], count: 0 }

		try {
			const from = (page - 1) * limit
			const to = from + limit - 1

			const queryPromise = this.supabase
				.from('intel_annotations')
				.select(`
                *,
                user:profiles(username, avatar_url)
            `, { count: 'exact' })
				.eq('dossier_id', dossierId)
				.order('created_at', { ascending: true })
				.range(from, to)

			const { data, error, count } = await withTimeout(queryPromise as unknown as Promise<any>, 8000)

			if (error) throw error

			const annotations = data?.map((a: any) => ({
				id: a.id,
				dossierId: a.dossier_id,
				userId: a.user_id,
				selectedText: a.selected_text,
				comment: a.comment,
				color: a.color,
				createdAt: a.created_at,
				user: {
					username: a.user?.username || 'Unknown Agent',
					avatarUrl: a.user?.avatar_url
				}
			})) || []

			return {
				data: annotations,
				count: count || 0
			}
		} catch (error) {
			console.error("Error fetching annotations:", error)
			throw error
		}
	}

	async createIntelAnnotation(annotation: { dossierId: string, selectedText: string, comment: string, color?: string }): Promise<IntelAnnotation | null> {
		if (this.useMock) return null

		try {
			const { data: { user } } = await this.supabase.auth.getUser()
			if (!user) throw new Error("Unauthorized")

			const { data, error } = await this.supabase
				.from('intel_annotations')
				.insert({
					dossier_id: annotation.dossierId,
					user_id: user.id,
					selected_text: annotation.selectedText,
					comment: annotation.comment,
					color: annotation.color || 'emerald'
				})
				.select()
				.single()

			if (error) throw error

			return {
				id: data.id,
				dossierId: data.dossier_id,
				userId: data.user_id,
				selectedText: data.selected_text,
				comment: data.comment,
				color: data.color,
				createdAt: data.created_at,
				user: {
					username: 'Me', // Optimistic update
					avatarUrl: undefined
				}
			}
		} catch (error) {
			console.error("Failed to add annotation:", error)
			return null
		}
	}

	async getIntelDossiers(options: {
		page?: number;
		limit?: number;
		search?: string;
		filters?: { status?: string, category?: string }
	} = {}): Promise<{ data: IntelDossier[], count: number }> {
		if (this.useMock) return { data: [], count: 0 }

		const { page = 1, limit = 10, search, filters } = options
		const from = (page - 1) * limit
		const to = from + limit - 1

		try {
			let query = this.supabase
				.from('intel_dossiers')
				.select('*', { count: 'exact' })
				.order('created_at', { ascending: false })
				.range(from, to)

			if (filters?.status) query = query.eq('status', filters.status)
			if (filters?.category) query = query.eq('category', filters.category)

			if (search) {
				// Search title or description
				query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,tags.cs.{${search}}`)
			}

			const { data, error, count } = await withTimeout(query, 15000) // 15 second timeout

			if (error) throw error

			const dossiers = data.map((d: any) => ({
				id: d.id,
				title: d.title,
				description: d.description,
				status: d.status,
				category: d.category,
				tags: d.tags || [],
				coverImage: d.cover_image,
				minXp: d.min_xp || 0,
				originCoordinates: d.origin_coordinates,
				createdAt: d.created_at
			}))

			return { data: dossiers, count: count || 0 }
		} catch (error) {
			console.error("Error fetching intel dossiers:", error)
			return { data: [], count: 0 }
		}
	}

	async getIntelDossierById(id: string): Promise<IntelDossier | null> {
		if (this.useMock) return null

		try {
			const { data, error } = await withTimeout(
				this.supabase
					.from('intel_dossiers')
					.select('*')
					.eq('id', id)
					.single(),
				10000 // 10 second timeout for single item queries
			)

			if (error) throw error

			return {
				id: data.id,
				title: data.title,
				description: data.description,
				status: data.status,
				category: data.category,
				tags: data.tags || [],
				coverImage: data.cover_image,
				minXp: data.min_xp || 0,
				createdAt: data.created_at
			}
		} catch (error) {
			console.error("Error fetching intel dossier:", error)
			return null
		}
	}

	async getIntelRecords(dossierId: string): Promise<IntelRecord[]> {
		if (this.useMock) return []

		try {
			const { data, error } = await withTimeout(
				this.supabase
					.from('intel_records')
					.select('*')
					.eq('dossier_id', dossierId)
					.order('created_at', { ascending: false }),
				10000
			)

			if (error) throw error

			return data.map((r: any) => ({
				id: r.id,
				dossierId: r.dossier_id,
				title: r.title,
				contentType: r.content_type,
				categoryId: r.category_id,
				contentUrl: r.content_url,
				summary: r.summary,
				confidenceScore: r.confidence_score || 0, // Map DB column to TS type
				createdAt: r.created_at
			}))
		} catch (error) {
			console.error("Error fetching intel records:", error)
			return []
		}
	}

	async getUserIntelSubmissions(): Promise<IntelSubmission[]> {
		if (this.useMock) return []

		try {
			const { data: { user } } = await this.supabase.auth.getUser()
			if (!user) return []

			const { data, error } = await withTimeout(
				this.supabase
					.from('intel_submissions')
					.select('*')
					.eq('user_id', user.id)
					.order('created_at', { ascending: false }),
				8000
			)

			if (error) throw error

			return data.map((s: any) => ({
				id: s.id,
				userId: s.user_id,
				title: s.title,
				description: s.description,
				contentUrl: s.content_url,
				status: s.status || 'pending',
				createdAt: s.created_at
			}))
		} catch (error) {
			console.error('Failed to fetch user submissions:', error)
			return []
		}
	}
}
