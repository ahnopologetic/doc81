from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, scoped_session

from doc81.core.config import config

# Base class for all models
Base = declarative_base()

# Database URL configuration
DATABASE_URL = (
    config.database_url if hasattr(config, "database_url") else "sqlite:///./doc81.db"
)

# Create engine
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    echo=config.env == "dev",
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create scoped session for thread safety
db_session = scoped_session(SessionLocal)


def get_db():
    """
    Get database session.

    Yields:
        Session: SQLAlchemy session
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """
    Initialize database by creating all tables.
    """
    # Import all models to ensure they are registered with Base
    from doc81.core.models import (
        Company,
        UserProfile,
        Template,
        TemplateVersion,
        TemplateLike,
    )

    Base.metadata.create_all(bind=engine)
