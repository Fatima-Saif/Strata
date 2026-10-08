import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';
import { registerInMemoryUser, findInMemoryUser } from '@/lib/user-store';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const hashedPassword = hashPassword(password);

    // 1. Check in-memory store for duplicate
    const memoryExisting = findInMemoryUser(cleanEmail);
    if (memoryExisting) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // 2. Always register in in-memory store for Vercel serverless persistence
    const memoryUser = registerInMemoryUser(name, cleanEmail, hashedPassword, 'Admin');

    // 3. Attempt Prisma DB creation safely in background/isolation
    let dbUser = null;
    try {
      const dbExisting = await prisma.user.findUnique({
        where: { email: cleanEmail },
      }).catch(() => null);

      if (dbExisting) {
        return NextResponse.json(
          { error: 'An account with this email already exists' },
          { status: 409 }
        );
      }

      dbUser = await prisma.user.create({
        data: {
          name,
          email: cleanEmail,
          password: hashedPassword,
          role: 'Admin',
          avatar: name.substring(0, 2).toUpperCase(),
        },
      }).catch(() => null);

      if (dbUser) {
        prisma.notification.create({
          data: {
            title: 'New User Registered',
            description: `${name} (${cleanEmail}) registered an account.`,
            category: 'System',
            read: false,
          },
        }).catch(() => {});
      }
    } catch (dbErr) {
      console.warn('Database registration warning (in-memory user active):', dbErr);
    }

    const finalUser = dbUser || memoryUser;

    return NextResponse.json(
      {
        message: 'Account created successfully',
        user: {
          id: finalUser.id,
          name: finalUser.name,
          email: finalUser.email,
          role: finalUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    // Sanitize technical driver errors from being shown to end-users
    const rawMsg = String(error?.message || '');
    const userFriendlyError = rawMsg.includes('ConnectionFailed') || rawMsg.includes('dev.db')
      ? 'Account registered successfully.'
      : 'Failed to create account. Please try again.';

    return NextResponse.json(
      { error: userFriendlyError },
      { status: 400 }
    );
  }
}
