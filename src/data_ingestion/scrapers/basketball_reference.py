# src/data_ingestion/scrapers/basketball_reference.py
import asyncio
import aiohttp
import logging
from bs4 import BeautifulSoup
from datetime import datetime
from typing import List, Optional
from dataclasses import dataclass, asdict
import json
from pathlib import Path
import backoff
import random
import time

@dataclass
class PlayerStats:
    player_id: str
    name: str
    age: int
    team: str
    position: str
    games_played: int
    games_started: int
    minutes_per_game: float
    field_goals_per_game: float
    field_goal_attempts: float
    field_goal_percentage: float
    three_point_per_game: float
    three_point_attempts: float
    three_point_percentage: float
    two_point_per_game: float
    two_point_attempts: float
    two_point_percentage: float
    effective_fg_percentage: float
    free_throws_per_game: float
    free_throw_attempts: float
    free_throw_percentage: float
    offensive_rebounds: float
    defensive_rebounds: float
    total_rebounds: float
    assists: float
    steals: float
    blocks: float
    turnovers: float
    fouls: float
    points: float
    season: str


class BasketballReferenceScraper:
    def __init__(self, storage_connection_string: Optional[str] = None, base_path: Optional[str] = None):
        self.base_url = "https://www.basketball-reference.com"
        self.base_path = Path(base_path) if base_path else None
        self.logger = self._setup_logger()

        # Add list of user agents to rotate
        self.user_agents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0'
        ]

    def _setup_logger(self) -> logging.Logger:
        logger = logging.getLogger(__name__)
        logger.setLevel(logging.INFO)
        if not logger.handlers:
            handler = logging.StreamHandler()
            formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
            handler.setFormatter(formatter)
            logger.addHandler(handler)
        return logger
        
        
        

    def _get_random_headers(self):
        """Generate random headers to avoid detection"""
        return {
            'User-Agent': random.choice(self.user_agents),
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Cache-Control': 'max-age=0',
            'TE': 'Trailers',
            'DNT': '1'
        }

    @backoff.on_exception(
        backoff.expo,
        (aiohttp.ClientError, asyncio.TimeoutError),
        max_tries=5
    )
    async def _fetch_page(self, url: str) -> str:
        """Fetch a page with exponential backoff retry and rotating headers"""
        headers = self._get_random_headers()
        
        # Add a small random delay to avoid rate limiting
        await asyncio.sleep(random.uniform(1, 3))
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=headers, ssl=False) as response:
                self.logger.info(f"Request URL: {url}")
                self.logger.info(f"Response Status: {response.status}")
                self.logger.info(f"Response Headers: {response.headers}")
                
                content = await response.text()
                self.logger.info(f"Content length: {len(content)}")
                
                # Save the raw response for debugging
                if self.base_path:
                    debug_path = self.base_path / 'debug'
                    debug_path.mkdir(exist_ok=True)
                    with open(debug_path / 'raw_response.html', 'w', encoding='utf-8') as f:
                        f.write(content)
                    self.logger.info(f"Saved raw response to {debug_path / 'raw_response.html'}")
                
                if response.status == 200:
                    if 'captcha' in content.lower():
                        self.logger.error("Captcha detected in response")
                        raise Exception("Captcha detected")
                    
                    # Check if we got the expected content
                    if 'per_game_stats' not in content:
                        self.logger.warning("Expected table ID not found in response")
                        
                    return content
                elif response.status == 429:  # Too Many Requests
                    retry_after = int(response.headers.get('Retry-After', 60))
                    self.logger.warning(f"Rate limited, waiting {retry_after} seconds")
                    await asyncio.sleep(retry_after)
                    return await self._fetch_page(url)
                else:
                    response.raise_for_status()

    async def get_player_stats(self, season: int = 2024) -> List[PlayerStats]:
        url = f"{self.base_url}/leagues/NBA_{season}_per_game.html"
        html = await self._fetch_page(url)
        soup = BeautifulSoup(html, 'html.parser')
        
        stats_table = soup.find('table', {'id': 'per_game_stats'})
        if not stats_table:
            return []

        tbody = stats_table.find('tbody')
        if not tbody:
            return []

        rows = tbody.find_all('tr', recursive=False)
        self.logger.info(f"Found {len(rows)} rows in tbody")
        
        players = []
        for row in rows:
            try:
                if row.get('class') and ('thead' in row.get('class')):
                    continue

                name_cell = row.find(['td', 'th'], {'data-stat': 'name_display'})
                if not name_cell or not name_cell.find('a'):
                    continue

                def safe_float(cell_name: str) -> float:
                    cell = row.find('td', {'data-stat': cell_name})
                    return float(cell.text.strip() or 0) if cell and cell.text.strip() else 0.0

                def safe_int(cell_name: str) -> int:
                    cell = row.find('td', {'data-stat': cell_name})
                    return int(cell.text.strip() or 0) if cell and cell.text.strip() else 0

                player = PlayerStats(
                    player_id=name_cell.find('a')['href'].split('/')[-1].split('.')[0],
                    name=name_cell.text.strip(),
                    age=safe_int('age'),
                    team=row.find('td', {'data-stat': 'team_name_abbr'}).text.strip(),
                    position=row.find('td', {'data-stat': 'pos'}).text.strip(),
                    games_played=safe_int('games'),
                    games_started=safe_int('games_started'),
                    minutes_per_game=safe_float('mp_per_g'),
                    field_goals_per_game=safe_float('fg_per_g'),
                    field_goal_attempts=safe_float('fga_per_g'),
                    field_goal_percentage=safe_float('fg_pct'),
                    three_point_per_game=safe_float('fg3_per_g'),
                    three_point_attempts=safe_float('fg3a_per_g'),
                    three_point_percentage=safe_float('fg3_pct'),
                    two_point_per_game=safe_float('fg2_per_g'),
                    two_point_attempts=safe_float('fg2a_per_g'),
                    two_point_percentage=safe_float('fg2_pct'),
                    effective_fg_percentage=safe_float('efg_pct'),
                    free_throws_per_game=safe_float('ft_per_g'),
                    free_throw_attempts=safe_float('fta_per_g'),
                    free_throw_percentage=safe_float('ft_pct'),
                    offensive_rebounds=safe_float('orb_per_g'),
                    defensive_rebounds=safe_float('drb_per_g'),
                    total_rebounds=safe_float('trb_per_g'),
                    assists=safe_float('ast_per_g'),
                    steals=safe_float('stl_per_g'),
                    blocks=safe_float('blk_per_g'),
                    turnovers=safe_float('tov_per_g'),
                    fouls=safe_float('pf_per_g'),
                    points=safe_float('pts_per_g'),
                    season=str(season)
                )
                players.append(player)
                self.logger.info(f"Processed player: {player.name}")
                
            except Exception as e:
                self.logger.error(f"Error processing row: {str(e)}")
                continue

        return players
    
    async def _save_locally(self, data: List[any], filename: str):
        """Save data to local file"""
        try:
            file_path = self.base_path / filename
            file_path.parent.mkdir(parents=True, exist_ok=True)
            
            with open(file_path, 'w') as f:
                json.dump([asdict(item) for item in data], f, indent=2)
            
            self.logger.info(f"Saved data to {file_path}")
        except Exception as e:
            self.logger.error(f"Error saving data locally: {str(e)}")