# 🚀 TrustBridge AI — Enterprise Investor Collaboration Platform (PWA)

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 18" />
  <img src="https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/WebRTC-Agora_RTC-099DFD?style=for-the-badge&logo=agora&logoColor=white" alt="Agora RTC" />
  <img src="https://img.shields.io/badge/Socket.IO-Client-010101?style=for-the-badge&logo=socketdotio&logoColor=white" alt="Socket.IO" />
  <img src="https://img.shields.io/badge/Stripe-Elements_SDK-635BFF?style=for-the-badge&logo=stripe&logoColor=white" alt="Stripe" />
  <img src="https://img.shields.io/badge/PWA-Ready-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white" alt="PWA" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vitest-Unit_Tested-729B1B?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest" />
</p>
<br/>

> **TrustBridge AI Frontend** is an enterprise-grade Progressive Web Application (PWA) built for high-stakes startup fundraising, deal negotiations, and real-time investor collaboration. It combines WebRTC video conferencing, bidirectional Socket.IO state synchronization, and Stripe Elements checkout.

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph ClientLayer ["Client Presentation & PWA Shell"]
        PWA["PWA Service Worker & Cache Layer"]
        Router["React Router v6 Protected Guard"]
        Shell["Framer Motion App Shell"]
    end

    subgraph FeaturePortals ["Role-Based Portals"]
        Entrepreneur["Entrepreneur Portal (Pitch Decks, Analytics)"]
        Investor["Investor Console (Deal Flow, Escrow)"]
        Admin["SuperAdmin Dashboard (Risk Events, Approvals)"]
    end

    subgraph RealTimeEngines ["Real-Time & Media Services"]
        AgoraEngine["Agora RTC WebRTC Video & Audio Engine"]
        SocketBus["Socket.IO Bidirectional Event Bus"]
        StripeCheckout["Stripe Elements Escrow Payment Modal"]
        AIAssistant["Botpress AI Deal Assistant Chat"]
    end

    subgraph BackendAPI ["TrustBridge Distributed Backend"]
        RESTAPI["Express 5 REST API Gateway"]
        RedisPubSub["Redis-Adapter WebSockets"]
    end

    PWA --> Router
    Router --> Shell
    Shell --> FeaturePortals

    FeaturePortals --> AgoraEngine
    FeaturePortals --> SocketBus
    FeaturePortals --> StripeCheckout
    FeaturePortals --> AIAssistant

    SocketBus <--> RedisPubSub
    AgoraEngine <--> RESTAPI
    StripeCheckout <--> RESTAPI
    AIAssistant <--> RESTAPI
```

---

## ⚡ Core Engineering Highlights

- **Multi-Role Portal Segmentation**: Granular role-guarded routes separating startup pitch dashboards, investor deal management, and platform administrator fraud detection.
- **Low-Latency Video Calling**: Integrated Agora WebRTC SDK (`agora-rtc-sdk-ng`) supporting camera/mic toggling, screen-sharing, and dynamic channel token expiration handling.
- **Real-Time Negotiation Synchronization**: Bidirectional Socket.IO event streams sync live deal valuation updates, document revisions, and push notification triggers with optimistic client updates.
- **Progressive Web App (PWA)**: Built with `vite-plugin-pwa` and custom service worker caching, enabling seamless offline capabilities, background notifications, and installability.
- **Production CI/CD Quality**: Enforced linting and unit testing pipelines via GitHub Actions (`nexus-ci.yml`), Husky pre-commit hooks, and Vitest test suites.

---

## 📁 Repository Structure

```text
src/
  components/
    admin/              Campaign charts, fraud detection, startup growth widgets
    ai/                 AI chat assistant and recommendation modals
    DealForm.tsx        Interactive term sheet negotiation interface
    DealPaymentModal.tsx Secure Stripe payment elements integration
  context/              Auth, WebRTC, and Socket context providers
  hooks/                Custom React hooks for Agora, WebSockets, and media streams
```

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- Node.js >= 20.0.0
- npm or pnpm

### 1. Installation
```bash
git clone https://github.com/DanishAjma1/TrustBridge-AI.git
cd TrustBridge-AI
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
VITE_BACKEND_URL="http://localhost:5000"
VITE_AGORA_APP_ID="your-agora-app-id"
VITE_STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
```

### 3. Run Development Server
```bash
npm run dev
```
Visit [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Run Test Suite
```bash
npm run test
```

---

## 📜 License
Distributed under the MIT License. Built with passion by [Danish Ajmal](https://github.com/DanishAjma1).
