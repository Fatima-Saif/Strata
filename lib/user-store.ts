import { hashPassword, verifyPassword } from './password';

export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  password: string; // hashed or plain
  role: string;
  createdAt: Date;
}

export interface ResetTokenData {
  email: string;
  token: string;
  expiresAt: Date;
}

// Global in-memory user store for serverless environments (Vercel)
const globalForUsers = globalThis as unknown as {
  inMemoryUsers: Map<string, RegisteredUser> | undefined;
  resetTokens: Map<string, ResetTokenData> | undefined;
};

export const inMemoryUsers =
  globalForUsers.inMemoryUsers ?? new Map<string, RegisteredUser>();

export const resetTokens =
  globalForUsers.resetTokens ?? new Map<string, ResetTokenData>();

if (process.env.NODE_ENV !== 'production') {
  globalForUsers.inMemoryUsers = inMemoryUsers;
  globalForUsers.resetTokens = resetTokens;
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

export function updateUserPassword(email: string, newPasswordHash: string): boolean {
  const normalizedEmail = email.toLowerCase().trim();
  const existing = inMemoryUsers.get(normalizedEmail);
  if (existing) {
    existing.password = newPasswordHash;
    inMemoryUsers.set(normalizedEmail, existing);
    return true;
  }
  // Even if not in memory, register them with new password hash
  const derivedName = normalizedEmail.split('@')[0].replace(/[._\d]/g, ' ').trim() || 'User';
  registerInMemoryUser(derivedName, normalizedEmail, newPasswordHash, 'Admin');
  return true;
}

export function storeResetToken(email: string, token: string): ResetTokenData {
  const data: ResetTokenData = {
    email: email.toLowerCase().trim(),
    token,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
  };
  resetTokens.set(token, data);
  return data;
}

export function verifyResetToken(token: string): ResetTokenData | undefined {
  const data = resetTokens.get(token);
  if (!data) return undefined;
  if (new Date() > data.expiresAt) {
    resetTokens.delete(token);
    return undefined;
  }
  return data;
}
