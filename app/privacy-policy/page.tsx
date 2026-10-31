import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | NutriMorph AI",
  description: "Privacy policy and data usage disclosures for NutriMorph App.",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Header with App Logo and Back to Home Button */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/logo.png"
              alt="NutriMorph Logo"
              width={40}
              height={40}
              className="w-10 h-10 object-contain rounded-lg"
            />
            <span className="text-xl font-bold tracking-tight text-white">
              Nutri<span className="text-emerald-400">Morph</span>
            </span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2 rounded-lg transition border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full">
        <h1 className="text-3xl font-bold mb-2 text-emerald-400">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-400 mb-8">
          Last updated: October 30, 2026
        </p>

        <section className="space-y-6 text-slate-300 leading-relaxed">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-2">
              1. Overview & Information Collection
            </h2>
            <p className="mb-4">
              This privacy policy applies to the NutriMorph app for mobile
              devices, together with any related services operated by NutriMorph
              Tech (collectively, the &quot;Application&quot;). NutriMorph Tech
              is hereby referred to as the &quot;Service Provider&quot;.
            </p>
            <p className="mb-2">
              The Application collects information when you download and use it,
              including:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Account & Profile Information:</strong> Name, email
                address, authentication credentials, dietary preferences, daily
                calorie targets, body weight, height, and goal choices.
              </li>
              <li>
                <strong>Device & Usage Data:</strong> Your device&apos;s
                Internet Protocol (IP) address, operating system, pages visited,
                time and date of visits, and time spent on pages.
              </li>
              <li>
                <strong>Meal Photos & Text Inputs:</strong> Images of food and
                chat messages submitted for macro estimation and meal parsing
                via NutriBot.
              </li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-2">
              2. Cookies and Tracking Technologies
            </h2>
            <p>
              The Application or its third-party SDKs may use cookies, SDKs,
              pixels, and similar technologies to support functionality,
              analytics, or service delivery. Where required by applicable law,
              the Service Provider will obtain consent before using
              non-essential tracking technologies.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-2">
              3. Artificial Intelligence & Data Processing (Google Gemini API)
            </h2>
            <p>
              The Application utilizes Artificial Intelligence (AI)
              technologies, specifically the <strong>Google Gemini API</strong>,
              to provide personalized nutrition plans, recipe recommendations,
              and conversational responses through NutriBot. When using meal
              scanning or chat features, prompt text and food imagery are
              processed securely by AI models strictly to deliver service
              functionality in accordance with this privacy policy.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-2">
              4. Third-Party Access & Services
            </h2>
            <p className="mb-3">
              Only aggregated, anonymized data is periodically transmitted to
              external services to aid in improving the Application. The
              Application integrates trusted third-party service providers which
              have their own privacy policies:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-emerald-400">
              <li>
                <a
                  href="https://www.google.com/policies/privacy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Google Play Services
                </a>
              </li>
              <li>
                <a
                  href="https://policies.google.com/technologies/partner-sites"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  AdMob
                </a>
              </li>
              <li>
                <a
                  href="https://firebase.google.com/support/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Google Analytics for Firebase
                </a>
              </li>
              <li>
                <a
                  href="https://firebase.google.com/support/privacy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Firebase Crashlytics
                </a>
              </li>
              <li>
                <a
                  href="https://expo.io/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Expo
                </a>
              </li>
              <li>
                <a
                  href="https://www.revenuecat.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  RevenueCat
                </a>
              </li>
              <li>
                <a
                  href="https://stripe.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Stripe
                </a>
              </li>
              <li>
                <a
                  href="https://ai.google.dev/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Google Gemini API
                </a>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-2">
              5. Your Rights & California Privacy Rights (CCPA/CPRA)
            </h2>
            <p className="mb-3">
              You may request access to, correction of, or deletion of your
              personal data. California residents have specific rights to know,
              delete, or opt-out of personal information sharing. To exercise
              your rights, contact us at{" "}
              <strong>nutrimorphsupport@gmail.com</strong>.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-2">
              6. Data Retention & Account Deletion
            </h2>
            <p className="mb-2">
              User-provided data is retained for the duration of your use plus
              12 months. In compliance with Google Play Developer Policies, you
              can request full deletion of your account and associated data at
              any time:
            </p>
            <p>
              Submit an automated request via our{" "}
              <Link
                href="/delete-account"
                className="text-emerald-400 underline font-semibold"
              >
                Account Deletion Page
              </Link>{" "}
              or email support directly at{" "}
              <strong>nutrimorphsupport@gmail.com</strong>.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-2">
              7. Children&apos;s Privacy
            </h2>
            <p>
              The Application is not intended for children under 16 years of
              age. The Service Provider does not knowingly collect personally
              identifiable information from children under 16. If discovered,
              such information will be immediately deleted.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800 bg-slate-900/50 py-6 text-center text-xs text-slate-500">
        © 2026 NutriMorph AI. All rights reserved.
      </footer>
    </div>
  );
}
