"""
Aplicación principal FastAPI para el Portafolio Personal
"""
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
import os

from app.core.config import settings as config_settings
from app.api.v1 import auth, projects, admin, cms, users, settings, cv

# Crear instancia de FastAPI
app = FastAPI(
    title="Portfolio API",
    description="API para el portafolio personal con panel de administración",
    version="1.0.0",
    docs_url="/docs" if config_settings.DEBUG else None,
    redoc_url="/redoc" if config_settings.DEBUG else None,
)

# Exception handlers para evitar serialización de datos binarios
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Custom handler for validation errors to prevent binary data serialization
    """
    # Extract error details without including the actual input data
    errors = []
    for error in exc.errors():
        error_detail = {
            "loc": error["loc"],
            "msg": error["msg"],
            "type": error["type"],
        }
        errors.append(error_detail)
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "detail": errors,
            "message": "Validation error. Please check your request."
        },
    )

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """
    Custom handler for HTTP exceptions
    """
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": str(exc.detail),
            "status_code": exc.status_code
        },
    )

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=config_settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Crear directorio de uploads si no existe
os.makedirs(config_settings.UPLOAD_DIR, exist_ok=True)

# Servir archivos estáticos
app.mount("/uploads", StaticFiles(directory=config_settings.UPLOAD_DIR), name="uploads")

# Incluir routers de la API
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(projects.router, prefix="/api/v1/projects", tags=["Projects"])
app.include_router(cv.router, prefix="/api/v1/cv", tags=["CV"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"])
app.include_router(cms.router, prefix="/api/v1/cms", tags=["CMS"])
app.include_router(settings.router, prefix="/api/v1/settings", tags=["Settings"])


@app.get("/")
async def root():
    """Endpoint raíz de la API"""
    return JSONResponse(
        content={
            "message": "Portfolio API",
            "version": "1.0.0",
            "docs": "/docs" if config_settings.DEBUG else "Disabled in production",
            "status": "running"
        }
    )


@app.get("/health")
async def health_check():
    """Endpoint para verificar el estado de la API"""
    return JSONResponse(
        content={
            "status": "healthy",
            "environment": config_settings.ENVIRONMENT,
            "debug": config_settings.DEBUG
        }
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=config_settings.DEBUG
    )
