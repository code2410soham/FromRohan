import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// -----------------------------------------------------------------------------
// ENVIRONMENT & SECRETS CONFIGURATION
// -----------------------------------------------------------------------------

// Server Port
export const PORT = parseInt(process.env.PORT || '3001', 10);
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const IS_PRODUCTION = NODE_ENV === 'production';

// Target Birthday Unlock Time: October 11, 2026, at 12:00:00 AM IST (+05:30)
// Exact timestamp: 2026-10-11T00:00:00+05:30
export const BIRTHDAY_TARGET_TIME = process.env.BIRTHDAY_TARGET_TIME || '2026-10-11T00:00:00+05:30';

// Server-side Secret PIN: Never exposed to client
export const BIRTHDAY_PIN = process.env.BIRTHDAY_PIN || '2311';

// Session Secret for HMAC signing (min 32 bytes)
export const SESSION_SECRET = process.env.SESSION_SECRET || (() => {
  // Safe ephemeral secret in development if not provided in .env
  return crypto.randomBytes(32).toString('hex');
})();

// AES-256-GCM Master Encryption Key (32 bytes = 256 bits)
// In production, must be provided as a 64-char hex string or 32-byte key in env
export const IMAGE_ENCRYPTION_KEY = (() => {
  const envKey = process.env.IMAGE_ENCRYPTION_KEY;
  if (envKey) {
    if (envKey.length === 64) {
      return Buffer.from(envKey, 'hex');
    }
    return crypto.createHash('sha256').update(envKey).digest();
  }
  // Deterministic seed for development if not provided, ensuring consistency
  const devSeed = 'birthday-production-aes-256-gcm-master-key-seed-2026-10-11';
  return crypto.createHash('sha256').update(devSeed).digest();
})();

// Paths
export const ROOT_DIR = path.resolve(__dirname, '..');
export const STORAGE_DIR = path.resolve(__dirname, 'storage');
export const ENCRYPTED_PHOTOS_DIR = path.resolve(STORAGE_DIR, 'encrypted_photos');
export const BACKUP_PHOTOS_DIR = path.resolve(STORAGE_DIR, 'original_photos_backup');
export const PUBLIC_DIR = path.resolve(ROOT_DIR, 'public');
export const DIST_DIR = path.resolve(ROOT_DIR, 'dist');
export const MANIFEST_PATH = path.resolve(STORAGE_DIR, 'photos_manifest.json');

// Session Settings
export const SESSION_COOKIE_NAME = 'birthday_session';
export const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours
