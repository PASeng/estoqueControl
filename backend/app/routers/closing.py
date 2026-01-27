from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..db import get_db
from ..models import Bag, ClosingReport
from ..schemas import ClosingReportResponse, ClosingReportUpdate

router = APIRouter(prefix="/closing", tags=["Fechamento"])


@router.get("/reports", response_model=list[ClosingReportResponse])
def list_reports(db: Session = Depends(get_db)) -> list[ClosingReportResponse]:
    reports = db.execute(select(ClosingReport)).scalars().all()
    return reports


@router.post("/{bag_id}/report", status_code=status.HTTP_201_CREATED)
def create_closing_report(bag_id: int, db: Session = Depends(get_db)) -> dict:
    bag = db.execute(select(Bag).where(Bag.id == bag_id)).scalar_one_or_none()
    if not bag:
        raise HTTPException(status_code=404, detail="Maleta não encontrada")

    summary = (
        f"Fechamento da maleta {bag.code} em {datetime.utcnow().date()}: "
        "IA sugere revisar a composição de metais para a próxima maleta."
    )
    report = ClosingReport(bag_id=bag.id, sold_count=0, summary=summary)
    db.add(report)
    db.commit()

    return {"message": "Relatório gerado", "summary": summary}


@router.put("/reports/{report_id}", response_model=ClosingReportResponse)
def update_report(
    report_id: int, payload: ClosingReportUpdate, db: Session = Depends(get_db)
) -> ClosingReportResponse:
    report = db.execute(
        select(ClosingReport).where(ClosingReport.id == report_id)
    ).scalar_one_or_none()
    if not report:
        raise HTTPException(status_code=404, detail="Relatório não encontrado")
    report.bag_id = payload.bag_id
    report.sold_count = payload.sold_count
    report.summary = payload.summary
    db.commit()
    db.refresh(report)
    return report
