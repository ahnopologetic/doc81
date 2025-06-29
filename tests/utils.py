from contextlib import contextmanager
import os


@contextmanager
def override_env(**kwargs):
    original_env = {k: os.getenv(k) for k in kwargs}
    for k, v in kwargs.items():
        os.environ[k] = v
    yield
    for k, v in original_env.items():
        if v is None:
            del os.environ[k]
        else:
            os.environ[k] = v
