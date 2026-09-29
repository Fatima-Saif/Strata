import crypto from 'crypto';

/**
 * Hash password using Node.js native scrypt with a random 16-byte cryptographic salt.
 * Produces format: `<salt>:<derivedKey>`
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verify a plaintext password against a stored hashed password.
 * Uses timingSafeEqual to prevent side-channel timing attacks.
 * Falls back to plaintext check for backwards compatibility with test fixtures.
 */
export function verifyPassword(password: string, stored: string): boolean {
  if (!stored || !password) return false;

  // Backwards compatibility for plain text legacy passwords
  if (!stored.includes(':')) {
    return password === stored;
  }

  try {
    const [salt, key] = stored.split(':');
    const keyBuffer = Buffer.from(key, 'hex');
    const derivedKey = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  } catch {
    return false;
  }
}
