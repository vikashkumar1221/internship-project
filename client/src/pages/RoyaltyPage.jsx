import React from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import RoyaltySplitManager from '../components/modules/RoyaltySplitManager';
import RoyaltyPayouts from '../components/modules/RoyaltyPayouts';

export default function RoyaltyPage() {
  return (
    <div className="min-h-screen bg-studio-darker flex flex-col">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto space-y-8 pb-12">
          <RoyaltySplitManager />
          <RoyaltyPayouts />
        </main>
      </div>
    </div>
  );
}
