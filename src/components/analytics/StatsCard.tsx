import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import './StatsCard.css';

interface StatsCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  trend?: {
    value: number;
    label: string;
  };
  color?: string;
}

export function StatsCard({ icon, label, value, trend, color = 'var(--primary)' }: StatsCardProps) {
  return (
    <motion.div
      className="stats-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="stats-icon" style={{ background: `${color}15`, color }}>
        {icon}
      </div>
      <div className="stats-content">
        <p className="stats-label">{label}</p>
        <h3 className="stats-value">{value}</h3>
        {trend && (
          <p className="stats-trend">
            <span className={trend.value >= 0 ? 'positive' : 'negative'}>
              {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
            <span className="trend-label">{trend.label}</span>
          </p>
        )}
      </div>
    </motion.div>
  );
}
