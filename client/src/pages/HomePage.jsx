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
  X,
  Search,
  Play,
  Pause,
  Download,
  Share2,
  Clock,
  Sparkles,
  HardDrive,
  MessageSquare,
  CheckCircle2,
  Volume2,
  TrendingUp,
  Headphones
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/common/AuthModal';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [previewPlayingId, setPreviewPlayingId] = useState(null);

  const handleAction = (mode = 'login', targetPath = '/dashboard') => {
    if (isAuthenticated) {
      navigate(targetPath);
    } else {
      setAuthMode(mode);
      setAuthModalOpen(true);
    }
  };

  const togglePreviewPlay = (id) => {
    if (!isAuthenticated) {
      setAuthMode('login');
      setAuthModalOpen(true);
      return;
    }
    setPreviewPlayingId(previewPlayingId === id ? null : id);
  };

  const sidebarItems = [
    { name: 'Dashboard', icon: Home, id: 'Dashboard', path: '/dashboard' },
    { name: 'Projects', icon: Folder, id: 'Projects', path: '/projects' },
    { name: 'Explore', icon: Compass, id: 'Explore', path: '/explore' },
    { name: 'Collaborators', icon: Users, id: 'Collaborators', path: '/collaborators' },
    { name: 'Messages', icon: Mail, id: 'Messages', path: '/messages' },
    { name: 'My Library', icon: Library, id: 'My Library', path: '/library' },
    { name: 'Analytics', icon: BarChart2, id: 'Analytics', path: '/analytics' },
    { name: 'Profile', icon: User, id: 'Profile', path: '/profile' },
    { name: 'Settings', icon: Settings, id: 'Settings', path: '/settings' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex selection:bg-amber-100 selection:text-amber-900">
      {/* 
        ====================================================
        LEFT SIDEBAR COMPONENT (Clean Modern Light Theme)
        ====================================================
      */}
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 lg:w-72 bg-white border-r border-slate-200 flex-col justify-between shrink-0 select-none sticky top-0 h-screen overflow-y-auto">
        <div>
          {/* Logo */}
          <div className="px-6 pt-7 pb-6 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 border border-amber-500/20 flex items-center justify-center shadow-xs">
              <Music className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 block leading-tight">
                StudioCollab
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                Music Studio
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1 px-4">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveTab(item.id);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition text-left group ${
                    isActive
                      ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200/80 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive
                        ? 'text-amber-700 stroke-[2.4]'
                        : 'text-slate-400 group-hover:text-slate-700 stroke-[2]'
                    }`}
                  />
                  <span className="truncate">{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Button: + Create Project */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={() => handleAction('login', '/projects')}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Project</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex"
          onClick={() => setMobileSidebarOpen(false)}
        >
          <div
            className="w-72 bg-white h-full flex flex-col justify-between p-4 animate-in slide-in-from-left duration-200 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex justify-between items-center px-2 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center">
                    <Music className="w-4 h-4" />
                  </div>
                  <span className="font-extrabold text-base text-slate-900">StudioCollab</span>
                </div>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="text-slate-400 hover:text-slate-900 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1 mt-4">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition text-left ${
                        isActive
                          ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200/80 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
                      }`}
                    >
                      <Icon className="w-4 h-4 stroke-[2]" />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <button
              onClick={() => {
                setMobileSidebarOpen(false);
                handleAction('login', '/projects');
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create Project</span>
            </button>
          </div>
        </div>
      )}

      {/* 
        ====================================================
        RIGHT MAIN CONTENT (Top Header, Dynamic Sidebar View)
        ====================================================
      */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-6 sm:px-10 flex items-center justify-between sticky top-0 z-40 shadow-xs text-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              title="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div onClick={() => setActiveTab('Dashboard')} className="flex items-center gap-2 cursor-pointer">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-700 border border-amber-500/20 flex items-center justify-center">
                <Music className="w-4 h-4 fill-current" />
              </div>
              <span className="font-extrabold text-base text-slate-900">StudioCollab</span>
              <span className="hidden sm:inline-block text-xs text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full font-medium ml-2">
                {activeTab} View
              </span>
            </div>
          </div>

          {/* Top Auth Buttons: Sign In & Sign Up */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleAction('login')}
              className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition px-3 py-1.5 rounded-lg hover:bg-slate-100"
            >
              Sign In
            </button>
            <button
              onClick={() => handleAction('register')}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition"
            >
              Sign Up Free
            </button>
          </div>
        </header>

        {/* Dynamic Main Body based on Sidebar Selection */}
        <main className="flex-1 flex flex-col">
          {/* ==================== 1. DASHBOARD TAB ==================== */}
          {activeTab === 'Dashboard' && (
            <div>
              {/* Luminous Light Hero Banner */}
              <section className="relative w-full min-h-[420px] md:min-h-[460px] bg-gradient-to-br from-amber-50 via-slate-50 to-indigo-50/40 border-b border-slate-200/80 flex items-center overflow-hidden">
                <div className="max-w-5xl mx-auto px-6 sm:px-10 py-16 w-full">
                  <div className="max-w-xl space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-amber-200 shadow-xs text-amber-900 text-xs font-semibold">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      Browser-Based Music Collaboration DAW
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                      Make music<br />together.
                    </h1>

                    <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed max-w-lg">
                      A simple, clean studio to record, edit, and collaborate with your team — right in your browser without file swaps.
                    </p>

                    <div className="flex flex-wrap items-center gap-3.5 pt-2">
                      <button
                        onClick={() => handleAction('register', '/studio')}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 font-bold text-sm text-white shadow-xs transition transform hover:scale-[1.02]"
                      >
                        <span>Open Studio DAW</span>
                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                      </button>

                      <button
                        onClick={() => setActiveTab('Projects')}
                        className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 font-semibold text-sm text-slate-800 shadow-xs transition"
                      >
                        Browse Projects
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Feature Cards Section */}
              <section className="py-14 px-6 sm:px-10 bg-slate-50">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div
                    onClick={() => handleAction('register', '/studio')}
                    className="bg-white border border-slate-200 rounded-2xl p-7 flex flex-col justify-between space-y-5 shadow-xs hover:shadow-md hover:border-slate-300 transition cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-800 shadow-xs group-hover:scale-105 transition-transform">
                      <Sliders className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h3 className="font-extrabold text-base text-slate-900">Multi-Track DAW</h3>
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                        Record, edit, mute, solo, and mix audio stems in your browser with real WaveSurfer waveforms.
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => setActiveTab('Collaborators')}
                    className="bg-white border border-slate-200 rounded-2xl p-7 flex flex-col justify-between space-y-5 shadow-xs hover:shadow-md hover:border-slate-300 transition cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 shadow-xs group-hover:scale-105 transition-transform">
                      <Users className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h3 className="font-extrabold text-base text-slate-900">Real-Time Team Sync</h3>
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                        Invite producers and vocalists, exchange timestamped feedback, and sync playback together.
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => setActiveTab('Analytics')}
                    className="bg-white border border-slate-200 rounded-2xl p-7 flex flex-col justify-between space-y-5 shadow-xs hover:shadow-md hover:border-slate-300 transition cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-xs group-hover:scale-105 transition-transform">
                      <FileText className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h3 className="font-extrabold text-base text-slate-900">Royalty Split Contracts</h3>
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                        Track versions, restore earlier snapshots, and auto-generate legal 100% royalty split agreements.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* ==================== 2. PROJECTS TAB ==================== */}
          {activeTab === 'Projects' && (
            <div className="p-6 sm:p-10 max-w-6xl mx-auto w-full space-y-8 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Active Studio Projects</h1>
                  <p className="text-sm text-slate-500 mt-1">Multi-track sessions in production with cloud stems and version control.</p>
                </div>
                <button
                  onClick={() => handleAction('login', '/projects')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-xs transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Project</span>
                </button>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    id: 'p1',
                    title: 'Midnight Synthwave Anthem',
                    genre: 'Synthwave / Retrowave',
                    bpm: 124,
                    key: 'F Minor',
                    tracks: 6,
                    collaborators: ['Sarah Chen', 'Marcus B.'],
                    img: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600'
                  },
                  {
                    id: 'p2',
                    title: 'Acoustic Indie Session Vol. 2',
                    genre: 'Indie Folk',
                    bpm: 96,
                    key: 'G Major',
                    tracks: 4,
                    collaborators: ['Elena Rostova', 'David K.'],
                    img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600'
                  },
                  {
                    id: 'p3',
                    title: 'Lo-Fi Chill Beats & Rhodes',
                    genre: 'Lo-Fi Hip Hop',
                    bpm: 82,
                    key: 'C Minor',
                    tracks: 5,
                    collaborators: ['Kofi Mensah'],
                    img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600'
                  }
                ].map((project) => (
                  <div
                    key={project.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-44 overflow-hidden group">
                        <img src={project.img} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-white">
                          <span className="text-xs font-semibold bg-slate-900/80 backdrop-blur-xs px-2.5 py-1 rounded-md">
                            {project.bpm} BPM • {project.key}
                          </span>
                          <span className="text-xs bg-amber-400 text-slate-900 font-bold px-2.5 py-1 rounded-md">
                            {project.tracks} Stems
                          </span>
                        </div>
                      </div>

                      <div className="p-5">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{project.genre}</span>
                        <h3 className="font-extrabold text-base text-slate-900 mt-1 line-clamp-1">{project.title}</h3>
                        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          Collaborators: {project.collaborators.join(', ')}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                      <button
                        onClick={() => handleAction('login', '/studio')}
                        className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition flex items-center justify-center gap-1.5"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>Open Studio</span>
                      </button>
                      <button
                        onClick={() => handleAction('login', '/projects')}
                        className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
                        title="Split Sheet & Details"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== 3. EXPLORE TAB ==================== */}
          {activeTab === 'Explore' && (
            <div className="p-6 sm:p-10 max-w-6xl mx-auto w-full space-y-8 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Explore Community & Stems</h1>
                  <p className="text-sm text-slate-500 mt-1">Discover open collaboration stems, remix competitions, and public sample packs.</p>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs">Trending</span>
                  <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 font-medium text-xs">Acapellas</span>
                  <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 font-medium text-xs">Drum Kits</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  {
                    title: 'Velvet Soul Vocals (Dry 24-bit WAV)',
                    artist: 'Maya Lin',
                    role: 'Vocalist • Berlin',
                    duration: '02:44',
                    bpm: 90,
                    key: 'D♭ Major'
                  },
                  {
                    title: 'Analog Roland Juno Arpeggio Loop',
                    artist: 'Kofi Mensah',
                    role: 'Sound Designer • London',
                    duration: '01:15',
                    bpm: 124,
                    key: 'A Minor'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between gap-4 shadow-xs">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => togglePreviewPlay(`explore_${idx}`)}
                        className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center shrink-0 transition"
                      >
                        {previewPlayingId === `explore_${idx}` ? <Pause className="w-5 h-5 fill-current text-amber-600" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                      </button>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{item.artist} ({item.role})</p>
                        <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
                          <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-200">{item.bpm} BPM</span>
                          <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-200">{item.key}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAction('login', '/studio')}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition shrink-0 flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Remix</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== 4. COLLABORATORS TAB ==================== */}
          {activeTab === 'Collaborators' && (
            <div className="p-6 sm:p-10 max-w-6xl mx-auto w-full space-y-8 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Creator Network</h1>
                  <p className="text-sm text-slate-500 mt-1">Connect with verified vocalists, producers, and audio engineers for your sessions.</p>
                </div>
                <button
                  onClick={() => handleAction('register', '/collaborators')}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
                >
                  Join as Creator
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    name: 'Sarah Chen',
                    role: 'Lead Vocalist & Topliner',
                    location: 'Los Angeles, USA',
                    genre: 'Pop / Synthwave',
                    online: true,
                    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'
                  },
                  {
                    name: 'Marcus Bell',
                    role: 'Mixing Engineer',
                    location: 'London, UK',
                    genre: 'Hip Hop / R&B',
                    online: true,
                    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
                  }
                ].map((collab, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img src={collab.avatar} alt={collab.name} className="w-14 h-14 rounded-full object-cover border border-slate-200" />
                        {collab.online && (
                          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-base text-slate-900">{collab.name}</h4>
                        <p className="text-xs text-slate-500 font-medium">{collab.role}</p>
                        <p className="text-[11px] text-slate-400">{collab.location}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAction('login', '/collaborators')}
                      className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition flex items-center justify-center gap-2"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Invite to Project</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== 5. MESSAGES TAB ==================== */}
          {activeTab === 'Messages' && (
            <div className="p-6 sm:p-10 max-w-5xl mx-auto w-full space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-200 pb-4">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Timestamped Audio Feedback</h1>
                <p className="text-sm text-slate-500 mt-1">Leave feedback directly at playhead positions without timecode confusion.</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold text-xs">
                      MS
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">Midnight Synthwave Anthem</h4>
                      <p className="text-[11px] text-slate-500">Live multi-user discussion</p>
                    </div>
                  </div>
                  <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">Active Room</span>
                </div>

                <div className="p-6 space-y-4 max-h-[360px] overflow-y-auto bg-slate-50/40">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0">
                      SC
                    </div>
                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200 max-w-md shadow-xs space-y-1">
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-bold text-xs text-slate-900">Sarah Chen</span>
                        <span className="text-[10px] text-slate-400">10 mins ago</span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                        <Clock className="w-3 h-3 text-amber-600" />
                        Jump to 00:14.2
                      </span>
                      <p className="text-xs text-slate-600">
                        Added double tracking on this verse hook! Check if the stereo spread is wide enough.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Write a message or timestamp note..."
                    onClick={() => handleAction('login', '/messages')}
                    readOnly
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-hidden cursor-pointer"
                  />
                  <button
                    onClick={() => handleAction('login', '/messages')}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==================== 6. MY LIBRARY TAB ==================== */}
          {activeTab === 'My Library' && (
            <div className="p-6 sm:p-10 max-w-6xl mx-auto w-full space-y-8 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">My Audio Library</h1>
                  <p className="text-sm text-slate-500 mt-1">Multi-track stem vault and private sound recordings.</p>
                </div>
                <div className="flex items-center gap-2 text-xs bg-white px-3.5 py-2 rounded-xl border border-slate-200">
                  <HardDrive className="w-4 h-4 text-slate-400" />
                  <span>14.2 MB of 2.0 GB Cloud Storage</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
                {[
                  { name: 'Sarah_Lead_Vocal_Take1_Dry.wav', category: 'Vocals', size: '24.2 MB', duration: '03:14' },
                  { name: 'Roland_Juno_106_Chords_Wet.wav', category: 'Synths', size: '18.6 MB', duration: '03:14' },
                  { name: 'Analog_909_Drum_Stem_Group.wav', category: 'Drums', size: '32.1 MB', duration: '03:14' }
                ].map((stem, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition">
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                        <Music className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-xs text-slate-900">{stem.name}</p>
                        <span className="text-[11px] text-slate-400">{stem.category} • {stem.size} • {stem.duration}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAction('login', '/library')}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold"
                    >
                      Audition
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== 7. ANALYTICS TAB ==================== */}
          {activeTab === 'Analytics' && (
            <div className="p-6 sm:p-10 max-w-6xl mx-auto w-full space-y-8 animate-in fade-in duration-200">
              <div className="border-b border-slate-200 pb-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Studio Analytics & Royalties</h1>
                <p className="text-sm text-slate-500 mt-1">Real-time performance metrics and automated split sheet agreements.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-semibold text-slate-500">Total Streams</span>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">48,250</p>
                  <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-block">↑ +14.2%</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-semibold text-slate-500">Active Collaborations</span>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">18</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-semibold text-slate-500">Stems Downloaded</span>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">1,420</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-semibold text-slate-500">Master Royalties</span>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">$3,840.00</p>
                </div>
              </div>
            </div>
          )}

          {/* ==================== 8. PROFILE TAB ==================== */}
          {activeTab === 'Profile' && (
            <div className="p-6 sm:p-10 max-w-5xl mx-auto w-full space-y-8 animate-in fade-in duration-200">
              <div className="border-b border-slate-200 pb-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Creator Profile</h1>
                <p className="text-sm text-slate-500 mt-1">Your public producer card, musical credentials, and studio credits.</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-900 border-2 border-amber-300 flex items-center justify-center font-extrabold text-2xl shrink-0">
                  AR
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl font-extrabold text-slate-900">Alex Rivera</h2>
                  <p className="text-xs text-slate-500">Electronic Music Producer • Los Angeles, CA</p>
                  <p className="text-xs text-slate-600 pt-1">Producing analog synth anthems and modern vocal arrangements.</p>
                </div>
              </div>
            </div>
          )}

          {/* ==================== 9. SETTINGS TAB ==================== */}
          {activeTab === 'Settings' && (
            <div className="p-6 sm:p-10 max-w-5xl mx-auto w-full space-y-8 animate-in fade-in duration-200">
              <div className="border-b border-slate-200 pb-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Studio Settings & Hardware</h1>
                <p className="text-sm text-slate-500 mt-1">Configure Web Audio API sample rates, buffers, and session notifications.</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <h3 className="font-bold text-sm text-slate-900">Audio Processing Engine</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="font-bold text-slate-800">Sample Rate</p>
                    <p className="text-slate-500 mt-0.5">48,000 Hz (24-bit Studio PCM)</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="font-bold text-slate-800">Buffer Latency</p>
                    <p className="text-slate-500 mt-0.5">128 samples (4.2ms ultra-low)</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white py-6 px-6 sm:px-10 text-xs text-slate-500">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
            <p>© 2026 StudioCollab. Crafted for musicians & producers.</p>
            <div className="flex gap-4">
              <button onClick={() => handleAction('login')} className="hover:text-slate-900 transition">Sign In</button>
              <button onClick={() => handleAction('register')} className="hover:text-slate-900 transition">Sign Up Free</button>
            </div>
          </div>
        </footer>
      </div>

      {/* Interactive Auth Modal for any protected action without login */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}
