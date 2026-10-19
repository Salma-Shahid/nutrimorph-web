import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  Sparkles,
  Smartphone,
  Globe,
} from "lucide-react";

export const metadata: Metadata = {
  title: "AI Macro Tracking in 2026: Revolutionize Your Diet with NutriMorph",
  description:
    "Learn how Google Gemini AI and multimodal computer vision transform meal logging into a single photo snap. Track protein, carbs, and calories effortlessly with NutriMorph.",
  keywords: [
    "AI Macro Tracker",
    "Google Gemini Nutrition",
    "AI Calorie Counter App",
    "NutriMorph AI",
    "Photo Food Logging 2026",
    "Automated Macro Tracking",
  ],
  openGraph: {
    title: "AI Macro Tracking in 2026: Revolutionize Your Diet with NutriMorph",
    description:
      "Log meals instantly using Google Gemini AI photo scanning. Discover the future of automated macro tracking.",
    url: "https://nutrimorph-web.vercel.app/blog/ai-macro-tracking",
    siteName: "NutriMorph AI",
    images: [
      {
        url: "/AI-Powered.png",
        width: 1200,
        height: 630,
        alt: "NutriMorph AI Macro Tracker Interface",
      },
    ],
    locale: "en_US",
    type: "article",
  },
};

export default function AIMacroTrackingBlog() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/blog"
            className="flex items-center space-x-2 text-slate-300 hover:text-emerald-400 transition text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Articles</span>
          </Link>
          <span className="text-sm font-bold tracking-tight text-white">
            Nutri<span className="text-emerald-400">Morph</span> AI Blog
          </span>
        </div>
      </header>

      {/* Main Container */}
      <article className="max-w-3xl mx-auto px-4 py-12">
        {/* Category & Title */}
        <div className="mb-6">
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            AI & Technology
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-4 leading-tight tracking-tight">
            How AI-Powered Macro Tracking is Revolutionizing Fitness in 2026
          </h1>
        </div>

        {/* Article Meta */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 border-b border-slate-800 pb-6 mb-8">
          <span className="flex items-center space-x-1.5">
            <User className="w-3.5 h-3.5 text-emerald-400" />
            <span>NutriMorph AI Research Team</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>October 18, 2026</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>7 min read</span>
          </span>
        </div>

        {/* Featured Image */}
        <div className="relative h-64 sm:h-96 w-full rounded-2xl overflow-hidden border border-slate-800 mb-10">
          <Image
            src="/AI-Powered.png"
            alt="AI Powered Macro Tracking with NutriMorph"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Article Body */}
        <div className="space-y-8 text-slate-300 text-base leading-relaxed">
          <p className="text-lg text-slate-200 font-medium leading-relaxed">
            For decades, manual nutrition tracking has been the number one
            friction point in personal fitness. Searching database entries,
            manually weighing every ingredient, and guessing restaurant portion
            sizes leads to burnout for nearly 70% of fitness seekers within
            their first fortnight.
          </p>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white border-l-4 border-emerald-400 pl-3">
              1. The Evolution of Food Logging: From Barcodes to Vision AI
            </h2>
            <p>
              Traditional fitness apps relied heavily on crowdsourced,
              error-prone database entries. Scanning barcodes was a minor
              improvement, but it failed completely when dealing with
              home-cooked meals, cultural dishes, or dining out.
            </p>
            <p>
              In 2026, the rise of multimodal artificial intelligence—powered by
              engines like Google Gemini 3.5—has eliminated these manual steps.
              By capturing a photo or leaving a brief voice note, AI models
              process visual pixels, volumetric geometry, and ingredients
              simultaneously.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white border-l-4 border-emerald-400 pl-3">
              2. How NutriMorph AI Analyzes Your Plate in Seconds
            </h2>
            <p>
              NutriMorph leverages cutting-edge computer vision models to
              perform complex nutritional decomposition in real time:
            </p>
            <ul className="space-y-3 bg-slate-900/60 p-5 rounded-xl border border-slate-800">
              <li className="flex items-start space-x-3 text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Multi-Object Ingredient Recognition:</strong>{" "}
                  Identifies distinct ingredients on a single plate (e.g.,
                  grilled chicken, brown rice, avocado, and olive oil drizzle).
                </span>
              </li>
              <li className="flex items-start space-x-3 text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Volumetric Spatial Analysis:</strong> Calculates plate
                  depth and portion volume to estimate weight in grams
                  accurately.
                </span>
              </li>
              <li className="flex items-start space-x-3 text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Instant Macro Breakdown:</strong> Maps estimated
                  ingredient weights directly to verified nutritional databases
                  to return calories, protein, carbohydrates, and fats
                  instantly.
                </span>
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white border-l-4 border-emerald-400 pl-3">
              3. Voice & Multilingual Recognition for Local Diets
            </h2>
            <p>
              Whether you describe your meal in Urdu, English, or Roman Urdu,
              NutriMorph parses complex audio notes effortlessly. Saying{" "}
              <em>
                &quot;2 boiled eggs and 1 slice of whole wheat toast with
                butter&quot;
              </em>{" "}
              extracts precise macronutrient targets without requiring any
              manual typing.
            </p>
          </section>

          {/* Call to Action Box */}
          <div className="bg-linear-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 my-10 text-center space-y-4">
            <div className="inline-flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider bg-emerald-500/10 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Experience AI Fitness Firsthand</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Ready to Upgrade Your Daily Nutrition?
            </h3>
            <p className="text-slate-300 text-sm max-w-xl mx-auto">
              Start logging your meals automatically with NutriMorph AI on Web
              and Mobile.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Link
                href="/#pricing"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl transition text-sm flex items-center space-x-2"
              >
                <Globe className="w-4 h-4" />
                <span>Explore Web Plans</span>
              </Link>
              <Link
                href="/"
                className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-5 py-2.5 rounded-xl transition text-sm flex items-center space-x-2"
              >
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>Download Mobile App</span>
              </Link>
            </div>
          </div>
        </div>
      </article>

      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <p>&copy; 2026 NutriMorph AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
