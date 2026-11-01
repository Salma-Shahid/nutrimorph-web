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

export default function AdminPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [revenue, setRevenue] = useState<RevenueData | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [tierFilter, setTierFilter] = useState<string>("all");

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
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [statsRes, usersRes, reviewsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/admin/stats`, config),
        axios.get(`${API_BASE_URL}/admin/users`, config),
        axios
          .get(`${API_BASE_URL}/admin/reviews`, config)
          .catch(() => ({ data: { data: [] } })),
      ]);

      setStats(statsRes.data.data);
      setUsers(usersRes.data.data);
      setReviews(reviewsRes.data.data || []);

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
    }
  }, [API_BASE_URL]);

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
            onClick={fetchAdminData}
            className="self-start md:self-auto bg-gray-800 hover:bg-gray-700 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            🔄 Refresh Data
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
                style={{ width: `${proPercentage}%` }}
              ></div>
              <div
                className="bg-gray-700 transition-all duration-500"
                style={{ width: `${freePercentage}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Review Moderation Section (New Feature) */}
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
                              ? "bg-sky-900/60 text-sky-300 border border-sky-500/30"
                              : "bg-gray-800 text-gray-400"
                          }`}
                        >
                          {user.subscriptionTier || "free"}
                        </span>
                      </td>
                      <td className="p-4 flex items-center gap-3">
                        <button
                          onClick={() =>
                            handleToggleTier(user._id, user.subscriptionTier)
                          }
                          className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-medium transition"
                        >
                          Toggle Tier
                        </button>
                        {user.role !== "admin" && (
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 rounded-lg text-xs font-medium transition"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-gray-500">
                      No matching users found.
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
}
