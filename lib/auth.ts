// lib/auth.ts
import { auth } from '@clerk/nextjs/server';
import { db } from './db';

export async function getCurrentUser() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return null;
    }

    const dbUser = await db.user.findUnique({
      where: { clerkId: userId },
    });

    return dbUser;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function createUser(
  clerkId: string,
  email: string,
  username: string
) {
  try {
    const user = await db.user.create({
      data: {
        clerkId,
        username,
        onboarded: false,
      },
    });

    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
}
