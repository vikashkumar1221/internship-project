import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { useAuth } from '../context/AuthContext';
import { Play, Settings, Headphones, Heart, FolderKanban } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Projects');

  const userTracks = [
    {
      id: 'p1',
      title: 'Midnight Jam',
      genre: 'Electronic / Synth',
      updated: '2 hours ago',
      tracksCount: 3,
      plays: 492,
      cover: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400'
    },
    {
      id: 'p2',
      title: 'Acoustic Session',
      genre: 'Indie Folk',
      updated: 'Yesterday',
      tracksCount: 4,
      plays: 388,
      cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400'
    },
    {
      id: 'p3',
      title: 'College Band Rehearsal',
      genre: 'Rock / Alternative',
      updated: '3 days ago',
      tracksCount: 5,
      plays: 210,
      cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400'
    }
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col justify-between selection:bg-[#dcc5b2] selection:text-[#2c2420]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-8 w-full space-y-6">
        {/* Profile Card */}
        <div className="bg-white border border-[#e6ded5] rounded-2xl p-6 sm:p-8 shadow-subtle flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name || 'User'}
                className="w-20 h-20 rounded-full object-cover border-2 border-[#2c2420] shadow-sm"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[#dcc5b2] text-[#2c2420] border-2 border-[#2c2420] flex items-center justify-center font-extrabold text-3xl shadow-sm">
                {(user?.name || 'V').charAt(0).toUpperCase()}
              </div>
            )}

            <div>
              <h1 className="text-2xl font-extrabold text-[#231f1d]">{user?.name || 'Session Producer'}</h1>
              <p className="text-xs text-[#736a64] font-mono">{user?.email || '@creator'}</p>
              <div className="inline-block mt-1 px-2.5 py-0.5 rounded-md bg-[#2c2420] text-[#dcc5b2] text-[10px] font-bold uppercase tracking-wider">
                {user?.role || 'Producer'} • {user?.subscriptionTier || 'Pro Studio'}
              </div>
              <p className="text-xs text-[#8c827a] mt-2 max-w-md">
                {user?.bio || 'Music creator, multi-track audio producer & sound designer collaborating on DAW projects.'}
              </p>

              {/* Stats row */}
              <div className="flex items-center justify-center sm:justify-start gap-6 mt-4 text-xs">
                <div>
                  <span className="font-bold text-[#231f1d]">12</span>{' '}
                  <span className="text-[#8c827a]">Projects</span>
                </div>
                <div>
                  <span className="font-bold text-[#231f1d]">24</span>{' '}
                  <span className="text-[#8c827a]">Followers</span>
                </div>
                <div>
                  <span className="font-bold text-[#231f1d]">18</span>{' '}
                  <span className="text-[#8c827a]">Following</span>
                </div>
              </div>
            </div>
          </div>

          <Link
            to="/settings"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#e6ded5] bg-[#faf8f5] hover:bg-white text-xs font-semibold text-[#231f1d] shadow-subtle transition shrink-0"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </Link>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center gap-6 border-b border-[#e6ded5] text-xs font-semibold px-2">
          {['Projects', 'Likes', 'Following'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 transition relative ${
                activeTab === tab
                  ? 'text-[#2c2420] font-bold border-b-2 border-[#2c2420] -mb-px'
                  : 'text-[#8c827a] hover:text-[#231f1d]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tracks List */}
        <div className="bg-white border border-[#e6ded5] rounded-2xl shadow-subtle divide-y divide-[#e6ded5] overflow-hidden">
          {userTracks.map((t) => (
            <div key={t.id} className="p-4 flex items-center justify-between hover:bg-[#faf8f5] transition">
              <div className="flex items-center gap-3.5">
                <img
                  src={t.cover}
                  alt={t.title}
                  className="w-12 h-12 rounded-lg object-cover border border-[#e6ded5]"
                />
                <div>
                  <h3 className="font-bold text-sm text-[#231f1d]">{t.title}</h3>
                  <p className="text-[11px] text-[#8c827a] mt-0.5">
                    {t.genre} • {t.tracksCount} stems • Updated {t.updated}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="hidden sm:flex items-center gap-1 text-xs font-mono text-[#8c827a]">
                  <Headphones className="w-3.5 h-3.5" /> {t.plays}
                </span>

                <Link
                  to="/studio"
                  className="px-3.5 py-1.5 rounded-lg bg-[#2c2420] hover:bg-[#3d332e] text-white text-xs font-semibold flex items-center gap-1 transition"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Open Studio</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-[#e6ded5] bg-[#f5f0ea] py-4 px-6 text-xs text-[#736a64] text-center">
        © 2026 StudioCollab Profile.
      </footer>
    </div>
  );
}
