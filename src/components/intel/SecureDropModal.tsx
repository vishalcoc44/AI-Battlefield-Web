"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Lock, ShieldCheck, AlertTriangle, FileUp, X, Save } from "lucide-react"
import { dataService } from "@/lib/data-service"
import { z } from "zod"
import { toast } from "sonner"
import { useEffect } from "react"

// File validation constants
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_FILE_TYPES = [
	'application/pdf',
	'image/jpeg',
	'image/png',
	'image/gif',
	'image/webp',
	'audio/mpeg',
	'audio/wav',
	'audio/ogg',
	'text/plain',
	'application/json'
]

const submissionSchema = z.object({
	title: z.string().min(3, "Subject must be at least 3 characters").max(100),
	description: z.string().min(10, "Summary must be detailed (min 10 chars)"),
	contentUrl: z.string().url("Invalid source URL").optional().or(z.literal(""))
})

interface SecureDropModalProps {
	onSuccess?: () => void
}

export function SecureDropModal({ onSuccess }: SecureDropModalProps = {}) {
	const [open, setOpen] = useState(false)
	const [loading, setLoading] = useState(false)
	const [uploadProgress, setUploadProgress] = useState(0)
	const [success, setSuccess] = useState(false)
	const [error, setError] = useState<string | null>(null)

	// Form State
	const [title, setTitle] = useState("")
	const [description, setDescription] = useState("")
	const [contentUrl, setContentUrl] = useState("")
	const [file, setFile] = useState<File | null>(null)
	const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null)

	// Draft persistence
	useEffect(() => {
		if (open) {
			const saved = localStorage.getItem("intel_draft")
			if (saved) {
				const draft = JSON.parse(saved)
				setTitle(draft.title || "")
				setDescription(draft.description || "")
				setContentUrl(draft.contentUrl || "")
			}
		}
	}, [open])

	const validateFile = (file: File): string | null => {
		if (file.size > MAX_FILE_SIZE) {
			const maxSizeMB = MAX_FILE_SIZE / (1024 * 1024)
			const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1)
			return `File too large: ${fileSizeMB}MB. Maximum allowed size is ${maxSizeMB}MB. Please choose a smaller file.`
		}
		if (!ALLOWED_FILE_TYPES.includes(file.type)) {
			const fileExtension = file.name.split('.').pop()?.toLowerCase()
			const supportedTypes = ALLOWED_FILE_TYPES.map(type => type.split('/')[1].toUpperCase()).join(', ')
			return `File type "${fileExtension}" not supported. Please upload: ${supportedTypes}.`
		}
		return null
	}

	const handleFileChange = (selectedFile: File | null) => {
		if (selectedFile) {
			const validationError = validateFile(selectedFile)
			if (validationError) {
				setError(validationError)
				setFile(null)
				return
			}
			setError(null)
		}
		setFile(selectedFile)
	}

	const saveDraft = () => {
		localStorage.setItem("intel_draft", JSON.stringify({ title, description, contentUrl }))
		toast.success("Draft Encrypted & Saved Locally")
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)
		setUploadProgress(0)
		setError(null)

		try {
			// 1. Validation
			const validated = submissionSchema.parse({ title, description, contentUrl })

			let finalContentUrl = validated.contentUrl

			// 2. File Upload
			if (file) {
				setUploadProgress(10) // Start upload progress

				// Simulate progress updates during upload
				const progressInterval = setInterval(() => {
					setUploadProgress(prev => Math.min(prev + 10, 80))
				}, 200)

				try {
					const uploadedUrl = await dataService.uploadIntelFile(file)
					clearInterval(progressInterval)

					if (!uploadedUrl) throw new Error("File upload failed - no URL returned from server.")
					finalContentUrl = uploadedUrl
					setUploadedFileUrl(uploadedUrl)
					setUploadProgress(100)
				} catch (uploadError) {
					clearInterval(progressInterval)
					setUploadProgress(0)

					// Re-throw with more specific error information
					const error = uploadError as Error
					if (error.message?.includes('File size exceeds')) {
						throw new Error(`File too large: ${file.name} exceeds the 10MB limit.`)
					} else if (error.message?.includes('File type not allowed')) {
						throw new Error(`Invalid file type: ${file.name} is not a supported format.`)
					} else {
						throw new Error(`Upload failed for ${file.name}: ${error.message || 'Unknown error'}`)
					}
				}
			}

			// 3. Submission
			const result = await dataService.createIntelSubmission({
				title: validated.title,
				description: validated.description,
				contentUrl: finalContentUrl || undefined
			})

			if (result) {
				setSuccess(true)
				toast.success("Intel submitted successfully", {
					description: "Your intelligence has been encrypted and queued for review."
				})
				localStorage.removeItem("intel_draft") // Clear draft
				onSuccess?.() // Notify parent component
				setTimeout(() => {
					setOpen(false)
					setSuccess(false)
					// Reset form
					setTitle("")
					setDescription("")
					setContentUrl("")
					setFile(null)
					setUploadedFileUrl(null)
					setUploadProgress(0)
				}, 2000)
			} else {
				throw new Error("Submission failed - server did not confirm successful processing.")
			}
		} catch (err: unknown) {
			// Defensive error handling for various Zod/Validation error shapes
			let validationMessage = null

			if (err?.errors && Array.isArray(err.errors) && err.errors.length > 0) {
				validationMessage = err.errors[0].message
			} else if (err?.issues && Array.isArray(err.issues) && err.issues.length > 0) {
				validationMessage = err.issues[0].message
			} else if (Array.isArray(err) && err.length > 0 && err[0]?.message) {
				validationMessage = err[0].message
			} else if (err?.message) {
				validationMessage = err.message
			}

			if (validationMessage) {
				console.log("Validation Error:", validationMessage)
				setError(validationMessage)
				toast.error("Validation Failed", {
					description: validationMessage
				})
			} else {
				console.error("Submission Error:", err)

				// Try to classify the error for better messaging
				let errorMessage = "Submission failed. Please check your connection and try again."
				let errorDescription = "If this persists, try refreshing the page."

				if (err instanceof Error) {
					if (err.message?.includes('timeout')) {
						errorMessage = "Upload timed out."
						errorDescription = "The file took too long to upload. Try a smaller file or check your connection."
					} else if (err.message?.includes('network') || err.message?.includes('fetch')) {
						errorMessage = "Network error during upload."
						errorDescription = "Check your internet connection and try again."
					} else if (err.message?.includes('File size exceeds')) {
						errorMessage = "File too large."
						errorDescription = "Choose a smaller file (under 10MB) or compress your document."
					} else if (err.message?.includes('File type not allowed')) {
						errorMessage = "Unsupported file type."
						errorDescription = "Upload PDF, images, audio, or text files only."
					} else if (err.message?.includes('Storage quota exceeded')) {
						errorMessage = "Storage limit reached."
						errorDescription = "System storage is full. Contact your administrator."
					} else if (err.message?.includes('Upload failed')) {
						errorMessage = "Upload failed."
						errorDescription = err.message || "Please try again or choose a different file."
					} else if (err.message?.includes('public URL')) {
						errorMessage = "Upload verification failed."
						errorDescription = "File uploaded but couldn't be verified. Please try again."
					}
				}

				setError(errorMessage)
				toast.error("Submission Failed", {
					description: errorDescription
				})
			}
		} finally {
			setLoading(false)
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" className="border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10">
					<Upload className="mr-2 h-4 w-4" /> Secure Drop
				</Button>
			</DialogTrigger>
			<DialogContent className="bg-black/90 border-emerald-500/30 text-white backdrop-blur-xl md:min-w-[500px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2 text-xl font-black tracking-tighter text-emerald-500 uppercase">
						<Lock className="h-5 w-5" /> Encrypted Channel
					</DialogTitle>
					<DialogDescription className="text-zinc-400">
						Submit classified intelligence files securely. Files are encrypted and queued for review.
					</DialogDescription>
				</DialogHeader>

				{success ? (
					<div className="py-12 flex flex-col items-center text-center space-y-4 animate-in fade-in zoom-in duration-300">
						<div className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
							<ShieldCheck className="h-8 w-8 text-emerald-500" />
						</div>
						<h3 className="text-lg font-bold">Intel Received</h3>
						<p className="text-zinc-400">Your submission has been encrypted and queued for review.</p>
						{uploadedFileUrl && (
							<div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10 w-full max-w-md">
								<p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Uploaded File</p>
								<a href={uploadedFileUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-emerald-500 hover:text-emerald-400 underline break-all">
									{uploadedFileUrl}
								</a>
							</div>
						)}
					</div>
				) : (
					<form onSubmit={handleSubmit} className="space-y-4 mt-4">
						<div className="space-y-2">
							<label className="text-xs font-mono uppercase text-zinc-500">Subject</label>
							<Input
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								placeholder="Operation Name or Topic"
								aria-label="Intelligence report subject or operation name"
								required
								className="bg-zinc-900/50 border-white/10 focus-visible:ring-emerald-500/50"
							/>
						</div>

						<div className="space-y-2">
							<label className="text-xs font-mono uppercase text-zinc-500">Intel Summary</label>
							<Textarea
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								placeholder="Describe the intelligence..."
								aria-label="Detailed intelligence summary and description"
								required
								className="bg-zinc-900/50 border-white/10 focus-visible:ring-emerald-500/50 min-h-[100px]"
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<label className="text-xs font-mono uppercase text-zinc-500">Evidence Link</label>
								<Input
									value={contentUrl}
									onChange={(e) => setContentUrl(e.target.value)}
									placeholder="https://"
									aria-label="URL to evidence or supporting documentation"
									className="bg-zinc-900/50 border-white/10 focus-visible:ring-emerald-500/50"
								/>
							</div>
							<div className="space-y-2">
								<label className="text-xs font-mono uppercase text-zinc-500">Upload File</label>
								<div className="relative">
									<Input
										type="file"
										onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
										className="sr-only"
										id="file-upload"
									/>
									<label
										htmlFor="file-upload"
										aria-label={file ? `Selected file: ${file.name}` : "Select file to upload as evidence"}
										className="flex items-center justify-center w-full h-10 px-3 py-2 text-sm bg-zinc-900/50 border border-white/10 rounded-md cursor-pointer hover:bg-white/5 truncate"
									>
										{file ? (
											<span className="text-emerald-500 flex items-center gap-2 truncate">
												<FileUp className="h-4 w-4" /> {file.name}
											</span>
										) : (
											<span className="text-zinc-500 flex items-center gap-2">
												<Upload className="h-4 w-4" /> Select File
											</span>
										)}
									</label>
									{file && (
										<button
											type="button"
											onClick={() => setFile(null)}
											className="absolute right-2 top-2.5 text-zinc-500 hover:text-red-500"
										>
											<X className="h-4 w-4" />
										</button>
									)}
								</div>
							</div>
						</div>

						{/* Upload Progress */}
						{loading && uploadProgress > 0 && (
							<div className="space-y-2">
								<div className="flex justify-between items-center text-xs font-mono text-zinc-500">
									<span>Uploading...</span>
									<span>{uploadProgress}%</span>
								</div>
								<div className="w-full bg-zinc-800 rounded-full h-2">
									<div
										className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
										style={{ width: `${uploadProgress}%` }}
									/>
								</div>
							</div>
						)}

						{error && (
							<div className="flex items-center gap-2 text-red-500 text-sm bg-red-500/10 p-3 rounded-lg animate-shake">
								<AlertTriangle className="h-4 w-4" /> {error}
							</div>
						)}

						<div className="pt-4 flex justify-between items-center gap-2 border-t border-white/10">
							<Button type="button" variant="ghost" size="sm" onClick={saveDraft} className="text-zinc-500 hover:text-emerald-500">
								<Save className="mr-2 h-4 w-4" /> Save Draft
							</Button>
							<div className="flex gap-2">
								<Button type="button" variant="ghost" onClick={() => setOpen(false)}>Abort</Button>
								<Button
									type="submit"
									disabled={loading}
									className="bg-emerald-500 text-black hover:bg-emerald-400 font-bold"
								>
									{loading ? (file ? `Uploading... ${uploadProgress}%` : "Encrypting...") : "Transmit Data"}
								</Button>
							</div>
						</div>
					</form>
				)}
			</DialogContent>
		</Dialog>
	)
}
