# src/api/routes/games.py
from fastapi import APIRouter, HTTPException, WebSocket
from typing import List, Optional
from datetime import datetime
import asyncio
from ..models import GamePrediction
from ..services.data_service import GameDataService

router = APIRouter(prefix="/api/games", tags=["games"])

@router.get("/predictions", response_model=List[GamePrediction])
async def get_game_predictions(date: Optional[str] = None):
    """Get predictions for upcoming games"""
    try:
        # This would normally fetch game data and make predictions
        # For now, returning example structure
        return [
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
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{game_id}")
async def get_game_details(game_id: str):
    """Get detailed information about a specific game"""
    try:
        # This would fetch game details from your database
        return {
            "game_id": game_id,
            "home_team": "Team A",
            "away_team": "Team B",
            "status": "In Progress",
            "score": {
                "home": 85,
                "away": 82
            },
            "quarter": 3,
            "time_remaining": "8:45"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.websocket("/live/{game_id}")
async def game_live_updates(websocket: WebSocket, game_id: str):
    """WebSocket endpoint for real-time game updates"""
    await websocket.accept()
    try:
        while True:
            # This would normally fetch real-time game data
            # For now, we'll send mock updates every few seconds
            game_update = {
                "timestamp": datetime.now().isoformat(),
                "game_id": game_id,
                "updates": {
                    "score": {"home": 85, "away": 82},
                    "quarter": 3,
                    "time_remaining": "8:45",
                    "last_play": {
                        "player": "John Doe",
                        "action": "3PT Made",
                        "time": "8:45"
                    },
                    "stats": {
                        "home": {
                            "fg_pct": 48.5,
                            "three_pt_pct": 35.8,
                            "rebounds": 34
                        },
                        "away": {
                            "fg_pct": 45.2,
                            "three_pt_pct": 33.1,
                            "rebounds": 31
                        }
                    }
                }
            }
            
            await websocket.send_json(game_update)
            await asyncio.sleep(3)  # Update every 3 seconds
            
    except Exception as e:
        await websocket.close()
        raise HTTPException(status_code=500, detail=str(e))

# Optional: Add more game-related endpoints
@router.get("/schedule")
async def get_game_schedule(date: Optional[str] = None):
    """Get game schedule for a specific date"""
    try:
        return {
            "date": date or datetime.now().strftime("%Y-%m-%d"),
            "games": [
                {
                    "game_id": "1",
                    "home_team": "Team A",
                    "away_team": "Team B",
                    "time": "19:30",
                    "venue": "Arena A"
                },
                # Add more games...
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/stats/{game_id}")
async def get_game_stats(game_id: str):
    """Get detailed statistics for a completed game"""
    try:
        return {
            "game_id": game_id,
            "teams": {
                "home": {
                    "team": "Team A",
                    "final_score": 105,
                    "shooting": {
                        "fg_made": 40,
                        "fg_attempted": 82,
                        "fg_percentage": 48.8,
                        "three_pt_made": 12,
                        "three_pt_attempted": 30,
                        "three_pt_percentage": 40.0
                    },
                    "rebounds": {
                        "offensive": 10,
                        "defensive": 30,
                        "total": 40
                    },
                    "assists": 25,
                    "steals": 8,
                    "blocks": 5,
                    "turnovers": 12
                },
                "away": {
                    # Similar structure for away team...
                }
            },
            "leaders": {
                "points": {"name": "John Doe", "value": 32},
                "rebounds": {"name": "Jane Smith", "value": 12},
                "assists": {"name": "Bob Johnson", "value": 8}
            },
            "quarters": [
                {"quarter": 1, "home": 25, "away": 22},
                {"quarter": 2, "home": 30, "away": 28},
                {"quarter": 3, "home": 28, "away": 25},
                {"quarter": 4, "home": 22, "away": 20}
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))