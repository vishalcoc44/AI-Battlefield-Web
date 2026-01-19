import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET /api/void/masks - Get available void masks
export async function GET(request: NextRequest) {
	try {
		const { data: masks, error: masksError } = await supabase
			.from('void_masks')
			.select('*')
			.eq('is_active', true)
			.order('created_at', { ascending: true })

		if (masksError) {
			console.error('Get void masks error:', masksError)
			return NextResponse.json(
				{ error: 'Failed to get masks' },
				{ status: 500 }
			)
		}

		return NextResponse.json(masks || [])

	} catch (error) {
		console.error('Get void masks API error:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
