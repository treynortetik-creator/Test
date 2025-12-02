import { useState, useEffect, useCallback } from 'react';
import type { Habit, HabitCompletion, HabitStats, Achievement } from '../types';
import { storageService } from '../services/storage';
import {
  calculateHabitStats,
  generateId,
  getHabitColor,
  formatDate,
} from '../utils/habitCalculations';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from storage
  useEffect(() => {
    const loadData = () => {
      setHabits(storageService.getHabits());
      setCompletions(storageService.getCompletions());
      setAchievements(storageService.getAchievements());
      setLoading(false);
    };
    loadData();
  }, []);

  // Update achievements when habits or completions change
  useEffect(() => {
    if (!loading) {
      updateAchievements();
    }
  }, [habits.length, completions.length]);

  const addHabit = useCallback((habitData: Omit<Habit, 'id' | 'createdAt' | 'archived'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      color: habitData.color || getHabitColor(habitData.category),
      archived: false,
    };

    storageService.addHabit(newHabit);
    setHabits((prev) => [...prev, newHabit]);
    return newHabit;
  }, []);

  const updateHabit = useCallback((habitId: string, updates: Partial<Habit>) => {
    storageService.updateHabit(habitId, updates);
    setHabits((prev) =>
      prev.map((h) => (h.id === habitId ? { ...h, ...updates } : h))
    );
  }, []);

  const deleteHabit = useCallback((habitId: string) => {
    storageService.deleteHabit(habitId);
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
    setCompletions((prev) => prev.filter((c) => c.habitId !== habitId));
  }, []);

  const toggleHabitCompletion = useCallback(
    (habitId: string, date?: Date) => {
      const targetDate = formatDate(date || new Date());
      const existing = storageService.getCompletionByDate(habitId, targetDate);

      if (existing) {
        const updated: HabitCompletion = {
          ...existing,
          completed: !existing.completed,
          completedAt: !existing.completed ? new Date().toISOString() : undefined,
        };
        storageService.addCompletion(updated);
        setCompletions((prev) =>
          prev.map((c) => (c.id === existing.id ? updated : c))
        );
      } else {
        const newCompletion: HabitCompletion = {
          id: generateId(),
          habitId,
          date: targetDate,
          completed: true,
          skipped: false,
          completedAt: new Date().toISOString(),
        };
        storageService.addCompletion(newCompletion);
        setCompletions((prev) => [...prev, newCompletion]);
      }
    },
    []
  );

  const skipHabit = useCallback((habitId: string, date?: Date) => {
    const targetDate = formatDate(date || new Date());
    const existing = storageService.getCompletionByDate(habitId, targetDate);

    const completion: HabitCompletion = {
      id: existing?.id || generateId(),
      habitId,
      date: targetDate,
      completed: false,
      skipped: true,
      completedAt: new Date().toISOString(),
    };

    storageService.addCompletion(completion);
    if (existing) {
      setCompletions((prev) =>
        prev.map((c) => (c.id === existing.id ? completion : c))
      );
    } else {
      setCompletions((prev) => [...prev, completion]);
    }
  }, []);

  const updateCompletionNotes = useCallback(
    (habitId: string, date: string, notes: string) => {
      const existing = storageService.getCompletionByDate(habitId, date);
      if (existing) {
        const updated = { ...existing, notes };
        storageService.addCompletion(updated);
        setCompletions((prev) =>
          prev.map((c) => (c.id === existing.id ? updated : c))
        );
      }
    },
    []
  );

  const updateCompletionCount = useCallback(
    (habitId: string, date: string, count: number) => {
      const existing = storageService.getCompletionByDate(habitId, date);
      if (existing) {
        const updated = { ...existing, count };
        storageService.addCompletion(updated);
        setCompletions((prev) =>
          prev.map((c) => (c.id === existing.id ? updated : c))
        );
      }
    },
    []
  );

  const getHabitStats = useCallback(
    (habitId: string): HabitStats | null => {
      const habit = habits.find((h) => h.id === habitId);
      if (!habit) return null;
      return calculateHabitStats(habit, completions);
    },
    [habits, completions]
  );

  const getActiveHabits = useCallback(() => {
    return habits.filter((h) => !h.archived);
  }, [habits]);

  const updateAchievements = useCallback(() => {
    const activeHabits = habits.filter((h) => !h.archived);
    const completedCompletions = completions.filter((c) => c.completed && !c.skipped);

    // First habit achievement
    storageService.updateAchievementProgress('first-habit', activeHabits.length);

    // Total completions
    storageService.updateAchievementProgress(
      'century-club',
      completedCompletions.length
    );

    // Habit collector
    storageService.updateAchievementProgress('habit-collector', activeHabits.length);

    // Calculate max streak across all habits
    let maxStreak = 0;
    activeHabits.forEach((habit) => {
      const stats = calculateHabitStats(habit, completions);
      maxStreak = Math.max(maxStreak, stats.currentStreak);
    });

    storageService.updateAchievementProgress('week-streak', maxStreak);
    storageService.updateAchievementProgress('month-streak', maxStreak);

    setAchievements(storageService.getAchievements());
  }, [habits, completions]);

  const exportData = useCallback(() => {
    return storageService.exportData();
  }, []);

  const importData = useCallback((jsonData: string) => {
    try {
      storageService.importData(jsonData);
      setHabits(storageService.getHabits());
      setCompletions(storageService.getCompletions());
      setAchievements(storageService.getAchievements());
    } catch (error) {
      throw error;
    }
  }, []);

  return {
    habits,
    completions,
    achievements,
    loading,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
    skipHabit,
    updateCompletionNotes,
    updateCompletionCount,
    getHabitStats,
    getActiveHabits,
    exportData,
    importData,
  };
}
