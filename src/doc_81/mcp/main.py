from typing import Callable
from fastmcp import FastMCP
from doc_81 import service

mcp = FastMCP("Doc81 🚀")


def mcp_tool_from_service(service_func: Callable) -> Callable:
    """
    A decorator to convert a service function to an MCP tool.
    Inject the service function into the MCP tool and its docstring.
    """
    return mcp.tool(
        service_func,
        description=service_func.__doc__,
        name=service_func.__name__,
    )


@mcp.tool
def list_templates() -> list[str]:
    return service.list_templates()


@mcp.tool
def get_template(path_or_ref: str) -> dict[str, str | list[str]]:
    return service.get_template(path_or_ref)


def main():
    mcp.run()


if __name__ == "__main__":
    main()
