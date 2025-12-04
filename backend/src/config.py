from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # CoinMarketCap
    CMC_API_KEY: Optional[str] = None
    CMC_BASE_URL: str = "https://pro-api.coinmarketcap.com"

    HUGGINGFACE_API_KEY: Optional[str] = None
    HUGGINGFACE_MODEL: str = "google/flan-t5-base"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()