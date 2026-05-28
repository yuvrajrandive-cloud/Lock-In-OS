/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Task, FocusSession, JournalEntry, UserProfile, AppSettings, LockInStats, WeeklyPlan } from '../types';

// Storage keys
const KEYS = {
  TASKS: 'lockin_tasks',
  SESSIONS: 'lockin_sessions',
  JOURNAL: 'lockin_journal',
  PROFILE: 'lockin_profile',
  SETTINGS: 'lockin_settings',
  STATS: 'lockin_stats',
  WEEKLY: 'lockin_weekly_plans',
};

// Seed data generators based on current date (2026-05-28)
const DEFAULT_PROFILE: UserProfile = {
  name: 'Alex Mercer',
  handle: 'NEXUS_BUILDER',
  joinDate: '2026-05-15',
  targetFocusHours: 4,
};

const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: true,
  focusTimerDuration: 45,
  accentColor: 'blue',
  autoSaveJournal: true,
  supabaseUrl: '',
  supabaseKey: '',
  syncEnabled: false,
};

const DEFAULT_STATS: LockInStats = {
  focusStreak: 12,
  consistencyScore: 89,
  totalMinutesLockedIn: 1840,
  lastActiveDate: '2026-05-27',
};

const DEFAULT_WEEKLY: WeeklyPlan[] = [
  {
    id: 'week_2026-05-31',
    weekOfStr: 'May 31, 2026 (Upcoming Week)',
    mainFocus: 'Launch Core Engine v3.0 Beta and finish Kinematics calculations',
    days: {
      Monday: {
        objective: 'Integrate deep database queries and profile memory indices',
        tasks: [
          { id: 'wt-1', title: 'Write SQLite trigger index procedures', completed: false, priority: 'high' },
          { id: 'wt-2', title: 'Verify connection stability and retry routines', completed: false, priority: 'medium' }
        ]
      },
      Tuesday: {
        objective: 'Complete core physics kinematics proofs',
        tasks: [
          { id: 'wt-3', title: 'Solve workbook problems 16 to 30', completed: false, priority: 'high' }
        ]
      },
      Wednesday: {
        objective: 'Refine front-end animation speeds and visual frame ratios',
        tasks: [
          { id: 'wt-4', title: 'Optimize fade-in-blur utility CSS transition cycles', completed: false, priority: 'low' }
        ]
      },
      Thursday: {
        objective: 'Draft and format full documentation sheet',
        tasks: [
          { id: 'wt-5', title: 'Write deployment blueprints in MD formatting', completed: false, priority: 'medium' }
        ]
      },
      Friday: {
        objective: 'Final systems load testing & error logs review',
        tasks: [
          { id: 'wt-6', title: 'De-allocate memory buffers and check leak traces', completed: false, priority: 'high' }
        ]
      },
      Saturday: {
        objective: 'Aerobic fitness endurance training / Active recharge',
        tasks: [
          { id: 'wt-7', title: '10km progressive outdoor run and muscle stretch', completed: false, priority: 'medium' }
        ]
      },
      Sunday: {
        objective: 'Evaluate current metrics and queue the next week',
        tasks: [
          { id: 'wt-8', title: 'Perform weekly census evaluation review', completed: false, priority: 'low' }
        ]
      }
    }
  }
];

const getDefaultTasks = (): Task[] => [
  {
    id: 't-1',
    title: 'Core Engine Refactoring (Deep Work)',
    completed: false,
    priority: 'high',
    createdAt: '2026-05-28T02:00:00Z',
    completedAtDates: [],
    streak: 3,
  },
  {
    id: 't-2',
    title: 'Kinematics & Physics Revision',
    completed: true,
    priority: 'high',
    createdAt: '2026-05-28T01:00:00Z',
    completedAtDates: ['2026-05-28'],
    streak: 5,
  },
  {
    id: 't-3',
    title: 'High-Intensity Strength Training (45m)',
    completed: true,
    priority: 'medium',
    createdAt: '2026-05-27T08:00:00Z',
    completedAtDates: ['2026-05-27', '2026-05-28'],
    streak: 12,
  },
  {
    id: 't-4',
    title: 'Audit System Log Metrics',
    completed: false,
    priority: 'low',
    createdAt: '2026-05-28T03:30:00Z',
    completedAtDates: [],
    streak: 0,
  },
];

const getDefaultSessions = (): FocusSession[] => [
  {
    id: 's-1',
    durationMinutes: 45,
    timestamp: '2026-05-25T09:00:00Z',
    focusType: 'Coding',
    notes: 'Parsed state machine. Focused, high productivity.',
    wasCompleted: true,
  },
  {
    id: 's-2',
    durationMinutes: 45,
    timestamp: '2026-05-25T14:00:00Z',
    focusType: 'Studying',
    notes: 'Abstract algebra proofs. Muted notifications.',
    wasCompleted: true,
  },
  {
    id: 's-3',
    durationMinutes: 60,
    timestamp: '2026-05-26T08:15:00Z',
    focusType: 'Writing',
    notes: 'Drafted architecture specs. Excellent flow state.',
    wasCompleted: true,
  },
  {
    id: 's-4',
    durationMinutes: 45,
    timestamp: '2026-05-26T11:00:00Z',
    focusType: 'Studying',
    notes: 'Physics problems 1 to 15. Locked in.',
    wasCompleted: true,
  },
  {
    id: 's-5',
    durationMinutes: 90,
    timestamp: '2026-05-27T07:30:00Z',
    focusType: 'Coding',
    notes: 'Implemented state persistence. Complete focus.',
    wasCompleted: true,
  },
  {
    id: 's-6',
    durationMinutes: 30,
    timestamp: '2026-05-27T16:20:00Z',
    focusType: 'Research',
    notes: 'Investigated Web Sockets and real-time syncing architectures.',
    wasCompleted: true,
  },
];

const getDefaultJournal = (): JournalEntry[] => [
  {
    id: 'j-1',
    date: '2026-05-25',
    code: 'ENTRY_039',
    focusScore: 9,
    entryText: 'Solid momentum. Woke up at 5:00 AM. Reduced scrolling to zero and hit high numbers of clean coding hours.',
    improvementsText: 'Physical energy was fantastic. Kept phone outside the office room successfully.',
    distractionsText: 'Checking project analytics early in the session was a minor distraction.',
    tomorrowActionText: 'Strictly blocks all dashboards until the first 120 minutes of heavy lifting is done.',
    wasLockedIn: true,
  },
  {
    id: 'j-2',
    date: '2026-05-26',
    code: 'ENTRY_040',
    focusScore: 8,
    entryText: 'Calculated focus index is extremely stable. Tackled complex architectural decisions without procrastination.',
    improvementsText: 'Good water levels. Structured breaks prevented midday exhaustion.',
    distractionsText: 'A couple of Slack messages pulled my focus for about 10 minutes mid-afternoon.',
    tomorrowActionText: 'Put chat in Do-Not-Disturb mode during high-priority study sessions.',
    wasLockedIn: true,
  },
  {
    id: 'j-3',
    date: '2026-05-27',
    code: 'ENTRY_041',
    focusScore: 10,
    entryText: 'Unbelievable work rate today. Completed a full physics syllabus revision and built the storage logic.',
    improvementsText: 'Discipline definitely was chosen over fleeting motivation. Slept deeply.',
    distractionsText: 'Virtually zero distractions. Solitary state of action.',
    tomorrowActionText: 'Keep the streak on tasks alive. Maintain workout intensity.',
    wasLockedIn: true,
  },
];

// Helper to check and load data safely from LocalStorage
export function loadFromStorage<T>(key: string, fallback: T | (() => T)): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      const fallbackVal = typeof fallback === 'function' ? (fallback as () => T)() : fallback;
      localStorage.setItem(key, JSON.stringify(fallbackVal));
      return fallbackVal;
    }
    return JSON.parse(item) as T;
  } catch (err) {
    console.error(`Error loading key "${key}" from storage`, err);
    return typeof fallback === 'function' ? (fallback as () => T)() : fallback;
  }
}

export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving key "${key}" to storage`, err);
  }
}

// Global API Object to read/write application data easily
export const StorageAPI = {
  // Load whole state
  getTasks: () => loadFromStorage<Task[]>(KEYS.TASKS, getDefaultTasks),
  saveTasks: (tasks: Task[]) => saveToStorage<Task[]>(KEYS.TASKS, tasks),

  getSessions: () => loadFromStorage<FocusSession[]>(KEYS.SESSIONS, getDefaultSessions),
  saveSessions: (sessions: FocusSession[]) => saveToStorage<FocusSession[]>(KEYS.SESSIONS, sessions),

  getJournal: () => loadFromStorage<JournalEntry[]>(KEYS.JOURNAL, getDefaultJournal),
  saveJournal: (entries: JournalEntry[]) => saveToStorage<JournalEntry[]>(KEYS.JOURNAL, entries),

  getProfile: () => loadFromStorage<UserProfile>(KEYS.PROFILE, DEFAULT_PROFILE),
  saveProfile: (profile: UserProfile) => saveToStorage<UserProfile>(KEYS.PROFILE, profile),

  getSettings: () => loadFromStorage<AppSettings>(KEYS.SETTINGS, DEFAULT_SETTINGS),
  saveSettings: (settings: AppSettings) => saveToStorage<AppSettings>(KEYS.SETTINGS, settings),

  getStats: () => loadFromStorage<LockInStats>(KEYS.STATS, DEFAULT_STATS),
  saveStats: (stats: LockInStats) => saveToStorage<LockInStats>(KEYS.STATS, stats),

  getWeekly: () => loadFromStorage<WeeklyPlan[]>(KEYS.WEEKLY, DEFAULT_WEEKLY),
  saveWeekly: (plans: WeeklyPlan[]) => saveToStorage<WeeklyPlan[]>(KEYS.WEEKLY, plans),

  // Clear or reset all data back to clean slate or seeds
  resetAll: () => {
    localStorage.removeItem(KEYS.TASKS);
    localStorage.removeItem(KEYS.SESSIONS);
    localStorage.removeItem(KEYS.JOURNAL);
    localStorage.removeItem(KEYS.PROFILE);
    localStorage.removeItem(KEYS.SETTINGS);
    localStorage.removeItem(KEYS.STATS);
    localStorage.removeItem(KEYS.WEEKLY);
    window.location.reload();
  }
};
