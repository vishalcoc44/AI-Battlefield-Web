import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
	try {
		const imagesDir = path.join(process.cwd(), 'public', 'images');

		// Check if directory exists
		if (!fs.existsSync(imagesDir)) {
			console.warn(`Images directory not found at ${imagesDir}`);
			return NextResponse.json([], { status: 200 });
		}

		const files = fs.readdirSync(imagesDir);

		// Filter for valid image files
		const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];
		const imageFiles = files
			.filter(file => {
				const ext = path.extname(file).toLowerCase();
				return validExtensions.includes(ext);
			})
			.map(file => `/images/${file}`);

		return NextResponse.json(imageFiles);
	} catch (error) {
		console.error('Error reading images directory:', error);
		return NextResponse.json(
			{ error: 'Failed to read images' },
			{ status: 500 }
		);
	}
}
