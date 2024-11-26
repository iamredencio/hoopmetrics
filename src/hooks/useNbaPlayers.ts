import useSWR from 'swr';
import { nbaApi, PlayerSearchParams, ApiResponse } from '../lib/api';
import { Player } from '../types/player';

export function useNbaPlayers(params: PlayerSearchParams = {}) {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<Player>>(
    ['players', params],
    () => nbaApi.getPlayers(params),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // 1 minute
    }
  );

  return {
    players: data?.data ?? [],
    meta: data?.meta,
    isLoading,
    isError: error,
    mutate
  };
}