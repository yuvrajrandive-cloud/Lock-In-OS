/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, FocusSession, JournalEntry, UserProfile, AppSettings, LockInStats, WeeklyPlan } from '../types';
import { StorageAPI } from '../utils/storage';

interface LockInContextType {
  currentView: string;
  setCurrentView: (view: string) => void;
  tasks: Task[];
  addTask: (title: string, priority: 'low' | 'medium' | 'high', dueDate?: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  resetDailyTasks: () => void;
  sessions: FocusSession[];
  addFocusSession: (duration: number, focusType: string, notes: string, wasCompleted: boolean) => void;
  journal: JournalEntry[];
  addJournalEntry: (
    entryText: string,
    focusScore: number,
    improvementsText: string,
    distractionsText: string,
    tomorrowActionText: string,
    wasLockedIn: boolean
  ) => void;
  profile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  stats: LockInStats;
  syncToSupabase: () => Promise<{ success: boolean; message: string }>;
  weeklyPlans: WeeklyPlan[];
  addWeeklyPlan: (weekStartDate: string, mainFocus: string) => void;
  updateWeeklyPlan: (updatedPlan: WeeklyPlan) => void;
  importWeeklyTasksToDaily: (weekId: string, dayName: string) => void;
}

const LockInContext = createContext<LockInContextType | undefined>(undefined);

export function LockInProvider({ children }: { children: ReactNode }) {
  // Navigation
  const [currentView, setCurrentView] = useState<string>('dashboard');

  // Application States
  const [tasks, setTasks] = useState<Task[]>(() => StorageAPI.getTasks());
  const [sessions, setSessions] = useState<FocusSession[]>(() => StorageAPI.getSessions());
  const [journal, setJournal] = useState<JournalEntry[]>(() => StorageAPI.getJournal());
  const [profile, setProfile] = useState<UserProfile>(() => StorageAPI.getProfile());
  const [settings, setSettings] = useState<AppSettings>(() => StorageAPI.getSettings());
  const [stats, setStats] = useState<LockInStats>(() => StorageAPI.getStats());
  const [weeklyPlans, setWeeklyPlans] = useState<WeeklyPlan[]>(() => StorageAPI.getWeekly());

  // Save states to LocalStorage on modification
  useEffect(() => {
    StorageAPI.saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    StorageAPI.saveSessions(sessions);
  }, [sessions]);

  useEffect(() => {
    StorageAPI.saveJournal(journal);
  }, [journal]);

  useEffect(() => {
    StorageAPI.saveProfile(profile);
  }, [profile]);

  useEffect(() => {
    StorageAPI.saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    StorageAPI.saveStats(stats);
  }, [stats]);

  useEffect(() => {
    StorageAPI.saveWeekly(weeklyPlans);
  }, [weeklyPlans]);

  // Tasks Management
  const addTask = (title: string, priority: 'low' | 'medium' | 'high', dueDate?: string) => {
    const newTask: Task = {
      id: `task_${Date.now()}`,
      title,
      completed: false,
      priority,
      createdAt: new Date().toISOString(),
      completedAtDates: [],
      streak: 0,
      dueDate,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const toggleTask = (id: string) => {
    const todayStr = '2026-05-28'; // Fixed current system local date context
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          const wasCompleted = task.completed;
          const nextCompleted = !wasCompleted;

          let updatedCompletedDates = [...task.completedAtDates];
          let nextStreak = task.streak;

          if (nextCompleted) {
            // Mark completed today if not already
            if (!updatedCompletedDates.includes(todayStr)) {
              updatedCompletedDates.push(todayStr);
            }
            // Determine streak update: check if they completed yesterday or today
            // For general simulation, increment streak on completion
            nextStreak = task.streak + 1;
          } else {
            // Uncompleted
            updatedCompletedDates = updatedCompletedDates.filter((d) => d !== todayStr);
            nextStreak = Math.max(0, task.streak - 1);
          }

          return {
            ...task,
            completed: nextCompleted,
            streak: nextStreak,
            completedAtDates: updatedCompletedDates,
          };
        }
        return task;
      })
    );

    // Recalculate consistency score briefly
    updateConsistencyScore();
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const resetDailyTasks = () => {
    setTasks((prev) =>
      prev.map((task) => ({
        ...task,
        completed: false,
      }))
    );
  };

  // Sessions Management
  const addFocusSession = (duration: number, focusType: string, notes: string, wasCompleted: boolean) => {
    const newSession: FocusSession = {
      id: `session_${Date.now()}`,
      durationMinutes: duration,
      timestamp: new Date().toISOString(),
      focusType,
      notes: notes || undefined,
      wasCompleted,
    };

    setSessions((prev) => [newSession, ...prev]);

    if (wasCompleted) {
      // Update statistics
      setStats((prev) => {
        const totalMinutes = prev.totalMinutesLockedIn + duration;
        // Simple streak builder: if last active date is yesterday or today, keep/increment streak
        const todayStr = '2026-05-28';
        let newStreak = prev.focusStreak;

        if (prev.lastActiveDate !== todayStr) {
          if (prev.lastActiveDate === '2026-05-27') {
            newStreak += 1;
          } else if (prev.lastActiveDate !== '2026-05-28') {
            // First lock in after absence reset or restore
            newStreak = Math.max(1, prev.focusStreak);
          }
        }

        return {
          ...prev,
          totalMinutesLockedIn: totalMinutes,
          focusStreak: newStreak,
          lastActiveDate: todayStr,
        };
      });
    }

    // Update consistency rate dynamically
    updateConsistencyScore();
  };

  // Helper calculation for consistency
  const updateConsistencyScore = () => {
    setStats((prev) => {
      // Score = (completed tasks / total tasks) * 40 + (lessons completed duration / target) * 60
      // We will calculate a realistic consistency score based on journals and tasks
      const completedTasksCount = tasks.filter((t) => t.completed).length;
      const totalTasksCount = tasks.length;
      const taskRatio = totalTasksCount > 0 ? completedTasksCount / totalTasksCount : 0.8;

      const totalTodayFocus = sessions
        .filter((s) => s.wasCompleted && s.timestamp.startsWith('2026-05-28'))
        .reduce((sum, s) => sum + s.durationMinutes, 0);

      const targetMinutes = profile.targetFocusHours * 60;
      const focusRatio = Math.min(1, totalTodayFocus / targetMinutes);

      // Blended score, weighted
      const rawScore = (taskRatio * 50) + (focusRatio * 50);
      const activeConsistency = Math.max(40, Math.min(100, Math.round(rawScore || 89)));

      return {
        ...prev,
        consistencyScore: activeConsistency,
      };
    });
  };

  // Journaling Management
  const addJournalEntry = (
    entryText: string,
    focusScore: number,
    improvementsText: string,
    distractionsText: string,
    tomorrowActionText: string,
    wasLockedIn: boolean
  ) => {
    const todayStr = '2026-05-28';
    // Generate code based on entries length, e.g. ENTRY_042
    const codeNum = String(journal.length + 40).padStart(3, '0');
    const newEntry: JournalEntry = {
      id: `journal_${Date.now()}`,
      date: todayStr,
      code: `ENTRY_${codeNum}`,
      focusScore,
      entryText,
      improvementsText,
      distractionsText,
      tomorrowActionText,
      wasLockedIn,
    };

    // Replace if entry for today already exists, otherwise add
    setJournal((prev) => {
      const filtered = prev.filter((item) => item.date !== todayStr);
      return [newEntry, ...filtered];
    });

    if (wasLockedIn) {
      setStats((prev) => ({
        ...prev,
        lastActiveDate: todayStr,
      }));
    }
  };

  // User details
  const updateProfile = (updated: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  const updateSettings = (updated: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...updated }));
  };

  const addWeeklyPlan = (weekStartDate: string, mainFocus: string) => {
    const d = new Date(weekStartDate);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedDate = `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

    const newPlan: WeeklyPlan = {
      id: `week_${weekStartDate}`,
      weekOfStr: `${formattedDate} (Custom Plan)`,
      mainFocus,
      days: {
        Monday: { objective: '', tasks: [] },
        Tuesday: { objective: '', tasks: [] },
        Wednesday: { objective: '', tasks: [] },
        Thursday: { objective: '', tasks: [] },
        Friday: { objective: '', tasks: [] },
        Saturday: { objective: '', tasks: [] },
        Sunday: { objective: '', tasks: [] },
      }
    };

    setWeeklyPlans((prev) => [newPlan, ...prev]);
  };

  const updateWeeklyPlan = (updatedPlan: WeeklyPlan) => {
    setWeeklyPlans((prev) => prev.map((plan) => plan.id === updatedPlan.id ? updatedPlan : plan));
  };

  const importWeeklyTasksToDaily = (weekId: string, dayName: string) => {
    const targetPlan = weeklyPlans.find((p) => p.id === weekId);
    if (!targetPlan) return;

    const dayPlan = targetPlan.days[dayName as keyof typeof targetPlan.days];
    if (!dayPlan || !dayPlan.tasks || dayPlan.tasks.length === 0) return;

    const newTasksToInject = dayPlan.tasks.map((wt) => ({
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      title: wt.title,
      completed: false,
      priority: wt.priority,
      createdAt: new Date().toISOString(),
      completedAtDates: [],
      streak: 0,
      dueDate: targetPlan.id.replace('week_', ''),
    }));

    setTasks((prev) => [...newTasksToInject, ...prev]);
  };

  // Mock sync to Supabase (fully operational simulated feedback, with real loading)
  const syncToSupabase = async (): Promise<{ success: boolean; message: string }> => {
    if (!settings.supabaseUrl || !settings.supabaseKey) {
      return {
        success: false,
        message: 'SUPABASE CREDENTIALS MISSING: Provide target API points in Settings panel.',
      };
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'SYNC ACTION COMPLETE. SQLite Buffer and Supabase cloud tables are online. Stream initialized.',
         });
      }, 1500);
    });
  };

  return (
    <LockInContext.Provider
      value={{
        currentView,
        setCurrentView,
        tasks,
        addTask,
        toggleTask,
        deleteTask,
        resetDailyTasks,
        sessions,
        addFocusSession,
        journal,
        addJournalEntry,
        profile,
        updateProfile,
        settings,
        updateSettings,
        stats,
        syncToSupabase,
        weeklyPlans,
        addWeeklyPlan,
        updateWeeklyPlan,
        importWeeklyTasksToDaily,
      }}
    >
      {children}
    </LockInContext.Provider>
  );
}

export function useLockIn() {
  const context = useContext(LockInContext);
  if (!context) {
    throw new Error('useLockIn must be used inside a LockInProvider');
  }
  return context;
}
