from enum import Enum
from pathlib import Path
import typer

app = typer.Typer()


class Mode(str, Enum):
    CURSOR = "cursor"
    VSCODE = "vscode"
    CLAUDE_DESKTOP = "claude"


@app.command(name="setup")
def setup(
    mode: Mode = typer.Option(Mode.CURSOR, help="The mode to setup"),
):
    print(f"Setting up {mode.value}...")
    if mode == Mode.CURSOR:
        cursor_rules_dir = Path(".cursor/rules")
        cursor_rules_dir.mkdir(parents=True, exist_ok=True)

        import urllib.request

        try:
            url = "https://raw.githubusercontent.com/ahnopologetic/doc_81/refs/heads/main/prompts/doc81.prompt.md"
            with urllib.request.urlopen(url) as response:
                prompt_content = response.read().decode("utf-8")

            cursor_rule_file = cursor_rules_dir / "doc81.mdc"
            with open(cursor_rule_file, "w") as f:
                f.write(prompt_content)

            print(f"Created Cursor rule: {cursor_rule_file}")
        except Exception as e:
            print(f"Error downloading prompt content: {e}")
            prompt_file = Path("prompts/doc81.prompt.md")
            if prompt_file.exists():
                with open(prompt_file, "r") as f:
                    prompt_content = f.read()

                cursor_rule_file = cursor_rules_dir / "doc81.mdc"
                with open(cursor_rule_file, "w") as f:
                    f.write(prompt_content)

                print(f"Created Cursor rule from local file: {cursor_rule_file}")
            else:
                print(
                    "Warning: Failed to download prompt content and local prompts/doc81.prompt.md not found. Do nothing"
                )
    elif mode == Mode.VSCODE:
        print("Setting up VSCode...")
    elif mode == Mode.CLAUDE_DESKTOP:
        print("Setting up Claude Desktop...")
    else:
        typer.echo(f"Invalid mode: {mode}")


@app.command(name="list")
def list_templates():
    print("Listing templates...")


if __name__ == "__main__":
    app()
