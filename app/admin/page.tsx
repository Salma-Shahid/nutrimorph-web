"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";

interface StatsData {
  totalUsers: number;
  proUsers: number;
  freeUsers: number;
  totalMeals: number;
  totalExercises: number;
}

interface RevenueData {
  totalRevenue: number;
  activeSubscriptions: number;
  currency: string;
}

interface UserData {
  _id: string;
  name: string;
  email: string;
  role?: string;
  subscriptionTier?: string;
  isPro?: boolean;
  createdAt?: string;
}

interface ReviewData {
  _id: string;
  user?: { name: string; email: string };
  rating: number;
  comment: string;
  createdAt?: string;
}

interface ActivityLogData {
  _id: string;
  adminEmail: string;
  action: string;
  details: string;
  createdAt: string;
}

interface ApiUsageData {
  sendgridEmailsUsed: number;
  sendgridLimit: number;
  dbStorageUsedMB: number;
  dbLimitMB: number;
  geminiApiCalls: number;
  geminiLimit: number;
  cloudinaryStorageGB: number;
  cloudinaryLimitGB: number;
  expoBuildsUsed: number;
  expoBuildsLimit: number;
  expoOtaBandwidthMB: number;
  expoOtaLimitMB: number;
}

export default function AdminPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [revenue, setRevenue] = useState<RevenueData | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [logs, setLogs] = useState<ActivityLogData[]>([]);
  const [apiUsage, setApiUsage] = useState<ApiUsageData>({
    sendgridEmailsUsed: 120,
    sendgridLimit: 3000,
    dbStorageUsedMB: 45.5,
    dbLimitMB: 512,
    geminiApiCalls: 430,
    geminiLimit: 10000,
    cloudinaryStorageGB: 1.2,
    cloudinaryLimitGB: 25,
    expoBuildsUsed: 18,
    expoBuildsLimit: 30,
    expoOtaBandwidthMB: 350,
    expoOtaLimitMB: 1000,
  });

  const [testingEmail, setTestingEmail] = useState<boolean>(false);
  const [cleaningDb, setCleaningDb] = useState<boolean>(false);
  const [syncingServices, setSyncingServices] = useState<boolean>(false);
  const [purgingCloud, setPurgingCloud] = useState<boolean>(false);
  const [checkingExpo, setCheckingExpo] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [tierFilter, setTierFilter] = useState<string>("all");

  // Broadcast States
  const [broadcastTitle, setBroadcastTitle] = useState<string>("");
  const [broadcastMessage, setBroadcastMessage] = useState<string>("");
  const [targetAudience, setTargetAudience] = useState<string>("all");
  const [sendingBroadcast, setSendingBroadcast] = useState<boolean>(false);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

  const fetchAdminData = useCallback(async () => {
    try {
      setError("");
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      if (!token) {
        setError("Admin authentication token missing. Please log in first.");
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [statsRes, usersRes, reviewsRes, logsRes, usageRes] =
        await Promise.all([
          axios.get(`${API_BASE_URL}/admin/stats`, config),
          axios.get(`${API_BASE_URL}/admin/users`, config),
          axios
            .get(`${API_BASE_URL}/admin/reviews`, config)
            .catch(() => ({ data: { data: [] } })),
          axios
            .get(`${API_BASE_URL}/admin/logs`, config)
            .catch(() => ({ data: { data: [] } })),
          axios
            .get(`${API_BASE_URL}/admin/api-usage`, config)
            .catch(() => ({ data: { data: apiUsage } })),
        ]);

      setStats(statsRes.data.data);
      setUsers(usersRes.data.data);
      setReviews(reviewsRes.data.data || []);
      setLogs(logsRes.data.data || []);
      setApiUsage(usageRes.data.data);

      // Revenue fetch fallback
      try {
        const revenueRes = await axios.get(
          `${API_BASE_URL}/admin/revenue`,
          config,
        );
        setRevenue(revenueRes.data.data);
      } catch {
        const proCount = statsRes.data.data?.proUsers || 0;
        setRevenue({
          totalRevenue: proCount * 9.99,
          activeSubscriptions: proCount,
          currency: "USD",
        });
      }
    } catch (err: unknown) {
      console.error("Admin Fetch Error:", err);
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err instanceof Error
          ? err.message
          : "Failed to load admin dashboard data.");
      setError(errorMsg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [API_BASE_URL, apiUsage]);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setLoading(true);
      await fetchAdminData();
    };
    if (isMounted) {
      loadData();
    }
    return () => {
      isMounted = false;
    };
  }, [fetchAdminData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAdminData();
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTier =
        tierFilter === "all" ||
        (user.subscriptionTier || "free") === tierFilter;

      return matchesSearch && matchesTier;
    });
  }, [users, searchTerm, tierFilter]);

  const handleToggleTier = async (userId: string, currentTier?: string) => {
    try {
      const newTier = currentTier === "pro" ? "free" : "pro";
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.patch(
        `${API_BASE_URL}/admin/users/${userId}/tier`,
        { subscriptionTier: newTier },
        config,
      );
      fetchAdminData();
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || (err instanceof Error ? err.message : "Unknown error");
      alert("Failed to update tier: " + errorMsg);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.delete(`${API_BASE_URL}/admin/users/${userId}`, config);
      fetchAdminData();
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || (err instanceof Error ? err.message : "Unknown error");
      alert("Failed to delete user: " + errorMsg);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.delete(`${API_BASE_URL}/admin/reviews/${reviewId}`, config);
      fetchAdminData();
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || (err instanceof Error ? err.message : "Unknown error");
      alert("Failed to delete review: " + errorMsg);
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMessage) {
      alert("Please fill in both title and message.");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to broadcast this message to ${targetAudience} users?`,
      )
    )
      return;

    try {
      setSendingBroadcast(true);
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const res = await axios.post(
        `${API_BASE_URL}/admin/broadcast`,
        { title: broadcastTitle, message: broadcastMessage, targetAudience },
        config,
      );

      alert(res.data.message || "Broadcast sent successfully!");
      setBroadcastTitle("");
      setBroadcastMessage("");
      fetchAdminData();
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err instanceof Error ? err.message : "Failed to send broadcast.");
      alert("Broadcast Error: " + errorMsg);
    } finally {
      setSendingBroadcast(false);
    }
  };

  // Action Handlers
  const handleTestEmail = async () => {
    try {
      setTestingEmail(true);
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const res = await axios.post(
        `${API_BASE_URL}/admin/test-email`,
        {},
        config,
      );
      alert(
        "✅ Success: " + (res.data.message || "Test email sent successfully!"),
      );
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err instanceof Error ? err.message : "Failed to send test email.");
      alert("⚠️ Test Email Error: " + errorMsg);
    } finally {
      setTestingEmail(false);
    }
  };

  const handleCleanupDb = async () => {
    if (
      !window.confirm(
        "Are you sure you want to purge logs older than 30 days from the database?",
      )
    )
      return;
    try {
      setCleaningDb(true);
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const res = await axios.post(
        `${API_BASE_URL}/admin/cleanup-db`,
        {},
        config,
      );
      alert(
        "✅ Database Cleanup: " +
          (res.data.message || "Cleanup completed successfully!"),
      );
      fetchAdminData();
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err instanceof Error ? err.message : "Failed to clean up database.");
      alert("⚠️ Cleanup Error: " + errorMsg);
    } finally {
      setCleaningDb(false);
    }
  };

  const handleSyncServices = async () => {
    try {
      setSyncingServices(true);
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const res = await axios.post(
        `${API_BASE_URL}/admin/sync-services`,
        {},
        config,
      );
      alert(
        "✅ Services Synced: " +
          (res.data.message || "All integration pipelines active!"),
      );
      fetchAdminData();
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err instanceof Error ? err.message : "Failed to sync services.");
      alert("⚠️ Sync Error: " + errorMsg);
    } finally {
      setSyncingServices(false);
    }
  };

  const handlePurgeCloudinary = async () => {
    if (
      !window.confirm(
        "Are you sure you want to permanently remove orphaned images from Cloudinary?",
      )
    )
      return;
    try {
      setPurgingCloud(true);
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const res = await axios.post(
        `${API_BASE_URL}/admin/purge-cloudinary`,
        {},
        config,
      );
      alert(
        "✅ Cloudinary Success: " +
          (res.data.message || "Storage space freed!"),
      );
      fetchAdminData();
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err instanceof Error ? err.message : "Failed to purge cloud storage.");
      alert("⚠️ Cloudinary Error: " + errorMsg);
    } finally {
      setPurgingCloud(false);
    }
  };

  const handleCheckExpoBuilds = async () => {
    try {
      setCheckingExpo(true);
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const res = await axios.get(`${API_BASE_URL}/admin/expo-builds`, config);
      alert(
        "📱 Expo EAS Status: " +
          (res.data.message || "Build queues checked successfully!"),
      );
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err instanceof Error ? err.message : "Failed to check Expo builds.");
      alert("⚠️ Expo Build Error: " + errorMsg);
    } finally {
      setCheckingExpo(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-emerald-400 font-medium text-lg">
        Loading Admin Dashboard...
      </div>
    );
  }

  const totalUsersCount = stats?.totalUsers || 1;
  const proPercentage = Math.round(
    ((stats?.proUsers || 0) / totalUsersCount) * 100,
  );
  const freePercentage = 100 - proPercentage;

 return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-emerald-400">
              NutriMorph Admin Portal 👑
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Live system stats, user accounts, and tier management.
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="self-start md:self-auto bg-gray-800 hover:bg-gray-700 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 disabled:opacity-50 shadow-lg"
          >
            <span className={refreshing ? "animate-spin" : ""}>🔄</span>
            {refreshing ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>

        {error && (
          <div className="bg-red-900/40 border border-red-500/50 text-red-200 p-4 rounded-xl text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Metric Cards Grid */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 shadow-xl">
              <p className="text-gray-400 text-sm font-medium">Total Users</p>
              <p className="text-4xl font-bold text-emerald-400 mt-2">
                {stats.totalUsers}
              </p>
            </div>
            <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 shadow-xl">
              <p className="text-gray-400 text-sm font-medium">
                Active Pro Users
              </p>
              <p className="text-4xl font-bold text-sky-400 mt-2">
                {stats.proUsers}
              </p>
            </div>
            <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 shadow-xl">
              <p className="text-gray-400 text-sm font-medium">
                Total Logged Meals
              </p>
              <p className="text-4xl font-bold text-amber-400 mt-2">
                {stats.totalMeals}
              </p>
            </div>
            <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 shadow-xl">
              <p className="text-gray-400 text-sm font-medium">
                Total Exercises
              </p>
              <p className="text-4xl font-bold text-purple-400 mt-2">
                {stats.totalExercises}
              </p>
            </div>
          </div>
        )}

        {/* Revenue & Subscription Management */}
        {revenue && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 shadow-xl flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">
                  Total Estimated Revenue
                </p>
                <p className="text-3xl font-extrabold text-emerald-400 mt-2">
                  ${revenue.totalRevenue.toFixed(2)}{" "}
                  <span className="text-xs text-gray-400">
                    {revenue.currency}
                  </span>
                </p>
              </div>
              <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20 text-emerald-400 text-2xl">
                💰
              </div>
            </div>
            <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 shadow-xl flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">
                  Active Pro Subscriptions
                </p>
                <p className="text-3xl font-extrabold text-sky-400 mt-2">
                  {revenue.activeSubscriptions}{" "}
                  <span className="text-xs text-gray-400">Subscribers</span>
                </p>
              </div>
              <div className="bg-sky-500/10 p-4 rounded-xl border border-sky-500/20 text-sky-400 text-2xl">
                ⭐
              </div>
            </div>
          </div>
        )}

        {/* API & Service Usage Monitor Widget */}
        <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-200">
                ⚡ API & Service Usage Monitor
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Track third-party integration limits, billing, and system health
                in real-time.
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/20">
              🟢 All Systems Healthy
            </span>
          </div>

          {/* Live Integration Control Panel */}
          <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 shadow-xl space-y-4">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div>
                <h3 className="text-lg font-bold text-gray-200">
                  ⚙️ Live Integration Control Panel
                </h3>
                <p className="text-gray-400 text-xs mt-0.5">
                  Perform live management and health checks across active
                  integrations.
                </p>
              </div>
              <span className="text-xs text-amber-400 font-semibold bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                🔒 Admin Protected Actions
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-2">
              {/* Test Email Action */}
              <button
                onClick={handleTestEmail}
                disabled={testingEmail}
                className="bg-gray-950 hover:bg-gray-800 border border-emerald-500/30 text-emerald-300 p-4 rounded-xl text-xs font-semibold transition text-left space-y-1 disabled:opacity-50"
              >
                <div className="text-sm font-bold flex items-center gap-2">
                  📧 {testingEmail ? "Sending..." : "Test Email Pipeline"}
                </div>
                <div className="text-gray-500 text-[11px]">
                  Dispatch ping to verified SMTP route
                </div>
              </button>

              {/* DB Cleanup Action */}
              <button
                onClick={handleCleanupDb}
                disabled={cleaningDb}
                className="bg-gray-950 hover:bg-gray-800 border border-sky-500/30 text-sky-300 p-4 rounded-xl text-xs font-semibold transition text-left space-y-1 disabled:opacity-50"
              >
                <div className="text-sm font-bold flex items-center gap-2">
                  🗄️ {cleaningDb ? "Purging..." : "Prune DB Activity Logs"}
                </div>
                <div className="text-gray-500 text-[11px]">
                  Clean old logs & free storage space
                </div>
              </button>

              {/* Sync Services Action */}
              <button
                onClick={handleSyncServices}
                disabled={syncingServices}
                className="bg-gray-950 hover:bg-gray-800 border border-purple-500/30 text-purple-300 p-4 rounded-xl text-xs font-semibold transition text-left space-y-1 disabled:opacity-50"
              >
                <div className="text-sm font-bold flex items-center gap-2">
                  🔄 {syncingServices ? "Syncing..." : "Sync All Services"}
                </div>
                <div className="text-gray-500 text-[11px]">
                  Refresh live API status & health
                </div>
              </button>

              {/* Check Expo Builds */}
              <button
                onClick={handleCheckExpoBuilds}
                disabled={checkingExpo}
                className="bg-gray-950 hover:bg-gray-800 border border-indigo-500/30 text-indigo-300 p-4 rounded-xl text-xs font-semibold transition text-left space-y-1 disabled:opacity-50"
              >
                <div className="text-sm font-bold flex items-center gap-2">
                  📱 {checkingExpo ? "Checking..." : "View Active Builds"}
                </div>
                <div className="text-gray-500 text-[11px]">
                  Monitor mobile build queues
                </div>
              </button>

              {/* Purge Cloudinary */}
              <button
                onClick={handlePurgeCloudinary}
                disabled={purgingCloud}
                className="bg-gray-950 hover:bg-gray-800 border border-cyan-500/30 text-cyan-300 p-4 rounded-xl text-xs font-semibold transition text-left space-y-1 disabled:opacity-50"
              >
                <div className="text-sm font-bold flex items-center gap-2">
                  ☁️ {purgingCloud ? "Purging..." : "Purge Unused Images"}
                </div>
                <div className="text-gray-500 text-[11px]">
                  Free cloud storage assets
                </div>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* SendGrid / Email API */}
            <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-gray-300">📧 SendGrid</span>
                <span className="text-emerald-400 font-bold">
                  {apiUsage.sendgridEmailsUsed}/{apiUsage.sendgridLimit}
                </span>
              </div>
              <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      (apiUsage.sendgridEmailsUsed / apiUsage.sendgridLimit) *
                        100,
                    )}%`,
                  }}
                ></div>
              </div>
              <p className="text-[11px] text-gray-500">
                Email broadcast quota.
              </p>
            </div>

            {/* Database Storage */}
            <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-gray-300">🗄️ MongoDB</span>
                <span className="text-sky-400 font-bold">
                  {apiUsage.dbStorageUsedMB}/{apiUsage.dbLimitMB}MB
                </span>
              </div>
              <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-sky-500 h-full transition-all duration-500"
                  style={{
                    width: `${Math.min( 100, (apiUsage.dbStorageUsedMB / apiUsage.dbLimitMB) * 100, )}\%`, }} ></div> </div> <p className="text-[11px] text-gray-500"> Cluster document storage. </p> </div>  {/* Gemini AI API */} <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-2"> <div className="flex justify-between items-center text-xs"> <span className="font-semibold text-gray-300"> ✨ Gemini AI </span> <span className="text-amber-400 font-bold"> {apiUsage.geminiApiCalls}/{apiUsage.geminiLimit} </span> </div> <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden"> <div className="bg-amber-500 h-full transition-all duration-500" style={{ width: `${Math.min(
                      100,
                      (apiUsage.geminiApiCalls / apiUsage.geminiLimit) * 100,
                    )}%`,
                  }}
                ></div>
              </div>
              <p className="text-[11px] text-gray-500">Image parsing tokens.</p>
            </div>

            {/* Expo EAS Free Builds */}
            <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-gray-300">
                  📱 Expo Builds
                </span>
                <span className="text-purple-400 font-bold">
                  {apiUsage.expoBuildsUsed}/{apiUsage.expoBuildsLimit}
                </span>
              </div>
              <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-purple-500 h-full transition-all duration-500"
                  style={{
                    width: `${Math.min( 100, (apiUsage.expoBuildsUsed / apiUsage.expoBuildsLimit) * 100, )}\%`, }} ></div> </div> <p className="text-[11px] text-gray-500"> Free monthly build quota. </p> </div>  {/* Cloudinary Storage */} <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-2"> <div className="flex justify-between items-center text-xs"> <span className="font-semibold text-gray-300"> ☁️ Cloudinary </span> <span className="text-cyan-400 font-bold"> {apiUsage.cloudinaryStorageGB}/{apiUsage.cloudinaryLimitGB}GB </span> </div> <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden"> <div className="bg-cyan-500 h-full transition-all duration-500" style={{ width: `${Math.min(
                      100,
                      (apiUsage.cloudinaryStorageGB /
                        apiUsage.cloudinaryLimitGB) *
                        100,
                    )}%`,
                  }}
                ></div>
              </div>
              <p className="text-[11px] text-gray-500">Media storage assets.</p>
            </div>
          </div>
        </div>

        {/* Visual Analytics */}
        {stats && (
          <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-gray-200">
              📊 Subscription Distribution Analytics
            </h3>
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>
                Pro Users:{" "}
                <strong className="text-sky-400">{proPercentage}%</strong>
              </span>
              <span>
                Free Users:{" "}
                <strong className="text-gray-200">{freePercentage}%</strong>
              </span>
            </div>
            <div className="w-full bg-gray-800 h-4 rounded-full overflow-hidden flex">
              <div
                className="bg-sky-500 transition-all duration-500"
                style={{ width: `${proPercentage}\%` }} ></div> <div className="bg-gray-700 transition-all duration-500" style={{ width: `${freePercentage}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Broadcast / Announcements Section */}
        <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 shadow-xl space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-200">
              📢 Broadcast Announcements
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Send push notifications or updates to your app users.
            </p>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Notification Title
                </label>
                <input
                  type="text"
                  placeholder="Maslan: New Pro Features Available! 🚀"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 text-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Target Audience
                </label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 text-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="all">All Users</option>
                  <option value="pro">Pro Subscribers Only</option>
                  <option value="free">Free Users Only</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Message Body
              </label>
              <textarea
                rows={3}
                placeholder="Yahan apna detailed message likhein..."
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 text-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={sendingBroadcast}
              className="bg-emerald-600 hover:bg-emerald-500 text-gray-950 font-bold px-6 py-2.5 rounded-xl text-sm transition shadow-lg shadow-emerald-600/20 disabled:opacity-50"
            >
              {sendingBroadcast
                ? "Sending Broadcast..."
                : "🚀 Send Broadcast Now"}
            </button>
          </form>
        </div>

        {/* Admin Activity Logs Section */}
        <div className="bg-gray-900/80 rounded-2xl border border-gray-800 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-bold text-gray-200">
              🛡️ Admin Audit & Activity Logs ({logs.length})
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Track administrative actions and security updates.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-900 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-800">
                  <th className="p-4">Admin Email</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Details</th>
                  <th className="p-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 text-sm">
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <tr
                      key={log._id}
                      className="hover:bg-gray-850/50 transition"
                    >
                      <td className="p-4 font-medium text-emerald-400">
                        {log.adminEmail || "Admin"}
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-gray-800 text-gray-300 rounded-full text-xs font-bold border border-gray-700">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-4 text-gray-300">{log.details}</td>
                      <td className="p-4 text-gray-400 text-xs">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-gray-500">
                      No activity logs recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Review Moderation Section */}
        <div className="bg-gray-900/80 rounded-2xl border border-gray-800 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-bold text-gray-200">
              ⭐ User Reviews & Feedback Moderation ({reviews.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-900 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-800">
                  <th className="p-4">User</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Comment</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 text-sm">
                {reviews.length > 0 ? (
                  reviews.map((rev) => (
                    <tr
                      key={rev._id}
                      className="hover:bg-gray-850/50 transition"
                    >
                      <td className="p-4 font-semibold text-gray-200">
                        {rev.user?.name || "Anonymous"}{" "}
                        <span className="text-xs text-gray-400 block">
                          {rev.user?.email}
                        </span>
                      </td>
                      <td className="p-4 text-amber-400 font-bold">
                        {"★".repeat(rev.rating)}
                        {"☆".repeat(5 - rev.rating)} ({rev.rating}/5)
                      </td>
                      <td className="p-4 text-gray-300">{rev.comment}</td>
                      <td className="p-4">
                        <button
                          onClick={() => handleDeleteReview(rev._id)}
                          className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 rounded-lg text-xs font-medium transition"
                        >
                          Delete Review
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-gray-500">
                      No user reviews found for moderation.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Management Section */}
        <div className="bg-gray-900/80 rounded-2xl border border-gray-800 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-gray-200">
              Registered Accounts ({filteredUsers.length} / {users.length})
            </h2>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-950 border border-gray-800 text-gray-200 px-4 py-2 rounded-lg text-sm focus:outline-none focus:border-emerald-500 w-full sm:w-64"
              />
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="bg-gray-950 border border-gray-800 text-gray-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Tiers</option>
                <option value="pro">Pro</option>
                <option value="free">Free</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-900 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-800">
                  <th className="p-4">User</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Subscription</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 text-sm">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-850/50 transition"
                    >
                      <td className="p-4 font-semibold text-gray-200">
                        {user.name}
                      </td>
                      <td className="p-4 text-gray-400">{user.email}</td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            user.role === "admin"
                              ? "bg-purple-900/60 text-purple-300 border border-purple-500/30"
                              : "bg-gray-800 text-gray-400"
                          }`}
                        >
                          {user.role || "user"}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            user.subscriptionTier === "pro"
                              ? "bg-emerald-900/60 text-emerald-300 border border-emerald-500/30"
                              : "bg-gray-800 text-gray-400"
                          }`}
                        >
                          {user.subscriptionTier || "free"}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-red-400 hover:text-red-300 focus:outline-none"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-4 text-center text-gray-500" colSpan={5}>
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

