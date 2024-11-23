# src/data_processing/etl_pipeline.py
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from pathlib import Path
import json
from typing import List, Dict, Optional
import logging
from dataclasses import asdict
import asyncio
from azure.storage.blob import BlobServiceClient
from azure.cosmos import CosmosClient

class NBADataPipeline:
    def __init__(self, 
                 storage_connection_string: Optional[str] = None,
                 cosmos_connection_string: Optional[str] = None,
                 local_path: Optional[Path] = None):
        self.local_path = local_path
        self.blob_client = (BlobServiceClient.from_connection_string(storage_connection_string) 
                          if storage_connection_string else None)
        self.cosmos_client = CosmosClient.from_connection_string(cosmos_connection_string) if cosmos_connection_string else None
        self.logger = self._setup_logger()

    def _setup_logger(self):
        logger = logging.getLogger(__name__)
        logger.setLevel(logging.INFO)
        return logger

    def calculate_advanced_stats(self, df: pd.DataFrame) -> pd.DataFrame:
        """Calculate advanced basketball statistics"""
        df = df.copy()
        
        # Usage Rate = 100 * ((FGA + 0.44 * FTA + TOV) * (Team MP / 5)) / (MP * (Team FGA + 0.44 * Team FTA + Team TOV))
        df['usage_rate'] = (df['field_goal_attempts'] + 0.44 * df['free_throw_attempts'] + df['turnovers']) / df['minutes_per_game']
        
        # True Shooting % = Points / (2 * (FGA + 0.44 * FTA))
        df['true_shooting_pct'] = df['points'] / (2 * (df['field_goal_attempts'] + 0.44 * df['free_throw_attempts']))
        
        # Points Per Shot = Points / FGA
        df['points_per_shot'] = df['points'] / df['field_goal_attempts']
        
        # Assist Ratio = 100 * Assists / (FGA + 0.44 * FTA + Assists + Turnovers)
        df['assist_ratio'] = 100 * df['assists'] / (df['field_goal_attempts'] + 0.44 * df['free_throw_attempts'] + df['assists'] + df['turnovers'])
        
        # Turnover Ratio = 100 * Turnovers / (FGA + 0.44 * FTA + Assists + Turnovers)
        df['turnover_ratio'] = 100 * df['turnovers'] / (df['field_goal_attempts'] + 0.44 * df['free_throw_attempts'] + df['assists'] + df['turnovers'])
        
        return df

    def calculate_player_rankings(self, df: pd.DataFrame) -> pd.DataFrame:
        """Calculate player rankings based on various metrics"""
        rankings = pd.DataFrame()
        
        # Scoring Rankings
        rankings['scoring_rank'] = df['points'].rank(ascending=False)
        rankings['efficiency_rank'] = df['true_shooting_pct'].rank(ascending=False)
        rankings['versatility_rank'] = (
            df['points'] + df['rebounds'] + df['assists'] + df['steals'] + df['blocks']
        ).rank(ascending=False)
        
        # Calculate composite score
        rankings['composite_score'] = (
            rankings['scoring_rank'] * 0.4 +
            rankings['efficiency_rank'] * 0.3 +
            rankings['versatility_rank'] * 0.3
        )
        
        return pd.concat([df, rankings], axis=1)

    async def process_and_store_data(self, players: List) -> None:
        """Process player data and store in multiple formats"""
        # Convert to DataFrame
        df = pd.DataFrame([asdict(p) for p in players])
        
        # Calculate advanced stats
        df = self.calculate_advanced_stats(df)
        
        # Calculate rankings
        df = self.calculate_player_rankings(df)
        
        # Store locally if path provided
        if self.local_path:
            self._store_locally(df)
        
        # Store in Azure if configured
        if self.blob_client:
            await self._store_in_azure(df)
        
        if self.cosmos_client:
            await self._store_in_cosmos(df)

    def _store_locally(self, df: pd.DataFrame) -> None:
        """Store data in multiple formats locally"""
        date_str = datetime.now().strftime('%Y%m%d')
        base_path = self.local_path / 'processed' / date_str
        base_path.mkdir(parents=True, exist_ok=True)
        
        # Save as CSV
        df.to_csv(base_path / 'player_stats.csv', index=False)
        
        # Save as Parquet
        df.to_parquet(base_path / 'player_stats.parquet')
        
        # Save JSON with advanced stats
        df.to_json(base_path / 'player_stats.json', orient='records', indent=2)

    async def _store_in_azure(self, df: pd.DataFrame) -> None:
        """Store data in Azure Blob Storage"""
        if not self.blob_client:
            return
            
        date_str = datetime.now().strftime('%Y%m%d')
        container_client = self.blob_client.get_container_client('processed-data')
        
        # Ensure container exists
        try:
            container_client.create_container()
        except:
            pass

        # Store in multiple formats
        formats = {
            'csv': df.to_csv(index=False),
            'json': df.to_json(orient='records'),
            'parquet': df.to_parquet()
        }
        
        for fmt, data in formats.items():
            blob_name = f'player_stats/{date_str}/data.{fmt}'
            container_client.upload_blob(name=blob_name, data=data, overwrite=True)

    async def _store_in_cosmos(self, df: pd.DataFrame) -> None:
        """Store data in Cosmos DB"""
        if not self.cosmos_client:
            return
            
        database = self.cosmos_client.get_database_client('nba-stats')
        container = database.get_container_client('player-stats')
        
        # Convert DataFrame to records
        records = json.loads(df.to_json(orient='records'))
        
        # Store each record
        for record in records:
            record['id'] = f"{record['player_id']}_{datetime.now().strftime('%Y%m%d')}"
            container.upsert_item(record)

    async def run_daily_update(self, scraper) -> None:
        """Run daily update of player stats"""
        try:
            # Get latest data
            players = await scraper.get_player_stats()
            
            # Process and store
            await self.process_and_store_data(players)
            
            self.logger.info("Daily update completed successfully")
        except Exception as e:
            self.logger.error(f"Error in daily update: {str(e)}")
            raise