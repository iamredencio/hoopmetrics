import React from 'react';
import { Player } from '../../types/player';
import { motion } from 'framer-motion';

interface StatGridProps {
  player: Player;
  teamColor: { primary: string; secondary: string };
}

export const StatGrid: React.FC<StatGridProps> = ({ player, teamColor }) => {
  const stats = [
    { label: 'PPG', value: player.stats.points },
    { label: 'RPG', value: player.stats.rebounds },
    { label: 'APG', value: player.stats.assists },
    { label: 'FG%', value: player.stats.field_goal_percentage },
    { label: '3P%', value: player.stats.three_point_percentage },
    { label: 'MPG', value: player.stats.minutes },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-stats-dark rounded-xl p-4 shadow-lg"
          style={{ 
            background: `linear-gradient(135deg, ${teamColor.primary}11 0%, #1a1a2e 100%)` 
          }}
        >
          <div className="text-gray-400 text-sm mb-1">{stat.label}</div>
          <div className="text-3xl font-bold" style={{ color: teamColor.secondary }}>
            {stat.value.toFixed(1)}
          </div>
        </motion.div>
      ))}
    </div>
  );
};