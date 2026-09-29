"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Send,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  ShieldAlert,
} from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Simulate backend message submission or connect to your support email API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccess(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      setError(
        "Failed to send message. Please email us directly at support@nutrimorph.ai",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Navbar */}
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
            className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Contact Section */}
      <main className="max-w-3xl mx-auto px-6 py-16 w-full">
        <div className="text-center mb-12">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto mb-4">
            <Mail className="w-6 h-6" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Support & Contact Us
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-lg mx-auto">
            Facing bugs, login issues, or subscription problems? Reach out to
            our team and we will get back to you within 24 hours.
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl shadow-xl">
          {success ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                Message Sent Successfully!
              </h3>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                Thank you for contacting NutriMorph Support. Our team has
                received your query and will respond to your email shortly.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-6 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-xl transition"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Subject / Issue Type
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Subscription Billing Issue or App Bug"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Message / Description *
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please describe your issue in detail..."
                  rows={5}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              {error && (
                <div className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 rounded-xl transition flex items-center justify-center space-x-2 disabled:opacity-50 shadow-lg shadow-emerald-500/10"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Submit Support Request</span>
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-8 border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
            You can also email us directly at{" "}
            <span className="text-emerald-400 font-medium">
              nutrimorphsupport@gmail.com
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <p>© 2026 NutriMorph AI. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <Link
              href="/privacy-policy"
              className="hover:text-emerald-400 transition"
            >
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-emerald-400 transition">
              Terms
            </Link>
            <Link
              href="/delete-account"
              className="text-red-400 hover:text-red-300 transition flex items-center space-x-1"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Delete Account</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
