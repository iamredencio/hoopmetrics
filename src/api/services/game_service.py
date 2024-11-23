# src/api/services/game_service.py
from typing import List, Dict, Optional
import logging
from datetime import datetime, timedelta
from ..models import GamePrediction
from ...data_ingestion.scrapers.basketball_reference import BasketballReferenceScraper

class GameService:
    def __init__(self):  # Simplified constructor
        self.logger = logging.getLogger(__name__)
        self.scraper = BasketballReferenceScraper(
            storage_connection_string="",  # Local storage for now
            base_path="data"
        )

    async def get_live_games(self) -> List[Dict]:
        """Get currently ongoing games"""
        try:
            # For now, return mock data since we don't have real-time data
            return [{
                "game_id": "202402210LAL",
                "status": "LIVE",
                "home_team": "LAL",
                "away_team": "GSW",
                "home_score": 85,
                "away_score": 82,
                "quarter": 3,
                "time_remaining": "8:45"
            }]
        except Exception as e:
            self.logger.error(f"Error fetching live games: {str(e)}")
            return []

    async def get_game_details(self, game_id: str) -> Optional[Dict]:
        """Get detailed game information"""
        try:
            games = await self.scraper.get_games(2024)
            for game in games:
                if game.game_id == game_id:
                    return {
                        "game_id": game.game_id,
                        "date": game.date,
                        "home_team": game.home_team,
                        "away_team": game.away_team,
                        "home_score": game.home_score,
                        "away_score": game.away_score,
                        "status": "Final"
                    }
            return None
        except Exception as e:
            self.logger.error(f"Error fetching game details: {str(e)}")
            return None

    async def get_schedule(self, date: Optional[str] = None) -> List[Dict]:
        """Get game schedule for a specific date"""
        try:
            games = await self.scraper.get_games(2024)
            return [{
                "game_id": game.game_id,
                "date": game.date,
                "home_team": game.home_team,
                "away_team": game.away_team,
                "time": "19:30"  # Mock time for now
            } for game in games]
        except Exception as e:
            self.logger.error(f"Error fetching schedule: {str(e)}")
            return []

    async def update_live_stats(self, game_id: str) -> Dict:
        """Update and return live game statistics"""
        try:
            # Mock live stats for now
            return {
                "game_id": game_id,
                "timestamp": datetime.now().isoformat(),
                "home_score": 85,
                "away_score": 82,
                "quarter": 3,
                "time_remaining": "8:45",
                "stats": {
                    "home": {
                        "fg_pct": 48.5,
                        "three_pt_pct": 35.8,
                        "rebounds": 34
                    },
                    "away": {
                        "fg_pct": 45.2,
                        "three_pt_pct": 33.1,
                        "rebounds": 31
                    }
                }
            }
        except Exception as e:
            self.logger.error(f"Error updating live stats: {str(e)}")
            return {}