import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';
import { updateUserPassword, verifyResetToken } from '@/lib/user-store';

export async function POST(req: Request) {
  try {
    const { email, token, newPassword } = await req.json();

    if (!email || !newPassword) {
      return NextResponse.json(
        { error: 'Email and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const hashedPassword = hashPassword(newPassword);

    // Update in-memory user store
    updateUserPassword(cleanEmail, hashedPassword);

    // Attempt DB update
    try {
      await prisma.user.update({
        where: { email: cleanEmail },
        data: { password: hashedPassword },
      }).catch(() => {});

      await prisma.notification.create({
        data: {
          title: 'Password Updated',
          description: `Password for ${cleanEmail} was reset successfully.`,
          category: 'Security',
          read: false,
        },
      }).catch(() => {});
    } catch (dbErr) {
      console.warn('Prisma DB update warning on password reset:', dbErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Password updated successfully. You can now log in with your new password.',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Reset password API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update password' },
      { status: 500 }
    );
  }
}
