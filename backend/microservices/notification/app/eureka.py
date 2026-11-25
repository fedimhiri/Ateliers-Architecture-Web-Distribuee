
# ==========================================
# 1. IMPORTS
# ==========================================

import os
from py_eureka_client.eureka_client import EurekaClient

# ==========================================
# 2. NOM DU MICROSERVICE
# ==========================================

APP_NAME = "NOTIFICATION"

# ==========================================
# 3. CONFIGURATION DU PORT
# ==========================================

def get_port() -> int:
    return int(os.getenv("PORT", "8089"))

# ==========================================
# 4. ACTIVATION D'EUREKA
# ==========================================

def eureka_enabled() -> bool:
    return os.getenv("EUREKA_ENABLED", "true").lower() != "false"

# ==========================================
# 5. CREATION DU CLIENT EUREKA
# ==========================================

def create_eureka_client(port: int) -> EurekaClient:

    host = os.getenv("EUREKA_INSTANCE_HOST", "localhost")
    ip = os.getenv("EUREKA_INSTANCE_IP", "127.0.0.1")

    base_url = f"http://{host}:{port}"

    return EurekaClient(

        # Serveur Eureka
        eureka_server=os.getenv(
            "EUREKA_SERVER",
            "http://localhost:8761/eureka"
        ),

        # Nom du microservice
        app_name=APP_NAME,

        # Informations de l'instance
        instance_host=host,
        instance_ip=ip,
        instance_port=port,

        # Documentation Swagger
        home_page_url=f"{base_url}/swagger-ui",

        # Informations du microservice
        status_page_url=f"{base_url}/info",

        # Verification de la sante
        health_check_url=f"{base_url}/health"
    )
