import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import { PORT, DIST_DIR, IS_PRODUCTION } from './config.js';
import { securityHeadersMiddleware } from './security.js';
import apiRouter from './routes/api.js';
import { runEncryptionMigration } from './scripts/encrypt_images.js';

// Auto-run encryption migration if not yet completed
try {
  runEncryptionMigration();
} catch (err) {
  console.error('Error during photo encryption migration:', err.message);
}

const app = express();

// Trust reverse proxies (e.g. Render, Railway, Fly, Heroku, Nginx)
app.set('trust proxy', 1);

// Disable X-Powered-By header
app.disable('x-powered-by');

// Parse cookies and JSON bodies
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));

// Global security headers (CSP, HSTS, X-Content-Type-Options, etc.)
app.use(securityHeadersMiddleware);

// Mount API routes
app.use('/api', apiRouter);

// Block any direct attempts to access /images statically
app.use('/images', (req, res) => {
  res.status(404).send('Not Found');
});

// In production, serve Vite's static build output
if (fs.existsSync(DIST_DIR)) {
  app.use(
    express.static(DIST_DIR, {
      index: false,
      immutable: true,
      maxAge: '1d'
    })
  );

  // SPA fallback: all unmatched frontend routes serve index.html
  app.use((req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'API route not found' });
    }
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
} else {
  app.use((req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'API route not found' });
    }
    res.send(`
      <!DOCTYPE html>
      <html>
        <head><title>Birthday API Server</title></head>
        <body style="font-family: sans-serif; text-align: center; padding: 4rem;">
          <h2>Birthday Server is Live 🔒</h2>
          <p>API endpoints running on port ${PORT}. Run <code>npm run build</code> or start the Vite dev server for frontend development.</p>
        </body>
      </html>
    `);
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🌸 Birthday Security Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
    console.log(`🔒 Birthday PIN Gate & AES-256-GCM Photo Protection active.`);
  });
}

export default app;
