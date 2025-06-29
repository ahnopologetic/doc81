from doc_81.core.config import Config, config as global_config


def list_templates(config: Config | None = None) -> list[str]:
    """
    List all templates in the prompt directory.

    Args:
        config: The config object. If not provided, the global config will be used.

    Returns:
        list[str]: A list of template absolute paths.
    """
    if not config:
        config = global_config

    if config.mode == "server":
        raise NotImplementedError("Server mode is not implemented yet")

    return [
        str(config.prompt_dir / path.relative_to(config.prompt_dir))
        for path in config.prompt_dir.glob("**/*.md")
    ]
