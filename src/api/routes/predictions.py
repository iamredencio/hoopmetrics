# src/api/routes/predictions.py
from fastapi import APIRouter, HTTPException
from typing import List, Optional
from datetime import datetime
from ..models import GamePrediction, PlayerPerformancePrediction
from ..services.ml_service import GamePredictionService, PlayerPredictionService

router = APIRouter(prefix="/api/predictions", tags=["predictions"])

@router.get("/games", response_model=List[GamePrediction])
async def get_game_predictions(date: Optional[str] = None):
    """Get predictions for games"""
    try:
        prediction_service = GamePredictionService()
        predictions = []
        # Mock data for now
        predictions.append(
            GamePrediction(
                game_id="1",
                home_team="Team A",
                away_team="Team B",
                prediction={"home_win_probability": 0.65},
                confidence=0.82,
                factors=[
                    {"factor": "home_court", "impact": 0.1},
                    {"factor": "recent_form", "impact": 0.2},
                    {"factor": "head_to_head", "impact": 0.15}
                ]
            )
        )
        return predictions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/players/{player_id}", response_model=PlayerPerformancePrediction)
async def get_player_predictions(player_id: str):
    """Get predictions for a specific player"""
    try:
        prediction_service = PlayerPredictionService()
        return await prediction_service.get_player_prediction(player_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/teams/{team_id}")
async def get_team_predictions(team_id: str):
    """Get predictions for a specific team"""
    try:
        return {
            "team_id": team_id,
            "win_probability_next_game": 0.65,
            "projected_wins_season": 45,
            "playoff_probability": 0.78
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))