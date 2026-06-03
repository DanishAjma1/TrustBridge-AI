# TrustBridge AI Frontend

The TrustBridge frontend is a React + Vite application that delivers the full product UI for collaboration, investment workflows, real-time chat, and AI-assisted features. It connects to the TrustBridgeAI backend API for auth, data, payments, and realtime events.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Backend Notes](#backend-notes)
- [Contributing](#contributing)

---

## Overview

This client app powers the TrustBridge user experience, including dashboards, deals, campaigns, messaging, notifications, and settings. It is built as a PWA and uses WebRTC, Stripe, and Socket.IO for realtime and media experiences.

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS, PostCSS |
| Routing | React Router |
| Forms / Validation | React Hook Form, Yup, Valibot |
| Realtime | socket.io-client |
| Payments | Stripe JS |
| Media | Agora WebRTC SDK |
| Charts | Recharts |
| PWA | vite-plugin-pwa |
| Testing | Vitest + Testing Library |

---

## Features

- **Authentication UI** — login, registration, OTP flows, 2FA, and security settings.
- **Dashboards** — role-based views for entrepreneurs, investors, and admins.
- **Deals & Negotiation** — deal creation, negotiation modals, receipts, and payment flows.
- **Campaigns & Fundraises** — create and browse fundraising campaigns.
- **Messaging & Notifications** — realtime chat and notification centers.
- **Documents** — upload and view documents tied to deals and profiles.
- **AI Experiences** — AI chat and recommendation screens.
- **Video / WebRTC** — in-app media calling UI.
- **PWA Support** — offline caching and installable app shell.

---

## Project Structure

```
TrustBridge/
├── public/
├── src/
│   ├── components/         # Reusable UI + domain components
│   ├── pages/              # Route-level screens
│   ├── context/            # App state providers
│   ├── hooks/              # Custom hooks
│   ├── types/              # TypeScript types
│   ├── utils/              # Shared helpers
│   └── __tests__/          # Frontend tests
├── dev-dist/               # PWA build outputs for dev
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

---

## Prerequisites

- **Node.js** v18 or higher
- Backend API running (see Backend Notes)

---

## Getting Started

**1. Clone the repository**

```bash
git clone https://github.com/DanishAjma1/TrustBridge-AI.git
cd TrustBridge-AI/frontend/TrustBridge
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

Create a .env file in this folder and set values (see [Environment Variables](#environment-variables)).

**4. Start the dev server**

```bash
npm run dev
```

---

## Environment Variables

Create a .env file in this folder. Typical variables include:

```env
VITE_BACKEND_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## Available Scripts

| Script | Command | Description |
|---|---|---|
| Dev | npm run dev | Starts Vite dev server |
| Build | npm run build | Production build |
| Preview | npm run preview | Preview the build |
| Lint | npm run lint | Lint frontend sources |
| Test | npm run test | Run unit tests |

---

## Backend Notes

This frontend consumes the TrustBridgeAI Backend REST and Socket.IO APIs. The backend provides authentication, user data, deals, messaging, notifications, payments, AI routes, and WebRTC token endpoints. Configure VITE_BACKEND_URL to point at the backend base URL.

---

## Contributing

1. Fork the repository.
2. Create a feature branch: git checkout -b feature/your-feature-name
3. Commit your changes: git commit -m "feat: add your feature"
4. Push to your fork: git push origin feature/your-feature-name
5. Open a Pull Request.

Please follow conventional commit messages and keep PRs focused on a single concern.

---

Built by:
- Zain Imran  https://github.com/zainImran864
- Danish Ajmal  https://github.com/DanishAjma1
- Umar Nadeem  https://github.com/umar24012003
