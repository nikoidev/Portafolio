from datetime import datetime
from pydantic import BaseModel, ConfigDict


class CVResponse(BaseModel):
    """Response schema for CV info (admin only)"""
    id: int
    filename: str
    file_size: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
        # Exclude binary data from serialization
        exclude={'file_data'}
    )


class CVDeleteResponse(BaseModel):
    """Response schema for CV deletion"""
    message: str = "CV deleted successfully"
    success: bool = True

