# 📑 NutriMorph System Architecture & API Documentation

This document provides complete technical specifications for the NutriMorph ecosystem, covering system architecture, database models, AI integration details, state synchronization workflows, and subscription entitlement logic.

---

## 🧠 1. Core AI Integration (`gemini-3.5-flash-lite`)

NutriMorph utilizes Google's **`gemini-3.5-flash-lite`** model across backend services for real-time vision parsing and natural language conversational AI.

### AI Engine Rules

- **Model Identifier**: Strictly set to `gemini-3.5-flash-lite`.
- **Meal Image Analysis**: Base64 image data is passed to Gemini Flash to calculate calorie estimates, protein (g), carbs (g), and fats (g).
- **Conversational AI (NutriBot)**: Contextual user profiles (current weight, goal, target calories) are injected into the prompt payload to generate personalized responses.

---

## 🔄 2. State & Theme Management (Zustand)

Global app state is managed centrally via `useAuthStore` using Zustand and persisted in mobile `AsyncStorage`.

### Key State Properties

- `user`: Object containing user profile details (`_id`, `name`, `email`, `avatar`, `subscriptionTier`, `height`, `weight`, `dailyCalorieGoal`).
- `token`: Active JWT authorization bearer token.
- `theme`: Active color mode (`"dark"` | `"light"`).
- `isLoading` / `error`: Local state trackers for async network calls.

### Actions

- `login(email, password)`: Authenticates user, saves JWT token & profile to `AsyncStorage`.
- `register(name, email, password)`: Creates new user account & initializes store.
- `updateProfile(profileData)`: Syncs profile edits (name, height, weight, goal) with backend and updates local store.
- `setUser(data)` / `updateUserStats(data)`: Updates local profile state; client state changes do not grant Pro access.
- `toggleTheme()`: Toggles theme mode and persists `app_theme` setting.
- `logout()`: Clears persistent storage and resets auth state to trigger conditional redirection to `LoginScreen`.

---

## 📱 3. Navigation Architecture

Navigation is handled via `@react-navigation/native-stack` combined with a persistent `@react-navigation/bottom-tabs` navigator (`AppNavigator`).

### Routing Graph

1. **Unauthenticated Flow**:
   - `LoginScreen`
   - `SignupScreen`
2. **Onboarding Flow**:
   - `OnboardingScreen` (Triggers if `user.isOnboarded` is false)
3. **Main Application Flow (`MainTabs`)**:
   - `DashboardTab` -> `DashboardScreen`
   - `ScannerTab` -> `MealScannerScreen`
   - `ChatBotTab` -> `ChatBotScreen`
   - `ProfileTab` -> `ProfileScreen`
4. **Overlay Screens**:
   - `LogFoodScreen`
   - `SubscriptionScreen`

_Note: All top-level navigation relies on conditional state rendering driven by Zustand (`user` object)._

---

## 📡 4. Backend API Specifications

### Auth Endpoints (`/api/auth`)

- `POST /api/auth/register`: Creates a user account.
- `POST /api/auth/login`: Authenticates user and returns JWT token.
- `PUT /api/auth/profile`: `[Protected]` Updates user metadata.

### Meal & Nutrition Endpoints (`/api/meals`)

- `GET /api/meals/daily-summary`: `[Protected]` Returns total logged calories, protein, carbs, and fats for the current day.
- `GET /api/meals/weekly-summary`: `[Protected]` Returns grouped 7-day calorie trends for dashboard rendering.
- `POST /api/meals/scan`: `[Protected]` Accepts image payload and uses `gemini-3.5-flash-lite` to extract meal macros.

### ChatBot Endpoints (`/api/chat` / `/api/chatbot`)

- `GET /api/chat/:userId`: `[Protected]` Fetches historical conversational thread.
- `POST /api/chat`: `[Protected]` Sends user query to NutriBot assistant powered by `gemini-3.5-flash-lite`.

---

## ⭐ 5. Paddle Billing v2 Pro Subscriptions

The web and mobile clients request authenticated, expiring checkout intents from the backend and open Paddle Checkout with the intent ID in checkout custom data. The backend verifies Paddle's raw-body webhook signature, checks the intent owner and configured price, and grants Pro only after a completed, positive-value transaction is confirmed by Paddle. Subscription lifecycle and payment-failure events update or revoke the entitlement. Client checkout completion does not activate Pro.

Configure `PADDLE_API_KEY`, `PADDLE_WEBHOOK_SECRET`, `PADDLE_ENV`, `PADDLE_PRICE_ID_MONTHLY`, and `PADDLE_PRICE_ID_YEARLY` on the backend. The web and Expo clients need their respective public client token, environment, and monthly/yearly price IDs. Keep all API and webhook secrets server-side. In Paddle, add the deployed backend URL `/api/payment/webhook` under Developer Tools → Notifications and subscribe to at least `transaction.completed`, `transaction.payment_failed`, `transaction.past_due`, `subscription.created`, `subscription.activated`, `subscription.updated`, `subscription.canceled`, `subscription.paused`, `subscription.resumed`, `payout.created`, and `payout.paid`. Confirm notification delivery and merchant payout eligibility in Paddle's dashboard; a Paddle-reported payout event is not proof of receipt by the bank.

---

## 🛠️ 6. Deployment Workflow

Both backend and web frontend services are configured for auto-deployment via Vercel on GitHub push events:

- `Salma-Shahid/nutrimorph-backend` -> Vercel Serverless Production API
- `Salma-Shahid/nutrimorph-web` -> Next.js Web Portal
- `Salma-Shahid/nutrimorph` -> Expo / EAS Build Pipeline
