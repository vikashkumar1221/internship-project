import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { MessageSquare, Upload, GitCommit, Clock, ArrowRight, Play, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ActivityPage() {
  const activities = [
    {
      id: 1,
      type: 'comment',
      user: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      action: 'pinned feedback at',
      project: 'Midnight Synthwave Anthem',
      timestampAudio: '00:14.2',
      content: 'Could you boost the high shelf EQ on the lead vocals around this bar? Sounds a bit dark in the mix.',
      timeAgo: '15 minutes ago'
    },
    {
      id: 2,
      type: 'stem_upload',
      user: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      action: 'uploaded a new 24-bit audio stem',
      project: 'Midnight Synthwave Anthem',
      timestampAudio: null,
      content: 'Jupiter_8_Chords_Warm_Reverb.wav (Stereo 24-bit 48kHz WAV stem)',
      timeAgo: '1 hour ago'
    },
    {
      id: 3,
      type: 'version',
      user: 'Marcus Bell',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      action: 'created a version snapshot',
      project: 'Acoustic Indie Session',
      timestampAudio: null,
      content: 'v1.2.0 - Added shaker loop and balanced acoustic guitar panning',
      timeAgo: '3 hours ago'
    },
    {
      id: 4,
      type: 'comment',
      user: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      action: 'commented on',
      project: 'Midnight Synthwave Anthem',
      timestampAudio: '00:32.0',
      content: 'Sub bass drop here is clean! Kick transient fits right through the low end.',
      timeAgo: 'Yesterday'
    }
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col justify-between selection:bg-[#dcc5b2] selection:text-[#2c2420]">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
          <div className="pb-4 border-b border-[#e6ded5] flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-extrabold text-[#231f1d] tracking-tight">Activity & Feedback</h1>
              <p className="text-xs text-[#736a64] mt-0.5">
                Audit trail of audio stem uploads, timestamped collaborator notes, and mix snapshots.
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#e6ded5] text-xs font-semibold text-[#2c2420]">
              <Bell className="w-3.5 h-3.5 text-[#8c827a]" />
              <span>Real-time Sync Active</span>
            </div>
          </div>

          <div className="bg-white border border-[#e6ded5] rounded-2xl shadow-subtle divide-y divide-[#e6ded5] overflow-hidden">
            {activities.map((a) => (
              <div key={a.id} className="p-4 sm:p-5 hover:bg-[#faf8f5] transition">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <img
                      src={a.avatar}
                      alt={a.user}
                      className="w-10 h-10 rounded-full object-cover border border-[#e6ded5] mt-0.5"
                    />
                    <div>
                      <div className="text-xs text-[#736a64]">
                        <span className="font-bold text-[#231f1d]">{a.user}</span>{' '}
                        <span>{a.action}</span>{' '}
                        <span className="font-semibold text-[#2c2420]">"{a.project}"</span>
                      </div>

                      <p className="mt-1.5 text-xs text-[#443a34] font-medium leading-relaxed">
                        {a.content}
                      </p>

                      <div className="flex items-center gap-3 mt-2.5">
                        {a.timestampAudio && (
                          <Link
                            to="/studio"
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#2c2420] text-[#dcc5b2] font-mono text-[10px] font-bold shadow-xs hover:bg-[#3d332e] transition"
                            title="Jump playhead to this position in studio"
                          >
                            <Clock className="w-3 h-3 stroke-[2.5]" />
                            <span>Jump to {a.timestampAudio}</span>
                          </Link>
                        )}
                        <span className="text-[10px] text-[#8c827a] font-mono">{a.timeAgo}</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/studio"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#e6ded5] bg-[#faf8f5] hover:bg-[#f5f0ea] text-[#2c2420] text-xs font-bold transition shrink-0"
                  >
                    <span>Open in DAW</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
