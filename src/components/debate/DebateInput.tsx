import { useState, KeyboardEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Loader2 } from "lucide-react"
import { DEBATE_CONSTANTS } from "@/lib/constants/debate"
import { toast } from "sonner"

interface DebateInputProps {
	onSend: (text: string) => Promise<void>;
	disabled?: boolean;
	placeholder?: string;
	defaultValue?: string;
}

export function DebateInput({ onSend, disabled, placeholder, defaultValue = "" }: DebateInputProps) {
	const [value, setValue] = useState(defaultValue);
	const [isSending, setIsSending] = useState(false);

	const handleSend = async () => {
		const text = value.trim();
		if (!text) return;

		if (text.length > DEBATE_CONSTANTS.UI.MAX_INPUT_LENGTH) {
			toast.error(`Message too long. Max ${DEBATE_CONSTANTS.UI.MAX_INPUT_LENGTH} characters.`);
			return;
		}

		setIsSending(true);
		try {
			await onSend(text);
			setValue("");
		} catch (error) {
			// Error already toasted by hook, but we keep the value here so user can retry
			console.error("Failed to send in UI", error);
		} finally {
			setIsSending(false);
		}
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	return (
		<div className="p-4 bg-card border-t sticky bottom-0 z-30 shadow-[0_-5px_10px_rgba(0,0,0,0.05)]">
			<div className="max-w-4xl mx-auto flex gap-2">
				<Input
					placeholder={placeholder || "Construct your argument..."}
					className="flex-1"
					value={value}
					onChange={(e) => setValue(e.target.value)}
					onKeyDown={handleKeyDown}
					disabled={disabled}
					maxLength={DEBATE_CONSTANTS.UI.MAX_INPUT_LENGTH}
					aria-label="Debate argument input"
				/>
				<Button
					onClick={handleSend}
					size="icon"
					className="bg-blue-600 hover:bg-blue-700 shrink-0"
					disabled={disabled || isSending || !value.trim()}
					aria-label="Send argument"
				>
					{disabled || isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
				</Button>
			</div>
			<div className="max-w-4xl mx-auto mt-1 text-right">
				<span className={`text-[10px] ${value.length > DEBATE_CONSTANTS.UI.MAX_INPUT_LENGTH * 0.9 ? 'text-red-500' : 'text-muted-foreground'}`}>
					{value.length}/{DEBATE_CONSTANTS.UI.MAX_INPUT_LENGTH}
				</span>
			</div>
		</div>
	)
}
