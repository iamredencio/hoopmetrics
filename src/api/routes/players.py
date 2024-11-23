# src/api/routes/players.py
from fastapi import APIRouter, HTTPException
from typing import List, Optional
from ..models import PlayerStats, PlayerPerformancePrediction
from ..services.data_service import DataService
from ..services.ml_service import PlayerPredictionService

router = APIRouter(prefix="/api/players", tags=["players"])

@router.get("/", response_model=List[PlayerStats])
async def get_players(team: Optional[str] = None):
    """Get list of players with their stats"""
    try:
        data_service = DataService()
        return await data_service.get_players(team=team)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{player_id}", response_model=PlayerStats)
async def get_player(player_id: str):
    """Get detailed stats for a specific player"""
    try:
        data_service = DataService()
        player = await data_service.get_player_by_id(player_id)
        if not player:
            raise HTTPException(status_code=404, detail="Player not found")
        return player
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{player_id}/predictions", response_model=PlayerPerformancePrediction)
async def get_player_predictions(player_id: str):
    """Get performance predictions for a specific player"""
    try:
        # First get player data
        data_service = DataService()
        player = await data_service.get_player_by_id(player_id)
        if not player:
            raise HTTPException(status_code=404, detail="Player not found")

        # Then get predictions
        prediction_service = PlayerPredictionService()
        return await prediction_service.get_player_prediction(player_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))