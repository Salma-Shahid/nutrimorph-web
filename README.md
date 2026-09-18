# 🥗 NutriMorph — AI Nutritionist & Macro Coach

NutriMorph is an end-to-end, cross-platform AI-powered health and nutrition management platform. It allows users to track daily macros, analyze meal photos using Google Gemini AI, interact with a personalized voice/text conversational coach (**NutriBot**), and manage Pro subscriptions via RevenueCat.

---

## 🌟 Key Features

- **📊 Daily Macro & Calorie Tracker**: Interactive progress bars and weekly trend charts for tracking Calories, Protein, Carbs, and Fats.
- **📸 AI Meal Scanner**: Visual meal recognition powered by Google Gemini AI (`gemini-3.5-flash-lite`) to extract nutritional estimates directly from meal photos.
- **🤖 NutriBot AI Assistant**: Smart conversational AI assistant capable of creating custom meal plans, evaluating macro goals, and giving personalized dietary advice.
- **🌓 Global Light / Dark Mode**: Seamless theme switching managed through global Zustand state and persistent local storage.
- **🔒 Dynamic Authentication & Profile Management**: Secure JWT-based authentication, user onboarding, profile updates, and image uploads.
- **⭐ RevenueCat Subscription Integration**: Integrated Pro Plan upgrade flow supporting in-app purchases and entitlement verification.

---

## 🛠️ Tech Stack

### 1. Mobile Application (`/nutrimorph`)

- **Framework**: React Native with Expo (SDK 52+)
- **Navigation**: React Navigation (Bottom Tabs Navigator + Native Stack)
- **State Management**: Zustand (Global Auth, User Profile, Theme State)
- **API Client**: Axios
- **In-App Purchases**: RevenueCat SDK (`react-native-purchases`)
- **Icons & UI**: Expo Vector Icons (`Ionicons`), Safe Area Context

### 2. Backend Service (`/nutrimorph-backend`)

- **Runtime**: Node.js & Express.js
- **Database**: MongoDB Atlas with Mongoose ODM
- **AI Engine**: Google Generative AI SDK (`@google/generative-ai`) — **Model**: `gemini-3.5-flash-lite`
- **Security**: JSON Web Token (JWT) & Passwords hashed with `bcryptjs`
- **Deployment**: Vercel Serverless Functions

### 3. Web Dashboard (`/nutrimorph-web`)

- **Framework**: Next.js (App Router, React 19)
- **Styling**: Tailwind CSS
- **Fonts**: Geist & Geist Mono
- **Deployment**: Vercel

---

## ⚙️ Environment Variables Setup

Ensure you configure `.env` files across your services before launching:

### Mobile App (`/nutrimorph/.env`)

env
EXPO_PUBLIC_API_URL=[https://nutrimorph-backend.vercel.app](https://nutrimorph-backend.vercel.app)
EXPO_PUBLIC_REVENUECAT_KEY=your_revenuecat_api_key

Backend API (/nutrimorph-backend/.env)
Code snippet
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
🚀 Getting Started

1. Run Mobile App
   Bash
   cd nutrimorph
   npm install
   npx expo start -c
2. Run Backend Server
   Bash
   cd nutrimorph-backend
   npm install
   npm run dev
3. Run Web Dashboard
   Bash
   cd nutrimorph-web
   npm install
   npm run dev
   📁 Repository Structure
   nutrimorph-ecosystem/
   ├── nutrimorph/ # React Native Expo Mobile App
   │ ├── src/
   │ │ ├── navigation/ # AppNavigator (Bottom Tabs + Stack)
   │ │ ├── screens/ # Dashboard, MealScanner, ChatBot, Profile, Subscription
   │ │ ├── store/ # useAuthStore (Zustand state)
   │ │ └── theme/ # Theme colors & light/dark mode logic
   │ └── App.js # App entry point with safe boot loading
   ├── nutrimorph-backend/ # Node.js / Express API Server
   │ ├── controllers/ # Auth, Meal, ChatBot controllers
   │ ├── models/ # User, Meal, Chat log Mongoose schemas
   │ └── server.js # API entry & Vercel deployment handler
   └── nutrimorph-web/ # Next.js Landing & Dashboard Web App
   └── app/ # Next.js App Router structure
   📜 License
   This project is developed and maintained by Salma Shahid. All rights reserved.
