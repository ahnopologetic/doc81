import os
from pathlib import Path
from typing import Literal
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Config(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_prefix="DOC81_")

    env: Literal["dev", "prod", "test"] = "dev"
    mode: Literal["local", "server"] = "local"


class LocalConfig(Config):
    mode: Literal["local"] = "local"

    prompt_dir: Path | None = Field(default=None)
    database_url: str = Field(
        "sqlite:///./doc81.db",
        description="Not used for local mode",
    )


class ServerConfig(Config):
    mode: Literal["server"] = "server"
    database_url: str = Field(
        "sqlite:///./doc81.db", description="Database URL for server mode"
    )
    server_url: str = Field(
        "https://doc81-979490649165.us-east1.run.app",  # TODO: no hardcoded url
        description="Server URL for server mode",
    )


config = (
    LocalConfig() if os.getenv("DOC81_MODE", "local") != "server" else ServerConfig()
)
