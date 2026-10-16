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
  History,
  MessageSquare,
  Sliders,
  Music,
  Download,
  ArrowLeft,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DAWHeader({
  onToggleChat,
  onToggleVersions,
  onToggleMixer,
  onTogglePianoRoll,
  onOpenExport,
  onOpenInvite,
  onOpenRoyalty
}) {
  const dispatch = useDispatch();
  const {
    isPlaying,
    currentTime,
    zoomLevel,
    snapToGrid,
    selectedTool,
    activeProject,
    onlineCollaborators
  } = useSelector((state) => state.studio);

  const [bpm, setBpm] = useState(activeProject?.tempo || 124);
  const [isLooping, setIsLooping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const togglePlayback = () => {
    audioEngine.init();
    dispatch(setIsPlaying(!isPlaying));
  };

  const stopPlayback = () => {
    dispatch(setIsPlaying(false));
    dispatch(setCurrentTime(0));
  };

  // Convert seconds to mm:ss.ms
  const formatTime = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = (sec % 60).toFixed(1);
    return `${mins.toString().padStart(2, '0')}:${secs.padStart(4, '0')}`;
  };

  // Calculate current bar
  const currentBar = Math.floor((currentTime * (bpm / 60)) / 4) + 1;
  const currentBeat = (Math.floor(currentTime * (bpm / 60)) % 4) + 1;

  return (
    <header className="h-14 bg-studio-header border-b border-black/20 flex items-center justify-between px-4 select-none z-30 shadow-sm text-white">
      {/* Left: Back to Projects & Project Title */}
      <div className="flex items-center gap-3">
        <Link
          to="/dashboard"
          className="p-1.5 rounded-lg text-[#e6ded5] hover:text-white hover:bg-white/10 transition"
          title="Back to Projects"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>

        <div className="flex items-center gap-2 pr-3 border-r border-white/15">
          <div className="w-7 h-7 rounded-lg bg-studio-tan text-studio-header flex items-center justify-center shadow-xs">
            <Music className="w-4 h-4 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#e6ded5] font-medium">
              <span className="text-[#a89f97]">{activeProject?.folder || 'My Project'}</span>
              <span className="text-[#a89f97]">&gt;</span>
              <span className="text-white font-bold">{activeProject?.title || 'New Song'}</span>
            </div>
            <span className="text-[10px] text-[#cfb59f] block">
              {activeProject?.genre || 'Indie Pop'}
            </span>
          </div>
        </div>

        {/* Transport Playback Buttons */}
        <div className="flex items-center gap-1 bg-black/25 p-1 rounded-lg border border-white/10">
          <button
            onClick={togglePlayback}
            className={`p-1.5 rounded-md transition ${
              isPlaying
                ? 'bg-studio-tan text-studio-header shadow-xs font-bold'
                : 'text-[#e6ded5] hover:text-white hover:bg-white/10'
            }`}
            title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>
          
          <button
            onClick={stopPlayback}
            className="p-1.5 rounded-md text-[#e6ded5] hover:text-white hover:bg-white/10 transition"
            title="Stop & Rewind"
          >
            <Square className="w-4 h-4 fill-current" />
          </button>

          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`p-1.5 rounded-md transition ${
              isRecording
                ? 'bg-red-600 text-white shadow-xs animate-pulse'
                : 'text-red-400 hover:text-red-300 hover:bg-white/10'
            }`}
            title="Record Audio"
          >
            <Circle className="w-4 h-4 fill-current" />
          </button>

          <button
            onClick={() => setIsLooping(!isLooping)}
            className={`p-1.5 rounded-md transition ${
              isLooping
                ? 'bg-studio-tan text-studio-header'
                : 'text-[#e6ded5] hover:text-white hover:bg-white/10'
            }`}
            title="Toggle Loop"
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        {/* Time Counters: Clock & Bar display */}
        <div className="flex items-center gap-2 bg-black/25 px-2.5 py-1 rounded-lg border border-white/10 font-mono text-xs">
          <span className="font-semibold text-white">{formatTime(currentTime)}</span>
          <span className="text-white/30">|</span>
          <span className="text-[#cfb59f] font-medium">Bar {currentBar}.{currentBeat}</span>
        </div>
      </div>

      {/* Middle: Studio Controls (BPM, Key, Grid, Tools) */}
      <div className="hidden lg:flex items-center gap-3">
        {/* BPM & Key */}
        <div className="flex items-center gap-2 bg-black/25 px-2.5 py-1 rounded-lg border border-white/10 text-xs">
          <span className="text-white/60 font-medium">BPM</span>
          <input
            type="number"
            min="40"
            max="240"
            value={bpm}
            onChange={(e) => setBpm(e.target.value)}
            className="w-12 bg-white/10 border border-white/15 rounded px-1 py-0.5 text-white font-bold text-center focus:outline-none focus:border-studio-tan"
          />
          <span className="text-white/30">|</span>
          <span className="text-white/60 font-medium">Key</span>
          <span className="font-semibold text-white">{activeProject?.keySignature || 'F Minor'}</span>
        </div>

        {/* Snap to Grid */}
        <div className="flex items-center gap-1.5 bg-black/25 px-2.5 py-1 rounded-lg border border-white/10 text-xs text-[#e6ded5]">
          <Grid className="w-3.5 h-3.5 text-white/60" />
          <select
            value={snapToGrid}
            onChange={(e) => dispatch(setSnapToGrid(e.target.value))}
            className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
          >
            <option value="1/4" className="bg-studio-header">1/4 Note</option>
            <option value="1/8" className="bg-studio-header">1/8 Note</option>
            <option value="1/16" className="bg-studio-header">1/16 Note</option>
            <option value="Off" className="bg-studio-header">Grid Off</option>
          </select>
        </div>

        {/* Editor Tools */}
        <div className="flex items-center gap-1 bg-black/25 p-1 rounded-lg border border-white/10">
          <button
            onClick={() => dispatch(setSelectedTool('pointer'))}
            className={`p-1.5 rounded transition ${
              selectedTool === 'pointer'
                ? 'bg-studio-tan text-studio-header font-bold shadow-xs'
                : 'text-[#e6ded5] hover:text-white'
            }`}
            title="Pointer Selection Tool (V)"
          >
            <MousePointer className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => dispatch(setSelectedTool('cut'))}
            className={`p-1.5 rounded transition ${
              selectedTool === 'cut'
                ? 'bg-studio-tan text-studio-header font-bold shadow-xs'
                : 'text-[#e6ded5] hover:text-white'
            }`}
            title="Split Clip Tool (C)"
          >
            <Scissors className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-black/25 px-2 py-1 rounded-lg border border-white/10 text-xs">
          <button
            onClick={() => dispatch(setZoomLevel(Math.max(50, zoomLevel - 15)))}
            className="text-white/60 hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-white font-mono text-[11px] w-9 text-center font-medium">
            {zoomLevel}%
          </span>
          <button
            onClick={() => dispatch(setZoomLevel(Math.min(200, zoomLevel + 15)))}
            className="text-white/60 hover:text-white"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Right: Actions, Panels & Collaborators */}
      <div className="flex items-center gap-2">
        {/* Mixing Console Toggle */}
        <button
          onClick={onToggleMixer}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/10 hover:bg-white/15 text-[#e6ded5] hover:text-white text-xs font-medium transition"
          title="Open Mixing Console"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Mixer</span>
        </button>

        {/* Sequencer / Piano Roll Toggle */}
        <button
          onClick={onTogglePianoRoll}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/10 hover:bg-white/15 text-[#e6ded5] hover:text-white text-xs font-medium transition"
          title="MIDI Step Sequencer"
        >
          <Music className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sequencer</span>
        </button>

        {/* Version History Toggle */}
        <button
          onClick={onToggleVersions}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/10 hover:bg-white/15 text-[#e6ded5] hover:text-white text-xs font-medium transition"
          title="Project Revisions"
        >
          <History className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Versions</span>
        </button>

        {/* Timestamp Notes & Chat Toggle */}
        <button
          onClick={onToggleChat}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/10 hover:bg-white/15 text-[#e6ded5] hover:text-white text-xs font-medium transition relative"
          title="Collaborator Notes & Chat"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Notes</span>
          <span className="w-1.5 h-1.5 rounded-full bg-studio-tan"></span>
        </button>

        {/* Invite Team Member */}
        <button
          onClick={onOpenInvite}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/10 hover:bg-white/15 text-[#e6ded5] hover:text-white text-xs font-medium transition"
          title="Invite Collaborator"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Invite</span>
        </button>

        {/* Royalty Splits & Agreements */}
        <button
          onClick={onOpenRoyalty}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/10 hover:bg-white/15 text-[#e6ded5] hover:text-white text-xs font-medium transition"
          title="Royalty Splits & Contracts"
        >
          <FileText className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Splits</span>
        </button>

        {/* Export Audio */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-studio-tan hover:bg-studio-tanHover text-studio-header text-xs font-semibold shadow-xs transition"
          title="Bounce / Export Audio"
        >
          <Download className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Export</span>
        </button>

        {/* Online Collaborators Stack */}
        <div className="flex items-center -space-x-1.5 pl-2 border-l border-white/15">
          {onlineCollaborators.map((c) => (
            <img
              key={c.id}
              src={c.avatar}
              alt={c.name}
              title={`${c.name} (${c.role}) - Online`}
              className="w-7 h-7 rounded-full border-2 border-studio-header object-cover"
            />
          ))}
        </div>
      </div>
    </header>
  );
}
