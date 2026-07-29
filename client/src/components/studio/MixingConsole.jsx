import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  updateTrackVolume,
  updateTrackPan,
  toggleMuteTrack,
  toggleSoloTrack,
  updateTrackEQ
} from '../../store/studioSlice';
import { audioEngine } from '../../services/webAudioEngine';
import { X, Volume2, Sliders, Activity } from 'lucide-react';

export default function MixingConsole({ onClose }) {
  const dispatch = useDispatch();
  const { tracks } = useSelector((state) => state.studio);

  const handleEqChange = (trackId, band, value) => {
    const track = tracks.find((t) => t._id === trackId);
    const newEq = { ...track.eqSettings, [band]: parseFloat(value) };
    dispatch(updateTrackEQ({ trackId, eq: newEq }));
    audioEngine.setTrackEQ(trackId, newEq.low, newEq.mid, newEq.high);
  };

  return (
    <div className="h-80 border-t border-studio-border bg-studio-dark/95 backdrop-blur-xl flex flex-col z-30 shadow-2xl animate-in slide-in-from-bottom-4">
      {/* Console Top Header */}
      <div className="h-10 px-4 border-b border-studio-border flex justify-between items-center bg-studio-card/80">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-400" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-gray-200">
            DSP Mixing Console & FX Chain
          </h3>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Channel Strips Container */}
      <div className="flex-1 p-4 flex gap-4 overflow-x-auto">
        {tracks.map((track) => (
          <div
            key={track._id}
            className="w-36 bg-studio-card/90 border border-studio-border rounded-xl p-3 flex flex-col justify-between shrink-0 hover:border-indigo-500/50 transition"
          >
            {/* Track Name Header */}
            <div className="text-center pb-2 border-b border-studio-border/50">
              <span className="font-bold text-xs text-gray-200 block truncate" style={{ color: track.color }}>
                {track.name}
              </span>
              <span className="text-[9px] text-gray-500 font-mono">CH-0{track.order + 1}</span>
            </div>

            {/* 3-Band Parametric EQ Knobs */}
            <div className="space-y-1.5 my-2 text-[10px]">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">HIGH</span>
                <input
                  type="range"
                  min="-12"
                  max="12"
                  value={track.eqSettings?.high || 0}
                  onChange={(e) => handleEqChange(track._id, 'high', e.target.value)}
                  className="w-16"
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">MID</span>
                <input
                  type="range"
                  min="-12"
                  max="12"
                  value={track.eqSettings?.mid || 0}
                  onChange={(e) => handleEqChange(track._id, 'mid', e.target.value)}
                  className="w-16"
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">LOW</span>
                <input
                  type="range"
                  min="-12"
                  max="12"
                  value={track.eqSettings?.low || 0}
                  onChange={(e) => handleEqChange(track._id, 'low', e.target.value)}
                  className="w-16"
                />
              </div>
            </div>

            {/* Mute / Solo Buttons */}
            <div className="flex gap-1 my-1">
              <button
                onClick={() => dispatch(toggleMuteTrack(track._id))}
                className={`flex-1 py-1 rounded text-[9px] font-bold ${
                  track.isMuted ? 'bg-red-500 text-white' : 'bg-studio-panel text-gray-400'
                }`}
              >
                M
              </button>
              <button
                onClick={() => dispatch(toggleSoloTrack(track._id))}
                className={`flex-1 py-1 rounded text-[9px] font-bold ${
                  track.isSoloed ? 'bg-amber-500 text-white' : 'bg-studio-panel text-gray-400'
                }`}
              >
                S
              </button>
            </div>

            {/* Fader & Stereo VU Meter */}
            <div className="flex items-center gap-3 h-28 my-1 justify-center">
              {/* Vertical Volume Fader */}
              <input
                type="range"
                min="-40"
                max="6"
                step="0.5"
                value={track.volume || 0}
                onChange={(e) => {
                  const vol = parseFloat(e.target.value);
                  dispatch(updateTrackVolume({ trackId: track._id, volume: vol }));
                  audioEngine.setTrackVolume(track._id, vol);
                }}
                className="h-24 -rotate-90 origin-center w-24 cursor-pointer"
              />

              {/* Animated VU Peak Meter */}
              <div className="w-2.5 h-24 bg-black/80 rounded-full p-0.5 flex flex-col justify-end overflow-hidden">
                <div
                  className="w-full rounded-full bg-gradient-to-t from-emerald-500 via-yellow-400 to-red-500 transition-all duration-75"
                  style={{ height: `${Math.min(100, Math.max(10, (track.volume + 40) * 2))}%` }}
                />
              </div>
            </div>

            {/* Volume readout */}
            <div className="text-center font-mono text-[10px] text-emerald-400 font-bold">
              {track.volume > 0 ? `+${track.volume}` : track.volume} dB
            </div>
          </div>
        ))}

        {/* Master Output Channel Strip */}
        <div className="w-40 bg-gradient-to-b from-indigo-950/40 to-studio-card border-2 border-indigo-500/50 rounded-xl p-3 flex flex-col justify-between shrink-0">
          <div className="text-center pb-2 border-b border-indigo-500/30">
            <span className="font-extrabold text-xs text-indigo-300 block">MASTER OUT</span>
            <span className="text-[9px] text-indigo-400 font-mono">LIMITER ACTIVE</span>
          </div>

          <div className="flex justify-center items-center h-36">
            <div className="w-4 h-32 bg-black/90 rounded-full p-0.5 flex flex-col justify-end overflow-hidden">
              <div className="w-full h-4/5 rounded-full bg-gradient-to-t from-emerald-500 via-indigo-400 to-pink-500 animate-pulse" />
            </div>
          </div>

          <div className="text-center font-mono text-xs text-indigo-300 font-bold">
            0.0 dB
          </div>
        </div>
      </div>
    </div>
  );
}
