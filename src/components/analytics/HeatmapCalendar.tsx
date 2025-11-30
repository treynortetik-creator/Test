import { useMemo } from 'react';
import { format, startOfWeek, eachDayOfInterval, eachWeekOfInterval, endOfWeek, startOfYear, endOfYear, isSameDay, parseISO } from 'date-fns';
import { HeatmapData } from '../../types';
import './HeatmapCalendar.css';

interface HeatmapCalendarProps {
  data: HeatmapData[];
  color?: string;
}

export function HeatmapCalendar({ data, color = 'var(--success)' }: HeatmapCalendarProps) {
  const weeks = useMemo(() => {
    const now = new Date();
    const yearStart = startOfYear(now);
    const yearEnd = endOfYear(now);

    const weeksInYear = eachWeekOfInterval(
      { start: yearStart, end: yearEnd },
      { weekStartsOn: 0 }
    );

    return weeksInYear.map((weekStart) => {
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 0 });
      const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

      return days.map((day) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const dataPoint = data.find((d) => d.date === dateStr);

        return {
          date: day,
          dateStr,
          level: dataPoint?.level || 0,
          value: dataPoint?.value || 0,
        };
      });
    });
  }, [data]);

  const getColor = (level: number) => {
    if (level === 0) return 'var(--bg-tertiary)';
    const opacity = level * 0.25;
    return `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
  };

  const monthLabels = useMemo(() => {
    const months: Array<{ label: string; weekIndex: number }> = [];
    let currentMonth = -1;

    weeks.forEach((week, weekIndex) => {
      const firstDay = week[0].date;
      const month = firstDay.getMonth();

      if (month !== currentMonth && firstDay.getDate() <= 7) {
        currentMonth = month;
        months.push({
          label: format(firstDay, 'MMM'),
          weekIndex,
        });
      }
    });

    return months;
  }, [weeks]);

  return (
    <div className="heatmap-calendar">
      <div className="heatmap-header">
        <h3 className="heatmap-title">Activity Calendar</h3>
        <div className="heatmap-legend">
          <span className="legend-label">Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className="legend-box"
              style={{ backgroundColor: getColor(level) }}
            />
          ))}
          <span className="legend-label">More</span>
        </div>
      </div>

      <div className="heatmap-container">
        <div className="heatmap-months">
          {monthLabels.map((month, i) => (
            <div
              key={i}
              className="month-label"
              style={{ gridColumn: `${month.weekIndex + 1} / span 1` }}
            >
              {month.label}
            </div>
          ))}
        </div>

        <div className="heatmap-grid">
          <div className="heatmap-days">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
              <div key={day} className="day-label">
                {i % 2 === 1 ? day : ''}
              </div>
            ))}
          </div>

          <div className="heatmap-weeks">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="heatmap-week">
                {week.map((day) => (
                  <div
                    key={day.dateStr}
                    className="heatmap-day"
                    style={{ backgroundColor: getColor(day.level) }}
                    title={`${format(day.date, 'MMM d, yyyy')}: ${day.value} completions`}
                    data-level={day.level}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
