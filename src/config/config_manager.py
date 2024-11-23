# src/config/config_manager.py
from dataclasses import dataclass
from typing import Dict, List, Optional
import yaml
from pathlib import Path

@dataclass
class DataSourceConfig:
    source_type: str
    url: str
    api_key: Optional[str] = None
    rate_limit: int = 60

@dataclass
class MLConfig:
    model_type: str
    features: List[str]
    target: str
    hyperparameters: Dict[str, any]

class ConfigurationManager:
    def __init__(self, config_path: str = "config/dev.yaml"):
        self.config_path = Path(config_path)
        self.config = self._load_config()
    
    def _load_config(self) -> dict:
        if not self.config_path.exists():
            return self._create_default_config()
        
        with open(self.config_path) as f:
            return yaml.safe_load(f)
    
    def _create_default_config(self) -> dict:
        config = {
            'data_sources': {
                'basketball_reference': {
                    'url': 'https://www.basketball-reference.com',
                    'rate_limit': 20
                }
            },
            'storage': {
                'local_path': 'data',
                'azure_storage': {
                    'container_name': 'basketball-data'
                }
            }
        }
        
        # Save default config
        self.config_path.parent.mkdir(parents=True, exist_ok=True)
        with open(self.config_path, 'w') as f:
            yaml.dump(config, f)
        
        return config
    
    def get_data_source_config(self, source_type: str) -> dict:
        return self.config['data_sources'].get(source_type, {})
    
    def get_storage_config(self) -> dict:
        return self.config['storage']