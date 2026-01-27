from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .db import Base


class Seller(Base):
    __tablename__ = "sellers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    cpf: Mapped[str] = mapped_column(String(14), unique=True, nullable=False)
    address: Mapped[str | None] = mapped_column(String(255))
    gps_point: Mapped[str | None] = mapped_column(String(120))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow
    )

    bags: Mapped[list["Bag"]] = relationship("Bag", back_populates="seller")


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    category: Mapped[str] = mapped_column(String(80), nullable=False)
    barcode: Mapped[str | None] = mapped_column(String(80), unique=True)
    price: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    stock_qty: Mapped[int] = mapped_column(Integer, default=0)


class Bag(Base):
    __tablename__ = "bags"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    code: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    status: Mapped[str] = mapped_column(String(30), default="Disponivel")
    due_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    seller_id: Mapped[int | None] = mapped_column(ForeignKey("sellers.id"))

    seller: Mapped["Seller"] = relationship("Seller", back_populates="bags")
    items: Mapped[list["BagItem"]] = relationship(
        "BagItem", back_populates="bag", cascade="all, delete-orphan"
    )
    reports: Mapped[list["ClosingReport"]] = relationship(
        "ClosingReport", back_populates="bag", cascade="all, delete-orphan"
    )


class BagItem(Base):
    __tablename__ = "bag_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    bag_id: Mapped[int] = mapped_column(ForeignKey("bags.id"))
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))
    quantity_sent: Mapped[int] = mapped_column(Integer, default=0)
    quantity_returned: Mapped[int] = mapped_column(Integer, default=0)

    bag: Mapped["Bag"] = relationship("Bag", back_populates="items")
    product: Mapped["Product"] = relationship("Product")


class ClosingReport(Base):
    __tablename__ = "closing_reports"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    bag_id: Mapped[int] = mapped_column(ForeignKey("bags.id"))
    summary: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow
    )

    bag: Mapped["Bag"] = relationship("Bag", back_populates="reports")
