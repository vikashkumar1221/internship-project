import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Music,
  Home,
  Folder,
  Compass,
  Users,
  Mail,
  Library,
  BarChart2,
  User,
  Settings,
  Plus
} from 'lucide-react';

export default function Sidebar({ onOpenNewProject }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home, exact: true },
    { name: 'Projects', path: '/projects', icon: Folder, match: ['/projects', '/project', '/studio'] },
    { name: 'Explore', path: '/explore', icon: Compass },
    { name: 'Collaborators', path: '/collaborators', icon: Users },
    { name: 'Messages', path: '/messages', icon: Mail, match: ['/messages', '/activity', '/notifications'] },
    { name: 'My Library', path: '/library', icon: Library },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings }
  ];

  const handleCreateProject = () => {
    if (onOpenNewProject) {
      onOpenNewProject();
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <aside className="w-64 lg:w-72 bg-[#121110] border-r border-[#24201c] flex flex-col justify-between py-6 px-4 z-30 shrink-0 select-none min-h-[calc(100vh-64px)] h-full overflow-y-auto">
      <div>
        {/* Logo matching the design */}
        <div className="px-3 pb-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[#f1dec9]">
            <Music className="w-7 h-7 stroke-[2.2]" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">
            StudioCollab
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const targetPath = item.fallback || item.path;
            const isActive = item.exact
              ? location.pathname === item.path
              : item.match
                ? item.match.some((m) => location.pathname.startsWith(m))
                : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.name}
                to={targetPath}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm transition text-left group ${
                  isActive
                    ? 'bg-[#f1dec9] text-[#1a1614] font-bold shadow-xs'
                    : 'text-[#c2b8ae] hover:text-white hover:bg-white/5 font-medium'
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive
                      ? 'text-[#1a1614] stroke-[2.2]'
                      : 'text-[#c2b8ae] group-hover:text-white stroke-[1.8]'
                  }`}
                />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Button: + Create Project */}
      <div className="pt-4">
        <button
          onClick={handleCreateProject}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#f1dec9] hover:bg-[#e4ceb7] text-[#1a1614] font-bold text-sm shadow-sm transition active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Create Project</span>
        </button>
      </div>
    </aside>
  );
}
