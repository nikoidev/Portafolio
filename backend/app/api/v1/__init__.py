from fastapi import APIRouter

from app.api.v1 import auth, projects, cv, uploads

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(cv.router, prefix="/cv", tags=["cv"])
api_router.include_router(uploads.router, prefix="/uploads", tags=["uploads"])