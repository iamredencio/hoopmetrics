# scripts/run_pipeline.py
import asyncio
import os
from pathlib import Path
from datetime import datetime
import logging
from src.data_ingestion.scrapers.basketball_reference import BasketballReferenceScraper
from src.data_processing.pipeline import NBADataPipeline

async def main():
    # Setup logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)
    
    try:
        # Initialize components
        storage_connection_string = os.getenv('AZURE_STORAGE_CONNECTION_STRING')
        cosmos_connection_string = os.getenv('AZURE_COSMOS_CONNECTION_STRING')
        local_path = Path('data')
        
        # Initialize scraper and pipeline
        scraper = BasketballReferenceScraper(
            storage_connection_string=storage_connection_string,
            base_path=local_path
        )
        
        pipeline = NBADataPipeline(
            storage_connection_string=storage_connection_string,
            cosmos_connection_string=cosmos_connection_string,
            local_path=local_path
        )
        
        # Run pipeline
        await pipeline.run_daily_update(scraper)
        
        logger.info("Pipeline completed successfully")
        
    except Exception as e:
        logger.error(f"Pipeline failed: {str(e)}")
        raise

if __name__ == "__main__":
    asyncio.run(main())