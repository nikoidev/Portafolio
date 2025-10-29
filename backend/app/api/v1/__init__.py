from fastapi import APIRouter

from app.api.v1 import auth, users, projects, cv, cms, settings, chatbot

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(cv.router, prefix="/cv", tags=["cv"])
api_router.include_router(cms.router, prefix="/cms", tags=["cms"])
api_router.include_router(settings.router, prefix="/settings", tags=["settings"])
api_router.include_router(chatbot.router, tags=["chatbot"])