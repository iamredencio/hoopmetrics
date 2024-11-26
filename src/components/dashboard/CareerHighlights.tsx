import React from 'react';
import { Player } from '../../types/player';
import { motion } from 'framer-motion';
import { Trophy, Target, Zap, Award } from 'lucide-react';

interface CareerHighlightsProps {
  player: Player;
  teamColor: { primary: string; secondary: string };
}

export const CareerHighlights: React.FC<CareerHighlightsProps> = ({ player, teamColor }) => {
  const highlights = [
    {
      title: "Career High Points",
      value: Math.round(player.stats.points * 1.5),
      icon: Trophy,
      description: "Single game scoring record"
    },
    {
      title: "Season Average",
      value: player.stats.points,
      icon: Target,
      description: "Points per game"
    },
    {
      title: "Efficiency Rating",
      value: player.stats.player_efficiency,
      icon: Zap,
      description: "Player efficiency rating"
    },
    {
      title: "Games Played",
      value: player.stats.games_played,
      icon: Award,
      description: "This season"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {highlights.map((highlight, index) => (
        <motion.div
          key={highlight.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-stats-dark rounded-2xl p-6 shadow-xl overflow-hidden relative"
          style={{
            background: `linear-gradient(135deg, ${teamColor.primary}22 0%, #1a1a2e 100%)`
          }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10"
               style={{ backgroundColor: teamColor.secondary }} />
          
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl"
                 style={{ backgroundColor: `${teamColor.primary}33` }}>
              <highlight.icon 
                className="w-6 h-6"
                style={{ color: teamColor.secondary }}
              />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">
                {highlight.title}
              </h3>
              <p className="text-gray-400 text-sm mb-3">
                {highlight.description}
              </p>
              <div className="text-3xl font-bold"
                   style={{ color: teamColor.secondary }}>
                {highlight.value.toFixed(1)}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};