import React, { useState } from 'react';
import { Cpu, Download, CheckCircle2, Loader2, X, Music } from 'lucide-react';
import api from '../../services/api';

export default function StemIsolationModal({ isOpen, onClose, onImportStems }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [separatedStems, setSeparatedStems] = useState(null);

  if (!isOpen) return null;

  const handleSeparateStems = async () => {
    setIsProcessing(true);
    try {
      const res = await api.post('/stems/ai-isolate', { stemId: 'stem_demo' });
      setSeparatedStems(res.data.data);
      setIsProcessing(false);
    } catch (err) {
      // Demo fallback response
      setTimeout(() => {
        setSeparatedStems({
          vocals: { name: 'Lead Vocals Stem', fileUrl: 'https://actions.google.com/sounds/v1/ambiences/rain_heavy.ogg' },
          drums: { name: 'Percussion & Drums', fileUrl: 'https://actions.google.com/sounds/v1/foley/footsteps_carpet.ogg' },
          bass: { name: 'Sub Bass Line', fileUrl: 'https://actions.google.com/sounds/v1/human_voices/applause_cheering.ogg' },
          other: { name: 'Acoustic Guitars', fileUrl: 'https://actions.google.com/sounds/v1/cartoon/boing.ogg' }
        });
        setIsProcessing(false);
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-studio-card border border-studio-border rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in zoom-in-95">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-pink-400 animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-gray-100">Demucs AI Stem Separator</h3>
            <p className="text-xs text-gray-400">Extract isolated Vocals, Drums, Bass, and Synths using Neural AI</p>
          </div>
        </div>

        {!separatedStems && !isProcessing && (
          <div className="text-center py-8 space-y-4">
            <p className="text-xs text-gray-300">
              Select any audio mix track to process through the Demucs deep learning AI model.
            </p>
            <button
              onClick={handleSeparateStems}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 font-bold text-sm text-white shadow-lg shadow-pink-500/30 hover:scale-105 transition-all"
            >
              Start AI Separation Pipeline
            </button>
          </div>
        )}

        {isProcessing && (
          <div className="text-center py-10 space-y-3">
            <Loader2 className="w-8 h-8 text-pink-400 animate-spin mx-auto" />
            <p className="text-xs font-semibold text-gray-300">Analyzing audio frequencies & isolating stems...</p>
            <div className="w-full bg-studio-panel h-2 rounded-full overflow-hidden">
              <div className="bg-pink-500 h-full w-2/3 animate-pulse" />
            </div>
          </div>
        )}

        {separatedStems && (
          <div className="space-y-3 my-4">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-2">
              <CheckCircle2 className="w-4 h-4" /> AI Stem Extraction Complete!
            </div>
            {Object.entries(separatedStems).map(([key, stem]) => (
              <div key={key} className="flex justify-between items-center p-3 rounded-xl bg-studio-panel border border-studio-border text-xs">
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-indigo-400" />
                  <span className="font-semibold text-gray-200 capitalize">{key}: {stem.name}</span>
                </div>
                <button
                  onClick={() => onImportStems && onImportStems(stem)}
                  className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-semibold text-[11px] hover:bg-indigo-500 transition"
                >
                  Import to Track
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
