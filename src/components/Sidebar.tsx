/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useLockIn } from '../context/LockInContext';
import {
  LayoutDashboard,
  Terminal,
  CheckSquare,
  BarChart2,
  BookOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  Clock,
  Zap,
  Calendar,
} from 'lucide-react';

export default function Sidebar() {
  const { currentView, setCurrentView, profile, stats, settings } = useLockIn();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'console', label: 'Lock-In Console', icon: Terminal, badge: 'READY' },
    { id: 'tasks', label: 'Daily Tasks', icon: CheckSquare },
    { id: 'weekly', label: 'Weekly Planner', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'journal', label: 'Journal Logs', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const accentRing = settings.accentColor === 'green' 
    ? 'border-emerald-500/30 text-emerald-400' 
    : 'border-blue-500/30 text-blue-400';

  const accentColor = settings.accentColor === 'green' ? 'emerald' : 'blue';

  return (
    <aside
      className={`relative h-screen border-r border-white/5 bg-[#080808] flex flex-col justify-between transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Brand Branding */}
      <div>
        <div className="p-6 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center space-x-3">
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg border bg-zinc-950/40 border-white/5 ${accentRing}`}>
              <Zap className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-2xl font-black tracking-tighter text-white leading-none">
                  LOCKIN<span className={accentColor === 'emerald' ? 'text-emerald-500' : 'text-blue-500'}>_</span>
                </h1>
                <p className="text-[10px] text-white/30 uppercase tracking-[0.2rem] mt-1 leading-none">
                  Discipline OS v2.4
                </p>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex h-6 w-6 items-center justify-center rounded border border-white/10 bg-white/5 text-white/60 hover:text-white"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* User Status Summary Details */}
        {!isCollapsed && (
          <div className="p-6 border-b border-white/5 bg-white/2">
            <div className="flex items-center space-x-3">
              <div className={`h-2 w-2 rounded-full ${
                accentColor === 'emerald' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-blue-500 shadow-[0_0_8px_#3b82f6]'
              } animate-pulse`} />
              <div className="font-mono text-[10px] tracking-wider text-white/40">
                SYSTEM OPERATIONAL
              </div>
            </div>
            <div className="mt-2 font-display text-white font-medium text-xs tracking-widest">
              //{profile.handle}
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="p-4 space-y-1 mt-4">
          {menuItems.map((item) => {
            const isActive = currentView === item.id;
            const IconComponent = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg font-mono text-xs transition-all tracking-wide ${
                  isActive
                    ? 'bg-white/5 border border-white/10 text-white font-semibold'
                    : 'text-white/50 hover:text-white hover:bg-[#0d0d0e]/40 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {isActive ? (
                    <div className={`w-2 h-2 rounded-full ${
                      accentColor === 'emerald'
                        ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]'
                        : 'bg-blue-500 shadow-[0_0_8px_#3b82f6]'
                    }`} />
                  ) : (
                    <IconComponent className="h-4.5 w-4.5 text-white/30" />
                  )}
                  {!isCollapsed && <span className="text-xs font-semibold">{item.label}</span>}
                </div>
                {!isCollapsed && item.badge && (
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold bg-white/5 text-white border ${
                    accentColor === 'emerald' ? 'border-emerald-500/20 text-emerald-400' : 'border-blue-500/20 text-blue-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer System Status widget */}
      {!isCollapsed ? (
        <div className="p-6 mt-auto">
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-white/40 uppercase tracking-widest">Mission Status</span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                accentColor === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
              }`}>Active</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className={`h-full ${
                accentColor === 'emerald' ? 'bg-emerald-500' : 'bg-blue-500'
              }`} style={{ width: `${stats.consistencyScore}%` }}></div>
            </div>
            <p className="text-[11px] mt-2 text-white/60">{stats.consistencyScore}% Consistency Score</p>
            <p className="text-[10px] mt-0.5 text-white/30 font-mono">STREAK: {stats.focusStreak} DAYS</p>
          </div>
        </div>
      ) : (
        <div className="p-4 mt-auto text-center border-t border-white/5">
          <Shield className="h-4 w-4 mx-auto text-white/40" />
        </div>
      )}
    </aside>
  );
}
