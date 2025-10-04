from datetime import datetime
from pydantic import BaseModel


class CVResponse(BaseModel):
    """Response schema for CV info (admin only)"""
    id: int
    filename: str
    file_size: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CVDeleteResponse(BaseModel):
    """Response schema for CV deletion"""
    message: str = "CV deleted successfully"
    success: bool = True

