import React from 'react';
import { PlayerStats as PlayerStatsType } from '../types/player';

interface StatsCardProps {
  label: string;
  value: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value }) => (
  <div className="bg-gray-800 p-4 rounded-lg">
    <h3 className="text-lg mb-2">{label}</h3>
    <p className="text-3xl font-bold text-blue-400">
      {value.toFixed(1)}{label.includes('%') ? '%' : ''}
    </p>
  </div>
);

interface PlayerStatsProps {
  stats: PlayerStatsType;
  showStats: 'basic' | 'advanced';
}

export const PlayerStats: React.FC<PlayerStatsProps> = ({ stats, showStats }) => {
  const basicStats = [
    { label: 'Points', value: stats.points },
    { label: 'Rebounds', value: stats.rebounds },
    { label: 'Assists', value: stats.assists },
    { label: 'FG%', value: stats.field_goal_percentage }
  ];

  const advancedStats = [
    { label: 'Usage Rate', value: stats.usage_rate },
    { label: 'True Shooting %', value: stats.true_shooting_percentage },
    { label: 'PER', value: stats.player_efficiency },
    { label: 'Points/36', value: stats.points_per_36 }
  ];

  const currentStats = showStats === 'basic' ? basicStats : advancedStats;

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      {currentStats.map((stat) => (
        <StatsCard key={stat.label} {...stat} />
      ))}
    </div>
  );
};