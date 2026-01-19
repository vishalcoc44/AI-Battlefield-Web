import { supabase } from '../supabase'

export class BaseService {
	protected useMock: boolean
	protected supabase: typeof supabase

	constructor() {
		this.useMock = false // STRICT MODE: Always use real backend
		this.supabase = supabase
	}
}
