# src/api/services/ml_service.py
from typing import List, Dict, Optional
import logging
from datetime import datetime
import numpy as np
from dataclasses import asdict
import joblib
from ..models import PlayerPerformancePrediction, GamePrediction
from ...ml.models.player_performance import PlayerPerformancePredictor
from ...ml.models.game_prediction import GamePredictionModel
from .data_service import DataService

class MLService:
    def __init__(self, data_service: DataService):
        """
        Initialize ML service with data service dependency
        """
        self.data_service = data_service
        self.logger = logging.getLogger(__name__)
        
        # Initialize ML models
        self.player_predictor = None
        self.game_predictor = None
        self._initialize_models()

    def _initialize_models(self):
        """Initialize and load ML models"""
        try:
            # Initialize player performance predictor
            self.player_predictor = PlayerPerformancePredictor(
                config=self.data_service.config.get_ml_model_config('player_performance').__dict__,
                storage_connection_string=self.data_service.config.get_storage_config().get('connection_string')
            )
            
            # Load latest model
            self.player_predictor.load_model(
                model_path="player_performance/latest_model.joblib",
                scaler_path="player_performance/latest_scaler.joblib"
            )
            
            # Initialize game prediction model
            self.game_predictor = GamePredictionModel(
                config=self.data_service.config.get_ml_model_config('game_prediction').__dict__
            )
            
            self.logger.info("ML models initialized successfully")
        except Exception as e:
            self.logger.error(f"Error initializing ML models: {str(e)}")

    async def get_player_predictions(self, 
                                   player_id: str,
                                   num_games: int = 5) -> PlayerPerformancePrediction:
        """
        Get performance predictions for a specific player
        """
        try:
            # Get recent player stats
            player_stats = await self.data_service.get_player_stats(player_id=player_id)
            if not player_stats:
                raise ValueError(f"No stats found for player {player_id}")

            # Get recent games for context
            recent_games = await self.data_service.get_game_data(
                player_id=player_id,
                limit=num_games
            )

            # Make predictions
            predictions = self.player_predictor.predict(
                player_stats=player_stats[-1],  # Use most recent stats
                recent_games=recent_games
            )

            # Calculate confidence intervals
            confidence_intervals = self._calculate_confidence_intervals(predictions)

            # Get impact factors
            impact_factors = self._analyze_impact_factors(
                player_stats=player_stats,
                predictions=predictions
            )

            return PlayerPerformancePrediction(
                player_id=player_id,
                predicted_stats=predictions,
                confidence_intervals=confidence_intervals,
                impact_factors=impact_factors
            )

        except Exception as e:
            self.logger.error(f"Error getting player predictions: {str(e)}")
            raise

    async def get_game_predictions(self, 
                                 game_id: Optional[str] = None,
                                 date: Optional[str] = None) -> List[GamePrediction]:
        """
        Get predictions for upcoming games
        """
        try:
            # Get game data
            games = await self.data_service.get_game_data(
                game_id=game_id,
                date=date
            )

            predictions = []
            for game in games:
                # Get team stats
                home_team_stats = await self._get_team_stats(game['home_team'])
                away_team_stats = await self._get_team_stats(game['away_team'])

                # Make prediction
                pred = self.game_predictor.predict(
                    home_team_stats=home_team_stats,
                    away_team_stats=away_team_stats
                )

                # Analyze factors
                factors = self._analyze_game_factors(
                    home_stats=home_team_stats,
                    away_stats=away_team_stats
                )

                predictions.append(GamePrediction(
                    game_id=game['game_id'],
                    home_team=game['home_team'],
                    away_team=game['away_team'],
                    prediction=pred,
                    confidence=self._calculate_prediction_confidence(pred),
                    factors=factors
                ))

            return predictions

        except Exception as e:
            self.logger.error(f"Error getting game predictions: {str(e)}")
            raise

    def _calculate_confidence_intervals(self, 
                                     predictions: Dict[str, float],
                                     confidence: float = 0.95) -> Dict[str, Dict[str, float]]:
        """Calculate confidence intervals for predictions"""
        intervals = {}
        for stat, value in predictions.items():
            # Using historical variance to estimate confidence interval
            std = self.player_predictor.get_stat_std(stat)
            z_score = 1.96  # 95% confidence interval
            
            intervals[stat] = {
                "lower": value - (z_score * std),
                "upper": value + (z_score * std)
            }
        return intervals

    def _analyze_impact_factors(self,
                              player_stats: List[Dict],
                              predictions: Dict[str, float]) -> List[Dict[str, float]]:
        """Analyze factors impacting predictions"""
        factors = []
        
        # Analyze recent performance trend
        if len(player_stats) >= 5:
            recent_trend = self._calculate_trend(player_stats[-5:])
            factors.append({
                "factor": "recent_form",
                "impact": recent_trend
            })

        # Analyze rest days impact
        rest_days = self._calculate_rest_days(player_stats[-1])
        factors.append({
            "factor": "rest_days",
            "impact": self._get_rest_impact(rest_days)
        })

        return factors

    async def _get_team_stats(self, team: str) -> Dict:
        """Get aggregated team statistics"""
        try:
            # Get all players from team
            player_stats = await self.data_service.get_player_stats(team=team)
            
            # Aggregate stats
            team_stats = {
                "points_per_game": np.mean([p.stats["points_per_game"] for p in player_stats]),
                "assists_per_game": np.mean([p.stats["assists_per_game"] for p in player_stats]),
                "rebounds_per_game": np.mean([p.stats["rebounds_per_game"] for p in player_stats]),
                # Add more aggregated stats as needed
            }
            
            return team_stats
        except Exception as e:
            self.logger.error(f"Error getting team stats: {str(e)}")
            raise

    def _analyze_game_factors(self,
                            home_stats: Dict,
                            away_stats: Dict) -> List[Dict[str, float]]:
        """Analyze factors affecting game prediction"""
        factors = []
        
        # Analyze home court advantage
        factors.append({
            "factor": "home_court",
            "impact": 0.1  # Typical home court advantage
        })
        
        # Compare team strengths
        for stat in ["points_per_game", "assists_per_game", "rebounds_per_game"]:
            diff = home_stats[stat] - away_stats[stat]
            factors.append({
                "factor": f"{stat}_difference",
                "impact": self._normalize_impact(diff)
            })
        
        return factors

    def _calculate_prediction_confidence(self, prediction: Dict) -> float:
        """Calculate confidence score for prediction"""
        # Implement confidence calculation based on model uncertainty
        # This could use model-specific metrics, historical accuracy, etc.
        return 0.85  # Placeholder

    def _normalize_impact(self, value: float) -> float:
        """Normalize impact scores to [-1, 1] range"""
        return np.clip(value / 10, -1, 1)

    def _calculate_trend(self, stats: List[Dict]) -> float:
        """Calculate recent performance trend"""
        # Implement trend analysis
        return 0.0  # Placeholder

    def _calculate_rest_days(self, stats: Dict) -> int:
        """Calculate days since last game"""
        # Implement rest days calculation
        return 2  # Placeholder

    def _get_rest_impact(self, days: int) -> float:
        """Calculate impact of rest days"""
        if days <= 1:
            return -0.1  # Back-to-back games
        elif days >= 4:
            return 0.1  # Well rested
        return 0.0  # Normal rest

class PlayerPredictionService:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.model = None
        self._initialize_model()

    def _initialize_model(self):
        try:
            self.model = PlayerPerformancePredictor(config={})
        except Exception as e:
            self.logger.error(f"Error initializing player prediction model: {str(e)}")
            raise

    async def get_player_prediction(self, player_id: str) -> PlayerPerformancePrediction:
        """Get prediction for a specific player"""
        try:
            # Mock prediction for now
            return PlayerPerformancePrediction(
                player_id=player_id,
                predicted_stats={
                    "points": 25.5,
                    "assists": 6.2,
                    "rebounds": 5.8
                },
                confidence_intervals={
                    "points": {"lower": 22.5, "upper": 28.5},
                    "assists": {"lower": 5.0, "upper": 7.4},
                    "rebounds": {"lower": 4.6, "upper": 7.0}
                },
                impact_factors=[
                    {"factor": "rest_days", "impact": 0.8},
                    {"factor": "opponent_strength", "impact": -0.3},
                    {"factor": "home_game", "impact": 0.2}
                ]
            )
        except Exception as e:
            self.logger.error(f"Error getting player prediction: {str(e)}")
            raise

class GamePredictionService:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.model = GamePredictionModel()

    async def get_game_prediction(self, game_id: str) -> GamePrediction:
        """Get prediction for a specific game"""
        try:
            # Mock prediction for now
            return GamePrediction(
                game_id=game_id,
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
        except Exception as e:
            self.logger.error(f"Error getting game prediction: {str(e)}")
            raise