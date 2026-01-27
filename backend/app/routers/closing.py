from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..db import get_db
from ..models import Bag, ClosingReport

router = APIRouter(prefix="/closing", tags=["Fechamento"])


@router.post("/{bag_id}/report", status_code=status.HTTP_201_CREATED)
def create_closing_report(bag_id: int, db: Session = Depends(get_db)) -> dict:
    bag = db.execute(select(Bag).where(Bag.id == bag_id)).scalar_one_or_none()
    if not bag:
        raise HTTPException(status_code=404, detail="Maleta não encontrada")

    summary = (
        f"Fechamento da maleta {bag.code} em {datetime.utcnow().date()}: "
        "IA sugere revisar a composição de metais para a próxima maleta."
    )
    report = ClosingReport(bag_id=bag.id, summary=summary)
    db.add(report)
    db.commit()

    return {"message": "Relatório gerado", "summary": summary}
