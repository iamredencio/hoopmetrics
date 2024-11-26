import useSWR from 'swr';
import { nbaApi } from '../lib/api';
import { Player } from '../types/player';

export function useNbaPlayer(id: number) {
  const { data: player, error: playerError } = useSWR<Player>(
    ['player', id],
    () => nbaApi.getPlayer(id),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000, // 5 minutes
    }
  );

  const { data: stats, error: statsError } = useSWR(
    player ? ['playerStats', id] : null,
    () => nbaApi.getPlayerStats(id, new Date().getFullYear()),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000,
    }
  );

  return {
    player,
    stats,
    isLoading: !player && !playerError,
    isError: playerError || statsError
  };
}