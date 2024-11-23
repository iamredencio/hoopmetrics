# src/data_ingestion/scrapers/robots_parser.py
import aiohttp
import urllib.robotparser
import asyncio
from typing import Optional
import logging
from datetime import datetime, timedelta

class AsyncRobotsParser:
    def __init__(self):
        self.parser = urllib.robotparser.RobotFileParser()
        self.last_checked = None
        self.cache_duration = timedelta(hours=24)  # Cache robots.txt for 24 hours
        self.logger = logging.getLogger(__name__)

    async def fetch_and_parse(self, base_url: str) -> None:
        """Fetch and parse robots.txt file"""
        try:
            robots_url = f"{base_url}/robots.txt"
            async with aiohttp.ClientSession() as session:
                async with session.get(robots_url) as response:
                    if response.status == 200:
                        content = await response.text()
                        self.parser.parse(content.splitlines())
                        self.last_checked = datetime.now()
                        self.logger.info(f"Successfully fetched and parsed robots.txt from {robots_url}")
                    else:
                        self.logger.warning(f"Could not fetch robots.txt from {robots_url}, status: {response.status}")
                        # If we can't fetch robots.txt, assume conservative crawl delay
                        self.parser.set_url(robots_url)
        except Exception as e:
            self.logger.error(f"Error fetching robots.txt: {str(e)}")
            raise

    async def can_fetch(self, base_url: str, user_agent: str, url: str) -> bool:
        """Check if user agent can fetch URL according to robots.txt rules"""
        # Refresh robots.txt if needed
        if not self.last_checked or datetime.now() - self.last_checked > self.cache_duration:
            await self.fetch_and_parse(base_url)

        return self.parser.can_fetch(user_agent, url)

    def get_crawl_delay(self, user_agent: str) -> float:
        """Get crawl delay for user agent, default to 3 seconds if not specified"""
        return self.parser.crawl_delay(user_agent) or 3.0

# Update the BasketballReferenceScraper to use robots.txt
class RateLimiter:
    def __init__(self, calls: int, period: int):
        self.calls = calls
        self.period = period
        self.timestamps = []

    async def acquire(self):
        now = datetime.now().timestamp()
        
        # Remove timestamps outside the window
        self.timestamps = [ts for ts in self.timestamps if now - ts <= self.period]
        
        if len(self.timestamps) >= self.calls:
            sleep_time = self.timestamps[0] + self.period - now
            if sleep_time > 0:
                await asyncio.sleep(sleep_time)
            self.timestamps = self.timestamps[1:]
        
        self.timestamps.append(now)

class BasketballReferenceScraper:
    def __init__(self, storage_connection_string: str, base_path: Optional[str] = None):
        self.base_url = "https://www.basketball-reference.com"
        self.user_agent = "NBAAnalyticsPipeline/1.0 (Academic Research Project)"
        self.robots_parser = AsyncRobotsParser()
        self.rate_limiter = None  # Will be initialized after parsing robots.txt
        self.logger = logging.getLogger(__name__)

    async def _init_rate_limiter(self):
        """Initialize rate limiter based on robots.txt"""
        await self.robots_parser.fetch_and_parse(self.base_url)
        crawl_delay = self.robots_parser.get_crawl_delay(self.user_agent)
        # Convert crawl delay to requests per minute
        requests_per_minute = int(60 / crawl_delay)
        self.rate_limiter = RateLimiter(calls=requests_per_minute, period=60)
        self.logger.info(f"Rate limiter initialized with {requests_per_minute} requests per minute")

    async def _check_robots_permission(self, url: str) -> bool:
        """Check if we have permission to fetch URL"""
        return await self.robots_parser.can_fetch(self.base_url, self.user_agent, url)

    async def fetch_data(self, url: str) -> Optional[str]:
        """Fetch data respecting robots.txt and rate limits"""
        if not self.rate_limiter:
            await self._init_rate_limiter()

        if not await self._check_robots_permission(url):
            self.logger.warning(f"robots.txt disallows fetching {url}")
            return None

        await self.rate_limiter.acquire()

        try:
            async with aiohttp.ClientSession(headers={'User-Agent': self.user_agent}) as session:
                async with session.get(url) as response:
                    if response.status == 200:
                        return await response.text()
                    else:
                        self.logger.error(f"Error fetching {url}: {response.status}")
                        return None
        except Exception as e:
            self.logger.error(f"Exception while fetching {url}: {str(e)}")
            return None

    # ... rest of the scraper implementation ...