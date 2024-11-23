# src/api/routes/__init__.py
from .games import router as games_router
from .players import router as players_router
from .predictions import router as predictions_router

__all__ = ['games_router', 'players_router', 'predictions_router']