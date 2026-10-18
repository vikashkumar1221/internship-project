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
    <nav className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-40 shadow-xs text-slate-800">
      {/* Brand & Main Links */}
      <div className="flex items-center gap-8">
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 border border-amber-500/20 flex items-center justify-center shadow-xs">
            <Music className="w-4 h-4 fill-current" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-slate-900">
            StudioCollab
          </span>
        </Link>

        {isAuthenticated && (
          <div className="hidden md:flex items-center gap-1 text-xs">
            <Link
              to="/projects"
              className={`px-3 py-1.5 rounded-lg transition font-medium ${
                location.pathname === '/projects' || location.pathname === '/dashboard'
                  ? 'bg-slate-100 text-slate-900 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Projects
            </Link>
            <Link
              to="/studio"
              className={`px-3 py-1.5 rounded-lg transition font-medium ${
                location.pathname.startsWith('/studio')
                  ? 'bg-slate-100 text-slate-900 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Studio DAW
            </Link>
            <Link
              to="/explore"
              className={`px-3 py-1.5 rounded-lg transition font-medium ${
                location.pathname === '/explore'
                  ? 'bg-slate-100 text-slate-900 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
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
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3" />
          <input
            type="text"
            placeholder="Search projects, stems..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-amber-500 transition"
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>New Project</span>
              </button>
            )}

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 transition relative"
                title="Activity Notifications"
              >
                <Bell className="w-3.5 h-3.5" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-500" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-lg p-3 z-50 text-slate-800">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100 mb-2">
                    <span className="text-xs font-bold text-slate-900">Notifications</span>
                    <span className="text-[11px] text-slate-500 cursor-pointer hover:underline">Mark read</span>
                  </div>
                  <div className="space-y-2">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                        <p className="font-semibold text-slate-900">{n.title}</p>
                        <p className="text-[11px] text-slate-600 mt-0.5">{n.desc}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Avatar with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 font-extrabold text-xs flex items-center justify-center border border-amber-300 hover:border-amber-400 transition shadow-xs"
                title="User Profile"
              >
                {user?.name?.[0]?.toUpperCase() || 'V'}
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-50 text-slate-800">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'Vikash'}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user?.email || 'vikash@example.com'}</p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg transition"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" /> Profile
                  </Link>

                  <Link
                    to="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg transition"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" /> Settings
                  </Link>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg transition mt-1 border-t border-slate-100"
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
              className="text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 transition"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition"
            >
              Sign Up Free
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
