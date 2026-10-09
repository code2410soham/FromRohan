import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { IMAGE_ENCRYPTION_KEY } from './config.js';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96 bits standard for GCM (NIST SP 800-38D)
const TAG_LENGTH = 16; // 128 bits authentication tag

/**
 * Encrypt a buffer with AES-256-GCM.
 * Output format: [12-byte IV][16-byte AuthTag][Ciphertext]
 */
export function encryptBuffer(buffer, key = IMAGE_ENCRYPTION_KEY) {
  if (!Buffer.isBuffer(key) || key.length !== 32) {
    throw new Error('Encryption key must be a 32-byte Buffer (AES-256).');
  }

  // Generate unique, cryptographically secure IV per encryption
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, { authTagLength: TAG_LENGTH });

  const ciphertext = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Combine [IV (12)] + [AuthTag (16)] + [Ciphertext (N)]
  return Buffer.concat([iv, authTag, ciphertext]);
}

/**
 * Decrypt a buffer with AES-256-GCM.
 * Validates integrity via AuthTag; throws if tampered with.
 */
export function decryptBuffer(encryptedBuffer, key = IMAGE_ENCRYPTION_KEY) {
  if (!Buffer.isBuffer(key) || key.length !== 32) {
    throw new Error('Encryption key must be a 32-byte Buffer (AES-256).');
  }

  if (encryptedBuffer.length < IV_LENGTH + TAG_LENGTH) {
    throw new Error('Corrupt or truncated ciphertext payload.');
  }

  // Extract components
  const iv = encryptedBuffer.subarray(0, IV_LENGTH);
  const authTag = encryptedBuffer.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
  const ciphertext = encryptedBuffer.subarray(IV_LENGTH + TAG_LENGTH);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, { authTagLength: TAG_LENGTH });
  decipher.setAuthTag(authTag);

  try {
    const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    return plaintext;
  } catch (err) {
    throw new Error('Decryption failed: integrity check failed or wrong encryption key.');
  }
}

/**
 * Encrypt file on disk and write to destination.
 */
export function encryptFile(srcPath, destPath, key = IMAGE_ENCRYPTION_KEY) {
  const data = fs.readFileSync(srcPath);
  const encrypted = encryptBuffer(data, key);
  const dir = path.dirname(destPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(destPath, encrypted);
  return {
    srcBytes: data.length,
    encBytes: encrypted.length,
    sha256: crypto.createHash('sha256').update(data).digest('hex')
  };
}

/**
 * Decrypt file from disk into memory buffer.
 */
export function decryptFile(encPath, key = IMAGE_ENCRYPTION_KEY) {
  const encData = fs.readFileSync(encPath);
  return decryptBuffer(encData, key);
}
