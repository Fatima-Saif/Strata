import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { storeResetToken } from '@/lib/user-store';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const token = Math.random().toString(36).substring(2, 12) + Date.now().toString(36);

    // Save token in reset token registry
    storeResetToken(cleanEmail, token);

    // Construct full reset URL
    const url = new URL(req.url);
    const origin = url.origin;
    const resetUrl = `${origin}/forgot-password/reset?token=${token}&email=${encodeURIComponent(cleanEmail)}`;

    // Optional: Log or trigger notifications
    try {
      await prisma.notification.create({
        data: {
          title: 'Password Reset Requested',
          description: `Password reset link requested for ${cleanEmail}.`,
          category: 'Security',
          read: false,
        },
      }).catch(() => {});
    } catch {}

    return NextResponse.json(
      {
        success: true,
        message: 'Password reset link generated successfully.',
        email: cleanEmail,
        token,
        resetUrl,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Forgot password API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process password reset request' },
      { status: 500 }
    );
  }
}
