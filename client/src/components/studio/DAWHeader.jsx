import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setIsPlaying,
  setCurrentTime,
  setZoomLevel,
  setSnapToGrid,
  setSelectedTool
} from '../../store/studioSlice';
import { audioEngine } from '../../services/webAudioEngine';
import {
  Play,
  Pause,
  Square,
  Circle,
  Repeat,
  ZoomIn,
  ZoomOut,
  Grid,
  Scissors,
  MousePointer,
  Share2,
  Cpu,
  History,
  MessageSquare,
  Sliders,
  Music2
} from 'lucide-react';

export default function DAWHeader({ onOpenAIStems, onToggleChat, onToggleVersions, onToggleMixer, onTogglePianoRoll }) {
  const dispatch = useDispatch();
  const { isPlaying, currentTime, zoomLevel, snapToGrid, selectedTool, activeProject, onlineCollaborators } = useSelector((state) => state.studio);
  const [bpm, setBpm] = useState(activeProject?.tempo || 120);

  const togglePlayback = () => {
    audioEngine.init();
    dispatch(setIsPlaying(!isPlaying));
  };

  const stopPlayback = () => {
    dispatch(setIsPlaying(false));
    dispatch(setCurrentTime(0));
  };

  return (
    <header className="h-14 border-b border-studio-border bg-studio-dark flex items-center justify-between px-4 select-none z-20">
      {/* Left: Project Title & Transport Controls */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Music2 className="w-5 h-5 text-indigo-400" />
          <h2 className="font-bold text-sm text-gray-100 max-w-[180px] truncate">
            {activeProject?.title || 'Untitled Studio Project'}
          </h2>
        </div>

        {/* Transport Playback Buttons */}
        <div className="flex items-center gap-1 bg-studio-panel/80 p-1 rounded-lg border border-studio-border">
          <button
            onClick={togglePlayback}
            className={`p-1.5 rounded-md transition ${
              isPlaying
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                : 'text-gray-300 hover:text-white hover:bg-studio-card'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          </button>
          <button
            onClick={stopPlayback}
            className="p-1.5 rounded-md text-gray-300 hover:text-white hover:bg-studio-card transition"
          >
            <Square className="w-4 h-4 fill-current" />
          </button>
          <button className="p-1.5 rounded-md text-red-400 hover:bg-studio-card transition">
            <Circle className="w-4 h-4 fill-current" />
          </button>
          <button className="p-1.5 rounded-md text-indigo-400 hover:bg-studio-card transition">
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        {/* Time Counter display */}
        <div className="bg-black/60 px-3 py-1 rounded-md border border-studio-border font-mono text-xs font-semibold text-emerald-400">
          00:00:{(currentTime % 60).toFixed(1).padStart(4, '0')}
        </div>
      </div>

      {/* Middle: Studio Settings (BPM, Key, Grid, Tools) */}
      <div className="flex items-center gap-3">
        {/* BPM & Key */}
        <div className="flex items-center gap-2 bg-studio-panel/80 px-2.5 py-1 rounded-lg border border-studio-border text-xs">
          <span className="text-gray-400">BPM</span>
          <input
            type="number"
            value={bpm}
            onChange={(e) => setBpm(e.target.value)}
            className="w-12 bg-transparent text-indigo-300 font-bold text-center focus:outline-none"
          />
          <span className="text-gray-500">|</span>
          <span className="text-gray-400">Key</span>
          <span className="text-pink-400 font-bold">{activeProject?.keySignature || 'F Minor'}</span>
        </div>

        {/* Snap to Grid */}
        <div className="flex items-center gap-1.5 bg-studio-panel/80 px-2.5 py-1 rounded-lg border border-studio-border text-xs text-gray-300">
          <Grid className="w-3.5 h-3.5 text-indigo-400" />
          <select
            value={snapToGrid}
            onChange={(e) => dispatch(setSnapToGrid(e.target.value))}
            className="bg-transparent text-gray-200 focus:outline-none cursor-pointer"
          >
            <option value="1/4" className="bg-studio-card">1/4 Note</option>
            <option value="1/8" className="bg-studio-card">1/8 Note</option>
            <option value="1/16" className="bg-studio-card">1/16 Note</option>
            <option value="Off" className="bg-studio-card">Grid Off</option>
          </select>
        </div>

        {/* Editor Tools */}
        <div className="flex items-center gap-1 bg-studio-panel/80 p-1 rounded-lg border border-studio-border">
          <button
            onClick={() => dispatch(setSelectedTool('pointer'))}
            className={`p-1.5 rounded ${
              selectedTool === 'pointer' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
            title="Pointer Selection Tool"
          >
            <MousePointer className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => dispatch(setSelectedTool('cut'))}
            className={`p-1.5 rounded ${
              selectedTool === 'cut' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
            title="Split Clip Tool (Blade)"
          >
            <Scissors className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-studio-panel/80 px-2 py-1 rounded-lg border border-studio-border text-xs">
          <button
            onClick={() => dispatch(setZoomLevel(Math.max(50, zoomLevel - 15)))}
            className="text-gray-400 hover:text-white"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-gray-400 font-mono text-[10px] w-8 text-center">{zoomLevel}%</span>
          <button
            onClick={() => dispatch(setZoomLevel(Math.min(200, zoomLevel + 15)))}
            className="text-gray-400 hover:text-white"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Right: Modules & Collaborators */}
      <div className="flex items-center gap-2">
        {/* AI Stem Isolation Launcher */}
        <button
          onClick={onOpenAIStems}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/40 text-pink-300 text-xs font-semibold hover:border-pink-400 transition"
        >
          <Cpu className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
          <span>Demucs AI</span>
        </button>

        {/* Mixer Toggle */}
        <button
          onClick={onToggleMixer}
          className="p-1.5 rounded-lg bg-studio-panel border border-studio-border text-gray-300 hover:text-white hover:border-indigo-500 transition"
          title="Toggle Mixing Console"
        >
          <Sliders className="w-4 h-4" />
        </button>

        {/* Version History */}
        <button
          onClick={onToggleVersions}
          className="p-1.5 rounded-lg bg-studio-panel border border-studio-border text-gray-300 hover:text-white hover:border-indigo-500 transition"
          title="Version Control Log"
        >
          <History className="w-4 h-4" />
        </button>

        {/* Chat Drawer Toggle */}
        <button
          onClick={onToggleChat}
          className="p-1.5 rounded-lg bg-studio-panel border border-studio-border text-gray-300 hover:text-white hover:border-indigo-500 transition relative"
          title="Project Chat & Timeline Comments"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500" />
        </button>

        {/* Collaborators Stack */}
        <div className="flex items-center -space-x-2 pl-2 border-l border-studio-border">
          {onlineCollaborators.map((c) => (
            <img
              key={c.id}
              src={c.avatar}
              alt={c.name}
              title={`${c.name} (${c.role})`}
              className="w-7 h-7 rounded-full border-2 border-studio-dark object-cover"
            />
          ))}
        </div>
      </div>
    </header>
  );
}
