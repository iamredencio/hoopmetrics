# scripts/run_scraper_tests.py
import sys
import os
from pathlib import Path

# Add the project root to Python path
project_root = Path(__file__).parent.parent
sys.path.append(str(project_root))

# Import and run the tests
from tests.unit.test_scraper import run_manual_tests
import asyncio

if __name__ == "__main__":
    asyncio.run(run_manual_tests())