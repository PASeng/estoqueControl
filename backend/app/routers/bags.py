from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..db import get_db
from ..models import Bag, BagItem
from ..schemas import BagCreate, BagResponse

router = APIRouter(prefix="/bags", tags=["Maletas"])


@router.get("", response_model=list[BagResponse])
def list_bags(db: Session = Depends(get_db)) -> list[BagResponse]:
    bags = db.execute(select(Bag)).scalars().all()
    return bags


@router.post("", response_model=BagResponse, status_code=status.HTTP_201_CREATED)
def create_bag(payload: BagCreate, db: Session = Depends(get_db)) -> BagResponse:
    existing = db.execute(select(Bag).where(Bag.code == payload.code)).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=400, detail="Código de maleta já cadastrado")
    bag = Bag(
        code=payload.code,
        status=payload.status,
        due_date=payload.due_date,
        seller_id=payload.seller_id,
    )
    db.add(bag)
    for item in payload.items:
        bag.items.append(
            BagItem(
                product_id=item.product_id,
                quantity_sent=item.quantity_sent,
                quantity_returned=0,
            )
        )
    db.commit()
    db.refresh(bag)
    return bag


@router.put("/{bag_id}", response_model=BagResponse)
def update_bag(bag_id: int, payload: BagCreate, db: Session = Depends(get_db)) -> BagResponse:
    bag = db.execute(select(Bag).where(Bag.id == bag_id)).scalar_one_or_none()
    if not bag:
        raise HTTPException(status_code=404, detail="Maleta não encontrada")
    bag.code = payload.code
    bag.status = payload.status
    bag.due_date = payload.due_date
    bag.seller_id = payload.seller_id
    if payload.items:
        bag.items.clear()
        for item in payload.items:
            bag.items.append(
                BagItem(
                    product_id=item.product_id,
                    quantity_sent=item.quantity_sent,
                    quantity_returned=0,
                )
            )
    db.commit()
    db.refresh(bag)
    return bag
