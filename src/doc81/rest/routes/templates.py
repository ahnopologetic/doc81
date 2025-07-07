import uuid
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from doc81.core.database import get_db
from doc81.core.models import Template, TemplateVersion, TemplateLike, UserProfile
from doc81.core.schema import (
    TemplateCreateSchema,
    TemplateGenerateSchema,
    TemplateSchema,
    TemplateUpdateSchema,
)
import doc81.service

router = APIRouter(prefix="/templates", tags=["templates"])


@router.get("/", response_model=List[TemplateSchema])
async def list_templates(db: Session = Depends(get_db)):
    """List all templates"""
    templates = db.query(Template).all()
    return templates


@router.post("/", response_model=TemplateSchema, status_code=status.HTTP_201_CREATED)
async def create_template(
    template_data: TemplateCreateSchema, db: Session = Depends(get_db)
):
    """Create a new template"""
    # Convert tags list to JSONB format
    template = Template(
        id=uuid.uuid4(),
        name=template_data.name,
        description=template_data.description,
        content=template_data.content,
        tags=template_data.tags,
        path=template_data.path,
    )

    db.add(template)
    db.commit()
    db.refresh(template)

    return template


@router.post("/generate")
async def generate_template(
    template_data: TemplateGenerateSchema,
    db: Session = Depends(get_db),
):
    """Generate a template with variables"""
    return doc81.service.generate_template(template_data.raw_markdown)


@router.get("/{template_id}", response_model=TemplateSchema)
async def get_template(template_id: uuid.UUID, db: Session = Depends(get_db)):
    """Get a template by ID"""
    template = db.query(Template).filter(Template.id == template_id).first()

    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": "Template not found"},
        )

    return template


@router.patch("/{template_id}", response_model=TemplateSchema)
async def update_template(
    template_id: uuid.UUID,
    template_data: TemplateUpdateSchema,
    db: Session = Depends(get_db),
):
    """Update a template by ID"""
    template = db.query(Template).filter(Template.id == template_id).first()

    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": "Template not found"},
        )

    # Create a version record if content is being updated
    if template_data.content and template_data.content != template.content:
        template_version = TemplateVersion(
            template_id=template.id,
            version_number=template.version,
            content=template.content,
            change_notes=template_data.change_notes,
        )
        db.add(template_version)
        template.version += 1

    # Update template fields
    update_data = template_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        if key != "change_notes" and value is not None:
            setattr(template, key, value)

    db.commit()
    db.refresh(template)

    return template


@router.delete("/{template_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_template(template_id: uuid.UUID, db: Session = Depends(get_db)):
    """Delete a template by ID"""
    template = db.query(Template).filter(Template.id == template_id).first()

    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": "Template not found"},
        )

    db.delete(template)
    db.commit()

    return None


@router.post("/{template_id}/like", response_model=TemplateSchema)
async def like_template(
    template_id: uuid.UUID, user_id: uuid.UUID, db: Session = Depends(get_db)
):
    """Like a template"""
    # Check if template exists
    template = db.query(Template).filter(Template.id == template_id).first()
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": "Template not found"},
        )

    # Check if user exists
    user = db.query(UserProfile).filter(UserProfile.auth_user_id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail={"error": "User not found"}
        )

    # Check if user already liked this template
    existing_like = (
        db.query(TemplateLike)
        .filter(
            TemplateLike.template_id == template_id, TemplateLike.user_id == user_id
        )
        .first()
    )

    if existing_like:
        print("User already liked this template")
        return template

    # Create like
    like = TemplateLike(template_id=template_id, user_id=user_id)

    # Increment like count
    template.like_count += 1

    db.add(like)
    db.commit()
    db.refresh(template)

    return template


@router.delete("/{template_id}/like", response_model=TemplateSchema)
async def unlike_template(
    template_id: uuid.UUID, user_id: uuid.UUID, db: Session = Depends(get_db)
):
    """Unlike a template"""
    # Check if template exists
    template = db.query(Template).filter(Template.id == template_id).first()
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": "Template not found"},
        )

    # Check if like exists
    like = (
        db.query(TemplateLike)
        .filter(
            TemplateLike.template_id == template_id, TemplateLike.user_id == user_id
        )
        .first()
    )

    if not like:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": "User has not liked this template"},
        )

    # Decrement like count and ensure it doesn't go below 0
    if template.like_count > 0:
        template.like_count -= 1

    db.delete(like)
    db.commit()
    db.refresh(template)

    return template
