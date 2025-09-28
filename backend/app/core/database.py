"""
Configuración de la base de datos con SQLAlchemy
"""
from sqlalchemy import create_engine
# from sqlalchemy.ext.declarative import declarative_base  # Ya no necesario
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

from app.core.config import settings

# Motor síncrono para migraciones
engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Motor asíncrono para la aplicación
async_engine = create_async_engine(
    settings.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://"),
    echo=settings.DEBUG
)
AsyncSessionLocal = async_sessionmaker(
    async_engine, 
    expire_on_commit=False
)

# Importar Base desde models
from app.models.base import Base


def get_db():
    """Dependency para obtener sesión de base de datos síncrona"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_async_db():
    """Dependency para obtener sesión de base de datos asíncrona"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
