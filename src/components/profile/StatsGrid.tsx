import React from 'react';
import { PlayerStats } from '../../types/player';

interface StatsGridProps {
  stats: PlayerStats;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  const mainStats = [
    { label: 'NUMBER', value: '23' },
    { label: 'POINTS', value: stats.points },
    { label: 'ASSISTS', value: stats.assists },
  ];

  const subStats = [
    { label: 'POINTS', value: stats.points },
    { label: 'REBOUNDS', value: stats.rebounds },
    { label: 'ASSISTS', value: stats.assists },
  ];

  return (
    <div className="bg-stats-dark rounded-3xl p-6">
      <h3 className="text-xl text-nba-gold mb-6">PLAYER PROFILE</h3>
      
      <div className="grid grid-cols-3 gap-4 mb-8">
        {mainStats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-4xl font-display text-nba-gold mb-2">{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {subStats.map((stat) => (
          <div key={stat.label} className="flex justify-between items-center">
            <div className="text-sm text-gray-400">{stat.label}</div>
            <div className="text-2xl font-display text-nba-gold">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};