# UAAD Frontend Development Specification

This document serves as the single source of truth for all frontend architecture patterns, conventions, and operational modes in the Universal Activity Aggregation & Distribution (UAAD) platform.

---

## 🏗️ 1. Tech Stack Overview
- **Framework**: React 18 + Vite + TypeScript.
- **Styling**: Tailwind CSS v4 (Native Vite plugin architecture, no PostCSS).
- **Animations**: Framer Motion (used for layout transitions and micro-interactions).
- **Routing**: React Router DOM v6.
- **Data Fetching**: Axios (with centralized interceptors).
- **i18n**: `i18next` & `react-i18next` (JSON-based dictionary).
- **Mocking**: Mock Service Worker (MSW).

---

## 🔐 2. Authentication & Data Flow

### 2.1 State Management (AuthContext)
We use a **custom React Context (`src/context/AuthContext.tsx`)** as the singular authority for user sessions, protecting against basic LocalStorage XSS vulnerabilities.
- **Rule**: Never raw-read `localStorage.getItem('token')` inside UI components.
- **Pattern**: 
  ```tsx
  import { useAuth } from '../context/AuthContext';
  const { token, isAuthenticated, login, logout } = useAuth();
  ```

### 2.2 Global Error Handling (Axios)
To avoid messy `try/catch` boilerplate, network errors are caught centrally in `src/api/axios.ts`.
- **401 Unauthorized**: Automatically caught by the global response interceptor. It dynamically wipes the token memory and triggers a force-redirect to `/login`.
- **Backend API Base**: Defaulted to `http://localhost:8080/api/v1`.

### 2.3 Route Protection
Protected pages (e.g., Dashboard, Activities) must not process auth logic explicitly. 
- **Rule**: Wrap protected route `elements` inside `<ProtectedRoute>` within `src/App.tsx`.
- The `ProtectedRoute` silently observes `AuthContext` and reroutes unauthenticated intrusions.

---

## 🎨 3. UI & Asset Guidelines

### 3.1 Styling Conventions (Tailwind v4)
- **Aesthetic**: Premium "Glassmorphism" Dark Mode by default.
- **Colors**: Rely heavily on `slate-900` to `slate-950` for backgrounds, elevated with `blue-500` / `purple-500` translucent gradient blurs for interactive elements.
- **Class Grouping**: Organize classes functionally: `[Layout] [Flexbox/Grid] [Spacing] [Typography] [Colors] [Effects]`.

### 3.2 Internationalization (i18n)
All user-facing text must be internationalized to support concurrent cross-region operations.
- **Locale Files**: Located in `src/i18n/locales/`. Update BOTH `en.json` and `zh.json` when adding new keys.
- **Fallback**: zh (Chinese) is the default runtime fallback.
- **Pattern**:
  ```tsx
  import { useTranslation } from 'react-i18next';
  const { t } = useTranslation();
  <h1>{t('dashboard.overview')}</h1>
  ```

---

## 🧪 4. Mocks & Simulation

### 4.1 Mock Service Worker (MSW)
We utilize `msw` to act as an interceptive proxy layer simulating backend endpoints before Go API finalization.
- **Environment Toggle**: Set `VITE_USE_MOCK=true` in `.env` to engage. If false or missing, the app hits the real network.
- **Passthrough Policy**: Important core endpoints (like `/api/v1/auth/*`) are configured as `bypass` inside `src/mocks/browser.ts`, meaning they will always hit the real backend regardless of the mock state.
- **Handler Definitions**: Stored in `src/mocks/handlers.ts`.
- **Rule**: When mocking C-End flow (like Ticket Registration), always implement realistic `delay(ms)` and randomly return `202 Accepted` ("Queueing") to force UI loading states to display, assuring the frontend handles extreme concurrency grace gracefully.

---

## 📁 5. Directory Structure
```
frontend/
├── src/
│   ├── api/          # Axios instances and endpoint definitions
│   ├── components/   # Reusable UI (Buttons, LanguageToggle, ProtectedRoute)
│   ├── context/      # Global state providers (AuthContext)
│   ├── i18n/         # i18next configs and locale JSONs
│   ├── layouts/      # Global wrappers (DashboardLayout)
│   ├── mocks/        # MSW Handlers and browser setup
│   ├── pages/        # View-level route components (Login, Dashboard)
│   ├── App.tsx       # Core Router definitions
│   └── main.tsx      # React Bootstrapper
└── package.json      # Dependencies and scripts
```
