"""
Servicio de autenticación
"""
from datetime import timedelta
from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.models.enums import UserRole, get_permissions_for_role
from app.schemas.user import UserCreate, UserLogin, Token, UserUpdate
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
            role=user_data.role,
            is_active=True,
            is_admin=user_data.role in [UserRole.SUPER_ADMIN, UserRole.ADMIN]  # Compatibilidad
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
    
    def create_super_admin(self) -> User:
        """Crear usuario super administrador inicial desde variables de entorno"""
        # Verificar si ya existe
        existing_admin = self.get_user_by_email(settings.SUPER_ADMIN_EMAIL)
        if existing_admin:
            return existing_admin
        
        # Crear super admin desde .env
        super_admin_data = UserCreate(
            email=settings.SUPER_ADMIN_EMAIL,
            name=settings.SUPER_ADMIN_NAME,
            password=settings.SUPER_ADMIN_PASSWORD,
            role=UserRole.SUPER_ADMIN
        )
        
        return self.create_user(super_admin_data)
    
    def update_user(self, user_id: int, user_update: UserUpdate) -> User:
        """Actualizar usuario"""
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuario no encontrado"
            )
        
        # Actualizar campos
        update_data = user_update.model_dump(exclude_unset=True)
        
        # Si se actualiza la contraseña, hashearla
        if "password" in update_data and update_data["password"]:
            update_data["hashed_password"] = get_password_hash(update_data["password"])
            del update_data["password"]
        
        # Actualizar is_admin si cambia el rol
        if "role" in update_data:
            update_data["is_admin"] = update_data["role"] in [UserRole.SUPER_ADMIN, UserRole.ADMIN]
        
        for field, value in update_data.items():
            setattr(user, field, value)
        
        self.db.commit()
        self.db.refresh(user)
        
        return user
    
    def delete_user(self, user_id: int) -> bool:
        """Eliminar usuario"""
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuario no encontrado"
            )
        
        # No permitir eliminar super admins
        if user.role == UserRole.SUPER_ADMIN:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No se puede eliminar un super administrador"
            )
        
        self.db.delete(user)
        self.db.commit()
        
        return True
