import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Initial seeds if SQLite has 0 notifications
const INITIAL_SEEDS = [
  {
    title: 'Workspace Initialized',
    description: 'Strata enterprise operations platform initialized with LibSQL database.',
    category: 'System',
  },
  {
    title: 'Security Audit Passed',
    description: 'Zero vulnerabilities detected in continuous integrity check.',
    category: 'Security',
  },
  {
    title: 'Enterprise Billing Active',
    description: 'Annual cloud subscription active with multi-region replication.',
    category: 'Billing',
  },
  {
    title: 'Version 2.4 Deployed',
    description: 'Real-time event stream and notification engine deployed.',
    category: 'Updates',
  },
];

// GET: Fetch real notifications from SQLite
export async function GET() {
  try {
    let notifications = await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    // Auto-seed if database is empty
    if (notifications.length === 0) {
      await prisma.notification.createMany({
        data: INITIAL_SEEDS.map((s) => ({
          title: s.title,
          description: s.description,
          category: s.category,
          read: false,
        })),
      });

      notifications = await prisma.notification.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
    }

    const unreadCount = notifications.filter((n: any) => !n.read).length;

    return NextResponse.json({
      success: true,
      notifications: notifications.map((n: any) => ({
        id: n.id,
        title: n.title,
        description: n.description,
        category: n.category,
        read: n.read,
        timestamp: n.createdAt.toISOString(),
      })),
      unreadCount,
    });
  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

// POST: Create a new notification in SQLite
export async function POST(req: Request) {
  try {
    const { title, description, category } = await req.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    const notification = await prisma.notification.create({
      data: {
        title,
        description,
        category: category || 'System',
        read: false,
      },
    });

    return NextResponse.json(
      {
        success: true,
        notification: {
          id: notification.id,
          title: notification.title,
          description: notification.description,
          category: notification.category,
          read: notification.read,
          timestamp: notification.createdAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PATCH: Mark one or all notifications as read
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, all, read } = body;

    if (all) {
      await prisma.notification.updateMany({
        data: { read: true },
      });
      return NextResponse.json({ success: true, message: 'All notifications marked as read' });
    }

    if (id) {
      const updated = await prisma.notification.update({
        where: { id },
        data: { read: read !== undefined ? Boolean(read) : true },
      });
      return NextResponse.json({ success: true, notification: updated });
    }

    return NextResponse.json({ error: 'Missing id or all parameter' }, { status: 400 });
  } catch (error: any) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete one or all notifications
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const all = searchParams.get('all');

    if (all === 'true') {
      await prisma.notification.deleteMany({});
      return NextResponse.json({ success: true, message: 'All notifications deleted' });
    }

    if (id) {
      await prisma.notification.delete({
        where: { id },
      });
      return NextResponse.json({ success: true, message: 'Notification deleted' });
    }

    // Also support JSON body
    try {
      const body = await req.json();
      if (body.all) {
        await prisma.notification.deleteMany({});
        return NextResponse.json({ success: true, message: 'All notifications deleted' });
      }
      if (body.id) {
        await prisma.notification.delete({ where: { id: body.id } });
        return NextResponse.json({ success: true, message: 'Notification deleted' });
      }
    } catch {
      // Body not provided or not JSON
    }

    return NextResponse.json({ error: 'Missing id or all parameter' }, { status: 400 });
  } catch (error: any) {
    console.error('Error deleting notification:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
