import uuid
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class Doc81Template(BaseModel):
    name: str
    description: str
    tags: list[str]
    path: str


class CompanySchema(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    name: str

    class Config:
        from_attributes = True


class UserProfileSchema(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    auth_user_id: uuid.UUID
    company_id: Optional[uuid.UUID] = None
    name: Optional[str] = None

    class Config:
        from_attributes = True


class TemplateSchema(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    creator_id: Optional[uuid.UUID] = None
    company_id: Optional[uuid.UUID] = None
    name: str
    description: Optional[str] = None
    content: str
    tags: List[str] = Field(default_factory=list)
    path: Optional[str] = None
    like_count: int = 0
    version: int = 1

    class Config:
        from_attributes = True


class TemplateVersionSchema(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    template_id: uuid.UUID
    version_number: int
    content: str
    change_notes: Optional[str] = None
    modified_by_user_id: Optional[uuid.UUID] = None

    class Config:
        from_attributes = True


class TemplateLikeSchema(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    template_id: uuid.UUID
    user_id: uuid.UUID

    class Config:
        from_attributes = True


class TemplateCreateSchema(BaseModel):
    name: str
    description: Optional[str] = None
    content: str
    tags: List[str] = Field(default_factory=list)
    path: Optional[str] = None


class TemplateUpdateSchema(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    content: Optional[str] = None
    tags: Optional[List[str]] = None
    path: Optional[str] = None
    change_notes: Optional[str] = None


class TemplateGenerateSchema(BaseModel):
    raw_markdown: str
