"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Zap,
  Smartphone,
  X,
  Loader2,
  ShieldAlert,
  Camera,
  Bot,
  PieChart,
  Download,
  Sparkles,
  CheckCircle2,
  Star,
  Quote,
  ChevronDown,
  Mail,
  LogIn,
  LogOut,
} from "lucide-react";

interface CheckoutPayload {
  plan: string;
  billingCycle: "monthly" | "yearly";
  email: string;
  aiModel: string;
}

interface CheckoutResponse {
  url?: string;
  message?: string;
}

export default function Home() {
  const router = useRouter();
  const [isYearly, setIsYearly] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loginErrorMessage, setLoginErrorMessage] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Initial state mein hi localStorage check kar lein (no useEffect warning needed!)
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("token");
    }
    return false;
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.reload();
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginErrorMessage("");

    try {
      const apiEndpoint =
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        "https://nutrimorph-backend.vercel.app";

      const res = await fetch(`${apiEndpoint}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      const token = data.token || data.accessToken;
      if (token) {
        localStorage.setItem("token", token);
        setIsLoggedIn(true);
        setShowLoginModal(false);
        setPassword("");
        alert("Login successful!");
      } else {
        throw new Error("Token not received from server.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setLoginErrorMessage(err.message);
      } else {
        setLoginErrorMessage("An unexpected error occurred during login.");
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Handle Plan Selection (Free vs Pro)
  const handlePlanSelect = async (planName: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to your account first.");
      setShowLoginModal(true);
      return;
    }

    // Handle Free Plan selection by updating the backend database directly
    if (planName === "Free Plan") {
      try {
        setLoading(true);
        const apiEndpoint =
          process.env.NEXT_PUBLIC_BACKEND_URL ||
          "https://nutrimorph-backend.vercel.app";

        const response = await fetch(`${apiEndpoint}/api/user/update-plan`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            plan: "Free",
            aiModel: "gemini-3.5-flash-lite",
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to update subscription plan.",
          );
        }

        alert("Free Plan activated successfully! Database updated.");
        // Redirect to dashboard using Next.js router
        router.push("/dashboard");
      } catch (err: unknown) {
        if (err instanceof Error) {
          alert(err.message);
        } else {
          alert("An unexpected error occurred while updating the plan.");
        }
      } finally {
        setLoading(false);
      }
      return;
    }

    // Pro Plan flow continues to Stripe Checkout modal
    setSelectedPlan(planName);
    setShowSubModal(true);
    setErrorMessage("");
  };

  // Helper function for Pro Plan Checkout (Ab yeh handleSubscriptionCheckout ke andar use hoga)
  const processBackendCheckout = async (
    payload: CheckoutPayload,
    token: string | null,
  ): Promise<CheckoutResponse> => {
    const apiEndpoint =
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      "https://nutrimorph-backend.vercel.app";

    const res = await fetch(
      `${apiEndpoint}/api/payment/create-checkout-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ` + token } : {}),
        },
        body: JSON.stringify(payload),
      },
    );

    const data = await res.json();
    if (!res.ok)
      throw new Error(data.message || "Backend payment processing failed");
    return data;
  };
  // Main Checkout Handler
  const handleSubscriptionCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage("Please enter your registered email address.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Not authorized. Please log in to your account first.");
      }

      // Yahan helper function ko call kiya gaya hai (unused error fix)
      const data = await processBackendCheckout(
        {
          plan: selectedPlan,
          billingCycle: isYearly ? "yearly" : "monthly",
          email: email,
          aiModel: "gemini-3.5-flash-lite",
        },
        token,
      );

      if (data.url) {
        window.location.assign(data.url);
      } else {
        throw new Error("Invalid payment gateway response.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message.includes("Failed to fetch")) {
          setErrorMessage(
            "Backend is waking up or unreachable. Please try again in 30 seconds.",
          );
        } else {
          setErrorMessage(err.message);
        }
      } else {
        setErrorMessage("Failed to process payment. Please try again.");
      }
    } finally {
      setLoading(false);
    }
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
              href="#how-it-works"
              className="hover:text-emerald-400 transition"
            >
              How It Works
            </Link>
            <Link
              href="#features"
              className="hover:text-emerald-400 transition"
            >
              Features
            </Link>
            <Link
              href="#testimonials"
              className="hover:text-emerald-400 transition"
            >
              Reviews
            </Link>
            <Link href="#faq" className="hover:text-emerald-400 transition">
              FAQ
            </Link>
            <Link href="#pricing" className="hover:text-emerald-400 transition">
              Plans
            </Link>
            <Link
              href="/contact"
              className="hover:text-emerald-400 transition flex items-center space-x-1"
            >
              <Mail className="w-4 h-4" />
              <span>Support</span>
            </Link>
            <Link
              href="/privacy-policy"
              className="hover:text-emerald-400 transition"
            >
              Privacy
            </Link>
            <Link
              href="/delete-account"
              className="text-red-400 hover:text-red-300 transition flex items-center space-x-1"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Delete Account</span>
            </Link>

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-xl transition flex items-center space-x-1"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-1.5 rounded-xl transition flex items-center space-x-1"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </button>
            )}
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

        {/* Download Buttons (Google Play & App Store Badges) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://play.google.com/store/apps/details?id=com.salmashahid.nutrimorph"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold px-6 py-3.5 rounded-xl transition"
          >
            <Download className="w-5 h-5 text-emerald-400" />
            <div className="text-left">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                Download on
              </div>
              <div className="text-sm font-semibold">Google Play Store</div>
            </div>
          </a>
          <a
            href="#coming-soon"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold px-6 py-3.5 rounded-xl transition opacity-90"
          >
            <Smartphone className="w-5 h-5 text-slate-400" />
            <div className="text-left">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                Coming Soon on
              </div>
              <div className="text-sm font-semibold">Apple App Store</div>
            </div>
          </a>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="max-w-6xl mx-auto px-6 py-20 border-t border-slate-900"
      >
        <div className="text-center mb-16">
          <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full">
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-3 mb-4">
            How NutriMorph Works
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base">
            Transform your health journey in seconds with our automated AI
            assistant.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl relative flex flex-col text-left">
            <div className="text-emerald-500 font-black text-4xl mb-4 opacity-40">
              01
            </div>
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mb-4">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Snap Your Food
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Take a quick picture of any meal or plate. No manual logging or
              searching complex databases required.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl relative flex flex-col text-left">
            <div className="text-emerald-500 font-black text-4xl mb-4 opacity-40">
              02
            </div>
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">AI Analysis</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Gemini Flash AI instantly detects ingredients, estimates portion
              sizes, and calculates calories & macros.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl relative flex flex-col text-left">
            <div className="text-emerald-500 font-black text-4xl mb-4 opacity-40">
              03
            </div>
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Reach Goals</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Track daily progress against your custom fitness goals and chat
              with NutriBot for personalized guidance.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="max-w-6xl mx-auto px-6 py-16 border-t border-slate-900"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">
            Smart Features Built For Your Fitness
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Discover how NutriMorph leverages advanced AI to automate your
            health tracking.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mb-4">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              AI Food Image Scanning
            </h3>
            <p className="text-sm text-slate-400">
              Snap any meal and let Gemini Flash detect ingredients, calories,
              and macros instantly.
            </p>
          </div>
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mb-4">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              NutriBot AI Coach
            </h3>
            <p className="text-sm text-slate-400">
              Chat 24/7 with your personal AI nutritionist for customized diet
              adjustments and tips.
            </p>
          </div>
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mb-4">
              <PieChart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Deep Macro Breakdown
            </h3>
            <p className="text-sm text-slate-400">
              Track protein, carbs, fats, and water intake accurately with
              interactive charts.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="max-w-6xl mx-auto px-6 py-20 border-t border-slate-900"
      >
        <div className="text-center mb-16">
          <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full">
            Verified Play Store Reviews
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-3 mb-4">
            Loved By Fitness Enthusiasts
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base">
            See what our active users have to say about their transformation
            journey with NutriMorph.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl flex flex-col justify-between relative">
            <Quote className="absolute top-6 right-6 w-8 h-8 text-emerald-500/10" />
            <div>
              <div className="flex space-x-1 text-amber-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                &ldquo;The food scanning feature is an absolute game changer! It
                accurately guesses macros within seconds. Saved me hours of
                manual logging.&rdquo;
              </p>
            </div>
            <div className="flex items-center space-x-3 border-t border-slate-800/80 pt-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center font-bold justify-center text-sm">
                JD
              </div>
              <div>
                <h4 className="text-white text-sm font-semibold">
                  Jonathan Davis
                </h4>
                <p className="text-slate-500 text-xs">Google Play User</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl flex flex-col justify-between relative">
            <Quote className="absolute top-6 right-6 w-8 h-8 text-emerald-500/10" />
            <div>
              <div className="flex space-x-1 text-amber-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                &ldquo;NutriBot AI coach feels like having a real dietician in
                my pocket. Whenever I feel stuck on my diet, it gives me instant
                custom adjustments!&rdquo;
              </p>
            </div>
            <div className="flex items-center space-x-3 border-t border-slate-800/80 pt-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center font-bold justify-center text-sm">
                SM
              </div>
              <div>
                <h4 className="text-white text-sm font-semibold">
                  Sarah Miller
                </h4>
                <p className="text-slate-500 text-xs">Google Play User</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl flex flex-col justify-between relative">
            <Quote className="absolute top-6 right-6 w-8 h-8 text-emerald-500/10" />
            <div>
              <div className="flex space-x-1 text-amber-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                &ldquo;Clean UI, fast Stripe checkout, and zero lags. The pro
                plan is totally worth every penny for anyone serious about
                bodybuilding.&rdquo;
              </p>
            </div>
            <div className="flex items-center space-x-3 border-t border-slate-800/80 pt-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center font-bold justify-center text-sm">
                AK
              </div>
              <div>
                <h4 className="text-white text-sm font-semibold">
                  Alex Walker
                </h4>
                <p className="text-slate-500 text-xs">Google Play User</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        id="faq"
        className="max-w-4xl mx-auto px-6 py-20 border-t border-slate-900"
      >
        <div className="text-center mb-16">
          <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full">
            Got Questions?
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-3 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base">
            Everything you need to know about billing, AI food analysis, and
            account security.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
            <button
              onClick={() => toggleFaq(1)}
              className="w-full px-6 py-5 text-left flex items-center justify-between text-white font-semibold transition hover:text-emerald-400"
            >
              <span>How accurate is the AI food image scanner?</span>
              <ChevronDown
                className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === 1 ? "rotate-180 text-emerald-400" : ""}`}
              />
            </button>
            {openFaq === 1 && (
              <div className="px-6 pb-5 text-sm text-slate-400 leading-relaxed border-t border-slate-800/50 pt-3">
                NutriMorph uses advanced Gemini 3.5 Flash AI, which achieves
                over 95% accuracy in detecting food ingredients and estimating
                standard portion sizes and macros.
              </div>
            )}
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
            <button
              onClick={() => toggleFaq(2)}
              className="w-full px-6 py-5 text-left flex items-center justify-between text-white font-semibold transition hover:text-emerald-400"
            >
              <span>Can I cancel or change my subscription anytime?</span>
              <ChevronDown
                className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === 2 ? "rotate-180 text-emerald-400" : ""}`}
              />
            </button>
            {openFaq === 2 && (
              <div className="px-6 pb-5 text-sm text-slate-400 leading-relaxed border-t border-slate-800/50 pt-3">
                Yes, absolutely! You can manage, upgrade, or cancel your
                subscription anytime directly through your billing portal or
                Google Play account settings with no hidden cancellation fees.
              </div>
            )}
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
            <button
              onClick={() => toggleFaq(3)}
              className="w-full px-6 py-5 text-left flex items-center justify-between text-white font-semibold transition hover:text-emerald-400"
            >
              <span>How do I delete my account and personal data?</span>
              <ChevronDown
                className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === 3 ? "rotate-180 text-emerald-400" : ""}`}
              />
            </button>
            {openFaq === 3 && (
              <div className="px-6 pb-5 text-sm text-slate-400 leading-relaxed border-t border-slate-800/50 pt-3">
                We respect your privacy completely. You can permanently delete
                your account and all associated health logs instantly by
                visiting our{" "}
                <Link
                  href="/delete-account"
                  className="text-emerald-400 underline"
                >
                  Delete Account
                </Link>{" "}
                page.
              </div>
            )}
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
            <button
              onClick={() => toggleFaq(4)}
              className="w-full px-6 py-5 text-left flex items-center justify-between text-white font-semibold transition hover:text-emerald-400"
            >
              <span>Is my personal health and meal data secure?</span>
              <ChevronDown
                className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === 4 ? "rotate-180 text-emerald-400" : ""}`}
              />
            </button>
            {openFaq === 4 && (
              <div className="px-6 pb-5 text-sm text-slate-400 leading-relaxed border-t border-slate-800/50 pt-3">
                Yes. All data transmitted between your mobile device and our
                cloud servers is encrypted with industry-standard protocols,
                ensuring complete security and confidentiality.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="max-w-5xl mx-auto px-6 py-16 border-t border-slate-900"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-4">
            Choose Your Plan
          </h2>
          <div className="inline-flex items-center space-x-4 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                !isYearly
                  ? "bg-emerald-500 text-slate-950"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                isYearly
                  ? "bg-emerald-500 text-slate-950"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Yearly (Save 20%)
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Free Plan</h3>
              <p className="text-slate-400 text-sm mb-6">
                Basic food logging and limited macro tracking.
              </p>
              <div className="text-3xl font-extrabold text-white mb-6">$0</div>
            </div>
            <button
              onClick={() => handlePlanSelect("Free Plan")}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition"
            >
              Get Started Free
            </button>
          </div>

          <div className="bg-slate-900 border border-emerald-500/50 p-8 rounded-2xl flex flex-col justify-between relative shadow-lg shadow-emerald-500/10">
            <div>
              <span className="absolute -top-3 right-6 bg-emerald-500 text-slate-950 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                Popular
              </span>
              <h3 className="text-xl font-bold text-white mb-2">Pro Plan</h3>
              <p className="text-slate-400 text-sm mb-6">
                Advanced AI scanning & deep macro breakdown.
              </p>
              <div className="text-3xl font-extrabold text-white mb-6">
                {isYearly ? "$99/yr" : "$9.99/mo"}
              </div>
            </div>
            <button
              onClick={() => handlePlanSelect("Pro Plan")}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl transition"
            >
              Select Pro
            </button>
          </div>
        </div>
      </section>

      {/* Subscription Checkout Modal */}
      {showSubModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md p-6 rounded-2xl relative shadow-2xl">
            <button
              onClick={() => setShowSubModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-2">
              Confirm Subscription
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              Selected:{" "}
              <span className="text-emerald-400 font-semibold">
                {selectedPlan}
              </span>{" "}
              ({isYearly ? "Yearly" : "Monthly"})
            </p>

            <form onSubmit={handleSubscriptionCheckout} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Hidden configuration info for Gemini AI tier tracking */}
              <input
                type="hidden"
                name="aiModel"
                value="gemini-3.5-flash-lite"
              />

              {errorMessage && (
                <div className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl transition flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>
                  {loading ? "Processing..." : "Proceed to Secure Checkout"}
                </span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md p-6 rounded-2xl relative shadow-2xl">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-2">
              Login to NutriMorph
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              Enter your account credentials to access subscriptions.
            </p>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              {loginErrorMessage && (
                <div className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg">
                  {loginErrorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl transition flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loginLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{loginLoading ? "Logging in..." : "Login"}</span>
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
            <Link href="/contact" className="hover:text-emerald-400 transition">
              Support / Contact
            </Link>
            <Link
              href="/privacy-policy"
              className="hover:text-emerald-400 transition"
            >
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-emerald-400 transition">
              Terms & Conditions
            </Link>
            <Link
              href="/delete-account"
              className="text-red-400 hover:text-red-300 transition"
            >
              Delete Account
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
