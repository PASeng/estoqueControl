from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from ..db import get_db
from ..models import Bag, Product
from ..schemas import DashboardSummary

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary", response_model=DashboardSummary)
def get_summary(db: Session = Depends(get_db)) -> DashboardSummary:
    total_stock_value = db.execute(
        select(func.coalesce(func.sum(Product.price * Product.stock_qty), 0))
    ).scalar()
    pending_ai_analysis = db.execute(
        select(func.count(Bag.id)).where(Bag.status == "Aguardando")
    ).scalar()
    upcoming_bags = db.execute(select(Bag.code).where(Bag.due_date.is_not(None)).limit(5))
    return DashboardSummary(
        region_leader="Zona Norte",
        month_sales=float(total_stock_value or 0),
        pending_ai_analysis=(pending_ai_analysis or 0) > 0,
        upcoming_closings=[row[0] for row in upcoming_bags],
    )
