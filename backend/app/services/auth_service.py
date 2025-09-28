"""
Servicio de autenticación
"""
from datetime import timedelta
from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, Token
from app.core.security import (
    verify_password, 
    get_password_hash, 
    create_access_token,
    create_refresh_token
)
from app.core.config import settings


class AuthService:
    """Servicio para manejo de autenticación"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """Autenticar usuario con email y contraseña"""
        user = self.db.query(User).filter(User.email == email).first()
        
        if not user:
            return None
        
        if not verify_password(password, user.hashed_password):
            return None
        
        return user
    
    def create_user(self, user_data: UserCreate) -> User:
        """Crear nuevo usuario"""
        # Verificar si el email ya existe
        existing_user = self.db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El email ya está registrado"
            )
        
        # Crear usuario
        hashed_password = get_password_hash(user_data.password)
        
        db_user = User(
            email=user_data.email,
            name=user_data.name,
            hashed_password=hashed_password,
            bio=user_data.bio,
            avatar_url=user_data.avatar_url,
            github_url=user_data.github_url,
            linkedin_url=user_data.linkedin_url,
            twitter_url=user_data.twitter_url,
            website_url=user_data.website_url,
            is_active=True,
            is_admin=True  # Por defecto admin (es un portafolio personal)
        )
        
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        
        return db_user
    
    def login(self, login_data: UserLogin) -> Token:
        """Iniciar sesión y generar tokens"""
        user = self.authenticate_user(login_data.email, login_data.password)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email o contraseña incorrectos",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Usuario inactivo"
            )
        
        # Crear tokens
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.email}, 
            expires_delta=access_token_expires
        )
        
        refresh_token = create_refresh_token(data={"sub": user.email})
        
        return Token(
            access_token=access_token,
            token_type="bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60  # en segundos
        )
    
    def get_user_by_email(self, email: str) -> Optional[User]:
        """Obtener usuario por email"""
        return self.db.query(User).filter(User.email == email).first()
    
    def create_admin_user(self) -> User:
        """Crear usuario administrador inicial"""
        admin_data = UserCreate(
            email=settings.ADMIN_EMAIL,
            name=settings.ADMIN_NAME,
            password=settings.ADMIN_PASSWORD
        )
        
        # Verificar si ya existe
        existing_admin = self.get_user_by_email(settings.ADMIN_EMAIL)
        if existing_admin:
            return existing_admin
        
        return self.create_user(admin_data)
