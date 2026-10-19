import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowLeft, Sparkles } from "lucide-react";

const blogPosts = [
  {
    id: "ai-macro-tracking",
    title: "How AI-Powered Macro Tracking is Revolutionizing Fitness in 2026",
    excerpt:
      "Discover how advanced computer vision and Google Gemini AI are making food logging faster and more accurate than ever before.",
    date: "October 18, 2026",
    readTime: "7 min read",
    category: "AI & Technology",
    image: "/Ai-Powered.png",
  },
  {
    id: "calorie-deficit-guide",
    title: "The Ultimate Guide to Calorie Deficit & Sustainable Fat Loss",
    excerpt:
      "Learn how to calculate your TDEE, set realistic macro goals, and drop body fat without starving yourself or cutting out your favorite foods.",
    date: "October 15, 2026",
    readTime: "9 min read",
    category: "Nutrition",
    image: "/ultimate-guide.png",
  },
  {
    id: "hydration-and-muscle-growth",
    title: "Why Hydration is the Missing Link in Your Muscle Growth Routine",
    excerpt:
      "Water intake isn't just about thirst—it plays a vital role in cellular volumization, nutrient transport, and overall workout performance.",
    date: "October 10, 2026",
    readTime: "6 min read",
    category: "Health & Fitness",
    image: "/muscles-growth.png",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      {/* Header / Navbar back link */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-2 text-slate-300 hover:text-emerald-400 transition text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold tracking-tight text-white">
              Nutri<span className="text-emerald-400">Morph</span> Blog
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center space-x-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-emerald-400 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Expert Insights & Guides</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
          Fitness, Nutrition & AI
        </h1>
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
          Explore tips, science-backed nutritional advice, and updates on how
          artificial intelligence is transforming personal wellness.
        </p>
      </section>

      {/* Blog Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Image Box */}
                <div className="h-48 bg-slate-800/80 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition duration-500">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover opacity-90"
                  />
                  <span className="absolute top-3 left-3 bg-slate-950/80 text-emerald-400 border border-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider z-10">
                    {post.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center space-x-4 text-xs text-slate-400 mb-3">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{post.date}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{post.readTime}</span>
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-white group-hover:text-emerald-400 transition mb-2 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-slate-400 text-sm line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Read More Footer */}
              <div className="px-6 pb-6 pt-0">
                <span className="text-emerald-400 text-xs font-semibold inline-flex items-center space-x-1 group-hover:translate-x-1 transition duration-200">
                  <span>Read Article</span> &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <p>&copy; 2026 NutriMorph AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
