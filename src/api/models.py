# src/api/models.py
from pydantic import BaseModel
from typing import Dict, List, Optional
from datetime import datetime

class PlayerStats(BaseModel):
    player_id: str
    name: str
    team: str
    stats: Dict[str, float]  # Contains all basic and advanced stats
    predictions: Optional[Dict[str, float]] = None

class GamePrediction(BaseModel):
    game_id: str
    home_team: str
    away_team: str
    prediction: Dict[str, float]
    confidence: float
    factors: List[Dict[str, float]]

class PlayerPerformancePrediction(BaseModel):
    player_id: str
    predicted_stats: Dict[str, float]
    confidence_intervals: Dict[str, Dict[str, float]]
    impact_factors: List[Dict[str, float]]

class GameUpdate(BaseModel):
    game_id: str
    timestamp: datetime
    score: Dict[str, int]
    quarter: int
    time_remaining: str
    stats: Dict[str, Dict[str, float]]