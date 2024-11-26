import React from 'react';
import { Player } from '../../types/player';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface PredictedStatsProps {
  player: Player;
}

export const PredictedStats: React.FC<PredictedStatsProps> = ({ player }) => {
  const data = [
    { game: 1, value: 74 },
    { game: 2, value: 65 },
    { game: 3, value: 82 },
    { game: 4, value: 68 },
    { game: 5, value: 76 },
  ];

  return (
    <div className="bg-stats-dark rounded-3xl p-6">
      <h3 className="text-xl text-nba-gold mb-6">PREDICTED STATS</h3>
      
      <div className="flex items-center gap-4 mb-6">
        <img
          src={`/api/player/${player.player_id}/thumbnail`}
          alt={player.name}
          className="w-16 h-16 rounded-lg object-cover"
        />
        <div>
          <div className="text-sm text-gray-400">NEXT GAME</div>
          <div className="text-lg text-nba-gold">vs. {player.team}</div>
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <XAxis 
              dataKey="game" 
              stroke="#9CA3AF"
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              stroke="#9CA3AF"
              axisLine={false}
              tickLine={false}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#FCD34D"
              fill="#FCD34D"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};