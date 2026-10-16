import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Music,
  Home,
  Folder,
  Compass,
  Users,
  Mail,
  Library,
  BarChart2,
  User,
  Settings,
  Plus,
  Sliders,
  FileText,
  ArrowRight,
  Lock,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/common/AuthModal';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleAction = (mode = 'login', targetPath = '/dashboard') => {
    if (isAuthenticated) {
      navigate(targetPath);
    } else {
      setAuthMode(mode);
      setAuthModalOpen(true);
    }
  };

  const sidebarItems = [
    { name: 'Dashboard', icon: Home, path: '/dashboard', active: true },
    { name: 'Projects', icon: Folder, path: '/dashboard' },
    { name: 'Explore', icon: Compass, path: '/explore' },
    { name: 'Collaborators', icon: Users, path: '/collaborators' },
    { name: 'Messages', icon: Mail, path: '/activity' },
    { name: 'My Library', icon: Library, path: '/dashboard' },
    { name: 'Analytics', icon: BarChart2, path: '/dashboard' },
    { name: 'Profile', icon: User, path: '/profile' },
    { name: 'Settings', icon: Settings, path: '/settings' }
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#231f1d] flex selection:bg-[#dcc5b2] selection:text-[#2c2420]">
      {/* 
        ====================================================
        LEFT SIDEBAR COMPONENT (Matches the uploaded design)
        ====================================================
      */}
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 lg:w-72 bg-[#121110] border-r border-[#24201c] flex-col justify-between shrink-0 select-none sticky top-0 h-screen overflow-y-auto">
        <div>
          {/* Logo */}
          <div className="px-6 pt-7 pb-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[#f1dec9]">
              <Music className="w-7 h-7 stroke-[2.2]" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              StudioCollab
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5 px-4">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => handleAction('login', item.path)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm transition text-left group ${
                    item.active
                      ? 'bg-[#f1dec9] text-[#1a1614] font-bold shadow-xs'
                      : 'text-[#c2b8ae] hover:text-white hover:bg-white/5 font-medium'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      item.active
                        ? 'text-[#1a1614] stroke-[2.2]'
                        : 'text-[#c2b8ae] group-hover:text-white stroke-[1.8]'
                    }`}
                  />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Button: + Create Project */}
        <div className="p-4 pt-2">
          <button
            onClick={() => handleAction('login', '/dashboard')}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#f1dec9] hover:bg-[#e4ceb7] text-[#1a1614] font-bold text-sm shadow-sm transition active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Project</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex"
          onClick={() => setMobileSidebarOpen(false)}
        >
          <div
            className="w-72 bg-[#121110] h-full flex flex-col justify-between p-4 animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex justify-between items-center px-2 py-4">
                <div className="flex items-center gap-2.5">
                  <Music className="w-6 h-6 text-[#f1dec9]" />
                  <span className="font-extrabold text-xl text-white">StudioCollab</span>
                </div>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="text-[#c2b8ae] hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1.5 mt-2">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        setMobileSidebarOpen(false);
                        handleAction('login', item.path);
                      }}
                      className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm transition text-left ${
                        item.active
                          ? 'bg-[#f1dec9] text-[#1a1614] font-bold shadow-xs'
                          : 'text-[#c2b8ae] hover:text-white hover:bg-white/5 font-medium'
                      }`}
                    >
                      <Icon className="w-5 h-5 stroke-[2]" />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <button
              onClick={() => {
                setMobileSidebarOpen(false);
                handleAction('login', '/dashboard');
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#f1dec9] hover:bg-[#e4ceb7] text-[#1a1614] font-bold text-sm shadow-sm transition"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create Project</span>
            </button>
          </div>
        </div>
      )}

      {/* 
        ====================================================
        RIGHT MAIN CONTENT (Top Header, Hero, Features, Footer)
        ====================================================
      */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-[#2c2420] px-6 sm:px-10 flex items-center justify-between sticky top-0 z-40 shadow-sm text-white">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-lg text-[#e6ded5] hover:text-white hover:bg-white/10"
              title="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div onClick={() => handleAction('login')} className="flex md:hidden items-center gap-2 cursor-pointer">
              <div className="w-7 h-7 rounded-lg bg-[#dcc5b2] flex items-center justify-center text-[#2c2420]">
                <Music className="w-4 h-4 fill-current" />
              </div>
              <span className="font-bold text-base text-white">StudioCollab</span>
            </div>
          </div>

          {/* Top Auth Buttons: Sign In & Sign Up */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleAction('login')}
              className="text-xs sm:text-sm font-medium text-[#e6ded5] hover:text-white transition px-2 py-1"
            >
              Sign In
            </button>
            <button
              onClick={() => handleAction('register')}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-[#2c2420] bg-[#dcc5b2] hover:bg-[#cfb59f] rounded-xl shadow-sm transition"
            >
              Sign Up
            </button>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="flex-1 flex flex-col">
          {/* Full-Width Atmospheric Hero Banner */}
          <section className="relative w-full min-h-[440px] md:min-h-[500px] bg-[#1e1715] flex items-center overflow-hidden">
            {/* Background Studio Photography */}
            <img
              src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1600&auto=format&fit=crop&q=85"
              alt="Warm music studio setup with monitors, laptop, and guitar"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-85"
            />

            {/* Dark Gradient Overlay for typography contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#181311]/95 via-[#221b18]/80 sm:via-[#221b18]/65 to-transparent" />

            {/* Hero Content Container */}
            <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10 py-16 w-full">
              <div className="max-w-xl space-y-6">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
                  Make music<br />together.
                </h1>

                <p className="text-sm sm:text-base md:text-lg text-[#ded8d2] leading-relaxed max-w-lg">
                  A simple studio to record, edit and collaborate with your team — right in your browser.
                </p>

                <div className="flex flex-wrap items-center gap-3.5 pt-2">
                  <button
                    onClick={() => handleAction('register')}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#dcc5b2] hover:bg-[#cfb59f] font-bold text-sm text-[#2c2420] shadow-md transition transform hover:scale-[1.02]"
                  >
                    <span>Open Studio</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>

                  <button
                    onClick={() => handleAction('login')}
                    className="px-6 py-3 rounded-xl bg-black/30 hover:bg-black/50 border border-white/30 backdrop-blur-xs font-semibold text-sm text-white shadow-sm transition"
                  >
                    Explore Projects
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Feature Cards Section (Rounded Boxes with smooth corners) */}
          <section className="bg-white py-14 px-6 sm:px-10">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Box 1: Work on tracks */}
              <div
                onClick={() => handleAction('register')}
                className="bg-[#faf8f5] border border-[#e6ded5] rounded-3xl p-7 sm:p-8 flex flex-col justify-between space-y-5 shadow-subtle hover:shadow-card hover:border-[#cfb59f] transition cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white border border-[#e6ded5] flex items-center justify-center text-[#2c2420] shadow-xs group-hover:scale-105 transition-transform">
                  <Sliders className="w-5 h-5 stroke-[2.2]" />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-base text-[#231f1d]">
                      Work on tracks
                    </h3>
                    <Lock className="w-3.5 h-3.5 text-[#a89f97] opacity-60" />
                  </div>
                  <p className="text-xs sm:text-sm text-[#736a64] leading-relaxed">
                    Record, edit and mix multiple tracks right in your browser.
                  </p>
                </div>
              </div>

              {/* Box 2: Real-time collaboration */}
              <div
                onClick={() => handleAction('register')}
                className="bg-[#faf8f5] border border-[#e6ded5] rounded-3xl p-7 sm:p-8 flex flex-col justify-between space-y-5 shadow-subtle hover:shadow-card hover:border-[#cfb59f] transition cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white border border-[#e6ded5] flex items-center justify-center text-[#2c2420] shadow-xs group-hover:scale-105 transition-transform">
                  <Users className="w-5 h-5 stroke-[2.2]" />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-base text-[#231f1d]">
                      Real-time collaboration
                    </h3>
                    <Lock className="w-3.5 h-3.5 text-[#a89f97] opacity-60" />
                  </div>
                  <p className="text-xs sm:text-sm text-[#736a64] leading-relaxed">
                    Invite collaborators, leave feedback and create together.
                  </p>
                </div>
              </div>

              {/* Box 3: Keep your work safe */}
              <div
                onClick={() => handleAction('register')}
                className="bg-[#faf8f5] border border-[#e6ded5] rounded-3xl p-7 sm:p-8 flex flex-col justify-between space-y-5 shadow-subtle hover:shadow-card hover:border-[#cfb59f] transition cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white border border-[#e6ded5] flex items-center justify-center text-[#2c2420] shadow-xs group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5 stroke-[2.2]" />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-base text-[#231f1d]">
                      Keep your work safe
                    </h3>
                    <Lock className="w-3.5 h-3.5 text-[#a89f97] opacity-60" />
                  </div>
                  <p className="text-xs sm:text-sm text-[#736a64] leading-relaxed">
                    Track versions, save snapshots and give proper credit.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-[#e6ded5] bg-[#faf8f5] py-6 px-6 sm:px-10 text-xs text-[#736a64]">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
            <p>© 2026 StudioCollab. Crafted for musicians & producers.</p>
            <div className="flex gap-4">
              <button onClick={() => handleAction('login')} className="hover:text-[#231f1d] transition">Sign In</button>
              <button onClick={() => handleAction('register')} className="hover:text-[#231f1d] transition">Sign Up</button>
            </div>
          </div>
        </footer>
      </div>

      {/* Interactive Auth Modal for any click without login */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}
