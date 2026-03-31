# Internationalization (i18n) Implementation for UAAD Frontend

This document highlights the completed internationalization implementation on the frontend application for the UAAD project.

## 🎯 Overview

The initial goal was to provide multilingual support across the platform, allowing users to switch dynamically between **Chinese (default)** and **English**. The following areas were selected for immediate coverage:
- **Login Page**
- **Register Page**
- **Dashboard (Main Portal)**

## ✨ Highlights

1. **i18n Initialization**
   The application now utilizes `i18next` alongside `react-i18next`. It identifies the client's current language configuration via `i18next-browser-languagedetector` with English and Chinese setup.
   - Fallback is safely bound to `zh`.
   - The resources reside neatly structured under `/src/i18n/locales/`.

2. **Re-Usable Language Toggle**
   To seamlessly switch without refreshing, the app now uses a custom `LanguageToggle` component backed by Framer Motion. This button toggles cleanly and looks great tucked away in corner navigations.

3. **Page by Page Adjustments**
   - **Login & Registration**: Hardcoded strings related to titles, labels, placeholders, and error messages have all been migrated over to translation constants (e.g. `t('auth.login')`).
   - **Dashboard**: The left-side Navigation items, stat cards, as well as mock dashboard components were completely internationalized using keys like `t('dashboard.overview')`. The language toggle currently sits smoothly on the top right bar beside the notification icon!

## 🔧 Validation

> [!TIP]
> **To Test:**
> You can visit the login screen or register screen and see the interactive translation button at the top right of the viewport. Same can be verified when authenticated into the Dashboard view. Try toggling and observe the transitions!

## ✅ Outcome

All user-facing aspects in the defined scope are now dynamic instead of static. Future modifications to wording can just be done via the JSON configuration in the `locales` folder mapping dictionary representations.
