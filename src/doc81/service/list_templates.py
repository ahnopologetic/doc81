from doc81.core.config import Config, config as global_config
from doc81.core.exception import Doc81NotAllowedError


def list_templates(config: Config | None = None) -> list[str]:
    """
    List all templates in the prompt directory.

    Args:
        config: The config object. If not provided, the global config will be used.

    Returns:
        list[str]: A list of templates.
    """
    if not config:
        config = global_config

    if config.mode == "server":
        raise Doc81NotAllowedError("Server mode is not allowed to list templates")

    return [str(path) for path in config.prompt_dir.glob("**/*.md")]
