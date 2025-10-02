"""
Aplicación principal FastAPI para el Portafolio Personal
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import os

from app.core.config import settings
from app.api.v1 import auth, projects, cv, admin, uploads, cms, users

# Crear instancia de FastAPI
app = FastAPI(
    title="Portfolio API",
    description="API para el portafolio personal con panel de administración",
    version="1.0.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Crear directorio de uploads si no existe
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

# Servir archivos estáticos
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Incluir routers de la API
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(projects.router, prefix="/api/v1/projects", tags=["Projects"])
app.include_router(cv.router, prefix="/api/v1/cv", tags=["CV"])
app.include_router(uploads.router, prefix="/api/v1/uploads", tags=["Uploads"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"])
app.include_router(cms.router, prefix="/api/v1/cms", tags=["CMS"])


@app.get("/")
async def root():
    """Endpoint raíz de la API"""
    return JSONResponse(
        content={
            "message": "Portfolio API",
            "version": "1.0.0",
            "docs": "/docs" if settings.DEBUG else "Disabled in production",
            "status": "running"
        }
    )


@app.get("/health")
async def health_check():
    """Endpoint para verificar el estado de la API"""
    return JSONResponse(
        content={
            "status": "healthy",
            "environment": settings.ENVIRONMENT,
            "debug": settings.DEBUG
        }
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
