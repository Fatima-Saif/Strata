import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all invoices from SQLite
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const invoices = await prisma.invoice.findMany({
      where: status ? { status } : undefined,
      orderBy: { issueDate: 'desc' },
    });

    return NextResponse.json({ success: true, invoices });
  } catch (error: any) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST create or update invoice in SQLite
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.action === 'update_status') {
      const { id, status } = body;
      const updated = await prisma.invoice.update({
        where: { id },
        data: { status },
      });
      return NextResponse.json({ success: true, invoice: updated });
    }

    const { customerName, customerEmail, amount, currency, status, dueDate, items } = body;

    if (!customerName || !amount) {
      return NextResponse.json({ error: 'Customer name and amount are required' }, { status: 400 });
    }

    const invoiceCount = await prisma.invoice.count();
    const invoiceNumber = `INV-2026-${String(invoiceCount + 1).padStart(4, '0')}`;

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        customerName,
        customerEmail: customerEmail || 'customer@example.com',
        amount: parseFloat(amount),
        currency: currency || 'USD',
        status: status || 'pending',
        dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        itemsJson: items ? JSON.stringify(items) : null,
      },
    });

    return NextResponse.json({ success: true, invoice }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
