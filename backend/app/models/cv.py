from sqlalchemy import Column, Integer, String, DateTime, LargeBinary
from sqlalchemy.sql import func
from app.models.base import Base


class CV(Base):
    """
    CV Model - Stores a single CV file
    Only one CV can exist in the system at a time
    """
    __tablename__ = "cv"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    file_data = Column(LargeBinary, nullable=False, comment="PDF file stored as binary")
    file_size = Column(Integer, nullable=False, comment="File size in bytes")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

