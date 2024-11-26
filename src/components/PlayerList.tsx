import React, { Suspense } from 'react';
import { PlayerCard } from './PlayerCard';
import { SearchFilters } from './SearchFilters';
import { Pagination } from './Pagination';
import { ErrorBoundary } from './ErrorBoundary';
import { Loader2 } from 'lucide-react';
import { useNbaPlayers } from '../hooks/useNbaPlayers';

const PLAYERS_PER_PAGE = 10;

export const PlayerList: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedTeam, setSelectedTeam] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);

  const { players, meta, isLoading, isError } = useNbaPlayers({
    search: searchTerm,
    team: selectedTeam,
    page: currentPage,
    per_page: PLAYERS_PER_PAGE
  });

  if (isError) {
    return (
      <div className="text-center text-red-500 p-8">
        Failed to load players. Please try again later.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <SearchFilters
        searchTerm={searchTerm}
        selectedTeam={selectedTeam}
        onSearchChange={setSearchTerm}
        onTeamChange={setSelectedTeam}
      />

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-8">
            {players.map((player) => (
              <ErrorBoundary
                key={player.id}
                fallback={
                  <div className="bg-stats-dark rounded-2xl p-6 text-center">
                    <p className="text-red-400">Failed to load player card</p>
                  </div>
                }
              >
                <Suspense
                  fallback={
                    <div className="bg-stats-dark rounded-2xl p-6 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                    </div>
                  }
                >
                  <PlayerCard player={player} />
                </Suspense>
              </ErrorBoundary>
            ))}
          </div>

          {meta && (
            <Pagination
              currentPage={currentPage}
              totalPages={meta.total_pages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
};