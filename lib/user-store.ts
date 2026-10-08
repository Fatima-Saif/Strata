import { hashPassword, verifyPassword } from './password';

export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  password: string; // hashed or plain
  role: string;
  createdAt: Date;
}

// Global in-memory user store for serverless environments (Vercel)
const globalForUsers = globalThis as unknown as {
  inMemoryUsers: Map<string, RegisteredUser> | undefined;
};

export const inMemoryUsers =
  globalForUsers.inMemoryUsers ?? new Map<string, RegisteredUser>();

if (process.env.NODE_ENV !== 'production') {
  globalForUsers.inMemoryUsers = inMemoryUsers;
}

export function registerInMemoryUser(name: string, email: string, passwordHash: string, role = 'Admin'): RegisteredUser {
  const normalizedEmail = email.toLowerCase().trim();
  const user: RegisteredUser = {
    id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name,
    email: normalizedEmail,
    password: passwordHash,
    role,
    createdAt: new Date(),
  };
  inMemoryUsers.set(normalizedEmail, user);
  return user;
}

export function findInMemoryUser(email: string): RegisteredUser | undefined {
  return inMemoryUsers.get(email.toLowerCase().trim());
}
