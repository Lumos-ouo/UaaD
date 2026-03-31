# Frontend Foundation Completion Plan (FE-01 & FE-04)

To complete the foundational layers of the UAAD frontend as specified in the `task_list.md`, we need to implement unified network request governance and establish a secure, centralized authentication lifecycle.

## 🎯 Proposed Changes

### 1. Unified Axios Error Interceptor (FE-01)
Currently, error handling is scattered across individual components (e.g., `catch (err) { setError(...) }`). 
We will integrate a global **Response Interceptor** in `src/api/axios.ts` to:
- Automatically catch standard HTTP responses (e.g., `401 Unauthorized`, `403 Forbidden`, `500 Server Error`).
- Standardize the error signature before yielding it to the component.
- Optionally, display a global toast/alert notifying the user of network crashes without writing boilerplate on every page.

### 2. Centralized Auth Context & XSS Mitigation Strategy (FE-04)
Currently, `Dashboard.tsx` uses a standalone `useEffect` to independently check `localStorage` for the token. This pattern scales poorly and is susceptible to logical desyncs.
We will create a global **React Context (`AuthContext.tsx`)** mechanism:
- **`src/context/AuthContext.tsx`** [NEW]: Will hold the JWT token in React state (memory), acting as the ultimate source of truth for "Am I Logged In?", which provides a protective barrier against simple XSS DOM token scraping compared to raw `localStorage` reads.
- Expose a `useAuth()` hook for simple access to `login(token)`, `logout()`, `isAuthenticated`.

### 3. Route Protection (FE-04)
- **`src/components/ProtectedRoute.tsx`** [NEW]: A wrapper component that checks the `AuthContext`.
- We will refactor `src/App.tsx` so that `<Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />`. 
- This automatically purges the repetitive token-checking logic from `Dashboard.tsx`.

> [!WARNING]
> Because the Go backend hasn't implemented `HttpOnly` Cookies or a `/refresh` token endpoint yet, we will still persist the JWT in `localStorage` strictly for persistence across page reloads. However, all active interactions will run through the `AuthContext` memory state.

## ❓ Open Questions / Review
- Do you agree with using **React Context API** for state management, or would you prefer a third-party library like **Zustand** or **Redux** for the token state?
- For the global Axios errors (like triggering a popup that says "Network Error"), do you want me to install a UI toast library like `react-hot-toast`, or should I just return standardized error objects to the components for now?

## 🧪 Verification Plan
- Simulate a 401 Unauthorized fetch event and verify that the interceptor intercepts the error, automatically clears the context, and redirects the user back to the `/login` screen.
- Verify `Dashboard` is impossible to reach by manually typing `/dashboard` if you are logged out.
