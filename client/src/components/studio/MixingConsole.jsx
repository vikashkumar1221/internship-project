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
  const { tracks, isPlaying } = useSelector((state) => state.studio);

  const handleEqChange = (trackId, band, value) => {
    const track = tracks.find((t) => t._id === trackId);
    const newEq = { ...track.eqSettings, [band]: parseFloat(value) };
    dispatch(updateTrackEQ({ trackId, eq: newEq }));
    audioEngine.setTrackEQ(trackId, newEq.low, newEq.mid, newEq.high);
  };

  const handleVolumeChange = (trackId, value) => {
    const vol = parseFloat(value);
    dispatch(updateTrackVolume({ trackId, volume: vol }));
    audioEngine.setTrackVolume(trackId, vol);
  };

  const handlePanChange = (trackId, value) => {
    const pan = parseFloat(value);
    dispatch(updateTrackPan({ trackId, pan }));
    audioEngine.setTrackPan(trackId, pan);
  };

  return (
    <div className="h-72 border-t border-slate-200 bg-white flex flex-col z-30 shadow-elevated animate-in slide-in-from-bottom-2">
      {/* Console Top Header */}
      <div className="h-9 px-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
        <div className="flex items-center gap-2">
          <Sliders className="w-3.5 h-3.5 text-blue-600" />
          <h3 className="font-semibold text-xs text-slate-800">
            Mixing Console & Channel Strips
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-200 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Channel Strips Container */}
      <div className="flex-1 p-3 flex gap-3 overflow-x-auto bg-slate-50/40">
        {tracks.map((track, idx) => (
          <div
            key={track._id}
            className="w-32 bg-white border border-slate-200 rounded-lg p-2.5 flex flex-col justify-between shrink-0 shadow-subtle hover:border-slate-300 transition"
          >
            {/* Track Name Header */}
            <div className="text-center pb-1.5 border-b border-slate-100">
              <span
                className="font-semibold text-xs block truncate"
                style={{ color: track.color || '#2563eb' }}
              >
                {track.name}
              </span>
              <span className="text-[9px] text-slate-400 font-mono">CH-0{idx + 1}</span>
            </div>

            {/* 3-Band Parametric EQ Knobs */}
            <div className="space-y-1 my-1 text-[9px] font-mono text-slate-500">
              <div className="flex justify-between items-center">
                <span>HI</span>
                <input
                  type="range"
                  min="-12"
                  max="12"
                  value={track.eqSettings?.high || 0}
                  onChange={(e) => handleEqChange(track._id, 'high', e.target.value)}
                  className="w-14"
                />
              </div>
              <div className="flex justify-between items-center">
                <span>MID</span>
                <input
                  type="range"
                  min="-12"
                  max="12"
                  value={track.eqSettings?.mid || 0}
                  onChange={(e) => handleEqChange(track._id, 'mid', e.target.value)}
                  className="w-14"
                />
              </div>
              <div className="flex justify-between items-center">
                <span>LOW</span>
                <input
                  type="range"
                  min="-12"
                  max="12"
                  value={track.eqSettings?.low || 0}
                  onChange={(e) => handleEqChange(track._id, 'low', e.target.value)}
                  className="w-14"
                />
              </div>
            </div>

            {/* Mute / Solo Buttons */}
            <div className="flex gap-1 my-1">
              <button
                onClick={() => dispatch(toggleMuteTrack(track._id))}
                className={`flex-1 py-0.5 rounded text-[9px] font-bold ${
                  track.isMuted
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                M
              </button>
              <button
                onClick={() => dispatch(toggleSoloTrack(track._id))}
                className={`flex-1 py-0.5 rounded text-[9px] font-bold ${
                  track.isSoloed
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                S
              </button>
            </div>

            {/* Vertical Volume Fader & Peak Meter */}
            <div className="flex items-center justify-center gap-2 h-24 my-1">
              <input
                type="range"
                min="-40"
                max="6"
                step="0.5"
                value={track.volume ?? 0}
                onChange={(e) => handleVolumeChange(track._id, e.target.value)}
                className="h-20 w-3 -rotate-90"
              />

              {/* Animated VU Peak Meter */}
              <div className="w-1.5 h-20 bg-slate-100 rounded overflow-hidden flex flex-col justify-end">
                <div
                  className="w-full bg-emerald-500 transition-all duration-100 rounded"
                  style={{
                    height: isPlaying
                      ? `${Math.min(100, Math.max(10, (track.volume + 40) * 2 + (Math.random() * 20 - 10)))}%`
                      : '5%'
                  }}
                />
              </div>
            </div>

            {/* Pan & dB Label */}
            <div className="text-center pt-1 border-t border-slate-100 font-mono text-[9px] text-slate-500">
              {track.volume > 0 ? `+${track.volume}` : track.volume} dB
            </div>
          </div>
        ))}

        {/* Master Output Channel Strip */}
        <div className="w-32 bg-white border-2 border-slate-300 rounded-lg p-2.5 flex flex-col justify-between shrink-0 shadow-sm">
          <div className="text-center pb-1.5 border-b border-slate-100">
            <span className="font-bold text-xs text-slate-900 block">MASTER</span>
            <span className="text-[9px] text-blue-600 font-mono font-semibold">STEREO OUT</span>
          </div>

          <div className="flex-1 flex items-center justify-center gap-2 my-2">
            <input
              type="range"
              min="-20"
              max="6"
              defaultValue="0"
              className="h-24 w-3 -rotate-90"
            />
            {/* Master Stereo Peak Meters */}
            <div className="flex gap-0.5 h-24">
              <div className="w-1.5 bg-slate-100 rounded overflow-hidden flex flex-col justify-end">
                <div
                  className="w-full bg-blue-600 transition-all duration-100 rounded"
                  style={{ height: isPlaying ? '65%' : '0%' }}
                />
              </div>
              <div className="w-1.5 bg-slate-100 rounded overflow-hidden flex flex-col justify-end">
                <div
                  className="w-full bg-blue-600 transition-all duration-100 rounded"
                  style={{ height: isPlaying ? '62%' : '0%' }}
                />
              </div>
            </div>
          </div>

          <div className="text-center pt-1 border-t border-slate-100 font-mono text-[9px] text-slate-700 font-bold">
            0.0 dB
          </div>
        </div>
      </div>
    </div>
  );
}
