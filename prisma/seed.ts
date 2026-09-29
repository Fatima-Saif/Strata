import { prisma } from '../lib/prisma';

async function main() {
  console.log('Seeding SQLite database via Prisma + LibSQL...');

  // 1. Create Default Admin & Team Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@acme.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@acme.com',
      password: 'password123',
      role: 'Admin',
      avatar: 'AD',
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: 'marcus@acme.com' },
    update: {},
    create: {
      name: 'Marcus Chen',
      email: 'marcus@acme.com',
      password: 'password123',
      role: 'Manager',
      avatar: 'MC',
    },
  });

  const dev = await prisma.user.upsert({
    where: { email: 'elena@acme.com' },
    update: {},
    create: {
      name: 'Elena Rostova',
      email: 'elena@acme.com',
      password: 'password123',
      role: 'Developer',
      avatar: 'ER',
    },
  });

  // 2. Create Sample Projects & Kanban Tasks
  const proj1 = await prisma.project.create({
    data: {
      name: 'Core Engine v2 Migration',
      description: 'Migrating legacy endpoints to edge handlers with sub-40ms latency',
      status: 'in_progress',
      priority: 'urgent',
      progress: 75,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      tasks: {
        create: [
          {
            title: 'Set up edge middleware',
            description: 'Configure routing and auth guards for edge runtime',
            column: 'done',
            priority: 'urgent',
            assigneeId: admin.id,
          },
          {
            title: 'Implement DB connection pooling',
            description: 'Tune Prisma client singleton and query caching',
            column: 'in_progress',
            priority: 'normal',
            assigneeId: dev.id,
          },
          {
            title: 'Benchmarking load testing',
            description: 'Verify 10,000 req/sec throughput under pressure',
            column: 'todo',
            priority: 'normal',
            assigneeId: manager.id,
          },
        ],
      },
    },
  });

  const proj2 = await prisma.project.create({
    data: {
      name: 'Stripe Tax & Webhook Integration',
      description: 'Automating multi-currency invoicing and automatic sales tax compliance',
      status: 'in_progress',
      priority: 'high',
      progress: 90,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      tasks: {
        create: [
          {
            title: 'Webhook signature validation',
            description: 'HMAC SHA-256 signature check',
            column: 'done',
            priority: 'urgent',
            assigneeId: admin.id,
          },
          {
            title: 'PDF Invoice generator styling',
            description: 'Match corporate branded theme in printable format',
            column: 'done',
            priority: 'normal',
            assigneeId: dev.id,
          },
        ],
      },
    },
  });

  // 3. Create Sample Invoices
  await prisma.invoice.createMany({
    data: [
      {
        invoiceNumber: 'INV-2026-001',
        customerName: 'HyperScale Cloud Inc.',
        customerEmail: 'billing@hyperscale.io',
        amount: 14200.0,
        currency: 'USD',
        status: 'paid',
        issueDate: new Date('2026-08-15'),
        dueDate: new Date('2026-09-15'),
      },
      {
        invoiceNumber: 'INV-2026-002',
        customerName: 'Nexis Financial Systems',
        customerEmail: 'finance@nexis.co',
        amount: 8750.0,
        currency: 'USD',
        status: 'paid',
        issueDate: new Date('2026-08-28'),
        dueDate: new Date('2026-09-28'),
      },
      {
        invoiceNumber: 'INV-2026-003',
        customerName: 'Vanguard Global Corp',
        customerEmail: 'accounts@vanguard-tech.com',
        amount: 2450.0,
        currency: 'USD',
        status: 'pending',
        issueDate: new Date('2026-09-10'),
        dueDate: new Date('2026-10-10'),
      },
    ],
  });

  console.log('SUCCESS_DATABASE_SEEDED!');
}

main()
  .catch((e) => {
    console.error('SEEDING_ERROR:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
