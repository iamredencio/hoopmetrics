import React from 'react';

interface StatComparisonProps {
  label: string;
  value: number;
  maxValue: number;
}

export const StatComparison: React.FC<StatComparisonProps> = ({
  label,
  value,
  maxValue,
}) => {
  const percentage = (value / maxValue) * 100;

  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-400">{label}</span>
        <span className="text-white">{value.toFixed(1)}</span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};