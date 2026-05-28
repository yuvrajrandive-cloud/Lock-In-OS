/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  completedAtDates: string[]; // List of ISO date strings (YYYY-MM-DD) when this task was completed
  streak: number;
  dueDate?: string;
}

export interface FocusSession {
  id: string;
  durationMinutes: number;
  timestamp: string; // ISO String
  focusType: string; // e.g., 'Writing', 'Coding', 'Training', 'Studying'
  notes?: string;
  wasCompleted: boolean;
}

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  code: string; // ENTRY_001, etc.
  focusScore: number; // 1-10
  entryText: string;
  improvementsText: string;
  distractionsText: string;
  tomorrowActionText: string;
  wasLockedIn: boolean;
}

export interface UserProfile {
  name: string;
  handle: string; // Developer alias, e.g., CHIEF_CREATOR
  joinDate: string;
  targetFocusHours: number;
}

export interface AppSettings {
  soundEnabled: boolean;
  focusTimerDuration: number; // in minutes
  accentColor: 'blue' | 'green';
  autoSaveJournal: boolean;
  supabaseUrl: string;
  supabaseKey: string;
  syncEnabled: boolean;
}

export interface LockInStats {
  focusStreak: number;
  consistencyScore: number; // 0 - 100
  totalMinutesLockedIn: number;
  lastActiveDate: string; // YYYY-MM-DD
}

export interface WeeklyTask {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface WeeklyDayPlan {
  objective: string;
  tasks: WeeklyTask[];
}

export interface WeeklyPlan {
  id: string; // e.g. "week_2026-05-31" or Sunday YYYY-MM-DD
  weekOfStr: string; // Sunday date formatted, e.g. "May 31, 2026"
  mainFocus: string;
  days: {
    Monday: WeeklyDayPlan;
    Tuesday: WeeklyDayPlan;
    Wednesday: WeeklyDayPlan;
    Thursday: WeeklyDayPlan;
    Friday: WeeklyDayPlan;
    Saturday: WeeklyDayPlan;
    Sunday: WeeklyDayPlan;
  };
}
