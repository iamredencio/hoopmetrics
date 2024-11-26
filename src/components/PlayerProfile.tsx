import React from 'react';
import { Player } from '../types/player';
import { StatsGrid } from './profile/StatsGrid';
import { StatsChart } from './profile/StatsChart';
import { PredictedStats } from './profile/PredictedStats';
import { cn } from '../utils/cn';

interface PlayerProfileProps {
  player: Player;
}

export const PlayerProfile: React.FC<PlayerProfileProps> = ({ player }) => {
  return (
    <div className="w-full min-h-screen bg-stats-darker text-white p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-8">
          <h1 className="text-3xl font-display text-nba-gold">BASKETBALL PROFILE</h1>
          <nav className="flex gap-4">
            <button className="px-4 py-2 rounded-full bg-stats-dark text-sm">Statistics</button>
            <button className="px-4 py-2 rounded-full bg-stats-dark text-sm">Projections</button>
            <button className="px-4 py-2 rounded-full bg-stats-dark text-sm">Productions</button>
          </nav>
        </div>
        <button className="px-6 py-2 rounded-full bg-nba-gold text-stats-darker font-medium">
          Support
        </button>
      </header>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-8">
        {/* Left Column - Player Info */}
        <div className="col-span-7 bg-stats-dark rounded-3xl p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl text-nba-gold mb-2">POINTS & ASSISTS</h2>
              <p className="text-sm text-gray-400">Shooting Range Optimizing Results</p>
            </div>
            <button className="px-6 py-2 rounded-full bg-blue-500/20 text-nba-blue text-sm">
              FOLLOW PLAYER
            </button>
          </div>

          <div className="relative mb-8">
            <div className="absolute top-4 left-4 z-10">
              <div className="text-7xl font-display text-nba-gold">{player.stats.points}</div>
              <div className="text-sm text-gray-400 mt-2">POINTS</div>
            </div>
            <img
              src={`/api/player/${player.player_id}/image`}
              alt={player.name}
              className="w-full h-96 object-cover rounded-2xl"
            />
          </div>

          <StatsChart stats={player.stats} />
        </div>

        {/* Right Column - Stats */}
        <div className="col-span-5 space-y-8">
          <StatsGrid stats={player.stats} />
          <PredictedStats player={player} />
        </div>
      </div>
    </div>
  );
};