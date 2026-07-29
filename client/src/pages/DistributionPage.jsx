import React from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import DistributionHub from '../components/modules/DistributionHub';

export default function DistributionPage() {
  return (
    <div className="min-h-screen bg-studio-darker flex flex-col">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <DistributionHub />
        </main>
      </div>
    </div>
  );
}
