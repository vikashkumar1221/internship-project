import React, { useState } from 'react';
import { audioEngine } from '../../services/webAudioEngine';
import { X, Play, Music, Sparkles } from 'lucide-react';

export default function PianoRoll({ onClose }) {
  const notes = [
    { pitch: 'C5', freq: 523.25 },
    { pitch: 'B4', freq: 493.88 },
    { pitch: 'A#4', freq: 466.16 },
    { pitch: 'A4', freq: 440.0 },
    { pitch: 'G#4', freq: 415.3 },
    { pitch: 'G4', freq: 392.0 },
    { pitch: 'F#4', freq: 369.99 },
    { pitch: 'F4', freq: 349.23 },
    { pitch: 'E4', freq: 329.63 },
    { pitch: 'D#4', freq: 311.13 },
    { pitch: 'D4', freq: 293.66 },
    { pitch: 'C4', freq: 261.63 }
  ];

  // Grid steps (16 steps = 1 Bar of 1/16ths)
  const steps = Array.from({ length: 16 }, (_, i) => i);

  // Active matrix state [noteIndex][stepIndex]
  const [grid, setGrid] = useState(() =>
    Array.from({ length: 12 }, (_, noteIdx) =>
      Array.from({ length: 16 }, (_, stepIdx) => (noteIdx === 3 && stepIdx % 4 === 0) || (noteIdx === 8 && stepIdx % 2 === 0))
    )
  );

  const toggleNote = (noteIdx, stepIdx) => {
    const newGrid = grid.map((row) => [...row]);
    newGrid[noteIdx][stepIdx] = !newGrid[noteIdx][stepIdx];
    setGrid(newGrid);

    if (newGrid[noteIdx][stepIdx]) {
      audioEngine.playNote(notes[noteIdx].freq, 0.3);
    }
  };

  const playSequence = () => {
    steps.forEach((stepIdx) => {
      setTimeout(() => {
        notes.forEach((note, noteIdx) => {
          if (grid[noteIdx][stepIdx]) {
            audioEngine.playNote(note.freq, 0.25);
          }
        });
      }, stepIdx * 150);
    });
  };

  return (
    <div className="h-80 border-t border-studio-border bg-studio-dark flex flex-col z-30 shadow-2xl animate-in slide-in-from-bottom-4">
      {/* Top Controls Bar */}
      <div className="h-10 px-4 border-b border-studio-border flex justify-between items-center bg-studio-card/80">
        <div className="flex items-center gap-3">
          <Music className="w-4 h-4 text-pink-400" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-gray-200">
            MIDI Piano Roll Sequencer (Synth Sampler)
          </h3>
          <button
            onClick={playSequence}
            className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition"
          >
            <Play className="w-3 h-3 fill-current" /> Play Pattern
          </button>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Piano Roll Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Keys Column */}
        <div className="w-20 bg-studio-card border-r border-studio-border flex flex-col justify-between shrink-0 select-none">
          {notes.map((n, idx) => (
            <div
              key={n.pitch}
              onClick={() => audioEngine.playNote(n.freq, 0.4)}
              className={`flex-1 border-b border-studio-border/40 px-2 flex items-center justify-between text-[10px] font-bold cursor-pointer transition ${
                n.pitch.includes('#') ? 'bg-black/80 text-gray-400' : 'bg-studio-panel text-gray-200 hover:bg-indigo-600/30'
              }`}
            >
              <span>{n.pitch}</span>
            </div>
          ))}
        </div>

        {/* Note Grid Matrix */}
        <div className="flex-1 overflow-x-auto flex flex-col justify-between daw-grid-bg">
          {notes.map((n, noteIdx) => (
            <div key={n.pitch} className="flex-1 flex border-b border-studio-border/20">
              {steps.map((stepIdx) => {
                const isActive = grid[noteIdx][stepIdx];
                return (
                  <div
                    key={stepIdx}
                    onClick={() => toggleNote(noteIdx, stepIdx)}
                    className={`flex-1 border-r border-studio-border/30 cursor-pointer transition ${
                      isActive
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 shadow-md shadow-pink-500/40 rounded-sm'
                        : 'hover:bg-indigo-500/20'
                    }`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
