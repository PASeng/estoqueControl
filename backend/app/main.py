from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .db import Base, engine
from .routers import bags, closing, dashboard, products, sellers

app = FastAPI(title="Kamilla Intelligence API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


app.include_router(dashboard.router)
app.include_router(sellers.router)
app.include_router(products.router)
app.include_router(bags.router)
app.include_router(closing.router)
