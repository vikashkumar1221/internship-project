import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Music,
  Bell,
  Search,
  LogOut,
  Plus,
  User,
  Settings
} from 'lucide-react';

export default function Navbar({ onOpenNewProject }) {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'Vocal Stem Added', desc: 'Sarah uploaded Lead_Vocal_Take1.wav', time: '10m ago' },
    { id: 2, title: 'New Comment', desc: 'Alex commented on City Lights', time: '1h ago' }
  ];

  return (
    <nav className="h-16 bg-[#2c2420] px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm text-white">
      {/* Brand & Main Links */}
      <div className="flex items-center gap-8">
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#dcc5b2] flex items-center justify-center text-[#2c2420] shadow-sm">
            <Music className="w-4 h-4 fill-current" />
          </div>
          <span className="font-bold text-base tracking-tight text-white">
            StudioCollab
          </span>
        </Link>

        {isAuthenticated && (
          <div className="hidden md:flex items-center gap-1 text-xs">
            <Link
              to="/dashboard"
              className={`px-3 py-1.5 rounded-lg transition font-medium ${
                location.pathname === '/dashboard' || location.pathname === '/projects'
                  ? 'bg-white/15 text-white font-bold'
                  : 'text-[#e6ded5] hover:text-white hover:bg-white/5'
              }`}
            >
              Projects
            </Link>
            <Link
              to="/studio"
              className={`px-3 py-1.5 rounded-lg transition font-medium ${
                location.pathname.startsWith('/studio')
                  ? 'bg-white/15 text-white font-bold'
                  : 'text-[#e6ded5] hover:text-white hover:bg-white/5'
              }`}
            >
              Studio DAW
            </Link>
            <Link
              to="/explore"
              className={`px-3 py-1.5 rounded-lg transition font-medium ${
                location.pathname === '/explore' || location.pathname === '/community'
                  ? 'bg-white/15 text-white font-bold'
                  : 'text-[#e6ded5] hover:text-white hover:bg-white/5'
              }`}
            >
              Community
            </Link>
          </div>
        )}
      </div>

      {/* Global Search (Only when logged in) */}
      {isAuthenticated && (
        <div className="hidden lg:flex items-center relative w-72">
          <Search className="w-3.5 h-3.5 text-white/50 absolute left-3" />
          <input
            type="text"
            placeholder="Search projects, creators..."
            className="w-full bg-white/10 border border-white/15 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/50 focus:outline-none focus:bg-white/15 focus:border-[#dcc5b2] transition"
          />
        </div>
      )}

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <>
            {onOpenNewProject && (
              <button
                onClick={onOpenNewProject}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#dcc5b2] hover:bg-[#cfb59f] text-[#2c2420] text-xs font-bold shadow-xs transition"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>New Project</span>
              </button>
            )}

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-[#e6ded5] hover:text-white hover:bg-white/15 transition relative"
                title="Activity Notifications"
              >
                <Bell className="w-3.5 h-3.5" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#dcc5b2]" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-[#e6ded5] rounded-xl shadow-elevated p-3 z-50 text-[#231f1d]">
                  <div className="flex justify-between items-center pb-2 border-b border-[#e6ded5] mb-2">
                    <span className="text-xs font-bold text-[#231f1d]">Notifications</span>
                    <span className="text-[11px] text-[#8c827a] cursor-pointer hover:underline">Mark read</span>
                  </div>
                  <div className="space-y-2">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-2 rounded-lg bg-[#faf8f5] text-xs">
                        <p className="font-semibold text-[#231f1d]">{n.title}</p>
                        <p className="text-[11px] text-[#736a64] mt-0.5">{n.desc}</p>
                        <span className="text-[10px] text-[#8c827a] mt-1 block">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Avatar (V) with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-8 h-8 rounded-full bg-[#dcc5b2] text-[#2c2420] font-extrabold text-xs flex items-center justify-center border-2 border-white/30 hover:border-white transition shadow-xs"
                title="User Profile"
              >
                {user?.name?.[0]?.toUpperCase() || 'V'}
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-[#e6ded5] rounded-xl shadow-elevated p-1.5 z-50 text-[#231f1d]">
                  <div className="px-3 py-2 border-b border-[#e6ded5]">
                    <p className="text-xs font-bold text-[#231f1d]">{user?.name || 'Vikash'}</p>
                    <p className="text-[11px] text-[#8c827a] truncate">{user?.email || 'vikash@example.com'}</p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#231f1d] hover:bg-[#faf8f5] rounded-lg transition"
                  >
                    <User className="w-3.5 h-3.5 text-[#8c827a]" /> Profile
                  </Link>

                  <Link
                    to="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#231f1d] hover:bg-[#faf8f5] rounded-lg transition"
                  >
                    <Settings className="w-3.5 h-3.5 text-[#8c827a]" /> Settings
                  </Link>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg transition mt-1 border-t border-[#e6ded5]/60"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs sm:text-sm font-medium text-[#e6ded5] hover:text-white transition"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-[#2c2420] bg-[#dcc5b2] hover:bg-[#cfb59f] rounded-lg shadow-sm transition"
            >
              Sign Up Free
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
