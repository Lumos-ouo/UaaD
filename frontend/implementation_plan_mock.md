# Frontend API Mocking Strategy (Task: UAAD-FE-02)

To make the Dashboard interactive and fulfill the requirement of establishing a robust front-end mock definition, we need a scalable strategy to simulate backend behavior, especially for edge cases mentioned in the SRS (like "Queueing", "Rate-limited", etc.) prior to the actual Go backend implementing them. 

## 🎯 Proposed Solution: Mock Service Worker (MSW)

Instead of hardcoding dummy data directly in the components, we will intercept the outgoing network requests at the browser service worker level using **Mock Service Worker (MSW)**. This approach feels identical to a real backend to your React components.

### 1. Project Enhancements
- [NEW] **Install `msw`**: Add `msw` to the `package.json` as a development dependency.
- [NEW] **`src/mocks/handlers.ts`**: Define the API routes to be intercepted:
  - `GET /api/v1/dashboard/stats` - Returns "Total Registrations", "Active Activities", etc.
  - `GET /api/v1/activities/recent` - Returns the activity highlights list.
- [NEW] **`src/mocks/browser.ts`**: Configure the MSW browser execution context.

### 2. Edge Case Simulation
As requested in `task_list.md`, we will build logic into our mock handlers to simulate:
- **Normal Flow**: Returns 200 OK with the activity data.
- **Queueing State**: Simulates HTTP `202 Accepted` to test how the UI handles waiting in line.
- **Network Glitch / Rate Limit**: Randomly or conditionally drops requests (HTTP `429 Too Many Requests` or `500 Server Error`).

### 3. Modifying the Application Entry & Dashboard
- **`src/main.tsx`**: Add an environment toggle (`VITE_USE_MOCK=true`) to enable/disable the mock layer so it doesn't conflict with real backend testing (like the login/register flows we just established).
- **`src/pages/Dashboard.tsx`**: Replace the static hardcoded JSX arrays with `useState` and `useEffect` blocks that utilize our configured `api` axios instance to fetch from `/api/v1/...`.

## ❓ Open Questions / Review
- **Mock Technology**: I chose **MSW** because it's the modern industry standard and integrates perfectly with Vite. Would you prefer a simpler alternative like `axios-mock-adapter` or a Vite specific mock plugin instead?
- **Hybrid API Calls**: Currently, your Login and Register forms communicate with the *real* Go backend on `localhost:8080`. By turning on the Mock layer, do you want me to mock *everything* including Auth, or should we pass through (bypass) the `auth/*` requests directly to the real Golang backend while mocking only the Dashboard data?

## 🧪 Verification Plan
- Launch the frontend with the `VITE_USE_MOCK=true` environment variable.
- Verify the Service Worker `[MSW] Mocking enabled.` logs in the browser console.
- Refresh the Dashboard and ensure the data populates asynchronously, replacing the hardcoded text.
- Ensure Login/Register flows still hit the real backend if bypass is chosen.
