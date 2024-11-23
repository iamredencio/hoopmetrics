// # src/frontend/src/services/playerService.ts
const API_BASE_URL = '/api';

export const getPlayers = async (team?: string) => {
  const url = team 
    ? `${API_BASE_URL}/players?team=${team}`
    : `${API_BASE_URL}/players`;
    
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch players');
  }
  return response.json();
};

export const getPlayerById = async (playerId: string) => {
  const response = await fetch(`${API_BASE_URL}/players/${playerId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch player');
  }
  return response.json();
};