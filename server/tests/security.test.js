import http from 'http';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import app from '../index.js';
import {
  PORT,
  BIRTHDAY_TARGET_TIME,
  BIRTHDAY_PIN,
  PUBLIC_DIR,
  DIST_DIR,
  MANIFEST_PATH,
  SESSION_COOKIE_NAME,
  ENCRYPTED_PHOTOS_DIR
} from '../config.js';
import { decryptBuffer } from '../crypto.js';

const TEST_PORT = 3999;
let server;
let baseUrl;

function makeRequest(method, endpoint, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, baseUrl);
    const reqHeaders = {
      'X-Requested-With': 'XMLHttpRequest',
      ...(options.headers || {})
    };

    const req = http.request(
      url,
      {
        method,
        headers: reqHeaders
      },
      (res) => {
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          const buffer = Buffer.concat(chunks);
          let json = null;
          try {
            json = JSON.parse(buffer.toString('utf8'));
          } catch {
            // Not JSON
          }
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: buffer.toString('utf8'),
            rawBuffer: buffer,
            json
          });
        });
      }
    );

    req.on('error', reject);

    if (options.body) {
      if (typeof options.body === 'object') {
        req.setHeader('Content-Type', 'application/json');
        req.write(JSON.stringify(options.body));
      } else {
        req.write(options.body);
      }
    }

    req.end();
  });
}

async function runSecurityTestSuite() {
  console.log('\n================================================================');
  console.log('🛡️  BIRTHDAY PRODUCTION SECURITY & PIN GATE TEST SUITE');
  console.log('================================================================\n');

  // Start test server
  await new Promise((resolve) => {
    server = app.listen(TEST_PORT, () => {
      baseUrl = `http://localhost:${TEST_PORT}`;
      resolve();
    });
  });

  let testsPassed = 0;
  let testsFailed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      testsPassed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      testsFailed++;
    }
  }

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Before deadline, status indicates locked & visitor sees only countdown
    // -------------------------------------------------------------------------
    console.log('\n--- Test 1 & 2: Before Deadline Enforcement ---');
    // Set server clock to BEFORE birthday: 2026-10-10 12:00:00 (12 hours before)
    process.env.TEST_OVERRIDE_TIME = '2026-10-10T12:00:00+05:30';

    const statusBefore = await makeRequest('GET', '/api/status');
    assert(
      statusBefore.statusCode === 200 &&
      statusBefore.json.unlocked === false &&
      statusBefore.json.authenticated === false &&
      statusBefore.json.remainingMs > 0,
      'Before deadline: /api/status reports unlocked = false and returns positive remainingMs'
    );

    // -------------------------------------------------------------------------
    // TEST 2: Before deadline, PIN endpoint rejects attempts even with correct PIN
    // -------------------------------------------------------------------------
    const unlockBefore = await makeRequest('POST', '/api/unlock', {
      body: { pin: '2311' }
    });
    assert(
      unlockBefore.statusCode === 403 &&
      unlockBefore.json.unlocked === false,
      'Before deadline: /api/unlock rejects authentication with 403 Forbidden even with correct PIN 2311'
    );

    // -------------------------------------------------------------------------
    // TEST 3: After deadline, incorrect PIN does not unlock
    // -------------------------------------------------------------------------
    console.log('\n--- Test 3, 4 & 5: After Deadline & PIN Authentication ---');
    // Set server clock to AFTER birthday: 2026-10-11 00:01:00
    process.env.TEST_OVERRIDE_TIME = '2026-10-11T00:01:00+05:30';

    const statusAfter = await makeRequest('GET', '/api/status');
    assert(
      statusAfter.statusCode === 200 &&
      statusAfter.json.unlocked === true &&
      statusAfter.json.remainingMs === 0,
      'After deadline: /api/status confirms unlocked = true'
    );

    const unlockWrong = await makeRequest('POST', '/api/unlock', {
      body: { pin: '9999' }
    });
    assert(
      unlockWrong.statusCode === 401 &&
      unlockWrong.json.error.includes('Not quite right, try again'),
      'After deadline: incorrect PIN fails with 401 and "Not quite right, try again 💗"'
    );

    // -------------------------------------------------------------------------
    // TEST 4: After deadline, correct PIN creates authenticated session
    // -------------------------------------------------------------------------
    const unlockCorrect = await makeRequest('POST', '/api/unlock', {
      body: { pin: '2311' }
    });
    const setCookieHeader = unlockCorrect.headers['set-cookie'];
    assert(
      unlockCorrect.statusCode === 200 &&
      unlockCorrect.json.success === true &&
      setCookieHeader &&
      setCookieHeader.some((c) => c.includes(SESSION_COOKIE_NAME) && c.includes('HttpOnly') && c.includes('SameSite=Strict')),
      'After deadline: PIN 2311 succeeds with 200 OK and sets secure HttpOnly, SameSite=Strict cookie'
    );

    // Extract session cookie for subsequent authenticated tests
    const sessionCookie = setCookieHeader[0].split(';')[0];

    // Verify /api/status now reports authenticated = true with this session
    const statusAuth = await makeRequest('GET', '/api/status', {
      headers: { Cookie: sessionCookie }
    });
    assert(
      statusAuth.json.authenticated === true,
      'Authenticated session: /api/status confirms authenticated = true'
    );

    // -------------------------------------------------------------------------
    // TEST 5 & 6: Unauthenticated requests for photos/protected routes are rejected
    // -------------------------------------------------------------------------
    console.log('\n--- Test 6 & 7: Protected Photo Access & Decryption ---');
    const photosUnauth = await makeRequest('GET', '/api/photos');
    assert(
      photosUnauth.statusCode === 401,
      'Unauthenticated request to /api/photos is rejected with 401 Unauthorized'
    );

    const singlePhotoUnauth = await makeRequest('GET', '/api/photos/sample.jpeg');
    assert(
      singlePhotoUnauth.statusCode === 401,
      'Unauthenticated request to /api/photos/:filename is rejected with 401 Unauthorized'
    );

    // -------------------------------------------------------------------------
    // TEST 7: Authenticated requests can load the gallery & decrypt images correctly
    // -------------------------------------------------------------------------
    const photosAuth = await makeRequest('GET', '/api/photos', {
      headers: { Cookie: sessionCookie }
    });
    assert(
      photosAuth.statusCode === 200 &&
      Array.isArray(photosAuth.json) &&
      photosAuth.json.length === 30,
      `Authenticated request: /api/photos returns metadata for all ${photosAuth.json?.length} photos`
    );

    const firstPhoto = photosAuth.json[0];
    const photoStream = await makeRequest('GET', firstPhoto.src, {
      headers: { Cookie: sessionCookie }
    });

    assert(
      photoStream.statusCode === 200 &&
      photoStream.headers['content-type'] === 'image/jpeg' &&
      photoStream.headers['cache-control'].includes('private') &&
      photoStream.headers['cache-control'].includes('no-store') &&
      photoStream.rawBuffer.length > 1000,
      'Authenticated photo stream: decrypts on the fly with AES-256-GCM, serves image/jpeg with Cache-Control: private, no-store'
    );

    // Verify decrypted binary header matches JPEG magic bytes (FF D8 FF)
    const isJpeg = photoStream.rawBuffer[0] === 0xff && photoStream.rawBuffer[1] === 0xd8 && photoStream.rawBuffer[2] === 0xff;
    assert(isJpeg, 'Decrypted photo bytes verify valid JPEG format magic bytes (FF D8 FF)');

    // -------------------------------------------------------------------------
    // TEST 8: Clock tamper resistance (Server clock authority)
    // -------------------------------------------------------------------------
    console.log('\n--- Test 8: Clock Tamper Resistance ---');
    // Reset to before deadline
    process.env.TEST_OVERRIDE_TIME = '2026-10-09T00:00:00+05:30';
    // Client sends spoofed Date header or tries to claim it is 2027
    const spoofAttempt = await makeRequest('POST', '/api/unlock', {
      headers: {
        'Date': new Date('2027-01-01').toUTCString(),
        'X-Client-Time': '2027-01-01T00:00:00Z'
      },
      body: { pin: '2311' }
    });
    assert(
      spoofAttempt.statusCode === 403,
      'Client clock tampering / header spoofing is ignored; server clock strictly controls unlock'
    );

    // -------------------------------------------------------------------------
    // TEST 9: Rate limiting on repeated PIN attempts
    // -------------------------------------------------------------------------
    console.log('\n--- Test 9: Rate Limiting Enforcement ---');
    process.env.TEST_OVERRIDE_TIME = '2026-10-11T00:05:00+05:30'; // after deadline
    const rateLimitIp = '192.168.1.100';

    let rateLimited = false;
    for (let i = 0; i < 6; i++) {
      const attempt = await makeRequest('POST', '/api/unlock', {
        headers: { 'X-Forwarded-For': rateLimitIp },
        body: { pin: '0000' }
      });
      if (attempt.statusCode === 429) {
        rateLimited = true;
        break;
      }
    }
    assert(rateLimited, 'Rate limiter activates with 429 Too Many Requests after threshold failed attempts');

    // -------------------------------------------------------------------------
    // TEST 10: Session revocation and logout
    // -------------------------------------------------------------------------
    console.log('\n--- Test 10: Session Revocation & Logout ---');
    const logoutRes = await makeRequest('POST', '/api/logout', {
      headers: { Cookie: sessionCookie }
    });
    const clearCookieHeader = logoutRes.headers['set-cookie'];
    assert(
      logoutRes.statusCode === 200 &&
      clearCookieHeader &&
      clearCookieHeader.some((c) => c.includes('birthday_session=;')),
      '/api/logout successfully clears the session cookie'
    );

    // -------------------------------------------------------------------------
    // TEST 11: Absence of raw photos from public directories & build
    // -------------------------------------------------------------------------
    console.log('\n--- Test 11: Storage & Build Output Privacy ---');
    const publicImagesDir = path.resolve(PUBLIC_DIR, 'images');
    let rawPublicImages = [];
    if (fs.existsSync(publicImagesDir)) {
      rawPublicImages = fs.readdirSync(publicImagesDir).filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f));
    }
    assert(
      rawPublicImages.length === 0,
      `No raw images in public/images/ (found ${rawPublicImages.length} files)`
    );

    const encryptedFiles = fs.readdirSync(ENCRYPTED_PHOTOS_DIR).filter((f) => f.endsWith('.enc'));
    assert(
      encryptedFiles.length === 30,
      `All 30 photos are stored encrypted as .enc in server/storage/encrypted_photos/`
    );

    // -------------------------------------------------------------------------
    // TEST 12: Production Security Headers & CSP
    // -------------------------------------------------------------------------
    console.log('\n--- Test 12: Security Headers & CSP Validation ---');
    const rootRes = await makeRequest('GET', '/api/status');
    const csp = rootRes.headers['content-security-policy'] || '';
    const nosniff = rootRes.headers['x-content-type-options'];
    const xframe = rootRes.headers['x-frame-options'];
    const referrer = rootRes.headers['referrer-policy'];

    assert(
      csp.includes("frame-src 'self' https://open.spotify.com") &&
      csp.includes("style-src 'self' 'unsafe-inline' https://fonts.googleapis.com") &&
      csp.includes("img-src 'self' data: blob: https://open.spotify.com https://*.scdn.co"),
      'CSP allows Spotify iframe embed, Google fonts, and encrypted image blobs securely'
    );

    assert(
      nosniff === 'nosniff' && xframe === 'DENY' && referrer === 'strict-origin-when-cross-origin',
      'X-Content-Type-Options: nosniff, X-Frame-Options: DENY, and Referrer-Policy configured correctly'
    );

    // -------------------------------------------------------------------------
    // TEST 13: Direct static /images request blocking
    // -------------------------------------------------------------------------
    console.log('\n--- Test 13: Static Image Route Protection ---');
    const staticImageAttempt = await makeRequest('GET', '/images/WhatsApp%20Image.jpeg');
    assert(
      staticImageAttempt.statusCode === 404,
      'Direct static access to /images/* is blocked and returns 404 Not Found'
    );

  } catch (err) {
    console.error('Fatal test execution error:', err);
    testsFailed++;
  } finally {
    // Clean up test server and override
    delete process.env.TEST_OVERRIDE_TIME;
    server.close();

    console.log('\n================================================================');
    console.log(`📊 TEST RESULTS: ${testsPassed} PASSED, ${testsFailed} FAILED`);
    console.log('================================================================\n');

    if (testsFailed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  }
}

runSecurityTestSuite();
