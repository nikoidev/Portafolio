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


@router.post("/", response_model=CVResponse, tags=["CV - Admin"])
async def upload_cv(
    file: UploadFile = File(...),
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
    try:
        # Validate file type
        if file.content_type != 'application/pdf':
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only PDF files are allowed"
            )
        
        # Read file content
        file_content = await file.read()
        file_size = len(file_content)
    except Exception as e:
        # Prevent binary data from being serialized in error responses
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error processing file: {str(e)[:100]}"  # Limit error message length
        )
    
    # Validate file size (10MB)
    max_size = 10 * 1024 * 1024
    if file_size > max_size:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File size exceeds 10MB limit"
        )
    
    # Validate file is not empty
    if file_size == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File is empty"
        )
    
    # Save CV
    cv_service = CVService(db)
    cv = cv_service.create_or_replace_cv(
        filename=file.filename or "CV.pdf",
        file_data=file_content,
        file_size=file_size
    )
    
    return CVResponse.model_validate(cv)


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

