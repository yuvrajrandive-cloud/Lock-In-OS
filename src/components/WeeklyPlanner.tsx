/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { useLockIn } from '../context/LockInContext';
import { WeeklyPlan, WeeklyTask } from '../types';
import { 
  Calendar, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Zap, 
  Sparkles, 
  ChevronRight, 
  ArrowDownLeft, 
  AlertCircle,
  Clock,
  LayoutGrid
} from 'lucide-react';

export default function WeeklyPlanner() {
  const { 
    weeklyPlans, 
    addWeeklyPlan, 
    updateWeeklyPlan, 
    importWeeklyTasksToDaily,
    settings 
  } = useLockIn();

  const accentColor = settings.accentColor === 'green' ? 'emerald' : 'blue';

  // State
  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    weeklyPlans.length > 0 ? weeklyPlans[0].id : ''
  );
  const [selectedDayName, setSelectedDayName] = useState<string>('Monday');
  
  // New week planning creation state
  const [newWeekDate, setNewWeekDate] = useState<string>('2026-05-31'); // Sunday
  const [newWeekFocus, setNewWeekFocus] = useState<string>('Mastering high cognitive sessions and systematic execution.');
  const [showAddWeekForm, setShowAddWeekForm] = useState<boolean>(false);

  // New task details for active day
  const [newPlannedTaskTitle, setNewPlannedTaskTitle] = useState<string>('');
  const [newPlannedTaskPriority, setNewPlannedTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');

  // Load active plan
  const activePlan = weeklyPlans.find((p) => p.id === selectedPlanId);

  // Notification states
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Compute next 3 Sundays for quick week choice
  const getUpcomingSundays = () => {
    const dates = [];
    const baseDate = new Date('2026-05-31'); // Next Sunday
    for (let i = 0; i < 4; i++) {
      const nextSunday = new Date(baseDate);
      nextSunday.setDate(baseDate.getDate() + (i * 7));
      const yyyy = nextSunday.getFullYear();
      const mm = String(nextSunday.getMonth() + 1).padStart(2, '0');
      const dd = String(nextSunday.getDate()).padStart(2, '0');
      dates.push(`${yyyy}-${mm}-${dd}`);
    }
    return dates;
  };

  const upcomingSundays = getUpcomingSundays();

  // Create a new week plan
  const handleCreateWeeklyPlan = (e: FormEvent) => {
    e.preventDefault();
    if (weeklyPlans.some((p) => p.id === `week_${newWeekDate}`)) {
      showNotification('SCHEME FAILED: A plan for this week block already exists in the station memory.');
      return;
    }
    addWeeklyPlan(newWeekDate, newWeekFocus);
    setSelectedPlanId(`week_${newWeekDate}`);
    setShowAddWeekForm(false);
    showNotification(`SCHEME ESTABLISHED: Sunday ${newWeekDate} weekly planning schedule initializes.`);
  };

  // Update active week focus
  const handleUpdateMainFocus = (focusText: string) => {
    if (!activePlan) return;
    const updated = {
      ...activePlan,
      mainFocus: focusText
    };
    updateWeeklyPlan(updated);
  };

  // Update day objective
  const handleUpdateDayObjective = (day: string, objText: string) => {
    if (!activePlan) return;
    const updated = {
      ...activePlan,
      days: {
        ...activePlan.days,
        [day]: {
          ...activePlan.days[day as keyof typeof activePlan.days],
          objective: objText
        }
      }
    };
    updateWeeklyPlan(updated);
  };

  // Append planned task to a specific day
  const handleAddPlannedTask = (e: FormEvent) => {
    e.preventDefault();
    if (!activePlan || !newPlannedTaskTitle.trim()) return;

    const currentDayPlan = activePlan.days[selectedDayName as keyof typeof activePlan.days];
    const newPlannedTask: WeeklyTask = {
      id: `wt-${Date.now()}`,
      title: newPlannedTaskTitle.trim(),
      completed: false,
      priority: newPlannedTaskPriority
    };

    const updated = {
      ...activePlan,
      days: {
        ...activePlan.days,
        [selectedDayName]: {
          ...currentDayPlan,
          tasks: [...currentDayPlan.tasks, newPlannedTask]
        }
      }
    };

    updateWeeklyPlan(updated);
    setNewPlannedTaskTitle('');
    showNotification(`PLAN ADDED: "${newPlannedTask.title}" queued for ${selectedDayName}.`);
  };

  // Remove a planned task
  const handleDeletePlannedTask = (day: string, taskId: string) => {
    if (!activePlan) return;
    const currentDayPlan = activePlan.days[day as keyof typeof activePlan.days];
    const updated = {
      ...activePlan,
      days: {
        ...activePlan.days,
        [day]: {
          ...currentDayPlan,
          tasks: currentDayPlan.tasks.filter((t) => t.id !== taskId)
        }
      }
    };
    updateWeeklyPlan(updated);
    showNotification('PLAN PURGED: Task removed from week plan.');
  };

  // Inject day's planned tasks into the actual daily tasks
  const handleInjectTasks = (day: string) => {
    if (!activePlan) return;
    const dayPlan = activePlan.days[day as keyof typeof activePlan.days];
    if (!dayPlan.tasks || dayPlan.tasks.length === 0) {
      showNotification('INJECTION ABORTED: No planned tasks exist for this day.');
      return;
    }

    importWeeklyTasksToDaily(activePlan.id, day);
    showNotification(`INJECTION SECURED: ${dayPlan.tasks.length} planned commitments are synchronized to your active daily tasks!`);
  };

  // Days of the week in chronological order
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 fade-in-blur">
      {/* Header section with accent configuration */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-5 gap-4">
        <div>
          <span className="font-mono text-[10px] text-white/30 uppercase tracking-[0.2em]">// SUNDAY PROTOCOL</span>
          <h1 className="font-display text-2xl font-light text-white tracking-tight mt-1">
            Weekly Blueprint Planner
          </h1>
          <p className="text-xs text-white/40 mt-1 max-w-xl font-sans">
            "Avoid day-by-day friction." Establish next week's macro trajectory every Sunday. Log priorities, structure daily objectives, and deploy them smoothly to active terminals when the day arrives.
          </p>
        </div>

        {/* View Selection Dropdown or New Week deployer */}
        <div className="flex items-center space-x-2 shrink-0">
          {weeklyPlans.length > 0 && (
            <select
              value={selectedPlanId}
              onChange={(e) => setSelectedPlanId(e.target.value)}
              className="bg-[#0c0c0e] border border-white/10 text-white font-mono text-xs rounded-lg px-4 py-2.5 outline-none focus:border-white/20 transition-all cursor-pointer"
            >
              {weeklyPlans.map((p) => (
                <option key={p.id} value={p.id}>
                  Week of {p.id.replace('week_', '')}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => setShowAddWeekForm(!showAddWeekForm)}
            className={`px-4 py-2.5 rounded-lg border font-mono text-xs cursor-pointer flex items-center space-x-1.5 transition-all ${
              showAddWeekForm
                ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20'
                : 'bg-white/5 border-white/5 text-white/85 hover:text-white hover:bg-white/10'
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>{showAddWeekForm ? 'CANCEL SCHEMA' : 'DEPLOY WEEK SCHEMA'}</span>
          </button>
        </div>
      </div>

      {/* Notification Toast Message */}
      {notification && (
        <div className={`p-3.5 border text-center font-mono text-xs font-semibold rounded-2xl animate-pulse ${
          accentColor === 'emerald' 
            ? 'border-emerald-500/25 bg-emerald-950/25 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.05)]' 
            : 'border-blue-500/25 bg-blue-950/25 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.05)]'
        }`}>
          {notification}
        </div>
      )}

      {/* Form: Blueprint Creation */}
      {showAddWeekForm && (
        <form 
          onSubmit={handleCreateWeeklyPlan} 
          className="p-6 rounded-2xl border border-white/10 bg-[#080808] space-y-4 shadow-[inset_0_1px_rgba(255,255,255,0.02)]"
        >
          <div className="flex items-center space-x-2">
            <Sparkles className={`h-4 w-4 ${accentColor === 'emerald' ? 'text-emerald-400' : 'text-blue-400'}`} />
            <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest">// DEPLOY NEXT WEEK PLANNING BUFFER</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono text-[9px] text-white/40 mb-1.5">START DATE (SUNDAY ANCHOR)</label>
              <select
                value={newWeekDate}
                onChange={(e) => setNewWeekDate(e.target.value)}
                className="w-full p-2.5 bg-white/2 border border-white/5 rounded-lg text-white font-mono text-xs outline-none focus:border-white/20"
              >
                {upcomingSundays.map((dateStr) => (
                  <option key={dateStr} className="bg-[#080808]" value={dateStr}>
                    {dateStr}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block font-mono text-[9px] text-white/40 mb-1.5">PRIMARY WEEKLY FOCUS SPECIFICATION</label>
              <input
                type="text"
                required
                value={newWeekFocus}
                onChange={(e) => setNewWeekFocus(e.target.value)}
                placeholder="Declare the macro focal objective of this system block..."
                className="w-full p-2.5 bg-white/2 border border-white/5 rounded-lg text-white font-sans text-xs outline-none focus:border-white/20 transition-all placeholder-white/10"
              />
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-2.5 rounded-xl font-mono text-xs font-semibold tracking-wider border cursor-pointer transition-all flex items-center justify-center space-x-2 ${
              accentColor === 'emerald'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/25'
                : 'bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/25'
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            <span>CALIBRATE AND DISPATCH SYSTEM SCHEMATIC</span>
          </button>
        </form>
      )}

      {/* Main planner panel */}
      {activePlan ? (
        <div className="space-y-6">
          {/* Weekly Main Focus Card */}
          <div className="rounded-2xl border border-white/5 bg-[#080808] p-5 space-y-3.5 shadow-[inset_0_1px_rgba(255,255,255,0.02)]">
            <span className="block font-mono text-[10px] text-white/30 uppercase tracking-[0.1em]">
              // ANCHOR COMMAND: CURRENT WEEK FOCUS
            </span>

            <div className="relative">
              <input
                type="text"
                value={activePlan.mainFocus}
                onChange={(e) => handleUpdateMainFocus(e.target.value)}
                className="w-full p-3 bg-white/2 border border-white/5 rounded-xl text-sm text-white font-sans font-light outline-none focus:border-white/20 transition-all"
                placeholder="Establish the primary vector focus of this week block..."
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/20 font-mono text-[9px] pointer-events-none">
                EDITABLE OBJECTIVE
              </span>
            </div>
          </div>

          {/* Quick Week Overview Grid */}
          <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
            {daysOfWeek.map((day) => {
              const dayPlan = activePlan.days[day as keyof typeof activePlan.days];
              const taskCount = dayPlan?.tasks ? dayPlan.tasks.length : 0;
              const isSelected = selectedDayName === day;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDayName(day)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-28 relative ${
                    isSelected
                      ? accentColor === 'emerald'
                        ? 'border-emerald-500/40 bg-emerald-950/10 shadow-[0_4px_12px_rgba(16,185,129,0.04)]'
                        : 'border-blue-500/40 bg-blue-950/10 shadow-[0_4px_12px_rgba(59,130,246,0.04)]'
                      : 'border-white/5 bg-[#080808] hover:bg-[#0d0d0f] hover:border-white/10'
                  }`}
                >
                  <div>
                    <span className="block font-mono text-[10px] text-white/30 tracking-wider">
                      {day.slice(0, 3).toUpperCase()}
                    </span>
                    <span className="block text-white font-semibold text-xs mt-0.5">
                      {day}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between w-full">
                    {taskCount > 0 ? (
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                        accentColor === 'emerald' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'
                      }`}>
                        {taskCount} COMMITS
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono text-white/15">EMPTY</span>
                    )}

                    {/* Simple indicator if objective is written */}
                    {dayPlan?.objective && (
                      <div className={`h-1.5 w-1.5 rounded-full ${
                        accentColor === 'emerald' ? 'bg-emerald-400' : 'bg-blue-400'
                      }`} />
                    )}
                  </div>

                  {isSelected && (
                    <div className={`absolute bottom-0 inset-x-0 h-0.5 rounded-b-xl ${
                      accentColor === 'emerald' ? 'bg-emerald-500' : 'bg-blue-500'
                    }`} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Day Detail & Editor Panel split view */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Day settings, objective & Action buttons */}
            <div className="md:col-span-1 rounded-2xl border border-white/5 bg-[#080808] p-5 space-y-4 shadow-[inset_0_1px_rgba(255,255,255,0.02)] h-fit">
              <div>
                <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest">// CORE TARGET</span>
                <h3 className="font-display font-semibold text-white tracking-tight text-base mt-0.5">
                  {selectedDayName} Settings
                </h3>
              </div>

              {/* Day Objective Textbox */}
              <div>
                <label className="block font-mono text-[9px] text-white/45 mb-1.5">DAILY OBJECTIVE OR MILESTONE</label>
                <textarea
                  value={activePlan.days[selectedDayName as keyof typeof activePlan.days].objective}
                  onChange={(e) => handleUpdateDayObjective(selectedDayName, e.target.value)}
                  rows={3}
                  placeholder={`Write ${selectedDayName}'s key focus, review parameter, or milestone...`}
                  className="w-full p-3 bg-white/2 border border-white/5 rounded-xl text-xs text-white outline-none focus:border-white/20 transition-all font-sans resize-none placeholder-white/10"
                />
              </div>

              {/* Deployment / Inject Block Action */}
              <div className="pt-2 border-t border-white/5 space-y-2">
                <button
                  type="button"
                  onClick={() => handleInjectTasks(selectedDayName)}
                  className={`w-full py-2.5 rounded-xl font-mono text-[10px] font-bold tracking-wider cursor-pointer border transition-all flex items-center justify-center space-x-1.5 ${
                    accentColor === 'emerald'
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/25'
                      : 'bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/25'
                  }`}
                >
                  <ArrowDownLeft className="h-3.5 w-3.5" />
                  <span>INJECT TO DAILY COMMITMENTS</span>
                </button>
                <p className="text-[9px] text-white/25 leading-relaxed font-mono">
                  This command instantly duplicates all active planned objects listed on the right panel directly into your live tasks database dashboard.
                </p>
              </div>
            </div>

            {/* Structured planned commitments editor for selected date */}
            <div className="md:col-span-2 rounded-2xl border border-white/5 bg-[#080808] p-5 space-y-4 shadow-[inset_0_1px_rgba(255,255,255,0.02)]">
              <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                <div>
                  <span className="font-mono text-[9px] text-white/30 uppercase tracking-widest">// PREPARED TASKS MATRIX</span>
                  <h4 className="font-display font-semibold text-white tracking-tight text-sm mt-0.5">
                    Planned Tasks for {selectedDayName}
                  </h4>
                </div>
                <span className="font-mono text-[11px] text-white/40">
                  {activePlan.days[selectedDayName as keyof typeof activePlan.days].tasks.length} total tasks
                </span>
              </div>

              {/* Form to insert quick planned task */}
              <form onSubmit={handleAddPlannedTask} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  required
                  value={newPlannedTaskTitle}
                  onChange={(e) => setNewPlannedTaskTitle(e.target.value)}
                  placeholder={`Commit plan to ${selectedDayName}...`}
                  className="flex-grow p-2.5 bg-white/2 border border-white/5 rounded-xl text-xs text-white outline-none focus:border-white/20 transition-all font-mono"
                />

                <div className="flex shrink-0 gap-1.5">
                  <select
                    value={newPlannedTaskPriority}
                    onChange={(e) => setNewPlannedTaskPriority(e.target.value as 'low' | 'medium' | 'high')}
                    className="p-2.5 bg-[#080808] border border-white/5 rounded-xl text-xs text-white outline-none font-mono focus:border-white/20"
                  >
                    <option className="bg-[#080808]" value="high">HIGH PRIORITY</option>
                    <option className="bg-[#080808]" value="medium">MEDIUM PRIORITY</option>
                    <option className="bg-[#080808]" value="low">LOW PRIORITY</option>
                  </select>

                  <button
                    type="submit"
                    className={`p-2.5 rounded-xl border text-xs font-mono font-bold cursor-pointer transition-all flex items-center justify-center space-x-1 ${
                      accentColor === 'emerald'
                        ? 'bg-emerald-500/15 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/25'
                        : 'bg-blue-500/15 border-blue-500/20 text-blue-400 hover:bg-blue-500/25'
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">QUEUE PLAN</span>
                  </button>
                </div>
              </form>

              {/* List of planned tasks with deletions */}
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {activePlan.days[selectedDayName as keyof typeof activePlan.days].tasks.length === 0 ? (
                  <div className="text-center py-10 border border-dashed border-white/5 rounded-xl">
                    <p className="font-mono text-xs text-white/35">No weekly commitments outlined for this day.</p>
                    <p className="font-mono text-[10px] text-white/20 mt-1">Use the calibration input above to outline objective targets.</p>
                  </div>
                ) : (
                  activePlan.days[selectedDayName as keyof typeof activePlan.days].tasks.map((wt) => (
                    <div
                      key={wt.id}
                      className="flex items-center justify-between p-3.5 bg-[#0c0c0e]/80 border border-white/5 rounded-xl hover:border-white/10 transition-all font-mono text-xs"
                    >
                      <div className="flex items-center space-x-3.5 min-w-0">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                          wt.priority === 'high' 
                            ? 'bg-rose-500 shadow-[0_0_6px_#f43f5e]' 
                            : wt.priority === 'medium' 
                              ? 'bg-amber-400 shadow-[0_0_6px_#fbbf24]' 
                              : 'bg-white/20'
                        }`} />
                        <span className="text-white/80 limit-lines-1">{wt.title}</span>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <span className="text-[9px] font-bold text-white/30 uppercase px-1.5 py-0.5 bg-white/2 rounded">
                          {wt.priority}
                        </span>
                        
                        <button
                          type="button"
                          onClick={() => handleDeletePlannedTask(selectedDayName, wt.id)}
                          className="p-1.5 rounded text-white/40 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Erase commitment plan snippet"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center p-12 border border-white/5 bg-[#080808] rounded-2xl">
          <AlertCircle className="h-8 w-8 text-white/35 mx-auto mb-3" />
          <h2 className="text-white font-semibold text-sm font-mono">NO ACTIVE WEEK SEED REPORTED</h2>
          <p className="text-xs text-white/40 mt-1 max-w-sm mx-auto leading-relaxed">
            Every Sunday is an anchor opportunity to design next week. Click the "DEPLOY WEEK SCHEMA" brand button to formulate a fresh planning calendar grid.
          </p>
        </div>
      )}
    </div>
  );
}
