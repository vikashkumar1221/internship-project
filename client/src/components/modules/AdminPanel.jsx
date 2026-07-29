import React, { useState } from 'react';
import { ShieldAlert, Users, Folder, DollarSign, Activity, TrendingUp } from 'lucide-react';

export default function AdminPanel() {
  const [metrics] = useState({
    totalUsers: 148,
    totalProjects: 62,
    totalRevenue: 12450.00,
    activeSubscriptions: 84
  });

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-studio-border">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-indigo-400" /> Executive Admin Control Center
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            System health, active user subscriptions, revenue metrics, and SaaS platform overview.
          </p>
        </div>
      </div>

      {/* Metrics Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-studio-card border border-studio-border rounded-2xl p-4 flex justify-between items-center">
          <div>
            <span className="text-[11px] text-gray-400 font-semibold block">Total Users</span>
            <span className="text-2xl font-extrabold font-mono text-white mt-1 block">{metrics.totalUsers}</span>
          </div>
          <Users className="w-8 h-8 text-indigo-400" />
        </div>

        <div className="bg-studio-card border border-studio-border rounded-2xl p-4 flex justify-between items-center">
          <div>
            <span className="text-[11px] text-gray-400 font-semibold block">Active Projects</span>
            <span className="text-2xl font-extrabold font-mono text-white mt-1 block">{metrics.totalProjects}</span>
          </div>
          <Folder className="w-8 h-8 text-pink-400" />
        </div>

        <div className="bg-studio-card border border-studio-border rounded-2xl p-4 flex justify-between items-center">
          <div>
            <span className="text-[11px] text-gray-400 font-semibold block">Total MRR Revenue</span>
            <span className="text-2xl font-extrabold font-mono text-emerald-400 mt-1 block">${metrics.totalRevenue.toFixed(2)}</span>
          </div>
          <DollarSign className="w-8 h-8 text-emerald-400" />
        </div>

        <div className="bg-studio-card border border-studio-border rounded-2xl p-4 flex justify-between items-center">
          <div>
            <span className="text-[11px] text-gray-400 font-semibold block">Active Subscriptions</span>
            <span className="text-2xl font-extrabold font-mono text-amber-300 mt-1 block">{metrics.activeSubscriptions}</span>
          </div>
          <TrendingUp className="w-8 h-8 text-amber-300" />
        </div>
      </div>
    </div>
  );
}
