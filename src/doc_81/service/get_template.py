from doc_81.core.schema import Doc81Template
import frontmatter


def get_template(path_or_ref: str) -> dict[str, str | list[str]]:
    """
    Get a template from a path or a URL.

    Args:
        path_or_ref: The path or URL of the template.

    Returns:
        dict[str, str | list[str]]: The template as a dictionary.
    """
    if path_or_ref.startswith("http"):
        return _get_template_from_url(path_or_ref).model_dump()
    else:
        return _get_template_from_path(path_or_ref).model_dump()


def _get_template_from_url(url: str) -> Doc81Template:
    raise NotImplementedError("Not implemented yet")


def _get_template_from_path(path: str) -> Doc81Template:
    # parse markdown file and extract the template
    with open(path, "r") as f:
        content = f.read()
    # parse frontmatter
    frontmatter_data = frontmatter.loads(content)

    return Doc81Template(
        name=frontmatter_data.get("name"),
        description=frontmatter_data.get("description"),
        tags=frontmatter_data.get("tags", []),
        path=path,
    )
