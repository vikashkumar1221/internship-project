# Music Collaboration Studio (Production-Ready DAW SaaS)

Music Collaboration Studio is a production-grade, real-time web application built for musicians, producers, sound designers, and vocalists to collaborate on music projects in real time. It combines the visual precision of Figma with the full audio capabilities of a Digital Audio Workstation (DAW).

---

## 🌟 Key Architecture & Highlights

- **Real-Time Studio Engine**: Socket.io powered live collaborative cursors, presence indicators, operational transformation track updates, track locking, and playhead sync.
- **Multi-Track DAW Timeline**: Canvas peak audio rendering, zoom, scrub, clip region splitting/trimming, and snap-to-grid controls.
- **Web Audio API DSP Mixing Console**: Interactive volume faders (-60dB to +6dB), stereo panners, 3-Band Parametric EQ (Low/Mid/High shelf), master compressor, and animated VU peak meters.
- **MIDI Piano Roll Sequencer**: Interactive note matrix step sequencer with Web Audio oscillator sound synthesis.
- **Demucs AI Stem Separation**: Deep learning microservice integration to isolate Lead Vocals, Bass, Drums, and Guitars.
- **Royalty Split Calculator**: Automatic 100% split validation, ownership breakdown, and Stripe Connect payouts.
- **PDF Contract Generator**: Legal agreement document generator powered by PDFKit / jsPDF with e-signature tracking.
- **Beat & Stem Marketplace**: Marketplace store with multi-tier licensing (Lease, Exclusive) and Stripe payment intents.
- **SaaS Subscription Billing**: Stripe billing tiers (Free, Pro, Studio, Enterprise) with monthly and annual billing.

---

## 📁 Repository Folder Structure

```
music-collaboration-studio/
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Navbar, Sidebar, Modals
│   │   │   ├── dashboard/      # Project Cards, Storage Widget
│   │   │   ├── modules/        # Royalty, Contracts, Marketplace, Billing, Admin
│   │   │   └── studio/         # DAWHeader, Timeline, TrackRow, Mixer, PianoRoll, AI Stems
│   │   ├── context/            # AuthContext, SocketContext
│   │   ├── pages/              # 11 Full App Pages
│   │   ├── services/           # Axios API Client & WebAudioEngine
│   │   ├── store/              # Redux Toolkit Store & studioSlice
│   │   ├── App.jsx             # Router definition
│   │   ├── index.css           # Dark glassmorphism & Tailwind styles
│   │   └── main.jsx            # App root mount
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                     # Node.js + Express Backend
│   ├── src/
│   │   ├── config/             # DB (MongoDB), S3, Stripe
│   │   ├── controllers/        # 11 REST API Controllers
│   │   ├── middlewares/        # JWT Auth, Role Access, Multer Upload, Error Handler
│   │   ├── models/             # 14 Mongoose Schemas
│   │   ├── routes/             # REST Route Mounts
│   │   ├── seed/               # Database Seeder
│   │   ├── services/           # S3, FFmpeg, Demucs AI, PDFKit, Stripe, DocuSign
│   │   ├── sockets/            # Socket.io Real-time Collab Engine
│   │   └── index.js            # Express & HTTP Server Entry Point
│   └── package.json
├── docker-compose.yml          # Multi-container orchestration
├── Dockerfile.backend          # Node.js + FFmpeg Container
├── Dockerfile.frontend         # Nginx Multi-stage Production Container
├── .env.example                # Environment Variable Template
└── package.json                # Root Monorepo Scripts
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.x or higher
- **MongoDB**: Local or MongoDB Atlas URI (optional; app includes offline fallback)
- **FFmpeg**: Required for backend audio peak extraction

### Installation

1. Install all dependencies across monorepo:
   ```bash
   npm run setup
   ```

2. Seed demo database:
   ```bash
   npm run seed
   ```

3. Launch development servers concurrently:
   ```bash
   npm run dev
   ```
   - **Frontend App**: `http://localhost:5173`
   - **Backend API**: `http://localhost:5000`

---

## 🐳 Docker Deployment

Run the complete production stack (MongoDB, API Server, Nginx Frontend) with Docker Compose:

```bash
docker-compose up --build
```

---

## 🔐 Environment Variables

Copy `.env.example` to `.env` in root and configure:

```env
PORT=5000
NODE_ENV=production
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/music_collab_studio
JWT_SECRET=super_secret_jwt_key_music_studio_2026_antigravity
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_S3_BUCKET=music-studio-stems-versioned
STRIPE_SECRET_KEY=sk_test_51MockStripeSecretKey
DEMUCS_API_URL=http://localhost:8000/api/separate
```

---

## 🛡️ License

MIT License.

Developed as a B.Tech Major Project by Vikash Jangir.
