"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Bot,
  Camera,
  PieChart,
  ShieldCheck,
  Zap,
  ArrowRight,
  Smartphone,
  Check,
  X,
  Loader2,
} from "lucide-react";

export default function Home() {
  const [isYearly, setIsYearly] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Handle plan selection and open subscription modal
  const handlePlanSelect = (planName: string) => {
    setSelectedPlan(planName);
    setShowSubModal(true);
    setErrorMessage("");
  };

  // Handle direct payment and backend integration for subscriptions
  const handleSubscriptionCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage("Please enter your registered email address.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      // LocalStorage se user ka auth token retrieve karein (protect middleware ke liye)
      const token = localStorage.getItem("token");

      // API call to nutrimorph-backend payment endpoint
      const response = await processBackendCheckout(
        {
          plan: selectedPlan,
          billingCycle: isYearly ? "yearly" : "monthly",
          email: email,
          aiModel: "gemini-3.5-flash-lite",
        },
        token,
      );

      if (response.url) {
        // Redirect user to secure Stripe payment gateway URL returned by backend
        window.location.href = response.url;
      } else {
        throw new Error("Invalid payment gateway response.");
      }
    } catch (err: any) {
      setErrorMessage(
        err.message || "Failed to process payment. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Backend communication helper (Updated with correct payment endpoint & Auth header)
  const processBackendCheckout = async (payload: any, token: string | null) => {
    const apiEndpoint =
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      "https://nutrimorph-backend.onrender.com";

    const res = await fetch(
      `${apiEndpoint}/api/payment/create-checkout-session`, // Corrected route path matching backend
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}), // Pass token if available
        },
        body: JSON.stringify(payload),
      },
    );

    const data = await res.json();
    if (!res.ok)
      throw new Error(data.message || "Backend payment processing failed");
    return data;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Header / Navbar */}
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
          <nav className="hidden md:flex items-center space-x-6 text-sm text-slate-300 font-medium">
            <Link
              href="#features"
              className="hover:text-emerald-400 transition"
            >
              Features
            </Link>
            <Link href="#pricing" className="hover:text-emerald-400 transition">
              Plans
            </Link>
            <Link
              href="/privacy-policy"
              className="hover:text-emerald-400 transition"
            >
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-emerald-400 transition">
              Terms
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-1.5 rounded-full text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-8">
          <Zap className="w-4 h-4" />
          <span>Powered by Gemini 3.5 Flash Lite AI</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Your Personal AI Nutritionist <br className="hidden md:inline" /> &
          Macro Coach
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Snap photos of your food, track daily macros, and chat with NutriBot
          for instant personalized dietary guidance and fitness plans.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#pricing"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-8 py-4 rounded-xl transition shadow-lg shadow-emerald-500/20"
          >
            <Smartphone className="w-5 h-5" />
            <span>View Plans & Subscribe</span>
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=com.salmashahid.nutrimorph"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold px-8 py-4 rounded-xl transition border border-slate-700 shadow-xl"
          >
            <svg
              className="w-5 h-5 fill-current text-emerald-400"
              viewBox="0 0 24 24"
            >
              <path d="M3.609 1.814L13.792 12 3.61 22.186a1.5 1.5 0 0 1-.61-1.21V3.024a1.5 1.5 0 0 1 .609-1.21zM15.208 13.416l2.122 2.122-11.233 6.49a1.5 1.5 0 0 1-1.498 0l10.609-8.612zm0-2.832L4.599 1.972a1.5 1.5 0 0 1 1.498 0l11.233 6.49-2.122 2.122zm1.414 1.414l3.536 2.042a1.25 1.25 0 0 1 0 2.164l-3.536 2.042-2.122-2.122 2.122-2.126z" />
            </svg>
            <span>Download on Google Play</span>
          </a>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-12">
          Everything You Need to Transform Your Diet
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl w-fit mb-6">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              NutriBot AI Assistant
            </h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              Ask about diet plans, macro breakdowns, and recipes. Get custom
              advice tailored directly to your weight and fitness goals.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl w-fit mb-6">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Instant Photo Scanning
            </h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              Upload a picture of your meal and let our multimodal AI identify
              ingredients, estimate portion sizes, and calculate calories.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl w-fit mb-6">
              <PieChart className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Smart Macro Tracking
            </h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              Keep precise track of your daily proteins, carbs, fats, and
              hydration targets with real-time analytics.
            </p>
          </div>
        </div>
      </section>

      {/* Functional Subscriptions / Plans Section */}
      <section
        id="pricing"
        className="max-w-4xl mx-auto px-6 py-16 border-t border-slate-800"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-4">
          Choose Your Plan
        </h2>
        <p className="text-slate-400 text-center mb-8 text-sm">
          Start for free or upgrade to Pro for unlimited AI guidance.
        </p>

        {/* Interactive Billing Cycle Toggle */}
        <div className="flex items-center justify-center space-x-4 mb-12">
          <span
            className={`text-sm font-medium ${!isYearly ? "text-white" : "text-slate-400"}`}
          >
            Monthly
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className="w-14 h-8 bg-slate-800 border border-slate-700 rounded-full p-1 transition relative"
          >
            <div
              className={`w-6 h-6 bg-emerald-400 rounded-full transition transform ${isYearly ? "translate-x-6" : "translate-x-0"}`}
            />
          </button>
          <span
            className={`text-sm font-medium ${isYearly ? "text-white" : "text-slate-400"}`}
          >
            Yearly{" "}
            <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
              Save 20%
            </span>
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Free Tier */}
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white mb-2">
                Free Starter
              </h3>
              <p className="text-3xl font-extrabold text-white mb-6">
                $0{" "}
                <span className="text-slate-500 text-sm font-normal">
                  / forever
                </span>
              </p>
              <ul className="space-y-3 text-sm text-slate-300 mb-8">
                <li className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>5 free AI chat messages per day</span>
                </li>
                <li className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Basic meal & macro logging</span>
                </li>
                <li className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Water & goal tracking</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handlePlanSelect("Free Starter Plan")}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-xl transition border border-slate-700"
            >
              Get Free Plan
            </button>
          </div>

          {/* Pro Tier */}
          <div className="bg-slate-900 border border-emerald-500/50 p-8 rounded-2xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 text-xs font-bold px-3 py-1 rounded-bl-lg">
              POPULAR
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">
                NutriMorph Pro
              </h3>
              <p className="text-3xl font-extrabold text-emerald-400 mb-6">
                {isYearly ? "$79.99" : "$9.99"}{" "}
                <span className="text-slate-500 text-sm font-normal">
                  / {isYearly ? "year" : "month"}
                </span>
              </p>
              <ul className="space-y-3 text-sm text-slate-300 mb-8">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Unlimited NutriBot AI messaging</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Unlimited AI photo meal scans</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Advanced dietary analytics & history</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Priority Gemini 3.5 Flash Lite responses</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() =>
                handlePlanSelect(
                  isYearly ? "Pro Yearly Plan" : "Pro Monthly Plan",
                )
              }
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl transition shadow-lg shadow-emerald-500/20"
            >
              Subscribe to Pro
            </button>
          </div>
        </div>
      </section>

      {/* Subscription Checkout Action Modal */}
      {showSubModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 max-w-md w-full p-6 rounded-2xl relative shadow-2xl">
            <button
              onClick={() => setShowSubModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl w-fit mb-4">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Subscribe to {selectedPlan}
            </h3>
            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
              Enter your registered account email to proceed with secure web
              checkout and sync your subscription with the NutriMorph app.
            </p>

            <form onSubmit={handleSubscriptionCheckout} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Account Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>

              {errorMessage && (
                <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 rounded-xl transition flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing Secure Checkout...</span>
                  </>
                ) : (
                  <span>Proceed to Payment</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-400">
          <p>© 2026 NutriMorph AI. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-6">
            <Link
              href="/privacy-policy"
              className="hover:text-emerald-400 transition"
            >
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-emerald-400 transition">
              Terms of Service
            </Link>
            <Link
              href="/delete-account"
              className="hover:text-emerald-400 transition"
            >
              Delete Account
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
