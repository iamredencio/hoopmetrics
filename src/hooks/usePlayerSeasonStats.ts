import useSWR from 'swr';
import { nbaApi, SeasonStats } from '../lib/api';
import { subYears } from 'date-fns';

export function usePlayerSeasonStats(playerId: number) {
  const currentYear = new Date().getFullYear();
  const startYear = subYears(new Date(), 10).getFullYear();
  const seasons = Array.from(
    { length: currentYear - startYear + 1 }, 
    (_, i) => startYear + i
  );
  
  const { data, error, isLoading } = useSWR(
    playerId ? ['playerSeasonStats', playerId, seasons.join(',')] : null,
    () => nbaApi.getPlayerSeasonAverages(playerId, seasons)
  );

  return {
    seasonStats: data ?? [],
    isLoading,
    isError: error
  };
}