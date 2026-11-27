"use client";
import React, { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

type Status = "idle" | "submitting" | "sent" | "confirmed" | "error";

const readMessage = async (response: Response, fallback: string) => {
  try {
    const body = await response.json();
    return {
      message: (body?.message as string) || fallback,
      notes: Array.isArray(body?.notes) ? (body.notes as string[]) : [],
    };
  } catch {
    return { message: fallback, notes: [] as string[] };
  }
};

function DeleteAccountFlow() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const linkEmail = searchParams.get("email") || "";
  const isConfirmStep = Boolean(token && linkEmail);

  const [email, setEmail] = useState(linkEmail);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [notes, setNotes] = useState<string[]>([]);
  const [acknowledged, setAcknowledged] = useState(false);

  const post = async (path: string, body: object, fallback: string) => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = await readMessage(response, fallback);
    if (!response.ok) throw new Error(result.message);
    return result;
  };

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || status === "submitting") return;
    setStatus("submitting");
    setMessage("");
    try {
      const result = await post(
        "/api/auth/delete-request",
        { email: trimmed },
        "Check your inbox for a confirmation link.",
      );
      setMessage(result.message);
      setStatus("sent");
    } catch (error) {
      setMessage(
        error instanceof Error && error.message !== "Failed to fetch"
          ? error.message
          : "We couldn't reach NutriMorph. Check your connection and try again.",
      );
      setStatus("error");
    }
  };

  const handleConfirm = async () => {
    if (status === "submitting") return;
    setStatus("submitting");
    setMessage("");
    try {
      const result = await post(
        "/api/auth/delete-confirm",
        { email: linkEmail, token },
        "Your account has been deactivated.",
      );
      setMessage(result.message);
      setNotes(result.notes);
      setStatus("confirmed");
    } catch (error) {
      setMessage(
        error instanceof Error && error.message !== "Failed to fetch"
          ? error.message
          : "We couldn't reach NutriMorph. Check your connection and try again.",
      );
      setStatus("error");
    }
  };

  const submitting = status === "submitting";

  return (
    <main className="max-w-xl mx-auto px-6 py-16 flex-1 w-full">
      <h1 className="text-3xl font-bold text-emerald-400 mb-4">
        Account Deletion Request
      </h1>

      {status === "confirmed" ? (
        <div
          role="status"
          className="p-6 bg-emerald-950/40 border border-emerald-500/50 rounded-xl text-emerald-300 space-y-2"
        >
          <h2 className="font-bold text-lg">Deletion confirmed</h2>
          <p className="text-sm">{message}</p>
          {notes.map((note) => (
            <p key={note} className="text-sm text-amber-300">
              {note}
            </p>
          ))}
        </div>
      ) : status === "sent" ? (
        <div
          role="status"
          className="p-6 bg-emerald-950/40 border border-emerald-500/50 rounded-xl text-emerald-300 space-y-2"
        >
          <h2 className="font-bold text-lg">Check your email</h2>
          <p className="text-sm">{message}</p>
          <p className="text-xs text-slate-400">
            Open the link from the same device or any browser to finish. No
            email? Check spam, or{" "}
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="underline text-emerald-300 hover:text-emerald-200"
            >
              send it again
            </button>
            .
          </p>
        </div>
      ) : isConfirmStep ? (
        <div className="space-y-5">
          <p className="text-slate-300 leading-relaxed">
            You&apos;re about to delete the NutriMorph account for{" "}
            <span className="font-semibold text-white">{linkEmail}</span>. The
            account is deactivated now and your profile, meals, weight
            history and chats are permanently deleted after 30 days. Signing
            in before then cancels the deletion.
          </p>
          <label className="flex items-start gap-3 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              className="mt-1 accent-red-500"
            />
            I understand my data will be permanently deleted after 30 days.
          </label>
          {status === "error" && (
            <p role="alert" className="text-sm text-red-300">
              {message}{" "}
              <Link href="/delete-account" className="underline">
                Request a new link
              </Link>
            </p>
          )}
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!acknowledged || submitting}
            className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed font-bold py-3.5 rounded-xl text-white transition"
          >
            {submitting ? "Deleting…" : "Permanently delete my account"}
          </button>
        </div>
      ) : (
        <>
          <p className="text-slate-300 mb-6 leading-relaxed">
            Enter the email address associated with your NutriMorph account.
            We&apos;ll email you a confirmation link so nobody else can delete
            your account. You can also delete it instantly from Profile in the
            app.
          </p>
          <form onSubmit={handleRequest} className="space-y-4" noValidate>
            <label htmlFor="delete-email" className="sr-only">
              Account email
            </label>
            <input
              id="delete-email"
              type="email"
              required
              autoComplete="email"
              placeholder="your-email@domain.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
            />
            {status === "error" && (
              <p role="alert" className="text-sm text-red-300">
                {message}
              </p>
            )}
            <button
              type="submit"
              disabled={submitting || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed font-bold py-3.5 rounded-xl text-slate-950 transition shadow-lg shadow-emerald-500/20"
            >
              {submitting ? "Sending…" : "Email me a confirmation link"}
            </button>
          </form>
        </>
      )}
    </main>
  );
}

export default function DeleteAccount() {
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

      <Suspense fallback={<main className="flex-1" />}>
        <DeleteAccountFlow />
      </Suspense>

      <footer className="border-t border-slate-800 bg-slate-900/50 py-6 text-center text-xs text-slate-500">
        © 2026 NutriMorph AI. All rights reserved.
      </footer>
    </div>
  );
}
