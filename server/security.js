import { IS_PRODUCTION, SESSION_MAX_AGE_MS } from './config.js';

/**
 * Configure comprehensive security headers middleware.
 */
export function securityHeadersMiddleware(req, res, next) {
  // Content Security Policy tailored for React, Google Fonts, and Spotify Embed
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https://open.spotify.com https://*.scdn.co",
    "media-src 'self' data: blob:",
    "frame-src 'self' https://open.spotify.com",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ];

  res.setHeader('Content-Security-Policy', cspDirectives.join('; '));
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  if (IS_PRODUCTION) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  // Prevent caching of API responses by default
  if (req.path.startsWith('/api')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }

  next();
}

/**
 * CSRF Protection for mutating endpoints.
 * Requires custom header X-Requested-With or X-CSRF-Protection.
 */
export function csrfProtection(req, res, next) {
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    const requestedWith = req.headers['x-requested-with'];
    const customCsrf = req.headers['x-csrf-protection'];

    // Require custom header from single-page application
    if (!requestedWith && !customCsrf) {
      return res.status(403).json({
        error: 'Forbidden: Missing required request security header.'
      });
    }
  }
  next();
}

/**
 * Get cookie options for secure session handling.
 */
export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: IS_PRODUCTION, // True in production with HTTPS
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_MAX_AGE_MS
  };
}
