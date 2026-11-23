"""Notification microservice - entry point."""

import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from app.routers import notification
from py_eureka_client.eureka_client import EurekaClient

PORT = int(os.getenv("PORT", "8084"))


@asynccontextmanager
async def lifespan(app: FastAPI):
    client = EurekaClient(
        eureka_server="http://localhost:8761/eureka/",
        app_name="NOTIFICATION",
        instance_port=PORT,
        instance_host="localhost",
        instance_ip="127.0.0.1",
        home_page_url=f"http://localhost:{PORT}/",
        status_page_url=f"http://localhost:{PORT}/info",
        health_check_url=f"http://localhost:{PORT}/health",
    )

    await client.start()
    print(f"Notification registered with Eureka on port {PORT}")

    yield

    await client.stop()
    print("Notification stopped")


app = FastAPI(
    title="Notification Microservice API",
    version="1.0.0",
    description="Notification microservice (Python / FastAPI, no database).",
    contact={"name": "Badia Abouhdid"},
    servers=[{"url": f"http://localhost:{PORT}", "description": "Local"}],
    docs_url="/swagger-ui",
    openapi_url="/v3/api-docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)


# Endpoint de santé
@app.get("/health")
async def health():
    return {"status": "UP"}


# Informations sur le microservice
@app.get("/info")
async def info():
    return {
        "name": "notification",
        "version": "1.0.0"
    }


app.include_router(notification.router)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=PORT,
    )