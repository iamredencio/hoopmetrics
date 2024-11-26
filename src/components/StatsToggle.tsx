import React from 'react';

interface StatsToggleProps {
  showStats: 'basic' | 'advanced';
  onToggle: (type: 'basic' | 'advanced') => void;
}

export const StatsToggle: React.FC<StatsToggleProps> = ({ showStats, onToggle }) => (
  <div className="flex gap-4 mb-6">
    <button
      onClick={() => onToggle('basic')}
      className={`px-4 py-2 rounded ${
        showStats === 'basic' ? 'bg-blue-500' : 'bg-gray-700'
      }`}
    >
      Basic Stats
    </button>
    <button
      onClick={() => onToggle('advanced')}
      className={`px-4 py-2 rounded ${
        showStats === 'advanced' ? 'bg-blue-500' : 'bg-gray-700'
      }`}
    >
      Advanced Stats
    </button>
  </div>
);