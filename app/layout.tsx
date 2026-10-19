import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NutriMorph - AI Nutritionist & Macro Coach",
  description:
    "Track macros, log meals with Urdu/English voice commands, and analyze food photos instantly with NutriBot AI. Your global personal health assistant.",
  keywords: [
    "NutriMorph",
    "AI Nutritionist",
    "Macro Tracker",
    "Calorie Counter App",
    "Food Photo Analyzer",
    "Voice Meal Logging",
    "NutriBot AI",
    "Personalized Diet Planner",
    "Fitness & Health App",
  ],
  authors: [{ name: "Salma Shahid" }],
  metadataBase: new URL("https://nutrimorph-web.vercel.app"),
  alternates: {
    canonical: "/",
  },

  // Favicon & Touch Icons
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },

  // Open Graph / Social Media Preview (WhatsApp, LinkedIn, Facebook)
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nutrimorph-web.vercel.app",
    title: "NutriMorph - AI Powered Nutrition & Macro Tracker",
    description:
      "Transform your health journey with instant AI meal scanning and voice tracking. Available globally.",
    siteName: "NutriMorph",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "NutriMorph AI App Preview",
      },
    ],
  },

  // Twitter Cards
  twitter: {
    card: "summary_large_image",
    title: "NutriMorph - AI Nutritionist & Macro Coach",
    description:
      "Log meals by photo or voice in seconds. Reach your goals with smart AI insights.",
    images: ["/logo.png"],
  },

  // Global Audience Indexing
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased min-h-full flex flex-col`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
