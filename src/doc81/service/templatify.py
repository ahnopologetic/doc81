from typing import Any, Literal
import mistune
import mistune.renderers
import mistune.renderers.markdown
from pydantic import BaseModel


class TemplatifyFrontmatter(BaseModel):
    name: str
    description: str
    tags: list[str]


class TemplatifyContext(BaseModel):
    token_style: Literal["bracket", "curly"] = "bracket"
    verbosity: Literal["full", "compact", "outline"] = "full"
    frontmatter_dict: dict[str, str | list[str]] | None = None
    counters: dict[str, int] = {}


def templatify(
    md_text: str,
    *,
    token_style: Literal["bracket", "curly"] = "bracket",
    verbosity: Literal["full", "compact", "outline"] = "full",
    frontmatter_dict: dict[str, str | list[str]] | None = None,
) -> str:
    """
    Templatify a markdown file.

    Args:
        md_text: The raw markdown file.
        token_style: The style of tokens to use. "bracket" for [Item 1], [Item 2], etc. "curly" for {{Item 1}}, {{Item 2}}, etc.
        verbosity: The verbosity of the output. "full" for full output, "compact" for compact output, "outline" for outline output.
        frontmatter_dict: The dictionary of frontmatter variables.

    Returns:
        str: The templatified markdown file.
    """

    if frontmatter_dict:
        frontmatter_dict = TemplatifyFrontmatter(**frontmatter_dict)

    md = mistune.create_markdown(renderer="ast", plugins=["strikethrough", "table"])
    ast = md(md_text)
    ctx = TemplatifyContext(
        token_style=token_style,
        verbosity=verbosity,
        frontmatter_dict=frontmatter_dict,
    )

    templated_ast = [_rewrite(node, ctx) for node in ast]
    return _render(templated_ast, ctx)


def _rewrite(node: dict[str, Any], ctx: TemplatifyContext) -> dict[str, Any]:
    type_ = node["type"]

    match type_:
        case "heading":
            if ctx.verbosity == "outline" and node.get("attrs", {}).get("level", 1) > 3:
                return None  # prune deep headings
            node["children"] = [_rewrite(c, ctx) for c in node.get("children", [])]
            return node
        case "paragraph":
            has_other_than_text = any(
                c["type"] != "text" for c in node.get("children", [])
            )
            if not has_other_than_text:
                return _make_token("Paragraph", ctx)
            node["children"] = [_rewrite(c, ctx) for c in node.get("children", [])]
            return node
        case "list":
            node["children"] = [
                _make_token("Item", ctx) if c["type"] == "list_item" else c
                for c in node.get("children", [])
            ]
            return node
        case "block_code":
            return _make_token("Code", ctx)
        case "image":
            return _make_token("Image", ctx)
        case "link":
            return _make_token("Link", ctx)
        case "table" | "block_quote":
            return _make_token(type_.capitalize(), ctx)
        case "blank_line":
            return {
                "type": "blank_line"
            }  # mistune.renderers.markdown.MarkdownRenderer():L79
        case _:
            node["children"] = [_rewrite(c, ctx) for c in node.get("children", [])]
            return node


def _make_token(token_type: str, ctx: TemplatifyContext) -> dict[str, Any]:
    if token_type not in ctx.counters:
        ctx.counters[token_type] = 0

    n = ctx.counters[token_type]
    ctx.counters[token_type] = n + 1
    if token_type == "Code":
        token_text = f"```\n[{token_type} {ctx.counters[token_type]}]\n```"
        return {"type": "block_text", "children": [{"type": "text", "raw": token_text}]}
    else:
        token_text = f"{token_type} {ctx.counters[token_type]}"

    if ctx.token_style == "curly":
        token_text = f"{{{{{token_text}}}}}"  # → {{Paragraph 1}}
    else:
        token_text = f"[{token_text}]"  # → [Paragraph 1]

    return {
        "type": "block_text",
        "children": [
            {"type": "text", "raw": token_text},
        ],
    }


def _render(ast: list[dict[str, Any]], ctx: TemplatifyContext) -> str:
    renderer = (
        mistune.renderers.markdown.MarkdownRenderer()
    )  # TODO: use custom renderer
    return renderer(ast, state=mistune.BlockState())
