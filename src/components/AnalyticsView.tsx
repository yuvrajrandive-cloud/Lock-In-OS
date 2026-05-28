/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useLockIn } from '../context/LockInContext';
import { BarChart2, Calendar, Flame, TrendingUp, Compass, Award, Clock } from 'lucide-react';

export default function AnalyticsView() {
  const { stats, sessions, journal, tasks, settings } = useLockIn();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const activeAccent = settings.accentColor === 'green' ? 'emerald' : 'blue';

  // 1. Weekly hours analytics data
  const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  // Mock logged hours for the current week starting Mon May 25 to Sun May 31
  // Mon: 105 mins, Tue: 105 mins, Wed: 120 mins, Thu: current (today), Fri/Sat/Sun: 0 or upcoming
  const todayStr = '2026-05-28';
  const todayMins = sessions
    .filter((s) => s.wasCompleted && s.timestamp.startsWith(todayStr))
    .reduce((sum, s) => sum + s.durationMinutes, 0);

  const dailyMinutesMap = {
    MON: 105, // May 25
    TUE: 75,  // May 26
    WED: 120, // May 27
    THU: todayMins, // May 28 (today)
    FRI: 0,
    SAT: 0,
    SUN: 0,
  };

  const maxMinutes = Math.max(...Object.values(dailyMinutesMap), 120);

  // 2. Heatmap Grid Construction
  // Generate a matrix representing grid blocks: 12 weeks of 7 days
  const cols = 22; // 22 weeks of grid
  const rows = 7;
  
  // Create an array representing 154 grid squares
  // We can simulate dates going backwards from May 28, 2026
  const gridCells = Array.from({ length: cols * rows }).map((_, idx) => {
    // Generate an intensity [0, 1, 2, 3] depending on mock active logs
    // Make weekends lower, or alternate weeks to look like an extremely motivating, real journey!
    let level = 0;
    const colIdx = Math.floor(idx / rows);
    const rowIdx = idx % rows;
    
    // Simulate real logs: older cells have high consistency except occasional breaks
    // Row/col conditions to create a beautiful, organic looking heatmap
    if ((colIdx + rowIdx) % 3 === 0) level = 1;
    if ((colIdx * rowIdx) % 5 === 2) level = 2;
    if ((colIdx - rowIdx) % 7 === 1) level = 3;
    if (colIdx > 18) {
      level = 0; // Approaching end of month
    }
    // High intensity yesterday/today
    if (colIdx === 20 && rowIdx === 3) level = 3; // Wed
    if (colIdx === 20 && rowIdx === 4) level = todayMins > 0 ? (todayMins > 45 ? 3 : 2) : 0; // Thu (today)

    return {
      index: idx,
      level,
      col: colIdx,
      row: rowIdx,
    };
  });

  // Level fill map
  const getLevelColor = (level: number) => {
    if (activeAccent === 'emerald') {
      switch (level) {
        case 1: return 'bg-emerald-950/20 border-emerald-500/10';
        case 2: return 'bg-emerald-500/20 border-emerald-500/30';
        case 3: return 'bg-emerald-500/50 border-emerald-500/60';
        case 4: return 'bg-emerald-500 border-emerald-400';
        default: return 'bg-white/2 border-white/5';
      }
    } else {
      switch (level) {
        case 1: return 'bg-blue-950/20 border-blue-500/10';
        case 2: return 'bg-blue-500/20 border-blue-500/30';
        case 3: return 'bg-blue-500/50 border-blue-500/60';
        case 4: return 'bg-blue-500 border-blue-400';
        default: return 'bg-white/2 border-white/5';
      }
    }
  };

  const completedTasks = tasks.filter((t) => t.completed).length;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 fade-in-blur">
      {/* View Header */}
      <div className="flex justify-between items-start border-b border-white/5 pb-5">
        <div>
          <span className="font-mono text-[10px] text-white/30 uppercase tracking-[0.2em]">// COGNITIVE ANALYTICS</span>
          <h1 className="font-display text-2xl font-light text-white tracking-tight mt-1">Discipline Logs</h1>
        </div>
      </div>

      {/* Grid: Consistency metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
        {/* Metric A */}
        <div className="p-5 border border-white/5 bg-[#080808] rounded-2xl flex items-center space-x-4 shadow-[inset_0_1px_rgba(255,255,255,0.02)]">
          <div className={`p-2.5 rounded-xl border bg-white/2 ${
            activeAccent === 'emerald' ? 'border-emerald-500/20 text-emerald-400' : 'border-blue-500/20 text-blue-400'
          }`}>
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-[8px] text-white/30 tracking-wider">UNBROKEN CYCLE</span>
            <span className="text-lg font-semibold text-white">{stats.focusStreak} DAYS</span>
          </div>
        </div>

        {/* Metric B */}
        <div className="p-5 border border-white/5 bg-[#080808] rounded-2xl flex items-center space-x-4 shadow-[inset_0_1px_rgba(255,255,255,0.02)]">
          <div className={`p-2.5 rounded-xl border bg-white/2 ${
            activeAccent === 'emerald' ? 'border-emerald-500/20 text-emerald-400' : 'border-blue-500/20 text-blue-400'
          }`}>
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-[8px] text-white/30 tracking-wider">TOTAL WORK HOURS</span>
            <span className="text-lg font-semibold text-white">
              {Math.round(stats.totalMinutesLockedIn / 60)} HOURS
            </span>
          </div>
        </div>

        {/* Metric C */}
        <div className="p-5 border border-white/5 bg-[#080808] rounded-2xl flex items-center space-x-4 shadow-[inset_0_1px_rgba(255,255,255,0.02)]">
          <div className={`p-2.5 rounded-xl border bg-white/2 ${
            activeAccent === 'emerald' ? 'border-emerald-500/20 text-emerald-400' : 'border-blue-500/20 text-blue-400'
          }`}>
            <BarChart2 className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-[8px] text-white/30 tracking-wider">RESOLVED RATIO</span>
            <span className="text-lg font-semibold text-white">
              {completedTasks}/{tasks.length} TASKS
            </span>
          </div>
        </div>

        {/* Metric D */}
        <div className="p-5 border border-white/5 bg-[#080808] rounded-2xl flex items-center space-x-4 shadow-[inset_0_1px_rgba(255,255,255,0.02)]">
          <div className={`p-2.5 rounded-xl border bg-white/2 ${
            activeAccent === 'emerald' ? 'border-emerald-500/20 text-emerald-400' : 'border-blue-500/20 text-blue-400'
          }`}>
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-[8px] text-white/30 tracking-wider">REFLECTION CO-EFFICIENT</span>
            <span className="text-lg font-semibold text-white">{journal.length} RECORDS</span>
          </div>
        </div>
      </div>

      {/* Main analytics row: Chart Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Core Line Chart (SVG Mode for maximum reliability and gorgeous style) */}
        <div className="md:col-span-2 rounded-2xl border border-white/5 bg-[#080808] p-6 flex flex-col justify-between space-y-4 shadow-[inset_0_1px_rgba(255,255,255,0.02)]">
          <div>
            <span className="block font-mono text-[9px] text-white/30 uppercase tracking-widest">// CHRONOLOGICAL RATINGS</span>
            <h3 className="font-display font-semibold text-white tracking-tight text-sm mt-1">Focus Frequency Index</h3>
          </div>

          {/* SVG Rendering */}
          <div className="relative h-48 w-full flex items-end">
            {/* Grid Lines */}
            <div className="absolute inset-x-0 bottom-0 h-full flex flex-col justify-between border-b border-white/5 pointer-events-none pb-5">
              <div className="border-t border-white/5 w-full" />
              <div className="border-t border-white/5 w-full" />
              <div className="border-t border-white/5 w-full" />
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="w-full flex justify-between items-end h-36 relative z-10 px-4">
              {weekDays.map((day, i) => {
                const mins = dailyMinutesMap[day as keyof typeof dailyMinutesMap] || 0;
                const pct = maxMinutes > 0 ? (mins / maxMinutes) * 100 : 0;
                const isHovered = hoveredIdx === i;

                return (
                  <div
                    key={day}
                    className="flex flex-col items-center flex-1 h-full justify-end group cursor-pointer relative"
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  >
                    {/* Tooltip */}
                    {isHovered && (
                      <div className="absolute -top-10 bg-[#0d0d11] border border-white/15 text-white font-mono text-[9px] px-2 py-1 rounded-lg shadow-xl z-25">
                        {mins} MINS
                      </div>
                    )}

                    {/* Minimalist Bar Element */}
                    <div className="w-6 bg-white/2 rounded-t-lg border border-white/5 h-full flex items-end overflow-hidden transition-all group-hover:border-white/15">
                      <div
                        className={`w-full transition-all duration-1000 ${
                          activeAccent === 'emerald'
                            ? 'bg-gradient-to-t from-emerald-950/90 to-emerald-500'
                            : 'bg-gradient-to-t from-blue-950/90 to-blue-500'
                        }`}
                        style={{ height: `${pct || 4}%` }}
                      />
                    </div>

                    <span className="block font-mono text-[9px] text-white/30 mt-3 group-hover:text-white/50">
                      {day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dynamic Consistency Rate Radial */}
        <div className="rounded-2xl border border-white/5 bg-[#080808] p-6 flex flex-col justify-between shadow-[inset_0_1px_rgba(255,255,255,0.02)]">
          <div>
            <span className="block font-mono text-[9px] text-white/30 uppercase tracking-widest">// CENSUS SCORE</span>
            <h3 className="font-display font-semibold text-white tracking-tight text-sm mt-1">Consistency Level</h3>
          </div>

          <div className="flex flex-col items-center py-4 space-y-4">
            <div className="relative h-28 w-28 flex items-center justify-center">
              <svg className="absolute inset-0 h-full w-full rotate-270 transform">
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  stroke="rgba(255,255,255,0.03)"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  stroke={activeAccent === 'emerald' ? '#10b981' : '#3b82f6'}
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 48}
                  strokeDashoffset={2 * Math.PI * 48 * (1 - stats.consistencyScore / 100)}
                />
              </svg>
              <span className="font-mono text-xl font-bold text-white">{stats.consistencyScore}%</span>
            </div>
            
            <div className="text-center font-mono">
              <span className="block text-[9px] text-white/30">LEVEL EVALUATED</span>
              <p className="text-[10px] text-white/40 mt-1 max-w-xs leading-relaxed">
                Refined algorithmic evaluation measuring daily sessions matching goals vs bypassed dates.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Consistency Heatmap Grid (Cinematic representation) */}
      <div className="rounded-2xl border border-white/5 bg-[#080808] p-6 space-y-4 shadow-[inset_0_1px_rgba(255,255,255,0.02)]">
        <div className="flex justify-between items-center">
          <div>
            <span className="block font-mono text-[9px] text-white/30 uppercase tracking-widest">// SYNC TIMELINE SCHEMA</span>
            <h3 className="font-display font-semibold text-white tracking-tight text-sm mt-1">Unbroken Consistency Grid</h3>
          </div>
          <div className="flex items-center space-x-2 font-mono text-[9px] text-white/30">
            <span>LESS</span>
            <div className="w-2.5 h-2.5 bg-white/2 border border-white/5" />
            <div className={`w-2.5 h-2.5 ${activeAccent === 'emerald' ? 'bg-emerald-950/20 border-emerald-500/15' : 'bg-blue-950/20 border-blue-500/15'}`} />
            <div className={`w-2.5 h-2.5 ${activeAccent === 'emerald' ? 'bg-emerald-500/30 border-emerald-500/40' : 'bg-blue-500/30 border-blue-500/40'}`} />
            <div className={`w-2.5 h-2.5 ${activeAccent === 'emerald' ? 'bg-emerald-500 border-emerald-400' : 'bg-blue-500 border-blue-400'}`} />
            <span>MORE</span>
          </div>
        </div>

        {/* Heatmap Visual Matrix Container */}
        <div className="overflow-x-auto pt-2 scrollbar-thin">
          <div className="grid grid-flow-col gap-1.5 h-28 min-w-max">
            {Array.from({ length: cols }).map((_, colIdx) => (
              <div key={colIdx} className="grid grid-rows-7 gap-1.5">
                {Array.from({ length: rows }).map((_, rowIdx) => {
                  const cellIdx = colIdx * rows + rowIdx;
                  const cell = gridCells[cellIdx];
                  return (
                    <div
                      key={rowIdx}
                      className={`h-2.5 w-2.5 rounded border transition-all hover:scale-125 hover:z-10 ${getLevelColor(
                        cell?.level || 0
                      )}`}
                      title={`Week Cell ${colIdx + 1}, Day ${rowIdx + 1}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between font-mono text-[8px] text-white/30 px-2 pt-1 border-t border-white/5">
          <span>Q1 2026 // CORES ACTIVE</span>
          <span>MAY 28, 2026</span>
        </div>
      </div>
    </div>
  );
}
