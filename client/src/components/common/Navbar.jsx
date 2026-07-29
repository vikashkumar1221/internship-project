import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Music,
  Bell,
  Search,
  Sparkles,
  User,
  LogOut,
  Sliders,
  FileText,
  ShoppingBag,
  Crown
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'Stem Upload Complete', desc: 'Sarah uploaded Vocal_Lead_Hook.wav', time: '2m ago' },
    { id: 2, title: 'Contract Signed', desc: 'Royalty split contract v1.2 signed by Alex', time: '1h ago' },
    { id: 3, title: 'Beat Sale', desc: 'You made a $29.99 sale on Cyberpunk Beat', time: '3h ago' }
  ];

  return (
    <nav className="h-16 border-b border-studio-border bg-studio-dark/90 backdrop-blur-md px-6 flex items-center justify-between z-40 sticky top-0">
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Music className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-lg bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-indigo-300">
              MusicStudio
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 block -mt-1">
              DAW SaaS Pro
            </span>
          </div>
        </Link>
      </div>

      {/* Global Studio Search */}
      <div className="hidden md:flex items-center relative w-96">
        <Search className="w-4 h-4 text-gray-400 absolute left-3" />
        <input
          type="text"
          placeholder="Search projects, stems, beats, collaborators..."
          className="w-full bg-studio-card/80 border border-studio-border rounded-lg pl-9 pr-4 py-1.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-studio-accent focus:ring-1 focus:ring-studio-accent transition-all"
        />
      </div>

      {/* Action Controls & User Menu */}
      <div className="flex items-center gap-4">
        {/* Tier Badge */}
        <Link
          to="/billing"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-indigo-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold hover:border-amber-400 transition"
        >
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          <span>{user?.subscriptionTier || 'Pro'} Member</span>
        </Link>

        {/* Realtime Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-lg bg-studio-card border border-studio-border flex items-center justify-center text-gray-300 hover:text-white hover:border-indigo-500 transition relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-studio-card border border-studio-border rounded-xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex justify-between items-center pb-3 border-b border-studio-border mb-3">
                <h4 className="font-semibold text-sm text-gray-200">Activity Notifications</h4>
                <span className="text-xs text-indigo-400 cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2.5 rounded-lg bg-studio-panel/50 hover:bg-studio-panel transition cursor-pointer text-xs">
                    <p className="font-medium text-gray-200">{n.title}</p>
                    <p className="text-gray-400 mt-0.5">{n.desc}</p>
                    <span className="text-[10px] text-gray-500 block mt-1">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2 border-l border-studio-border">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'}
            alt="Avatar"
            className="w-9 h-9 rounded-full ring-2 ring-indigo-500/40 object-cover"
          />
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-gray-200">{user?.name || 'Producer'}</p>

          </div>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            title="Logout"
            className="text-gray-400 hover:text-red-400 transition p-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
}
