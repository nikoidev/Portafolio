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
from app.api.v1 import auth, projects, admin, cms, users, settings, cv, uploads

# Crear instancia de FastAPI con exception handlers desactivados por defecto
app = FastAPI(
    title="Portfolio API",
    description="API para el portafolio personal con panel de administración",
    version="1.0.0",
    docs_url="/docs" if config_settings.DEBUG else None,
    redoc_url="/redoc" if config_settings.DEBUG else None,
    # Disable default exception handlers to prevent binary data serialization
    exception_handlers={},
)

# Custom exception handler para RequestValidationError
@app.exception_handler(RequestValidationError)
async def custom_validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Custom handler for validation errors to prevent binary data serialization.
    This replaces FastAPI's default handler that tries to serialize request body.
    """
    # Extract only safe error information without the input data
    safe_errors = []
    for error in exc.errors():
        # Only include location, message, and type - never the actual input
        safe_error = {
            "loc": error.get("loc", []),
            "msg": error.get("msg", ""),
            "type": error.get("type", ""),
        }
        safe_errors.append(safe_error)
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "detail": safe_errors,
            "message": "Validation error occurred"
        },
    )

@app.exception_handler(StarletteHTTPException)
async def custom_http_exception_handler(request: Request, exc: StarletteHTTPException):
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

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Global exception handler to catch any unhandled exceptions
    """
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "Internal server error",
            "message": "An unexpected error occurred"
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
app.include_router(uploads.router, prefix="/api/v1/uploads", tags=["Uploads"])


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
