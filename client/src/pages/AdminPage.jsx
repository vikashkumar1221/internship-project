import React from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import AdminPanel from '../components/modules/AdminPanel';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-studio-darker flex flex-col">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <AdminPanel />
        </main>
      </div>
    </div>
  );
}
