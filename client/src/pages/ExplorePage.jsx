import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { Play, Pause, Heart, Headphones, Search, Sliders, Download, Sparkles } from 'lucide-react';

export default function ExplorePage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingId, setPlayingId] = useState(null);

  const tracks = [
    {
      id: 'city-lights',
      title: 'City Lights (Vocal Stem + Synth)',
      artist: 'Nisha Sharma',
      role: 'Vocalist',
      plays: '1,420',
      likes: 184,
      bpm: 124,
      key: 'F Minor',
      genre: 'Pop / Vocal',
      cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
      artistAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
    },
    {
      id: 'shadow-acoustic',
      title: 'Shadows & Echoes (Fingerstyle Guitar)',
      artist: 'Arjun Verma',
      role: 'Acoustic Guitarist',
      plays: '1,890',
      likes: 215,
      bpm: 96,
      key: 'G Major',
      genre: 'Acoustic',
      cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
      artistAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
    },
    {
      id: 'rainy-day-lofi',
      title: 'Rainy Rhodes & Vinyl Tape Beats',
      artist: 'Kabir Sound',
      role: 'Beatmaker',
      plays: '940',
      likes: 132,
      bpm: 84,
      key: 'C Minor',
      genre: 'Lo-Fi',
      cover: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&auto=format&fit=crop&q=80',
      artistAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100'
    },
    {
      id: 'broken-chords-rock',
      title: 'Distorted Indie Crunch Guitar Stems',
      artist: 'Tanya Roy',
      role: 'Electric Guitar',
      plays: '2,100',
      likes: 260,
      bpm: 138,
      key: 'D Minor',
      genre: 'Indie Rock',
      cover: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop&q=80',
      artistAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
    },
    {
      id: 'sunset-jam-synth',
      title: 'Analog Roland Juno Arp & Bassline',
      artist: 'Rohit K.',
      role: 'Sound Designer',
      plays: '1,120',
      likes: 98,
      bpm: 126,
      key: 'A Minor',
      genre: 'Electronic',
      cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
      artistAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100'
    },
    {
      id: 'late-night-rnb',
      title: 'Velvet Neo-Soul Chords & Vocal Hook',
      artist: 'Aakash Mehta',
      role: 'Producer & Vocalist',
      plays: '1,650',
      likes: 174,
      bpm: 90,
      key: 'E♭ Major',
      genre: 'R&B / Soul',
      cover: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&auto=format&fit=crop&q=80',
      artistAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100'
    }
  ];

  const togglePlay = (id) => {
    setPlayingId(playingId === id ? null : id);
  };

  const filteredTracks = tracks.filter((t) => {
    const matchesFilter = filter === 'All' || t.genre.toLowerCase().includes(filter.toLowerCase());
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.genre.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-amber-100 selection:text-amber-900">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Explore Sounds & Stems</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Discover royalty-free vocal stems, instrument loops, and community collaborations.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search tracks, artists, genres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-slate-900 shadow-xs transition"
              />
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['All', 'Pop', 'Acoustic', 'Lo-Fi', 'Rock', 'Electronic', 'R&B'].map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  filter === t
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Track Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTracks.map((t) => (
              <div
                key={t.id}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between group"
              >
                <div>
                  {/* Cover with Play overlay */}
                  <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                    <img
                      src={t.cover}
                      alt={t.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                    {/* Play/Pause Button */}
                    <button
                      onClick={() => togglePlay(t.id)}
                      className="absolute bottom-2.5 right-2.5 w-9 h-9 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-md hover:scale-105 transition"
                      title={playingId === t.id ? 'Pause Preview' : 'Play Preview'}
                    >
                      {playingId === t.id ? (
                        <Pause className="w-4 h-4 fill-current text-amber-600" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5 text-slate-900" />
                      )}
                    </button>

                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-semibold">
                        {t.genre}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-slate-800 text-[10px] font-mono font-bold">
                        {t.bpm} BPM
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-4">
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-amber-800 transition line-clamp-1">
                      {t.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <img
                        src={t.artistAvatar}
                        alt={t.artist}
                        className="w-5 h-5 rounded-full object-cover border border-slate-200"
                      />
                      <span className="text-xs text-slate-600 font-medium">{t.artist}</span>
                      <span className="text-[10px] text-slate-400">• {t.role}</span>
                    </div>
                  </div>
                </div>

                {/* Actions & Stats Footer */}
                <div className="p-4 pt-0">
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
                      <span className="flex items-center gap-1">
                        <Headphones className="w-3 h-3 text-slate-400" /> {t.plays}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> {t.likes}
                      </span>
                    </div>

                    <button
                      onClick={() => navigate('/studio')}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition"
                    >
                      <Sliders className="w-3 h-3" />
                      <span>Remix in DAW</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
