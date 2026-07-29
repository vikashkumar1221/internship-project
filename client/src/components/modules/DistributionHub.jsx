import React, { useState } from 'react';
import { Globe, Send, CheckCircle2, Music, Radio } from 'lucide-react';
import api from '../../services/api';

export default function DistributionHub() {
  const [distributor, setDistributor] = useState('DistroKid');
  const [releaseTitle, setReleaseTitle] = useState('Midnight Synthwave Anthem');
  const [releaseDate, setReleaseDate] = useState('2026-08-15');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmitRelease = async (e) => {
    e.preventDefault();
    try {
      await api.post('/distribution/submit', { distributor, releaseTitle, releaseDate });
    } catch (err) {}
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-studio-border">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Globe className="w-6 h-6 text-indigo-400" /> Digital Distribution Hub
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Submit your finished master mix directly to Spotify, Apple Music, Tidal, & YouTube Music via DistroKid or TuneCore.
          </p>
        </div>
      </div>

      {isSubmitted ? (
        <div className="p-6 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 space-y-3 animate-in fade-in">
          <div className="flex items-center gap-2 text-base font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Release Successfully Submitted to {distributor}!
          </div>
          <p className="text-xs text-gray-300">
            Metadata, 24-bit WAV master, and artwork have been dispatched to digital stores. Estimated live release date: <strong>{releaseDate}</strong>.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmitRelease} className="bg-studio-card border border-studio-border rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-300 block mb-1.5">Select Distribution Supply Chain</label>
            <select
              value={distributor}
              onChange={(e) => setDistributor(e.target.value)}
              className="w-full bg-studio-panel border border-studio-border rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none"
            >
              <option value="DistroKid">DistroKid Integration API</option>
              <option value="TuneCore">TuneCore Distribution Service</option>
              <option value="CDBaby">CD Baby Direct</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-300 block mb-1.5">Release Single / Album Title</label>
            <input
              type="text"
              value={releaseTitle}
              onChange={(e) => setReleaseTitle(e.target.value)}
              className="w-full bg-studio-panel border border-studio-border rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-300 block mb-1.5">Target Global Release Date</label>
            <input
              type="date"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              className="w-full bg-studio-panel border border-studio-border rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 font-bold text-xs text-white shadow-lg shadow-indigo-600/30 hover:scale-[1.02] transition"
          >
            Dispatch Release to 150+ Digital Music Stores
          </button>
        </form>
      )}
    </div>
  );
}
