class Doc81Exception(Exception):
    """Base exception for Doc81."""


class Doc81ConfigException(Doc81Exception):
    """Exception raised when there is an error in the configuration."""


class Doc81ServiceException(Doc81Exception):
    """Exception raised when there is an error in the service."""


class Doc81NotAllowedError(Doc81Exception):
    """Exception raised when an operation is not allowed."""
