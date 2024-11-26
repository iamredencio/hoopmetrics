import useSWR from 'swr';
import { nbaApi, GameStats, ApiResponse } from '../lib/api';

export function usePlayerGameStats(playerId: number) {
  const currentSeason = new Date().getFullYear();
  
  const { data, error, isLoading } = useSWR<ApiResponse<GameStats>>(
    playerId ? ['playerGameStats', playerId] : null,
    () => nbaApi.getPlayerGameStats(playerId, currentSeason)
  );

  return {
    gameStats: data?.data.sort((a, b) => 
      new Date(a.game.date).getTime() - new Date(b.game.date).getTime()
    ) ?? [],
    isLoading,
    isError: error
  };
}