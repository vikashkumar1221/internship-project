import React from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import {
  BarChart2,
  TrendingUp,
  Headphones,
  Users,
  DollarSign,
  Music,
  ArrowUpRight,
  Sliders,
  Calendar,
  PieChart
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AnalyticsPage() {
  const kpis = [
    { label: 'Total Plays', value: '48,250', change: '+14.2%', icon: Headphones },
    { label: 'Active Collaborations', value: '18', change: '+3 this month', icon: Users },
    { label: 'Stems Downloaded', value: '1,420', change: '+22.5%', icon: Music },
    { label: 'Master Royalties', value: '$3,840.00', change: '+18.0%', icon: DollarSign }
  ];

  const weeklyStreams = [
    { day: 'Mon', streams: 4200, height: 45 },
    { day: 'Tue', streams: 5800, height: 60 },
    { day: 'Wed', streams: 5100, height: 52 },
    { day: 'Thu', streams: 7400, height: 78 },
    { day: 'Fri', streams: 9200, height: 95 },
    { day: 'Sat', streams: 8600, height: 88 },
    { day: 'Sun', streams: 7950, height: 82 }
  ];

  const topTracks = [
    { title: 'Midnight Synthwave Anthem', genre: 'Synthwave', plays: '24,180', stems: 14, royalty: '$1,820' },
    { title: 'Acoustic Indie Session', genre: 'Indie Folk', plays: '12,450', stems: 8, royalty: '$940' },
    { title: 'Cyberpunk Neon Underground', genre: 'Cyberpunk', plays: '8,920', stems: 12, royalty: '$710' },
    { title: 'Sunset Groove Neo-Soul', genre: 'R&B / Soul', plays: '2,700', stems: 6, royalty: '$370' }
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col justify-between selection:bg-[#dcc5b2] selection:text-[#2c2420]">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#e6ded5]">
            <div>
              <h1 className="text-2xl font-extrabold text-[#231f1d] tracking-tight">Studio Analytics</h1>
              <p className="text-xs text-[#736a64] mt-0.5">
                Session performance, listener streaming stats, and master royalty payouts.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#e6ded5] text-xs font-semibold text-[#2c2420]">
                <Calendar className="w-3.5 h-3.5 text-[#8c827a]" /> Last 30 Days
              </span>
            </div>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi, idx) => {
              const Icon = kpi.icon;
              return (
                <div key={idx} className="bg-white border border-[#e6ded5] rounded-2xl p-5 shadow-subtle flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-[#736a64]">{kpi.label}</span>
                    <div className="w-8 h-8 rounded-lg bg-[#faf8f5] border border-[#e6ded5] flex items-center justify-center text-[#2c2420]">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="mt-4 flex items-baseline justify-between">
                    <span className="text-2xl font-extrabold text-[#231f1d] font-mono">{kpi.value}</span>
                    <span className="text-xs font-bold text-emerald-700 flex items-center">
                      <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                      {kpi.change}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chart & Royalty Breakdown Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Weekly Activity Bar Chart */}
            <div className="lg:col-span-8 bg-white border border-[#e6ded5] rounded-2xl p-6 shadow-subtle space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-[#e6ded5]">
                <div>
                  <h3 className="font-bold text-sm text-[#231f1d]">Weekly Stream Activity</h3>
                  <p className="text-[11px] text-[#736a64]">DAW mixdown plays and collaborator reviews</p>
                </div>
                <span className="text-xs font-mono font-bold text-[#2c2420]">48.2k Total</span>
              </div>

              {/* Bar visualization */}
              <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
                {weeklyStreams.map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-[10px] font-mono text-[#8c827a] opacity-0 group-hover:opacity-100 transition">
                      {(bar.streams / 1000).toFixed(1)}k
                    </span>
                    <div className="w-full bg-[#faf8f5] rounded-xl h-36 flex items-end p-1 border border-[#e6ded5]">
                      <div
                        className="w-full bg-[#2c2420] group-hover:bg-[#443831] rounded-lg transition-all duration-300"
                        style={{ height: `${bar.height}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-[#736a64]">{bar.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Royalty Distribution Split Breakdown */}
            <div className="lg:col-span-4 bg-white border border-[#e6ded5] rounded-2xl p-6 shadow-subtle flex flex-col justify-between space-y-4">
              <div className="pb-3 border-b border-[#e6ded5]">
                <h3 className="font-bold text-sm text-[#231f1d]">Royalty Splits Overview</h3>
                <p className="text-[11px] text-[#736a64]">Active contributor contracts</p>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-[#231f1d]">Producers (Primary Owners)</span>
                    <span className="text-[#2c2420] font-mono">40%</span>
                  </div>
                  <div className="w-full h-2 bg-[#faf8f5] rounded-full overflow-hidden border border-[#e6ded5]">
                    <div className="w-[40%] h-full bg-[#2c2420] rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-[#231f1d]">Topline Vocalists</span>
                    <span className="text-[#2c2420] font-mono">35%</span>
                  </div>
                  <div className="w-full h-2 bg-[#faf8f5] rounded-full overflow-hidden border border-[#e6ded5]">
                    <div className="w-[35%] h-full bg-[#dcc5b2] rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-[#231f1d]">Songwriters & Arrangers</span>
                    <span className="text-[#2c2420] font-mono">25%</span>
                  </div>
                  <div className="w-full h-2 bg-[#faf8f5] rounded-full overflow-hidden border border-[#e6ded5]">
                    <div className="w-[25%] h-full bg-[#8c827a] rounded-full" />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#e6ded5] text-xs">
                <span className="font-bold text-[#231f1d] block">Legal Split Sheets</span>
                <p className="text-[11px] text-[#736a64] mt-0.5">
                  All active splits are validated at 100% and exportable as signed PDF agreements.
                </p>
              </div>
            </div>
          </div>

          {/* Top Collaborations Table */}
          <div className="bg-white border border-[#e6ded5] rounded-2xl shadow-subtle overflow-hidden">
            <div className="p-4 border-b border-[#e6ded5] flex justify-between items-center bg-[#faf8f5]">
              <span className="text-xs font-bold text-[#231f1d]">Top Performing Collaborations</span>
              <span className="text-xs text-[#736a64]">Sorted by monthly streams</span>
            </div>

            <div className="divide-y divide-[#e6ded5]">
              {topTracks.map((t, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between hover:bg-[#faf8f5] transition text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-5 text-center font-bold text-[#8c827a]">{idx + 1}</span>
                    <div>
                      <span className="font-bold text-[#231f1d] block">{t.title}</span>
                      <span className="text-[10px] text-[#736a64]">{t.genre} • {t.stems} stems active</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 font-mono">
                    <span className="font-bold text-[#231f1d]">{t.plays} plays</span>
                    <span className="text-emerald-700 font-bold">{t.royalty}</span>
                    <Link
                      to="/studio"
                      className="px-3 py-1.5 rounded-lg bg-[#2c2420] text-white font-semibold text-[11px] hover:bg-[#3d332e] transition"
                    >
                      Open DAW
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
