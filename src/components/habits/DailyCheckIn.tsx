import { useState } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Habit, HabitCompletion } from '../../types';
import { HabitCard } from './HabitCard';
import { Modal } from '../common/Modal';
import { HabitForm } from './HabitForm';
import { formatDate } from '../../utils/habitCalculations';
import './DailyCheckIn.css';

interface DailyCheckInProps {
  habits: Habit[];
  completions: HabitCompletion[];
  onAddHabit: (data: Omit<Habit, 'id' | 'createdAt' | 'archived'>) => void;
  onUpdateHabit: (id: string, updates: Partial<Habit>) => void;
  onDeleteHabit: (id: string) => void;
  onToggleCompletion: (habitId: string, date?: Date) => void;
  onSkip: (habitId: string, date?: Date) => void;
  onUpdateNotes: (habitId: string, date: string, notes: string) => void;
  getHabitStats: (habitId: string) => any;
}

export function DailyCheckIn({
  habits,
  completions,
  onAddHabit,
  onUpdateHabit,
  onDeleteHabit,
  onToggleCompletion,
  onSkip,
  onUpdateNotes,
  getHabitStats,
}: DailyCheckInProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const activeHabits = habits.filter((h) => !h.archived);
  const dateStr = formatDate(selectedDate);
  const isToday = dateStr === formatDate(new Date());

  const todayCompletions = completions.filter((c) => c.date === dateStr);
  const completedCount = todayCompletions.filter((c) => c.completed && !c.skipped).length;
  const completionPercentage = activeHabits.length > 0
    ? Math.round((completedCount / activeHabits.length) * 100)
    : 0;

  const handleAddHabit = (data: Omit<Habit, 'id' | 'createdAt' | 'archived'>) => {
    onAddHabit(data);
    setShowAddModal(false);
  };

  const handleEditHabit = (data: Omit<Habit, 'id' | 'createdAt' | 'archived'>) => {
    if (editingHabit) {
      onUpdateHabit(editingHabit.id, data);
      setEditingHabit(null);
    }
  };

  const handleDeleteHabit = (habitId: string) => {
    if (confirm('Are you sure you want to delete this habit? This action cannot be undone.')) {
      onDeleteHabit(habitId);
    }
  };

  return (
    <div className="daily-checkin">
      <div className="checkin-header">
        <div className="header-content">
          <div className="date-info">
            <h1 className="checkin-title">
              {isToday ? "Today's Habits" : format(selectedDate, 'MMMM d, yyyy')}
            </h1>
            <p className="checkin-subtitle">
              {completedCount} of {activeHabits.length} completed ({completionPercentage}%)
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={20} />
            Add Habit
          </button>
        </div>

        <div className="progress-bar-container">
          <div
            className="progress-bar"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {activeHabits.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🌱</div>
          <h2>No habits yet</h2>
          <p>Start building positive habits by creating your first one!</p>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={20} />
            Create Your First Habit
          </button>
        </div>
      ) : (
        <div className="habits-grid">
          {activeHabits.map((habit) => {
            const completion = todayCompletions.find((c) => c.habitId === habit.id);
            const stats = getHabitStats(habit.id);

            return (
              <HabitCard
                key={habit.id}
                habit={habit}
                completion={completion}
                stats={stats}
                onToggle={() => onToggleCompletion(habit.id, selectedDate)}
                onSkip={() => onSkip(habit.id, selectedDate)}
                onEdit={() => setEditingHabit(habit)}
                onDelete={() => handleDeleteHabit(habit.id)}
                onUpdateNotes={(notes) => onUpdateNotes(habit.id, dateStr, notes)}
                showActions={true}
              />
            );
          })}
        </div>
      )}

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Create New Habit"
        size="md"
      >
        <HabitForm
          onSubmit={handleAddHabit}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

      <Modal
        isOpen={!!editingHabit}
        onClose={() => setEditingHabit(null)}
        title="Edit Habit"
        size="md"
      >
        {editingHabit && (
          <HabitForm
            onSubmit={handleEditHabit}
            onCancel={() => setEditingHabit(null)}
            initialData={editingHabit}
          />
        )}
      </Modal>
    </div>
  );
}
