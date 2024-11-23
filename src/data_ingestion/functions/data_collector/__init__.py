# src/data_ingestion/functions/data_collector/__init__.py
import azure.functions as func
import logging
import asyncio
from data_ingestion.scrapers.basketball_reference import BasketballReferenceScraper
from config.config_manager import ConfigurationManager

async def main(mytimer: func.TimerRequest) -> None:
    logging.info('Data collection function triggered')

    try:
        # Load configuration
        config_manager = ConfigurationManager()
        basketball_ref_config = config_manager.get_data_source_config('basketball_reference')
        
        # Initialize scraper
        scraper = BasketballReferenceScraper(
            config=basketball_ref_config.__dict__,
            storage_connection_string=os.environ['AzureWebJobsStorage']
        )
        
        # Run daily update
        await scraper.run_daily_update()
        
        logging.info('Data collection completed successfully')
        
    except Exception as e:
        logging.error(f'Error in data collection: {str(e)}')
        raise

# function.json
{
  "scriptFile": "__init__.py",
  "bindings": [
    {
      "name": "mytimer",
      "type": "timerTrigger",
      "direction": "in",
      "schedule": "0 0 */4 * * *"  # Runs every 4 hours
    }
  ]
}