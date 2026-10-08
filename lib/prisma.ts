import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

// Detect Vercel serverless environment
const isVercel = Boolean(process.env.VERCEL || process.env.NEXT_PUBLIC_VERCEL_ENV);

// On Vercel, local file:dev.db is read-only and causes SQLITE_CANTOPEN (error 14).
// Use :memory: or /tmp/dev.db as fallback when DATABASE_URL is not specified on Vercel.
const defaultUrl = isVercel ? 'file::memory:?cache=shared' : 'file:dev.db';
const databaseUrl = process.env.DATABASE_URL || defaultUrl;

let prismaInstance: PrismaClient;

try {
  const adapter = new PrismaLibSql({
    url: databaseUrl,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });

  const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
  };

  prismaInstance =
    globalForPrisma.prisma ??
    new PrismaClient({
      adapter,
    });

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prismaInstance;
  }
} catch (err) {
  console.warn('Prisma initialization fallback:', err);
  prismaInstance = new PrismaClient();
}

export const prisma = prismaInstance;
