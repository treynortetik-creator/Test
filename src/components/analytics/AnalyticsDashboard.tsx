import { useMemo } from 'react';
import { TrendingUp, Target, Flame, Award, Calendar, BarChart3 } from 'lucide-react';
import { Habit, HabitCompletion, HabitStats } from '../../types';
import { StatsCard } from './StatsCard';
import { HeatmapCalendar } from './HeatmapCalendar';
import { ProgressChart } from './ProgressChart';
import {
  generateHeatmapData,
  formatDate,
  calculateHabitStats,
} from '../../utils/habitCalculations';
import { startOfWeek, endOfWeek, eachDayOfInterval, subWeeks, subDays } from 'date-fns';
import './AnalyticsDashboard.css';

interface AnalyticsDashboardProps {
  habits: Habit[];
  completions: HabitCompletion[];
  getHabitStats: (habitId: string) => HabitStats | null;
}

export function AnalyticsDashboard({
  habits,
  completions,
  getHabitStats,
}: AnalyticsDashboardProps) {
  const activeHabits = habits.filter((h) => !h.archived);

  // Calculate overall statistics
  const stats = useMemo(() => {
    const now = new Date();
    const today = formatDate(now);
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

    const todayCompletions = completions.filter(
      (c) => c.date === today && c.completed && !c.skipped
    );

    const thisWeekCompletions = completions.filter((c) => {
      const date = new Date(c.date);
      return (
        c.completed &&
        !c.skipped &&
        date >= weekStart &&
        date <= weekEnd
      );
    });

    const totalCompletions = completions.filter((c) => c.completed && !c.skipped).length;

    let totalCurrentStreak = 0;
    let maxStreak = 0;
    let totalHabitStrength = 0;

    activeHabits.forEach((habit) => {
      const habitStats = getHabitStats(habit.id);
      if (habitStats) {
        totalCurrentStreak += habitStats.currentStreak;
        maxStreak = Math.max(maxStreak, habitStats.longestStreak);
        totalHabitStrength += habitStats.habitStrength;
      }
    });

    const avgHabitStrength =
      activeHabits.length > 0 ? Math.round(totalHabitStrength / activeHabits.length) : 0;

    const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd }).length;
    const totalExpected = activeHabits.length * daysInWeek;
    const weeklyCompletionRate =
      totalExpected > 0 ? Math.round((thisWeekCompletions.length / totalExpected) * 100) : 0;

    return {
      todayCompleted: todayCompletions.length,
      totalActive: activeHabits.length,
      totalCurrentStreak,
      maxStreak,
      totalCompletions,
      avgHabitStrength,
      weeklyCompletionRate,
    };
  }, [habits, completions, activeHabits, getHabitStats]);

  // Generate weekly trend data
  const weeklyTrendData = useMemo(() => {
    const weeks = 12;
    const data = [];

    for (let i = weeks - 1; i >= 0; i--) {
      const weekStart = startOfWeek(subWeeks(new Date(), i), { weekStartsOn: 1 });
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });

      const weekCompletions = completions.filter((c) => {
        const date = new Date(c.date);
        return c.completed && !c.skipped && date >= weekStart && date <= weekEnd;
      });

      data.push({
        date: formatDate(weekStart),
        value: weekCompletions.length,
        label: `Week of ${formatDate(weekStart)}`,
      });
    }

    return data;
  }, [completions]);

  // Generate daily trend for last 30 days
  const dailyTrendData = useMemo(() => {
    const days = 30;
    const data = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = formatDate(date);

      const dayCompletions = completions.filter(
        (c) => c.date === dateStr && c.completed && !c.skipped
      );

      data.push({
        date: dateStr,
        value: dayCompletions.length,
      });
    }

    return data;
  }, [completions]);

  // Generate combined heatmap data
  const heatmapData = useMemo(() => {
    const allDates = new Set<string>();
    const dateValueMap = new Map<string, number>();

    // Collect all unique dates and sum completions per date
    completions.forEach((c) => {
      if (c.completed && !c.skipped) {
        allDates.add(c.date);
        const current = dateValueMap.get(c.date) || 0;
        dateValueMap.set(c.date, current + 1);
      }
    });

    // Convert to heatmap format
    return Array.from(allDates).map((date) => {
      const value = dateValueMap.get(date) || 0;
      let level: 0 | 1 | 2 | 3 | 4 = 0;

      if (value > 0) {
        if (value >= activeHabits.length) level = 4; // All habits completed
        else if (value >= activeHabits.length * 0.75) level = 3;
        else if (value >= activeHabits.length * 0.5) level = 2;
        else level = 1;
      }

      return { date, value, level };
    });
  }, [completions, activeHabits.length]);

  // Top performing habits
  const topHabits = useMemo(() => {
    return activeHabits
      .map((habit) => ({
        habit,
        stats: getHabitStats(habit.id),
      }))
      .filter((item) => item.stats !== null)
      .sort((a, b) => (b.stats?.habitStrength || 0) - (a.stats?.habitStrength || 0))
      .slice(0, 5);
  }, [activeHabits, getHabitStats]);

  return (
    <div className="analytics-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Analytics & Insights</h1>
        <p className="dashboard-subtitle">
          Track your progress and identify patterns in your habit journey
        </p>
      </div>

      <div className="stats-grid">
        <StatsCard
          icon={<Target />}
          label="Completed Today"
          value={`${stats.todayCompleted}/${stats.totalActive}`}
          color="var(--primary)"
        />
        <StatsCard
          icon={<Flame />}
          label="Total Active Streaks"
          value={stats.totalCurrentStreak}
          color="var(--warning)"
        />
        <StatsCard
          icon={<Award />}
          label="Total Completions"
          value={stats.totalCompletions}
          color="var(--success)"
        />
        <StatsCard
          icon={<TrendingUp />}
          label="Avg Habit Strength"
          value={`${stats.avgHabitStrength}/100`}
          color="#8b5cf6"
        />
        <StatsCard
          icon={<BarChart3 />}
          label="Weekly Completion Rate"
          value={`${stats.weeklyCompletionRate}%`}
          color="#06b6d4"
        />
        <StatsCard
          icon={<Calendar />}
          label="Longest Streak"
          value={`${stats.maxStreak} days`}
          color="#ec4899"
        />
      </div>

      <div className="charts-section">
        <HeatmapCalendar data={heatmapData} />
      </div>

      <div className="charts-grid">
        <ProgressChart
          data={dailyTrendData}
          title="Daily Completions (Last 30 Days)"
          type="area"
          color="var(--primary)"
        />
        <ProgressChart
          data={weeklyTrendData}
          title="Weekly Trend (Last 12 Weeks)"
          type="bar"
          color="var(--success)"
        />
      </div>

      {topHabits.length > 0 && (
        <div className="top-habits-section">
          <h2 className="section-title">Top Performing Habits</h2>
          <div className="top-habits-grid">
            {topHabits.map(({ habit, stats }) => (
              <div key={habit.id} className="top-habit-card">
                <div className="top-habit-header">
                  <div
                    className="habit-color-indicator"
                    style={{ backgroundColor: habit.color }}
                  />
                  <div className="top-habit-info">
                    <h3 className="top-habit-name">{habit.name}</h3>
                    <span className="badge badge-primary">{habit.category}</span>
                  </div>
                </div>
                <div className="top-habit-stats">
                  <div className="stat-item">
                    <span className="stat-value">{stats?.habitStrength}/100</span>
                    <span className="stat-label">Strength</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{stats?.currentStreak}</span>
                    <span className="stat-label">Streak</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{Math.round(stats?.completionRate || 0)}%</span>
                    <span className="stat-label">Rate</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
