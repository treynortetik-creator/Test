export type FrequencyType = 'daily' | 'weekly' | 'monthly';

export type HabitCategory =
  | 'health'
  | 'productivity'
  | 'learning'
  | 'social'
  | 'fitness'
  | 'mindfulness'
  | 'finance'
  | 'custom';

export interface Habit {
  id: string;
  name: string;
  description?: string;
  category: HabitCategory;
  frequency: FrequencyType;
  targetCount?: number; // For quantity-based habits (e.g., 8 glasses of water)
  createdAt: string;
  color: string;
  icon?: string;
  archived: boolean;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  date: string; // ISO date string (YYYY-MM-DD)
  completed: boolean;
  count?: number; // Actual count for quantity-based habits
  notes?: string;
  skipped: boolean;
  completedAt?: string; // ISO timestamp
}

export interface HabitStreak {
  habitId: string;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate?: string;
}

export interface HabitStats {
  habitId: string;
  totalCompletions: number;
  completionRate: number; // Percentage (0-100)
  averagePerWeek: number;
  habitStrength: number; // Score 0-100
  currentStreak: number;
  longestStreak: number;
  completionsThisWeek: number;
  completionsThisMonth: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  type: 'streak' | 'completion' | 'consistency' | 'milestone';
  requirement: number;
  progress: number;
}

export interface DashboardData {
  totalHabits: number;
  activeHabits: number;
  completedToday: number;
  currentStreakTotal: number;
  weeklyCompletionRate: number;
  topHabits: Array<{
    habit: Habit;
    stats: HabitStats;
  }>;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface HeatmapData {
  date: string;
  value: number;
  level: 0 | 1 | 2 | 3 | 4; // Intensity level for heatmap coloring
}
