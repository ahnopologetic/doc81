from pydantic import BaseModel


class Doc81Template(BaseModel):
    name: str
    description: str
    tags: list[str]
    path: str
