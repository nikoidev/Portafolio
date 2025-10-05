from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.responses import Response
from sqlalchemy.orm import Session

from app.core.deps import get_db, get_current_admin_user
from app.schemas.cv import CVResponse, CVDeleteResponse
from app.services.cv_service import CVService

router = APIRouter()


# ============================================================================
# ADMIN ENDPOINTS (Authentication required)
# ============================================================================

@router.get("/", response_model=CVResponse, tags=["CV - Admin"])
async def get_current_cv(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """
    Get the current CV information (Admin only)
    
    Returns the CV metadata (filename, size, timestamps).
    Only one CV can exist in the system at any time.
    """
    cv_service = CVService(db)
    cv = cv_service.get_cv()
    
    if not cv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No CV found. Please upload a CV first."
        )
    
    return CVResponse.model_validate(cv)


@router.post("/", response_model=CVResponse, tags=["CV - Admin"], status_code=status.HTTP_201_CREATED)
async def upload_cv(
    file: UploadFile = File(..., description="PDF file to upload (max 10MB)"),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """
    Upload or replace the CV (Admin only)
    
    This endpoint will:
    - Create a new CV if none exists
    - Replace the existing CV if one already exists
    
    Only PDF files are allowed, max 10MB.
    """
    # Validate file is provided
    if not file:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No file provided"
        )
    
    # Validate file type
    if file.content_type not in ['application/pdf', 'application/x-pdf']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type: {file.content_type}. Only PDF files are allowed"
        )
    
    # Validate filename
    if not file.filename or not file.filename.lower().endswith('.pdf'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must have a .pdf extension"
        )
    
    try:
        # Read file content in chunks to avoid memory issues
        file_content = bytearray()
        max_size = 10 * 1024 * 1024  # 10MB
        chunk_size = 1024 * 1024  # 1MB chunks
        
        while True:
            chunk = await file.read(chunk_size)
            if not chunk:
                break
            
            file_content.extend(chunk)
            
            # Check size while reading to fail fast
            if len(file_content) > max_size:
                raise HTTPException(
                    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    detail="File size exceeds 10MB limit"
                )
        
        file_content = bytes(file_content)
        file_size = len(file_content)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error reading file. Please try again."
        )
    
    # Validate file is not empty
    if file_size == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File is empty"
        )
    
    # Validate it's actually a PDF by checking magic bytes
    if not file_content.startswith(b'%PDF'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid PDF file. File does not appear to be a valid PDF."
        )
    
    # Save CV
    try:
        cv_service = CVService(db)
        cv = cv_service.create_or_replace_cv(
            filename=file.filename,
            file_data=file_content,
            file_size=file_size
        )
        
        return CVResponse.model_validate(cv)
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error saving CV. Please try again."
        )


@router.delete("/", response_model=CVDeleteResponse, tags=["CV - Admin"])
async def delete_cv(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """
    Delete the current CV (Admin only)
    
    Removes the CV from the database.
    """
    cv_service = CVService(db)
    success = cv_service.delete_cv()
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No CV found to delete"
        )
    
    return CVDeleteResponse(
        message="CV deleted successfully",
        success=True
    )


# ============================================================================
# PUBLIC ENDPOINTS (No authentication required)
# ============================================================================

@router.get("/download", tags=["CV - Public"])
async def download_cv(db: Session = Depends(get_db)):
    """
    Download CV (Public - No authentication required)
    
    This endpoint allows anyone to download the CV directly.
    Returns the PDF file as a download response.
    """
    cv_service = CVService(db)
    result = cv_service.get_cv_file_data()
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="CV not available for download"
        )
    
    file_data, filename = result
    
    return Response(
        content=file_data,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Content-Length": str(len(file_data))
        }
    )


@router.get("/exists", tags=["CV - Public"])
async def check_cv_exists(db: Session = Depends(get_db)):
    """
    Check if a CV exists (Public - No authentication required)
    
    Returns a simple boolean indicating whether a CV is available.
    """
    cv_service = CVService(db)
    exists = cv_service.cv_exists()
    
    return {
        "exists": exists,
        "message": "CV is available" if exists else "No CV available"
    }

