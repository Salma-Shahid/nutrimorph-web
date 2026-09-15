import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service | NutriMorph AI",
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
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

      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full">
        <h1 className="text-3xl font-bold mb-6 text-emerald-400">
          Terms of Service
        </h1>

        <section className="space-y-6">
          <div className="bg-amber-950/40 border border-amber-500/50 p-6 rounded-xl">
            <h2 className="text-lg font-bold text-amber-400 mb-2">
              ⚠️ Medical & Fitness Disclaimer
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              NutriMorph is an AI-assisted meal tracking and coaching tool.
              NutriBot is not a licensed physician, registered dietitian, or
              certified medical professional. All suggestions, macros, and
              calorie recommendations are for informational purposes only and do
              not replace medical advice or clinical diagnosis.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-2">
              1. User Conduct
            </h2>
            <p className="text-slate-300 leading-relaxed">
              Users must not submit illegal, harmful, or abusive content to the
              NutriBot AI assistant. Violations will result in immediate account
              suspension.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-2">
              2. Subscriptions & Billing
            </h2>
            <p className="text-slate-300 leading-relaxed">
              Free tier users receive 5 daily AI chat messages. Upgrading to Pro
              provides unlimited AI access. Billing and recurring renewals are
              processed directly via Google Play Billing.
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
