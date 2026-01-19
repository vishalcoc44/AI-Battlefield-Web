import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { dataService, CommunityMember } from '@/lib/data-service'

export function useCommunityMembership(communityId: string) {
	const [isMember, setIsMember] = useState(false)
	const [isAdmin, setIsAdmin] = useState(false)
	const [membership, setMembership] = useState<CommunityMember | null>(null)
	const [loading, setLoading] = useState(true)
	const [joining, setJoining] = useState(false)
	const [userId, setUserId] = useState<string | null>(null)

	useEffect(() => {
		async function checkMembership() {
			if (!communityId) return
			setLoading(true)
			try {
				const { data: { user } } = await supabase.auth.getUser()
				if (user) {
					setUserId(user.id)
					const memberProfile = await dataService.getCommunityMemberProfile(user.id, communityId)
					if (memberProfile) {
						setMembership(memberProfile)
						setIsMember(true)
						setIsAdmin(memberProfile.role === 'admin' || memberProfile.role === 'founder')
					} else {
						setMembership(null)
						setIsMember(false)
						setIsAdmin(false)
					}
				} else {
					setUserId(null)
					// Clear state if logged out
					setMembership(null)
					setIsMember(false)
					setIsAdmin(false)
				}
			} catch (error) {
				console.error("Failed to check membership:", error)
			} finally {
				setLoading(false)
			}
		}
		checkMembership()
	}, [communityId])

	const joinCommunity = async () => {
		if (!userId) throw new Error("User not authenticated")
		setJoining(true)
		try {
			const response = await dataService.joinCommunity(communityId, userId)
			if (response.success) {
				setIsMember(true)
				// Refresh profile to get role
				const memberProfile = await dataService.getCommunityMemberProfile(userId, communityId)
				setMembership(memberProfile)
			}
			return response
		} catch (error) {
			throw error
		} finally {
			setJoining(false)
		}
	}

	const leaveCommunity = async () => {
		if (!userId) throw new Error("User not authenticated")
		setJoining(true)
		try {
			const response = await dataService.leaveCommunity(communityId, userId)
			if (response.success) {
				setIsMember(false)
				setMembership(null)
				setIsAdmin(false)
			}
			return response
		} catch (error) {
			throw error
		} finally {
			setJoining(false)
		}
	}

	return {
		isMember,
		isAdmin,
		membership,
		loading,
		joining,
		userId,
		joinCommunity,
		leaveCommunity
	}
}
