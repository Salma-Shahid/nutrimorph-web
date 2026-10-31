import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service | NutriMorph AI",
  description:
    "Terms and conditions for using NutriMorph AI mobile app and web platform.",
};

export default function TermsOfService() {
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
          Terms of Service
        </h1>
        <p className="text-sm text-slate-400 mb-8">
          Last updated: October 30, 2026
        </p>

        <section className="space-y-6 text-slate-300 leading-relaxed">
          {/* Medical Disclaimer Banner */}
          <div className="bg-amber-950/40 border border-amber-500/50 p-6 rounded-xl">
            <h2 className="text-lg font-bold text-amber-400 mb-2">
              ⚠️ Medical & Fitness Disclaimer
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              NutriMorph is an AI-assisted meal tracking and coaching tool.
              NutriBot is not a licensed physician, registered dietitian, or
              certified medical professional. All suggestions, macros, and
              calorie recommendations are for informational purposes only and do
              not replace medical advice, clinical diagnosis, or treatment.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-2">
              1. Agreement to Terms & Eligibility
            </h2>
            <p className="mb-3">
              These terms and conditions apply to the NutriMorph app for mobile
              devices, together with any related services operated by NutriMorph
              Tech (&quot;Service Provider&quot;).
            </p>
            <p>
              You must be at least 16 years of age (or the age of digital
              consent in your jurisdiction) to use the Application. If you are
              below 16, a parent or legal guardian must review and accept these
              Terms on your behalf.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-2">
              2. License to Use & User Conduct
            </h2>
            <p className="mb-3">
              We grant you a limited, non-exclusive, non-transferable, revocable
              license to install and use NutriMorph for personal wellness
              tracking.
            </p>
            <p>
              Users agree not to submit illegal, abusive, threatening,
              defamatory, hate speech, or malicious content to the NutriBot AI
              assistant or public features. Violations will result in immediate
              account suspension or termination.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-2">
              3. Artificial Intelligence (AI) Features & Google Gemini API
            </h2>
            <p>
              The Application incorporates Artificial Intelligence (AI)
              technologies, specifically the <strong>Google Gemini API</strong>,
              to provide personalized diet, recipe, and health recommendations.
              By using the Application, you acknowledge and agree that AI is
              used to process inputs and generate responses.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-2">
              4. Subscriptions, Pricing & Payments
            </h2>
            <p>
              Free tier users receive up to 5 daily AI chat messages. Upgrading
              to the Pro plan provides unlimited AI access and premium tracking.
              Billing, payments, and recurring renewals are processed directly
              via Google Play Billing or Stripe.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-2">
              5. Third-Party Services
            </h2>
            <p className="mb-3">
              The Application utilizes third-party services that maintain their
              own operating terms:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-emerald-400">
              <li>
                <a
                  href="https://policies.google.com/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Google Play Services
                </a>
              </li>
              <li>
                <a
                  href="https://developers.google.com/admob/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  AdMob
                </a>
              </li>
              <li>
                <a
                  href="https://www.google.com/analytics/terms/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Google Analytics for Firebase
                </a>
              </li>
              <li>
                <a
                  href="https://firebase.google.com/terms/crashlytics"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Firebase Crashlytics
                </a>
              </li>
              <li>
                <a
                  href="https://expo.io/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Expo
                </a>
              </li>
              <li>
                <a
                  href="https://www.revenuecat.com/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  RevenueCat
                </a>
              </li>
              <li>
                <a
                  href="https://stripe.com/legal"
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
              6. Limitation of Liability & Contact
            </h2>
            <p className="mb-3">
              To the fullest extent permitted by law, NutriMorph Tech shall not
              be liable for any indirect, incidental, or consequential damages
              resulting from your reliance on AI meal tracking or server
              downtime.
            </p>
            <p>
              If you have any questions or suggestions regarding these Terms,
              please contact us at <strong>nutrimorphsupport@gmail.com</strong>.
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
