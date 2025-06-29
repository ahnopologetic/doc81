# Doc81 🚀

Doc81 is a template management system that helps you create, manage, and use document templates with frontmatter metadata. It provides both a local mode for working with templates on your filesystem and a server mode (coming soon) for accessing templates over HTTP.

## Features

- Template management with frontmatter metadata (name, description, tags)
- Local filesystem template storage and retrieval
- MCP (Model Control Protocol) integration for AI assistant compatibility
- Simple API for listing and retrieving templates
- Support for markdown templates

## Installation

### Prerequisites

- Python 3.8+
- pip or pipenv

### Quick Start

1. Clone the repository
```bash
git clone https://github.com/yourusername/doc-81.git
cd doc-81
```

2. Install dependencies
```bash
pip install -e .
pip install doc81
```

3. Run the MCP server
```bash
uvx doc81-mcp
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
