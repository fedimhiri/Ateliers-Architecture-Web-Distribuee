
"""Notification microservice - entry point."""

import os
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI
import py_eureka_client.eureka_client as eureka_client

from app.routers import notification

PORT = int(os.getenv("PORT", "8084"))


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Enregistrement du service dans Eureka
    await eureka_client.init_async(
        eureka_server="http://localhost:8761/eureka",
        app_name="NOTIFICATION",
        instance_host="localhost",
        instance_ip="127.0.0.1",
        instance_port=PORT,

        health_check_url="http://localhost:8084/health",
        status_page_url="http://localhost:8084/info",
    )

    print(f"Notification registered in Eureka on port {PORT}")

    yield

    # Arrêt du client Eureka
    await eureka_client.stop_async()


app = FastAPI(
    title="Notification Microservice API",
    version="1.0.0",
    description=(
        "Notification microservice (Python / FastAPI, no database). "
        "Only the hello endpoint is implemented; the notification logic is to be developed by students."
    ),
    contact={"name": "Badia Abouhdid"},
    servers=[{"url": f"http://localhost:{PORT}", "description": "Local"}],
    docs_url="/swagger-ui",
    openapi_url="/v3/api-docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

app.include_router(notification.router)
@app.get("/health")
async def health():
    return {"status": "UP"}


@app.get("/info")
async def info():
    return {
        "name": "NOTIFICATION",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=PORT)
