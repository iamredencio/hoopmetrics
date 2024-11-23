// # src/frontend/src/components/players/PlayerList.tsx
import React, { useEffect, useState } from 'react'; 
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Search } from 'lucide-react';

// Types
interface PlayerStats {
  points: number;
  rebounds: number;
  assists: number;
  field_goal_percentage: number;
  usage_rate: number;
  true_shooting_percentage: number;
  player_efficiency: number;
  points_per_36: number;
}

interface Player {
  player_id: string;
  name: string;
  team: string;
  stats: PlayerStats;
}

interface PlayerCardProps {
  player: Player;
}

interface PlayerListProps {
  players: Player[];
}

const PlayerCard = ({ player = {} as Player }) => {
  const [showStats, setShowStats] = useState('basic');
  const {
    name = "Unknown Player",
    team = "Unknown Team",
    stats = {} as PlayerStats
  } = player;

  const dummyChartData = [
    { game: '1', value: 20 },
    { game: '2', value: 25 },
    { game: '3', value: 22 },
    { game: '4', value: 28 },
    { game: '5', value: 26 },
  ];

  const basicStats = {
    points: stats.points || 0,
    rebounds: stats.rebounds || 0,
    assists: stats.assists || 0,
    field_goal_percentage: stats.field_goal_percentage || 0,
  };

  const advancedStats = {
    usage_rate: stats.usage_rate || 0,
    true_shooting_percentage: stats.true_shooting_percentage || 0,
    player_efficiency: stats.player_efficiency || 0,
    points_per_36: stats.points_per_36 || 0,
  };

  return (
    <div className="w-full max-w-2xl bg-gray-900 rounded-xl p-6 text-white">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left side */}
        <div className="w-full md:w-1/3">
          <img
            src="/api/placeholder/300/400"
            alt={name}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
          <h2 className="text-2xl font-bold mb-2">{name}</h2>
          <p className="text-blue-400 mb-4">{team}</p>
        </div>

        {/* Right side */}
        <div className="w-full md:w-2/3">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setShowStats('basic')}
              className={`px-4 py-2 rounded ${
                showStats === 'basic' ? 'bg-blue-500' : 'bg-gray-700'
              }`}
            >
              Basic Stats
            </button>
            <button
              onClick={() => setShowStats('advanced')}
              className={`px-4 py-2 rounded ${
                showStats === 'advanced' ? 'bg-blue-500' : 'bg-gray-700'
              }`}
            >
              Advanced Stats
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {showStats === 'basic' ? (
              <>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-lg mb-2">Points</h3>
                  <p className="text-3xl font-bold text-blue-400">
                    {basicStats.points.toFixed(1)}
                  </p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-lg mb-2">Rebounds</h3>
                  <p className="text-3xl font-bold text-blue-400">
                    {basicStats.rebounds.toFixed(1)}
                  </p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-lg mb-2">Assists</h3>
                  <p className="text-3xl font-bold text-blue-400">
                    {basicStats.assists.toFixed(1)}
                  </p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-lg mb-2">FG%</h3>
                  <p className="text-3xl font-bold text-blue-400">
                    {basicStats.field_goal_percentage.toFixed(1)}%
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-lg mb-2">Usage Rate</h3>
                  <p className="text-3xl font-bold text-blue-400">
                    {advancedStats.usage_rate.toFixed(1)}%
                  </p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-lg mb-2">True Shooting</h3>
                  <p className="text-3xl font-bold text-blue-400">
                    {advancedStats.true_shooting_percentage.toFixed(1)}%
                  </p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-lg mb-2">PER</h3>
                  <p className="text-3xl font-bold text-blue-400">
                    {advancedStats.player_efficiency.toFixed(1)}
                  </p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-lg mb-2">Points/36</h3>
                  <p className="text-3xl font-bold text-blue-400">
                    {advancedStats.points_per_36.toFixed(1)}
                  </p>
                </div>
              </>
            )}
          </div>

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
        </div>
      </div>
    </div>
  );
};

const PlayerList = ({ players = [] }: PlayerListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const playersPerPage = 5;

  // Get unique team list
  const teams = Array.from(new Set(players.map(player => player.team))).sort();

  // Filter players
  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTeam = !selectedTeam || player.team === selectedTeam;
    return matchesSearch && matchesTeam;
  });

  // Sort players
  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    switch (sortBy) {
      case 'points':
        return (b.stats?.points || 0) - (a.stats?.points || 0);
      case 'team':
        return a.team.localeCompare(b.team);
      default:
        return a.name.localeCompare(b.name);
    }
  });

  // Pagination
  const indexOfLastPlayer = currentPage * playersPerPage;
  const indexOfFirstPlayer = indexOfLastPlayer - playersPerPage;
  const currentPlayers = sortedPlayers.slice(indexOfFirstPlayer, indexOfLastPlayer);
  const totalPages = Math.ceil(sortedPlayers.length / playersPerPage);

  return (
    <div className="container mx-auto p-4">
      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4 flex-wrap">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search players..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
          >
            <option value="">All Teams</option>
            {teams.map(team => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
          
          <select
            className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Sort by Name</option>
            <option value="team">Sort by Team</option>
            <option value="points">Sort by Points</option>
          </select>
        </div>
      </div>

      {/* Player Cards */}
      <div className="grid grid-cols-1 gap-8">
        {currentPlayers.map((player) => (
          <PlayerCard key={player.player_id || Math.random()} player={player} />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center gap-2">
        <button
          className="px-4 py-2 rounded bg-blue-500 text-white disabled:bg-gray-600"
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2 text-white">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-4 py-2 rounded bg-blue-500 text-white disabled:bg-gray-600"
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PlayerList;