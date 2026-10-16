import React, { useState, useEffect } from 'react';
import { History, GitCommit, RotateCcw, X, Check, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { useSelector, useDispatch } from 'react-redux';
import { setTracks } from '../../store/studioSlice';

export default function VersionControlPanel({ isOpen, onClose, projectId }) {
  const dispatch = useDispatch();
  const { tracks, activeProject } = useSelector((state) => state.studio);
  const currentProjectId = projectId || activeProject?._id;

  const [versions, setVersions] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [restoringId, setRestoringId] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (isOpen && currentProjectId) {
      fetchVersions();
    }
  }, [isOpen, currentProjectId]);

  const fetchVersions = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/versions/project/${currentProjectId}`);
      if (res.data?.data) {
        setVersions(res.data.data);
      }
    } catch (err) {
      console.warn('Failed to load version history from server:', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleSaveVersion = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setSaving(true);
    try {
      const snapshotData = {
        tracks: tracks.map(t => ({
          _id: t._id,
          name: t.name,
          volume: t.volume,
          pan: t.pan,
          isMuted: t.isMuted,
          isSoloed: t.isSoloed
        }))
      };

      const res = await api.post('/versions', {
        projectId: currentProjectId,
        title: newTitle,
        description: `Snapshot with ${tracks.length} tracks`,
        snapshotData
      });

      if (res.data?.data) {
        setVersions([res.data.data, ...versions]);
        setNotification('Session snapshot saved!');
        setTimeout(() => setNotification(null), 3000);
      }
      setNewTitle('');
    } catch (err) {
      console.warn('Fallback saving version locally:', err.message);
      const newVer = {
        _id: `v_${Date.now()}`,
        versionNumber: `v1.${versions.length + 1}.0`,
        title: newTitle,
        createdByUser: { name: 'Producer' },
        createdAt: 'Just now'
      };
      setVersions([newVer, ...versions]);
      setNewTitle('');
    } finally {
      setSaving(false);
    }
  };

  const handleRestoreVersion = async (ver) => {
    if (!window.confirm(`Restore project to version "${ver.versionNumber}: ${ver.title}"?`)) return;

    setRestoringId(ver._id);
    try {
      await api.post(`/versions/${ver._id}/restore`);
      if (ver.snapshotData?.tracks) {
        // apply restored levels
        const restoredTracks = tracks.map(t => {
          const matched = ver.snapshotData.tracks.find(st => st._id === t._id);
          return matched ? { ...t, ...matched } : t;
        });
        dispatch(setTracks(restoredTracks));
      }
      setNotification(`Project state restored to ${ver.versionNumber}`);
      setTimeout(() => setNotification(null), 3000);
      fetchVersions();
    } catch (err) {
      console.error('Failed to restore version on server:', err);
    } finally {
      setRestoringId(null);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-84 bg-white border-l border-[#e6ded5] z-40 p-4 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="flex justify-between items-center pb-3 border-b border-[#e6ded5] mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#2c2420] text-[#dcc5b2] flex items-center justify-center">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-xs text-[#231f1d]">Version History</h3>
            <span className="text-[10px] text-[#736a64]">Session snapshots & restore points</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-[#8c827a] hover:text-[#231f1d] p-1 rounded-lg hover:bg-[#faf8f5] transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {notification && (
        <div className="mb-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <Check className="w-3.5 h-3.5 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Commit New Version Snapshot Form */}
      <form onSubmit={handleSaveVersion} className="mb-4 space-y-2">
        <input
          type="text"
          placeholder="Snapshot label (e.g. Balanced acoustic & vocals)"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="w-full bg-[#faf8f5] border border-[#e6ded5] rounded-xl px-3 py-2 text-xs text-[#231f1d] placeholder-[#a89f97] focus:outline-none focus:border-[#2c2420]"
        />
        <button
          type="submit"
          disabled={saving || !newTitle.trim()}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#2c2420] hover:bg-[#3d332e] font-semibold text-xs text-white shadow-xs transition disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <GitCommit className="w-3.5 h-3.5" />}
          <span>{saving ? 'Creating snapshot...' : 'Save Session Snapshot'}</span>
        </button>
      </form>

      {/* Version Commit Timeline List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
        {loading && (
          <div className="p-6 text-center text-xs text-[#736a64] flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#2c2420]" />
            <span>Loading version history...</span>
          </div>
        )}

        {!loading && versions.length === 0 && (
          <div className="p-6 text-center text-xs text-[#736a64] bg-[#faf8f5] rounded-xl border border-dashed border-[#e6ded5]">
            <p className="font-semibold text-[#231f1d]">No version snapshots yet</p>
            <p className="mt-1">Save a snapshot above to create a restore point.</p>
          </div>
        )}

        {versions.map((ver) => (
          <div
            key={ver._id}
            className="p-3 rounded-xl bg-[#faf8f5] border border-[#e6ded5] space-y-2 hover:border-[#cfb59f] transition shadow-xs"
          >
            <div className="flex justify-between items-center">
              <span className="px-2 py-0.5 rounded-md bg-[#2c2420] text-white font-mono text-[10px] font-bold">
                {ver.versionNumber || 'v1.0'}
              </span>
              <span className="text-[10px] text-[#8c827a]">
                {ver.createdAt ? new Date(ver.createdAt).toLocaleDateString() : 'Recent'}
              </span>
            </div>

            <p className="font-bold text-xs text-[#231f1d]">{ver.title}</p>

            <div className="flex justify-between items-center pt-2 border-t border-[#e6ded5] text-[11px] text-[#736a64]">
              <span>By {ver.createdByUser?.name || 'Producer'}</span>
              <button
                type="button"
                onClick={() => handleRestoreVersion(ver)}
                disabled={restoringId === ver._id}
                className="flex items-center gap-1 text-[#2c2420] hover:text-[#52443c] font-bold transition disabled:opacity-50"
              >
                {restoringId === ver._id ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <RotateCcw className="w-3 h-3" />
                )}
                <span>Restore</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
