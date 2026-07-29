import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Sliders,
  ShoppingBag,
  FileSignature,
  PieChart,
  Globe,
  CreditCard,
  ShieldAlert,
  Folder,
  Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const { user } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'DAW Studio', path: '/studio', icon: Sliders },
    { name: 'Royalty Splits', path: '/royalty', icon: PieChart },
    { name: 'Legal Contracts', path: '/contracts', icon: FileSignature },
    { name: 'Beat Marketplace', path: '/marketplace', icon: ShoppingBag },
    { name: 'Distribution Hub', path: '/distribution', icon: Globe },
    { name: 'Billing & Plans', path: '/billing', icon: CreditCard },
  ];

  if (user?.role === 'admin') {
    navItems.push({ name: 'Admin Panel', path: '/admin', icon: ShieldAlert });
  }

  return (
    <aside className="w-64 border-r border-studio-border bg-studio-dark/95 flex flex-col justify-between py-6 px-4 z-30 shrink-0">
      <div className="space-y-6">
        <div className="px-3">
          <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-3">
            Studio Navigation
          </p>
          <nav className="space-y-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/20 text-white border border-indigo-500/40 shadow-lg shadow-indigo-500/10'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-studio-panel/50'
                  }`
                }
              >
                <item.icon className="w-4 h-4 text-indigo-400" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Cloud Storage Usage Footer */}
      <div className="px-3">
        <div className="p-3.5 rounded-xl bg-studio-card border border-studio-border text-xs">
          <div className="flex justify-between items-center mb-1.5 font-medium text-gray-300">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-indigo-400" /> Storage
            </span>
            <span className="text-indigo-400">2.4 / 5 GB</span>
          </div>
          <div className="w-full h-1.5 bg-studio-panel rounded-full overflow-hidden">
            <div className="w-1/2 h-full bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full" />
          </div>
          <p className="text-[10px] text-gray-500 mt-2">
            Pro Plan • AWS S3 Bucket
          </p>
        </div>
      </div>
    </aside>
  );
}
