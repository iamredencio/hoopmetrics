# src/api/services/data_service.py
from typing import List, Dict, Optional
from datetime import datetime, timedelta
import json
import logging
from pathlib import Path
from ..models import PlayerStats

class Cache:
    def __init__(self, cache_dir: str = "data/cache"):
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        self.cache_duration = timedelta(hours=4)

    async def get(self, key: str) -> Optional[Dict]:
        cache_file = self.cache_dir / f"{key}.json"
        if not cache_file.exists():
            return None

        if datetime.fromtimestamp(cache_file.stat().st_mtime) + self.cache_duration < datetime.now():
            return None

        try:
            return json.loads(cache_file.read_text())
        except:
            return None

    async def set(self, key: str, data: Dict):
        cache_file = self.cache_dir / f"{key}.json"
        cache_file.write_text(json.dumps(data))

class DataService:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.cache = Cache()
        self.scraper = None
        self._initialize_scraper()

    def _initialize_scraper(self):
        from ...data_ingestion.scrapers.basketball_reference import BasketballReferenceScraper
        self.scraper = BasketballReferenceScraper(
            storage_connection_string="",  # Local storage for now
            base_path="data"
        )

    async def get_players(self, team: Optional[str] = None) -> List[PlayerStats]:
        """Get player statistics with caching"""
        cache_key = f"players_{team if team else 'all'}"
        
        # Try cache first
        cached_data = await self.cache.get(cache_key)
        if cached_data:
            self.logger.info("Returning players data from cache")
            return [PlayerStats(**player) for player in cached_data]

        try:
            # Get fresh data
            players_data = await self.scraper.get_player_stats(2024)
            
            players = []
            for player in players_data:
                # Calculate advanced stats
                stats = self._calculate_player_stats(player)

                if team and player.team != team:
                    continue

                player_stats = PlayerStats(
                    player_id=player.player_id,
                    name=player.name,
                    team=player.team,
                    stats=stats,
                    predictions=None
                )
                players.append(player_stats)

            # Cache the results
            await self.cache.set(cache_key, [player.dict() for player in players])
            
            self.logger.info(f"Retrieved and cached {len(players)} players")
            return players

        except Exception as e:
            self.logger.error(f"Error getting players: {str(e)}")
            raise

    def _calculate_player_stats(self, player) -> Dict[str, float]:
        """Calculate all player statistics"""
        try:
            usage_rate = self._calculate_usage_rate(player)
            true_shooting = self._calculate_true_shooting(player)
            per = self._calculate_player_efficiency(player)
            
            return {
                # Basic stats from scraper
                "points": player.points_per_game,
                "assists": player.assists_per_game,
                "rebounds": player.rebounds_per_game,
                "field_goal_percentage": player.field_goal_percentage,
                "three_point_percentage": player.three_point_percentage,
                "free_throw_percentage": player.free_throw_percentage,
                "minutes": player.minutes_per_game,
                "games_played": player.games_played,
                "games_started": player.games_started,
                "steals": player.steals_per_game,
                "blocks": player.blocks_per_game,
                "position": player.position,
                "age": player.age,
                
                # Advanced stats
                "usage_rate": usage_rate,
                "true_shooting_percentage": true_shooting,
                "player_efficiency": per,
                "assists_per_36": self._per_36_minutes(player.assists_per_game, player.minutes_per_game),
                "rebounds_per_36": self._per_36_minutes(player.rebounds_per_game, player.minutes_per_game),
                "points_per_36": self._per_36_minutes(player.points_per_game, player.minutes_per_game),
            }
        except Exception as e:
            self.logger.error(f"Error calculating stats for {player.name}: {str(e)}")
            return {}

    def _calculate_usage_rate(self, player) -> float:
        """Calculate player usage rate"""
        try:
            return ((player.field_goals_per_game + 0.44 * player.free_throw_percentage) * 
                   (player.minutes_per_game / 48)) / player.games_played
        except:
            return 0.0

    def _calculate_true_shooting(self, player) -> float:
        """Calculate true shooting percentage"""
        try:
            points = player.points_per_game * player.games_played
            fga = player.field_goals_per_game * player.games_played
            fta = player.free_throw_percentage * player.games_played
            return points / (2 * (fga + 0.44 * fta)) if (fga + 0.44 * fta) > 0 else 0
        except:
            return 0.0

    def _calculate_player_efficiency(self, player) -> float:
        """Calculate simple version of PER"""
        try:
            return ((player.points_per_game + player.rebounds_per_game + 
                    player.assists_per_game + player.steals_per_game) / 
                    player.minutes_per_game * 36)
        except:
            return 0.0

    def _per_36_minutes(self, stat: float, minutes: float) -> float:
        """Convert a stat to per-36-minutes basis"""
        try:
            return stat * (36 / minutes) if minutes > 0 else 0
        except:
            return 0.0

    async def get_player_by_id(self, player_id: str) -> Optional[PlayerStats]:
        """Get specific player statistics"""
        try:
            players = await self.get_players()
            for player in players:
                if player.player_id == player_id:
                    return player
            return None
        except Exception as e:
            self.logger.error(f"Error getting player {player_id}: {str(e)}")
            raise