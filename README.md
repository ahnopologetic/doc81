# Doc81 🚀

Doc81 is a tech documentation tool (web, mcp) designed in AI-native mind that helps you create, manage, and use document templates proven by many experts. It provides both a local mode for working with templates on your filesystem and a server mode for accessing templates out there.

### Background
> Started this idea from the moment when, as a manager, I asked for a "good" handoff documentation from our engineer who's leaving soon. The first doc was crappy. I wrote what each part needs to include, and so forth, and the experience turns out to be awesome for both of us. 

> My takeaway was **to share and consistently develop a good structure** for dev doc. I believe doc81 is a good start.



### Usecase
- **General developers**: Pick a good documentation template from [doc81 web](https://doc81.ahnopologetic.xyz/) and start writing a doc using the template by using MCP. (See [MCP on doc81 web](https://doc81.ahnopologetic.xyz/mcp) for more detail) 
- **Dev writers**: Turn your technical documentations into reusable document templates on [doc81 web](https://doc81.ahnopologetic.xyz) "Turn your document into AI powered templates" section. 
- **Security-concerned SWEs**: Use [doc81 MCP local mode](https://doc81.ahnopologetic.xyz/mcp) to start writing from your local templates without pulling data from server or pushing to the external world. Stay focused. 


## Features

- Your Document -> Scalable Document Template in 2s
- Find appropriate document templates on demand
- MCP (Model Control Protocol) integration for AI assistant compatibility
- API server for general usage


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

Use our MCP one-click install from [doc81 web MCP page](https://doc81.ahnopologetic.xyz/mcp)


Or you can manually edit JSON
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

#### Web
Please navigate [Doc81 web](https://doc81.ahnopologetic.xyz/).


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
Please leave your feedback or places that need improvement in Github Issues.

### Prerequisites

- Python 3.10+
- pip or pipenv

### Testing

```bash
uv run python -m pytest tests/
```

## License

[License - MIT](./LICENSE)

<!-- ## Contributing

[Your contribution guidelines] -->
