import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    VITE_PADDLE_CLIENT_TOKEN: process.env.VITE_PADDLE_CLIENT_TOKEN || "",
    VITE_PADDLE_MONTHLY_PRICE_ID:
      process.env.VITE_PADDLE_MONTHLY_PRICE_ID || "",
    VITE_PADDLE_YEARLY_PRICE_ID:
      process.env.VITE_PADDLE_YEARLY_PRICE_ID || "",
    VITE_PADDLE_ENV: process.env.VITE_PADDLE_ENV || "",
  },
};

export default nextConfig;
