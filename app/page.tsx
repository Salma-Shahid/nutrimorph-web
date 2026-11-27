"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { initializePaddle, type Paddle } from "@paddle/paddle-js";
import { API_BASE_URL } from "@/lib/api";
import {
  Camera,
  Bot,
  PieChart,
  Globe,
  ChevronDown,
  Zap,
  Download,
  Smartphone,
  Sparkles,
  CheckCircle2,
  Quote,
  Star,
  Mail,
  ShieldAlert,
  LogIn,
  LogOut,
  X,
  Loader2,
} from "lucide-react";

interface PlayStoreReview {
  _id: string;
  author?: string;
  comment?: string;
  rating?: number;
  updatedAt?: string;
}

// Parses JSON without throwing on empty/HTML error pages (e.g. a cold-start 504).
const readJson = async (response: Response) => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};

// fetch with a timeout so buttons never stay stuck on "Processing...".
const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeoutMs = 20000,
) => {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("The server took too long to respond. Please try again.");
    }
    if (error instanceof TypeError) {
      throw new Error(
        "Backend is waking up or unreachable. Please try again shortly.",
      );
    }
    throw error;
  } finally {
    window.clearTimeout(timer);
  }
};

type WebCheckoutMode = "revenuecat" | "paddle" | "app";

// Must match `expo.android.package` in nutrimorph/app.json. Override with
// NEXT_PUBLIC_PLAY_STORE_URL (full URL) or NEXT_PUBLIC_ANDROID_PACKAGE.
const ANDROID_PACKAGE =
  process.env.NEXT_PUBLIC_ANDROID_PACKAGE?.trim() || "com.nutrimorph.app";
const PLAY_STORE_URL =
  process.env.NEXT_PUBLIC_PLAY_STORE_URL?.trim() ||
  `https://play.google.com/store/apps/details?id=${encodeURIComponent(ANDROID_PACKAGE)}`;
const PLAY_SUBSCRIPTIONS_URL =
  "https://play.google.com/store/account/subscriptions";

// Optional RevenueCat Web Purchase Link base (https://pay.rev.cat/<token>).
// The backend config can provide it too; this env var wins when set.
const toHttpsUrl = (value?: string | null) => {
  const raw = (value || "").trim();
  return /^https:\/\/\S+$/i.test(raw) ? raw.replace(/\/+$/, "") : null;
};
const WEB_PURCHASE_URL_ENV = toHttpsUrl(
  process.env.NEXT_PUBLIC_REVENUECAT_WEB_PURCHASE_URL,
);

// RevenueCat Web Purchase Links take the app user ID as the last path
// segment, so the purchase is granted to this NutriMorph account.
const buildWebPurchaseLink = (base: string, appUserId: string, email: string) => {
  const url = `${base}/${encodeURIComponent(appUserId)}`;
  return email ? `${url}?email=${encodeURIComponent(email)}` : url;
};

export default function Home() {
  const paddleRef = useRef<Paddle | null>(null);
  // Resolves once Paddle.js has loaded (or null if it can't), so a click made
  // while it is still loading waits instead of failing.
  const paddleReadyRef = useRef<Promise<Paddle | null> | null>(null);
  // How Pro is sold on the website (from GET /api/payment/config):
  // "revenuecat" = RevenueCat Web Purchase Link, "paddle" = legacy fallback,
  // "app" = subscribe in the mobile app. null until loaded.
  const [webCheckout, setWebCheckout] = useState<WebCheckoutMode | null>(
    null,
  );
  const [webPurchaseUrl, setWebPurchaseUrl] = useState<string | null>(
    WEB_PURCHASE_URL_ENV,
  );
  const [userId, setUserId] = useState("");
  const [planActionLoading, setPlanActionLoading] = useState(false);
  const [billingProvider, setBillingProvider] = useState<string | null>(null);
  const [isYearly, setIsYearly] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [email, setEmail] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userEmail") || "";
    }
    return "";
  });
  const [currentPlan, setCurrentPlan] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userPlan") || "Free";
    }
    return "Free";
  });
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loginErrorMessage, setLoginErrorMessage] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [playStoreReviews, setPlayStoreReviews] = useState<PlayStoreReview[]>(
    [],
  );
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState("");

  // Paddle.js is a singleton, so this is safe to run once and keep.
  useEffect(() => {
    const token =
      process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ||
      process.env.NEXT_PUBLIC_VITE_PADDLE_CLIENT_TOKEN ||
      process.env.VITE_PADDLE_CLIENT_TOKEN;
    const rawEnvironment =
      process.env.NEXT_PUBLIC_PADDLE_ENV ||
      process.env.NEXT_PUBLIC_VITE_PADDLE_ENV ||
      process.env.VITE_PADDLE_ENV ||
      "sandbox";
    const environment =
      rawEnvironment === "production"
        ? "production"
        : rawEnvironment === "sandbox"
          ? "sandbox"
          : null;
    if (!token || !environment) {
      paddleReadyRef.current = Promise.resolve(null);
      return;
    }

    paddleReadyRef.current = initializePaddle({
      token,
      environment,
    })
      .then((paddle) => {
        if (paddle) paddleRef.current = paddle;
        return paddle || null;
      })
      .catch((error: unknown) => {
        console.error("Could not initialize Paddle:", error);
        return null;
      });
  }, []);

  // Which billing options the backend supports (no secrets). RevenueCat is
  // app-only; Paddle web checkout is an optional fallback.
  useEffect(() => {
    let active = true;
    fetchWithTimeout(`${API_BASE_URL}/api/payment/config`, { cache: "no-store" })
      .then(readJson)
      .then((result) => {
        if (!active) return;
        const data = result?.data;
        const linkUrl =
          WEB_PURCHASE_URL_ENV || toHttpsUrl(data?.revenueCat?.webPurchaseUrl);
        setWebPurchaseUrl(linkUrl);
        setWebCheckout(
          linkUrl ? "revenuecat" : data?.paddle?.configured ? "paddle" : "app",
        );
      })
      .catch(() => {
        // Backend unreachable: never block. Use the web link if the site has
        // one, otherwise guide the user to the app.
        if (active) setWebCheckout(WEB_PURCHASE_URL_ENV ? "revenuecat" : "app");
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/reviews`, {
          cache: "no-store",
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(
            result?.message || "Could not load Play Store reviews.",
          );
        }
        if (active) setPlayStoreReviews(result?.data || []);
      } catch (error) {
        if (active) {
          setReviewsError(
            error instanceof Error ? error.message : "Could not load reviews.",
          );
        }
      } finally {
        if (active) setReviewsLoading(false);
      }
    };

    fetchReviews();
    return () => {
      active = false;
    };
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("token");
    }
    return false;
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        if (res.status === 401 || res.status === 403) {
          // Expired/deactivated session: show the signed-out state.
          localStorage.removeItem("token");
          localStorage.removeItem("userPlan");
          setIsLoggedIn(false);
          setCurrentPlan("Free");
          return;
        }

        if (res.ok) {
          const data = await readJson(res);
          const userObj = data?.user || data;

          // The server's isPro already accounts for expiry and status.
          const userPlan = userObj?.isPro === true ? "pro" : "Free";
          const userEmail = userObj?.email || "";

          setCurrentPlan(userPlan);
          setBillingProvider(userObj?.billingProvider || null);
          setUserId(String(userObj?._id || userObj?.id || ""));
          localStorage.setItem("userPlan", userPlan);

          if (userEmail) {
            setEmail(userEmail);
            localStorage.setItem("userEmail", userEmail);
          }
        }
      } catch (err) {
        console.error("Failed to fetch user subscription status", err);
      }
    };

    if (isLoggedIn) {
      fetchUserProfile();
    }
    const refreshVisibleProfile = () => {
      if (document.visibilityState === "visible" && isLoggedIn) {
        fetchUserProfile();
      }
    };
    const refreshInterval = window.setInterval(() => {
      if (isLoggedIn) fetchUserProfile();
    }, 15000);
    document.addEventListener("visibilitychange", refreshVisibleProfile);
    return () => {
      window.clearInterval(refreshInterval);
      document.removeEventListener("visibilitychange", refreshVisibleProfile);
    };
  }, [isLoggedIn]);

  // Show confirmation after returning from checkout.
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const paymentStatus = queryParams.get("payment");

    // "success" = RevenueCat Web Purchase Link redirect; "pending" = Paddle.
    if (paymentStatus !== "pending" && paymentStatus !== "success") return;

    const verifySubscription = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token)
          throw new Error("Please sign in to verify your subscription.");
        // Ask the server to re-check RevenueCat now instead of waiting for
        // the webhook. Failure is fine: the webhook still grants access.
        await fetchWithTimeout(`${API_BASE_URL}/api/payment/revenuecat/sync`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => null);
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        const result = await readJson(response);
        if (!response.ok) {
          throw new Error(
            result.message || "Could not verify the subscription.",
          );
        }
        const profile = result?.user || result;
        if (profile?.isPro === true) {
          setCurrentPlan("pro");
          localStorage.setItem("userPlan", "pro");
          alert("Your payment was verified and Pro is active.");
        } else {
          alert(
            "Checkout completed. Pro access will appear within a minute, as soon as your payment is confirmed. It also unlocks in the NutriMorph app with the same account.",
          );
        }
      } catch (error) {
        console.error(
          "Could not verify the subscription after checkout:",
          error,
        );
        alert(
          "Payment completed, but the subscription status could not be verified. Please refresh or contact support.",
        );
      } finally {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );
      }
    };

    verifySubscription();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPlan");
    setIsLoggedIn(false);
    setEmail("");
    setCurrentPlan("Free");
    window.location.reload();
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginErrorMessage("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
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

        const loggedInEmail = data?.user?.email || data?.email || email;
        const loggedInPlan =
          (data?.user?.isPro ?? data?.isPro) === true ? "pro" : "Free";

        if (loggedInEmail) {
          setEmail(loggedInEmail);
          localStorage.setItem("userEmail", loggedInEmail);
        }
        if (loggedInPlan) {
          setCurrentPlan(loggedInPlan);
          localStorage.setItem("userPlan", loggedInPlan);
        }

        setShowLoginModal(false);
        setPassword("");
        window.location.reload();
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

    if (planName === "Pro Plan" && currentPlan.toLowerCase() === "pro") {
      alert("You are already subscribed to the Pro Plan!");
      return;
    }

    if (planName === "Free Plan") {
      if (currentPlan.toLowerCase() !== "pro") {
        alert("You're already on the Free plan.");
        return;
      }
      if (planActionLoading) return;
      if (billingProvider === "admin") {
        alert(
          "Your Pro access was granted by NutriMorph support, so there is no subscription to cancel. Contact support to change it.",
        );
        return;
      }
      if (billingProvider === "revenuecat") {
        // RevenueCat subscriptions are managed where they were bought.
        if (
          window.confirm(
            "Your Pro subscription is managed by Google Play, the App Store, or (for web purchases) the RevenueCat billing email you received.\n\nOpen Google Play subscriptions now?",
          )
        ) {
          window.open(PLAY_SUBSCRIPTIONS_URL, "_blank", "noopener,noreferrer");
        }
        return;
      }
      if (
        !window.confirm(
          "Switch to the Free plan? Your Pro subscription will be cancelled at the end of the current billing period.",
        )
      ) {
        return;
      }
      setPlanActionLoading(true);
      try {
        const response = await fetchWithTimeout(
          `${API_BASE_URL}/api/payment/cancel-subscription`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({}),
          },
        );

        const result = await readJson(response);
        if (!response.ok) {
          throw new Error(
            result.message || "Could not update the subscription.",
          );
        }
        if (result.manageInStore && result.manageUrl) {
          // Store subscriptions can only be cancelled in the store.
          if (window.confirm(`${result.message}\n\nOpen your store subscriptions page?`)) {
            window.open(result.manageUrl, "_blank", "noopener,noreferrer");
          }
        } else {
          alert(result.message || "Your subscription settings were updated.");
        }
      } catch (err: unknown) {
        alert(
          "Plan update error: " +
            (err instanceof Error ? err.message : "An unknown error occurred."),
        );
      } finally {
        setPlanActionLoading(false);
      }
      return;
    }

    setSelectedPlan(planName);
    setLoading(false);
    setErrorMessage("");
    setShowSubModal(true);
  };

  // Config may still be loading on a fast click: use the site's web link if
  // it has one, otherwise guide to the app. Never a dead state.
  const checkoutMode: WebCheckoutMode =
    webCheckout ?? (webPurchaseUrl ? "revenuecat" : "app");

  // The NutriMorph account ID is the RevenueCat app user ID.
  const resolveUserId = async (token: string) => {
    if (userId) return userId;
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const result = await readJson(response);
    if (!response.ok) {
      throw new Error(result?.message || "Please sign in again to continue.");
    }
    const id = String(result?.user?._id || result?._id || "");
    if (!id) throw new Error("Could not identify your account. Please sign in again.");
    setUserId(id);
    return id;
  };

  const openRevenueCatWebCheckout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowSubModal(false);
      setShowLoginModal(true);
      return;
    }
    if (!webPurchaseUrl) {
      throw new Error("Web checkout link is missing. Subscribe in the NutriMorph app.");
    }
    const id = await resolveUserId(token);
    // Same tab, so RevenueCat's success redirect (?payment=success) returns here.
    window.location.assign(buildWebPurchaseLink(webPurchaseUrl, id, email));
  };

  const openPaddleCheckout = async (
    clientPriceId: string | undefined,
    billingCycle: "monthly" | "yearly",
  ) => {
    const paddleEnvironment =
      process.env.NEXT_PUBLIC_PADDLE_ENV ||
      process.env.NEXT_PUBLIC_VITE_PADDLE_ENV ||
      process.env.VITE_PADDLE_ENV ||
      "sandbox";
    if (!["sandbox", "production"].includes(paddleEnvironment)) {
      throw new Error("NEXT_PUBLIC_PADDLE_ENV must be sandbox or production.");
    }
    if (
      !process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN &&
      !process.env.NEXT_PUBLIC_VITE_PADDLE_CLIENT_TOKEN &&
      !process.env.VITE_PADDLE_CLIENT_TOKEN
    ) {
      throw new Error(
        "Web checkout is not configured on this site. Subscribe in the NutriMorph mobile app.",
      );
    }
    // Wait (bounded) for Paddle.js if the click came before it finished loading.
    const paddle =
      paddleRef.current ||
      (await Promise.race([
        paddleReadyRef.current || Promise.resolve(null),
        new Promise<null>((resolve) => window.setTimeout(() => resolve(null), 10000)),
      ]));
    if (!paddle) {
      throw new Error(
        "Secure checkout could not be loaded. Disable ad/script blockers and try again.",
      );
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Not authorized. Please log in to your account first.");
      }

      const response = await fetchWithTimeout(
        `${API_BASE_URL}/api/payment/create-checkout-intent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ billingCycle }),
        },
      );
      const intent = await readJson(response);
      if (!response.ok) {
        if (response.status === 409) {
          // Already Pro on the server: sync the UI instead of erroring.
          setCurrentPlan("pro");
          localStorage.setItem("userPlan", "pro");
          setShowSubModal(false);
        }
        throw new Error(intent.message || "Could not prepare Paddle checkout.");
      }
      if (!intent.priceId || !intent.intentId || !intent.email) {
        throw new Error("The server returned an incomplete checkout. Please try again.");
      }
      // The backend price is authoritative; a stale site env var shouldn't block checkout.
      if (clientPriceId && clientPriceId !== intent.priceId) {
        console.warn(
          `NEXT_PUBLIC_PADDLE_${billingCycle.toUpperCase()}_PRICE_ID differs from the backend price; using the backend price.`,
        );
      }

      paddle.Checkout.open({
        items: [{ priceId: intent.priceId, quantity: 1 }],
        customer: { email: intent.email || email },
        customData: {
          checkoutIntentId: intent.intentId,
          planTier: "Pro",
          billingCycle,
          aiModel: "gemini-3.5-flash-lite",
        },
        settings: {
          displayMode: "overlay",
          theme: "dark",
          successUrl: `${window.location.origin}/?payment=pending`,
        },
      });
    } catch (error: unknown) {
      throw error instanceof Error
        ? error
        : new Error("Failed to prepare Paddle checkout.");
    }
  };

  const handleSubscriptionCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    const billingCycle = isYearly ? "yearly" : "monthly";
    const priceId =
      billingCycle === "yearly"
        ? process.env.NEXT_PUBLIC_PADDLE_YEARLY_PRICE_ID ||
          process.env.NEXT_PUBLIC_VITE_PADDLE_YEARLY_PRICE_ID ||
          process.env.VITE_PADDLE_YEARLY_PRICE_ID
        : process.env.NEXT_PUBLIC_PADDLE_MONTHLY_PRICE_ID ||
          process.env.NEXT_PUBLIC_VITE_PADDLE_MONTHLY_PRICE_ID ||
          process.env.VITE_PADDLE_MONTHLY_PRICE_ID;
    if (loading) return;

    if (checkoutMode === "app") {
      // No web checkout configured: send the user to the app, where Pro is
      // sold through Google Play via RevenueCat.
      window.open(PLAY_STORE_URL, "_blank", "noopener,noreferrer");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    try {
      if (checkoutMode === "revenuecat") {
        await openRevenueCatWebCheckout();
        return;
      }
      await openPaddleCheckout(priceId, billingCycle);
      // The overlay is open; close our modal so it doesn't sit behind it.
      setShowSubModal(false);
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Failed to process payment. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Header / Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center space-x-2 shrink-0">
            <Image
              src="/logo.png"
              alt="NutriMorph Logo"
              width={36}
              height={36}
              className="w-9 h-9 object-contain rounded-lg"
            />
            <span className="text-lg font-bold tracking-tight text-white">
              Nutri<span className="text-emerald-400">Morph</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-4 text-xs text-slate-300 font-medium shrink-0">
            <Link
              href="#how-it-works"
              className="hover:text-emerald-400 transition whitespace-nowrap"
            >
              How It Works
            </Link>
            <Link
              href="#features"
              className="hover:text-emerald-400 transition whitespace-nowrap"
            >
              Features
            </Link>
            <Link
              href="#testimonials"
              className="hover:text-emerald-400 transition whitespace-nowrap"
            >
              Reviews
            </Link>
            <Link
              href="#faq"
              className="hover:text-emerald-400 transition whitespace-nowrap"
            >
              FAQ
            </Link>
            <Link
              href="#pricing"
              className="hover:text-emerald-400 transition whitespace-nowrap"
            >
              Plans
            </Link>
            <Link
              href="/blog"
              className="hover:text-emerald-400 transition whitespace-nowrap"
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className="hover:text-emerald-400 transition flex items-center space-x-1 whitespace-nowrap"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Support</span>
            </Link>
            <Link
              href="/privacy-policy"
              className="hover:text-emerald-400 transition whitespace-nowrap"
            >
              Privacy
            </Link>
            <Link
              href="/delete-account"
              className="text-red-400 hover:text-red-300 transition flex items-center space-x-1 whitespace-nowrap"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Delete Account</span>
            </Link>
          </nav>

          <div className="flex items-center space-x-2 shrink-0">
            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1.5 bg-slate-950/80 border border-slate-800 px-2.5 py-1 rounded-xl text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                  <span className="text-slate-300 font-medium truncate max-w-28 sm:max-w-36">
                    {email || "User"}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-wider ${
                      currentPlan.toLowerCase().includes("pro")
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-slate-800 text-slate-400 border border-slate-700"
                    }`}
                  >
                    {currentPlan}
                  </span>
                </div>

                {/* Logout action */}
                <button
                  onClick={handleLogout}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-2.5 py-1 rounded-xl transition flex items-center space-x-1 text-xs font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-xl transition flex items-center space-x-1 text-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            )}
          </div>
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
            href={PLAY_STORE_URL}
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
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mb-4">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              AI Food Image Scanning
            </h3>
            <p className="text-sm text-slate-400">
              Snap any meal and let Gemini Flash AI detect ingredients,
              calories, and macros instantly.
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
              interactive progress metrics.
            </p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mb-4">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Multilingual & Local Foods
            </h3>
            <p className="text-sm text-slate-400">
              Accurately recognizes international & regional meals (including
              Desi & home-cooked dishes).
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

        {reviewsLoading ? (
          <div className="text-center text-slate-400">Loading reviews…</div>
        ) : reviewsError ? (
          <div className="text-center text-slate-400">
            Play Store reviews are temporarily unavailable.
          </div>
        ) : playStoreReviews.length === 0 ? (
          <div className="text-center text-slate-400">
            No public Play Store reviews are available yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {playStoreReviews.slice(0, 6).map((review) => {
              const author = review.author?.trim() || "Google Play user";
              const initials =
                author
                  .split(/\s+/)
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase() || "GP";
              const rating = Math.min(
                5,
                Math.max(0, Number(review.rating) || 0),
              );
              return (
                <article
                  key={review._id}
                  className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl flex flex-col justify-between relative"
                >
                  <Quote className="absolute top-6 right-6 w-8 h-8 text-emerald-500/10" />
                  <div>
                    <div className="flex space-x-1 text-amber-400 mb-4">
                      {Array.from({ length: 5 }, (_, index) => (
                        <Star
                          key={index}
                          className={`w-4 h-4 ${index < rating ? "fill-amber-400" : ""}`}
                        />
                      ))}
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed mb-6 whitespace-pre-wrap">
                      {review.comment || "No review text provided."}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 border-t border-slate-800/80 pt-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center font-bold justify-center text-sm">
                      {initials}
                    </div>
                    <div>
                      <h4 className="text-white text-sm font-semibold">
                        {author}
                      </h4>
                      <p className="text-slate-500 text-xs">
                        Google Play review
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
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
            Everything you need to know about billing, AI food analysis,
            regional dish recognition, and account security.
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
                NutriMorph is AI food scanner is powered by advanced vision
                models designed to detect food items, portion sizes, and
                nutrient breakdowns with high precision, minimizing the need for
                tedious manual logging.
              </div>
            )}
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
            <button
              onClick={() => toggleFaq(2)}
              className="w-full px-6 py-5 text-left flex items-center justify-between text-white font-semibold transition hover:text-emerald-400"
            >
              <span>
                Does NutriMorph recognize regional and home-cooked dishes?
              </span>
              <ChevronDown
                className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === 2 ? "rotate-180 text-emerald-400" : ""}`}
              />
            </button>
            {openFaq === 2 && (
              <div className="px-6 pb-5 text-sm text-slate-400 leading-relaxed border-t border-slate-800/50 pt-3">
                Yes! Unlike traditional Western diet apps, NutriMorph’s AI
                vision model is optimized to recognize a wide variety of
                regional, South Asian, and international home-cooked meals
                accurately.
              </div>
            )}
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
            <button
              onClick={() => toggleFaq(3)}
              className="w-full px-6 py-5 text-left flex items-center justify-between text-white font-semibold transition hover:text-emerald-400"
            >
              <span>How does the step tracking and health sync work?</span>
              <ChevronDown
                className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === 3 ? "rotate-180 text-emerald-400" : ""}`}
              />
            </button>
            {openFaq === 3 && (
              <div className="px-6 pb-5 text-sm text-slate-400 leading-relaxed border-t border-slate-800/50 pt-3">
                NutriMorph seamlessly integrates with native device sensors and
                health frameworks to monitor your daily steps and physical
                activities accurately, factoring them directly into your daily
                energy expenditure calculations.
              </div>
            )}
          </div>
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
            <button
              onClick={() => toggleFaq(3)}
              className="w-full px-6 py-5 text-left flex items-center justify-between text-white font-semibold transition hover:text-emerald-400"
            >
              <span>
                Can I use NutriMorph without an active internet connection?
              </span>
              <ChevronDown
                className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === 3 ? "rotate-180 text-emerald-400" : ""}`}
              />
            </button>
            {openFaq === 3 && (
              <div className="px-6 pb-5 text-sm text-slate-400 leading-relaxed border-t border-slate-800/50 pt-3">
                Yes, NutriMorph can be used offline for basic features like
                manual food logging and step tracking. However, AI food image
                scanning and NutriBot chat require an active internet connection
                to function properly.
              </div>
            )}
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
            <button
              onClick={() => toggleFaq(4)}
              className="w-full px-6 py-5 text-left flex items-center justify-between text-white font-semibold transition hover:text-emerald-400"
            >
              <span>What is included in the Free vs Pro Plan?</span>
              <ChevronDown
                className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === 4 ? "rotate-180 text-emerald-400" : ""}`}
              />
            </button>
            {openFaq === 4 && (
              <div className="px-6 pb-5 text-sm text-slate-400 leading-relaxed border-t border-slate-800/50 pt-3">
                Free Plan: Includes standard daily calorie tracking, basic
                manual food logging, and a limited number of daily AI photo
                recognition scans. <br /> Pro Plan: Unlocks unlimited AI food
                photo analysis, advanced macro breakdowns, custom AI dietician
                coaching, and priority cloud data synchronization.
              </div>
            )}
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
            <button
              onClick={() => toggleFaq(5)}
              className="w-full px-6 py-5 text-left flex items-center justify-between text-white font-semibold transition hover:text-emerald-400"
            >
              <span>Can I cancel or change my subscription anytime?</span>
              <ChevronDown
                className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === 5 ? "rotate-180 text-emerald-400" : ""}`}
              />
            </button>
            {openFaq === 5 && (
              <div className="px-6 pb-5 text-sm text-slate-400 leading-relaxed border-t border-slate-800/50 pt-3">
                Yes, absolutely! You can manage, upgrade, or cancel your
                subscription anytime directly through your billing portal or
                Google Play account settings with no hidden cancellation fees.
              </div>
            )}
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
            <button
              onClick={() => toggleFaq(6)}
              className="w-full px-6 py-5 text-left flex items-center justify-between text-white font-semibold transition hover:text-emerald-400"
            >
              <span>How do I delete my account and personal data?</span>
              <ChevronDown
                className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === 6 ? "rotate-180 text-emerald-400" : ""}`}
              />
            </button>
            {openFaq === 6 && (
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
              onClick={() => toggleFaq(7)}
              className="w-full px-6 py-5 text-left flex items-center justify-between text-white font-semibold transition hover:text-emerald-400"
            >
              <span>Is my personal health and meal data secure?</span>
              <ChevronDown
                className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === 7 ? "rotate-180 text-emerald-400" : ""}`}
              />
            </button>
            {openFaq === 7 && (
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
              Yearly
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
              disabled={planActionLoading}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {planActionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {planActionLoading
                ? "Updating..."
                : currentPlan.toLowerCase() === "pro"
                  ? "Switch to Free"
                  : "Get Started Free"}
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
                {isYearly ? "Yearly billing" : "Monthly billing"}
              </div>
              <p className="text-slate-400 text-sm mb-6">
                {checkoutMode === "app"
                  ? "Subscribe in the NutriMorph app. Final price is shown by Google Play."
                  : "Final amount and currency are shown in secure checkout."}
              </p>
            </div>
            <button
              onClick={() => handlePlanSelect("Pro Plan")}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl transition"
            >
              {currentPlan.toLowerCase() === "pro" ? "Current Plan" : "Select Pro"}
            </button>
          </div>
        </div>
      </section>

      {/* Subscription Checkout Modal */}
      {showSubModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md p-6 rounded-2xl relative shadow-2xl">
            <button
              onClick={() => {
                setShowSubModal(false);
                setErrorMessage("");
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
              aria-label="Close checkout"
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
              {checkoutMode === "app" ? (
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-sm text-slate-300 space-y-2">
                  <p className="font-semibold text-white">
                    Subscribe in the NutriMorph app
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-slate-400">
                    <li>Install or open NutriMorph on your phone.</li>
                    <li>
                      Sign in with{" "}
                      <span className="text-emerald-400">
                        {email || "this account"}
                      </span>
                      .
                    </li>
                    <li>Go to Profile → Upgrade to Pro and choose a plan.</li>
                  </ol>
                  <p className="text-xs text-slate-500">
                    Pro unlocks on every device signed in to this account,
                    including this website.
                  </p>
                </div>
              ) : (
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
              )}

              {errorMessage && (
                <div className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl transition flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>
                  {loading
                    ? "Opening secure checkout..."
                    : checkoutMode === "app"
                      ? "Get the NutriMorph App"
                      : "Proceed to Secure Checkout"}
                </span>
              </button>

              {checkoutMode !== "app" && (
                <a
                  href={PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center text-xs text-slate-400 hover:text-emerald-400"
                >
                  Prefer the app? Subscribe in NutriMorph on Google Play
                </a>
              )}
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
              <div className="text-right">
                <Link
                  href="/forgot-password"
                  className="text-sm text-emerald-400 hover:text-emerald-300"
                >
                  Forgot password?
                </Link>
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
            <a
              href="mailto:nutrimorphsupport@gmail.com"
              className="hover:text-emerald-400 transition"
            >
              Email support
            </a>
            <a
              href="https://nutrimorph.app"
              target="_blank"
              rel="noreferrer"
              className="hover:text-emerald-400 transition"
            >
              Official website
            </a>
            <Link
              href="/privacy-policy"
              className="hover:text-emerald-400 transition"
            >
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-emerald-400 transition">
              Terms & Conditions
            </Link>
            <Link href="/refund" className="hover:text-emerald-400 transition">
              Refund Policy
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
