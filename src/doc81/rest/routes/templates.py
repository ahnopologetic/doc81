from fastapi import APIRouter

from doc81.core.schema import TemplateCreateSchema, TemplateSchema, TemplateUpdateSchema

router = APIRouter(prefix="/templates", tags=["templates"])


@router.get("/", response_model=list[TemplateSchema])
async def list_templates():
    # TODO: Implement list templates
    return []


@router.post("/", response_model=TemplateSchema, status_code=201)
async def create_template(template: TemplateCreateSchema):
    # TODO: Implement create template
    return template


@router.get("/{template_id}", response_model=TemplateSchema)
async def get_template(template_id: str):
    # TODO: Implement get template
    return TemplateSchema(
        id=template_id, name="Test Template", description="Test Description"
    )


@router.patch("/{template_id}", response_model=TemplateSchema)
async def update_template(template_id: str, template: TemplateUpdateSchema):
    # TODO: Implement update template
    return template


@router.delete("/{template_id}", status_code=204)
async def delete_template(template_id: str):
    # TODO: Implement delete template
    ...
