import uuid
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from doc81.core.database import get_db
from doc81.core.models import Company, Template, UserProfile
from doc81.core.schema import CompanySchema, TemplateSchema, UserProfileSchema

router = APIRouter(prefix="/companies", tags=["companies"])


@router.get("/", response_model=List[CompanySchema])
async def list_companies(db: Session = Depends(get_db)):
    """List all companies"""
    companies = db.query(Company).all()
    return companies


@router.post("/", response_model=CompanySchema, status_code=status.HTTP_201_CREATED)
async def create_company(company_data: CompanySchema, db: Session = Depends(get_db)):
    """Create a new company"""
    company = Company(
        id=uuid.uuid4(),
        name=company_data.name,
    )
    
    db.add(company)
    db.commit()
    db.refresh(company)
    
    return company


@router.get("/{company_id}", response_model=CompanySchema)
async def get_company(company_id: uuid.UUID, db: Session = Depends(get_db)):
    """Get a company by ID"""
    company = db.query(Company).filter(Company.id == company_id).first()
    
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": "Company not found"}
        )
    
    return company


@router.get("/{company_id}/templates", response_model=List[TemplateSchema])
async def get_company_templates(company_id: uuid.UUID, db: Session = Depends(get_db)):
    """Get templates owned by a specific company"""
    # Check if company exists
    company = db.query(Company).filter(Company.id == company_id).first()
    
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": "Company not found"}
        )
    
    templates = db.query(Template).filter(Template.company_id == company_id).all()
    
    return templates


@router.get("/{company_id}/users", response_model=List[UserProfileSchema])
async def get_company_users(company_id: uuid.UUID, db: Session = Depends(get_db)):
    """Get users belonging to a specific company"""
    # Check if company exists
    company = db.query(Company).filter(Company.id == company_id).first()
    
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": "Company not found"}
        )
    
    users = db.query(UserProfile).filter(UserProfile.company_id == company_id).all()
    
    return users 