from doc_81.mcp.cli import app
from typer.testing import CliRunner


runner = CliRunner()


def test_setup_should_create_cursor_rule_file():
    result = runner.invoke(app, ["setup", "--mode", "cursor"])
    assert result.exit_code == 0
    assert "Setting up cursor..." in result.stdout
    assert "Created Cursor rule: " in result.stdout


def test_setup_should_create_vscode_rule_file():
    result = runner.invoke(app, ["setup", "--mode", "vscode"])
    assert result.exit_code == 0
    assert "Setting up vscode..." in result.stdout


def test_setup_should_create_claude_rule_file():
    result = runner.invoke(app, ["setup", "--mode", "claude"])
    assert result.exit_code == 0
    assert "Setting up claude..." in result.stdout
