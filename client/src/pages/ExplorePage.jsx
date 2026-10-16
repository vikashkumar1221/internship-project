import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { Play, Heart, Headphones, Filter, ChevronDown } from 'lucide-react';

export default function ExplorePage() {
  const [filter, setFilter] = useState('All');

  const tracks = [
    {
      id: 'city-lights',
      title: 'City Lights',
      artist: 'Nisha',
      handle: '@Nisha',
      plays: '980',
      likes: '156',
      genre: 'Pop / Vocal',
      cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
      artistAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
    },
    {
      id: 'shadow',
      title: 'Shadow',
      artist: 'Arjun',
      handle: '@Arjun',
      plays: '1.2k',
      likes: '85',
      genre: 'Acoustic',
      cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
      artistAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
    },
    {
      id: 'rainy-day',
      title: 'Rainy Day',
      artist: 'Kabir',
      handle: '@Kabir',
      plays: '640',
      likes: '19',
      genre: 'Lo-Fi',
      cover: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&auto=format&fit=crop&q=80',
      artistAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100'
    },
    {
      id: 'broken-chords',
      title: 'Broken Chords',
      artist: 'Tanya',
      handle: '@Tanya',
      plays: '1.8k',
      likes: '64',
      genre: 'Indie Rock',
      cover: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop&q=80',
      artistAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
    },
    {
      id: 'sunset-jam',
      title: 'Sunset Jam',
      artist: 'Rohit',
      handle: '@Rohit',
      plays: '720',
      likes: '21',
      genre: 'Electronic',
      cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
      artistAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100'
    },
    {
      id: 'late-night',
      title: 'Late Night',
      artist: 'Aakash',
      handle: '@Aakash',
      plays: '900',
      likes: '37',
      genre: 'R&B / Soul',
      cover: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&auto=format&fit=crop&q=80',
      artistAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100'
    }
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col justify-between selection:bg-[#dcc5b2] selection:text-[#2c2420]">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-6 py-8 w-full space-y-6">
        {/* Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#231f1d] tracking-tight">Explore</h1>
            <p className="text-xs text-[#736a64] mt-0.5">
              Discover tracks, stems, and collaborators across the community.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#8c827a]">Sort:</span>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#e6ded5] rounded-lg font-medium text-[#231f1d] shadow-subtle hover:bg-[#f5f0ea] transition">
              <span>Latest</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#8c827a]" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['All', 'Tracks', 'Artists', 'Genres'].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                filter === t
                  ? 'bg-[#2c2420] text-white shadow-xs'
                  : 'bg-white border border-[#e6ded5] text-[#736a64] hover:text-[#231f1d] hover:bg-[#f5f0ea]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Track Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tracks.map((t) => (
            <Link
              key={t.id}
              to={`/project/${t.id}`}
              className="bg-white border border-[#e6ded5] hover:border-[#cfb59f] rounded-xl overflow-hidden shadow-subtle hover:shadow-card transition group flex flex-col justify-between"
            >
              <div>
                {/* Cover with Play overlay */}
                <div className="relative aspect-[16/10] bg-[#f5f0ea] overflow-hidden">
                  <img
                    src={t.cover}
                    alt={t.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                  
                  {/* Play Button */}
                  <div className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-[#dcc5b2] text-[#2c2420] flex items-center justify-center shadow-md opacity-90 group-hover:opacity-100 group-hover:scale-110 transition">
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </div>

                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-[#2c2420]/80 text-white text-[10px] font-semibold">
                    {t.genre}
                  </span>
                </div>

                {/* Details */}
                <div className="p-3.5">
                  <h3 className="font-bold text-sm text-[#231f1d] group-hover:text-[#2c2420] truncate">
                    {t.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <img
                      src={t.artistAvatar}
                      alt={t.artist}
                      className="w-4 h-4 rounded-full object-cover"
                    />
                    <span className="text-xs text-[#736a64] font-medium">{t.artist}</span>
                  </div>
                </div>
              </div>

              {/* Stats Footer */}
              <div className="px-3.5 py-2.5 border-t border-[#e6ded5]/70 flex items-center justify-between text-[11px] text-[#8c827a] font-mono">
                <span className="flex items-center gap-1">
                  <Headphones className="w-3 h-3 text-[#a89f97]" /> {t.plays}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-3 h-3 text-[#a89f97]" /> {t.likes}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer className="border-t border-[#e6ded5] bg-[#f5f0ea] py-4 px-6 text-xs text-[#736a64] text-center">
        © 2026 StudioCollab Community.
      </footer>
    </div>
  );
}
