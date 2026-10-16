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
  Radio,
  Headphones,
  FileAudio,
  ShieldCheck,
  Disc3
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
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveTab(item.id);
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm transition text-left group ${
                    isActive
                      ? 'bg-[#f1dec9] text-[#1a1614] font-bold shadow-xs'
                      : 'text-[#c2b8ae] hover:text-white hover:bg-white/5 font-medium'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isActive
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
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm transition text-left ${
                        isActive
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
        RIGHT MAIN CONTENT (Top Header, Dynamic Sidebar View)
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

            <div onClick={() => setActiveTab('Dashboard')} className="flex items-center gap-2 cursor-pointer">
              <div className="w-7 h-7 rounded-lg bg-[#dcc5b2] flex items-center justify-center text-[#2c2420]">
                <Music className="w-4 h-4 fill-current" />
              </div>
              <span className="font-bold text-base text-white">StudioCollab</span>
              <span className="hidden sm:inline-block text-xs text-[#a89f97] bg-white/10 px-2.5 py-0.5 rounded-full font-medium ml-2">
                {activeTab} View
              </span>
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

        {/* Dynamic Main Body based on Sidebar Selection */}
        <main className="flex-1 flex flex-col">
          {/* ==================== 1. DASHBOARD TAB ==================== */}
          {activeTab === 'Dashboard' && (
            <div>
              {/* Full-Width Atmospheric Hero Banner */}
              <section className="relative w-full min-h-[440px] md:min-h-[500px] bg-[#1e1715] flex items-center overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1600&auto=format&fit=crop&q=85"
                  alt="Warm music studio setup with monitors, laptop, and guitar"
                  className="absolute inset-0 w-full h-full object-cover object-center opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#181311]/95 via-[#221b18]/80 sm:via-[#221b18]/65 to-transparent" />

                <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10 py-16 w-full">
                  <div className="max-w-xl space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-[#f1dec9] text-xs font-semibold">
                      <Sparkles className="w-3.5 h-3.5" />
                      Next-Gen Music Collaboration DAW
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
                      Make music<br />together.
                    </h1>

                    <p className="text-sm sm:text-base md:text-lg text-[#ded8d2] leading-relaxed max-w-lg">
                      A simple studio to record, edit and collaborate with your team — right in your browser without file swaps.
                    </p>

                    <div className="flex flex-wrap items-center gap-3.5 pt-2">
                      <button
                        onClick={() => handleAction('register', '/studio')}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#dcc5b2] hover:bg-[#cfb59f] font-bold text-sm text-[#2c2420] shadow-md transition transform hover:scale-[1.02]"
                      >
                        <span>Open Studio</span>
                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                      </button>

                      <button
                        onClick={() => setActiveTab('Projects')}
                        className="px-6 py-3 rounded-xl bg-black/30 hover:bg-black/50 border border-white/30 backdrop-blur-xs font-semibold text-sm text-white shadow-sm transition"
                      >
                        Browse Projects
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Feature Cards Section */}
              <section className="bg-white py-14 px-6 sm:px-10">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div
                    onClick={() => handleAction('register', '/studio')}
                    className="bg-[#faf8f5] border border-[#e6ded5] rounded-3xl p-7 sm:p-8 flex flex-col justify-between space-y-5 shadow-subtle hover:shadow-card hover:border-[#cfb59f] transition cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white border border-[#e6ded5] flex items-center justify-center text-[#2c2420] shadow-xs group-hover:scale-105 transition-transform">
                      <Sliders className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h3 className="font-extrabold text-base text-[#231f1d]">Work on tracks</h3>
                        <Lock className="w-3.5 h-3.5 text-[#a89f97] opacity-60" />
                      </div>
                      <p className="text-xs sm:text-sm text-[#736a64] leading-relaxed">
                        Record, edit, mute, solo, and mix multiple audio stems right in your browser with real WaveSurfer waveforms.
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => setActiveTab('Collaborators')}
                    className="bg-[#faf8f5] border border-[#e6ded5] rounded-3xl p-7 sm:p-8 flex flex-col justify-between space-y-5 shadow-subtle hover:shadow-card hover:border-[#cfb59f] transition cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white border border-[#e6ded5] flex items-center justify-center text-[#2c2420] shadow-xs group-hover:scale-105 transition-transform">
                      <Users className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h3 className="font-extrabold text-base text-[#231f1d]">Real-time collaboration</h3>
                        <Lock className="w-3.5 h-3.5 text-[#a89f97] opacity-60" />
                      </div>
                      <p className="text-xs sm:text-sm text-[#736a64] leading-relaxed">
                        Invite producers and vocalists, exchange timestamped playback feedback, and track team changes live.
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => setActiveTab('Analytics')}
                    className="bg-[#faf8f5] border border-[#e6ded5] rounded-3xl p-7 sm:p-8 flex flex-col justify-between space-y-5 shadow-subtle hover:shadow-card hover:border-[#cfb59f] transition cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white border border-[#e6ded5] flex items-center justify-center text-[#2c2420] shadow-xs group-hover:scale-105 transition-transform">
                      <FileText className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h3 className="font-extrabold text-base text-[#231f1d]">Keep your work safe</h3>
                        <Lock className="w-3.5 h-3.5 text-[#a89f97] opacity-60" />
                      </div>
                      <p className="text-xs sm:text-sm text-[#736a64] leading-relaxed">
                        Track snapshots, restore earlier versions with one click, and auto-calculate 100% royalty split contracts.
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6ded5] pb-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#231f1d]">Active Studio Projects</h1>
                  <p className="text-sm text-[#736a64] mt-1">Multi-track sessions currently in production with cloud stems and version control.</p>
                </div>
                <button
                  onClick={() => handleAction('login', '/dashboard')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2c2420] hover:bg-[#1a1614] text-[#f1dec9] font-bold text-sm shadow-sm transition"
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
                  },
                  {
                    id: 'p4',
                    title: 'Neon Horizon Club Mix',
                    genre: 'Melodic Techno',
                    bpm: 128,
                    key: 'A Minor',
                    tracks: 8,
                    collaborators: ['Sarah Chen', 'Kofi M.'],
                    img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600'
                  },
                  {
                    id: 'p5',
                    title: 'Soulful RnB Late Night',
                    genre: 'Neo-Soul / RnB',
                    bpm: 88,
                    key: 'E♭ Major',
                    tracks: 5,
                    collaborators: ['Maya Lin', 'David K.'],
                    img: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600'
                  },
                  {
                    id: 'p6',
                    title: 'Heavy Guitar Wall Stems',
                    genre: 'Alternative Rock',
                    bpm: 140,
                    key: 'D Minor',
                    tracks: 7,
                    collaborators: ['Marcus B.'],
                    img: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600'
                  }
                ].map((project) => (
                  <div
                    key={project.id}
                    className="bg-white rounded-2xl border border-[#e6ded5] overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-44 overflow-hidden group">
                        <img src={project.img} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-white">
                          <span className="text-xs font-semibold bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded-md">
                            {project.bpm} BPM • {project.key}
                          </span>
                          <span className="text-xs bg-[#f1dec9] text-[#1a1614] font-bold px-2.5 py-1 rounded-md">
                            {project.tracks} Stems
                          </span>
                        </div>
                      </div>

                      <div className="p-5">
                        <span className="text-xs font-semibold text-[#8a7b70] uppercase tracking-wider">{project.genre}</span>
                        <h3 className="font-extrabold text-base text-[#231f1d] mt-1 line-clamp-1">{project.title}</h3>
                        <p className="text-xs text-[#736a64] mt-2 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-[#a89f97]" />
                          Collaborators: {project.collaborators.join(', ')}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 pt-0 border-t border-[#f0eae1] flex items-center justify-between gap-2 mt-2">
                      <button
                        onClick={() => handleAction('login', '/studio')}
                        className="flex-1 py-2 rounded-xl bg-[#faf8f5] hover:bg-[#f1dec9] text-[#2c2420] font-bold text-xs border border-[#e6ded5] transition flex items-center justify-center gap-1.5"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>Open DAW</span>
                      </button>
                      <button
                        onClick={() => handleAction('login', '/dashboard')}
                        className="p-2 rounded-xl text-[#736a64] hover:text-[#2c2420] hover:bg-black/5 transition"
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6ded5] pb-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#231f1d]">Explore Community & Stems</h1>
                  <p className="text-sm text-[#736a64] mt-1">Discover open collaboration stems, remix competitions, and public sample packs.</p>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1.5 rounded-xl bg-[#f1dec9] text-[#1a1614] font-bold text-xs">Trending</span>
                  <span className="px-3 py-1.5 rounded-xl bg-white border border-[#e6ded5] text-[#736a64] font-medium text-xs">Acapellas</span>
                  <span className="px-3 py-1.5 rounded-xl bg-white border border-[#e6ded5] text-[#736a64] font-medium text-xs">Drum Kits</span>
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
                    key: 'D♭ Major',
                    plays: '1.2k',
                    downloads: 480
                  },
                  {
                    title: 'Analog Roland Juno Arpeggio Loop',
                    artist: 'Kofi Mensah',
                    role: 'Sound Designer • London',
                    duration: '01:15',
                    bpm: 124,
                    key: 'A Minor',
                    plays: '850',
                    downloads: 320
                  },
                  {
                    title: 'Deep House 909 Drum Groove Stem',
                    artist: 'Marcus Bell',
                    role: 'Producer • Amsterdam',
                    duration: '03:10',
                    bpm: 126,
                    key: 'G Minor',
                    plays: '2.4k',
                    downloads: 910
                  },
                  {
                    title: 'Cinematic Cello & Ambient Texture',
                    artist: 'Elena Rostova',
                    role: 'Composer • Prague',
                    duration: '02:05',
                    bpm: 75,
                    key: 'E Minor',
                    plays: '670',
                    downloads: 215
                  }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-[#e6ded5] flex items-center justify-between gap-4 shadow-xs hover:border-[#dcc5b2] transition">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => togglePreviewPlay(`explore_${idx}`)}
                        className="w-12 h-12 rounded-2xl bg-[#2c2420] text-[#f1dec9] flex items-center justify-center shrink-0 hover:scale-105 transition"
                      >
                        {previewPlayingId === `explore_${idx}` ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                      </button>
                      <div>
                        <h4 className="font-bold text-sm text-[#231f1d]">{item.title}</h4>
                        <p className="text-xs text-[#736a64] mt-0.5">{item.artist} ({item.role})</p>
                        <div className="flex items-center gap-2 mt-2 text-[11px] text-[#8a7b70]">
                          <span className="bg-[#faf8f5] px-2 py-0.5 rounded border border-[#e6ded5]">{item.bpm} BPM</span>
                          <span className="bg-[#faf8f5] px-2 py-0.5 rounded border border-[#e6ded5]">{item.key}</span>
                          <span>• {item.duration}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAction('login', '/studio')}
                      className="px-3.5 py-2 rounded-xl bg-[#faf8f5] hover:bg-[#f1dec9] text-[#2c2420] font-bold text-xs border border-[#e6ded5] transition shrink-0 flex items-center gap-1.5"
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6ded5] pb-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#231f1d]">Creator Network</h1>
                  <p className="text-sm text-[#736a64] mt-1">Connect with verified vocalists, producers, and audio engineers for your sessions.</p>
                </div>
                <button
                  onClick={() => handleAction('register', '/collaborators')}
                  className="px-4 py-2 rounded-xl bg-[#dcc5b2] hover:bg-[#cfb59f] text-[#2c2420] font-bold text-xs transition"
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
                    genre: 'Pop / Synthwave / Electronic',
                    daw: 'Logic Pro, Melodyne',
                    online: true,
                    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'
                  },
                  {
                    name: 'Marcus Bell',
                    role: 'Mixing & Mastering Engineer',
                    location: 'London, UK',
                    genre: 'Hip Hop / R&B / Trap',
                    daw: 'Pro Tools Ultimate, FabFilter',
                    online: true,
                    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
                  },
                  {
                    name: 'Elena Rostova',
                    role: 'Pianist & String Arranger',
                    location: 'Vienna, Austria',
                    genre: 'Classical / Indie Folk / Score',
                    daw: 'Cubase 13, Spitfire Audio',
                    online: false,
                    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400'
                  }
                ].map((collab, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl border border-[#e6ded5] shadow-xs flex flex-col justify-between space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img src={collab.avatar} alt={collab.name} className="w-14 h-14 rounded-full object-cover border border-[#e6ded5]" />
                        {collab.online && (
                          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" title="Online now" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-base text-[#231f1d]">{collab.name}</h4>
                        <p className="text-xs text-[#8a7b70] font-medium">{collab.role}</p>
                        <p className="text-[11px] text-[#a89f97]">{collab.location}</p>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-[#736a64] border-t border-[#f0eae1] pt-3">
                      <div><span className="font-semibold text-[#231f1d]">Genres:</span> {collab.genre}</div>
                      <div><span className="font-semibold text-[#231f1d]">Tools:</span> {collab.daw}</div>
                    </div>

                    <button
                      onClick={() => handleAction('login', '/collaborators')}
                      className="w-full py-2.5 rounded-xl bg-[#faf8f5] hover:bg-[#2c2420] text-[#2c2420] hover:text-[#f1dec9] font-bold text-xs border border-[#e6ded5] transition flex items-center justify-center gap-2"
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
              <div className="border-b border-[#e6ded5] pb-4">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#231f1d]">Timestamped Audio Feedback</h1>
                <p className="text-sm text-[#736a64] mt-1">Comment directly at playhead positions without timecode misunderstandings.</p>
              </div>

              <div className="bg-white rounded-3xl border border-[#e6ded5] overflow-hidden shadow-xs">
                {/* Active Session Header */}
                <div className="bg-[#2c2420] px-6 py-4 flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#dcc5b2] text-[#2c2420] flex items-center justify-center font-bold text-xs">
                      MS
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Midnight Synthwave Anthem</h4>
                      <p className="text-[11px] text-[#dcc5b2]">3 collaborators online in studio</p>
                    </div>
                  </div>
                  <span className="text-xs bg-white/10 px-3 py-1 rounded-full text-[#f1dec9]">Active Room</span>
                </div>

                {/* Chat Stream */}
                <div className="p-6 space-y-4 max-h-[380px] overflow-y-auto bg-[#faf8f5]">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                      SC
                    </div>
                    <div className="bg-white p-3.5 rounded-2xl border border-[#e6ded5] max-w-md shadow-xs">
                      <div className="flex items-center justify-between gap-4 mb-1">
                        <span className="font-bold text-xs text-[#231f1d]">Sarah Chen</span>
                        <span className="text-[10px] text-[#a89f97]">10 mins ago</span>
                      </div>
                      <button
                        onClick={() => handleAction('login', '/studio')}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8c6b4f] bg-[#f1dec9]/40 hover:bg-[#f1dec9] px-2 py-0.5 rounded-md mb-1.5 transition"
                      >
                        <Clock className="w-3 h-3" />
                        <span>Jump to 00:14.2</span>
                      </button>
                      <p className="text-xs text-[#524943]">
                        I added double tracking on this verse hook! Check if the stereo spread is too wide for mono playback.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center shrink-0">
                      MB
                    </div>
                    <div className="bg-white p-3.5 rounded-2xl border border-[#e6ded5] max-w-md shadow-xs">
                      <div className="flex items-center justify-between gap-4 mb-1">
                        <span className="font-bold text-xs text-[#231f1d]">Marcus Bell</span>
                        <span className="text-[10px] text-[#a89f97]">4 mins ago</span>
                      </div>
                      <button
                        onClick={() => handleAction('login', '/studio')}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8c6b4f] bg-[#f1dec9]/40 hover:bg-[#f1dec9] px-2 py-0.5 rounded-md mb-1.5 transition"
                      >
                        <Clock className="w-3 h-3" />
                        <span>Jump to 01:28.0</span>
                      </button>
                      <p className="text-xs text-[#524943]">
                        Tamed the high-pass on the snare reverb tail here. Mix feels punchy now.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Composer Prompt */}
                <div className="p-4 bg-white border-t border-[#e6ded5] flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Write a comment or audio timestamp note..."
                    onClick={() => handleAction('login', '/activity')}
                    readOnly
                    className="flex-1 bg-[#faf8f5] border border-[#e6ded5] rounded-xl px-4 py-2.5 text-xs text-[#231f1d] focus:outline-hidden cursor-pointer"
                  />
                  <button
                    onClick={() => handleAction('login', '/activity')}
                    className="px-4 py-2.5 rounded-xl bg-[#2c2420] text-[#f1dec9] font-bold text-xs hover:bg-[#1a1614] transition"
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6ded5] pb-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#231f1d]">My Audio Library</h1>
                  <p className="text-sm text-[#736a64] mt-1">Multi-track stem vault, private sample packs, and cloud sound recordings.</p>
                </div>
                <div className="flex items-center gap-3 text-xs bg-white px-3.5 py-2 rounded-xl border border-[#e6ded5]">
                  <HardDrive className="w-4 h-4 text-[#8a7b70]" />
                  <span>14.2 GB of 50 GB Cloud Storage</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#e6ded5] divide-y divide-[#f0eae1] overflow-hidden shadow-xs">
                {[
                  { name: 'Sarah_Lead_Vocal_Take1_Dry.wav', category: 'Vocals', size: '24.2 MB', duration: '03:14', date: 'Yesterday' },
                  { name: 'Roland_Juno_106_Chords_Wet.wav', category: 'Synths', size: '18.6 MB', duration: '03:14', date: '3 days ago' },
                  { name: 'Analog_909_Drum_Stem_Group.wav', category: 'Drums', size: '32.1 MB', duration: '03:14', date: '5 days ago' },
                  { name: 'Fender_Strat_Clean_Rhythm.wav', category: 'Guitars', size: '15.4 MB', duration: '02:40', date: 'Oct 12' },
                  { name: 'Sub_808_Tuned_F_Minor.wav', category: 'Bass', size: '8.3 MB', duration: '03:14', date: 'Oct 10' }
                ].map((stem, idx) => (
                  <div key={idx} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-[#faf8f5] transition">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <button
                        onClick={() => togglePreviewPlay(`lib_${idx}`)}
                        className="w-10 h-10 rounded-xl bg-[#2c2420] text-[#f1dec9] flex items-center justify-center shrink-0"
                      >
                        {previewPlayingId === `lib_${idx}` ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                      </button>
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-[#231f1d] truncate">{stem.name}</p>
                        <div className="flex items-center gap-3 text-xs text-[#8a7b70] mt-0.5">
                          <span className="font-medium bg-[#f0eae1] px-2 py-0.5 rounded text-[11px] text-[#2c2420]">{stem.category}</span>
                          <span>{stem.size}</span>
                          <span>{stem.duration}</span>
                          <span className="hidden sm:inline">• Added {stem.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAction('login', '/library')}
                        className="p-2 rounded-xl text-[#736a64] hover:text-[#2c2420] hover:bg-black/5 transition"
                        title="Download Stem"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleAction('login', '/studio')}
                        className="px-3.5 py-1.5 rounded-xl bg-[#f1dec9] text-[#1a1614] font-bold text-xs hover:bg-[#e4ceb7] transition"
                      >
                        Load in DAW
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== 7. ANALYTICS TAB ==================== */}
          {activeTab === 'Analytics' && (
            <div className="p-6 sm:p-10 max-w-6xl mx-auto w-full space-y-8 animate-in fade-in duration-200">
              <div className="border-b border-[#e6ded5] pb-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#231f1d]">Studio Analytics & Royalties</h1>
                <p className="text-sm text-[#736a64] mt-1">Real-time performance metrics, stem remix counts, and automated split sheet payouts.</p>
              </div>

              {/* KPI Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-white p-5 rounded-2xl border border-[#e6ded5] shadow-xs">
                  <span className="text-xs font-semibold text-[#8a7b70]">Total Streams</span>
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#231f1d] mt-1">248,510</p>
                  <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-block">↑ +18.4% this month</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-[#e6ded5] shadow-xs">
                  <span className="text-xs font-semibold text-[#8a7b70]">Active Collaborations</span>
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#231f1d] mt-1">14</p>
                  <span className="text-[11px] text-[#736a64] font-medium mt-1 inline-block">Across 6 projects</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-[#e6ded5] shadow-xs">
                  <span className="text-xs font-semibold text-[#8a7b70]">Stems Downloaded</span>
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#231f1d] mt-1">1,842</p>
                  <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-block">↑ +24% new remixes</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-[#e6ded5] shadow-xs">
                  <span className="text-xs font-semibold text-[#8a7b70]">Master Royalties</span>
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#231f1d] mt-1">$4,820.50</p>
                  <span className="text-[11px] text-[#2c2420] font-bold mt-1 inline-block">100% Split Verified</span>
                </div>
              </div>

              {/* Royalty Split Contract Breakdown Card */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e6ded5] shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f0eae1] pb-4">
                  <div>
                    <h3 className="font-extrabold text-base text-[#231f1d]">Verified Split Sheet: Midnight Synthwave Anthem</h3>
                    <p className="text-xs text-[#736a64]">All 3 collaborators signed and approved legal distribution.</p>
                  </div>
                  <button
                    onClick={() => handleAction('login', '/analytics')}
                    className="px-3.5 py-1.5 rounded-xl bg-[#faf8f5] hover:bg-[#f1dec9] border border-[#e6ded5] text-xs font-bold text-[#2c2420] transition"
                  >
                    Download Agreement (PDF)
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-[#231f1d] mb-1">
                      <span>Alex Mercer (Producer & Mixing)</span>
                      <span>40.0%</span>
                    </div>
                    <div className="w-full bg-[#f0eae1] h-3 rounded-full overflow-hidden">
                      <div className="bg-[#2c2420] h-full rounded-full" style={{ width: '40%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-[#231f1d] mb-1">
                      <span>Sarah Chen (Lead Vocalist & Topline)</span>
                      <span>35.0%</span>
                    </div>
                    <div className="w-full bg-[#f0eae1] h-3 rounded-full overflow-hidden">
                      <div className="bg-[#dcc5b2] h-full rounded-full" style={{ width: '35%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-[#231f1d] mb-1">
                      <span>Marcus Bell (Sound Engineering & Beats)</span>
                      <span>25.0%</span>
                    </div>
                    <div className="w-full bg-[#f0eae1] h-3 rounded-full overflow-hidden">
                      <div className="bg-[#8a7b70] h-full rounded-full" style={{ width: '25%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== 8. PROFILE TAB ==================== */}
          {activeTab === 'Profile' && (
            <div className="p-6 sm:p-10 max-w-5xl mx-auto w-full space-y-8 animate-in fade-in duration-200">
              <div className="border-b border-[#e6ded5] pb-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#231f1d]">Creator Profile</h1>
                <p className="text-sm text-[#736a64] mt-1">Your public producer card, musical credentials, and collaborative credits.</p>
              </div>

              <div className="bg-white rounded-3xl border border-[#e6ded5] p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                  <div className="w-24 h-24 rounded-full bg-[#2c2420] text-[#f1dec9] flex items-center justify-center font-extrabold text-3xl shrink-0 shadow-md">
                    AM
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <h2 className="text-2xl font-extrabold text-[#231f1d]">Alex Mercer</h2>
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 self-center sm:self-auto">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified Producer
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#736a64]">Electronic Music Producer & Sound Designer • Los Angeles, CA</p>
                    <p className="text-xs text-[#524943] leading-relaxed max-w-xl">
                      Creating nostalgic analog synth anthems and modern vocal arrangements. Over 8 years of studio production experience working in Ableton Live and hardware synthesizers.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#f0eae1] pt-6">
                  <div className="bg-[#faf8f5] p-4 rounded-2xl border border-[#e6ded5]">
                    <span className="text-xs text-[#8a7b70] font-semibold">Primary DAW</span>
                    <p className="font-bold text-sm text-[#231f1d] mt-0.5">Ableton Live 12 Suite</p>
                  </div>
                  <div className="bg-[#faf8f5] p-4 rounded-2xl border border-[#e6ded5]">
                    <span className="text-xs text-[#8a7b70] font-semibold">Audio Hardware</span>
                    <p className="font-bold text-sm text-[#231f1d] mt-0.5">Universal Audio Apollo x4</p>
                  </div>
                  <div className="bg-[#faf8f5] p-4 rounded-2xl border border-[#e6ded5]">
                    <span className="text-xs text-[#8a7b70] font-semibold">Session Status</span>
                    <p className="font-bold text-sm text-emerald-700 mt-0.5">Open to Collaborations</p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => handleAction('login', '/profile')}
                    className="px-5 py-2.5 rounded-xl bg-[#2c2420] hover:bg-[#1a1614] text-[#f1dec9] font-bold text-xs shadow-sm transition"
                  >
                    Edit Profile Details
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==================== 9. SETTINGS TAB ==================== */}
          {activeTab === 'Settings' && (
            <div className="p-6 sm:p-10 max-w-5xl mx-auto w-full space-y-8 animate-in fade-in duration-200">
              <div className="border-b border-[#e6ded5] pb-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#231f1d]">Studio Settings & Hardware</h1>
                <p className="text-sm text-[#736a64] mt-1">Configure Web Audio API buffers, audio interfaces, and session collaboration notifications.</p>
              </div>

              <div className="bg-white rounded-3xl border border-[#e6ded5] p-6 sm:p-8 shadow-xs space-y-6">
                <div className="space-y-4">
                  <h3 className="font-extrabold text-base text-[#231f1d]">Audio Engine Configuration</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-[#faf8f5] p-4 rounded-2xl border border-[#e6ded5] space-y-1">
                      <label className="text-xs font-bold text-[#231f1d]">Sample Rate</label>
                      <p className="text-xs text-[#736a64]">Studio standard 48,000 Hz (24-bit PCM)</p>
                      <div className="text-xs font-bold text-[#8c6b4f] pt-1">Active: 48 kHz</div>
                    </div>

                    <div className="bg-[#faf8f5] p-4 rounded-2xl border border-[#e6ded5] space-y-1">
                      <label className="text-xs font-bold text-[#231f1d]">Buffer Size</label>
                      <p className="text-xs text-[#736a64]">Low latency monitoring (128 samples / 4.2ms)</p>
                      <div className="text-xs font-bold text-[#8c6b4f] pt-1">Active: 128 samples</div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#f0eae1] pt-6 space-y-4">
                  <h3 className="font-extrabold text-base text-[#231f1d]">Collaboration & Privacy</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3.5 bg-[#faf8f5] rounded-2xl border border-[#e6ded5]">
                      <div>
                        <p className="text-xs font-bold text-[#231f1d]">Real-Time Playhead Sync</p>
                        <p className="text-[11px] text-[#736a64]">Broadcast your playback cursor position to active room collaborators</p>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">Enabled</span>
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-[#faf8f5] rounded-2xl border border-[#e6ded5]">
                      <div>
                        <p className="text-xs font-bold text-[#231f1d]">Automatic Version Snapshotting</p>
                        <p className="text-[11px] text-[#736a64]">Save audio timeline state whenever tracks are added or deleted</p>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">Every 5 mins</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => handleAction('login', '/settings')}
                    className="px-5 py-2.5 rounded-xl bg-[#2c2420] hover:bg-[#1a1614] text-[#f1dec9] font-bold text-xs shadow-sm transition"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
          )}
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

      {/* Interactive Auth Modal for any protected action without login */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}
