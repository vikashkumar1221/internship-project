import React from 'react';
import { useDispatch } from 'react-redux';
import {
  toggleMuteTrack,
  toggleSoloTrack,
  updateTrackVolume,
  updateTrackPan
} from '../../store/studioSlice';
import { audioEngine } from '../../services/webAudioEngine';
import { Volume2, VolumeX, Mic, Sliders } from 'lucide-react';

export default function TrackRow({ track, onSelectTrack }) {
  const dispatch = useDispatch();

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    dispatch(updateTrackVolume({ trackId: track._id, volume: vol }));
    audioEngine.setTrackVolume(track._id, vol);
  };

  const handlePanChange = (e) => {
    const pan = parseFloat(e.target.value);
    dispatch(updateTrackPan({ trackId: track._id, pan }));
    audioEngine.setTrackPan(track._id, pan);
  };

  return (
    <div className="h-24 border-b border-studio-border bg-studio-dark/70 flex items-stretch hover:bg-studio-card/40 transition">
      {/* Left Control Panel Strip */}
      <div
        className="w-60 border-r border-studio-border p-2.5 flex flex-col justify-between shrink-0 select-none relative"
        style={{ borderLeft: `4px solid ${track.color || '#6366f1'}` }}
      >
        {/* Track Title */}
        <div className="flex justify-between items-center">
          <span
            onClick={() => onSelectTrack(track)}
            className="font-bold text-xs text-gray-200 truncate cursor-pointer hover:text-indigo-300"
          >
            {track.name}
          </span>
          <button className="text-gray-500 hover:text-gray-300">
            <Mic className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mute, Solo & Track Controls */}
        <div className="flex items-center gap-1.5 my-1">
          <button
            onClick={() => dispatch(toggleMuteTrack(track._id))}
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition ${
              track.isMuted
                ? 'bg-red-500 text-white shadow-sm shadow-red-500/50'
                : 'bg-studio-panel text-gray-400 hover:text-white'
            }`}
          >
            Mute
          </button>
          <button
            onClick={() => dispatch(toggleSoloTrack(track._id))}
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition ${
              track.isSoloed
                ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/50'
                : 'bg-studio-panel text-gray-400 hover:text-white'
            }`}
          >
            Solo
          </button>
        </div>

        {/* Volume & Pan Sliders */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] text-gray-400">
            <Volume2 className="w-3 h-3 text-indigo-400 shrink-0" />
            <input
              type="range"
              min="-40"
              max="6"
              step="0.5"
              value={track.volume || 0}
              onChange={handleVolumeChange}
              className="w-full"
            />
            <span className="w-8 text-right font-mono text-[9px] text-gray-400">
              {track.volume > 0 ? `+${track.volume}` : track.volume}dB
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-gray-400">
            <span className="text-[9px] font-mono text-gray-500 shrink-0">PAN</span>
            <input
              type="range"
              min="-1"
              max="1"
              step="0.1"
              value={track.pan || 0}
              onChange={handlePanChange}
              className="w-full"
            />
            <span className="w-8 text-right font-mono text-[9px] text-gray-400">
              {track.pan < 0 ? `L${Math.abs(track.pan * 100)}` : track.pan > 0 ? `R${track.pan * 100}` : 'C'}
            </span>
          </div>
        </div>
      </div>

      {/* Right Canvas Stem Clips Container */}
      <div className="flex-1 daw-grid-bg relative overflow-hidden flex items-center px-2">
        {track.stems && track.stems.length > 0 ? (
          track.stems.map((stem) => (
            <div
              key={stem._id}
              onClick={() => onSelectTrack(track)}
              className="h-16 rounded-lg p-2 flex flex-col justify-between cursor-pointer border border-indigo-500/40 relative shadow-lg group overflow-hidden"
              style={{
                width: '85%',
                backgroundColor: `${track.color}25`
              }}
            >
              <div className="flex justify-between items-center z-10">
                <span className="text-[10px] font-bold text-gray-200 truncate">{stem.name}</span>
                <span className="text-[9px] font-mono text-indigo-300">24-bit WAV</span>
              </div>

              {/* Canvas Waveform Peak Display */}
              <div className="flex items-center gap-0.5 h-8 w-full z-10">
                {stem.peaks.map((peak, idx) => (
                  <div
                    key={idx}
                    className="flex-1 rounded-full transition-all"
                    style={{
                      height: `${Math.max(15, peak * 100)}%`,
                      backgroundColor: track.color || '#6366f1'
                    }}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-gray-600 border-2 border-dashed border-studio-border/60 rounded-lg m-2">
            Drag & Drop Audio Stem (.wav, .mp3)
          </div>
        )}
      </div>
    </div>
  );
}
