# src/data_ingestion/scrapers/nba_stats.py
import aiohttp
import asyncio
import logging
from typing import Dict, List, Optional
from datetime import datetime
import json
from dataclasses import dataclass, asdict
from azure.storage.blob import BlobServiceClient
import backoff
from pathlib import Path

@dataclass
class PlayerAdvancedStats:
    player_id: str
    name: str
    team_id: str
    team: str
    gp: int
    min: float
    offensive_rating: float
    defensive_rating: float
    net_rating: float
    ast_pct: float
    reb_pct: float
    usg_pct: float
    ts_pct: float
    efg_pct: float
    season: str

class NBAStatsScraper:
    def __init__(self, storage_connection_string: str, base_path: Optional[str] = None):
        self.base_url = "https://stats.nba.com/stats"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'x-nba-stats-origin': 'stats',
            'x-nba-stats-token': 'true',
            'Origin': 'https://www.nba.com',
            'Referer': 'https://www.nba.com/'
        }
        self.blob_service_client = BlobServiceClient.from_connection_string(storage_connection_string)
        self.base_path = Path(base_path) if base_path else None
        self.logger = self._setup_logger()
        self.session = None

    def _setup_logger(self) -> logging.Logger:
        logger = logging.getLogger(__name__)
        logger.setLevel(logging.INFO)
        handler = logging.StreamHandler()
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        return logger

    async def __aenter__(self):
        self.session = aiohttp.ClientSession(headers=self.headers)
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()

    @backoff.on_exception(
        backoff.expo,
        (aiohttp.ClientError, asyncio.TimeoutError),
        max_tries=5
    )
    async def _fetch_data(self, endpoint: str, params: Dict) -> Dict:
        """Fetch data from NBA Stats API with retry logic"""
        if not self.session:
            raise RuntimeError("Session not initialized. Use 'async with' context manager.")
            
        url = f"{self.base_url}/{endpoint}"
        async with self.session.get(url, params=params) as response:
            if response.status == 429:  # Too Many Requests
                retry_after = int(response.headers.get('Retry-After', 60))
                self.logger.warning(f"Rate limited, waiting {retry_after} seconds")
                await asyncio.sleep(retry_after)
                return await self._fetch_data(endpoint, params)
                
            response.raise_for_status()
            return await response.json()

    async def get_player_advanced_stats(self, season: str = "2023-24") -> List[PlayerAdvancedStats]:
        """Fetch advanced player statistics"""
        params = {
            'MeasureType': 'Advanced',
            'PerMode': 'PerGame',
            'PlusMinus': 'N',
            'PaceAdjust': 'N',
            'Rank': 'N',
            'Season': season,
            'SeasonType': 'Regular Season',
            'Outcome': None,
            'Location': None,
            'Month': 0,
            'SeasonSegment': None,
            'DateFrom': None,
            'DateTo': None,
            'OpponentTeamID': 0,
            'VsConference': None,
            'VsDivision': None,
            'GameSegment': None,
            'Period': 0,
            'LastNGames': 0
        }

        try:
            data = await self._fetch_data('leaguedashplayerstats', params)
            headers = data['resultSets'][0]['headers']
            rows = data['resultSets'][0]['rowSet']

            players = []
            for row in rows:
                player_dict = dict(zip(headers, row))