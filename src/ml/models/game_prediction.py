# src/ml/models/game_prediction.py
from typing import Dict, Optional
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib
import logging

class GamePredictionModel:
    def __init__(self, config: Dict = None):
        self.config = config or {}
        self.model = None
        self.logger = logging.getLogger(__name__)
        self._initialize_model()

    def _initialize_model(self):
        """Initialize the prediction model"""
        try:
            self.model = RandomForestClassifier(
                n_estimators=self.config.get('n_estimators', 100),
                max_depth=self.config.get('max_depth', 10),
                random_state=42
            )
        except Exception as e:
            self.logger.error(f"Error initializing model: {str(e)}")
            raise

    def train(self, X, y):
        """Train the model"""
        try:
            self.model.fit(X, y)
        except Exception as e:
            self.logger.error(f"Error training model: {str(e)}")
            raise

    def predict(self, home_team_stats: Dict, away_team_stats: Dict) -> Dict:
        """Make prediction for a game"""
        try:
            # Prepare features
            features = self._prepare_features(home_team_stats, away_team_stats)
            
            # Make prediction
            if self.model is None:
                raise ValueError("Model not trained")
                
            prob = self.model.predict_proba(features.reshape(1, -1))[0]
            
            return {
                "home_win_probability": float(prob[1]),
                "away_win_probability": float(prob[0])
            }
        except Exception as e:
            self.logger.error(f"Error making prediction: {str(e)}")
            return {
                "home_win_probability": 0.5,
                "away_win_probability": 0.5
            }

    def _prepare_features(self, home_stats: Dict, away_stats: Dict) -> np.ndarray:
        """Prepare features for prediction"""
        features = []
        
        # Add team stats differences
        for stat in ['points_per_game', 'assists_per_game', 'rebounds_per_game']:
            features.append(home_stats.get(stat, 0) - away_stats.get(stat, 0))
            
        return np.array(features)

    def save(self, path: str):
        """Save model to file"""
        try:
            joblib.dump(self.model, path)
        except Exception as e:
            self.logger.error(f"Error saving model: {str(e)}")
            raise

    def load(self, path: str):
        """Load model from file"""
        try:
            self.model = joblib.load(path)
        except Exception as e:
            self.logger.error(f"Error loading model: {str(e)}")
            raise