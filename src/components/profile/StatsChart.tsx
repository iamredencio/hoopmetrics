import React from 'react';
import { PlayerStats } from '../../types/player';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Line, ComposedChart } from 'recharts';

interface StatsChartProps {
  stats: PlayerStats;
}

export const StatsChart: React.FC<StatsChartProps> = ({ stats }) => {
  const data = [
    { month: 'JAN', points: 23, avg: 25 },
    { month: 'FEB', points: 27, avg: 24 },
    { month: 'MAR', points: 25, avg: 26 },
    { month: 'APR', points: 26, avg: 25 },
    { month: 'MAY', points: 28, avg: 27 },
    { month: 'JUN', points: 30, avg: 28 },
  ];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <XAxis 
            dataKey="month" 
            stroke="#9CA3AF"
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            stroke="#9CA3AF"
            axisLine={false}
            tickLine={false}
          />
          <Bar 
            dataKey="points" 
            fill="#FCD34D"
            radius={[4, 4, 0, 0]}
          />
          <Line
            type="monotone"
            dataKey="avg"
            stroke="#60A5FA"
            strokeWidth={2}
            dot={{ fill: '#60A5FA', r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};