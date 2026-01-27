from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..db import get_db
from ..models import Seller
from ..schemas import SellerCreate, SellerResponse

router = APIRouter(prefix="/sellers", tags=["Equipe"])


@router.get("", response_model=list[SellerResponse])
def list_sellers(db: Session = Depends(get_db)) -> list[SellerResponse]:
    sellers = db.execute(select(Seller)).scalars().all()
    return sellers


@router.post("", response_model=SellerResponse, status_code=status.HTTP_201_CREATED)
def create_seller(payload: SellerCreate, db: Session = Depends(get_db)) -> SellerResponse:
    existing = db.execute(select(Seller).where(Seller.cpf == payload.cpf)).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=400, detail="CPF já cadastrado")
    seller = Seller(**payload.model_dump())
    db.add(seller)
    db.commit()
    db.refresh(seller)
    return seller


@router.put("/{seller_id}", response_model=SellerResponse)
def update_seller(
    seller_id: int, payload: SellerCreate, db: Session = Depends(get_db)
) -> SellerResponse:
    seller = db.execute(select(Seller).where(Seller.id == seller_id)).scalar_one_or_none()
    if not seller:
        raise HTTPException(status_code=404, detail="Vendedora não encontrada")
    for key, value in payload.model_dump().items():
        setattr(seller, key, value)
    db.commit()
    db.refresh(seller)
    return seller
