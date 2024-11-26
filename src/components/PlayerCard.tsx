import React from 'react';
import { Player } from '../types/player';
import { PlayerImage } from './PlayerImage';
import { motion } from 'framer-motion';
import { StatCircle } from './dashboard/StatCircle';
import { teamColors } from '../data/teamColors';

interface PlayerCardProps {
  player: Player;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
  const teamColor = teamColors[player.team];
  const mainStats = [
    { label: 'PTS', value: player.stats.points, maxValue: 40 },
    { label: 'REB', value: player.stats.rebounds, maxValue: 15 },
    { label: 'AST', value: player.stats.assists, maxValue: 12 },
  ];

  return (
    <motion.div 
      className="bg-stats-dark rounded-2xl p-6 shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-6 mb-8">
        <PlayerImage
          playerId={player.player_id}
          name={player.name}
          teamColor={teamColor.secondary}
          className="w-24 h-24 rounded-xl ring-2 ring-offset-2 ring-offset-stats-darker"
        />
        
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">{player.name}</h2>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm px-2 py-1 rounded-full" 
                  style={{ backgroundColor: teamColor.primary, color: teamColor.secondary }}>
              {player.team}
            </span>
            <span className="text-gray-400">#{player.number}</span>
          </div>
          <div className="text-sm text-gray-400">
            {player.position} • {player.height} • {player.weight}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {mainStats.map((stat) => (
          <StatCircle
            key={stat.label}
            label={stat.label}
            value={stat.value}
            maxValue={stat.maxValue}
            color={teamColor.secondary}
            size="md"
          />
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-gray-400 mb-1">Games Played</div>
          <div className="text-white">{player.stats.games_played}</div>
        </div>
        <div>
          <div className="text-gray-400 mb-1">College</div>
          <div className="text-white truncate">{player.college}</div>
        </div>
      </div>
    </motion.div>
  );
};