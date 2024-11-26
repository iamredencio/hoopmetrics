import useSWR from 'swr';
import { format, subMonths } from 'date-fns';

interface GameStats {
  game_date: string;
  points: number;
  assists: number;
  rebounds: number;
}

export function usePlayerGameStats(playerId: string) {
  // For now, we'll use mock data since we don't have a real API
  const getMockGameStats = (): GameStats[] => {
    return Array.from({ length: 20 }, (_, i) => ({
      game_date: format(subMonths(new Date(), i), 'yyyy-MM-dd'),
      points: 15 + Math.random() * 20,
      assists: 3 + Math.random() * 7,
      rebounds: 4 + Math.random() * 8
    })).reverse();
  };

  const { data, error } = useSWR(
    ['playerGameStats', playerId],
    () => getMockGameStats(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000 // 5 minutes
    }
  );

  return {
    gameStats: data || [],
    isLoading: !error && !data,
    isError: error
  };
}