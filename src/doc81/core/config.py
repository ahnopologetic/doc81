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


class ServerConfig(Config):
    mode: Literal["server"] = "server"


config = (
    LocalConfig() if os.getenv("DOC81_MODE", "local") != "server" else ServerConfig()
)
