import React from 'react';
import { Player } from '../types/player';
import { motion } from 'framer-motion';
import { teamColors } from '../data/teamColors';
import * as Avatar from '@radix-ui/react-avatar';

interface PlayerSelectorProps {
  players: Player[];
  selectedPlayerId: string;
  onSelect: (id: string) => void;
}

export const PlayerSelector: React.FC<PlayerSelectorProps> = ({
  players,
  selectedPlayerId,
  onSelect,
}) => {
  return (
    <div className="flex gap-4 mb-8 overflow-x-auto pb-4 px-2">
      {players.map((player, index) => {
        const teamColor = teamColors[player.team];
        const isSelected = player.player_id === selectedPlayerId;
        
        return (
          <motion.button
            key={player.player_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelect(player.player_id)}
            className={`flex items-center gap-4 p-3 rounded-2xl transition-all ${
              isSelected 
                ? 'bg-stats-dark shadow-lg scale-105' 
                : 'bg-gray-900/50 hover:bg-stats-dark'
            }`}
            style={{
              background: isSelected 
                ? `linear-gradient(135deg, ${teamColor.primary}22 0%, #1a1a2e 100%)`
                : undefined
            }}
          >
            <Avatar.Root className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-offset-2 ring-offset-stats-darker transition-colors"
                        style={{ 
                          ringColor: isSelected ? teamColor.secondary : 'transparent'
                        }}>
              <Avatar.Image 
                src={player.avatar}
                alt={player.name}
                className="w-full h-full object-cover"
              />
              <Avatar.Fallback 
                className="w-full h-full bg-gray-800 flex items-center justify-center text-lg font-bold"
                style={{ color: teamColor.secondary }}
              >
                {player.name.split(' ').map(n => n[0]).join('')}
              </Avatar.Fallback>
            </Avatar.Root>
            
            <div className="text-left">
              <div className="font-semibold text-white">{player.name}</div>
              <div className="flex items-center gap-2">
                <span className="text-sm px-2 py-0.5 rounded-full" 
                      style={{ 
                        backgroundColor: teamColor.primary,
                        color: teamColor.secondary
                      }}>
                  {player.team}
                </span>
                <span className="text-sm text-gray-400">#{player.number}</span>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};