import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface PlayerHighlightsProps {
  title: string;
  value: number;
  trend: 'up' | 'down';
  change: number;
}

export const PlayerHighlights: React.FC<PlayerHighlightsProps> = ({
  title,
  value,
  trend,
  change,
}) => {
  return (
    <div className="bg-gray-900 rounded-2xl p-6">
      <h4 className="text-gray-400 text-sm mb-2">{title}</h4>
      <div className="text-3xl font-bold text-white mb-4">
        {value.toFixed(1)}
      </div>
      <div className={`flex items-center gap-1 text-sm ${
        trend === 'up' ? 'text-green-400' : 'text-red-400'
      }`}>
        {trend === 'up' ? (
          <ArrowUpIcon className="w-4 h-4" />
        ) : (
          <ArrowDownIcon className="w-4 h-4" />
        )}
        <span>{change.toFixed(1)}% vs last game</span>
      </div>
    </div>
  );
};