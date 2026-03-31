# Frontend Mock API Implementation (MSW)

This document highlights the completion of the frontend mock layer using **Mock Service Worker (MSW)** to dynamically simulate large scale activity distribution and fetching behaviors.

## 🎯 Implementation Overview
We successfully replaced the statically embedded data arrays in the Dashboard with a robust mock network interception layer.

### 1. The Technology Stack
- **Mock Service Worker (`msw`)** was installed and initialized within the `public/` directory, allowing it to act at the browser level and intercept all fetch/XHR calls gracefully before they reach the real network.
- **Environment Targeting**: We created a `.env` file containing `VITE_USE_MOCK=true`. The `main.tsx` entry point only boots the MSW worker if this variable is activated, ensuring we don't accidentally ship mock data to production.

### 2. Edge Case Simulations
In alignment with the SRS *(SECTION 3.2 \& 3.3)*, we implemented behaviors to reflect realistic enterprise queuing logic within `src/mocks/handlers.ts`:

- **The `dashboard/stats` Endpoint**: Will pause for `500ms` returning data payload to emulate an aggregate database query calculating total users and success rates.
- **The `activities/recent` Endpoint**: Introduces a **20% probability of dropping the user into a "Queueing" state** `HTTP 202 Accepted`, combined with a `2000ms` delay to show the skeleton loader/spinners. Otherwise, returns a clean 200 activity dataset after `300ms`.

### 3. "Unhandled" Passthrough
As requested, you wanted the **Auth modules to hit the real Go Backend**. 
We configured the worker to bypass any routes we haven't explicitly registered.
```typescript
  return worker.start({
    onUnhandledRequest: 'bypass', // Lets /api/v1/auth/* naturally fly out to localhost:8080!
  })
```

## 🪄 See it in Action

> [!TIP]
> **To Test:**
> Navigate to the **Dashboard** in your browser. You will notice brief loading spinners over the statistics header and the Activity List. If you're lucky (or unlucky!), you might hit the 20% random chance where the Activity list turns yellow and displays: `Queueing... Please wait`.

## ✅ Conclusion
The Dashboard is now a fully interactive data-reactive layer decoupled from actual backend timeline availability, allowing the Frontend team to iterate on edge cases (rate limits, queue loaders) and the Backend team to simultaneously work on their Redis + Lua rate limiting.
