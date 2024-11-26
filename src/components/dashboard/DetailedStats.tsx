import React from 'react';
import { Player } from '../../types/player';
import { motion } from 'framer-motion';
import { StatCircle } from './StatCircle';
import { StatBar } from './StatBar';

interface DetailedStatsProps {
  player: Player;
  teamColor: { primary: string; secondary: string };
  expanded?: boolean;
}

export const DetailedStats: React.FC<DetailedStatsProps> = ({ 
  player, 
  teamColor,
  expanded = false 
}) => {
  const advancedStats = [
    { label: 'USG%', value: player.stats.usage_rate, maxValue: 40 },
    { label: 'TS%', value: player.stats.true_shooting_percentage, maxValue: 70 },
    { label: 'PER', value: player.stats.player_efficiency, maxValue: 35 },
  ];

  const defenseStats = [
    { label: 'BLK', value: player.stats.blocks, maxValue: 3 },
    { label: 'STL', value: player.stats.steals, maxValue: 3 },
  ];

  const shootingStats = [
    { label: 'FG%', value: player.stats.field_goal_percentage, maxValue: 100 },
    { label: '3P%', value: player.stats.three_point_percentage, maxValue: 100 },
    { label: 'TS%', value: player.stats.true_shooting_percentage, maxValue: 100 },
  ];

  return (
    <div className={`grid gap-6 ${expanded ? 'grid-cols-1 md:grid-cols-3' : ''}`}>
      <motion.div 
        className="bg-stats-dark rounded-2xl p-6 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-lg font-semibold text-white mb-6">Advanced Metrics</h3>
        <div className="grid grid-cols-3 gap-4">
          {advancedStats.map((stat) => (
            <StatCircle
              key={stat.label}
              label={stat.label}
              value={stat.value}
              maxValue={stat.maxValue}
              color={teamColor.secondary}
              size={expanded ? "md" : "sm"}
            />
          ))}
        </div>
      </motion.div>

      {expanded && (
        <motion.div
          className="bg-stats-dark rounded-2xl p-6 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-white mb-6">Shooting Splits</h3>
          <div className="space-y-6">
            {shootingStats.map((stat) => (
              <StatBar
                key={stat.label}
                label={stat.label}
                value={stat.value}
                maxValue={stat.maxValue}
                color={teamColor.secondary}
              />
            ))}
          </div>
        </motion.div>
      )}

      <motion.div
        className="bg-stats-dark rounded-2xl p-6 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-lg font-semibold text-white mb-6">Defensive Impact</h3>
        <div className="grid grid-cols-2 gap-4">
          {defenseStats.map((stat) => (
            <StatCircle
              key={stat.label}
              label={stat.label}
              value={stat.value}
              maxValue={stat.maxValue}
              color={teamColor.primary}
              size={expanded ? "md" : "sm"}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};