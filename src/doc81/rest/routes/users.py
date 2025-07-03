from fastapi import APIRouter

from doc81.core.schema import TemplateSchema, UserProfileSchema

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/{user_id}", response_model=UserProfileSchema)
async def get_user(user_id: str):
    return UserProfileSchema(id=user_id, name="Test User", email="test@test.com")


@router.get("/{user_id}/templates", response_model=list[TemplateSchema])
async def get_user_templates(user_id: str):
    return []
