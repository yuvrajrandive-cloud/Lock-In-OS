/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { LockInProvider, useLockIn } from './context/LockInContext';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import LockInConsole from './components/LockInConsole';
import DailyTasks from './components/DailyTasks';
import AnalyticsView from './components/AnalyticsView';
import JournalView from './components/JournalView';
import SettingsView from './components/SettingsView';
import BootView from './components/BootView';
import WeeklyPlanner from './components/WeeklyPlanner';
import { Menu, X, Shield, Zap } from 'lucide-react';

function AppContent() {
  const { currentView, setCurrentView, settings, profile } = useLockIn();
  const [booted, setBooted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Render current view
  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'console':
        return <LockInConsole />;
      case 'tasks':
        return <DailyTasks />;
      case 'analytics':
        return <AnalyticsView />;
      case 'journal':
        return <JournalView />;
      case 'settings':
        return <SettingsView />;
      case 'weekly':
        return <WeeklyPlanner />;
      default:
        return <DashboardView />;
    }
  };

  const accentColor = settings.accentColor === 'green' ? 'emerald' : 'blue';

  if (!booted) {
    return (
      <BootView
        onBootComplete={() => setBooted(true)}
        accentColor={settings.accentColor}
      />
    );
  }

  return (
    <div className="flex h-screen bg-[#050505] text-slate-200 overflow-hidden font-sans">
      {/* 1. Desktop Sidebar Navigation */}
      <div className="hidden md:block flex-shrink-0">
        <Sidebar />
      </div>

      {/* 2. Main Terminal Content Container Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        {/* Background Ambient Glow */}
        <div className={`absolute top-0 right-0 w-96 h-96 rounded-full filter blur-3xl opacity-5 pointer-events-none transition-colors ${
          accentColor === 'emerald' ? 'bg-emerald-500' : 'bg-blue-500'
        }`} />

        {/* Mobile Header Bar */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-[#050505]/90 backdrop-blur z-30">
          <div className="flex items-center space-x-2">
            <div className={`h-8 w-8 rounded flex items-center justify-center border bg-zinc-950 px-1 ${
              accentColor === 'emerald' ? 'border-emerald-500/30 text-emerald-400' : 'border-blue-500/30 text-blue-400'
            }`}>
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <span className="font-display font-black text-sm tracking-widest text-white">LOCKIN</span>
              <span className="block font-mono text-[8px] text-zinc-500 leading-none">//{profile.handle}</span>
            </div>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 border border-white/10 bg-[#080808] rounded text-zinc-400 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </header>

        {/* Mobile Slide-down Full Screen Nav Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-[57px] bottom-0 bg-[#050505]/95 backdrop-blur-lg z-40 border-t border-white/5 flex flex-col p-6 space-y-6">
            <span className="font-mono text-[9px] text-zinc-500 tracking-wider block uppercase border-b border-white/5 pb-2">
              // STATION SYSTEMS DIRECTORY
            </span>
            <nav className="flex flex-col space-y-1">
              {[
                { id: 'dashboard', label: 'DASHBOARD' },
                { id: 'console', label: 'LOCK-IN CONSOLE' },
                { id: 'tasks', label: 'DAILY COMMITMENTS' },
                { id: 'weekly', label: 'WEEKLY SCHEMATIC' },
                { id: 'analytics', label: 'DISCIPLINE INDEX' },
                { id: 'journal', label: 'REFLECTION LOGS' },
                { id: 'settings', label: 'SYSTEM CONFIG' },
              ].map((item) => {
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left p-3.5 font-mono text-xs rounded transition-all flex items-center justify-between ${
                      isActive
                        ? 'bg-white/5 border border-white/10 text-white font-bold'
                        : 'text-zinc-500 bg-zinc-950/30'
                    }`}
                  >
                    <span>{item.label}</span>
                    <Zap className={`h-3 w-3 ${isActive ? (accentColor === 'emerald' ? 'text-emerald-400' : 'text-blue-400') : 'text-zinc-800'}`} />
                  </button>
                );
              })}
            </nav>

            <div className="pt-6 border-t border-white/5 mt-auto text-center font-mono text-[9px] text-zinc-600">
              STATION ONLINE // DISCIPLINE OVER MOTIVATION
            </div>
          </div>
        )}

        {/* View render hub */}
        <main className="flex-1 overflow-y-auto scrollbar-thin scroll-smooth relative z-10">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LockInProvider>
      <AppContent />
    </LockInProvider>
  );
}
