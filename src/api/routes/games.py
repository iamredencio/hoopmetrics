# src/api/routes/games.py
from fastapi import APIRouter, HTTPException, WebSocket
from typing import List, Optional, Dict
from datetime import datetime
import asyncio
import logging
from ..models import GamePrediction
from ..services.game_service import GameService

router = APIRouter(prefix="/api/games", tags=["games"])

# Active WebSocket connections
active_connections: Dict[str, List[WebSocket]] = {}

@router.get("/")
async def get_games(date: Optional[str] = None):
    """Get all games for a date"""
    try:
        service = GameService()
        return await service.get_schedule(date)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/live")
async def get_live_games():
    """Get currently ongoing games"""
    try:
        service = GameService()
        return await service.get_live_games()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{game_id}")
async def get_game_details(game_id: str):
    """Get detailed game information"""
    try:
        service = GameService()
        game = await service.get_game_details(game_id)
        if not game:
            raise HTTPException(status_code=404, detail="Game not found")
        return game
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.websocket("/live/{game_id}")
async def game_live_updates(websocket: WebSocket, game_id: str):
    """WebSocket endpoint for real-time game updates"""
    await websocket.accept()
    
    if game_id not in active_connections:
        active_connections[game_id] = []
    active_connections[game_id].append(websocket)
    
    try:
        service = GameService()
        while True:
            game_update = await service.update_live_stats(game_id)
            
            for connection in active_connections[game_id]:
                await connection.send_json(game_update)
            
            await asyncio.sleep(3)
            
    except Exception as e:
        logging.error(f"WebSocket error: {str(e)}")
    finally:
        active_connections[game_id].remove(websocket)
        if not active_connections[game_id]:
            del active_connections[game_id]
        await websocket.close()