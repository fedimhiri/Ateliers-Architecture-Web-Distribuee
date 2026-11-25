
"""
Microservice NOTIFICATION - FastAPI

Instance principale : port 8089
Deuxieme instance  : port 8091
Eureka Server      : port 8761

Demarrage :
    python -m app.main

Deuxieme instance (PowerShell) :
    $env:PORT=8091
    python -m app.main
"""

import os
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.eureka import create_eureka_client, eureka_enabled
from app.routers import notification


# ==========================================
# 1. CONFIGURATION DU PORT
# ==========================================

PORT = int(os.getenv("PORT", "8089"))


# ==========================================
# 2. CONNEXION AU SERVEUR EUREKA
# ==========================================

@asynccontextmanager
async def lifespan(app: FastAPI):

    client = None

    if eureka_enabled():
        client = create_eureka_client(PORT)

        try:
            await client.start()

            print(
                f"Registered in Eureka as NOTIFICATION "
                f"(localhost:notification:{PORT})"
            )

        except Exception as e:
            print(f"Eureka registration failed: {e}")

    # Application en cours d'execution
    yield

    # Desenregistrement lors de l'arret
    if client is not None:
        try:
            await client.stop()
            print("Deregistered from Eureka")
        except Exception as e:
            print(f"Eureka deregistration failed: {e}")


# ==========================================
# 3. CREATION DE L'APPLICATION FASTAPI
# ==========================================

app = FastAPI(
    title="Notification Microservice API",
    version="1.0.0",
    description=(
        "Microservice de gestion des notifications "
        "avec FastAPI et Eureka."
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
# 4. ENDPOINT HEALTH
# ==========================================

@app.get("/health", tags=["Monitoring"])
async def health():
    return {
        "status": "UP"
    }


# ==========================================
# 5. ENDPOINT INFO
# ==========================================

@app.get("/info", tags=["Monitoring"])
async def info():
    return {
        "app": {
            "name": "NOTIFICATION",
            "version": "1.0.0",
            "description": "Microservice de gestion des notifications",
            "port": PORT
        }
    }


# ==========================================
# 6. ROUTES NOTIFICATION
# ==========================================

app.include_router(notification.router)


# ==========================================
# 7. DEMARRAGE DU MICROSERVICE
# ==========================================

if __name__ == "__main__":

    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=PORT,
        reload=False
    )
