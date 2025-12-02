import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Edit2, Trash2, MessageSquare } from 'lucide-react';
import type { Habit, HabitCompletion, HabitStats } from '../../types';
import './HabitCard.css';

interface HabitCardProps {
  habit: Habit;
  completion?: HabitCompletion;
  stats: HabitStats;
  onToggle: () => void;
  onSkip: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onUpdateNotes?: (notes: string) => void;
  showActions?: boolean;
}

export function HabitCard({
  habit,
  completion,
  stats,
  onToggle,
  onSkip,
  onEdit,
  onDelete,
  onUpdateNotes,
  showActions = false,
}: HabitCardProps) {
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState(completion?.notes || '');

  const isCompleted = completion?.completed && !completion?.skipped;
  const isSkipped = completion?.skipped;

  const handleNotesSubmit = () => {
    if (onUpdateNotes) {
      onUpdateNotes(notes);
      setShowNotes(false);
    }
  };

  return (
    <motion.div
      className={`habit-card ${isCompleted ? 'completed' : ''} ${isSkipped ? 'skipped' : ''}`}
      style={{ borderLeftColor: habit.color }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="habit-card-header">
        <div className="habit-info">
          <h3 className="habit-name">{habit.name}</h3>
          {habit.description && (
            <p className="habit-description">{habit.description}</p>
          )}
          <div className="habit-meta">
            <span className="badge badge-primary">{habit.category}</span>
            <span className="habit-streak">🔥 {stats.currentStreak} day streak</span>
          </div>
        </div>

        <div className="habit-actions">
          {!isCompleted && !isSkipped && (
            <>
              <motion.button
                className="habit-action-btn complete-btn"
                onClick={onToggle}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Mark as complete"
              >
                <Check size={24} />
              </motion.button>
              <motion.button
                className="habit-action-btn skip-btn"
                onClick={onSkip}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Skip for today"
              >
                <X size={20} />
              </motion.button>
            </>
          )}

          {isCompleted && (
            <motion.button
              className="habit-action-btn completed-indicator"
              onClick={onToggle}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Unmark completion"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.3 }}
            >
              <Check size={24} />
            </motion.button>
          )}

          {isSkipped && (
            <motion.button
              className="habit-action-btn skipped-indicator"
              onClick={onSkip}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Unskip"
            >
              <X size={20} />
            </motion.button>
          )}
        </div>
      </div>

      {showActions && (
        <div className="habit-card-footer">
          <div className="habit-stats-mini">
            <span>✅ {stats.totalCompletions} total</span>
            <span>📊 {Math.round(stats.completionRate)}% rate</span>
            <span>💪 {stats.habitStrength}/100 strength</span>
          </div>
          <div className="habit-controls">
            <button
              className="habit-control-btn"
              onClick={() => setShowNotes(!showNotes)}
              title="Add notes"
            >
              <MessageSquare size={16} />
            </button>
            <button
              className="habit-control-btn"
              onClick={onEdit}
              title="Edit habit"
            >
              <Edit2 size={16} />
            </button>
            <button
              className="habit-control-btn delete"
              onClick={onDelete}
              title="Delete habit"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      )}

      {showNotes && (
        <motion.div
          className="habit-notes-section"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <textarea
            className="habit-notes-input"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about today's progress..."
            rows={3}
          />
          <div className="habit-notes-actions">
            <button
              className="btn btn-sm btn-outline"
              onClick={() => setShowNotes(false)}
            >
              Cancel
            </button>
            <button className="btn btn-sm btn-primary" onClick={handleNotesSubmit}>
              Save Notes
            </button>
          </div>
        </motion.div>
      )}

      {completion?.notes && !showNotes && (
        <div className="habit-notes-display">
          <MessageSquare size={14} />
          <span>{completion.notes}</span>
        </div>
      )}
    </motion.div>
  );
}
