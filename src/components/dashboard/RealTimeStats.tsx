import React from 'react';
import { PlayerStats } from '../../types/player';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface RealTimeStatsProps {
  stats: PlayerStats;
}

export const RealTimeStats: React.FC<RealTimeStatsProps> = ({ stats }) => {
  const data = [
    { time: '1', value: 0.4 },
    { time: '2', value: 0.5 },
    { time: '3', value: 0.7 },
    { time: '4', value: 0.8 },
    { time: '5', value: 0.9 },
  ];

  return (
    <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6">
      <h3 className="text-xl font-bold mb-4">REAL-TIME STATS</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis 
              dataKey="time" 
              stroke="#9CA3AF"
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              stroke="#9CA3AF"
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value * 100}%`}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#60A5FA"
              strokeWidth={3}
              dot={{ fill: '#60A5FA', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};