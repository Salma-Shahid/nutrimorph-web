"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

// Interfaces for TypeScript Safety
interface StatsData {
  totalUsers: number;
  proUsers: number;
  freeUsers: number;
  totalMeals: number;
  totalExercises: number;
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

export default function AdminPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Backend Base URL (Environment Variable ya Fallback)
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError("");

      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      
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

      const [statsRes, usersRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/admin/stats`, config),
        axios.get(`${API_BASE_URL}/admin/users`, config),
      ]);

      setStats(statsRes.data.data);
      setUsers(usersRes.data.data);
      setLoading(false);
    } catch (err: any) {
      console.error("Admin Fetch Error:", err);
      setError(
        err.response?.data?.message || "Failed to load admin dashboard data."
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Toggle User Subscription Tier (Free <-> Pro)
  const handleToggleTier = async (userId: string, currentTier?: string) => {
    try {
      const newTier = currentTier === "pro" ? "free" : "pro";
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.patch(
        `${API_BASE_URL}/admin/users/${userId}/tier`,
        { subscriptionTier: newTier },
        config
      );

      fetchAdminData();
    } catch (err: any) {
      alert("Failed to update tier: " + (err.response?.data?.message || err.message));
    }
  };

  // Delete User Account
  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.delete(`${API_BASE_URL}/admin/users/${userId}`, config);

      fetchAdminData();
    } catch (err: any) {
      alert("Failed to delete user: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-emerald-400 font-medium text-lg">
        Loading Admin Dashboard...
      </div>
    );
  }

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

        {/* Error Alert */}
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
              <p className="text-gray-400 text-sm font-medium">Active Pro Users</p>
              <p className="text-4xl font-bold text-sky-400 mt-2">
                {stats.proUsers}
              </p>
            </div>
            <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 shadow-xl">
              <p className="text-gray-400 text-sm font-medium">Total Logged Meals</p>
              <p className="text-4xl font-bold text-amber-400 mt-2">
                {stats.totalMeals}
              </p>
            </div>
            <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 shadow-xl">
              <p className="text-gray-400 text-sm font-medium">Total Exercises</p>
              <p className="text-4xl font-bold text-purple-400 mt-2">
                {stats.totalExercises}
              </p>
            </div>
          </div>
        )}

        {/* User Management Table */}
        <div className="bg-gray-900/80 rounded-2xl border border-gray-800 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-bold text-gray-200">
              Registered Accounts ({users.length})
            </h2>
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
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-850/50 transition">
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
                        onClick={() => handleToggleTier(user._id, user.subscriptionTier)}
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}