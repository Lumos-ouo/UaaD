# Frontend Routing & Page Expansion Plan

To fulfill your request of adding "Activity Management" (活动管理) and establishing a foundational page routing system, we need to transition away from a single hardcoded Dashboard page into a scalable **Nested Route Architecture**.

## 🎯 Proposed Architecture

### 1. **Layout Extraction (The Shell)**
Currently, the Sidebar (导航栏) and the Header (顶栏) are tightly coupled inside `Dashboard.tsx`. I will extract these into a new component called **`DashboardLayout.tsx`**.
- This layout will wrap all internal pages, providing a consistent UI.
- It will use React Router's `<Outlet />` to dynamically swap the center content based on the URL without reloading the Sidebar or Header.

### 2. **Structural Routing Refactor (`src/App.tsx`)**
We will reorganize `App.tsx` to handle nested routes cleanly.
- `/login` & `/register` remains public.
- The protected area will be grouped under `/app` (or we can keep it as `/dashboard` as the base url).
  - `/app/overview` -> The current statistically dashboard.
  - `/app/activities` -> The new **Activity Management** page.
  - `/app/profile` -> The new Profile page.
  - `/app/settings` -> The new Settings page.

### 3. **New Page Generation**
I will scaffold the following responsive baseline pages with placeholder logic and i18n support, matching the premium dark-mode aesthetic we established:
- **`src/pages/Activities.tsx`**: A dashboard specific to managing/discovering activities (with a mock list or grid layout).
- **`src/pages/Profile.tsx`**: A basic user profile skeletal view.
- **`src/pages/Settings.tsx`**: A basic settings placeholder view.

### 4. **Sidebar Navigation Linking**
I will update the hardcoded sidebar menu items in the new `DashboardLayout.tsx` to actually use React Router's `<Link>` or `useNavigate` so clicking "Activities" or "Profile" changes the URL and loads the correct page component smoothly.

## ❓ Open Questions / Review
- Do you want the **Activities Page** to lean more towards a **B端主办方的管理后台（包含发布、编辑活动记录）** or a **C端用户的发现/报名大厅**？按照我们早期的 `SRS.md` 说明，系统融合了 B 端和 C 端，现阶段我想先搭一个通用的、具有数据表格或卡片列表样式的"大盘列表"给您看，您同意吗？
- 路由前缀使用 `/app` 作为进入系统后的主路口可以吗（例如 `/app/activities`），还是维持 `/dashboard/activities`？

## 🧪 Verification Plan
- Navigate cleanly between Overview, Activities, Profile, and Settings using the Sidebar, verifying that the URL updates without the page flickering or reloading.
- Ensure the Mock data flows into the Overview page still functions.
