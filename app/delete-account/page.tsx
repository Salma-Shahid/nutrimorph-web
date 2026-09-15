"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function DeleteAccount() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

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

      <main className="max-w-xl mx-auto px-6 py-16 flex-1 w-full">
        <h1 className="text-3xl font-bold text-emerald-400 mb-4">
          Account Deletion Request
        </h1>
        <p className="text-slate-300 mb-6 leading-relaxed">
          Enter the email address associated with your NutriMorph account to
          request permanent deletion of your profile, saved meals, and chat
          history.
        </p>

        {submitted ? (
          <div className="p-6 bg-emerald-950/40 border border-emerald-500/50 rounded-xl text-emerald-300">
            <h3 className="font-bold text-lg mb-1">Request Received</h3>
            <p className="text-sm">
              Your data deletion request for {email} has been registered.
              Account data will be purged within 48 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              required
              placeholder="your-email@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 font-bold py-3.5 rounded-xl text-slate-950 transition shadow-lg shadow-emerald-500/20"
            >
              Submit Deletion Request
            </button>
          </form>
        )}
      </main>

      <footer className="border-t border-slate-800 bg-slate-900/50 py-6 text-center text-xs text-slate-500">
        © 2026 NutriMorph AI. All rights reserved.
      </footer>
    </div>
  );
}
