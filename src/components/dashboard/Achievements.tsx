import { motion } from 'framer-motion';
import { Trophy, Lock } from 'lucide-react';
import { Achievement } from '../../types';
import { format } from 'date-fns';
import './Achievements.css';

interface AchievementsProps {
  achievements: Achievement[];
}

export function Achievements({ achievements }: AchievementsProps) {
  const unlocked = achievements.filter((a) => a.unlockedAt);
  const locked = achievements.filter((a) => !a.unlockedAt);

  return (
    <div className="achievements-container">
      <div className="achievements-header">
        <div className="header-content">
          <Trophy size={32} color="var(--warning)" />
          <div>
            <h2 className="achievements-title">Achievements</h2>
            <p className="achievements-subtitle">
              {unlocked.length} of {achievements.length} unlocked
            </p>
          </div>
        </div>
        <div className="achievements-progress">
          <div className="progress-circle">
            <svg viewBox="0 0 100 100" className="progress-ring">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="var(--border)"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="var(--warning)"
                strokeWidth="8"
                strokeDasharray={`${(unlocked.length / achievements.length) * 283} 283`}
                strokeDashoffset="0"
                transform="rotate(-90 50 50)"
                strokeLinecap="round"
              />
            </svg>
            <div className="progress-text">
              {Math.round((unlocked.length / achievements.length) * 100)}%
            </div>
          </div>
        </div>
      </div>

      <div className="achievements-grid">
        {unlocked.length > 0 && (
          <>
            <h3 className="section-subtitle">Unlocked</h3>
            {unlocked.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} unlocked />
            ))}
          </>
        )}

        {locked.length > 0 && (
          <>
            <h3 className="section-subtitle">Locked</h3>
            {locked.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} unlocked={false} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

interface AchievementCardProps {
  achievement: Achievement;
  unlocked: boolean;
}

function AchievementCard({ achievement, unlocked }: AchievementCardProps) {
  const progressPercentage = Math.min(
    100,
    Math.round((achievement.progress / achievement.requirement) * 100)
  );

  return (
    <motion.div
      className={`achievement-card ${unlocked ? 'unlocked' : 'locked'}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: unlocked ? 1.02 : 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="achievement-icon">
        {unlocked ? (
          <span className="icon-emoji">{achievement.icon}</span>
        ) : (
          <Lock size={32} />
        )}
      </div>

      <div className="achievement-content">
        <h4 className="achievement-name">{achievement.name}</h4>
        <p className="achievement-description">{achievement.description}</p>

        {!unlocked && (
          <div className="achievement-progress">
            <div className="progress-bar-small">
              <div
                className="progress-fill"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className="progress-label">
              {achievement.progress} / {achievement.requirement}
            </span>
          </div>
        )}

        {unlocked && achievement.unlockedAt && (
          <p className="achievement-date">
            Unlocked {format(new Date(achievement.unlockedAt), 'MMM d, yyyy')}
          </p>
        )}
      </div>
    </motion.div>
  );
}
