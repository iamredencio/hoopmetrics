# src/ml/models/player_performance.py
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Tuple
from dataclasses import dataclass
import tensorflow as tf
from azure.storage.blob import BlobServiceClient

@dataclass
class ModelMetrics:
    mae: float
    rmse: float
    r2: float
    feature_importance: Dict[str, float]
    training_date: str

class PlayerPerformancePredictor:
    def __init__(self, config: Dict, storage_connection_string: str):
        self.config = config
        self.model = None
        self.scaler = StandardScaler()
        self.feature_columns = config['features']
        self.target_column = config['target']
        self.blob_service_client = BlobServiceClient.from_connection_string(storage_connection_string)
        self.logger = self._setup_logger()

    def _setup_logger(self) -> logging.Logger:
        logger = logging.getLogger(__name__)
        logger.setLevel(logging.INFO)
        handler = logging.StreamHandler()
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        return logger

    def _calculate_moving_averages(self, df: pd.DataFrame, player_id_col: str, 
                                 date_col: str, stat_columns: List[str], 
                                 windows: List[int]) -> pd.DataFrame:
        """Calculate moving averages for specified statistics"""
        df = df.sort_values(date_col)
        
        for stat in stat_columns:
            for window in windows:
                df[f'{stat}_ma_{window}'] = df.groupby(player_id_col)[stat]\
                    .rolling(window=window, min_periods=1)\
                    .mean()\
                    .reset_index(0, drop=True)
        
        return df

    def _engineer_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Create features for the model"""
        df = df.copy()
        
        # Calculate days since last game
        df['days_since_last_game'] = df.groupby('player_id')['game_date']\
            .diff()\
            .dt.days\
            .fillna(7)  # Fill first game with average rest

        # Calculate if game is back to back
        df['back_to_back'] = df['days_since_last_game'] <= 1

        # Calculate recent performance metrics (last 5, 10, 15 games)
        stat_columns = ['minutes_played', 'points', 'assists', 'rebounds',
                       'field_goal_percentage', 'three_point_percentage',
                       'free_throw_percentage', 'plus_minus']
        
        df = self._calculate_moving_averages(df, 'player_id', 'game_date', 
                                           stat_columns, [5, 10, 15])

        # Add opponent strength metrics
        df = df.merge(
            df.groupby('opponent')['defensive_rating'].mean(),
            on='opponent',
            suffixes=('', '_opponent_avg')
        )

        return df

    def preprocess_data(self, df: pd.DataFrame) -> Tuple[np.ndarray, np.ndarray]:
        """Preprocess data for training/prediction"""
        df = self._engineer_features(df)
        
        X = df[self.feature_columns].copy()
        y = df[self.target_column].copy()

        # Handle missing values
        X = X.fillna(X.mean())
        
        # Scale features
        X = self.scaler.fit_transform(X)
        
        return X, y

    def train(self, train_data: pd.DataFrame) -> ModelMetrics:
        """Train the model and return metrics"""
        X, y = self.preprocess_data(train_data)
        
        # Split data
        X_train, X_val, y_train, y_val = train_test_split(
            X, y, test_size=0.2, random_state=42
        )

        # Initialize and train model
        self.model = GradientBoostingRegressor(**self.config['hyperparameters'])
        self.model.fit(X_train, y_train)

        # Calculate metrics
        y_pred = self.model.predict(X_val)
        metrics = ModelMetrics(
            mae=mean_absolute_error(y_val, y_pred),
            rmse=np.sqrt(mean_squared_error(y_val, y_pred)),
            r2=r2_score(y_val, y_pred),
            feature_importance=dict(zip(self.feature_columns, 
                                      self.model.feature_importances_)),
            training_date=datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        )

        # Save model and metrics
        self._save_model(metrics)
        
        return metrics

    def predict(self, player_data: pd.DataFrame) -> np.ndarray:
        """Make predictions for new data"""
        if self.model is None:
            raise ValueError("Model not trained yet")
            
        X, _ = self.preprocess_data(player_data)
        return self.model.predict(X)

    def _save_model(self, metrics: ModelMetrics):
        """Save model and metrics to Azure Blob Storage"""
        container_client = self.blob_service_client.get_container_client('models')
        
        # Ensure container exists
        try:
            container_client.create_container()
        except Exception:
            pass

        # Save model
        model_path = f'player_performance/model_{datetime.now().strftime("%Y%m%d_%H%M%S")}.joblib'
        model_bytes = joblib.dumps(self.model)
        container_client.upload_blob(name=model_path, data=model_bytes)

        # Save scaler
        scaler_path = f'player_performance/scaler_{datetime.now().strftime("%Y%m%d_%H%M%S")}.joblib'
        scaler_bytes = joblib.dumps(self.scaler)
        container_client.upload_blob(name=scaler_path, data=scaler_bytes)

        # Save metrics
        metrics_path = f'player_performance/metrics_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json'
        metrics_json = json.dumps(metrics.__dict__)
        container_client.upload_blob(name=metrics_path, data=metrics_json)

    def load_model(self, model_path: str, scaler_path: str):
        """Load model and scaler from Azure Blob Storage"""
        container_client = self.blob_service_client.get_container_client('models')
        
        # Load model
        model_blob = container_client.get_blob_client(model_path)
        model_bytes = model_blob.download_blob().readall()
        self.model = joblib.loads(model_bytes)

        # Load scaler
        scaler_blob = container_client.get_blob_client(scaler_path)
        scaler_bytes = scaler_blob.download_blob().readall()
        self.scaler = joblib.loads(scaler_bytes)

# Create a training pipeline
def train_pipeline(config_path: str = "config/sports/nba.yaml"):
    # Load configuration
    config_manager = ConfigurationManager(config_path)
    model_config = config_manager.get_ml_model_config('player_performance')
    
    # Initialize predictor
    predictor = PlayerPerformancePredictor(
        config=model_config.__dict__,
        storage_connection_string="YOUR_CONNECTION_STRING"
    )
    
    # Load and prepare training data
    # This would normally come from your data lake
    # For now, we'll load it from blob storage
    container_client = predictor.blob_service_client.get_container_client('basketball-data')
    blob_list = container_client.list_blobs(name_starts_with='player_stats/')
    
    dfs = []
    for blob in blob_list:
        blob_client = container_client.get_blob_client(blob)
        data = json.loads(blob_client.download_blob().readall())
        df = pd.DataFrame(data)
        dfs.append(df)
    
    training_data = pd.concat(dfs, ignore_index=True)
    
    # Train model
    metrics = predictor.train(training_data)
    
    print("Training completed with metrics:")
    print(f"MAE: {metrics.mae:.2f}")
    print(f"RMSE: {metrics.rmse:.2f}")
    print(f"R2: {metrics.r2:.2f}")
    print("\nTop 5 important features:")
    sorted_features = sorted(metrics.feature_importance.items(), 
                           key=lambda x: x[1], reverse=True)[:5]
    for feature, importance in sorted_features:
        print(f"{feature}: {importance:.3f}")

if __name__ == "__main__":
    train_pipeline()