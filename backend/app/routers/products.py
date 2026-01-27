from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..db import get_db
from ..models import Product
from ..schemas import ProductCreate, ProductResponse

router = APIRouter(prefix="/products", tags=["Estoque"])


@router.get("", response_model=list[ProductResponse])
def list_products(db: Session = Depends(get_db)) -> list[ProductResponse]:
    products = db.execute(select(Product)).scalars().all()
    return products


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(payload: ProductCreate, db: Session = Depends(get_db)) -> ProductResponse:
    if payload.barcode:
        existing = db.execute(
            select(Product).where(Product.barcode == payload.barcode)
        ).scalar_one_or_none()
        if existing:
            raise HTTPException(status_code=400, detail="Código de barras já cadastrado")
    product = Product(**payload.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product
