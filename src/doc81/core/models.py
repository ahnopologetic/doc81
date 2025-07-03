import uuid

from sqlalchemy import (
    TIMESTAMP,
    Column,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import relationship

from doc81.core.database import Base


class Company(Base):
    __tablename__ = "companies"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(
        TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    users = relationship("UserProfile", back_populates="company")
    templates = relationship("Template", back_populates="company")


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    auth_user_id = Column(UUID(as_uuid=True), nullable=False)
    company_id = Column(
        UUID(as_uuid=True),
        ForeignKey("companies.id", ondelete="SET NULL"),
        nullable=True,
    )
    name = Column(String(255))
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(
        TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    company = relationship("Company", back_populates="users")
    created_templates = relationship("Template", back_populates="creator")
    template_likes = relationship("TemplateLike", back_populates="user")

    # Indexes
    __table_args__ = (
        Index("idx_user_profiles_auth_user_id", auth_user_id),
        Index("idx_user_profiles_company_id", company_id),
    )


class Template(Base):
    __tablename__ = "templates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    creator_id = Column(
        UUID(as_uuid=True),
        ForeignKey("user_profiles.auth_user_id", ondelete="SET NULL"),
        nullable=True,
    )
    company_id = Column(
        UUID(as_uuid=True),
        ForeignKey("companies.id", ondelete="SET NULL"),
        nullable=True,
    )
    name = Column(String(255), nullable=False)
    description = Column(Text)
    content = Column(Text, nullable=False)
    tags = Column(JSONB, server_default="[]")
    path = Column(String(255))
    like_count = Column(Integer, default=0)
    version = Column(Integer, default=1)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(
        TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    creator = relationship("UserProfile", back_populates="created_templates")
    company = relationship("Company", back_populates="templates")
    versions = relationship(
        "TemplateVersion", back_populates="template", cascade="all, delete-orphan"
    )
    likes = relationship(
        "TemplateLike", back_populates="template", cascade="all, delete-orphan"
    )

    # Indexes
    __table_args__ = (
        Index("idx_templates_creator_id", creator_id),
        Index("idx_templates_company_id", company_id),
    )


class TemplateVersion(Base):
    __tablename__ = "template_versions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    template_id = Column(
        UUID(as_uuid=True),
        ForeignKey("templates.id", ondelete="CASCADE"),
        nullable=False,
    )
    version_number = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)
    change_notes = Column(Text)
    modified_by_user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("user_profiles.auth_user_id", ondelete="SET NULL"),
        nullable=True,
    )
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

    # Relationships
    template = relationship("Template", back_populates="versions")
    modified_by = relationship("UserProfile")

    # Unique constraint
    __table_args__ = (
        UniqueConstraint("template_id", "version_number", name="uq_template_version"),
        Index("idx_template_versions_template_id", template_id),
    )


class TemplateLike(Base):
    __tablename__ = "template_likes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    template_id = Column(
        UUID(as_uuid=True),
        ForeignKey("templates.id", ondelete="CASCADE"),
        nullable=False,
    )
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("user_profiles.auth_user_id", ondelete="CASCADE"),
        nullable=False,
    )
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

    # Relationships
    template = relationship("Template", back_populates="likes")
    user = relationship("UserProfile", back_populates="template_likes")

    # Unique constraint
    __table_args__ = (
        UniqueConstraint("template_id", "user_id", name="uq_template_user_like"),
        Index("idx_template_likes_template_id", template_id),
        Index("idx_template_likes_user_id", user_id),
    )
