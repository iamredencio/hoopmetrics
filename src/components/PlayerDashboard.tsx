import React, { useState } from 'react';
import { Player } from '../types/player';
import { StatGrid } from './dashboard/StatGrid';
import { PerformanceChart } from './dashboard/PerformanceChart';
import { PlayerCard } from './dashboard/PlayerCard';
import { DetailedStats } from './dashboard/DetailedStats';
import { CareerHighlights } from './dashboard/CareerHighlights';
import { teamColors } from '../data/teamColors';
import { motion, AnimatePresence } from 'framer-motion';
import { TabList } from './dashboard/TabList';

interface PlayerDashboardProps {
  player: Player;
}

type Tab = 'overview' | 'advanced' | 'highlights';

export const PlayerDashboard: React.FC<PlayerDashboardProps> = ({ player }) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const teamColor = teamColors[player.team];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'advanced', label: 'Advanced Stats' },
    { id: 'highlights', label: 'Highlights' },
  ];

  return (
    <div className="space-y-6">
      <TabList 
        tabs={tabs} 
        activeTab={activeTab} 
        onChange={(tab) => setActiveTab(tab as Tab)}
        teamColor={teamColor}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-12 gap-6"
        >
          {activeTab === 'overview' && (
            <>
              <div className="col-span-12 lg:col-span-4 space-y-6">
                <PlayerCard player={player} teamColor={teamColor} />
                <DetailedStats player={player} teamColor={teamColor} />
              </div>

              <div className="col-span-12 lg:col-span-8 space-y-6">
                <div className="bg-stats-dark rounded-2xl p-6 shadow-xl">
                  <h3 className="text-lg font-semibold text-white mb-4">Season Performance</h3>
                  <PerformanceChart stats={player.stats} teamColor={teamColor} />
                </div>
                <StatGrid player={player} teamColor={teamColor} />
              </div>
            </>
          )}

          {activeTab === 'advanced' && (
            <div className="col-span-12">
              <DetailedStats 
                player={player} 
                teamColor={teamColor} 
                expanded={true}
              />
            </div>
          )}

          {activeTab === 'highlights' && (
            <div className="col-span-12">
              <CareerHighlights 
                player={player} 
                teamColor={teamColor} 
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};