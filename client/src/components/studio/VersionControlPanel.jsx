import React, { useState } from 'react';
import { History, GitCommit, GitBranch, RotateCcw, X, Plus } from 'lucide-react';
import api from '../../services/api';

export default function VersionControlPanel({ isOpen, onClose }) {
  const [versions, setVersions] = useState([
    { _id: 'v1', versionNumber: 'v1.2.0', title: 'Added Vocal Reverb & Sub Bass', createdByUser: { name: 'Alex Rivera' }, createdAt: '2026-07-28 18:30' },
    { _id: 'v2', versionNumber: 'v1.1.0', title: 'Initial Beat & Synth Loop', createdByUser: { name: 'Sarah Chen' }, createdAt: '2026-07-27 14:15' }
  ]);
  const [newTitle, setNewTitle] = useState('');

  if (!isOpen) return null;

  const handleSaveVersion = async (e) => {
    e.preventDefault();
    if (!newTitle) return;

    const newVer = {
      _id: `v_${Date.now()}`,
      versionNumber: `v1.${versions.length + 1}.0`,
      title: newTitle,
      createdByUser: { name: 'Alex Rivera' },
      createdAt: 'Just now'
    };

    setVersions([newVer, ...versions]);
    setNewTitle('');
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-studio-dark/95 border-l border-studio-border z-40 p-6 flex flex-col shadow-2xl animate-in slide-in-from-right">
      <div className="flex justify-between items-center pb-4 border-b border-studio-border mb-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-400" />
          <h3 className="font-bold text-sm text-gray-200">Version History (Git-Style)</h3>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Commit New Version Snapshot Form */}
      <form onSubmit={handleSaveVersion} className="mb-6 space-y-3">
        <input
          type="text"
          placeholder="Version Commit Summary (e.g. Mastered Synth Bus)"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="w-full bg-studio-card border border-studio-border rounded-xl px-3.5 py-2 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-indigo-600 font-semibold text-xs text-white hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/30"
        >
          <GitCommit className="w-4 h-4" /> Save DAW Snapshot
        </button>
      </form>

      {/* Version Commit Timeline List */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {versions.map((ver) => (
          <div key={ver._id} className="p-3.5 rounded-xl bg-studio-card border border-studio-border space-y-2 hover:border-indigo-500/40 transition">
            <div className="flex justify-between items-center">
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px] font-bold border border-indigo-500/30">
                {ver.versionNumber}
              </span>
              <span className="text-[10px] text-gray-500">{ver.createdAt}</span>
            </div>
            <p className="font-semibold text-xs text-gray-200">{ver.title}</p>
            <div className="flex justify-between items-center pt-2 border-t border-studio-border/50 text-[10px] text-gray-400">
              <span>Saved by {ver.createdByUser?.name}</span>
              <button className="flex items-center gap-1 text-indigo-400 hover:underline">
                <RotateCcw className="w-3 h-3" /> Rollback
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
