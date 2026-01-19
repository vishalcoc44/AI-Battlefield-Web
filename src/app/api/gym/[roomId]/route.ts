import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { withRetry, validateTopic, validateCategory } from '@/lib/utils'
import { GYM_CONSTANTS } from '@/lib/constants/gym'

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// DELETE /api/gym/[roomId] - Delete a gym room (only by creator)
export async function DELETE(
	request: NextRequest,
	{ params }: { params: { roomId: string } }
) {
	try {
		const { data: { user }, error: authError } = await supabase.auth.getUser()

		if (authError || !user) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		// Verify the user is the creator of the room
		const { data: room, error: roomError } = await supabase
			.from('gym_rooms')
			.select('created_by')
			.eq('id', params.roomId)
			.single()

		if (roomError) {
			return NextResponse.json(
				{ error: 'Room not found' },
				{ status: 404 }
			)
		}

		if (room.created_by !== user.id) {
			return NextResponse.json(
				{ error: 'Forbidden: Only room creator can delete' },
				{ status: 403 }
			)
		}

		// Delete the room with retry logic
		const deleteResult = await withRetry(
			async () => {
				const { error } = await supabase
					.from('gym_rooms')
					.delete()
					.eq('id', params.roomId)

				if (error) throw error
				return { success: true }
			},
			GYM_CONSTANTS.RETRY.MAX_ATTEMPTS,
			GYM_CONSTANTS.RETRY.BASE_DELAY_MS,
			(error) => {
				// Retry on network errors, timeouts, and 5xx errors
				return error.message?.includes('network') ||
					   error.message?.includes('timeout') ||
					   error.status >= 500
			}
		).catch(error => {
			console.error('Delete room error after retries:', error)
			return NextResponse.json(
				{ error: 'Failed to delete room. Please try again.' },
				{ status: 500 }
			)
		})

		if (deleteResult instanceof Response) return deleteResult

		return NextResponse.json({ success: true })

	} catch (error) {
		console.error('Delete room API error:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}

// PATCH /api/gym/[roomId] - Update a gym room (only by creator)
export async function PATCH(
	request: NextRequest,
	{ params }: { params: { roomId: string } }
) {
	try {
		const { data: { user }, error: authError } = await supabase.auth.getUser()

		if (authError || !user) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		// Verify the user is the creator of the room
		const { data: room, error: roomError } = await supabase
			.from('gym_rooms')
			.select('created_by')
			.eq('id', params.roomId)
			.single()

		if (roomError) {
			return NextResponse.json(
				{ error: 'Room not found' },
				{ status: 404 }
			)
		}

		if (room.created_by !== user.id) {
			return NextResponse.json(
				{ error: 'Forbidden: Only room creator can update' },
				{ status: 403 }
			)
		}

		const body = await request.json()
		const { topic, category } = body

		// Validate inputs using utility functions
		const topicValidation = validateTopic(topic)
		if (!topicValidation.isValid) {
			return NextResponse.json(
				{ error: topicValidation.error },
				{ status: 400 }
			)
		}

		const categoryValidation = validateCategory(category)
		if (!categoryValidation.isValid) {
			return NextResponse.json(
				{ error: categoryValidation.error },
				{ status: 400 }
			)
		}

		// Update the room with retry logic
		const updateData: any = { topic: topicValidation.sanitized }
		if (category) {
			updateData.category = category
			updateData.description = `${category}|Updated by user` // Keep backward compatibility
		}

		const updateResult = await withRetry(
			async () => {
				const { data, error } = await supabase
					.from('gym_rooms')
					.update(updateData)
					.eq('id', params.roomId)
					.select()
					.single()

				if (error) throw error
				return data
			},
			GYM_CONSTANTS.RETRY.MAX_ATTEMPTS,
			GYM_CONSTANTS.RETRY.BASE_DELAY_MS,
			(error) => {
				// Retry on network errors, timeouts, and 5xx errors
				return error.message?.includes('network') ||
					   error.message?.includes('timeout') ||
					   error.status >= 500
			}
		).catch(error => {
			console.error('Update room error after retries:', error)
			return NextResponse.json(
				{ error: 'Failed to update room. Please try again.' },
				{ status: 500 }
			)
		})

		if (updateResult instanceof Response) return updateResult

		return NextResponse.json(updateResult)

	} catch (error) {
		console.error('Update room API error:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}