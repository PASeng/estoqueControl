from datetime import datetime

from pydantic import BaseModel, ConfigDict


class SellerBase(BaseModel):
    name: str
    cpf: str
    phone: str | None = None
    region: str | None = None
    address: str | None = None
    gps_point: str | None = None


class SellerCreate(SellerBase):
    pass


class SellerResponse(SellerBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime


class ProductBase(BaseModel):
    name: str
    category: str
    material: str | None = None
    barcode: str | None = None
    price: float
    stock_qty: int = 0


class ProductCreate(ProductBase):
    pass


class ProductResponse(ProductBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class BagItemCreate(BaseModel):
    product_id: int
    quantity_sent: int


class BagItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product_id: int
    quantity_sent: int
    quantity_returned: int


class BagScanRequest(BaseModel):
    barcode: str


class ClosingReportResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    bag_id: int
    sold_count: int
    summary: str
    created_at: datetime


class ClosingReportUpdate(BaseModel):
    bag_id: int
    sold_count: int
    summary: str


class BagBase(BaseModel):
    code: str
    status: str = "Disponivel"
    due_date: datetime | None = None
    seller_id: int | None = None


class BagCreate(BagBase):
    items: list[BagItemCreate] = []


class BagResponse(BagBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    items: list[BagItemResponse]


class DashboardSummary(BaseModel):
    region_leader: str
    month_sales: float
    pending_ai_analysis: bool
    upcoming_closings: list[str]
