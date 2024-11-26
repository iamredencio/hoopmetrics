import React from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';

export const RecentWatchlist: React.FC = () => {
  const data = [
    { time: '1', value: 30 },
    { time: '2', value: 45 },
    { time: '3', value: 35 },
    { time: '4', value: 50 },
    { time: '5', value: 40 },
  ];

  return (
    <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4">
      <h3 className="text-lg font-bold mb-4">RECENT WATCHLIST</h3>
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
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
              hide
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#60A5FA"
              fill="#60A5FA"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};