import { Habit, HabitCompletion, Achievement } from '../types';

const STORAGE_KEYS = {
  HABITS: 'momentum_habits',
  COMPLETIONS: 'momentum_completions',
  ACHIEVEMENTS: 'momentum_achievements',
} as const;

class StorageService {
  // Habits
  getHabits(): Habit[] {
    const data = localStorage.getItem(STORAGE_KEYS.HABITS);
    return data ? JSON.parse(data) : [];
  }

  saveHabits(habits: Habit[]): void {
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
  }

  addHabit(habit: Habit): void {
    const habits = this.getHabits();
    habits.push(habit);
    this.saveHabits(habits);
  }

  updateHabit(habitId: string, updates: Partial<Habit>): void {
    const habits = this.getHabits();
    const index = habits.findIndex((h) => h.id === habitId);
    if (index !== -1) {
      habits[index] = { ...habits[index], ...updates };
      this.saveHabits(habits);
    }
  }

  deleteHabit(habitId: string): void {
    const habits = this.getHabits().filter((h) => h.id !== habitId);
    this.saveHabits(habits);
    // Also delete all completions for this habit
    const completions = this.getCompletions().filter((c) => c.habitId !== habitId);
    this.saveCompletions(completions);
  }

  getHabit(habitId: string): Habit | undefined {
    return this.getHabits().find((h) => h.id === habitId);
  }

  // Completions
  getCompletions(): HabitCompletion[] {
    const data = localStorage.getItem(STORAGE_KEYS.COMPLETIONS);
    return data ? JSON.parse(data) : [];
  }

  saveCompletions(completions: HabitCompletion[]): void {
    localStorage.setItem(STORAGE_KEYS.COMPLETIONS, JSON.stringify(completions));
  }

  addCompletion(completion: HabitCompletion): void {
    const completions = this.getCompletions();
    // Remove any existing completion for this habit and date
    const filtered = completions.filter(
      (c) => !(c.habitId === completion.habitId && c.date === completion.date)
    );
    filtered.push(completion);
    this.saveCompletions(filtered);
  }

  updateCompletion(completionId: string, updates: Partial<HabitCompletion>): void {
    const completions = this.getCompletions();
    const index = completions.findIndex((c) => c.id === completionId);
    if (index !== -1) {
      completions[index] = { ...completions[index], ...updates };
      this.saveCompletions(completions);
    }
  }

  deleteCompletion(completionId: string): void {
    const completions = this.getCompletions().filter((c) => c.id !== completionId);
    this.saveCompletions(completions);
  }

  getCompletionsByHabit(habitId: string): HabitCompletion[] {
    return this.getCompletions().filter((c) => c.habitId === habitId);
  }

  getCompletionByDate(habitId: string, date: string): HabitCompletion | undefined {
    return this.getCompletions().find((c) => c.habitId === habitId && c.date === date);
  }

  getCompletionsByDateRange(startDate: string, endDate: string): HabitCompletion[] {
    return this.getCompletions().filter((c) => c.date >= startDate && c.date <= endDate);
  }

  // Achievements
  getAchievements(): Achievement[] {
    const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    return data ? JSON.parse(data) : this.getDefaultAchievements();
  }

  saveAchievements(achievements: Achievement[]): void {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  }

  unlockAchievement(achievementId: string): void {
    const achievements = this.getAchievements();
    const achievement = achievements.find((a) => a.id === achievementId);
    if (achievement && !achievement.unlockedAt) {
      achievement.unlockedAt = new Date().toISOString();
      this.saveAchievements(achievements);
    }
  }

  updateAchievementProgress(achievementId: string, progress: number): void {
    const achievements = this.getAchievements();
    const achievement = achievements.find((a) => a.id === achievementId);
    if (achievement) {
      achievement.progress = progress;
      if (progress >= achievement.requirement && !achievement.unlockedAt) {
        achievement.unlockedAt = new Date().toISOString();
      }
      this.saveAchievements(achievements);
    }
  }

  private getDefaultAchievements(): Achievement[] {
    return [
      {
        id: 'first-habit',
        name: 'First Step',
        description: 'Create your first habit',
        icon: '🌱',
        type: 'milestone',
        requirement: 1,
        progress: 0,
      },
      {
        id: 'week-streak',
        name: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: '🔥',
        type: 'streak',
        requirement: 7,
        progress: 0,
      },
      {
        id: 'month-streak',
        name: 'Month Master',
        description: 'Maintain a 30-day streak',
        icon: '💪',
        type: 'streak',
        requirement: 30,
        progress: 0,
      },
      {
        id: 'perfect-week',
        name: 'Perfect Week',
        description: 'Complete all habits for 7 days',
        icon: '⭐',
        type: 'consistency',
        requirement: 7,
        progress: 0,
      },
      {
        id: 'century-club',
        name: 'Century Club',
        description: 'Complete 100 habits',
        icon: '💯',
        type: 'completion',
        requirement: 100,
        progress: 0,
      },
      {
        id: 'habit-collector',
        name: 'Habit Collector',
        description: 'Create 10 habits',
        icon: '📚',
        type: 'milestone',
        requirement: 10,
        progress: 0,
      },
    ];
  }

  // Utility methods
  clearAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.HABITS);
    localStorage.removeItem(STORAGE_KEYS.COMPLETIONS);
    localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
  }

  exportData(): string {
    return JSON.stringify({
      habits: this.getHabits(),
      completions: this.getCompletions(),
      achievements: this.getAchievements(),
      exportedAt: new Date().toISOString(),
    });
  }

  importData(jsonData: string): void {
    try {
      const data = JSON.parse(jsonData);
      if (data.habits) this.saveHabits(data.habits);
      if (data.completions) this.saveCompletions(data.completions);
      if (data.achievements) this.saveAchievements(data.achievements);
    } catch (error) {
      console.error('Failed to import data:', error);
      throw new Error('Invalid data format');
    }
  }
}

export const storageService = new StorageService();
