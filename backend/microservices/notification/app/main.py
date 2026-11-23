
"""Notification microservice - FastAPI + Eureka Client."""

import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
import py_eureka_client.eureka_client as eureka_client

from app.routers import notification


# ==========================================
# CONFIGURATION
# ==========================================

PORT = int(os.getenv("PORT", "8089"))
APP_NAME = "NOTIFICATION"
APP_VERSION = "1.0.0"

EUREKA_SERVER = os.getenv(
    "EUREKA_SERVER",
    "http://localhost:8761/eureka"
)


# ==========================================
# EUREKA CLIENT
# ==========================================

@asynccontextmanager
async def lifespan(app: FastAPI):

    client = None

    try:
        client = await eureka_client.init_async(
            eureka_server=EUREKA_SERVER,
            app_name=APP_NAME,
            instance_port=PORT,
            instance_host="127.0.0.1",

            # URLs de sante et d'information
            health_check_url=f"http://localhost:{PORT}/health",
            status_page_url=f"http://localhost:{PORT}/info",
            home_page_url=f"http://localhost:{PORT}/"
        )

        print(f"{APP_NAME} enregistre dans Eureka")
        print(f"Eureka Server : {EUREKA_SERVER}")

    except Exception as error:
        print(f"Erreur de connexion Eureka : {error}")

    try:
        yield
    finally:
        if client is not None:
            await client.stop()
            print(f"{APP_NAME} retire de Eureka")


# ==========================================
# APPLICATION FASTAPI
# ==========================================

app = FastAPI(
    title="Notification Microservice API",
    version=APP_VERSION,
    description=(
        "Notification microservice (Python / FastAPI, no database). "
        "Only the hello endpoint is implemented; "
        "the notification logic is to be developed by students."
    ),
    contact={"name": "Badia Abouhdid"},
    servers=[
        {
            "url": f"http://localhost:{PORT}",
            "description": "Local"
        }
    ],
    docs_url="/swagger-ui",
    openapi_url="/v3/api-docs",
    redoc_url="/redoc",
    lifespan=lifespan
)


# ==========================================
# HEALTH ET INFO
# ==========================================

@app.get("/health")
def health():
    return {
        "status": "UP"
    }


@app.get("/info")
def info():
    return {
        "name": "notification",
        "version": APP_VERSION
    }


# ==========================================
# ROUTES EXISTANTES
# ==========================================

app.include_router(notification.router)


# ==========================================
# LANCEMENT DIRECT
# ==========================================

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=PORT
    )
