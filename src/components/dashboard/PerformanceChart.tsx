import React, { useState } from 'react';
import { usePlayerGameStats } from '../../hooks/usePlayerGameStats';
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { Loader2, TrendingUp } from 'lucide-react';
import { format, parseISO, subMonths } from 'date-fns';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

interface PerformanceChartProps {
  playerId: string;
  teamColor: { primary: string; secondary: string };
}

type StatType = 'points' | 'assists' | 'rebounds';
type TimeRange = '1M' | '3M' | '6M' | 'ALL';

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ playerId, teamColor }) => {
  const [selectedStats, setSelectedStats] = useState<StatType[]>(['points']);
  const [timeRange, setTimeRange] = useState<TimeRange>('3M');
  const [showTrends, setShowTrends] = useState(false);
  const { gameStats, isLoading, isError } = usePlayerGameStats(playerId);

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (isError || !gameStats.length) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        No game statistics available
      </div>
    );
  }

  const filterDataByTimeRange = (data: typeof gameStats) => {
    const now = new Date();
    const ranges = {
      '1M': subMonths(now, 1),
      '3M': subMonths(now, 3),
      '6M': subMonths(now, 6),
      'ALL': new Date(0)
    };
    return data.filter(game => parseISO(game.game_date) >= ranges[timeRange]);
  };

  const data = filterDataByTimeRange(gameStats);

  const statColors = {
    points: teamColor.secondary,
    assists: teamColor.primary,
    rebounds: '#60A5FA'
  };

  const statLabels = {
    points: 'Points',
    assists: 'Assists',
    rebounds: 'Rebounds'
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
      <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {Object.entries(statColors).map(([stat, color]) => (
            <TooltipPrimitive.Provider key={stat}>
              <TooltipPrimitive.Root>
                <TooltipPrimitive.Trigger asChild>
                  <button
                    onClick={() => toggleStat(stat as StatType)}
                    className={`px-3 py-1 rounded-full text-sm transition-all ${
                      selectedStats.includes(stat as StatType)
                        ? 'bg-opacity-100 text-white'
                        : 'bg-opacity-20 text-gray-400'
                    }`}
                    style={{ backgroundColor: selectedStats.includes(stat as StatType) ? color : '#2A2A3C' }}
                  >
                    {statLabels[stat as StatType]}
                  </button>
                </TooltipPrimitive.Trigger>
                <TooltipPrimitive.Portal>
                  <TooltipPrimitive.Content
                    className="bg-stats-dark px-3 py-2 rounded-lg text-sm shadow-xl"
                    sideOffset={5}
                  >
                    Click to toggle {statLabels[stat as StatType]}
                    <TooltipPrimitive.Arrow className="fill-stats-dark" />
                  </TooltipPrimitive.Content>
                </TooltipPrimitive.Portal>
              </TooltipPrimitive.Root>
            </TooltipPrimitive.Provider>
          ))}
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-stats-dark rounded-lg p-1 w-full sm:w-auto">
            {(['1M', '3M', '6M', 'ALL'] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded text-sm transition-colors flex-1 sm:flex-none ${
                  timeRange === range
                    ? 'bg-nba-gold text-stats-dark'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowTrends(!showTrends)}
            className={`p-2 rounded-lg transition-colors ${
              showTrends ? 'bg-nba-gold text-stats-dark' : 'bg-stats-dark text-gray-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
            <defs>
              {Object.entries(statColors).map(([stat, color]) => (
                <linearGradient key={stat} id={`color${stat}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0}/>
                </linearGradient>
              ))}
            </defs>
            
            <XAxis 
              dataKey="game_date" 
              stroke="#6B7280"
              axisLine={false}
              tickLine={false}
              tickFormatter={(date) => format(parseISO(date), 'MMM d')}
              label={{ 
                value: 'Game Date', 
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
            <RechartsTooltip
              contentStyle={{
                backgroundColor: '#1a1a2e',
                border: 'none',
                borderRadius: '0.5rem',
                color: '#fff',
              }}
              formatter={(value: number, name: string) => [
                value.toFixed(1),
                statLabels[name as StatType]
              ]}
              labelFormatter={(date) => format(parseISO(date), 'MMMM d, yyyy')}
            />
            <Legend />
            
            {selectedStats.map(stat => (
              <Area
                key={stat}
                type="monotone"
                dataKey={stat}
                name={statLabels[stat]}
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