# Doc81 🚀

Doc81 is a developer document template platform that helps you create, manage, and use document templates proven by many experts. It provides both a local mode for working with templates on your filesystem and a server mode for accessing templates out there.

## Features

- Your Document -> Scalable Document Template in 2s
- Find appropriate document templates on demand
- MCP (Model Control Protocol) integration for AI assistant compatibility
- API server for general usage

## Installation

### Prerequisites

- Python 3.10+
- pip or pipenv

### Quick Start

#### MCP (recommended)
##### Cursor (default)
1. setup MCP

```
> uvx --with doc81 doc81-mcp-cli setup
```

This command add .cursor/rules/doc81.mdc.
This prompt will guide cursor how to ask and do the work for you.

2. add MCP
```json
// mcp.json`
{
    "mcpServers": {
        "doc81": {
            "command": "uvx",
            "args": [
                "--from",
                "doc81",
                "doc81-mcp"
            ],
            "env": {
                "DOC81_PROMPT_DIR": "<your local prompt directory>"
            }
        },
    }
}
```

See [Configuration](#configuration) for details.

3. Use the cursorrule to generate document based on the template.

```
// cursor ask/agent
> Help me write a runbook in @your-new-doc.md

cursor: List template (function call)
cursor: Get template (function call)

Let me copy the runbook template to your-new-doc.md. ...
```

## Usage

### Creating Templates

Templates are markdown files with frontmatter metadata. Create a template file with the following structure:

```markdown
---
name: Template Name
description: Template description
tags: [tag1, tag2]
---
# Your Template Content

Content goes here...
```

### Using Templates

Doc81 provides two main functions:

1. `list_templates()` - Lists all available templates
2. `get_template(path_or_ref)` - Gets a specific template by path or reference

#### Python API

```python
from doc81 import service

# List all templates
templates = service.list_templates()

# Get a specific template
template = service.get_template("path/to/template.md")
```

#### MCP API

Doc81 integrates with MCP for AI assistant compatibility:

- `list_templates` - Lists all available templates
- `get_template(path_or_ref)` - Gets a specific template by path or reference

## Configuration

Doc81 can be configured using environment variables:

- `DOC81_ENV` - Environment (dev/prod, default: dev)
- `DOC81_MODE` - Mode (local/server, default: local)
- `DOC81_PROMPT_DIR` - Directory containing templates (default: project's prompts directory)

## Development

### Testing

```bash
pytest tests/
```

## License

[Your license information]

## Contributing

[Your contribution guidelines]
