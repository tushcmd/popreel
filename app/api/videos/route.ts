import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { nanoid } from 'nanoid';

export async function POST(req: Request) {
  try {
    // Get the current user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('video') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const categories = JSON.parse(
      formData.get('categories') as string
    ) as string[];

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Upload to Vercel Blob
    const filename = `${nanoid()}-${file.name}`;
    const { url } = await put(filename, file, {
      access: 'public',
      addRandomSuffix: true,
    });

    // Create video record in database
    const video = await db.video.create({
      data: {
        title,
        description,
        videoUrl: url,
        userId: user.id,
        duration: 0, // Add appropriate duration value
        // Create category relationships
        categories: {
          create: categories.map((categoryId) => ({
            category: {
              connect: { id: categoryId },
            },
          })),
        },
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    return NextResponse.json({ video });
  } catch (error) {
    console.error('Error uploading video:', error);
    return NextResponse.json(
      { error: 'Failed to upload video' },
      { status: 500 }
    );
  }
}
