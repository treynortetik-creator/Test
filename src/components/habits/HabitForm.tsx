import { useState } from 'react';
import type { Habit, HabitCategory, FrequencyType } from '../../types';
import { getHabitColor } from '../../utils/habitCalculations';
import './HabitForm.css';

interface HabitFormProps {
  onSubmit: (data: Omit<Habit, 'id' | 'createdAt' | 'archived'>) => void;
  onCancel: () => void;
  initialData?: Habit;
}

const categories: { value: HabitCategory; label: string; emoji: string }[] = [
  { value: 'health', label: 'Health', emoji: '❤️' },
  { value: 'fitness', label: 'Fitness', emoji: '💪' },
  { value: 'productivity', label: 'Productivity', emoji: '⚡' },
  { value: 'learning', label: 'Learning', emoji: '📚' },
  { value: 'mindfulness', label: 'Mindfulness', emoji: '🧘' },
  { value: 'social', label: 'Social', emoji: '👥' },
  { value: 'finance', label: 'Finance', emoji: '💰' },
  { value: 'custom', label: 'Custom', emoji: '✨' },
];

const frequencies: { value: FrequencyType; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

export function HabitForm({ onSubmit, onCancel, initialData }: HabitFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [category, setCategory] = useState<HabitCategory>(
    initialData?.category || 'custom'
  );
  const [frequency, setFrequency] = useState<FrequencyType>(
    initialData?.frequency || 'daily'
  );
  const [targetCount, setTargetCount] = useState(initialData?.targetCount?.toString() || '');
  const [color, setColor] = useState(initialData?.color || getHabitColor('custom'));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      category,
      frequency,
      targetCount: targetCount ? parseInt(targetCount) : undefined,
      color: color || getHabitColor(category),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="habit-form">
      <div className="form-group">
        <label className="label" htmlFor="habit-name">
          Habit Name *
        </label>
        <input
          id="habit-name"
          type="text"
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Morning meditation"
          required
          autoFocus
        />
      </div>

      <div className="form-group">
        <label className="label" htmlFor="habit-description">
          Description
        </label>
        <textarea
          id="habit-description"
          className="input textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description..."
          rows={3}
        />
      </div>

      <div className="form-group">
        <label className="label">Category *</label>
        <div className="category-grid">
          {categories.map((cat) => (
            <button
              key={cat.value}
              type="button"
              className={`category-button ${category === cat.value ? 'active' : ''}`}
              onClick={() => {
                setCategory(cat.value);
                setColor(getHabitColor(cat.value));
              }}
            >
              <span className="category-emoji">{cat.emoji}</span>
              <span className="category-label">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="label" htmlFor="habit-frequency">
          Frequency *
        </label>
        <select
          id="habit-frequency"
          className="input"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as FrequencyType)}
        >
          {frequencies.map((freq) => (
            <option key={freq.value} value={freq.value}>
              {freq.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="label" htmlFor="habit-target">
          Target Count (Optional)
        </label>
        <input
          id="habit-target"
          type="number"
          className="input"
          value={targetCount}
          onChange={(e) => setTargetCount(e.target.value)}
          placeholder="e.g., 8 glasses of water"
          min="1"
        />
        <small className="form-hint">
          Leave empty for simple completion tracking
        </small>
      </div>

      <div className="form-group">
        <label className="label" htmlFor="habit-color">
          Color
        </label>
        <div className="color-picker">
          <input
            id="habit-color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="color-input"
          />
          <span className="color-value">{color}</span>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {initialData ? 'Update Habit' : 'Create Habit'}
        </button>
      </div>
    </form>
  );
}
