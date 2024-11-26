import localforage from 'localforage';
import memoryCache from 'memory-cache';

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const FALLBACK_IMAGE = '/player-silhouette.png';

interface CacheEntry {
  url: string;
  timestamp: number;
}

export const imageCache = {
  async get(playerId: string): Promise<string> {
    // Check memory cache first
    const memCached = memoryCache.get(`player-${playerId}`);
    if (memCached) {
      return memCached;
    }

    try {
      // Check persistent cache
      const cached: CacheEntry | null = await localforage.getItem(`player-${playerId}`);
      
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        // Cache hit and not expired
        memoryCache.put(`player-${playerId}`, cached.url, CACHE_DURATION);
        return cached.url;
      }

      // Fetch new image
      const imageUrl = await fetchPlayerImage(playerId);
      
      // Store in both caches
      const entry: CacheEntry = { url: imageUrl, timestamp: Date.now() };
      await localforage.setItem(`player-${playerId}`, entry);
      memoryCache.put(`player-${playerId}`, imageUrl, CACHE_DURATION);
      
      return imageUrl;
    } catch (error) {
      console.error('Error fetching player image:', error);
      return FALLBACK_IMAGE;
    }
  },

  async prefetch(playerIds: string[]): Promise<void> {
    await Promise.all(playerIds.map(id => this.get(id)));
  },

  async clear(): Promise<void> {
    await localforage.clear();
    memoryCache.clear();
  }
};

async function fetchPlayerImage(playerId: string): Promise<string> {
  try {
    const response = await fetch(`https://cdn.nba.com/headshots/nba/latest/1040x760/${playerId}.png`);
    if (!response.ok) throw new Error('Image not found');
    return response.url;
  } catch {
    return FALLBACK_IMAGE;
  }
}