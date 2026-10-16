import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { X, FileText, Download, Plus, Trash2, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function RoyaltySplitModal({ isOpen, onClose, projectId, projectTitle }) {
  const [contributors, setContributors] = useState([
    { name: 'Alex Rivera', role: 'Producer', percentage: 50 },
    { name: 'Sarah Chen', role: 'Vocalist / Topline', percentage: 50 }
  ]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    if (isOpen && projectId) {
      fetchSplit();
    }
  }, [isOpen, projectId]);

  const fetchSplit = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/royalty/project/${projectId}`);
      if (res.data?.data?.contributors && res.data.data.contributors.length > 0) {
        setContributors(res.data.data.contributors.map(c => ({
          name: c.name || c.user?.name || 'Contributor',
          role: c.role || 'Contributor',
          percentage: Number(c.percentage) || 0
        })));
      }
    } catch (err) {
      console.warn('Could not load existing royalty split:', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const totalPercentage = contributors.reduce((sum, c) => sum + (parseFloat(c.percentage) || 0), 0);
  const isValid100 = Math.round(totalPercentage) === 100;

  const handlePercentageChange = (index, value) => {
    const next = [...contributors];
    next[index].percentage = parseFloat(value) || 0;
    setContributors(next);
  };

  const handleFieldChange = (index, field, value) => {
    const next = [...contributors];
    next[index][field] = value;
    setContributors(next);
  };

  const handleAddContributor = () => {
    setContributors([
      ...contributors,
      { name: '', role: 'Songwriter', percentage: 0 }
    ]);
  };

  const handleRemoveContributor = (index) => {
    if (contributors.length <= 1) return;
    setContributors(contributors.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!isValid100) {
      setStatusMessage({ type: 'error', text: `Total percentage must equal exactly 100%. Current sum: ${totalPercentage}%` });
      return;
    }

    setSaving(true);
    setStatusMessage(null);
    try {
      await api.post('/royalty', {
        projectId,
        contributors
      });
      setStatusMessage({ type: 'success', text: 'Royalty split agreement saved successfully!' });
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save royalty split.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const response = await api.get(`/royalty/project/${projectId}/pdf`, {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Split-Sheet-${(projectTitle || 'Project').replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Failed to generate PDF agreement. Please save the split first.' });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#2c2420]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-[#e6ded5] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in zoom-in-95 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-start pb-4 border-b border-[#e6ded5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2c2420] text-[#dcc5b2] flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#231f1d]">Royalty Splits & Contracts</h3>
              <p className="text-xs text-[#736a64] mt-0.5">Define and finalize master & publishing shares.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8c827a] hover:text-[#231f1d] p-1 rounded-lg hover:bg-[#faf8f5] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status notification */}
        {statusMessage && (
          <div className={`mt-3 p-3 rounded-xl text-xs flex items-center gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {statusMessage.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Split Calculator Form */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#231f1d] uppercase tracking-wider">Contributors & Roles</span>
            <button
              type="button"
              onClick={handleAddContributor}
              className="flex items-center gap-1 text-xs font-semibold text-[#2c2420] hover:text-[#52443c] bg-[#faf8f5] border border-[#e6ded5] px-2.5 py-1 rounded-lg transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add Creator
            </button>
          </div>

          <div className="space-y-3">
            {contributors.map((c, index) => (
              <div key={index} className="flex items-center gap-2 bg-[#faf8f5] p-3 rounded-xl border border-[#e6ded5]">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Creator Name"
                    value={c.name}
                    onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                    className="w-full bg-white border border-[#e6ded5] rounded-lg px-2.5 py-1.5 text-xs text-[#231f1d] font-medium placeholder-[#a89f97] focus:outline-none focus:border-[#2c2420]"
                  />
                </div>
                <div className="w-32">
                  <select
                    value={c.role}
                    onChange={(e) => handleFieldChange(index, 'role', e.target.value)}
                    className="w-full bg-white border border-[#e6ded5] rounded-lg px-2 py-1.5 text-xs text-[#231f1d] font-medium focus:outline-none focus:border-[#2c2420]"
                  >
                    <option value="Producer">Producer</option>
                    <option value="Vocalist">Vocalist</option>
                    <option value="Songwriter">Songwriter</option>
                    <option value="Mixing Engineer">Mixing Engineer</option>
                    <option value="Instrumentalist">Instrumentalist</option>
                  </select>
                </div>
                <div className="w-20 flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={c.percentage}
                    onChange={(e) => handlePercentageChange(index, e.target.value)}
                    className="w-full bg-white border border-[#e6ded5] rounded-lg px-2 py-1.5 text-xs text-right font-mono font-bold text-[#231f1d] focus:outline-none focus:border-[#2c2420]"
                  />
                  <span className="text-xs font-bold text-[#736a64]">%</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveContributor(index)}
                  className="p-1.5 text-[#8c827a] hover:text-red-600 rounded-lg transition"
                  title="Remove contributor"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Total Validation Bar */}
          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            isValid100
              ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900'
              : 'bg-amber-50/70 border-amber-300 text-amber-900'
          }`}>
            <div className="flex items-center gap-2">
              {isValid100 ? (
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              )}
              <div>
                <span className="text-xs font-bold block">
                  {isValid100 ? 'Split Validated (100% Total)' : 'Split Total Must Equal 100%'}
                </span>
                <span className="text-[11px] opacity-80">
                  {isValid100
                    ? 'All legal shares accounted for. Ready to finalize.'
                    : `Remaining allocation required: ${(100 - totalPercentage).toFixed(1)}%`}
                </span>
              </div>
            </div>
            <span className="text-base font-extrabold font-mono">
              {totalPercentage}%
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#e6ded5] flex flex-col sm:flex-row justify-between items-center gap-3">
          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#e6ded5] bg-[#faf8f5] hover:bg-[#f5f0ea] text-xs font-bold text-[#2c2420] transition disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'Generating PDF...' : 'Download PDF Split Sheet'}</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#736a64] hover:bg-[#faf8f5] transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !isValid100}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#2c2420] hover:bg-[#3d332e] text-white text-xs font-bold shadow-xs transition disabled:opacity-40"
            >
              {saving ? 'Saving...' : 'Finalize & Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
