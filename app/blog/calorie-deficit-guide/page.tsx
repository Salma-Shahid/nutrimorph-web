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
  title: "The Ultimate Guide to Calorie Deficit & Sustainable Fat Loss (2026)",
  description:
    "Master fat loss without sacrificing muscle. Learn TDEE calculations, macronutrient splits, and how NutriMorph AI keeps your calorie deficit consistent.",
  keywords: [
    "Calorie Deficit Guide 2026",
    "Sustainable Fat Loss",
    "TDEE Calculator",
    "Macro Ratios for Weight Loss",
    "NutriMorph Calorie Tracker",
    "Preserve Muscle in Deficit",
  ],
  openGraph: {
    title:
      "The Ultimate Guide to Calorie Deficit & Sustainable Fat Loss (2026)",
    description:
      "Science-backed principles for losing body fat while preserving lean muscle mass using AI calorie tracking.",
    url: "https://nutrimorph-web.vercel.app/blog/calorie-deficit-guide",
    siteName: "NutriMorph AI",
    images: [
      {
        url: "/ultimate-guide.png",
        width: 1200,
        height: 630,
        alt: "Calorie Deficit Fat Loss Guide",
      },
    ],
    locale: "en_US",
    type: "article",
  },
};

export default function CalorieDeficitGuideBlog() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
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
            Nutri<span className="text-emerald-400">Morph</span> Nutrition
          </span>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-6">
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Nutrition & Weight Management
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-4 leading-tight tracking-tight">
            The Ultimate Guide to Calorie Deficit & Sustainable Fat Loss
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 border-b border-slate-800 pb-6 mb-8">
          <span className="flex items-center space-x-1.5">
            <User className="w-3.5 h-3.5 text-emerald-400" />
            <span>NutriMorph Certified Nutritionists</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>October 15, 2026</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>9 min read</span>
          </span>
        </div>

        <div className="relative h-64 sm:h-96 w-full rounded-2xl overflow-hidden border border-slate-800 mb-10">
          <Image
            src="/ultimate-guide.png"
            alt="Calorie Deficit Guide NutriMorph"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="space-y-8 text-slate-300 text-base leading-relaxed">
          <p className="text-lg text-slate-200 font-medium leading-relaxed">
            Fat loss is governed by a universal biological rule: energy balance.
            Consuming fewer calories than your body expends forces it to
            mobilize stored body fat for metabolic fuel. However, extreme
            starvation diets almost always trigger muscle loss, metabolic
            slowing, and severe rebound weight gain.
          </p>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white border-l-4 border-emerald-400 pl-3">
              1. Calculating Your Total Daily Energy Expenditure (TDEE)
            </h2>
            <p>
              Your TDEE consists of your Basal Metabolic Rate (BMR), Exercise
              Activity Thermogenesis (EAT), Non-Exercise Activity Thermogenesis
              (NEAT), and the Thermic Effect of Food (TEF).
            </p>
            <p>
              A sustainable deficit is{" "}
              <strong>15% to 20% below your maintenance TDEE</strong> (typically
              300 to 500 calories daily). This ensures steady fat loss of 0.5kg
              per week without crashing your hormones.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white border-l-4 border-emerald-400 pl-3">
              2. Macronutrient Rules for Muscle Preservation
            </h2>
            <ul className="space-y-3 bg-slate-900/60 p-5 rounded-xl border border-slate-800">
              <li className="flex items-start space-x-3 text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>High Protein Target:</strong> Consume 1.6g to 2.2g of
                  protein per kilogram of body weight to keep muscle protein
                  synthesis active.
                </span>
              </li>
              <li className="flex items-start space-x-3 text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Essential Healthy Fats:</strong> Keep dietary fats at
                  20-30% of total calories to maintain hormone health
                  (testosterone, thyroid, and estrogen).
                </span>
              </li>
              <li className="flex items-start space-x-3 text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Fueling Performance with Carbs:</strong> Allocate
                  remaining calories to complex carbohydrates (oats, sweet
                  potatoes, whole grains) around workout windows.
                </span>
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white border-l-4 border-emerald-400 pl-3">
              3. Breaking Weight Loss Plateaus with NutriMorph
            </h2>
            <p>
              As body mass decreases, TDEE naturally adapts lower. NutriMorph
              tracks your rate of progress over 14-day intervals and
              automatically adjusts your caloric intake and daily step
              recommendations to keep fat loss moving seamlessly.
            </p>
          </section>

          <div className="bg-linear-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 my-10 text-center space-y-4">
            <div className="inline-flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider bg-emerald-500/10 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Calorie Tracking</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Take the Guesswork Out of Your Calorie Deficit
            </h3>
            <p className="text-slate-300 text-sm max-w-xl mx-auto">
              Let NutriMorph AI calculate and track your customized
              macronutrient targets automatically.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Link
                href="/#pricing"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl transition text-sm flex items-center space-x-2"
              >
                <Globe className="w-4 h-4" />
                <span>View Web Pricing</span>
              </Link>
              <Link
                href="/"
                className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-5 py-2.5 rounded-xl transition text-sm flex items-center space-x-2"
              >
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>Get the Mobile App</span>
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
