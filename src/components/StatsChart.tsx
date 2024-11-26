import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const dummyChartData = [
  { game: '1', value: 20 },
  { game: '2', value: 25 },
  { game: '3', value: 22 },
  { game: '4', value: 28 },
  { game: '5', value: 26 },
];

export const StatsChart: React.FC = () => (
  <div className="bg-gray-800 p-4 rounded-lg h-48">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={dummyChartData}>
        <XAxis dataKey="game" stroke="#9CA3AF" />
        <YAxis stroke="#9CA3AF" />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke="#60A5FA" 
          strokeWidth={2}
          dot={{ fill: '#60A5FA' }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);