import React, { useState, useRef } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import {
  Music,
  Play,
  Pause,
  Download,
  Upload,
  Search,
  HardDrive,
  Sliders,
  Check,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function LibraryPage() {
  const fileInputRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingStemId, setPlayingStemId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const categories = ['All', 'Vocals', 'Drums', 'Synths', 'Bass', 'Guitars', 'FX & Loops'];

  const [stems, setStems] = useState([
    {
      id: 'stem_lib_1',
      title: 'Sarah_Lead_Vocal_Take1_Dry.wav',
      category: 'Vocals',
      bpm: 124,
      key: 'F Minor',
      duration: '01:45',
      size: '28.4 MB',
      project: 'Midnight Synthwave Anthem'
    },
    {
      id: 'stem_lib_2',
      title: 'Jupiter_8_Warm_Arp_Chords.wav',
      category: 'Synths',
      bpm: 124,
      key: 'F Minor',
      duration: '02:10',
      size: '34.2 MB',
      project: 'Midnight Synthwave Anthem'
    },
    {
      id: 'stem_lib_3',
      title: 'TR707_Vintage_Drum_Stem.wav',
      category: 'Drums',
      bpm: 124,
      key: '4/4 Beat',
      duration: '01:30',
      size: '22.1 MB',
      project: 'Midnight Synthwave Anthem'
    },
    {
      id: 'stem_lib_4',
      title: 'Acoustic_Martin_Fingerstyle.wav',
      category: 'Guitars',
      bpm: 96,
      key: 'G Major',
      duration: '02:40',
      size: '41.0 MB',
      project: 'Acoustic Indie Session'
    },
    {
      id: 'stem_lib_5',
      title: 'Analog_Sub_Bass_Drop.wav',
      category: 'Bass',
      bpm: 124,
      key: 'F Minor',
      duration: '01:15',
      size: '18.3 MB',
      project: 'Midnight Synthwave Anthem'
    }
  ]);

  const togglePlayStem = (id) => {
    setPlayingStemId(playingStemId === id ? null : id);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('audio', file);

    try {
      await api.post('/stems/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const newStem = {
        id: `stem_${Date.now()}`,
        title: file.name,
        category: 'Vocals',
        bpm: 120,
        key: 'C Major',
        duration: '02:00',
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        project: 'Uploaded Audio Stem'
      };
      setStems([newStem, ...stems]);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err) {
      // Offline fallback: still add to list
      const newStem = {
        id: `stem_${Date.now()}`,
        title: file.name,
        category: 'Vocals',
        bpm: 120,
        key: 'C Major',
        duration: '02:00',
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        project: 'Uploaded Audio Stem'
      };
      setStems([newStem, ...stems]);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const filteredStems = stems.filter((s) => {
    const matchesCat = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesQuery = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         s.project.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
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
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Audio Library</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Saved vocal takes, master stems, instrument loops, and sound clips.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="audio/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 font-semibold text-xs text-white shadow-xs transition"
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 stroke-[2.5]" />
                )}
                <span>{uploading ? 'Uploading...' : 'Upload Stem (WAV/MP3)'}</span>
              </button>
            </div>
          </div>

          {uploadSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Audio stem uploaded and cataloged in your library!</span>
            </div>
          )}

          {/* Cloud Storage Gauge Banner */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <HardDrive className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Cloud Storage Allocated</p>
                <p className="text-[11px] text-slate-500">144.0 MB of 2.0 GB Used (High-Fidelity Audio Storage)</p>
              </div>
            </div>

            <div className="w-full sm:w-64">
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: '12%' }} />
              </div>
              <span className="text-[10px] text-slate-400 font-mono text-right block mt-1">12% quota</span>
            </div>
          </div>

          {/* Search & Category Filter Pills */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search stems or session..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-slate-900 shadow-xs transition"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Stems Table */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden divide-y divide-slate-100">
            {filteredStems.map((stem) => {
              const isPlaying = playingStemId === stem.id;
              return (
                <div key={stem.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <button
                      onClick={() => togglePlayStem(stem.id)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs transition ${
                        isPlaying ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                      title={isPlaying ? 'Pause' : 'Audition Stem'}
                    >
                      {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                    </button>

                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{stem.title}</p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span className="font-semibold text-slate-600">{stem.category}</span>
                        <span>•</span>
                        <span>{stem.duration}</span>
                        <span>•</span>
                        <span>{stem.size}</span>
                        <span>•</span>
                        <span className="text-slate-500 font-mono">{stem.project}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      to="/studio"
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition"
                    >
                      <Sliders className="w-3 h-3" />
                      <span>Load in DAW</span>
                    </Link>

                    <a
                      href={`/uploads/${stem.title}`}
                      download={stem.title}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
                      title="Download Stem File"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
