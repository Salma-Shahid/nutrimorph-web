"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://api.nutrimorph.app";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [token, setToken] = useState(searchParams.get("token") || "");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setError("");
    if (password !== confirmation) {
      setError("The passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), token, password }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Could not reset the password.");
      }
      setMessage(result.message || "Your password has been updated.");
      setPassword("");
      setConfirmation("");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not reset the password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0b0f19] px-5 py-16 text-slate-100">
      <section className="mx-auto max-w-md rounded-2xl border border-emerald-400/30 bg-slate-900/80 p-8 shadow-[0_0_35px_rgba(16,185,129,0.12)]">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-emerald-400">
          Account security
        </p>
        <h1 className="text-3xl font-bold">Reset your password</h1>
        <p className="mt-3 text-sm text-slate-400">
          Use the secure link sent to your email. Reset links expire after 30
          minutes.
        </p>
        <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-400"
          />
          <label className="block text-sm font-medium" htmlFor="token">
            Reset token
          </label>
          <input
            id="token"
            type="text"
            required
            value={token}
            onChange={(event) => setToken(event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-400"
          />
          <label className="block text-sm font-medium" htmlFor="password">
            New password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-400"
          />
          <label className="block text-sm font-medium" htmlFor="confirmation">
            Confirm new password
          </label>
          <input
            id="confirmation"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-400 px-4 py-3 font-bold text-slate-950 transition hover:bg-emerald-300 disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update password"}
          </button>
        </form>
        {message && (
          <p role="status" className="mt-5 text-sm text-emerald-300">
            {message}
          </p>
        )}
        {error && (
          <p role="alert" className="mt-5 text-sm text-rose-300">
            {error}
          </p>
        )}
        <Link
          href="/"
          className="mt-7 inline-block text-sm text-slate-400 hover:text-emerald-300"
        >
          Return to NutriMorph
        </Link>
      </section>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
