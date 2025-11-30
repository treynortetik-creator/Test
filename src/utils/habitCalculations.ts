import {
  Habit,
  HabitCompletion,
  HabitStats,
  HabitStreak,
  FrequencyType,
  HeatmapData,
} from '../types';
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  differenceInDays,
  parseISO,
  isAfter,
  isBefore,
  subDays,
  addDays,
} from 'date-fns';

export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function calculateStreak(
  habitId: string,
  completions: HabitCompletion[],
  frequency: FrequencyType
): HabitStreak {
  const habitCompletions = completions
    .filter((c) => c.habitId === habitId && c.completed && !c.skipped)
    .sort((a, b) => b.date.localeCompare(a.date));

  if (habitCompletions.length === 0) {
    return {
      habitId,
      currentStreak: 0,
      longestStreak: 0,
    };
  }

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  const today = formatDate(new Date());
  const yesterday = formatDate(subDays(new Date(), 1));

  // Check if the most recent completion is today or yesterday
  const mostRecentDate = habitCompletions[0].date;
  const isActivelyContinuing = mostRecentDate === today || mostRecentDate === yesterday;

  // Calculate current streak
  if (isActivelyContinuing) {
    let checkDate = parseISO(mostRecentDate);
    currentStreak = 1;

    for (let i = 1; i < habitCompletions.length; i++) {
      const prevDate = parseISO(habitCompletions[i].date);
      const daysDiff = differenceInDays(checkDate, prevDate);

      if (daysDiff === 1) {
        currentStreak++;
        checkDate = prevDate;
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  tempStreak = 1;
  for (let i = 0; i < habitCompletions.length - 1; i++) {
    const currentDate = parseISO(habitCompletions[i].date);
    const nextDate = parseISO(habitCompletions[i + 1].date);
    const daysDiff = differenceInDays(currentDate, nextDate);

    if (daysDiff === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

  return {
    habitId,
    currentStreak,
    longestStreak,
    lastCompletedDate: habitCompletions[0].date,
  };
}

export function calculateHabitStats(
  habit: Habit,
  completions: HabitCompletion[]
): HabitStats {
  const habitCompletions = completions.filter((c) => c.habitId === habit.id);
  const completedCompletions = habitCompletions.filter((c) => c.completed && !c.skipped);

  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const completionsThisWeek = completedCompletions.filter((c) => {
    const date = parseISO(c.date);
    return date >= weekStart && date <= weekEnd;
  }).length;

  const completionsThisMonth = completedCompletions.filter((c) => {
    const date = parseISO(c.date);
    return date >= monthStart && date <= monthEnd;
  }).length;

  const streak = calculateStreak(habit.id, completions, habit.frequency);

  // Calculate completion rate based on days since creation
  const createdDate = parseISO(habit.createdAt);
  const daysSinceCreation = differenceInDays(now, createdDate) + 1;
  const completionRate =
    daysSinceCreation > 0
      ? (completedCompletions.length / daysSinceCreation) * 100
      : 0;

  // Calculate average per week
  const weeksSinceCreation = Math.max(1, daysSinceCreation / 7);
  const averagePerWeek = completedCompletions.length / weeksSinceCreation;

  // Calculate habit strength (weighted score based on multiple factors)
  const habitStrength = calculateHabitStrength(
    streak.currentStreak,
    completionRate,
    daysSinceCreation,
    completedCompletions.length
  );

  return {
    habitId: habit.id,
    totalCompletions: completedCompletions.length,
    completionRate: Math.min(100, completionRate),
    averagePerWeek,
    habitStrength,
    currentStreak: streak.currentStreak,
    longestStreak: streak.longestStreak,
    completionsThisWeek,
    completionsThisMonth,
  };
}

function calculateHabitStrength(
  currentStreak: number,
  completionRate: number,
  daysSinceCreation: number,
  totalCompletions: number
): number {
  // Habit strength is a composite score (0-100) based on:
  // - Current streak (40% weight)
  // - Completion rate (30% weight)
  // - Consistency over time (20% weight)
  // - Total completions (10% weight)

  const streakScore = Math.min(100, (currentStreak / 30) * 100) * 0.4;
  const rateScore = completionRate * 0.3;
  const consistencyScore =
    Math.min(100, (daysSinceCreation / 90) * completionRate) * 0.2;
  const totalScore = Math.min(100, (totalCompletions / 100) * 100) * 0.1;

  return Math.round(streakScore + rateScore + consistencyScore + totalScore);
}

export function getCompletionsByDateRange(
  completions: HabitCompletion[],
  startDate: Date,
  endDate: Date
): HabitCompletion[] {
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  return completions.filter((c) => c.date >= start && c.date <= end);
}

export function generateHeatmapData(
  habitId: string,
  completions: HabitCompletion[],
  daysCount: number = 365
): HeatmapData[] {
  const endDate = new Date();
  const startDate = subDays(endDate, daysCount - 1);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const completionMap = new Map<string, HabitCompletion>();
  completions
    .filter((c) => c.habitId === habitId)
    .forEach((c) => {
      completionMap.set(c.date, c);
    });

  return days.map((day) => {
    const dateStr = formatDate(day);
    const completion = completionMap.get(dateStr);

    let value = 0;
    let level: 0 | 1 | 2 | 3 | 4 = 0;

    if (completion) {
      if (completion.completed && !completion.skipped) {
        value = completion.count || 1;
        // Determine intensity level based on completion
        level = 4; // Full completion
      } else if (completion.skipped) {
        level = 1; // Skipped
      }
    }

    return {
      date: dateStr,
      value,
      level,
    };
  });
}

export function getHabitColor(category: string): string {
  const colors: Record<string, string> = {
    health: '#10b981',
    productivity: '#3b82f6',
    learning: '#8b5cf6',
    social: '#ec4899',
    fitness: '#f59e0b',
    mindfulness: '#06b6d4',
    finance: '#14b8a6',
    custom: '#6366f1',
  };
  return colors[category] || colors.custom;
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function isHabitDueToday(habit: Habit): boolean {
  // For now, all habits are due daily
  // This can be extended for weekly/monthly frequencies
  return true;
}

export function getCompletionRateForPeriod(
  completions: HabitCompletion[],
  startDate: Date,
  endDate: Date,
  totalHabits: number
): number {
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const totalExpected = days.length * totalHabits;

  if (totalExpected === 0) return 0;

  const completedCount = completions.filter(
    (c) => c.completed && !c.skipped
  ).length;

  return (completedCount / totalExpected) * 100;
}
