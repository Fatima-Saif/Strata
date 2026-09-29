import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

import { hashPassword } from '@/lib/password';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Create user in SQLite database with cryptographically hashed password
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        password: hashPassword(password),
        role: 'Admin', // Default to Admin for full demo experience
        avatar: name.substring(0, 2).toUpperCase(),
      },
    });

    // Create real-time notification in SQLite
    try {
      await prisma.notification.create({
        data: {
          title: 'New User Registered',
          description: `${user.name} (${user.email}) registered an account.`,
          category: 'System',
          read: false,
        },
      });
    } catch (notifErr) {
      console.warn('Could not record registration notification:', notifErr);
    }

    return NextResponse.json(
      {
        message: 'Account created successfully',
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
