export type DebateStatus = 'active' | 'completed' | 'archived';

export interface DebateSession {
	id: string;
	user_id: string;
	persona_id: string;
	topic: string;
	status: DebateStatus;
	metrics: {
		turns: number;
		avg_steelman: number;
	};
	created_at: string;
	updated_at: string;
}

export interface MessageMetadata {
	steelman?: number | null;
	factCheck?: 'pending' | 'verified' | 'disputed' | null;
	[key: string]: any;
}

export interface DebateMessage {
	id: number;
	session_id: string;
	sender_id: string | null;
	sender_role: 'user' | 'ai';
	content: string;
	metadata: MessageMetadata;
	created_at: string;
}

export type CreateDebateInput = {
	persona_id: string;
	topic: string;
};
