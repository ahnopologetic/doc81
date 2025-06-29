import os
from typing import Literal
from pydantic_settings import BaseSettings, SettingsConfigDict


class Config(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_prefix="DOC81_")

    env: Literal["dev", "prod"] = "dev"
    mode: Literal["local", "server"] = "local"


class LocalConfig(Config):
    mode: Literal["local"] = "local"


class ServerConfig(Config):
    mode: Literal["server"] = "server"


config = LocalConfig() if os.getenv("DOC81_MODE") == "local" else ServerConfig()
