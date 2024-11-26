import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

export const PredictedStats: React.FC = () => {
  const data = [
    { time: '1', value: 20 },
    { time: '2', value: 35 },
    { time: '3', value: 25 },
    { time: '4', value: 45 },
    { time: '5', value: 30 },
  ];

  return (
    <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4">
      <h3 className="text-lg font-bold mb-4">PREDICTED STATS</h3>
      <div className="h-32">
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
              hide
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#FCD34D"
              strokeWidth={2}
              dot={{ fill: '#FCD34D', r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};