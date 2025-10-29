"""
Configuración de la aplicación usando Pydantic Settings
"""
from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import validator
import os


class Settings(BaseSettings):
    """Configuración de la aplicación"""
    
    # Database
    DATABASE_URL: str = "postgresql://portfolio_user:portfolio_pass@localhost:5440/portfolio_db"
    
    # Security
    SECRET_KEY: str = "your-super-secret-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 horas
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # CORS
    ALLOWED_HOSTS: List[str] = ["localhost", "127.0.0.1", "0.0.0.0"]
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    # File Upload
    MAX_FILE_SIZE: int = 10485760  # 10MB
    UPLOAD_DIR: str = "uploads"
    
    # Email (opcional)
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    
    # Super Admin User (primer usuario del sistema)
    SUPER_ADMIN_EMAIL: str = "admin@portfolio.com"
    SUPER_ADMIN_PASSWORD: str = "changeme123"  # CAMBIAR EN PRODUCCIÓN
    SUPER_ADMIN_NAME: str = "Super Admin"
    
    # Chatbot Configuration
    GOOGLE_API_KEY: str = ""
    CHATBOT_NAME: str = "NikoiDev"
    CHATBOT_RATE_LIMIT: int = 10  # messages per window
    CHATBOT_RATE_WINDOW: int = 300  # 5 minutes in seconds
    CHATBOT_MAX_HISTORY: int = 10  # max messages to keep in context
    
    # Mantener compatibilidad con variables antiguas (deprecated)
    ADMIN_EMAIL: Optional[str] = None
    ADMIN_PASSWORD: Optional[str] = None  
    ADMIN_NAME: Optional[str] = None
    
    @validator('SUPER_ADMIN_EMAIL', pre=True, always=True)
    def set_super_admin_email(cls, v, values):
        """Usar ADMIN_EMAIL si SUPER_ADMIN_EMAIL no está definido (compatibilidad)"""
        if v == "admin@portfolio.com" and values.get('ADMIN_EMAIL'):
            return values.get('ADMIN_EMAIL')
        return v
    
    @validator('SUPER_ADMIN_PASSWORD', pre=True, always=True)
    def set_super_admin_password(cls, v, values):
        """Usar ADMIN_PASSWORD si SUPER_ADMIN_PASSWORD no está definido (compatibilidad)"""
        if v == "changeme123" and values.get('ADMIN_PASSWORD'):
            return values.get('ADMIN_PASSWORD')
        return v
    
    @validator('SUPER_ADMIN_NAME', pre=True, always=True)
    def set_super_admin_name(cls, v, values):
        """Usar ADMIN_NAME si SUPER_ADMIN_NAME no está definido (compatibilidad)"""
        if v == "Super Admin" and values.get('ADMIN_NAME'):
            return values.get('ADMIN_NAME')
        return v
    
    @validator('ALLOWED_ORIGINS', pre=True)
    def parse_cors_origins(cls, v):
        """Parsear orígenes CORS desde string o lista"""
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v
    
    @validator('ALLOWED_HOSTS', pre=True)
    def parse_allowed_hosts(cls, v):
        """Parsear hosts permitidos desde string o lista"""
        if isinstance(v, str):
            return [host.strip() for host in v.split(",")]
        return v
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Instancia global de configuración
settings = Settings()
