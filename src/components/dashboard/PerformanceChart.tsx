import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Loader2, TrendingUp, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import { Player } from '../../types/player';

interface ViewToggleProps {
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
  teamColor: { primary: string; secondary: string };
}

const ViewToggle: React.FC<ViewToggleProps> = ({
  icon: Icon,
  label,
  isActive,
  onClick,
  teamColor,
}) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
      isActive 
        ? "bg-gray-700 text-white"
        : "bg-stats-dark text-gray-400 hover:text-white"
    )}
  >
    <Icon className="w-4 h-4" />
    <span className="text-sm font-medium">{label}</span>
  </button>
);

interface StatTogglesProps {
  selectedStats: string[];
  setSelectedStats: (stats: string[]) => void;
  teamColor: { primary: string; secondary: string };
}

const StatToggles: React.FC<StatTogglesProps> = ({
  selectedStats,
  setSelectedStats,
  teamColor,
}) => {
  const toggleStat = (stat: string) => {
    if (selectedStats.includes(stat)) {
      setSelectedStats(selectedStats.filter(s => s !== stat));
    } else {
      setSelectedStats([...selectedStats, stat]);
    }
  };

  const stats = [
    { key: 'points', label: 'Points' },
    { key: 'assists', label: 'Assists' },
    { key: 'rebounds', label: 'Rebounds' },
  ];

  return (
    <div className="flex gap-2">
      {stats.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => toggleStat(key)}
          className={cn(
            "px-3 py-1 rounded-lg text-sm transition-colors",
            selectedStats.includes(key)
              ? "bg-gray-700 text-white"
              : "bg-stats-dark text-gray-400 hover:text-white"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

interface ChartProps {
  data: any[];
  selectedStats: string[];
  teamColor: { primary: string; secondary: string };
  viewType: 'games' | 'seasons';
}

const Chart: React.FC<ChartProps> = ({ data, selectedStats, teamColor, viewType }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <XAxis
          dataKey="label"
          stroke="#6B7280"
          axisLine={false}
          tickLine={false}
          label={{ 
            value: viewType === 'games' ? 'Games' : 'Seasons', 
            position: 'bottom',
            offset: 0,
            style: { fill: '#6B7280' }
          }}
        />
        <YAxis
          stroke="#6B7280"
          axisLine={false}
          tickLine={false}
          label={{ 
            value: 'Statistics', 
            angle: -90, 
            position: 'left',
            offset: 10,
            style: { fill: '#6B7280' }
          }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1a1a2e',
            border: 'none',
            borderRadius: '0.5rem',
            color: '#fff',
          }}
        />
        <Legend />
        {selectedStats.includes('points') && (
          <Area
            type="monotone"
            dataKey="points"
            stroke={teamColor.secondary}
            fill={`${teamColor.secondary}33`}
            name="Points"
          />
        )}
        {selectedStats.includes('assists') && (
          <Area
            type="monotone"
            dataKey="assists"
            stroke={teamColor.primary}
            fill={`${teamColor.primary}33`}
            name="Assists"
          />
        )}
        {selectedStats.includes('rebounds') && (
          <Area
            type="monotone"
            dataKey="rebounds"
            stroke="#60A5FA"
            fill="#60A5FA33"
            name="Rebounds"
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
};

interface PerformanceChartProps {
  player: Player;
  teamColor: { primary: string; secondary: string };
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ player, teamColor }) => {
  const [selectedStats, setSelectedStats] = useState<string[]>(['points']);
  const [viewType, setViewType] = useState<'games' | 'seasons'>('seasons');

  // Generate mock data for demonstration
  const generateMockData = (type: 'games' | 'seasons') => {
    const baseStats = {
      points: player?.stats?.points ?? 0,
      assists: player?.stats?.assists ?? 0,
      rebounds: player?.stats?.rebounds ?? 0,
    };

    if (type === 'games') {
      return Array.from({ length: 10 }, (_, i) => ({
        label: `Game ${i + 1}`,
        points: Math.round(baseStats.points * (0.8 + Math.random() * 0.4)),
        assists: Math.round(baseStats.assists * (0.8 + Math.random() * 0.4)),
        rebounds: Math.round(baseStats.rebounds * (0.8 + Math.random() * 0.4)),
      }));
    } else {
      const currentYear = new Date().getFullYear();
      return Array.from({ length: 5 }, (_, i) => ({
        label: currentYear - 4 + i,
        points: Math.round(baseStats.points * (0.8 + Math.random() * 0.4)),
        assists: Math.round(baseStats.assists * (0.8 + Math.random() * 0.4)),
        rebounds: Math.round(baseStats.rebounds * (0.8 + Math.random() * 0.4)),
      }));
    }
  };

  if (!player || !player.stats) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin mr-2" />
        Loading player stats...
      </div>
    );
  }

  const data = generateMockData(viewType);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-2">
          <ViewToggle
            icon={TrendingUp}
            label="Games"
            isActive={viewType === 'games'}
            onClick={() => setViewType('games')}
            teamColor={teamColor}
          />
          <ViewToggle
            icon={Calendar}
            label="Seasons"
            isActive={viewType === 'seasons'}
            onClick={() => setViewType('seasons')}
            teamColor={teamColor}
          />
        </div>
        <StatToggles
          selectedStats={selectedStats}
          setSelectedStats={setSelectedStats}
          teamColor={teamColor}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={viewType}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="h-64"
        >
          <Chart
            data={data}
            selectedStats={selectedStats}
            teamColor={teamColor}
            viewType={viewType}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};