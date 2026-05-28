/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { useLockIn } from '../context/LockInContext';
import { Plus, Trash, RotateCcw, Flame, Check, ShieldAlert, AlertCircle } from 'lucide-react';

export default function DailyTasks() {
  const { tasks, addTask, toggleTask, deleteTask, resetDailyTasks, settings } = useLockIn();
  const [taskTitle, setTaskTitle] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');

  const activeAccent = settings.accentColor === 'green' ? 'emerald' : 'blue';

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleAddTask = (e: FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    addTask(taskTitle.trim(), priority, dueDate || undefined);
    setTaskTitle('');
    setDueDate('');
  };

  const priorityStyles = {
    high: { border: 'border-rose-950/20 bg-rose-950/5', text: 'text-rose-400', badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
    medium: { border: 'border-amber-950/20 bg-amber-950/5', text: 'text-amber-400', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    low: { border: 'border-white/5 bg-white/2', text: 'text-white/40', badge: 'bg-white/5 text-white/50 border-white/5' },
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 fade-in-blur">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-5 gap-4">
        <div>
          <span className="font-mono text-[10px] text-white/30 uppercase tracking-[0.2em]">// EXECUTION QUEUE</span>
          <h1 className="font-display text-2xl font-light text-white tracking-tight mt-1">Daily Commitments</h1>
        </div>

        {/* Action Header Stats */}
        <div className="flex items-center space-x-6">
          <div className="text-right font-mono">
            <span className="block text-[9px] text-white/30 uppercase tracking-wider">QUEUE RESOLUTION STATE</span>
            <span className="text-xs text-white/50 font-bold uppercase">
              {completedCount}/{totalCount} DONE ({progressPercent}%)
            </span>
          </div>
          <button
            onClick={() => {
              if (confirm('Verify: Reset execution states for all daily tasks? Streaks will remain intact.')) {
                resetDailyTasks();
              }
            }}
            className="flex items-center space-x-2 border border-white/10 bg-white/5 text-white/50 hover:text-white px-3.5 py-1.5 rounded-lg text-xs transition-colors font-mono cursor-pointer"
            title="Reset Completed Statuses"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden md:inline">RESET DAILIES</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Form Section */}
        <div className="md:col-span-1">
          <form onSubmit={handleAddTask} className="rounded-2xl border border-white/5 bg-[#080808] p-5 space-y-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]">
            <span className="block font-mono text-[10px] text-white/30 uppercase tracking-widest">
              // ADD COMMITMENT
            </span>

            {/* Title */}
            <div>
              <label className="block font-mono text-[10px] text-white/50 tracking-wider mb-1.5">TASK TITLE</label>
              <input
                type="text"
                required
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Declare single target (e.g., Code API)"
                className="w-full p-2.5 font-mono text-xs bg-white/2 border border-white/5 rounded-lg text-white placeholder-white/20 outline-none focus:border-white/20 transition-colors"
              />
            </div>

            {/* Priority selection */}
            <div>
              <label className="block font-mono text-[10px] text-white/50 tracking-wider mb-1.5">DISCIPLINE LEVEL (PRIORITY)</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['low', 'medium', 'high'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-2 text-[10px] rounded-lg border font-mono tracking-wider text-center uppercase transition-all cursor-pointer ${
                      priority === p
                        ? p === 'high'
                          ? 'border-rose-500/30 bg-rose-950/20 text-rose-300 font-bold shadow-[0_0_8px_rgba(244,63,94,0.1)]'
                          : p === 'medium'
                          ? 'border-amber-500/30 bg-amber-950/20 text-amber-300 font-bold shadow-[0_0_8px_rgba(245,158,11,0.1)]'
                          : 'border-white/20 bg-white/10 text-white font-bold'
                        : 'border-white/5 bg-white/2 text-white/30 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Due Date (Optional) */}
            <div>
              <label className="block font-mono text-[10px] text-white/50 tracking-wider mb-1.5 font-mono">DEADLINE MATRIX</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2.5 font-mono text-xs bg-white/2 border border-white/5 rounded-lg text-white outline-none focus:border-white/20 transition-colors"
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full py-2.5 rounded-full bg-white text-black font-mono text-xs font-bold uppercase tracking-widest hover:bg-slate-200 transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            >
              <Plus className="h-4 w-4 stroke-[3px]" />
              <span>COMMIT TO QUEUE</span>
            </button>
          </form>
        </div>

        {/* Right Column: Active queue list */}
        <div className="md:col-span-2 space-y-4">
          {/* Progress Slider Display */}
          <div className="rounded-2xl border border-white/5 bg-[#080808] p-4 shadow-[inset_0_1px_rgba(255,255,255,0.02)]">
            <div className="flex justify-between items-center font-mono text-[10px] text-white/30 mb-2">
              <span>OVERALL RECEPTOR LEVEL</span>
              <span>{progressPercent}% RESOLVED</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-700 ${
                  activeAccent === 'emerald' ? 'bg-emerald-500' : 'bg-blue-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            {tasks.length === 0 ? (
              <div className="text-center py-16 rounded-2xl border border-white/5 bg-[#080808] p-8 space-y-2">
                <AlertCircle className="h-6 w-6 text-white/10 mx-auto" />
                <h3 className="font-display text-sm font-semibold text-white/50">Your commitments list is empty.</h3>
                <p className="font-mono text-xs text-white/20 max-w-sm mx-auto">
                  Add high-intensity tasks left to build, code, train, or read. High performance starts with clean target specifications.
                </p>
              </div>
            ) : (
              tasks.map((task) => {
                const style = priorityStyles[task.priority];
                return (
                  <div
                    key={task.id}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                      task.completed
                        ? 'border-white/5 bg-white/2 opacity-35'
                        : 'border-white/5 bg-[#080808] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]'
                    }`}
                  >
                    <div className="flex items-center space-x-4 flex-grow min-w-0 pr-4">
                      {/* Interactive Custom Checkbox */}
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`h-5 w-5 rounded-lg border flex items-center justify-center transition-all flex-shrink-0 cursor-pointer ${
                          task.completed
                            ? activeAccent === 'emerald'
                              ? 'border-emerald-500 bg-emerald-500 text-black'
                              : 'border-blue-500 bg-blue-500 text-black'
                            : 'border-white/10 bg-white/2 hover:border-white/30'
                        }`}
                      >
                        {task.completed && <Check className="h-3.5 w-3.5 stroke-[3px]" />}
                      </button>

                      {/* Title & Priority labels */}
                      <div className="min-w-0">
                        <span
                          className={`block font-mono text-xs truncate ${
                            task.completed ? 'line-through text-white/30' : 'text-white/80'
                          }`}
                        >
                          {task.title}
                        </span>
                        
                        <div className="flex items-center gap-2 mt-1.5">
                          {/* Priority badge */}
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono tracking-widest border font-bold uppercase ${style.badge}`}>
                            {task.priority}
                          </span>
                          
                          {/* Due date if exists */}
                          {task.dueDate && (
                            <span className="text-[9px] font-mono text-white/30">
                              DUE: {task.dueDate}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right action details */}
                    <div className="flex items-center space-x-4">
                      {/* Flame Streaks */}
                      {task.streak > 0 && (
                        <div className="flex items-center space-x-1 font-mono text-[10px] text-white/40 border border-white/5 bg-white/2 px-2 py-1 rounded" title={`${task.streak} unbroken completion cycles`}>
                          <Flame className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
                          <span>{task.streak}x</span>
                        </div>
                      )}

                      {/* Trash Button */}
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-white/20 hover:text-rose-500 p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                        title="Discard from system"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
