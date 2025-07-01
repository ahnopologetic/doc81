from typing import Any, Literal, Optional
import mistune
import mistune.renderers
import mistune.renderers.markdown
import os
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
    preserve_headings: bool = True


def templatify(
    md_text: str,
    *,
    token_style: Literal["bracket", "curly"] = "bracket",
    verbosity: Literal["full", "compact", "outline"] = "full",
    frontmatter_dict: dict[str, str | list[str]] | None = None,
    preserve_headings: bool = True,
) -> str:
    """
    Templatify a markdown file.

    Args:
        md_text: The raw markdown file.
        token_style: The style of tokens to use. "bracket" for [Item 1], [Item 2], etc. "curly" for {{Item 1}}, {{Item 2}}, etc.
        verbosity: The verbosity of the output. "full" for full output, "compact" for compact output, "outline" for outline output.
        frontmatter_dict: The dictionary of frontmatter variables.
        preserve_headings: Whether to preserve heading content or replace with tokens.

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
        preserve_headings=preserve_headings,
    )

    templated_ast = [_rewrite(node, ctx) for node in ast if node is not None]
    templated_ast = [node for node in templated_ast if node is not None]
    result = _render(templated_ast, ctx)

    # Ensure result ends with a newline
    if not result.endswith("\n"):
        result += "\n"

    return result


def _rewrite(node: dict[str, Any], ctx: TemplatifyContext) -> Optional[dict[str, Any]]:
    if node is None:
        return None

    type_ = node["type"]

    match type_:
        case "heading":
            level = node.get("attrs", {}).get("level", 1)
            if ctx.verbosity == "outline" and level > 3:
                return None  # prune deep headings

            # Always preserve headings content
            if ctx.preserve_headings:
                node["children"] = [
                    _rewrite(c, ctx) for c in node.get("children", []) if c is not None
                ]
                return node
            else:
                # Optional: replace heading content with tokens
                return _make_token(f"Heading{level}", ctx)

        case "paragraph":
            # Check if paragraph contains only text or has complex content
            has_other_than_text = any(
                c["type"] != "text" for c in node.get("children", [])
            )

            # Replace simple paragraphs with tokens
            if not has_other_than_text:
                return _make_token("Paragraph", ctx)

            # Process complex paragraphs recursively
            node["children"] = [
                _rewrite(c, ctx) for c in node.get("children", []) if c is not None
            ]
            return node

        case "list":
            # Process list items
            processed_children = []
            for child in node.get("children", []):
                if child["type"] == "list_item":
                    # Replace list items with tokens
                    processed_children.append(_make_token("Item", ctx))
                else:
                    # Process other list elements
                    processed_child = _rewrite(child, ctx)
                    if processed_child:
                        processed_children.append(processed_child)

            node["children"] = processed_children
            return node

        case "list_item":
            # Process nested lists within list items
            has_nested_list = any(c["type"] == "list" for c in node.get("children", []))

            if has_nested_list:
                # Process children to handle nested lists
                node["children"] = [
                    _rewrite(c, ctx) for c in node.get("children", []) if c is not None
                ]
                return node
            else:
                # Replace simple list items with tokens
                return _make_token("Item", ctx)

        case "block_code":
            # Create a simple block text node with code fence
            token_text = _create_code_token_text("Code", ctx)
            return {
                "type": "block_text",
                "children": [{"type": "text", "raw": f"```\n{token_text}\n```"}],
            }

        case "image":
            return _make_token("Image", ctx)

        case "link":
            return _make_token("Link", ctx)

        case "table" | "block_quote":
            return _make_token(type_.capitalize(), ctx)

        case "blank_line":
            return {"type": "blank_line"}

        case _:
            # Process other node types recursively
            if "children" in node:
                node["children"] = [
                    _rewrite(c, ctx) for c in node.get("children", []) if c is not None
                ]
            return node


def _make_token(token_type: str, ctx: TemplatifyContext) -> dict[str, Any]:
    if token_type not in ctx.counters:
        ctx.counters[token_type] = 0

    ctx.counters[token_type] += 1
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


def _create_code_token_text(token_type: str, ctx: TemplatifyContext) -> str:
    """Helper function to create code token text."""
    if token_type not in ctx.counters:
        ctx.counters[token_type] = 0

    ctx.counters[token_type] += 1

    # Create the token text
    token_text = f"{token_type} {ctx.counters[token_type]}"

    if ctx.token_style == "curly":
        return f"{{{{{token_text}}}}}"  # → {{Code 1}}
    else:
        return f"[{token_text}]"  # → [Code 1]


def _render(ast: list[dict[str, Any]], ctx: TemplatifyContext) -> str:
    renderer = mistune.renderers.markdown.MarkdownRenderer()
    return renderer(ast, state=mistune.BlockState())
