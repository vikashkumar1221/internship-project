import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import {
  Library,
  Music,
  Play,
  Pause,
  Download,
  Upload,
  Search,
  HardDrive,
  Sliders,
  Filter,
  FolderOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LibraryPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingStemId, setPlayingStemId] = useState(null);

  const categories = ['All', 'Vocals', 'Drums', 'Synths', 'Bass', 'Guitars', 'FX & Loops'];

  const libraryStems = [
    {
      id: 'stem_lib_1',
      title: 'Sarah_Lead_Vocal_Take1_Dry.wav',
      category: 'Vocals',
      bpm: 124,
      key: 'F Minor',
      duration: '01:45',
      size: '28.4 MB',
      project: 'Midnight Synthwave Anthem',
      peaks: [0.3, 0.6, 0.8, 0.9, 0.7, 0.4, 0.5, 0.8, 0.95, 0.6, 0.3, 0.7, 0.85, 0.4]
    },
    {
      id: 'stem_lib_2',
      title: 'Jupiter_8_Warm_Arp_Chords.wav',
      category: 'Synths',
      bpm: 124,
      key: 'F Minor',
      duration: '02:10',
      size: '34.2 MB',
      project: 'Midnight Synthwave Anthem',
      peaks: [0.5, 0.7, 0.6, 0.8, 0.75, 0.9, 0.65, 0.7, 0.8, 0.85, 0.7, 0.6, 0.75, 0.5]
    },
    {
      id: 'stem_lib_3',
      title: 'TR707_Vintage_Drum_Stem.wav',
      category: 'Drums',
      bpm: 124,
      key: '4/4 Beat',
      duration: '01:30',
      size: '22.1 MB',
      project: 'Midnight Synthwave Anthem',
      peaks: [0.9, 0.2, 0.85, 0.3, 0.95, 0.25, 0.9, 0.2, 0.85, 0.3, 0.95, 0.2, 0.9, 0.25]
    },
    {
      id: 'stem_lib_4',
      title: 'Analog_Moog_Sub_Bassline.wav',
      category: 'Bass',
      bpm: 128,
      key: 'A Minor',
      duration: '02:45',
      size: '42.8 MB',
      project: 'Cyberpunk Neon Underground',
      peaks: [0.7, 0.8, 0.85, 0.9, 0.75, 0.8, 0.85, 0.9, 0.8, 0.75, 0.85, 0.9, 0.8, 0.7]
    },
    {
      id: 'stem_lib_5',
      title: 'Acoustic_Guitar_Fingerpicked_Chords.wav',
      category: 'Guitars',
      bpm: 96,
      key: 'G Major',
      duration: '03:15',
      size: '51.6 MB',
      project: 'Acoustic Indie Session',
      peaks: [0.4, 0.6, 0.55, 0.7, 0.65, 0.5, 0.6, 0.75, 0.7, 0.6, 0.65, 0.55, 0.6, 0.45]
    },
    {
      id: 'stem_lib_6',
      title: 'Cyber_Sweep_Riser_Downlifter.wav',
      category: 'FX & Loops',
      bpm: 128,
      key: 'FX',
      duration: '00:45',
      size: '12.0 MB',
      project: 'Cyberpunk Neon Underground',
      peaks: [0.1, 0.2, 0.3, 0.45, 0.6, 0.75, 0.9, 0.95, 0.7, 0.5, 0.3, 0.2, 0.1, 0.05]
    }
  ];

  const filteredStems = libraryStems.filter((stem) => {
    const matchesCategory = selectedCategory === 'All' || stem.category === selectedCategory;
    const matchesSearch = stem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          stem.project.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const togglePlayback = (id) => {
    setPlayingStemId(playingStemId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col justify-between selection:bg-[#dcc5b2] selection:text-[#2c2420]">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#e6ded5]">
            <div>
              <h1 className="text-2xl font-extrabold text-[#231f1d] tracking-tight">My Audio Library</h1>
              <p className="text-xs text-[#736a64] mt-0.5">
                Saved vocal takes, master stems, instrument loops, and sound clips.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/studio"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2c2420] hover:bg-[#3d332e] font-semibold text-xs text-white shadow-xs transition"
              >
                <Sliders className="w-4 h-4" />
                <span>Open in Studio</span>
              </Link>
            </div>
          </div>

          {/* Cloud Storage Bar */}
          <div className="bg-white border border-[#e6ded5] rounded-2xl p-4 shadow-subtle flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#faf8f5] border border-[#e6ded5] flex items-center justify-center text-[#2c2420]">
                <HardDrive className="w-5 h-5 text-[#8c827a]" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#231f1d] block">Cloud Audio Storage</span>
                <span className="text-[11px] text-[#736a64]">2.4 GB of 10.0 GB High-Bitrate WAV Storage Used</span>
              </div>
            </div>

            <div className="w-full sm:w-64 space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono font-semibold text-[#231f1d]">
                <span>24% Allocated</span>
                <span>7.6 GB Free</span>
              </div>
              <div className="w-full h-2 bg-[#faf8f5] rounded-full overflow-hidden border border-[#e6ded5]">
                <div className="w-1/4 h-full bg-[#2c2420] rounded-full" />
              </div>
            </div>
          </div>

          {/* Search & Category Pills */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                      selectedCategory === cat
                        ? 'bg-[#2c2420] text-white shadow-xs'
                        : 'bg-white border border-[#e6ded5] text-[#736a64] hover:text-[#231f1d] hover:bg-[#faf8f5]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-[#8c827a] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search audio stems..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-[#e6ded5] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#231f1d] placeholder-[#a89f97] focus:outline-none focus:border-[#2c2420] shadow-xs transition"
                />
              </div>
            </div>
          </div>

          {/* Stems Table */}
          <div className="bg-white border border-[#e6ded5] rounded-2xl shadow-subtle overflow-hidden">
            <div className="p-4 border-b border-[#e6ded5] flex justify-between items-center bg-[#faf8f5]">
              <span className="text-xs font-bold text-[#231f1d]">Files ({filteredStems.length})</span>
              <span className="text-xs text-[#736a64]">24-bit 48kHz Broadcast WAV</span>
            </div>

            <div className="divide-y divide-[#e6ded5]">
              {filteredStems.map((stem) => (
                <div
                  key={stem.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#faf8f5] transition"
                >
                  <div className="flex items-center gap-3.5">
                    <button
                      onClick={() => togglePlayback(stem.id)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition shadow-xs ${
                        playingStemId === stem.id
                          ? 'bg-[#2c2420] text-[#dcc5b2]'
                          : 'bg-[#faf8f5] border border-[#e6ded5] text-[#2c2420] hover:bg-[#f5f0ea]'
                      }`}
                    >
                      {playingStemId === stem.id ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#231f1d]">{stem.title}</span>
                        <span className="px-2 py-0.5 rounded-md bg-[#faf8f5] border border-[#e6ded5] text-[10px] font-semibold text-[#736a64]">
                          {stem.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#736a64] mt-0.5">
                        Session: <span className="font-semibold text-[#2c2420]">{stem.project}</span>
                      </p>
                    </div>
                  </div>

                  {/* Waveform Peak Preview */}
                  <div className="hidden lg:flex items-center gap-1 h-6 px-3">
                    {stem.peaks.map((p, i) => (
                      <div
                        key={i}
                        className="w-1 rounded-full transition-all"
                        style={{
                          height: `${Math.max(4, p * 24)}px`,
                          backgroundColor: playingStemId === stem.id ? '#2c2420' : '#d4c9bd'
                        }}
                      />
                    ))}
                  </div>

                  {/* Metadata & Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 text-xs font-mono text-[#736a64]">
                    <span>{stem.bpm} BPM</span>
                    <span>{stem.key}</span>
                    <span>{stem.duration}</span>
                    <span className="text-[#a89f97]">{stem.size}</span>

                    <Link
                      to="/studio"
                      className="px-3 py-1.5 rounded-lg bg-[#2c2420] text-white font-semibold text-[11px] hover:bg-[#3d332e] transition"
                    >
                      Load in DAW
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
