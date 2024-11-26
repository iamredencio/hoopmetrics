import React from 'react';
import { PlayerStats } from '../../types/player';

interface StatsOverviewProps {
  stats: PlayerStats;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  const mainStats = [
    { label: 'Points', value: stats.points },
    { label: 'Bounds', value: stats.rebounds },
    { label: 'Steals', value: Math.round(stats.player_efficiency) },
    { label: 'Assists', value: stats.assists },
    { label: 'Blocks', value: Math.round(stats.usage_rate / 3) },
  ];

  return (
    <div className="mt-4 space-y-6">
      <div className="flex justify-between">
        {mainStats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="w-14 h-14 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center mb-2">
              <span className="text-xl font-bold text-blue-400">{stat.value}</span>
            </div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4">
        <h3 className="text-lg font-bold mb-4">REAL-TIME PROFITS</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-400">Points</div>
            <div className="text-2xl font-bold">8.6%</div>
            <div className="text-sm text-green-400">+12%</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Assists</div>
            <div className="text-2xl font-bold">25</div>
            <div className="text-sm text-red-400">-12%</div>
          </div>
        </div>
      </div>
    </div>
  );
};