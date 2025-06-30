from doc81.core.config import Config, config as global_config


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
        raise NotImplementedError("Server mode is not implemented yet")

    return [str(path) for path in config.prompt_dir.glob("**/*.md")]
