import pathlib
from typing import Literal
import litellm

PROMPT = pathlib.Path(__file__).parent / "prompts" / "doc81-generate.md"

SUPPORTED_MODELS = Literal[
    "openai/gpt-4o-mini",
    "openai/gpt-4o",
    "openai/gpt-4.1",
    "openai/gpt-4.1-mini",
    "anthropic/claude-3.5-sonnet",
    "anthropic/claude-3.5-haiku",
    "anthropic/claude-3.7-sonnet",
    "anthropic/claude-4.0-sonnet",
    "gemini/gemini-2.0-flash-exp",
    "gemini/gemini-2.0-flash-lite-exp",
]


def generate_template(
    raw_markdown: str,
    *,
    model: SUPPORTED_MODELS = "openai/gpt-4o-mini",
) -> str:
    """
    Generate a template from raw markdown.
    """
    # TODO: Implement this
    # get user preference if exists
    # get latest model selection if exists

    completion = litellm.completion(
        model=model,
        messages=[
            {"role": "developer", "content": PROMPT.read_text()},
            {"role": "user", "content": raw_markdown},
        ],
    )

    result = completion.choices[0].message.content
    # TODO: check if result is valid markdown
    # ensure result ends with a newline
    if not result.endswith("\n"):
        result += "\n"

    return result


if __name__ == "__main__":
    raw_markdown = open("tests/data/raw/blog.md").read()
    print(generate_template(raw_markdown))
