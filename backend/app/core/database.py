"""
Configuración de la base de datos con SQLAlchemy
"""
from sqlalchemy import create_engine, event
from sqlalchemy.pool import Pool
# from sqlalchemy.ext.declarative import declarative_base  # Ya no necesario
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
import time
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)

# Motor síncrono para migraciones con pool configuration
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,  # Enable connection health checks
    pool_size=5,
    max_overflow=10,
    pool_recycle=3600,  # Recycle connections after 1 hour
    connect_args={
        "connect_timeout": 10,
    }
)

# Add connection retry logic
@event.listens_for(Pool, "connect")
def receive_connect(dbapi_conn, connection_record):
    """Log successful connections"""
    logger.debug("Database connection established")

@event.listens_for(Pool, "checkout")
def receive_checkout(dbapi_conn, connection_record, connection_proxy):
    """Log connection checkouts"""
    logger.debug("Connection checked out from pool")

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


def wait_for_db(max_retries: int = 30, retry_interval: int = 2) -> bool:
    """
    Wait for database to be ready with retry logic.
    
    Args:
        max_retries: Maximum number of connection attempts
        retry_interval: Seconds to wait between retries
        
    Returns:
        True if connection successful, False otherwise
    """
    from sqlalchemy import text
    
    for attempt in range(max_retries):
        try:
            logger.info(f"Attempting to connect to database (attempt {attempt + 1}/{max_retries})...")
            with engine.connect() as conn:
                # Simple query to test connection
                conn.execute(text("SELECT 1"))
                logger.info("✓ Database connection successful!")
                return True
        except Exception as e:
            if attempt < max_retries - 1:
                logger.warning(f"Database not ready yet: {str(e)}")
                logger.info(f"Retrying in {retry_interval} seconds...")
                time.sleep(retry_interval)
            else:
                logger.error(f"Failed to connect to database after {max_retries} attempts: {str(e)}")
                return False
    return False


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
