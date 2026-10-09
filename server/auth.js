import crypto from 'crypto';
import {
  BIRTHDAY_PIN,
  BIRTHDAY_TARGET_TIME,
  SESSION_SECRET,
  SESSION_MAX_AGE_MS
} from './config.js';

// In-memory rate limiting store: Map<ip, { attempts: number, lockoutUntil: number, lastAttempt: number }>
const rateLimitMap = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Clean up stale rate-limiting entries periodically.
 */
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitMap.entries()) {
    if (now > data.lockoutUntil && now - data.lastAttempt > LOCKOUT_DURATION_MS) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000);

/**
 * Check if the birthday deadline has passed using server clock.
 * Timezone-safe using ISO 8601 offset (+05:30 for Asia/Kolkata).
 */
export function isDeadlinePassed() {
  const now = process.env.TEST_OVERRIDE_TIME 
    ? new Date(process.env.TEST_OVERRIDE_TIME).getTime() 
    : Date.now();
  const target = new Date(BIRTHDAY_TARGET_TIME).getTime();
  return now >= target;
}

/**
 * Get remaining milliseconds until birthday unlock.
 */
export function getRemainingMs() {
  const now = process.env.TEST_OVERRIDE_TIME 
    ? new Date(process.env.TEST_OVERRIDE_TIME).getTime() 
    : Date.now();
  const target = new Date(BIRTHDAY_TARGET_TIME).getTime();
  return Math.max(0, target - now);
}

/**
 * Verify PIN in constant time to prevent timing attacks.
 */
export function verifyPinTimingSafe(candidatePin) {
  if (typeof candidatePin !== 'string') return false;

  const actualPin = String(BIRTHDAY_PIN);

  // Hash both with HMAC to create fixed-length 32-byte buffers
  const candidateHash = crypto.createHmac('sha256', SESSION_SECRET).update(candidatePin.trim()).digest();
  const actualHash = crypto.createHmac('sha256', SESSION_SECRET).update(actualPin.trim()).digest();

  // Timing-safe buffer comparison
  return crypto.timingSafeEqual(candidateHash, actualHash);
}

/**
 * Rate limit check for PIN attempts.
 */
export function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { attempts: 0, lockoutUntil: 0, lastAttempt: now };

  if (now < record.lockoutUntil) {
    const remainingSeconds = Math.ceil((record.lockoutUntil - now) / 1000);
    return {
      allowed: false,
      remainingSeconds,
      message: `Too many attempts. Locked out for ${remainingSeconds} seconds.`
    };
  }

  return { allowed: true, remainingAttempts: MAX_ATTEMPTS - record.attempts };
}

/**
 * Record a failed attempt. Locks out if threshold exceeded.
 */
export function recordFailedAttempt(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { attempts: 0, lockoutUntil: 0, lastAttempt: now };

  record.attempts += 1;
  record.lastAttempt = now;

  if (record.attempts >= MAX_ATTEMPTS) {
    record.lockoutUntil = now + LOCKOUT_DURATION_MS;
    rateLimitMap.set(ip, record);
    return {
      locked: true,
      remainingSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000)
    };
  }

  rateLimitMap.set(ip, record);
  return {
    locked: false,
    remainingAttempts: MAX_ATTEMPTS - record.attempts
  };
}

/**
 * Reset rate limit on successful authentication.
 */
export function resetRateLimit(ip) {
  rateLimitMap.delete(ip);
}

/**
 * Issue a cryptographically signed session token.
 */
export function createSessionToken() {
  const sessionId = crypto.randomBytes(24).toString('hex');
  const createdAt = Date.now();
  const expiresAt = createdAt + SESSION_MAX_AGE_MS;

  const payload = JSON.stringify({ sessionId, authenticated: true, createdAt, expiresAt });
  const encodedPayload = Buffer.from(payload).toString('base64url');

  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  return `${encodedPayload}.${signature}`;
}

/**
 * Verify and decode session token.
 */
export function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [encodedPayload, candidateSignature] = parts;

  const expectedSignature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  // Constant-time signature verification
  const sigBufferA = Buffer.from(candidateSignature);
  const sigBufferB = Buffer.from(expectedSignature);

  if (sigBufferA.length !== sigBufferB.length) return null;
  if (!crypto.timingSafeEqual(sigBufferA, sigBufferB)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
    if (!payload.authenticated || payload.expiresAt <= Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}
