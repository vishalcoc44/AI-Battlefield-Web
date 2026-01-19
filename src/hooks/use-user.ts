import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

export type UserProfile = {
	id: string
	username: string
	full_name?: string
	avatar_url?: string
	email?: string
}

export function useUser() {
	const [user, setUser] = useState<User | null>(null)
	const [profile, setProfile] = useState<UserProfile | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<Error | null>(null)

	useEffect(() => {
		async function getUser() {
			try {
				setLoading(true)
				const { data: { user }, error: userError } = await supabase.auth.getUser()

				if (userError) throw userError

				setUser(user)

				if (user) {
					const { data: profileData, error: profileError } = await supabase
						.from('profiles')
						.select('*')
						.eq('id', user.id)
						.single()

					if (profileError) {
						console.error("Error fetching profile:", profileError)
						// Don't throw here, just set partial data if possible or null profile
					}

					setProfile(profileData || null)
				}
			} catch (e) {
				setError(e as Error)
			} finally {
				setLoading(false)
			}
		}

		getUser()

		const { data: { subscription } } = supabase.auth.onAuthStateChange(
			async (_event, session) => {
				setUser(session?.user ?? null)
				setLoading(false) // Stop loading on state change
			}
		)

		return () => {
			subscription.unsubscribe()
		}
	}, [])

	const signOut = async () => {
		await supabase.auth.signOut()
		setUser(null)
		setProfile(null)
	}

	return { user, profile, loading, error, signOut }
}
