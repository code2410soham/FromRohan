import express from 'express';
import fs from 'fs';
import path from 'path';
import {
  isDeadlinePassed,
  getRemainingMs,
  verifyPinTimingSafe,
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
  createSessionToken,
  verifySessionToken
} from '../auth.js';
import { decryptFile } from '../crypto.js';
import {
  MANIFEST_PATH,
  ENCRYPTED_PHOTOS_DIR,
  SESSION_COOKIE_NAME,
  BIRTHDAY_TARGET_TIME
} from '../config.js';
import { getSessionCookieOptions, csrfProtection } from '../security.js';

const router = express.Router();

/**
 * Authentication Middleware
 * Requires:
 * 1. Birthday unlock deadline has passed on the server
 * 2. Client has a valid, non-expired session cookie
 */
export function requireAuth(req, res, next) {
  // 1. Check server-side deadline
  if (!isDeadlinePassed()) {
    return res.status(403).json({
      error: 'Access denied: The birthday surprise has not unlocked yet.',
      unlocked: false
    });
  }

  // 2. Check session token
  const token = req.cookies?.[SESSION_COOKIE_NAME];
  const session = verifySessionToken(token);

  if (!session) {
    return res.status(401).json({
      error: 'Unauthorized: A valid PIN session is required to access this resource.',
      authenticated: false
    });
  }

  req.session = session;
  next();
}

/**
 * GET /api/status
 * Public status endpoint. Returns unlock status based strictly on server clock.
 */
router.get('/status', (req, res) => {
  const token = req.cookies?.[SESSION_COOKIE_NAME];
  const session = verifySessionToken(token);
  const unlocked = isDeadlinePassed();
  const remainingMs = getRemainingMs();

  res.json({
    unlocked,
    remainingMs,
    serverTime: new Date().toISOString(),
    targetTime: BIRTHDAY_TARGET_TIME,
    authenticated: Boolean(unlocked && session)
  });
});

/**
 * POST /api/unlock
 * Authenticate with PIN. Protected by rate limiting, timing-safe checks, and deadline enforcement.
 */
router.post('/unlock', csrfProtection, (req, res) => {
  const clientIp = req.ip || req.connection.remoteAddress || 'unknown';

  // 1. Enforce server-side deadline: reject any unlock attempts before deadline
  if (!isDeadlinePassed()) {
    return res.status(403).json({
      error: 'The surprise is strictly locked until October 11, 2026, 12:00 AM IST.',
      unlocked: false
    });
  }

  // 2. Check rate limit
  const rateCheck = checkRateLimit(clientIp);
  if (!rateCheck.allowed) {
    return res.status(429).json({
      error: rateCheck.message,
      remainingSeconds: rateCheck.remainingSeconds
    });
  }

  const { pin } = req.body || {};

  if (!pin || typeof pin !== 'string') {
    return res.status(400).json({
      error: 'PIN is required.'
    });
  }

  // 3. Timing-safe PIN verification
  const isValid = verifyPinTimingSafe(pin);

  if (!isValid) {
    const failRecord = recordFailedAttempt(clientIp);

    // Artificial delay to prevent automated high-speed brute forcing
    setTimeout(() => {
      if (failRecord.locked) {
        return res.status(429).json({
          error: `Too many incorrect attempts. Locked out for ${failRecord.remainingSeconds} seconds.`,
          remainingSeconds: failRecord.remainingSeconds
        });
      }

      return res.status(401).json({
        error: 'Not quite right, try again 💗',
        remainingAttempts: failRecord.remainingAttempts
      });
    }, 250);
    return;
  }

  // 4. Success: reset rate limit & issue authenticated session
  resetRateLimit(clientIp);
  const sessionToken = createSessionToken();

  res.cookie(SESSION_COOKIE_NAME, sessionToken, getSessionCookieOptions());

  res.json({
    success: true,
    authenticated: true,
    message: 'Welcome! Happy Birthday!'
  });
});

/**
 * POST /api/logout
 * Revoke session and lock the website.
 */
router.post('/logout', csrfProtection, (req, res) => {
  res.clearCookie(SESSION_COOKIE_NAME, {
    path: '/',
    sameSite: 'strict',
    httpOnly: true
  });

  res.json({
    success: true,
    message: 'Session ended successfully.'
  });
});

/**
 * GET /api/photos
 * Returns gallery photos metadata. Requires deadline passed + active session.
 */
router.get('/photos', requireAuth, (req, res) => {
  if (!fs.existsSync(MANIFEST_PATH)) {
    return res.json([]);
  }

  try {
    const rawManifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    // Map to safe client URLs served through the authenticated endpoint
    const photos = rawManifest.map((item) => ({
      id: item.id,
      src: `/api/photos/${encodeURIComponent(item.filename)}`,
      filename: item.filename,
      rotation: item.rotation,
      washiColor: item.washiColor,
      tapePosition: item.tapePosition,
      sizeVariant: item.sizeVariant
    }));

    res.json(photos);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve photo metadata.' });
  }
});

/**
 * GET /api/photos/:filename
 * Decrypt and stream image on the fly with AES-256-GCM.
 * Requires deadline passed + active session.
 */
router.get('/photos/:filename', requireAuth, (req, res) => {
  const targetFilename = req.params.filename;

  if (!fs.existsSync(MANIFEST_PATH)) {
    return res.status(404).json({ error: 'Photo not found.' });
  }

  try {
    const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    const entry = manifest.find((item) => item.filename === targetFilename);

    if (!entry) {
      return res.status(404).json({ error: 'Photo not found.' });
    }

    const encFilePath = path.join(ENCRYPTED_PHOTOS_DIR, entry.encFile);
    if (!fs.existsSync(encFilePath)) {
      return res.status(404).json({ error: 'Encrypted asset missing.' });
    }

    // Decrypt AES-256-GCM file in memory
    const decryptedBuffer = decryptFile(encFilePath);

    // Set secure response headers
    res.setHeader('Content-Type', entry.mimeType || 'image/jpeg');
    res.setHeader('Cache-Control', 'private, no-store, max-age=0, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    res.send(decryptedBuffer);
  } catch (err) {
    res.status(500).json({ error: 'Failed to decrypt asset.' });
  }
});

export default router;
