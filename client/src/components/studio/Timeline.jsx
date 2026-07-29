import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TrackRow from './TrackRow';
import { setCurrentTime } from '../../store/studioSlice';
import { useSocket } from '../../context/SocketContext';

export default function Timeline({ onSelectTrack, onOpenUploadModal }) {
  const dispatch = useDispatch();
  const timelineRef = useRef(null);
  const { tracks, currentTime, onlineCollaborators } = useSelector((state) => state.studio);
  const { socket } = useSocket();

  const handleTimelineScrub = (e) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left - 240; // 240px track header offset
    if (clickX >= 0) {
      const newSec = Math.max(0, parseFloat((clickX / 15).toFixed(1)));
      dispatch(setCurrentTime(newSec));

      if (socket) {
        socket.emit('playhead-scrub', { currentTime: newSec, isPlaying: true });
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-studio-darker overflow-x-auto relative select-none" ref={timelineRef}>
      {/* Top Timeline Ruler Bar */}
      <div
        onClick={handleTimelineScrub}
        className="h-7 border-b border-studio-border bg-studio-dark flex items-center text-[10px] font-mono text-gray-500 sticky top-0 z-20 cursor-pointer"
      >
        {/* Track Controls Spacer Header */}
        <div className="w-60 border-r border-studio-border px-3 font-semibold text-gray-400 shrink-0">
          TRACK ENGINE ({tracks.length})
        </div>

        {/* Time Seconds & Bar Markers */}
        <div className="flex-1 flex items-center relative h-full">
          {Array.from({ length: 30 }).map((_, bar) => (
            <div key={bar} className="w-20 border-l border-studio-border/40 h-full flex items-end pb-0.5 px-1">
              <span>00:{(bar * 4).toString().padStart(2, '0')}</span>
            </div>
          ))}

          {/* Interactive Playhead Needle */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-30 shadow-lg shadow-red-500/80 pointer-events-none"
            style={{ left: `${currentTime * 15}px` }}
          >
            <div className="w-3 h-3 bg-red-500 transform -translate-x-[5px] rotate-45 rounded-sm" />
          </div>
        </div>
      </div>

      {/* Multi-Track List Rows */}
      <div className="flex-1 divide-y divide-studio-border/30 overflow-y-auto">
        {tracks.map((track) => (
          <TrackRow key={track._id} track={track} onSelectTrack={onSelectTrack} />
        ))}
      </div>

      {/* Collaborative Live Cursor Overlay */}
      <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
        {onlineCollaborators.map((c, i) => (
          <div
            key={c.id || i}
            className="absolute flex items-center gap-1 transition-all duration-75"
            style={{
              top: `${100 + i * 40}px`,
              left: `${300 + (i + 1) * 80}px`
            }}
          >
            <div className="w-3 h-3 border-2 border-pink-400 bg-pink-500 rounded-full animate-ping" />
            <span className="bg-pink-500/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
              {c.name} (Editing)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
