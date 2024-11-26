import axios from 'axios';
import rateLimit from 'axios-rate-limit';
import queryString from 'query-string';
import { Player } from '../types/player';

const BASE_URL = 'https://api.balldontlie.io/v1';

// Create rate-limited axios instance
const api = rateLimit(axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
}), { 
  maxRequests: 60,
  perMilliseconds: 60000 // 60 requests per minute
});

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 429) {
      console.error('Rate limit exceeded');
      // Implement retry logic here if needed
    }
    return Promise.reject(error);
  }
);

export interface PlayerSearchParams {
  search?: string;
  team?: string;
  page?: number;
  per_page?: number;
}

export interface ApiResponse<T> {
  data: T[];
  meta: {
    total_pages: number;
    current_page: number;
    next_page: number;
    per_page: number;
    total_count: number;
  };
}

export const nbaApi = {
  async getPlayers(params: PlayerSearchParams = {}): Promise<ApiResponse<Player>> {
    const query = queryString.stringify(params);
    const { data } = await api.get(`/players?${query}`);
    return data;
  },

  async getPlayer(id: number): Promise<Player> {
    const { data } = await api.get(`/players/${id}`);
    return data;
  },

  async getPlayerStats(id: number, season: number): Promise<any> {
    const { data } = await api.get(`/season_averages?season=${season}&player_ids[]=${id}`);
    return data.data[0];
  }
};