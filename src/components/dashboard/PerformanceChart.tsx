import React from 'react';
import { PlayerStats } from '../../types/player';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface PerformanceChartProps {
  stats: PlayerStats;
  teamColor: { primary: string; secondary: string };
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ stats, teamColor }) => {
  const data = Array.from({ length: 10 }, (_, i) => ({
    game: i + 1,
    points: stats.points * (0.8 + Math.random() * 0.4),
    avg: stats.points,
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={teamColor.secondary} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={teamColor.secondary} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="game" 
            stroke="#6B7280"
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            stroke="#6B7280"
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a1a2e',
              border: 'none',
              borderRadius: '0.5rem',
              color: '#fff',
            }}
          />
          <Area
            type="monotone"
            dataKey="points"
            stroke={teamColor.secondary}
            fillOpacity={1}
            fill="url(#colorPoints)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};