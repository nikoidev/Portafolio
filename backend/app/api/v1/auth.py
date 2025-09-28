"""
Endpoints de autenticación
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.database import get_db

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Endpoint para iniciar sesión"""
    # TODO: Implementar lógica de autenticación
    return {"access_token": "fake-token", "token_type": "bearer"}


@router.post("/register")
async def register(db: Session = Depends(get_db)):
    """Endpoint para registro de usuarios (solo admin)"""
    # TODO: Implementar registro
    return {"message": "User registered successfully"}


@router.get("/me")
async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Obtener información del usuario actual"""
    # TODO: Implementar obtención de usuario actual
    return {"user": "current_user_info"}
