"""
Endpoints de autenticación
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_active_user, get_current_admin_user
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token
from app.services.auth_service import AuthService

router = APIRouter()


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: Session = Depends(get_db)
):
    """Iniciar sesión"""
    auth_service = AuthService(db)
    
    login_data = UserLogin(email=form_data.username, password=form_data.password)
    token = auth_service.login(login_data)
    
    return token


@router.post("/register", response_model=UserResponse)
async def register(
    user_data: UserCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)  # Solo admin puede crear usuarios
):
    """Registrar nuevo usuario (solo admin)"""
    auth_service = AuthService(db)
    user = auth_service.create_user(user_data)
    
    return UserResponse.model_validate(user)


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user = Depends(get_current_active_user)
):
    """Obtener información del usuario actual"""
    return UserResponse.model_validate(current_user)


@router.post("/create-admin", response_model=UserResponse)
async def create_admin_user(db: Session = Depends(get_db)):
    """Crear usuario administrador inicial (solo si no existe)"""
    from app.models.user import User
    
    auth_service = AuthService(db)
    
    try:
        admin_user = auth_service.create_admin_user()
        return UserResponse.model_validate(admin_user)
    except HTTPException as e:
        if "ya está registrado" in str(e.detail):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El usuario administrador ya existe"
            )
        raise e


@router.post("/refresh", response_model=Token)
async def refresh_token(
    current_user = Depends(get_current_active_user)
):
    """Refrescar token de acceso"""
    from app.core.security import create_access_token
    from datetime import timedelta
    from app.core.config import settings
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": current_user.email}, 
        expires_delta=access_token_expires
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )
