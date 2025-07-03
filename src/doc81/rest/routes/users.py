import uuid
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from doc81.core.database import get_db
from doc81.core.models import Template, UserProfile
from doc81.core.schema import TemplateSchema, UserProfileSchema

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/{user_id}", response_model=UserProfileSchema)
async def get_user(user_id: uuid.UUID, db: Session = Depends(get_db)):
    """Get user profile by ID"""
    user = db.query(UserProfile).filter(UserProfile.auth_user_id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail={"error": "User not found"}
        )

    return user


@router.get("/{user_id}/templates", response_model=List[TemplateSchema])
async def get_user_templates(user_id: uuid.UUID, db: Session = Depends(get_db)):
    """Get templates created by a specific user"""
    # First check if user exists
    user = db.query(UserProfile).filter(UserProfile.auth_user_id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail={"error": "User not found"}
        )

    # Get templates created by the user
    templates = db.query(Template).filter(Template.creator_id == user_id).all()

    return templates
