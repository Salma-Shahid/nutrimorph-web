import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Refund & Cancellation Policy | NutriMorph AI",
  description:
    "Refund and cancellation terms for NutriMorph Pro subscriptions via Paddle.",
};

export default function RefundPolicy() {
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
          Refund &amp; Cancellation Policy
        </h1>
        <p className="text-sm text-slate-400 mb-8">
          Last updated: November 23, 2026
        </p>

        <section className="space-y-6 text-slate-300 leading-relaxed">
          {/* Intro Box */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <p>
              At NutriMorph Tech (&quot;Service Provider&quot;, &quot;we&quot;,
              &quot;us&quot;), operated via nutrimorph.app, we strive to ensure
              total satisfaction with our AI-powered nutrition tracking and Pro
              subscription services. Payments and billing for NutriMorph Pro are
              processed securely through <strong>Paddle</strong>, our Merchant
              of Record.
            </p>
          </div>

          {/* Section 1 */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-2">
              1. Subscription Cancellation
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                You can cancel your NutriMorph Pro subscription at any time
                through your account settings or directly via the Paddle
                Purchaser Portal / email receipt.
              </li>
              <li>
                Upon cancellation, your Pro features will remain active until
                the end of your current paid billing period. After this period,
                your account will automatically revert to the Free tier.
              </li>
              <li>
                Future recurring charges will cease immediately upon
                cancellation.
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-2">
              2. Refund Eligibility &amp; Request Window
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>14-Day Money-Back Guarantee:</strong> If you are
                unsatisfied with NutriMorph Pro, you are eligible for a full
                refund within 14 days of your initial purchase or subscription
                renewal.
              </li>
              <li>
                <strong>Technical Issues:</strong> If a technical glitch on our
                platform prevents you from accessing Pro features and our
                support team cannot resolve it within 48 hours, a full or
                prorated refund will be issued regardless of the 14-day window.
              </li>
              <li>
                <strong>Non-Refundable Cases:</strong> Refunds are not issued
                for unused portions of a subscription after the 14-day window
                has expired, or in cases where account access has been
                terminated due to a violation of our Terms of Service.
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-2">
              3. How to Request a Refund
            </h2>
            <p className="mb-3">
              You can request a refund through either of the following channels:
            </p>
            <ol className="list-decimal pl-5 space-y-3 mb-4">
              <li>
                <strong>Direct Email Support:</strong> Contact our support team
                at{" "}
                <strong className="text-emerald-400">
                  nutrimorphsupport@gmail.com
                </strong>{" "}
                with your account email address and Paddle transaction reference
                number.
              </li>
              <li>
                <strong>Paddle Buyer Support:</strong> Submit a refund request
                directly through your Paddle email payment receipt or via Paddle
                Support at{" "}
                <a
                  href="https://paddle.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline font-semibold"
                >
                  paddle.net
                </a>
                .
              </li>
            </ol>
            <p className="text-sm text-slate-400 border-t border-slate-800 pt-3">
              Approved refunds are processed by Paddle within 3–5 business days
              and returned to your original payment method.
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
