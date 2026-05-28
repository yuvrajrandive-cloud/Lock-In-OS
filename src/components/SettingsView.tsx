/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { useLockIn } from '../context/LockInContext';
import { StorageAPI } from '../utils/storage';
import {
  Save,
  RotateCcw,
  Download,
  Database,
  User,
  Volume2,
  Clock,
  Sparkles,
  Link,
  Sliders,
  Check,
} from 'lucide-react';

export default function SettingsView() {
  const {
    profile,
    updateProfile,
    settings,
    updateSettings,
    syncToSupabase,
  } = useLockIn();

  // Profile Form States
  const [name, setName] = useState(profile.name);
  const [handle, setHandle] = useState(profile.handle);
  const [targetFocusHours, setTargetFocusHours] = useState(profile.targetFocusHours);

  // Settings Form States
  const [focusDuration, setFocusDuration] = useState(settings.focusTimerDuration);
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled);
  const [accentColor, setAccentColor] = useState<'blue' | 'green'>(settings.accentColor);

  // Supabase states
  const [supabaseUrl, setSupabaseUrl] = useState(settings.supabaseUrl);
  const [supabaseKey, setSupabaseKey] = useState(settings.supabaseKey);
  const [syncEnabled, setSyncEnabled] = useState(settings.syncEnabled);

  // Status variables
  const [saveState, setSaveState] = useState('');
  const [syncState, setSyncState] = useState('');

  const activeAccent = settings.accentColor === 'green' ? 'emerald' : 'blue';

  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      handle: handle.trim().toUpperCase().replace(/\s+/g, '_'),
      targetFocusHours,
    });
    setSaveState('PROFILE PERSISTED');
    setTimeout(() => setSaveState(''), 3000);
  };

  const handleSavePreferences = (e: FormEvent) => {
    e.preventDefault();
    updateSettings({
      focusTimerDuration: focusDuration,
      soundEnabled,
      accentColor,
    });
    setSaveState('PREFERENCES COMMITTED');
    setTimeout(() => setSaveState(''), 3000);
  };

  const handleSaveSupabase = async (e: FormEvent) => {
    e.preventDefault();
    setSyncState('INITIALISING SYNCHRONOUS PROTOCOL...');
    
    // Save locally first
    updateSettings({
      supabaseUrl,
      supabaseKey,
      syncEnabled,
    });

    const res = await syncToSupabase();
    if (res.success) {
      setSyncState(res.message);
    } else {
      setSyncState(`FAIL: ${res.message}`);
    }
  };

  const handleExportData = () => {
    try {
      const allData = {
        profile,
        settings,
        tasks: StorageAPI.getTasks(),
        sessions: StorageAPI.getSessions(),
        journal: StorageAPI.getJournal(),
        stats: StorageAPI.getStats(),
      };
      const jsonStr = JSON.stringify(allData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `lockin_os_data_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error(e);
      alert('Failed to export filesystem parameters.');
    }
  };

  const handleResetData = () => {
    if (
      confirm(
        'CRITICAL ACTION REQUIRED:\nThis will permanently format all system data, active statistics, journal entries, and task queues back to zero.\n\nAre you absolutely sure?'
      )
    ) {
      StorageAPI.resetAll();
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 fade-in-blur">
      {/* View Header */}
      <div className="flex justify-between items-start border-b border-white/5 pb-5">
        <div>
          <span className="font-mono text-[10px] text-white/30 uppercase tracking-[0.2em]">// DEVIATION COEFFICIENTS</span>
          <h1 className="font-display text-2xl font-light text-white tracking-tight mt-1">System Settings</h1>
        </div>
      </div>

      {saveState && (
        <div className={`p-3 border text-center font-mono text-xs font-semibold rounded-2xl ${
          activeAccent === 'emerald' ? 'border-emerald-500/25 bg-emerald-950/20 text-emerald-400' : 'border-blue-500/25 bg-blue-950/20 text-blue-400'
        }`}>
          {saveState} // STABLE SYSTEM STATE REPERSISTED
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono text-xs">
        {/* Left Column: Profile and System Durations */}
        <div className="space-y-6">
          {/* Form A: User Profile Metadata */}
          <form onSubmit={handleSaveProfile} className="rounded-2xl border border-white/5 bg-[#080808] p-5 space-y-4 shadow-[inset_0_1px_rgba(255,255,255,0.02)]">
            <span className="block font-mono text-[10px] text-white/30 uppercase tracking-[0.1em] flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-white/40" />
              <span>// OPERATOR BIOMETRICS</span>
            </span>

            <div>
              <label className="block text-white/40 mb-1.5">OPERATOR NAME</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 bg-white/2 border border-white/5 rounded-lg text-white outline-none focus:border-white/20 transition-colors"
              />
            </div>

            <div>
              <label className="block text-white/40 mb-1.5">OPERATOR SIGNATURE (HANDLE)</label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/20 font-bold">//</span>
                <input
                  type="text"
                  required
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className="w-full pl-8 pr-2.5 p-2.5 bg-white/2 border border-white/5 rounded-lg text-white outline-none focus:border-white/20 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/40 mb-1.5">DAILY FOCUS TARGET (HOURS)</label>
              <input
                type="number"
                min="1"
                max="24"
                required
                value={targetFocusHours}
                onChange={(e) => setTargetFocusHours(Number(e.target.value))}
                className="w-full p-2.5 bg-white/2 border border-white/5 rounded-lg text-white outline-none focus:border-white/20 transition-colors"
              />
            </div>

            <button
              type="submit"
              className={`w-full py-2.5 rounded-xl font-semibold tracking-wider transition-all flex items-center justify-center space-x-2 border cursor-pointer ${
                activeAccent === 'emerald'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/25'
                  : 'bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/25'
              }`}
            >
              <Save className="h-4 w-4" />
              <span>WRITE BIOMETRICS</span>
            </button>
          </form>

          {/* Form B: Preferences / Accent toggles */}
          <form onSubmit={handleSavePreferences} className="rounded-2xl border border-white/5 bg-[#080808] p-5 space-y-4 shadow-[inset_0_1px_rgba(255,255,255,0.02)]">
            <span className="block font-mono text-[10px] text-white/30 uppercase tracking-[0.1em] flex items-center gap-2">
              <Sliders className="h-3.5 w-3.5 text-white/40" />
              <span>// PREFERENCE SCHEMA</span>
            </span>

            <div>
              <label className="block text-white/40 mb-1.5">TIMER DEFAULT WORK TIME (MINS)</label>
              <div className="grid grid-cols-4 gap-1.5">
                {[15, 30, 45, 60].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFocusDuration(t)}
                    className={`py-2 text-[10px] rounded-lg border text-center transition-all cursor-pointer ${
                      focusDuration === t
                        ? activeAccent === 'emerald'
                          ? 'border-emerald-500/30 bg-emerald-950/20 text-white font-semibold'
                          : 'border-blue-500/30 bg-blue-950/20 text-white font-semibold'
                        : 'border-white/5 bg-transparent text-white/30 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {t}M
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Accents Selection */}
              <div>
                <label className="block text-white/40 mb-1.5">OS CORE THEME ACCENT</label>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setAccentColor('blue')}
                    className={`flex-1 py-1.5 rounded-lg border text-[10px] transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                      accentColor === 'blue'
                        ? 'border-blue-500/30 bg-blue-950/20 text-white font-semibold'
                        : 'border-white/5 text-white/30 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                    <span>CYAN BLUE</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccentColor('green')}
                    className={`flex-1 py-1.5 rounded-lg border text-[10px] transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                      accentColor === 'green'
                        ? 'border-emerald-500/30 bg-emerald-950/20 text-white font-semibold'
                        : 'border-white/5 text-white/30 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span>CYAN GREEN</span>
                  </button>
                </div>
              </div>

              {/* Beats triggers */}
              <div>
                <label className="block text-white/40 mb-1.5">CORE OS AUDIO CHIMES</label>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setSoundEnabled(true)}
                    className={`flex-1 py-1.5 rounded-lg border text-[10px] transition-all cursor-pointer ${
                      soundEnabled ? 'border-white/20 bg-white/10 text-white font-semibold' : 'border-white/5 text-white/30 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    SINE CHIMES
                  </button>
                  <button
                    type="button"
                    onClick={() => setSoundEnabled(false)}
                    className={`flex-1 py-1.5 rounded-lg border text-[10px] transition-all cursor-pointer ${
                      !soundEnabled ? 'border-white/20 bg-white/10 text-white font-semibold' : 'border-white/5 text-white/30 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    MUTED
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-2.5 rounded-xl font-semibold tracking-wider transition-all flex items-center justify-center space-x-2 border cursor-pointer ${
                activeAccent === 'emerald'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/25'
                  : 'bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/25'
              }`}
            >
              <Save className="h-4 w-4" />
              <span>COMMIT PREFERENCES</span>
            </button>
          </form>
        </div>

        {/* Right Column: Database links and Hardware resets */}
        <div className="space-y-6">
          {/* Form C: Database / Supabase Cloud Connector */}
          <form onSubmit={handleSaveSupabase} className="rounded-2xl border border-white/5 bg-[#080808] p-5 space-y-4 shadow-[inset_0_1px_rgba(255,255,255,0.02)]">
            <span className="block font-mono text-[10px] text-white/30 uppercase tracking-[0.1em] flex items-center gap-2">
              <Database className="h-3.5 w-3.5 text-white/40" />
              <span>// SUPABASE CLIENT GATEWAY</span>
            </span>

            <div>
              <label className="block text-white/40 mb-1.5">SUPABASE API ENDPOINT (URL)</label>
              <input
                type="url"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://yourproject.supabase.co"
                className="w-full p-2.5 bg-white/2 border border-white/5 rounded-lg text-white outline-none focus:border-white/20 placeholder-white/10 transition-colors"
              />
            </div>

            <div>
              <label className="block text-white/40 mb-1.5">SUPABASE PUBLIC API KEY (ANON)</label>
              <input
                type="password"
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full p-2.5 bg-white/2 border border-white/5 rounded-lg text-white outline-none focus:border-white/20 placeholder-white/10 transition-colors font-sans text-xs"
              />
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-white/2 border border-white/5">
              <span className="text-white/30">CLOUD STATE SYNC PROXY</span>
              <button
                type="button"
                onClick={() => setSyncEnabled(!syncEnabled)}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all border cursor-pointer ${
                  syncEnabled
                    ? 'border-emerald-500/30 bg-emerald-950/15 text-emerald-400'
                    : 'border-white/5 bg-white/2 text-white/20'
                }`}
              >
                {syncEnabled ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#121214] border border-white/5 text-white/70 hover:text-white rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-[inset_0_1px_rgba(255,255,255,0.02)]"
            >
              <Link className="h-4 w-4 text-white/40" />
              <span>CONNECT AND PROSECUTE SYNC</span>
            </button>

            {syncState && (
              <div className="p-3 bg-white/2 border border-white/5 text-[10px] text-white/40 leading-relaxed rounded-xl break-all">
                {syncState}
              </div>
            )}
          </form>

          {/* Actions D: Standard backups / format utilities */}
          <div className="rounded-2xl border border-white/5 bg-[#080808] p-5 space-y-4 shadow-[inset_0_1px_rgba(255,255,255,0.02)]">
            <span className="block font-mono text-[10px] text-white/30 uppercase tracking-[0.1em] flex items-center gap-2">
              <RotateCcw className="h-3.5 w-3.5 text-white/40" />
              <span>// SYSTEM FORMAT / EXPORTS</span>
            </span>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleExportData}
                type="button"
                className="py-2.5 bg-white/2 hover:bg-white/5 border border-white/5 rounded-xl text-white/70 hover:text-white transition-all flex items-center justify-center space-x-2 cursor-pointer"
                title="Download JSON specifications schema"
              >
                <Download className="h-3.5 w-3.5 text-white/40" />
                <span>BACKUP FILES</span>
              </button>

              <button
                onClick={handleResetData}
                type="button"
                className="py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer"
                title="Erase all local database vectors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>RESET MACHINE</span>
              </button>
            </div>

            <p className="text-[10px] text-white/26 leading-relaxed pt-1.5 border-t border-white/5 font-mono">
              EXPORT FILE SYSTEM: Compiles all registry files, active statistics, daily commitments, and configuration parameters into a secure JSON backup. RESET MACHINE: Purges all cached buffers immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
