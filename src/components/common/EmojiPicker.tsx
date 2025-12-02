import { useState } from 'react';
import './EmojiPicker.css';

const EMOJI_CATEGORIES = {
  'Fitness & Health': ['💪', '🏃', '🚴', '🏋️', '🧘', '🏊', '⚽', '🏀', '🎾', '🥊', '❤️', '🫀', '🧠', '💊', '🩺'],
  'Food & Drink': ['🍎', '🥗', '🥑', '🍇', '🥤', '💧', '☕', '🍵', '🥛', '🍊', '🥕', '🥦', '🍓', '🥝'],
  'Learning & Work': ['📚', '✏️', '📖', '🎓', '💻', '⌨️', '📝', '🖊️', '📊', '📈', '💼', '🎯', '🔬', '🧪'],
  'Mindfulness': ['🧘', '🕉️', '☮️', '🙏', '💆', '🌅', '🌄', '🌠', '⭐', '✨', '🔮', '🪷'],
  'Social': ['👥', '🤝', '💬', '📱', '☎️', '✉️', '💌', '🎉', '🎊', '🎈', '👨‍👩‍👧‍👦', '👫', '🫂'],
  'Finance': ['💰', '💵', '💴', '💶', '💷', '💳', '🏦', '📈', '📉', '💹', '🪙', '💸'],
  'Creative': ['🎨', '🎭', '🎪', '🎬', '🎤', '🎧', '🎼', '🎹', '🎸', '📷', '📸', '✍️'],
  'Time & Schedule': ['⏰', '⏱️', '⏲️', '🕐', '📅', '📆', '🗓️', '⌛', '⏳'],
  'Nature': ['🌱', '🌿', '🍀', '🌳', '🌲', '🌴', '🌵', '🌾', '🌻', '🌸', '🌺', '🌼'],
  'Other': ['🎯', '✅', '⚡', '🔥', '💎', '🏆', '🥇', '🎖️', '🌟', '💫', '🚀', '🎁'],
};

interface EmojiPickerProps {
  value?: string;
  onChange: (emoji: string) => void;
  onClose: () => void;
}

export function EmojiPicker({ value, onChange, onClose }: EmojiPickerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(Object.keys(EMOJI_CATEGORIES)[0]);

  const handleEmojiClick = (emoji: string) => {
    onChange(emoji);
    onClose();
  };

  return (
    <div className="emoji-picker-overlay" onClick={onClose}>
      <div className="emoji-picker" onClick={(e) => e.stopPropagation()}>
        <div className="emoji-picker-header">
          <h3>Choose an Icon</h3>
          <button className="emoji-picker-close" onClick={onClose}>×</button>
        </div>

        <div className="emoji-picker-categories">
          {Object.keys(EMOJI_CATEGORIES).map((category) => (
            <button
              key={category}
              className={`emoji-category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="emoji-picker-grid">
          {EMOJI_CATEGORIES[selectedCategory as keyof typeof EMOJI_CATEGORIES].map((emoji) => (
            <button
              key={emoji}
              className={`emoji-btn ${value === emoji ? 'selected' : ''}`}
              onClick={() => handleEmojiClick(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
