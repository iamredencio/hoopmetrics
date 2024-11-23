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

// Mock Data
const mockPlayers: Player[] = [
  {
    player_id: "1",
    name: "LeBron James",
    team: "LAL",
    stats: {
      points: 27.5,
      rebounds: 7.8,
      assists: 8.2,
      field_goal_percentage: 52.5,
      usage_rate: 31.2,
      true_shooting_percentage: 58.8,
      player_efficiency: 25.3,
      points_per_36: 28.4
    }
  },
  {
    player_id: "2",
    name: "Stephen Curry",
    team: "GSW",
    stats: {
      points: 29.8,
      rebounds: 5.2,
      assists: 6.4,
      field_goal_percentage: 48.7,
      usage_rate: 32.1,
      true_shooting_percentage: 62.3,
      player_efficiency: 26.1,
      points_per_36: 30.2
    }
  },
  {
    player_id: "3",
    name: "Kevin Durant",
    team: "PHO",
    stats: {
      points: 31.2,
      rebounds: 6.5,
      assists: 5.3,
      field_goal_percentage: 54.8,
      usage_rate: 33.5,
      true_shooting_percentage: 63.1,
      player_efficiency: 27.2,
      points_per_36: 32.1
    }
  },
  {
    player_id: "4",
    name: "Joel Embiid",
    team: "PHI",
    stats: {
      points: 33.1,
      rebounds: 10.2,
      assists: 4.2,
      field_goal_percentage: 54.8,
      usage_rate: 37.5,
      true_shooting_percentage: 65.5,
      player_efficiency: 31.2,
      points_per_36: 35.4
    }
  },
  {
    player_id: "5",
    name: "Giannis Antetokounmpo",
    team: "MIL",
    stats: {
      points: 30.5,
      rebounds: 11.8,
      assists: 5.7,
      field_goal_percentage: 57.1,
      usage_rate: 32.8,
      true_shooting_percentage: 60.2,
      player_efficiency: 29.8,
      points_per_36: 31.5
    }
  }
];

// PlayerCard Component
const PlayerCard: React.FC<{ player: Player }> = ({ player }) => {
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

const App: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Simulate API call with mock data
    setTimeout(() => {
      setPlayers(mockPlayers);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return <div className="text-center p-4 text-white">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

  // Filter players
  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTeam = !selectedTeam || player.team === selectedTeam;
    return matchesSearch && matchesTeam;
  });

  // Get unique teams for filter
  const teams = Array.from(new Set(players.map(player => player.team))).sort();

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 p-4 mb-6">
        <h1 className="text-2xl text-white font-bold">NBA Player Stats</h1>
      </header>

      {/* Search and Filters */}
      <div className="container mx-auto px-4 mb-6">
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
        </div>
      </div>

      {/* Player Cards */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8">
          {filteredPlayers.map((player) => (
            <PlayerCard key={player.player_id} player={player} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;