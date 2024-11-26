import React from 'react';
import { Search } from 'lucide-react';

interface SearchFiltersProps {
  searchTerm: string;
  selectedTeam: string;
  sortBy: string;
  teams: string[];
  onSearchChange: (value: string) => void;
  onTeamChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchTerm,
  selectedTeam,
  sortBy,
  teams,
  onSearchChange,
  onTeamChange,
  onSortChange,
}) => (
  <div className="mb-6 space-y-4">
    <div className="flex gap-4 flex-wrap">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search players..."
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <select
        className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
        value={selectedTeam}
        onChange={(e) => onTeamChange(e.target.value)}
      >
        <option value="">All Teams</option>
        {teams.map(team => (
          <option key={team} value={team}>{team}</option>
        ))}
      </select>
      
      <select
        className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="name">Sort by Name</option>
        <option value="team">Sort by Team</option>
        <option value="points">Sort by Points</option>
      </select>
    </div>
  </div>
);