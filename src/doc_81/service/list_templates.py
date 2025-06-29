from doc_81.core.config import Config, config as global_config
from doc_81.service.get_template import get_template


def list_templates(config: Config | None = None) -> list[dict[str, str | list[str]]]:
    """
    List all templates in the prompt directory.

    Args:
        config: The config object. If not provided, the global config will be used.

    Returns:
        list[dict[str, str | list[str]]]: A list of templates.
    """
    if not config:
        config = global_config

    if config.mode == "server":
        raise NotImplementedError("Server mode is not implemented yet")

    return [
        get_template(str(path.relative_to(config.prompt_dir)), config)
        for path in config.prompt_dir.glob("**/*.md")
    ]
