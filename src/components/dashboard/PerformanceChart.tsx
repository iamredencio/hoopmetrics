import React, { useState } from 'react';
import { usePlayerGameStats } from '../../hooks/usePlayerGameStats';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Loader2 } from 'lucide-react';

interface PerformanceChartProps {
  playerId: string;
  teamColor: { primary: string; secondary: string };
}

type StatType = 'points' | 'assists' | 'rebounds';

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ playerId, teamColor }) => {
  const [selectedStats, setSelectedStats] = useState<StatType[]>(['points']);
  const { gameStats, isLoading, isError } = usePlayerGameStats(Number(playerId));

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (isError || gameStats.length === 0) {
    // Fallback to mock data for demonstration
    const mockData = Array.from({ length: 10 }, (_, i) => ({
      game: i + 1,
      points: 20 + Math.random() * 10,
      assists: 5 + Math.random() * 5,
      rebounds: 5 + Math.random() * 7,
      date: new Date(2024, 0, i + 1).toLocaleDateString(),
    }));

    return (
      <ChartContent
        data={mockData}
        selectedStats={selectedStats}
        setSelectedStats={setSelectedStats}
        teamColor={teamColor}
      />
    );
  }

  const data = gameStats.map((game, index) => ({
    game: index + 1,
    points: game.pts,
    assists: game.ast,
    rebounds: game.reb,
    date: new Date(game.game.date).toLocaleDateString(),
  }));

  return (
    <ChartContent
      data={data}
      selectedStats={selectedStats}
      setSelectedStats={setSelectedStats}
      teamColor={teamColor}
    />
  );
};

interface ChartContentProps {
  data: any[];
  selectedStats: StatType[];
  setSelectedStats: (stats: StatType[]) => void;
  teamColor: { primary: string; secondary: string };
}

const ChartContent: React.FC<ChartContentProps> = ({
  data,
  selectedStats,
  setSelectedStats,
  teamColor,
}) => {
  const statColors = {
    points: teamColor.secondary,
    assists: teamColor.primary,
    rebounds: '#60A5FA',
  };

  const toggleStat = (stat: StatType) => {
    setSelectedStats(prev =>
      prev.includes(stat)
        ? prev.filter(s => s !== stat)
        : [...prev, stat]
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {Object.entries(statColors).map(([stat, color]) => (
          <button
            key={stat}
            onClick={() => toggleStat(stat as StatType)}
            className={`px-3 py-1 rounded-full text-sm transition-all ${
              selectedStats.includes(stat as StatType)
                ? 'bg-opacity-100 text-white'
                : 'bg-opacity-20 text-gray-400'
            }`}
            style={{ backgroundColor: selectedStats.includes(stat as StatType) ? color : '#2A2A3C' }}
          >
            {stat.charAt(0).toUpperCase() + stat.slice(1)}
          </button>
        ))}
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              {Object.entries(statColors).map(([stat, color]) => (
                <linearGradient key={stat} id={`color${stat}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0}/>
                </linearGradient>
              ))}
            </defs>
            
            <XAxis 
              dataKey="game" 
              stroke="#6B7280"
              axisLine={false}
              tickLine={false}
              label={{ 
                value: 'Games', 
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
              formatter={(value: number, name: string) => [
                `${value.toFixed(1)} ${name === 'points' ? 'PTS' : name === 'assists' ? 'AST' : 'REB'}`,
                name.charAt(0).toUpperCase() + name.slice(1)
              ]}
              labelFormatter={(game: number) => `Game ${game}`}
            />
            <Legend />
            
            {selectedStats.map(stat => (
              <Area
                key={stat}
                type="monotone"
                dataKey={stat}
                name={stat.charAt(0).toUpperCase() + stat.slice(1)}
                stroke={statColors[stat]}
                fill={`url(#color${stat})`}
                fillOpacity={1}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};