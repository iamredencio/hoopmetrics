# config/base_config.yaml
from dataclasses import dataclass
from typing import Dict, List, Optional
import yaml
from pathlib import Path

@dataclass
class DataSourceConfig:
    source_type: str
    url: str
    api_key: Optional[str] = None
    rate_limit: int = 60  # requests per minute
    endpoints: Dict[str, str] = None

@dataclass
class MLConfig:
    model_type: str
    features: List[str]
    target: str
    hyperparameters: Dict[str, any]
    evaluation_metrics: List[str]

@dataclass
class SportConfig:
    name: str
    data_sources: List[DataSourceConfig]
    ml_models: Dict[str, MLConfig]
    stats_mapping: Dict[str, str]

class ConfigurationManager:
    def __init__(self, config_path: str = "config/sports/nba.yaml"):
        self.config_path = Path(config_path)
        self.config = self._load_config()

    def _load_config(self) -> SportConfig:
        with open(self.config_path) as f:
            config_dict = yaml.safe_load(f)
            
        # Create data source configs
        data_sources = [
            DataSourceConfig(**source) 
            for source in config_dict['data_sources']
        ]
        
        # Create ML model configs
        ml_models = {
            name: MLConfig(**model_config)
            for name, model_config in config_dict['ml_models'].items()
        }
        
        return SportConfig(
            name=config_dict['name'],
            data_sources=data_sources,
            ml_models=ml_models,
            stats_mapping=config_dict['stats_mapping']
        )

    def get_data_source_config(self, source_type: str) -> DataSourceConfig:
        for source in self.config.data_sources:
            if source.source_type == source_type:
                return source
        raise ValueError(f"No configuration found for source type: {source_type}")

    def get_ml_model_config(self, model_name: str) -> MLConfig:
        if model_name not in self.config.ml_models:
            raise ValueError(f"No configuration found for model: {model_name}")
        return self.config.ml_models[model_name]