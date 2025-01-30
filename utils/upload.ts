import { put } from '@vercel/blob';
import { nanoid } from 'nanoid';

export async function uploadVideo(file: File) {
  try {
    // Generate a unique filename
    const filename = `${nanoid()}-${file.name}`;

    // Upload to Vercel Blob
    const { url } = await put(filename, file, {
      access: 'public',
      addRandomSuffix: true,
    });

    return url;
  } catch (error) {
    console.error('Error uploading video:', error);
    throw new Error('Failed to upload video');
  }
}
