# Task List: Frontend Foundation Completion (FE-01, FE-04)

- [x] Create `AuthContext`
  - [x] Implement `src/context/AuthContext.tsx` using React Context for managing JWT state in memory.
  - [x] Export a `useAuth` custom hook for easy integration across components.
- [x] Implement `ProtectedRoute` Component
  - [x] Create `src/components/ProtectedRoute.tsx` to automatically redirect unauthenticated users away from `/dashboard` and other protected pages.
- [x] Enhance Axios Interceptor
  - [x] Update `src/api/axios.ts` with a global response interceptor.
  - [x] Catch `401 Unauthorized` errors and automatically clear tokens / triggers a redirect to `/login` without using external toast UI.
- [x] Refactor Existing Pages
  - [x] Wrap `App.tsx` logic inside `<AuthProvider>`.
  - [x] Apply `<ProtectedRoute>` to `DashboardPage` route inside `App.tsx`.
  - [x] Remove repetitive `useEffect` local storage token checking from `Dashboard.tsx`.
  - [x] Update `Login.tsx` to utilize `useAuth`'s login handler instead of manual logic.
- [x] Verification & Testing
  - [x] Ensure manual navigation to `/dashboard` without a token fails immediately.
  - [x] Verify Login successfully sets global context and routes to Dashboard.
