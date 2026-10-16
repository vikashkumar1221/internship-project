import React, { useState } from 'react';
import { audioEngine } from '../../services/webAudioEngine';
import { X, Play, Music } from 'lucide-react';

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

  const steps = Array.from({ length: 16 }, (_, i) => i);

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
    <div className="h-72 border-t border-slate-200 bg-white flex flex-col z-30 shadow-elevated animate-in slide-in-from-bottom-2">
      {/* Top Controls Bar */}
      <div className="h-9 px-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
        <div className="flex items-center gap-3">
          <Music className="w-3.5 h-3.5 text-blue-600" />
          <h3 className="font-semibold text-xs text-slate-800">
            MIDI Step Sequencer
          </h3>
          <button
            onClick={playSequence}
            className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium text-[11px] shadow-xs transition"
          >
            <Play className="w-3 h-3 fill-current" /> Play Loop
          </button>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-200 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Piano Roll Matrix */}
      <div className="flex-1 flex overflow-auto bg-slate-50">
        {/* Keys Column */}
        <div className="w-14 border-r border-slate-200 bg-white shrink-0 sticky left-0 z-20 flex flex-col">
          {notes.map((note) => (
            <div
              key={note.pitch}
              onClick={() => audioEngine.playNote(note.freq, 0.3)}
              className={`flex-1 border-b border-slate-200 flex items-center justify-end pr-2 text-[10px] font-mono cursor-pointer transition select-none ${
                note.pitch.includes('#')
                  ? 'bg-slate-800 text-slate-100 hover:bg-slate-900'
                  : 'bg-white text-slate-700 hover:bg-blue-50'
              }`}
            >
              {note.pitch}
            </div>
          ))}
        </div>

        {/* Step Cells Grid */}
        <div className="flex-1 flex flex-col min-w-[500px]">
          {notes.map((note, noteIdx) => (
            <div key={note.pitch} className="flex-1 flex border-b border-slate-200">
              {steps.map((stepIdx) => {
                const isActive = grid[noteIdx][stepIdx];
                return (
                  <div
                    key={stepIdx}
                    onClick={() => toggleNote(noteIdx, stepIdx)}
                    className={`flex-1 border-r border-slate-200/80 cursor-pointer transition-colors ${
                      isActive
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : stepIdx % 4 === 0
                        ? 'bg-slate-100 hover:bg-blue-100/60'
                        : 'bg-white hover:bg-blue-50'
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
