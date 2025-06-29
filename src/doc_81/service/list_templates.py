from pathlib import Path
from doc_81.core.config import config


def list_templates() -> list[str]:
    if config.mode == "server":
        raise NotImplementedError("Server mode is not implemented yet")

    return [
        "incident_runbook.md",
    ]
