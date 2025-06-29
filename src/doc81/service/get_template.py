from pathlib import Path
from doc81.core.config import Config, LocalConfig, config as global_config
from doc81.core.exception import Doc81ServiceException
from doc81.core.schema import Doc81Template
import frontmatter


def get_template(
    path_or_ref: str, config: Config | None = None
) -> dict[str, str | list[str]]:
    """
    Get a template from a path or a URL.

    Args:
        path_or_ref: The path or URL of the template.
        config: The config object. If not provided, the global config will be used.

    Returns:
        dict[str, str | list[str]]: The template as a dictionary.
    """
    if not config:
        config = global_config

    if path_or_ref.startswith("http"):
        return _get_template_from_url(path_or_ref, config).model_dump()
    else:
        return _get_template_from_path(path_or_ref, config).model_dump()


def _get_template_from_url(url: str, config: Config) -> Doc81Template:
    raise Doc81ServiceException("Not implemented yet")


def _get_template_from_path(path: str, config: LocalConfig) -> Doc81Template:
    ppath = Path(config.prompt_dir / path)
    with open(ppath, "r") as f:
        content = f.read()

    frontmatter_data = frontmatter.loads(content)

    errors = []
    if not frontmatter_data.get("name"):
        errors.append(f"Template name is required in {ppath}")

    if not frontmatter_data.get("description"):
        errors.append(f"Template description is required in {ppath}")

    if errors:
        raise Doc81ServiceException("\n".join(errors))

    return Doc81Template(
        name=frontmatter_data.get("name"),
        description=frontmatter_data.get("description"),
        tags=frontmatter_data.get("tags", []),
        path=str(ppath.absolute()),
    )
