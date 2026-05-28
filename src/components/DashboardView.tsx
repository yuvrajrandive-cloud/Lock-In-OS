/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { useLockIn } from '../context/LockInContext';
import {
  Shield,
  Clock,
  CheckCircle2,
  TrendingUp,
  Award,
  Calendar,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

export default function DashboardView() {
  const { profile, stats, tasks, journal, sessions, setCurrentView, settings } = useLockIn();

  const accentColor = settings.accentColor === 'green' ? 'emerald' : 'blue';
  
  // Computed values
  const todayTasks = tasks;
  const completedTodayTasks = todayTasks.filter((t) => t.completed);
  const taskProgressPercent = todayTasks.length > 0 
    ? Math.round((completedTodayTasks.length / todayTasks.length) * 100)
    : 0;

  // Total logged minutes today
  const todayStr = '2026-05-28';
  const todaySessions = sessions.filter(
    (s) => s.wasCompleted && s.timestamp.startsWith(todayStr)
  );
  const todayMinutes = todaySessions.reduce((sum, s) => sum + s.durationMinutes, 0);
  const targetMinutes = profile.targetFocusHours * 60;
  const targetProgressPercent = Math.min(100, Math.round((todayMinutes / targetMinutes) * 100));

  // Get recent journal entry
  const recentJournal = journal.length > 0 ? journal[0] : null;

  // Greeting based on static time in metadata (16:16 is late afternoon / evening or general UTC)
  const greeting = "SYSTEM SECURE // INITIALIZED";

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 fade-in-blur">
      {/* Top Welcome / Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-6">
        <div>
          <span className="font-mono text-[10px] text-white/30 uppercase tracking-[0.2em]">// PERSONAL COMMAND</span>
          <h1 className="font-display text-3xl font-light text-white tracking-tight mt-1">
            Welcome back, <span className="font-semibold text-white">{profile.name}</span>.
          </h1>
          <p className="font-mono text-xs text-white/40 mt-2 max-w-lg">
            Discipline is the engine of progression. Today's execution metrics are calibrated. Avoid distractions, lock in, and sustain high cognitive focus.
          </p>
        </div>
        <div className="mt-4 md:mt-0 font-mono text-[11px] text-white/40 border border-white/5 bg-white/5 p-3.5 rounded-xl flex items-center space-x-3">
          <Calendar className="h-3.5 w-3.5 text-white/40" />
          <div>
            <div>UTC: 2026-05-28</div>
            <div className="text-[9px] text-white/20">COORDINATED SESSION TIMELINE</div>
          </div>
        </div>
      </div>

      {/* Hero OS Status Panel */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] p-1 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />

        <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className={`h-2 h-2 w-2 rounded-full ${accentColor === 'emerald' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-blue-500 shadow-[0_0_8px_#3b82f6]'} animate-pulse`} />
              <span className="font-mono text-[10px] text-white/40 tracking-[0.2em] uppercase">[ STATION_ONLINE ]</span>
            </div>
            <div className="font-display text-4xl font-light text-white tracking-tight">
              Current Mission: <span className="font-semibold uppercase text-white">ACTIVE</span>
            </div>
            <div className="font-mono text-xs text-white/40 space-y-1.5 pt-2">
              <div>• Operational Consistency Score: <span className="text-white font-bold">{stats.consistencyScore}%</span></div>
              <div>• Active Unbroken Streak: <span className={accentColor === 'emerald' ? 'text-emerald-400 font-bold' : 'text-blue-400 font-bold'}>{stats.focusStreak} DAYS</span></div>
              <div>• Targeted Daily Focus Time: <span className="text-white font-bold">{profile.targetFocusHours} HOURS</span></div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setCurrentView('console')}
              className="px-6 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-full hover:bg-slate-200 transition-colors flex items-center space-x-2 cursor-pointer"
            >
              <Shield className="h-3.5 w-3.5 stroke-[2.5px]" />
              <span>PAUSE / RESUME STATION</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bento Grid Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1: Focus Ring */}
        <div className="rounded-2xl border border-white/5 bg-[#080808] p-6 flex flex-col justify-between space-y-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-white/40 uppercase tracking-widest font-semibold">Focus Duration</span>
            <Clock className="h-4 w-4 text-white/30" />
          </div>
          <div className="flex items-center space-x-6">
            <div className="relative h-20 w-20 flex-shrink-0 flex items-center justify-center">
              <svg className="absolute inset-0 h-full w-full rotate-270 transform">
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke="rgba(255, 255, 255, 0.04)"
                  strokeWidth="5"
                  fill="transparent"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke={accentColor === 'emerald' ? '#10b981' : '#3b82f6'}
                  strokeWidth="5"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 34}
                  strokeDashoffset={2 * Math.PI * 34 * (1 - targetProgressPercent / 100)}
                />
              </svg>
              <span className="font-mono text-xs font-bold text-white">{targetProgressPercent}%</span>
            </div>
            <div>
              <span className="font-display font-light text-3xl text-white">{todayMinutes}<span className="text-sm font-mono text-white/45 ml-0.5">m</span></span>
              <span className="block font-mono text-[9px] text-white/30 mt-1 uppercase tracking-wider">
                OF {targetMinutes}m DAILY GOAL
              </span>
            </div>
          </div>
        </div>

        {/* Metric 2: Completed Tasks */}
        <div className="rounded-2xl border border-white/5 bg-[#080808] p-6 flex flex-col justify-between space-y-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-white/40 uppercase tracking-widest font-semibold">Task Clear Rate</span>
            <CheckCircle2 className="h-4 w-4 text-white/30" />
          </div>
          <div className="flex items-center space-x-6">
            <div className="relative h-20 w-20 flex-shrink-0 flex items-center justify-center">
              <svg className="absolute inset-0 h-full w-full rotate-270 transform">
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke="rgba(255, 255, 255, 0.04)"
                  strokeWidth="5"
                  fill="transparent"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke={accentColor === 'emerald' ? '#10b981' : '#3b82f6'}
                  strokeWidth="5"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 34}
                  strokeDashoffset={2 * Math.PI * 34 * (1 - taskProgressPercent / 100)}
                />
              </svg>
              <span className="font-mono text-xs font-bold text-white">{taskProgressPercent}%</span>
            </div>
            <div>
              <span className="font-display font-light text-3xl text-white">
                {completedTodayTasks.length}<span className="text-[#333] font-mono text-lg mx-1">/</span><span className="text-white/60 font-mono text-xl">{todayTasks.length}</span>
              </span>
              <span className="block font-mono text-[9px] text-white/30 mt-1 uppercase tracking-wider">
                TASKS EXECUTED TODAY
              </span>
            </div>
          </div>
        </div>

        {/* Metric 3: Consistency Indicator */}
        <div className="rounded-2xl border border-white/5 bg-[#080808] p-6 flex flex-col justify-between space-y-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-white/40 uppercase tracking-widest font-semibold">Strength Matrix</span>
            <TrendingUp className="h-4 w-4 text-white/30" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-baseline space-x-2">
                <span className="font-display font-light text-4xl text-white">
                  {stats.consistencyScore}%
                </span>
                <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold tracking-wider">STABLE</span>
              </div>
              <span className="block font-mono text-[9px] text-white/30 mt-2 uppercase tracking-wider">
                STABILIZED INDEX ACROSS 30D
              </span>
            </div>
            <div className={`p-3 rounded-full border bg-white/5 border-white/10 ${
              accentColor === 'emerald' ? 'text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.15)]' : 'text-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.15)]'
            }`}>
              <Award className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Layout - Tasks & Journal Dual Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column: Quick Actions / Tasks */}
        <div className="rounded-2xl border border-white/5 bg-[#080808]/40 p-6 space-y-4 flex flex-col shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <span className="font-mono text-xs text-white/60 font-bold uppercase tracking-wider">
              Outstanding Commitments
            </span>
            <button
              onClick={() => setCurrentView('tasks')}
              className="font-mono text-[10px] text-white/40 hover:text-white flex items-center space-x-1 transition-colors cursor-pointer"
            >
              <span>MANAGE ALL</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          <div className="space-y-2 flex-grow">
            {todayTasks.filter((t) => !t.completed).slice(0, 4).length === 0 ? (
              <div className="text-center py-8">
                <p className="font-mono text-xs text-white/30">No outstanding commitments for today.</p>
                <button
                  onClick={() => setCurrentView('tasks')}
                  className="mt-3 font-mono text-[10px] border border-white/10 px-4 py-1.5 text-white/60 hover:text-white rounded-full bg-white/5 transition-colors cursor-pointer"
                >
                  Create Task
                </button>
              </div>
            ) : (
              todayTasks
                .filter((t) => !t.completed)
                .slice(0, 4)
                .map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#080808]/80 border border-white/5 hover:border-white/10 transition-all font-mono text-xs"
                  >
                    <div className="flex items-center space-x-3">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        task.priority === 'high' ? 'bg-rose-500 shadow-[0_0_6px_#f43f5e]' : task.priority === 'medium' ? 'bg-amber-400 shadow-[0_0_6px_#fbbf24]' : 'bg-white/20'
                      }`} />
                      <span className="text-white/80 limit-lines-1">{task.title}</span>
                    </div>
                    {task.streak > 0 && (
                      <span className="text-[10px] text-white/40 bg-white/5 border border-white/5 px-2 py-0.5 rounded-md">
                        STREAK: {task.streak}🔥
                      </span>
                    )}
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Right column: Recent Journal Log */}
        <div className="rounded-2xl border border-white/5 bg-[#080808]/40 p-6 space-y-4 flex flex-col shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <span className="font-mono text-xs text-white/60 font-bold uppercase tracking-wider">
              Last Reflection Log
            </span>
            <button
              onClick={() => setCurrentView('journal')}
              className="font-mono text-[10px] text-white/40 hover:text-white flex items-center space-x-1 transition-colors cursor-pointer"
            >
              <span>JOURNAL</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          <div className="flex-grow flex flex-col justify-between">
            {recentJournal ? (
              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-white/30 text-[10px]">
                  <span>{recentJournal.code} // REGISTERED AT {recentJournal.date}</span>
                  <span className={`px-2 py-0.5 rounded ${
                    accentColor === 'emerald' ? 'bg-emerald-950/40 text-emerald-400' : 'bg-blue-950/40 text-blue-400'
                  }`}>
                    FOCUS: {recentJournal.focusScore}/10
                  </span>
                </div>
                <blockquote className="text-white/60 italic bg-white/5 border-l-2 border-white/10 p-3.5 rounded-r-xl">
                  "{recentJournal.entryText.length > 140 ? `${recentJournal.entryText.slice(0, 140)}...` : recentJournal.entryText}"
                </blockquote>
                <div className="text-[11px] space-y-1">
                  <div className="text-white/40">
                    <span className="text-white/50 mr-2 uppercase text-[9px] tracking-wider">TOMORROW ACTION:</span>
                    <span className="text-white/80">{recentJournal.tomorrowActionText}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 my-auto">
                <BookOpen className="h-5 w-5 mx-auto text-white/20 mb-2" />
                <p className="font-mono text-xs text-white/30">No journal logs filed in this station database.</p>
                <button
                  onClick={() => setCurrentView('journal')}
                  className="mt-3 font-mono text-[10px] border border-white/10 px-4 py-1.5 text-white/60 hover:text-white rounded-full bg-white/5 transition-colors cursor-pointer"
                >
                  Write Post-Day Summary
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
