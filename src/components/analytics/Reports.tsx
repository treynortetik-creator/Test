import { useMemo, useState } from 'react';
import { Calendar, TrendingUp, Award, Target } from 'lucide-react';
import type { Habit, HabitCompletion } from '../../types';
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  format,
  subWeeks,
  subMonths,
  eachDayOfInterval
} from 'date-fns';
import { formatDate } from '../../utils/habitCalculations';
import './Reports.css';

interface ReportsProps {
  habits: Habit[];
  completions: HabitCompletion[];
}

type ReportPeriod = 'week' | 'month';

export function Reports({ habits, completions }: ReportsProps) {
  const [period, setPeriod] = useState<ReportPeriod>('week');

  const report = useMemo(() => {
    const now = new Date();
    const activeHabits = habits.filter(h => !h.archived);

    let startDate: Date;
    let endDate: Date;
    let previousStartDate: Date;
    let previousEndDate: Date;

    if (period === 'week') {
      startDate = startOfWeek(now, { weekStartsOn: 1 });
      endDate = endOfWeek(now, { weekStartsOn: 1 });
      previousStartDate = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
      previousEndDate = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
    } else {
      startDate = startOfMonth(now);
      endDate = endOfMonth(now);
      previousStartDate = startOfMonth(subMonths(now, 1));
      previousEndDate = endOfMonth(subMonths(now, 1));
    }

    const periodCompletions = completions.filter(c =>
      c.completed && !c.skipped && c.date >= formatDate(startDate) && c.date <= formatDate(endDate)
    );

    const previousPeriodCompletions = completions.filter(c =>
      c.completed && !c.skipped && c.date >= formatDate(previousStartDate) && c.date <= formatDate(previousEndDate)
    );

    const days = eachDayOfInterval({ start: startDate, end: now });
    const totalExpected = days.length * activeHabits.length;
    const completionRate = totalExpected > 0 ? (periodCompletions.length / totalExpected) * 100 : 0;

    const previousDays = eachDayOfInterval({ start: previousStartDate, end: previousEndDate });
    const previousExpected = previousDays.length * activeHabits.length;
    const previousRate = previousExpected > 0 ? (previousPeriodCompletions.length / previousExpected) * 100 : 0;

    const improvement = completionRate - previousRate;

    // Find best and worst habits
    const habitPerformance = activeHabits.map(habit => {
      const habitCompletions = periodCompletions.filter(c => c.habitId === habit.id);
      const rate = days.length > 0 ? (habitCompletions.length / days.length) * 100 : 0;
      return { habit, completions: habitCompletions.length, rate };
    }).filter(h => h.completions > 0);

    habitPerformance.sort((a, b) => b.rate - a.rate);
    const bestHabit = habitPerformance[0];
    const worstHabit = habitPerformance[habitPerformance.length - 1];

    // Find best day
    const dayCompletions = new Map<string, number>();
    periodCompletions.forEach(c => {
      const day = format(new Date(c.date), 'EEEE');
      dayCompletions.set(day, (dayCompletions.get(day) || 0) + 1);
    });

    let bestDay = '';
    let maxCompletions = 0;
    dayCompletions.forEach((count, day) => {
      if (count > maxCompletions) {
        maxCompletions = count;
        bestDay = day;
      }
    });

    return {
      period,
      startDate: format(startDate, 'MMM d'),
      endDate: format(endDate, 'MMM d'),
      totalCompletions: periodCompletions.length,
      completionRate: Math.round(completionRate),
      improvement: Math.round(improvement),
      bestHabit,
      worstHabit,
      bestDay,
      perfectDays: days.filter(day => {
        const dateStr = formatDate(day);
        const dayCompletions = periodCompletions.filter(c => c.date === dateStr);
        return dayCompletions.length === activeHabits.length;
      }).length,
    };
  }, [habits, completions, period]);

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h2>Performance Reports</h2>
        <div className="period-toggle">
          <button
            className={`period-btn ${period === 'week' ? 'active' : ''}`}
            onClick={() => setPeriod('week')}
          >
            This Week
          </button>
          <button
            className={`period-btn ${period === 'month' ? 'active' : ''}`}
            onClick={() => setPeriod('month')}
          >
            This Month
          </button>
        </div>
      </div>

      <div className="report-summary">
        <div className="report-period">
          <Calendar size={20} />
          <span>{report.startDate} - {report.endDate}</span>
        </div>
      </div>

      <div className="report-stats-grid">
        <div className="report-stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>
            <Target />
          </div>
          <div className="stat-content">
            <h3>{report.totalCompletions}</h3>
            <p>Total Completions</p>
          </div>
        </div>

        <div className="report-stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
            <TrendingUp />
          </div>
          <div className="stat-content">
            <h3>{report.completionRate}%</h3>
            <p>Completion Rate</p>
            {report.improvement !== 0 && (
              <span className={`improvement ${report.improvement > 0 ? 'positive' : 'negative'}`}>
                {report.improvement > 0 ? '+' : ''}{report.improvement}% vs last {period}
              </span>
            )}
          </div>
        </div>

        <div className="report-stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }}>
            <Award />
          </div>
          <div className="stat-content">
            <h3>{report.perfectDays}</h3>
            <p>Perfect Days</p>
          </div>
        </div>
      </div>

      <div className="insights-section">
        <h3>Insights</h3>
        <div className="insights-list">
          {report.bestHabit && (
            <div className="insight-item success">
              <span className="insight-icon">🌟</span>
              <div>
                <strong>{report.bestHabit.habit.name}</strong> is your star habit this {period}!
                {report.bestHabit.habit.icon && ` ${report.bestHabit.habit.icon}`}
                <br />
                <small>{Math.round(report.bestHabit.rate)}% completion rate</small>
              </div>
            </div>
          )}

          {report.bestDay && (
            <div className="insight-item">
              <span className="insight-icon">📅</span>
              <div>
                <strong>{report.bestDay}</strong> is your most productive day!
              </div>
            </div>
          )}

          {report.worstHabit && report.worstHabit.rate < 50 && (
            <div className="insight-item warning">
              <span className="insight-icon">💡</span>
              <div>
                <strong>{report.worstHabit.habit.name}</strong> needs more attention
                {report.worstHabit.habit.icon && ` ${report.worstHabit.habit.icon}`}
                <br />
                <small>Only {Math.round(report.worstHabit.rate)}% completion rate</small>
              </div>
            </div>
          )}

          {report.improvement > 10 && (
            <div className="insight-item success">
              <span className="insight-icon">🚀</span>
              <div>
                Amazing progress! You improved by <strong>{report.improvement}%</strong> compared to last {period}!
              </div>
            </div>
          )}

          {report.perfectDays > 0 && (
            <div className="insight-item success">
              <span className="insight-icon">⭐</span>
              <div>
                You had <strong>{report.perfectDays} perfect day{report.perfectDays > 1 ? 's' : ''}</strong> this {period}!
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
