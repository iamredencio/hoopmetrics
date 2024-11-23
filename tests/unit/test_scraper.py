# tests/unit/test_scraper.py
import asyncio
import pytest
from pathlib import Path
import logging
import json
from dataclasses import asdict

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@pytest.mark.asyncio
async def test_player_stats():
    """Test player statistics retrieval"""
    from src.data_ingestion.scrapers.basketball_reference import BasketballReferenceScraper
    
    # Create test directory
    test_dir = Path("data/test")
    test_dir.mkdir(parents=True, exist_ok=True)
    
    # Initialize scraper
    scraper = BasketballReferenceScraper(base_path=test_dir)
    
    # Get player stats
    players = await scraper.get_player_stats(2024)
    
    # Assertions
    assert players is not None, "Players list should not be None"
    assert len(players) > 0, "Should find at least one player"
    
    # Verify first player data (Joel Embiid based on the image)
    if players:
        first_player = players[0]
        assert first_player.name == "Joel Embiid"
        assert first_player.team == "PHI"
        assert first_player.position == "C"
        assert abs(first_player.points - 34.7) < 0.1  # Allow small float difference
        
        # Log first player details
        logger.info(f"First player details:")
        logger.info(f"Name: {first_player.name}")
        logger.info(f"Team: {first_player.team}")
        logger.info(f"PPG: {first_player.points}")

if __name__ == "__main__":
    asyncio.run(test_player_stats())