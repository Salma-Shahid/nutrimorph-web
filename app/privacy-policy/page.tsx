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
          Last updated: September 15, 2026
        </p>

        <section className="space-y-6 text-slate-300 leading-relaxed">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-2">
              1. Overview
            </h2>
            <p>
              NutriMorph (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is
              committed to protecting your privacy. This Privacy Policy explains
              how we collect, use, and process your personal information when
              using our mobile application and AI nutrition services.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-2">
              2. Data Collection & Usage
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Account Information:</strong> Name, email address, and
                authentication credentials for profile management.
              </li>
              <li>
                <strong>Health & Fitness Metrics:</strong> Daily calorie
                targets, body weight, height, and goal choices provided directly
                by you.
              </li>
              <li>
                <strong>Meal Photos & Text Inputs:</strong> Images of food and
                chat messages submitted for macro estimation and meal parsing.
              </li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-2">
              3. Third-Party AI Processing (Google Gemini API)
            </h2>
            <p>
              NutriMorph uses Google&apos;s Gemini API to analyze food photos,
              estimate nutrition facts, and generate conversational advice.
              Image Base64 strings and chat queries are processed securely
              through API endpoints and are not sold or used for targeted
              advertising.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-2">
              4. User Account & Data Deletion
            </h2>
            <p className="mb-2">
              In compliance with Google Play Developer Policies, you can request
              full deletion of your account and associated data at any time:
            </p>
            <p>
              Submit an automated request via our{" "}
              <Link
                href="/delete-account"
                className="text-emerald-400 underline font-semibold"
              >
                Account Deletion Page
              </Link>{" "}
              or email support at <strong>support@nutrimorph.app</strong>.
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
