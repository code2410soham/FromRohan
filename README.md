# ✨ A Magical Birthday Journey for Gaurii 🎂

A personalized, responsive, and secure birthday website handcrafted with love for Gaurii's special day.

---

## 🌟 Features & Highlights

- **Pre-Deadline Countdown Gate**: Before October 11, 2026, 12:00 AM IST, the public landing page renders strictly the countdown timer (`"Counting down the magical moments ✨"`). No private photos, PIN forms, letters, or memory games are revealed or accessible via API.
- **Server-Side PIN Authentication**: Once the birthday deadline arrives on the server, a masked 4-digit PIN gate opens (`"Unlock Your Surprise ❤️"`). Verified with constant-time cryptographic matching (`2311`), rate limiting, and signed `HttpOnly` session cookies.
- **AES-256-GCM Private Photo Encryption**: All 30 personal photographs are encrypted at rest with unique 12-byte IVs and authenticated tags, decrypted on-the-fly only for authenticated sessions.
- **Complete Mobile Responsiveness**: Seamless support across all screen sizes (320px small phones, iPhones with notches/Dynamic Island, tablets, laptops, and large monitors). Zero horizontal overflow.
- **Botanical Silk Bloom Transition**: Full-screen 3D floral curtain animation that seamlessly unveils the birthday world.
- **Interactive Bestie Playground**:
  1. 🎂 Virtual Cake Candle Blowing
  2. ✨ Daily Compliment Generator
  3. 💖 25 Reasons You're Amazing
  4. 🎮 Memory Photo Matching Game (featuring real photos)
  5. 💌 "Open When..." Interactive Envelopes
- **Personal Birthday Letter**: Wax-sealed stationery with unfold animation.
- **Dedicated Spotify Melody**: Dedicated soundtrack player featuring *"Ishq Wala Love"* with an interactive vinyl record.
- **Continuous Background Music**: Ambient audio player with soft chimes, soundwave visualizer, and mobile-compact controls.

---

## 🚀 Deploying to Vercel

This repository is pre-configured with `vercel.json` and a Serverless Function entrypoint at `api/index.js`.

### 1. Import Repository
1. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
2. Select the repository: `code2410soham/FromRohan`.
3. Framework Preset: **Vite** (detected automatically).
4. Build Command: `npm run build`
5. Output Directory: `dist`

### 2. Configure Environment Variables
In the Vercel Project Settings > **Environment Variables**, add the following:

| Variable Name | Example Value / Description |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `BIRTHDAY_TARGET_TIME` | `2026-10-11T00:00:00+05:30` |
| `BIRTHDAY_PIN` | `2311` |
| `SESSION_SECRET` | *(64-char hex string, e.g. generated via `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)* |
| `IMAGE_ENCRYPTION_KEY` | *(64-char hex key matching the master key)* |

### 3. Deploy
Click **Deploy**! Vercel will compile the Vite frontend into `dist/` and mount the API at `/api/*`.

---

## 🛠️ Local Development & Testing

```bash
# Install dependencies
npm install

# Start backend server (port 3001)
npm run server

# Start frontend dev server (port 5173, proxies /api to port 3001)
npm run dev

# Run full security and access control test suite (19 tests)
npm run test:security

# Build production bundle & verify image encryption
npm run build
```

---

## 🔒 Security Specifications

- **PIN Verification**: Timing-safe comparison using `crypto.timingSafeEqual`.
- **Brute-Force Protection**: Server-side rate limiter locks out after 5 consecutive failed attempts for 15 minutes.
- **Session Management**: Cryptographic HMAC-signed cookies (`HttpOnly`, `SameSite=Strict`, `Secure` in production).
- **Security Headers**: Content-Security-Policy (CSP) tailored for Spotify embed & Google Fonts, HSTS, `X-Content-Type-Options: nosniff`, and `X-Frame-Options: DENY`.
- **Private Storage**: All raw photos moved out of `public/` into encrypted `.enc` binary storage.
